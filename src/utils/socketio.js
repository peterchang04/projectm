import io from 'socket.io-client';
import { cookie } from 'cookie_js';
cookie.expiresMultiplier = 60 * 60 * 24; // default expiration is by day. set to hour
let serverUrl = process.env.VUE_APP_APIROOT || process.env.VUE_APP_APIROOT_DEFAULT;
// use the window obj to persist socket through hot reloads
if (!window.socket) {
  window.socket = io(serverUrl, { path: '/io' });
}

const dataChannelOptions = {
  ordered: false, //no guaranteed delivery, unreliable but faster
  maxRetransmitTime: 1000, //milliseconds
};

window.socket.on('message', (message) => {
  console.log(message);
  if (messageHandlers[message.type]) {
    messageHandlers[message.type](message);
  }
});

const socketObj = {
  // properties of this socketObj
  socket: null,
  identifier: null,
  room: null,
  peers: { /* by identifier */ },
  // functions
  connect: function() {
    this.socket = window.socket;
    return new Promise((resolve, reject) => {
      const room = cookie.get('room');
      const identifier = cookie.get('identifier');

      // send handshake req to server, the room this socket should be in, as well as the identifier to persist
      socket.send({
        type: 'handshake-client',
        room: cookie.get('room'),
        preferredIdentifier: cookie.get('identifier')
      });

      // put a limit on this handshake
      const handshakeTimeout = setTimeout(() => {
        reject(new Error('Handshake request timed out'));
      }, 4000);

      // wait for handler to resolve handshake via this callback
      this.acknowledgeHandshake = (message) => {
        // prep the socketObj for being passed back to original caller
        this.iceServers = message.iceServers;
        this.identifier = message.identifier;
        this.socketId = message.socketId;
        this.room = message.room;

        // persist some data in cookie
        cookie.set(
          {
            identifier: this.identifier,
            room: this.room
          }, {
            expires: 120 /* 5 days */
          }
        );

        clearTimeout(handshakeTimeout); // cancel setTimeout directly above this.
        resolve(socketObj); // return the whole socketObj object
      };
    });
  },
  addPeer: function(identifier) {
    sendTestLoop(identifier); // for testing data channel
    if (this.peers[identifier]) return this.peers[identifier];

    const peer = { identifier };
    this.peers[identifier] = peer;
    // set peerConnection + events
    peer.pc = new RTCPeerConnection({ iceServers: this.iceServers });
    peer.pc.onnegotiationneeded = (event) => onnegotiationneeded(event, this.peers[identifier]);
    // datachannel from other side
    peer.pc.ondatachannel = function(event) {
      peer.dc = event.channel;
      peer.dc.onmessage = (event) => {
        console.log('datachannel message', event.data);
      };
    };
    peer.pc.onicecandidate = (event) => onicecandidate(event, this.peers[identifier]);
    // set dataChannel + events
    peer.dc = this.peers[identifier].pc.createDataChannel('data', dataChannelOptions);
    peer.dc.onmessage = (event) => {
      console.log('datachannel message', event.data);
    };
    peer.dc.onopen = () => {
      peer.dcIsOpen = true;
    };
    // store candidates received via socketio prior to setRemoteDescription here
    peer.queuedCandidates = [];
    peer.gotRemoteDescription = function() {
      this.hasRemoteDescription = true;
      this.addQueuedIceCandidates();
    };
    peer.addQueuedIceCandidates = async function() {
      for (var i = this.queuedCandidates.length - 1; i >= 0; i--) {
        const candidate = this.queuedCandidates.pop();
        await this.pc.addIceCandidate(candidate);
      }
    };
    return peer;
  },
  sendOffer: async function(recipientIdentifier) {
    const peer = this.addPeer(recipientIdentifier);

    // initialize local description
    const offer = await peer.pc.createOffer();
    await peer.pc.setLocalDescription(offer);

    this.socket.send({
      type: 'offer-relay',
      senderIdentifier: this.identifier,
      recipientIdentifier,
      desc: peer.pc.localDescription
    });
  }
};

const messageHandlers = {
  "handshake-server": (message) => {
    if (socketObj.acknowledgeHandshake) {
      socketObj.acknowledgeHandshake(message);
    }
  },
  offer: async (message) => { // someone wants to connect
    const peer = socketObj.addPeer(message.senderIdentifier); // multi-run safe
    await peer.pc.setRemoteDescription(new RTCSessionDescription(message.desc));
    peer.gotRemoteDescription();
    await peer.pc.setLocalDescription(await peer.pc.createAnswer());

    socketObj.socket.send({
      type: 'answer-relay',
      senderIdentifier: socketObj.identifier,
      recipientIdentifier: message.senderIdentifier,
      desc: peer.pc.localDescription
    });
  },
  answer: async (message) => { // someone responding to my connect offer
    const peer = socketObj.addPeer(message.senderIdentifier);
    if (peer) {
      await peer.pc.setRemoteDescription(message.desc);
      peer.gotRemoteDescription();
      // candidates may arrive before set
    } else {
      console.warn('no such candidate peer connection', message.senderIdentifier);
    }
  },
  candidate: async (message) => { // adding candidate from other end
    // addPeer, in case this gets handled b4 offer
    const peer = socketObj.addPeer(message.senderIdentifier); // multi-run safe
    if (peer.hasRemoteDescription) {
      await peer.pc.addIceCandidate(message.candidate);
    } else {
      // can't add candidate to a pc w/o remote description. queue these up for later
      peer.queuedCandidates.push(message.candidate);
    }
  }
};

function sendTestLoop(targetIdentifier) {
  if (socketObj.peers[targetIdentifier] && socketObj.peers[targetIdentifier].dcIsOpen) {
    const message = `loopmsg from ${socketObj.identifier} ${new Date()}`;
    socketObj.peers[targetIdentifier].dc.send(message);
  }
  setTimeout(() => {
    sendTestLoop(targetIdentifier);
  }, 2000);
};

// standard peer connection handlers
async function onnegotiationneeded (event, peer) {
  console.log('onnegotiationneeded triggered', event, peer);
  console.log(peer.pc);
  await peer.pc.setLocalDescription(await peer.pc.createOffer());
  socketObj.socket.send({
    type: 'offer-relay',
    senderIdentifier: socketObj.identifier,
    recipientIdentifier: peer.identifier,
    desc: peer.pc.localDescription
  });
}

function onicecandidate({ candidate }, peer) {
  console.log('onicecandidate triggered', candidate, peer);
  if (!candidate) return;
  socketObj.socket.send({
    type: 'candidate-relay',
    senderIdentifier: socketObj.identifier,
    recipientIdentifier: peer.identifier,
    candidate
  });
}

export default socketObj;

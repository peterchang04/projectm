import io from 'socket.io-client';
import { cookie } from 'cookie_js';
cookie.expiresMultiplier = 60 * 60; // default expiration is by day. set to minutes
let serverUrl = 'http://localhost:51337?';
let socket = io(serverUrl, { path: '/io' });
const dataChannelOptions = {
  ordered: false, //no guaranteed delivery, unreliable but faster
  maxRetransmitTime: 1000, //milliseconds
};

socket.on('message', (message) => {
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
    this.socket = socket;
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
        this.room = message.room;

        // persist some data in cookie
        // cache for 2 hrs
        cookie.set({
          identifier: this.identifier,
          room: this.room
        }, {
          expires: 120 /* minutes */
        });

        clearTimeout(handshakeTimeout); // cancel setTimeout directly above this.
        resolve(socketObj); // return the whole socketObj object
      };
    });
  },
  addPeer: function(identifier) {
    sendLoop(identifier); // for testing data channel
    if (this.peers[identifier]) {
      console.log(`peer [${identifier}] already exists`);
      return this.peers[identifier];
    }
    const peer = { identifier, socketId: null };
    this.peers[identifier] = peer;
    // set peerConnection + events
    peer.pc = new RTCPeerConnection({ iceServers: this.iceServers });
    peer.pc.onnegotiationneeded = (event) => onnegotiationneeded(event, this.peers[identifier]);
    peer.pc.ondatachannel = function(event) {
      console.log(event);
      console.log('data channel received');
      peer.dc = event.channel;
      peer.dc.onmessage = (event) => {
        console.log('datachannel message', event.data);
      };
    };
    peer.pc.onicecandidate = (event) => onicecandidate(event, this.peers[identifier]);
    // set dataChannel + events
    peer.dc = this.peers[identifier].pc.createDataChannel('xxx', dataChannelOptions);
    peer.dc.onmessage = (event) => {
      console.log('datachannel message', event.data);
    };
    peer.dc.onopen = () => {
      peer.dcIsOpen = true;
      console.log('dc opened');
      peer.dc.send('Hello World!!');
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
      senderSocketId: this.socket.id,
      recipientIdentifier,
      recipientSocketId: peer.socketId, // probably null, unless re-negotiating
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
    console.log('incoming offer', message);
    const peer = socketObj.addPeer(message.senderIdentifier); // multi-run safe
    const desc = new RTCSessionDescription(message.desc);
    await peer.pc.setRemoteDescription(desc);
    peer.gotRemoteDescription();
    const answer = await peer.pc.createAnswer();
    await peer.pc.setLocalDescription(answer);

    socketObj.socket.send({
      type: 'answer-relay',
      senderIdentifier: socketObj.identifier,
      senderSocketId: socketObj.socket.id,
      recipientIdentifier: message.senderIdentifier,
      recipientSocketId: message.senderSocketId,
      desc: peer.pc.localDescription
    });
  },
  answer: async (message) => { // someone responding to my connect offer
    console.log(message);
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
    console.log('candidate received', message);
    if (peer.hasRemoteDescription) {
      await peer.pc.addIceCandidate(message.candidate);
    } else {
      // can't add candidate to a pc w/o remote description. queue these up for later
      peer.queuedCandidates.push(message.candidate);
    }
  }
};

function sendLoop(targetIdentifier) {
  if (socketObj.peers[targetIdentifier] && socketObj.peers[targetIdentifier].dcIsOpen) {
    const message = `loopmsg from ${socketObj.identifier} ${new Date()}`;
    socketObj.peers[targetIdentifier].dc.send(message);
  }
  setTimeout(() => {
    sendLoop(targetIdentifier);
  }, 2000);
};

// standard peer connection handlers
async function onnegotiationneeded (event, peer) {
  return;
  console.log('onnegotiationneeded triggered', event, peer);
  try {
    await pc.setLocalDescription(await pc.createOffer());
    socketObj.socket.send({
      type: 'offer-relay',
      senderIdentifier,
      recipientIdentifier,
      desc: pc.localDescription
    });
  } catch (err) {
    console.error(err);
  }
}

function onicecandidate({ candidate }, peer) {
  console.log('onicecandidate triggered', candidate, peer);
  if (!candidate) return;
  socketObj.socket.send({
    type: 'candidate-relay',
    senderIdentifier: socketObj.identifier,
    senderSocketId: socketObj.socket.id,
    recipientIdentifier: peer.identifier,
    recipientSocketId: peer.socketId,
    candidate
  });
}

export default socketObj;

const enabled = false;
// maintain an open connection to socketio server
// socketio connection is used by webRTC to coordinate peer connections
import io from 'socket.io-client';
import { cookie } from 'cookie_js';
import state from './state';
cookie.expiresMultiplier = 60 * 60 * 24; // default expiration is by day. set to hour
let serverUrl = process.env.VUE_APP_APIROOT || process.env.VUE_APP_APIROOT_DEFAULT;

// use the window obj to persist socket through hot reloads (development)
if (!window.socket && enabled) {
  window.socket = io(serverUrl, { path: '/io', reconnectionAttempts: 5 });
}

function init() {
  state.set('socketStatus', -1); // unconnected
  if (!enabled) return;
  setupEvents();
  connect();
}

function setupEvents() {
  window.socket.on('message', (message) => {
    console.log(new Date().getTime() - 1544232100000, 'message received', message);
    if (messageHandlers[message.type]) {
      messageHandlers[message.type](message);
    }
  });

  window.socket.on('connect_error', () => {
    state.set('socketStatus', -2); // unconnected
    console.log('connect failed @ ', new Date());
  });

  window.socket.on('reconnect', () => {
    state.set('socketStatus', 1); // connected
  })

  window.socket.on('reconnect_failed', () => {
    state.set('socketStatus', -2); // failed
    console.log('reconnect failed (lost connection) @ ', new Date());
  });
}

function connect() {
  state.set('socketStatus', 0); // connecting

  // send handshake req to server, the room this socket should be in, as well as the identifier to persist
  window.socket.send({
    type: 'handshake-client',
    room: cookie.get('room'),
    preferredIdentifier: cookie.get('identifier')
  });
}

function send(message) {
  if (typeof message !== 'object' || Array.isArray(message)) throw new Error('message must be object {}');
  if (!('type' in message)) throw new Error('message must have key: type { type: something }');
  if (state.get('socketStatus') !== 1) throw new Error('no socket.io connection');
  console.log(new Date().getTime() - 1544232100000, 'socket send', message);
  window.socket.send(message);
}

function on(type, handler) {
  // adds to handlers // multi-run safe
  messageHandlers[type] = handler;
}

const socketObj = {
  // addPeer: function(identifier) {
  //   sendTestLoop(identifier); // for testing data channel
  //   if (this.peers[identifier]) return this.peers[identifier];
  //
  //   const peer = { identifier };
  //   this.peers[identifier] = peer;
  //   // set peerConnection + events
  //   peer.pc = new RTCPeerConnection({ iceServers: this.iceServers });
  //   peer.pc.onnegotiationneeded = (event) => onnegotiationneeded(event, this.peers[identifier]);
  //   peer.pc.onicecandidate = (event) => onicecandidate(event, this.peers[identifier]);
  //
  //   // datachannel from other side
  //   peer.pc.ondatachannel = function(event) {
  //     peer.dc = event.channel;
  //     peer.dc.onmessage = (event) => {
  //       console.log('datachannel message1', event.data);
  //     };
  //   };
  //   // set dataChannel + events
  //   peer.dc = this.peers[identifier].pc.createDataChannel('data', {
  //     ordered: false, //no guaranteed delivery, unreliable but faster
  //     maxPacketLifeTime: 1000, //milliseconds
  //   });
  //
  //   peer.dc.onmessage = (event) => {
  //     console.log('datachannel message2', event.data);
  //   };
  //   peer.dc.onopen = () => {
  //     peer.dcIsOpen = true;
  //   };
  //   // store candidates received via socketio prior to setRemoteDescription here
  //   peer.queuedCandidates = [];
  //   peer.gotRemoteDescription = function() {
  //     this.hasRemoteDescription = true;
  //     this.addQueuedIceCandidates();
  //   };
  //   peer.addQueuedIceCandidates = async function() {
  //     for (var i = this.queuedCandidates.length - 1; i >= 0; i--) {
  //       const candidate = this.queuedCandidates.pop();
  //       await this.pc.addIceCandidate(candidate);
  //     }
  //   };
  //   return peer;
  // },
  // checkPeer: async function(recipientIdentifier) {
  //   this.socket.send({
  //     type: 'check-peer',
  //     senderIdentifier: this.identifier,
  //     recipientIdentifier
  //   });
  // },
  // sendOffer: async function(recipientIdentifier) {
  //   console.log('send offer', recipientIdentifier);
  //   const peer = this.addPeer(recipientIdentifier);
  //
  //   // initialize local description
  //   const offer = await peer.pc.createOffer();
  //   await peer.pc.setLocalDescription(offer);
  //   return;
  //   this.socket.send({
  //     type: 'offer-relay',
  //     senderIdentifier: this.identifier,
  //     recipientIdentifier,
  //     desc: peer.pc.localDescription
  //   });
  // }
};

const messageHandlers = {
  "handshake-server": (message) => {
    state.set('iceServers', message.iceServers);
    state.set('identifier', message.identifier);
    state.set('socketId', message.socketId);
    state.set('room', message.room);
    state.set('socketStatus', 1);

    console.log("socketio connection established @ ", new Date());

    // persist some data in cookie
    cookie.set({
      identifier: message.identifier,
      room: message.room
    }, {
      expires: 120 /* 5 days */
    });
  },
  // "check-peer-success": async (message) => {
  //   socketObj.sendOffer(message.recipientIdentifier);
  // },
  // offer: async (message) => { // someone wants to connect
  //   const peer = socketObj.addPeer(message.senderIdentifier); // multi-run safe
  //   await peer.pc.setRemoteDescription(new RTCSessionDescription(message.desc));
  //   peer.gotRemoteDescription();
  //   await peer.pc.setLocalDescription(await peer.pc.createAnswer());
  //
  //   socketObj.socket.send({
  //     type: 'answer-relay',
  //     senderIdentifier: socketObj.identifier,
  //     recipientIdentifier: message.senderIdentifier,
  //     desc: peer.pc.localDescription
  //   });
  // },
  // answer: async (message) => { // someone responding to my connect offer
  //   const peer = socketObj.addPeer(message.senderIdentifier);
  //   if (peer) {
  //     await peer.pc.setRemoteDescription(message.desc);
  //     peer.gotRemoteDescription();
  //     // candidates may arrive before set
  //   } else {
  //     console.warn('no such candidate peer connection', message.senderIdentifier);
  //   }
  // },
  // candidate: async (message) => { // adding candidate from other end
  //   // addPeer, in case this gets handled b4 offer
  //   const peer = socketObj.addPeer(message.senderIdentifier); // multi-run safe
  //   if (peer.hasRemoteDescription) {
  //     await peer.pc.addIceCandidate(message.candidate);
  //   } else {
  //     // can't add candidate to a pc w/o remote description. queue these up for later
  //     peer.queuedCandidates.push(message.candidate);
  //   }
  // }
};

// standard peer connection handlers
// async function onnegotiationneeded (event, peer) {
//   // not sure what this accomplishes. below implementation is correct but disabling for now
//   console.log('onnegotiationneeded triggered', event, peer);
//   await peer.pc.setLocalDescription(await peer.pc.createOffer());
//   socketObj.socket.send({
//     type: 'offer-relay',
//     senderIdentifier: socketObj.identifier,
//     recipientIdentifier: peer.identifier,
//     desc: peer.pc.localDescription
//   });
// }

// function onicecandidate({ candidate }, peer) {
//   if (!candidate) return;
//   console.log('onicecandidate triggered', candidate, peer);
//
//   socketObj.socket.send({
//     type: 'candidate-relay',
//     senderIdentifier: socketObj.identifier,
//     recipientIdentifier: peer.identifier,
//     candidate
//   });
// }

export default { init, send, on };

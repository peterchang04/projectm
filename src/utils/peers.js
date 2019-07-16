import socket from './socketio';
import state from './state';

let peers = null;

function init() {
  peers = {};
  // start listening for stuff
  socket.on('offer', async (message) => { // offer from another browser
    // console.log('setupPeer from offer');
    const peer = setupPeer(message.senderIdentifier);
    // console.log('setRemoteDescription', 11);
    await peer.pc.setRemoteDescription(new RTCSessionDescription(message.desc));
    peer.gotRemoteDescription();
    await peer.pc.setLocalDescription(await peer.pc.createAnswer());
    // send answer via socketio server relay
    socket.send({
      type: 'answer-relay',
      senderIdentifier: state.get('identifier'),
      recipientIdentifier: message.senderIdentifier,
      desc: peer.pc.localDescription
    });
  });

  // now trade candidates with the recipient browser
  socket.on('candidate', async (message) => {
    // addPeer, in case this gets handled b4 offer
    // console.log('setupPeer from candidate');
    const peer = setupPeer(message.senderIdentifier); // multi-run safe
    if (peer.hasRemoteDescription) {
      await peer.pc.addIceCandidate(message.candidate);
    } else {
      // can't add candidate to a pc w/o remote description. queue these up for later
      peer.queuedCandidates.push(message.candidate);
    }
  });
}

function tryAdd(identifier) {
  if (!state.get('identifier')) throw new Error('no local identifier');

  socket.send({
    type: 'check-peer',
    senderIdentifier: state.get('identifier'),
    recipientIdentifier: identifier
  });
  socket.on('check-peer-fail', (message) => {
    console.log('no such peer', identifier);
  });
  socket.on('check-peer-success', async (message) => {
    // peer confirmed, send the offer to kick off webRTC
    console.log('setupPeer from check-peer-success');
    const peer = setupPeer(identifier);
    const offer = await peer.pc.createOffer();
    // console.log('check-peer-success set local');
    await peer.pc.setLocalDescription(offer);
    // console.log('check-peer-success set local done');
    // use socketio server to relay offer to recipient
    socket.send({
      type: 'offer-relay',
      senderIdentifier: state.get('identifier'),
      recipientIdentifier: identifier,
      desc: peer.pc.localDescription
    });
  });
  // the recipient will respond via socketio with answer
  socket.on('answer', async (message) => {
    const peer = setupPeer(message.senderIdentifier);
    // console.log('setRemoteDescription', 65);
    await peer.pc.setRemoteDescription(message.desc);
    peer.gotRemoteDescription();
  });
}

function setupPeer(identifier) {  // create, and store PeerConnection + all relevant events
  // console.log('setupPeer called', identifier, Boolean(peers[identifier]));
  if (peers[identifier]) return peers[identifier];
  if (!state.get('iceServers')) throw new Error('no iceServers found'); // iceServers setup by socket.io handshake
  const peer = { identifier };
  peers[identifier] = peer;
  // setup peerConnection + events
  peer.pc = new RTCPeerConnection({ iceServers: state.get('iceServers') });
  // setup dataChannel + events
  peer.dc = peer.pc.createDataChannel('data', {
    ordered: false, // no guaranteed delivery, unreliable order by faster
    maxPacketLifeTime: 1000 // milliseconds
  });
  peer.dc.onmessage = (event) => {
    console.log('datachannel message2', event.data);
  };
  peer.dc.onopen = () => {
    console.log('dc.onopen');
    peer.dcIsOpen = true;
  }

  peer.pc.onicecandidate = ({ candidate }) => {
    if (!candidate) return;
    // console.log('onicecandidate triggered', candidate, peer);
    socket.send({
      type: 'candidate-relay',
      senderIdentifier: state.get('identifier'),
      recipientIdentifier: peer.identifier,
      candidate
    });
  };
  peer.pc.onnegotiationneeded = async (event) => {
    return; // not sure what onnegotiation accomplishes. below implementation is correct but disabling for now
    console.log('onnegotiationneeded triggered', event, peer);
    await peer.pc.setLocalDescription(await peer.pc.createOffer());
    socket.send({
      type: 'offer-relay',
      senderIdentifier: state.get('identifier'),
      recipientIdentifier: peer.identifier,
      desc: peer.pc.localDescription
    });
  };

  // datachannel from other side - (not sure if necessary)
  peer.pc.ondatachannel = function(event) {
    console.log('GOT DATACHANNEL');
    peer.dc = event.channel;
    peer.dc.onmessage = (event) => {
      console.log('datachannel message1', event.data);
    };
  };

  sendTestLoop(identifier);
  // store candidates received via socketio prior to setRemoteDescription here
  peer.queuedCandidates = [];
  peer.gotRemoteDescription = () => {
    if (peer.hasRemoteDescription) return;
    console.log('gotRemoteDescription', peer.hasRemoteDescription);
    peer.hasRemoteDescription = true;
    peer.addQueuedIceCandidates();
  };
  peer.addQueuedIceCandidates = async function() {
    for (var i = peer.queuedCandidates.length - 1; i >= 0; i--) {
      const candidate = peer.queuedCandidates.pop();
      await peer.pc.addIceCandidate(candidate);
    }
    console.log(peer.queuedCandidates);
  };
  return peer;
}

function sendTestLoop(identifier) {
  // console.log('testloop');
  const peer = peers[identifier];
  if (peer && peer.dcIsOpen && peer.dc.readyState === 'open') {
    const message = `loopmsg from ${state.get('identifier')} ${new Date()}`;
    peer.dc.send(message);
  }
  setTimeout(() => {
    sendTestLoop(identifier);
  }, 2000);
};

export default { init, tryAdd };

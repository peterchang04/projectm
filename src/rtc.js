function init() {
  const pc = new RTCPeerConnection();
  // const dc = pc.createDataChannel('testDataChannel');

  pc.createOffer(
    function(offer) {
      pc.setLocalDescription(offer);
      console.log(offer.sdp); // eslint-disable-line
    },
    function(err) {
      console.log(err); // eslint-disable-line
    }
  );
  pc.onicecandidate = function(event) {
    if (!event.candidate) console.log(pc.localDescription.sdp); // eslint-disable-line
  }
}

export { init };

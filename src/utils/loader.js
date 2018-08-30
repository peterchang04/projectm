import { cookie } from 'cookie_js';
import api from './api';
import date from './date';
import socket from './socketio';
cookie.expiresMultiplier = 60 * 60; // default expiration is by day. set to minutes

let mySocket = null;

function init(cb) {
  const p =  new Promise(async (resolve, reject) => {
    try {
      // 1 - establish socket.io connection + send identifier cookie
      mySocket = await socket.connect();

      resolve(mySocket);
    } catch (e) {
      reject(e);
    }
  }).then((socket) => {
    cb(socket);
  }).catch((e) => {
    console.log('loader init promise catch', e);
  });;
}

export default { init };

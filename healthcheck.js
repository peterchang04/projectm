// Dockerfile healthcheck hits this file to check server. Alpine image has no curl
const http = require('http');

const options = {
  host: 'localhost',
  port: '80',
  timeout: 2000
};

const request = http.request(options, (res) => {
  console.log(`HEALTHCHECK STATUS: ${res.statusCode}`);
  if (res.statusCode == 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', function(err) => {
  console.log('HEALTHCHECK ERROR');
  process.exit(1);
});

request.end();

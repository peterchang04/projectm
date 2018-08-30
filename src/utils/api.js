import axios from 'axios';

const apiRoot = 'http://localhost:51337';

async function get(path) {
  const response = await axios.get(`${apiRoot}${path}`);
  if (`${response.status}`.charAt(0) !== '2') {
    throw new Error('oops...');
  }
  return response.data.data;
}

export default { get };

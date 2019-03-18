// cache randoms to speed up random generator
const randomSets = { 10: [], 100: [], 1000: [], 2000: [] };
const setSize = 500;
let iterator = rand(setSize);
// seed with 1000 randoms
for (let i = 0; i < setSize; i++) {
  Object.keys(randomSets).forEach((set) => {
    randomSets[set].push(rand(set));
  });
}

function get(outOf = 100) {
  iterator++;
  if (iterator === (setSize - 1)) {
    iterator = 0; // start over. don't worry we started random
  }
  return randomSets[outOf][iterator];
}

function rand(n) {
  return Math.floor(Math.random() * n);
}

export default { get };

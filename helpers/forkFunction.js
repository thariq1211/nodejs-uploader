const cluster = require("cluster");
const numCpus = require("os").cpus().length;

const forkingProcces = (func = () => {}) => {
  if (cluster.isMaster) {
    for (let i = 0; i < numCpus; i += 1) {
      cluster.fork();
    }
  } else {
    func();
  }
};

module.exports = forkingProcces;

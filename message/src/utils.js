const debug = require("debug")("util");
const sendMessage = require("./controllers/sendMessage");

function cleanClone(document) {
  const copy = Object.assign({}, document._doc);
  delete copy._id;
  delete copy.__v;
  return copy;
}

function getHostName(req, res) {
  let os = require("os");
  let hostname = os.hostname();
  debug("Health Check 200");
  res.send(hostname);
}

function reEnqueueSend(job) {
  sendMessage(job)
}

function getApiVersion(req, res) {
  res.send("service-v1");
}

module.exports = {
  cleanClone,
  getHostName,
  reEnqueueSend
};

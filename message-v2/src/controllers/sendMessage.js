const http = require("http");
const saveMessage = require("../clients/saveMessage");
const debugError = require("debug")("message:error");
const debugTimeout = require("debug")("message:timeout");
const random = n => Math.floor(Math.random() * Math.floor(n));

module.exports = function(msgData, done) {
  const entireMsg = msgData;
  const body = JSON.stringify(msgData.job);
  msgData.isThereBalance
  if (msgData.isThereBalance) {
    const postOptions = {
      // host: "exercise6_messageapp_1",
      host: "messageapp",
      // host: "localhost",
      port: 3000,
      path: "/message",
      method: "post",
      json: true,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    };

    let postReq = http.request(postOptions);

    postReq.on("response", postRes => {
      if (postRes.statusCode === 200) {
        saveMessage(
          {
            destination: entireMsg.job.destination,
            body: entireMsg.job.body,
            uuid: entireMsg.job.uuid,
            status: "OK"
          },
          function(_result, error) {
            if (error) {
              debugError(error);
            } else {
              console.log(postRes.body);
            }
          }
        );
      } else {
        debugError("Error while sending message");
        saveMessage(
          {
            destination: entireMsg.job.destination,
            body: entireMsg.job.body,
            uuid: entireMsg.job.uuid,
            status: "ERROR"
          },
          () => {
            debugError("Internal server error: SERVICE ERROR");
          }
        );
      }
    });

    postReq.setTimeout(random(6000));

    postReq.on("timeout", () => {
      debugTimeout("Timeout Exceeded!");
      postReq.abort();

      saveMessage(
        {
          destination: entireMsg.job.destination,
          body: entireMsg.job.body,
          uuid: entireMsg.job.uuid,
          status: "TIMEOUT"
        },
        () => {
          debugTimeout("Internal server error: TIMEOUT");
        }
      );
    });

    postReq.on("error", err => {
      console.log(err, "<== error detected here");
    });

    postReq.write(body);
    postReq.end();
  } else {
    debugError("No credit error");
  }
};

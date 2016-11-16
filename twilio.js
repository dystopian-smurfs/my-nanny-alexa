var creds = require('./config/twilio');
var twilio = require('twilio')(creds.SID, creds.Token);

var twilioHandler = function(name) {
  twilio.sendMessage({
    to: '+19173925602',
    from: '+14152001765',
    body: name + ' arrived home safe and sound!'
  }, function(err, resData) {
    if (!err) {
      console.log(resData.body + ' sent!');
    } else {
    	console.log('twilio error: ', err);
    }
  })
};

module.exports = twilioHandler;
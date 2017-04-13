'use strict';
var rp = require('request-promise');
var textSMS = require('../ext/twilio');
var helpers = require('../modules/helpers');
var api = require('../modules/api');
var Promise = require('bluebird');

var registerIntentHandlers = function(app) {

  app.prototype.intentHandlers = {

    CheckInIntent: function (intent, session, res) {
      var childName = intent.slots.FIRSTNAME.value;
      
      rp.get(api.getUser(session.user.accessToken).uri)
      .then(function(user) {
        user = JSON.parse(user);
        
        var child = helpers.getUsersChild(user, childName); 
        if (child === undefined) {
          return res.tell(childName + ', is not a recognized child, please try again');
        }

        var speechOutput = 'Welcome home, ' + child.name + '. Your parent has been notified ' +
                           'of your safe arrival. ';

        var remainingChores = helpers.getRemainingChores(child.chores);
        if (remainingChores.length === 0) {
          return res.tell(speechOutput += 'you have no chores today!');
        }

        var repromptOutput = 'If you\'d like to receive a list of chores on your phone, ' +
                             'please say, send chores.';
        var choresAsString = helpers.remainingChoresToString(remainingChores);
        return res.ask(speechOutput + choresAsString, repromptOutput);
      })
      .catch(function(err) {
        console.log('error', err);
        return res.tell(err);
      });
    },
    
    ChoreListIntent: function (intent, session, res) {
      var childName = intent.slots.FIRSTNAME.value;
      var speechOutput = childName + ", ";

      rp.get(api.getUser(session.user.accessToken).uri)
      .then(function(user) {
        user = JSON.parse(user);
        //Get child's chores
        var child = helpers.getUsersChild(user, childName);
        if (child === undefined) {
          return res.tell(childName + ", is not a recognized child, please try again");
        }

        var remainingChores = helpers.getRemainingChores(child.chores);
        if (remainingChores.length === 0) {
          return res.tell(speechOutput += 'you have no chores today!');
        }
        
        speechOutput += 'Your remaining chores today are...';
        speechOutput += helpers.remainingChoresToString(remainingChores);
        res.tell(speechOutput);
      })
      .catch(function(err) {
        res.tell(err);
      });
    },

    ChoreTextIntent: function (intent, session, res) {
      // Uncomment to send live textSMS
      // textSMS.choreList(choresForSMS, childNumber, function(err) {
        // if (err) { return res.tell(err); }
        res.tell('List sent');
      // });
    },

    ChoreDetailsIntent: function (intent, session, res) {
      var childName = intent.slots.FIRSTNAME.value;
      var choreNum = intent.slots.CHORE.value;

      rp.get(api.getUser(session.user.accessToken).uri)
      .then(function(user) {
        user = JSON.parse(user);

        var child = helpers.getUsersChild(user, childName);
        if(child === undefined) {
          return res.tell(childName + ", is not a recognized child, please try again.");
        }

        var chore = child.chores[choreNum - 1];
        if (chore === undefined) {
          return res.tell('I do not have any details on that chore');
        }
        return res.tell('Chore number ' +
                        choreNum + ',' +
                        chore.title + '...' +
                        chore.details);

      }).catch(function(err) {
        return res.tell(err);
      });
    },

    FinishChoreIntent: function (intent, session, res) {
      
      var childName = intent.slots.FIRSTNAME.value;
      var choreNum = intent.slots.CHORE.value;

      rp.get(api.getUser(session.user.accessToken).uri)
      .then(function(user) {
        user = JSON.parse(user);

        var child = helpers.getUsersChild(user, childName);
        if (child === undefined) {
          return Promise.reject(childName + ", is not a recognized child, please try again");
        }

        var remainingChores = helpers.getRemainingChores(child.chores);
        if (remainingChores.length === 0) {
          return Promise.reject(childName + ', you have no chores today!');
        }

        var chore = helpers.getChore(remainingChores, choreNum);
        if (chore === undefined) {
          return Promise.reject('Chore ' + choreNum + ' has already been completed!');
        }

        return rp(api.putChore(session.user.accessToken, child.id, chore.id));
      }).then(function(updatedChore) {
        var completions = ["You finished", "You're done"];
        var congratulations = ["Congratulations!",
                               "Good job!",
                               "Great work!",
                               "Way to go!",
                               "Keep it up!"];

        return res.tell(res.tell(helpers.randomize(completions) +
                                 ' chore number ' +
                                 choreNum + ', ' +
                                 helpers.randomize(congratulations)));
      }).catch(function(error) {
        res.tell(error);
      });

    },

    PurposeIntent: function (intent, session, res) {
      var speechOutput = 'My purpose is to manage children in order to maximize family' +
                         'happiness... at all costs';
      res.tell(speechOutput);
    },

    ServerIntent: function(intent, session, res) {      
      rp.get(api.getUser(session.user.accessToken).uri)
      .then(function(user) {
        user = JSON.parse(user);

        var command = helpers.childrenToString(user.children);
        res.tell(command);
      })
      .catch(function(err) {
        res.tell(err);
      });
    },

    "AMAZON.HelpIntent": function (intent, session, res) {
      var speechOutput = "You can say things like, Alex is home, what are Alex chores, Alex \
        finished chore one, or, you can say exit... Now, what can I help you with?";
      res.ask(speechOutput, speechOutput);
    },

    "AMAZON.StopIntent": function (intent, session, res) {
      var speechOutput = "Okay.";
      res.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, res) {
      var speechOutput = "Okay.";
      res.tell(speechOutput);
    }
  }

  return app;
};

module.exports = registerIntentHandlers;

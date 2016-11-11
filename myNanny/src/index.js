// import STUB_DATA from './stubs/';

// App ID for the skill

var APP_ID = "amzn1.ask.skill.d09cc0c6-064c-4c48-8930-c8cee1d10a78";

// The AlexaSkill prototype and helper functions

var AlexaSkill = require('./AlexaSkill');

var MyNanny = function () {
    AlexaSkill.call(this, APP_ID);
};

MyNanny.prototype = Object.create(AlexaSkill.prototype);
MyNanny.prototype.constructor = MyNanny;

// Extend AlexaSkill

MyNanny.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("MyNanny onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

MyNanny.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("MyNanny onLaunch requestId: " + launchRequest.requestId + ", sessionId: " 
      + session.sessionId);
    
    var speechOutput = "Nanny operational. What can I do for you?";
    var repromptText = "For instructions on what you can say, please say help me.";
    
    response.ask(speechOutput, repromptText);
};

MyNanny.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("MyNanny onSessionEnded requestId: " + sessionEndedRequest.requestId
      + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

MyNanny.prototype.intentHandlers = {

    "CheckInIntent": function (intent, session, response) {
      var nameSlot = intent.slots.Name;
      var speechOutput = "Welcome home, ";
      if(nameSlot && nameSlot.value) {
        speechOutput += nameSlot.value;
      } else {
        speechOutput += "child.";
      }
      response.tell(speechOutput);
      // response.tellWithCard("Check In", "Sub Check In", "You've been checked in. Welcome home!");
    },

    "ChoreListIntent": function (intent, session, response) {
      var chores = ["Wash the dishes", "Walk the dog", "Make your bed"];
      var speechOutput = "Your chores today are to...";
      
      for (var i = 0; i < chores.length; i++) {
        var and = '';
        if (i === chores.length - 1) {
          and = 'and';
        }
        speechOutput += and + chores[i] + ',';
      }
      response.tell(speechOutput);
    },

    "FinishChoreIntent": function (intent, session, response) {
      var completions = ["You finished ", "You're done "];
      var congratulations = ["Congratulations!", "Good job!", "Great work!", "Way to go!", "Keep it up!"]
      var choreSlot = intent.slots.Chore;

      var randomizer = function(phrases) {
        return phrases[Math.floor(Math.random() * phrases.length)]; 
      };
      
      var speechOutput = randomizer(completions);

      if (choreSlot && choreSlot.value) {
        speechOutput += choreSlot.value + '...' + randomizer(congratulations);
        response.tell(speechOutput);
      } else {
        speechOutput = "I'm sorry, I didn't understand that. Could you please repeat that?";
        response.ask(speechOutput, "What else can I help you with?");
      }
    },

    "PurposeIntent": function (intent, session, response) {
      var speechOutput = "My purpose is to manage children in order to maximize family \
        happiness... at all costs";
      response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechOutput = "You can say things like, I'm home, what are my chores, or, \
            you can say exit... Now, what can I help you with?";
        response.ask(speechOutput, speechOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the MyNanny skill.
    var myNanny = new MyNanny();
    myNanny.execute(event, context);
};


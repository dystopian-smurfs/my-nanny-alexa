'use strict';
var helpers = {};

// Return a random phrase from an array of phrases
helpers.randomize = function(phrases) {
  return phrases[Math.floor(Math.random() * phrases.length)]; 
};

helpers.getUsersChild = function(user, childName) {
  for (var i = 0; i < user.children.length; i++) {
    if (user.children[i].name === childName) {
      return user.children[i];
    }
  };
};

helpers.getChore = function(chores, index) {
  for (var i = 0; i < chores.length; i++) {
    if (chores[i].index === index) {
      return chores[i].chore;
    }
  }
};

helpers.getRemainingChores = function(chores) {
  var remainingChores = [];

  for (var i = 0; i < chores.length; i++) {
    if (!chores[i].completed) {
      remainingChores.push({
        index: i + 1,
        chore: chores[i]
      });
    }
  }

  return remainingChores;
};

helpers.remainingChoresToString = function(chores) {
  var speechOutput = '';

  for (var i = 0; i < chores.length; i++) {
    speechOutput += chores[i].index + ': ' + 
                    chores[i].chore.title + '... ';
  }

  return speechOutput;
};

helpers.childrenToString = function(children) {
  var speechOutput = '';

  for (var i = 0; i < children.length; i++) {
    var and = '';
    if (children.length > 1 && i === children.length - 1) {
      and = 'and ';
    }
    speechOutput += and + children[i].name + '... ';
  }

  return speechOutput;
};

module.exports = helpers;


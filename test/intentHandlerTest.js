var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var getIntent = function(root, intentName) {
  var intentHandler = root(function() {}).prototype.intentHandlers;
  return intentHandler[intentName];  
};

var request = require('request-promise');
var helpers = require('../modules/helpers');
var BPromise = require('bluebird');

describe('IntentHandlers', function() {

  var intent = {
    slots: {
      CHORE: {
        value: 1
      },
      FIRSTNAME: {
        value: 'Batman'
      }
    }
  };
  var user = {
    accessToken: '1234'
  };
  var session = {
    user: user
  };

  describe('CheckInIntent', function() {
    it('should return res with error if session is invalid', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var checkInIntent = getIntent(registerIntentHandlers, 'CheckInIntent');
      
      sinon.stub(request, 'get').returns(BPromise.reject('error'));

      checkInIntent(intent, session, {
        tell: function(data) {
          request.get.restore();

          expect(data).to.equal('error');
          done();
        }
      });
    });

    it('should return voice command for unrecognized child', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var checkInIntent = getIntent(registerIntentHandlers, 'CheckInIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns(undefined);

      checkInIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();

          expect(data).to.equal('Batman, is not a recognized child, please try again');
          done();
        }
      });
    });

    it('should return voice command with no chores if list is empty', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var checkInIntent = getIntent(registerIntentHandlers, 'CheckInIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns({
        name: 'Batman',
        chores: []
      });
      sinon.stub(helpers, 'getRemainingChores').returns([]);

      checkInIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();
          helpers.getRemainingChores.restore();

          expect(data).to.equal('Welcome home, Batman. Your parent has been notified ' +
                                'of your safe arrival. you have no chores today!');
          done();
        }
      });
    });

    it('should return correct voice command with one chore', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var checkInIntent = getIntent(registerIntentHandlers, 'CheckInIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns({
        name: 'Batman',
        chores: [{}]
      });
      sinon.stub(helpers, 'getRemainingChores').returns([{}]);
      sinon.stub(helpers, 'remainingChoresToString').returns('Voice command for chores');

      checkInIntent(intent, session, {
        ask: function(data, repeat) {
          request.get.restore();
          helpers.getUsersChild.restore();
          helpers.getRemainingChores.restore();
          helpers.remainingChoresToString.restore();

          expect(data).to.equal('Welcome home, Batman. Your parent has been notified ' +
                                'of your safe arrival. Voice command for chores');
          expect(repeat).to.equal('If you\'d like to receive a list of chores on your phone, please say, ' +
                                  'send chores.');
          done();
        }
      });
    });

    it('should return correct voice command with two chores', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var checkInIntent = getIntent(registerIntentHandlers, 'CheckInIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns({
        name: 'Batman',
        chores: [{}]
      });
      sinon.stub(helpers, 'getRemainingChores').returns([{}]);
      sinon.stub(helpers, 'remainingChoresToString').returns('Voice command for chores');

      checkInIntent(intent, session, {
        ask: function(data, repeat) {
          request.get.restore();
          helpers.getUsersChild.restore();
          helpers.getRemainingChores.restore();
          helpers.remainingChoresToString.restore();

          expect(data).to.equal('Welcome home, Batman. Your parent has been notified ' +
                                'of your safe arrival. Voice command for chores');
          expect(repeat).to.equal('If you\'d like to receive a list of chores on your phone, ' +
                                  'please say, send chores.');
          done();
        }
      });
    });
  });

  describe('ChoreListIntent', function() {
    it('should return res with error if session is invalid', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreListIntent = getIntent(registerIntentHandlers, 'ChoreListIntent');
      
      sinon.stub(request, 'get').returns(BPromise.reject('error'));

      ChoreListIntent(intent, session, {
        tell: function(data) {
          request.get.restore();

          expect(data).to.equal('error');
          done();
        }
      });
    });

    it('should return voice command for unrecognized child', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreListIntent = getIntent(registerIntentHandlers, 'ChoreListIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns(undefined);

      ChoreListIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();

          expect(data).to.equal('Batman, is not a recognized child, please try again');
          done();
        }
      });
    });

    it('should return voice command for no more chores', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreListIntent = getIntent(registerIntentHandlers, 'ChoreListIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns({
        chores: []
      });

      ChoreListIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();

          expect(data).to.equal('Batman, you have no chores today!');
          done();
        }
      });
    });

    it('should return voice command for more chore(s)', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreListIntent = getIntent(registerIntentHandlers, 'ChoreListIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns({
        chores: []
      });
      sinon.stub(helpers, 'getRemainingChores').returns([{}]);
      sinon.stub(helpers, 'remainingChoresToString').returns('more chores');

      ChoreListIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();
          helpers.getRemainingChores.restore();
          helpers.remainingChoresToString.restore();

          expect(data).to.equal('Batman, Your remaining chores today are...more chores');
          done();
        }
      });
    });
  });

  describe('ChoreDetailsIntent', function() {
    it('should return res with error if session is invalid', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreDetailsIntent = getIntent(registerIntentHandlers, 'ChoreDetailsIntent');
      
      sinon.stub(request, 'get').returns(BPromise.reject('error'));

      ChoreDetailsIntent(intent, session, {
        tell: function(data) {
          request.get.restore();

          expect(data).to.equal('error');
          done();
        }
      });
    });

    it('should return voice command for unrecognized child', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreDetailsIntent = getIntent(registerIntentHandlers, 'ChoreDetailsIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns(undefined);

      ChoreDetailsIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();

          expect(data).to.equal('Batman, is not a recognized child, please try again.');
          done();
        }
      });
    });

    it('should return voice command for unrecognized chore', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreDetailsIntent = getIntent(registerIntentHandlers, 'ChoreDetailsIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns({
        chores: []
      });

      ChoreDetailsIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();

          expect(data).to.equal('I do not have any details on that chore');
          done();
        }
      });
    });

    it('should return voice command for recognized chore', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreDetailsIntent = getIntent(registerIntentHandlers, 'ChoreDetailsIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns({
        chores: [{
          childId: 1,
          completed: false,
          date: '2016-11-20',
          details: 'Norwegian taxes are criminal',
          id: 6,
          title: 'Buy candy at duty free'
        }]
      });

      ChoreDetailsIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();

          expect(data).to.equal('Chore number 1,Buy candy at duty free...' +
                                'Norwegian taxes are criminal');
          done();
        }
      });
    });
  });

  describe('FinishChoreIntent', function() {
    it('should return res with error if session is invalid', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreDetailsIntent = getIntent(registerIntentHandlers, 'FinishChoreIntent');
      
      sinon.stub(request, 'get').returns(BPromise.reject('error'));

      ChoreDetailsIntent(intent, session, {
        tell: function(data) {
          request.get.restore();

          expect(data).to.equal('error');
          done();
        }
      });
    });

    it('should return voice command for unrecognized child', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreDetailsIntent = getIntent(registerIntentHandlers, 'FinishChoreIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns(undefined);

      ChoreDetailsIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();

          expect(data).to.equal('Batman, is not a recognized child, please try again');
          done();
        }
      });
    });

    it('should return voice command for no more chores', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreDetailsIntent = getIntent(registerIntentHandlers, 'FinishChoreIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns({});
      sinon.stub(helpers, 'getRemainingChores').returns([]);

      ChoreDetailsIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();
          helpers.getRemainingChores.restore();

          expect(data).to.equal('Batman, you have no chores today!');
          done();
        }
      });
    });

    it('should return voice command for previously completed chore', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreDetailsIntent = getIntent(registerIntentHandlers, 'FinishChoreIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'getUsersChild').returns({});
      sinon.stub(helpers, 'getRemainingChores').returns([{}]);
      sinon.stub(helpers, 'getChore').returns(undefined);

      ChoreDetailsIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.getUsersChild.restore();
          helpers.getRemainingChores.restore();
          helpers.getChore.restore();

          expect(data).to.equal('Chore 1 has already been completed!');
          done();
        }
      });
    });
  });

  describe('ServerIntent', function() {
    it('should return res with error if session is invalid', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ServerIntent = getIntent(registerIntentHandlers, 'ServerIntent');
      
      sinon.stub(request, 'get').returns(BPromise.reject('error'));

      ServerIntent(intent, session, {
        tell: function(data) {
          request.get.restore();

          expect(data).to.equal('error');
          done();
        }
      });
    });

    it('should return voice command with children', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ServerIntent = getIntent(registerIntentHandlers, 'ServerIntent');
      
      sinon.stub(request, 'get').returns(BPromise.resolve(JSON.stringify(user)));
      sinon.stub(helpers, 'childrenToString').returns('voice command');

      ServerIntent(intent, session, {
        tell: function(data) {
          request.get.restore();
          helpers.childrenToString.restore();

          expect(data).to.equal('voice command');
          done();
        }
      });
    });
  });

  describe('PurposeIntent', function() {
    it('should return voice commmand', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var PurposeIntent = getIntent(registerIntentHandlers, 'PurposeIntent');
      
      PurposeIntent(intent, session, {
        tell: function(data) {
          expect(data).to.equal('My purpose is to manage children in order to maximize family' +
                                'happiness... at all costs');
          done();
        }
      });
    });
  });

  describe('ChoreTextIntent', function() {
    it('should return voice command', function(done) {
      var registerIntentHandlers = require('../handlers/intentHandlers');
      var ChoreTextIntent = getIntent(registerIntentHandlers, 'ChoreTextIntent');
      
      ChoreTextIntent(intent, session, {
        tell: function(data) {
          expect(data).to.equal('List sent');
          done();
        }
      });
    });
  });

});
  
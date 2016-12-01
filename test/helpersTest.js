var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var helpers = require('../modules/helpers');

var user = {
  amazonId: null,
  email: 'eugene.choe@gmail.com',
  id: 1,
  phone: '9173925602',
  timeZone: '',
  token: null,
  username: 'Eugene Choe',
  children: [{
    accountId: 1,
    id: 1,
    name: 'Robert',
    phone: '4159105695',
    schedule: null,
    chores: [{
      childId: 1,
      completed: false,
      date: '2016-11-20',
      details: 'Norwegian taxes are criminal',
      id: 6,
      title: 'Buy candy at duty free'
    }, {
      childId: 1,
      completed: true,
      date: '2016-11-20',
      details: 'There\'s fresh snow outside',
      id: 7,
      title: 'Go for a ski'
    }, {
      childId: 1,
      completed: false,
      date: '2016-11-20',
      details: 'Norwegian winters are fantastic',
      id: 8,
      title: 'Enjoy the two hours of daylight'
    }]
  }, {
    accountId: 1,
    id: 2,
    name: 'Meredith',
    phone: '6462709704',
    schedule: null,
    chores: [{
        childId: 2,
        completed: true,
        date: '2016-11-29',
        details: 'Download from the pirate bay',
        id: 14,
        title: 'Watch Mary Poppins'
      }, {
        childId: 2,
        completed: false,
        date: '',
        details: 'Get a black one',
        id: 16,
        title: 'Adopt a cat'
      }],
  }],
};

describe('Helpers', function() {
  describe('randomize', function() {
    it('should return a string from the array', function(done) {
      var word = helpers.randomize(['one element']);
      expect(word).to.equal('one element');
      done();
    });
  });

  describe('getUsersChild', function() {

    it('should return user object if name match', function(done) {
      var child = helpers.getUsersChild(user, 'Robert');
      expect(child.id).to.equal(1);
      expect(child.name).to.equal('Robert');
      expect(child.phone).to.equal('4159105695');
      done();
    });

    it('should return undefined if no name matches', function(done) {
      var child = helpers.getUsersChild(user, 'Harley Quinn');
      expect(child).to.equal(undefined);
      done();
    });
  });

  describe('getChore', function() {
    it('should return undefined if chore not found', function(done) {
      var chore = helpers.getChore([{index: 1}], 2);
      expect(chore).to.equal(undefined);
      done();
    });

    it('should return chore object if found', function(done) {
      var chore = helpers.getChore([{index: 1, chore: {title: 'correct'}}], 1);
      expect(chore.title).to.equal('correct');
      done();
    });

    it('should find correct chore in list', function(done) {
      var chore = helpers.getChore([{index: 1, chore: {title: 'incorrect'}},
                                    {index: 2, chore: {title: 'incorrect'}},
                                    {index: 3, chore: {title: 'correct'}}], 3);
      expect(chore.title).to.equal('correct');
      done();
    });
  });

  describe('getRemainingChores', function() {
    it('should return empty array if no chores', function() {
      var chores = helpers.getRemainingChores([]);
      expect(chores.length).to.equal(0);
    });

    it('should return the correct chores', function() {
      var chores = helpers.getRemainingChores(user.children[0].chores);
      expect(chores[0].index).to.equal(1);
      expect(chores[0].chore.title).to.equal('Buy candy at duty free');
      expect(chores[1].index).to.equal(3);
      expect(chores[1].chore.title).to.equal('Enjoy the two hours of daylight');
    });
  });

  describe('remainingChoresToString', function() {
    it('should generate empty string for empty list', function(done) {
      var speech = helpers.remainingChoresToString([]);
      expect(speech).to.equal('');
      done();
    });

    it('should generate the correct voice command', function(done) {
      var speech = helpers.remainingChoresToString([{
        index: 1,
        chore: user.children[0].chores[0]
      },{
        index: 3,
        chore: user.children[0].chores[2]
      }]);
      expect(speech).to.equal('1: Buy candy at duty free... ' +
                              '3: Enjoy the two hours of daylight... ');
      done();
    });
  });

  describe('childrenToString', function() {
    it('should return empty string if list is empty', function(done) {
      var speech = helpers.childrenToString([]);
      expect(speech).to.equal('');
      done();
    });

    it('should return correct voice command for one child', function(done) {
      var speech = helpers.childrenToString([{ name: 'Batman' }]);
      expect(speech).to.equal('Batman... ');
      done();
    });


    it('should return correct voice command for two children', function(done) {
      var speech = helpers.childrenToString([{ name: 'Batman' },
                                             { name: 'Joker' }]);
      
      expect(speech).to.equal('Batman... and Joker... ');
      done();
    });


    it('should return correct voice command for three children', function(done) {
      var speech = helpers.childrenToString([{ name: 'Batman' },
                                             { name: 'Joker' },
                                             { name: 'Harley Quinn' }]);
      expect(speech).to.equal('Batman... Joker... and Harley Quinn... ');
      done();
    });
  });
});
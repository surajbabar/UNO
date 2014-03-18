var assert = require("assert");
var player = require("player.js").player;
var card = require("card.js").card;

describe('Player', function(){
  describe('#createPlayer', function(){
    it('should give a player having name,cards and unoStatus', function(){
      var me = player.createPlayer('me');
      var expected = {name:'me',cards:[],declaredUno:false};
      assert.deepEqual(expected,me);
    })
  })

  describe('#takeCard', function(){
    it('should add the given card in player cards', function(){
      var me = player.createPlayer('me');
      var givenCard1 = card.createCard("1","red");
      var givenCard2 = card.createCard("2","yellow");
      player.takeCard(me,givenCard1);
      player.takeCard(me,givenCard2);
      var snapshot = {};
      player.populateSelf(me,snapshot);
      assert.deepEqual(snapshot.myCards,[givenCard1,givenCard2]);
    })
  })

  describe('#generateSummary',function(){
    it('should give player name,number of cards left and unoStatus as summary',function(){
        var me = player.createPlayer('me');
        var givenCard1 = card.createCard("1","red");
        var givenCard2 = card.createCard("2","yellow");
        player.takeCard(me,givenCard1);
        player.takeCard(me,givenCard2);
        var summary = player.generateSummary(me);
        var expected = {name:'me',noOfCards:2,unoStatus:false};

        assert.deepEqual(expected,summary);
    });
  })

  describe('#playCard',function(){
    it('should remove the played card from player cards',function(){
        var me = player.createPlayer('me');
        var givenCard1 = card.createCard("1","red");
        var givenCard2 = card.createCard("2","yellow");
        var givenCard3 = card.createCard("2","green");
        player.takeCard(me,givenCard1);
        player.takeCard(me,givenCard2);
        player.takeCard(me,givenCard3);
        var summary = player.playCard(me,givenCard2);
        var snapshot = {};
        player.populateSelf(me,snapshot);

        assert.deepEqual(snapshot.myCards,[givenCard1,givenCard3]);
    });
  })

  describe('#declareUno',function(){
    it('should set player unoStatus to true',function(){
      var me = player.createPlayer('me');
      var summary = player.generateSummary(me);
      assert.equal(false,summary.unoStatus);
      player.declareUno(me);
      summary = player.generateSummary(me);
      assert.equal(true,summary.unoStatus);
    })
  })

  describe('#checkUno',function(){
    it('should tell player is able to say UNO or being caught',function(){
      var me = player.createPlayer('me');
      player.takeCard(me,card.createCard("1","green"));
      var result = player.checkUno(me);
      assert.equal(true,result);
    })
  })

  describe('#checkUno',function(){
    it('should tell player is not able to say UNO or being caught',function(){
      var me = player.createPlayer('me');
      var greenCard = card.createCard("1","green");
      player.takeCard(me,card.createCard("1","green"));
      player.takeCard(me,greenCard);
      var result = player.checkUno(me);
      assert.equal(false,result);

      player.playCard(me,greenCard);
      player.declareUno(me);
      var result = player.checkUno(me);
      assert.equal(false,result);
    })
  })

  describe('#hasWon',function(){
    it('should tell that player has won if their is no card left',function(){
      var me = player.createPlayer('me');
      var greenCard = card.createCard("1","green");
      player.takeCard(me,greenCard);
      var winingStatus = player.hasWon(me);
      assert.equal(false,winingStatus);
      player.playCard(me,greenCard);
      winingStatus = player.hasWon(me);
      assert.equal(true,winingStatus);
    })
  })

  describe('#generateResult',function(){
      it('should give player name,left cards and points as result',function(){
        var me = player.createPlayer('me');
         var drawFour = card.createCard("DrawFour","black");
         var blueCard = card.createCard("Skip","blue");

         player.takeCard(me,drawFour);
         player.takeCard(me,blueCard);

         var result = player.generateResult(me);
         var expected = {name:'me',cards:[drawFour,blueCard],points:70};
         assert.deepEqual(expected,result);
      })
  })  

})
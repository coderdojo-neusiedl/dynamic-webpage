/* global global, parent, padres, ducks:true, assertNamespace */

require(global.PROJECT_SOURCE_ROOT_PATH + '/NamespaceUtils.js');

var setup = function setup() {
};

describe('NamespaceUtils', function() {
	
   beforeEach(setup);
   
   it('assertNamespace(\'myNamespace\') creates a global object \'myNamespace\'', function() {
      assertNamespace('myNamespace');
      expect(typeof myNamespace).to.not.be.eql('undefined');
   });
   
   it('assertNamespace(\'anotherNamespace\') creates a global object \'anotherNamespace\'', function() {
      assertNamespace('anotherNamespace');
      expect(typeof anotherNamespace).to.not.be.eql('undefined');
   });
   
   it('assertNamespace(\'parent.child\') creates a global object \'parent\' with a child \'child\'', function() {
      assertNamespace('parent.child');
      expect(typeof parent).to.not.be.eql('undefined');
      expect(typeof parent.child).to.not.be.eql('undefined');
   });
   
   it('calling assertNamespace() twice for the same parent creates the requested child objects', function() {
      assertNamespace('padres.nina');
      assertNamespace('padres.nino');
      expect(typeof padres).to.not.be.eql('undefined');
      expect(typeof padres.nino).to.not.be.eql('undefined');
      expect(typeof padres.nina).to.not.be.eql('undefined');
   });
   
   it('combined test', function() {
      ducks = {
         hunter: 'a duck hunter',
         daisy: {
            age: 21
         }
      };
      
      assertNamespace('ducks.dagobert');
      assertNamespace('ducks.donald');
      assertNamespace('ducks.donald.kids.tick');
      assertNamespace('ducks.donald.kids.trick');
      assertNamespace('ducks.donald.kids.track');
      
      expect(typeof ducks).to.not.be.eql('undefined');
      expect(typeof ducks.daisy).to.not.be.eql('undefined');
      expect(typeof ducks.dagobert).to.not.be.eql('undefined');
      expect(typeof ducks.donald).to.not.be.eql('undefined');
      expect(typeof ducks.donald.kids.tick).to.not.be.eql('undefined');
      expect(typeof ducks.donald.kids.trick).to.not.be.eql('undefined');
      expect(typeof ducks.donald.kids.track).to.not.be.eql('undefined');
      expect(ducks.hunter).to.be.eql('a duck hunter');
      expect(ducks.daisy.age).to.be.eql(21);
   });
});  
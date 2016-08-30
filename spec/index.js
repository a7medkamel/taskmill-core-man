var assert = require('assert');
var should = require('should');

var man = require('../');

describe('manual', function() {
  describe('pragma', function() {
    it('should be parsed into a pragma array', function() {
      let text =
      `
      /*
      @pragma editor append
      */
      `
      let manual = man.get(text);

      manual.pragma.should.be.instanceof(Array).and.have.lengthOf(1);
      manual.pragma.should.be.eql(['editor append']);
    });

    it('should preserve pragma order', function() {
      let text =
      `
      /*
      @pragma editor append
      @pragma foo bar
      */
      `
      let manual = man.get(text);

      manual.pragma.should.be.instanceof(Array).and.have.lengthOf(2);
      manual.pragma.should.be.eql(['editor append', 'foo bar']);
    });
  });

  describe('title', function() {
    it('should be set', function() {
      let text =
      `
      /*
      @title _title_
      */
      `
      let manual = man.get(text);

      manual.title.should.be.instanceof(String);
      manual.title.should.be.eql('_title_');
    });
  });

  describe('description', function() {
    it('should be set', function() {
      let text =
      `
      /*
      @description _description_
      */
      `
      let manual = man.get(text);

      manual.description.should.be.instanceof(String);
      manual.description.should.be.eql('_description_');
    });
  });

    describe('readme', function() {
    it('should be set', function() {
      let text =
      `
      /*
      @readme _readme_
      */
      `
      let manual = man.get(text);

      manual.readme.should.be.instanceof(String);
      manual.readme.should.be.eql('_readme_');
    });
  });

  describe('cache', function() {
    it('should be set', function() {
      let text =
      `
      /*
      @cache _cache_
      */
      `
      let manual = man.get(text);

      manual.cache.should.be.instanceof(String);
      manual.cache.should.be.eql('_cache_');
    });
  });

  describe('output', function() {
    it('should object', function() {
      let text =
      `
      /*
      @output
      {
        "foo" : "bar"
      }
      */
      `
      let manual = man.get(text);

      manual.output.should.be.instanceof(Object);
      manual.output.should.be.eql({ 'foo' : 'bar' });
    });
  });

  describe('input', function() {
    it('should object', function() {
      let text =
      `
      /*
      @input
      {
        "foo" : "bar"
      }
      */
      `
      let manual = man.get(text);

      manual.input.should.be.instanceof(Object);
      manual.input.should.be.eql({ 'foo' : 'bar' });
    });
  });
});
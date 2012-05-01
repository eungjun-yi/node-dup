var dup = require('../lib/dup');
var assert = require('assert');

suite('dup.find_dup_sync', function() {
    test('Find identical files in the given path recursively.', function() {
        // given
        var path = ['test/resource'];
        var expected = { 2: {'3f786850e387550fdab836ed7e6dc881de23001b': [path + '/a', path + '/c'], '89e6c98d92887913cadf06b2adb97f26cde4849b': [path + '/b', path + '/d']} };

        // when
        var actual = dup.find_dup_sync(path);
        
        // then
        assert.deepEqual(actual, expected);
    });
});

var dup = require('../lib/dup');
var assert = require('assert');

suite('dup.find_dup_sync', function() {
    test('Find identical files in the given path recursively.', function() {
        // given
        var path = 'test/resource';
        var expected = { 2: [path + '/a', path + '/b'] };

        // when
        var actual = dup.find_dup_sync(path);
        
        // then
        assert.deepEqual(actual, expected);
    });
});

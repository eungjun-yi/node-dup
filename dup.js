#!env node
var dup = require('./lib/dup');
var cli = require('cli');

cli.parse({
    verbose: ['v', 'Produce verbose output'],
    'no-checksum': [false, 'Do not compute checksum'],
});

/*
dup.find_dup(path, function(err, hashes) {
    for(var key in hashes) {
        if (hashes[key].length >= 2) {
            console.log(hashes[key]);
        }
    }
});
*/

cli.main(function(args, options) {
    // Output format:
    //
    // n bytes:
    //         file1
    //         file2
    //         ...
    // ...
    //

    dup.verbose = options.verbose;
    var hashes = dup.find_dup_sync(args[0] || '.');
    for(var key in hashes) {
        if (hashes[key].length >= 2) {
            console.log(key + ' bytes:');
            hashes[key].forEach(function(item) {
                console.log('\t' + item);
            });
        }
    }
});

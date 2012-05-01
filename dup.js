#!/usr/bin/env node
var dup = require('./lib/dup');
var cli = require('cli');

cli
    .setUsage('dup [options] [<path>...]')
    .parse({
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
    dup.checksum = !options['no-checksum'];
    var hashes = dup.find_dup_sync(args);
    for(var size in hashes) {
        for (var checksum in hashes[size]) {
            if (hashes[size][checksum].length >= 2) {
                if (checksum) {
                    console.log(size + ' bytes, ' + checksum + ':');
                } else {
                    console.log(size + ' bytes:');
                }
                console.log('\t' + hashes[size][checksum].join('\n\t'));
            }
        }
    }
});

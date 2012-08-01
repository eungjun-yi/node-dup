#!/usr/bin/env node
var dup = require('./lib/dup');
var cli = require('cli');
var fsutil = require('fsutil');
var path = require('path');

cli
    .setUsage('dup [options] [<path>...]')
    .parse({
        verbose: ['v', 'Produce verbose output'],
        'no-checksum': [false, 'Do not compute checksum'],
        'link': [false, 'Replace duplicated files with symbolic links'],
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
                if (options.link) {
                    var i, origin, target, relativePath;
                    origin = hashes[size][checksum][0];
                    for(i = 1; i < hashes[size][checksum].length; i++) {
                        target = hashes[size][checksum][i];
                        if (options.verbse) {
                            console.log('rm ' + target);
                        }
                        fsutil.rm(target);
                        targetDir = target.substr(0, target.lastIndexOf('/'));
                        relativePath = path.relative(targetDir, origin);
                        if (options.verbose) {
                            console.log('ln -s ' + relativePath + ' ' + target);
                        }
                        fsutil.ln_s(relativePath, target);
                    }
                } else {
                    if (checksum) {
                        console.log(size + ' bytes, ' + checksum + ':');
                    } else {
                        console.log(size + ' bytes:');
                    }
                    console.log('\t' + hashes[size][checksum].join('\n\t'));
                }
            }
        }
    }
});

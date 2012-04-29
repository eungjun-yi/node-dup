var dup = require('./lib/dup');

path = process.argv[2];

if (!path) {
    path = '.';
}

// Output format:
//
// n bytes:
//         file1
//         file2
//         ...
// ...
//
var hashes = dup.find_dup_sync(path);
for(var key in hashes) {
    if (hashes[key].length >= 2) {
        console.log(key + ' bytes:');
        hashes[key].forEach(function(item) {
            console.log('\t' + item);
        });
    }
}

/*
dup.find_dup(path, function(err, hashes) {
    for(var key in hashes) {
        if (hashes[key].length >= 2) {
            console.log(hashes[key]);
        }
    }
});
*/

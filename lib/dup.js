var fs = require('fs');
var pth = require('path');
var async = require('async');
var _ = require('underscore');
var util = require('util');
var crypto = require('crypto');

var _find_dup_sync = function(path, hashes) {
    var self = this;

    try {
        var stat = fs.lstatSync(path);
    } catch(e) {
        return false;
    }

    if (stat.isDirectory()) {
        fs.readdirSync(path).forEach(function (filename) {
            hashes = self._find_dup_sync(pth.join(path, filename), hashes);
        });
    } else if (stat.isFile()) {
        if (this.verbose) {
            console.log(path);
        }
        var size = stat.size;
        if (hashes[size]) {
            if (self.checksum) {
                var file = hashes[size][0];
                var id1 = crypto.createHash('sha1').update(fs.readFileSync(file), 'binary').digest('hex');
                var id2 = crypto.createHash('sha1').update(fs.readFileSync(path), 'binary').digest('hex');
                if (id1 == id2) {
                    hashes[size].push(path);
                }
            } else {
                hashes[size].push(path);
            }
        } else {
            hashes[size] = [path];
        }
    }

    return hashes;
}

var _find_dup_async = function(path, hashes, callback) {
    var self = this;
    fs.lstat(path, function(err, stat) {
        if (err) {
            if (err.code == 'ENOENT') {
                callback(null);
            } else {
                callback(err);
            }
        } else {
            if (stat.isDirectory()) {
                async.series([
                    function remove_entries(cb1) {
                        fs.readdir(path, function(err, files) {
                            files = _.map(files, function(file) { return pth.join(path, file); });
                            async.forEach(files, function(file, cb2) { self._find_dup(file, hashes, cb2); }, cb1);
                        });
                    },
                ], callback);
            } else {
                fs.readFile(path, function(err, data) {
                    if (err) throw err;
                    var sha1 = crypto.createHash('sha1');
                    var updated = sha1.update(data, 'binary');
                    var id = updated.digest('hex');
                    if (hashes[id]) {
                        hashes[id].push(path);
                    } else {
                        hashes[id] = [path];
                    }
                    callback(null);
                });
            }
        }
    });
}

/**
 * Find identical files in the given path recursively.
 *
 * @param  {String} path
 * @return {Object} { size: [filename, ...], ...}
 */
var find_dup_sync = function(path) {
    return this._find_dup_sync(path, {});
}

var find_dup_async = function(path, callback) {
    var hashes = {}
    this._find_dup(path, hashes, function(err) {
        callback(err, hashes);
    });
}

exports.verbose = false;
exports._find_dup_sync = _find_dup_sync;
exports._find_dup_async = _find_dup_async;
exports.find_dup_sync = find_dup_sync;
exports.find_dup_async = find_dup_sync;

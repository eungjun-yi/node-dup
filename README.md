dup
===

Find identical files in given path recursively.

Requirements
------------

* [async](https://github.com/caolan/async)
* [underscore](http://underscorejs.org/)
* [mocha](http://mochajs.org/) (if you want to run tests)

Usage
-----

    $ node dup.js /path/to/find
    2 bytes, bd567fa79cbe0196d093a067271361dc6ca8b:
            /path/to/find/autumn
            /path/to/find/fall

You can also use --no-checksum option to save time.

    $ node dup.js --no-checksum /path/to/find
    2 bytes:
            /path/to/find/spring
            /path/to/find/summer
            /path/to/find/autumn
            /path/to/find/fall
            /path/to/find/winter

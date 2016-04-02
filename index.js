'use strict';

var path = require('path');
var es = require('event-stream');
var vinyl = require('vinyl-file');
var jade_dependency = require('jade-dependency');

module.exports = function (globs, options) {
    options = options || {};

    var delay = options.delay || 100;

    var dependency = jade_dependency(globs, options);
    var stream;

    var files = {};
    var paths = {};
    var timer = null;

    function flush() {
        var abs_path;
        timer = null;

        for (abs_path in paths) {
            if (!files[abs_path]) {
                files[abs_path] = vinyl.readSync(abs_path);
            }
        }
        paths = {};

        for (abs_path in files) {
            stream.emit('data', files[abs_path]);
        }
        files = {};
    }

    function request_flush() {
        if (!timer) {
            timer = setTimeout(flush, delay);
        }
    }

    function add_file(abs_path, file) {
        files[abs_path] = file;
        request_flush();
    }

    function add_path(abs_path) {
        paths[abs_path] = true;
        request_flush();
    }

    stream = es.through(function (file) {
        var abs_path = path.resolve(file.path);
        add_file(abs_path, file);
        dependency.file_changed(abs_path);
        dependency.find_dependents(abs_path).map(add_path);
    });

    return stream;
};

'use strict';

var path = require('path');
var fs = require('fs');
var glob_parent = require('glob-parent');
var es = require('event-stream');
var vinyl = require('vinyl-file');
var jade_dependency = require('jade-dependency');

module.exports = function (globs, options) {
    options = options || {};

    var delay = options.delay || 100;
	var base = path.resolve(glob_parent(globs));

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
                files[abs_path] = vinyl.readSync(abs_path, {base: base});
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

    var mtime_cache = {};

    stream = es.through(function (file) {
        var abs_path = path.resolve(file.path);

        try {
            // Prevent unchanged files from triggering
            var mtime = fs.statSync(abs_path).mtime.getTime();
            var last_mtime = mtime_cache[abs_path];
            mtime_cache[abs_path] = mtime;
            if (last_mtime === mtime) {
                return;
            }
            if (!last_mtime) {
                // Initial scan, skip dependency graph
                add_file(abs_path, file);
                return;
            }
        } catch (e) {
            // File might be gone.
        }

        add_file(abs_path, file);

        dependency.file_changed(abs_path);
        dependency.find_dependents(abs_path).map(add_path);
    });

    return stream;
};

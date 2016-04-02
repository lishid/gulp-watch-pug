gulp-watch-jade
===========

Gulp plugin to use with gulp-watch. Used to trigger recompilation of dependent jade files through include or extend.

Usage
---
```javascript

var gulp = require('gulp');
var watch = require('gulp-watch');
var jade = require('gulp-jade');
var gulp_watch_jade = require('gulp-watch-jade');

gulp.src('jade/**/*.jade')
    .pipe(watch('jade/**/*.jade'))
    .pipe(gulp_watch_jade('jade/**/*.jade', { delay: 100 }))
    .pipe(jade())
    .pipe(gulp.dest('html/'));

```

API
---

### gulp_watch_jade(glob, options)

glob: Start by watching these files for dependency. Futhur changes (such as new files) will automatically be remembered.

### Options

#### delay

default = 100

How many milliseconds we should wait before emitting files.
This is used to prevent multiple successive changes triggering recompilations multiple times.

LICENSE
-------

The MIT License (MIT)

Copyright (c) 2016 Shida Li

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

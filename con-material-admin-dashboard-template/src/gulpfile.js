var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglifyjs = require('gulp-uglifyjs'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    fileinclude = require('gulp-file-include'),
    prettify = require('gulp-html-prettify'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    package = require('./package.json');

var banner = [
  '/*!',
  ' * Name: <%= package.fullName %> - <%= package.title %>',
  ' * Version: <%= package.version %>',
  ' * Author: <%= package.author %>',
  ' * Website: <%= package.website %>',
  ' * Support: <%= package.support %>',
  ' * Purchase: <%= package.purchase %>',
  ' * License: You must have a valid license purchased only from themeforest(the above link) in order to legally use the theme for your project.',
  ' * Copyright ' + new Date().getFullYear() + '.',
  ' */',
  ''
];

function getBanner(html) {
    var newBanner = banner.join('\n');

    // change css banner to html type
    if(html) {
        var newBanner = newBanner.replace(/\* /g, ' ')
                                 .replace(/\/\*!/g, '<!--')
                                 .replace(/ \*\//g, '-->')
    }

    // change template to real variables
    return newBanner.replace(/<%=(.*?)%>/g, function($0, $1){
        return eval($1) || '';
    })
}

gulp.task('html', function () {
  gulp.src('src/html/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(prettify({indent_char: ' ', indent_size: 2}))
    .pipe(header(getBanner(true)))
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({stream:true, once: true}));
  
  gulp.src('src/html/angularjs/**/*')
    .pipe(gulp.dest('app/angularjs'))
});

gulp.task('css', function () {
  gulp.src('src/scss/*.scss')
    .pipe(sass({
        includePaths: ['./src/scss'],
        errLogToConsole: true
    }))
    .pipe(autoprefixer({browsers: ['last 4 version', 'ie 8', 'ie 9']}))
    .pipe(rename(function(path) {
        path.basename = path.basename.replace('con', '_con').replace('-base', '');
    }))
    .pipe(gulp.dest('app/assets/_con/css'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(getBanner()))
    .pipe(gulp.dest('app/assets/_con/css'))
    .pipe(browserSync.reload({stream:true}));
});
gulp.task('css-dev', function () {
  gulp.src('src/scss/con-base.scss')
    .pipe(sass({
        includePaths: ['./src/scss'],
        errLogToConsole: true
    }))
    .pipe(autoprefixer({browsers: ['last 4 version', 'ie 8', 'ie 9']}))
    .pipe(rename('_con.css'))
    .pipe(gulp.dest('app/assets/_con/css'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(getBanner()))
    .pipe(gulp.dest('app/assets/_con/css'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js',function(){
  gulp.src('src/js/_main.js')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('_con.js'))
    .pipe(header(getBanner()))
    .pipe(gulp.dest('app/assets/_con/js'))
    .pipe(uglifyjs({ wrap: true }))
    .pipe(header(getBanner()))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/assets/_con/js'))
    .pipe(browserSync.reload({stream:true, once: true}));

  gulp.src('src/js/_demo.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(header(getBanner()))
    .pipe(gulp.dest('app/assets/_con/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

gulp.task('js-materialize',function(){
  gulp.src([
    'src/js/materialize/*.js',
    'src/js/materialize/date_picker/picker.js',
    'src/js/materialize/date_picker/picker.date.js'
    ])
    .pipe(uglifyjs({
        drop_console: true
    }))
    .pipe(concat('materialize.min.js'))
    .pipe(header([
        '/*!',
        ' * Materialize v0.96.0 (http://materializecss.com)',
        ' * Copyright 2014-2015 Materialize',
        ' * MIT License (https://raw.githubusercontent.com/Dogfalo/materialize/master/LICENSE)',
        ' *',
        ' * Modifications: nK',
        ' */'
    ].join('\n')))

    .pipe(gulp.dest('app/assets/materialize/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

// gulp.task('forsite',function(){
//     var assets = useref.assets();

//     gulp.src('app/*.html')
//     .pipe(assets)
//     // .pipe(gulpif('*.js', uglifyjs()))
//     .pipe(gulpif('*.css', minifyCSS({keepSpecialComments:0})))
//     .pipe(assets.restore())
//     .pipe(useref())
//     .pipe(gulpif('*.html', htmlmin({
//         collapseWhitespace: true,
//         minifyJS: true,
//         minifyCSS: true,
//         removeComments: true
//     })))
//     .pipe(gulp.dest('site'));

//     gulp.src('app/assets/_con/js/_demo.js')
//     .pipe(gulp.dest('site/assets/_con/js'));

//     gulp.src('app/assets/_con/images/*')
//     .pipe(gulp.dest('site/assets/_con/images'));

//     gulp.src('app/assets/flagIcons/*')
//     .pipe(gulp.dest('site/assets/flagIcons'));

//     gulp.src('app/assets/_con/css/*.min.css')
//     .pipe(gulp.dest('site/assets/_con/css'));

//     gulp.src('app/assets/nvd3/stackedAreaData.json')
//     .pipe(gulp.dest('site/assets/nvd3'));

//     gulp.src(['app/assets/material-design-icons/font/*', 'app/assets/weatherIcons/font/*'])
//     .pipe(gulp.dest('site/assets/font/'));

//     gulp.src(['app/assets/font-awesome/fonts/*', 'app/assets/ionicons/fonts/*'])
//     .pipe(gulp.dest('site/assets/fonts/'));

//     gulp.src(['app/assets/ckeditor/**/*'], {base:"./app/assets"})
//     .pipe(gulp.dest('site/assets'));

//     gulp.src(['app/assets/markitup/**/*'], {base:"./app/assets"})
//     .pipe(gulp.dest('site/assets'));
// });

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        },
        port: 9000,
        notify: false
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('default', ['css-dev', 'js', 'js-materialize', 'html', 'browser-sync'], function () {
    gulp.watch("src/scss/**/*.scss", ['css-dev']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("src/js/materialize/**/*.js", ['js-materialize']);
    gulp.watch("src/html/**/*", ['html']);
    // gulp.watch("app/{,*/}*", ['bs-reload']);
});

gulp.task('build', ['css', 'js', 'js-materialize', 'html']);

// gulp.task('site', ['build'], function() {
//     gulp.run('forsite');
// });
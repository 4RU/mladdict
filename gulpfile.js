var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-ruby-sass');
var minifycss   = require('gulp-minify-css');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">U KNO?</span> $ jekyll build sedikit lelet'
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
      return sass('assets/styles/sass/main.sass', {
         style: 'compressed',
         trace: true // outputs better errors
      }).pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(minifycss())
        .pipe(gulp.dest('_site/assets/styles'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/styles'));
});

// Creates optimized versions of images,
// then outputs to appropriate location(s)
// gulp.task('images', function() {
//   return gulp.src('assets/styles/gambar')
//     .pipe(imagmin())
//     .pipe(gulp.dest(paths.jekyllImageFiles))
//     .pipe(gulp.dest(paths.siteImageFiles))
//     .pipe(browserSync.stream())
//     .pipe(size({showFiles: true}))
//     .on('error', gutil.log);
// })

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('assets/styles/**/*.+(sass|css)', ['sass']);
});
gulp.watch(['*.yml', '*.html', '_layouts/*.html', '_posts/*', 'pages/*.html', '_includes/*.html', '_data/**/*.yml', '_heroes/**/*.html', 'admin/**/*.+(html|yml)', '_guides/**/*.+(html|md)', 'assets/scripts/*.js'], ['jekyll-rebuild']);

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

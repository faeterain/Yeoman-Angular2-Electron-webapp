var gulp = require('gulp'),
    rename = require('gulp-rename'),
    traceur = require('gulp-traceur'),
    del = require('del'),
    sass = require('gulp-sass'),
    webserver = require('gulp-webserver'),
    electron = require('gulp-atom-electron'),
    symdest = require('gulp-symdest'),

    ts = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json"),
    config = require('./config/gulp');


/**
 * Run init tasks
 */
gulp.task('default', ['dependencies', 'js', 'html', 'css']);


/**
 * Run development task
 */
gulp.task('dev', [
    'dev:watch',
    'dev:serve'
]);


/**
 * Serve the build dir
 */
gulp.task('dev:serve', function() {
    gulp.src('build')
        .pipe(webserver({
            open: true
        }));
});


/**
 * Clean old build
 */
gulp.task('clean', [
    'clean:build',
    'clean:package'
]);

gulp.task('clean:build', function() {
    return del(config.buildDir + '/**/*', { force: true });
});

gulp.task('clean:package', function() {
    return del(config.packagesDir + '/**/*', { force: true });
});


// watch for changes and run the relevant task
gulp.task('dev:watch', function() {
    gulp.watch(config.sourceDir + '/**/*.js', ['frontend:js']);
    gulp.watch(config.sourceDir + '/**/*.ts', ['frontend:ts']);
    gulp.watch(config.sourceDir + '/**/*.html', ['frontend:html']);
    gulp.watch(config.sourceDir + '/**/*.css', ['frontend:css']);
});

gulp.task('electron', () => {
    return gulp.src([
            config.sourceDir + '/electron/main.js',
            config.sourceDir + '/electron/package.json'
        ])
        .pipe(gulp.dest(config.buildDir));
})

/**
 * Generate electron native desktop app
 */
gulp.task('package', [
    'package:osx',
    'package:linux',
    'package:windows'
]);

gulp.task('package:osx', function() {
    return gulp.src(config.buildDir + '/**/*')
        .pipe(electron({
            version: '1.4.16',
            platform: 'darwin'
        }))
        .pipe(symdest(config.packagesDir + '/osx'));
});

gulp.task('package:linux', function() {
    return gulp.src(config.buildDir + '/**/*')
        .pipe(electron({
            version: '1.4.16',
            platform: 'linux'
        }))
        .pipe(symdest(config.packagesDir + '/linux'));
});

gulp.task('package:windows', function() {
    return gulp.src(config.buildDir + '/**/*')
        .pipe(electron({
            version: '1.4.16',
            platform: 'win32',
            companyName: 'DXC Technology',
            copyright: '2017'
        }))
        .pipe(symdest(config.packagesDir + '/windows'));
});


/**
 * Generate interface
 */
gulp.task('frontend', [
    'frontend:dependencies',
    'frontend:js',
    'frontend:ts',
    'frontend:html',
    'frontend:sass'
]);


/**
 * Move dependencies into build dir
 */
gulp.task('frontend:dependencies', function() {
    return gulp.src([
            config.npmDir + '/traceur/bin/traceur-runtime.js',
            config.npmDir + '/systemjs/dist/system-csp-production.src.js',
            config.npmDir + '/systemjs/dist/system.js',
            config.npmDir + '/reflect-metadata/Reflect.js',
            config.npmDir + '/angular2/bundles/angular2.js',
            config.npmDir + '/angular2/bundles/angular2-polyfills.js',
            config.npmDir + '/angular2/bundles/router.js',
            config.npmDir + '/rxjs/bundles/Rx.js',
            config.npmDir + '/es6-shim/es6-shim.min.js',
            config.npmDir + '/es6-shim/es6-shim.map',
            config.bowerDir + '/jquery/dist/jquery.min.js',
            config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js'
        ])
        .pipe(gulp.dest(config.buildDir + '/lib'));
});

// transpile & move js
gulp.task('frontend:js', function() {
    return gulp.src(config.sourceDir + '/**/*.js')
        .pipe(rename({
            extname: ''
        }))
        .pipe(traceur({
            modules: 'instantiate',
            moduleName: true,
            annotations: true,
            types: true,
            memberVariables: true
        }))
        .pipe(rename({
            extname: '.js'
        }))
        .pipe(gulp.dest(config.buildDir));
});

// transpile & move ts
gulp.task('frontend:ts', function() {
    return tsProject.src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest(config.buildDir));
});


gulp.task('frontend:html', function() {
    return gulp.src(config.sourceDir + '/**/*.html')
        .pipe(gulp.dest(config.buildDir))
});

gulp.task('frontend:css', function() {
    return gulp.src(config.sourceDir + '/**/*.css')
        .pipe(gulp.dest(config.buildDir))
});

gulp.task('frontend:sass', function() {
    return gulp.src(config.sourceDir + '/**/*.scss')
        .pipe(sass({
            style: 'compressed',
            includePaths: [
                config.sourceDir + '/styles',
                config.bowerDir + '/bootstrap-sass/assets/stylesheets'
            ]
        }))
        .pipe(gulp.dest(config.buildDir));
});
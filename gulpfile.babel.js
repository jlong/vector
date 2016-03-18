import gulp from 'gulp';
import requireDir from 'require-dir';

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true });

// The development server (the recommended option for development)
gulp.task("default", ["webpack:server"]);

// Production build
gulp.task("build", ["webpack:build"]);

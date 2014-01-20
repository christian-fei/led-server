var gulp = require("gulp"),
    compass = require("gulp-compass"),
    prefixer = require("gulp-autoprefixer");

gulp.task("default", function(){
    gulp.watch("css/*.scss", function(){
        gulp.src("css/*.scss")
            .pipe(
                compass({
                    "sass":"css",
                    "css":"css",
                    "style":"compressed"
                })
            )
            .pipe(
                prefixer()    
            )
    });
});

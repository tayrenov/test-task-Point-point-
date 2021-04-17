'use stritch';

const fileinclude = require('gulp-file-include');

let project_folder = "dist";
let source_folder = "#src";

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/"
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"], //исключение подключаемых файлов из переноса в dist
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*.ttf",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg, png,svg,gif,ico,webp}"
  },
  claen: "./" + project_folder + "/"
};

let {src, dest} = require('gulp'), //ПОдключение плагинов
  gulp = require('gulp'),
  browsersync = require("browser-sync").create(), //автообновление
  filesinclude = require("gulp-file-include"), //импорт html в html
  scss = require("gulp-sass"), //преобразование scss в css
  autoprefixer=require("gulp-autoprefixer"), //Добавляет префиксы
  group_media = require("gulp-group-css-media-queries"), // Собирает медиазапросы в конец файла
  clean_css = require("gulp-clean-css"), //Чистит css
  rename = require("gulp-rename"), //Используется для создания *.min.css
  uglify = require("gulp-uglify-es").default, //Сжимание js файлов
  imagemin = require("gulp-imagemin"), //Уменьшение веса изображения
  webp = require("gulp-webp"), //Конверт в webp  
  webphtml = require("gulp-webp-html"),//добавление в html конструкцию под webp
  webpcss = require("gulp-webpcss"), //добавление в CSS стиль background конструкцию под webp
  ttf2woff = require("gulp-ttf2woff"), //  Обработка
  ttf2woff2 = require("gulp-ttf2woff2"),//    шрифтов
  fonter = require("gulp-fonter");//otf в woff/woff2
  
function browserSync(params) {
  browsersync.init({
    server:{ 
      baseDir: "./"+project_folder+"/"
    },
    port:3000,
    notify:false
  });
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml({}))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function css() {
  return src(path.src.css)
    .pipe (
      scss({
        outputStyle: "expanded"
      })
    )
    .pipe (
      group_media()
    )
    .pipe (
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade:true
      }) 
    )
    .pipe(webpcss())
    .pipe (dest(path.build.css))
    .pipe (clean_css())
    .pipe (
      rename({
        extname: ".min.css"
      })
    )
    .pipe (dest(path.build.css))
    .pipe (browsersync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe (
      rename({
        extname: ".min.js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality:70 //качество webp
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function fonts() {
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));

  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));    
}

gulp.task('otf2ttf', function(){
  return src([source_folder + '/fonts/*.otf'])
    .pipe(fonter({
      formats: ['ttf']
    }))
    .pipe(dest(source_folder + '/fonts/'));
});

function watchFiles(params) {
  gulp.watch([path.watch.html],html); //Слежка за html
  gulp.watch([path.watch.css],css); //Слежка за css
  gulp.watch([path.watch.js], js);
}

let build = gulp.series(gulp.parallel(js,css,html,images,fonts));
let watch=gulp.parallel(build,watchFiles,browserSync);

exports.fonts = fonts;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
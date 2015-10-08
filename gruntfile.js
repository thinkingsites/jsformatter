var _ = require("lodash");
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //concat : {
    //  merge : {
    //    src : [
    //      "src/_header.js",
    //      "src/polyfill.js",
    //      "src/defaults.js",
    //      "src/utils.js",
    //      "src/getChunks.js",
    //      "src/formatString.js",
    //      "src/formatDate.js",
    //      "src/formatNumber.js",
    //      "src/formatValue.js",
    //      "src/_footer.js",
    //    ],
    //    dest : "build/jsformatter.<%= pkg.version %>.js"
    //  }
    //},
    //uglify: {
    //  mangle : {
    //    files : {
    //      "build/jsformatter.<%= pkg.version %>.min.js"  : ["build/jsformatter.<%= pkg.version %>.js"]
    //    }
    //  }
    //},
    //copy : {
    //  main : {
    //    files : [
    //      {expand: true, flatten: true, filter: 'isFile', src: ['build/jsformatter.<%= pkg.version %>.js'], dest: 'releases/<%= pkg.version %>/' },
    //      {expand: true, flatten: true, filter: 'isFile', src: ['build/jsformatter.<%= pkg.version %>.min.js'], dest: 'releases/<%= pkg.version %>/' },
    //      {expand: true, flatten: true, filter: 'isFile', src: ['gpl-3.0.txt'], dest: 'releases/<%= pkg.version %>/' },
    //      {expand: true, flatten: true, filter: 'isFile', src: ['readme.md'], dest: 'releases/<%= pkg.version %>/' },
    //    ]
    //  }
    //},
    mochacli : {
      build : {
        src : ["build/tests/**/*.js"]
      }
    },
    babel : {
      options : {
        sourceMap : true
      },
      build : {
        files :[
          { expand: true, flatten : false, filter: 'isFile', src : 'src/**/*.js', dest : 'build/' },
          { expand: true, flatten : false, filter: 'isFile', src : 'tests/**/*.js', dest : 'build/' },
        ]
      }
    }
  });

  // because grunt is dumb and doesn't want to load tasks unless explicitly stated
  _(grunt.file.readJSON('package.json').devDependencies)
    .keys()
    .filter(function(key){
      return key.slice(0,6) === "grunt-";
    })
    .each(function(key){
      grunt.loadNpmTasks(key);
    })
    .value();


  // Default task(s)
  grunt.registerTask('default', ['babel','mochacli']);
  grunt.registerTask('test',['default']);
  grunt.registerTask('release', ['test',]);
};

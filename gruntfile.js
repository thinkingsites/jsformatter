module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat : {
      merge : {
        src : [
          "src/_header.js",
          "src/polyfill.js",
          "src/defaults.js",
          "src/utils.js",
          "src/getChunks.js",
          "src/formatString.js",
          "src/formatDate.js",
          "src/formatNumber.js",
          "src/formatValue.js",
          "src/_footer.js",
        ],
        dest : "build/jsformatter.<%= pkg.version %>.js"
      }
    },
    uglify: {
      mangle : {
        files : {
          "build/jsformatter.<%= pkg.version %>.min.js"  : ["build/jsformatter.<%= pkg.version %>.js"]
        }
      }
    },
    copy : {
      main : {
        files : [
          {expand: true, flatten: true, filter: 'isFile', src: ['build/jsformatter.<%= pkg.version %>.js'], dest: 'releases/<%= pkg.version %>/' },
          {expand: true, flatten: true, filter: 'isFile', src: ['build/jsformatter.<%= pkg.version %>.min.js'], dest: 'releases/<%= pkg.version %>/' },
          {expand: true, flatten: true, filter: 'isFile', src: ['gpl-3.0.txt'], dest: 'releases/<%= pkg.version %>/' },
          {expand: true, flatten: true, filter: 'isFile', src: ['readme.md'], dest: 'releases/<%= pkg.version %>/' },
        ]
      }
    },
    mocha : {
      test : {
        src : ["tests/**/*.js"]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-mocha');

  // Default task(s).
  grunt.registerTask('mocha')
  grunt.registerTask('default', ['concat:merge','uglify']);
  grunt.registerTask('release', ['concat:merge','uglify','copy']);
};
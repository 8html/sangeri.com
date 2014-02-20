module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          host: '*',
          port: 3000,
          base: 'site'
        }
      }
    },
    copy: {
      no_need: {

      }
    },
    clean: {
      css: [ 'site/assets/css/*.css' ],
      js: [ 'site/assets/js/*.js' ],
      images: [ 'site/assets/images/**' ],
      site: [ 'site' ],
      tmp: [ 'js/tmp' ]
    },
    less: {
      options: {
        cleancss: true,
        stripBanners: true,
        banner: '/*! Generated on <%= grunt.template.today("dddd, mmmm dS, ' +
          'yyyy, h:MM:ss TT") %> */\n'
      },
      styles: {
        files: {
          'site/assets/css/application.css': [ 'css/index.less' ]
        }
      }
    },
    uglify: {
      javascripts: {
        files: [{
          expand: true,
          cwd: 'js/',
          src: [ '**/*.js', '!**/*.min.js' ],
          dest: 'js/tmp/'
        }]
      }
    },
    concat: {
      options: {
        banner: '/*! Generated on <%= grunt.template.today("dddd, mmmm dS, ' +
          'yyyy, h:MM:ss TT") %> */\n'
      },
      js: {
        files: {
          'site/assets/js/application.js': [
            'js/vendor/jquery-*.min.js',
            'js/vendor/*.min.js',
            'js/tmp/**/*.js'
          ]
        }
      }
    },
    assemble: {
      options: {
        pkg: '<%= pkg %>',
        plugins: [ 'assemble-permalink' ],
        helpers: [ 'handlebars-helper-prettify', 'helpers/*.js' ],
        layoutdir: 'layouts',
        layout: 'default.hbs',
        production: false
      },
      site: {
        files: {
          'site/': [ 'pages/*.hbs' ]
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      css: {
        files: [ 'css/**/*' ],
        tasks: [ 'clean:css', 'less' ]
      },
      js: {
        files: [ 'js/*', 'js/vendor/*' ],
        tasks: [ 'clean:js', 'uglify', 'concat', 'clean:tmp' ]
      },
      grunt: {
        files: [ 'Gruntfile.js' ]
      },
      hbs: {
        files: [ 'layouts/*.hbs', 'pages/*.hbs' ],
        tasks: [ 'assemble' ]
      }
    }
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('common', [
    'clean',
    'less',
    'uglify',
    'concat',
    'clean:tmp',
    'copy'
  ]);

  grunt.registerTask('default', [
    'common',
    'assemble',
    'connect',
    'watch'
  ]);

  grunt.registerTask('make', [
    'common',
    'assemble_in_production',
    'assemble'
  ]);

  grunt.registerTask('assemble_in_production', 'Enter production mode.',
    function() {
    grunt.config('assemble.options.production', true);
    grunt.log.ok('Entered production mode.');
  });

};

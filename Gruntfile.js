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
      images: {
        files: {
          'site/': [ 'images/**' ]
        }
      },
      statics: {
        expand: true,
        cwd: 'static/',
        src: '**',
        dest: 'site/',
        dot: true
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
        plugins: [ 'assemble-permalink', 'helpers/trim.js', 'helpers/all_pages.js' ],
        helpers: [ 'handlebars-helper-prettify', 'helpers/helpers.js' ],
        layoutdir: 'layouts',
        layout: 'default.hbs',
        production: false,
        posts: {
          cases: grunt.file.readYAML('posts/cases.yml'),
          catalogue: grunt.file.readYAML('posts/catalogue.yml'),
          teams: grunt.file.readYAML('posts/teams.yml')
        }
      },
      news: {
        options: {
          layout: 'news.hbs',
          permalink: '/news/{{ category }}/{{ basename }}.html'
        },
        files: {
          'site/': [ 'pages/news*.hbs', 'posts/news/**/*.html' ]
        }
      },
      cases: {
        options: {
          layout: 'cases.hbs',
          pages: '<%= assemble.options.posts.cases %>'
        },
        files: { 'site/': [] }
      },
      catalogue: {
        options: {
          layout: 'catalogue.hbs',
          pages: '<%= assemble.options.posts.catalogue %>'
        },
        files: { 'site/': [] }
      },
      teams: {
        options: {
          layout: 'teams.hbs',
          pages: '<%= assemble.options.posts.teams %>'
        },
        files: { 'site/': [] }
      },
      site: {
        files: {
          'site/': [ 'pages/*.hbs', '!pages/news*.hbs', '!pages/~*.hbs' ]
        }
      },
      sitemap: {
        files: {
          'site/': [ 'pages/~sitemap.hbs' ]
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
        files: [ 'layouts/*.hbs', 'pages/*.hbs', 'helpers/*' ],
        tasks: [ 'assemble' ]
      },
      news: {
        files: [ 'posts/news/**' ],
        tasks: [ 'assemble:news' ]
      },
      cases: {
        files: [ 'posts/cases.yml' ],
        tasks: [ 'assemble:cases' ]
      },
      catalogue: {
        files: [ 'posts/catalogue.yml' ],
        tasks: [ 'assemble:catalogue' ]
      },
      teams: {
        files: [ 'posts/teams.yml' ],
        tasks: [ 'assemble:teams' ]
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

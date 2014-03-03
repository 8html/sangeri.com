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
          teams: grunt.file.readYAML('posts/teams.yml')
        }
      },
      news: {
        options: {
          layout: 'news.hbs',
          permalink: '/news/{{ basename }}.html'
        },
        files: {
          'site/': [ 'pages/news*.hbs', 'posts/news/**/*.html' ]
        }
      },
      cases: {
        options: {
          layout: 'cases.hbs',
          pages: '/cases/{{ basename }}.html>'
        },
        files: { 'pages/cases*.hbs', 'posts/cases/**/*.html' }
      },
      catalogue: {
        options: {
          layout: 'catalogue.hbs',
          pages: 'pages/catalogue*.hbs', 'posts/catalogue/**/*.html'
        },
        files: { 'pages/catalogue*.hbs', 'posts/catalogue/**/*.html' }
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
        files: [ 'posts/cases/**' ],
        tasks: [ 'assemble:cases' ]
      },
      catalogue: {
        files: [ 'posts/catalogue/**' ],
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
    'hash',
    'clean:tmp',
    'assemble_in_production',
    'assemble'
  ]);

  grunt.registerTask('assemble_in_production', 'Enter production mode.',
    function() {
    grunt.config('assemble.options.production', true);
    grunt.log.ok('Entered production mode.');
  });

  grunt.registerTask('hash', 'Generate asset hash filenames', function() {
    var path = require('path');
    var crypto = require('crypto');
    var fs = require('fs');
    var sitedir = 'site';
    var assets = grunt.file.expand({
      cwd: sitedir
    }, 'assets/js/*.js', 'assets/css/*.css');
    var compiled_assets = grunt.config('assemble.options.compiled_assets') || {};
    for (var i = 0; i < assets.length; i++) {
      var old_filename = path.join(sitedir, assets[i]);
      var js = fs.readFileSync(old_filename);
      shasum = crypto.createHash('sha1');
      shasum.update(js);
      var hash = shasum.digest('hex');
      var dot = old_filename.lastIndexOf('.');
      if (dot === -1) dot = undefined;
      var new_filename = old_filename.slice(0, dot);
      new_filename += '-' + hash + old_filename.slice(dot);
      fs.renameSync(old_filename, new_filename);
      grunt.log.ok('File ' + old_filename + ' renamed to ' + new_filename);
      var site = sitedir.length;
      compiled_assets[old_filename.slice(site)] = new_filename.slice(site);
    }
    grunt.config('assemble.options.compiled_assets', compiled_assets);
  });

};

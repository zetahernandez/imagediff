module.exports = function(grunt) {

  require("load-grunt-tasks")(grunt);
  require("time-grunt")(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      files: ["Gruntfile.js", "lib/**/*.js", "test/**/*.js"],
      options: {
        jshintrc: "./.jshintrc"
      }
    },
    express: {
      options: {
        // Override defaults here
      },
      dev: {
        options: {
          script: 'bin/www'
        }
      }
    },
    simplemocha: {
      all: {
        src: "test/**/*.test.js"
      },
      options: {
        reporter: "spec",
        ui: "bdd"
      }
    },
    watch: {
      express: {
        files: ['**/*.js'],
        tasks: ['express:dev'],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      }
    },
    release: {
      options: {
        npm: false
      }
    }
  });

  // Default task.
  grunt.registerTask('server', ['express:dev', 'watch']);

};
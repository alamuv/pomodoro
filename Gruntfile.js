module.exports = (grunt) => {
  
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    "babel": {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'client/features',
          src: ['**/*.js'],
          dest: 'dist/features',
          ext: '.js'
        },
        {
          "dist/app.js": "client/app.js"
        }]
      }
    }
  });

  grunt.registerTask("default", ["babel"]);
}
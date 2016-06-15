module.exports = (grunt) => {
  
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    "babel": {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          "dist/app.js": "client/app.js"
        }
      }
    }
  });

  grunt.registerTask("default", ["babel"]);
}

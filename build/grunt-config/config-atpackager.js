/*
 * Copyright 2012 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 /**
 * Atpackager grunt configuration.
 * @param {Object} grunt
 */

 module.exports = function (grunt) {

  var atExtensions = [
    '**/*.js',
    '**/*.tpl',
    '**/*.tpl.css',
    '**/*.tml',
    '**/*.cml',
    '**/*.tpl.txt'
  ];
  var path = process.env.npm_package_name.replace(".", "/");

  grunt.initConfig({
    cfg : {
      // sets a configuration variable to be reused in multiple places:
      header : '/*\n * Copyright <%= grunt.template.today("yyyy") %> Plugin developer. \n */\n'
    },
    atpackager : {
      build : {
        options : {
          sourceDirectories : [
            "src"  /* folder where the plugin is located */
          ],
          outputDirectory : 'build/output',
          ATBootstrapFile : 'aria/bootstrap.js',
          ATDirectories : ['node_modules/ariatemplates/src'], /* folder where the Aria Templates framework is located */

          sourceFiles : atExtensions,
          defaultBuilder : {
            type : 'ATMultipart',
            cfg : {
              header : '<%= cfg.header %>'
            }
          },
          packages : [
            {
              "name" : process.env.npm_package_name + ".js",
              "files" : [
                path + "/**/*"
              ]
            }
          ],
          visitors : [
            'ATCompileTemplates',
            'ATRemoveDoc',
            {
              type : 'JSMinify',
              cfg : {
                files : atExtensions
              }
            },
            {
              type : 'Hash',
            },
            {
              type : 'ATUrlMap',
              cfg : {
                mapFile : process.env.npm_package_name + '.js'
              }
            }
          ]
        }
      }
    }
  });

  grunt.config.set('gzipStats.output', {
    src : 'build/output'
  });

  grunt.config.set('removedirs.output', {
    folders : ['build/output']
  });

  // The default task is to run atpackager
  grunt.registerTask('build', [
    'atpackager:build'
  ]);
};
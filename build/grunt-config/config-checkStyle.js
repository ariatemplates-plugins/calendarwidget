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
 * Style-checking grunt configuration.
 * @param {Object} grunt
 */
module.exports = function (grunt) {
    grunt.config.set('jshint', {
        options : require('../config/jshint.json'),
        build : {
            options : require('../config/jshint-build.json'),
            src : ['Gruntfile.js', 'build/config/*.json', 'build/grunt-tasks/*.js',
                    'build/grunt-config/*.js', 'build/*.js']
        },
        source : {
            src : ['src/**/*.js']
        },
        test : {
            files : {
                src : ['test/**/*.js']
            },
            options : {
                "globals" : {
                    "aria": false,
                    "Aria": false,
                    "setTimeout": false,
                    "setInterval": false,
                    "clearTimeout": false,
                    "clearInterval": false,
                    "test": false,
                    "Syn": false
                }
            }
        }
    });

    grunt.config.set('verifylowercase.sourceFiles', {
        src : ['src/**', 'test/**']
    });

    grunt.config.set('leadingIndent.indentation', 'spaces');
    grunt.config.set('leadingIndent.jsFiles', {
        src : ['src/**/*.js', 'test/**/*.js']
    });

    grunt.registerTask('checkStyle', ['jshint', 'verifylowercase:sourceFiles', 'leadingIndent:jsFiles']);
};

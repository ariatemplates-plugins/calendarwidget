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

var path = require("path");
var express = require("express");
var app = express();

app.get("/", function (req, res) {
    res.sendfile(path.normalize(__dirname + "/../sample/index.html"));
});

app.all(/^(.*)$/, function (req, res, next) {
    var targetFile = req.params[0];
    var appPath = "/" + process.env.npm_package_name.replace(".", "/") + "/";
    if (targetFile.indexOf(process.env.npm_package_name) >= 0) {
        res.sendfile(path.normalize(__dirname + "/../build/output" + targetFile));
    }
    else if (targetFile.indexOf(appPath) === 0) {
        res.sendfile(path.normalize(__dirname + "/../src" + targetFile));
    }
    else {
        res.sendfile(path.normalize(__dirname + "/../sample" + targetFile));
    }
});

// Default to 8080 if we're not using npm
var port = process.env.npm_package_config_port || 8080;
var server = app.listen(port);

server.on("listening", serverStarted);
server.on("error", function () {
    // Retry on a random port
    console.error("Configured port is not available, using a random address");
    server = app.listen(0);
    server.on("listening", serverStarted);
});

function serverStarted () {
    console.log("Server started on http://localhost:" + server.address().port);
    console.log("Dev mode available at http://localhost:" + server.address().port + "/index.html?devMode=true");
}

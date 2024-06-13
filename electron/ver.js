/*
 * Copyright 2024 amarullz.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *______________________________________________________________________________
 *
 * Filename    : ver.js
 * Description : Version Generator
 *
 */
const process = require("process");
const fs = require("fs");
function pad2(v) {
  return ("00" + v).slice(-2);
}
var appgradle = fs.readFileSync("app/build.gradle","utf8");
var sp=appgradle.split('versionCode');
sp = sp[1].split('versionName');
var vercode=JSON.parse(sp[0].trim());
sp = sp[1].split('\n');
var vername=JSON.parse(sp[0].trim());

var ver = {};
ver.code = vercode;
ver.version = vername;
var dt = new Date();
ver.build =
  pad2(dt.getFullYear()-2000) +
  pad2(dt.getMonth()) +
  pad2(dt.getDate()) +
  pad2(dt.getHours()) +
  pad2(dt.getMinutes());
var out_info = JSON.stringify(ver, " ", 1);
var out = "module.exports =" + out_info + ";";

if (process.argv.length>0 && process.argv[process.argv.length-1]=='build'){
  console.log("Writing Versions:\n"+out);
  fs.writeFileSync("electron/src/version.js", out);
  fs.writeFileSync("electron/builds/version.json", out_info);
  fs.writeFileSync("electron/builds/version.txt", vername);
}
module.exports = ver;

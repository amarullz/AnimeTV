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
 * Filename    : common.js
 * Description : Common libraries
 *
 */
 const { app, ipcMain } = require("electron");
const path = require("path");
const { pathToFileURL } = require('url')

const common={
  main:{
    /* animetv.js global object */
  },
  view_dir:"/app/src/main/assets/view/",
  path(filename){
    return path.join(app.getAppPath(), filename);
  },
  viewRequest(path){
    let viewpath = common.path(common.view_dir+path);
    return pathToFileURL(viewpath).toString();
  }
};

module.exports = common;
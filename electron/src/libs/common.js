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
const fs = require("fs");

const common={
  UAG: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, " +
          "like Gecko) Chrome/131.0.0.0 Safari/537.36",
  // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
  // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
  dns:[
    "aniwave.to", /* default */
    "aniwave.to",
    "anix.to",
    "hianime.to",
    "aniwatchtv.to",
    "animeflix.live",
    "kaas.to",
    "api.gojo.live",
    "www.miruro.tv"
  ],
  main:{
    /* animetv.js global object */
  },
  config:{},
  view_dir:"/app/src/main/assets/view/",
  inject_dir:"/app/src/main/assets/inject/",
  ui_dir:"/electron/src/ui/",
  path(filename){
    return path.join(app.getAppPath(), filename);
  },
  readfile(fn){
    if (fs.existsSync(fn)){
      return fs.readFileSync(fn, "utf8");
    }
    return "";
  },
  injectPath(path){
    return common.path(common.inject_dir+path);
  },
  uiRequest(path){
    let uipath = common.path(common.ui_dir+path);
    return pathToFileURL(uipath).toString();
  },
  injectRequest(path){
    let injectpath = common.path(common.inject_dir+path);
    return pathToFileURL(injectpath).toString();
  },
  viewRequest(path){
    let viewpath = common.path(common.view_dir+path);
    return pathToFileURL(viewpath).toString();
  },
  userPath(){
    return app.getPath('userData');
  },
  configPath(){
    return path.join(common.userPath(), "config.json");
  },
  configLoad(){
    let cfg_path = common.configPath();
    console.log("[CONFIG][LOAD] "+cfg_path);
    if (fs.existsSync(cfg_path)){
      try{
        var fcfg=fs.readFileSync(cfg_path, "utf8");
        var cfg_test=JSON.parse(fcfg);
        if (typeof cfg_test === 'object'){
          common.config=JSON.parse(fcfg);
          console.log("[CONFIG][LOAD][LOADED]");
        }
      }catch(e){}
    }
  },
  configSave(){
    try{
      console.log("[CONFIG][SAVE] Saved..");
      let cfg_data = JSON.stringify(common.config, null, '\t');
      fs.writeFileSync(common.configPath(),cfg_data, "utf8");
    }catch(e){}
  },
  execJs(js){
    common.main.win.webContents.executeJavaScript('try{'+js+'}catch(e){}');
  }
};

module.exports = common;
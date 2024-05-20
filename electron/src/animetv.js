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
 * Filename    : animetv.js
 * Description : Node/electron main program
 *
 */
const { app, BrowserWindow, dialog, screen, ipcMain, shell } = require("electron");
const common = require("./libs/common.js");
const intercept = require("./libs/intercept.js");

const main={
  init(){
    var mainDisplay = screen.getPrimaryDisplay();
    var dw = mainDisplay.size.width * 3 / 4;
    var dh = Math.floor((mainDisplay.size.height * 3 / 4) * 1.05);
    
    /* Create new window */
    main.win=new BrowserWindow({
      fullscreen: false,
      autoHideMenuBar: true,
      show: true,
      width: dw,
      height: dh,
      minWidth: 1280,
      minHeight: 760,
      icon:common.path("/tools/logo-design/animetv-logo/animetv-logo-square.png"),
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: true,
        preload: common.path("/electron/src/preload.js"),
      }
    });

    /* Init all handlers */
    ipcMain.on("main",main.handlerWin);
    main.win.webContents.on("before-input-event",main.handlerKeys);
    ipcMain.on('config-load', main.handlerConfigLoad);
    ipcMain.on('vars-load', main.handlerVarsLoad);
    ipcMain.handle('config-save', main.handlerConfigSave);
    ipcMain.handle('vars-save', main.handlerVarsSave);
    ipcMain.handle('intent-start', main.handlerIntent);
    ipcMain.handle('set-url', (e,d)=>{
      if (d!=''){
        main.win.loadURL(d);
      }
    });

    /* init values */
    if ('__sd' in common.config){
      main.vars.sd=common.config.__sd;
    }
    main.vars.dns=common.dns;

    /* Go home & show */
    main.goHome();
    main.win.setMenu(null);
    main.win.show();
  },
  dns(){
    return common.dns[main.vars.sd];
  },
  vars:{
    profile_sel:-1,
    profile_prefix:'',
    sd:1,
    sd_domain:''
  },
  handlerIntent(e,d){
    shell.openExternal(d);
  },
  handlerVarsLoad(e,d){
    e.returnValue = main.vars;
    return main.vars;
  },
  handlerVarsSave(e,d){
    main.vars=JSON.parse(d);
  },
  handlerConfigLoad(e,d){
    e.returnValue = common.config;
    return common.config;
  },
  handlerConfigSave(e,d){
    common.config=JSON.parse(d);
    common.configSave();
  },
  handlerKeys(e,input){
    if (input.type === "keyDown") {
      if (input.key==="F10"){
        // Settings
        main.win.loadURL("https://"+main.dns()+"/__view/test.html");
      }
      else if (input.key === "F12") {
        // dev console
        main.win.webContents.toggleDevTools();
      } else if (input.key === "F11"){
        // fullscreen
        main.win.fullScreen = !main.win.isFullScreen();
      }
      else if (input.key === "F1"){
        // reload
        main.win.reload();
      }
      else if (input.key === "F5"){
        // go home
        main.goHome();
      }
      else if (input.key === "F8"){
        // video player
        main.win.loadURL("https://"+main.dns()+"/__ui/player.html");
      }
      else{
        let c=0;
        let send = (input.type=="keyDown");
        switch(input.key.toLowerCase()){
          case "escape":
            c=27;
            break;
          case "enter":
            c=send?13:1013;
            send=true;
            break;
          case "arrowup": c=38; break;
          case "arrowdown": c=40; break;
          case "arrowleft": c=37; break;
          case "arrowright": c=39; break;
        }
        if (send && c){
          common.execJs(
            "window._KEYEV(" + c + ")"
          );
          e.preventDefault();
        }
      }
    }
  },
  handlerWin(event, arg){
    if (arg == "fullscreen") main.win.fullScreen = true;
    else if (arg == "no-fullscreen") main.win.fullScreen = false;
    else if (arg == "home") main.goHome();
    else if (arg == "quit") app.exit();
    else if (arg == "restart"){
      app.relaunch();
      app.exit();
    }
  },
  goHome(){
    main.win.loadURL("https://"+main.dns()+"/__view/main.html");
  },
  path(filename) {
    return path.join(app.getAppPath(), filename);
  }
};

/* Init startup */
common.main=main;
intercept.init();
common.configLoad();

/* When application ready */
app.whenReady().then(() => {
  intercept.start();
  main.init();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0){
      main.init();
    }
  });
});

/* When window closed */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

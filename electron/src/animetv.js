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
const path = require("path");

/* squirrel install */
if (process.platform === 'win32'){
  const args = require('./win/args.js');
  const squirrel = require('./win/squirrel.js');
  const cmd = args.parseArguments(app, process.argv.slice(1)).squirrelCommand;
  if (squirrel.handleCommand(app, cmd)) {
    return;
  }
}

const common = require("./libs/common.js");
const intercept = require("./libs/intercept.js");

/* ignore connection limit on source domains */
app.commandLine.appendSwitch('ignore-connections-limit', common.dns.join(", "));

const main={
  initialized:false,
  init(){
    var mainDisplay = screen.getPrimaryDisplay();
    var dw = mainDisplay.size.width * 3 / 4;
    var dh = mainDisplay.size.height * 3 / 4;

    /* init values */
    if ('__sd' in common.config){
      main.vars.sd=common.config.__sd;
    }
    if ('initwinstate' in common.config){
      main.vars.initwinstate=common.config.initwinstate;
      main.vars.fullscreen=(main.vars.initwinstate==2);
    }
    main.vars.dns=common.dns;

    if (process.argv[process.argv.length-1]=="kiosk"){
      main.vars.kiosk=1;
      main.vars.fullscreen=true;
    }
    
    /* Create new window */
    main.win=new BrowserWindow({
      fullscreen: main.vars.fullscreen,
      autoHideMenuBar: true,
      show: false,
      width: dw,
      height: dh,
      minWidth: 320,
      minHeight: 320,
      backgroundColor: '#000000',
      icon:common.path("/tools/logo-design/animetv-logo/animetv-logo-square.png"),
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        nodeIntegrationInSubFrames:true,
        contextIsolation: true,
        sandbox: false,
        preload: common.path("/electron/src/preload.js"),
      }
    });
    if (!main.vars.kiosk && main.vars.initwinstate==1){
      /* maximized */
      main.win.maximize();
    }
    main.win.setMenu(null);
    main.win.webContents.setUserAgent(common.UAG);

    /* Init all handlers */
    if (!main.initialized){
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
      ipcMain.handle('exec-js', (e,d)=>{
        common.execJs(d);
      });
      main.initialized=true;
    }

    /* Go home & show */
    // main.win.setContentSize(dw, dh);
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
    stream_server:0,
    stream_type:0,
    sd:1,
    httpclient:0,
    sd_domain:'',
    fullscreen:false,
    initwinstate:0,
    kiosk:0,
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
      if (input.key === "F12") {
        // dev console
        main.win.webContents.toggleDevTools();
      } else if (input.key === "F10" || input.key === "F11"){
        // fullscreen
        main.fullScreen(!main.isFullScreen());
      }
      else if (input.key === "F1"){
        // reload
        main.win.reload();
      }
      else if (input.key === "F5"){
        // go home
        main.goHome();
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
    if (arg == "fullscreen") main.fullScreen(true);
    else if (arg == "no-fullscreen") main.fullScreen(false);
    else if (arg == "toggle-fullscreen") main.fullScreen(!main.isFullScreen());
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
  },
  fullScreen(stat){
    if (main.vars.kiosk){
      return;
    }
    if (process.platform !== "darwin"){
      main.win.setFullScreen(stat);
    }
    else{
      main.win.setSimpleFullScreen(stat);
    }
    main.vars.fullscreen=stat;
    common.execJs(
      "_JSAPI.fullscreenCb(" + (stat?"true":"false") + ");_API.fullscreenCb(" + (stat?"true":"false") + ")"
    );
  },
  isFullScreen(){
    if (process.platform !== "darwin"){
      return main.win.isFullScreen();
    }
    else{
      return main.win.isSimpleFullScreen();
    }
  }
};

/* Init startup */
common.main=main;
common.configLoad();

/* When application ready */
app.whenReady().then(() => {
  intercept.init();
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

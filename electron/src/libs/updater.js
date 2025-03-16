const { net, protocol, app } = require('electron')
const fs = require('fs')
const { spawn } = require('child_process')
const zlib = require('zlib');

const updateAsarFn='update.asar.bin';

const updaterWin32 = `@echo off
cd /D "%~dp0"
IF EXIST `+updateAsarFn+` (
  echo Updating
  timeout 2
  del /F /Q app.asar.bak
  ren app.asar app.asar.bak
  ren `+updateAsarFn+` app.asar
) ELSE (
  echo Not Updating
)
cd ..
start /b AnimeTV
`;

const updaterUnix = `#!/bin/sh
cd "$(dirname "$0")"
if [ -e `+updateAsarFn+` ]
then
    echo "Updating"
    sleep 2
    rm -f app.asar.bak
    mv app.asar app.asar.bak
    mv `+updateAsarFn+` app.asar
else
    echo "Not Updating"
fi

cd ..
nohup ./animetv &> /dev/null &disown
`;

function getAppPath(){
  const AppPath = app.getAppPath();
  const l = AppPath.length;
  const isAsar = AppPath.substring(l-8);
  if (isAsar!='app.asar'){
    /* it's npm start, don't update */
    return null;
  }
  const resPath = AppPath.substring(0,l-8);
  return resPath;
}

const updater={
  updateDownload(url, cb){
    function callCb(v){
      if (cb){
        cb(v);
      }
    }
    const resPath=getAppPath();
    if (!resPath){
      callCb(false);
      return;
    }
    const savePath=resPath+updateAsarFn;
    net.fetch(
      url,
      {
        method: "GET",
        bypassCustomProtocolHandlers: false
      }
    ).then(function(f){
      console.log("FETCH OK");
      f.bytes().then(function(body){
        try{
          console.log("Body OK: "+body.length);
          var data = zlib.gunzipSync(body);
          console.log("gunzipSync OK: "+data.length+' -> '+savePath);
          fs.writeFileSync(savePath,data,{ 
            flag: "w+"
          });
          callCb({save:savePath, size:body.length});
        }
        catch(e){
          callCb(false);
        }
      }).catch(function(reason){
        console.log("FETCH BODY ERROR: "+reason);
        callCb(false);
      });
    }).catch(function(reason){
      console.log("FETCH ERROR: "+reason);
      callCb(false);
    });
  },
  update(){
    const resPath = getAppPath();
    if (!resPath){
      return false;
    }
    const updatePath = resPath+updateAsarFn;

    if (!fs.existsSync(updatePath)){
      /* no update asar */
      console.log("No Update Asar...");
      return false;
    }

    /* WINDOWS */
    if (process.platform === 'win32'){
      console.log("Updating Windows...")
      const updaterPath = resPath+'updater.bat';
      fs.writeFileSync(updaterPath, updaterWin32, { 
        flag: "w+", 
        mode: 0o777 
      });
      spawn('cmd', ['/c', updaterPath], {
        detached: true,
        stdio: 'ignore'
      });
    }
    else{
      console.log("Updating Linux...")
      const updaterPath = resPath+'updater.sh';
      fs.writeFileSync(updaterPath, updaterUnix, { 
        flag: "w+", 
        mode: 0o777 
      });
      spawn('bash', [updaterPath], {
        detached: true,
        stdio: 'ignore'
      });
    }

    /* Quit */
    app.exit(0);
    app.quit(0);
    return true;
  }
};

module.exports = updater;
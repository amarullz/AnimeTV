const { app } = require('electron')
const fs = require('fs')
const { spawn } = require('child_process')

const updaterWin32 = `@echo off
cd /D "%~dp0"
IF EXIST update.asar (
  echo Updating
  timeout 2
  del /F /Q app.asar.bak
  ren app.asar app.asar.bak
  ren update.asar app.asar
) ELSE (
  echo Not Updating
)
cd ..
start /b AnimeTV
`;

const updaterUnix = `#!/bin/sh
cd "$(dirname "$0")"
if [ -e update.asar ]
then
    echo "Updating"
    sleep 2
    rm -f app.asar.bak
    mv app.asar app.asar.bak
    mv update.asar app.asar
else
    echo "Not Updating"
fi

cd ..
nohup ./animetv &> /dev/null &disown
`;

const updater={
  update(){
    const AppPath = app.getAppPath();
    const l = AppPath.length;
    const isAsar = AppPath.substring(l-8);
    if (isAsar!='app.asar'){
      /* it's npm start, don't update */
      return false;
    }
    const resPath = AppPath.substring(0,l-8);
    const updatePath = resPath+"update.asar";

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
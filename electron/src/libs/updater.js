const { net, protocol, app } = require('electron')
const fs = require('fs')
const { spawn } = require('child_process')
const zlib = require('zlib');
const path = require("path");
const sudoPrompt = require("@vscode/sudo-prompt");
const common = require("./common.js");
const updateAsarFn='update.asar.bin';

function waiterWin32(dir,fn){
  return `@echo off
cd /D "`+dir+`"
SET LookForFile="`+fn+`"
echo Updating AnimeTV
:CheckForFile
IF NOT EXIST %LookForFile% GOTO FoundIt
TIMEOUT /T 3 /NOBREAK > nul
GOTO CheckForFile
:FoundIt
cd ..
start /b AnimeTV
`;
}

function updaterWin32(dir,fn,addstr){
  return `@echo off
cd /D "`+dir+`"
echo Updating AnimeTV
copy /y "`+fn+`" `+updateAsarFn+` > nul
IF EXIST `+updateAsarFn+` (
  TIMEOUT /T 4 /NOBREAK > nul
  del /F /Q app.asar.bak > nul
  ren app.asar app.asar.bak > nul
  ren `+updateAsarFn+` app.asar > nul
) ELSE (
  echo Not Updating
)
del /F /Q "`+fn+`" > nul
cd ..
`+addstr+`
`;
}

function updaterUnix(dir,fn,addstr){
  return `#!/bin/sh
cd "`+dir+`"
cp -f "`+fn+`" `+updateAsarFn+`
if [ -e `+updateAsarFn+` ]
then
    echo "Updating"
    sleep 4
    rm -f app.asar.bak
    mv app.asar app.asar.bak
    mv `+updateAsarFn+` app.asar
else
    echo "Not Updating"
fi
rm -f "`+fn+`"
cd ..
`+addstr+`
`;
}

function waiterUnix(dir,fn){
  return `#!/bin/sh
cd "`+dir+`"
echo Updating AnimeTV
while [ -f "`+fn+`" ]
do
  sleep 2
done
cd ..
nohup ./animetv &> /dev/null &disown
`;
}

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
    const savePath=path.join(common.userPath(), updateAsarFn);
    const movePath=resPath+updateAsarFn;
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
          callCb({save:savePath, movePath:movePath, size:body.length});
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
  update(savePath){
    const resPath = getAppPath();
    if (!resPath){
      return false;
    }

    if (savePath){
      if (!fs.existsSync(savePath)){
        /* no update asar */
        console.log("No Downloaded Update Asar...");
        return false;
      }
    }
    else{
      savePath = path.join(common.userPath(), updateAsarFn);
      if (!fs.existsSync(savePath)){
        /* no update asar */
        console.log("No Update Asar...");
        return false;
      }
    }

    /* WINDOWS */
    if (process.platform === 'win32'){
      console.log("Updating Windows...");
      var updated=false;

      try {
        /* No Need SUDO */
        console.log("Testing Writable...");
        var testPath=path.join(resPath,'testupdate.txt');
        fs.writeFileSync(testPath, 'test', { flag: "w+"});
        if (fs.existsSync(testPath)){
          console.log("Non-Admin Update...");
          fs.unlinkSync(testPath);
          var updaterPathNoAdmin = path.join(common.userPath(), 'updater.bat');
          fs.writeFileSync(updaterPathNoAdmin, updaterWin32(resPath,savePath,'start /b AnimeTV'), {
            flag: "w+", 
            mode: 0o777 
          });
          spawn('cmd',['/c',updaterPathNoAdmin], {
            detached: true,
            stdio: 'ignore',
            windowsHide: false,
            shell:true
          });
          updated=true;
        }
        else{
          console.log("Non writable...");
        }
      } catch (err) {
        console.log("Exception:"+err);
        updated=false;
      }
      if (!updated){
        console.log("Admin Update...");
        var updaterPath = path.join(common.userPath(), 'updater.bat');
        fs.writeFileSync(updaterPath, updaterWin32(resPath,savePath,''), { 
          flag: "w+", 
          mode: 0o777 
        });

        var waiterPath = path.join(common.userPath(), 'waiter.bat');
        fs.writeFileSync(waiterPath, waiterWin32(resPath,savePath), { 
          flag: "w+", 
          mode: 0o777 
        });
        
        console.log("EXEC: "+updaterPath);
        sudoPrompt.exec('cmd /c "'+updaterPath+'"', {
          name: 'AnimeTV',
          shell: true
        }, (error, stdout, stderr) => {
        });

        console.log("EXEC: "+waiterPath);
        spawn('cmd',['/c',waiterPath], {
          detached: true,
          stdio: 'ignore',
          windowsHide: false,
          shell:true
        });
      }
    }
    else{
      console.log("Updating Linux...");
      var updated=false;

      try {
        /* No Need SUDO */
        console.log("Testing Writable...");
        var testPath=path.join(resPath,'testupdate.txt');
        fs.writeFileSync(testPath, 'test', { flag: "w+"});
        if (fs.existsSync(testPath)){
          console.log("Non-sudo Update...");
          fs.unlinkSync(testPath);
          var updaterPathNoAdmin = path.join(common.userPath(), 'updater.sh');
          fs.writeFileSync(updaterPathNoAdmin, updaterUnix(resPath,savePath,'nohup ./animetv &> /dev/null &disown'), {
            flag: "w+", 
            mode: 0o777 
          });
          spawn('bash',[updaterPathNoAdmin], {
            detached: true,
            stdio: 'ignore',
            windowsHide: false,
            shell:true
          });
          updated=true;
        }
        else{
          console.log("Non writable...");
        }
      } catch (err) {
        console.log("Exception:"+err);
        updated=false;
      }
      if (!updated){
        console.log("Linux sudo updating...");
        var updaterPath = path.join(common.userPath(), 'updater.sh');
        fs.writeFileSync(updaterPath, updaterUnix(resPath,savePath,''), { 
          flag: "w+", 
          mode: 0o777 
        });

        var waiterPath = path.join(common.userPath(), 'waiter.sh');
        fs.writeFileSync(waiterPath, waiterUnix(resPath,savePath), { 
          flag: "w+", 
          mode: 0o777 
        });

        console.log("EXEC: "+updaterPath);
        sudoPrompt.exec('bash "'+updaterPath+'"', {
          name: 'AnimeTV',
        }, (error, stdout, stderr) => {
        });

        console.log("EXEC: "+waiterPath);
        spawn('bash',[waiterPath], {
          detached: true,
          stdio: 'ignore',
          windowsHide: true,
          shell:true
        });
      }
    }

    /* Quit */
    setTimeout(function(){
      app.exit(0);
      app.quit(0);
    },2000);
    
    return true;
  }
};

module.exports = updater;
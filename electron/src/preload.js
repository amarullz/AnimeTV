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
 * Description : Node/electron preload js
 *
 */
const { remote, contextBridge, ipcRenderer } = require("electron");
const send = (m, a) => ipcRenderer.send(m, a);
const on = (m, c) => ipcRenderer.on(m, c);
const CryptoJS = require("crypto-js");

const vars={
  vars:{},
  config:{},
  window:null
};

async function invoke(c,d){
  return await ipcRenderer.invoke(c,d).then();
}

/* Config Loader */
(async function(){
  vars.config =ipcRenderer.sendSync('config-load','');
  vars.vars =ipcRenderer.sendSync('vars-load','');
})();

const api={
  /* app functions */
  isElectron(){ return true; },
  appQuit() {
    send("main", "quit");
  },
  reloadHome(){
    send("main", "home");
  },

  /* videos */
  videoSetUrl(url){
    // console.warn("SET VIDEO: "+url);
    // invoke('set-url',url);
  },
  videoSetPosition(pos){},
  videoPlay(play){},
  videoGetDuration(){ return 0 },
  videoGetPosition(){ return 0 },
  videoBufferPercent() { return 0 },
  videoIsPlaying(){ return false },
  videoTracks(){},
  videoSetSpeed(speed){},
  videoSupportSpeed(){ return true },
  videoSetScale(type){},
  setStreamType(type, clean){
    vars.vars.stream_type=type;
    invoke('vars-save',JSON.stringify(vars.vars));
  },
  setStreamServer(mirror, clean){
    vars.vars.stream_server=mirror;
    invoke('vars-save',JSON.stringify(vars.vars));
  },
  getStreamType(){ return vars.vars.stream_type; },

  /* storage */
  storeGet(key, def){
    if (key in vars.config){
      return vars.config[key];
    }
    return def;
  },
  storeSet(key, value){
    vars.config[key]=value;
    invoke('config-save',JSON.stringify(vars.config));
  },
  storeDel(key){
    if (key in vars.config){
      delete vars.config[key];
      invoke('config-save',JSON.stringify(vars.config));
    }
  },

  /* profiles */
  profileGetSel(){ return vars.vars.profile_sel; },
  profileGetPrefix(){ return vars.vars.profile_prefix; },
  profileSetSel(v){ 
    vars.vars.profile_sel=v; 
    invoke('vars-save',JSON.stringify(vars.vars));
  },
  profileSetPrefix(v){
    vars.vars.profile_prefix=v;
    invoke('vars-save',JSON.stringify(vars.vars));
  },

  /* network functions */
  dns(){ return vars.vars.dns[vars.vars.sd]; },
  flix_dns(){ return "api.animeflix.dev"},
  getSd(){ return vars.vars.sd; },
  setSd(s){
    vars.vars.sd=s;
    vars.config.__sd=s;
    invoke('vars-save',JSON.stringify(vars.vars));
    invoke('config-save',JSON.stringify(vars.config));
  },
  setSdomain(s){
    vars.vars.sd_domain=s;
    invoke('vars-save',JSON.stringify(vars.vars));
  },
  getSdomain(){ return vars.vars.sd_domain; },

  /* networks config */
  setProgCache(v){},
  setDOH(v){},
  setHttpClient(v){},
  getCacheSz(){ return 100; },
  setCacheSz(s){},
  clearCache(){},

  /* versioning */
  dnsver(){ return '1.0-ELECTRON'; },
  getVersion(type){
    if (type==0)
      return "5.0.0";
    else if (type==2)
      return "500";
    return "2307210136";
  },

  /* encryptions */
  sha1sum(value) { return CryptoJS.enc.Hex.stringify(CryptoJS.SHA1(value)); },
  aesDec(cipherText, key, ivhex) {
    var val=CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(cipherText),
        salt: ""
      }, 
      CryptoJS.enc.Utf8.parse(key),{
      iv:CryptoJS.enc.Hex.parse(ivhex)
    });
    return val.toString(CryptoJS.enc.Utf8);
  },
  vidEncode(vid, k1, k2){ return ""; },

  /* android specific */
  playClick(){},
  showToast(txt){},
  setBrightness(b){ return 50; },
  setVolume(b){ return 50; },

  /* misc */
  setLandscape(stat){},
  getHaveTouchscreen(){ return true },
  
  /* android will not implemented */
  getSysHeight(nav){ return 0 },
  haveMic(checkSpeech){ return false },
  installApk(url,isNightly){},
  isOnUpdate(){ return true },
  showIme(show){},
  getArg(name){ return ""; },
  clearArg(){},
  playNextPos(pos, duration){},
  playNextClear(){},
  playNextRegister(){},
  playNextMeta(t,d,p,u,i,sd){},
  videoSetMeta(title,artist,poster){
    var bd={
      title: title,
      artist: artist,
      album: title+" - "+artist,
      artwork: [
          { src: poster }
      ]
    };
    invoke('exec-js',
      'navigator.mediaSession.metadata=new MediaMetadata('+JSON.stringify(bd)+')'
    );
  },
  videoHaveNP(n,p){},
  voiceSearch(){},
  voiceClose(){},
  asyncPrompt(message, cbnum){},


  /* will not implemented */
  malLogin(){},
  checkUpdate(){},

  /* may supported */
  openIntentUri(u){
    invoke('intent-start',u);
  },
  
};

/* Register Client API */
contextBridge.exposeInMainWorld("_JSAPI", api);
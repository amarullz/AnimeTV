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
const { contextBridge, ipcRenderer } = require("electron");
const send = (m, a) => ipcRenderer.send(m, a);
const on = (m, c) => ipcRenderer.on(m, c);

const vars={
  profile_sel:0,
  profile_prefix:'',
};

const api={
  /* app functions */
  appQuit() {
    send("main", "quit");
  },
  reloadHome(){
    send("main", "home");
  },

  /* videos */
  videoSetUrl(url){},
  videoSetPosition(pos){},
  videoPlay(play){},
  videoGetDuration(){ return 0 },
  videoGetPosition(){ return 0 },
  videoBufferPercent() { return 0 },
  videoIsPlaying(){ return false },
  videoTracks(){},
  videoSetSpeed(speed){},
  videoSupportSpeed(){ return false },
  videoSetScale(type){},
  setStreamType(type, clean){},
  setStreamServer(mirror, clean){},
  getStreamType(){ return 0 },

  /* storage */
  storeGet(key, def){ return def; },
  storeSet(key, value){},
  storeDel(key){},

  /* profiles */
  profileGetSel(){ return vars.profile_sel; },
  profileGetPrefix(){ return vars.profile_prefix; },
  profileSetSel(v){ vars.profile_sel=v; },
  profileSetPrefix(v){ vars.profile_prefix=v; },

  /* network functions */
  dns(){ return "aniwave.to"; },
  flix_dns(){ return "api.animeflix.dev"},
  getSd(){ return 1 },
  setSd(s){},
  setSdomain(s){},
  getSdomain(){ return ''; },

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
  sha1sum(value) { return ""; },
  aesDec(cipherText, key, ivhex) { return ""; },
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
  videoSetMeta(title,artist,poster){},
  videoHaveNP(n,p){},
  voiceSearch(){},
  voiceClose(){},
  asyncPrompt(message, cbnum){},


  /* will not implemented */
  malLogin(){},
  checkUpdate(){},

  /* may supported */
  openIntentUri(u){},
  
};

/* Register Client API */
contextBridge.exposeInMainWorld("_JSAPI", api);
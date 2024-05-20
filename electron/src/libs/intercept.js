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
 * Filename    : intercept.js
 * Description : Network request interceptor
 *
 */
const { net, protocol } = require("electron");
const common = require("./common.js");

const intercept={
  domains:{
    vidplays: [
      "vid142.site",
      "mcloud.bz"
    ],
    streams:[
      "megacloud.tv",
      "rapid-cloud.co"
    ]
  },

  playerInjectString:"",
  youtubeInjectString:"",

  init(){
    /* Register protocol scheme */
    protocol.registerSchemesAsPrivileged([
      {
        scheme: 'https',
        privileges: {
          standard: true,
          secure: true,
          supportFetchAPI: false
        }
      }
    ]);
  },

  start(){
    intercept.playerInjectString=common.readfile(common.injectPath("view_player.html"));
    intercept.youtubeInjectString=common.readfile(common.injectPath("yt.html"));
    protocol.handle('https', intercept.handler);
  },

  checkOriginHeaders(h){
    if (h.has('Referer')){
      h.delete('Referer');
    }
    if (h.has('Origin')){
      h.delete('Origin');
    }
    if (h.has('X-Ref-Prox')){
      h.set('Referer',h.get('X-Ref-Prox'));
      h.delete('X-Ref-Prox');
    }
    if (h.has('X-Org-Prox')){
      h.set('Origin',h.get('X-Org-Prox'));
      h.delete('X-Org-Prox');
    }
  },

  checkHeaders(h){
    let body=null;
    if (h.has('X-NoH-Proxy')){
      h.delete('Host');
      h.delete('Origin');
      h.delete('Referer');
      h.delete('X-NoH-Proxy');
      if (h.has('X-Org-Prox')){
        h.set('Origin',h.get('X-Org-Prox'));
        h.set('Referer',h.get('X-Org-Prox'));
      }
      h.delete('X-Org-Prox');
      h.delete('X-Ref-Prox');
      return null;
    }

    h.delete('Host');
    if (h.has('Post-Body')){
      body=decodeURIComponent(h.get('Post-Body'));
      h.delete('Post-Body');
    }
    intercept.checkOriginHeaders(h);
    return body;
  },

  checkStream(h){
    if (h.has("X-Stream-Prox")){
      var hostStream=h.get("X-Stream-Prox");
      h.delete("X-Stream-Prox");
      return hostStream+"";
    }
    return false;
  },

  fetchError(){
    return new Response(null, {status: 404});
  },

  async fetchInject(url, req, inject){
    let f=await net.fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
      duplex: 'half',
      bypassCustomProtocolHandlers: true
    });
    let body=await f.text();
    return new Response(body+inject, {
      status: f.status,
      headers: f.headers
    });
  },

  async fetchNormal(req){
    return net.fetch(req,{ bypassCustomProtocolHandlers:true} );
  },

  async handler(req){
    try{
      const url = new URL(req.url);
      const hostStream=intercept.checkStream(req.headers);
      if (url.pathname.startsWith("/__view/")) {
        var p = url.pathname.substring(8);
        p = p.split('?')[0];
        p = p.split('#')[0];
        return net.fetch(common.viewRequest(p));
      }
      else if (url.pathname.startsWith("/__ui/")) {
        var p = url.pathname.substring(6);
        p = p.split('?')[0];
        p = p.split('#')[0];
        return net.fetch(common.uiRequest(p));
      }
      else if (url.pathname.startsWith("/__REDIRECT")) {
        return net.fetch(common.injectRequest("redirect.html"));
      }
      else if (url.pathname.startsWith("/__proxy/")) {
        var realurl = req.url.substring(req.url.indexOf('/__proxy/')+9);
        let body=intercept.checkHeaders(req.headers);
        return net.fetch(realurl, {
          method: req.method,
          headers: req.headers,
          body: body?body:req.body,
          duplex: 'half',
          bypassCustomProtocolHandlers: true
        });
      }
      else if (url.hostname.includes("mp4upload.com")){
        req.headers.set('Referer','https://www.mp4upload.com/');
        console.log("MP4UPLOAD: "+url);
        return intercept.fetchNormal(req);
      }
      else if(hostStream){
        if (common.main.vars.sd>2){
          /* Other streaming */
          var h=hostStream.split(".");
          var host2=h[h.length-2]+"."+h[h.length-1];
          req.headers.set('Referer','https://'+host2+'/');
          req.headers.set('Origin','https://'+host2);
        }
        return intercept.fetchNormal(req);
      }
      else if (req.url.startsWith("https://www.youtube.com/embed/")||req.url.startsWith("https://www.youtube-nocookie.com/embed/")){
        return intercept.fetchInject(req.url, req, intercept.youtubeInjectString);
      }
      else if (url.hostname.includes("youtube.com")||url.hostname.includes("youtube-nocookie.com")||url.hostname.includes("googlevideo.com")){
        let accept=req.headers.get("accept");
        if (accept!=null && (accept.includes("text/css")||accept.includes(
            "image/"))){
          return intercept.fetchError();
        }
        if (req.url.endsWith("/endscreen.js")||
          req.url.endsWith("/captions.js")||
          req.url.endsWith("/embed.js")||
          req.url.includes("/log_event?alt=json")||
          req.url.includes(".com/ptracking")||
          req.url.includes(".com/api/stats/")){
          return intercept.fetchError();
        }
        return intercept.fetchNormal(req);
      }
      else if (intercept.domains.vidplays.indexOf(url.host)>-1){
        /* Injector */
        if (req.headers.get("accept").startsWith("text/html")){
          return intercept.fetchInject(req.url, req, intercept.playerInjectString);
        }
        else{
          req.headers.set('Origin','https://'+url.hostname);
          req.headers.set('Referer','https://'+url.hostname+'/');
          let f=intercept.fetchNormal(req);
          if (url.pathname.startsWith("/mediainfo")){
            let body=await (await f).text();
            common.execJs("__M3U8CB("+body+");");
            return intercept.fetchError();
          }
          return f;
        }
      }
      else if (url.hostname.includes("rosebudemphasizelesson.com")||
        url.hostname.includes("simplewebanalysis.com")||
        url.hostname.includes("addthis.com")||
        url.hostname.includes("amung.us")||
        url.hostname.includes("www.googletagmanager.com")||
        url.hostname.includes("megastatics.com")||
        url.hostname.includes("ontosocietyweary.com")||
        url.hostname.includes("doubleclick.net")||
        url.hostname.includes("fonts.gstatic.com")||
        url.hostname.includes("ggpht.com")||
        url.hostname.includes("play.google.com")||
        url.hostname.includes("www.google.com")||
        url.hostname.includes("googleapis.com")
      ){
        /* BLOCK DNS */
        return intercept.fetchError();
      }
      else {
        return intercept.fetchNormal(req);
      }
    }catch(e){
      console.log(e);
    }
    return intercept.fetchNormal(req);
  }
};

module.exports = intercept;
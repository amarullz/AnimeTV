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
const axios = require('axios');
const stream = require('stream');
const https = require('https');
const dns = require('dns');
const DoH = require('doh-js-client').DoH;
const dns_google = new DoH('google');
const dns_cloudflare = new DoH('cloudflare');

/* Create axios http instance */
const instance = axios.create({
  dnsServer: '1.1.1.1',
  responseType: 'stream',
  adapter: 'http'
});

/* set DoH */
https.globalAgent = new https.Agent({
  maxSockets:30,
  maxTotalSockets:256,
  keepAlive: true,
  lookup: (hostname, options, callback) => {
    if (common.main.vars.httpclient==2){
      return dns.lookup(hostname, options, callback);
    }
    var doh_dns=(common.main.vars.httpclient==0)?dns_google:dns_cloudflare;
    doh_dns.resolve(hostname, 'A')
      .then(function (record) {
        var a=[];
        for (var i=0;i<record.length;i++){
          a.push({
            address: record[i].address,
            family: (record[i].type)==1?4:6
          });
        }
        callback(undefined,a);
      })
      .catch(function (err) {
        callback(true,null);
      });
  }
});


/* intercept class */
const intercept={
  /* stream domain names */
  domains:{
    vidplays: [
      "megaf.cc",
      "vid2a41.site",
      "vid1a52.site",
      "mcloud.bz"
    ],
    aniwatch:[
      "megacloud.tv",
      "rapid-cloud.co"
    ]
  },

  /* init constant strings & register protocol */
  playerInjectString:"",
  youtubeInjectString:"",
  init(){
    intercept.playerInjectString=common.readfile(common.injectPath("view_player.html"));
    intercept.youtubeInjectString=common.readfile(common.injectPath("yt.html"));
    protocol.handle('https', intercept.handler);
    intercept.init_server_vars();
  },

  /* check for update */
  async init_server_vars(){
    let f=await net.fetch(
      "https://raw.githubusercontent.com/amarullz/AnimeTV/master/server.json?"+((new Date()).getTime()),
      {
        method: "GET",
        bypassCustomProtocolHandlers: false
      }
    );
    try{
      let body=await f.text();
      let d=JSON.parse(body);
      if (intercept.domains.vidplays.indexOf(d.stream_domain)==-1){
        intercept.domains.vidplays.push(d.stream_domain);
      }
      if (intercept.domains.vidplays.indexOf(d.stream_domain1)==-1){
        intercept.domains.vidplays.push(d.stream_domain1);
      }
      if (intercept.domains.vidplays.indexOf(d.stream_domain2)==-1){
        intercept.domains.vidplays.push(d.stream_domain2);
      }
    }catch(e){}
  },

  /* check and modify for origin and referer */
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

  /* check and modify proxy headers */
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

  /* check stream identification headers */
  checkStream(h){
    if (h.has("X-Stream-Prox")){
      var hostStream=h.get("X-Stream-Prox");
      h.delete("X-Stream-Prox");
      return hostStream+"";
    }
    return false;
  },

  /* return blocked response */
  fetchError(){
    return new Response(null, {status: 404});
  },

  /* generic fetch */
  async fetchNormal(req){
    return net.fetch(req,{ bypassCustomProtocolHandlers:true} );
  },

  async fetchUrl(url, req, method, body){
    req.headers.set('X-Bypass-Req','true');
    return net.fetch(url,{
      method: method?method:req.method,
      headers: req.headers,
      body: body?body:req.body,
      duplex: 'half',
      bypassCustomProtocolHandlers: false
    });
  },

  /* fetch with injected string */
  async fetchInject(url, req, inject, bypass){
    req.headers.set('X-Bypass-Req','true');
    let f=await net.fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.body,
      duplex: 'half',
      bypassCustomProtocolHandlers: bypass?true:false
    });
    let body=await f.text();
    return new Response(body+inject, {
      status: f.status,
      headers: f.headers
    });
  },

  /* convert readable stream to string */
  async streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString("utf-8");
  },

  /* Backend Http Client */
  async fetchStream(req){
    return new Promise(async function(resolvCallback, rejectCallback) {
      var hdr={
        'User-Agent':common.UAG
      };
      req.headers.delete('User-Agent');
      for (const pair of req.headers.entries()) {
        hdr[pair[0]]=pair[1];
      }
      let opt={
        method: req.method,
        url: req.url,
        headers: hdr
      };
      if (req.body){
        opt.data=await intercept.streamToString(req.body);
      }
      instance.request(opt).then(function(res) {
        var rs = new stream.PassThrough();
        res.data.pipe(rs);
        resolvCallback(
          new Response(rs, {
            status: res.status,
            headers: res.headers
          })
        );
      }).catch(function(err) {
        rejectCallback();
      });
    });
  },

  /* HTTP Request Habdler */
  async handler(req){
    try{
      /* Bypass request */
      if (req.headers.has("X-Bypass-Req")){
        req.headers.delete("X-Bypass-Req");
        return intercept.fetchStream(req);
      }

      /* Non-ByPass requests */
      const url = new URL(req.url);
      const hostStream=intercept.checkStream(req.headers);

      /* Main View */
      if (url.pathname.startsWith("/__view/")) {
        var p = url.pathname.substring(8);
        p = p.split('?')[0];
        p = p.split('#')[0];
        return net.fetch(common.viewRequest(p));
      }

      /* UI Player */
      else if (url.pathname.startsWith("/__ui/")) {
        var p = url.pathname.substring(6);
        p = p.split('?')[0];
        p = p.split('#')[0];
        return net.fetch(common.uiRequest(p));
      }

      /* Redirect Script */
      else if (url.pathname.startsWith("/__REDIRECT")) {
        return net.fetch(common.injectRequest("redirect.html"));
      }

      /* Proxy Request */
      else if (url.pathname.startsWith("/__proxy/")) {
        var realurl = req.url.substring(req.url.indexOf('/__proxy/')+9);
        let h=req.headers;
        let body=intercept.checkHeaders(h);
        let method=req.method;

        /* kaas post */
        if (h.has('X-Post-Prox')){
          h.set('Content-Type',h.get('X-Post-Prox'))
          h.delete('Post-Body');
          realurl=realurl.substring(0,realurl.indexOf('?'));
          body=decodeURIComponent(url.search.substring(1));
          method='POST';
        }
        h.delete('Host');

        /* fetch proxy */
        return intercept.fetchUrl(realurl,req,method,body);
      }

      /* custom source domain name */
      else if (url.hostname==common.main.dns()){
        if (common.main.vars.sd_domain){
          var nurl=req.url.replace('://'+common.main.dns(),'://'+common.main.vars.sd_domain);
          req.headers.delete('Host');
          return intercept.fetchUrl(nurl,req);
        }
        return intercept.fetchStream(req);
      }

      /* Streamings */
      else if (url.hostname.includes("mp4upload.com")){
        req.headers.set('Referer','https://www.mp4upload.com/');
        return intercept.fetchStream(req);
      }
      else if(hostStream){
        if (common.main.vars.sd>2){
          /* Other streaming */
          var h=hostStream.split(".");
          var host2=h[h.length-2]+"."+h[h.length-1];
          if (common.main.vars.sd==3||common.main.vars.sd==4){
            req.headers.set('Referer','https://megacloud.tv/');
            req.headers.set('Origin','https://megacloud.tv');
          }
          else if (common.main.vars.sd==5){
            req.headers.set('Referer','https://'+common.dns[5]+'/');
            req.headers.set('Origin','https://'+common.dns[5]);
          }
          else{
            if (req.headers.has("X-Dash-Prox")){
              req.headers.delete('X-Dash-Prox');
              req.headers.delete('Referer');
              req.headers.set('Origin','https://'+host2);
            }
            else{
              req.headers.set('Referer','https://'+host2+'/');
              req.headers.set('Origin','https://'+host2);
            }
          }
        }
        return intercept.fetchStream(req);
      }

      /* Youtube */
      else if (req.url.startsWith("https://www.youtube.com/embed/")||req.url.startsWith("https://www.youtube-nocookie.com/embed/")){
        return intercept.fetchInject(req.url, req, intercept.youtubeInjectString, true);
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

      /* Aniwatch stream meta fetcher */
      else if (intercept.domains.aniwatch.indexOf(url.host)>-1){
        var accept=req.headers.get("Accept");
        if (accept && (accept.startsWith("text/css")||accept.startsWith("image/"))){
          return intercept.fetchError();
        }
        req.headers.set("Referer","https://aniwatchtv.to/");
        return intercept.fetchStream(req);
      }

      /* Vidplay stream meta fetcher */
      else if (intercept.domains.vidplays.indexOf(url.host)>-1){
        var accept=req.headers.get("accept");
        /* Injector */
        if (accept && accept.startsWith("text/html") && !url.pathname.startsWith("/assets/mcloud/min/embed.js")){
          return intercept.fetchInject(req.url, req, intercept.playerInjectString);
        }
        else{
          req.headers.set('Origin','https://'+url.hostname);
          req.headers.set('Referer','https://'+url.hostname+'/');
          let f=intercept.fetchStream(req);

          /* Modify embed.js to get rc4 keys */
          if (url.pathname.startsWith("/assets/mcloud/min/embed.js")){
            console.log("IS VIDSTREAM EMBED: "+url);

            let body=await (await f).text();
            body=body.replace(
              'function _(){',
              'function _()  {'
            );

            body=body.replace(
              'function _(){',
              'function _(){ try{console.log(arguments);if (!("__QKEYS" in window)) window.__QKEYS=[]; window.__QKEYS.push(arguments[0]);}catch(e){} '
            );
            
            return new Response(body, {
              status: f.status,
              headers: f.headers
            });
          }

          /* Old unused mediainfo trap */
          // if (url.pathname.startsWith("/mediainfo")){
          //   let body=await (await f).text();
          //   common.execJs("__M3U8CB("+body+");");
          //   return intercept.fetchError();
          // }
          return f;
        }
      }

      else if (url.hostname.includes("fonts.gstatic.com")||url.hostname.includes("fonts.googleapis.com")){
        return intercept.fetchStream(req);
      }

      /* Blacklisted */
      else if (url.hostname.includes("rosebudemphasizelesson.com")||
        url.hostname.includes("simplewebanalysis.com")||
        url.hostname.includes("addthis.com")||
        url.hostname.includes("amung.us")||
        url.hostname.includes("www.googletagmanager.com")||
        url.hostname.includes("megastatics.com")||
        url.hostname.includes("ontosocietyweary.com")||
        url.hostname.includes("doubleclick.net")||
        url.hostname.includes("ggpht.com")||
        url.hostname.includes("play.google.com")||
        url.hostname.includes("www.google.com")||
        url.hostname.includes("googleapis.com")||
        url.hostname.includes("precedelaxative.com")
      ){
        return intercept.fetchError();
      }

      /* Default */
      else {
        if (common.main.vars.sd==3||common.main.vars.sd==4){
          if (url.pathname.endsWith("/master.m3u8")) {
            var j={
              result:{sources:[{
                file:req.url
              }]}
            };
            common.execJs("__M3U8CB("+JSON.stringify(j)+");");
            return intercept.fetchError();
          }
        }
        return intercept.fetchStream(req);
      }
    }catch(e){
      console.log("LOG_ERR: "+e);
    }
    return intercept.fetchStream(req);
  }
};

module.exports = intercept;
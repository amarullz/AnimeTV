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
    ]
  },

  playerInjectString:"",

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
    protocol.handle('https', intercept.handler);
  },

  checkHeaders(h){
    let body=null;
    h.delete('Host');

    if (h.has('Referer')){
      h.delete('Referer');
    }
    if (h.has('Origin')){
      h.delete('Origin');
    }
    if (h.has('Post-Body')){
      body=decodeURIComponent(h.get('Post-Body'));
      h.delete('Post-Body');
    }
    if (h.has('X-Ref-Prox')){
      h.set('Referer',h.get('X-Ref-Prox'));
      h.delete('X-Ref-Prox');
    }
    if (h.has('X-Org-Prox')){
      h.set('Origin',h.get('X-Org-Prox'));
      h.delete('X-Org-Prox');
    }
    return body;
  },

  async handler(req){
    try{
      const url = new URL(req.url);
      if (url.pathname.startsWith("/__view/")) {
        var p = url.pathname.substring(8);
        p = p.split('?')[0];
        p = p.split('#')[0];
        console.log("[NET][VIEW]: "+p);
        return net.fetch(common.viewRequest(p));
      }
      else if (url.pathname.startsWith("/__proxy/")) {
        var realurl = url.pathname.substring(9);
        console.log("[NET][PROXY]: "+realurl);

        let body=intercept.checkHeaders(req.headers);
        return net.fetch(realurl, {
          method: req.method,
          headers: req.headers,
          body: body?body:req.body,
          bypassCustomProtocolHandlers: true
        });
      }
      else if (intercept.domains.vidplays.indexOf(url.host)>-1){
        /* Injector */
        if (req.headers.get("accept").startsWith("text/html")){
          console.log("[NET][STREAMER][MAIN-PAGE]: "+req.url);
          let f=await net.fetch(req.url, {
            method: req.method,
            headers: req.headers,
            body: req.body,
            bypassCustomProtocolHandlers: true
          });
          let body=await f.text();
          return new Response(body+intercept.playerInjectString, {
            status: f.status,
            headers: f.headers
          });
        }
        else{
          req.headers.set('Origin','https://'+url.hostname);
          req.headers.set('Referer','https://'+url.hostname+'/');
          let f=net.fetch(req.url, {
            method: req.method,
            headers: req.headers,
            body: req.body,
            bypassCustomProtocolHandlers: true
          });

          if (url.pathname.startsWith("/mediainfo")){
            console.log("[NET][STREAMER][MEDIAINFO]: "+req.url);
            let body=await (await f).text();
            common.execJs("__M3U8CB("+body+");");
            f=net.fetch(req.url, {
              method: req.method,
              headers: req.headers,
              body: req.body,
              bypassCustomProtocolHandlers: true
            });
          }
          else{
            console.log("[NET][STREAMER][OTHERS]: "+req.url);
          }
          
          return f;
        }
      }
      else {
        console.log("[NET][DIRECT]: "+req.url);
        return net.fetch(req.url, {
          method: req.method,
          headers: req.headers,
          body: req.body,
          bypassCustomProtocolHandlers: true
        });
      }
    }catch(e){
      console.log(e);
    }
  }
};

module.exports = intercept;
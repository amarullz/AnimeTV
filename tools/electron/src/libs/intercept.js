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
    protocol.handle('https', intercept.handler);
  },

  handler(req){
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
        return net.fetch(realurl, {
          method: req.method,
          headers: req.headers,
          body: req.body,
          bypassCustomProtocolHandlers: true
        });
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
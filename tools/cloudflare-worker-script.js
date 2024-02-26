/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
const ANILIST_CLIENT_ID = "-";
const ANILIST_LOGIN_URL =
  "https://anilist.co/api/v2/oauth/authorize?client_id="+ANILIST_CLIENT_ID+"&response_type=token";
const ANILIST_END_URL = 
  "https://amarullz.com/";

const MAL_CLIENT_ID="-";
const MAL_CLIENT_SECRET="-";
const MAL_END_URL = 
  "https://amarullz.com/";

const DISCORD_BOT_AUTH="-";

const HOMEPAGE_URL = 
  "https://amarullz.com/";

export default {
  /* Bad Request - Redirect to homepage */
  badrequest(){
    return new Response(null, {
      status: 301,
      headers: {
        'Location': HOMEPAGE_URL
      }
    });
  },

  /* Save & load temp data with cache */
  cache_url:"https://animetv.amarullz.com/anilist/cached-",
  cachePut(ctx,name,value){
    const response = new Response(
      value,
      {
        headers: {
          "Content-Type": "text/plain"
        }
      }
    );
    response.headers.append("Cache-Control", "s-maxage=3600");
    ctx.waitUntil(
      caches.default.put(
        new Request(this.cache_url+name),
        response.clone()
      )
    );
  },
  async cacheGet(name){
    let v= await caches.default.match(
      new Request(this.cache_url+name)
    );
    if (v){
      return v.text();
    }
    return null;
  },
  cookieGet(request, key) {
    let cookieString = request.headers.get("Cookie");
    if (cookieString) {
      const allCookies = cookieString.split("; ");
      const targetCookie = allCookies.find(cookie => cookie.includes(key));
      if (targetCookie) {
        const [_, value] = targetCookie.split("=");
        return value;
      }
    }
    return null;
  },

  /* Generate random string */
  randomString(length){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < length; i++) {
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
  },

  /* AniList oAuth Request Handler */
  async anilist(request,ctx,pathname, search, searchParams){
    /* Redirect to auth site */
    if (pathname=="/anilist/login"){
      let lid=searchParams.get("lid");
      if (lid){
        let d={
          st:1
        };
        this.cachePut(ctx,lid,JSON.stringify(d));
        return new Response(null, {
          status: 301,
          headers: {
            'Location': ANILIST_LOGIN_URL,
            'Set-Cookie': "__alid="+lid+";"
          }
        });
      }
    }

    /* Check current authorizing process - for client/AnimeTV */
    else if (pathname=="/anilist/check"){
      let lid=searchParams.get("lid");
      if (lid){
        let v=await this.cacheGet(lid);
        if (!v){
          v=JSON.stringify({st:0});
        }
        return new Response(v,{
          headers:{
            'content-type':'application/json'
          }
        });
      }
    }

    /* Save oAuth Result */
    else if (pathname=="/anilist/set"){
      let at=searchParams.get('access_token');
      let ei=searchParams.get('expires_in');
      let lid=this.cookieGet(request,"__alid");
      if (at&&ei&&lid){
        let d={
          st:2,
          tk:at,
          ex:ei,
          id:lid
        };
        this.cachePut(ctx,lid,JSON.stringify(d));
        return new Response(null, {
          status: 301,
          headers: {
            'Location': ANILIST_END_URL+"?lid="+lid
          }
        });
      }
    }

    /* Convert hash to search query */
    else if (pathname=="/anilist/handler"){
      return new Response(
`<script>
let h=(location.hash+'').substring(1);
if (h.length>0){
  location='/anilist/set?'+h;
}
</script>`,{
        headers:{
          'content-type':'text/html'
        }
      });
    }
    return this.badrequest();
  },

  /* MAL oAuth Request Handler */
  async mal(request,ctx,pathname, search, searchParams){
    /* Redirect to auth site */
    if (pathname=="/mal/login"){
      let lid=searchParams.get("lid");
      if (lid){
        let d={
          st:1
        };
        let mal_challange=this.randomString(100);
        let mal_url=
          'https://myanimelist.net/v1/oauth2/authorize?response_type=code&'+
          'client_id='+MAL_CLIENT_ID+'&'+
          'code_challenge='+mal_challange;
        this.cachePut(ctx,lid,JSON.stringify(d));
        return new Response(null, {
          status: 301,
          headers: {
            'Location': mal_url,
            'Set-Cookie': "__klid="+lid+"--_--"+mal_challange+";"
          }
        });
      }
    }

    /* Check current authorizing process - for client/AnimeTV */
    else if (pathname=="/mal/check"){
      let lid=searchParams.get("lid");
      if (lid){
        let v=await this.cacheGet(lid);
        if (!v){
          v=JSON.stringify({st:0});
        }
        return new Response(v,{
          headers:{
            'content-type':'application/json'
          }
        });
      }
    }

    /* oAuth result callback handler */
    else if (pathname=="/mal/handler"){
      /* Auth Code from search query */
      let code=searchParams.get('code');

      /* ID & code-verifier */
      let klid=this.cookieGet(request,"__klid");
      let kld=klid.split('--_--');
      let lid=kld[0];
      let cv=kld[1];

      if (code && lid && cv){
        /* Get Auth Token */
        const data = new URLSearchParams();
        data.set('client_id',MAL_CLIENT_ID);
        data.set('client_secret',MAL_CLIENT_SECRET);
        data.set('code',code);
        data.set('code_verifier',cv);
        data.set('grant_type','authorization_code');
        let auth=await fetch('https://myanimelist.net/v1/oauth2/token',{
          method:"post",
          body:data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });

        /* Parse result & save to cache */
        let out=JSON.parse(await auth.text());
        let d={
          st:2,
          tk:out.access_token,
          ex:out.expires_in,
          id:lid,
          dt:out
        };
        this.cachePut(ctx,lid,JSON.stringify(d));
        return new Response(null, {
          status: 301,
          headers: {
            'Location': MAL_END_URL+"?lid="+lid
          }
        });   
      }
    }
    return this.badrequest();
  },

  /* AnimeTV Discord Info*/
  async discord_info() {
    try{
      return await fetch('https://discord.com/api/v9/channels/1202850534600609805/messages?limit=3',{
        cf: {
            cacheTtl: 1800,
            cacheEverything: true
        },
        method:"GET",
        headers:{
          'Authorization': 'Bot '+DISCORD_BOT_AUTH
        }
      });
    }catch(e){}
    return new Response("ERROR");
  },

  async fetch(request, env, ctx) {
    const { pathname, search, searchParams } = new URL(request.url);

    // AniList Handler
    if (pathname.startsWith("/anilist")){
      return this.anilist(request,ctx,pathname,search,searchParams);
    }

    // MAL Handler
    else if (pathname.startsWith("/mal")){
      return this.mal(request,ctx,pathname,search,searchParams);
    }

    // Discord Info
    else if (pathname.startsWith("/discord-info")){
      return this.discord_info();
    }

    return this.badrequest();
  },
};
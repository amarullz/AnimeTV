/**
 * AnimeTV Worker
 */
let ENV=null;

export default {
  /* Bad Request - Redirect to homepage */
  badrequest(){
    return new Response(null, {
      status: 301,
      headers: {
        'Location': ENV.HOMEPAGE_URL
      }
    });
  },

  /* Save & load temp data with cache */
  async cachePut(name,value){
    await ENV.KV_ANIMETV.put(name,value,{"expirationTtl":3600});
  },
  async cacheGet(name){
    return await ENV.KV_ANIMETV.get(name);
  },
  async cacheDel(name){
    await ENV.KV_ANIMETV.delete(name);
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

  async anilist_getuser(altoken){
    var query = `
    query {
        Viewer {
            id
            name
        }
    }
    `;
    var variables = {};
    var url = 'https://graphql.anilist.co';
    let res=await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+altoken
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        })
    });
    return await res.text();
  },

  /* AniList oAuth Request Handler */
  async anilist(request,ctx,pathname, search, searchParams){
    /* Redirect to auth site */
    if (pathname=="/anilist/login"){
      let lid=searchParams.get("lid");
      if (lid){
        let v=await this.cacheGet(lid);
        if (!v){
          return this.badrequest();
        }
        let d={
          st:1
        };
        await this.cachePut(lid,JSON.stringify(d));
        return new Response(null, {
          status: 301,
          headers: {
            'Location': "https://anilist.co/api/v2/oauth/authorize?client_id="+ENV.ANILIST_CLIENT_ID+"&response_type=token",
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
          /* Set as reserved */
          v=JSON.stringify({st:0});
          await this.cachePut(lid,JSON.stringify({st:5}));
        }
        if (v){
          let vd=JSON.parse(v);
          let isdel=searchParams.get("del");
          if (vd.st==2 || isdel){
            await this.cacheDel(lid);
          }
        }
        return new Response(v,{
          headers:{
            'content-type':'application/json',
            "Cache-Control": 'no-cache'
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

        try{
          let udt=await this.anilist_getuser(at);
          let usr=JSON.parse(udt);
          d.user=usr.data.Viewer.name;
          d.uid=usr.data.Viewer.id;
        }catch(e){}

        await this.cachePut(lid,JSON.stringify(d));
        return new Response(null, {
          status: 301,
          headers: {
            'Location': ENV.ANILIST_END_URL+"?lid="+lid
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
        let v=await this.cacheGet(lid);
        if (!v){
          return this.badrequest();
        }
        let d={
          st:1
        };
        let mal_challange=this.randomString(100);
        let mal_url=
          'https://myanimelist.net/v1/oauth2/authorize?response_type=code&'+
          'client_id='+ENV.MAL_CLIENT_ID+'&'+
          'code_challenge='+mal_challange;
        await this.cachePut(lid,JSON.stringify(d));
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
          /* Set as reserved */
          v=JSON.stringify({st:0});
          await this.cachePut(lid,JSON.stringify({st:5}));
        }
        if (v){
          let vd=JSON.parse(v);
          let isdel=searchParams.get("del");
          if (vd.st==2 || isdel){
            await this.cacheDel(lid);
          }
        }
        return new Response(v,{
          headers:{
            'content-type':'application/json',
            "Cache-Control": 'no-cache'
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

      let v=await this.cacheGet(lid);
      if (!v){
        return this.badrequest();
      }

      if (code && lid && cv){
        /* Get Auth Token */
        const data = new URLSearchParams();
        data.set('client_id',ENV.MAL_CLIENT_ID);
        data.set('client_secret',ENV.MAL_CLIENT_SECRET);
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
          id:lid
        };

        let mydata=await fetch('https://api.myanimelist.net/v2/users/@me',{
          method:"get",
          headers: {
            'Accept': 'application/json',
            'Authorization':'Bearer '+d.tk
          }
        });
        let me=JSON.parse(await mydata.text());
        d.user=me.name;

        await this.cachePut(lid,JSON.stringify(d));
        return new Response(null, {
          status: 301,
          headers: {
            'Location': ENV.MAL_END_URL+"?lid="+lid
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
          'Authorization': 'Bot '+ENV.DISCORD_BOT_AUTH
        }
      });
    }catch(e){}
    return new Response("ERROR");
  },

  async fetch(request, env, ctx) {
    const { pathname, search, searchParams } = new URL(request.url);
    ENV=env;

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
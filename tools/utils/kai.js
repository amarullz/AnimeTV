function kaiCodexInit(keys){
  var homeKeys=[];
  var megaKeys=[];
  for (var i=0;i<keys.kai.length;i++){
      homeKeys[i]=[];
      for (var j=0;j<keys.kai[i].length;j++){
          homeKeys[i].push(atob(keys.kai[i][j]));
      }
  }
  for (var i=0;i<keys.mega.length;i++){
      megaKeys[i]=[];
      for (var j=0;j<keys.mega[i].length;j++){
          megaKeys[i].push(atob(keys.mega[i][j]));
      }
  }
  function encrypt$(n){
    n = encodeURIComponent(n);
    var kl=homeKeys[0].length;
    for (var j=0;j<kl;j++){
      var o = [];
      var l = n.length;
      for (var i = 0; i < l; i++) {
          o.push(homeKeys[n.charCodeAt(i)][j].charAt(i));
      }
      n=btoa(o.join(''));
    }
    return n.replace(/\//g, '_').replace(/\+/g, '-').replace(/\=/g, '');
  }
  function decrypt$(n){
    n = n.replace(/_/g, '/').replace(/-/g, '+');
    var kl=homeKeys[0].length;
    for (var j=0;j<kl;j++){
      n=atob(n);
      var l = n.length;
      var o = [];
      for (var i = 0; i < l; i++) {
          var c=n.charAt(i);
          for (var k=0;k<homeKeys.length;k++){
              var ck=homeKeys[k][kl-(j+1)].charAt(i);
              if (ck===c){
                  c=String.fromCharCode(k);
                  break;
              }
          }
          o.push(c);
      }
      n=o.join('')
    }
    return decodeURIComponent(n);
  }
  function megaDec(n){
    n=n.replace(/_/g, '/').replace(/-/g, '+');
    var kl=megaKeys[0].length;
    for (var j=1;j<kl;j++){
      console.log("ATOB = "+j+" -> "+n);
      n=atob(n);
      var o = [];
      var l = n.length;
      for (var i = 0; i < l; i++) {
          var np=n.charCodeAt(i);
          var ckey=megaKeys[np][j];
          o.push(ckey.charCodeAt(i%ckey.length));
      }
      n=String.fromCharCode.apply(null,o);
    }
    return decodeURIComponent(n);
  }
  window.KAICODEX={
    enc:encrypt$,
    dec:decrypt$,
    decMega:megaDec
  };
}
$ap('https://raw.githubusercontent.com/amarullz/kaicodex/refs/heads/main/generated/gen/keys-hash.json?'+$time(),function(r){
  if (r.ok){
    var hash=JSON.parse(r.responseText);
    var cacheArg="?"+$time();
    if (hash.hash==localStorage.getItem('kaicodex_hash')){
      cacheArg="";
      var cachedKey=localStorage.getItem('kaicodex_key');
      if (cachedKey){
        try{
          var keys=JSON.parse(cachedKey);
          if (keys && keys.kai && keys.mega){
            kaiCodexInit(keys);
            return;
          }
        }catch(e){}
      }
    }
    $ap('https://raw.githubusercontent.com/amarullz/kaicodex/refs/heads/main/generated/gen/keys.json'+cacheArg,function(r){
      if (r.ok){
        kaiCodexInit(JSON.parse(r.responseText));
        try{
          localStorage.setItem('kaicodex_hash',hash.hash);
          localStorage.setItem('kaicodex_key',r.responseText);
        }catch(e){}
      }
    });
  }
});

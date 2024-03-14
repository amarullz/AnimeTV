/* Body */
const body=document.body;
/* const _DNS="9anime.to"; */
const __DNS=('_JSAPI' in window)?_JSAPI.dns():"animeflix.live";
const __SD=('_JSAPI' in window)?_JSAPI.getSd():5;
const __SD3=((__SD==3) || (__SD==4))?true:false;
const __SD5=(__SD==5);

const __SOURCE_NAME=[
  'Anime-Wave', 'Anix', 'Hi-Anime', 'Anime-WatchTV', 'Animeflix'
]

const __SD_NAME = __SD+"/"+(__SOURCE_NAME[__SD-1]);

/* getId */
function $(i){
  return document.getElementById(i);
}

// "VidStreaming" -> "e13d38099bf562e8b9851a652d2043d3"
// "DuckStream" -> "4504447b74641ad972980a6b8ffd7631"
// "BirdStream" -> "4b14d0ff625163e3c9c7a47926484bf2"

// kzLk6Q9JavBLGTvYqwZbQ9BGZo0SE2apU9tq9ifAmmclwKpGaG/arl09zQSfwopfPvVIeMXg50oV1CbmTecmk3kr1Q9wCX3Rd/A+sPFYBsLX/Ht+b+8m7XR+VSQVV2gu0kJid+mNB7sbwCJv95AQwWDrgDlHQmaXwqikq8dvA3c4KoJ3iej9yG2hQ/J/NpUKdAr7W1a1tJNiz+PhgIyG83/CwNDAtogXLU2qX38sfYkZ/SvEm8m/3wqGr7n/6vfWUlLn8wm2URJjSZNUW/GzgWpSaF/lsccwTu+c3WFqa4gadE7gCZaCpXUOFh0zDyMe6InavJOMORqXSqPNIV3RuVi5QXq+TkrgOCRdgwDyraAFKMR94D+fmWjfYI6teVn5YqH5cmYaD8dqFD6S9fIqI0cMxh7ffb60kC6v8W+yXqq9vEGMdCG4JS3/bD6UcKGIu/4+oq4ZKQQfEZDb2lmQLYg7PTYFcU+mtH8+nDg69C/We2h40acNw5zuJGjIwUnWL8VXkVzVRO0Oyf1m9QthgjL8NOER7pQx0Fp1WJW3hOjRe7PYj0PqZaDBRXnAjOxiTUce5Q6wsPFiiQ50mpqNvKewhQisVl6A2g/amoFES/BQLsb198bp9Ye/OkPeTDMqqHfs1lrYOqCRY+CIeNf2djJ2fOphvxjT+LzoQnWmJcBeGHC12+CNATSQ8s+089CL00htFcfstHn/rRbjfYPyWtEM5J08nfGfO9aXObnAS1FK5VJC2vND64HSjtxnRn4TCicRPBPezvLNCkkATBU1FqcpcOdPBu1QHOVRbZRvZIKbRwZmTbpOg8bVDysDOswfJ4jS9rCss/Tes86oq7OpktH7XIdbgcqN9ut0dwLGU+cTgbnqeFQz8auox+FRSVY8RMazxkspQ/3PVcB/bJygQ4+mInYhBkJpW8o78orKqzMbOxLHFugXMdCoU9Xu7raSeEo04Lzuw7Lx39IxslPgq+EFd2qn/xh7ir5ms56FEbVhkErOo5JvIpWacaui1cQUqfylzsHRHb/AbZDbOln4vEoyB0AhLT8luA9v3jRKVkSEvXuI5j5Sh6+l/LfCNJSBoWHMeQgi9C/2vuareh7IupHxrmkEBtDJE57Y2WQXNxNrhy2xz3NoXsDrsSIf3Pgz50qh12UyW2PpBqLP/QCe5cUtmXuKs4lAq2k+bCgQlUUV1heqAQtZIp5V6A1tC5Yx/bt5g0wA8UKQJz4pPD5F5fbbyVinitw74bbxpclc+C7xCCf79kOFJq/1kc3oxQTm51tUPXd0oB5xqBFeItr9/Fm3aLNu6rtRWIq9eiGS6yJAqXXp6dm8Vxq0fNrUgU/Jv4V9C0PauYDtJoJ139BvWOvy9131aF5UcRKuyH/X3ozaJpEnmyQVaqFrfInEoBiXb84SOqZXKKbLKHZc7OXlNzNjX8gCrVx3lnXlXMs1f4fOdpdtd+HDPm5God76pc94
// baa7d8a875a7722cf5f9a0ba1b4530b3

// KdR5L4vJVe5OLJL8hd8GtuiFEigy6dQuAwspZVWDU05838AczX4Gc7naG1//zk8BfbH53SZ1a3CdMorMFNQBJeiOWM+5dTPXqnq6FGsl8Il9PFS/yoiWwvAa2KYsuwm/cO1FJJpd2eG47M1ye4LDuI5AwSoXWIreWfOplPUeDTFr+jksj8Eiv4EufsxN/IGb5kteRoiY9mJq4BiANqyXz7VS1pUh4iFbiB2q+P1Jrfs+zPOotYnWoHtqnOdDwz+YdRRCZia99ZYkW0rTL4ANwP1ZTuA6JPG42V9v7forGxcjXiiqCcGEbryc1qwsY8ZX0zMX0BuPYZ3KMZhy+3e6tm2/Nb9dfsviW28KLqWlnBu4lGfn7G0ngr0gtuctpESoZXo3PB+6S3ea7JrhoOx1cLx+nA4cRmri7o2YXzh1ZJLKdl3a8ECyqcFbzkoHZ4UiEjBSB7HqiqRh67KG/Gn3X0edjDNAxy7x+QJCdeLm5adVD/vt66vNN1X73nnTJAsM0AQLMLDZQxvY2tYrLhONmHsBPHtHBeMNvtcjxTHb51N2PL5NfvHMigB9+z4GhXRoqUJvxKjMVP/eS3h1db5uUsdsyJG5KcA+JLZ15qY0HsELj6InaNAGNETjjkJXLlAWYFOKKuLCE7t4mm+xRa7jAWlnH0hsz5ZUKRS0sN1r9wu9pMxCQ2rJb6Y4D7Og6NmURQOQH+bdRjqqbFjVB6CFpKDSEEpG67n5/izZXoJVIZX03dVL8m+feaEjKGreXVnvfrOHpYbeAUGXzDSygRSHBZ9TSB9a9X94seyHBgxPwADAMKVQ21J+DTegl60kiyaP8A39bnucL6IctGetRnjcFyEk1LoX30Y+9aeH+Jj/Ui9vCb2nVeASDcK7nH/6/38XgMIaFwes24wles8gZzuCDKgDFkWZqAEE+IWBYB7NgAZbZ9FXVguSA8CsEE4WvOyykAmeD7OjjoiScYxaAir/KkuA3MbAcrSCISFSskqOHkIZFw7mS4GLRRUloLbXwyAP989s0KE88pFAFPB2MTFnaXwZdTQTfSaQOHY46sDwtL6wIA0mSv5+BlvKhHZ5Rr6UOQAoc2l+dbmuFzHq6IZotVQ6iRAaKQx3Im+3+uo+oM1tgDeAbXbDX/tlBxUgYQt0cnCUOtimmAIM3k/sslqVpdRfAy9i2RYdnHqyfAhWs8CL9QnwgajUGS2NPh1+bY1CPDst89wpAdKfxcj1OEzcbP9vij1W/tAF5Na9otfMK1OG/Hfdb0d1Q/a8OTBJj4h/zLzIet+2laorvXk7BtprwP7P1opNMNo5Z6C+mwUXquaMjFncNuI5mQqsmhtCAkS4Y9pJLNLF5UAz4gJVvuPAWv4NpldrN6AF6S6M+bMr1K8yiCKKBY6Y+C/0jz3C/nrp5BlEUmPuaARSiOr5VR1Ihij1PCx+rdKZvsSN1k4v3SO/cxZNWIxSFR2DA9Y1MHTdXQ63SRh5c2fiz0EzbRuuO02YEo1q+8Wu+raiITu0zDu7MHJs3+5cYVoKD/zpTJ4u
// 5bb7d561d616070aec300b54d2300397
//
// var k= _JSAPI.aesDec(
//   'KdR5L4vJVe5OLJL8hd8GtuiFEigy6dQuAwspZVWDU05838AczX4Gc7naG1//zk8BfbH53SZ1a3CdMorMFNQBJeiOWM+5dTPXqnq6FGsl8Il9PFS/yoiWwvAa2KYsuwm/cO1FJJpd2eG47M1ye4LDuI5AwSoXWIreWfOplPUeDTFr+jksj8Eiv4EufsxN/IGb5kteRoiY9mJq4BiANqyXz7VS1pUh4iFbiB2q+P1Jrfs+zPOotYnWoHtqnOdDwz+YdRRCZia99ZYkW0rTL4ANwP1ZTuA6JPG42V9v7forGxcjXiiqCcGEbryc1qwsY8ZX0zMX0BuPYZ3KMZhy+3e6tm2/Nb9dfsviW28KLqWlnBu4lGfn7G0ngr0gtuctpESoZXo3PB+6S3ea7JrhoOx1cLx+nA4cRmri7o2YXzh1ZJLKdl3a8ECyqcFbzkoHZ4UiEjBSB7HqiqRh67KG/Gn3X0edjDNAxy7x+QJCdeLm5adVD/vt66vNN1X73nnTJAsM0AQLMLDZQxvY2tYrLhONmHsBPHtHBeMNvtcjxTHb51N2PL5NfvHMigB9+z4GhXRoqUJvxKjMVP/eS3h1db5uUsdsyJG5KcA+JLZ15qY0HsELj6InaNAGNETjjkJXLlAWYFOKKuLCE7t4mm+xRa7jAWlnH0hsz5ZUKRS0sN1r9wu9pMxCQ2rJb6Y4D7Og6NmURQOQH+bdRjqqbFjVB6CFpKDSEEpG67n5/izZXoJVIZX03dVL8m+feaEjKGreXVnvfrOHpYbeAUGXzDSygRSHBZ9TSB9a9X94seyHBgxPwADAMKVQ21J+DTegl60kiyaP8A39bnucL6IctGetRnjcFyEk1LoX30Y+9aeH+Jj/Ui9vCb2nVeASDcK7nH/6/38XgMIaFwes24wles8gZzuCDKgDFkWZqAEE+IWBYB7NgAZbZ9FXVguSA8CsEE4WvOyykAmeD7OjjoiScYxaAir/KkuA3MbAcrSCISFSskqOHkIZFw7mS4GLRRUloLbXwyAP989s0KE88pFAFPB2MTFnaXwZdTQTfSaQOHY46sDwtL6wIA0mSv5+BlvKhHZ5Rr6UOQAoc2l+dbmuFzHq6IZotVQ6iRAaKQx3Im+3+uo+oM1tgDeAbXbDX/tlBxUgYQt0cnCUOtimmAIM3k/sslqVpdRfAy9i2RYdnHqyfAhWs8CL9QnwgajUGS2NPh1+bY1CPDst89wpAdKfxcj1OEzcbP9vij1W/tAF5Na9otfMK1OG/Hfdb0d1Q/a8OTBJj4h/zLzIet+2laorvXk7BtprwP7P1opNMNo5Z6C+mwUXquaMjFncNuI5mQqsmhtCAkS4Y9pJLNLF5UAz4gJVvuPAWv4NpldrN6AF6S6M+bMr1K8yiCKKBY6Y+C/0jz3C/nrp5BlEUmPuaARSiOr5VR1Ihij1PCx+rdKZvsSN1k4v3SO/cxZNWIxSFR2DA9Y1MHTdXQ63SRh5c2fiz0EzbRuuO02YEo1q+8Wu+raiITu0zDu7MHJs3+5cYVoKD/zpTJ4u',
//   'e13d38099bf562e8b9851a652d2043d3',
//   '5bb7d561d616070aec300b54d2300397'
// );
// JSON.parse(k);
//
// ["de5y3vCJ2LcsXpB4","qeTyrL6NB0XVAyFT"]


//
// https://vidplay.online/e/0RYXD41N8PNV?t=4xjRCfcjDVwMzQ%3D%3D&autostart=true
// https://vidplay.online/mediainfo/VXJUraga5p7Mr5ojXboaTTfHJ_oamgJCbg==,205,191,182,203,233,207,189,178,174,221,153,189,169,131,199,196?t=4xjRCfcjDVwMzQ%3D%3D&autostart=true
//
// vidId=0RYXD41N8PNV
// keyList=["de5y3vCJ2LcsXpB4","qeTyrL6NB0XVAyFT"]
// _JSAPI.vidEncode('0RYXD41N8PNV',"de5y3vCJ2LcsXpB4","qeTyrL6NB0XVAyFT");
// wglvwnVQymbp7NXZ
//
// mediainfo/VXJUraga5p7PpponUcprSzHGJf4elAxN,205,191,182,203,233,207,189,178,174,221,153,192,167,190,199,200?t=4xjRCfcjDVwMzQ%3D%3D&autostart=true
// function qqr(k,v) {
//   var a=[k];
//   for(var i=0;i<v.length;i++){
//     a.push(k.charCodeAt(i%k.length)+v.charCodeAt(i));
//   }
//   return 'mediainfo/'+a.join(',');
// }
//

// https://vidplay.online/mediainfo/VXJUraga5p7PqJogXboaTTfHJ_oWkw9MbQ==,168,171,148,195,216,198,153,192,138,212,122,136,179,193,179,225?t=4xjRCfcvBFEAzw%3D%3D&autostart=true
// https://vidplay.online/mediainfo/VXJUraga5p7MrJojXboaTTfHJ_oWkw9DbQ==,168,171,148,195,216,198,153,192,138,212,122,133,180,193,179,228?t=4xjRCfcvBFEAzw%3D%3D&autostart=true
// https://vidplay.online/mediainfo/VXJUraga5p7MrJojXboaTTfHJ_oWkwNHZw==,168,171,148,195,216,198,153,192,138,212,122,133,180,193,179,228?t=4xjRCfcvBFEAzw%3D%3D&autostart=true


//
// https://vidplay.online/e/83P784EK7JLE?t=4xjRCfchAF0Lzw%3D%3D&autostart=true
//                                      ?t=4xjRCfchAF0Lzw%3D%3D&autostart=true
// https://vidplay.online/mediainfo/VXJUraga5p7PqJogXboaTTfHJ_oYlwNHbQ==,157,131,193,152,232,197,212,211,133,191,142,151,185,146,186,209?t=4xjRCfchAF0Lzw%3D%3D&autostart=true

const wave={
  ns:'https://'+__DNS,
  origin:{
    "X-Org-Prox":"https://"+__DNS+"/",
    "X-Ref-Prox":"https://"+__DNS+"/",
    'X-Requested-With':'XMLHttpRequest',
    'Pragma':'no-cache',
    'Cache-Control':'no-cache'
  },
  rc4:function(key, str) {
    var s = [], j = 0, x, res = '';
    for (var i = 0; i < 256; i++) {
      s[i] = i;
    }
    for (i = 0; i < 256; i++) {
      j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
    }
    i = 0;
    j = 0;
    for (var y = 0; y < str.length; y++) {
      i = (i + 1) % 256;
      j = (j + s[i]) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
      res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return res;
  },
  safeBtoa:function(s){
    return btoa(s).replace(/\//g, '_').replace(/\+/g, '-');
  },
  safeAtob:function(s){
    return atob(s.replace(/_/g, '/').replace(/-/g, '+'))
  },
  vrfShift:function(vrf) {
    var shift = [-3, 3, -4, 2, -2, 5, 4, 5];
    var o=[];
    for (var i = 0; i < vrf.length; i++) {
      o.push(
        String.fromCharCode(vrf.charCodeAt(i)+shift[i%8])
      );
    }
    return o.join('');
  },
  rot13:function(vrf) {
    o=[];
    var cA = 'A'.charCodeAt(0);
    var cZ = 'Z'.charCodeAt(0);
    var ca = 'a'.charCodeAt(0);
    var cz = 'z'.charCodeAt(0);
    for (var i = 0; i < vrf.length; i++) {
      var b = vrf.charCodeAt(i);
      if (b >= cA && b <= cZ) {
        o.push( String.fromCharCode(((b - cA + 13) % 26) + cA) );
      } else if (b >= ca && b <= cz) {
        o.push( String.fromCharCode(((b - ca + 13) % 26) + ca) );
      }
      else{
        o.push(vrf.charAt(i));
      }
    }
    return o.join('');
  },
  vrfEncrypt:function(input) {
    var vrf = wave.rc4("ysJhV6U27FVIjjuk", input);
    vrf=wave.safeBtoa(vrf);
    vrf=btoa(vrf);
    vrf=wave.vrfShift(vrf);
    vrf=btoa(vrf);
    vrf=wave.rot13(vrf);
    return vrf;
  },
  vrfDecrypt:function(input){
    var vrf = wave.safeAtob(input);
    vrf = wave.rc4("hlPeNwkncH0fq9so",vrf);
    return decodeURIComponent(vrf);
  },
  
  /* Get Episode View */
  view_cache:{},
  getView:function(url_with_hash, f){
    var uid=++_API.viewid;
    var url_parse_hash=url_with_hash.split('#');
    var url=url_parse_hash[0];
    var hash_ep='';
    if (url_parse_hash[1]){
      hash_ep=url_parse_hash[1];
    }
    var url_parse=url.split('/');
    var animeId = url_parse[4];
    var epId = 1;
    if (url_parse[5]){
      epId=url_parse[5].substring(3);
    }

    var root_view_url='https://'+__DNS+(__SD==1?'/watch/':'/anime/')+animeId;
    var watch_url=root_view_url+'/ep-'+epId;
    console.log("WATCH URL : "+watch_url);

    console.log(
      "wave.getView - EPID: "+epId+" / url="+url+" / fullurl = "+url_with_hash+" / animeId = "+animeId+" / ROOTURL = "+root_view_url);
    var data=null;

    function cbErr(msg){
      console.warn(msg);
      f({status:false},uid);
    }

    function skipScore(s){
      var sc=(s[0][0]+s[0][1]>0)?1:0;
      sc+=(s[1][0]+s[1][1]>0)?1:0;
      return sc;
    }
    function callCb(d){
      if (!d.stream_url.hard){
        d.stream_url.hard=d.stream_url.soft;
        d.skip_vals.hard=d.skip_vals.soft;
      }
      d.stream_vurl = d.stream_url.hard;
      d.skip=d.skip_vals.hard;
      var cscore=skipScore(d.skip);
      d.streamtype="sub";
      var is_soft=false;
      if (_API.currentStreamType==2){
        if (d.stream_url.dub){
          d.stream_vurl = d.stream_url.dub;
          d.streamtype="dub";
          if (d.skip_vals.dub.length>0){
            if (cscore<skipScore(d.skip_vals.dub)){
              d.skip=d.skip_vals.dub;
            }
          }
        }
        else if (pb.cfg_data.lang!='hard' || pb.cfg_data.lang!='sub'){
          is_soft=true;
        }
      }
      if (is_soft||_API.currentStreamType==1){
        if (d.stream_url.soft){
          d.stream_vurl = d.stream_url.soft;
          d.streamtype="softsub";
          if (d.skip_vals.soft.length>0){
            if (cscore<skipScore(d.skip_vals.soft)){
              d.skip=d.skip_vals.soft;
            }
          }
        }
      }
      f(JSON.parse(JSON.stringify(d)),uid);
    }

    function loadServer(){
      var slist_url=
        "/ajax/server/list/"+
        data.curr_ep+'?vrf='+enc(wave.vrfEncrypt(data.curr_ep));
      var num_servers=0;
      var loaded_servers=0;
      function fetchServer(t,s){
        data.stream_url[t]='';
        data.skip_vals[t]=[];
        if (!s){
          return;
        }
        var dLink=s.getAttribute('data-link-id');
        var svurl=
          "/ajax/server/"+
          dLink+'?vrf='+enc(wave.vrfEncrypt(dLink));
        $a(svurl,function(r){
          if (r.ok){
            try{
              var j=JSON.parse(r.responseText);
              var surl=wave.vrfDecrypt(j.result.url);
              var skdt=JSON.parse(wave.vrfDecrypt(j.result.skip_data));
              data.stream_url[t]=surl;
              data.skip_vals[t]=[
                skdt.intro,
                skdt.outro
              ];
            }catch(e){}
          }
          if (++loaded_servers>=num_servers){
            data.status=true;
            callCb(data);
          }
        },{
          'X-Requested-With':'XMLHttpRequest',
          "X-Ref-Prox":url
        });
      }
      function findServer(d){
        var sid={
          main:null,
          mirror:null,
        };
        for (var i=0;i<d.length;i++){
          var s=d[i];
          var st=s.textContent.toLowerCase().trim();
          if (st=='vidplay') sid.main=s;
          else if (st=='mycloud') sid.mirror=s;
        }
        var load_s=null;
        if (!pb.cfg_data.mirrorserver){
          load_s=(sid.main)?sid.main:sid.mirror;
        }
        else{
          load_s=(sid.mirror)?sid.mirror:sid.main;
        }
        if (load_s){
          num_servers++;
          return load_s;
        }
        return null;
      }
      $a(slist_url,function(r){
        if (r.ok){
          var query_el=(__SD==1)?'li':'div.server';
          try{
            var j=JSON.parse(r.responseText);
            var d=$n('div','',0,0,j.result);
            fetchServer('hard',findServer(d.querySelectorAll('[data-type=sub] '+query_el)));
            fetchServer('soft',findServer(d.querySelectorAll('[data-type=softsub] '+query_el)));
            fetchServer('dub',findServer(d.querySelectorAll('[data-type=dub] '+query_el)));
            d.innerHTML='';
            d='';
            return;
          }catch(e){}
        }
        cbErr('findServer');
      },{
        'X-Requested-With':'XMLHttpRequest',
        "X-Ref-Prox":url
      });
    }

    if (animeId in wave.view_cache){
      data=wave.view_cache[animeId];
      data.url=watch_url;
      var sold=data.ep[data.curr_ep_index];
      if (sold){
        sold.active=false;
      }
      for (var i=0;i<data.ep.length;i++){
        var s=data.ep[i];
        var g=false;
        if (hash_ep){
          if (hash_ep==s.ids) g=true;
        }else if (epId==s.datanum) g=true;
        if (g){
          s.active=true;
          data.curr_ep=s.ids;
          data.curr_ep_index=i;
          break;
        }
      }
      loadServer();
      return uid;
    }
    else{
      data={
        status:true,
        title:'',
        title_jp:'',
        synopsis:'',
        stream_url:{
            hard:'',
            soft:'',
            dub:''
        },
        skip_vals:{
          hard:[],
          soft:[],
          dub:[]
        },
        stream_vurl:'',
        poster:'',
        banner:null,
        "url":watch_url,
        skip:[],
        ep:[],
        related:[],
        genres:[],
        seasons:[],
        recs:[],
        info:{
            type:null,
            rating:null,
            quality:null
        },
        curr_ep:0,
        curr_ep_index:0,
        animeId:null
      };
    }

    function getEpisodes(){
      var eps_url="/ajax/episode/list/"+data.animeId+'?vrf='+enc(wave.vrfEncrypt(data.animeId));
      $a(eps_url,function(r){
        if (r.ok){
          try{
            var j=JSON.parse(r.responseText);
            var d=$n('div','',0,0,j.result);
            var ep=[];
            if (__SD==1){
              ep=d.querySelectorAll(".body li a");
            }
            else{
              ep=d.querySelectorAll("div.range-wrap a");
            }
            data.ep=[];
            for (var i=0;i<ep.length;i++){
              var a=ep[i];
              var s={};
              s.ids=a.getAttribute('data-ids');
              s.sub=toInt(a.getAttribute('data-sub'))?true:false;
              s.dub=toInt(a.getAttribute('data-dub'))?true:false;
              s.slug=a.getAttribute('data-slug');
              s.datanum=a.getAttribute('data-num');
              s.url=root_view_url+'/ep-'+s.slug+"#"+s.ids;
              var b=a.firstElementChild;
              if (b){
                s.ep=b.textContent;
                var span=b.nextElementSibling;
                s.title=span.textContent;
              }
              else{
                s.ep=a.textContent;
                s.title='';
              }

              if (epId==s.datanum){
              // if (a.classList.contains('active')){
                s.active=true;
                data.curr_ep=s.ids;
                data.curr_ep_index=i;
              }
              if (a.classList.contains('filler')){
                s.filler=true;
              }
              data.ep.push(s);
            }
            d.innerHTML='';
            d='';

            // Cache:
            wave.view_cache[animeId]=data;
            loadServer();
            return;
          }catch(e){
            console.warn("Error wave.getEpisodes "+e);
          }
        }
        cbErr('getEpisodes');
      },{'X-Requested-With':'XMLHttpRequest'});
    }
    function waveParse(d){
      try{
        var player=d.querySelector('#player');
        data.animeId=d.querySelector('#watch-main').getAttribute('data-id');
        try{
          data.banner=player.style.backgroundImage.slice(4, -1).replace(/["']/g, "");
        }catch(e){}
        data.poster=d.querySelector('#w-info img').src;
        var title=d.querySelector('#w-info h1')
        data.title=title.textContent;
        data.title_jp=title.getAttribute('data-jp');
        data.synopsis=d.querySelector('#w-info .info .synopsis .content').textContent;

        /* info */
        var info=d.querySelector('#w-info');
        if (info){
            /* get genres */
            var bmeta=info.getElementsByClassName('bmeta');
            if (bmeta[0]){
                try{
                    /* Find Genres */
                    var k=bmeta[0].firstElementChild.lastElementChild.getElementsByTagName('a');
                    for (var i=0;i<k.length;i++){
                        try{
                            var gn={};
                            gn.val=k[i].href.substring(k[i].href.lastIndexOf('/')+1);
                            gn.name=k[i].textContent.trim();
                            data.genres.push(gn);
                        }catch(ee){}
                    }
                }catch(e){}
                try{
                    /* Find Type */
                    var r=bmeta[0].firstElementChild.firstElementChild.getElementsByTagName('a');
                    if (r.length>0){
                        data.info.type={
                            val:r[0].getAttribute('href'),
                            name:r[0].textContent.trim()
                        };
                    }
                }catch(e){}
            }
            try{
                /* rating */
                data.info.rating=info.querySelectorAll("i.rating")[0].textContent;
            }catch(e){}
            try{
                /* quality */
                data.info.quality=info.querySelectorAll("i.quality")[0].textContent;
            }catch(e){}
        }

        /* get seasons */
        var ses=d.querySelector('#w-seasons');
        if (ses){
            var sa=ses.getElementsByTagName('a');
            data.seasons=[];
            for (var i=0;i<sa.length;i++){
                var sv={};
                sv.url=sa[i].href;
                sv.title=sa[i].textContent.trim();
                if (sa[i].parentNode.className.indexOf(' active')>0)
                    sv.active=true;
                try{
                    sv.poster=sa[i].style.backgroundImage.slice(4, -1).replace(/["']/g, "");
                }catch(e){}
                data.seasons.push(sv);
            }
        }

        /* get related */
        var rel=d.querySelector('#w-related');
        if (rel){
            var ri=rel.getElementsByTagName('a');
            for (var i=0;i<ri.length;i++){
                try{
                    var ra=ri[i];
                    var rd={};
                    rd.poster=ra.getElementsByTagName('img')[0].src;
                    rd.url=ra.href;
                    rd.title=ra.getElementsByClassName('d-title')[0].textContent.trim();
                    var dtip=ra.querySelector('[data-tip]');
                    if (dtip)
                       rd.tip=dtip.getAttribute('data-tip');
                    data.related.push(rd);
                }catch(e){}
            }
        }

        /* get recs */
        var ws=d.querySelector('#watch-second');
        if (ws){
            var wss=ws.querySelector('section.w-side-section');
            if (wss){
                var recs=wss.querySelectorAll('a.item');
                for (var i=0;i<recs.length;i++){
                    try{
                        var ra=recs[i];
                        var rd={};
                        rd.url=ra.href;
                        rd.poster=ra.querySelector('img').src;
                        rd.title=ra.querySelector('div.d-title').textContent.trim();
                        var dtip=ra.querySelector('[data-tip]');
                        if (dtip)
                           rd.tip=dtip.getAttribute('data-tip');
                        data.recs.push(rd);
                    }catch(e){}
                }
            }
        }

        getEpisodes();
        return true;
      }catch(e){
        console.warn("Error waveParse "+e);
      }
      return false;
    }

    function anixParse(d){
      try{
        data.animeId=d.querySelector('main div.watch-wrap').getAttribute('data-id');
        var ply=d.querySelector('#ani-player-section');
        try{
          data.banner=ply.querySelector('div.player-bg').style.backgroundImage.slice(4, -1).replace(/["']/g, "");
        }catch(e){}
        /* info */
        var info=d.querySelector('#ani-detail-info');
        if (info){
            var poster=info.querySelector('div.poster img');
            var title=info.querySelector('.maindata h1');
            var content=info.querySelector('.maindata .description .full.cts-block');
            if (poster){
              data.poster=poster.src;
            }
            if (title){
                data.title=(title.textContent+"").trim();
                data.title_jp=title.getAttribute('data-jp');
            }
            if (content){
              data.synopsis=(content.textContent+"").trim();
            }

            /* get genres */
            var bmeta=info.querySelector('.metadata');
            if (bmeta){
              var cmeta=bmeta.querySelectorAll('div.limiter div div');
              function findMeta(kw){
                for (var i=0;i<cmeta.length;i++){
                  if ((cmeta[i].textContent+"").trim().toLowerCase()==kw){
                    return cmeta[i].nextElementSibling;
                  }
                }
                return null;
              }

              var gnr=findMeta('genre:');
              if (gnr){
                try{
                  var k=gnr.querySelectorAll('a');
                  for (var i=0;i<k.length;i++){
                    try{
                      var gn={};
                      gn.val=k[i].href.substring(k[i].href.lastIndexOf('/')+1);
                      gn.name=k[i].textContent.trim();
                      data.genres.push(gn);
                    }catch(ee){}
                  }
                }catch(e){}
              }
              
              gnr=findMeta('type:');
              if (gnr){
                try{
                  var k=gnr.querySelector('a');
                  if (k){
                    data.info.type={
                      val:k.getAttribute('href'),
                      name:k.textContent.trim()
                    };
                  }
                }catch(e){}
              }
            }
            try{
                /* rating */
                data.info.rating=info.querySelector('.maindata .sub-info .rating').textContent;
            }catch(e){}

            try{
                /* quality */
                data.info.quality=info.querySelector('.maindata .sub-info .quality').textContent;
            }catch(e){}
        }

        /* get seasons */
        if (ply){
          data.seasons=[];
          var sa=ply.querySelectorAll('div.ani-season div.ani-season-body a');
          for (var i=0;i<sa.length;i++){
              var sv={};
              sv.url=sa[i].href;
              sv.title=(sa[i].textContent+'').trim();
              if (sa[i].classList.contains('active')){
                  sv.active=true;
              }
              try{
                  sv.poster=sa[i].querySelector('div.swiper-banner').style.backgroundImage.slice(4, -1).replace(/["']/g, "");
              }catch(e){}
              data.seasons.push(sv);
          }
        }

        /* get related */
        var ri=d.querySelectorAll('section.sidebar-set.related div.sidebar-item a');
        for (var i=0;i<ri.length;i++){
            try{
                var ra=ri[i];
                var rd={};
                rd.poster=ra.querySelector('div.poster img').src;
                rd.url=ra.href;
                rd.title=(ra.querySelector('div.ani-detail div.ani-name').textContent+'').trim();
                rd.tip=ra.querySelector('div.poster').getAttribute('data-tip');
                data.related.push(rd);
            }catch(e){}
        }

        var ws=d.querySelectorAll('section.sidebar-set:not(.related) div.sidebar-item a');
        for (var i=0;i<ws.length;i++){
            try{
                var ra=ws[i];
                var rd={};
                rd.poster=ra.querySelector('div.poster img').src;
                rd.url=ra.href;
                rd.title=(ra.querySelector('div.ani-detail div.ani-name').textContent+'').trim();
                rd.tip=ra.querySelector('div.poster').getAttribute('data-tip');
                data.recs.push(rd);
            }catch(e){}
        }

        getEpisodes();
        return true;
      }catch(e){
        console.warn("Error anixParse "+e);
      }
      return false;
    }

    $a(watch_url,function(r){
      if (r.ok){
        try{
          var d=$n('div','',0,0,r.responseText);
          var isok=false;
          if (__SD==1){
            isok=waveParse(d);
          }
          else{
            isok=anixParse(d);
          }
          d.innerHTML='';
          d='';
          if (isok){
            return;
          }
        }catch(e){
          console.warn("ERR WatchURL = "+e);
        }
      }
      cbErr('getWatch : '+watch_url);
    },
    {
      'Pragma':'no-cache',
      'Cache-Control':'no-cache'
    });

    return uid;
  }
  
};


/* ajax request */
function $a(uri, cb, hdr, pd){
  var xhttp = new XMLHttpRequest();
  if (pd!==undefined){
    xhttp.args=pd;
  }
  xhttp.onload = function() {
    if (!__SD3){
      if (xhttp.status==403){
        if (((uri.indexOf("https://")==-1)||(uri.indexOf("https://"+__DNS)==0)) 
          && (uri.indexOf("/__proxy/")!=0)){
          _JSAPI.cfCheck();
          setTimeout(function(){
            $a(uri, cb);
          },2500);
          return;
        }
      }
    }
    xhttp.ok=true;
    cb(xhttp);
  };
  xhttp.onerror = function() {
      xhttp.ok=false;
      cb(xhttp);
  };
  xhttp.open("GET", uri, true);
  if (hdr){
    if (hdr===1){
      if (__SD3){
        xhttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
      }
    }
    else{
      for (var k in hdr){
        xhttp.setRequestHeader(k, hdr[k]);
      }
    }
  }
  xhttp.send();
}

// if (!__SD3&&!__SD5){
//   $a('/ajax/user/panel',function(r){
//     if (r.ok){
//       var x=r.responseText;
//       if (x.indexOf('"/waf-js-run"')>0){
//         if (confirm(
//           "Source : "+__SD_NAME+" Is Blocked your connection\n"+
//           "Change source now?"
//         )){
//           _JSAPI.setSd(5);
//           setTimeout(function(){
//             _API.reload();
//           },200);
//         }
//       }
//     }
//   });
// }

/* proxy ajax */
function $ap(uri, cb, hdr){
  $a("/__proxy/"+uri,cb, hdr);
}

/* proxy image */
function $img(src){
  if (!src || ((src+'')=='undefined')){
    return '/__view/noimg.jpg';
  }
  return src;
}

function $imgcdn(src){
  try{
    return src.replace('@100.jpg','.jpg');
  }catch(e){}
  return src;
}

function stripHtml(s){
  var d=$n('div','',null,null,s);
  s=d.textContent;
  d.innerHTML='';
  d=null;
  return s;
}

/* new element */
function $n(t,c,a,p,h){
  var l=document.createElement(t);
  if (a!=undefined&&a){
    for (var i in a)
      l.setAttribute(i,a[i]);
  }
  if (c!=undefined&&c) l.className=c;
  if (h!=undefined&&h) l.innerHTML=h;
  if (p!=undefined&&p) p.appendChild(l);
  return l;
}

/* htmlspecial */
function special(str){
  return (str+"").replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function tspecial(str){
    return '<ttl>'+special(str)+'</ttl>';
}

/* trim */
function trim(s){
  return (s+"").trim();
}

function slugString(Text,rp) {
  if (!rp){
    rp=' ';
  }
  return Text.toLowerCase()
    .replace(/[^\w]+/g, " ")
    .replace(/  /g, "  ")
    .replace(/  /g, " ")
    .replace(/  /g, " ")
    .replace(/  /g, " ")
    .replace(/ /g, rp).trim();
}

/* nl2br */
function nlbr(s) {
  return s.replace(/\n/g, "<br>");
}

/* url encode */
function enc(s){
  return encodeURIComponent(s);
}

/* time tick */
function $tick() {
  var dt = new Date();
  return dt.getTime();
}

function $time(){
  return Math.floor($tick()/1000);
}

/* make search query url from object */
function query(r){
  var v=[];
  for (var i in r){
    v.push(i+'='+enc(r[i]));
  }
  return v.join('&');
}

/* Parse Number */
function toInt(x) {
  var x = parseInt(x);
  return isNaN(x)?0:x;
}
function toFloat(x) {
  var x = parseFloat(x);
  return isNaN(x)?0:x;
}

/* absolute y position */
function absY(v){
  var rect = v.getBoundingClientRect();
  return rect.y+window.scrollY;
}

/* doublepad */
function pad2(v) {
  return ("00" + v).slice(-2);
}

/* seconds to timestamp */
function sec2ts(s,nohour){
  var s=Math.floor(s);
  var h=Math.floor(s/3600);
  s-=(h*3600);
  var m=Math.floor(s/60.0);
  s-=m*60;
  var o='';
  if (!nohour||h>0)
    o+=h+":";
  o+=pad2(m)+":"+pad2(s);
  return o;
}

function md2html(text){
  return nlbr(special(text))
    .replace(/(?:\*\*)([^*<\n]+)(?:\*\*)/g, "<strong>$1</strong>")
    .replace(/(?:__)([^_<\n]+)(?:__)/g, "<u>$1</u>")
    .replace(/(?:\*)([^*<\n]+)(?:\*)/g, "<i>$1</i>")
    .replace(/(?:_)([^_<\n]+)(?:_)/g, "<i>$1</i>")
    .replace(/(?:`)([^`<\n]+)(?:`)/g, "<t>$1</t>")
}

/**************************** ANIMEFLIX ***************************/
const __AFLIX = {
  ns:'https://'+_JSAPI.flix_dns(),
  cache:{},
  req_cache:{},
  slug_cache:{},
  req:function(u,cb,shouldJson,nocache){
    var cache_name=slugString(u,'_');
    if (!nocache){
      if (cache_name in __AFLIX.req_cache){
        if (__AFLIX.req_cache[cache_name].exp>$time()){
          setTimeout(function(){
            cb(JSON.parse(JSON.stringify(__AFLIX.req_cache[cache_name])));
          },5);
          return;
        }
      }
    }
    $ap(__AFLIX.ns+u,function(r){
      if (r.ok){
        r.contentType=r.getResponseHeader('content-type');
        if (shouldJson && r.contentType!='application/json'){
          r.ok=false;
        }
      }
      if (r.ok){
        __AFLIX.req_cache[cache_name]=JSON.parse(JSON.stringify({
          responseText:r.responseText,
          contentType:r.contentType,
          ok:true,
          exp:$time()+240
        }));
      }
      else{
        delete __AFLIX.req_cache[cache_name];
        if (shouldJson){
          if (--shouldJson>0){
            // Retry
            setTimeout(function(){
              __AFLIX.req(u,cb,shouldJson);
            },10);
            return;
          }
        }
      }
      cb(r);
    },__AFLIX.origin);
  },
  setCache:function(u){
    try{
      __AFLIX.cache[u.anilistID]=JSON.stringify(u);
      __AFLIX.slug_cache[u.slug]=u.anilistID;
    }catch(e){};
  },
  setUrl:function(slug,alid){
    return slug+"/"+alid;
  },
  getUrl:function(url){
    return url.split("#")[0];
  },
  getEp:function(url){
    var p=url.split("#");
    return (p[1]?p[1]:1);
  },
  getSlug:function(url){
    return __AFLIX.getUrl(url).split("/")[0];
  },
  getAid:function(url){
    return __AFLIX.getUrl(url).split("/")[1];
  },
  getTitle:function(u,jp){
    if (jp){
      if (u.title.romaji)
        return u.title.romaji;
    }
    else{
      if (u.title.english)
        return u.title.english;
    }
    if (u.userPreferred)
        return u.userPreferred;
    if (u.title.english)
        return u.title.english;
    if (u.title.romaji)
        return u.title.romaji;
    return 'No-title';
  },
  dec:function(x){
    var l=x.length,o=[],i;
    for (i=0;i<l;i+=2){
        o.push(String.fromCharCode(parseInt(x.substring(i,i+2), 20)));
    }
    return o.join('');
  },
  enc:function(x){
      var l=x.length,o=[],i;
      for (i=0;i<l;i++){
          o.push(x.charCodeAt(i).toString(20));
      }
      return o.join('');
  },
  enc_kk:["getUTCDate", "getUTCMonth", "0", "padStart", "floor", "charCodeAt", "", "reduce", "split"],
  enc2:function(e) {
      var kk=__AFLIX.enc_kk;
      var t = new Date
        , n = 17 + (t[kk[0]]() - t[kk[1]]()) / 2;
      return e[kk[8]](kk[6])[kk[7]](((e,t)=>e + t[kk[5]](0).toString(Math[kk[4]](n))[kk[3]](2, kk[2])), kk[6])
  }
};
__AFLIX.origin={
  "X-Org-Prox":__AFLIX.ns,
  "X-Ref-Prox":"https://"+__DNS+"/",
  'X-Requested-With':'XMLHttpRequest',
  'Pragma':'no-cache',
  'Cache-Control':'no-cache'
};
__AFLIX.origin_dev={
  "X-Org-Prox":__AFLIX.ns,
  "X-Ref-Prox":__AFLIX.ns
};
/**************************** GLOBAL LISTENERS ***************************/
/* Key event handler */
window._KEYEV=function(key, evSource){
  if (!evSource) evSource=0;
  _API.last_key_source=evSource;
  if (_API.keycb){
    if (_API.keycb(key))
      return true;
  }
  return false;
};

/**** NON KEY GESTURES ******/
(function(){
  window.addEventListener("wheel", event => {
    if (event.deltaY < 0)
    {
      _KEYEV(KUP);
    }
    else if (event.deltaY > 0)
    {
      _KEYEV(KDOWN);
    }
  });
})();
/**** NON KEY GESTURES ******/

/* JS default key event listener */
document.addEventListener('keydown', function(e) { 
  var key = e.keyCode || e.which;
  if (window._KEYEV(key)){
    e.stopPropagation();
    e.preventDefault();
    return false;
  }
  return true;
});

/* Window message listener */
window.addEventListener('message',function(e) {
  if (_API.messagecb)
  _API.messagecb(e);
});

/* JSAPI getview callback handler */
window.__GETVIEWCB=function(d,u){
  if(_API.viewcb)
    _API.viewcb(d,u);
};

window.__M3U8CB=function(d){
  if(_API.m3u8cb)
    _API.m3u8cb(d);
}
window.__VIDPAGELOADCB=function(d){
  if(_API.vidpageload)
    _API.vidpageload(d);
}

/* mp4upload url callback */
window.__MP4CB=function(d){
  if(_API.mp4cb) 
  _API.mp4cb(d);
};

/* Number of bgimage */
const BGIMG_NUM=9;

/* Key codes */
const KUP=38;
const KDOWN=40;
const KLEFT=37;
const KRIGHT=39;
const KBACK=27;
const KENTER=13;
const KPGUP=33;
const KPGDOWN=34;
const KPLAY=402;
const KNEXT=403;
const KPREV=401;

/***************************** API HANDLERS *****************************/
const _API={
  /* USER-MANAGEMENT */
  user:'', /* current user prefix _API.user */
  user_prefix:'', /* current localStorage user prefix _API.user_prefix */
  
  html_class:'',

  /*** THEMES ***/
  theme_list:[
    '',
    'theme_blue',
    'theme_teal',
    'theme_green',
    'theme_brown',
    'theme_red',
    'theme_grey'
  ],
  theme_sel:0,
  theme_update:function(){
    var itm=_JSAPI.storeGet(_API.user_prefix+"theme","");
    if (itm){
      document.documentElement.className=itm+' '+_API.html_class;
      _API.theme_sel=_API.theme_list.indexOf(itm);
      if (_API.theme_sel<0) _API.theme_sel=0;
    }
    else{
      document.documentElement.className=_API.html_class;
    }
  },

  bgimg_update:function(){
    $('animebg').className='bg'+pb.cfg_data.bgimg;
  },

  listPrompt:function(title,list,sel){
    var d={
      'type':'list',
      'title':title,
      'list':list
    };
    if (sel!=undefined){
      d.sel=sel;
    }
    return prompt(JSON.stringify(d));
  },

  animeId:function(url){
    if (__SD3){
      var ux=url.split('/');
      if (ux.length>1){
        var url_parse=ux[1].split('#');
        return url_parse[0];
      }
    }
    else if (__SD5){
      return url;
    }
    else{
      var url_parse=url.split('/');
      if (url_parse.length>=5){
        return url_parse[4];
      }
    }
    return null;
  },

  /*** GENRES ***/
  genres:{
    "_tv":"tv","_movie":"movie",
    "_ova":"ova","_ona":"ona",
    "_special":"special",

    "action":"1","adventure":"2","avant_garde":"2262888",
    "comedy":"4","demons":"4424081","drama":"7","ecchi":"8","fantasy":"9",
    "gourmet":"2263289","harem":"11","horror":"14","isekai":"3457284","iyashikei":"4398552",
    "josei":"15","kids":"16","magic":"4424082","mahou_shoujo":"3457321","martial_arts":"18",
    "mecha":"19","military":"20","music":"21","mystery":"22","parody":"23","psychological":"25",
    "reverse_harem":"4398403","romance":"26","school":"28","sci_fi":"29","seinen":"30","shoujo":"31",
    "shounen":"33","slice_of_life":"35","space":"36","sports":"37","super_power":"38",
    "supernatural":"39","suspense":"2262590","thriller":"40","vampire":"41"
  },

  genres_hi:{
    "_tv":"2","_movie":"1",
    "_ova":"3","_ona":"4",
    "_special":"5",
    "_music":"6",

    // "TV","MOVIE","OVA","ONA","SPECIAL"

    "action":"1","adventure":"2","cars":"3","comedy":"4","dementia":"5","demons":"6","drama":"8",
    "ecchi":"9","fantasy":"10","game":"11","harem":"35","historical":"13","horror":"14","isekai":"44",
    "josei":"43","kids":"15","magic":"16","martial_arts":"17","mecha":"18","military":"38","music":"19",
    "mystery":"7","parody":"20","police":"39","psychological":"40","romance":"22","samurai":"21","school":"23",
    "sci-fi":"24","seinen":"42","shoujo":"25","shoujo_ai":"26","shounen":"27","shounen_ai":"28","slice_of_life":"36",
    "space":"29","sports":"30","super_power":"31","supernatural":"37","thriller":"41","vampire":"32"
  },

  genres_flix:{
    "_tv":"TV","_movie":"MOVIE",
    "_ova":"OVA","_ona":"ONA",
    "_special":"SPECIAL",

    "action":"Action","adventure":"Adventure","comedy":"Comedy","drama":"Drama","ecchi":"Ecchi","fantasy":"Fantasy",
    "horror":"Horror","mecha":"Mecha","mystery":"Mystery","psychological":"Psychological","romance":"Romance",
    "sci_fi":"Sci-Fi","sports":"Sports","supernatural":"Supernatural","thriller":"Thriller"
  },

  filterurl:function(q,genres,sort,page,ses,year){
    /*
      sort: 1.Relevant, 2.RecentUpdate
    */
    var uri='';
    if (!__SD3 && !__SD5){
      var qv=[];
      
      qv.push('keyword='+enc(q));
      // Wave & Anix
      if (ses){
        qv.push('season='+enc(ses));
      }
      if (year){
        qv.push('year='+enc(year));
      }

      if (!ses){
        if (genres){
          for (var i=0;i<genres.length;i++){
            var vl=genres[i];
            if (vl.charAt(0)=='_'){
              qv.push(enc('type[]')+'='+enc(_API.genres[vl]));
            }
            else{
              qv.push(enc('genre[]')+'='+enc(_API.genres[vl]));
            }
          }
          qv.push('genre_mode=and');
        }
        if (!pb.cfg_data.nonjapan){
          qv.push(enc('country[]')+'=120822');
        }
        qv.push(enc('language[]')+'=sub');
      }
      if (sort==1){
        qv.push('sort=most_relevance');
      }
      else if (sort==2){
        qv.push('sort=recently_updated');
      }

      if (page&&(page>1)){
        qv.push('page='+page);
      }
      uri='/filter?'+qv.join('&');
      console.log('FILTER: '+uri);
    }
    else if (__SD5){
      // ANIME FLIX
      var filters={};
      var qv=[];
      q=(q+'').toLowerCase();
      qv.push('query='+enc(q));
      if (genres){
        var gnr=[];
        var tps=[];
        for (var i=0;i<genres.length;i++){
          var vl=genres[i];
          if (vl.charAt(0)=='_'){
            tps.push(_API.genres_flix[vl]);
          }
          else{
            gnr.push(_API.genres_flix[vl]);
          }
        }
        if (tps.length>0){
          filters.type=tps;
        }
        if (gnr.length>0){
          filters.genre=gnr;
        }
      }
      var ksalt=q;
      if (q.length>3){
        ksalt=q.substring(0,3);
      }
      qv.push('limit=15');
      qv.push('filters='+enc(JSON.stringify(filters)));
      qv.push('k='+enc(__AFLIX.enc2(ksalt)));

      if (!q){
        uri='';
        if (filters.genre.length>0){
          uri='/__proxy/'+__AFLIX.ns+'/genres/'+(filters.genre[filters.genre.length-1])+'?page='+(page>1?page-1:0);
        }
      }
      else{
        uri='/__proxy/'+__AFLIX.ns+'/info/?'+qv.join('&');
      }
      console.log('FILTER: '+uri);
    }
    else{
      // HIANIME
      var qv=[];
      if (q){
        q=q.substring(0,100).trim();
      }
      qv.push('keyword='+enc(q?q:' '));
      console.log("FILTER URL REQ : "+JSON.stringify([q,genres,sort,page,ses,year]));
      if (!ses){
        if (genres){
          var tgenre=[];
          for (var i=0;i<genres.length;i++){
            var vl=genres[i];
            if (vl.charAt(0)=='_'){
              qv.push(enc('type')+'='+enc(_API.genres_hi[vl]));
            }
            else{
              tgenre.push(_API.genres_hi[vl]);
            }
          }
          if (tgenre.length>0){
            qv.push(enc('genres')+'='+enc(tgenre.join(',')));
          }
        }
        qv.push('language=1');
      }
      if (sort==1){
        qv.push('sort=default');
      }
      else if (sort==2){
        qv.push('sort=recently_updated');
      }
      else if (sort==2){
        qv.push('sort=default');
      }

      if (page&&(page>1)){
        qv.push('page='+page);
      }
      uri='/search?'+qv.join('&');
      console.log('FILTER: '+uri);
    }

    return uri;
  },

  /*** TRANSLATE LANGUAGES ***/
  tlangs:[
    ["Hardsub","hard"],
    ["Dub","dub"],
    ["Disable Subtitle","nosub"],
    ["English","en"],
    /* sources */
    ["Arabic","ar"],["German","de"], ["French","fr"], ["Italian","it"], ["Portuguese","pt"], ["Russian","ru"], ["Spanish","es"],
    /* translates - start=10 */
    ["Indonesian","id"],
    ["Chinese (Simplified)","zh-CN"],["Chinese (Traditional)","zh-TW"],
    ["Danish","da"], ["Dutch","nl"], ["Filipino","tl"],["Finnish","fi"],
    ["Greek","el"],["Hindi","hi"],["Japanese","ja"],
    ["Korean","ko"],["Latin","la"],["Malay","ms"],
    ["Thai","th"],["Vietnamese","vi"],
    ["Afrikaans","af"],["Albanian","sq"],["Amharic","am"],["Armenian","hy"],["Assamese","as"],
    ["Aymara","ay"],["Azerbaijani","az"],["Bambara","bm"],["Basque","eu"],["Belarusian","be"],["Bengali","bn"],["Bhojpuri","bho"],["Bosnian","bs"],
    ["Bulgarian","bg"],["Catalan","ca"],["Cebuano","ceb"],["Chichewa","ny"],
    ["Corsican","co"],["Croatian","hr"],["Czech","cs"],["Dhivehi","dv"],["Dogri","doi"],["Esperanto","eo"],
    ["Estonian","et"],["Ewe","ee"],["Frisian","fy"],["Galician","gl"],["Georgian","ka"],
    ["Guarani","gn"],["Gujarati","gu"],["Haitian Creole","ht"],["Hausa","ha"],["Hawaiian","haw"],["Hebrew","iw"],["Hmong","hmn"],
    ["Hungarian","hu"],["Icelandic","is"],["Igbo","ig"],["Ilocano","ilo"],["Irish","ga"],
    ["Javanese","jw"],["Kannada","kn"],["Kazakh","kk"],["Khmer","km"],["Kinyarwanda","rw"],["Konkani","gom"],["Krio","kri"],
    ["Kurdish (Kurmanji)","ku"],["Kurdish (Sorani)","ckb"],["Kyrgyz","ky"],["Lao","lo"],["Latvian","lv"],["Lingala","ln"],
    ["Lithuanian","lt"],["Luganda","lg"],["Luxembourgish","lb"],["Macedonian","mk"],["Maithili","mai"],["Malagasy","mg"],
    ["Malayalam","ml"],["Maltese","mt"],["Maori","mi"],["Marathi","mr"],["Meiteilon (Manipuri)","mni-Mtei"],["Mizo","lus"],["Mongolian","mn"],
    ["Myanmar (Burmese)","my"],["Nepali","ne"],["Norwegian","no"],["Odia (Oriya)","or"],["Oromo","om"],["Pashto","ps"],["Persian","fa"],["Polish","pl"],
    ["Punjabi","pa"],["Quechua","qu"],["Romanian","ro"],["Samoan","sm"],["Sanskrit","sa"],["Scots Gaelic","gd"],
    ["Sepedi","nso"],["Serbian","sr"],["Sesotho","st"],["Shona","sn"],["Sindhi","sd"],["Sinhala","si"],["Slovak","sk"],["Slovenian","sl"],["Somali","so"],
    ["Sundanese","su"],["Swahili","sw"],["Swedish","sv"],["Tajik","tg"],["Tamil","ta"],["Tatar","tt"],["Telugu","te"],["Tigrinya","ti"],
    ["Tsonga","ts"],["Turkish","tr"],["Turkmen","tk"],["Twi","ak"],["Ukrainian","uk"],["Urdu","ur"],["Uyghur","ug"],["Uzbek","uz"],["Welsh","cy"],
    ["Xhosa","xh"],["Yiddish","yi"],["Yoruba","yo"],["Zulu","zu"]],
  
  tlangs_id:function(id,getid){
    if (!_API.idlang){
      _API.idlang={};
      _API.lang_titles=[];
      for (var i=0;i<_API.tlangs.length;i++){
        var ti=_API.tlangs[i][1];
        var tx=_API.tlangs[i][0];
        _API.idlang[ti]=[tx,i];
        _API.lang_titles.push(tx);
      }
    }
    if (id in _API.idlang){
      return _API.idlang[id][getid?1:0];
    }
    if (getid){
      return 0;
    }
    return "Hardsub";
  },

  /*** URL API ***/
  setUri:function(u){
    try{
      history.pushState({}, "", u);
    }catch(e){}
  },

  reload:function(){
    try{
      _JSAPI.reloadHome();
      // var rloc="https://"+_JSAPI.dns()+"/__view/main.html";
      // console.log("RELOAD HOME = "+rloc);
      // location=rloc;
    }catch(e){
      console.log("ERROR Reload Home = "+e);
    }
  },
  
  checkUpdate(){
    _JSAPI.checkUpdate();
  },

  /*** JSAPI CALLBACKS ***/
  keycb:null,
  messagecb:null,
  mp4cb:null,
  viewcb:null,
  m3u8cb:null,
  vidpageload:null,
  viewid:0,

  last_key_source:0,

  clearCb:function(){
    _API.keycb=null;
    _API.messagecb=null;
    _API.mp4cb=null;
    _API.viewcb=null;
    _API.m3u8cb=null;
    _API.vidpageload=null;
  },

  /* set vizcloud m3u8 callback */
  setVizCb:function(f){
    _API.m3u8cb=f;
  },

  /* set vizcloud page loaded callback */
  setVizPageCb:function(f){
    _API.vidpageload=f;
  },

  /* Set key handler */
  setKey:function(f){
    _API.keycb=f;
  },

  /* Set window message handler */
  setMessage:function(f){
    _API.messagecb=f;
  },

  /* get anime player view data */
  getView:function(url, f){
    if (__SD3){
      return _API.getViewHi(url,f);
    }
    else if (__SD5){
      return _API.getViewFlix(url,f);
    }
    else if (__SD==1||__SD==2){
      return wave.getView(url,f);
    }
    _API.viewcb=f;
    var uid=++_API.viewid;
    if (_JSAPI.getview(url,uid))
      return uid;
    return false;
  },

  // HI ANIME
  hi_last_view:{
    view_url:'',
    data:null
  },
  getViewWave:function(url,f){
    function cbErr(){
      f({status:false},uid);
    }
    var data={
      streamtype:"",
      stp:0,
      status:true,
      title:'-',
      title_jp:'-',
      synopsis:'',
      stream_url:{
          hard:'',
          soft:'',
          dub:''
      },
      stream_vurl:'',
      poster:'',
      banner:null,
      "url":url,
      skip:[],
      ep:[],
      related:[],
      genres:[],
      seasons:[],
      recs:[],
      info:{
          type:null,
          rating:null,
          quality:null
      }
    };

    /* Load Main Episode */
    $a(url,function(r){
      if (r.ok){
        try{
          var d=$n('div','',0,0,r.responseText);

          if (__SD==1){
            // Wave

          }
          
          d.innerHTML='';
          return;
        }catch(e){}
      }
      cbErr();
    });
  },
  getViewFlix:function(url,f){
    var slug=__AFLIX.getSlug(url);
    var aid=__AFLIX.getAid(url);
    var get_ep = __AFLIX.getEp(url);
    var viewurl = __AFLIX.getUrl(url);
    var uid=++_API.viewid;

    function runCb(d){
      if (_API.hi_last_view.data==null){
        _API.hi_last_view.data=d;
      }
      else{
        for (var k in d){
          _API.hi_last_view.data[k]=d[k];
        }
        _API.hi_last_view.data.status=true;
        f(JSON.parse(JSON.stringify(_API.hi_last_view.data)),uid);
      }
    }

    function getEpServer(d,edat){
      var load_n=0;
      if (edat.sub) load_n++;
      if (edat.dub) load_n++;
      d.skip=[];
      console.log(['getEpServer',edat]);
      if (edat.sub){
        __AFLIX.req(edat.sub,function(r){
          if (r.ok){
            try{
              var k=JSON.parse(r.responseText);
              d.stream_sub_url=k.source;
            }catch(e){}
          }
          if (--load_n<1){
            runCb(d);
          }
        },6);
      }
      if (edat.dub){
        __AFLIX.req(edat.dub,function(r){
          if (r.ok){
            try{
              var k=JSON.parse(r.responseText);
              d.stream_dub_url=k.source;
            }catch(e){}
          }
          if (--load_n<1){
            runCb(d);
          }
        },3);
      }
      if (load_n==0){
        _API.hi_last_view.view_url='';
        _API.hi_last_view.data=null;
        f({status:false},uid);
      }
    }

    if (_API.hi_last_view.view_url==aid){
      if (_API.hi_last_view.data && _API.hi_last_view.data.ep){
        pb.open_ttip(_API.hi_last_view.data);
        /* Just Load Server */
        var eps=_API.hi_last_view.data.ep;
        var active_ep_id=null;
        if (_API.hi_last_view.data.ep[_API.hi_last_view.data.active_ep_index]){
          _API.hi_last_view.data.ep[_API.hi_last_view.data.active_ep_index].active=false;
          for (var i=0;i<eps.length;i++){
            var s=eps[i];
            if (get_ep==s.ep){
              active_ep_id=s;
              _API.hi_last_view.data.active_ep=active_ep_id;
              _API.hi_last_view.data.active_ep_index=i;
              _API.hi_last_view.data.ep[i].active=true;
              break;
            }
          }
          console.log("CACHED : "+active_ep_id);
          if (active_ep_id){
            getEpServer({},active_ep_id);
            return uid;
          }
        }
      }
    }
    _API.hi_last_view.data=null;
    _API.hi_last_view.view_url=aid;

    // Get Data
    if (_API.hi_last_view.data==null){
      _API.getTooltip(aid,function(d){
        if (d){
          pb.open_ttip(d);
          runCb(d);
        }else{
          _API.hi_last_view.view_url='';
          _API.hi_last_view.data=null;
          f({status:false},uid);
        }
      },url,1);
    }

    var epurl=
      '/episodes?id='+enc(slug)+'&c='+__AFLIX.enc2(slug)+'&dub=';
    var ep_data={
      d:{ep_val:{}},
      n:0,
      active_ep:null
    };
    function ep_cb(r,dub){
      if (r.ok){
        try{
          var t=JSON.parse(r.responseText);
          var l=t.episodes.length;
          var active_s=null;
          for (var i=0;i<l;i++){
            var p=t.episodes[i];
            var s={};
            if (!ep_data.d.ep_val[p.number]){
              s.ep=p.number;
              s.url=viewurl+"#"+s.ep;
              s.active=(get_ep==s.ep)?true:false;
              s.filler=false;
              s.img=p.image;
              s.title=p.title;
              if (!active_s){
                active_s=s;
              }
              if (s.active){
                ep_data.active_ep=s;
                ep_data.d.active_ep=ep_data.active_ep;
              }
              ep_data.d.ep_val[p.number]=s;
            }
            else{
              s=ep_data.d.ep_val[p.number];
            }
            if (dub){
              var surl=slug+'-dub-episode-'+s.ep;
              var c=__AFLIX.enc2(surl);
              s.dub='/watch/'+surl+'?server=&c='+c;
            }
            else{
              var surl=slug+'-episode-'+s.ep;
              var c=__AFLIX.enc2(surl);
              s.sub='/watch/'+surl+'?server=&c='+c;
            }
          }
          if (!ep_data.active_ep && active_s){
            ep_data.active_ep=active_s;
            ep_data.d.active_ep=ep_data.active_ep;
          }
        }catch(e){
          console.log("EPCBERR: "+e+" -> "+r.responseText);
        }
      }
      if (++ep_data.n>=2){
        // runCb(ep_data.d);
        if (ep_data.active_ep){
          /* Fix ep ordering */
          var ep=ep_data.d.ep_val;
          delete ep_data.d.ep_val;
          ep_data.d.ep=[];
          var esorted=[];
          for (var i in ep){
            esorted.push(i);
          }
          esorted.sort(function(a, b) {
            return Number(a) - Number(b);
          });
          var vindex=0;
          for (var i=0;i<esorted.length;i++){
            var id=esorted[i];
            if (ep[id]){
              ep_data.d.ep.push(ep[id]);
              if (ep[id].active){
                ep_data.d.active_ep_index=vindex;
              }
              vindex++;
            }
          }
          getEpServer(ep_data.d,ep_data.active_ep);
        }
        else{
          _API.hi_last_view.view_url='';
          _API.hi_last_view.data=null;
          f({status:false},uid);
        }
      }
    }
    // Get Episodes
    console.log("Get Episode URL: "+epurl);
    function fetchEpInfo(isdub){
      __AFLIX.req(epurl+(isdub?'true':'false'),function(r){
        if (r.contentType=='application/json'){
          ep_cb(r,isdub);
          return;
        }
        r.ok=false;
        ep_cb(r,isdub);
      }, 0);
    }
    fetchEpInfo(false);
    fetchEpInfo(true);

    return uid;
  },

  getViewHi:function(url,f){
    var uid=++_API.viewid;
    var tipurl=home.hi_tipurl(url);
    var get_ep_s = url.split('#');
    var get_ep=1;
    if (get_ep_s.length>1){
      get_ep=toInt(get_ep_s[1]);
    }

    function runCb(d){
      if (_API.hi_last_view.data==null){
        _API.hi_last_view.data=d;
      }
      else{
        for (var k in d){
          _API.hi_last_view.data[k]=d[k];
        }
        _API.hi_last_view.data.status=true;
        f(JSON.parse(JSON.stringify(_API.hi_last_view.data)),uid);
      }
    }

    function fetchServer(d, srv_d){
      var dserver={
        'raw':[],
        'sub':[],
        'dub':[]
      };
      var srv_c=0;
      for (var i=0;i<srv_d.length;i++){
        var sd=srv_d[i];
        $a('/ajax/v2/episode/sources?id='+enc(sd[0]),function(r2){
          if (r2.ok){
            try{
              var jj=JSON.parse(r2.responseText);
              var sid=srv_d[r2.args];
              dserver[sid[1]].push({
                id:sid[0],
                link:jj.link,
                server:jj.server,
                sid:(jj.link.split('?').shift().split('/').pop()),
                dns:(jj.link.split('/'))[2]
              });
            }catch(ee){}
          }
          srv_c++;
          if (srv_c>=srv_d.length){
            d.ep_servers=dserver;
            d.stream_vurl  = "";
            d.ep_stream_sel=null;
            d.skip=[];
            runCb(d);
          }
        },1,i);
      }
    }

    function getEpServer(d,eid){
      $a('/ajax/v2/episode/servers?episodeId='+enc(eid),function(r){
        if (r.ok){
          try{
            var v=JSON.parse(r.responseText);
            var hd=$n('d','','',null,v.html);
            var srv=hd.querySelectorAll('.server-item');
            

            var srv_d=[];

            // pb.cfg_data.mirrorserver
            for (var i=0;i<srv.length;i++){
              var svid=srv[i].getAttribute('data-id');
              var svtp=srv[i].getAttribute('data-type');
              if (svtp=='sub'||svtp=='dub'||svtp=='raw'){
                srv_d.push([svid,svtp]);
              }
            }
            hd.innerHTML='';
            fetchServer(d, srv_d);
            return;
          }
          catch(e){
          }
        }
        f({status:false},uid);
      });
    }

    if (_API.hi_last_view.view_url==tipurl){
      /* Just Load Server */
      var eps=_API.hi_last_view.data.ep;
      var active_ep_id=null;
      _API.hi_last_view.data.ep[_API.hi_last_view.data.active_ep_index].active=false;
      for (var i=0;i<eps.length;i++){
        var s=eps[i];
        if (get_ep==s.ep){
          active_ep_id=s.ep_id;
          _API.hi_last_view.data.active_ep=active_ep_id;
          _API.hi_last_view.data.active_ep_index=i;
          _API.hi_last_view.data.ep[i].active=true;
          break;
        }
      }
      if (active_ep_id){
        getEpServer({},active_ep_id);
        return uid;
      }
    }
    else{
      _API.hi_last_view.data=null;
    }
    _API.hi_last_view.view_url=tipurl;

    // Get Data
    if (_API.hi_last_view.data==null){
      _API.getTooltip(home.hi_tipurl(url),function(d){
        if (d){
          runCb(d);
        }else{
          _API.hi_last_view.view_url='';
          _API.hi_last_view.data=null;
          f({status:false},uid);
        }
      },url,1);
    }

    // Get Episodes
    $a('/ajax/v2/episode/list/'+home.hi_animeid(url),function(r){
      if (r.ok){
        try{
          var v=JSON.parse(r.responseText);
          if (v.status){
            var d={
              ep:[]
            };
            var active_ep_id=0;
            var hd=$n('d','','',null,v.html);
            var epel=hd.querySelectorAll('#detail-ss-list .ss-list a.ep-item');
            for (var i=0;i<epel.length;i++){
              var p=epel[i];
              var s={};
              s.ep=p.getAttribute('data-number');
              s.url=tipurl+"#"+s.ep;
              s.active=(get_ep==s.ep)?true:false;
              s.filler=p.classList.contains('ssl-item-filler')?true:false;
              s.ep_id=p.getAttribute('data-id');
              s.title=p.getAttribute('title');
              if (s.active){
                active_ep_id=s.ep_id;
                d.active_ep=active_ep_id;
                d.active_ep_index=i;
              }
              d.ep.push(s);
            }

            /* Execute Callbacks */
            hd.innerHTML='';
            if (active_ep_id){
              getEpServer(d,active_ep_id);
              return;
            }
          }
        }catch(e){
        }
      }
      _API.hi_last_view.view_url='';
      _API.hi_last_view.data=null;
      f({status:false},uid);
    },1);

    return uid;
  },

  /* get mp4upload mp4-video url */
  getMp4:function(url, f){
    _API.mp4cb=f;
    _JSAPI.getmp4vid(url);
  },

  currentStreamType:0,
  currentStreamTypeValue:0,
  streamTypeById:function(l){
    t=1;
    if (l=='dub'){
      t=2;
    }
    else if (l=='hard' || l==''){
      t=0;
    }
    return t;
  },
  setStreamServer:function(t,c){
    _JSAPI.setStreamServer(t,c);
  },
  setStreamType:function(t,c){
    if (_API.currentStreamTypeValue){
      _JSAPI.setStreamType(_API.currentStreamType,c);
    }
    else{
      var ct=_API.streamTypeById(pb.cfg_data.lang);
      _API.currentStreamType=ct;
      _JSAPI.setStreamType(ct,c);
    }
  },
  setStreamTypeValue:function(t,c){
    if (t==-1){
      _API.currentStreamTypeValue=0;
      _API.setStreamType(0,c);
    }
    else{
      _API.currentStreamTypeValue=1;
      _API.currentStreamType=t;
      _JSAPI.setStreamType(t,c);
    }
  },

  getStreamType:function(){
    return _JSAPI.getStreamType();
  },

  /*** SHOW/HIDE IME ***/
  showIme:function(show){
    _JSAPI.showIme(show);
  },

  /*** Toast ***/
  showToast:function(txt){
    _JSAPI.showToast(txt);
  },

  /*** FETCH AJAX ***/
  tooltipFlixParse(jsn,isview){
    var o={
      title:'',
      title_jp:'',
      synopsis:'',
      genres:[],
      quality:null,
      ep:0,
      rating:'',
      ttid:''
    };
    try{
      var da=JSON.parse(jsn);
      // console.log("JSON : "+jsn);
      var u=('slug' in da)?da:da[0];
      if (!u){
        return null;
      }
      __AFLIX.setCache(u);
      o.url=__AFLIX.setUrl(u.slug,u.anilistID);
      o.title=__AFLIX.getTitle(u);
      o.title_jp=__AFLIX.getTitle(u,1);
      o.ttid=u.anilistID;
      o.synopsis=stripHtml(u.description);
      o.poster=u.images.medium;
      o.ep=u.episodeNum;
      if (u.nextAiringEpisode){
        if (u.nextAiringEpisode.episode && u.nextAiringEpisode.episode>1){
          o.ep=o.epavail=u.nextAiringEpisode.episode-1;
        }
      }
      o.type=u.type?u.type:'';
      o.status=u.status?u.status:'';
      if (u.duration){
        o.duration=u.duration+'MIN';
      }
      if(u.bannerImage){
        o.headimg=u.bannerImage;
      }
      if(u.logoart){
        o.logoimg=u.logoart;
      }
      o.genre=u.genres.join(", ");
      for (var i=1;i<u.genres.length;i++){
        try{
          o.genres.push({
            name:u.genres[i],
            val:u.genres[i]
          });
        }catch(e){}
      }
      if (isview){
        o.seasons=[];
        o.related=[];
        o.recs=[];

        o.info={
          type:{
            val:o.type.toLowerCase(),
            name:o.type,
          },
          rating:null,
          quality:null
        };
        o.banner=null;
        if (u.bannerart){
          if (u.bannerart.medium){
            o.banner=u.bannerart.medium;
          }
          else if (u.bannerart.large){
            o.banner=u.bannerart.large;
          }
        }
        if (!o.banner){
          o.banner=u.bannerImage?u.bannerImage:o.poster;
        }
        o.numep=o.ep;
        delete o.ep;
        o.stp=0;
        o.streamtype='';
        o.url=__AFLIX.setUrl(u.slug,u.anilistID);

        /* Get Related */
        if (u.relatedAnime){
          for (var i=0;i<u.relatedAnime.length;i++){
            var rel=u.relatedAnime[i];
            var sv={};
            sv.url=__AFLIX.setUrl(rel.slug,rel.anilistID);
            sv.tip=rel.anilistID;
            rel.title=rel.animeName;
            sv.title=__AFLIX.getTitle(rel);
            sv.title_jp=__AFLIX.getTitle(rel,1);
            sv.poster=rel.images.medium;
            o.related.push(sv);
          }
        }
      }
      return o;
    }catch(e){
      console.log("ERR "+e);
    }
    return null;
  },

  getTooltip:function(id, cb, url, isview){
    if (!id && url){
      if (__SD3){
        id=home.hi_tipurl(url);
      }
      else if (__SD5){
        id=__AFLIX.getAid(url);
      }
      else{
        // No-ttid fix
        $a(url,function(r){
          if (r.ok){
            var d=$n('div','',0,0,r.responseText);
            try{
              if (__SD==1){
                var tipid=d.querySelector("#watch-main").getAttribute('data-id');
                var ttid=''+tipid+'?/cache'+$tick();
                _API.getTooltip(ttid,cb);
                return;
              }
              else{
                var tipid=d.querySelector("main div.container.watch-wrap").getAttribute('data-id');
                var ttid=''+tipid+'?/cache'+$tick();
                _API.getTooltip(ttid,cb);
                return;
              }
            }catch(e){}
          }
          cb(null);
        });
        return;
      }
    }

    var tt_url='';
    if (__SD3){
      tt_url=id;
    }
    else if (__SD5){
      if (id in __AFLIX.cache){
        cb(_API.tooltipFlixParse(__AFLIX.cache[id],isview));
        return;
      }
      tt_url='/__proxy/'+__AFLIX.ns+"/idtoinfo?ids=["+id+"]&y=5550555a525b";
      console.log("TTURL = "+tt_url);
    }
    else{
      tt_url="https://"+__DNS+"/ajax/anime/tooltip/"+id+"?"+$tick();
    }
    $a(tt_url,function(r){
      if (r.ok){
        var o={
          title:'',
          title_jp:'',
          synopsis:'',
          genres:[],
          quality:null,
          ep:0,
          rating:'',
          ttid:id
        };
        if (__SD5){
          cb(_API.tooltipFlixParse(r.responseText,isview));
          return;
        }

        var d=$n('div','',0,0,r.responseText);
        if (__SD3){
          var c=d.querySelector('.anis-content');
          var et = c.querySelector('h2.film-name');
          o.title=et?.textContent;
          o.title_jp=et?.getAttribute('data-jname');
          
          try{
            o.synopsis=c.querySelector('.film-description .text')?.textContent.trim();
          }catch(e){}

          try{
            o.ep=c.querySelector('.tick-item.tick-sub')?.textContent.trim();
          }catch(e){}
          try{
            o.rating=c.querySelector('.tick-item.tick-pg')?.textContent.trim();
          }catch(e){}
          try{
            o.type=c.querySelector('.tick .dot+.item').textContent.trim();
          }catch(e){}
          try{
            o.quality=c.querySelector('.tick-item.tick-quality')?.textContent.trim();
          }catch(e){}

          var dmeta=c.querySelectorAll('.anisc-info-wrap .anisc-info .item');
          function findMeta(kw){
            for (var i=0;i<dmeta.length;i++){
              if ((dmeta[i].firstElementChild.textContent+"").trim().toLowerCase().indexOf(kw)==0){
                return dmeta[i].firstElementChild;
              }
            }
            return null;
          }
          var fs=findMeta("status:");
          try{
            if (fs){
              o.status=fs.nextElementSibling.textContent.trim();
            }
          }catch(e){}
          fs=findMeta("duration:");
          try{
            if (fs){
              o.duration=fs.nextElementSibling.textContent.trim();
            }
          }catch(e){}

          var fg=findMeta('genres:');
          if (fg){
            var pc=fg.parentElement.children;
            var gn=[];
            for (var i=1;i<pc.length;i++){
              try{
                var gd={
                  name:pc[i].textContent.trim(),
                  val:null
                };
                gn.push(gd.name);
                var gnr=pc[i].getAttribute('href').split('/');
                gd.val=gnr[gnr.length-1].trim();
                o.genres.push(gd);
              }catch(e){}
            }
            o.genre=gn.join(', ');
          }

          try{
            o.poster=d.querySelector('#ani_detail .film-poster img').getAttribute('src').replace('100x200','300x400');
          }catch(e){}

          // Is View
          if (isview){
            o.seasons=[];

            // Seasons
            var sa=d.querySelectorAll('.block_area-seasons .os-list a');
            for (var i=0;i<sa.length;i++){
              var sv={};
              sv.url=sa[i].getAttribute('href');
              sv.tip=home.hi_tipurl(sv.url);
              sv.title=sa[i].getAttribute('title');
              sv.active=sa[i].classList.contains('active');
              try{
                  sv.poster=sa[i].querySelector('.season-poster').style.backgroundImage.slice(4, -1).replace(/["']/g, "").replace('100x200','300x400');
              }catch(e){}
              o.seasons.push(sv);
            }

            // Related
            o.related=[];
            var rh=d.querySelector('#main-sidebar section .block_area-header');
            if (rh){
              if (rh.textContent.trim().toLowerCase().indexOf('related')>=0){
                var rl=rh.nextElementSibling.querySelectorAll('.ulclear li');;
                for (var i=0;i<rl.length;i++){
                  var sv={};
                  var tt=rl[i].querySelector('.film-name a');
                  sv.url=tt.getAttribute('href');
                  sv.tip=home.hi_tipurl(sv.url);
                  sv.title=tt.getAttribute('title');
                  sv.title_jp=tt.getAttribute('data-jname');
                  try{
                    tt=rl[i].querySelector('.film-poster img');
                    sv.poster=tt.getAttribute('data-src');
                  }catch(e){}
                  o.related.push(sv);
                }
              }
            }

            // Reccommendation
            o.recs=[];
            var rcs=d.querySelectorAll('#main-content .block_area.block_area_category .film_list-wrap .flw-item');
            for (var i=0;i<rcs.length;i++){
              var sv={};
              var tt=rcs[i].querySelector('.film-name a');
              sv.url=tt.getAttribute('href');
              sv.tip=home.hi_tipurl(sv.url);
              sv.title=tt.getAttribute('title');
              sv.title_jp=tt.getAttribute('data-jname');
              try{
                tt=rcs[i].querySelector('.film-poster img');
                sv.poster=tt.getAttribute('data-src');
              }catch(e){}
              o.recs.push(sv);
            }

            o.info={
                type:{
                  val:o.type.toLowerCase(),
                  name:o.type,
                },
                rating:o.rating,
                quality:o.quality
            };
            
            o.banner=o.poster;
            o.numep=o.ep;
            delete o.ep;

            // Tobe Filled
            o.stp=0;
            o.streamtype='';
            o.url=tt_url;
          }
        }
        else if (__SD==1){
          // wave
          var tt=d.querySelector('div.title.d-title');
          if (tt){
            o.title=tt.textContent.trim();
            o.title_jp=tt.getAttribute('data-jp');
          }
          try{
            o.synopsis=d.querySelector('div.synopsis').textContent.trim();
          }catch(e){}

          try{
            o.ep=d.querySelector('span.ep-status.sub').textContent.trim();
          }catch(e){}

          try{
            var gn=d.querySelector('div.meta-bl').lastElementChild.querySelectorAll('a');
            for (var i=0;i<gn.length;i++){
              var gd={
                name:gn[i].textContent.trim(),
                val:null
              };
              var gnr=gn[i].getAttribute('href').split('/');
              gd.val=gnr[gnr.length-1].trim();
              o.genres.push(gd);
            }
          }catch(e){}
          try{
            o.rating=d.querySelector('i.rating').textContent.trim();
          }catch(e){}
          try{
            o.quality=d.querySelector('i.quality').textContent.trim();
          }catch(e){}

          var sp=d.querySelectorAll('div.meta-bl div>span');
          for (var i=0;i<sp.length;i+=2){
            try{
              var vt=sp[i].textContent.trim();
              if (vt=='Genre:'){
                o.genre=sp[i+1].textContent.replace(/\n/g,'').replace(/   /g,' ').replace(/  /g,' ').replace(/  /g,' ').replace(/ \,/g,',').trim();
              }
              else if (vt=='Status:'){
                o.status=sp[i+1].textContent.trim();
              }
              else if (vt=='Duration:'){
                o.duration=sp[i+1].textContent.trim();
              }
            }catch(e){}
          }
        }
        else{
          // anix
          var tt=d.querySelector('div.ani-name');
          if (tt){
            o.title=tt.textContent.trim();
            o.title_jp=tt.getAttribute('data-jp');
          }

          try{
            o.synopsis=d.querySelector('div.ani-detail div.ani-desc').textContent.trim();
          }catch(e){}

          try{
            o.ep=d.querySelector('div.ani-info span.sub').textContent.trim();
          }catch(e){}

          var dmeta=d.querySelectorAll('div.ani-detail div.ani-meta>div');
          function findMeta(kw){
            for (var i=0;i<dmeta.length;i++){
              if ((dmeta[i].textContent+"").trim().toLowerCase().indexOf(kw)==0){
                return dmeta[i];
              }
            }
            return null;
          }

          var fg=findMeta('genre:');
          if (fg){
            o.genre=fg.textContent.replace('Genre:','').replace(/\n/g,'').replace(/   /g,' ').replace(/  /g,' ').replace(/  /g,' ').replace(/ \,/g,',').trim();
            try{
              var gn=fg.querySelectorAll('a');
              for (var i=0;i<gn.length;i++){
                var gd={
                  name:gn[i].textContent.trim(),
                  val:null
                };
                var gnr=gn[i].getAttribute('href').split('/');
                gd.val=gnr[gnr.length-1].trim();
                o.genres.push(gd);
              }
            }catch(e){}
          }
          var fs=findMeta('status:');
          if (fs){
            o.status=fs.firstElementChild.textContent.trim();
          }

          try{
            o.rating=d.querySelector('div.ani-info span.ani-rating').textContent.trim();
          }catch(e){}

          try{
            o.type=d.querySelector('div.ani-info span i.mdi-play').nextSibling.textContent.trim();
          }catch(e){}
        }

        d=null;
        cb(o);
      }
      else
        cb(null);
    },__SD5?__AFLIX.origin:null);
  },

  /*** VIDEO VIEW API ***/
  vidSpeed:1.0,
  vidSpeedTimeout:null,
  videoSpeed:function(s){
    _API.vidSpeed=s;
    clearTimeout(_API.vidSpeedTimeout);
    _API.vidSpeedTimeout=setTimeout(function(){
      _JSAPI.videoSetSpeed(s);
      _API.vidSpeedTimeout=null;
    },800);
  },
  vidInterval:null,
  videoGetPos:function(){
    return {
      position:_JSAPI.videoGetPosition()/1000.0,
      duration:_JSAPI.videoGetDuration()/1000.0
    };
  },
  videoScale:function(scale){
    _JSAPI.videoSetScale(scale);
  },
  videoPlay:function(){
    _JSAPI.videoPlay(true);
  },
  videoPause:function(){
    _JSAPI.videoPlay(false);
  },
  videoSeek:function(v){
    _JSAPI.videoSetPosition(v*1000);
  },
  videoCompleteTo:null,
  setVideo:function(src, cb){
    clearInterval(_API.vidInterval);
    if (src){
      _JSAPI.videoSetUrl(src);
      var initialized=false;
      var isplayed=false;
      body.classList.remove('playback_on_video');
      _API.vidInterval=setInterval(function(){
        if (!initialized){
          if (_JSAPI.videoIsPlaying()&&_JSAPI.videoGetDuration()>0){
            body.classList.add('playback_on_video');
            initialized=true;
            isplayed=true;
            cb('ready',0);
            cb('time',_API.videoGetPos());
            cb('play',0);
          }
        }
        else{
          var pl=_JSAPI.videoIsPlaying();
          if (pl!=isplayed){
            isplayed=pl;
            if (pl){
              cb('play',0);
            }
            else{
              cb('pause',0);
            }
          }
          if (pl){
            var np=_API.videoGetPos();
            cb('time',np);
            if ((np.duration>0)&&(np.duration-1<=np.position)){
              if (!_API.videoCompleteTo){
                console.log("Post Video Completed");
                _API.videoCompleteTo=setTimeout(function(){
                  console.log("Trigger Video Completed");
                  _API.videoCompleteTo=null;
                  cb('complete',0);
                },1500);
              }
            }
            else if (_API.videoCompleteTo){
              clearTimeout(_API.videoCompleteTo);
              _API.videoCompleteTo=null;
            }
          }
        }
      },50);
    }
    else{
      body.classList.remove('playback_on_video');
      _JSAPI.videoSetUrl("");
    }
  },

  /* Fetch animetv-info last message */
  discord_info_url:"https://animetv.amarullz.com/discord-info",
  discordFetch:function(cb){
    $ap(_API.discord_info_url+"?"+$tick(), cb);
  }
};


(function(){
  /* VERSION INFO */
  try{
    var verel=$('home_version');
    if (_JSAPI){
      verel.innerHTML="<b>AnimeTV "+_JSAPI.getVersion(0)+" "+
        "&copy; 2023-2024 amarullz.com</b><br />Build "+_JSAPI.getVersion(1)
        +" - Server "+_JSAPI.dnsver()+" - Source "+__SD_NAME;
    }
  }catch(e){}

  /* INITIALIZING */
  _API.setVideo('');
  _API.theme_update();
})();


/****************************** HISTORY & WATCHLIST ******************************/
const list={
  history:{detail:{},list:[]},
  fav:{detail:{},list:[]},
  store_name:function(name){
    if (__SD==1){
      return _API.user_prefix+""+name;
    }
    else{
      return _API.user_prefix+"_anix_"+name;
    }
  },
  load_storage:function(name){
    var itm=localStorage.getItem(list.store_name(name));
    if (itm){
      var j=JSON.parse(itm);
      if (('detail' in j)&&('list' in j)){
        return {detail:j.detail,list:j.list};
      }
    }
    return {detail:{},list:[]};
  },
  save:function(o,name){
    localStorage.setItem(list.store_name(name),JSON.stringify(o));
  },
  del:function(o,id){
    var pos=o.list.indexOf(id);
    if (pos>=0){
      o.list.splice(pos,1);
      delete o.detail[id];
    }
  },
  add:function(o,id,val,refirst){
    var epos=o.list.indexOf(id);
    if (epos>-1){
      if (refirst){
        o.list.splice(epos,1);
        o.list.push(id);
      }
    }
    else{
      o.list.push(id);
    }
    o.detail[id]=val;
    if (o.list.length>30){
      var todel=o.list.shift();
      delete o.detail[todel];
    }
  },
  exists:function(o,id){
    return (o.list.indexOf(id)==-1)?false:true;
  },
  history_save:function(){
    list.save(list.history,'list_history');
  },
  history_add:function(id,val,refirst){
    if (!val.play){
      if (id in list.history.detail){
        if ((val.ep==list.history.detail[id].ep) && (list.history.detail[id].play)){
          val.play=JSON.parse(JSON.stringify(list.history.detail[id].play));
        }
      }
    }
    list.add(list.history,id,val,refirst);
    list.history_save();
  },
  history_del:function(id){
    list.del(list.history,id);
    list.history_save();
  },
  fav_save:function(){
    list.save(list.fav,'list_fav');
  },
  fav_add:function(id,val){
    if (!val.play){
      if (id in list.fav.detail){
        if ((val.ep==list.fav.detail[id].ep)&&(list.fav.detail[id].play)){
          val.play=JSON.parse(JSON.stringify(list.fav.detail[id].play));
        }
      }
    }
    list.add(list.fav,id,val);
    list.fav_save();
  },
  fav_del:function(id){
    list.del(list.fav,id);
    list.fav_save();
  },
  fav_exists(id){
    return list.exists(list.fav,id);
  },
  history_exists(id){
    return list.exists(list.history,id);
  },
  load:function(){
    list.history=list.load_storage('list_history');
    list.fav=list.load_storage('list_fav');
  }
};

/* subtitle libs (c) amarullz.com */
const vtt={
  h:$('vtt_subtitle'),
  set_style:function(n){
    vtt.h.className=(n?("vtt_style_"+n):"");
  },
  sel:0,
  substyle:0,
  listdef:[
    'english','portuguese (brazil)','spanish (latin_america)',
    'Spanish','Arabic','French','German','Italian','Russian'
  ],
  stylename:function(id){
    var fname=[
      'Large, Serif',
      'Large, Sans-Serif',
      'Small, Serif',
      'Small, Sans-Serif',
    ];
    var sname=[
      'White',
      'White+BG',
      'Black',
      'Primary',
    ];
    var fnt=fname[id%4];
    var sty=sname[Math.floor(id / 4)];
    return sty+', '+fnt;
  },
  init:function(subs){
    if (pb.cfg_data.lang=='nosub'){
      /* No Subtitle */
      vtt.set('');
      vtt.playback.sub=null;
      vtt.playback.pos=0;
      vtt.playback.posid=0;
      vtt.substyle=0;
      vtt.playback.show=false;
      return;
    }

    // console.log("SUBTITLE INIT = ");
    if (subs.length>0){
      // console.log("SUBTITLE LENGTH = "+subs.length);
      if (pb.cfg_data.lang!='' && pb.cfg_data.lang!='en'){
        var ffind = vtt.find_match(subs, pb.cfg_data.lang);
        // console.log("SUBTITLES SOFT = "+pb.cfg_data.lang+" => "+ffind+" // "+JSON.stringify(subs,null,'\t'));
        if (ffind>-1){
          // console.log("SUBTITLES FIND = "+ffind+" -> "+JSON.stringify(subs[ffind],null,'\t'));
          vtt.load(subs[ffind], 1);
          return;
        }
      }

      // console.error(JSON.stringify(subs));
      for (var i=0;i<subs.length;i++){
        if ((subs[i].l=='english')||(subs[i].i && subs[i].i=='en')){
          console.log("SUBTITLE LENGTH = FOUND ENGLISH");
          vtt.load(subs[i]);
          return;
        }
      }
      for (var i=0;i<subs.length;i++){
        if (subs[i].d){
          vtt.load(subs[i]);
          return;
        }
      }
      for (var i=0;i<subs.length;i++){
        if (subs[i].l.indexOf("eng")>-1){
          vtt.load(subs[i]);
          return;
        }
      }
      vtt.load(subs[0]);
    }
  },
  match_lang:{ 
    it:['ita'], 
    es:['esp','spa'], 
    ar:['ara'], 
    fr:['fra','fre'], 
    ru:['rus'], 
    de:['deu','ger'],
    pt:['por','bra'],
  },
  find_match:function(t, lang){
    if (lang in vtt.match_lang){
      // console.log("SUBTITLES FIND = "+pb.cfg_data.lang);
      var y=vtt.match_lang[lang];
      for (var i=0;i<t.length;i++){
          var u=t[i];
          for (var j=0;j<y.length;j++){
              if (u.l.toLowerCase().indexOf(y[j])>-1){
                  return i;
              }
          }
      }
    }

    var lang_name=_API.tlangs_id(lang);
    if (lang_name){
      lang_name=lang_name.toLowerCase();
      for (var i=0;i<t.length;i++){
        if ((t[i].l==lang_name) || (t[i].i && t[i].i==lang)){
          // console.log("VTT MATCH GOT -> "+lang_name+" = "+i+" => "+JSON.stringify(t[i]));
          return i;
        }
      }
    }

    return -1;
  },
  ts2pos:function(ts){
    var k=ts.split(":");
    while (k.length<3){
      k.splice(0, 0, "00");
    }
    return toFloat(k[2])+(toInt(k[1])*60)+(toInt(k[0])*3600);
  },
  parse:function(dt){
    var d=(dt+"").replace(/\r/g,'').trim();
    var l=d.split('\n');
    var t=[];
    var p=-1;
    try{
      for (var n=0;n<l.length;n++){
        var s=false;
        var ln=l[n];
        if (ln.indexOf("-->")>0){
          try{
            var range=ln.replace(/ /g,'').split("-->",2);
            if (range.length==2){
              // range[1].split(' ')
              t.push(
                {
                  ti:p+1,
                  ts:vtt.ts2pos(range[0]),
                  te:vtt.ts2pos(range[1]),
                  tr:range,
                  tx:''
                }
              );
              s=true;
              p++;
            }
          }catch(ee){}
        }
        if (!s&&p>=0){
          t[p].tx+='\n'+ln;
          t[p].tx=t[p].tx.trim();
        }
      }
    }catch(e){
    }
    return t;
  },
  parse_ass:function(dt){
    var d=(dt+"").replace(/\r/g,'').trim();
    var l=d.split('\n');
    var s=l.length;
    var t=[];
    var onevent=false;
    var format=null;
    var fl=0;
    var p=-1;
    for (var i=0;i<s;i++){
      var n=l[i];
      if (onevent){
        var m=n.split(':');
        if (m.length>=2){
          var k=m.shift().trim().toLowerCase();
          m=m.join(':');
          if (k=='format'){
            format=(m.trim().toLowerCase()).split(',');
            fl=format.length;
          }
          else if(format!=null && k=='dialogue'){
            var v=(m.trim()).split(',');
            var o={};
            var q={ti:p+1};
            for (var j=0;j<fl;j++){
              var cn=format[j].trim();
              if (j==fl-1){
                o[cn]=v.join(',');
              }
              else{
                o[cn]=v.shift();
              }
              if (cn=='text'){
                q.tx=o[cn].replace(/(?:{)([^}<\n]+)(?:})/g, "")
                  .replace(/\\N/g,'\n');
              }
              else if (cn=='start'){
                q.ts=vtt.ts2pos(o[cn]);
              }
              else if (cn=='end'){
                q.te=vtt.ts2pos(o[cn]);
              }
            }
            if (('tx' in q) && ('ts' in q) && ('te' in q)){
              if (q.tx){
                if (q.tx.toLowerCase().indexOf('animeflix.live')==-1){
                  t.push(q);
                  p++;
                }
              }
            }
          }
        }
      }
      else{
        if (n.toLowerCase().trim()=='[events]'){
          onevent=true;
        }
        else if (n.trim().startsWith('[')){
          onevent=false;
        }
      }
    }
    return t;
  },
  translate:function(timelines, lang){
    var chunks=[],m=0,d=0,n=timelines.length;
    for (var i=0;i<n;i++){
      if (m==0){
        chunks.push({t:timelines[i].tx,s:i,e:i});
      }
      else{
        chunks[d].t+="  A2Q7R  "+timelines[i].tx;
        chunks[d].e=i;
      }
      if (++m==15){
        m=0;
        d++;
      }
    }
    if (chunks.length>0){
      var chunkn = chunks.length;
      for (var i=0;i<chunkn;i++){
        vtt.translate_chunk(timelines, lang, chunks[i],i*400);
      }
    }
  },
  translate_text:function(text, lang, cb){
    var translate_url='https://translate.google.com/m?tl='+
      lang+'&sl=en&q='+encodeURIComponent(text);
    $ap(translate_url,function(r){
      if (r.ok){
        try{
          var l=document.createElement('div');
          l.innerHTML=r.responseText;
          var txts=l.querySelector('div.result-container').outerText+'';

          /* Fix space on tags xd */
          txts=txts.replace(/\< /g,"<");
          txts=txts.replace(/\< /g,"<");
          txts=txts.replace(/\< /g,"<");
          txts=txts.replace(/\<\/ /g,"</");
          txts=txts.replace(/\<\/ /g,"</");
          txts=txts.replace(/\<\/ /g,"</");
          txts=txts.replace(/\ >/g,">");
          txts=txts.replace(/\ >/g,">");
          txts=txts.replace(/\ >/g,">");
          cb(txts);
          return;
        }
        catch(e){
        }
      }
      cb(null);
    });
  },
  translate_chunk:function(timelines, lang, chunk, delay){
    setTimeout(function(){
      vtt.translate_text(chunk.t,lang,function(txts){
        if (txts){
          txts=txts.split("A2Q7R");
          // console.log(txts);
          for (var i=0;i<txts.length;i++){
            var p=chunk.s+i;
            if (p<=chunk.e){
              timelines[p].tz=txts[i];
            }
          }
        }
      });
    },delay);
  },
  set:function(s){
    vtt.h.innerHTML=s?nlbr(s+''):'';
  },
  load:function(sub,n){
    vtt.set('');
    vtt.playback.sub=null;
    vtt.playback.pos=0;
    vtt.playback.posid=0;
    vtt.substyle=0;
    vtt.playback.show=false;
    // console.log("LOADING SUBTITLE = "+JSON.stringify(sub));
    var hdr=null;
    if (__SD5){
      hdr=__AFLIX.origin_dev;
    }
    $ap(sub.u,function(r){
      if (r.ok){
        sub.v=r.responseText;
        // console.log("LOADING GET SUB RAW = "+sub.v);
        if (__SD5){
          sub.p=vtt.parse_ass(sub.v);
          // console.log("LOADING PARSED ASS = "+JSON.stringify(sub.p));
        }
        else{
          sub.p=vtt.parse(sub.v);
        }

        if (pb.cfg_data.lang!='en' && 
          pb.cfg_data.lang!='hard' && 
          pb.cfg_data.lang!='dub' && 
          pb.cfg_data.lang!='' &&
          !n){
          /* If auto translate */
          vtt.substyle=1;
          vtt.translate(sub.p, pb.cfg_data.lang);
        }

        vtt.playback.show=false;
        vtt.playback.sub=sub;
        window.__activesub=sub;

        pb.updateStreamTypeInfo();
      }
      else{
        // console.log("LOADING GET SUB RAW FAILED");
      }
    }, hdr);
  },
  clear:function(){
    clearInterval(vtt.playback.intv);
    vtt.playback.sub=null;
    vtt.playback.pos=0;
    vtt.playback.posid=0;
    vtt.playback.show=false;
    vtt.set('');
  },
  setobj:function(txt){
    if (txt){
      vtt.set('<div class="vtt_obj">'+(txt)+'</div>');
    }
    else{
      vtt.set('');
    }
  },
  getobj:function(obj){
    if (('tz' in obj) && (pb.cfg_data.lang!='en')){
      return (obj.tz?obj.tz:'');
    }
    else if ('tx' in obj){
      return (obj.tx?obj.tx:'');
    }
    return '';
  },
  playback:{
    intv:null,
    sub:null,
    pos:0,
    posid:0,
    prevs:'',
    show:false,
    monitor:function(){
      if (!vtt.playback.sub||!vtt.playback.sub.p){
        return;
      }
      var p=pb.vid_stat.pos;
      var o=vtt.playback.sub.p;
      var s='';
      var v=[];
      for (var i=0;i<o.length;i++){ 
        if (p>=o[i].ts&&p<=o[i].te){
          s+=i+';';
          var vt=vtt.getobj(o[i]);
          if (vt){
            v.push(vt);
          }
        }
        else if (p<o[i].ts){
          break;
        }
      }
      if (s.length==0){
        if (vtt.playback.show){
          vtt.playback.show=false;
          vtt.set('');
        }
      }
      else if (vtt.playback.prevs!=s){
        vtt.playback.prevs=s;
        if (v.length>0){
          vtt.playback.show=true;
          vtt.setobj(v.join('<br>'));
        }
        else{
          vtt.playback.show=false;
          vtt.set('');
        }
      }
    },
    play:function(){
      vtt.playback.intv=setInterval(vtt.playback.monitor,50);
    },
    pause:function(){
      vtt.playback.show=false;
      clearInterval(vtt.playback.intv);
    }
  }
};

/****************************** PLAYBACK ******************************/
const pb={
  /* elements */
  pb:$('pb'),
  pb_loading:$('pb_loading'),
  pb_load:$('pb_load'),
  pb_list:$('pb_lists'),
  pb_actions:$('pb_actions'),
  pb_meta:$('pb_meta'),
  pb_genres:$('pb_genres'),
  pb_episodes:$('pb_episodes'),
  pb_seasons:$('pb_seasons'),
  pb_related:$('pb_related'),
  pb_recs:$('pb_recs'),
  pb_settings:$('pb_settings'),
  pb_iactions:$('pb_iactions'),

  pb_vid:$('pb_vid'),

  pb_tracks:$('pb_tracks'),
  pb_track:$('pb_track'),
  pb_track_val:$('pb_track_val'),
  pb_track_skip1:$('pb_track_skip1'),
  pb_track_skip2:$('pb_track_skip2'),

  pb_track_pos:$('pb_track_pos'),
  pb_track_dur:$('pb_track_dur'),
  pb_track_ctl:$('pb_track_ctl'),
  pb_track_title:$('pb_track_title'),

  pb_action_streamtype:$('pb_action_streamtype'),

  subtitles:[],

  /* meta elements */
  pb_title:$('pb_title'),
  pb_desc:$('pb_desc'),

  pb_event_skip:$('pb_event_skip'),
  pb_event_skip_title:$('pb_event_skip_title'),

  curr_stream_type:0,

  listobj:function(){
    var ob={
      'url':pb.data.url,
      'title':pb.data.title,
      'title_jp':pb.data.title_jp,
      'poster':pb.data.poster,
      'ep':pb.ep_val,
      'episode':pb.ep_title,
      'tip':pb.tip_value
    };
    return ob;
  },

  playnext_update:function(pos,dur){
    var dr=(pos/dur)*100.0;
    if (dr>5){
      /* Update only if progress > 5% */
      try{
        var updateit=true;
        if (list.history.detail[pb.data.animeid].play){
          if (list.history.detail[pb.data.animeid].play[0]>pos){
            updateit=false;
          }
        }
        if (updateit){
          list.history.detail[pb.data.animeid].play=[pos,dur];
        }
      }catch(e){}
      try{
        if (pb.data.animeid in list.fav.detail){
          var updateit=true;
          if (list.fav.detail[pb.data.animeid].play){
            if (list.fav.detail[pb.data.animeid].play[0]>pos){
              updateit=false;
            }
          }
          if (updateit){
            list.fav.detail[pb.data.animeid].play=[pos,dur];
          }
        }
      }catch(e){}
      try{
        _JSAPI.playNextPos(pos,dur);
        pb.playnext_last_tick=$tick()+2000;
      }catch(e){}
    }
  },

  tip_value:'',
  url_value:'',
  startpos_val:0,

  updateanimation:function(){
    switch(pb.cfg_data.animation){
      case 1:
        _API.html_class='ani_quick';
        break;
      case 2:
        _API.html_class='ani_super_quick';
        break;
      case 3:
        _API.html_class='ani_no_transition';
        break;
      default:
        _API.html_class='';
        break;
    }
    if (pb.cfg_data.performance){
      _API.html_class+=' ui_performance'
    }
    switch(pb.cfg_data.uifontsize){
      case 1:
        _API.html_class+=' view-bigfont';
        break;
      case 2:
        _API.html_class+=' view-bigfont view-biggerfont';
        break;
    }
    
    _API.theme_update();
    if (pb.cfg_data.jptitle){
      document.body.classList.add('japan-title');
    }
    else{
      document.body.classList.remove('japan-title');
    }
    if (pb.cfg_data.compactlist){
      document.body.classList.remove('view-informative');
    }
    else{
      document.body.classList.add('view-informative');
    }

    _JSAPI.setProgCache(pb.cfg_data.progcache);
    _JSAPI.setDOH(pb.cfg_data.usedoh);
    
  },

  cfg_data:{
    animation:0,
    performance:true,
    autoskip:false,
    autonext:true,
    html5player:false,
    skipfiller:false,
    jptitle:false,
    compactlist:false,
    progcache:true,
    usedoh:true,
    nonjapan:false,
    server:0,
    scale:0,
    lang:'',
    ccstyle:0,
    bgimg:BGIMG_NUM-1,
    quality:0,
    uifontsize:0,
    httpclient:0,
    mirrorserver:false,
    listprog:0,
    dubaudio:false,
    preloadep:true
  },
  cfg_load:function(){
    var itm=_JSAPI.storeGet(_API.user_prefix+'pb_cfg',"");
    if (itm==""){
        itm=localStorage.getItem(_API.user_prefix+'pb_cfg');
        if (itm){
            _JSAPI.storeSet(_API.user_prefix+'pb_cfg',itm);
            localStorage.removeItem(_API.user_prefix+'pb_cfg');
        }
    }
    if (itm){
      var j=JSON.parse(itm);
      if (j){
        pb.cfg_data.autoskip=('autoskip' in j)?(j.autoskip?true:false):false;
        pb.cfg_data.autonext=('autonext' in j)?(j.autonext?true:false):true;
        pb.cfg_data.html5player=('html5player' in j)?(j.html5player?true:false):false;
        pb.cfg_data.dubaudio=('dubaudio' in j)?(j.dubaudio?true:false):false;
        
        pb.cfg_data.skipfiller=('skipfiller' in j)?(j.skipfiller?true:false):false;
        pb.cfg_data.preloadep=('preloadep' in j)?(j.preloadep?true:false):true;
        
        pb.cfg_data.jptitle=('jptitle' in j)?(j.jptitle?true:false):false;
        pb.cfg_data.progcache=('progcache' in j)?(j.progcache?true:false):true;
        pb.cfg_data.usedoh=('usedoh' in j)?(j.usedoh?true:false):true;
        
        
        pb.cfg_data.compactlist=('compactlist' in j)?(j.compactlist?true:false):false;
        pb.cfg_data.nonjapan=('nonjapan' in j)?(j.nonjapan?true:false):false;
        pb.cfg_data.performance=('performance' in j)?(j.performance?true:false):true;
        pb.cfg_data.mirrorserver=('mirrorserver' in j)?(j.mirrorserver?true:false):false;

        _API.setStreamServer(pb.cfg_data.mirrorserver?1:0,0);
        
        
        pb.cfg_data.lang=('lang' in j)?j.lang:'';
        _API.setStreamType(0,0);

        pb.cfg_data.server=0;


        pb.cfg_data.ccstyle=('ccstyle' in j)?j.ccstyle:'';
        vtt.set_style(pb.cfg_data.ccstyle);

        pb.cfg_data.bgimg=('bgimg' in j)?j.bgimg:BGIMG_NUM-1;
        _API.bgimg_update();

        if ('quality' in j){
          var sv=parseInt(j.quality);
          if (sv&&sv>0&&sv<=3)
            pb.cfg_data.quality=sv;
        }

        if ('scale' in j){
          var sv=parseInt(j.scale);
          if (sv&&sv>0&&sv<=2)
            pb.cfg_data.scale=sv;
        }

        if ('animation' in j){
          var sv=parseInt(j.animation);
          if (sv&&sv>0&&sv<=3)
            pb.cfg_data.animation=sv;
        }

        if ('uifontsize' in j){
          var sv=parseInt(j.uifontsize);
          if (sv&&sv>0&&sv<=2)
            pb.cfg_data.uifontsize=sv;
        }

        if ('httpclient' in j){
          var sv=parseInt(j.httpclient);
          if (sv&&sv>0&&sv<=2)
            pb.cfg_data.httpclient=sv;
        }

        if ('listprog' in j){
          var sv=parseInt(j.listprog);
          if (sv&&sv>0&&sv<=4)
            pb.cfg_data.listprog=sv;
        }

        _JSAPI.setHttpClient(pb.cfg_data.httpclient);

        
        pb.updateanimation();
        return;
      }
    }
    pb.cfg_data.autoskip=false;
    pb.cfg_data.autonext=true;
    pb.cfg_data.html5player=false;
    pb.cfg_data.dubaudio=false;
    
    pb.cfg_data.skipfiller=false;
    pb.cfg_data.jptitle=false;
    pb.cfg_data.progcache=true;
    pb.cfg_data.preloadep=true;
    pb.cfg_data.usedoh=true;
    
    pb.cfg_data.compactlist=false;
    
    pb.cfg_data.nonjapan=false;
    pb.cfg_data.performance=true;
    pb.cfg_data.mirrorserver=false;
    
    pb.cfg_data.server=0;
    pb.cfg_data.animation=0;
    pb.cfg_data.uifontsize=0;
    pb.cfg_data.httpclient=0;
    pb.cfg_data.listprog=0;
    
    pb.cfg_data.scale=0;
    pb.cfg_data.lang='';
    pb.cfg_data.ccstyle=0;
    pb.cfg_data.bgimg=BGIMG_NUM-1;
    pb.cfg_data.quality=0;
  },
  cfgserver_name:[
    'VIZCLOUD M3U8',
    'VIZCLOUD HTML5',
    'MP4UPLOAD'
  ],
  cfganimation_name:[
    'Normal',
    'Fast',
    'Faster',
    'No Transition'
  ],
  cfguifontsize_name:[
    'Small',
    'Medium',
    'Big'
  ],
  cfghttpclient_name:[
    'OkHttp with DoH Support',
    'Generic HttpClient',
    'Cronet - Chromium Networking'
  ],

  cfglistprog_name:[
    'Start playing',
    'Watched 25%',
    'Watched 50%',
    'Watched 75%',
    'Finish watching',
  ],
  
  cfgstreamtype_name:[
    'HARDSUB',
    'SOFTSUB',
    'DUB'
  ],
  cfgstreamtype_ico:[
    'subtitles',
    'closed_caption',
    'keyboard_voice'
  ],
  cfgscale_name:[
    'Normal',
    'Cover',
    'Stretch'
  ],
  cfgquality_name:[
    "AUTO",
    "HIGH",
    "MEDIUM",
    "LOW"
  ],
  cfgwallpaper_name:[
    "Hill Bench",
    "Gate",
    "Waifu 1",
    "Sunny Go",
    "Waifu 2",
    "Your Name",
    "Fuji",
    "Your Name 2",
    "No Wallpaper"
  ],
  cfgtheme_name:[
    'Purple',
    'Blue',
    'Teal',
    'Green',
    'Brown',
    'Red',
    'Grey'
  ],
  cfg_save:function(){
    var savingjs=JSON.stringify(pb.cfg_data);
    _JSAPI.storeSet(_API.user_prefix+'pb_cfg',JSON.stringify(pb.cfg_data));
//    localStorage.setItem(_API.user_prefix+'pb_cfg',JSON.stringify(pb.cfg_data));
    // console.log('ATVLOG STORAGE SAVE = '+savingjs);
  },
  cfg_setactive(el, state){
    if (state){
      el.classList.remove('disabled');
    }
    else{
      el.classList.add('disabled');
    }
  },
  cfg_update_el_root:function(key, root){
    if (!root){
      root=pb.pb_settings;
    }
    if (key){
      var el=root['_s_'+key];
      if (!el){
        return;
      }
      if (key=='speed'){
        el.lastElementChild.innerHTML="SPEED "+_API.vidSpeed.toFixed(2)+"x";
      }
      else if (key=='ccstyle'){
        el.lastElementChild.innerHTML=vtt.stylename(pb.cfg_data.ccstyle);
      }
      else if (key=='bgimg'){
        el.lastElementChild.innerHTML=pb.cfgwallpaper_name[pb.cfg_data.bgimg];
      }
      else if (key=='quality'){
        el.lastElementChild.innerHTML=pb.sel_quality;
      }
      else if (key=='sourcesvr'){
        el.lastElementChild.innerHTML="Source "+__SD_NAME;
      }
      else if (key=='theme'){
        el.lastElementChild.innerHTML=pb.cfgtheme_name[_API.theme_sel];
      }
      else if (key=='fav'){
        if (pb.data.animeid){
          if (list.fav_exists(pb.data.animeid)){
            el.innerHTML='<c>clear</c> REMOVE FROM WATCHLIST';
          }
          else{
            el.innerHTML='<c>bookmark_border</c> ADD TO WATCHLIST';
          }
        }
      }
      else if (key=="hardsub" || key=="softsub"||key=="dub"){
        var subel=[
          'hardsub','softsub','dub'
        ];
        for (var i=0;i<3;i++){
          var kel=root['_s_'+subel[i]];
          if (kel){
            kel.firstElementChild.innerHTML=(_API.currentStreamType==i)?'check':'';
          }
        }
      }
      else if (key in pb.cfg_data){
        /* Set Active */
        if (key=='usedoh'){
          pb.cfg_setactive(el,pb.cfg_data.httpclient==0);
        }
        else if (key=='html5player'){
          pb.cfg_setactive(el,!__SD3);
        }
        else if (key=='dubaudio'){
          pb.cfg_setactive(el,__SD3);
        }

        

        /* Set Values */
        if (key=='server'){
          el.lastElementChild.innerHTML=pb.cfgserver_name[pb.cfg_data[key]];
        }
        else if (key=='lang'){
          var l=pb.cfg_data[key];
          var c='subtitles';
          var at='';
          if (l=='dub'){
            c='keyboard_voice';
          }
          else if (l && l!='hard'){
            c='closed_caption';
            at=' <l>'+(l.toUpperCase())+'</l>';
          }
          el.lastElementChild.innerHTML='<c>'+c+'</c> '+_API.tlangs_id(l)+at;
        }
        else if (key=='animation'){
          el.lastElementChild.innerHTML=pb.cfganimation_name[pb.cfg_data[key]];
        }
        else if (key=='uifontsize'){
          el.lastElementChild.innerHTML=pb.cfguifontsize_name[pb.cfg_data[key]];
        }
        else if (key=='httpclient'){
          el.lastElementChild.innerHTML=pb.cfghttpclient_name[pb.cfg_data[key]];
        }
        else if (key=='listprog'){
          el.lastElementChild.innerHTML=pb.cfglistprog_name[pb.cfg_data[key]];
        }
        else if (key=='scale'){
          el.lastElementChild.innerHTML=pb.cfgscale_name[pb.cfg_data[key]];
        }
        else{
          if (el){
            el.firstElementChild.innerHTML=pb.cfg_data[key]?'check':'clear';
            if (pb.cfg_data[key])
              el.firstElementChild.classList.add('checked');
            else
              el.firstElementChild.classList.remove('checked');
          }
        }
      }
    }
  },
  cfg_update_el:function(key){
    if (key){
      pb.cfg_update_el_root(key,pb.pb_settings);
      pb.cfg_update_el_root(key,home.settings.tools);
    }
    else{
      pb.cfg_update_el('animation');
      pb.cfg_update_el('autoskip');
      pb.cfg_update_el('autonext');
      pb.cfg_update_el('dubaudio');
      
      pb.cfg_update_el('html5player');
      
      pb.cfg_update_el('skipfiller');
      pb.cfg_update_el('preloadep'); 
      
      pb.cfg_update_el('nonjapan');
      pb.cfg_update_el('sourcesvr');
      
      pb.cfg_update_el('performance');
      pb.cfg_update_el('mirrorserver');
      pb.cfg_update_el('jptitle');
      pb.cfg_update_el('progcache');
      pb.cfg_update_el('usedoh');
      
      pb.cfg_update_el('compactlist');
      pb.cfg_update_el('uifontsize');
      pb.cfg_update_el('httpclient');
      pb.cfg_update_el('listprog');
      
      pb.cfg_update_el('theme');

      pb.cfg_update_el('scale');
      pb.cfg_update_el('fav');
      pb.cfg_update_el('speed');
      pb.cfg_update_el('ccstyle');
      pb.cfg_update_el('bgimg');

      pb.cfg_update_el('quality');

      pb.cfg_update_el('hardsub');
      pb.cfg_update_el('softsub');
      pb.cfg_update_el('dub');

      pb.cfg_update_el('lang');
    }
  },
  cfg:function(v){
    if (v=='server') return pb.cfg_data.server;
    if (v=='scale') return pb.cfg_data.scale;
    if (v in pb.cfg_data) return pb.cfg_data[v];
    return false;
  },

  onskip:false,
  skip_val:0,
  skip_auto_timeout:null,
  skipauto_update:function(v){
    if (v){
      clearTimeout(pb.skip_auto_timeout);
      if (pb.onskip&&pb.cfg('autoskip')){
        pb.pb_event_skip.classList.add('autoskip');
        pb.skip_auto_timeout=setTimeout(function(){
          if (pb.onskip&&!pb.pb.classList.contains('menushow')){
            pb.vid_cmd('seek',pb.skip_val);
          }
        },1800);
      }
    }
    else{
      clearTimeout(pb.skip_auto_timeout);
    }
  },
  setskip:function(v,skid){
    if (v&&!pb.onskip){
      pb.onskip=true;
      pb.pb_event_skip.classList.add('active');
      pb.skipauto_update(1);
      if (skid){
        pb.pb_event_skip_title.innerHTML='SKIP OUTRO';
      }
      else{
        pb.pb_event_skip_title.innerHTML='SKIP INTRO';
      }
    }
    else if (!v&&pb.onskip){
      pb.skip_val=0;
      pb.onskip=false;
      pb.pb_event_skip.classList.remove('active');
      pb.pb_event_skip.classList.remove('autoskip');
      pb.skipauto_update(0);
    }
  },
  setskip_track:function(haveduration){
    /* Check Skip Data */
    pb.pb_track_skip1.style.left=
    pb.pb_track_skip1.style.width=
    pb.pb_track_skip2.style.left=
    pb.pb_track_skip2.style.width='0';
    if (haveduration){
      var tsk=[
        pb.pb_track_skip1,
        pb.pb_track_skip2
      ];
      var cd=pb.vid_stat.duration;
      for (var i=0;(i<pb.data.skip.length) && (i<2);i++){
        var l=(pb.data.skip[i][0] / cd) * 100.0;
        var r=(pb.data.skip[i][1] / cd) * 100.0;
        tsk[i].style.left=l+"%";
        tsk[i].style.width=(r-l)+"%";
      }
    }
  },

  reloadPlaybackTimeout:0,
  reloadPlayback:function(delay){
    clearTimeout(pb.reloadPlaybackTimeout);
    pb.reloadPlaybackTimeout=setTimeout(function(){
      pb.open(pb.url_value, pb.tip_value,0,pb.vid_stat.pos);
    },delay);
  },
  

  /* reset */
  reset:function(close, noclean){
    pb.state=0;
    pb.vid=null;
    pb.vid_reset_stat();
    pb.pb_vid.innerHTML='';
    _API.setVideo('');
    pb.pb_track_val.style.width="0%";
    pb.pb_iactions.style.transform='';

    pb.setskip(false);
    pb.skipauto_update(0);

    _API.setMessage(null);
    _API.setKey(null);

    vtt.clear();

    if (noclean){
      if (noclean!==2){
        pb.pb_meta.classList.add('active');
      }
    }
    else{
      pb.pb.style.backgroundImage='';
      pb.pb_meta.classList.remove('active');
    }
    pb.pb_actions.classList.remove('active');
    if (close){
      try{
        list.history_save();
        if (pb.data.animeid in list.fav.detail){
          list.fav_save();
        }
      }catch(e){}
      try{
        _JSAPI.playNextRegister();
      }catch(e){}

      $('home').style.display=$('search').style.display='';

      /* Reset Stream Type */
      _API.setStreamTypeValue(-1,0);

      pb.pb_loading.classList.remove('active');
      pb.pb.classList.remove('active');
      _API.clearCb();
      _API.setKey(home.keycb);
      home.list_init();
      _API.setUri("/home");
    }
    else{
      pb.pb_loading.classList.add('active');
      pb.pb.classList.add('active');
    }
  },

  /* videos */
  vid:null,
  vid_stat:{
    ready:false,
    pos:0,
    duration:0,
    play:false
  },
  vid_get_time_cb:null,
  vid_cmd_cb:null,
  vid_cmd:function(c,v){
    if (pb.vid_cmd_cb) return pb.vid_cmd_cb(c,v);
    return null;
  },
  vid_get_time:function(){
    if (pb.vid_get_time_cb) return pb.vid_get_time_cb();
    return {position:0,duration:0};
  },
  vid_startpos_init_to:null,
  vid_startpos_init:function(){
    clearTimeout(pb.vid_startpos_init_to);
    if (pb.startpos_val>0){
      if (pb.vid_stat.duration>0){
        pb.vid_cmd('seek',pb.startpos_val);
        pb.startpos_val=0;
        return;
      }
      if (pb.state) pb.vid_startpos_init_to=setTimeout(pb.vid_startpos_init,50);
    }
  },
  vid_event:function(c,v){
    if (c=='complete'){
      pb.vid_stat.play=false;
      pb.pb_track_ctl.innerHTML='replay';
      try{
        _JSAPI.playNextClear();
      }catch(e){}
      pb.menu_show(1);
      pb.next_ep(0);
    }
    else if (c=='ready'){
      pb.state=2;
      pb.pb_track_ctl.innerHTML='play_circle';
      pb.pb_track_ctl.className='';
      console.log("EVENT VID READY");
      if (pb.startpos_val>0){
        pb.vid_startpos_init();
      }
      if (pb.cfg_data.html5player){
        pb.vid_cmd('scale',pb.cfg_data.scale);
      }
    }
    else if (c=='play'){
      pb.vid_stat.play=true;
      pb.pb_track_ctl.innerHTML='play_circle';
      pb.menu_autohide();
      pb.setskip_track(1);
      vtt.playback.play();
      if (pb.cfg_data.html5player){
        pb.vid_cmd('speed',_API.vidSpeed);
        pb.vid_cmd('scale',pb.cfg_data.scale);
      }
    }
    else if (c=='pause'){
      vtt.playback.pause();
      pb.vid_stat.play=false;
      pb.pb_track_ctl.innerHTML='pause';
    }
    else if (c=='time'){
      pb.vid_stat.pos=v.position;
      pb.vid_stat.duration=v.duration;
      pb.track_update_pos();

      /* Check Skip Data */
      var sk=0;
      var skid=0;
      var ct=pb.vid_stat.pos;
      for (var i=0;i<pb.data.skip.length;i++){
          if ((pb.data.skip[i][0]<ct)&&(pb.data.skip[i][1]>ct)){
              sk=pb.data.skip[i][1]+1;
              skid=i;
          }
      }
      if (sk>0){
        if (!pb.onskip){
          pb.skip_val=sk;
          pb.setskip(true,skid);
        }
      }else if (pb.onskip){
        pb.setskip(false);
      }

      try{
        if (pb.playnext_last_tick<$tick()){
          pb.playnext_update(Math.floor(pb.vid_stat.pos),Math.ceil(pb.vid_stat.duration));
        }
      }catch(e){}
    }
  },
  playnext_last_tick:0,
  vid_reset_stat:function(){
    pb.vid_stat.ready=false;
    pb.vid_stat.pos=0;
    pb.vid_stat.duration=0;
    pb.vid_stat.play=false;
  },
  init_video_player_url:function(src){
    pb.pb_track_pos.innerHTML='STREAMING VIDEO';
    pb.vid_get_time_cb=function(){
      return _API.videoGetPos();
    };
    pb.vid_cmd_cb=function(c,v){
      if (c=='play'){
        pb.vid_stat.play=true;
        _API.videoPlay();
      }
      else if (c=='pause'){
        pb.vid_stat.play=false;
        _API.videoPause();
      }
      else if (c=='seek'){
        pb.vid_stat.pos=v<0?0:v;
        _API.videoSeek(pb.vid_stat.pos);
      }
    };
    _API.setVideo(src,function(c,v){
      pb.vid_event(c,v);
    });
  },
  m3u8_parse_main:function(src,dt){
    var d=(dt+"").replace(/\r/g,'').trim();
    var l=d.split('\n');
    var r=0;
    var lsrc=src.substr(0,src.lastIndexOf("/")+1);
    var t=[];
    var nsrc={};
    for (var i=0;i<l.length;i++){
      var ln=(l[i]+"").trim();
      if (ln.indexOf("#")==0){
        if (ln.indexOf("RESOLUTION=")>0){
          var n=ln.split("RESOLUTION=");
          if (n.length==2){
            n=n[1].split('x');
            if (n.length==2){
              r=(n[1]+"").trim();
            }
          }
        }
      }
      else if (r && ln){
        var tr=toInt(r);
        t.push(tr);
        nsrc["p"+tr]=lsrc+ln;
        r=0;
      }
    }
    t.sort(function(a, b){return b - a});
    for (var i=0;i<t.length;i++){
      pb.data.vsources.push(
        {
          r:t[i]+"p",
          u:nsrc["p"+(t[i])]
        }
      );
    }
    // console.log("PARSED-M3u8="+JSON.stringify(pb.data.vsources,null,'\t'));
  },
  sel_quality:"AUTO",
  init_video_mp4upload:function(src){
    pb.sel_quality=pb.cfgquality_name[pb.cfg_data.quality];
    pb.data.vsources=[
      {
        r:"AUTO",
        u:src
      }
    ];
    console.log("PARSED-M3u8 QUALITY="+pb.cfg_data.quality);
    function getm3u8cb(r){
      if (r.ok){
        pb.m3u8_parse_main(src,r.responseText);
        if (pb.cfg_data.quality<pb.data.vsources.length){
          var sl=pb.data.vsources[pb.cfg_data.quality];
          pb.sel_quality=sl.r;
          pb.init_video_player_url(sl.u);
          pb.cfg_update_el("quality");
          return;
        }
      }
      pb.sel_quality="AUTO";
      pb.init_video_player_url(src);
      pb.cfg_update_el("quality");
    }
    if (__SD5){
      $ap(src,getm3u8cb,__AFLIX.origin_dev);
    }
    else{
      $ap(src,getm3u8cb);
    }
  },
  init_video_mp4upload_html5:function(src){
    pb.data.mp4url=src;
    pb.pb_vid.innerHTML='';
    pb.vid=$n('video','',{'poster':(pb.data.banner?pb.data.banner:pb.data.poster)},pb.pb_vid,'');

    /* Command Handler */
    pb.vid_cmd_cb=function(c,v){
      if (c=='play'){
        pb.vid_stat.play=true;
        pb.vid.play();
      }
      else if (c=='pause'){
        pb.vid_stat.play=false;
        pb.vid.pause();
      }
      else if (c=='seek'){
        pb.vid_stat.pos=pb.vid.currentTime=v<0?0:v;
      }
    };

    /* Time Handler */
    pb.vid_get_time_cb=function(){
      return {
        position:pb.vid.currentTime,
        duration:pb.vid.duration
      };
    };
    
    pb.vid.addEventListener('ended',function(e) {
      if (!pb.state) return;
      pb.vid_event('complete',0);
    },false);

    pb.vid.addEventListener('durationchange',function(e) {
      if (!pb.state) return;
      pb.vid_event('time',{
        position:pb.vid.currentTime,
        duration:pb.vid.duration
      });
    },false);

    pb.vid.addEventListener('play',function(e) {
      if (!pb.state) return;
      pb.vid_event('play',0);
    },false);

    pb.vid.addEventListener('pause',function(e) {
      if (!pb.state) return;
      pb.vid_event('pause',0);
    },false);

    pb.vid.addEventListener('loadeddata',function(e) {
      if (!pb.state) return;
      pb.vid.play();
      pb.vid_event('ready',0);
    },false);

    pb.vid.addEventListener('timeupdate',function(e) {
      if (!pb.state) return;
      pb.vid_event('time',pb.vid_get_time());
    },false);

    if (pb.state){
      pb.vid.src=src;
    }
  },

  init_video_vidcloud:function(){
    if ((pb.cfg('server')==1)&&(pb.data.vizm3u8)){
      console.log("ATVLOG VIZCLOUD-M3U8 GOT_DATA => "+pb.startpos_val);
      pb.init_video_mp4upload(pb.data.vizm3u8);
      return;
    }

    console.log("ATVLOG VIDEO VIDCLOUD = "+pb.data.stream_vurl);
    var _tmp_start_pos=pb.startpos_val;
    pb.data.vizm3u8=null;
    
    _API.setMessage(function(e){
      if (pb.preload_video_started){
        return;
      }
      if (e){
        try{
          console.log("ATVLOG messageVal = "+e.data);
          if (e.data=='player.error'){
            __VIDPAGELOADCB(3);
            return;
          }
          var pd=JSON.parse(e.data);
          if (pd){
            if ('vcmd' in pd)
              pb.vid_event(pd.vcmd,pd.val);
            else if ('event' in pd){
              if (pd.event=='PLAYER_READY'){
                pb.vid_event('ready',0);
                pb.vid_cmd_cb('ready',0);
                pb.vid.classList.add('ready');
              }
            }
          }
        }catch(x){
        }
      }
    });

    /* Command Handler */
    pb.vid_cmd_cb=function(c,v){
      pb.vid.contentWindow.postMessage(JSON.stringify({
          vcmd:c,
          val:v
      }),'*');
    };

    /* Time Handler */
    pb.vid_get_time_cb=function(){
      return {
        position:pb.vid_stat.pos,
        duration:pb.vid_stat.duration
      };
    };

    var mp3utrycount=0;

    _API.setVizPageCb(function(d){
      if (d==0)
        pb.pb_track_pos.innerHTML='INITIALIZING';
      else if (d==1)
        pb.pb_track_pos.innerHTML='LOADING STREAM DATA';
      else if ((d==2)&&(++mp3utrycount<3)){
        pb.pb_track_pos.innerHTML='RETRY LOADING';
        pb.pb_vid.innerHTML='';
        (function(){
          pb.vid=$n('iframe','',{src:pb.data.stream_vurl,frameborder:'0'},pb.pb_vid,'');
        })();
      }
      else{
        pb.pb_track_pos.innerHTML='PLAYER ERROR';
        pb.pb_vid.innerHTML='';
      }
    });

    _API.setVizCb(function(d){
      try{
        pb.pb_track_pos.innerHTML='PREPARE VIDEO';
        _API.setVizPageCb(null);

        var urivid="";
        try{
          if (d.data.media.sources){
            urivid=(d.data.media.sources.length>1)?d.data.media.sources[1].file:d.data.media.sources[0].file;
          }
        }catch(e){}
        if (!urivid){
          try{
            if (d.result.sources){
              urivid=(d.result.sources.length>1)?d.result.sources[1].file:d.result.sources[0].file;
            }
          }catch(e){}
        }

        if (!__SD3){
          pb.subtitles=[];
          window.__subtitle=pb.subtitles;
          vtt.clear();
          try{
            if (d.result.tracks){
              var n=d.result.tracks.length;
              for (var i=0;i<n;i++){
                var tk=d.result.tracks[i];
                if (tk.kind=='captions'){
                  pb.subtitles.push({
                    u:tk.file,
                    d:tk.default?1:0,
                    l:(tk.label+'').toLowerCase().trim()
                  });
                }
              }
              vtt.init(pb.subtitles);
            }
          }catch(e){}
        }

        if ((urivid && !pb.cfg_data.html5player) || (__SD3)){
          pb.data.vizm3u8=urivid;
          console.log("ATVLOG Got VizCB = "+urivid);
          if (pb.cfg('server')==0){
            pb.pb_vid.innerHTML='';
            pb.vid_get_time_cb=pb.vid_cmd_cb=pb.vid=null;
            _API.setMessage(null);
            pb.startpos_val=_tmp_start_pos;
            pb.init_video_mp4upload(urivid);
          }
        }
        else{
          pb.pb_track_pos.innerHTML='STREAMING VIDEO';
        }
      }catch(e){
        pb.pb_track_pos.innerHTML='VIDEO ERROR: '+e;
      }
    });

    pb.pb_vid.innerHTML='';
    (function(){
      console.log("INIT-VIDEO-IFRAME : "+pb.data.stream_vurl);
      if (pb.preload_episode_video!=null){
        if (pb.preload_episode_video.u==pb.url_value){
          if (_API.m3u8cb){
            console.log("preload_episode_video cb -> "+pb.url_value);
            _API.m3u8cb(pb.preload_episode_video.d);
            pb.preload_episode_video=null;
            return;
          }
        }
      }
      pb.preload_episode_video=null;
      pb.vid=$n('iframe','',{src:pb.data.stream_vurl,frameborder:'0'},pb.pb_vid,'');
    })();
  },

  reinit_video_to:null,
  reinit_video_delay:function(ms){
    clearTimeout(pb.reinit_video_to);
    pb.reinit_video_to=setTimeout(function(){
      pb.startpos_val=pb.vid_stat.pos;
      pb.init_video();
      pb.cfg_update_el("hardsub");
      pb.cfg_update_el("softsub");
      pb.cfg_update_el("dub");
    },ms);
  },

  init_video:function(){
    pb.pb_vid.innerHTML='';
    pb.vid=pb.vid_get_time_cb=pb.vid_cmd_cb=null;
    pb.vid_reset_stat();
    _API.setVideo('');
    pb.lastkey=$tick();
    _API.setMessage(null);


    
    requestAnimationFrame(function(){
      pb.state=1;
      pb.track_update_pos();
      pb.pb_track_ctl.innerHTML='change_circle';
      pb.pb_track_ctl.className='loader';
      pb.pb_track_pos.innerHTML='LOADING SERVER';
      pb.pb_track_dur.innerHTML='';

      if (__SD3){
        /* Get Servers - HIANIME */
        pb.hiLoadVideo(pb.data, true, function(){
          pb.updateStreamTypeInfo();
          pb.init_video_vidcloud();
        });
      }
      else if (__SD5){
        pb.flix_load_video(pb.data, true, function(){
          pb.updateStreamTypeInfo();
          pb.flix_play_video();
        });
      }
      else{
        /* GET SERVER WAVE-ANIX */
        pb.data.stream_vurl = pb.data.stream_url.hard;
        pb.data.streamtype="sub";
        var is_soft=false;
        if (_API.currentStreamType==2){
          if (pb.data.stream_url.dub){
            pb.data.stream_vurl = pb.data.stream_url.dub;
            pb.data.streamtype="dub";
          }
          else if (pb.cfg_data.lang!='hard' || pb.cfg_data.lang!='sub'){
            is_soft=true;
          }
        }
        if (is_soft||_API.currentStreamType==1){
          if (pb.data.stream_url.soft){
            pb.data.stream_vurl = pb.data.stream_url.soft;
            pb.data.streamtype="softsub";
          }
        }
        pb.updateStreamTypeInfo();
        pb.init_video_vidcloud();
      }
    });
  },

  flix_load_video_url:function(dd,loadss,cb){
    var u=dd.stream_vurl;
    if (!u){
      return;
    }
    /* Load Player */
    function videoLoaded(r){
      if (r.ok){
        var play_data={
          subs:[],
          pos:[[0,0],[0,0]]
        };

        // Parsing Player HTML
        var d=$n('div','',null,null,r.responseText);
        var srcscript=d.querySelectorAll('script')[2];
        if (!srcscript){
          console.log("Player HTML Failed = "+r.responseText);
          d.innerHTML='';
          return false;
        }
        var iscript = srcscript.innerText.split('};').shift()+'};';

        // Load Subtitles:
        (function(){
          if (loadss){
            try{
              var subs=d.querySelectorAll('video#player track');
              var i,l=subs.length;
              for (i=0;i<l;i++){
                var sb=subs[i];
                var sd={};
                if (sb.getAttribute('kind')=='captions'){
                  sd.u=sb.getAttribute('id');
                  sd.l=sb.getAttribute('label');
                  sd.l=sd.l?(sd.l.toLowerCase().trim()):'';
                  sd.i=sb.getAttribute('srclang');
                  play_data.subs.push(sd);
                }
              }
            }catch(e){}
          }
        })();

        // Get M3U8 URL
        (function(){
          console.log("RUN SCRIPT\n"+iscript);
          try{
            eval(iscript+`
            play_data.url=source;
            play_data.pos[0]=[starttime,endtime];
            `);
          }catch(e){
            console.log("Error Eval : "+e);
          }
        })();

        // Cleanup
        d.innerHTML='';
        d=null;

        // Playing:
        if (play_data.url){
          // Set Skip Time
          dd.skip=JSON.parse(JSON.stringify(play_data.pos));

          // Loading Subtitle
          if (loadss){
            vtt.clear();
            pb.subtitles=JSON.parse(JSON.stringify(play_data.subs));
            vtt.init(pb.subtitles);
          }

          // Save Video Data
          dd.play_data=play_data;
          dd.vizm3u8=pb.data.play_data.url;

          // Run Callback
          cb();
          return true;
        }
      }
      return false;
    }
    function reqPlayer(nc){
      __AFLIX.req(u,function(r){
        if (r.ok){
          if (!videoLoaded(r)){
            if (++nc<5){
              setTimeout(function(){
                reqPlayer(1);
              },500);
            }
            else{
              _API.showToast("Loading video failed...");
            }
          }
        }
      });
    }
    reqPlayer(0);
  },
  flix_play_video:function(){
    pb.pb_vid.innerHTML='';
    pb.vid_get_time_cb=pb.vid_cmd_cb=pb.vid=null;
    _API.setMessage(null);
    // _JSAPI.videoSetUrl(pb.data.play_data.url);
    pb.init_video_mp4upload(pb.data.play_data.url);
  },
  flix_load_video:function(dd,loadss,cb){
    dd.stream_vurl = dd.stream_sub_url;
    dd.streamtype="softsub";
    if (_API.currentStreamType==2){
      if (dd.stream_dub_url){
        dd.stream_vurl = dd.stream_dub_url;
        dd.streamtype="dub";
      }
    }
    pb.flix_load_video_url(dd,loadss,cb);
  },

  /* view data */
  data:null,
  ep_title:'',
  ep_num:'',
  ep_index:-1,
  lastkey:0,
  state:0,

  /* Preload Next Episode data & video */
  preload_episode:null,
  preload_episode_video:null,
  preload_started:0,
  preload_video_started:0,
  preload_ep:function(){
    if (pb.preload_started==0){
      pb.preload_started=1;
      if (pb.ep_index<pb.data.ep.length-1){
        var next_id=pb.ep_index+1;
        var sel_id=-1;
        if (pb.cfg('skipfiller')){
          for (var i=next_id;i<pb.data.ep.length;i++){
            if (!pb.data.ep[i].filler){
              sel_id=i;
              break;
            }
          }
        }else{
          sel_id=next_id;
        }
        if (sel_id>-1){
          var epd=pb.data.ep[sel_id];
          console.log('Preloading Episode = '+sel_id+' -> '+epd.url);
          var uid=_API.getView(epd.url,function(d,u){
            _API.viewcb=null;
            if (uid==u && d.status){
              pb.preload_episode_video=null;
              pb.preload_episode={
                'u':epd.url,
                'd':d
              };
              console.log('Next EP Preloaded = '+sel_id);
              if (!pb.cfg_data.html5player&&!__SD5){
                pb.preload_video_started=1;
                _API.setVizPageCb(null);
                _API.setMessage(null);
                _API.setVizCb(function(d2){
                  _API.setVizCb(null);
                  pb.preload_episode_video={
                    'u':epd.url,
                    'd':d2
                  };
                  console.log('Next EP Video Preloaded = '+JSON.stringify(d2));
                  pb.pb_vid.innerHTML='';
                  setTimeout(function(){
                    pb.preload_video_started=0;
                  },500);
                });
                pb.pb_vid.innerHTML='';
                if (__SD3){
                  pb.hiLoadVideo(d, false, function(){
                    $n('iframe','',{src:d.stream_vurl,frameborder:'0'},pb.pb_vid,'');
                  });
                }
                else{
                  $n('iframe','',{src:d.stream_vurl+(__SD5?"":"#NOPLAY"),frameborder:'0'},pb.pb_vid,'');
                }
              }
            }
          });
        }
      }
    }
  },

  hiLoadVideo:function(dt,loadSubtitle,cb){
    var st=_API.currentStreamType;
    var uid=0;
    var ut="sub";
    var valid=false;
    var subvalid=false;
    if (st==2||pb.cfg_data.dubaudio){
      if (dt.ep_servers.dub.length>0){
        ut="dub";
        dt.streamtype="dub";
        valid=true;
        subvalid=true;
      }
    }
    if (!valid || pb.cfg_data.dubaudio){
      if (dt.ep_servers.sub.length>0){
        ut="sub";
        dt.streamtype="softsub";
      }
      else if (dt.ep_servers.raw.length>0){
        ut="raw";
        dt.streamtype="softsub";
      }
      else{
        ut="dub";
        dt.streamtype="dub";
      }
    }

    if (dt.ep_servers[ut].length>0){
      for (var i=0;i<dt.ep_servers[ut].length;i++){
        var q=dt.ep_servers[ut][i];
        if (q.server==1||q.server==4){
          if (pb.cfg_data.mirrorserver && uid!=0){
            uid=i;
          }
          else if (uid==0){
            uid=i;
          }
        }
      }
      var subuid=uid;
      var subut=ut;
      if (subvalid && (ut!="dub")){
        ut="dub";
        var dubuid=0;
        for (var i=0;i<dt.ep_servers[ut].length;i++){
          var q=dt.ep_servers[ut][i];
          if (q.server==1||q.server==4){
            if (pb.cfg_data.mirrorserver && dubuid!=0){
              dubuid=i;
            }
            else if (uid==0){
              dubuid=i;
            }
          }
        }
        uid=dubuid;
      }

      var seld = dt.ep_servers[ut][uid];
      dt.stream_vurl = seld.link;
      dt.ep_stream_sel = seld;
      var subld = dt.ep_servers[subut][subuid];
      console.log("GOT-VIDEO-IFRAME-URL : "+seld.link);
      console.log("GOT-SUB-URL : "+subld.link);

      // Get Video Data
      if (loadSubtitle){
        var vvturl='https://'+seld.dns+'/embed-2/ajax/e-1/getSources?id='+enc(subld.sid);
        $ap(vvturl,function(r){
          if (r.ok){
            try{
              var jv=JSON.parse(r.responseText);
              /* Load Intro / Outro */
              try{
                var st=jv?.intro?.start;
                var en=jv?.intro?.end;
                var sto=jv?.outro?.start;
                var eno=jv?.outro?.end;
                dt.skip=[
                  [st?st:0,en?en:0],
                  [sto?sto:0,eno?eno:0]
                ];
              }catch(e){}
              
              /* Load Subtitle */
              vtt.clear();
              pb.subtitles=[];
              window.__subtitle=pb.subtitles;
              try{
                if (jv.tracks){
                  var n=jv.tracks.length;
                  for (var i=0;i<n;i++){
                    var tk=jv.tracks[i];
                    if (tk.kind=='captions'){
                      pb.subtitles.push({
                        u:tk.file,
                        d:tk.default?1:0,
                        l:(tk.label+'').toLowerCase().trim()
                      });
                    }
                  }
                  vtt.init(pb.subtitles);
                }
              }catch(e){}
            }catch(ee){}
          }
        });
      }
      cb();
    }
  },

  /* next ep */
  next_ep:function(fn){
    /* autonext */
    if (pb.cfg('autonext')||fn){
      if (pb.ep_index<pb.data.ep.length-1){
        var next_id=pb.ep_index+1;
        var sel_id=-1;
        /* skip filler */
        if (pb.cfg('skipfiller')){
          for (var i=next_id;i<pb.data.ep.length;i++){
            if (!pb.data.ep[i].filler){
              sel_id=i;
              break;
            }
          }
        }else{
          sel_id=next_id;
        }
        if (sel_id>-1){
          var epd=pb.data.ep[sel_id];
          action_value=epd.url;
          if (__SD3||__SD5){
            action_value='>'+epd.url;
          }
          pb.action_handler(action_value,';1');
        }
      }
    }
  },

  /* action command handler */
  action_handler:function(action,arg){
    if (!action) return false;
    console.log("action_handler -> "+action+" / "+arg);
    if (action.startsWith("http")||action.startsWith(">")){
      var args=[0,0,0];
      if (arg)
        args=arg.split(';');
      var startpos=0;
      if (args.length>=3) startpos=parseInt(args[2]);
      var url=action;
      if (action.startsWith(">")){
        url=action.substring(1);
      }
      pb.open(url, args[0], parseInt(args[1]), startpos);
      return true;
    } 
    else if (action.startsWith("!")){
      var src=action.substring(1);
      home.search.open({
        genre:src
      });
      pb.reset(1,0);
    }
    else if (action.startsWith("@")){
      var src=action.substring(1);
      home.search.open({
        genre:'_'+src
      });
      pb.reset(1,0);
    }
    else if (action.startsWith("#")){
      /* Mal Action */
      var id=action.substring(1);
      _MAL.action_handler(id);
    }
    else if (action.startsWith("$")){
      /* Preview Popup Action Handler */
      var data=action.substring(1);
      _MAL.prev_action_handler(data,arg);
    }
    else if (action.startsWith("*")){
      var key=action.substring(1);
      console.log("ACTION SETTINGS = "+key);
      if (key=="fav"){
        if (list.fav_exists(pb.data.animeid)){
          list.fav_del(pb.data.animeid);
        }
        else{
          list.fav_add(pb.data.animeid,pb.listobj(),true);
        }
        pb.cfg_update_el(key);
      }
      else if (key=='lang'){
        home.settings.lang_action();
      }
      else if (key=='theme'){
        var chval=_API.listPrompt(
          "Interface Coloe",
          pb.cfgtheme_name,
          _API.theme_sel
        );
        if (chval!=null){
          _API.theme_sel=toInt(chval);
          _JSAPI.storeSet(_API.user_prefix+"theme", _API.theme_list[_API.theme_sel]);
          _API.theme_update();
          pb.cfg_update_el(key);
        }
      }
      else if (key=='settings'){
        home.settings.open(1);
      }
      else if (key=='donate'){
        if (home.onsettings){
          home.settings.open_donation(1);
        }
      }
      else if (key=='discord'){
        if (home.onsettings){
          home.settings.open_donation(0);
        }
      }
      else if (key=='checkupdate'){
        if (home.onsettings){
          _API.checkUpdate();
        }
      }
      else if (key=="hardsub" || key=="softsub"|| key=="dub"){
        var sel=0;
        if (key=="softsub") sel=1;
        else if (key=="dub") sel=2;
        if (_API.currentStreamType!=sel){
          _API.setStreamTypeValue(sel,1);
          pb.reinit_video_delay(100);
        }
      }
      else if (key=="speed"){
        _API.vidSpeed+=0.25;
        if (_API.vidSpeed>2.0){
          _API.vidSpeed=0.5;
        }
        if (pb.cfg_data.html5player){
          pb.vid_cmd('speed',_API.vidSpeed);
        }
        else{
          _API.videoSpeed(_API.vidSpeed);
        }
        pb.cfg_update_el(key);
      }
      else if (key=="quality"){
        if (pb.state==2){
          var chval=_API.listPrompt(
            "Stream Quality",
            pb.cfgquality_name,
            pb.cfg_data.quality
          );
          if (chval!=null){
            pb.cfg_data.quality=toInt(chval);
            pb.sel_quality=pb.cfgquality_name[pb.cfg_data.quality];
            pb.cfg_update_el(key);
            pb.cfg_save();
            pb.reinit_video_delay(1000);
          }
        }
      }
      else if (key=="animation"){
        pb.state=0;
        var chval=_API.listPrompt(
          "Transition Animation",
          pb.cfganimation_name,
          pb.cfg_data.animation
        );
        if (chval!=null){
          pb.cfg_data.animation=toInt(chval);
          pb.cfg_update_el(key);
          pb.cfg_save();
          pb.updateanimation();
        }
      }
      else if (key=="uifontsize"){
        pb.state=0;
        var chval=_API.listPrompt(
          "Font Size",
          pb.cfguifontsize_name,
          pb.cfg_data.uifontsize
        );
        if (chval!=null){
          pb.cfg_data.uifontsize=toInt(chval);
          pb.cfg_update_el(key);
          pb.cfg_save();
          pb.updateanimation();
        }
      }
      else if (key=="httpclient"){
        pb.state=0;
        var chval=_API.listPrompt(
          "HTTP Client",
          pb.cfghttpclient_name,
          pb.cfg_data.httpclient
        );
        if (chval!=null){
          pb.cfg_data.httpclient=toInt(chval);
          pb.cfg_update_el(key);
          pb.cfg_update_el('usedoh');
          pb.cfg_save();
          _JSAPI.setHttpClient(pb.cfg_data.httpclient);
        }
      }
      else if (key=="listprog"){
        pb.state=0;
        var chval=_API.listPrompt(
          "Update watch progress",
          pb.cfglistprog_name,
          pb.cfg_data.listprog
        );
        if (chval!=null){
          pb.cfg_data.listprog=toInt(chval);
          pb.cfg_update_el(key);
          pb.cfg_save();
        }
      }
      else if (key=="ccstyle"){
        var stn=[];
        for (var i=0;i<16;i++){
          stn.push(vtt.stylename(i));
        }
        var chval=_API.listPrompt(
          "Subtitle Style",
          stn,
          pb.cfg_data.ccstyle
        );
        if (chval!=null){
          var vv=toInt(chval);
          if (vv!=pb.cfg_data.ccstyle){
            pb.cfg_data.ccstyle=vv;
            pb.cfg_update_el(key);
            pb.cfg_save();
            vtt.set_style(pb.cfg_data.ccstyle);
          }
        }
      }
      else if (key=="bgimg"){
        pb.state=0;
        var chval=_API.listPrompt(
          "Wallpaper",
          pb.cfgwallpaper_name,
          pb.cfg_data.bgimg
        );
        if (chval!=null){
          pb.cfg_data.bgimg=toInt(chval);
          pb.cfg_update_el(key);
          pb.cfg_save();
          _API.bgimg_update();
        }
      }
      else if (key=='nonjapan'){
        // Update Home
        pb.cfg_data.nonjapan=!pb.cfg_data.nonjapan;
        pb.cfg_update_el(key);
        pb.cfg_save();
        home.settings.needreload=true;
      }
      else if (key=='jptitle'){
        // Update Home
        pb.cfg_data.jptitle=!pb.cfg_data.jptitle;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='progcache'){
        // Update Home
        pb.cfg_data.progcache=!pb.cfg_data.progcache;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='usedoh'){
        // Update Home
        pb.cfg_data.usedoh=!pb.cfg_data.usedoh;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='compactlist'){
        // Update Home
        pb.cfg_data.compactlist=!pb.cfg_data.compactlist;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='sourcesvr'){
        // Update Home
        var chval=_API.listPrompt(
          "Source Server",
          __SOURCE_NAME,
          __SD-1
        );
        if (chval!=null){
          chval=toInt(chval)+1;
          if (confirm("You are about to change the source server.\n"+
            "SOURCE SERVER TARGET : "+chval+". "+(__SOURCE_NAME[chval-1])+"\n\n"+
            "NOTE: Watchlist & history contents will be changed...\n\n"+
            "Are you sure??")){
            _JSAPI.setSd(chval);
            if (pb.status){
              pb.reset(1,0);
            }
            setTimeout(function(){
              _API.reload();
            },200);
          }
        }
      }
      else if (key=='performance'){
        pb.cfg_data.performance=!pb.cfg_data.performance;
        pb.cfg_update_el(key);
        pb.cfg_save();
        pb.updateanimation();
      }
      else if (key=='mirrorserver'){
        pb.cfg_data.mirrorserver=!pb.cfg_data.mirrorserver;
        pb.cfg_update_el(key);
        pb.cfg_save();
        _API.setStreamServer(pb.cfg_data.mirrorserver?1:0,pb.state?1:0);
        if (pb.state){
          pb.reloadPlayback(1000);
        }
      }
      else if (key=='malaccount'){
        _MAL.login();
      }
      else if (key=='anilistaccount'){
        _MAL.login(1);
      }
      else if (key in pb.cfg_data){
        if (key=="server"){
          if (pb.state){
            pb.state=0;
            if (++pb.cfg_data.server>2) pb.cfg_data.server=0;
            pb.cfg_update_el(key);
            pb.cfg_save();
            pb.startpos_val=pb.vid_stat.pos;
            pb.init_video();
          }
        }
        else if (key=="scale"){
          var chval=_API.listPrompt(
            "Video Scaling",
            pb.cfgscale_name,
            pb.cfg_data.scale
          );
          if (chval!=null){
            pb.cfg_data.scale=toInt(chval);
            pb.cfg_update_el(key);
            pb.cfg_save();
            _API.videoScale(pb.cfg_data.scale);
            pb.vid_cmd('scale',pb.cfg_data.scale);
          }
        }
        else{
          pb.cfg_data[key]=!pb.cfg_data[key];
          pb.cfg_update_el(key);
          pb.cfg_save();
        }
      }
    }
  },

  action_handler_el:function(el){
    try{
      var action=el.getAttribute('action');
      var arg=el.getAttribute('arg');
      return pb.action_handler(action,arg);
    }catch(e){}
    return false;
  },

  /* init menu */
  menu_clear:function(g){
    if ('P' in g){
      g.P.innerHTML='';
    }
    else{
      g.innerHTML='';
      g.P=$n('p','',0,g,'');
    }
  },

  /* menu selection */
  menu_select:function(g,n){
    if (n){
      var fc=g.P.firstElementChild;
      if (!fc) return false;
      if (!g._midx) g._midx=2;
      if (!g.__update){
        g.__update=function(){
          if (g._sel)
            g._sel.classList.remove('active');
          var n = g._target_n;
          

          var iw=window.innerWidth/g._midx;
          var ow=(g._itemwidth)?g._itemwidth():n.offsetWidth;
          var xpos=n.offsetLeft+(ow/2);

          n.classList.add('active');
          if (xpos>iw){
            g._margin=xpos-iw;
            g.classList.add('maskleft');
          }
          else{
            g._margin=0;
            g.classList.remove('maskleft');
          }
          if (g._margin)
            g.P.style.transform='translateX(-'+g._margin+'px)';
          else
            g.P.style.transform='translateX(0)';
          g._sel=n;
        };
      }
      g._target_n=n;
      fc.ontransitionend=function(){
        requestAnimationFrame(g.__update);
        fc.ontransitionend=null;
      };
      requestAnimationFrame(g.__update);
      return true;
    }
    return false;
  },

  /* menu key handler */
  gestures:{
    pos:function(ev){
      var pX=0;
      var pY=0;
      if (ev.touches){
        if (ev.touches.length>0){
          pX=ev.touches[0].screenX;
          pY=ev.touches[0].screenY;
        }
      }
      else{
        pX=ev.screenX;
        pY=ev.screenY;
      }
      return [pX,pY];
    },
    start:function(ev){
      var p=pb.gestures.pos(ev);
      if (p[0]&&p[1])
        this.__gesture_start=p;
      else
        this.__gesture_start=null;
      this.__gesture_moved=false;
      ev.preventDefault();
    },
    move:function(ev){
      var s=this.__gesture_start;
      if (s){
        var p=pb.gestures.pos(ev);
        var xmove=p[0]-s[0];
        if (this.P){
          if (Math.abs(xmove)<(window.innerWidth*0.06)){
            this.P.style.marginLeft=(xmove/1.5)+'px';
          }
          else{
            this.P.style.marginLeft='';
            this.__gesture_start=p;
            this.__gesture_moved=true;
            if (xmove<0){
              this._keycb(this,KRIGHT);
            }
            else{
              this._keycb(this,KLEFT);
            }
          }
        }
      }
    },
    end:function(ev){
      this.P.style.marginLeft='';
      this.__gesture_start=null;
      if (!this.__gesture_moved){
        var tp=ev.target;
        while(tp){
          if (tp.parentNode==this.P){
            break;
          }
          else if (tp==this){
            tp=null;
            break;
          }
          tp=tp.parentNode;
        }
        if (tp){
          if (tp.classList.contains('active')){
            this._keycb(this,KENTER);
          }
          else{
            pb.menu_select(this,tp);
          }
        }
      }
      this.__gesture_moved=false;
      // console.log([this,ev]);
    },
  },
  menu_gesture_init:function(g){
    g.ontouchstart=pb.gestures.start;
    g.ontouchmove=pb.gestures.move;
    g.ontouchend=pb.gestures.end;
  },

  menu_init:function(g){
    g._keycb=pb.menu_keycb;
    // pb.menu_gesture_init(g);
  },
  menu_keycb:function(g,c,z){
    var n=null;
    if (!('_margin' in g)){
      g._margin=0;
      g._reset=function(){
        var aniSel=g._sel;
        g._sel=null;
        requestAnimationFrame(function(){
          g._margin=0;
          aniSel.classList.remove('active');
          g.classList.remove('maskleft');
          g.P.style.transform='translateX(0)';
        });
      };
    }
    if (!g.firstElementChild) return false;
    if (c==KENTER){
      if (g._sel){
        if (g._enter_cb)
          return g._enter_cb(g,g._sel);
        else{
          if (g._sel._enter_cb)
            return g._sel._enter_cb(g,g._sel);
          else
            return pb.action_handler_el(g._sel);
        }
      }
    }
    else if (c==KLEFT){
      if (g._sel){
        if (g._sel.previousElementSibling)
          n=g._sel.previousElementSibling;
        else if (g.__prev){
          g.__prev();
          return true;
        }
        else if (g._should_clear)
          g._reset();
      }
    }
    else if (c==KRIGHT){
      if (g._sel){
        if (g._sel.nextElementSibling)
          n=g._sel.nextElementSibling;
        else if (g.__next){
          g.__next();
          return true;
        }
      }
      else
        n=g.P.firstElementChild;
    }
    else if (c==KPGUP || c==KPREV){
      if (g.__prev){
        g.__prev();
        return true;
      }
      else{
        if (!g._nojump)
          n=g.P.firstElementChild;
      }
    }
    else if (c==KPGDOWN || c==KNEXT){
      if (g.__next){
        g.__next();
        return true;
      }
      else{
        if (!g._nojump)
          n=g.P.lastElementChild;
      }
    }
    if (n){
      if (g.__selectcb){
        g.__selectcb(g,n);
      }
      pb.menu_select(g,n);
      return true;
    }
    return false;
  },

  /* Main Menu Handlers */
  menus:[],
  menusel:0,
  menu_autohide_to:null,
  menu_hide_tick:0,
  menu_autohide:function(){
    var autohide_duration=2500;
    if (pb.state>1&&pb.vid_stat.play){
      clearTimeout(pb.menu_autohide_to);
      if (pb.lastkey+autohide_duration<$tick()){
        pb.menu_hide();
      }
      else{
        pb.menu_autohide_to=setTimeout(pb.menu_autohide,100);
      }
    }
  },
  menu_hide:function(){
    clearTimeout(pb.menu_autohide_to);
    pb.menu_hide_tick=$tick();
    pb.menus[pb.menusel].classList.remove('active');
    pb.menusel=0;
    pb.menus[pb.menusel].classList.add('active');
    pb.pb_meta.classList.remove('active');
    $('pb_actions').classList.remove('active');
    pb.pb_iactions.style.transform='';
    pb.pb.classList.remove('menushow');
    pb.skipauto_update(1);
  },
  menu_show:function(pos){
    pb.pb.classList.add('menushow');
    pb.menus[pb.menusel].classList.remove('active');
    pb.menusel=(pos===undefined?2:pos);
    pb.pb_actions.classList.add('active');
    pb.menus[pb.menusel].classList.add('active');
    pb.menu_update();
    pb.menu_autohide();
    pb.skipauto_update(0);
  },
  menu_update:function(){
    if (pb.menusel<=1){
      pb.pb_meta.classList.add('active');
      pb.pb_iactions.style.transform='';
      pb.pb_list.classList.remove('nomask');
      return;
    }
    else{
      pb.pb_meta.classList.remove('active');
    }
    var vh=(pb.menusel<pb.menus.length-1)?window.innerHeight/13:0;
    for (var i=2;((i<=pb.menusel)&&(i<pb.menus.length));i++){
      vh+=pb.menus[i].offsetHeight;
    }
    pb.pb_iactions.style.transform='translateY('+(window.innerHeight-vh)+'px)';
    if (pb.menus[pb.menusel]._sel){
      pb.menu_select(pb.menus[pb.menusel],pb.menus[pb.menusel]._sel);
    }
  },

  /* Track & Timings */
  track_keycb:function(g,c){
    if (c==KLEFT||c==KRIGHT){
      if ((_API.last_key_source==1&&c==KLEFT)||(_API.last_key_source!=1&&c==KRIGHT))
        pb.vid_cmd('seek',pb.vid_get_time().position+10);
      else
        pb.vid_cmd('seek',pb.vid_get_time().position-10);
      pb.track_update_pos();
    }
    else if (c==KENTER){
      if (!pb.vid_stat.play)
        pb.vid_cmd('play',0);
      else
        pb.vid_cmd('pause',0);
    }
  },

  /* update Track */
  track_update_pos:function(){
    var d=pb.vid_get_time();
    var dur=d.duration;
    var pos=d.position;

    if (dur>0){
        var dr=(pos/dur)*100.0;
        pb.pb_track_val.style.width=dr+"%";
        pb.pb_track_pos.innerHTML=sec2ts(pos,dur<3600);
        pb.pb_track_dur.innerHTML=sec2ts(dur,dur<3600);
        pb.update_malist_ep(dr);

        if (pb.cfg_data.preloadep && (dr>80) && (pb.preload_started==0)){
          pb.preload_ep();
        }
    }
    else{
      pb.pb_track_val.style.width="0%";
      pb.pb_track_dur.innerHTML="";
    }
  },

  /* Root Key Callback */
  keycb:function(c){
    if (home.onsettings){
      return home.settings_keycb(c);
    }

    pb.lastkey=$tick();

    if (c==KPLAY){
      if (pb.state){
        if (!pb.vid_stat.play)
          pb.vid_cmd('play',0);
        else{
          pb.vid_cmd('pause',0);
          if (!pb.pb_actions.classList.contains('active')){
            pb.menu_show(2);
          }
        }
      }
      // pb.menu_show(c==KUP?1:2);
    }
    else if (c==KNEXT||c==KPREV){
      if (pb.state){
        if (!pb.pb_actions.classList.contains('active')){
          pb.menu_show(3);
          var vl=pb.menus[3];
          if (c==KNEXT){
            vl._keycb(vl,KRIGHT);
          }
          else{
            vl._keycb(vl,KLEFT);
          }
          return;
        }
      }
    }

    if (pb.pb_actions.classList.contains('active')){
      if (c==KBACK){
        pb.menu_hide();
      }
      else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN||c==KNEXT||c==KPREV){
        if (pb.menus[pb.menusel]._keycb)
          pb.menus[pb.menusel]._keycb(pb.menus[pb.menusel],c);
      }
      else if (c==KUP){
        pb.menus[pb.menusel].classList.remove('active');
        if (--pb.menusel<0){
          pb.menusel=0;
          pb.menu_hide();
          return;
        }
        pb.menus[pb.menusel].classList.add('active');
        pb.menu_update();
      }
      else if (c==KDOWN){
        pb.menus[pb.menusel].classList.remove('active');
        if (++pb.menusel>=pb.menus.length) pb.menusel=pb.menus.length-1;
        pb.menus[pb.menusel].classList.add('active');
        pb.menu_update();
      }
    }
    else{
      if (c==KENTER){
        if (pb.onskip){
          if (pb.skip_val>0){
            pb.vid_cmd('seek',pb.skip_val);
            return true;
          }
        }
      }
      if (c==KLEFT||c==KRIGHT||c==KUP||c==KDOWN||c==KENTER){
        pb.menu_show(c==KUP?1:2);
      }
      else if (c==KBACK){
        if (pb.menu_hide_tick+1000<$tick()){
          /* prevent accidential back */
          pb.reset(1,0);
        }
        else{
          _API.showToast("Press back again to close watching...");
          pb.menu_hide_tick=0;
        }
      }
    }
  },

  init_episode_title:function(d,idx){
    if (d.active){
      pb.ep_index=idx;
      pb.ep_val=d.ep+'';
      pb.ep_title='EPISODE '+(d.ep);
      if (pb.data.ep.length>1)
        pb.ep_num='EP.'+(d.ep);
      else
        pb.ep_num='';
      if (d.title)
        pb.ep_title+='. '+(d.title.toUpperCase());
    }
  },

  init_episode:function(start, spos){
    var paging_sz=50;
    pb.menu_clear(pb.pb_episodes);
    if (pb.data.ep&&pb.data.ep.length){
      if (start<0){
        start=0;
        if (pb.data.ep.length>paging_sz){
          for (var i=0;i<pb.data.ep.length;i++){
            if (pb.data.ep[i].active){
              pb.init_episode_title(pb.data.ep[i],i);
              start=Math.floor(i/paging_sz)*paging_sz;
              break;
            }
          }
        }
      }
      var act=null;
      var first_ep='';
      var last_ep='';
      for (var i=start;((i<pb.data.ep.length)&&(i<start+paging_sz));i++){
        var d=pb.data.ep[i];
        var adh='';
        var action_value=d.url;
        if (__SD3||__SD5){
          action_value='>'+d.url;
        }
        var hl=$n('div',d.active?'playing':'',{action:action_value,arg:pb.tip_value+';1'},pb.pb_episodes.P,special(d.ep)+adh);
        if (d.img){
          hl.style.backgroundImage='linear-gradient(180deg, rgba(0, 0, 0, .1), rgba(0, 0, 0, .6)), url('+d.img+')';
          hl.classList.add('hasbg');
        }
        if (d.title)
          hl.setAttribute('data-title',d.title);
        if (d.active){
          act=hl;
          pb.init_episode_title(d,i);
        }
        if (d.filler){
          hl.classList.add('filler');
          hl.innerHTML+='<i>FILLER</i>';
        }
        if (d.dub){
          hl.classList.add('havedub');
          hl.innerHTML+='<c class="dubinfo">mic</c>';
        }
        if (!first_ep) first_ep=d.ep;
        last_ep=d.ep;
      }

      if (first_ep!=last_ep&&pb.data.ep.length>paging_sz)
        pb.pb_episodes.setAttribute('data-eps','Episodes: '+first_ep+' - '+last_ep+' / '+pb.data.ep.length);
      else
        pb.pb_episodes.removeAttribute('data-eps');
      if (start+paging_sz<pb.data.ep.length){
        pb.pb_episodes.__next_start=start+paging_sz;
        if (pb.pb_episodes.__next_start>=pb.data.ep.length) pb.pb_episodes.__next_start=pb.data.ep.length-1;
        pb.pb_episodes.__next=function(){
          pb.init_episode(pb.pb_episodes.__next_start, 1);
        };
      }
      else
        pb.pb_episodes.__next=null;
      if (start>0){
        pb.pb_episodes.__prev_start=start-paging_sz;
        if (pb.pb_episodes.__prev_start<0) pb.pb_episodes.__prev_start=0;
        pb.pb_episodes.__prev=function(){
          pb.init_episode(pb.pb_episodes.__prev_start, 2);
        };
      }
      else
        pb.pb_episodes.__prev=null;
      if (act&&!spos){
        pb.menu_select(pb.pb_episodes,act);
      }
      else if (spos==1){
        pb.menu_select(pb.pb_episodes,pb.pb_episodes.P.firstElementChild);
      }
      else if (spos==2){
        pb.menu_select(pb.pb_episodes,pb.pb_episodes.P.lastElementChild);
      }
    }
  },

  init_settings:function(){
    pb.cfg_load();
    pb.menu_clear(pb.pb_settings);

    if (!pb.cfg_data.html5player){
      _API.videoSpeed(_API.vidSpeed);
    }

    // $n('div','',{action:'-prev'},pb.pb_settings,'<c>skip_previous</c> PREV');
    // $n('div','',{action:'-next'},pb.pb_settings,'NEXT <c>skip_next</c>');
    pb.pb_settings._s_settings=$n('div','',{action:'*settings'},pb.pb_settings.P,'<c>settings</c> SETTINGS');
    pb.pb_settings._s_fav=$n('div','',{action:'*fav'},pb.pb_settings.P,'');

    
    pb.pb_settings._s_speed=$n('div','',{action:'*speed'},pb.pb_settings.P,'<c>speed</c> <span>SPEED 1.0x</span>');
    if (!pb.cfg_data.html5player){
      pb.pb_settings._s_quality=$n('div','',{action:'*quality'},pb.pb_settings.P,'<c>hd</c> <span>AUTO</span>');
    }

    if (!__SD3&&!__SD5){
      pb.pb_settings._s_hardsub=$n('div','',{action:'*hardsub'},pb.pb_settings.P,'<c>clear</c> HARDSUB');
      if (pb.data.stream_url.soft){
        pb.pb_settings._s_softsub=$n('div','',{action:'*softsub'},pb.pb_settings.P,'<c>clear</c> SOFTSUB');
      }
      if (pb.data.stream_url.dub){
        pb.pb_settings._s_dub=$n('div','',{action:'*dub'},pb.pb_settings.P,'<c>clear</c> DUB');
      }
    }

    if (!__SD5){
      pb.pb_settings._s_mirrorserver=$n(
        'div','',{
          action:'*mirrorserver'
        },
        pb.pb_settings.P,
        '<c>clear</c> MIRROR SERVER'
      );
    }
    
    /*
    sub, softsub, dub
    */


    pb.menu_select(pb.pb_settings,pb.pb_settings.P.firstElementChild);
    pb.pb_settings._midx=2;
    pb.cfg_update_el();
    _API.videoScale(pb.cfg_data.scale);
  },

  updateStreamTypeInfo:function(){
    var txtadd='';
    var translate=false;
    if (pb.data.streamtype=="dub"){
      pb.curr_stream_type=2;
    }
    else if (pb.data.streamtype=="softsub"){
      pb.curr_stream_type=1;
      txtadd+=' <b class="softsub_lang">'+pb.cfg_data.lang.toUpperCase()+'</b>';
      translate=vtt.substyle?true:false;
    }
    else{
      pb.curr_stream_type=0;
    }
    pb.pb_action_streamtype.innerHTML='<c>'+(translate?"g_translate":pb.cfgstreamtype_ico[pb.curr_stream_type])+'</c> '+
      (translate?"TRANSLATE":pb.cfgstreamtype_name[pb.curr_stream_type])+txtadd;
    pb.pb_action_streamtype.classList.add('active');
  },

  need_malist_update:false,

  update_malist_ep:function(dr){
    if (!pb.need_malist_update){
      return;
    }

    if (dr<(pb.cfg_data.listprog * 24)){
      return;
    }


    /* MAL Update Watched Episode */
    if (pb.malidsave && (pb.malidanime==pb.data.animeid)){
      console.log("MAL-PLAY #"+pb.malidsave+" / animeid="+pb.data.animeid);
      var isanilist=false;
      var malid="mal_"+pb.malidsave;
      var cep=toInt(pb.ep_val);

      if ((pb.malidsave+'').startsWith("L")){
        malid='anilist_'+pb.malidsave.substring(1);
        isanilist=true;
      }
      if (!isanilist && (malid in _MAL.data)){
        _MAL.update_epel(_MAL.data[malid],cep);
      }
      else if (isanilist && (malid in _MAL.aldata)){
        _MAL.update_epel(_MAL.aldata[malid],cep);
      }
      else{
        pb.malidanime=null;
        pb.malidsave=null;  
        console.log("MAL-PLAY #RESET-NOTFOUND");
      }

      pb.need_malist_update=false;
    }
  },

  init:function(){
    pb.preload_started=0;
    pb.preload_video_started=0;

    pb.sel_quality=pb.cfgquality_name[pb.cfg_data.quality];

    $('home').style.display=$('search').style.display='none';
    pb.setskip_track(0);
    pb.updateStreamTypeInfo();

    pb.menus=[
      pb.pb_genres,
      pb.pb_settings,
      pb.pb_tracks
    ];
    pb.pb.style.backgroundImage='url('+(pb.data.banner?pb.data.banner:pb.data.poster)+'), url('+(pb.data.banner?pb.data.banner:pb.data.poster)+')';

    /* META */
    pb.ep_num='';
    pb.ep_title='';
    pb.pb_title.innerHTML=tspecial(pb.data.title);
    pb.pb_title.setAttribute('jp',pb.data.title_jp?pb.data.title_jp:dpb.data.title);

    var addb='';
    try{
      var bb='';
      if (pb.data.info.type){
        bb+='<span>'+special(pb.data.info.type.name)+'</span>';
      }
      if (pb.data.info.quality){
        bb+='<span>'+special(pb.data.info.quality)+'</span>';
      }
      if (pb.data.info.rating){
        bb+='<span>'+special(pb.data.info.rating)+'</span>';
      }
      if (pb.data.seasons){
        if (pb.data.seasons.length>0){
          bb+='<span>'+pb.data.seasons.length+' SEASONS</span>';
        }
      }
      if (pb.data.ep){
        if (pb.data.ep.length>1){
          bb+='<span>'+pb.data.ep.length+' EPISODES</span>';
        }
      }
      if(bb){
        addb='<b>'+bb+'</b>';
      }
    }catch(e){}
    
    // pb.pb_desc.innerHTML=addb+special(pb.data.synopsis);

    var translate_desc=null;
    if (pb.cfg_data.lang!='en' && 
          pb.cfg_data.lang!='hard' && 
          pb.cfg_data.lang!='dub' && 
          pb.cfg_data.lang!=''){
            translate_desc=pb.cfg_data.lang;
    }
    if (translate_desc){
      /* Already Translated */
      if ('_translated' in pb){
        if (pb._translated[0]==pb.data.synopsis){
          pb.pb_desc.innerHTML=addb+special(pb._translated[1]);
          translate_desc=false;
        }
      }

      /* Not Translated Yet! */
      if (translate_desc){
        vtt.translate_text(pb.data.synopsis,translate_desc,function(txts){
          if (!txts){
            /* fallback if translate failed */
            txts=pb.data.synopsis;
          }
          pb._translated=[
            pb.data.synopsis,
            txts
          ];
          pb.pb_desc.innerHTML=addb+special(txts);
        });
      }
    }
    else{
      pb.pb_desc.innerHTML=addb+special(pb.data.synopsis);
    }


    /* Genres */
    pb.menu_clear(pb.pb_genres);
    if (pb.data.genres||pb.data.info.type){
      if (pb.data.info.type){
        $n('div','',{action:'@'+pb.data.info.type.val},pb.pb_genres.P,special(pb.data.info.type.name));
      }
      if (pb.data.genres){
        for (var i=0;i<pb.data.genres.length;i++){
          $n('div','',{action:'!'+pb.data.genres[i].val},pb.pb_genres.P,special(pb.data.genres[i].name));
        }
      }
      pb.menu_select(pb.pb_genres,pb.pb_genres.P.firstElementChild);
    }
    
    /* Episode */
    pb.menu_clear(pb.pb_episodes);
    if (pb.data.ep&&pb.data.ep.length){
      pb.menus.push(pb.pb_episodes);
      pb.init_episode(-1, 0);
      pb.pb_episodes.style.display='';
    }
    else{
      pb.pb_episodes.style.display='none';
    }

    /* Init Anime ID - Fav & History */
    var animeid=_API.animeId(pb.data.url);
    if (animeid){
      pb.data.animeid=animeid;
      if (pb.data.animeid){
        list.history_add(pb.data.animeid,pb.listobj(),true);
        if (list.fav_exists(pb.data.animeid)){
          list.fav_add(pb.data.animeid,pb.listobj(),false);
        }
      }
    }

    /* MAL Init */
    if (pb.malidreq){
      if (pb.data.animeid){
        pb.malidanime=pb.data.animeid;
        pb.malidsave=pb.malidreq;
      }
      pb.malidreq=null;
    }

    if (pb.malidsave && (pb.malidanime==pb.data.animeid)){
      pb.need_malist_update=true;
    }
    else{
      if (pb.malidsave){
        console.log("MAL-PLAY #RESET");
      }
      pb.need_malist_update=false;
      pb.malidanime=null;
      pb.malidsave=null;
    }

    /* settings */
    pb.init_settings();
    // console.log(pb.data);

    /* season */
    pb.menu_clear(pb.pb_seasons);
    if (pb.data.seasons&&pb.data.seasons.length){
      pb.menus.push(pb.pb_seasons);
      var act=null;
      for (var i=0;i<pb.data.seasons.length;i++){
        var d=pb.data.seasons[i];
        var action_value=d.url;
        if (__SD3||__SD5){
          action_value='>'+d.url;
        }
        var hl=$n('div',d.active?'playing':'',{action:action_value},pb.pb_seasons.P,'');
        hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
        hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
        if (d.active) act=hl;
      }
      if (act){
        pb.menu_select(pb.pb_seasons,act);
      }
      pb.pb_seasons.style.display='';
    }
    else{
      pb.pb_seasons.style.display='none';
    }

    /* related */
    pb.menu_clear(pb.pb_related);
    if (pb.data.related&&pb.data.related.length){
      pb.menus.push(pb.pb_related);
      for (var i=0;i<pb.data.related.length;i++){
        var d=pb.data.related[i];
        try{
          d.poster=$imgcdn(d.poster);
        }catch(e4){}
        var action_value=d.url;
        if (__SD3||__SD5){
          action_value='>'+d.url;
        }
        var hl=$n('div','',{action:action_value,arg:(d.tip?d.tip:'')+';0'},pb.pb_related.P,'');
        hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
        hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
      }
      pb.menu_select(pb.pb_related,pb.pb_related.P.firstElementChild);
      pb.pb_related.style.display='';
    }
    else{
      pb.pb_related.style.display='none';
    }

    /* recommendations */
    pb.menu_clear(pb.pb_recs);
    if (pb.data.recs&&pb.data.recs.length){
      pb.menus.push(pb.pb_recs);
      for (var i=0;i<pb.data.recs.length;i++){
        var d=pb.data.recs[i];
        try{
          d.poster=$imgcdn(d.poster);
        }catch(e4){}
        var action_value=d.url;
        if (__SD3||__SD5){
          action_value='>'+d.url;
        }
        var hl=$n('div','',{action:action_value,arg:(d.tip?d.tip:'')+';0'},pb.pb_recs.P,'');
        hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
        hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
      }
      pb.menu_select(pb.pb_recs,pb.pb_recs.P.firstElementChild);
      pb.pb_recs.style.display='';
    }
    else{
      pb.pb_recs.style.display='none';
    }

    /* playNext */
    try{
      pb.playnext_last_tick=$tick()+2000;
      _JSAPI.playNextMeta(
        pb.data.title+(pb.ep_num?(" ("+pb.ep_num+")"):''),
        pb.ep_title, 
        pb.data.banner?pb.data.banner:pb.data.poster, 
        pb.url_value.substring(("https://"+__DNS).length),
        pb.tip_value
      );
    }catch(e){}

    pb.init_video();

    /* ACTIONS */
    pb.pb_genres._midx=4;
    // pb.pb_settings._keycb=
    // pb.pb_genres._keycb=
    // pb.pb_episodes._keycb=
    // pb.pb_seasons._keycb=
    // pb.pb_related._keycb=
    // pb.pb_recs._keycb=pb.menu_keycb;

    pb.menu_init(pb.pb_settings);
    pb.menu_init(pb.pb_genres);
    pb.menu_init(pb.pb_episodes);
    pb.menu_init(pb.pb_seasons);
    pb.menu_init(pb.pb_related);
    pb.menu_init(pb.pb_recs);
    

    pb.pb_tracks._keycb=pb.track_keycb;
    pb.menusel=1;
    
    pb.pb_track_title.innerHTML=special(pb.ep_title);
    pb.pb_loading.classList.remove('active');
    requestAnimationFrame(function(){
      pb.menu_show(1);
      _API.setKey(pb.keycb);
    });
  },

  malidreq:null,
  malidsave:null,
  malidanime:null,
  load_open_stat:0,

  open:function(uri, ttid, noclean, startpos, malid){
    console.log("ATVLOG pb.open -> "+noclean+" / "+ttid+" / "+startpos+" -> "+uri);
    pb.pb_action_streamtype.classList.remove('active');
    pb.load_open_stat=0;
    _API.setStreamServer(pb.cfg_data.mirrorserver?1:0,0);
    pb.malidreq=malid?(malid+''):null;

    if (noclean){
      pb.pb_meta.classList.add('active');
    }
    else{
      pb.pb.style.backgroundImage='';
      pb.pb_meta.classList.remove('active');
    }

    /* Init Preloaded Data */
    if (pb.preload_episode!=null){
      try{
        if (pb.preload_episode.u==uri){
          pb.menu_clear(pb.pb_settings);
          pb.url_value=uri;
          pb.startpos_val=0;

          pb.reset(0,noclean);

          console.log("Preload Opened ="+uri);

          pb.data=pb.preload_episode.d;
          pb.preload_episode=null;

          _API.setUri(uri);
          
          pb.init();
          return;
        }
      }catch(e){
        console.log("Open Preload Error -> "+e);
      }
    }

    pb.preload_episode=null;
    var uid=_API.getView(uri,function(d,u){
      pb.load_open_stat=1;
      if (uid==u && d.status){
        // console.log("GETVIEW: "+JSON.stringify(d,null,'\t'));
        pb.data=d;
        _API.setUri(uri);
        pb.init();
      }
      else if (uid==u){
        if (!noclean){
          pb.reset(1);
        }
        _API.showToast("Playing episode failed. Please try again...");
      }
    });
    if (uid){
      pb.menu_clear(pb.pb_settings);
      pb.tip_value=ttid?ttid:'';
      pb.url_value=uri;
      pb.startpos_val=(startpos!==undefined)?(startpos?parseInt(startpos):0):0;
      console.log("ATVLOG OPENPB => POS="+pb.startpos_val);
      if (!noclean && (!__SD3) &&(!__SD5)){
        _API.getTooltip(ttid,pb.open_ttip, uri);
      }
      pb.reset(0,((__SD3||__SD5))?2:noclean);
      _API.setKey(function(ke){
        if (ke==KBACK){
          uid=-1;
          pb.load_open_stat=3;
          pb.reset(1,0);
          // _JSAPI.appQuit();
        }
      });
    }
    return uid;
  },
  open_ttip:function(d){
    if (d){
      if (!pb.tip_value){
        pb.tip_value=d.ttid;
      }
      if (pb.load_open_stat==0){
        pb.pb_title.innerHTML=tspecial(d.title);
        pb.pb_title.setAttribute('jp',d.title_jp?d.title_jp:d.title)
        pb.pb_meta.classList.add('active');
        var addb='';
        try{
          var bb='';
          if (d.quality){
            bb+='<span>'+special(d.quality)+'</span>';
          }
          if (d.rating){
            bb+='<span>'+special(d.rating)+'</span>';
          }
          if(bb){
            addb='<b>'+bb+'</b>';
          }
        }catch(e){}
        pb.pb_desc.innerHTML=addb+special(d.synopsis);
        try{
          pb.menu_clear(pb.pb_genres);
          for (var i=0;i<d.genres.length;i++){
            $n('div','',0,pb.pb_genres.P,special(d.genres[i].name));
          }
        }catch(e){}
        if (d.banner){
          pb.pb.style.backgroundImage='url('+(d.banner)+')';
        }
        else if (d.poster){
          pb.pb.style.backgroundImage='url('+(d.poster)+')';
        }
      }
    }
  }
};

const home={
  home_onload:false,
  home:$('home'),
  home_scroll_mask:$('home_scroll_mask'),
  home_scroll:$('home_scroll'),
  home_slide:$('home_slide'),
  home_recent:$('home_recent'),
  home_mal:$('home_mal'),
  home_anilist:$('home_anilist'),
  home_dub:$('home_dub'),
  home_trending:$('home_trending'),
  home_random:$('home_random'),
  home_chinese:$('home_chinese'),

  home_history:$('home_history'),
  home_fav:$('home_fav'),

  home_header:$('home_header'),
  home_search:$('home_search'),
  home_settings:$('home_settings'),
  bgimg:null,

  hi_tipurl:function(u){
    var ur=(u+'').split('#');
    ur=ur[0].split('?');
    return ur[0];
  },
  hi_animeid:function(u){
    var ur=home.hi_tipurl(u+'').split('-');
    return ur[ur.length-1];
  },
  hi_parse:function(v){
    var hd=$n('d','','',null,v);
    var rd=[];
    var it=hd.querySelectorAll('section div.film_list-wrap div.flw-item');
    for (var i=0;i<it.length;i++){
      var t=it[i];
      var ttl='';
      try{
        var d={};
        var at=t.querySelector('.film-name a');
        d.url=at.getAttribute('href');
        // qtip = /ajax/movie/qtip/100
        
        ttl=d.title=at.getAttribute('title');
        try{
          d.title_jp=at.getAttribute('data-jname');
        }catch(ee){}

        d.tip=home.hi_tipurl(d.url);

        d.poster=t.querySelector('img').getAttribute('data-src');
        if (!d.poster){
          console.log("Not Found Image: "+d.title);
        }

        // Episode
        var epl=t.querySelector('.tick-sub');
        var epld=t.querySelector('.tick-dub');
        if (!epl){
          epl=epld;
        }
        if (epl){
          d.epavail=d.ep=epl.textContent.trim()
        }
        if (epld){
          d.epdub=epld.textContent.trim()
        }

        // Rate
        d.adult=false;
        if (t.querySelector('.tick.tick-rate')){
          d.adult=true;
        }

        d.type=t.querySelector('.fd-infor .fdi-item')?.textContent;
        d.duration=t.querySelector('.fd-infor .fdi-item.fdi-duration')?.textContent+'IN';

        rd.push(d);
      }catch(e){
        console.log(ttl+' -> '+e);
      }
    }
    hd.innerHTML='';
    return rd;
  },

  flix_parse:function(v){
    var rd=[];
    try{
      var t=JSON.parse(v);
      // asr.sort(function(a,b){
      //   return b.airingTime-a.airingTime
      // })
      if ('trending' in t){
        t=t.trending;
      }
      else{
        /* Schedule */
        if (t.length==7){
          if (t[0].animes && t[0].title){
            var scd=t;
            t=[];
            for (var i=0;i<scd.length;i++){
                for (var j=0;j<scd[i].animes.length;j++){
                    t.push(scd[i].animes[j]);
                }
            }
            t.sort(function(a,b){
              var aa=(a.nextAiringEpisode)?a.nextAiringEpisode.airingAt:0;
              var bb=(b.nextAiringEpisode)?b.nextAiringEpisode.airingAt:0;
              return bb-aa;
            });
            console.log(["SORTED: ",t]);
          }
        }
      }

      var l=t.length;
      for (var i=0;i<l;i++){
        try{
          var d={};
          var u=t[i];
          __AFLIX.setCache(u);
          d.url=__AFLIX.setUrl(u.slug,u.anilistID);
          d.title=__AFLIX.getTitle(u);
          d.title_jp=__AFLIX.getTitle(u,1);
          d.tip=u.anilistID;
          d.malid=u.malID;
          d.poster=u.images.medium;
          d.epavail=d.ep=u.episodeNum;
          if (u.nextAiringEpisode){
            if (u.nextAiringEpisode.episode && u.nextAiringEpisode.episode>1){
              d.ep=d.epavail=u.nextAiringEpisode.episode-1;
            }
          }
          d.type=u.type;
          if (u.duration){
            d.duration=u.duration+'MIN';
          }
          if (u.status!='NOT_YET_RELEASED'){
            rd.push(d);
          }
        }catch(e2){}
      }
    }catch(e){
      console.log("ERR: "+e);
    }
    return rd;
  },

  recent_parse:function(g,v){
    var rd=[];

    if (__SD3){
      // Hi Anime
      rd=home.hi_parse(v);
    }
    else if (__SD5){
      // Hi Anime
      rd=home.flix_parse(v);
    }
    else if (__SD==1){
      // wave
      var hd=$n('d','','',null,v);
      var it=hd.querySelectorAll('div.item');
      for (var i=0;i<it.length;i++){
        var t=it[i];
        try{
          var d={};
          var at=t.querySelector('a.d-title');
          d.url=at.href;
          d.poster=t.querySelector('img').src;
          d.title=at.textContent.trim();
          try{
            d.title_jp=at.getAttribute('data-jp');
          }catch(ee){}
          d.type=t.querySelector('div.right').textContent;
          
          try{
            d.epdub=t.querySelector('span.ep-status.dub').textContent.trim();
          }catch(ee){}
          try{
            d.ep=t.querySelector('span.ep-status').textContent.trim();
          }catch(ee){}
          d.tip=t.firstElementChild.getAttribute('data-tip');
          d.adult=t.querySelector('div.adult')?true:false;
          rd.push(d);
        }catch(e){
          // console.log(e);
        }
      }
      hd.innerHTML='';
    }
    else{
      // anix
      var hd=$n('d','','',null,v);
      var it=hd.querySelectorAll('div.piece div.inner');
      for (var i=0;i<it.length;i++){
        var t=it[i];
        try{
          var d={};
          var at=t.querySelector('a.poster');
          d.url=at.href;
          d.tip=at.getAttribute('data-tip');
          d.poster=t.querySelector('a.poster img').src;
          at=t.querySelector('div.ani-name a');
          d.title=at.textContent.trim();
          try{
            d.title_jp=at.getAttribute('data-jp');
          }catch(ee){}

          try{
            d.epdub=t.querySelector('div.sub-dub-total span.dub').textContent.trim();
          }catch(e2){}

          d.type=t.querySelector('div.abs-info span.type').textContent.trim();
          try{
            d.ep=t.querySelector('div.sub-dub-total span.sub').textContent.trim();
          }catch(e){
            d.ep=d.epdub;
          }

          try{
            d.adult=false;
            var anir=t.querySelector('div.abs-info div.ani-rating');
            if (anir){
              if (anir.textContent.trim()=='18+'){
                d.adult=true;
              }
            }
          }catch(e3){}

          d.duration=t.querySelector('div.abs-info span.time').textContent.trim();
          rd.push(d);
        }catch(e){
          // console.log(e);
        }
      }
      hd.innerHTML='';
    }
    
    if (rd&&rd.length){
      for (var i=0;i<rd.length;i++){
        var d=rd[i];
        if (g==home.home_dub && !__SD5){
          if (d.epdub){
            d.ep=d.epdub;
          }
        }
        var argv={
          url:d.url,
          img:d.poster,
          ttip:d.tip,
          sp:0,
          tp:0,
          ep:d.ep,
          title:d.title
        };
        var hl=$n('div','',{action:"$"+JSON.stringify(argv),arg:"ep"},g.P,'');
        // var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},g.P,'');
        hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
        hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
        var infotxt='';
        if (d.adult){
          infotxt+='<span class="info_adult">18+</span>';
        }
        if (d.duration){
          infotxt+='<span class="info_duration">'+special((d.duration+"").toUpperCase())+'</span>';
        }
        if (d.type){
          infotxt+='<span class="info_type">'+special(d.type)+'</span>';
        }
        if (d.ep){
          infotxt+='<span class="info_ep">'+special(d.ep)+'</span>';
        }
        if (infotxt){
          hl._ep=$n('span','info',null,hl,infotxt);
        }
      }
      var PGSZ=(__SD3||__SD5)?60:30;
      while (g.P.childElementCount>PGSZ){
        g._spre.push(g.P.firstElementChild.nextElementSibling);
        g.P.removeChild(g.P.firstElementChild.nextElementSibling);
      }
      g.__update_pre();

      if (!g._sel)
        pb.menu_select(g,g.P.firstElementChild);
      else
        pb.menu_select(g,g._sel);
    }
  },
  recent_load:function(g){
    g._onload=1;
    var load_page=g._page;
    if (__SD5){
      load_page--;
      if (g._ajaxurl.indexOf('schedule')>0){
        if (load_page>0){
          return;
        }
        load_page='';
      }
    }
    // console.log('RECENT LOAD = '+g._ajaxurl+''+load_page);
    $a(g._ajaxurl+''+load_page,function(r){
      if (r.ok){
        try{
          if (__SD3||__SD5){
            home.recent_parse(g,r.responseText);
          }
          else{
            var v=JSON.parse(r.responseText);
            home.recent_parse(g,v.result);
          }
        }catch(e){}
        g._onload=0;
      }
      else
        setTimeout(function(){home.recent_load(g)},2000);
    },__SD5?__AFLIX.origin:null);
  },
  recent_init:function(rc, loader){
    rc._page=1;
    pb.menu_clear(rc);
    rc._nojump=true;
    // rc._keycb=pb.menu_keycb;
    pb.menu_init(rc);

    rc._spre=[];
    rc._spost=[];
    rc.__update_pre=function(){
      rc.P.firstElementChild.style.marginRight=(12*rc._spre.length)+"vw";
    };
    rc.__selectcb=function(g,c){
      if (!c) return;
      var PGSZ=7;
      var k=c;
      var n=0;
      while(k){
        k=k.previousElementSibling;
        if (++n>PGSZ) break;
      }
      if (n<=PGSZ-1){
        if (g._spre.length>0){
          g.P.insertBefore(g._spre.pop(), g.P.firstElementChild.nextElementSibling);
          g._spost.push(g.P.lastElementChild);
          g.P.removeChild(g.P.lastElementChild);
          g.__update_pre();
          pb.menu_select(g,g._sel);
        }
        return;
      }
      if (g._onload!=0) return;
      n=0;
      while(c){
        c=c.nextElementSibling;
        if (++n>4) return;
      }
      if (g._spost.length>0){
        g.P.appendChild(g._spost.pop());
        g._spre.push(g.P.firstElementChild.nextElementSibling);
        g.P.removeChild(g.P.firstElementChild.nextElementSibling);
        g.__update_pre();
        pb.menu_select(g,g._sel);
        return;
      }
      if (g._page>60) return;
      g._page++;
      if (loader){
        loader(rc);
      }
      else{
        home.recent_load(rc);
      }
    };
    if (loader){
      loader(rc);
    }
    else{
      home.recent_load(rc);
    }
  },

  ttip_desc:function(hl,ttip,url,ddat){
    _API.getTooltip(ttip,function(d){
      if (d){
        hl._desc.innerHTML=special(d.synopsis);
      }
    }, url);
    // $a(url,function(r){
    //   if (r.ok){
    //     try{
    //       var d=$n('div','',0,0,r.responseText);
    //       var w={
    //         banner:null,
    //         synopsis:''
    //       };
    //       if (__SD==1){
    //         try{
    //           w.banner=d.querySelector('#player').style.backgroundImage.slice(4, -1).replace(/["']/g, "");
    //         }catch(e){}
    //         try{
    //           w.synopsis=d.querySelector('#w-info .info .synopsis .content').textContent.trim();
    //         }catch(e){}
    //       }
    //       else if (__SD==2){
    //           w.banner=d.querySelector('#ani-player-section div.player-bg').style.backgroundImage.slice(4, -1).replace(/["']/g, "");
    //           w.synopsis=d.querySelector('#ani-detail-info .description .short div').textContent.trim();
    //       }
    //       if (w.banner){
    //         hl._img.src=$img(w.banner);
    //       }
    //       else{
    //         hl._img.src=$img(ddat.poster);
    //       }
    //       hl._desc.innerHTML=special(w.synopsis);
    //       d.innerHTML='';
    //       return;
    //     }catch(e){
    //       console.log('ttip err '+e);
    //     }
    //   }
    //   hl._img.src=$img(ddat.poster);
    //   hl._desc.innerHTML="...";
    // });
  },

  home_parser:function(v){
    var h=$n('div','','',null,v);
    var td=[];
    try{
      home.home_slide._midx=2.5;
      if (__SD3){
        // hianime
        var tops=h.querySelectorAll('#slider .swiper-wrapper .swiper-slide');
        for (var i=0;i<tops.length;i++){
          var t=tops[i];
          var d={};
          var tt=t.querySelector('.deslide-item-content .desi-head-title');
          d.title=tt.textContent.trim();
          d.title_jp=tt.getAttribute('data-jname');
          d.url=t.querySelector('.deslide-item-content .desi-buttons .btn-secondary').getAttribute('href');
          d.synopsis=t.querySelector('.deslide-item-content .desi-description').textContent.trim();
          d.tip=home.hi_tipurl(d.url);
          d.poster=t.querySelector('.deslide-cover img').getAttribute('data-src');
          try{
            var epel=t.querySelector('.deslide-item-content .sc-detail .tick-item.tick-sub');
            if (!epel)
              t.querySelector('.deslide-item-content .sc-detail .tick-item.tick-eps');
            d.ep=(epel.textContent+'').trim();
          }catch(e){
          }
          try{
            d.type=(t.querySelector('.deslide-item-content .sc-detail .fa-play-circle').parentElement.textContent+'').trim();
          }catch(e){
          }
          try{
            d.duration=(t.querySelector('.deslide-item-content .sc-detail .fa-clock').parentElement.textContent+'').trim()+"IN";
          }catch(e){
          }
          td.push(d);
        }
      }
      else if (__SD5){
        try{
          var t=JSON.parse(v);
          var l=t.length;
          for (var i=0;i<l;i++){
            try{
              var d={};
              var u=t[i];
              __AFLIX.setCache(u);
              d.url=__AFLIX.setUrl(u.slug,u.anilistID);
              d.title=__AFLIX.getTitle(u);
              d.title_jp=__AFLIX.getTitle(u,1);
              d.tip=u.anilistID;
              d.synopsis=stripHtml(u.description);
              d.poster=u.images.medium;
              if (u.bannerart){
                if (u.bannerart.medium){
                  d.poster=u.bannerart.medium;
                }
                else if (u.bannerart.large){
                  d.poster=u.bannerart.large;
                }
              }
              else if(u.bannerImage){
                d.poster=u.bannerImage;
              }
              d.epavail=d.ep=u.episodeNum;
              if (u.nextAiringEpisode){
                if (u.nextAiringEpisode.episode && u.nextAiringEpisode.episode>1){
                  d.ep=d.epavail=u.nextAiringEpisode.episode-1;
                }
              }
              d.type=u.type;
              if (u.duration){
                d.duration=u.duration+'MIN';
              }
              if (u.status!='NOT_YET_RELEASED'){
                td.push(d);
              }
            }catch(e2){
              console.log("ERR2-SD5-HOMEPARSE: "+e);
            }
          }
        }catch(e){
          console.log("ERR2-SD1-HOMEPARSE: "+e);
        }
      }
      else if (__SD==1){
        // wave
        var tops=h.querySelector('section#top-anime').querySelector('div.tab-content[data-name=day]').querySelectorAll('a.item');
        for (var i=0;i<tops.length;i++){
          var t=tops[i];
          var d={};
          var tt=t.querySelector('div.d-title');
          d.title=tt.textContent.trim();
          d.title_jp=tt.getAttribute('data-jp');
          d.url=t.href;
          d.tip=t.querySelector('div.poster').getAttribute('data-tip');
          d.poster=t.querySelector('img').src;
          d.adult=t.querySelector('div.adult')?true:false;
          try{
            d.ep=(t.querySelector('span.ep-status.sub').textContent+'').trim()
          }catch(e){
          }
          try{
            d.type=(t.querySelector('div.info .meta span.dot:not(.ep-wrap)').textContent+'').trim();
          }catch(e){
          }
          td.push(d);
        }
      }
      else{
        // anix
        var tops=h.querySelectorAll('main aside.sidebar div.tab-content[data-name=day]>a.piece');
        for (var i=0;i<tops.length;i++){
          var t=tops[i];
          var d={};
          d.url=t.href;
          d.tip=t.querySelector('div[data-tip]').getAttribute('data-tip');

          var tt=t.querySelector('div.ani-detail div.ani-name');
          d.title=tt.textContent.trim();
          d.title_jp=tt.getAttribute('data-jp');
          d.poster=t.querySelector('.poster img').src;
          d.adult=t.querySelector('div.adult')?true:false;
          try{
            d.ep=t.querySelector('div.ani-detail div.sub-dub-total span.sub').textContent.trim();
          }catch(e){
          }
          try{
            d.type=t.querySelector('div.ani-detail div span.text-muted').textContent.trim();
          }catch(e){
          }
          td.push(d);
        }
      }
    }catch(e){}
    h.innerHTML='';

    if (td.length>0){
      for (var i=0;i<td.length;i++){
        try{
        var d=td[i];
        
        if (!__SD3&&!__SD5){
          d.poster=$imgcdn(d.poster);
        }

        var argv={
          url:d.url,
          img:d.poster,
          ttip:d.tip,
          sp:0,
          tp:0,
          ep:toInt(d.ep?d.ep:0),
          title:d.title
        };

        var hl=$n('div',(__SD3||__SD5)?'fullimg':'',{action:"$"+JSON.stringify(argv),arg:"ep"},home.home_slide.P,'');
        hl._img=$n('img','',{loading:'lazy' ,src:$img(d.poster)},hl,'');
        hl._img.onload=function(){
          this.classList.add('loaded');
        };
        hl._viewbox=$n('span','infobox',null,hl,'');
        hl._view=$n('span','infovalue',null,hl._viewbox,'');
        hl._title=$n('h4','',{jp:d.title_jp?d.title_jp:d.title},hl._view,tspecial(d.title));

        if (__SD3||__SD5){
          hl._desc=$n('span','desc',null,hl._view,special(d.synopsis));
        }
        else{
          hl._desc=$n('span','desc',null,hl._view,'');
          home.ttip_desc(hl, d.tip, d.url, d);
        }
        
        var infotxt='';
        if (d.adult){
          infotxt+='<span class="info_adult">18+</span>';
        }
        if (d.duration){
          infotxt+='<span class="info_duration">'+special((d.duration+"").toUpperCase())+'</span>';
        }
        if (d.type){
          infotxt+='<span class="info_type">'+special(d.type)+'</span>';
        }
        if (d.ep){
          infotxt+='<span class="info_ep">'+special(d.ep)+'</span>';
        }
        if (infotxt){
          hl._ep=$n('span','info',null,hl,infotxt);
        }
        }catch(ee){}
      }
      pb.menu_select(home.home_slide,home.home_slide.P.firstElementChild);
    }
  },

  home_load:function(){
    home.home_onload=1;
    $a(__SD5?('/__proxy/'+__AFLIX.ns+'/airing'):'/home',function(r){
      if (r.ok){
        try{
          home.home_parser(r.responseText);
        }catch(e){}
        home.home_onload=0;
      }
      else
        setTimeout(home.home_load,2000);
    },__SD5?__AFLIX.origin:null);
  },
  
  menus:[],
  menu_sel:0,
  list_init_name:function(o, h){
    pb.menu_clear(h);
    if (o.list.length>0){
      for (var i=0;i<o.list.length;i++){
        var id=o.list[o.list.length-(i+1)];
        var d=o.detail[id];
        if (d){
          var addarg='';
          var vplay=null;
          var arg={
            url:d.url,
            img:d.poster,
            ttip:d.tip,
            sp:0,
            tp:0,
            ep:0,
            title:d.title
          };
          if (d.play&&(d.play.length==2)){
            vplay=d.play;
            addarg=';'+d.play[0];
            arg.sp=toInt(d.play[0]);
            arg.tp=toInt(d.play[1]);
          }
          var infotxt='';
          if (d.type){
            infotxt+='<span class="info_type">'+special(d.type)+'</span>';
          }
          if (d.ep){
            infotxt+='<span class="info_ep">'+special(d.ep)+'</span>';
            arg.ep=toInt(d.ep);
          }
          // var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'+addarg},h.P,'');
          var hl=$n('div','',{action:"$"+JSON.stringify(arg),arg:""},h.P,'');
          hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
          hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
          
          if (infotxt){
            hl._ep=$n('span','info',null,hl,infotxt);
          }
          if (vplay){
            if (vplay[1]>0){
              var pct=(parseFloat(vplay[0])/parseFloat(vplay[1]))*100.0;
              hl._prog=$n('i','progress',null,hl,'<em style="width:'+pct+'%"></em>');
            }
          }
        }
      }
      pb.menu_select(h,h.P.firstElementChild);
    }
    // h._keycb=pb.menu_keycb;
    pb.menu_init(h);
  },
  list_init:function(){
    // console.log(home);
    // console.log(home.home_history);
    home.list_init_name(list.fav,home.home_fav);
    home.list_init_name(list.history,home.home_history);
  },
  init:function(){
    pb.cfg_load();
    _API.setUri("/home");
    list.load();

    if (__SD3){
      // hianime
      home.home_recent._ajaxurl='/recently-updated?page=';
      home.home_dub._ajaxurl='/dubbed-anime?page=';
      home.home_trending._ajaxurl='/top-airing?page=';
      home.home_random._ajaxurl='/movie?page=';

      home.home_trending.setAttribute('list-title','🏆 Top Airing');
      home.home_random.setAttribute('list-title','🎥 Movie');
    }
    else if (__SD5){
      // hianime
      home.home_recent._ajaxurl='/__proxy/'+__AFLIX.ns+'/schedule';
      home.home_dub._ajaxurl='/__proxy/'+__AFLIX.ns+'/popular?page=';
      home.home_trending._ajaxurl='/__proxy/'+__AFLIX.ns+'/trending?page=';
      home.home_random._ajaxurl='/__proxy/'+__AFLIX.ns+'/movies?page=';
      
      home.home_slide.setAttribute('list-title','🛰️ Airing');
      home.home_trending.setAttribute('list-title','⭐ Trending');
      home.home_dub.setAttribute('list-title','❤️ Popular');
      home.home_random.setAttribute('list-title','🎥 Movie');
    }
    else{
      // wave & anix
      home.home_recent._ajaxurl='/ajax/home/widget/updated-sub?page=';
      home.home_dub._ajaxurl='/ajax/home/widget/updated-dub?page=';
      home.home_trending._ajaxurl='/ajax/home/widget/trending?page=';
      home.home_random._ajaxurl='/ajax/home/widget/random?page=';
    }
    home.recent_init(home.home_recent);
    home.recent_init(home.home_dub);
    home.recent_init(home.home_trending);
    home.recent_init(home.home_random);

    home.home_load();

    _API.setKey(home.keycb);

    home.menus=[
      home.home_header,
      home.home_slide,
      home.home_recent
    ];

    if (_MAL.islogin()){
      home.home_mal.className='home_list pb_menu';
      home.home_mal.style.display=''; 
      home.recent_init(home.home_mal, _MAL.home_loader);
      home.menus.push(home.home_mal);
      home.home_mal.setAttribute("list-title","🟦 MAL "+special(_MAL.auth.user));
    }

    if (_MAL.islogin(true)){
      home.home_anilist.className='home_list pb_menu';
      home.home_anilist.style.display=''; 
      home.recent_init(home.home_anilist, _MAL.alhome_loader);
      home.menus.push(home.home_anilist);
      home.home_anilist.setAttribute("list-title","🅰️ AniList "+special(_MAL.alauth.user));
    }

    

    home.menus.push(home.home_dub);
    home.menus.push(home.home_trending);
    home.menus.push(home.home_random);

    if (pb.cfg_data.nonjapan && (!__SD3) && (!__SD5)){
      home.home_chinese.className='home_list pb_menu';
      home.home_chinese.style.display='';
      home.home_chinese._ajaxurl='/ajax/home/widget/updated-china?page=';
      home.recent_init(home.home_chinese);
      home.menus.push(home.home_chinese);
    }
    else{
      home.home_chinese.style.display='none !important';
      home.home_chinese.innerHTML='';
      home.home_chinese.className='';
    }

    home.menus.push(home.home_fav);
    home.menus.push(home.home_history);

    home.list_init();

    pb.menu_clear(home.home_slide);

    home.home_slide._itemwidth=function(){
      return (window.innerWidth * 0.3);
    };
    pb.menu_init(home.home_slide);
    home.menus[home.menu_sel].classList.add('active');

    home.home_header._keycb=home.header_keycb;
    home.home_search.classList.add('active');

    home.init_discord_message();
  },
  init_discord_message:function(){
    // Discord Info & Announchments
    var iv=$('home_discord_info_value');
    iv.innerHTML='';
    iv._msg=[];
    iv._msg_pos=-1;
    function start_discord_message(){
      if (iv._msg_pos>=0){
        iv._msg[iv._msg_pos].className='';
      }
      if (++iv._msg_pos>=iv._msg.length){
        iv._msg_pos=0;
      }
      iv._msg[iv._msg_pos].className='active';
    }
    _API.discordFetch(function(r){  
      if (r.ok){
        try{
          var j=JSON.parse(r.responseText);
          for (var i=0;i<j.length;i++){
            var m=j[i];
            if (m.content){
              var g=document.createElement('div');
              g.innerHTML=
                '<span><c>info</c> '+((new Date(m.timestamp)).toLocaleString())+'</span>'+
                '<p>'+md2html(m.content)+'</p>';
              iv._msg.push(g);
              iv.appendChild(g);
            }
          }
          start_discord_message();
          setInterval(start_discord_message,10000);
        }catch(e){
          console.log("ERROR "+e);
          iv.innerHTML='';
        }
      }
    });
  },

  settings:{
    sel:0,
    subsel:0,
    needreload:false,
    settings:$('settings'),
    sscroll:$('settings_scroll'),
    more:$('settings_more'),
    integration:$('settings_integration'),
    networks:$('settings_networks'),
    video:$('settings_video'),
    slang:$('settings_lang'),
    styling:$('settings_style'),
    performance:$('settings_performance'),
    about:$('settings_about'),
    tools:{},
    isplayback:0,
    menus:[],
    initmore_done:false,
    initmore:function(){
      if (!home.settings.initmore_done){
        pb.menu_clear(home.settings.slang);
        pb.menu_clear(home.settings.video);
        pb.menu_clear(home.settings.styling);
        pb.menu_clear(home.settings.performance);
        pb.menu_clear(home.settings.more);
        pb.menu_clear(home.settings.networks);
        pb.menu_clear(home.settings.integration);
        pb.menu_clear(home.settings.about);

        home.settings.tools={};

        home.settings.tools._s_lang=$n(
          'div','',{
            action:'*lang',
            s_desc:"Select language priority for video subtitle and audio"
          },
          home.settings.slang.P,
          '<c>closed_caption</c> Subtitle<span class="value"></span>'
        );
        home.settings.tools._s_dubaudio=$n(
          'div','',{
            action:'*dubaudio',
            s_desc:"Always use DUB audio stream with subtitle if available. Only work with source 3 and 4"
          },
          home.settings.slang.P,
          '<c class="check">check</c><c>speech_to_text</c> Use DUB Stream'
        );

        /* Video */
        home.settings.tools._s_autonext=$n(
          'div','',{
            action:'*autonext'
          },
          home.settings.video.P,
          '<c class="check">check</c><c>step_over</c> Auto Next'
        );
        home.settings.tools._s_autoskip=$n(
          'div','',{
            action:'*autoskip'
          },
          home.settings.video.P,
          '<c class="check">clear</c><c>footprint</c> Auto Skip Intro'
        );
        home.settings.tools._s_skipfiller=$n(
          'div','',{
            action:'*skipfiller'
          },
          home.settings.video.P,
          '<c class="check">clear</c><c>move_selection_left</c> Skip Filler'
        );
        
        home.settings.tools._s_scale=$n(
          'div','',{
            action:'*scale'
          },
          home.settings.video.P,
          '<c>aspect_ratio</c> Video Scaling<span class="value">-</span>'
        );

        home.settings.tools._s_preloadep=$n(
          'div','',{
            action:'*preloadep',
            s_desc:'Prepare episode data before video finished for faster next episode load'
          },
          home.settings.video.P,
          '<c class="check">clear</c><c>cloud_download</c> Preload Next Episode'
        );
        


        /* Style */
        home.settings.tools._s_ccstyle=$n(
          'div','',{
            action:'*ccstyle'
          },
          home.settings.styling.P,
          '<c>brand_family</c> Subtitle Style <span class="value">Style 1</span>'
        );

        home.settings.tools._s_uifontsize=$n(
          'div','',{
            action:'*uifontsize'
          },
          home.settings.styling.P,
          '<c>format_size</c> Font Size<span class="value">Normal</span>'
        );

        home.settings.tools._s_theme=$n(
          'div','',{
            action:'*theme'
          },
          home.settings.styling.P,
          '<c>palette</c> Interface Color <span class="value">-</span>'
        );
        
        home.settings.tools._s_bgimg=$n(
          'div','',{
            action:'*bgimg'
          },
          home.settings.styling.P,
          '<c>wallpaper</c> Wallpaper<span class="value">Wallpaper-1</span>'
        );

        home.settings.tools._s_compactlist=$n(
          'div','',{
            action:'*compactlist',
            s_desc:"Use old compact anime list"
          },
          home.settings.styling.P,
          '<c class="check">clear</c><c>unfold_less</c> Compact List'
        );


        
        /* Performance */
        home.settings.tools._s_animation=$n(
          'div','',{
            action:'*animation'
          },
          home.settings.performance.P,
          '<c>animation</c> Transition Animation<span class="value">Normal</span>'
        );
        home.settings.tools._s_performance=$n(
          'div','',{
            action:'*performance',
            s_desc:"Disable some styling for better performance gain"
          },
          home.settings.performance.P,
          '<c class="check">clear</c><c>readiness_score</c> Performance UI'
        );


        /* Others */
        home.settings.tools._s_nonjapan=$n(
          'div','',{
            action:'*nonjapan',
            s_desc:"Also show and search chinese anime"
          },
          home.settings.more.P,
          '<c class="check">clear</c><c>emoji_nature</c> Chinese Anime'
        );
        home.settings.tools._s_jptitle=$n(
          'div','',{
            action:'*jptitle',
            s_desc:"Show anime titles in japanese name"
          },
          home.settings.more.P,
          '<c class="check">clear</c><c>language_japanese_kana</c> Japanese Titles'
        );
        home.settings.tools._s_html5player=$n(
          'div','',{
            action:'*html5player',
            s_desc:"Enable if you have a problem with stuttering playback, some features may disabled"
          },
          home.settings.more.P,
          '<c class="check">check</c><c>live_tv</c> Use HTML5 Video Player'
        );


        /* Networks */
        home.settings.tools._s_sourcesvr=$n(
          'div','',{
            action:'*sourcesvr',
            s_desc:"Select source website server, Try change it if source is down."
          },
          home.settings.networks.P,
          '<c>database</c> Source Server<span class="value">Source '+__SD+"</span>"
        );
        home.settings.tools._s_progcache=$n(
          'div','',{
            action:'*progcache',
            s_desc:"Cache content progressively for better performance. Turn off if image or playback not working"
          },
          home.settings.networks.P,
          '<c class="check">clear</c><c>fact_check</c> Progressive Cache'
        );
        home.settings.tools._s_usedoh=$n(
          'div','',{
            action:'*usedoh',
            s_desc:"Use dns over https for securely resolving domain name. Enable if your ISP blocked source domain (Only works with OkHttp)"
          },
          home.settings.networks.P,
          '<c class="check">clear</c><c>encrypted</c> Use DoH'
        );
        home.settings.tools._s_httpclient=$n(
          'div','',{
            action:'*httpclient',
            s_desc:"Select HTTP Client that works for your connection"
          },
          home.settings.networks.P,
          '<c>public</c> HTTP Client<span class="value"></span>'
        );

        /* Integrations */
        home.settings.tools._s_malaccount=$n(
          'div','',{
            action:'*malaccount',
            s_desc:
            _MAL.islogin()?"Disconnect MyAnimeList account":
            "Connect to MyAnimeList account"
          },
          home.settings.integration.P,
          _MAL.islogin()?
          '<c>lock_open</c> MAL Logout<span class="value">'+special(_MAL.auth.user)+'</span>':
          '<c>list_alt</c> MAL Login'
        );

        home.settings.tools._s_anilistaccount=$n(
          'div','',{
            action:'*anilistaccount',
            s_desc:
            _MAL.islogin(1)?"Disconnect AniList account":
            "Connect to AniList account"
          },
          home.settings.integration.P,
          _MAL.islogin(1)?
          '<c>lock_open</c> AniList Logout<span class="value">'+special(_MAL.alauth.user)+'</span>':
          '<c>hub</c> AniList Login'
        );

        home.settings.tools._s_listprog=$n(
          'div','',{
            action:'*listprog',
            s_desc:"Set on what state it should update MAL/AniList watch progress"
          },
          home.settings.integration.P,
          '<c>cloud_sync</c> Update watch progress<span class="value"></span>'
        );
        

        /* About */
        home.settings.tools._s_donation=$n(
          'div','',{
            action:'*donate'
          },
          home.settings.about.P,
          "<c>volunteer_activism</c> Donation"
        );
        home.settings.tools._s_discord=$n(
          'div','',{
            action:'*discord'
          },
          home.settings.about.P,
          "<c>sports_esports</c> Discord Server"
        );
        home.settings.tools._s_checkupdate=$n(
          'div','',{
            action:'*checkupdate'
          },
          home.settings.about.P,
          "<c>update</c> Check for Update"
        );
      }
      home.settings.initmore_done=true;
      pb.cfg_update_el();
    },
    lang_action:function(){
      var selid=_API.tlangs_id(pb.cfg_data.lang,1);
      var chval=_API.listPrompt(
        "Subtitle",
        _API.lang_titles,
        selid
      );
      if (chval!=null){
        var prevstype=_API.currentStreamType;

        var sel=toInt(chval);
        var nlg=_API.tlangs[sel][1];
        console.log("Change Language = "+nlg);
        pb.cfg_data.lang=nlg;
        pb.cfg_save();
        pb.cfg_update_el('lang');

        var nst=_API.streamTypeById(nlg);
        if (nst!=prevstype){
          _API.setStreamTypeValue(-1,home.settings.isplayback?1:0);
          if (home.settings.isplayback){
            pb.startpos_val=pb.vid_stat.pos;
            pb.init_video();
          }
        }
        if (nst==1 && prevstype==1){
          /* Reinit subtitle */
          try{
            vtt.init(pb.subtitles);
          }catch(e){}
        }
      }
    },
    open:function(arg){
      home.settings.isplayback=arg;
      home.settings.needreload=false;
      home.settings.sel=0;
      home.settings.subsel=0;
      home.settings.menus=[
        home.settings.slang,
        home.settings.video,
        home.settings.styling,
        home.settings.performance,
        home.settings.more,
        home.settings.networks,
        home.settings.integration,
        home.settings.about
      ];
      for (var i=0;i<home.settings.menus.length;i++){
        home.settings.menus[i].classList.remove('active');
      }
      home.onsettings=true;
      home.settings.initmore();
      home.settings.update(0,0);
      pb.pb.classList.add('onsettings');
      requestAnimationFrame(function(){
        home.settings.settings.classList.add('active');
      });
    },
    close:function(){
      if (home.settings.needreload){
        home.settings.needreload=false;
        if (!home.settings.isplayback){
          _API.reload();
        }
      }
      home.onsettings=false;
      pb.pb.classList.remove('onsettings');
      home.settings.settings.classList.remove('active');
    },
    update:function(pc,spc){
      home.settings.menus[home.settings.sel].classList.remove('active');
      home.settings.sel=pc;
      home.settings.menus[home.settings.sel].classList.add('active');

      var fel=null;
      var gel=home.settings.menus[pc].P;
      if (spc==-1){
        spc=gel.childElementCount-1;
      }
      home.settings.subsel=spc;
      fel=gel;
      for (var i=0;i<gel.childElementCount;i++){
        var xch=gel.children[i];
        if (i==spc){
          xch.classList.add('active');
          fel=xch;
        }
        else{
          xch.classList.remove('active');
        }
      }
      var ot=0;
      var oh=fel.offsetHeight* 1.25;
      while(fel && fel!=home.settings.sscroll){
        ot+=fel.offsetTop;
        fel=fel.offsetParent;
      }
      if (pc==0 && spc==0){
        ot=0;
      }
      var ob=ot+oh;
      var st=home.settings.sscroll.scrollTop;
      var sh=home.settings.sscroll.offsetHeight;
      var sb=st+sh;
      if (ot<st){
        home.settings.sscroll.scrollTop=ot;
      }
      else if (ob>sb){
        home.settings.sscroll.scrollTop=ob-sh;
      }
    },
    open_donation:function(ispaypal){
      if (ispaypal){
        home.settings.open_qrcode(
          "Donate Project<br>https://paypal.me/amarullz",
          "https://paypal.me/amarullz"
        );
      }
      else{
        home.settings.open_qrcode(
          "Join Discord Server<br>https://discord.gg/VGtGtRedGR",
          "https://discord.gg/VGtGtRedGR"
        );
      }
    },
    open_qrcode:function(title, uri, shouldback){
      if (home.onsettings){
        home.ondonate=shouldback?2:true;
        $('popupcontainer').className='active';
        $('aboutpopup').className='active'; 
        if (uri){
          var h='<div id="qr_holder_value"></div>'+title;
          $('popup_qrcode').innerHTML=h;
          new QRCode("qr_holder_value", {
            text: uri,
            width: 256,
            height: 256,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
          });
        }
        else{
          $('popup_qrcode').innerHTML=title;
        }
        $('popup_qrcode').style.display='';
      }
    },
    close_qrcode:function(){
      $('aboutpopup').className='';
      $('popupcontainer').className='';
      home.ondonate=false;
    }
  },
  settings_keycb:function(c){
    if (home.ondonate){
      if (c==KBACK || (c==KENTER && home.ondonate!=2)){
        home.settings.close_qrcode();
      }
      return;
    }

    var pc=home.settings.sel;
    var spc=home.settings.subsel;
    if (c==KBACK){
      home.settings.close();
    }
    else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
      if (c==KENTER){
        var gel=home.settings.menus[pc].P;
        var el=gel.children[spc];
        try{
          if (el.classList.contains('disabled')){
            return;
          }
          var action=el.getAttribute('action');
          var arg=el.getAttribute('arg');
          pb.action_handler(action,arg);
        }catch(e){}
        home.settings.update(pc,spc);
        return;
      }
    }
    else if (c==KUP){
      var doNext=true;
      doNext=(--spc<0)?true:false;
      if (doNext){
        if (--pc<0){
          pc=home.settings.menus.length-1;
        }
        spc=-1;
      }
    }
    else if (c==KDOWN){
      var doNext=true;
      doNext=(++spc>=home.settings.menus[pc].P.childElementCount)?true:false;
      if (doNext){
        if (++pc>=home.settings.menus.length){
          pc=0;
        }
        spc=0;
      }
    }
    if (home.settings.sel!=pc || home.settings.subsel!=spc){
      home.settings.update(pc,spc);
    }
  },
  onsettings:false,
  ondonate:false,

  search:{
    sel:0,
    search:$('search'),
    kw:$('search_keyword'),
    genres:$('search_genre'),
    res:$('search_result'),
    menus:[],
    update:function(pc){
      home.search.menus[home.search.sel].classList.remove('active');
      home.search.sel=pc;
      home.search.menus[home.search.sel].classList.add('active');
      if (pc==0){
        home.search.kw.focus();
        _API.showIme(true);
      }
      else{
        home.search.kw.blur();
        _API.showIme(false);
      }
    },
    close:function(){
      home.onsearch=false;
      home.search.search.classList.remove('active');
      _API.showIme(false);
      _API.setUri("/home");
    },
    parse:function(v){
      var rd=[];
      if (__SD3){
        rd=home.hi_parse(v);
      }
      else if (__SD5){
        rd=home.flix_parse(v);
      }
      else if (__SD==1){
        var h=$n('div','','',null,v);
        // wave
        var ls=h.querySelector('#list-items');
        if (ls){
          var it=ls.querySelectorAll('div.item');
          for (var i=0;i<it.length;i++){
            var im=it[i];
            var d={};
            var tt=im.querySelector('a.d-title');
            d.url=tt.href;
            d.title=tt.textContent.trim();
            try{
              d.title_jp=tt.getAttribute('data-jp');
            }catch(ex){}
            d.poster=im.querySelector('img').src;
            d.tip=im.querySelector('div.poster.tip').getAttribute('data-tip');
            var epel=im.querySelector('span.ep-status.sub');
            if (!epel){
              epel=im.querySelector('span.ep-status.total');
              d.epavail=0;
            }
            else{
              d.epavail=toInt((epel.textContent+'').trim());
            }
            if (epel){
              d.ep=(epel.textContent+'').trim();
            }
            epel=im.querySelector('span.ep-status.total');
            if (epel){
              d.eptotal=toInt((epel.textContent+'').trim());
            }
            else{
              d.eptotal=0;
            }

            d.adult=false;
            try{
              d.adult=im.querySelector('div.adult')?true:false;
            }catch(e){}

            try{
              d.type=im.querySelector('div.right').textContent.trim();
            }catch(e){}
            rd.push(d);
          }
        }
        h.innerHTML='';
      }
      else{
        var h=$n('div','','',null,v);
        // anix
        var it=h.querySelectorAll('section.s-content div.content-item div.piece div.inner');
        for (var i=0;i<it.length;i++){
          var t=it[i];
          try{
            var d={};
            var at=t.querySelector('a.poster');
            d.url=at.href;
            d.tip=at.getAttribute('data-tip');
            d.poster=t.querySelector('a.poster img').src;
            at=t.querySelector('div.ani-name a');
            d.title=at.textContent.trim();
            try{
              d.title_jp=at.getAttribute('data-jp');
            }catch(ex){}
  
            d.type=t.querySelector('div.abs-info span.type').textContent.trim();
            try{
              d.ep=t.querySelector('div.sub-dub-total span.sub').textContent.trim();
            }catch(e){
              try{
                d.ep=t.querySelector('div.sub-dub-total span.dub').textContent.trim();
              }catch(e2){}
            }
            try{
              d.eptotal=toInt(t.querySelector('div.sub-dub-total span.total').textContent.trim());
            }catch(e4){
              d.eptotal=0;
            }
            d.epavail=toInt(d.ep?d.ep:d.eptotal);
            try{
              d.adult=false;
              var anir=t.querySelector('div.abs-info div.ani-rating');
              if (anir){
                if (anir.textContent.trim()=='18+'){
                  d.adult=true;
                }
              }
            }catch(e3){}
  
            d.duration=t.querySelector('div.abs-info span.time').textContent.trim();
            rd.push(d);
          }catch(e){
            // console.log(e);
          }
        }
        h.innerHTML='';
      }
      return rd;
    },
    dosearch_parse:function(v){
      var rd=home.search.parse(v);
      var g=home.search.res;
      g._havenext=false;
      if (rd&&rd.length){
        g._havenext=(rd.length>=28);
        for (var i=0;i<rd.length;i++){
          var d=rd[i];
          var argv={
            url:d.url,
            img:d.poster,
            ttip:d.tip,
            sp:0,
            tp:0,
            ep:0,
            title:d.title
          };
          var hl=$n('div','',{action:"$"+JSON.stringify(argv),arg:"ep"},g.P,'');
          // var hl=$n('div','',{action:d.url,arg:(d.tip?d.tip:'')+';0'},g.P,'');
          hl._img=$n('img','',{loading:'lazy',src:$img(d.poster)},hl,'');
          hl._title=$n('b','',{jp:d.title_jp?d.title_jp:d.title},hl,tspecial(d.title));
          var infotxt='';
          if (d.adult){
            infotxt+='<span class="info_adult">18+</span>';
          }
          if (d.type){
            infotxt+='<span class="info_type">'+special(d.type)+'</span>';
          }
          if (d.ep){
            infotxt+='<span class="info_ep">'+special(d.ep)+'</span>';
          }
          if (infotxt){
            hl._ep=$n('span','info',null,hl,infotxt);
          }
        }
        while (g.P.childElementCount>60){
          g._spre.push(g.P.firstElementChild.nextElementSibling);
          g.P.removeChild(g.P.firstElementChild.nextElementSibling);
        }
        g.__update_pre();
  
        if (!g._sel)
          pb.menu_select(g,g.P.firstElementChild);
        else
          pb.menu_select(g,g._sel);
      }
      _API.showIme(false);
    },
    
    dosearch:function(getpage){
      if (home.search.kw.value!=''||home.search.genreval.length>0){
        var uri=_API.filterurl(
          home.search.kw.value,
          home.search.genreval,
          (home.search.kw.value=='')?2:0,
          getpage
        );
        if (!getpage||(getpage<=1)){
          var rc=home.search.res;
          rc._page=1;
          rc._havenext=false;
          pb.menu_clear(rc);
          rc._nojump=true;
          pb.menu_init(rc);
          rc._spre=[];
          rc._spost=[];
          rc._onload=0;
          rc._sel=null;
        }

        if (uri){
          home.search.res.classList.add('searching');
          home.search.res._onload=1;
          $a(uri,function(r){
            if (r.ok){
              home.search.dosearch_parse(r.responseText);
            }
            home.search.res.classList.remove('searching');
            home.search.res._onload=0;
          },__SD5?__AFLIX.origin:null);
        }
      }
    },
    initresult:function(rc){
      var rc=home.search.res;
      rc._page=1;
      rc._havenext=false;
      pb.menu_clear(rc);
      rc._nojump=true;
      // rc._keycb=pb.menu_keycb;
      pb.menu_init(rc);
      rc._spre=[];
      rc._spost=[];
      rc._onload=0;
      rc._sel=null;
      rc.__update_pre=function(){
        rc.P.firstElementChild.style.marginRight=(12*rc._spre.length)+"vw";
      };
      rc.__selectcb=function(g,c){
        if (!c) return;
        var k=c;
        var n=0;
        while(k){
          k=k.previousElementSibling;
          if (++n>7) break;
        }
        if (n<=6){
          if (g._spre.length>0){
            g.P.insertBefore(g._spre.pop(), g.P.firstElementChild.nextElementSibling);
            g._spost.push(g.P.lastElementChild);
            g.P.removeChild(g.P.lastElementChild);
            g.__update_pre();
            pb.menu_select(g,g._sel);
          }
          return;
        }
        if (g._onload!=0) return;
        n=0;
        while(c){
          c=c.nextElementSibling;
          if (++n>4) return;
        }
        if (g._spost.length>0){
          g.P.appendChild(g._spost.pop());
          g._spre.push(g.P.firstElementChild.nextElementSibling);
          g.P.removeChild(g.P.firstElementChild.nextElementSibling);
          g.__update_pre();
          pb.menu_select(g,g._sel);
          return;
        }
        
        if (g._havenext){
          g._page++;
          home.search.dosearch(g._page);
        }
      };
    },
    kwcb:function(g,c){
      if (c==KENTER){
        _API.showIme(true);
        home.search.dosearch();
      }
    },
    genreval:[],
    genresel:function(g,s){
      var i=s._key;
      var t=s._title;
      var gpos=home.search.genreval.indexOf(i);
      if (gpos>-1){
        home.search.genreval.splice(gpos,1);
        s.innerHTML=special(t);
      }
      else{
        home.search.genreval.push(i);
        s.innerHTML='<c>check</c> '+special(t);
      }
      home.search.dosearch();
    },
    open:function(arg){
      home.search.sel=0;
      home.search.menus=[
        home.search.kw,
        home.search.genres,
        home.search.res
      ];
      home.search.initresult(home.search.res);

      _API.setUri((__SD3||__SD5)?"/search":"/filter");

      home.onsearch=true;
      home.search.search.classList.add('active');
      home.search.sel=0;
      home.search.kw._keycb=home.search.kwcb;
      home.search.kw.value='';
      var srcgenre='';

      home.search.kw.classList.remove('active');
      home.search.genres.classList.remove('active');
      home.search.res.classList.remove('active');

      if (arg){
        if (arg.kw){
          home.search.kw.value=arg.kw;
        }
        else if (arg.genre){
          srcgenre=arg.genre;
        }
      }

      pb.menu_clear(home.search.genres);
      home.search.genreval=[];
      //home.search.genres._keycb=pb.menu_keycb;
      pb.menu_init(home.search.genres);
      home.search.genres._enter_cb=home.search.genresel;
      home.search.genres._els={};
      var vsel=null;

      var genrelist=_API.genres;
      if (__SD3){
        genrelist=_API.genres_hi;
      }
      else if (__SD5){
        genrelist=_API.genres_flix;
      }
      
      for (var i in genrelist){
        var title=i.replace(/_/g," ").toUpperCase().trim();
        var gn=$n('div','',{
          action:'!'+i,'gid':genrelist[i]
        },
        home.search.genres.P,special(title));
        gn._title=title;
        gn._key=i;
        if (srcgenre){
          if (srcgenre.toLowerCase()==i.toLowerCase()){
            vsel=gn;
            gn.innerHTML='<c>check</c> '+special(title);
            home.search.genreval.push(i);
          }
        }
        home.search.genres._els[i]=gn;
      }
      if (vsel){
        pb.menu_select(home.search.genres,vsel);
        home.search.sel=1;
      }
      else{
        pb.menu_select(home.search.genres,home.search.genres.P.firstElementChild);
      }

      setTimeout(function(){
        home.search.update(home.search.sel);
      },500);
      home.search.dosearch();
    }
  },
  onsearch:false,
  search_keycb:function(c){
    if (_MAL.onpopup){
      return _MAL.pop_keycb(c);
    }

    var pc=home.search.sel;
    if (c==KBACK){
      home.search.close();
    }
    else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
      home.search.menus[pc]._keycb(home.search.menus[pc],c);
    }
    else if (c==KUP){
      if (--pc<0) pc=0;
    }
    else if (c==KDOWN){
      if (++pc>=home.search.menus.length) pc=home.search.menus.length-1;
    }
    if (home.search.sel!=pc){
      home.search.update(pc);
    }
  },

  header_keycb:function(g,c){
    var ca=home.home_search.classList.contains('active');
    if (c==KLEFT||c==KRIGHT){
      if (ca){
        home.home_settings.classList.add('active');
        home.home_search.classList.remove('active');
      }
      else{
        home.home_settings.classList.remove('active');
        home.home_search.classList.add('active');
      }
    }
    else if (c==KENTER){
      if (ca){
        home.search.open({
          // genre:'romance'
        });
      }
      else{
        // OPEN SETTINGS
        home.settings.open(0);
        // _API.theme_next();
      }
    }
  },

  /* Root Key Callback */
  keycb:function(c){
    if (home.onsearch){
      return home.search_keycb(c);
    }
    if (home.onsettings){
      return home.settings_keycb(c);
    }
    if (_MAL.onpopup){
      return _MAL.pop_keycb(c);
    }
    var pc=home.menu_sel;
    if (c==KBACK){
      if (home.menu_sel==0){
        _JSAPI.appQuit();
      }
      else{
        pc=0;
      }
    }
    else if (c==KENTER||c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
      home.menus[home.menu_sel]._keycb(home.menus[home.menu_sel],c);
    }
    else if (c==KUP){
      if (--pc<0) pc=0;
    }
    else if (c==KDOWN){
      if (++pc>=home.menus.length) pc=home.menus.length-1;
    }

    if (home.menu_sel!=pc){
      var ac=home.menu_sel;
      var nc=pc;
      home.menu_sel=pc;
      requestAnimationFrame(function(){
        home.menus[ac].classList.remove('active');
        home.menus[nc].classList.add('active');
      });
      if (home.menu_sel>1){
        var ty=(home.menus[2].offsetTop+(home.menus[2].offsetHeight*(home.menu_sel))) - (window.innerHeight + (window.innerWidth*0.06));
        if (ty<0) ty=0;
        requestAnimationFrame(function(){
          home.home_scroll.style.transform="translateY("+(0-ty)+"px)";
        });
      }
      else{
        requestAnimationFrame(function(){
          home.home_scroll.style.transform="translateY(0)";
        });
      }
      requestAnimationFrame(function(){
        if (home.menu_sel>1)
          home.home_header.classList.add('scrolled');
        else
          home.home_header.classList.remove('scrolled');
      });
    }
  },
};


/* Argument Update */
window.__ARGUPDATE=function(){
    var uri=_JSAPI.getArg("url");
    var tip=_JSAPI.getArg("tip");
    var pos=_JSAPI.getArg("pos");
    if (uri){
        console.log("ATVLOG ARGUPDATE -> "+uri+" / "+pos+" / "+tip);
        pb.open("https://"+__DNS+uri, tip,0,pos);
    }
};

/* MAL API */
const _MAL={
  token:"",
  altoken:"",
  auth:null,
  alauth:null,
  limit:12,
  data:{},
  aldata:{},
  islogin:function(isanilist){
    if (isanilist){
      return (_MAL.altoken?true:false);
    }
    return (_MAL.token?true:false);
  },
  init:function(){
    var maldata=_JSAPI.storeGet(_API.user_prefix+"mal_auth","");
    if (maldata==""){
        maldata=localStorage.getItem(_API.user_prefix+"mal_auth");
        if (maldata){
            _JSAPI.storeSet(_API.user_prefix+"mal_auth",maldata);
            localStorage.removeItem(_API.user_prefix+"mal_auth");
        }
    }
    // console.log("MAL-INIT: "+maldata);
    if (maldata){
      try{
        _MAL.auth = JSON.parse(maldata);
        if ('access_token' in _MAL.auth){
          _MAL.token=_MAL.auth.access_token;
          if (_MAL.auth.exp<$time()){
            // Expire
            _MAL.token="";
            _MAL.auth=null;
          }
        }
      }catch(ee){
        _MAL.token="";
        _MAL.auth=null;
      }
    }
    // console.log("MAL-TOKEN: "+_MAL.token);

    var aldata=_JSAPI.storeGet(_API.user_prefix+"anilist_auth","");
    // console.log("ANILIST-INIT: "+aldata);
    if (aldata){
      try{
        _MAL.alauth = JSON.parse(aldata);
        if ('access_token' in _MAL.alauth){
          _MAL.altoken=_MAL.alauth.access_token;
          if (_MAL.alauth.exp<$time()){
            // Expire
            _MAL.token="";
            _MAL.auth=null;
          }
        }
      }catch(ee){
        _MAL.altoken="";
        _MAL.alauth=null;
      }
    }
    // console.log("ANILIST-TOKEN: "+_MAL.altoken);
  },
  req:function(uri, method, cb){
    if (!_MAL.token){
      cb({ok:false,responseText:''});
      return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        xhttp.ok=true;
        cb(xhttp);
    };
    xhttp.onerror = function() {
        xhttp.ok=false;
        cb(xhttp);
    };
    xhttp.open(method, "/__proxy/https://api.myanimelist.net"+uri, true);
    xhttp.setRequestHeader('Accept', 'application/json' );
    xhttp.setRequestHeader("Authorization", "Bearer "+_MAL.token);
    xhttp.send();
  },
  alreq:function(q, v, cb){
    if (!_MAL.altoken){
      cb({ok:false,responseText:''});
      return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        xhttp.ok=true;
        cb(xhttp);
    };
    xhttp.onerror = function() {
        xhttp.ok=false;
        cb(xhttp);
    };
    xhttp.open("POST", "/__proxy/https://graphql.anilist.co", true);
    xhttp.setRequestHeader('Accept', 'application/json' );
    xhttp.setRequestHeader('Content-Type', 'application/json' );
    xhttp.setRequestHeader("Authorization", "Bearer "+_MAL.altoken);
    xhttp.setRequestHeader("Post-Body", JSON.stringify({
      query: q,
      variables: v
    }));
    xhttp.send();
  },
  alset_ep:function(animeid, ep, cb){
    _MAL.alreq(`mutation($id: Int, $progress:Int){
      SaveMediaListEntry(id:$id, progress:$progress){
        progress
      }
    }`,{
      id:animeid,
      progress:ep
    },cb);
  },
  allist:function(page,cb){
    _MAL.alreq(`query ($user: String, $page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        pageInfo {
          perPage
          hasNextPage
          currentPage
        }
        mediaList(userName:$user,type:ANIME,status:CURRENT,sort:ADDED_TIME_DESC){
          id
          progress
          media{
            id
            title{
              romaji
              english
            }
            coverImage{
              large
              color
            }
            status
            format
            seasonYear
            season
            isAdult
            nextAiringEpisode {
              episode
            }
            averageScore
            episodes
          }
        }
      }
    }`,{
      user:_MAL.alauth.user,
      page:page,
      perPage:_MAL.limit
    },cb);
  },
  list:function(offset,cb){
    var uri='/v2/users/@me/animelist?nsfw=true&'+
      'fields=list_status,start_season,num_episodes,media_type,mean,alternative_titles,studios&'+
      'status=watching&'+
      'limit='+_MAL.limit;
    if (offset){
      uri+='&offset='+offset;
    }
    _MAL.req(uri,"GET",cb);
  },
  set_ep:function(animeid, ep, cb){
    var uri='/v2/anime/'+animeid+'/my_list_status?num_watched_episodes='+ep;
    _MAL.req(uri,"PUT",cb);
  },
  login:function(isanilist){
    if (_MAL.token && !isanilist){
      if (confirm('Are you sure you want to logout MyAnimeList integration?')){
        _JSAPI.storeDel(_API.user_prefix+"mal_auth");
        _API.showToast("MyAnimeList logout sucessfull...");
        _API.reload();
      }
    }
    else if (_MAL.altoken && isanilist){
      if (confirm('Are you sure you want to logout AniList integration?')){
        _JSAPI.storeDel(_API.user_prefix+"anilist_auth");
        _API.showToast("AniList logout sucessfull...");
        _API.reload();
      }
    }
    else{
      if (!isanilist){
        var chval=_API.listPrompt(
          "MyAnimeList Login Type",
          ["QRCode Web Authorization","Username + Password"]
        );

        if (chval===null){
          return;
        }
        if (chval==1){
          _JSAPI.malLogin();
          return;
        }
      }

      home.settings.open_qrcode(
        '<span class="z-loader z-small"></span><br>Please Wait..',
        null,
        true
      );
      var lid='';
      var lstate=0;
      var root_url=isanilist?'https://animetv.amarullz.com/anilist':'https://animetv.amarullz.com/mal';
      function delLid(){
        var uriv=root_url+'/check?lid='+lid+"&del="+$tick();
        $ap(uriv, function(r){});
      }
      function waitLogin(){
        var uriv=root_url+'/check?lid='+lid+"&"+$tick();
        $ap(uriv, function(r){
          if (home.ondonate){
            if (r.ok){
              try{
                var k=JSON.parse(r.responseText);
                console.log("MAL RECHECK = "+r.responseText+" / "+uriv);
                if ((k.st==1)&&(lstate==0)){
                  lstate=1;
                  home.settings.open_qrcode(
                    '<span class="z-loader z-small"></span><br>'+
                    (isanilist?'Please finish AniList authorization':'Please finish MAL authorization'),
                    null,
                    true
                  );
                }
                else if (k.st==2){
                  home.settings.close_qrcode();
                  _MAL.onlogin(JSON.parse(r.responseText),isanilist?2:1);
                  return;
                }
              }catch(e){}
            }
            /* retry */
            setTimeout(waitLogin,2000);
          }
          else{
            delLid();
          }
        });
      }
      function showQr(){
        lstate=0;
        home.settings.open_qrcode(
          isanilist?'Scan QR and login to AniList in your phone':'Scan QR and login to MAL in your phone',
          root_url+"/login?lid="+lid,
          true
        );
        waitLogin();
      }
      function genLid(){
        if (isanilist){
          lid='AL'+$tick()+'Y';
        }
        else{
          lid='MAL'+$tick()+'L';
        }
        var uri=root_url+'/check?lid='+lid+"&"+$tick();
        $ap(uri, function(r){
          if (home.ondonate){
            if (r.ok){
              try{
                var k=JSON.parse(r.responseText);
                console.log("MAL CHECK = "+r.responseText);
                if (k.st==0){
                  showQr();
                  return;
                }
              }catch(e){}
            }
            /* retry */
            setTimeout(genLid,2000);
          }else{
            delLid();
          }
        });
      }
      genLid();
    }
  },
  onlogin:function(d,tp){
    if (d){
      if (!tp){
        d.tk=d.access_token;
        d.ex=d.expires_in;
      }
      if (('tk' in d) && ('ex' in d)){
        var dt={
          access_token:d.tk,
          exp:d.ex+$time(),
          expires_in:d.ex,
          user:d.user
        };

        if (tp==2){
          _JSAPI.storeSet(_API.user_prefix+"anilist_auth",JSON.stringify(dt));
          console.log("ANILIST-ONLOGIN: "+JSON.stringify(dt));
          _API.showToast("AniList login sucessfull...");
          _API.reload();
        }
        else{
          _JSAPI.storeSet(_API.user_prefix+"mal_auth",JSON.stringify(dt));
          console.log("MAL-ONLOGIN: "+JSON.stringify(dt));
          _API.showToast("MyAnimeList login sucessfull...");
          _API.reload();
        }
      }
      else if (tp==2){
        _API.showToast("AniList Login Failed");
      }
      else{
        _API.showToast("MyAnimeList Login Failed"+(('message' in d)?": "+d.message:""));
      }
    }
  },
  home_loader:function(g){
    g._onload=1;
    var load_page=(g._page-1)*_MAL.limit;
    _MAL.list(load_page, function(r){
      if (r.ok){
        // console.log("MAL-LIST: "+r.responseText);
        try{
          var v=JSON.parse(r.responseText);
          _MAL.list_parse(g,v);
        }catch(e){
        }
        g._onload=0;
      }
      else{
        setTimeout(function(){_MAL.home_loader(g)},10000);
        // console.log("MAL-LIST: ERROR");
      }
    });
  },
  alhome_loader:function(g){
    g._onload=1;
    _MAL.allist(g._page,function(r){
      if (r.ok){
        // console.log("ANILIST-LIST: "+r.responseText);
        try{
          var v=JSON.parse(r.responseText);
          _MAL.allist_parse(g,v);
        }catch(e){}
        g._onload=0;
      }
      else{
        setTimeout(function(){_MAL.alhome_loader(g)},10000);
        // console.log("ANILIST-LIST: ERROR -> "+r.responseText);
      }
    });
  },
  update_epel:function(d,cep){
    var isanilist=false;
    if ('list_status' in d){
      if (d.list_status.num_episodes_watched>=cep){
        return;
      }
      d.list_status.num_episodes_watched=cep;
      _MAL.set_ep(d.node.id,cep,function(r){
        console.log("MAL #Update-Resp: "+r.responseText);
      });
    }
    else{
      console.log("AniList #Update-Episode: "+d.id);
      if (d.progress>=cep){
        return;
      }
      d.progress=cep;
      _MAL.alset_ep(d.id,cep,function(r){
        console.log("AniList #Update-Resp: "+r.responseText);
      });
      isanilist=true;
    }
    try{
      if (d._elm && d._elm._ep){
        var sp=d._elm._ep.querySelector("span.info_ep");
        if (!sp){
          d._elm._ep.innerHTML+='<span class="info_ep">'+special(cep+"")+'</span>';
        }
        else{
          sp.innerHTML=special(cep+"");
        }

        if (isanilist){
          sp=d._elm._ep.querySelector("span.info_ep");
          var vep=0;
          if (d.media.nextAiringEpisode){
            vep=d.media.nextAiringEpisode.episode-1;
            if (vep<1){
              vep=0;
            }
          }
          if (vep>cep){
            sp.classList.add('info_ep_havenext');
          }
          else{
            sp.classList.remove('info_ep_havenext');
          }
        }
      }
    }catch(ee){
      console.log("ERR: "+ee);
    }
  },
  allist_parse:function(g,v){
    try{
      if (!v.data.Page.pageInfo.hasNextPage){
        g._page=100;
      }
      if (v.data.Page.mediaList.length>0){
        for (var i=0;i<v.data.Page.mediaList.length;i++){
          var d=v.data.Page.mediaList[i];
          var malid="anilist_"+d.id;
          _MAL.aldata[malid]=JSON.parse(JSON.stringify(d));
          var hl=$n('div','',{action:"#"+malid,arg:''},g.P,'');
          hl._img=$n('img','',{loading:'lazy',src:$img(d.media.coverImage.large)},hl,'');
          _MAL.aldata[malid]._elm=hl;
          hl._title=$n('b','',{jp:d.media.title.romaji},hl,tspecial(d.media.title.english));
          var infotxt='';
          var numep=d.progress;
          var mtp=d.media.format;
          if (mtp=='TV_SHORT'){
            mtp='TV';
          }
          if (d.media.isAdult){
            infotxt+='<span class="info_adult">18+</span>';
          }
          if (mtp&&(mtp!='unknown')){
            infotxt+='<span class="info_type">'+special(mtp.toUpperCase())+'</span>';
          }
          var vep=0;
          if (d.media.nextAiringEpisode){
            vep=d.media.nextAiringEpisode.episode-1;
            if (vep<1){
              vep=0;
            }
          }
          var sumep=d.media.episodes;
          if (vep){
            infotxt+='<span class="info_sumep">'+special(vep+"")+'</span>';
          }
          else if (sumep){
            infotxt+='<span class="info_sumep">'+special(sumep+"")+'</span>';
          }
          infotxt+='<span class="info_ep'+((numep<vep)?' info_ep_havenext':'')+'">'+
            special((numep?numep:"-")+"")+'</span>';
          hl._ep=$n('span','info',null,hl,infotxt);
        }
        while (g.P.childElementCount>30){
          g._spre.push(g.P.firstElementChild.nextElementSibling);
          g.P.removeChild(g.P.firstElementChild.nextElementSibling);
        }
        g.__update_pre();
        if (!g._sel)
          pb.menu_select(g,g.P.firstElementChild);
        else
          pb.menu_select(g,g._sel);
      }
    }catch(e){
      console.log("ANILIST - ERR : "+e);
    }
  },
  list_parse:function(g,v){
    if ('paging' in v){
      if (!('next' in v.paging)){
        g._page=100;
      }
    }
    else{
      g._page=100;
    }
    if ('data' in v){
      try{
        if (v.data.length>0){
          for (var i=0;i<v.data.length;i++){
            var d=v.data[i];
            var malid="mal_"+d.node.id;
            _MAL.data[malid]=JSON.parse(JSON.stringify(d));
            var hl=$n('div','',{action:"#"+malid,arg:''},g.P,'');
            hl._img=$n('img','',{loading:'lazy',src:$img(d.node.main_picture.medium)},hl,'');
            var title=d.node.title;
            _MAL.data[malid]._elm=hl;
            if ('alternative_titles' in d.node){
              if ('en' in d.node.alternative_titles){
                if (d.node.alternative_titles.en.trim()){
                  title=d.node.alternative_titles.en;
                }
              }
            }
            hl._title=$n('b','',{jp:d.node.title},hl,tspecial(title)); /* d.node.title */
            var infotxt='';
            var numep=d.list_status.num_episodes_watched;
            var mtp=d.node.media_type;
            if (mtp&&(mtp!='unknown')){
              infotxt+='<span class="info_type">'+special(mtp.toUpperCase())+'</span>';
            }
            if (numep){
              infotxt+='<span class="info_ep">'+special(numep+"")+'</span>';
            }
            hl._ep=$n('span','info',null,hl,infotxt);
          }
          while (g.P.childElementCount>30){
            g._spre.push(g.P.firstElementChild.nextElementSibling);
            g.P.removeChild(g.P.firstElementChild.nextElementSibling);
          }
          g.__update_pre();
    
          if (!g._sel)
            pb.menu_select(g,g.P.firstElementChild);
          else
            pb.menu_select(g,g._sel);
        }
      }catch(e){}
    }
  },
  srcanime:function(d,cb,isanilist,cnt){
    if ('srcanime' in d){
      cb(d.srcanime);
      return;
    }
    if (!cnt){
      cnt=0;
    }
    var uri='';
    var id='';
    if (isanilist){
      id=d.id;

      if (__SD5){
        _API.getTooltip(d.media.id+'',function(r){
          if (r){
            d.srcanime=[r];
            cb(d.srcanime);
            return;
          }
          d.srcanime=[];
          cb(d.srcanime);
        });
        return;
      }
      
      var kw=d.media.title.romaji;
      if (__SD3){
        kw=d.media.title.english;
      }
      var ses=d.media.season;
      var y=d.media.seasonYear;
      console.log("FILTER URL = "+uri);
      console.log(JSON.stringify(d));
    }
    else{
      id=d.node.id;
      var kw=d.node.title;
      if (__SD3){
        try{
          kw=d.node.alternative_titles.en;
        }catch(ee){}
      }
      var ses=d.node.start_season.season;
      var y=d.node.start_season.year;
    }
    // uri='/filter?keyword='+enc(kw)+'&sort=most_relevance';
    var year=null;
    var season=null;
    if (cnt<2){
      season=ses;
    }
    if (cnt<1){
      year=y;
    }
    uri=_API.filterurl(
      kw,null,1,0,season,year
    );

    $a(uri,function(r){
      if (r.ok){
        var rd=home.search.parse(r.responseText);
        if (rd.length>0){
          console.log('ANIMESRC ['+id+'] = '+JSON.stringify(rd));
          var sel=rd[0];
          var slkw=slugString(kw);
          for (var i=0;i<rd.length;i++){
            if (__SD5){
              if (isanilist){
                if (d.media.id==rd[i].tip){
                  sel=rd[i];
                  break;
                }
              }
              else{
                if (d.id==rd[i].malid){
                  console.log("MAL MATCH = "+rd[i].malid+" -> "+d.id);
                  sel=rd[i];
                  break;
                }
              }
            }
            else{
              if ((slugString(rd[i].title)==slkw)||(slugString(rd[i].title_jp)==slkw)){
                sel=rd[i];
                break;
              }
            }
          }

          d.srcanime=[sel];
          cb(d.srcanime);
          return;
        }
        else if (cnt<2){
          console.log('ANIMESRC RETRY ['+id+'] = '+cnt);
          _MAL.srcanime(d,cb,isanilist,cnt+1);
          return;
        }
      }
      d.srcanime=[];
      cb(d.srcanime);
    },__SD5?__AFLIX.origin:null);
  },
  action_handler:function(id){
    try{
      _MAL.pop.mv.className='active loading';
      $('popupcontainer').className='active';
      _MAL.pop.var.ready=false;
      _MAL.onpopup=true;

      if (id in _MAL.data){
        var d=_MAL.data[id];
        _MAL.srcanime(d,function(r){
          if (r.length>0){
            if (_MAL.onpopup){
              console.log("MAL ACTION START...");
              // pb.open(r[0].url, r[0].tip);
              _MAL.preview(
                r[0].url, r[0].poster, r[0].title, r[0].tip, 
                d.list_status.num_episodes_watched, 0, 0, 
                '', d.node.id
              );
            }
            return;
          }
          _MAL.popup_close();
          _API.showToast("Matching anime not found...");
        });
      }
      else if (id in _MAL.aldata){
        var d=_MAL.aldata[id];
        _MAL.srcanime(d,function(r){
          if (r.length>0){
            if (_MAL.onpopup){
              console.log("ANILIST ACTION START...");
              _MAL.preview(
                r[0].url, r[0].poster, r[0].title, r[0].tip, 
                d.progress, 0, 0, 
                '', "L"+d.id
              );
            }
            return;
          }
          _MAL.popup_close();
          _API.showToast("Matching anime not found...");
        },true);
      }
    }catch(e){
      console.log("Error MAL Action : "+e);
      _MAL.popup_close();
    }
  },
  pop:{
    mv:$('malview'),
    title:$('malview_title'),
    img:$('malview_img'),
    begin:$('malplay_begin'),
    resume:$('malplay_resume'),
    next:$('malplay_next'),
    ep:$('malplay_ep'),
    epval:$('malplay_ep_val'),
    resume_ep:$('malplay_resume_ep'),
    resume_text:$('malplay_resume_text'),
    next_ep:$('malplay_next_ep'),
    watchlist:$('malplay_watchlist'),
    history:$('malplay_history'),
    progh:$('malplay_resume_progh'),
    prog:$('malplay_resume_prog'),
    rating:$('malview_rating'),
    menu:[],
    menusel:0,
    var:{
      next:0,
      resume:0,
      ep:1,
      num:0,
      url:'',
      ttip:'',
      malid:0,
      play:{
        c:0,
        d:0,
        e:0
      },
      infav:false,
      animeid:'',
      ready:false,
      title:'',
      title_jp:'',
      img:''
    },
    setEp:function(){
      if (_MAL.pop.var.num>0){
        _MAL.pop.epval.innerHTML='Episode '+_MAL.pop.var.ep+' / '+_MAL.pop.var.num;
        _MAL.pop.ep.classList.remove('disable');
      }
      else{
        _MAL.pop.epval.innerHTML='-';
        _MAL.pop.ep.className='disable';
      }
    }
  },
  onpopup:false,
  pop_keycb:function(c){
    if (!_MAL.pop.var.ready){
      if (c==KBACK){
        _MAL.popup_close();
      }
      return;
    }
    var pc=_MAL.pop.menusel;
    if (c==KBACK){
      _MAL.popup_close();
    }
    else if (c==KENTER){
      var openurl=_MAL.pop.var.url;
      var el=_MAL.pop.menu[pc];
      var epsel=1;

      /* Watchlist & History */
      if (el==_MAL.pop.watchlist){
        if (_MAL.pop.var.animeid){
          if (_MAL.pop.var.infav){
            /* Delete from Fav */
            list.fav_del(_MAL.pop.var.animeid);
          }
          else{
            /* Add to fav */
            var obep=_MAL.pop.var.resume?_MAL.pop.var.resume:1;
            var ob={
              'url':openurl,
              'title':_MAL.pop.var.title,
              'title':_MAL.pop.var.title_jp,
              'poster':_MAL.pop.var.img,
              'ep':obep,
              'episode':"EPISODE-"+obep,
              'tip':_MAL.pop.var.ttip
            };
            list.fav_add(_MAL.pop.var.animeid,ob,true);
          }
        }
        _MAL.pop_initlist(openurl);
        if (_MAL.pop.menusel>=_MAL.pop.menu.length){
          _MAL.pop.menusel=_MAL.pop.menu.length-1;
        }
        _MAL.popup_update();
        home.list_init_name(list.fav,home.home_fav);
        return;
      }
      else if (el==_MAL.pop.history){
        if (_MAL.pop.var.animeid){
          /* Delete from History */
          list.history_del(_MAL.pop.var.animeid);
        }
        _MAL.pop_initlist(openurl);
        if (_MAL.pop.menusel>=_MAL.pop.menu.length){
          _MAL.pop.menusel=_MAL.pop.menu.length-1;
        }
        _MAL.popup_update();
        home.list_init_name(list.history,home.home_history);
        return;
      }

      if (el==_MAL.pop.next){
        epsel=_MAL.pop.var.next;
      }
      else if (el==_MAL.pop.resume){
        epsel=_MAL.pop.var.resume;
      }
      else if (el==_MAL.pop.ep){
        epsel=_MAL.pop.var.ep;
      }

      openurl+=(__SD3||__SD5)?('#'+epsel):('/ep-'+epsel);

      console.log("MAL Open Anime = "+openurl);
      _MAL.popup_close();
      
      var currtime=null;
      if (toInt(epsel)==_MAL.pop.var.play.e){
        currtime=_MAL.pop.var.play.c;
      }
      pb.open(openurl, _MAL.pop.var.ttip, undefined, currtime, _MAL.pop.var.malid);
    }
    else if (c==KLEFT||c==KRIGHT||c==KPGUP||c==KPGDOWN){
      if (_MAL.pop.ep==_MAL.pop.menu[pc]){
        if (c==KLEFT){
          if (--_MAL.pop.var.ep<1){
            _MAL.pop.var.ep=1;
          }
        }
        else if (c==KRIGHT){
          if (++_MAL.pop.var.ep>_MAL.pop.var.num){
            _MAL.pop.var.ep=_MAL.pop.var.num;
          }
        }
        else if (c==KPGUP){
          _MAL.pop.var.ep-=10;
          if (_MAL.pop.var.ep<1){
            _MAL.pop.var.ep=1;
          }
        }
        else if (c==KPGDOWN){
          _MAL.pop.var.ep+=10;
          if (_MAL.pop.var.ep>_MAL.pop.var.num){
            _MAL.pop.var.ep=_MAL.pop.var.num;
          }
        }
        _MAL.pop.setEp();
      }
      else if (_MAL.pop.watchlist==_MAL.pop.menu[pc]){
        if (c==KRIGHT){
          _MAL.pop_keycb(KDOWN);
        }
        return;
      }
      else if (_MAL.pop.history==_MAL.pop.menu[pc]){
        if (c==KLEFT){
          _MAL.pop_keycb(KUP);
        }
        return;
      }
    }
    else if (c==KUP){
      if (--pc<0){
        pc=_MAL.pop.menu.length-1;
      }
    }
    else if (c==KDOWN){
      if (++pc>=_MAL.pop.menu.length){
        pc=0;
      }
    }
    if (_MAL.pop.menusel!=pc){
      _MAL.pop.menusel=pc;
      _MAL.popup_update();
    }
  },
  popup_close:function(){
    _MAL.pop.mv.className='';
    $('popupcontainer').className='';
    _MAL.pop.var.ready=false;
    _MAL.onpopup=false;
  },
  popup_update:function(){
    for (var i=0;i<_MAL.pop.menu.length;i++){
      if (i==_MAL.pop.menusel)
        _MAL.pop.menu[i].classList.add('active');
      else
        _MAL.pop.menu[i].classList.remove('active');
    }
  },
  pop_initlist:function(url){
    /* Remove watchlist&history from menu */
    
    while (_MAL.pop.menu.length>0){
      var elast=_MAL.pop.menu[_MAL.pop.menu.length-1];
      if (elast==_MAL.pop.watchlist||elast==_MAL.pop.history){
        _MAL.pop.menu.pop();
      }
      else{
        break;
      }
    }

    _MAL.pop.var.animeid='';
    var animeid=_API.animeId(url);
    console.log("pop_initlist : "+url+" / "+animeid);
    if (animeid){
      _MAL.pop.var.animeid=animeid;
      var fav=list.fav;
      var hist=list.history;
      _MAL.pop.watchlist.className='';
      if (animeid in fav.detail){
        _MAL.pop.watchlist.firstElementChild.innerHTML='close';
        _MAL.pop.var.infav=true;
      }
      else{
        _MAL.pop.watchlist.className='add';
        _MAL.pop.watchlist.firstElementChild.innerHTML='bookmark_add';
        _MAL.pop.var.infav=false;
      }
      _MAL.pop.menu.push(_MAL.pop.watchlist);

      if (animeid in hist.detail){
        _MAL.pop.history.className='';
        _MAL.pop.menu.push(_MAL.pop.history);
      }
      else{
        _MAL.pop.history.className='disable';
      }
      return;
    }
    _MAL.pop.watchlist.className=
    _MAL.pop.history.className='disable';
    _MAL.pop.watchlist.firstElementChild.innerHTML='add';
  },
  popuprating:function(v){
    if (v=='R+'){
      _MAL.pop.rating.innerHTML='18+';
      _MAL.pop.rating.className='adult';
    }
    else{
      _MAL.pop.rating.className='';
      _MAL.pop.rating.innerHTML=v;
    }
  },
  preview_detail:function(d){
    $('malview_synopsys').innerHTML=d.synopsis?special(d.synopsis):"&nbsp;"
    
    var vd='';
    var vt='';
    if (d.duration){
      vd=special(d.duration);
      vt="Duration:";
    }
    else if (d.type){
      vd=special(d.type);
      vt="Type:";
    }
    $('malview_info_duration_t').innerHTML=vt;
    $('malview_info_duration').innerHTML=vd;

    $('malview_info_status').innerHTML=d.status?special(d.status):"-";
    $('malview_info_genre').innerHTML=d.genre?special(d.genre):"-";
  },
  preview_do:function(url, img, ttid, currep, tcurr, tdur,d,arg,malid){
    if (!_MAL.onpopup){
      return;
    }
    // console.log("PreviewDo = "+JSON.stringify([url, img, ttid, currep, tcurr, tdur,d,arg,malid]));
    try{
    var numep=toInt(d.ep);
    currep=toInt(currep);
    _MAL.pop.title.innerHTML=tspecial(d.title);
    _MAL.pop.title.setAttribute('jp',d.title_jp?d.title_jp:d.title);

    _MAL.pop.img.src=$img(img);
    _MAL.pop.menu=[
      _MAL.pop.begin
    ];
    _MAL.pop.var.url=url;
    _MAL.pop.var.ttip=ttid;
    _MAL.pop.var.malid=malid?malid:null;
    _MAL.pop.menusel=0;

    _MAL.pop.var.title=d.title;
    _MAL.pop.var.title_jp=d.title_jp;
    _MAL.pop.var.img=img;

    _MAL.pop.var.play.c=tcurr;
    _MAL.pop.var.play.d=tdur;
    _MAL.pop.var.play.e=currep;

    // headimg
    $('malview_info').style.backgroundImage=((d&&d.logoimg)?('url('+d.logoimg+')'):'');

    _MAL.preview_detail(d);

    _MAL.popuprating(d.rating);

    _MAL.pop.progh.className='';
    if (tcurr>0 && tdur>0){
      _MAL.pop.progh.className='active';
      var pct=(parseFloat(tcurr)/parseFloat(tdur))*100.0;
      _MAL.pop.prog.style.width=pct+"%";
    }

    _MAL.pop.var.resume=0;
    _MAL.pop.var.next=0;

    if (currep>0){
      _MAL.pop.menu.push(_MAL.pop.resume);
      if (numep>currep){
        _MAL.pop.menu.push(_MAL.pop.next);
        _MAL.pop.next_ep.innerHTML='EP-'+(currep+1);
        _MAL.pop.next.className='';
        _MAL.pop.var.next=currep+1;
      }
      else{
        _MAL.pop.next_ep.innerHTML='';
        _MAL.pop.next.className='disable';
      }
      _MAL.pop.resume_ep.innerHTML='EP-'+(currep);
      _MAL.pop.resume.className='';
      _MAL.pop.var.resume=currep;
      _MAL.pop.menusel=1;
    }
    else{
      _MAL.pop.next_ep.innerHTML=
      _MAL.pop.resume_ep.innerHTML='';
      _MAL.pop.next.className=
      _MAL.pop.resume.className='disable';
    }

    if (arg=="ep"){
      _MAL.pop.resume_text.innerHTML='Play Episode';
    }
    else{
      _MAL.pop.resume_text.innerHTML='Resume';
    }

    _MAL.pop.var.num=numep;
    _MAL.pop.var.ep=(currep>0)?currep:1;
    _MAL.pop.setEp();
    if (_MAL.pop.var.num>0){
      _MAL.pop.menu.push(_MAL.pop.ep);
    }
    _MAL.popup_update();
    _MAL.pop.mv.className='active';
    $('popupcontainer').className='active';

    _MAL.pop_initlist(url);

    _MAL.pop.var.ready=true;
    }catch(e){
      console.log("PDO = "+e);
    }
  },
  preview:function(url, img, titl, ttid, ep, tcurr, tdur,arg,malid){
    var url_parse=url.split('/');
    var defdat={
      title:titl,
      title_jp:titl,
      ep:0,
      rating:''
    };
    console.log("Popup = "+JSON.stringify([url, img, titl, ttid, ep, tcurr, tdur,arg,malid]));
    if ((url_parse.length>=5)||__SD3||__SD5){
      if((url_parse.length==6)&&(!__SD3)&&(!__SD5)){
        url_parse.pop();
        url=url_parse.join('/');
      }
      _MAL.pop.mv.className='active loading';
      $('popupcontainer').className='active';
      _MAL.pop.var.ready=false;
      _MAL.onpopup=true;
      _API.getTooltip(ttid,function(d){
        if (d){
          if (!ttid){
            console.log("New TTID = "+d.ttid);
            ttid=d.ttid;
          }
          if (d.poster){
            img=d.poster;
          }
          _MAL.preview_do(url, img, ttid, ep, tcurr, tdur,d,arg,malid);
          return;
        }
        _MAL.preview_do(url, img, ttid, ep, tcurr, tdur, defdat,arg,malid);
        return;
      },url);
      return;
    }
    // pb.open(url, ttid, 0, tcurr);
    try{
      _MAL.pop.mv.className='active';
        $('popupcontainer').className='active';
      _MAL.onpopup=true;
      _MAL.pop.var.ready=false;
      console.log("PREV DMP = "+JSON.stringify([url, img, ttid, ep, tcurr, tdur,defdat,arg,malid]));
      _MAL.preview_do(url, img, ttid, ep, tcurr, tdur,defdat,arg,malid);
    }catch(e){
      console.log("PREV ERR = "+err);
    }
  },
  prev_action_handler:function(data,arg){
    try{
      var j=JSON.parse(data);
      _MAL.preview(j.url, j.img, j.title, j.ttip, j.ep, j.sp, j.tp,arg);
    }catch(e){
    }
  },
};

window.__ARGUPDATE();
_MAL.init();
home.init();
_API.bgimg_update();

(function(){
  var xDown = null;
  var yDown = null;
  var tIsMove=false;
  function getTouches(evt) {
    return evt.touches ||             // browser API
           evt.originalEvent.touches; // jQuery
  }
  function handleTouchStart(evt) {
      const firstTouch = getTouches(evt)[0];
      xDown = firstTouch.clientX;
      yDown = firstTouch.clientY;
      tIsMove=false;
  }
  function handleTouchMove(evt) {
      if ( ! xDown || ! yDown ) {
          return;
      }
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
      var minMove=window.innerWidth*0.07;
      var minCancel=window.innerWidth*0.02;
      if ( Math.abs( xDiff ) < Math.abs( yDiff ) ) {
        if (Math.abs( yDiff )>minMove){
          if ( yDiff > 0 ) {
            /* down swipe */
            window._KEYEV(KDOWN,1);
          } else {
            /* up swipe */
            window._KEYEV(KUP,1);
          }
          /* Update Values */
          xDown = xUp;
          yDown = yUp;
        }
        if (!tIsMove&&Math.abs( yDiff )>minCancel){
          tIsMove=true;
        }
      }
      else{
        if (Math.abs( xDiff )>minMove){
          if ( xDiff > 0 ) {
            window._KEYEV(KRIGHT,1);
          } else {
            window._KEYEV(KLEFT,1);
          }
          /* Update Values */
          xDown = xUp;
          yDown = yUp;
        }
      }
      if (!tIsMove){
        if (Math.abs(xDiff)+Math.abs(yDiff)>minCancel){
          tIsMove=true;
        }
      }
  }
  function handleTouchEnd(evt){
    if (!tIsMove){
      window._KEYEV(KENTER,1);
    }
    tIsMove=false;
  }
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);
  document.addEventListener('touchend', handleTouchEnd, false);
  
})();
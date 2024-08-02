const VRF={
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
  vrfC:function(t){
    return t.replace(/[a-zA-Z]/g,function(t) {
      return String.fromCharCode(
        (t <= 'Z' ? 90 : 122) >= (t = t.charCodeAt(0)+13) ? t:t-26
      );
    })
  },
  vrfEncrypt:function (t) {
    t = encodeURIComponent("".concat(t));
    // VRF.rc4("tGn6kIpVXBEUmqjD", t); /* old enc key */
    // t = VRF.rc4("p01EDKu734HJP1Tm", t);
    t = VRF.rc4("T78s2WjTc7hSIZZR", t);
    t = VRF.safeBtoa(t);
    return t;
    
    // t = VRF.vrfC(t);
    // t = VRF.vrfC(t);
    // t = VRF.safeBtoa(t);
    // var s = 8;
    // var r = "";
    // for (var o = 0; o < t.length; o++) {
    //   var h = t.charCodeAt(o);
    //   if (o % s == 7) {
    //     h += 6;
    //   } else if (o % s == 5) {
    //     h -= 3;
    //   } else if (o % s == 3) {
    //     h += 6;
    //   } else if (o % s == 2) {
    //     h -= 5;
    //   } else if (o % s == 6) {
    //     h += 3;
    //   } else if (o % s == 0) {
    //     h -= 2;
    //   } else if (o % s == 4) {
    //     h += 2;
    //   } else if (o % s == 1) {
    //     h -= 4;
    //   }
    //   r += String.fromCharCode(h);
    // }
    // return VRF.safeBtoa(r.split("").reverse().join(""));
  },
  vrfDecrypt:function(input){
    var vrf = VRF.safeAtob(input);
    // vrf = VRF.rc4("LUyDrL4qIxtIxOGs",vrf); /* old dec key */
    vrf = VRF.rc4("ctpAbOz5u7S6OMkx",vrf);
    return decodeURIComponent(vrf);
  },
  vrfUuid:function () {
    var n = new Date().getTime();
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (t) {
      var i = (n + 16 * Math.random()) % 16 | 0;
      n = Math.floor(n / 16);
      return ("x" === t ? i : 3 & i | 8).toString(16);
    });
  }
}

// Update Server 1 Domain
// if (!wave.vidplayGetDataDo){
//   wave.vidplayGetDataDo=wave.vidplayGetData;
//   wave.vidplayGetData=function(u, cb){
//     var s=u.split('/');
//     if (s[2].indexOf('mcloud')==-1){
//       s[2]='vidplay.online';
//     }
//     var uu=s.join('/');
//     if (pb.data.stream_vurl==u){
//       pb.data.stream_vurl=uu;
//     }
//     return wave.vidplayGetDataDo(uu,cb);
//   }
// }
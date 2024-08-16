const VRF={
  vidstream_keys:
  [
    '8Qy3mlM2kod80XIK', 'BgKVSrzpH2Enosgm', '9jXDYBZUcTcTZveM'
  ],

  /* VIDSTREAM DECODER */
  vidstreamMakeUrl:function(vidHost, vidSearch, n){
    let x=n;
    x = VRF.replaceChars(
      x = btoa(
        VRF.rc4(
          'V4pBzCPyMSwqx', x
        )
      )
      , '4pjVI6otnvxW', 'Ip64xWVntvoj'
    );
  
    x = btoa(
      VRF.rc4('eLWogkrHstP',
        VRF.replaceChars(
          VRF.reverseString(x),
          'kHWPSL5RKG9Ei8Q', 'REG859WSLiQkKHP'
        )
      )
    );
  
    x = btoa(
      VRF.rc4('bpPVcKMFJXq',VRF.reverseString(x))
    );
  
    x=btoa(
      VRF.reverseString(
        VRF.replaceChars(
          x,
          'VtravPeTH34OUog', 
          'OeaTrt4H3oVgvPU'
        )
      )
    );
    n=btoa(VRF.rc4('BvxAphQAmWO9BIJ8',n));
    return 'https://'+vidHost+'/mediainfo/'+x+vidSearch+'&h='+n;
  },
  vidstreamDecode:function(x){
    x = VRF.safeAtob(x);
    x = VRF.rc4(
      'bpPVcKMFJXq',
      VRF.safeAtob(
        VRF.replaceChars(
          VRF.reverseString(x),
          'OeaTrt4H3oVgvPU',
          'VtravPeTH34OUog'
        )
      )
    );
    x = VRF.replaceChars(
      x = VRF.rc4(
        'eLWogkrHstP',
        VRF.safeAtob(VRF.reverseString(x))
      ),
      'REG859WSLiQkKHP',
      'kHWPSL5RKG9Ei8Q'
    ),
    x = VRF.rc4(
      'V4pBzCPyMSwqx',
      VRF.safeAtob(
        VRF.replaceChars(
          VRF.reverseString(x),
          'Ip64xWVntvoj', '4pjVI6otnvxW'
        )
      )
    );
    return x;
  },

  /* VRF */
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

  /* NEW VRF */
  reverseString:function(s) {
    return s.split('').reverse().join('');
  },
  replaceChars:function(s,f,r){
    let i = f.length;
    let m = {};
    while (i-- && (m[f[i]] = r[i])){}
    return s.split("").map(v=>m[v]||v).join('');
  },
  vrfEncrypt:function(x){
    x = VRF.replaceChars(
      x,
      'AP6GeR8H0lwUz1', 
      'UAz8Gwl10P6ReH'
    );
    x = btoa(VRF.rc4('ItFKjuWokn4ZpB', x));
    x = VRF.reverseString(x);
  
    x = VRF.reverseString(x);
    x = btoa(VRF.rc4('fOyt97QWFB3',x));
    x = VRF.replaceChars(
      x,
      '1majSlPQd2M5',
      'da1l2jSmP5QM'
    );
  
    x = VRF.replaceChars(
      x,
      'CPYvHj09Au3',
      '0jHA9CPYu3v'
    );
    x = VRF.reverseString(x);
    x = btoa(
      VRF.rc4(
        "736y1uTJpBLUX",
        x
      )
    );
    x=btoa(x);
    return x;
  },
  vrfDecrypt:function(x){
    return x = VRF.safeAtob(x = '' + x),
    x = VRF.replaceChars(x = VRF.reverseString(
      x = VRF.rc4('736y1uTJpBLUX', VRF.safeAtob(x))
    ), '0jHA9CPYu3v', 'CPYvHj09Au3'),
    x = VRF.reverseString(
      x = VRF.rc4(
        'fOyt97QWFB3',
        VRF.safeAtob(
          x = VRF.replaceChars(
            x, 'da1l2jSmP5QM', '1majSlPQd2M5')
        )
      )
    ),
    x = VRF.replaceChars(
      x = VRF.rc4(
        'ItFKjuWokn4ZpB',
        VRF.safeAtob(x = VRF.reverseString(x))
      ),
      'UAz8Gwl10P6ReH', 'AP6GeR8H0lwUz1'
    );
  }
};

const KAICODEX = {
  /* ANIMEKAI CODEX */
  enc(n) {
    var u = KAICODEX.safeBtoa;
    var a = KAICODEX.rc4;
    var s = KAICODEX.replaceChars;
    var r = KAICODEX.reverseString;
    n = u(
      s(
        u(
          a(
            'sXmH96C4vhRrgi8',
            r(
              r(
                u(
                  a('kOCJnByYmfI', s(
                    s(
                      r(
                        u(
                          a('0DU8ksIVlFcia2', n)
                        )
                      ),
                      '1wctXeHqb2', '1tecHq2Xbw'
                    ),
                    '48KbrZx1ml', 'Km8Zb4lxr1'
                  )
                  )
                )
              )
            )
          )
        ), 'hTn79AMjduR5', 'djn5uT7AMR9h')
    );
    return encodeURIComponent(n);
  },
  encPlain(n) {
    return KAICODEX.safeBtoa(KAICODEX.rc4(
      'n1PEbDBiipbJZvZc',
      encodeURIComponent(n)
    ));
  },
  dec(n) {
    var u = KAICODEX.safeAtob;
    var a = KAICODEX.rc4;
    var s = KAICODEX.replaceChars;
    var r = KAICODEX.reverseString;
    n = a(
      '0DU8ksIVlFcia2',
      u(
        r(
          s(
            s(
              a('kOCJnByYmfI',
                u(
                  r(
                    r(
                      a(
                        'sXmH96C4vhRrgi8',
                        u(
                          s(
                            u(n),
                            'djn5uT7AMR9h',
                            'hTn79AMjduR5'
                          )
                        )
                      )
                    )
                  )
                )
              ), 'Km8Zb4lxr1', '48KbrZx1ml'
            ),
            '1tecHq2Xbw', '1wctXeHqb2'
          )
        )
      )
    )
    return decodeURIComponent(n);
  },
  decPlain(n) {
    return decodeURIComponent(
      KAICODEX.rc4(
        'n1PEbDBiipbJZvZc',
        KAICODEX.safeAtob(n)
      )
    );
  },
  decMegaOld(n) {
    var u = KAICODEX.safeAtob;
    var a = KAICODEX.rc4;
    var s = KAICODEX.replaceChars;
    var r = KAICODEX.reverseString;
    n = r(
      s(
        a(
          '5ygxI8hjLiuDQ0',
          u(
            a('z9cWnXuoDtx', u(
              s(
                r(
                  s(
                    a(
                      'EZnfG1IL6DF',
                      u(
                        r(
                          u(n)
                        )
                      )
                    ),
                    'M2DCEbQmWOe', 'bEDCeOQ2mWM')
                ),
                'Lw7nfcTNz3FbWy', 'TFf37zywcNWnLb'
              )
            )
            )
          )
        ), 'HK0TOgYzU1C', 'T1CHYU0OKgz'
      )
    );
    return decodeURIComponent(n);
  },
  decMega(n) {
    var o = KAICODEX.safeAtob;
    var e = KAICODEX.rc4;
    var c = KAICODEX.replaceChars;
    var v = KAICODEX.reverseString;
    n = n = c(
      e('fnxEj3tD4Bl0X',
        o(v(v(
          e('IjilzMV57GrnF',
            o(c(
              v(
                c(
                  e('PlzI69YVCtGwoa8', o(o(n))),
                  'c2IfHZwSX1mj',
                  'mwfXcS2ZjI1H'
                )
              ),
              '82NkgQDYbIF',
              '82IQNkFgYbD'
            ))
          )
        )))
      ),
      'crwkth05iJR8',
      'JRkt8rw0i5ch'
    );
    return decodeURIComponent(n);
  },

  /* Helper */
  rc4: function (key, str) {
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
  safeBtoa: function (s) {
    return btoa(s).replace(/\//g, '_').replace(/\+/g, '-').replace(/\=/g, '');
  },
  safeAtob: function (s) {
    return atob(s.replace(/_/g, '/').replace(/-/g, '+'));
  },
  reverseString: function (s) {
    return s.split('').reverse().join('');
  },
  replaceChars: function (s, f, r) {
    let i = f.length;
    let m = {};
    while (i-- && (m[f[i]] = r[i])) { }
    return s.split("").map(v => m[v] || v).join('');
  }
};


package com.amarullz.androidtv.animetvjmto;

public class Conf {
  // Translate API:
  // https://api.mymemory.translated.net/get?q=Hello%20World!&langpair=en|id
  // public static final String DOMAIN = "9anime.to";
  public static String DOMAIN = "anix.to";

  public static String SOURCE_DOMAIN1 = "aniwave.to";
  public static String SOURCE_DOMAIN2 = "anix.to";
  public static int SOURCE_DOMAIN = 1;

  public static void updateSource(int num){
    SOURCE_DOMAIN=num;
    if (num==1){
      DOMAIN=SOURCE_DOMAIN1;
    }
    else{
      DOMAIN=SOURCE_DOMAIN2;
    }
  }
  public static String getDomain(){
    if (SOURCE_DOMAIN==1)
      return SOURCE_DOMAIN1;
    return SOURCE_DOMAIN2;
  }


  // History
  // * vidplay.site
  public static String STREAM_DOMAIN = "vidplay.online";

  public static String STREAM_DOMAIN2 = "mcloud.bz";

  public static String SERVER_VER = "1.0-APK";

  /* Steam Selection */
  public static int STREAM_TYPE = 0;
  public static int STREAM_SERVER = 0;

  public static boolean PROGRESSIVE_CACHE = false;

  // public static String MAL_CLIENT_ID="7b5a9155e3870fd91382445ef04b133c";
  public static String MAL_CLIENT_ID="0e9466e5ec09684cc69da53f20b07af6";

  public static String USER_AGENT =
//      "Mozilla/5.0 (Windows NT 10.0; Win64; " +
//      "x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 " +
//          "Safari/537.36 Edg/121.0.0.0";

//      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605" +
//          ".1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1";

      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"+
      " (KHTML, like Gecko) Chrome/119.0.0.0 " +
      "Safari/537.36 Edg/116.0.1938.69";
}

package com.amarullz.androidtv.animetvjmto;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.net.http.SslError;
import android.os.AsyncTask;
import android.util.Log;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import org.chromium.net.CronetEngine;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import okhttp3.Cache;
import okhttp3.CacheControl;
import okhttp3.HttpUrl;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.dnsoverhttps.DnsOverHttps;

public class AnimeApi extends WebViewClient {
  private static final String _TAG="ATVLOG-API";

//  public static class Result{
//    public String Text;
//    public int status;
//    public String url;
//  }
//  public interface Callback {
//    void onFinish(Result result);
//  }
  private final Activity activity;
//  public final WebView webView;

  public WebResourceResponse badRequest;

//  public boolean paused=false;

//  public Callback callback;

//  public Result resData=new Result();

//  Handler handler = new Handler(Looper.getMainLooper());
//  Runnable timeoutRunnable = new Runnable() {
//    @Override
//    public void run() {
//      if (resData.status==1) {
//        resData.status = 3;
//        resData.Text = "{\"status\":false}";
//        activity.runOnUiThread(() -> {
//          if (callback!=null)
//            callback.onFinish(resData);
//        });
//      }
//    }
//  };

  public void updateServerVar(boolean showMessage){
    AsyncTask.execute(() -> {
      try {
        File fp = new File(apkTempFile());
        if (fp.delete()) {
          Log.d(_TAG, "TEMP APK FILE DELETED");
        }
        else{
          Log.d(_TAG, "NO TEMP APK FILE");
        }
      }catch(Exception ignored){
      }

      try {
        /* Get Server Data from Github */
        Http http=new Http(
                "https://raw.githubusercontent.com/amarullz/AnimeTV/master/server" +
                ".json?"+System.currentTimeMillis()
        );
        http.execute();
        String serverjson=http.body.toString();
        JSONObject j=new JSONObject(serverjson);
        String update=j.getString("update");
        if (!Conf.SERVER_VER.equals(update)){
          /* Updated */
          Log.d(_TAG,"SERVER-UPDATED: "+serverjson);
          SharedPreferences.Editor ed=pref.edit();
          ed.putString("server-json",serverjson);
          ed.apply();
          initPref();
        }
        else{
          Log.d(_TAG,"SERVER UP TO DATE");
        }

        // BuildConfig.VERSION_CODE
        int appnum=j.getInt("appnum");
        if (appnum>BuildConfig.VERSION_CODE){
          Log.d(_TAG,"NEW APK VERSION AVAILABLE");
          String appurl=j.getString("appurl");
          String appver=j.getString("appver");
          String appnote=j.getString("appnote");
          String appsize=j.getString("appsize");
          Log.d(_TAG,
              "showUpdateDialog = "+appver+" / "+appsize+" / "+appurl+" / "+
                  appnote);
          boolean updateState=pref.getBoolean("update-disable",false);

          if (!updateState || showMessage) {
            activity.runOnUiThread(() -> showUpdateDialog(appurl, appver,
                appnote, appsize));
          }
          else{
            activity.runOnUiThread(() ->
              Toast.makeText(activity,
                  "Update version "+appver+" is available...",
                  Toast.LENGTH_SHORT).show()
            );
          }
        }
        else{
          if (showMessage){
            activity.runOnUiThread(() ->
              Toast.makeText(activity,
                  "AnimeTV already up to date...",
                  Toast.LENGTH_SHORT).show()
            );
          }
          Log.d(_TAG,"APP UP TO DATE");
        }
      }catch(Exception ignored){}
    });
  }

  private String apkTempFile(){
    return activity.getFilesDir() + "/update.apk";
  }
  private void installApk(File apkfile) {
    Intent intent = new Intent(Intent.ACTION_VIEW);
    Uri uri = FileProvider.getUriForFile(activity, activity.getPackageName() +
              ".provider",apkfile);
    List<ResolveInfo> resInfoList =
        activity.getPackageManager().queryIntentActivities(intent,
            PackageManager.MATCH_DEFAULT_ONLY);
    for (ResolveInfo resolveInfo : resInfoList) {
      String packageName = resolveInfo.activityInfo.packageName;
      activity.grantUriPermission(packageName, uri,
          Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
    }
    Intent intentApp = new Intent(Intent.ACTION_INSTALL_PACKAGE);
    intentApp.setData(uri);
    Log.d(_TAG,"INSTALLING APK = "+uri);
    intentApp.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
    activity.startActivity(intentApp);
  }
  public boolean updateIsInProgress=false;
  public boolean startUpdateApk(String url, boolean isNightly){
    if (updateIsInProgress){
      Toast.makeText(activity,
          (isNightly?"Nightly":"Update")+" already on progress",
          Toast.LENGTH_SHORT).show();
      return false;
    }
    updateIsInProgress=true;
    AsyncTask.execute(() -> {
      try {
        Log.d(_TAG,"DOWNLOADING APK = "+url);

        Http http=new Http(url);
        http.execute();

        Log.d(_TAG,"DOWNLOADED APK = "+http.body.size());
        activity.runOnUiThread(() ->
          Toast.makeText(activity,
              (isNightly?"Nightly":"Update")+" has been downloaded ("+((http.body.size()/1024)/1024)+"MB)",
              Toast.LENGTH_SHORT).show()
        );
        String apkpath=apkTempFile();
        FileOutputStream fos = new FileOutputStream(apkpath);
        http.body.writeTo(fos);
        File fp=new File(apkpath);
        installApk(fp);
        updateIsInProgress=false;
      }catch(Exception er){
        activity.runOnUiThread(() ->
          Toast.makeText(activity,
              "Download "+(isNightly?"Nightly ":"")+"Update Failed: "+er,
              Toast.LENGTH_SHORT).show()
        );
        Log.d(_TAG,"DOWNLOAD ERR = "+er);
      }
    });
    return true;
  }

  private void showUpdateDialog(String url, String ver, String changelog,
                                String sz){

    new AlertDialog.Builder(activity)
        .setTitle("Update Available - Version "+ver)
        .setMessage("Download Size : "+sz+"\n\nChangelogs:\n"+changelog)
        .setNegativeButton("Later", (dialogInterface, i) -> {
          SharedPreferences.Editor ed=pref.edit();
          ed.putBoolean("update-disable",false);
          ed.apply();
        })
        .setNeutralButton("Don't Remind Me", (dialogInterface, i) -> {
          SharedPreferences.Editor ed=pref.edit();
          ed.putBoolean("update-disable",true);
          ed.apply();
        })
        .setPositiveButton("Update Now", (dialog, which) -> {
          Toast.makeText(activity,"Downloading Update...",
              Toast.LENGTH_SHORT).show();
          startUpdateApk(url,false);
        }).show();
  }

  public SharedPreferences pref;
  public String prefServer="";
  public void initPref(){
    prefServer=pref.getString("server-json","");
    if (!prefServer.equals("")){
      try {
        JSONObject j=new JSONObject(prefServer);
        Conf.SOURCE_DOMAINS[1]=j.getString("domain");
        Conf.SOURCE_DOMAINS[2]=j.getString("domain2");

        Conf.SERVER_VER=j.getString("update");

        Conf.STREAM_DOMAIN=j.getString("stream_domain");
        Conf.STREAM_DOMAIN1=j.getString("stream_domain1");
        Conf.STREAM_DOMAIN2=j.getString("stream_domain2");

      }catch(Exception ignored){}
    }
    Conf.SOURCE_DOMAIN=pref.getInt("source-domain",Conf.SOURCE_DOMAIN);
    Conf.CACHE_SIZE_MB=pref.getInt("cache-size",Conf.CACHE_SIZE_MB);

    Conf.updateSource(Conf.SOURCE_DOMAIN);
    Log.d(_TAG,"DOMAIN = "+Conf.getDomain()+" / STREAM = "+Conf.STREAM_DOMAIN+" / " +
        "UPDATE = "+Conf.SERVER_VER+" / Source-ID: "+Conf.SOURCE_DOMAIN);
  }

  public void setSourceDomain(int i){
    if (i>=1 && i<Conf.SOURCE_DOMAINS.length) {
      SharedPreferences.Editor ed = pref.edit();
      ed.putInt("source-domain", i);
      ed.apply();
      Conf.updateSource(i);
    }
  }

  public void setCacheSize(int i){
    if ((i<5) || (i>150)){
      i=100;
    }
    Conf.CACHE_SIZE_MB=i;
    SharedPreferences.Editor ed = pref.edit();
    ed.putInt("cache-size", i);
    ed.apply();
    initHttpEngine(activity);
  }

  @SuppressLint("SetJavaScriptEnabled")
  public AnimeApi(Activity mainActivity) {
    activity = mainActivity;

    okCacheDir = activity.getCacheDir().getAbsolutePath();
    Log.d(_TAG,"Cache Dir = "+okCacheDir);

    /* Update Server */
    initHttpEngine(activity);
    updateServerVar(false);

//    webView = new WebView(activity);
//    webView = activity.findViewById(R.id.webview);

    pref = activity.getSharedPreferences("SERVER", Context.MODE_PRIVATE );
    initPref();

    /* Init Bad Request */
    badRequest = new WebResourceResponse("text/plain",
        null, 400, "Bad " +
        "Request", null, null);



    /* Init Webview */
//    webView.setBackgroundColor(0xffffffff);
//    WebSettings webSettings = webView.getSettings();
//    webSettings.setJavaScriptEnabled(true);
//    webSettings.setMediaPlaybackRequiresUserGesture(false);
//    webSettings.setJavaScriptCanOpenWindowsAutomatically(false);
//    webSettings.setSupportMultipleWindows(false);
//    webSettings.setBlockNetworkImage(true);
//    webView.addJavascriptInterface(new JSApi(), "_JSAPI");
//    webView.setWebViewClient(this);
//
//    webSettings.setUserAgentString(Conf.USER_AGENT);
//    webView.loadData(
//          "<html><body>Finish</body></html>","text/html",
//          null
//      );
  }

//  public void getData(String url, Callback cb, long timeout){
//    if (resData.status==1) return;
//    callback=cb;
//    pauseView(false);
//    resData.url=url;
//    resData.status=1;
//    handler.postDelayed(timeoutRunnable, timeout);
//    webView.evaluateJavascript("(window.__EPGET&&window.__EPGET('"+url+"'))" +
//            "?1:0",
//        s -> {
//          Log.d(_TAG,"JAVASCRIPT VAL ["+s+"]");
//          if (s.equals("0")){
//            webView.loadUrl(url);
//          }
//        });
//  }
//  public void getData(String url, Callback cb){
//    getData(url,cb,20000);
//  }

  public void injectString(ByteArrayOutputStream buffer, String inject){
    byte[] injectByte = inject.getBytes();
    buffer.write(injectByte, 0, injectByte.length);
  }

  public void injectJs(ByteArrayOutputStream buffer, String url){
    injectString(buffer, "<script src=\""+url+
        "\"></script>");
  }

  public String getMimeFn(String fn) {
    int extpos=fn.lastIndexOf(".");
    if (extpos>=0) {
      String ex = fn.substring(extpos);
      switch (ex) {
        case ".css":
          return "text/css";
        case ".js":
          return "application/javascript";
        case ".png":
          return "image/png";
        case ".jpg":
          return "image/jpeg";
        case ".html":
          return "text/html";
      }
    }
    return "text/plain";
  }

  public WebResourceResponse assetsRequest(String fn){
    try {
      Log.d(_TAG, "ASSETS="+fn);
      String mime = getMimeFn(fn);
      InputStream is = activity.getAssets().open(fn);
      return new WebResourceResponse(mime,
          null, 200, "OK",
          null, is);
    } catch (IOException ignored) {}
    return badRequest;
  }

  public String assetsString(String fn){
    try {
      StringBuilder sb = new StringBuilder();
      InputStream is = activity.getAssets().open(fn);
      BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8 ));
      String str;
      while ((str = br.readLine()) != null) {
        sb.append(str);
      }
      str=sb.toString();
      br.close();
      return str;
    } catch (IOException ignored) {}
    return "";
  }

  public static String[] parseContentType(String contentType) {
    String[] ret = new String[2];
    ret[0] = "application/octet-stream";
    ret[1] = null;
    if (contentType != null) {
      String[] ctype = contentType.split(";");
      ret[0] = ctype[0].trim();
      if (ctype.length == 2) {
        ret[1] = ctype[1].split("=")[1].trim();
      }
    }
    return ret;
  }

  @SuppressLint("WebViewClientOnReceivedSslError")
  @Override
  public void onReceivedSslError(WebView view, SslErrorHandler handler,
                                 SslError error) {
    handler.proceed();
  }

//  @Override
//  public void onPageFinished(WebView view, String url) {
//    // Make sure inject.js is attached
//    String ijs="(function(){var a=document.createElement('script');a" +
//        ".setAttribute('src','/__inject.js');document.body.appendChild(a);})" +
//        "();";
//    webView.evaluateJavascript(ijs,null);
//  }

//  @Override
//  public WebResourceResponse shouldInterceptRequest(final WebView view,
//                                                    WebResourceRequest request) {
//    Uri uri = request.getUrl();
//    String url = uri.toString();
//    String host = uri.getHost();
//    String accept = request.getRequestHeaders().get("Accept");
//    if (accept==null) return badRequest;
//    if (host==null) return badRequest;
//    if (url.startsWith("data:")) {
//      return super.shouldInterceptRequest(view, request);
//    }
//    else if (accept.startsWith("image/")) return badRequest;
//    else if (host.equals(Conf.SOURCE_DOMAINS[1])) {
//      if (Objects.equals(uri.getPath(), "/__inject.js")){
//        Log.d(_TAG, "WEB-REQ-ASSETS=" + url);
//        return assetsRequest("inject/9anime_inject.js");
//      }
//      if (Conf.HTTP_CLIENT==1) {
//        return super.shouldInterceptRequest(view,request);
//      }
//      return defaultRequest(view, request, "/__inject.js", "text/html");
//    }
//    else if (host.equals(Conf.SOURCE_DOMAINS[2])) {
//      if (Objects.equals(uri.getPath(), "/__inject.js")) {
//        Log.d(_TAG, "WEB-REQ-ASSETS=" + url);
//        return assetsRequest("inject/anix_inject.js");
//      }
//      if (Conf.HTTP_CLIENT==1) {
//        return super.shouldInterceptRequest(view,request);
//      }
//      return defaultRequest(view, request, "/__inject.js", "text/html");
//    }
//    else if (host.equals(Conf.STREAM_DOMAIN)||host.equals(Conf.STREAM_DOMAIN2)){
//      return assetsRequest("inject/9anime_player.html");
//    }
//    else if (host.contains("cloudflare.com")||
//        host.contains("bunnycdn.ru")) {
//      if (!url.endsWith(".woff2")&&!accept.startsWith("text/css")) {
//        Log.d(_TAG, "CDN=>" + url + " - " + accept);
//        if (Conf.PROGRESSIVE_CACHE){
//          return super.shouldInterceptRequest(view,request);
//        }
//        return defaultRequest(view, request);
//      }
//    }
//    return badRequest;
//  }

  public static DnsOverHttps dohClient;
  public static OkHttpClient bootstrapClient;
  public static String okCacheDir=null;

  public static CronetEngine cronetClient=null;
  public static OkHttpClient httpClient=null;
  public static Cache appCache=null;

  public static void initHttpEngine(Context c){
    long disk_cache_size = ((long) Conf.CACHE_SIZE_MB) * 1024 * 1024;
    if (cronetClient!=null){
      try {
        cronetClient.shutdown();
      }catch (Exception ignored){}
      cronetClient=null;
    }

    if (Conf.HTTP_CLIENT==2) {
      try {
        File ccache=new File((okCacheDir!=null)?okCacheDir:"cacheDir","cronet");
        //noinspection ResultOfMethodCallIgnored
        ccache.mkdir();
        CronetEngine.Builder myBuilder =
            new CronetEngine.Builder(c)
//                .enableHttpCache(CronetEngine.Builder.HTTP_CACHE_IN_MEMORY, 819200)
                .setStoragePath(ccache.getAbsolutePath())
                .enableHttpCache(CronetEngine.Builder.HTTP_CACHE_DISK,disk_cache_size)
                .enableHttp2(true)
                .enableQuic(true)
                .enableBrotli(true)
                .enablePublicKeyPinningBypassForLocalTrustAnchors(false)
                .addQuicHint(Conf.SOURCE_DOMAINS[1], 443, 443)
                .addQuicHint(Conf.STREAM_DOMAIN2, 443, 443);
        cronetClient=myBuilder.build();
      }catch (Exception cronetException){
        Log.e(_TAG,"Cronet Init Error",cronetException);
        cronetClient=null;
      }
    }

    appCache = new Cache(new File((okCacheDir!=null)?okCacheDir:"cacheDir",
        "okhttpcache"), disk_cache_size);

    bootstrapClient = new OkHttpClient.Builder().cache(appCache).build();
    dohClient = new DnsOverHttps.Builder().client(bootstrapClient)
        .url(Objects.requireNonNull(HttpUrl.parse("https://1.1.1.1/dns-query")))
        .build();

    if (Conf.USE_DOH) {
      httpClient = bootstrapClient.newBuilder().dns(dohClient).build();
    }
    else{
      httpClient = bootstrapClient.newBuilder().build();
    }
  }
  public static class Http{
    private HttpURLConnection http=null;
    private Request.Builder req=null;
    private Response res=null;
    public ByteArrayOutputStream body=null;
    public String[] ctype=null;

    public boolean nocache=false;
    public Http(String url){
      if (Conf.HTTP_CLIENT>0){
        // Generic HttpURLConnection
        try {
          if (Conf.HTTP_CLIENT==2){
            // Cronet HttpURLConnection
            if (cronetClient!=null){
              try {
                http = (HttpURLConnection) cronetClient.openConnection(
                    new URL(url)
                );
              }catch (Exception ignored){
                http=null;
              }
            }
          }
          if (http==null) {
            // Fallback Generic HttpURLConnection
            URL netConn = new URL(url);
            http = (HttpURLConnection) netConn.openConnection();
          }
          http.setConnectTimeout(5000);
          http.setReadTimeout(10000);
          http.setDoInput(true);
          return;
        }catch(Exception ignored){
          http=null;
        }
      }
      // okHTTP Fallback
      req = new Request.Builder();
      req.url(url);
    }
    public void addHeader(String name, String val){
      /* don't send any X-Requested-With */
      if (name.equalsIgnoreCase("X-Requested-With")){
        if (!val.equalsIgnoreCase("XMLHttpRequest")){
          return;
        }
      }

      if (name.equalsIgnoreCase("Pragma")){
        if (val.equalsIgnoreCase("no-cache")){
          nocache=true;
          Log.d(_TAG,"HTTP-Request no cache");
        }
      }

      if (req!=null) {
        req.addHeader(name, val);
      }
      else if (http!=null){
        http.setRequestProperty(name, val);
      }
    }
    public void setMethod(String method, String body, String cType){
      if (method.equalsIgnoreCase("DELETE")){
        if (req!=null) {
          req.method(method,null);
        }
        else if (http!=null){
          try {
            http.setRequestMethod(method);
          }catch (Exception ignored){}
        }
        return;
      }
      if (req!=null) {
        req.method(method, RequestBody.create(body, MediaType.get(cType)));
      }
      else if (http!=null){
        try {
          http.setRequestMethod(method);
          http.setRequestProperty("Content-Type", cType);
          byte[] bodyByte=body.getBytes();
          http.setRequestProperty("Content-Length", bodyByte.length+"");
          http.setDoOutput(true);
//          Log.d(_TAG,"setMethod = "+method+" / "+cType+" >> "+body);
          OutputStream os = http.getOutputStream();
          os.write(bodyByte);
          os.flush();
          os.close();
        }catch (Exception ignored){}
      }
    }
    public int code(){
      if (res!=null) {
        return res.code();
      }
      else if (http!=null){
        try {
          return http.getResponseCode();
        } catch (IOException ignored) {}
      }
      return 0;
    }
    public void execute() throws Exception{
      if (req!=null) {
        if (httpClient==null){
          if (Conf.USE_DOH) {
            httpClient = bootstrapClient.newBuilder().dns(dohClient).build();
          }
          else{
            httpClient = bootstrapClient.newBuilder().build();
          }
        }
        if (nocache){
          CacheControl cc=new CacheControl.Builder()
              .noCache().noStore().noTransform().immutable().build();
          req.cacheControl(cc);
        }
        res = httpClient.newCall(req.build()).execute();
        body = new ByteArrayOutputStream();
        if (res.body() != null) {
          body.write(Objects.requireNonNull(res.body()).bytes());
        }
        ctype = parseContentType(res.header("Content-Type"));
      }
      else if (http!=null){
        if (nocache){
          http.setUseCaches(false);
        }
        ctype=parseContentType(http.getContentType());
        body = new ByteArrayOutputStream();
        InputStream is=http.getInputStream();
        try {
          int nRead;
          byte[] data = new byte[1024];
          while ((nRead = is.read(data, 0, data.length)) != -1) {
            body.write(data, 0, nRead);
          }
        }catch (Exception ignored){}
      }
    }
  }

  /* Default Fallback HTTP Request */
  public WebResourceResponse defaultRequest(final WebView ignoredView,
                                                    WebResourceRequest request,
                                            String inject, String injectContentType) {
    Uri uri = request.getUrl();
    String url = uri.toString();
    try {
      Http http=new Http(url);

      for (Map.Entry<String, String> entry :
              request.getRequestHeaders().entrySet()) {
        http.addHeader(entry.getKey(), entry.getValue());
      }
      http.execute();

      // Inject
      if (inject!=null) {
        if (injectContentType=="inject-html"){
          injectString(http.body, inject);
        }
        else {
          if (injectContentType == null) {
            injectContentType = "text/html";
          }
          if (http.ctype[0].startsWith(injectContentType)) {
            injectJs(http.body, inject);
          }
        }
      }

      InputStream stream = new ByteArrayInputStream(http.body.toByteArray());
//      Log.d(_TAG,"OKHTTP = "+url+" -> "+http.body.size()+" Bytes");
      return new WebResourceResponse(http.ctype[0], http.ctype[1], stream);
    } catch (Exception e) {
      Log.e(_TAG, "defaultRequest ERR =" + url, e);
    }
    return null;
  }
  public WebResourceResponse defaultRequest(final WebView view,
                                            WebResourceRequest request){
    return defaultRequest(view,request,null,null);
  }

//  public String getMp4Video(String url){
//    String srcjson = "null";
//    try {
//      Http http = new Http(url);
//      http.execute();
//      String mp4src = http.body.toString();
//      int psrcpos = mp4src.indexOf("player.src(");
//      if (psrcpos > 0) {
//        srcjson = mp4src.substring(psrcpos + 11);
//        srcjson = srcjson.substring(0, srcjson.indexOf(");"));
//      }
//    }catch(Exception ignored){}
//    return srcjson;
//  }

//  @Override
//  public boolean shouldOverrideUrlLoading(WebView webView, WebResourceRequest request) {
//    String url = request.getUrl().toString();
//    return (!url.startsWith("https://"+Conf.SOURCE_DOMAINS[1]+"/")&&!url.startsWith(
//        "https://"+Conf.SOURCE_DOMAINS[2]+"/"));
//  }

//  public void pauseView(boolean pause){
//    activity.runOnUiThread(() -> {
//      if (pause) {
//        if (!paused) {
//          paused= true;
//          webView.onPause();
//        }
//      }
//      else if (paused) {
//        paused= false;
//        webView.onResume();
//      }
//    });
//  }

//  public void cleanWebView(){
//    callback=null;
//    handler.removeCallbacks(timeoutRunnable);
//    resData.status = 2;
//    activity.runOnUiThread(() -> {
//      pauseView(false);
//      webView.loadData(
//          "<html><body>Finish</body></html>","text/html",
//          null
//      );
//      pauseView(true);
//    });
//  }

//  public class JSApi{
//    @JavascriptInterface
//    public void result(String res) {
//      if (resData.status==1) {
//        handler.removeCallbacks(timeoutRunnable);
//        resData.status = 2;
//        resData.Text = res;
//        Log.d(_TAG,"GETVIEW: "+res);
//        activity.runOnUiThread(() -> {
//          if (callback!=null)
//            callback.onFinish(resData);
//        });
//        pauseView(true);
//      }
//    }
//
//    @JavascriptInterface
//    public int streamType(){
//      return Conf.STREAM_TYPE;
//    }
//
//    @JavascriptInterface
//    public int streamServer(){
//      return Conf.STREAM_SERVER;
//    }
//    @JavascriptInterface
//    public String dns(){
//      return Conf.getDomain();
//    }
//
//    @JavascriptInterface
//    public String dnsver(){
//      return Conf.SERVER_VER;
//    }
//  }
}

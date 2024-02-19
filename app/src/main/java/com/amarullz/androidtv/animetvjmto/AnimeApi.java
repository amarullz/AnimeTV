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
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import okhttp3.Cache;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.dnsoverhttps.DnsOverHttps;

public class AnimeApi extends WebViewClient {
  private static final String _TAG="ATVLOG-API";

  public static class Result{
    public String Text;
    public int status;
    public String url;
  }
  public interface Callback {
    void onFinish(Result result);
  }
  private final Activity activity;
  public final WebView webView;

  public WebResourceResponse badRequest;

  public boolean paused=false;

  public Callback callback;

  public Result resData=new Result();

  Handler handler = new Handler(Looper.getMainLooper());
  Runnable timeoutRunnable = new Runnable() {
    @Override
    public void run() {
      if (resData.status==1) {
        resData.status = 3;
        resData.Text = "{\"status\":false}";
        activity.runOnUiThread(() -> {
          if (callback!=null)
            callback.onFinish(resData);
        });
      }
    }
  };

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
  private void startUpdateApk(String url){
    AsyncTask.execute(() -> {
      try {
        Log.d(_TAG,"DOWNLOADING APK = "+url);

        Http http=new Http(url);
        http.execute();

        Log.d(_TAG,"DOWNLOADED APK = "+http.body.size());
        activity.runOnUiThread(() ->
          Toast.makeText(activity,
              "Update has been downloaded ("+((http.body.size()/1024)/1024)+"MB)",
              Toast.LENGTH_SHORT).show()
        );
        String apkpath=apkTempFile();
        FileOutputStream fos = new FileOutputStream(apkpath);
        http.body.writeTo(fos);
        File fp=new File(apkpath);
        installApk(fp);
      }catch(Exception er){
        activity.runOnUiThread(() ->
          Toast.makeText(activity,"Update Failed: "+er,
              Toast.LENGTH_SHORT).show()
        );
        Log.d(_TAG,"DOWNLOAD ERR = "+er);
      }
    });
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
          startUpdateApk(url);
        }).show();
  }

  public SharedPreferences pref;
  public String prefServer="";
  public void initPref(){
    prefServer=pref.getString("server-json","");
    if (!prefServer.equals("")){
      try {
        JSONObject j=new JSONObject(prefServer);
        Conf.SOURCE_DOMAIN1=j.getString("domain");
        Conf.STREAM_DOMAIN=j.getString("stream_domain");
        Conf.SERVER_VER=j.getString("update");
        Conf.STREAM_DOMAIN2=j.getString("stream_domain2");
        Conf.SOURCE_DOMAIN2=j.getString("domain2");
      }catch(Exception ignored){}
    }
    Conf.SOURCE_DOMAIN=pref.getInt("source-domain",Conf.SOURCE_DOMAIN);
    Conf.updateSource(Conf.SOURCE_DOMAIN);
    Log.d(_TAG,"DOMAIN = "+Conf.getDomain()+" / STREAM = "+Conf.STREAM_DOMAIN+" / " +
        "UPDATE = "+Conf.SERVER_VER+" / Source-ID: "+Conf.SOURCE_DOMAIN);
  }

  public void setSourceDomain(int i){
    if (i>=1 && i<=2) {
      SharedPreferences.Editor ed = pref.edit();
      ed.putInt("source-domain", i);
      ed.apply();
      Conf.updateSource(i);
    }
  }

  @SuppressLint("SetJavaScriptEnabled")
  public AnimeApi(Activity mainActivity) {
    activity = mainActivity;

    /* Update Server */
    initHttpEngine();
    updateServerVar(false);

    webView = new WebView(activity);
//    webView = activity.findViewById(R.id.webview);

    pref = activity.getSharedPreferences("SERVER", Context.MODE_PRIVATE );
    initPref();

    /* Init Bad Request */
    badRequest = new WebResourceResponse("text/plain",
        null, 400, "Bad " +
        "Request", null, null);



    /* Init Webview */
    webView.setBackgroundColor(0xffffffff);
    WebSettings webSettings = webView.getSettings();
    webSettings.setJavaScriptEnabled(true);
    webSettings.setMediaPlaybackRequiresUserGesture(false);
    webSettings.setJavaScriptCanOpenWindowsAutomatically(false);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      webSettings.setSafeBrowsingEnabled(true);
    }
    webSettings.setSupportMultipleWindows(false);
    webSettings.setBlockNetworkImage(true);
    webView.addJavascriptInterface(new JSApi(), "_JSAPI");
    webView.setWebViewClient(this);

    webSettings.setUserAgentString(Conf.USER_AGENT);
    webView.loadData(
          "<html><body>Finish</body></html>","text/html",
          null
      );
  }

  public void getData(String url, Callback cb, long timeout){
    if (resData.status==1) return;
    callback=cb;
    pauseView(false);
    resData.url=url;
    resData.status=1;
    handler.postDelayed(timeoutRunnable, timeout);
    webView.evaluateJavascript("(window.__EPGET&&window.__EPGET('"+url+"'))" +
            "?1:0",
        s -> {
          Log.d(_TAG,"JAVASCRIPT VAL ["+s+"]");
          if (s.equals("0")){
            webView.loadUrl(url);
          }
        });
  }
  public void getData(String url, Callback cb){
    getData(url,cb,20000);
  }

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

  @Override
  public void onPageFinished(WebView view, String url) {
    // Make sure inject.js is attached
    String ijs="(function(){var a=document.createElement('script');a" +
        ".setAttribute('src','/__inject.js');document.body.appendChild(a);})" +
        "();";
    webView.evaluateJavascript(ijs,null);
  }

  @Override
  public WebResourceResponse shouldInterceptRequest(final WebView view,
                                                    WebResourceRequest request) {
    Uri uri = request.getUrl();
    String url = uri.toString();
    String host = uri.getHost();
    String accept = request.getRequestHeaders().get("Accept");
    if (accept==null) return badRequest;
    if (host==null) return badRequest;
    if (url.startsWith("data:")) {
      return super.shouldInterceptRequest(view, request);
    }
    else if (accept.startsWith("image/")) return badRequest;
    else if (host.contains(Conf.SOURCE_DOMAIN1)) {
      if (Objects.equals(uri.getPath(), "/__inject.js")){
        Log.d(_TAG, "WEB-REQ-ASSETS=" + url);
        return assetsRequest("inject/9anime_inject.js");
      }
      return defaultRequest(view, request, "/__inject.js", "text/html");
    }
    else if (host.contains(Conf.SOURCE_DOMAIN2)) {
      if (Objects.equals(uri.getPath(), "/__inject.js")) {
        Log.d(_TAG, "WEB-REQ-ASSETS=" + url);
        return assetsRequest("inject/anix_inject.js");
      }
      return defaultRequest(view, request, "/__inject.js", "text/html");
    }
    else if (host.contains(Conf.STREAM_DOMAIN)||host.contains(Conf.STREAM_DOMAIN2)){
      return assetsRequest("inject/9anime_player.html");
    }
    else if (host.contains("cloudflare.com")||
        host.contains("bunnycdn.ru")) {
      if (!url.endsWith(".woff2")&&!accept.startsWith("text/css")) {
        Log.d(_TAG, "CDN=>" + url + " - " + accept);
        if (Conf.PROGRESSIVE_CACHE){
          return super.shouldInterceptRequest(view,request);
        }
        return defaultRequest(view, request);
      }
    }
    return badRequest;
  }



  public static OkHttpClient httpClient;
  public static DnsOverHttps dohClient;
  public static void initHttpEngine(){
    Cache appCache = new Cache(new File("cacheDir", "okhttpcache"), 100 * 1024 * 1024);
    OkHttpClient bootstrapClient = new OkHttpClient.Builder().cache(appCache).build();
    dohClient=new DnsOverHttps.Builder().client(bootstrapClient)
            .url(Objects.requireNonNull(HttpUrl.parse("https://1.1.1.1/dns-query")))
            .build();
    httpClient = bootstrapClient.newBuilder().dns(dohClient).build();
  }
  public static class Http{
    public Request.Builder req;
    public Response res=null;
    public ByteArrayOutputStream body=null;
    public String[] ctype=null;
    public Http(String url){
      req = new Request.Builder();
      req.url(url);
    }
    public void addHeader(String name, String val){
      req.addHeader(name,val);
    }
    public void execute() throws Exception{
      res = httpClient.newCall(req.build()).execute();
      body=new ByteArrayOutputStream();
      if (res.body() != null){
        body.write(res.body().bytes());
      }
      ctype = parseContentType(res.header("Content-Type"));
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
        if (injectContentType==null){
          injectContentType="text/html";
        }
        if (http.ctype[0].startsWith(injectContentType)) {
          injectJs(http.body, inject);
        }
      }

      InputStream stream = new ByteArrayInputStream(http.body.toByteArray());
      Log.d(_TAG,"OKHTTP = "+url+" -> "+http.body.size()+" Bytes");
      return new WebResourceResponse(http.ctype[0], http.ctype[1], stream);
    } catch (Exception e) {
      Log.e(_TAG, "OKHTTP ERR =" + url, e);
    }
    return null;
  }
  public WebResourceResponse defaultRequest(final WebView view,
                                            WebResourceRequest request){
    return defaultRequest(view,request,null,null);
  }

  public String getMp4Video(String url){
    String srcjson = "null";
    try {
      Http http = new Http(url);
      http.execute();
      String mp4src = http.body.toString();
      int psrcpos = mp4src.indexOf("player.src(");
      if (psrcpos > 0) {
        srcjson = mp4src.substring(psrcpos + 11);
        srcjson = srcjson.substring(0, srcjson.indexOf(");"));
      }
    }catch(Exception ignored){}
    return srcjson;
  }

  @Override
  public boolean shouldOverrideUrlLoading(WebView webView, WebResourceRequest request) {
    String url = request.getUrl().toString();
    return (!url.startsWith("https://"+Conf.SOURCE_DOMAIN1+"/")&&!url.startsWith(
        "https://"+Conf.SOURCE_DOMAIN2+"/"));
  }

  public void pauseView(boolean pause){
    activity.runOnUiThread(() -> {
      if (pause) {
        if (!paused) {
          paused= true;
          webView.onPause();
        }
      }
      else if (paused) {
        paused= false;
        webView.onResume();
      }
    });
  }

  public void cleanWebView(){
    callback=null;
    handler.removeCallbacks(timeoutRunnable);
    resData.status = 2;
    activity.runOnUiThread(() -> {
      pauseView(false);
      webView.loadData(
          "<html><body>Finish</body></html>","text/html",
          null
      );
      pauseView(true);
    });
  }

  public class JSApi{
    @JavascriptInterface
    public void result(String res) {
      if (resData.status==1) {
        handler.removeCallbacks(timeoutRunnable);
        resData.status = 2;
        resData.Text = res;
        Log.d(_TAG,"GETVIEW: "+res);
        activity.runOnUiThread(() -> {
          if (callback!=null)
            callback.onFinish(resData);
        });
        pauseView(true);
      }
    }

    @JavascriptInterface
    public int streamType(){
      return Conf.STREAM_TYPE;
    }

    @JavascriptInterface
    public int streamServer(){
      return Conf.STREAM_SERVER;
    }
    @JavascriptInterface
    public String dns(){
      return Conf.getDomain();
    }

    @JavascriptInterface
    public String dnsver(){
      return Conf.SERVER_VER;
    }
  }
}

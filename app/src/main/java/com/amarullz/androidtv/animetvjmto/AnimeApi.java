package com.amarullz.androidtv.animetvjmto;

import android.app.Activity;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.chromium.net.CronetEngine;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

public class AnimeApi extends WebViewClient {
  public static class Result{
    public String Text;
    public int status;
    public String url;
  }
  public interface Callback {
    void onFinish(Result result);
  }
  private Activity activity;
  private WebView webView;
  private CronetEngine cronet;
  public WebResourceResponse badRequest;

  public Callback callback;

  Result resData=new Result();

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

  public AnimeApi(Activity mainActivity) {
    activity = mainActivity;
    webView = new WebView(activity);
    // webView = activity.findViewById(R.id.webview);

    /* Setup Cronet HTTP+QUIC Client */
    CronetEngine.Builder myBuilder =
        new CronetEngine.Builder(activity)
            .enableHttpCache(CronetEngine.Builder.HTTP_CACHE_IN_MEMORY, 819200)
            .enableHttp2(true)
            .enableQuic(true)
            .enableBrotli(true)
            .enablePublicKeyPinningBypassForLocalTrustAnchors(false)
            .addQuicHint("9anime.to", 443, 443);
    cronet = myBuilder.build();

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
    webSettings.setSafeBrowsingEnabled(false);
    webSettings.setSupportMultipleWindows(false);
    webView.addJavascriptInterface(new JSApi(), "_JSAPI");
    webView.setWebViewClient(this);
    cleanWebView();
    // webView.loadUrl("https://9anime.to/watch/edomae-elf.02qm7/ep-8");
  }

  public boolean getData(String url, Callback cb, long timeout){
    if (resData.status==1) return false;
    callback=cb;
    resData.url=url;
    resData.status=1;
    handler.postDelayed(timeoutRunnable, timeout);
    webView.evaluateJavascript("(window.__EPGET&&window.__EPGET('"+url+"'))" +
            "?1:0",
        s -> {
          Log.d("ATVLOG","JAVASCRIPT VAL ["+s+"]");
          if (s.equals("0")){
            webView.loadUrl(url);
          }
        });
    return true;
  }
  public boolean getData(String url, Callback cb){
    return getData(url,cb,10000);
  }

  public HttpURLConnection initQuic(String url, String method) throws IOException {
    HttpURLConnection conn =
        (HttpURLConnection) cronet.openConnection(new URL(url));
    conn.setRequestMethod(method);
    conn.setConnectTimeout(5000);
    conn.setReadTimeout(5000);
    conn.setDoOutput(false);
    conn.setDoInput(true);
    return conn;
  }

  public ByteArrayOutputStream getBody(HttpURLConnection conn,
                                       ByteArrayOutputStream buffer) throws IOException {
    if (buffer == null) buffer = new ByteArrayOutputStream();
    InputStream is = conn.getInputStream();
    int nRead;
    byte[] data = new byte[1024];
    while ((nRead = is.read(data, 0, data.length)) != -1) {
      buffer.write(data, 0, nRead);
    }
    return buffer;
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
      if (ex.equals(".css")) return "text/css";
      else if (ex.equals(".js")) return "application/javascript";
      else if (ex.equals(".png")) return "image/png";
      else if (ex.equals(".jpg")) return "image/jpeg";
      else if (ex.equals(".html")) return "text/html";
    }
    return "text/plain";
  }

  public WebResourceResponse assetsRequest(String fn){
    try {
      Log.d("ATVLOG", "ASSETS="+fn);
      String mime = getMimeFn(fn);
      InputStream is = activity.getAssets().open(fn);
      return new WebResourceResponse(mime,
          null, 200, "OK",
          null, is);
    } catch (IOException e) {}
    return badRequest;
  }

  public String[] parseContentType(String contentType) {
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

  @Override
  public void onReceivedSslError(WebView view, SslErrorHandler handler,
                                 SslError error) {
    handler.proceed();
  }

  @Override
  public WebResourceResponse shouldInterceptRequest(final WebView view,
                                                    WebResourceRequest request) {
    Uri uri = request.getUrl();
    String url = uri.toString();
    String host = uri.getHost();
    String accept = request.getRequestHeaders().get("Accept");
    if (url.startsWith("data:")) {
      return super.shouldInterceptRequest(view, request);
    }
    else if (accept.startsWith("image/")) return badRequest;
    else if (host.contains("9anime.to")) {
      if (uri.getPath().equals("/__inject.js")){
        return assetsRequest("inject/9anime_inject.js");
      }
      try {
        HttpURLConnection conn = initQuic(url, request.getMethod());

        for (Map.Entry<String, String> entry :
            request.getRequestHeaders().entrySet()) {
          conn.setRequestProperty(entry.getKey(), entry.getValue());
        }
        String[] cType = parseContentType(conn.getContentType());
        ByteArrayOutputStream buffer = getBody(conn, null);
        if (cType[0].startsWith("text/html")) {
          Log.d("ATVLOG",
              "QUIC==>" + url + " - " + accept);
          injectJs(buffer, "/__inject.js");
        }

        InputStream stream = new ByteArrayInputStream(buffer.toByteArray());
        return new WebResourceResponse(cType[0], cType[1], stream);
      } catch (Exception e) {
        Log.d("ATVLOG", "QUIC-ERR=" + url + " - " + e.toString());
      }
    }
    else if (host.contains("mp4upload.com")||host.contains("vizcloud.co")||host.contains("mcloud.to")){
      return assetsRequest("inject/9anime_player.html");
    }
    else if (host.contains("cloudflare.com")||
        host.contains("bunnycdn.ru")) {
      if (!url.endsWith(".woff2")) {
        return super.shouldInterceptRequest(view, request);
      }
    }
    return badRequest;
  }

  public String getMp4Video(String url){
    String srcjson = "null";
    try {
      HttpURLConnection conn = initQuic(url, "GET");
      ByteArrayOutputStream buffer = getBody(conn, null);
      String mp4src = buffer.toString();
      int psrcpos = mp4src.indexOf("player.src(");
      if (psrcpos > 0) {
        srcjson = mp4src.substring(psrcpos + 11);
        srcjson = srcjson.substring(0, srcjson.indexOf(");"));
      }
    }catch(Exception e){}
    return srcjson;
  }

  @Override
  public boolean shouldOverrideUrlLoading(WebView webView, WebResourceRequest request) {
    String url = request.getUrl().toString();
    if (url.startsWith("https://9anime.to/")) {
      return false;
    }
    return true;
  }

  public void cleanWebView(){
    activity.runOnUiThread(() -> {
      webView.loadData(
          "<html><body>Finish</body></html>","text/html",
          null
      );
    });
  }

  public class JSApi{
    @JavascriptInterface
    public void result(String res) {
      if (resData.status==1) {
        handler.removeCallbacks(timeoutRunnable);
        resData.status = 2;
        resData.Text = res;
        activity.runOnUiThread(() -> {
          if (callback!=null)
            callback.onFinish(resData);
        });
      }
    }
  }
}

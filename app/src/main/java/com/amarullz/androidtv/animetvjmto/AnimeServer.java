package com.amarullz.androidtv.animetvjmto;

import android.app.Activity;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import fi.iki.elonen.NanoHTTPD;

public class AnimeServer extends NanoHTTPD {
  private Activity activity;
  public final static int PORT=28080;

  public static String getIPAddress(boolean useIPv4) {
    try {
      List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
      for (NetworkInterface intf : interfaces) {
        List<InetAddress> addrs = Collections.list(intf.getInetAddresses());
        for (InetAddress addr : addrs) {
          if (!addr.isLoopbackAddress()) {
            String sAddr = addr.getHostAddress();
            boolean isIPv4 = sAddr.indexOf(':')<0;

            if (useIPv4) {
              if (isIPv4)
                return sAddr;
            } else {
              if (!isIPv4) {
                int delim = sAddr.indexOf('%'); // drop ip6 zone suffix
                return delim<0 ? sAddr.toUpperCase() : sAddr.substring(0, delim).toUpperCase();
              }
            }
          }
        }
      }
    } catch (Exception ignored) { } // for now eat exceptions
    return "";
  }

  public static String getProxyUrl(String url){
    if (url.endsWith("#dash")){
      return "http://"+getIPAddress(true)+":"+PORT+"/D/"+url;
    }
    else if (url.contains("vidco.pro")||
        url.contains("netmagcdn.pro")||
        url.contains("m3u8.justchill.workers.dev")){
      return url;
    }
    return "http://"+getIPAddress(true)+":"+PORT+"/"+url;
  }

  public AnimeServer(Activity act) {
    super(PORT);
    activity=act;
    Log.d("ATVLOG","VIDSTREAM - IP:"+getIPAddress(true));
  }

  public MainActivity me(){
    return (MainActivity) activity;
  }

  private String oldOrigin="";
  public static String exportString="";

  @Override
  public Response serve(IHTTPSession session) {
    Response rs=null;
    InputStream is;
    StringBuilder out = new StringBuilder();
    String my_uri = session.getUri();

    boolean isdash=my_uri.startsWith("/D/https://");
    if (isdash){
      my_uri=my_uri.substring(2);
    }

    if (my_uri.startsWith("/export.csv")) {
      rs = newFixedLengthResponse(new Response.IStatus() {
        @Override
        public String getDescription() {
          return "OK";
        }
        @Override
        public int getRequestStatus() {
          return 200;
        }
      }, "text/csv", exportString);
      rs.addHeader("Content-disposition",
          "attachment;filename=AnimeTV-Export.csv");
    }
    else if (my_uri.startsWith("/https://")) {
      try {
        // session.getQueryParameterString()
        String urlTarget=my_uri.substring(1);
        String ps=session.getQueryParameterString();
        if (ps!=null && !ps.equals("")){
          urlTarget+="?"+ps;
        }
        Log.d("ATVLOG","VIDSTREAM - REQSRV: "+urlTarget);

        HttpURLConnection http=null;
        URL netConn = new URL(urlTarget);

        if (Conf.HTTP_CLIENT==2){
          if (AnimeApi.cronetClient!=null){
            try {
              http =
                  (HttpURLConnection) AnimeApi.cronetClient.openConnection(netConn);
            }catch (Exception ignored){
              http=null;
            }
          }
        }
        if (http==null) {
          http = (HttpURLConnection) netConn.openConnection();
        }

        if (session.getMethod()==Method.OPTIONS) {
          http.setRequestMethod("OPTIONS");
          Log.d("ATVLOG","VIDSTREAM - REQSRV METHOD: OPTIONS");
        }
//        http.setConnectTimeout(8000);
        http.setChunkedStreamingMode(1024);

        for (Map.Entry<String, String> entry :
            session.getHeaders().entrySet()) {
          if (!entry.getKey().equalsIgnoreCase("host") &&
              !entry.getKey().equalsIgnoreCase("referer") &&
              !entry.getKey().equalsIgnoreCase("origin")&&
              !entry.getKey().equalsIgnoreCase("User-Agent")&&
              !entry.getKey().equalsIgnoreCase("remote-addr")&&
              !entry.getKey().equalsIgnoreCase("http-client-ip")&&
              !entry.getKey().equalsIgnoreCase("cast-device-capabilities")) {
            http.setRequestProperty(entry.getKey(), entry.getValue());

            Log.d("ATVLOG",
                "VIDSTREAM - REQSRV-HDR: "+entry.getKey()+": "+entry.getValue());
          }
        }
        http.setRequestProperty("User-Agent", Conf.USER_AGENT);

        String host=netConn.getHost();
        int prt=netConn.getPort();
        if (host.contains(Conf.STREAM_DOMAIN2)){
          http.setRequestProperty("Origin", "https://" + Conf.STREAM_DOMAIN2);
          http.setRequestProperty("Referer", "https://" + Conf.STREAM_DOMAIN2+"/");
        }
        else if (host.contains("mp4upload.com")){
          http.setRequestProperty("Origin", "https://"+host);
          http.setRequestProperty("Referer", "https://www.mp4upload.com/");
        }
        else if (host.contains(Conf.STREAM_DOMAIN)){
          http.setRequestProperty("Origin", "https://" + Conf.STREAM_DOMAIN);
        }
        else if (host.contains(Conf.STREAM_DOMAIN)){
          http.setRequestProperty("Origin", "https://" + Conf.STREAM_DOMAIN);
        }
        else if (host.contains(Conf.STREAM_DOMAIN1) || Conf.SOURCE_DOMAIN<3){
          http.setRequestProperty("Origin", "https://" + Conf.STREAM_DOMAIN1);
          http.setRequestProperty("Referer", "https://" + Conf.STREAM_DOMAIN1+"/");
        }
        else if (host.contains(Conf.STREAM_DOMAIN3)){
          http.setRequestProperty("Origin", "https://" + Conf.STREAM_DOMAIN3);
        }
        else if (host.contains(Conf.STREAM_DOMAIN4)){
          http.setRequestProperty("Origin", "https://"+Conf.STREAM_DOMAIN4);
        }
        else if (isdash){
          Log.d("ATVLOG","VIDSTREAM - IS VIDCOPRE ");
          http.setRequestProperty("Origin", "https://vidco.pro");
        }
        else {
          String[] h = netConn.getHost().split("\\.");
          String h2 = h[h.length - 2] + "." + h[h.length - 1];
          if (prt!=80){
            http.setRequestProperty("Origin", "https://" + h2+":"+prt);
          }
          else {
            http.setRequestProperty("Origin", "https://" + h2);
          }
        }

        final int http_code=http.getResponseCode();
        Log.d("ATVLOG","VIDSTREAM - HTTPCODE: "+http_code);
        final String http_message=http.getResponseMessage();

        if (isdash){
          ByteArrayOutputStream body = new ByteArrayOutputStream();
          InputStream ist=http.getInputStream();
          try {
            int nRead;
            byte[] data = new byte[1024];
            while ((nRead = ist.read(data, 0, data.length)) != -1) {
              body.write(data, 0, nRead);
            }
          }catch (Exception ignored){}
          String dstr=body.toString("utf-8");
          dstr=dstr.replace("https://",
              "http://"+getIPAddress(true)+":"+PORT+"/https://"
          );
          rs = newFixedLengthResponse(new Response.IStatus() {
                                        @Override
                                        public String getDescription() {
                                          return http_message;
                                        }

                                        @Override
                                        public int getRequestStatus() {
                                          return http_code;
                                        }
                                      },
              http.getContentType(), dstr);
        }
        else {
          rs = newChunkedResponse(new Response.IStatus() {
                                    @Override
                                    public String getDescription() {
                                      return http_message;
                                    }

                                    @Override
                                    public int getRequestStatus() {
                                      return http_code;
                                    }
                                  },
              http.getContentType(),
              http.getInputStream()
          );
        }
        if (rs!=null) {
          for (Map.Entry<String, List<String>> entry :
              http.getHeaderFields().entrySet()) {
            List<String> vals = entry.getValue();
            String k=entry.getKey();
            if (!k.equalsIgnoreCase("content-type")&&
                !k.equalsIgnoreCase("Connection")&&
                !k.equalsIgnoreCase("Content-Encoding")&&
                !k.equalsIgnoreCase("Transfer-Encoding")&&
                !k.equalsIgnoreCase("Date")&&
                !k.equalsIgnoreCase("Access-Control-Allow-Origin")&&
                !k.equalsIgnoreCase("Access-Control-Allow-Methods")) {
              for (int i = 0; i < vals.size(); i++) {
                rs.addHeader(k, vals.get(i));
              }
            }
          }
          rs.addHeader("Access-Control-Allow-Origin", "*");
          Log.d("ATVLOG","VIDSTREAM - REQSRV-Ctype: "+http.getContentType());
        }
      } catch (IOException e) {
        Log.d("ATVLOG","VIDSTREAM - HTTP ERR: ",e);
      }
    }

    if (rs==null){
      rs = newFixedLengthResponse(new Response.IStatus() {
        @Override
        public String getDescription() {
          return "NOTFOUND";
        }
        @Override
        public int getRequestStatus() {
          return 404;
        }
      }, "text/plain", "NOT FOUND");
    }
    return rs;
  }
}

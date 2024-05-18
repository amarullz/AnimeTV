package com.amarullz.androidtv.animetvjmto;

import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.media.MediaMetadata;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.SystemClock;
import android.util.Log;
import android.view.Display;
import android.view.KeyEvent;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;
import androidx.media.session.MediaButtonReceiver;
import androidx.media3.common.util.UnstableApi;

import java.io.File;
import java.io.IOException;

@UnstableApi /*
 * Main Activity class that loads {@link MainFragment}.
 */
public class MainActivity extends FragmentActivity {
  public AnimeView aView;
  public static String ARG_URL=null;
  public static String ARG_TIP=null;
  public static String ARG_POS=null;
  public static String ARG_SD=null;

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    aView.setFullscreen(newConfig.orientation);
  }

  public void updateInstance(Bundle savedInstanceState){
    /* Load Arguments */
    if (savedInstanceState == null) {
      Bundle extras = getIntent().getExtras();
      if(extras != null) {
        ARG_URL= extras.getString("viewurl");
        ARG_TIP= extras.getString("viewtip");
        ARG_POS=extras.getString("viewpos");
        ARG_SD=extras.getString("viewsd");
      }
      else{
        ARG_URL=null;
        ARG_TIP=null;
        ARG_POS=null;
      }
    } else {
      ARG_URL= (String) savedInstanceState.getSerializable("viewurl");
      ARG_TIP= (String) savedInstanceState.getSerializable("viewtip");
      ARG_POS= (String) savedInstanceState.getSerializable("viewpos");
      ARG_SD= (String) savedInstanceState.getSerializable("viewsd");
    }
  }

  public void initLogcat(){
    if (ContextCompat.checkSelfPermission(this,
        android.Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.READ_EXTERNAL_STORAGE}, 1);
    }
    if (ContextCompat.checkSelfPermission(this, android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(this, new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
      Toast.makeText(this,"Please restart app after accepting permission...",
          Toast.LENGTH_LONG).show();
    }
    else {
      try {
        String fn = Environment.getExternalStorageDirectory() +
            "/animetv-logcat.txt";
        Log.d("DEBUG-LOGCAT", fn);
        File filename = new File(fn);
        //noinspection ResultOfMethodCallIgnored
        filename.createNewFile();
        String cmd = "logcat -f " + filename.getAbsolutePath();
        Runtime.getRuntime().exec(cmd);
      } catch (IOException e) {
        Log.d("DEBUG-LOGCAT", "Error Exec - " + e);
      }
    }
  }

  private void initRefreshRate(){
    if (getPackageManager().hasSystemFeature(PackageManager.FEATURE_TOUCHSCREEN)) {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        Window w = getWindow();
        WindowManager.LayoutParams p = w.getAttributes();
        Display.Mode[] modes = getDisplay().getSupportedModes();
        Display.Mode cmode = getDisplay().getMode();
        Log.d("ATVLOG",
            "Current Mode "+cmode.getModeId()+" : " + cmode.getPhysicalWidth() + "x"+cmode.getPhysicalHeight()+"@"+cmode.getRefreshRate()+"hz");

        //find display mode with max hz
        int maxMode = -1;
        float maxHZ = 60f;
        for (Display.Mode m : modes) {
          Log.d("ATVLOG",
              "Mode "+m.getModeId()+" : " + m.getPhysicalWidth() + "x"+m.getPhysicalHeight()+"@"+m.getRefreshRate()+"hz");
          if (cmode.getPhysicalHeight() == m.getPhysicalHeight() && cmode.getPhysicalWidth() == m.getPhysicalWidth()) {
            if (cmode.getRefreshRate() <= m.getRefreshRate()) {
              maxHZ = m.getRefreshRate();
              maxMode = m.getModeId();
            }
          }
        }
        if (maxMode>-1){
          p.preferredDisplayModeId = maxMode;
          w.setAttributes(p);
          Log.d("ATVLOG", "Max Mode Value : " + maxHZ + "hz");
        }
      }
      Log.d("ATVLOG", "Have Touch Screen");
    }
    else{
      Log.d("ATVLOG", "No Touch Screen");
    }
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
//     initLogcat();

    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    setContentView(R.layout.activity_main);

    initRefreshRate();
    initBluetooth();
    updateInstance(savedInstanceState);
    aView=new AnimeView(this);
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if ((keyCode == KeyEvent.KEYCODE_BACK) && aView.webView.canGoBack()) {
      aView.webView.goBack();
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }

  private boolean sendKeyEvent(int code, int evtype){
    int c=0;
    boolean send = (evtype == KeyEvent.ACTION_DOWN);
//    RED = 183
//    GREEN = 184
//    YELLOW = 185
//    BLUE = 186
//    PROG UP = 166
//    PROG DOWN = 167
//    EXIT = 4
//    0-9 = 7 - 16
//    INFO = 165
//    TTX = 233
//    EPG = 172
    switch(code){
      case KeyEvent.KEYCODE_ESCAPE:
      case KeyEvent.KEYCODE_BACK: c=27; break;

      case KeyEvent.KEYCODE_DPAD_UP: c=38; break;
      case KeyEvent.KEYCODE_DPAD_DOWN: c=40; break;
      case KeyEvent.KEYCODE_DPAD_LEFT: c=37; break;
      case KeyEvent.KEYCODE_DPAD_RIGHT: c=39; break;

      case KeyEvent.KEYCODE_ENTER:
      case KeyEvent.KEYCODE_DPAD_CENTER:
        c=send?13:1013;
        send=true;
        break;

      case KeyEvent.KEYCODE_CHANNEL_UP: /* 166 */
      case KeyEvent.KEYCODE_PAGE_UP: c=33; break;

      case KeyEvent.KEYCODE_CHANNEL_DOWN: /* 167 */
      case KeyEvent.KEYCODE_PAGE_DOWN: c=34; break;

      case KeyEvent.KEYCODE_PROG_BLUE:
      case KeyEvent.KEYCODE_F5:
        if (send){
          aView.reloadView();
        }
        break;
      case KeyEvent.KEYCODE_MEDIA_PAUSE:
      case KeyEvent.KEYCODE_MEDIA_PLAY:
      case KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE:
        c = 402;
        break;

      case KeyEvent.KEYCODE_MEDIA_STEP_FORWARD:
      case KeyEvent.KEYCODE_MEDIA_SKIP_FORWARD:
      case KeyEvent.KEYCODE_MEDIA_NEXT: c=403; break;

      case KeyEvent.KEYCODE_MEDIA_STEP_BACKWARD:
      case KeyEvent.KEYCODE_MEDIA_SKIP_BACKWARD:
      case KeyEvent.KEYCODE_MEDIA_PREVIOUS: c=401; break;
      case KeyEvent.KEYCODE_FORWARD_DEL: c=8; break;

      case KeyEvent.KEYCODE_INFO:
      case KeyEvent.KEYCODE_F1:
      case KeyEvent.KEYCODE_PROG_RED:
      case KeyEvent.KEYCODE_F10:
      case KeyEvent.KEYCODE_MENU: c=93; break;
    }
    if (code>=KeyEvent.KEYCODE_0 && code<=KeyEvent.KEYCODE_9){
      c=48+(code-KeyEvent.KEYCODE_0);
    }

    if (c==402 && send){
      if (lastPlayPause<System.currentTimeMillis()){
        lastPlayPause=System.currentTimeMillis()+1100;
      }
      else{
        send=false;
      }
    }
    if (c>0&&aView.webViewReady) {
      if (send) {
        aView.webView.evaluateJavascript(
            "try{ window._KEYEV(" + c + ");}catch(e){}", null
        );
      }
      return true;
    }
    return false;
  }

  @SuppressLint("RestrictedApi")
  @Override
  public boolean dispatchKeyEvent(KeyEvent event) {
    if (sendKeyEvent(event.getKeyCode(),event.getAction())){
      return false;
    }
    return super.dispatchKeyEvent(event);
  }

  @Override
  protected void onStop() {
    aView.updatePlayNext();
    super.onStop();
  }

  @Override
  protected void onStart() {
    super.onStart();
    aView.onStartPause(true);
  }

  @Override
  protected void onPause() {
    aView.onStartPause(false);
    super.onPause();
  }

  @Override
  protected void onSaveInstanceState(@NonNull Bundle outState)
  {
    aView.onSaveRestore(true,outState);
    super.onSaveInstanceState(outState);
  }
  @Override
  protected void onRestoreInstanceState(@NonNull Bundle savedInstanceState)
  {
    aView.onSaveRestore(false,savedInstanceState);
    super.onRestoreInstanceState(savedInstanceState);
  }

  @Override
  protected void onNewIntent(Intent intent){
    super.onNewIntent(intent);
    ARG_URL= intent.getStringExtra("viewurl");
    ARG_TIP= intent.getStringExtra("viewtip");
    ARG_POS= intent.getStringExtra("viewpos");
    aView.updateArgs();
  }

  /* BLUETOOTH MEDIA KEY HANDLER */
  public MediaSession mSession=null;

  public void mediaExec(String cmd, long p){
    if (cmd.equals("pause")||cmd.equals("play")){
      if (lastPlayPause<System.currentTimeMillis()){
        lastPlayPause=System.currentTimeMillis()+1100;
      }
      else{
        return;
      }
    }
    runOnUiThread(()->{
      try {
        if (aView!=null && aView.webView!=null && aView.webViewReady) {
          aView.webView.evaluateJavascript("try{pb.vid_cmd('"+cmd+"',"+p+");" +
              "}catch(e){}", null);
        }
      }catch(Exception ignored){}
    });
  }

  public long lastPlayPause=0;
  public void initBluetooth(){
    try {
      mSession = new MediaSession(this, getPackageName());
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        ComponentName mediaButtonReceiver = new ComponentName(this,
            MediaButtonReceiver.class);
        mSession.setMediaButtonBroadcastReceiver(mediaButtonReceiver);
      } else {
        Intent mediaButtonIntent = new Intent(Intent.ACTION_MEDIA_BUTTON, null,
            getApplicationContext(), MediaButtonReceiver.class);
        mSession.setMediaButtonReceiver(
            PendingIntent.getBroadcast(
                getApplicationContext(), 0,
                mediaButtonIntent, PendingIntent.FLAG_IMMUTABLE
            )
        );
      }
      mSession.setFlags(
          MediaSession.FLAG_HANDLES_MEDIA_BUTTONS |
              MediaSession.FLAG_HANDLES_TRANSPORT_CONTROLS
      );

      mSession.setCallback(new MediaSession.Callback() {
        @Override
        public boolean onMediaButtonEvent(Intent mediaButtonEvent) {
          KeyEvent keyEvent = (KeyEvent) mediaButtonEvent.getExtras().get(Intent.EXTRA_KEY_EVENT);
          if (keyEvent != null) {
            sendKeyEvent(keyEvent.getKeyCode(), keyEvent.getAction());
          }
          return super.onMediaButtonEvent(mediaButtonEvent);
        }

        @Override
        public void onPlay() {
          Log.d("ATVLOG_MEDIA","MEDIA-SESSION ONPLAY");
          mediaExec("play",0);
          super.onPlay();
        }

        @Override
        public void onPause() {
          Log.d("ATVLOG_MEDIA","MEDIA-SESSION ONPAUSE");
          mediaExec("pause",0);
          super.onPause();
        }

        @Override
        public void onSkipToNext() {
          Log.d("ATVLOG_MEDIA","MEDIA-SESSION onSkipToNext");
          sendKeyEvent(KeyEvent.KEYCODE_MEDIA_NEXT, KeyEvent.ACTION_DOWN);
          sendKeyEvent(KeyEvent.KEYCODE_MEDIA_NEXT, KeyEvent.ACTION_UP);
          super.onSkipToNext();
        }

        @Override
        public void onSkipToPrevious() {
          Log.d("ATVLOG_MEDIA","MEDIA-SESSION onSkipToPrevious");
          sendKeyEvent(KeyEvent.KEYCODE_MEDIA_PREVIOUS, KeyEvent.ACTION_DOWN);
          sendKeyEvent(KeyEvent.KEYCODE_MEDIA_PREVIOUS, KeyEvent.ACTION_UP);
          super.onSkipToPrevious();
        }

        @Override
        public void onStop() {
          Log.d("ATVLOG_MEDIA","MEDIA-SESSION ONSTOP");
          mediaExec("pause",0);
          super.onStop();
        }

        @Override
        public void onSeekTo(long pos) {
          mediaExec("seek",pos/1000);
          super.onSeekTo(pos);
        }

      });
    }catch (Exception ignored){
      mSession=null;
    }
  }

  public long _metaPosition=0;
  public int _metaState=0;
  public boolean _metaHaveNext=false;
  public boolean _metaHavePrev=false;
  public float _metaSpeed=1f;

  public void mediaSetPrevNext(boolean haveNext, boolean havePrev) {
    _metaHaveNext=haveNext;
    _metaHavePrev=havePrev;
    Log.d("ATVLOG_MEDIA","mediaSetPrevNext="+_metaHaveNext+" / "+_metaHavePrev);
    updateMediaState();
  }

  public void mediaSetState(int mediaState,long pos) {
    _metaState=mediaState;
    _metaPosition=pos;
    Log.d("ATVLOG_MEDIA","mediaSetState="+mediaState+" / "+pos);
    updateMediaState();
  }

  public void mediaSetPosition(long pos) {
    _metaPosition=pos;
    Log.d("ATVLOG_MEDIA","mediaSetPosition="+pos);
    updateMediaState();
  }

  public void mediaSetSpeed(float s) {
    _metaSpeed=s;
    Log.d("ATVLOG_MEDIA","mediaSetSpeed="+s);
    updateMediaState();
  }

  public void updateMediaState(){
    if (mSession==null){
      return;
    }
    try {
      PlaybackState state = new PlaybackState.Builder()
          .setActions(
              PlaybackState.ACTION_PLAY_PAUSE |
                  PlaybackState.ACTION_PLAY |
                  PlaybackState.ACTION_PAUSE |
                  (_metaHaveNext?PlaybackState.ACTION_SKIP_TO_NEXT:0L) |
                  (_metaHavePrev?PlaybackState.ACTION_SKIP_TO_PREVIOUS:0L) |
                  PlaybackState.ACTION_SEEK_TO
          )
          .setState(_metaState, _metaPosition, _metaSpeed,
              SystemClock.elapsedRealtime())
          .build();
      mSession.setPlaybackState(state);
    } catch (Exception ignored) {
    }
  }

  public long _metaDuration=-1L;
  public String _metaTitle="";
  public String _metaArtist="";
  public String _metaUrl="";

  public void mediaSetDuration(long duration){
    _metaDuration=(duration<0)?-1L:duration;
    Log.d("ATVLOG_MEDIA","mediaSetDuration="+_metaDuration);
    updateMetadata();
  }

  public void mediaSetMeta(String title, String artist, String url) {
    _metaTitle=title;
    _metaArtist=artist;
    _metaUrl=url;
    Log.d("ATVLOG_MEDIA","mediaSetMeta="+title);
    updateMetadata();
  }
  public void updateMetadata(){
    if (mSession==null){
      return;
    }
    try {
      MediaMetadata.Builder b=new MediaMetadata.Builder();
      b.putString(MediaMetadata.METADATA_KEY_DISPLAY_TITLE, _metaTitle+" - "+_metaArtist);
      b.putString(MediaMetadata.METADATA_KEY_TITLE, _metaTitle);
      b.putString(MediaMetadata.METADATA_KEY_ARTIST, _metaArtist);
      b.putString(MediaMetadata.METADATA_KEY_ALBUM_ART_URI, _metaUrl);
      b.putString(MediaMetadata.METADATA_KEY_ART_URI, _metaUrl);
      b.putLong(MediaMetadata.METADATA_KEY_DURATION, _metaDuration);
      mSession.setMetadata(b.build());
    } catch (Exception ignored) {
    }
  }
}
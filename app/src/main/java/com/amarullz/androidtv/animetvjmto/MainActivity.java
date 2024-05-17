package com.amarullz.androidtv.animetvjmto;

import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
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
import java.util.Timer;
import java.util.TimerTask;

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
        //find display mode with max hz
        int maxMode = 0;
        float maxHZ = 60f;
        int maxWidth = 240;
        for (Display.Mode m : modes) {
          if (maxWidth <= m.getPhysicalHeight()) {
            maxWidth = m.getPhysicalWidth();
            if (maxHZ <= m.getRefreshRate()) {
              maxHZ = m.getRefreshRate();
              maxMode = m.getModeId();
            }
          }
        }
        p.preferredDisplayModeId = maxMode;
        w.setAttributes(p);
        Log.d("ATVLOG", "Max Mode Value : " + maxWidth + "@" + maxHZ + "hz");
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
        if (mSession==null){
          c=402;
        }
        break;
      case 402:
        c=402; break;

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
//    Log.d("KEYEV","Code = "+code+" / "+evtype);
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
    mediaButtonStop();
    aView.updatePlayNext();
    super.onStop();
  }

  @Override
  protected void onStart() {
    super.onStart();
    aView.onStartPause(true);
    mediaButtonStart();
  }

  @Override
  protected void onPause() {
    mediaButtonStop();
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
  public Timer mediaButtonTimer=null;
  public int mediaCurrentState=PlaybackState.STATE_PAUSED;
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
      mSession.setActive(true);
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
//          Log.d("KEYEV","ONPLAY");
          sendKeyEvent(402, KeyEvent.ACTION_DOWN);
          sendKeyEvent(402, KeyEvent.ACTION_UP);
          mediaCurrentState=PlaybackState.STATE_PLAYING;
          mediaSetState();
          super.onPlay();
        }

        @Override
        public void onPause() {
//          Log.d("KEYEV","ONPAUSE");
          sendKeyEvent(402, KeyEvent.ACTION_DOWN);
          sendKeyEvent(402, KeyEvent.ACTION_UP);
          mediaCurrentState=PlaybackState.STATE_PAUSED;
          mediaSetState();
          super.onPause();
        }

      });
    }catch (Exception ignored){
      mSession=null;
    }
  }
  public void mediaSetState(){
    try {
      PlaybackState state = new PlaybackState.Builder()
          .setActions(
              PlaybackState.ACTION_PLAY_PAUSE |
                  PlaybackState.ACTION_PLAY |
                  PlaybackState.ACTION_PAUSE |
                  PlaybackState.ACTION_SKIP_TO_NEXT |
                  PlaybackState.ACTION_SKIP_TO_PREVIOUS |
                  PlaybackState.ACTION_FAST_FORWARD |
                  PlaybackState.ACTION_REWIND
          )
          .setState(mediaCurrentState, 0, 1f,
              SystemClock.elapsedRealtime())
          .build();
      mSession.setPlaybackState(state);
    } catch (Exception ignored) {
    }
  }
  public void mediaButtonStop(){
    if (mediaButtonTimer!=null) {
      mediaButtonTimer.cancel();
      mediaButtonTimer=null;
    }
  }
  public void mediaButtonStart(){
    if (mediaButtonTimer!=null) {
      mediaButtonTimer.cancel();
      mediaButtonTimer=null;
    }
    if (mSession!=null) {
      TimerTask mediaButtonTask = new TimerTask() {
        @Override
        public void run() {
          mediaSetState();

        }
      };
      mediaButtonTimer = new Timer();
      mediaButtonTask.run();
      mediaButtonTimer.scheduleAtFixedRate(mediaButtonTask, 0, 10000);
    }
  }
}
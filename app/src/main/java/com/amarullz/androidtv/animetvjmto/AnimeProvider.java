package com.amarullz.androidtv.animetvjmto;

import android.annotation.SuppressLint;
import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.VectorDrawable;
import android.icu.util.Calendar;
import android.icu.util.TimeZone;
import android.media.tv.TvContract;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.tvprovider.media.tv.Channel;
import androidx.tvprovider.media.tv.ChannelLogoUtils;
import androidx.tvprovider.media.tv.PreviewProgram;
import androidx.tvprovider.media.tv.TvContractCompat;
import androidx.tvprovider.media.tv.WatchNextProgram;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;



public class AnimeProvider {
    private static final String _TAG="ATVLOG-CHANNEL";

    private static final String[] CHANNELS_PROJECTION = {
            TvContractCompat.Channels._ID,
            TvContract.Channels.COLUMN_DISPLAY_NAME,
            TvContractCompat.Channels.COLUMN_BROWSABLE
    };
    private static final String[] PROGRAM_PROJECTION = {
            TvContractCompat.Programs._ID,
            TvContract.Programs.COLUMN_CHANNEL_ID,
            TvContract.Programs.COLUMN_TITLE
    };

    private static final String[] PLAYNEXT_PROJECTION = {
            TvContractCompat.WatchNextPrograms._ID,
            TvContract.WatchNextPrograms.COLUMN_INTENT_URI,
            TvContract.WatchNextPrograms.COLUMN_TITLE
    };
    public interface RecentCallback {
        void onFinish(String result);
    }
    private final Context ctx;
    private long CHANNEL_ID;

    public static void executeJob(Context c){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            // Recently Updated Anime
            AnimeProvider recentProvider = new AnimeProvider(
                c,
                "Recent",
                "AnimeTV",
                R.drawable.splash
            );
            recentProvider.startLoadRecent();

            // Trending Anime
            AnimeProvider trendingProvider = new AnimeProvider(
                c,
                "Trending",
                "AnimeTV_Trending",
                R.drawable.splash
            );
            trendingProvider.startLoadAnilist(TRENDING_ANIME_GRAPHQL);

            // Popular Anime
            AnimeProvider popularProvider = new AnimeProvider(
                c,
                "Popular",
                "AnimeTV_Popular",
                R.drawable.splash
            );
            popularProvider.startLoadAnilist(POPULAR_ANIME_GRAPHQL);

            scheduleJob(c);
        }
    }

    public static void scheduleJob(Context context) {
        Log.d(_TAG,"SCHEDULING JOB");
        ComponentName serviceComponent = new ComponentName(context, ChannelService.class);
        JobInfo.Builder builder = new JobInfo.Builder(0, serviceComponent);
        builder.setMinimumLatency(3600 * 1000); // Wait at least 30s
        builder.setOverrideDeadline(3800 * 1000); // Maximum delay 60s
        JobScheduler jobScheduler = (JobScheduler)context.getSystemService(Context.JOB_SCHEDULER_SERVICE);
        jobScheduler.schedule(builder.build());
    }

    public void startLoadRecent(){
        if (CHANNEL_ID<1) return;
        try {
            loadRecent(result -> {
                try {
                    JSONArray ja = new JSONArray(result);
                    if (ja.length() > 0) {
                        clearPrograms();
                        for (int i = 0; i < ja.length(); i++) {
                            try {
                                JSONObject o = ja.getJSONObject(i);
                                String uri = o.getString("url");
                                String title = o.getString("title");
                                String poster = o.getString("poster");
                                String tip = o.getString("tip");
                                String ep = o.getString("ep");
                                String desc = o.getString("ep");
                                addProgram(title, desc, poster, uri, tip);
                            } catch (Exception ignored) {
                            }
                        }
                    }
                } catch (JSONException ignored) {
                }
                Log.d(_TAG, "RES = " + result);
            });
        }catch (Exception ignored){}
    }

    public AnimeProvider(Context c, String channelName, String internalProviderId, int logoResourceId) {
        ctx = c;
        AnimeApi.initHttpEngine(c);
        try {
            CHANNEL_ID = initChannel(channelName, internalProviderId, logoResourceId);
        } catch (Exception ex) {
            CHANNEL_ID = -1;
            Log.d(_TAG, ex.toString());
        }
    }

    public void loadRecent(RecentCallback cb){
        AsyncTask.execute(() ->loadRecentExec(cb));
    }

    private void parseRecent(JSONArray r, String buf) throws JSONException {
        JSONObject jo = new JSONObject(buf);
        JSONArray rs = jo.getJSONObject("data")
                        .getJSONObject("Page")
                        .getJSONArray("airingSchedules");

        List<JSONObject> animeList = new ArrayList<>();

        for (int i = 0; i < rs.length(); i++) {
            try {
                JSONObject airingSchedule = rs.getJSONObject(i);
                JSONObject med = airingSchedule.getJSONObject("media");
                if (med.getBoolean("isAdult")){
                    continue;
                }
                JSONObject medT = med.getJSONObject("title");
                String en = medT.isNull("english") ? "" : medT.getString("english");
                String jp = medT.isNull("romaji") ? "" : medT.getString("romaji");
                JSONObject medI = med.getJSONObject("coverImage");
                String img = medI.getString("extraLarge");
                String format = med.isNull("format") ? "" : med.getString("format");
                if (format.equalsIgnoreCase("TV_SHORT")) {
                    format = "TV";
                }
                int ep = med.isNull("episodes") ? 0 : med.getInt("episodes");
                long id = med.getLong("id");
                int popularity = med.isNull("popularity") ? 0 : med.getInt("popularity");
                int score = med.isNull("averageScore") ? 0 : med.getInt("averageScore");
                JSONObject d = new JSONObject("{}");
                d.put("url", id + "/" + ep);
                d.put("title", en.isEmpty() ? jp : en);
                d.put("poster", img);
                if (format.equals("MOVIE") || ep == 0) {
                d.put("ep", "Score: " + score + "  |  " + format);
                } else {
                d.put("ep", ep + " " + " Episodes  |  Score: " + score + "  |  " + format);
                }
                d.put("type", format);
                d.put("tip", id);
                d.put("popularity", popularity);
                animeList.add(d);
            } catch (JSONException ignored) {
            }
        }

        // Sort anime by popularity
        Collections.sort(animeList, new Comparator<JSONObject>() {
            @Override
            public int compare(JSONObject a, JSONObject b) {
                try {
                    return Integer.compare(b.getInt("popularity"), a.getInt("popularity"));
                } catch (JSONException e) {
                    return 0;
                }
            }
        });

        for (JSONObject anime : animeList) {
            r.put(anime);
        }
    }

    private static String ANILIST_GRAPHQL ="{\"query\":\"query ($tm: Int, " +
        "$page: Int, $perPage: Int){ Page(page: $page, perPage: $perPage) { " +
        "pageInfo { perPage hasNextPage currentPage } airingSchedules" +
        "(airingAt_lesser:$tm,sort:TIME_DESC){ airingAt episode " +
        "timeUntilAiring media{ id isAdult "+
        "title{ romaji english } coverImage{ extraLarge " +
        "} episodes format popularity averageScore } } } }\",\"variables\":{\"tm\":0xFFFFFF," +
        "\"page\":1,\"perPage\":50}}";

    /* Get latest updated sub */
    private void loadRecentExec(RecentCallback cb){
        try {
            AnimeApi.Http http=new AnimeApi.Http("https://graphql.anilist.co/");
            http.addHeader("Accept","application/json");

            long unixTime = System.currentTimeMillis() / 1000L;
            String postData = ANILIST_GRAPHQL.replace(
                "0xFFFFFF",unixTime+"");
            http.setMethod("POST",postData,"application/json");
            http.execute();

            JSONArray r=new JSONArray("[]");
            parseRecent(r,http.body.toString());

            cb.onFinish(r.toString());

            if (r.length()>0) {
                Log.d(_TAG,"GOT RECENTS => "+r.length());
                cb.onFinish(r.toString());
                return;
            }
        }catch(Exception ignored){}
        cb.onFinish("");
    }

    private static String POPULAR_ANIME_GRAPHQL = "{\"query\":\"query ($page: Int, $perPage: Int){ " +
        "Page(page: $page, perPage: $perPage) { " +
        "pageInfo { perPage hasNextPage currentPage } " +
        "media(sort:POPULARITY_DESC,isAdult:false, type: ANIME, status_not_in:[HIATUS,CANCELLED,NOT_YET_RELEASED]) { " +
        "id title{ romaji english } " +
        "coverImage{ large } " +
        "episodes format averageScore " +
        "} } }\",\"variables\":{\"page\":1,\"perPage\":50}}";

    private static String TRENDING_ANIME_GRAPHQL = "{\"query\":\"query " +
        "($page: Int, $perPage: Int){ " +
        "Page(page: $page, perPage: $perPage) { " +
        "pageInfo { perPage hasNextPage currentPage } " +
        "media(sort:TRENDING_DESC,isAdult:false, type: ANIME, status:RELEASING) {" +
        "id title{ romaji english } " +
        "coverImage{ large } " +
        "episodes format averageScore " +
        "} } }\",\"variables\":{\"page\":1,\"perPage\":50}}";

    public void startLoadAnilist(String graphQl) {
        if (CHANNEL_ID < 1) return;
        try {
            loadAnilist(graphQl, result -> {
                try {
                    JSONArray ja = new JSONArray(result);
                    if (ja.length() > 0) {
                        clearPrograms();
                        for (int i = 0; i < ja.length(); i++) {
                            try {
                                JSONObject o = ja.getJSONObject(i);
                                String uri = o.getString("url");
                                String title = o.getString("title");
                                String poster = o.getString("poster");
                                String tip = o.getString("tip");
                                String ep = o.getString("ep");
                                String desc = o.getString("ep");
                                addProgram(title, desc, poster, uri, tip);
                            } catch (Exception ignored) {
                            }
                        }
                    }
                } catch (JSONException ignored) {
                }
                Log.d(_TAG, "Popular Anime RES = " + result);
            });
        } catch (Exception ignored) {}
    }

    public void loadAnilist(String graphQl, RecentCallback cb) {
        AsyncTask.execute(() -> loadAnilistExec(graphQl, cb));
    }

    private void loadAnilistExec(String graphQl, RecentCallback cb) {
        try {
            AnimeApi.Http http = new AnimeApi.Http("https://graphql.anilist.co/");
            http.addHeader("Accept", "application/json");

            http.setMethod("POST", graphQl, "application/json");
            http.execute();

            JSONArray r = new JSONArray("[]");
            parsePopular(r, http.body.toString());

            cb.onFinish(r.toString());

            if (r.length() > 0) {
                Log.d(_TAG, "GOT POPULAR ANIME => " + r.length());
                cb.onFinish(r.toString());
                return;
            }
        } catch (Exception ignored) {}
        cb.onFinish("");
    }

    private void parsePopular(JSONArray r, String buf) throws JSONException {
        JSONObject jo = new JSONObject(buf);
        JSONArray rs = jo.getJSONObject("data")
                        .getJSONObject("Page")
                        .getJSONArray("media");

        List<JSONObject> animeList = new ArrayList<>();

        for (int i = 0; i < rs.length(); i++) {
            try {
                JSONObject media = rs.getJSONObject(i);
                JSONObject medT = media.getJSONObject("title");
                String en = medT.isNull("english") ? "" : medT.getString("english");
                String jp = medT.isNull("romaji") ? "" : medT.getString("romaji");
                JSONObject medI = media.getJSONObject("coverImage");
                String img = medI.getString("large");
                String format = media.isNull("format") ? "" : media.getString("format");
                int ep = media.isNull("episodes") ? 0 : media.getInt("episodes");
                int score = media.isNull("averageScore") ? 0 : media.getInt("averageScore");
                long id = media.getLong("id");

                JSONObject d = new JSONObject("{}");
                d.put("url", id + "/" + ep);
                d.put("title", en.isEmpty() ? jp : en);
                d.put("poster", img);
                if (format.equals("MOVIE") || ep == 0) {
                d.put("ep", "Score: " + score + "  |  " + format);
                } else {
                d.put("ep", ep + " " + " Episodes  |  Score: " + score + "  |  " + format);
                }
                d.put("type", format);
                d.put("tip", id);
                animeList.add(d);
            } catch (JSONException ignored) {
            }
        }

        for (JSONObject anime : animeList) {
            r.put(anime);
        }
    }

    /* Drawable to bitmap */
    @NonNull
    public static Bitmap convertToBitmap(Context context, int resourceId) {
        Drawable drawable = context.getDrawable(resourceId);
        if (drawable instanceof VectorDrawable) {
            Bitmap bitmap =
                    Bitmap.createBitmap(
                            drawable.getIntrinsicWidth(),
                            drawable.getIntrinsicHeight(),
                            Bitmap.Config.ARGB_8888);
            Canvas canvas = new Canvas(bitmap);
            drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
            drawable.draw(canvas);
            return bitmap;
        }

        return BitmapFactory.decodeResource(context.getResources(), resourceId);
    }

    /* Create Channel */
    private long initChannel(String channelName, String internalProviderId, int logoResourceId) {
        long existingChannelId = findExistingChannelId(internalProviderId);
        if (existingChannelId != -1) {
            return existingChannelId;
        }

        Intent myIntent = new Intent(ctx, MainActivity.class);
        myIntent.setPackage(ctx.getPackageName());
        Uri intentUri = Uri.parse(myIntent.toUri(Intent.URI_ANDROID_APP_SCHEME));

        Channel ch = new Channel.Builder()
                .setType(TvContractCompat.Channels.TYPE_PREVIEW)
                .setDisplayName(channelName)
                .setInternalProviderId(internalProviderId)
                .setAppLinkIntentUri(intentUri)
                .build();

        Uri uri = ctx.getContentResolver().insert(TvContract.Channels.CONTENT_URI, ch.toContentValues());
        Log.d(_TAG, "Created Channel = " + uri);

        long channelId = ContentUris.parseId(uri);
        Log.d(_TAG, "channel id " + channelId);

        Bitmap bitmap = convertToBitmap(ctx, logoResourceId);
        ChannelLogoUtils.storeChannelLogo(ctx, channelId, bitmap);

        return channelId;
    }

    private long findExistingChannelId(String internalProviderId) {
        try {
            Uri channelUri = TvContractCompat.Channels.CONTENT_URI;
            String[] projection = {
                TvContractCompat.Channels._ID,
                TvContractCompat.Channels.COLUMN_INTERNAL_PROVIDER_ID
            };

            Cursor cursor = ctx.getContentResolver().query(
                channelUri,
                projection,
                null,
                null,
                null
            );

            if (cursor != null) {
                int idColumnIndex = cursor.getColumnIndex(TvContractCompat.Channels._ID);
                int providerIdColumnIndex = cursor.getColumnIndex(TvContractCompat.Channels.COLUMN_INTERNAL_PROVIDER_ID);

                while (cursor.moveToNext()) {
                    String storedProviderId = cursor.getString(providerIdColumnIndex);
                    if (internalProviderId.equals(storedProviderId)) {
                        long channelId = cursor.getLong(idColumnIndex);
                        Log.d(_TAG, "Found existing channel ID: " + channelId);
                        cursor.close();
                        return channelId;
                    }
                }
                cursor.close();
            }
        } catch (Exception e) {
            Log.e(_TAG, "Error finding channel", e);
        }
        return -1;
    }

    @SuppressLint("RestrictedApi")
    private void clearPrograms() {
        Cursor cursor =
                ctx.getContentResolver()
                        .query(
                                TvContractCompat.PreviewPrograms.CONTENT_URI,
                                PROGRAM_PROJECTION,
                                null,
                                null,
                                null);
        if (cursor != null && cursor.moveToFirst()) {
            int c=0;
            do {
                PreviewProgram prog = PreviewProgram.fromCursor(cursor);
                if (prog.getChannelId()==CHANNEL_ID) {
                    ctx.getContentResolver()
                            .delete(
                                    TvContractCompat.buildPreviewProgramUri(prog.getId()),
                                    null,
                                    null);
                    c++;
                }
            } while (cursor.moveToNext());
            Log.d(_TAG, "Cleanup " + c+" Programs");
        }
    }

    @SuppressLint("RestrictedApi")
    private void addProgram(String title, String desc, String image, String uri, String tip) {
        PreviewProgram.Builder builder = new PreviewProgram.Builder();
        @SuppressLint("UnsafeOptInUsageError") Intent myIntent = new Intent(ctx, MainActivity.class);
        myIntent.setPackage(ctx.getPackageName());
        myIntent.putExtra("viewurl", /*"https://aniwave.to"+*/ uri);
        myIntent.putExtra("viewtip", tip);
        myIntent.putExtra("viewsd", "1");
        myIntent.putExtra("viewpos", "0");
        Uri intentUri= Uri.parse(myIntent.toUri(Intent.URI_ANDROID_APP_SCHEME));
        builder.setChannelId(CHANNEL_ID)
                .setType(TvContractCompat.PreviewProgramColumns.TYPE_TV_EPISODE)
                .setTitle(title)
                .setDescription(desc)
                .setPosterArtAspectRatio(TvContractCompat.PreviewPrograms.ASPECT_RATIO_2_3)
                .setPosterArtUri(Uri.parse(image))
                .setIntentUri(intentUri);
        PreviewProgram previewProgram = builder.build();
        ctx.getContentResolver().insert(
                                TvContractCompat.PreviewPrograms.CONTENT_URI,
                                previewProgram.toContentValues());
    }

    @SuppressLint("RestrictedApi")
    public static void clearPlayNext(Context c) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            /* Clear Watch Next */
            try {
                Cursor cursor =
                        c.getContentResolver()
                                .query(
                                        TvContractCompat.WatchNextPrograms.CONTENT_URI,
                                        PLAYNEXT_PROJECTION,
                                        null,
                                        null,
                                        null);
                if (cursor != null && cursor.moveToFirst()) {
                    do {
                        WatchNextProgram wn = WatchNextProgram.fromCursor(cursor);
                        c.getContentResolver()
                                .delete(
                                        TvContractCompat.buildWatchNextProgramUri(wn.getId()),
                                        null,
                                        null);
                    } while (cursor.moveToNext());
                }
            } catch (Exception ignored) {
            }
        }
    }

    @SuppressLint("RestrictedApi")
    public static void setPlayNext(
            Context c,String title, String desc,
            String poster, String uri, String tip,
            int pos, int duration, int sd){
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            try {
                clearPlayNext(c);
                @SuppressLint("UnsafeOptInUsageError") Intent myIntent = new Intent(c, MainActivity.class);
                myIntent.setPackage(c.getPackageName());
                myIntent.putExtra("viewurl", uri);
                myIntent.putExtra("viewtip", tip);
                myIntent.putExtra("viewsd", sd+"");
                myIntent.putExtra("viewpos", pos + "");
                Uri intentUri = Uri.parse(myIntent.toUri(Intent.URI_ANDROID_APP_SCHEME));
                WatchNextProgram.Builder builder = new WatchNextProgram.Builder();
                builder.setType(TvContractCompat.WatchNextPrograms.TYPE_MOVIE)
                        .setWatchNextType(TvContractCompat.WatchNextPrograms.WATCH_NEXT_TYPE_CONTINUE)
                        .setDurationMillis(duration * 1000)
                        .setLastPlaybackPositionMillis(pos * 1000)
                        .setLastEngagementTimeUtcMillis(Calendar.getInstance(TimeZone.getTimeZone("UTC")).getTimeInMillis())
                        .setTitle(title)
                        .setDescription(desc)
                        .setPosterArtUri(Uri.parse(poster))
                        .setIntentUri(intentUri);
                Uri watchNextProgramUri = c.getContentResolver()
                        .insert(TvContractCompat.WatchNextPrograms.CONTENT_URI, builder.build().toContentValues());
                Log.d(_TAG, "New Watch Next Update = " + watchNextProgramUri);
            } catch (Exception ignored) {
            }
        }
    }
}

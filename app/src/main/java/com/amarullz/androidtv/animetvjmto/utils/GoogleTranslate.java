package com.amarullz.androidtv.animetvjmto.utils;

import java.util.List;
import java.util.ArrayList;
import java.net.URL;
import java.net.HttpURLConnection;
import java.net.URLEncoder;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import org.json.JSONArray;
import android.util.Log;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

public class GoogleTranslate {
    private static final String TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single";
    private static final int MAX_RETRIES = 3;
    private static final int MAX_CHUNK_SIZE = 500; // Reduced for better processing
    private static Map<String, String> translationCache = new ConcurrentHashMap<>();
    
    public static String translate(String sourceLang, String targetLang, String text) {
        if (text == null || text.trim().isEmpty()) {
            return text;
        }

        // Check cache first
        String cacheKey = sourceLang + "|" + targetLang + "|" + text.trim();
        if (translationCache.containsKey(cacheKey)) {
            return translationCache.get(cacheKey);
        }

        // Remove special characters that may interfere with translation
        text = cleanTextForTranslation(text);

        // Splits text into smaller chunks
        List<String> chunks = splitIntoChunks(text);
        StringBuilder fullTranslation = new StringBuilder();

        for (String chunk : chunks) {
            String translatedChunk = translateChunk(sourceLang, targetLang, chunk);
            if (translatedChunk != null) {
                fullTranslation.append(translatedChunk).append(" ");
            }
        }

        String result = fullTranslation.toString().trim();
        
        // Store in cache if translation was successful
        if (!result.equals(text)) {
            translationCache.put(cacheKey, result);
        }

        return result;
    }

    private static String cleanTextForTranslation(String text) {
        // Remove characters that may interfere with translation
        return text.replaceAll("\\{[^}]*\\}", " ")  // Remove formatting tags
                  .replaceAll("\\s+", " ")          // Normalize spaces
                  .trim();
    }

    private static String translateChunk(String sourceLang, String targetLang, String text) {
        int retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                URL url = new URL(TRANSLATE_URL +
                    "?client=gtx&sl=" + sourceLang +
                    "&tl=" + targetLang +
                    "&dt=t&q=" + URLEncoder.encode(text, "UTF-8"));
                
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestProperty("User-Agent", "Mozilla/5.0");
                conn.setConnectTimeout(10000);  // Increased timeout
                conn.setReadTimeout(10000);     // Increased timeout
                
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
                    
                    StringBuilder response = new StringBuilder();
                    String line;
                    
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    
                    JSONArray jsonArray = new JSONArray(response.toString());
                    if (jsonArray.length() > 0) {
                        JSONArray translationArray = jsonArray.getJSONArray(0);
                        StringBuilder translatedText = new StringBuilder();
                        
                        for (int i = 0; i < translationArray.length(); i++) {
                            JSONArray lineArray = translationArray.getJSONArray(i);
                            if (lineArray.length() > 0) {
                                String translatedLine = lineArray.getString(0);
                                if (translatedLine != null && !translatedLine.trim().isEmpty()) {
                                    translatedText.append(translatedLine);
                                }
                            }
                        }
                        
                        String result = translatedText.toString().trim();
                        if (!result.isEmpty() && !result.equals(text)) {
                            return result;
                        }
                    }
                }
            } catch (Exception e) {
                Log.e("ATVLOG", "Erro na tradução: " + e.getMessage());
                retries++;
                if (retries < MAX_RETRIES) {
                    try {
                        Thread.sleep(1000 * retries);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }
        return text;
    }

    private static List<String> splitIntoChunks(String text) {
        List<String> chunks = new ArrayList<>();
        String[] sentences = text.split("(?<=[.!?])\\s+");
        StringBuilder currentChunk = new StringBuilder();

        for (String sentence : sentences) {
            if (currentChunk.length() + sentence.length() > MAX_CHUNK_SIZE && currentChunk.length() > 0) {
                chunks.add(currentChunk.toString().trim());
                currentChunk = new StringBuilder();
            }
            currentChunk.append(sentence).append(" ");
        }

        if (currentChunk.length() > 0) {
            chunks.add(currentChunk.toString().trim());
        }

        return chunks;
    }
}
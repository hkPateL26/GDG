package com.nagrikseva.ai;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;
import com.getcapacitor.Plugin;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "PaymentAndSchemePlugin")
public class PaymentAndSchemePlugin extends Plugin {

    @Override
    public void load() {
        super.load();
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setLoadsImagesAutomatically(true);
                settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
                settings.setSupportMultipleWindows(false);
                settings.setJavaScriptCanOpenWindowsAutomatically(true);

                // Ensure 1:1 mobile scaling (fixes tiny UI issues)
                settings.setUseWideViewPort(false);
                settings.setLoadWithOverviewMode(false);
                settings.setTextZoom(100);
                settings.setSupportZoom(false);
                settings.setBuiltInZoomControls(false);

                // Native User Agent identifier
                String ua = settings.getUserAgentString();
                if (ua != null && !ua.contains("NagrikSevaNativeAndroid")) {
                    settings.setUserAgentString(ua + " NagrikSevaNativeAndroid");
                }
            }
        } catch (Exception e) {
            // Safe fallback
        }
    }

    @Override
    public Boolean shouldOverrideLoad(Uri url) {
        if (url == null) return null;
        String scheme = url.getScheme();
        if (scheme == null) return null;
        scheme = scheme.toLowerCase();
        String urlStr = url.toString();
        Context ctx = getActivity() != null ? getActivity() : getContext();

        // 1. UPI Payment Protocols (Google Pay, PhonePe, Paytm, BHIM, CRED, Navi, etc.)
        if (scheme.equals("upi") || scheme.equals("paytmmp") ||
            scheme.equals("gpay") || scheme.equals("phonepe") ||
            scheme.equals("bhim") || scheme.equals("credpay") ||
            scheme.equals("mobikwik") || scheme.equals("whatsapp")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, url);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                ctx.startActivity(intent);
                return Boolean.TRUE;
            } catch (ActivityNotFoundException e) {
                // If vendor-specific scheme failed, fallback to generic upi://
                if (!scheme.equals("upi")) {
                    try {
                        String genericUpi = "upi" + urlStr.substring(scheme.length());
                        Intent fallbackIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(genericUpi));
                        fallbackIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        ctx.startActivity(fallbackIntent);
                        return Boolean.TRUE;
                    } catch (Exception ignored) {}
                }

                try {
                    Intent chooser = Intent.createChooser(new Intent(Intent.ACTION_VIEW, url), "UPI એપ્લિકેશન પસંદ કરો");
                    chooser.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    ctx.startActivity(chooser);
                    return Boolean.TRUE;
                } catch (Exception ex) {
                    Toast.makeText(ctx, "તમારા ફોનમાં કોઈ UPI એપ (Google Pay / PhonePe / Paytm) મળેલ નથી.", Toast.LENGTH_LONG).show();
                    return Boolean.TRUE;
                }
            }
        }

        // 2. Android Intent URIs (intent://...)
        if (scheme.equals("intent")) {
            try {
                Intent intent = Intent.parseUri(urlStr, Intent.URI_INTENT_SCHEME);
                if (intent != null) {
                    PackageManager pm = ctx.getPackageManager();
                    if (intent.resolveActivity(pm) != null) {
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        ctx.startActivity(intent);
                        return Boolean.TRUE;
                    }
                    String fallbackUrl = intent.getStringExtra("browser_fallback_url");
                    if (fallbackUrl != null && (fallbackUrl.startsWith("http://") || fallbackUrl.startsWith("https://"))) {
                        if (getBridge() != null && getBridge().getWebView() != null) {
                            getBridge().getWebView().post(() -> getBridge().getWebView().loadUrl(fallbackUrl));
                        }
                        return Boolean.TRUE;
                    }
                }
            } catch (Exception e) {
                // Ignore parse errors
            }
            return Boolean.TRUE;
        }

        // 3. Play Store Market Links (market://...)
        if (scheme.equals("market")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, url);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                ctx.startActivity(intent);
                return Boolean.TRUE;
            } catch (Exception e) {
                return Boolean.TRUE;
            }
        }

        // 4. Razorpay, Payment Gateways & Banking Portals -> Keep inside the WebView!
        if (scheme.equals("http") || scheme.equals("https")) {
            String host = url.getHost();
            if (host != null) {
                host = host.toLowerCase();
                if (host.contains("razorpay.com") ||
                    host.contains("billdesk.com") ||
                    host.contains("payu.in") ||
                    host.contains("hdfcbank.com") ||
                    host.contains("icicibank.com") ||
                    host.contains("sbi.co.in") ||
                    host.contains("onlinesbi") ||
                    host.contains("axisbank.com") ||
                    host.contains("kotak.com") ||
                    host.contains("bankofbaroda.in") ||
                    host.contains("npci.org.in") ||
                    host.contains("vercel.app")) {
                    return Boolean.FALSE; // Stay inside WebView
                }
            }
        }

        return null; // Defer to default Capacitor navigation policy
    }
}

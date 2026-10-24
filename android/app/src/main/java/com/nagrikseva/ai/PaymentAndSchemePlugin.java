package com.nagrikseva.ai;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.webkit.CookieManager;
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
                settings.setSupportMultipleWindows(true);
                settings.setJavaScriptCanOpenWindowsAutomatically(true);

                // Enable Third-Party Cookies (Mandatory for Razorpay & Bank 3DS OTP verification)
                CookieManager cookieManager = CookieManager.getInstance();
                cookieManager.setAcceptCookie(true);
                cookieManager.setAcceptThirdPartyCookies(webView, true);

                // Ensure 1:1 mobile scaling
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

    /**
     * Unified handler for UPI, intent, and market schemes.
     * Safe across Android 11+ without relying on resolveActivity() gating.
     */
    public static boolean handleExternalScheme(Context ctx, Uri url) {
        if (url == null || ctx == null) return false;
        String scheme = url.getScheme();
        if (scheme == null) return false;
        scheme = scheme.toLowerCase();
        String urlStr = url.toString();

        // 1. UPI Payment Protocols (Google Pay / Tez, PhonePe, Paytm, BHIM, CRED, MobiKwik, Amazon Pay, etc.)
        if (scheme.equals("upi") || scheme.equals("tez") || scheme.equals("phonepe") ||
            scheme.equals("paytmmp") || scheme.equals("paytm") || scheme.equals("gpay") ||
            scheme.equals("bhim") || scheme.equals("credpay") || scheme.equals("mobikwik") ||
            scheme.equals("whatsapp") || scheme.equals("amazonpay")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, url);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                ctx.startActivity(intent);
                return true;
            } catch (ActivityNotFoundException e) {
                // If vendor-specific scheme failed, fallback to generic upi://
                if (!scheme.equals("upi")) {
                    try {
                        String genericUpi = "upi" + urlStr.substring(scheme.length());
                        Intent fallbackIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(genericUpi));
                        fallbackIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        ctx.startActivity(fallbackIntent);
                        return true;
                    } catch (Exception ignored) {}
                }

                try {
                    Intent chooser = Intent.createChooser(new Intent(Intent.ACTION_VIEW, url), "UPI એપ્લિકેશન પસંદ કરો");
                    chooser.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    ctx.startActivity(chooser);
                    return true;
                } catch (Exception ex) {
                    Toast.makeText(ctx, "તમારા ફોનમાં કોઈ UPI એપ (Google Pay / PhonePe / Paytm) મળેલ નથી.", Toast.LENGTH_LONG).show();
                    return true;
                }
            }
        }

        // 2. Android Intent URIs (intent://...) - used by Razorpay for Google Pay, PhonePe, Paytm
        if (scheme.equals("intent")) {
            try {
                Intent intent = Intent.parseUri(urlStr, Intent.URI_INTENT_SCHEME);
                if (intent != null) {
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    try {
                        ctx.startActivity(intent);
                        return true;
                    } catch (ActivityNotFoundException anf) {
                        String fallbackUrl = intent.getStringExtra("browser_fallback_url");
                        if (fallbackUrl != null && (fallbackUrl.startsWith("http://") || fallbackUrl.startsWith("https://"))) {
                            Intent fb = new Intent(Intent.ACTION_VIEW, Uri.parse(fallbackUrl));
                            fb.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                            try {
                                ctx.startActivity(fb);
                            } catch (Exception ignored) {}
                            return true;
                        }
                        String pkg = intent.getPackage();
                        if (pkg != null && !pkg.isEmpty()) {
                            try {
                                Intent market = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + pkg));
                                market.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                                ctx.startActivity(market);
                                return true;
                            } catch (Exception ignored) {}
                        }
                    }
                }
            } catch (Exception ignored) {}
            return true;
        }

        // 3. Play Store Market Links (market://...)
        if (scheme.equals("market")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, url);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                ctx.startActivity(intent);
                return true;
            } catch (Exception e) {
                return true;
            }
        }

        return false;
    }

    @Override
    public Boolean shouldOverrideLoad(Uri url) {
        if (url == null) return null;
        Context ctx = getActivity() != null ? getActivity() : getContext();

        // 1. Intercept UPI, intent:// and market:// schemes
        if (handleExternalScheme(ctx, url)) {
            return Boolean.TRUE;
        }

        // 2. All HTTP/HTTPS Pages, Payment Gateways & All Bank 3DS/OTP Pages -> Keep inside the WebView!
        String scheme = url.getScheme();
        if (scheme != null && (scheme.equalsIgnoreCase("http") || scheme.equalsIgnoreCase("https"))) {
            return Boolean.FALSE;
        }

        return null; // Defer to default Capacitor navigation policy
    }
}

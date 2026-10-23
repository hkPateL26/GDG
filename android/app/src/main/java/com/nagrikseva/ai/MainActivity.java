package com.nagrikseva.ai;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Message;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        configureWebView();
    }

    @Override
    public void onResume() {
        super.onResume();
        configureWebView();
    }

    private void configureWebView() {
        if (bridge == null || bridge.getWebView() == null) return;

        WebView webView = bridge.getWebView();
        WebSettings settings = webView.getSettings();

        // 1. Mobile Scaling & Viewport (Fixes "Sav jinu jinu lage che" - forces true mobile 1x scale)
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false); // DO NOT shrink overview! Keeps 1:1 mobile scaling.
        settings.setTextZoom(100); // 100% text scale
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);

        // 2. DOM Storage, Database & Hardware Performance
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // 3. Enable Multiple Windows & Automatic Popups (Crucial for Bank 3DS & Razorpay OTP)
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(true);

        // 4. Custom Native Android User Agent
        String ua = settings.getUserAgentString();
        if (ua != null && !ua.contains("NagrikSevaNativeAndroid")) {
            settings.setUserAgentString(ua + " NagrikSevaNativeAndroid");
        }

        // 5. Custom BridgeWebViewClient to intercept UPI & Banking URLs
        bridge.setWebViewClient(new BridgeWebViewClient(bridge) {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (request == null || request.getUrl() == null) return false;
                Uri uri = request.getUrl();
                if (handlePaymentAndCustomSchemes(view, uri)) {
                    return true;
                }
                return super.shouldOverrideUrlLoading(view, request);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String urlStr) {
                if (urlStr == null) return false;
                Uri uri = Uri.parse(urlStr);
                if (handlePaymentAndCustomSchemes(view, uri)) {
                    return true;
                }
                return super.shouldOverrideUrlLoading(view, urlStr);
            }
        });

        // 6. Custom BridgeWebChromeClient to handle Bank OTP popups (onCreateWindow)
        bridge.getWebView().setWebChromeClient(new BridgeWebChromeClient(bridge) {
            @Override
            public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                // If a bank page or Razorpay requests window.open for 3DS OTP, intercept it into the main webview
                WebView newWebView = new WebView(view.getContext());
                newWebView.getSettings().setJavaScriptEnabled(true);
                newWebView.getSettings().setDomStorageEnabled(true);
                newWebView.getSettings().setSupportMultipleWindows(true);
                newWebView.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest req) {
                        if (req != null && req.getUrl() != null) {
                            String targetUrl = req.getUrl().toString();
                            if (handlePaymentAndCustomSchemes(view, req.getUrl())) {
                                return true;
                            }
                            view.loadUrl(targetUrl);
                        }
                        return true;
                    }

                    @Override
                    public boolean shouldOverrideUrlLoading(WebView v, String targetUrl) {
                        if (targetUrl != null) {
                            if (handlePaymentAndCustomSchemes(view, Uri.parse(targetUrl))) {
                                return true;
                            }
                            view.loadUrl(targetUrl);
                        }
                        return true;
                    }
                });

                WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                transport.setWebView(newWebView);
                resultMsg.sendToTarget();
                return true;
            }
        });
    }

    private boolean handlePaymentAndCustomSchemes(WebView view, Uri uri) {
        if (uri == null) return false;
        String url = uri.toString();

        // 1. Direct UPI URLs: upi://pay?... or gpay://, phonepe://, paytmmp://
        if (url.startsWith("upi://") || url.startsWith("paytmmp://") ||
            url.startsWith("gpay://") || url.startsWith("phonepe://") ||
            url.startsWith("bhim://") || url.startsWith("credpay://") ||
            url.startsWith("mobikwik://") || url.startsWith("whatsapp://")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                view.getContext().startActivity(intent);
                return true;
            } catch (ActivityNotFoundException e) {
                try {
                    Intent chooser = Intent.createChooser(new Intent(Intent.ACTION_VIEW, uri), "UPI એપ્લિકેશન પસંદ કરો");
                    chooser.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    view.getContext().startActivity(chooser);
                    return true;
                } catch (Exception ex) {
                    Toast.makeText(view.getContext(), "તમારા ફોનમાં કોઈ UPI એપ (Google Pay / PhonePe) મળેલ નથી.", Toast.LENGTH_LONG).show();
                    return true;
                }
            }
        }

        // 2. Android Intent URIs: intent://...
        if (url.startsWith("intent://")) {
            try {
                Intent intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                if (intent != null) {
                    PackageManager pm = view.getContext().getPackageManager();
                    if (intent.resolveActivity(pm) != null) {
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        view.getContext().startActivity(intent);
                        return true;
                    }
                    String fallbackUrl = intent.getStringExtra("browser_fallback_url");
                    if (fallbackUrl != null && (fallbackUrl.startsWith("http://") || fallbackUrl.startsWith("https://"))) {
                        view.loadUrl(fallbackUrl);
                        return true;
                    }
                }
            } catch (Exception e) {
                // Ignore parse errors
            }
            return true;
        }

        // 3. Play Store Market links
        if (url.startsWith("market://")) {
            try {
                Intent intent = new Intent(Intent.ACTION_VIEW, uri);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                view.getContext().startActivity(intent);
                return true;
            } catch (Exception e) {
                return true;
            }
        }

        // 4. Razorpay & Bank 3DS Authentication pages: Keep inside the WebView!
        if (url.startsWith("http://") || url.startsWith("https://")) {
            String host = uri.getHost();
            if (host != null && (
                host.contains("razorpay.com") ||
                host.contains("billdesk.com") ||
                host.contains("payu.in") ||
                host.contains("hdfcbank.com") ||
                host.contains("icicibank.com") ||
                host.contains("sbi.co.in")
            )) {
                view.loadUrl(url);
                return true;
            }
        }

        return false;
    }
}

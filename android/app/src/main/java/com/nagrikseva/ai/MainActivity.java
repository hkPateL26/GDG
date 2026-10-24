package com.nagrikseva.ai;

import android.net.Uri;
import android.os.Bundle;
import android.os.Message;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register native UPI payment and custom scheme handler plugin before Bridge initialization
        registerPlugin(PaymentAndSchemePlugin.class);
        super.onCreate(savedInstanceState);

        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setJavaScriptEnabled(true);
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);
                settings.setJavaScriptCanOpenWindowsAutomatically(true);
                settings.setSupportMultipleWindows(true);

                // Enable Third-Party Cookies (Critical for Razorpay Session & Bank 3DS OTP)
                CookieManager cookieManager = CookieManager.getInstance();
                cookieManager.setAcceptCookie(true);
                cookieManager.setAcceptThirdPartyCookies(webView, true);

                // Preserve all BridgeWebChromeClient features (file chooser, camera, permissions)
                // and add support for popups / 3DS banking redirects
                webView.setWebChromeClient(new BridgeWebChromeClient(this.bridge) {
                    @Override
                    public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                        WebView popupWebView = new WebView(MainActivity.this);
                        WebSettings popupSettings = popupWebView.getSettings();
                        popupSettings.setJavaScriptEnabled(true);
                        popupSettings.setDomStorageEnabled(true);
                        CookieManager.getInstance().setAcceptThirdPartyCookies(popupWebView, true);

                        popupWebView.setWebViewClient(new WebViewClient() {
                            @Override
                            public boolean shouldOverrideUrlLoading(WebView v, String url) {
                                if (url == null) return false;
                                Uri uri = Uri.parse(url);
                                if (PaymentAndSchemePlugin.handleExternalScheme(MainActivity.this, uri)) {
                                    return true;
                                }
                                // Bank 3DS OTP or payment confirmation: navigate main webView directly
                                webView.loadUrl(url);
                                return true;
                            }
                        });

                        WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                        transport.setWebView(popupWebView);
                        resultMsg.sendToTarget();
                        return true;
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

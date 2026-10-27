package com.nagrikseva.ai;

import android.app.Dialog;
import android.content.DialogInterface;
import android.net.Uri;
import android.os.Bundle;
import android.os.Message;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
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
                // and add robust popup dialog support for Razorpay and Bank 3DS authentication
                webView.setWebChromeClient(new BridgeWebChromeClient(this.bridge) {
                    @Override
                    public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                        try {
                            final Dialog dialog = new Dialog(MainActivity.this, android.R.style.Theme_DeviceDefault_Light_NoActionBar_Fullscreen);
                            final WebView popupWebView = new WebView(MainActivity.this);
                            WebSettings popupSettings = popupWebView.getSettings();
                            popupSettings.setJavaScriptEnabled(true);
                            popupSettings.setDomStorageEnabled(true);
                            popupSettings.setDatabaseEnabled(true);
                            popupSettings.setJavaScriptCanOpenWindowsAutomatically(true);
                            popupSettings.setSupportMultipleWindows(true);
                            popupSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
                            CookieManager.getInstance().setAcceptThirdPartyCookies(popupWebView, true);

                            String ua = settings.getUserAgentString();
                            if (ua != null) {
                                popupSettings.setUserAgentString(ua);
                            }

                            popupWebView.setLayoutParams(new ViewGroup.LayoutParams(
                                    ViewGroup.LayoutParams.MATCH_PARENT,
                                    ViewGroup.LayoutParams.MATCH_PARENT
                            ));

                            popupWebView.setWebChromeClient(new WebChromeClient() {
                                @Override
                                public void onCloseWindow(WebView window) {
                                    try {
                                        if (dialog.isShowing()) {
                                            dialog.dismiss();
                                        }
                                        window.destroy();
                                    } catch (Exception ignored) {}
                                }
                            });

                            popupWebView.setWebViewClient(new WebViewClient() {
                                @Override
                                public boolean shouldOverrideUrlLoading(WebView v, String url) {
                                    if (url == null) return false;
                                    Uri uri = Uri.parse(url);

                                    // 1. Intercept UPI apps or external intent schemes
                                    if (PaymentAndSchemePlugin.handleExternalScheme(MainActivity.this, uri)) {
                                        try {
                                            if (dialog.isShowing()) {
                                                dialog.dismiss();
                                            }
                                        } catch (Exception ignored) {}
                                        return true;
                                    }

                                    // 2. If the payment redirected to the final receipt or callback URL,
                                    // navigate the main webView to that URL and close the dialog
                                    if (url.contains("/payment/receipt") || url.contains("/documents?success=true")) {
                                        webView.loadUrl(url);
                                        try {
                                            if (dialog.isShowing()) {
                                                dialog.dismiss();
                                            }
                                        } catch (Exception ignored) {}
                                        return true;
                                    }

                                    // 3. Otherwise, keep loading within popupWebView (DO NOT overwrite main webView!)
                                    return false;
                                }
                            });

                            dialog.setContentView(popupWebView);
                            dialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
                                @Override
                                public void onDismiss(DialogInterface d) {
                                    try {
                                        popupWebView.destroy();
                                    } catch (Exception ignored) {}
                                }
                            });
                            dialog.show();

                            WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                            transport.setWebView(popupWebView);
                            resultMsg.sendToTarget();
                            return true;
                        } catch (Exception e) {
                            e.printStackTrace();
                            return false;
                        }
                    }
                });
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

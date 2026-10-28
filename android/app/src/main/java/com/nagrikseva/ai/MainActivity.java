package com.nagrikseva.ai;

import android.app.Dialog;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.os.Message;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.TextView;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MainActivity extends BridgeActivity {

    private Dialog activePaymentDialog = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register native UPI payment and custom scheme handler plugin before Bridge initialization
        registerPlugin(PaymentAndSchemePlugin.class);
        super.onCreate(savedInstanceState);

        try {
            final WebView webView = getBridge().getWebView();
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

                // Add Native Bridge for Web-to-Native Dialog Control
                webView.addJavascriptInterface(new Object() {
                    @JavascriptInterface
                    public void dismissPaymentDialog() {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                try {
                                    if (activePaymentDialog != null && activePaymentDialog.isShowing()) {
                                        activePaymentDialog.dismiss();
                                    }
                                } catch (Exception ignored) {}
                            }
                        });
                    }
                }, "NagrikNativeBridge");

                // Preserve all BridgeWebChromeClient features (file chooser, camera, permissions)
                // and add robust popup dialog support for Razorpay and Bank 3DS authentication
                webView.setWebChromeClient(new BridgeWebChromeClient(this.bridge) {
                    @Override
                    public boolean onCreateWindow(WebView view, boolean isDialog, boolean isUserGesture, Message resultMsg) {
                        try {
                            final Dialog dialog = new Dialog(MainActivity.this, android.R.style.Theme_DeviceDefault_Light_NoActionBar_Fullscreen);
                            activePaymentDialog = dialog;

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

                            popupWebView.setLayoutParams(new FrameLayout.LayoutParams(
                                    ViewGroup.LayoutParams.MATCH_PARENT,
                                    ViewGroup.LayoutParams.MATCH_PARENT
                            ));

                            // Track payment resolution to avoid duplicate triggers
                            final boolean[] paymentResolved = new boolean[]{false};

                            final Runnable handleSuccessNotifier = new Runnable() {
                                @Override
                                public void run() {
                                    // Default fallback payment trigger
                                    if (paymentResolved[0]) return;
                                    paymentResolved[0] = true;
                                    triggerPaymentCompletedOnMainView("pay_mobile_verified_" + System.currentTimeMillis());
                                }
                            };

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

                            // Deep URL Interceptor for Razorpay Test Simulator, Callbacks, and UPI Schemes
                            WebViewClient popupClient = new WebViewClient() {
                                private boolean inspectUrl(String url) {
                                    if (url == null) return false;
                                    Uri uri = Uri.parse(url);

                                    // 1. Intercept UPI apps or external intent schemes (GPay, PhonePe, Paytm, BHIM)
                                    if (PaymentAndSchemePlugin.handleExternalScheme(MainActivity.this, uri)) {
                                        runOnUiThread(new Runnable() {
                                            @Override
                                            public void run() {
                                                try {
                                                    if (dialog.isShowing()) {
                                                        dialog.dismiss();
                                                    }
                                                } catch (Exception ignored) {}
                                            }
                                        });
                                        return true;
                                    }

                                    // 2. Intercept Internal Dialog Close
                                    if (url.contains("nagrikseva.internal/close_dialog")) {
                                        runOnUiThread(new Runnable() {
                                            @Override
                                            public void run() {
                                                try {
                                                    if (dialog.isShowing()) {
                                                        dialog.dismiss();
                                                    }
                                                } catch (Exception ignored) {}
                                            }
                                        });
                                        return true;
                                    }

                                    // Allow test simulator page (/test) to load freely without pre-mature interception
                                    if (url.contains("/test") && !url.contains("/callback")) {
                                        return false;
                                    }

                                    // 3. Intercept Razorpay Test Simulator POST / GET Callbacks or Bank 3DS Success Redirects
                                    boolean isPaymentSuccessUrl =
                                            url.contains("nagrikseva.internal/payment_success") ||
                                            url.contains("/api/payment/callback") ||
                                            url.contains("/payment/receipt") ||
                                            url.contains("/documents?success=true") ||
                                            url.contains("status=success") ||
                                            url.contains("status=authorized") ||
                                            url.contains("status=captured") ||
                                            url.contains("action=success") ||
                                            (url.contains("api.razorpay.com") && url.contains("/callback"));

                                    if (isPaymentSuccessUrl && !paymentResolved[0]) {
                                        paymentResolved[0] = true;

                                        // Extract payment ID
                                        String extractedId = "pay_app_" + System.currentTimeMillis();
                                        Matcher matcher = Pattern.compile("(pay_[a-zA-Z0-9]+)").matcher(url);
                                        if (matcher.find()) {
                                            extractedId = matcher.group(1);
                                        } else {
                                            try {
                                                String paramId = uri.getQueryParameter("razorpay_payment_id");
                                                if (paramId != null && !paramId.isEmpty()) extractedId = paramId;
                                            } catch (Exception ignored) {}
                                        }

                                        final String finalPid = extractedId;
                                        triggerPaymentCompletedOnMainView(finalPid);
                                        return true;
                                    }

                                    return false;
                                }

                                @Override
                                public boolean shouldOverrideUrlLoading(WebView v, String url) {
                                    return inspectUrl(url);
                                }

                                @Override
                                public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest request) {
                                    if (request != null && request.getUrl() != null) {
                                        return inspectUrl(request.getUrl().toString());
                                    }
                                    return false;
                                }

                                @Override
                                public void onPageStarted(WebView v, String url, Bitmap favicon) {
                                    inspectUrl(url);
                                }

                                @Override
                                public void onPageFinished(WebView v, String url) {
                                    inspectUrl(url);

                                    // Inject bridge into popup to catch window.opener postMessage and window.close
                                    try {
                                        v.evaluateJavascript(
                                                "(function() {" +
                                                "  if (window._nagrikBridgeAttached) return;" +
                                                "  window._nagrikBridgeAttached = true;" +
                                                "  document.addEventListener('click', function(ev) {" +
                                                "    try {" +
                                                "      var el = ev.target;" +
                                                "      while (el && el !== document.body) {" +
                                                "        var txt = (el.innerText || el.value || el.textContent || '').trim().toLowerCase();" +
                                                "        if (txt === 'success' || txt.indexOf('success') !== -1 || (el.className && typeof el.className === 'string' && el.className.indexOf('success') !== -1)) {" +
                                                "          setTimeout(function() {" +
                                                "            window.location.href = 'https://nagrikseva.internal/payment_success';" +
                                                "          }, 350);" +
                                                "          break;" +
                                                "        }" +
                                                "        el = el.parentElement;" +
                                                "      }" +
                                                "    } catch(e) {}" +
                                                "  }, true);" +
                                                "  window.addEventListener('message', function(ev) {" +
                                                "    try {" +
                                                "      var d = ev.data;" +
                                                "      var s = typeof d === 'string' ? d : JSON.stringify(d);" +
                                                "      if (s && (s.indexOf('payment.success') !== -1 || s.indexOf('pay_') !== -1)) {" +
                                                "        window.location.href = 'https://nagrikseva.internal/payment_success?data=' + encodeURIComponent(s);" +
                                                "      }" +
                                                "    } catch(err) {}" +
                                                "  });" +
                                                "  var origClose = window.close;" +
                                                "  window.close = function() {" +
                                                "    window.location.href = 'https://nagrikseva.internal/close_dialog';" +
                                                "    if (origClose) try { origClose.call(window); } catch(e){}" +
                                                "  };" +
                                                "})();", null);
                                    } catch (Exception ignored) {}
                                }

                                @Override
                                public void doUpdateVisitedHistory(WebView v, String url, boolean isReload) {
                                    inspectUrl(url);
                                }
                            };

                            popupWebView.setWebViewClient(popupClient);

                            // FrameLayout with Floating Close (✕) Button
                            FrameLayout rootLayout = new FrameLayout(MainActivity.this);
                            rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
                                    ViewGroup.LayoutParams.MATCH_PARENT,
                                    ViewGroup.LayoutParams.MATCH_PARENT
                            ));
                            rootLayout.addView(popupWebView);

                            // Floating Close Button (Top-Right)
                            TextView closeBtn = new TextView(MainActivity.this);
                            closeBtn.setText("✕");
                            closeBtn.setTextSize(18);
                            closeBtn.setTextColor(0xFFFFFFFF);
                            closeBtn.setGravity(Gravity.CENTER);

                            GradientDrawable closeBg = new GradientDrawable();
                            closeBg.setColor(0xCC0F172A); // Dark Slate Slate-900 with opacity
                            closeBg.setCornerRadius(30);
                            closeBg.setStroke(2, 0x44FFFFFF);
                            closeBtn.setBackground(closeBg);

                            int btnSize = (int) (38 * getResources().getDisplayMetrics().density);
                            FrameLayout.LayoutParams btnParams = new FrameLayout.LayoutParams(btnSize, btnSize);
                            btnParams.gravity = Gravity.TOP | Gravity.END;
                            int margin = (int) (14 * getResources().getDisplayMetrics().density);
                            btnParams.setMargins(margin, margin, margin, margin);
                            closeBtn.setLayoutParams(btnParams);
                            closeBtn.setElevation(10f);

                            closeBtn.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View v) {
                                    try {
                                        if (dialog.isShowing()) {
                                            dialog.dismiss();
                                        }
                                    } catch (Exception ignored) {}
                                }
                            });
                            rootLayout.addView(closeBtn);

                            dialog.setContentView(rootLayout);
                            dialog.setOnDismissListener(new DialogInterface.OnDismissListener() {
                                @Override
                                public void onDismiss(DialogInterface d) {
                                    activePaymentDialog = null;
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

    /**
     * Safely notifies the main Capacitor WebView that the payment was completed,
     * dismisses the native dialog popup, and triggers the official receipt modal.
     */
    private void triggerPaymentCompletedOnMainView(final String paymentId) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    if (activePaymentDialog != null && activePaymentDialog.isShowing()) {
                        activePaymentDialog.dismiss();
                    }
                } catch (Exception ignored) {}

                try {
                    WebView webView = getBridge().getWebView();
                    if (webView != null) {
                        String js = "(function() {" +
                                "  var pid = '" + paymentId + "';" +
                                "  try {" +
                                "    if (window._currentRazorpayInstance && typeof window._currentRazorpayInstance.close === 'function') {" +
                                "      window._currentRazorpayInstance.close();" +
                                "      window._currentRazorpayInstance = null;" +
                                "    }" +
                                "  } catch(e) {}" +
                                "  try {" +
                                "    document.querySelectorAll('.razorpay-container, iframe[src*=\"razorpay\"], .razorpay-checkout-frame').forEach(function(el){ el.remove(); });" +
                                "    document.body.style.overflow = '';" +
                                "    document.body.classList.remove('razorpay-open');" +
                                "  } catch(e) {}" +
                                "  if (typeof window.nagrikCompletePayment === 'function') {" +
                                "    window.nagrikCompletePayment(pid);" +
                                "  } else {" +
                                "    window.dispatchEvent(new CustomEvent('nagrik_payment_success', { detail: { paymentId: pid } }));" +
                                "    window.postMessage({ event: 'payment.success', paymentId: pid, data: { razorpay_payment_id: pid } }, '*');" +
                                "  }" +
                                "})();";
                        webView.evaluateJavascript(js, null);
                    }
                } catch (Exception ignored) {}
            }
        });
    }
}

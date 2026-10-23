package com.nagrikseva.ai;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Register native UPI payment and custom scheme handler plugin before Bridge initialization
        registerPlugin(PaymentAndSchemePlugin.class);
        super.onCreate(savedInstanceState);
    }
}

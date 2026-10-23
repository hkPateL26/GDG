import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nagrikseva.ai',
  appName: 'NagrikSeva AI',
  webDir: 'public',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://nagrikseva-ai-one.vercel.app',
    cleartext: true,
    androidScheme: 'https',
    appendUserAgent: 'NagrikSevaNativeAndroid',
    allowNavigation: [
      '*.razorpay.com',
      'checkout.razorpay.com',
      'api.razorpay.com',
      '*.billdesk.com',
      '*.payu.in',
      '*.google.com',
      '*.googleapis.com',
      '*.gstatic.com',
      'nagrikseva-ai-one.vercel.app'
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#020617',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      backgroundColor: '#020617',
      style: 'DARK',
    },
  },
};

export default config;

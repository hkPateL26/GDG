// =========================================================================
// NagrikSeva AI - Official Citizen WhatsApp Dispatch & Share Engine (Gujarat Samvaad)
// Generates statutory WhatsApp notification text with 1-click tracking & cryptographic verify links
// =========================================================================

import { generateCertificateSeal } from "./digital-notary.ts";

export interface WhatsAppApplicationData {
  id: string;
  citizenName?: string;
  citizenNameGu?: string;
  schemeName?: string;
  schemeNameGu?: string;
  feeAmount?: number | string;
  paymentStatus?: string;
  challanNo?: string;
  txnId?: string;
  mobile?: string;
  trackingSecret?: string;
  taluka?: string;
  district?: string;
  districtGu?: string;
  lastUpdated?: string;
}

const DEFAULT_ORIGIN = "https://nagrikseva-ai-one.vercel.app";

/**
 * Returns the current application base URL safely in both browser and server
 */
export function getAppOrigin(): string {
  if (typeof window !== "undefined" && window.location && window.location.origin) {
    return window.location.origin;
  }
  return DEFAULT_ORIGIN;
}

/**
 * Formats official Government of Gujarat WhatsApp citizen alert text
 */
export function formatWhatsAppCitizenMessage(app: WhatsAppApplicationData): string {
  const origin = getAppOrigin();
  const name = app.citizenNameGu || app.citizenName || "નાગરિક અરજદાર";
  const scheme = app.schemeNameGu || app.schemeName || "સરકારી સેવા";
  const fee = app.feeAmount !== undefined ? String(app.feeAmount) : "૫૦";
  const refNum = app.challanNo || app.txnId || `REF-${app.id.slice(-6)}`;
  const taluka = app.taluka || "તાલુકા કચેરી";
  const district = app.districtGu || app.district || "ગુજરાત";

  // Build secure URLs
  const trackUrl = `${origin}/track?id=${encodeURIComponent(app.id)}${
    app.trackingSecret ? `&secret=${encodeURIComponent(app.trackingSecret)}` : ""
  }`;

  // Generate cryptographic seal for direct 1-click verification
  const seal = generateCertificateSeal({
    id: app.id,
    citizenName: app.citizenName || name,
  });
  const verifyUrl = `${origin}/verify?id=${encodeURIComponent(app.id)}&seal=${encodeURIComponent(seal)}`;

  const lines = [
    `🏛️ *ગુજરાત સરકાર - ડિજિટલ સેવા (e-Governance)*`,
    `----------------------------------------`,
    `નમસ્તે *${name}*,`,
    ``,
    `તમારી *${scheme}* માટેની અરજી સફળતાપૂર્વક સ્વીકારાઈ છે.`,
    ``,
    `📋 *અરજી ક્રમાંક (ID):* ${app.id}`,
    `💰 *ચુકવેલ રકમ:* ₹${fee} (${refNum})`,
    `📍 *સક્ષમ કચેરી:* ${taluka}, ${district}`,
    ``,
    `🔍 *અરજીનું લાઈવ સ્ટેટસ ટ્રેક કરો:*`,
    `${trackUrl}`,
    ``,
    `🛡️ *સત્તાવાર પહોંચ & પ્રમાણપત્ર ખરાઈ કરો:*`,
    `${verifyUrl}`,
    `----------------------------------------`,
    `_ગુજરાત જાહેર સેવા હક અધિનિયમ (GRTSA ૨૦૧૩) હેઠળ અધિકૃત સૂચના._`,
  ];

  return lines.join("\n");
}

/**
 * Generates direct WhatsApp click-to-chat URL
 */
export function getWhatsAppShareUrl(app: WhatsAppApplicationData): string {
  const text = formatWhatsAppCitizenMessage(app);
  const phone = (app.mobile || "").replace(/\D/g, "");
  // If phone exists and is 10 digits, prepend India country code 91
  const phoneParam = phone.length === 10 ? `&phone=91${phone}` : "";
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}${phoneParam}`;
}

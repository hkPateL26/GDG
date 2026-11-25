import test from "node:test";
import assert from "node:assert/strict";

import {
  HOTLINE_CURATED_TOPICS,
  HOTLINE_GOV_CONTACTS,
  resolveVoiceHotlineQuery,
  cleanTextForVoicePlayback,
} from "../src/lib/voice-hotline-engine.ts";

test("NagrikSeva AI - Interactive Gujarati Voice Hotline (જન-સંવાદ) Suite", async (t) => {
  await t.test("Curated topics contain complete bilingual and accessibility attributes", () => {
    assert.ok(HOTLINE_CURATED_TOPICS.length >= 6, "Expected at least 6 curated voice topics");

    for (const topic of HOTLINE_CURATED_TOPICS) {
      assert.ok(topic.id, "Topic must have an id");
      assert.ok(topic.spokenPromptGu.length > 5, "Prompt must have descriptive Gujarati text");
      assert.ok(topic.spokenAudioTextGu.length > 10, "Spoken text must have natural audio phrasing");
      assert.ok(topic.shortAnswerGu.length > 10, "Short answer must be present");
      assert.ok(topic.actionUrl.length > 0, "Action URL must be defined");
      assert.ok(topic.actionLabelGu.length > 0, "Action label must be defined");
    }
  });

  await t.test("Text cleaner normalizes currency, symbols, and links for fluent TTS playback", () => {
    const raw = "ખેડૂતોને [i-Khedut](https://ikhedut.gujarat.gov.in) પરથી ₹45,000 સબસિડી અને 70% સહાય મળશે! 🌾🚜";
    const cleaned = cleanTextForVoicePlayback(raw, "gu");

    // Must strip URLs and markdown brackets
    assert.ok(!cleaned.includes("https://"), "Cleaned text must not contain raw URLs");
    assert.ok(!cleaned.includes("["), "Cleaned text must not contain markdown brackets");
    assert.ok(!cleaned.includes("]"), "Cleaned text must not contain markdown brackets");

    // Must replace ₹ with રૂપિયા
    assert.ok(cleaned.includes("45000 રૂપિયા"), "Currency marker must be converted to spoken Gujarati");

    // Must replace % with ટકા
    assert.ok(cleaned.includes("70 ટકા"), "Percentage marker must be converted to spoken Gujarati");

    // Must strip emojis
    assert.ok(!cleaned.includes("🌾"), "Emojis must be stripped from audio stream");
    assert.ok(!cleaned.includes("🚜"), "Emojis must be stripped from audio stream");
  });

  await t.test("Resolves agriculture and farmer queries accurately", () => {
    const res = resolveVoiceHotlineQuery("મને ખેતી માટે ટ્રેક્ટર સબસિડી જોઈએ છે", "gu");
    assert.strictEqual(res.source, "curated_dpi_hotline");
    assert.ok(res.displayText.includes("i-Khedut") || res.displayText.includes("સબસિડી"));
    assert.ok(res.spokenText.includes("ખેડૂત") || res.spokenText.includes("રૂપિયા"));
    assert.strictEqual(res.actionUrl, "https://ikhedut.gujarat.gov.in");
  });

  await t.test("Resolves Ayushman Bharat hospital treatment queries accurately", () => {
    const res = resolveVoiceHotlineQuery("આયુષ્માન કાર્ડ માં કેટલા રૂપિયા ની સારવાર મળે?", "gu");
    assert.strictEqual(res.source, "curated_dpi_hotline");
    assert.ok(res.displayText.includes("10 લાખ") || res.displayText.includes("દવાખાને"));
    assert.ok(res.spokenText.includes("આયુષ્માન"));
    assert.strictEqual(res.actionUrl, "/documents?service=ayushman-card");
  });

  await t.test("Resolves widow pension (Ganga Swarupa) queries accurately", () => {
    const res = resolveVoiceHotlineQuery("વિધવા પેન્શન માટે શું કરવું?", "gu");
    assert.strictEqual(res.source, "curated_dpi_hotline");
    assert.ok(res.displayText.includes("ગંગા સ્વરૂપા"));
    assert.ok(res.spokenText.includes("૧૨૫૦"));
  });

  await t.test("Resolves income certificate queries accurately", () => {
    const res = resolveVoiceHotlineQuery("આવકનો દાખલો કઢાવવા કયા કાગળો જોઈએ?", "gu");
    assert.strictEqual(res.source, "curated_dpi_hotline");
    assert.ok(res.displayText.includes("આવક"));
    assert.ok(res.spokenText.includes("તલાટી"));
  });

  await t.test("Resolves solar rooftop queries accurately", () => {
    const res = resolveVoiceHotlineQuery("સોલાર રૂફટોપ યોજના માં કેટલી વીજળી મફત મળે?", "gu");
    assert.strictEqual(res.source, "curated_dpi_hotline");
    assert.ok(res.displayText.includes("સૂર્ય ઘર") || res.displayText.includes("વીજળી"));
    assert.ok(res.spokenText.includes("૭૮ હજાર"));
  });

  await t.test("Returns safe, helpful spoken fallback for open-ended queries", () => {
    const res = resolveVoiceHotlineQuery("અન્ય સામાન્ય માહિતી જણાવો", "gu");
    assert.strictEqual(res.source, "fallback");
    assert.ok(res.spokenText.length > 20);
    assert.strictEqual(res.actionUrl, "/schemes");
  });

  await t.test("Statutory toll-free helplines are verified", () => {
    assert.strictEqual(HOTLINE_GOV_CONTACTS.cmHelpline, "1800-233-5500");
    assert.strictEqual(HOTLINE_GOV_CONTACTS.farmerKisanCallCenter, "1800-180-1551");
    assert.strictEqual(HOTLINE_GOV_CONTACTS.ayushmanTollFree, "14555");
    assert.strictEqual(HOTLINE_GOV_CONTACTS.womenHelpline, "181");
  });
});

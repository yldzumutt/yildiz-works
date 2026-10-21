import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      source = "Dijital Danışman",
      businessName = "Belirtilmedi",
      phone = "Belirtilmedi",
      conversation = "-",
    } = body;

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const telegramChatId = process.env.TELEGRAM_CHAT_ID?.trim();
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

    console.log("--- YENİ LEAD İSTEĞİ GELDİ ---");
    console.log("Gelen Veri:", { source, businessName, phone });
    console.log("Env Kontrolü:", {
      telegramTokenVarMi: !!telegramToken,
      telegramChatIdVarMi: !!telegramChatId,
      sheetsUrlVarMi: !!sheetsWebhookUrl,
    });

    // 1. TELEGRAM BİLDİRİMİ GÖNDER
    if (telegramToken && telegramChatId) {
      const text =
        `🔔 Yeni Müşteri Talebi (Yıldız Works)\n\n` +
        `📍 Kaynak: ${source}\n` +
        `🏢 İsim / İşletme: ${businessName}\n` +
        `📞 İletişim: ${phone}\n` +
        (conversation !== "-" ? `\n💬 Detay:\n${conversation}` : "");

      const tgRes = await fetch(
        `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text,
          }),
        }
      );
      const tgData = await tgRes.json();
      console.log("Telegram Yanıtı:", tgData);
    }

    // 2. GOOGLE SHEETS + E-POSTA WEBHOOK GÖNDER
    if (sheetsWebhookUrl) {
      const sheetRes = await fetch(sheetsWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        redirect: "follow",
        body: JSON.stringify({
          type: "LEAD",
          source,
          businessName,
          phone,
          conversation,
        }),
      });
      const sheetText = await sheetRes.text();
      console.log("Google Sheets Yanıtı:", sheetText);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("LEAD API HATASI:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
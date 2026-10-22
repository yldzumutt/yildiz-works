import { NextResponse } from "next/server";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

// Tarayıcıdan https://www.yildizworks.com/api/telegram adresine girerek bağlantı testi yapmanı sağlar
export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    return NextResponse.json(
      {
        ok: false,
        error: "Vercel üzerinde TELEGRAM_BOT_TOKEN veya TELEGRAM_CHAT_ID tanımlı değil.",
      },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "✅ Yıldız Works - NOVA Telegram bağlantısı aktif!",
      }),
    });

    const data = await res.json();
    return NextResponse.json({ ok: res.ok, telegramResponse: data });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// Müşteri siteden çıktığında veya sohbet bittiğinde tüm konuşmayı gönderir
export async function POST(req: Request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!token || !chatId) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const body = await req.json();
    const { conversation, hasPhone, phone, reason } = body;

    if (!conversation) {
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    const statusHeader = hasPhone
      ? `📞 YENİ MÜŞTERİ ADAYI (Numara Bıraktı: ${phone})`
      : `👀 ZİYARETÇİ SOHBET ÖZETİ (Numara Bırakmadı)`;

    const text =
      `${statusHeader}\n` +
      `📌 Durum: ${reason || "Sohbet Sonlandı"}\n` +
      `────────────────────\n` +
      `${conversation}`;

    // Telegram 4096 karakter sınırına karşı güvenli kesme
    const safeText = text.length > 4000 ? text.slice(0, 4000) + "..." : text;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: safeText,
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("TELEGRAM LOG HATASI:", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
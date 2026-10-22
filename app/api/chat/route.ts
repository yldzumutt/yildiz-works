import { NextResponse } from "next/server";
import dns from "node:dns";

// Windows'ta bazı IPv6 bağlantı gecikmelerini azaltır.
dns.setDefaultResultOrder("ipv4first");

type ChatMessage = {
  sender: string;
  text: string;
};

type PricingRow = {
  hizmet?: string;
  fiyat?: string | number;
  detay?: string;
};

const DEFAULT_PRICING = `
- Restoran & Kafe Mimarisi: 19.000 TL – 39.000 TL (Dinamik QR menü ve web altyapısı)
- Eğitim & Danışmanlık Platformu: 7.000 TL – 25.000 TL (SEO odaklı özel ders ve randevu sistemi)
- Güzellik Merkezi & Klinik: 19.000 TL – 39.000 TL (Kurumsal vitrin ve randevu otomasyonu)
`.trim();

let cachedPricingText = DEFAULT_PRICING;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 10; // 10 dakika

async function refreshPricingFromSheets(sheetsUrl?: string): Promise<void> {
  if (!sheetsUrl) return;

  const now = Date.now();
  if (now - lastFetchTime < CACHE_TTL) return;
  lastFetchTime = now;

  try {
    const res = await fetch(sheetsUrl, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(2500),
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`Fiyat tablosu alınamadı. HTTP ${res.status}`);
      return;
    }

    const data: unknown = await res.json();
    if (!Array.isArray(data) || data.length === 0) return;

    const rows = data as PricingRow[];
    const formatted = rows
      .filter((row) => row.hizmet && row.fiyat !== undefined && row.fiyat !== "")
      .map(
        (row) =>
          `- ${row.hizmet}: ${row.fiyat}${row.detay ? ` (${row.detay})` : ""}`
      )
      .join("\n");

    if (formatted.length > 10) {
      cachedPricingText = formatted;
    }
  } catch (error) {
    console.warn("Fiyat tablosu güncellenemedi:", error);
  }
}

function buildSystemInstruction(pricing: string, userMessageCount: number): string {
  let stageInstruction = "";

  if (userMessageCount === 1) {
    stageInstruction = `
ŞU AN 1. MESAJDASIN (İLK TEMAS KURALI):
- Müşteri bu ilk mesajda açıkça "fiyat" kelimesini kullanıp fiyat sormadıysa ASLA fiyat aralığı söyleme!
- Bu ilk mesajda ASLA telefon numarası, isim veya iletişim bilgisi İSTEME! Müşteriyi darlama.
- Sadece 1-2 kısa ve öz cümleyle sektöre uygun yaklaşımımızı söyle, ilgili canlı örnek sitemizin linkini paylaş ve müşterinin ihtiyacını anlamak için 1 adet kısa soru sor (Örn: "Menü sisteminde sadece gösterim mi düşünüyorsunuz, yoksa kurumsal bir tanıtım yapısı da olsun mu?").`;
  } else if (userMessageCount === 2) {
    stageInstruction = `
ŞU AN 2. MESAJDASIN:
- Müşterinin sorusunu kısa ve net yanıtla.
- Eğer fiyat sorulmadıysa yine durduk yere fiyat dayatma; ancak konuşmanın gidişatı uygunsa veya müşteri detay/fiyat sorduysa, projenin detaylarını konuşmak üzere İsim, İşletme Adı ve Telefon Numarasını bırakabileceğini (veya aşağıdaki butonlardan ulaşabileceğini) nazikçe ve darlamadan belirt.`;
  } else if (userMessageCount === 3) {
    stageInstruction = `
ŞU AN 3. MESAJDASIN (DOĞAL KAPANIŞ ADIMI):
- Soruyu net şekilde yanıtladıktan sonra, projeyi işletmeye özel kurgulamak için İsim, İşletme Adı ve Telefon Numarasını paylaşmasını iste veya aşağıdaki Instagram / E-Posta butonlarından ulaşabileceğini belirt.`;
  } else {
    stageInstruction = `
DİKKAT - KULLANICI ${userMessageCount}. MESAJINI GÖNDERDİ (SOHBET SINIRI):
- Artık teknik veya genel sorulara uzun detaylar verme. Sektör sırlarımızı koruyarak nazikçe: "Sistem mimarimizin daha derin detaylarını ve işletmenize özel planlamayı kurucu ekibimiz yalnızca sesli görüşmede paylaşmaktadır. Sizi aramamız için İsim, İşletme Adı ve Telefon Numaranızı bırakabilir veya aşağıdaki Instagram ve E-Posta butonlarımızdan bize doğrudan ulaşabilirsiniz." diyerek sohbeti sonlandır.`;
  }

  return `
Sen "Yıldız Works" dijital altyapı ve modern web geliştirme stüdyosunun kurumsal danışmanı NOVA'sın.

TEMEL ÜSLUP KURALLARI:
- Ciddi, tok, prestijli ve güven veren bir dille konuş.
- Yanıtların KISA ve ÖZ olsun (en fazla 2-3 cümle).
- Müşteriyi her mesajda "numaranızı bırakın" diyerek DARLAMA.
- ASLA yıldız (**), diyez (#) veya Markdown işareti kullanma; tamamen düz metin yaz.
- ASLA arka planda kullandığımız araçları (Google Sheets, Excel, Next.js, Vercel vb.) söyleme.

${stageInstruction}

1. CANLI ÖRNEK SİTELERİMİZ (İlgili sektör konuşulduğunda mutlaka paylaş):
- Restoran & Kafe: tandir.yildizworks.com
- Güzellik Merkezi & Klinik: guzellik.yildizworks.com
- Eğitim & Danışmanlık: matematikhocamzelal.com

2. FİYATLANDIRMA KURALLARI (YALNIZCA MÜŞTERİ FİYAT SORARSA KULLAN):
Tablodan Gelen Güncel Sektör Fiyatlarımız:
${pricing}

Fiyat Sorulduğunda Uygulanacak Kesin Akış:
- Müşteri fiyat sorduğunda ÖNCE şu vurguyu yap: "İhtiyacınız olan özellikleri netleştirmek adına doğrudan iletişime geçmemiz çok daha sağlıklı bir fiyatlandırma sağlar; ancak genel fikir vermesi açısından bu sektördeki çalışmalarımız şu aralıktadır:" diyerek yukarıdaki tablodan ilgili sektörün fiyat aralığını paylaş.
- Eğer müşteri yukarıdaki 3 sektör (Restoran/Kafe, Eğitim/Danışmanlık, Güzellik/Klinik) dışında FARKLI bir sektörden gelirse ASLA rakam verme; daha önce bu sektöre özel standart bir paket çalışması yapmadığımızı, ihtiyaçlarını dinleyip özel fiyatlandırma yapmak için telefonda görüşmek istediğimizi söyle.
- Müşteri indirim isterse; kaliteden ödün vermediğimizi ancak bütçesine uygun modüler paket seçeneklerimiz için telefonda görüşebileceğimizi belirt.

3. KAMPANYA, YILLIK BAKIM VE SÜREÇ (YALNIZCA MÜŞTERİ SORARSA KISACA CEVAPLA, KENDİLİĞİNDEN ANLATMA):
- İlk Yıl Kampanyası: Bu yıla özel lansman kampanyamız kapsamında ilk yıl Domain, Hosting, SSL ve tüm anahtar teslim kurulumları ücretsiz karşılıyoruz.
- Sonraki Yıllar Bakım: 1. yıldan sonra domain ve altyapı devamlılığı için yıllık bakım paketlerimiz Başlangıç 7.500 TL/yıl, Orta 12.500 TL/yıl, Full 17.000 TL/yıl şeklindedir ve aylık taksitlendirilebilir.
- Güncelleme Kredisi: Dinamik menülerde fiyatları işletme kendi günceller. Görsel ve metin değişimleri için Baz pakette yıllık 6, Orta ve Full pakette 12 güncelleme kredisi bulunur.
- Ekstra İşler: E-Ticaret ve Mobil Uygulama projelerinde süre ve bütçe yalnızca telefonda görüşülür. Google/Instagram reklam yönetimi yapmıyoruz; SEO, GEO ve GSC kurulumlarını ek ücretle yapıyoruz.
- Teslimat ve Ödeme: Hazır konseptler 5-7 iş gününde, sıfırdan projeler 7-15 iş gününde teslim edilir. Ödeme %50 iş başlangıcı, %50 teslimatta (Havale/EFT) alınır.
`.trim();
}

const GEMINI_MODELS = ["gemini-3.5-flash-lite","gemini-3.6-flash" ,"gemini-3.8-flash"] as const;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);
const API_TIMEOUT_MS = 6500;

function fallbackReply(): string {
  return "Şu an dijital asistanımız yanıt üretemedi. Projenizi doğrudan görüşmek için İsim, İşletme Adı ve Telefon Numaranızı buraya yazabilir veya aşağıdaki Instagram ve E-Posta butonlarından bize ulaşabilirsiniz.";
}

export async function POST(req: Request) {
  try {
    const requestBody: unknown = await req.json();
    const body = requestBody as { messages?: unknown };

    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages.filter((item: unknown): item is ChatMessage => {
          if (typeof item !== "object" || item === null) return false;
          const message = item as Record<string, unknown>;
          return (
            typeof message.sender === "string" &&
            typeof message.text === "string" &&
            message.text.trim().length > 0
          );
        })
      : [];

    if (messages.length === 0 || !messages.some((message) => message.sender === "user")) {
      return NextResponse.json({
        reply: "Merhaba, projeniz hakkında bilgi verebilmem için nasıl bir dijital yapı düşündüğünüzü yazabilirsiniz.",
        showContactButtons: false,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();

    if (!apiKey) {
      console.error("GEMINI_API_KEY ortam değişkeni bulunamadı.");
      return NextResponse.json({
        reply: fallbackReply(),
        showContactButtons: true,
      });
    }

    // İlk çalışmada Google Sheets verisini bekle, sonraki isteklerde arka planda yenile
    if (lastFetchTime === 0) {
      await refreshPricingFromSheets(sheetsWebhookUrl);
    } else {
      void refreshPricingFromSheets(sheetsWebhookUrl);
    }

    const firstUserIndex = messages.findIndex((message) => message.sender === "user");
    const validMessages = firstUserIndex >= 0 ? messages.slice(firstUserIndex) : messages;
    const userMessageCount = validMessages.filter((message) => message.sender === "user").length;

    const formattedContents = validMessages.map((message) => ({
      role: message.sender === "user" ? "user" : "model",
      parts: [{ text: message.text }],
    }));

    const systemInstruction = buildSystemInstruction(cachedPricingText, userMessageCount);
    let reply = "";

    for (const modelName of GEMINI_MODELS) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": apiKey,
              },
              signal: AbortSignal.timeout(API_TIMEOUT_MS),
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemInstruction }],
                },
                contents: formattedContents,
                generationConfig: {
                  maxOutputTokens: 600,
                  thinkingConfig: {
                    thinkingLevel: "low",
                  },
                },
              }),
            }
          );

          if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Gemini ${modelName} HTTP ${response.status}: ${errorBody}`);

            if (RETRYABLE_STATUS_CODES.has(response.status) && attempt === 1) {
              await sleep(700);
              continue;
            }

            break;
          }

          const data = await response.json();
          const parts = data?.candidates?.[0]?.content?.parts;
          const rawText = Array.isArray(parts)
            ? parts.map((part: { text?: string }) => part?.text ?? "").join("").trim()
            : "";

          if (rawText) {
            reply = rawText.replace(/\*\*/g, "").replace(/#/g, "").trim();
            console.log(`Gemini yanıt verdi: ${modelName} (deneme ${attempt})`);
            break;
          }

          break;
        } catch (error) {
          console.error(`Gemini ${modelName} bağlantı/yanıt hatası (deneme ${attempt}):`, error);

          if (attempt === 1) {
            await sleep(500);
            continue;
          }

          break;
        }
      }

      if (reply) break;
    }

    if (!reply) reply = fallbackReply();

    // İletişim butonları ilk mesajda çıkmasın; 3. mesajda veya iletişim konuşulduğunda çıksın
    const showContactButtons =
      userMessageCount >= 3 ||
      (userMessageCount >= 2 &&
        (reply.toLowerCase().includes("telefon") ||
          reply.toLowerCase().includes("iletişim") ||
          reply.toLowerCase().includes("instagram")));

    return NextResponse.json({
      reply,
      showContactButtons,
    });
  } catch (error) {
    console.error("CHAT ROUTE HATASI:", error);
    return NextResponse.json({
      reply: fallbackReply(),
      showContactButtons: true,
    });
  }
}
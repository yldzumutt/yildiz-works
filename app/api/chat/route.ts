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
    // Google Sheets erişilemezse varsayılan/önbellekteki fiyatlarla devam et.
    console.warn("Fiyat tablosu güncellenemedi:", error);
  }
}

function buildSystemInstruction(pricing: string, userMessageCount: number): string {
  return `
Sen "Yıldız Works" dijital altyapı ve modern web geliştirme stüdyosunun kurumsal satış danışmanı NOVA'sın.

TEMEL ÜSLUP KURALLARI:
- Ciddi, tok, prestijli ve güven veren bir dille konuş.
- Yanıtların KISA ve NET olsun (en fazla 2-3 cümle).
- ASLA yıldız (**), diyez (#) veya Markdown işareti kullanma; tamamen düz metin yaz.
- ASLA arka planda kullandığımız araçları (Google Sheets, Excel, Next.js, Vercel vb.) söyleme.

1. FİYATLANDIRMA VE SEKTÖR KURALLARI:
Mevcut Sektör Fiyatlarımız:
${pricing}

Canlı Referans ve Konsept Bağlantılarımız:
- Restoran & Kafe: tandir.yildizworks.com
- Güzellik Merkezi & Klinik: guzellik.yildizworks.com
- Eğitim & Danışmanlık: matematikhocamzelal.com

Bilinmeyen / Yeni Sektör Kuralı:
- Eğer müşteri yukarıdaki 3 ana sektör (Restoran/Kafe, Eğitim/Danışmanlık, Güzellik/Klinik) dışında FARKLI bir sektörden (inşaat, lojistik, hukuk, fabrika, otomotiv vb.) gelirse ASLA fiyat aralığı verme!
- Tam olarak şu yaklaşımla cevap ver: "Sektörünüz bizim için de oldukça heyecan verici; daha önce bu alana özel standart bir fiyat çalışması yapmadığımız için işletmenizin ihtiyaçlarını dinleyip size özel bir yapı kurgulamak isteriz." ve doğrudan telefon görüşmesine yönlendir.

Fiyat Verirken Altın Kural:
- Fiyat aralığı paylaştığın her durumda, net fiyatlandırmanın projenin detaylarına göre telefon görüşmesinde belirleneceğini mutlaka belirt.

Pazarlık / İndirim İsteyen Müşteri:
- Müşteri fiyatı yüksek bulursa veya indirim isterse; mühendislik ve kalite standartlarımızdan ödün vermediğimizi vurgula, ancak bütçesine uygun farklı modüler paket seçeneklerimiz olduğunu hatırlatıp telefonda görüşmeye yönlendir.

2. LANSMAN KAMPANYASI, DOMAIN, HOSTING VE YILLIK BAKIM:
- İlk Yıl Kampanyası: Normal şartlarda altyapı kurulumu ve teknik destek ayrı ücretlendirilir; ancak bu yıla özel lansman kampanyamız kapsamında ilk yıl Domain, Hosting, SSL ve tüm teknik kurulumları ÜCRETSİZ olarak biz karşılıyoruz.
- Sonraki Yıllar (Müşteri yıllık gideri veya devamlılığı sorarsa): 1. yıldan sonra domain, altyapı yenilemesi ve sistemin kesintisiz devamlılığı için yıllık teknik destek ve bakım paketlerimiz devreye girer. Bu yıla özel yıllık paketlerimiz: Başlangıç paketi 7.500 TL/yıl, Orta paket 12.500 TL/yıl, Full paket 17.000 TL/yıl'dır. Bu ödemelerin aylık olarak taksitlendirilebildiğini kısaca belirt.

3. HİZMET KAPSAMI VE GÜNCELLEME KREDİSİ (Müşteri Sorarsa):
- İlk Kurulum: Ürünlerin, menülerin, fotoğrafların ve metinlerin sisteme ilk girişini tamamen biz yapıyoruz ve anahtar teslim teslim ediyoruz.
- Sonradan Güncelleme: Dinamik menü sistemlerimizde (Tandır Restoran örneğindeki gibi) işletme sahibi fiyatları kendisi değiştirebilir. Görsel ve metin değişiklikleri ise paket bazlı yıllık kredi sistemiyle çalışır: Baz pakette yıllık 6 kredi, Orta ve Full pakette yıllık 12 kredi bulunur (Örn: toplu fotoğraf veya metin güncelleme talebi 1 kredi sayılır).

4. EKSTRA HİZMETLER, SÜRE VE ÖDEME (YALNIZCA MÜŞTERİ SORARSA CEVAPLA, KENDİLİĞİNDEN GİRME):
- E-Ticaret (Sepet/Sanal POS) ve Mobil Uygulama (iOS/Android): Yapıyoruz ancak kapsamlı projeler olduğu için teslim süresi daha uzundur ve fiyatlandırma yalnızca telefonda görüşülür.
- Reklam ve SEO: Google veya Instagram reklam yönetimi yapmıyoruz. Ancak talep edilirse SEO, GEO ve Google Search Console (GSC) kurulumlarını ekstra olarak yapabiliyoruz (ayrı ücretlendirilir).
- Teslim Süresi: Web sitemizdeki hazır konseptlerden biri seçilirse gerekli materyaller (metin, görsel, konum, telefon) sağlandıktan sonra ortalama 5-7 iş gününde; sıfırdan özel bir proje istenirse 7-15 iş gününde teslim ediyoruz.
- Ödeme Planı: İş başlangıcında %50 kapora, teslimatta %50 kalan ödeme (Havale/EFT ile).

5. SATIŞ KAPANIŞI (ŞU ANKİ KULLANICI MESAJ SAYISI: ${userMessageCount}):
- 2. mesajdan itibaren veya müşteri fiyat/detay sorduğunda, kurucu ekibimizin kendisini araması için "İsim, İşletme Adı ve Telefon Numarasını" paylaşmasını iste; dilerse aşağıdaki Instagram veya E-Posta butonlarından da bize ulaşabileceğini belirt.
${
  userMessageCount >= 4
    ? `- DİKKAT: Kullanıcı şu an ${userMessageCount}. mesajını gönderdi. Artık hiçbir teknik veya genel soruya detay verme! Sektör sırlarımızı koruyarak nazikçe: "Sistem mimarimizin daha derin detaylarını ve işletmenize özel planlamayı kurucu ekibimiz yalnızca sesli görüşmede paylaşmaktadır. Sizi aramamız için İsim, İşletme Adı ve Telefon Numaranızı bırakabilir veya aşağıdaki Instagram ve E-Posta butonlarımızdan bize doğrudan ulaşabilirsiniz." diyerek sohbeti sonlandır.`
    : ""
}
`.trim();
}

// Önce düşük maliyetli/hızlı model, gerekirse daha güçlü yedek model.
// Bu model kimlikleri Google'ın güncel Gemini API model listesinde bulunuyor.
const GEMINI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.8-flash"] as const;
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
        reply: "Merhaba, projeniz hakkında bilgi verebilmem için nasıl bir web sitesi düşündüğünüzü yazabilirsiniz.",
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

    // Fiyat tablosu yenilenirken sohbet yanıtını bekletme.
    void refreshPricingFromSheets(sheetsWebhookUrl);

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

            // Bu model çalışmazsa sıradaki yedek modele geç.
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

          console.warn(
            `Gemini ${modelName} metin döndürmedi: ${JSON.stringify({
              promptFeedback: data?.promptFeedback,
              finishReason: data?.candidates?.[0]?.finishReason,
            })}`
          );
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

    return NextResponse.json({
      reply,
      showContactButtons:
        userMessageCount >= 2 ||
        reply.toLowerCase().includes("telefon") ||
        reply.toLowerCase().includes("instagram"),
    });
  } catch (error) {
    console.error("CHAT ROUTE HATASI:", error);
    return NextResponse.json({
      reply: fallbackReply(),
      showContactButtons: true,
    });
  }
}

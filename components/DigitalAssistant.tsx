"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Send, RotateCcw, Check, Mail } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "assistant" | "user";
  text: string;
  links?: { label: string; url: string; type: string }[];
  showContact?: boolean;
}

const QUICK_PROMPTS = [
  {
    label: "Restoran & Menü Sistemi",
    prompt: "Restoranımız için dijital menü ve web sistemi arıyoruz. Örnek çalışmanız ve fiyatlarınız nedir?",
  },
  {
    label: "Güzellik & Klinik",
    prompt: "Güzellik merkezi / klinik için kurumsal sistem ve randevu altyapısı hakkında bilgi alabilir miyim?",
  },
  {
    label: "Eğitim & Danışmanlık",
    prompt: "Eğitim ve danışmanlık üzerine çalışan bir sistem örneğiniz ve fiyat aralığınız nedir?",
  },
  {
    label: "Fiyatlandırma & Kampanya",
    prompt: "Sistemlerinizin fiyat aralıkları, ilk yıl kampanyanız ve süreç hakkında bilgi alabilir miyim?",
  },
];

const INITIAL_MESSAGE = "Merhaba, ben NOVA. İşletmeniz için nasıl bir dijital yapı kurgulayalım?";

export function DigitalAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: INITIAL_MESSAGE,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const detectProjectLinks = (text: string) => {
    const links: { label: string; url: string; type: string }[] = [];
    const lower = text.toLowerCase();

    if (lower.includes("tandir") || lower.includes("restoran")) {
      links.push({
        label: "tandir.yildizworks.com",
        url: "https://tandir.yildizworks.com",
        type: "Restoran Mimarisi",
      });
    }
    if (lower.includes("guzellik") || lower.includes("güzellik") || lower.includes("klinik")) {
      links.push({
        label: "guzellik.yildizworks.com",
        url: "https://guzellik.yildizworks.com",
        type: "Klinik Mimarisi",
      });
    }
    if (lower.includes("zelal") || lower.includes("matematik") || lower.includes("eğitim")) {
      links.push({
        label: "matematikhocamzelal.com",
        url: "https://matematikhocamzelal.com",
        type: "Aktif Sistem",
      });
    }
    return links.length > 0 ? links : undefined;
  };

  // Kullanıcı telefon numarası bıraktığında tüm sohbeti tek seferde gönderir
  const checkAndSendLead = async (userText: string, history: ChatMessage[]) => {
    const digits = userText.replace(/\D/g, "");
    if (digits.length >= 10 && digits.length <= 13 && !leadCaptured) {
      setLeadCaptured(true);
      try {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "NOVA (Sohbet Asistanı)",
            businessName: userText,
            phone: userText,
            conversation: history
              .map((m) => `${m.sender === "user" ? "Müşteri" : "NOVA"}: ${m.text}`)
              .join("\n"),
            createdAt: "2026",
          }),
        });
      } catch {
        // Sessizce geç
      }
    }
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    checkAndSendLead(trimmed, updatedMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      const replyText = data.reply;

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        text: replyText,
        links: detectProjectLinks(replyText),
        showContact: Boolean(data.showContactButtons),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "assistant",
          text: "Detayları görüşmek için İsim, İşletme Adı ve Telefon Numaranızı bırakabilir veya aşağıdaki kanallardan bize ulaşabilirsiniz.",
          showContact: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleReset = () => {
    setLeadCaptured(false);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "assistant",
        text: INITIAL_MESSAGE,
      },
    ]);
  };

  return (
    <div id="asistan" className="w-full max-w-2xl mx-auto relative z-20">
      <div className="relative rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* Üst Çubuk - Göz Kırpan Metalik Yıldız */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-zinc-900 border border-white/15 flex items-center justify-center shadow-inner">
              <motion.svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-zinc-100 drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                fill="currentColor"
                animate={{
                  scaleY: [1, 1, 0.08, 1, 1],
                  scaleX: [1, 1, 1.18, 1, 1],
                }}
                transition={{
                  duration: 3.5,
                  times: [0, 0.45, 0.5, 0.55, 1],
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path d="M12 1L14.8 9.2L23 12L14.8 14.8L12 23L9.2 14.8L1 12L9.2 9.2L12 1Z" />
              </motion.svg>
            </div>

            <span className="text-xs font-semibold tracking-wider text-zinc-100">
              NOVA{" "}
              <span className="text-[10px] font-normal text-zinc-500">
                by yıldız works
              </span>
            </span>
          </div>

          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-zinc-500 hover:text-zinc-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Sıfırla</span>
            </button>
          )}
        </div>

        {/* Sohbet Alanı */}
        <div
          ref={chatContainerRef}
          className="p-5 space-y-4 max-h-[390px] overflow-y-auto"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-white text-zinc-950 font-medium"
                      : "bg-zinc-900/90 text-zinc-200 border border-white/10"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Canlı Proje Kartları */}
                {msg.links && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/10 hover:border-white/30 text-xs text-zinc-300 hover:text-white transition-all"
                      >
                        <span className="text-[10px] font-mono uppercase text-zinc-500">
                          {link.type}:
                        </span>
                        <span className="font-medium">{link.label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                      </a>
                    ))}
                  </div>
                )}

                {/* Tıklanabilir Instagram & E-Posta Kapanış Butonları */}
                {msg.showContact && (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <a
                      href="https://instagram.com/yildizworkscom"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/15 hover:border-white/35 text-xs text-zinc-200 hover:text-white transition-all"
                    >
                      <span>Instagram (@yildizworkscom)</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                    </a>
                    <a
                      href="mailto:iletisim@yildizworks.com"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-white/15 hover:border-white/35 text-xs text-zinc-200 hover:text-white transition-all"
                    >
                      <Mail className="w-3.5 h-3.5 text-zinc-400" />
                      <span>iletisim@yildizworks.com</span>
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex items-center gap-1.5 px-4 py-3 w-16 rounded-2xl bg-zinc-900/80 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
            </div>
          )}

          {leadCaptured && (
            <div className="rounded-xl bg-white/[0.04] border border-white/15 px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-zinc-200">
              <Check className="w-4 h-4 text-white shrink-0" />
              <span>İletişim bilginiz kaydedildi. Ekibimiz sizinle iletişime geçecek.</span>
            </div>
          )}
        </div>

        {/* Hızlı Seçenek Butonları */}
        {messages.length === 1 && (
          <div className="px-5 pb-3 flex flex-wrap gap-1.5 relative z-30">
            {QUICK_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(item.prompt)}
                className="text-xs text-zinc-300 hover:text-white active:scale-[0.98] bg-zinc-950/90 hover:bg-zinc-900 border border-white/10 hover:border-white/25 px-3 py-2 rounded-lg transition-all cursor-pointer touch-manipulation"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* Mesaj Gönderme Alanı */}
        <form
          onSubmit={handleFormSubmit}
          className="p-3 border-t border-white/10 bg-zinc-950/70 flex items-center gap-2 relative z-30"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder="Sektörünüzü, sorunuzu veya iletişim bilginizi yazın..."
            className="w-full bg-zinc-900/90 border border-white/10 focus:border-white/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer touch-manipulation"
          >
            <span>Gönder</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
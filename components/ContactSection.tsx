"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowUpRight,
  Send,
  Check,
  PhoneCall,
} from "lucide-react";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function ContactSection() {
  const [step, setStep] = useState<"ASK_NAME" | "ASK_PHONE" | "DONE">("ASK_NAME");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inputVal, setInputVal] = useState("");

  const handleNext = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = inputVal.trim();
    if (!val) return;

    if (step === "ASK_NAME") {
      setName(val);
      setInputVal("");
      setStep("ASK_PHONE");
    } else if (step === "ASK_PHONE") {
      setPhone(val);
      setInputVal("");
      setStep("DONE");

      try {
        await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "Geri Arama Talebi",
            businessName: name,
            phone: val,
            createdAt: "2026",
          }),
        });
      } catch {
        // Sessizce geç
      }
    }
  };

  return (
    <section id="iletisim" className="pt-12 pb-6 relative z-10 max-w-5xl mx-auto">
      <div className="mb-6 px-1">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-1">
          Doğrudan Bağlantı
        </span>
        <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
          İletişim & Danışmanlık
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sol: Instagram & E-Posta */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          <a
            href="https://instagram.com/yildizworkscom"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-5 rounded-2xl bg-zinc-900/40 border border-white/10 hover:border-white/25 transition-all h-full"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center">
                <InstagramIcon className="w-5 h-5 text-zinc-200" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  Instagram
                </span>
                <span className="text-xs text-zinc-400">@yildizworkscom</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <a
            href="mailto:iletisim@yildizworks.com"
            className="group flex items-center justify-between p-5 rounded-2xl bg-zinc-900/40 border border-white/10 hover:border-white/25 transition-all h-full"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-zinc-200" />
              </div>
              <div>
                <span className="text-sm font-semibold text-white block">
                  E-Posta
                </span>
                <span className="text-xs text-zinc-400">
                  iletisim@yildizworks.com
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* Sağ: Sizi Biz Arayalım Danışmanı */}
        <div className="lg:col-span-7 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/10 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
              <PhoneCall className="w-3.5 h-3.5 text-zinc-200" />
              <span>Geri Arama Talebi</span>
            </div>

            {step === "ASK_NAME" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-lg font-semibold text-white mb-1.5">
                  Sizi doğrudan biz arayalım mı?
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                  Adınızı veya işletmenizin ismini bırakın, projenizi doğrudan telefonda görüşelim:
                </p>
              </motion.div>
            )}

            {step === "ASK_PHONE" && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <h3 className="text-lg font-semibold text-white mb-1.5">
                  Memnuniyetle, {name}.
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                  Sizi hangi telefon numarasından ve hangi saat aralığında aramamızı istersiniz?
                </p>
              </motion.div>
            )}

            {step === "DONE" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-3 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Kaydınızı aldık, {name}.
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Ekibimiz <strong className="text-zinc-200">{phone}</strong> bilgisi üzerinden sizinle iletişime geçecektir.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {step !== "DONE" ? (
            <form onSubmit={handleNext} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  step === "ASK_NAME"
                    ? "Adınız / İşletme Adı"
                    : "05XX XXX XX XX (Uygun olduğunuz saat)"
                }
                className="w-full bg-zinc-950 border border-white/10 focus:border-white/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="px-5 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
              >
                <span>{step === "ASK_NAME" ? "Devam" : "Gönder"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setStep("ASK_NAME");
                setName("");
                setPhone("");
              }}
              className="self-start text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4 cursor-pointer"
            >
              Yeni bir numara bırak
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
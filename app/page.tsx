"use client";

import React, { MouseEvent, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Spotlight as AceternitySpotlight } from "@/components/Spotlight";
import { DigitalAssistant } from "@/components/DigitalAssistant";
import { Projects } from "@/components/Projects";
import { AboutManifesto } from "@/components/AboutManifesto";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ChevronDown, Mail, PhoneCall } from "lucide-react";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
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

export default function HomePage() {
  const [logoError, setLogoError] = useState(false);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const { scrollYProgress } = useScroll();
  const mobileLightY = useTransform(scrollYProgress, [0, 1], ["10%", "90%"]);

  return (
    <div
      className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-white/15 selection:text-white relative overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Masaüstü Spot Işığı */}
      <motion.div
        className="hidden md:block pointer-events-none fixed inset-0 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              550px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.055),
              transparent 80%
            )
          `,
        }}
      />

      {/* Mobil Spot Işığı */}
      <motion.div
        className="block md:hidden pointer-events-none fixed inset-0 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              360px circle at 50% ${mobileLightY},
              rgba(255, 255, 255, 0.08),
              transparent 75%
            )
          `,
        }}
      />

      {/* NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-zinc-950/85 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Sol: Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-black border border-white/15 group-hover:border-white/30 flex items-center justify-center overflow-hidden shrink-0 transition-all">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="Yıldız Works Logo"
                  onError={() => setLogoError(true)}
                  className="w-full h-full object-cover scale-125"
                />
              ) : (
                <span className="text-[11px] font-bold text-white">YW</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold tracking-[0.14em] text-white">
                YILDIZ WORKS
              </span>
              <span className="text-[10px] text-zinc-500 hidden sm:inline">
                Dijital Altyapı & Modern Web Geliştirme
              </span>
            </div>
          </a>

          {/* Sağ: Menü */}
          <div className="flex items-center gap-3.5 sm:gap-6">
            <a
              href="#projeler"
              className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Sistemler
            </a>
            <a
              href="#yaklasim"
              className="text-xs sm:text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Yaklaşım
            </a>

            {/* Açılır İletişim Menüsü */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setContactMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-medium text-white bg-zinc-900 border border-white/15 hover:border-white/35 active:scale-95 transition-all cursor-pointer touch-manipulation"
              >
                <span>İletişim</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                    contactMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {contactMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-950 border border-white/15 p-2 shadow-2xl z-[60] space-y-1"
                  >
                    <a
                      href="https://instagram.com/yildizworkscom"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setContactMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-zinc-200 hover:bg-white/10 transition-colors"
                    >
                      <InstagramIcon className="w-4 h-4 text-zinc-300" />
                      <span>Instagram (@yildizworkscom)</span>
                    </a>
                    <a
                      href="mailto:iletisim@yildizworks.com"
                      onClick={() => setContactMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs text-zinc-200 hover:bg-white/10 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-zinc-300" />
                      <span>E-Posta Gönderin</span>
                    </a>
                    <div className="h-px bg-white/10 my-1" />
                    <a
                      href="#iletisim"
                      onClick={() => setContactMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-white bg-white/5 hover:bg-white/15 transition-colors"
                    >
                      <PhoneCall className="w-4 h-4 text-zinc-200" />
                      <span>Sizi Biz Arayalım</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* ANA İÇERİK */}
      <main className="relative z-10 pt-24 sm:pt-32 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="pointer-events-none">
          <AceternitySpotlight
            className="-top-40 left-0 md:left-40 md:-top-20"
            fill="white"
          />
        </div>

        {/* HERO */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/70 border border-white/10 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-3"
          >
            WEB GELİŞTİRME • OTOMASYON • DİJİTAL ÇÖZÜMLER
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-zinc-500"
          >
            Güçlü altyapı. Akıllı sistemler.
          </motion.h1>
        </div>

        {/* 1. NOVA Dijital Danışman */}
        <DigitalAssistant />

        {/* 2. Vitrin: Kullanımdaki Sistemler & Konsept Mimariler */}
        <Projects />

        {/* 3. Yaklaşım */}
        <AboutManifesto />

        {/* 4. İletişim & Geri Arama */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
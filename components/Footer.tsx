"use client";

import React, { useState } from "react";

export function Footer() {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="border-t border-white/10 bg-zinc-950 py-8 mt-12 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Sol: Tam Oturan Logo ve Slogan */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-black border border-white/15 flex items-center justify-center overflow-hidden shrink-0">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Yıldız Works"
                onError={() => setLogoError(true)}
                className="w-full h-full object-cover scale-125"
              />
            ) : (
              <span className="text-[10px] font-bold text-zinc-200">YW</span>
            )}
          </div>
          <div>
            <span className="text-xs font-bold tracking-[0.16em] text-white block">
              YILDIZ WORKS
            </span>
            <span className="text-[11px] text-zinc-500">
              Dijital Altyapı ve Modern Web Geliştirme
            </span>
          </div>
        </div>

        {/* Orta: Bağlantılar */}
        <div className="flex items-center gap-6 text-xs text-zinc-400">
          <a
            href="https://instagram.com/yildizworkscom"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href="mailto:iletisim@yildizworks.com"
            className="hover:text-white transition-colors"
          >
            E-Posta
          </a>
        </div>

        {/* Sağ: Telif */}
        <p className="text-xs text-zinc-600 font-mono">
          &copy; 2026 Yıldız Works.
        </p>
      </div>
    </footer>
  );
}
"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

export default function ComingSoon() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050505] selection:bg-neutral-800 selection:text-neutral-200"
      onMouseMove={handleMouseMove}
    >
      {/* Arka Planda Çok Hafif Silik (Watermark) Logo / Geometrik Mimari İkonu */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div className="relative select-none opacity-[0.025] blur-[1px] transition-all duration-700">
          {/* Geometrik / Endüstriyel Yıldız Motif Vektörü */}
          <svg
            className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
      </div>

      {/* Dinamik Spotlight Efekti (İmleci Takip Eden Işık Hüzmesi) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.06),
              transparent 80%
            )
          `,
        }}
      />

      {/* Merkez Sabit Ek Işık Katmanı */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.025)_0,transparent_70%)]" />

      {/* Ana İçerik */}
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 flex flex-col items-center text-center px-6"
      >
        {/* Marka Adı - Gümüş Metalik Geçiş */}
        <motion.h1
          variants={fadeUpVariants}
          className="bg-gradient-to-br from-neutral-100 via-neutral-300 to-neutral-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-sm"
        >
          Yıldız Works
        </motion.h1>

        {/* Slogan */}
        <motion.p
          variants={fadeUpVariants}
          className="mt-6 max-w-lg text-base font-medium tracking-wide text-neutral-400 sm:text-lg md:text-xl"
        >
          Dijital altyapı-Modern web geliştirme.
        </motion.p>
      </motion.div>

      {/* En Alt Bilgi (Footer Notu) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1.2 }}
        className="absolute bottom-12 z-20 px-6 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
          Dijital mimarimiz inşa ediliyor. Çok yakında.
        </p>
      </motion.div>
    </main>
  );
}
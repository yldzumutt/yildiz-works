"use client";

import React from "react";
import { motion } from "framer-motion";

export function AboutManifesto() {
  return (
    <section id="yaklasim" className="pt-12 pb-6 relative z-10 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl bg-zinc-900/35 backdrop-blur-md border border-white/10 p-6 sm:p-10 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-2">
              Yaklaşım
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
              Kartvizit değil, çalışan mekanizma kuruyoruz.
            </h2>
          </div>

          <div className="md:col-span-7">
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              Hazır şablonları boyayıp teslim etmiyoruz. Yıldız Works; işletmenizin dijitaldeki varlığını hareketsiz bir broşürden çıkarıp, müşteriyi doğrudan aksiyona yönlendiren ve kendi kendine işleyen modern bir altyapıya dönüştürür.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
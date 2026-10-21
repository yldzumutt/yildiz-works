"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface ProjectItem {
  title: string;
  sector: string;
  domain: string;
  url: string;
  status: "active" | "concept"; // Sadece bu değeri değiştirerek projenin yerini değiştirebilirsin
  video?: string;
  image?: string;
}

const ALL_PROJECTS: ProjectItem[] = [
  {
    title: "Matematik Hocam Zelal",
    sector: "Eğitim & Danışmanlık Platformu",
    domain: "matematikhocamzelal.com",
    url: "https://matematikhocamzelal.com",
    status: "active",
    video: "/projects/zelal.mp4",
    image: "/projects/zelal.jpg",
  },
  {
    title: "Tandır Restoran",
    sector: "Gastronomi & Dijital Menü Mimarisi",
    domain: "tandir.yildizworks.com",
    url: "https://tandir.yildizworks.com",
    status: "concept", // Domain bağlandığında burayı "active" yapman yeterli
    video: "/projects/tandir.mp4",
    image: "/projects/tandir.jpg",
  },
  {
    title: "Güzellik & Estetik Merkezi",
    sector: "Klinik & Randevu Mimarisi",
    domain: "guzellik.yildizworks.com",
    url: "https://guzellik.yildizworks.com",
    status: "concept",
    video: "/projects/guzellik.mp4",
    image: "/projects/guzellik.jpg",
  },
];

function ProjectCard({ item, badge }: { item: ProjectItem; badge: string }) {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between w-[310px] sm:w-[380px] shrink-0 rounded-2xl bg-zinc-900/40 backdrop-blur-md border border-white/10 hover:border-white/25 p-4 transition-all duration-300"
    >
      {/* Medya Kutusu */}
      <div className="relative h-48 w-full rounded-xl bg-zinc-950 border border-white/5 overflow-hidden mb-4 flex items-center justify-center">
        {/* Video varsa yüklenene kadar siyah kalmaması için arkada görsel veya domain gösterilir */}
        {item.video && !videoFailed && (
          <video
            src={item.video}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoReady(true)}
            onError={() => setVideoFailed(true)}
            className={`absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-700 ${
              videoReady ? "opacity-100 z-10" : "opacity-0"
            }`}
          />
        )}

        {!videoReady && item.image && !imageFailed && (
          <img
            src={item.image}
            alt={item.title}
            onError={() => setImageFailed(true)}
            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          />
        )}

        {!videoReady && (!item.image || imageFailed) && (
          <div className="flex flex-col items-center justify-center gap-1.5 text-center px-4">
            <span className="text-xs font-mono tracking-widest text-zinc-300 group-hover:text-white transition-colors">
              {item.domain}
            </span>
            <span className="text-[11px] text-zinc-600">
              Canlı sistemi görüntülemek için tıklayın
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 z-20">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-950/85 backdrop-blur-md text-zinc-300 border border-white/10">
            {badge}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-20 w-7 h-7 rounded-lg bg-zinc-950/85 backdrop-blur-md border border-white/10 flex items-center justify-center">
          <ArrowUpRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
            {item.title}
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">{item.sector}</p>
        </div>
        <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
          İncele →
        </span>
      </div>
    </a>
  );
}

export function Projects() {
  const activeSystems = ALL_PROJECTS.filter((p) => p.status === "active");
  const conceptSystems = ALL_PROJECTS.filter((p) => p.status === "concept");

  const marqueeItems = [
    ...conceptSystems,
    ...conceptSystems,
    ...conceptSystems,
  ];

  return (
    <section id="projeler" className="pt-14 pb-6 relative z-10 space-y-12">
      {/* 1. KULLANIMDAKİ SİSTEMLER */}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-5 px-1">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-1">
              Sahadaki Referanslar
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Kullanımdaki Sistemler
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-5">
          {activeSystems.map((item, idx) => (
            <ProjectCard key={idx} item={item} badge="Aktif Sistem" />
          ))}
        </div>
      </div>

      {/* 2. KONSEPT MİMARİLER */}
      {conceptSystems.length > 0 && (
        <div className="max-w-5xl mx-auto overflow-hidden">
          <div className="flex items-center justify-between mb-5 px-1">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 block mb-1">
                Vitrin & Deneyim
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                Konsept Mimariler
              </h2>
            </div>
            <span className="text-xs text-zinc-500 hidden sm:inline">
              Deneyimlemek için kartlara tıklayın
            </span>
          </div>

          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
            <div className="flex gap-5 w-max animate-marquee hover:[animation-play-state:paused]">
              {marqueeItems.map((item, idx) => (
                <ProjectCard key={idx} item={item} badge="Konsept Mimari" />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
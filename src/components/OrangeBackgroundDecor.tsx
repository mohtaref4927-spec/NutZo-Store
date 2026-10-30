import React from 'react';

export const OrangeBackgroundDecor: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Base Warm Deep Orange Gradient Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#180600] via-[#100400] to-[#0a0200]" />

      {/* Atmospheric Soft Radiant Amber/Orange Glowing Radial Blooms */}
      <div className="absolute -top-32 -right-32 w-[650px] h-[650px] bg-orange-600/12 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -left-40 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[150px]" />
      <div className="absolute -bottom-40 right-1/4 w-[700px] h-[700px] bg-orange-700/15 rounded-full blur-[160px]" />

      {/* Grid Pattern with subtle warm orange hairline lines */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, #ea580c 1px, transparent 1px), linear-gradient(to bottom, #ea580c 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Translucent Floating Orange Geometric Squares / Tiles (Big & Small, Dark & Light) */}
      
      {/* 1. Large Top-Right Translucent Dark-Orange Tile */}
      <div className="absolute top-20 right-12 md:right-28 w-44 h-44 rounded-3xl bg-orange-950/25 border border-orange-500/20 backdrop-blur-[6px] shadow-lg shadow-orange-950/30 animate-float-slow -rotate-12" />

      {/* 2. Small Radiant Light-Orange Square near Top Right */}
      <div className="absolute top-48 right-36 md:right-72 w-16 h-16 rounded-xl bg-orange-500/15 border border-amber-400/30 backdrop-blur-[4px] animate-float-reverse rotate-6" />

      {/* 3. Medium Translucent Amber Square on Upper Left */}
      <div className="absolute top-36 left-8 md:left-24 w-28 h-28 rounded-2xl bg-amber-950/20 border border-orange-400/25 backdrop-blur-[5px] animate-float-reverse rotate-12" />

      {/* 4. Tiny Floating Orange Gem */}
      <div className="absolute top-72 left-20 md:left-48 w-10 h-10 rounded-lg bg-orange-600/25 border border-orange-400/40 rotate-45 animate-pulse-subtle" />

      {/* 5. Giant Soft Translucent Backdrop Square (Center-Right) */}
      <div className="absolute top-1/2 -right-16 w-80 h-80 rounded-[40px] bg-orange-900/10 border border-orange-600/15 backdrop-blur-[8px] animate-float-slow rotate-6" />

      {/* 6. Medium Translucent Tile (Center-Left) */}
      <div className="absolute top-1/2 left-10 md:left-20 w-36 h-36 rounded-2xl bg-orange-950/30 border border-amber-500/20 backdrop-blur-[6px] animate-float-reverse -rotate-6" />

      {/* 7. Small Bright Amber Square */}
      <div className="absolute top-2/3 left-32 md:left-64 w-14 h-14 rounded-xl bg-amber-600/20 border border-amber-300/30 rotate-12 animate-float-slow" />

      {/* 8. Large Bottom-Left Translucent Tile */}
      <div className="absolute bottom-24 left-12 md:left-32 w-52 h-52 rounded-3xl bg-orange-950/20 border border-orange-500/15 backdrop-blur-[6px] animate-float-slow -rotate-12" />

      {/* 9. Small Bottom-Right Accent Tile */}
      <div className="absolute bottom-32 right-20 md:right-40 w-20 h-20 rounded-xl bg-orange-600/15 border border-orange-400/25 rotate-45 animate-float-reverse" />
    </div>
  );
};

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

// Automatically migrate App.tsx variables, color codes, and names on startup to avoid manual search-replace errors
const appFile = path.resolve(__dirname, 'src/App.tsx');
if (fs.existsSync(appFile)) {
  let content = fs.readFileSync(appFile, 'utf8');
  if (content.toLowerCase().includes('staff') || content.includes('#F2C438')) {
    console.log('[RocoMamas OS Build] Performing deep case-insensitive migration of all references and assets...');
    
    // Replace theme logo
    content = content.replace(/https:\/\/thestaffy\.co\.za\/wp-content\/uploads\/2025\/04\/Untitled-2025-04-25T095611\.622\.png/g, 'https://www.rocomamas.co.ke/images//logo-combined.png');

    // Replace color codes
    content = content.replace(/#F2C438/g, '#FF5A00');
    content = content.replace(/rgba\(242,\s*196,\s*56/g, 'rgba(255, 90, 0');
    content = content.replace(/rgb\(242,\s*196,\s*56\)/g, 'rgb(255, 90, 0)');
    
    // Replace text-yellow- and other yellow Tailwind utility classes to match RocoMamas Orange
    content = content.replace(/\byellow-500\b/g, 'orange-500');
    content = content.replace(/\byellow-400\b/g, 'orange-400');
    content = content.replace(/\byellow-600\b/g, 'orange-600');
    content = content.replace(/\btext-yellow-400\b/g, 'text-[#FF5A00]');
    content = content.replace(/\btext-yellow-500\b/g, 'text-[#FF5A00]');
    content = content.replace(/\btext-yellow-300\b/g, 'text-orange-400');
    content = content.replace(/\btext-yellow-250\b/g, 'text-orange-250');
    content = content.replace(/\btext-yellow-200\b/g, 'text-orange-200');
    content = content.replace(/\btext-yellow-600\b/g, 'text-[#FF5A00]');
    content = content.replace(/\bbg-yellow-400\b/g, 'bg-[#FF5A00]');
    content = content.replace(/\bbg-yellow-500\b/g, 'bg-[#FF5A00]');
    content = content.replace(/\bbg-yellow-600\b/g, 'bg-orange-600');
    content = content.replace(/\bhover:bg-yellow-450\b/g, 'hover:bg-orange-600');
    content = content.replace(/\bhover:bg-yellow-400\b/g, 'hover:bg-orange-600');
    content = content.replace(/\bhover:bg-yellow-500\b/g, 'hover:bg-orange-600');
    content = content.replace(/\bshadow-yellow-500\b/g, 'shadow-orange-500');
    content = content.replace(/\bborder-yellow-500\b/g, 'border-[#FF5A00]');

    // Advanced case-insensitive global replacements
    content = content.replace(/STAFFY<span className="text-white">OS<\/span>/gi, 'ROCO<span className="text-white">MAMAS OS</span>');
    content = content.replace(/STAFFORDSHIRE<span className="text-\[#F2C438\]">OS<\/span>/gi, 'ROCOMAMAS <span className="text-[#FF5A00]">OS</span>');
    content = content.replace(/THE STAFFORDSHIRE OS ONLINE/gi, 'ROCOMAMAS GUEST OS ONLINE');
    content = content.replace(/The Staffordshire OS/gi, 'RocoMamas OS');
    content = content.replace(/Staffordshire OS/gi, 'RocoMamas OS');
    content = content.replace(/staffordshire-os-container/gi, 'rocomamas-os-container');
    content = content.replace(/The Staffy Booking Engine/gi, 'RocoMamas Booking Engine');
    content = content.replace(/THE STAFFY OS GAMES/gi, 'ROCOMAMAS OS GAMES');
    content = content.replace(/THE STAFFY OS/gi, 'ROCOMAMAS OS');
    content = content.replace(/THE STAFFY/gi, 'ROCOMAMAS');
    content = content.replace(/thestaffy\.co\.za/gi, 'rocomamas.co.ke');
    content = content.replace(/The Staffordshire Logo/gi, 'RocoMamas Logo');
    content = content.replace(/The Staffordshire/gi, 'RocoMamas');
    content = content.replace(/Staffordshire/gi, 'RocoMamas');
    content = content.replace(/Welcome to Staffordshire!/gi, 'Welcome to RocoMamas!');
    content = content.replace(/Welcome to The Staffy/gi, 'Welcome to RocoMamas!');
    content = content.replace(/the staffy/gi, 'RocoMamas');
    content = content.replace(/The Staffy/gi, 'RocoMamas');
    content = content.replace(/Love the StaffyOS speed\?/gi, 'Love the RocoMamas OS experience?');
    content = content.replace(/Staffy Guest OS Companion/gi, 'RocoMamas Guest OS Companion');
    content = content.replace(/Staffy Sensation Box/gi, 'Roco Rockstar Smash-Box');
    content = content.replace(/Staffy Control Center/gi, 'Roco Control Center');
    content = content.replace(/Staffy/gi, 'Roco');
    content = content.replace(/staffy/gi, 'roco');

    // Replace staff names or servers helper strings
    content = content.replace(/\bThabo\b/g, 'Roco Crew');
    content = content.replace(/\bThabo's\b/g, "Roco Crew's");
    content = content.replace(/\bthabo\b/g, 'roco crew');

    fs.writeFileSync(appFile, content, 'utf8');
    console.log('[RocoMamas OS Build] Core application file fully deep-migrated.');
  }
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

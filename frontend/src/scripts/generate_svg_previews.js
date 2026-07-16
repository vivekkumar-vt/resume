const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '..', 'public', 'templates');
if (!fs.existsSync(dir)){
  fs.mkdirSync(dir, { recursive: true });
}

const templates = {
  "executive-classic": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Profile Photo placeholder (centered) -->
    <circle cx="150" cy="55" r="18" fill="#4f46e5" opacity="0.8"/>
    <circle cx="150" cy="55" r="14" fill="#312e81"/>
    <path d="M142 66 C 142 60, 158 60, 158 66 Z" fill="#a5b4fc"/>
    <circle cx="150" cy="51" r="5" fill="#a5b4fc"/>

    <!-- Centered Header -->
    <rect x="90" y="82" width="120" height="8" rx="4" fill="#f8fafc"/>
    <rect x="110" y="94" width="80" height="5" rx="2.5" fill="#94a3b8"/>
    
    <line x1="40" y1="108" x2="260" y2="108" stroke="#3f3f46" stroke-width="1"/>
    
    <!-- Contact Info -->
    <rect x="50" y="116" width="200" height="4" rx="2" fill="#71717a"/>
    
    <!-- Summary -->
    <rect x="40" y="132" width="220" height="5" rx="2.5" fill="#4f46e5" opacity="0.7"/>
    <rect x="40" y="142" width="220" height="4" rx="2" fill="#52525b"/>
    <rect x="40" y="150" width="180" height="4" rx="2" fill="#52525b"/>

    <!-- Experience -->
    <rect x="40" y="168" width="220" height="5" rx="2.5" fill="#4f46e5" opacity="0.7"/>
    
    <rect x="40" y="180" width="120" height="5" rx="2.5" fill="#a1a1aa"/>
    <rect x="220" y="180" width="40" height="4" rx="2" fill="#71717a"/>
    <rect x="40" y="188" width="220" height="3" rx="1.5" fill="#52525b"/>
    <rect x="40" y="195" width="200" height="3" rx="1.5" fill="#52525b"/>

    <rect x="40" y="208" width="120" height="5" rx="2.5" fill="#a1a1aa"/>
    <rect x="220" y="208" width="40" height="4" rx="2" fill="#71717a"/>
    <rect x="40" y="216" width="220" height="3" rx="1.5" fill="#52525b"/>

    <!-- Skills (2 columns) -->
    <rect x="40" y="235" width="220" height="5" rx="2.5" fill="#4f46e5" opacity="0.7"/>
    <rect x="40" y="247" width="100" height="4" rx="2" fill="#71717a"/>
    <rect x="40" y="255" width="80" height="4" rx="2" fill="#71717a"/>
    <rect x="160" y="247" width="100" height="4" rx="2" fill="#71717a"/>
    <rect x="160" y="255" width="90" height="4" rx="2" fill="#71717a"/>

    <!-- Education -->
    <rect x="40" y="275" width="220" height="5" rx="2.5" fill="#4f46e5" opacity="0.7"/>
    <rect x="40" y="287" width="140" height="5" rx="2.5" fill="#a1a1aa"/>
    <rect x="40" y="295" width="180" height="4" rx="2" fill="#52525b"/>
  </svg>`,

  "modern-corporate": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Profile Photo placeholder (left) -->
    <circle cx="58" cy="55" r="18" fill="#4f46e5" opacity="0.8"/>
    <circle cx="58" cy="55" r="14" fill="#312e81"/>
    <path d="M50 66 C 50 60, 66 60, 66 66 Z" fill="#a5b4fc"/>
    <circle cx="58" cy="51" r="5" fill="#a5b4fc"/>

    <!-- Header info next to image -->
    <rect x="88" y="42" width="120" height="8" rx="4" fill="#f8fafc"/>
    <rect x="88" y="56" width="90" height="5" rx="2.5" fill="#818cf8"/>
    
    <!-- Divider bar -->
    <rect x="40" y="85" width="220" height="2.5" rx="1" fill="#4f46e5"/>
    
    <!-- Contact Info -->
    <rect x="40" y="96" width="220" height="4" rx="2" fill="#71717a"/>
    
    <!-- Summary -->
    <rect x="40" y="112" width="100" height="6" rx="3" fill="#818cf8"/>
    <rect x="40" y="124" width="220" height="4" rx="2" fill="#52525b"/>
    <rect x="40" y="132" width="200" height="4" rx="2" fill="#52525b"/>

    <!-- Experience -->
    <rect x="40" y="152" width="100" height="6" rx="3" fill="#818cf8"/>
    
    <rect x="40" y="164" width="130" height="5" rx="2.5" fill="#a1a1aa"/>
    <rect x="210" y="164" width="50" height="4" rx="2" fill="#71717a"/>
    <rect x="40" y="172" width="220" height="3" rx="1.5" fill="#52525b"/>
    <rect x="40" y="179" width="180" height="3" rx="1.5" fill="#52525b"/>

    <rect x="40" y="194" width="130" height="5" rx="2.5" fill="#a1a1aa"/>
    <rect x="210" y="194" width="50" height="4" rx="2" fill="#71717a"/>
    <rect x="40" y="202" width="200" height="3" rx="1.5" fill="#52525b"/>

    <!-- Projects -->
    <rect x="40" y="222" width="100" height="6" rx="3" fill="#818cf8"/>
    <rect x="40" y="234" width="120" height="5" rx="2.5" fill="#a1a1aa"/>
    <rect x="40" y="242" width="220" height="3" rx="1.5" fill="#52525b"/>

    <!-- Skills -->
    <rect x="40" y="262" width="100" height="6" rx="3" fill="#818cf8"/>
    <rect x="40" y="274" width="220" height="4" rx="2" fill="#71717a"/>
    <rect x="40" y="282" width="180" height="4" rx="2" fill="#71717a"/>
  </svg>`,

  "elegant-minimal": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Profile Photo (circular left outline) -->
    <circle cx="58" cy="55" r="18" fill="none" stroke="#e4e4e7" stroke-width="1"/>
    <circle cx="58" cy="55" r="15" fill="#27272a"/>
    <path d="M51 65 C 51 60, 65 60, 65 65 Z" fill="#d4d4d8"/>
    <circle cx="58" cy="51" r="4.5" fill="#d4d4d8"/>

    <!-- Serif Header -->
    <rect x="88" y="42" width="130" height="8" rx="2" fill="#f4f4f5"/>
    <rect x="88" y="56" width="100" height="4" rx="1.5" fill="#a1a1aa"/>
    
    <line x1="40" y1="85" x2="260" y2="85" stroke="#27272a" stroke-width="0.5"/>
    
    <!-- Contact Info -->
    <rect x="40" y="94" width="220" height="4" rx="2" fill="#52525b"/>

    <!-- Summary -->
    <rect x="40" y="112" width="120" height="5" rx="1" fill="#e4e4e7"/>
    <rect x="40" y="122" width="220" height="3" rx="1" fill="#71717a"/>
    <rect x="40" y="129" width="210" height="3" rx="1" fill="#71717a"/>

    <!-- Experience -->
    <rect x="40" y="146" width="120" height="5" rx="1" fill="#e4e4e7"/>
    
    <rect x="40" y="156" width="140" height="4" rx="1" fill="#d4d4d8"/>
    <rect x="220" y="156" width="40" height="3" rx="1" fill="#52525b"/>
    <rect x="40" y="164" width="220" height="3" rx="1" fill="#71717a"/>
    <rect x="40" y="171" width="190" height="3" rx="1" fill="#71717a"/>

    <rect x="40" y="184" width="140" height="4" rx="1" fill="#d4d4d8"/>
    <rect x="40" y="192" width="220" height="3" rx="1" fill="#71717a"/>

    <!-- Education -->
    <rect x="40" y="210" width="120" height="5" rx="1" fill="#e4e4e7"/>
    <rect x="40" y="220" width="150" height="4" rx="1" fill="#d4d4d8"/>
    <rect x="40" y="228" width="180" height="3" rx="1" fill="#71717a"/>
  </svg>`,

  "neo-gradient": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Left Sidebar (Gradient background mockup) -->
    <rect x="21" y="21" width="80" height="358" rx="0" fill="#202023" opacity="0.6"/>
    
    <!-- Profile Photo inside Sidebar -->
    <circle cx="61" cy="55" r="18" fill="#6366f1" opacity="0.8"/>
    <circle cx="61" cy="55" r="14" fill="#312e81"/>
    <path d="M53 66 C 53 60, 69 60, 69 66 Z" fill="#c7d2fe"/>
    <circle cx="61" cy="51" r="5" fill="#c7d2fe"/>

    <!-- Sidebar Contact Details -->
    <rect x="35" y="85" width="50" height="5" rx="2" fill="#6366f1" opacity="0.8"/>
    <rect x="35" y="96" width="50" height="3" rx="1.5" fill="#52525b"/>
    <rect x="35" y="103" width="40" height="3" rx="1.5" fill="#52525b"/>
    
    <!-- Sidebar Skills with progress bars -->
    <rect x="35" y="125" width="50" height="5" rx="2" fill="#6366f1" opacity="0.8"/>
    
    <rect x="35" y="136" width="30" height="3" rx="1.5" fill="#a1a1aa"/>
    <rect x="35" y="142" width="52" height="2" rx="1" fill="#27272a"/>
    <rect x="35" y="142" width="45" height="2" rx="1" fill="#6366f1"/>

    <rect x="35" y="150" width="40" height="3" rx="1.5" fill="#a1a1aa"/>
    <rect x="35" y="156" width="52" height="2" rx="1" fill="#27272a"/>
    <rect x="35" y="156" width="35" height="2" rx="1" fill="#6366f1"/>

    <!-- Right Side Name -->
    <rect x="115" y="36" width="110" height="8" rx="4" fill="#f8fafc"/>
    <rect x="115" y="48" width="80" height="5" rx="2.5" fill="#6366f1"/>
    
    <!-- Experience inside Rounded Cards -->
    <rect x="115" y="70" width="70" height="6" rx="3" fill="#6366f1" opacity="0.8"/>
    
    <!-- Card 1 -->
    <rect x="115" y="82" width="150" height="50" rx="6" fill="#1c1c1f" stroke="#2d2d30" stroke-width="1"/>
    <rect x="125" y="92" width="80" height="4" rx="2" fill="#f8fafc"/>
    <rect x="125" y="100" width="40" height="3" rx="1.5" fill="#71717a"/>
    <rect x="125" y="108" width="130" height="3" rx="1.5" fill="#52525b"/>
    <rect x="125" y="115" width="120" height="3" rx="1.5" fill="#52525b"/>

    <!-- Card 2 -->
    <rect x="115" y="138" width="150" height="40" rx="6" fill="#1c1c1f" stroke="#2d2d30" stroke-width="1"/>
    <rect x="125" y="148" width="90" height="4" rx="2" fill="#f8fafc"/>
    <rect x="125" y="156" width="120" height="3" rx="1.5" fill="#52525b"/>

    <!-- Education Inside Card -->
    <rect x="115" y="195" width="70" height="6" rx="3" fill="#6366f1" opacity="0.8"/>
    <rect x="115" y="207" width="150" height="40" rx="6" fill="#1c1c1f" stroke="#2d2d30" stroke-width="1"/>
  </svg>`,

  "professional-timeline": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Profile Photo (left-aligned) -->
    <circle cx="58" cy="55" r="18" fill="#3b82f6" opacity="0.8"/>
    <circle cx="58" cy="55" r="14" fill="#1e3a8a"/>
    <path d="M50 66 C 50 60, 66 60, 66 66 Z" fill="#93c5fd"/>
    <circle cx="58" cy="51" r="5" fill="#93c5fd"/>

    <!-- Header name -->
    <rect x="88" y="42" width="130" height="8" rx="4" fill="#f8fafc"/>
    <rect x="88" y="56" width="90" height="5" rx="2.5" fill="#3b82f6"/>
    
    <!-- Contact Info Row -->
    <rect x="40" y="85" width="220" height="4" rx="2" fill="#52525b"/>

    <!-- Timeline Area -->
    <rect x="40" y="105" width="90" height="6" rx="3" fill="#3b82f6" opacity="0.8"/>

    <!-- Timeline vertical connecting line -->
    <line x1="48" y1="125" x2="48" y2="250" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="2,2"/>
    
    <!-- Entry 1 -->
    <circle cx="48" cy="130" r="4.5" fill="#18181b" stroke="#3b82f6" stroke-width="1.5"/>
    <rect x="62" y="125" width="120" height="5" rx="2" fill="#f8fafc"/>
    <rect x="62" y="133" width="190" height="3" rx="1.5" fill="#71717a"/>
    <rect x="62" y="140" width="180" height="3" rx="1.5" fill="#71717a"/>

    <!-- Entry 2 -->
    <circle cx="48" cy="165" r="4.5" fill="#18181b" stroke="#3b82f6" stroke-width="1.5"/>
    <rect x="62" y="160" width="100" height="5" rx="2" fill="#f8fafc"/>
    <rect x="62" y="168" width="190" height="3" rx="1.5" fill="#71717a"/>

    <!-- Entry 3 -->
    <circle cx="48" cy="200" r="4.5" fill="#18181b" stroke="#3b82f6" stroke-width="1.5"/>
    <rect x="62" y="195" width="110" height="5" rx="2" fill="#f8fafc"/>
    <rect x="62" y="203" width="150" height="3" rx="1.5" fill="#71717a"/>

    <!-- Skills Section with tag pills -->
    <rect x="40" y="235" width="90" height="6" rx="3" fill="#3b82f6" opacity="0.8"/>
    <rect x="40" y="248" width="45" height="10" rx="3" fill="#1e3a8a" stroke="#3b82f6" stroke-width="0.5"/>
    <rect x="90" y="248" width="55" height="10" rx="3" fill="#1e3a8a" stroke="#3b82f6" stroke-width="0.5"/>
    <rect x="150" y="248" width="40" height="10" rx="3" fill="#1e3a8a" stroke="#3b82f6" stroke-width="0.5"/>
    <rect x="195" y="248" width="60" height="10" rx="3" fill="#1e3a8a" stroke="#3b82f6" stroke-width="0.5"/>
  </svg>`,

  "premium-blocks": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Profile Photo (left side) -->
    <circle cx="58" cy="55" r="18" fill="#10b981" opacity="0.8"/>
    <circle cx="58" cy="55" r="14" fill="#064e3b"/>
    <path d="M50 66 C 50 60, 66 60, 66 66 Z" fill="#a7f3d0"/>
    <circle cx="58" cy="51" r="5" fill="#a7f3d0"/>

    <!-- Header name -->
    <rect x="88" y="42" width="130" height="8" rx="4" fill="#f8fafc"/>
    <rect x="88" y="56" width="90" height="5" rx="2.5" fill="#10b981"/>
    
    <!-- Contact Info -->
    <rect x="40" y="85" width="220" height="4" rx="2" fill="#52525b"/>

    <!-- Category Block Header 1 -->
    <rect x="40" y="105" width="220" height="16" rx="4" fill="#1c1c1f"/>
    <rect x="50" y="110" width="80" height="6" rx="3" fill="#10b981"/>

    <!-- Experience Card Item 1 -->
    <rect x="40" y="128" width="220" height="45" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    <rect x="50" y="138" width="110" height="4" rx="2" fill="#f8fafc"/>
    <rect x="50" y="146" width="190" height="3" rx="1.5" fill="#71717a"/>
    <rect x="50" y="153" width="170" height="3" rx="1.5" fill="#71717a"/>

    <!-- Category Block Header 2 -->
    <rect x="40" y="185" width="220" height="16" rx="4" fill="#1c1c1f"/>
    <rect x="50" y="190" width="80" height="6" rx="3" fill="#10b981"/>

    <!-- Experience Card Item 2 -->
    <rect x="40" y="208" width="220" height="35" rx="6" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    <rect x="50" y="218" width="130" height="4" rx="2" fill="#f8fafc"/>
    <rect x="50" y="226" width="195" height="3" rx="1.5" fill="#71717a"/>

    <!-- Skills pills outline -->
    <rect x="40" y="255" width="220" height="16" rx="4" fill="#1c1c1f"/>
    <rect x="50" y="260" width="80" height="6" rx="3" fill="#10b981"/>
    
    <rect x="40" y="280" width="50" height="10" rx="5" fill="#18181b" stroke="#10b981" stroke-width="0.5"/>
    <rect x="95" y="280" width="60" height="10" rx="5" fill="#18181b" stroke="#10b981" stroke-width="0.5"/>
    <rect x="160" y="280" width="50" height="10" rx="5" fill="#18181b" stroke="#10b981" stroke-width="0.5"/>
  </svg>`,

  "classic": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Profile Image placeholder -->
    <circle cx="150" cy="52" r="18" fill="#71717a" opacity="0.6"/>
    <circle cx="150" cy="52" r="14" fill="#27272a"/>
    <path d="M142 63 C 142 58, 158 58, 158 63 Z" fill="#a1a1aa"/>
    <circle cx="150" cy="48" r="5" fill="#a1a1aa"/>

    <!-- Centered Header -->
    <rect x="90" y="78" width="120" height="8" rx="4" fill="#f8fafc"/>
    <rect x="110" y="90" width="80" height="5" rx="2.5" fill="#71717a"/>
    
    <rect x="50" y="102" width="200" height="4" rx="2" fill="#52525b"/>
    <line x1="40" y1="112" x2="260" y2="112" stroke="#27272a" stroke-width="0.5"/>
    
    <!-- Sections -->
    <rect x="40" y="124" width="220" height="4" rx="2" fill="#a1a1aa"/>
    <rect x="40" y="134" width="220" height="3" rx="1.5" fill="#52525b"/>
    <rect x="40" y="141" width="180" height="3" rx="1.5" fill="#52525b"/>

    <rect x="40" y="156" width="220" height="4" rx="2" fill="#a1a1aa"/>
    <rect x="40" y="166" width="130" height="4" rx="2" fill="#d4d4d8"/>
    <rect x="40" y="174" width="220" height="3" rx="1.5" fill="#52525b"/>
    <rect x="40" y="181" width="190" height="3" rx="1.5" fill="#52525b"/>
  </svg>`,

  "modern": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Profile Photo (left side) -->
    <circle cx="58" cy="55" r="18" fill="#71717a" opacity="0.6"/>
    <circle cx="58" cy="55" r="14" fill="#27272a"/>
    <path d="M50 66 C 50 60, 66 60, 66 66 Z" fill="#a1a1aa"/>
    <circle cx="58" cy="51" r="5" fill="#a1a1aa"/>

    <!-- Left Header -->
    <rect x="88" y="42" width="130" height="8" rx="4" fill="#f8fafc"/>
    <rect x="88" y="56" width="90" height="5" rx="2.5" fill="#71717a"/>
    
    <rect x="40" y="85" width="220" height="4" rx="2" fill="#52525b"/>
    <line x1="40" y1="95" x2="260" y2="95" stroke="#27272a" stroke-width="1"/>

    <!-- Summary -->
    <rect x="40" y="110" width="220" height="4" rx="2" fill="#a1a1aa"/>
    <rect x="40" y="120" width="220" height="3" rx="1.5" fill="#52525b"/>

    <!-- Experience -->
    <rect x="40" y="136" width="220" height="4" rx="2" fill="#a1a1aa"/>
    <rect x="40" y="146" width="140" height="4" rx="2" fill="#d4d4d8"/>
    <rect x="40" y="154" width="220" height="3" rx="1.5" fill="#52525b"/>
  </svg>`,

  "minimal": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Profile Photo (minimal square outline) -->
    <rect x="40" y="38" width="30" height="30" rx="4" fill="none" stroke="#52525b" stroke-width="1"/>
    <path d="M43 65 C 43 60, 67 60, 67 65 Z" fill="#71717a"/>
    <circle cx="55" cy="48" r="4" fill="#71717a"/>

    <!-- Name next to square -->
    <rect x="80" y="42" width="130" height="8" rx="2" fill="#f4f4f5"/>
    <rect x="80" y="56" width="100" height="4" rx="1.5" fill="#52525b"/>

    <!-- Content -->
    <rect x="40" y="85" width="220" height="3" rx="1.5" fill="#3f3f46"/>
    
    <rect x="40" y="100" width="80" height="4" rx="2" fill="#a1a1aa"/>
    <rect x="40" y="110" width="220" height="3" rx="1.5" fill="#52525b"/>
    <rect x="40" y="117" width="200" height="3" rx="1.5" fill="#52525b"/>

    <rect x="40" y="132" width="80" height="4" rx="2" fill="#a1a1aa"/>
    <rect x="40" y="142" width="150" height="4" rx="2" fill="#d4d4d8"/>
    <rect x="40" y="150" width="220" height="3" rx="1.5" fill="#52525b"/>
  </svg>`,

  "professional": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Profile Photo (circular left-aligned) -->
    <circle cx="58" cy="55" r="18" fill="#3f3f46" opacity="0.6"/>
    <circle cx="58" cy="55" r="14" fill="#18181b"/>
    <path d="M50 66 C 50 60, 66 60, 66 66 Z" fill="#71717a"/>
    <circle cx="58" cy="51" r="5" fill="#71717a"/>

    <!-- Left Header info -->
    <rect x="88" y="42" width="130" height="8" rx="4" fill="#f8fafc"/>
    <rect x="88" y="56" width="90" height="5" rx="2.5" fill="#52525b"/>
    
    <rect x="40" y="85" width="220" height="4" rx="2" fill="#3f3f46"/>

    <rect x="40" y="105" width="220" height="5" rx="2" fill="#a1a1aa"/>
    <rect x="40" y="116" width="220" height="3" rx="1.5" fill="#52525b"/>
    <rect x="40" y="123" width="200" height="3" rx="1.5" fill="#52525b"/>

    <rect x="40" y="140" width="220" height="5" rx="2" fill="#a1a1aa"/>
    <rect x="40" y="152" width="130" height="4" rx="2" fill="#d4d4d8"/>
    <rect x="40" y="160" width="220" height="3" rx="1.5" fill="#52525b"/>
  </svg>`,

  "compact": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <rect width="300" height="400" rx="12" fill="#09090b" stroke="#1f2937" stroke-width="2"/>
    <rect x="20" y="20" width="260" height="360" rx="8" fill="#18181b" stroke="#27272a" stroke-width="1"/>
    
    <!-- Profile Photo (small circular left-aligned) -->
    <circle cx="50" cy="45" r="14" fill="#3f3f46" opacity="0.6"/>
    <circle cx="50" cy="45" r="11" fill="#18181b"/>
    <path d="M44 54 C 44 49, 56 49, 56 54 Z" fill="#71717a"/>
    <circle cx="50" cy="42" r="4" fill="#71717a"/>

    <!-- Compact Left Header Info -->
    <rect x="74" y="36" width="130" height="8" rx="4" fill="#f8fafc"/>
    <rect x="74" y="48" width="90" height="4" rx="2" fill="#52525b"/>
    
    <!-- Compact Details -->
    <rect x="40" y="70" width="220" height="3" rx="1.5" fill="#3f3f46"/>

    <rect x="40" y="82" width="220" height="4" rx="2" fill="#a1a1aa"/>
    <rect x="40" y="90" width="220" height="2.5" rx="1" fill="#52525b"/>
    <rect x="40" y="96" width="210" height="2.5" rx="1" fill="#52525b"/>

    <rect x="40" y="106" width="220" height="4" rx="2" fill="#a1a1aa"/>
    <rect x="40" y="114" width="220" height="2.5" rx="1" fill="#52525b"/>
  </svg>`
};

Object.entries(templates).forEach(([name, svg]) => {
  fs.writeFileSync(path.join(dir, `${name}.svg`), svg);
});

console.log("SUCCESS: 11 templates SVGs written.");

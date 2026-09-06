import fs from 'fs';
import path from 'path';

const layoutPath = path.join('src', 'components', 'Layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

// Add useRef to React imports
if (!content.includes('useRef')) {
  content = content.replace(/import { useState } from 'react';/, "import { useState, useRef, useEffect } from 'react';");
}

// Add state and handler inside Layout
const stateCode = `
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/logo.jpeg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('app_logo');
    if (savedLogo) {
      setLogoSrc(savedLogo);
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem('app_logo', base64String);
        setLogoSrc(base64String);
      };
      reader.readAsDataURL(file);
    }
  };
`;

content = content.replace(/const \[sidebarOpen, setSidebarOpen\] = useState\(false\);/, stateCode);

// Replace logo rendering in mobile header
content = content.replace(
  /<img src="\/logo.jpeg" alt="Logo" className="w-8 h-8 object-contain rounded-lg bg-white\/10" onError=\{\(e\) => \{.*?\} \/>/g,
  `<img src={logoSrc} onClick={() => fileInputRef.current?.click()} alt="Logo" title="Click to upload new logo" className="w-8 h-8 object-contain rounded-lg bg-white/10 cursor-pointer hover:ring-2 ring-[#c084fc] transition-all" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.style.display = 'flex'; }} />`
);

// Replace logo rendering in desktop sidebar
content = content.replace(
  /<img src="\/logo.jpeg" alt="Logo" className="w-10 h-10 object-contain rounded-lg bg-white\/10" onError=\{\(e\) => \{.*?\} \/>/g,
  `<img src={logoSrc} onClick={() => fileInputRef.current?.click()} alt="Logo" title="Click to upload new logo" className="w-10 h-10 object-contain rounded-lg bg-white/10 cursor-pointer hover:ring-2 ring-[#c084fc] transition-all" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.style.display = 'flex'; }} />`
);

// Inject the hidden file input into the main return div
content = content.replace(
  /<Background \/>/,
  `<Background />\n      <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />`
);

fs.writeFileSync(layoutPath, content, 'utf8');

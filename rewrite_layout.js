import fs from 'fs';
import path from 'path';

const layoutPath = path.join('src', 'components', 'Layout.tsx');
let content = fs.readFileSync(layoutPath, 'utf8');

// Replace navItems with grouped nav
const newNav = `
const mainNav = [
  { path: '/', label: 'Home / About', icon: Home },
  { path: '/challenges', label: 'Challenges', icon: Target },
  { path: '/blog', label: 'Season Blog', icon: BookOpen },
  { path: '/media', label: 'Media', icon: Image },
  { path: '/team', label: 'Team & Mentors', icon: Users },
  { path: '/resources', label: 'Resources', icon: Download },
  { path: '/admin', label: 'Admin Dashboard', icon: Settings },
];

const innovationNav = [
  { path: '/innovation', label: 'Overview', icon: Lightbulb },
  { path: '/innovation/mechanical', label: 'Mechanical', icon: Wrench },
  { path: '/innovation/electronics', label: 'Electronics', icon: Cpu },
  { path: '/innovation/programming', label: 'Programming', icon: Code },
];

const robotNav = [
  { path: '/robot/mechanical', label: 'Mechanical', icon: Wrench },
  { path: '/robot/electronics', label: 'Electronics', icon: Cpu },
  { path: '/robot/programming', label: 'Programming', icon: Code },
];
`;

content = content.replace(/const navItems = \[\s*([\s\S]*?)\];/, newNav);

// Helper for rendering nav links
const renderLinksCode = `
  const renderLinks = (items: any[]) => items.map((item) => (
    <NavLink
      key={item.path}
      to={item.path}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        \`flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md gap-3 \${
          isActive
            ? 'bg-zinc-900/80 text-[#c084fc] border border-[#c084fc]/30 shadow-[0_0_10px_rgba(192,132,252,0.1)]'
            : 'text-white hover:bg-zinc-900/50 hover:text-[#c084fc]'
        }\`
      }
    >
      <item.icon size={18} className="opacity-80" />
      {item.label}
    </NavLink>
  ));
`;

content = content.replace(/export default function Layout\(\) {/, renderLinksCode + '\nexport default function Layout() {');

// Mobile and Desktop logo replacement
const mobileLogo = `<img src="/logo.jpeg" alt="Logo" className="w-8 h-8 object-contain rounded-lg bg-white/10" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.style.display = 'flex'; }} /><div className="w-8 h-8 hidden bg-[#c084fc] text-black shadow-[0_0_15px_rgba(192,132,252,0.5)] rounded-lg items-center justify-center font-bold text-base">O</div>`;

const desktopLogo = `<img src="/logo.jpeg" alt="Logo" className="w-10 h-10 object-contain rounded-lg bg-white/10" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling!.style.display = 'flex'; }} /><div className="w-10 h-10 hidden bg-[#c084fc] text-black shadow-[0_0_15px_rgba(192,132,252,0.5)] rounded-lg items-center justify-center font-bold text-xl">O</div>`;

content = content.replace(/<div className="w-8 h-8 bg-\[\#c084fc\].*?<\/div>/g, mobileLogo);
content = content.replace(/<div className="w-10 h-10 bg-\[\#c084fc\].*?<\/div>/g, desktopLogo);

// Update Mobile Sidebar Nav
const mobileNavReplace = `
              <div className="flex flex-col space-y-1 overflow-y-auto pr-2">
                {renderLinks(mainNav)}
                <div className="text-[10px] font-bold text-[#c084fc] mt-6 mb-2 uppercase tracking-widest px-3 opacity-80">Innovation Showcase</div>
                {renderLinks(innovationNav)}
                <div className="text-[10px] font-bold text-[#c084fc] mt-6 mb-2 uppercase tracking-widest px-3 opacity-80">Robot Specs</div>
                {renderLinks(robotNav)}
              </div>
`;
content = content.replace(/<div className="flex flex-col space-y-1 overflow-y-auto pr-2">[\s\S]*?<\/div>/, mobileNavReplace);

// Update Desktop Sidebar Nav (they look similar but wait, the first one matches the mobile, the second matches desktop!)
// Instead of replacing blindly, let's replace the whole <nav> block
const desktopNavReplace = `
        <nav className="flex flex-col space-y-1 overflow-y-auto pr-2 flex-1 scrollbar-hide">
          {renderLinks(mainNav)}
          <div className="text-[10px] font-bold text-[#c084fc] mt-6 mb-2 uppercase tracking-widest px-3 opacity-80">Innovation Showcase</div>
          {renderLinks(innovationNav)}
          <div className="text-[10px] font-bold text-[#c084fc] mt-6 mb-2 uppercase tracking-widest px-3 opacity-80">Robot Specs</div>
          {renderLinks(robotNav)}
        </nav>
`;
content = content.replace(/<nav className="flex flex-col space-y-1 overflow-y-auto pr-2 flex-1">[\s\S]*?<\/nav>/, desktopNavReplace);


fs.writeFileSync(layoutPath, content, 'utf8');

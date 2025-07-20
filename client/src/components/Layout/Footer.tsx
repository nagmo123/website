import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f7f7fa] border-t-2 border-blue-100 w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-10 md:gap-0 items-start justify-between">
        {/* Left: Logo and About */}
        <div className="flex-1 min-w-[240px] flex flex-col items-start md:pr-8 mb-8 md:mb-0">
          <div className="flex items-center mb-3">
            <img src="/logo.png" alt="Nagomi Logo" className="w-14 h-14 object-contain mr-2" />
            <span className="text-[2rem] font-serif text-[#1428a0] font-semibold leading-none tracking-tight">Nagomi</span>
          </div>
          <p className="text-[#1428a0] font-light text-base leading-relaxed mt-1 max-w-xs md:max-w-sm">
            Nagomi is India's first brand offering bespoke, integrated wall decor solutions that bring peace and tranquility to your home. Our enchanting wall designs use high-quality wallpapers, panels, wall mouldings and more that are customizable to your unique tastes and create the perfect serene and stylish living environment.
          </p>
        </div>
        {/* Center: Navigation */}
        <div className="flex-1 min-w-[180px] flex flex-col items-start md:items-center mb-8 md:mb-0">
          <div className="mb-2 text-[#1428a0] font-bold text-lg font-sans tracking-wide">Explore</div>
          <ul className="text-[#1428a0] font-medium font-sans text-base space-y-1">
            <li><a href="/" className="hover:underline hover:text-blue-700 transition">Home Page</a></li>
            <li><a href="/products" className="hover:underline hover:text-blue-700 transition">Explore Designs</a></li>
            <li><a href="/custom-design" className="hover:underline hover:text-blue-700 transition">Upload Design</a></li>
            <li><a href="/about" className="hover:underline hover:text-blue-700 transition">About Us</a></li>
              </ul>
        </div>
        {/* Right: Policies and Instagram */}
        <div className="flex-1 min-w-[200px] flex flex-col items-start md:items-end">
          <div className="mb-2 text-[#1428a0] font-bold text-lg font-sans tracking-wide">Policies</div>
          <ul className="text-[#1428a0] font-medium font-sans text-base space-y-1 mb-3 md:text-right">
            <li><a href="/privacy" className="hover:underline hover:text-blue-700 transition">Privacy Policy</a></li>
            <li><a href="/returns" className="hover:underline hover:text-blue-700 transition">Return &amp; Exchange Policy</a></li>
            <li><a href="/shipping" className="hover:underline hover:text-blue-700 transition">Shipping Policy</a></li>
            <li><a href="/terms" className="hover:underline hover:text-blue-700 transition">Terms of Service</a></li>
          </ul>
          <div className="flex items-center mt-2 md:justify-end justify-center w-full">
            <span className="inline-flex items-center justify-center w-7 h-7 mr-2 drop-shadow-md">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <defs>
                  <radialGradient id="ig-gradient" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#f9ce34"/>
                    <stop offset="45%" stopColor="#ee2a7b"/>
                    <stop offset="100%" stopColor="#6228d7"/>
                  </radialGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#ig-gradient)"/>
                <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="1.5" fill="none"/>
                <circle cx="17" cy="7" r="1.2" fill="#fff"/>
              </svg>
            </span>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#1428a0] font-bold font-sans text-base hover:underline hover:text-blue-700 transition">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
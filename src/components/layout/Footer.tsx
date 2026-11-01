"use client";



function Footer() {
  return (
    <footer className="w-full border-t bg-white/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        {/* Left */}
        <p>© {new Date().getFullYear()} talaash-ap™ . All rights reserved.</p>

        {/* Center Links */}
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-red-900 transition">
            Privacy
          </a>
          <a href="#" className="hover:text-red-900 transition">
            Terms
          </a>
          <a href="#" className="hover:text-red-900 transition">
            Support
          </a>
        </div>

        {/* Right */}
        <div className="flex  items-center gap-4">
          <span className="text-xs text-gray-500">Made with ❤️</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

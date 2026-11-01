"use client";


import { SidebarTrigger } from "@/components/ui/sidebar";
import Search from "@/features/properties/components/Search";
import { Menu,Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect,useState } from "react";

function Header() {
  const currentPath = usePathname();

  const [showSearch, setShowSearch] = useState(false);

  // close mobile search when route changes
  useEffect(() => {
    setShowSearch(false);
  }, [currentPath]);

  const formatPath = () => {
    if (currentPath === "/") return "Home";

    return currentPath
      .split("/")
      .filter(Boolean)
      .map((item) => item.replace("-", " ").toUpperCase())
      .join(" / ");
  };

  return (
    <header className="w-full border-b bg-white flex flex-col">
      {/* Top Navigation */}
      <div className="relative flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img src="/images/logo-d.svg" className="w-[70px] sm:w-[80px]" alt="Talaash logo" />
        </Link>

        {/* Desktop Search */}
        {currentPath === "/filter-properties" && (
          <div className="absolute left-1/2 -translate-x-1/2 w-[60%] hidden sm:flex justify-center">
            <Search />
          </div>
        )}

        {/* Breadcrumb */}
        {currentPath !== "/filter-properties" && (
          <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0">
            <Link
              href={currentPath}
              className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-rose-500 transition truncate max-w-[140px] sm:max-w-none block text-center"
            >
              {formatPath()}
            </Link>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <SearchIcon size={22} />
          </button>

          {/* Sidebar Menu */}
          <SidebarTrigger className="p-2 rounded-lg hover:bg-gray-100 transition">
            <Menu size={26} />
          </SidebarTrigger>
        </div>
      </div>

      {/* Homepage Search */}
      {currentPath === "/" && (
        <div className="px-4 pb-4 sm:px-10">
          <Search />
        </div>
      )}

      {/* Mobile Search */}
      {showSearch && currentPath === "/filter-properties" && (
        <div className="px-4 pb-4 sm:hidden">
          <Search />
        </div>
      )}
    </header>
  );
}

export default Header;

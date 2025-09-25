"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  filter?: string;
  setFilter?: (filter: string) => void;
}

export default function Navbar({
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
}: NavbarProps) {
  const [dateTime, setDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const currentDate = dateTime.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const currentTime = dateTime.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const links = [
    { icon: "mdi:view-dashboard", label: "Dashboard", path: "/dashboard" },
    { icon: "mdi:folder-outline", label: "Categories", path: "/categories" },
  ];

  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const [loggingOut, setLoggingOut] = useState(false);
  const [isCollapsed] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      router.push("/");
    }, 3000);
  };

  return (
    <nav
      className="w-full h-20 flex justify-between items-center px-6 py-4 shadow-md bg-white"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="flex items-center h-full" aria-label="Application Logo">
        <Image
          src="/images/logo.png"
          alt="MyTodo App Logo"
          width={120} 
          height={120} 
          className="object-contain"
        />
      </div>

      <div className="hidden lg:flex items-center space-x-6">
        {isDashboard && searchTerm !== undefined && setSearchTerm && (
          <div className="relative w-48">
            <span className="absolute left-2 top-2.5 text-orange-800">
              <Icon icon="mdi:magnify" className="w-5 h-5" color="#9C4900" />
            </span>
            <Input
              type="text"
              placeholder="Search todos..."
              aria-label="Search"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="pl-8"
            />
          </div>
        )}

        {isDashboard && filter !== undefined && setFilter && (
          <select
            aria-label="Filter"
            className="p-2 border rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </select>
        )}

        <div
          className="flex flex-col text-sm text-gray-700 leading-tight"
          aria-label="Current Date and Time"
        >
          <div className="flex items-center gap-1">
            <Icon icon="mdi:calendar" color="#9C4900" className="w-4 h-4" />
            <span>{currentDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon
              icon="mdi:clock-outline"
              color="#9C4900"
              className="w-4 h-4"
            />
            <span>{currentTime}</span>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open Menu">
              <Menu />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="center"
            side="bottom"
            className="p-4 w-screen"
          >
            {isDashboard && searchTerm !== undefined && setSearchTerm && (
              <div className="relative w-full mb-4">
                <span className="absolute left-2 top-2.5 text-orange-800">
                  <Icon
                    icon="mdi:magnify"
                    color="#9C4900"
                    className="w-5 h-5"
                  />
                </span>
                <Input
                  type="text"
                  placeholder="Search todos..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-8 w-full"
                />
              </div>
            )}

            {isDashboard && filter !== undefined && setFilter && (
              <select
                aria-label="Filter"
                className="p-2 border rounded-md w-full mb-4"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Incomplete</option>
              </select>
            )}

            <div
              className="flex flex-col text-sm text-gray-700 leading-tight mb-4"
              aria-label="Current Date and Time"
            >
              <div className="flex items-center gap-1">
                <Icon icon="mdi:calendar" color="#9C4900" className="w-4 h-4" />
                <span>{currentDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Icon
                  icon="mdi:clock-outline"
                  color="#9C4900"
                  className="w-4 h-4"
                />
                <span>{currentTime}</span>
              </div>
            </div>

            <nav className="mt-6 space-y-4 text-orange-800 text-sm font-semibold">
              {links.map((item, idx) => (
                <DropdownMenuItem asChild key={idx}>
                  <Link
                    href={item.path}
                    aria-label={`Go to ${item.label}`}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                  >
                    <Icon icon={item.icon} color="#9C4900" />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuItem asChild>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 p-2 rounded-md w-full"
                >
                  <Icon icon="mdi:logout" />
                  {!isCollapsed && (
                    <>
                      <span>Logout</span>
                      {loggingOut && (
                        <span className="animate-spin ml-1">
                          <Icon icon="mdi:loading" />
                        </span>
                      )}
                    </>
                  )}
                </button>
              </DropdownMenuItem>
            </nav>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

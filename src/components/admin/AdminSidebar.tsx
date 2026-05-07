"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, GraduationCap, Home, Upload, Users } from "lucide-react";

const ADMIN_LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: Home, exact: true },
  { href: "/admin/universities", label: "Universités", icon: Building2 },
  { href: "/admin/import", label: "Importer des données", icon: Upload },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 min-h-screen p-4 flex flex-col">
      {/* Logo */}
      <Link href="/admin" className="flex items-center gap-2.5 font-bold text-gray-900 dark:text-white px-2 py-3 mb-6">
        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm leading-none">EduMaroc</div>
          <div className="text-xs text-muted-foreground font-normal leading-none mt-0.5">Administration</div>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {ADMIN_LINKS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          ← Retour au site
        </Link>
      </div>
    </aside>
  );
}

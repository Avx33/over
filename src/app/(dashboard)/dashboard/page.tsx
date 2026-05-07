import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Building2, Heart, Search, Star, User } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { count: favCount }, { count: univCount }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase.from("favorites").select("*", { count: "exact", head: true }).eq("user_id", user!.id),
    supabase.from("universities").select("*", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const firstName = profile?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Utilisateur";

  const stats = [
    { icon: Building2, label: "Établissements disponibles", value: univCount ?? 0, href: "/universities", color: "blue" },
    { icon: Heart, label: "Mes favoris", value: favCount ?? 0, href: "/favorites", color: "rose" },
  ];

  const quickLinks = [
    { icon: Search, label: "Rechercher une université", href: "/universities", desc: "Explorer tous les établissements" },
    { icon: Heart, label: "Mes favoris", href: "/favorites", desc: "Voir mes établissements sauvegardés" },
    { icon: User, label: "Mon profil", href: "/profile", desc: "Modifier mes informations" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Star className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Bonjour, {firstName} 👋</h1>
            <p className="text-blue-100">
              Bienvenue sur votre tableau de bord EduMaroc. Explorez les meilleures universités du Maroc.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(({ icon: Icon, label, value, href, color }) => (
          <Link
            key={label}
            href={href}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                color === "blue"
                  ? "bg-blue-50 dark:bg-blue-950"
                  : "bg-rose-50 dark:bg-rose-950"
              }`}>
                <Icon className={`w-6 h-6 ${
                  color === "blue"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-rose-600 dark:text-rose-400"
                }`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map(({ icon: Icon, label, href, desc }) => (
            <Link
              key={label}
              href={href}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                {label}
              </h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent / Explore prompt */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 text-center">
        <BookOpen className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Découvrez les établissements
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Explorez notre base de données complète d&apos;universités et de grandes écoles marocaines.
        </p>
        <Link
          href="/universities"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <Search className="w-4 h-4" />
          Explorer les universités
        </Link>
      </div>
    </div>
  );
}

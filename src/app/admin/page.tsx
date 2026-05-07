import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Building2, Eye, Heart, TrendingUp, Users } from "lucide-react";

export const metadata: Metadata = { title: "Admin – Tableau de bord" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: totalUniversities },
    { count: publicCount },
    { count: privateCount },
    { count: usersCount },
    { count: favoritesCount },
    { data: recentUniversities },
  ] = await Promise.all([
    supabase.from("universities").select("*", { count: "exact", head: true }),
    supabase.from("universities").select("*", { count: "exact", head: true }).eq("type", "public"),
    supabase.from("universities").select("*", { count: "exact", head: true }).eq("type", "private"),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("favorites").select("*", { count: "exact", head: true }),
    supabase.from("universities").select("id, name, city, type, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { icon: Building2, label: "Total établissements", value: totalUniversities ?? 0, color: "blue", sub: `${publicCount ?? 0} publics · ${privateCount ?? 0} privés` },
    { icon: Users, label: "Utilisateurs inscrits", value: usersCount ?? 0, color: "green", sub: "Comptes actifs" },
    { icon: Heart, label: "Favoris ajoutés", value: favoritesCount ?? 0, color: "rose", sub: "Total des favoris" },
    { icon: TrendingUp, label: "Établissements mis en avant", value: 0, color: "amber", sub: "Mis en avant" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord Admin</h1>
        <p className="text-muted-foreground mt-1">Vue d&apos;ensemble de la plateforme EduMaroc</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color, sub }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
              color === "blue" ? "bg-blue-50 dark:bg-blue-950" :
              color === "green" ? "bg-green-50 dark:bg-green-950" :
              color === "rose" ? "bg-rose-50 dark:bg-rose-950" :
              "bg-amber-50 dark:bg-amber-950"
            }`}>
              <Icon className={`w-5 h-5 ${
                color === "blue" ? "text-blue-600 dark:text-blue-400" :
                color === "green" ? "text-green-600 dark:text-green-400" :
                color === "rose" ? "text-rose-600 dark:text-rose-400" :
                "text-amber-600 dark:text-amber-400"
              }`} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Universities */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            Derniers établissements ajoutés
          </h2>
          <a href="/admin/universities" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Voir tout</a>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {recentUniversities?.map((uni) => (
            <div key={uni.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{uni.name}</p>
                <p className="text-xs text-muted-foreground">{uni.city}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                uni.type === "public"
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400"
              }`}>
                {uni.type === "public" ? "Public" : "Privé"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

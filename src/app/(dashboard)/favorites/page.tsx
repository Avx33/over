import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { UniversityCard } from "@/components/universities/UniversityCard";

export const metadata: Metadata = { title: "Mes favoris" };

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: favorites } = await supabase
    .from("favorites")
    .select(`
      id,
      created_at,
      university:universities (
        id, name, city, type, slug, logo_url, programs,
        tuition_fees_min, tuition_fees_max, tuition_currency,
        languages, diplomas, description, is_featured,
        category:categories(id, name, slug)
      )
    `)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const universities = favorites?.map((f) => f.university).filter(Boolean) ?? [];
  const favoriteIds = favorites?.map((f: any) => f.university?.id).filter(Boolean) ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950 rounded-xl flex items-center justify-center">
          <Heart className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes favoris</h1>
          <p className="text-muted-foreground text-sm">{universities.length} établissement{universities.length !== 1 ? "s" : ""} sauvegardé{universities.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {universities.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-16 border border-gray-100 dark:border-gray-700 text-center">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucun favori pour le moment
          </h2>
          <p className="text-muted-foreground mb-6">
            Explorez les universités et ajoutez vos préférées à cette liste.
          </p>
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Explorer les universités
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {universities.map((uni: any) => (
            <UniversityCard
              key={uni.id}
              university={uni}
              isFavorited={favoriteIds.includes(uni.id)}
              userId={user!.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

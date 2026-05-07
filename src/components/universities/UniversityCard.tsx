"use client";

import Link from "next/link";
import { GraduationCap, Heart, MapPin } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { formatTuitionRange } from "@/lib/utils";
import type { University } from "@/types";

interface UniversityCardProps {
  university: University;
  isFavorited?: boolean;
  userId?: string;
}

export function UniversityCard({ university: uni, isFavorited = false, userId }: UniversityCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const href = `/universities/${uni.slug ?? uni.id}`;

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.info("Connectez-vous pour ajouter aux favoris", {
        action: { label: "Se connecter", onClick: () => window.location.href = "/login" },
      });
      return;
    }

    setLoading(true);
    if (favorited) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("university_id", uni.id);
      if (!error) {
        setFavorited(false);
        toast.success("Retiré des favoris");
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, university_id: uni.id });
      if (!error) {
        setFavorited(true);
        toast.success("Ajouté aux favoris");
      }
    }
    setLoading(false);
  };

  return (
    <Link
      href={href}
      className="group block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            {/* Logo */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 flex items-center justify-center border border-blue-100 dark:border-blue-900 flex-shrink-0">
              {uni.logo_url ? (
                <img src={uni.logo_url} alt={uni.name} className="w-9 h-9 object-contain" />
              ) : (
                <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm leading-snug line-clamp-2">
                {uni.name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground">{uni.city}</span>
              </div>
            </div>
          </div>

          {/* Favorite */}
          <button
            onClick={toggleFavorite}
            disabled={loading}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
              favorited
                ? "bg-rose-50 dark:bg-rose-950 text-rose-500"
                : "bg-gray-50 dark:bg-gray-700 text-muted-foreground hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-500"
            }`}
            aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            uni.type === "public"
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400"
          }`}>
            {uni.type === "public" ? "Public" : "Privé"}
          </span>
          {uni.is_featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              ✦ À la une
            </span>
          )}
          {uni.languages?.slice(0, 1).map((lang) => (
            <span key={lang} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Programs */}
      {uni.programs && uni.programs.length > 0 && (
        <div className="px-5 pb-4">
          <div className="flex gap-1.5 flex-wrap">
            {uni.programs.slice(0, 3).map((prog) => (
              <span key={prog} className="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg">
                {prog}
              </span>
            ))}
            {uni.programs.length > 3 && (
              <span className="text-xs px-2.5 py-1 bg-gray-50 dark:bg-gray-700 text-muted-foreground rounded-lg">
                +{uni.programs.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3.5 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Frais de scolarité</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatTuitionRange(uni.tuition_fees_min, uni.tuition_fees_max, uni.tuition_currency)}
          </p>
        </div>
        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
          Voir →
        </div>
      </div>
    </Link>
  );
}

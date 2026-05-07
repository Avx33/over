"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface FavoriteButtonProps {
  universityId: string;
  userId?: string;
  initialFavorited?: boolean;
}

export function FavoriteButton({ universityId, userId, initialFavorited = false }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const toggle = async () => {
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
        .eq("university_id", universityId);
      if (!error) {
        setFavorited(false);
        toast.success("Retiré des favoris");
      }
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: userId, university_id: universityId });
      if (!error) {
        setFavorited(true);
        toast.success("Ajouté aux favoris ❤️");
      }
    }
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200 ${
        favorited
          ? "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400"
          : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-muted-foreground hover:border-rose-200 hover:text-rose-500"
      }`}
      aria-label={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart className={`w-4 h-4 ${favorited ? "fill-current" : ""}`} />
      <span className="hidden sm:block">{favorited ? "Sauvegardé" : "Sauvegarder"}</span>
    </button>
  );
}

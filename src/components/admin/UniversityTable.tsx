"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ExternalLink, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { PaginationControl } from "@/components/universities/PaginationControl";

interface University {
  id: string;
  name: string;
  city: string;
  type: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  category?: { name: string } | null;
}

interface UniversityTableProps {
  universities: University[];
  totalPages: number;
  currentPage: number;
}

export function UniversityTable({ universities, totalPages, currentPage }: UniversityTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleSearch = (val: string) => {
    setSearch(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("search", val);
    else params.delete("search");
    params.delete("page");
    router.push(`/admin/universities?${params.toString()}`);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return;
    setDeleting(id);
    const { error } = await supabase.from("universities").delete().eq("id", id);
    setDeleting(null);
    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success(`${name} supprimé`);
      router.refresh();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("universities")
      .update({ is_active: !current })
      .eq("id", id);
    if (!error) {
      toast.success(current ? "Désactivé" : "Activé");
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <Link
          href="/admin/import"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ml-auto"
        >
          <Plus className="w-4 h-4" />
          Importer
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <th className="text-left font-semibold text-muted-foreground px-5 py-3.5">Établissement</th>
                <th className="text-left font-semibold text-muted-foreground px-4 py-3.5 hidden sm:table-cell">Ville</th>
                <th className="text-left font-semibold text-muted-foreground px-4 py-3.5 hidden md:table-cell">Type</th>
                <th className="text-left font-semibold text-muted-foreground px-4 py-3.5 hidden lg:table-cell">Catégorie</th>
                <th className="text-left font-semibold text-muted-foreground px-4 py-3.5">Statut</th>
                <th className="text-right font-semibold text-muted-foreground px-5 py-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {universities.map((uni) => (
                <tr key={uni.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{uni.name}</p>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground hidden sm:table-cell">{uni.city}</td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      uni.type === "public"
                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400"
                    }`}>
                      {uni.type === "public" ? "Public" : "Privé"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground hidden lg:table-cell">
                    {uni.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleActive(uni.id, uni.is_active)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                        uni.is_active
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 hover:bg-blue-100"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      {uni.is_active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/universities/${uni.id}`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(uni.id, uni.name)}
                        disabled={deleting === uni.id}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {universities.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              Aucun établissement trouvé
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <PaginationControl currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}

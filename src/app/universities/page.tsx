import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UniversityCard } from "@/components/universities/UniversityCard";
import { UniversityFilters } from "@/components/universities/UniversityFilters";
import { PaginationControl } from "@/components/universities/PaginationControl";
import { UniversityCardSkeleton } from "@/components/universities/UniversityCardSkeleton";
import { Suspense } from "react";
import type { University } from "@/types";

export const metadata: Metadata = {
  title: "Universités",
  description: "Explorez toutes les universités et grandes écoles du Maroc",
};

const ITEMS_PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    type?: string;
    category?: string;
    program?: string;
    page?: string;
  }>;
}

async function UniversitiesGrid({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const supabase = await createClient();

  let query = supabase
    .from("universities")
    .select("*, category:categories(id, name, slug)", { count: "exact" })
    .eq("is_active", true);

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,city.ilike.%${params.search}%,description.ilike.%${params.search}%`);
  }
  if (params.city && params.city !== "all") {
    query = query.eq("city", params.city);
  }
  if (params.type && params.type !== "all") {
    query = query.eq("type", params.type);
  }
  if (params.category && params.category !== "all") {
    query = query.eq("categories.slug", params.category);
  }
  if (params.program) {
    query = query.contains("programs", [params.program]);
  }

  const { data: universities, count } = await query
    .order("is_featured", { ascending: false })
    .order("name")
    .range(offset, offset + ITEMS_PER_PAGE - 1);

  const totalPages = Math.ceil((count ?? 0) / ITEMS_PER_PAGE);

  // Get user favorites
  const { data: { user } } = await supabase.auth.getUser();
  let favoriteIds: string[] = [];
  if (user) {
    const { data: favs } = await supabase
      .from("favorites")
      .select("university_id")
      .eq("user_id", user.id);
    favoriteIds = favs?.map((f) => f.university_id) ?? [];
  }

  if (!universities || universities.length === 0) {
    return (
      <div className="col-span-full py-20 text-center">
        <div className="text-5xl mb-4">🎓</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Aucun résultat
        </h3>
        <p className="text-muted-foreground">
          Essayez de modifier vos filtres de recherche
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-gray-900 dark:text-white">{count}</span> établissement{(count ?? 0) !== 1 ? "s" : ""} trouvé{(count ?? 0) !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {universities.map((uni) => (
          <UniversityCard
            key={uni.id}
            university={uni as unknown as University}
            isFavorited={favoriteIds.includes(uni.id)}
            userId={user?.id}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-10">
          <PaginationControl currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <UniversityCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function UniversitiesPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Universités & Grandes Écoles
          </h1>
          <p className="text-muted-foreground">
            Explorez {`>`} 50 établissements d&apos;enseignement supérieur au Maroc
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <UniversityFilters categories={categories ?? []} />
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <Suspense fallback={<SkeletonGrid />}>
              <UniversitiesGrid searchParams={searchParams} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

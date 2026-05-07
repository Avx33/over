import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UniversityTable } from "@/components/admin/UniversityTable";

export const metadata: Metadata = { title: "Admin – Universités" };

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function AdminUniversitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  let query = supabase
    .from("universities")
    .select("*, category:categories(name, slug)", { count: "exact" });

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  const { data: universities, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const totalPages = Math.ceil((count ?? 0) / limit);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Universités</h1>
        <p className="text-muted-foreground mt-1">{count} établissements au total</p>
      </div>
      <UniversityTable
        universities={universities ?? []}
        totalPages={totalPages}
        currentPage={page}
      />
    </div>
  );
}

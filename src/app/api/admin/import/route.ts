import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { parseArrayField, slugify } from "@/lib/utils";
import type { ImportRow } from "@/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const rows: ImportRow[] = body.rows;

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "No rows provided" }, { status: 400 });
  }

  const adminSupabase = await createAdminClient();

  const { data: categories } = await adminSupabase
    .from("categories")
    .select("id, name, slug");

  const categoryMap = new Map(
    (categories ?? []).map((c) => [c.name.toLowerCase(), c.id])
  );

  const results = { imported: 0, skipped: 0, errors: [] as string[] };

  for (const row of rows) {
    try {
      if (!row.name || !row.city) {
        results.skipped++;
        continue;
      }

      const type = row.type?.toLowerCase() === "public" ? "public" : "private";
      const categoryId = row.category
        ? categoryMap.get(row.category.toLowerCase()) ?? null
        : null;

      const uniData = {
        name: row.name.trim(),
        type,
        category_id: categoryId,
        city: row.city.trim(),
        address: row.address?.trim() ?? null,
        website: row.website?.trim() ?? null,
        email: row.email?.trim() ?? null,
        phone: row.phone?.trim() ?? null,
        instagram: row.instagram?.trim() ?? null,
        facebook: row.facebook?.trim() ?? null,
        linkedin: row.linkedin?.trim() ?? null,
        programs: parseArrayField(row.programs),
        tuition_fees_min: row.tuition_min ? Number(row.tuition_min) : null,
        tuition_fees_max: row.tuition_max ? Number(row.tuition_max) : null,
        languages: parseArrayField(row.languages),
        diplomas: parseArrayField(row.diplomas),
        description: row.description?.trim() ?? null,
        founded_year: row.founded_year ? Number(row.founded_year) : null,
        slug: slugify(row.name),
        is_active: true,
      };

      const { error } = await adminSupabase
        .from("universities")
        .upsert(uniData, { onConflict: "slug", ignoreDuplicates: false });

      if (error) {
        results.errors.push(`${row.name}: ${error.message}`);
        results.skipped++;
      } else {
        results.imported++;
      }
    } catch (err) {
      results.errors.push(`${row.name}: Unexpected error`);
      results.skipped++;
    }
  }

  return NextResponse.json(results);
}

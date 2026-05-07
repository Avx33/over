import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const city = searchParams.get("city");
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "12"));
  const offset = (page - 1) * limit;

  const supabase = await createClient();

  let query = supabase
    .from("universities")
    .select("*, category:categories(id, name, slug)", { count: "exact" })
    .eq("is_active", true);

  if (search) {
    query = query.or(`name.ilike.%${search}%,city.ilike.%${search}%`);
  }
  if (city && city !== "all") query = query.eq("city", city);
  if (type && type !== "all") query = query.eq("type", type);

  const { data, count, error } = await query
    .order("is_featured", { ascending: false })
    .order("name")
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    count,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}

#!/usr/bin/env tsx
/**
 * CLI Import Script for EduMaroc
 * Usage: npm run import:data -- --file ./data/universities.xlsx
 * Or:    npm run import:data -- --file ./data/universities.csv
 */
import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// Load env
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function parseArray(value: string | undefined): string[] {
  if (!value) return [];
  return value.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
}

interface RawRow {
  name?: string;
  type?: string;
  category?: string;
  city?: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  programs?: string;
  tuition_min?: string | number;
  tuition_max?: string | number;
  languages?: string;
  diplomas?: string;
  description?: string;
  founded_year?: string | number;
  [key: string]: unknown;
}

async function importData(filePath: string) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`);
    process.exit(1);
  }

  console.log(`📂 Reading file: ${absolutePath}`);
  const ext = path.extname(absolutePath).toLowerCase();

  let rows: RawRow[] = [];

  if (ext === ".xlsx" || ext === ".xls") {
    const wb = XLSX.readFile(absolutePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
    rows = raw.map((r) => {
      const normalized: RawRow = {};
      Object.entries(r).forEach(([k, v]) => {
        normalized[k.toLowerCase().trim().replace(/\s+/g, "_")] = v;
      });
      return normalized;
    });
  } else if (ext === ".csv") {
    const content = fs.readFileSync(absolutePath, "utf-8");
    const lines = content.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
    rows = lines.slice(1).map((line) => {
      const values = line.split(",");
      const row: RawRow = {};
      headers.forEach((h, i) => { row[h] = values[i]?.trim() ?? ""; });
      return row;
    }).filter((r) => r.name);
  } else {
    console.error("❌ Unsupported format. Use .xlsx, .xls or .csv");
    process.exit(1);
  }

  console.log(`📋 Found ${rows.length} rows`);

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("id, name");
  const categoryMap = new Map((categories ?? []).map((c) => [c.name.toLowerCase(), c.id]));

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of rows) {
    const name = String(row.name ?? "").trim();
    const city = String(row.city ?? "").trim();

    if (!name || !city) {
      skipped++;
      continue;
    }

    const type = String(row.type ?? "").toLowerCase() === "public" ? "public" : "private";
    const categoryName = String(row.category ?? "").trim().toLowerCase();
    const categoryId = categoryMap.get(categoryName) ?? null;

    const uniData = {
      name,
      type,
      category_id: categoryId,
      city,
      address: String(row.address ?? "").trim() || null,
      website: String(row.website ?? "").trim() || null,
      email: String(row.email ?? "").trim() || null,
      phone: String(row.phone ?? "").trim() || null,
      instagram: String(row.instagram ?? "").trim() || null,
      facebook: String(row.facebook ?? "").trim() || null,
      linkedin: String(row.linkedin ?? "").trim() || null,
      programs: parseArray(String(row.programs ?? "")),
      tuition_fees_min: row.tuition_min ? Number(row.tuition_min) : null,
      tuition_fees_max: row.tuition_max ? Number(row.tuition_max) : null,
      languages: parseArray(String(row.languages ?? "")),
      diplomas: parseArray(String(row.diplomas ?? "")),
      description: String(row.description ?? "").trim() || null,
      founded_year: row.founded_year ? Number(row.founded_year) : null,
      slug: slugify(name),
      is_active: true,
    };

    const { error } = await supabase
      .from("universities")
      .upsert(uniData, { onConflict: "slug" });

    if (error) {
      console.error(`  ❌ ${name}: ${error.message}`);
      errors.push(name);
      skipped++;
    } else {
      console.log(`  ✅ ${name}`);
      imported++;
    }
  }

  console.log("\n===================");
  console.log(`✅ Imported: ${imported}`);
  console.log(`⏩ Skipped:  ${skipped}`);
  if (errors.length > 0) {
    console.log(`❌ Errors:   ${errors.length} (${errors.slice(0, 5).join(", ")})`);
  }
  console.log("===================\n");
}

// Parse CLI args
const args = process.argv.slice(2);
const fileIdx = args.indexOf("--file");
const filePath = fileIdx !== -1 ? args[fileIdx + 1] : args[0];

if (!filePath) {
  console.error("Usage: npm run import:data -- --file <path/to/file.xlsx|.csv>");
  process.exit(1);
}

importData(filePath).catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

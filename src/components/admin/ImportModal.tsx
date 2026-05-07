"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, FileSpreadsheet, Loader2, Upload, X } from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import type { ImportRow } from "@/types";

const REQUIRED_COLUMNS = ["name", "type", "city"];
const OPTIONAL_COLUMNS = [
  "category", "address", "website", "email", "phone",
  "instagram", "facebook", "linkedin", "programs",
  "tuition_min", "tuition_max", "languages", "diplomas",
  "description", "founded_year",
];
const ALL_COLUMNS = [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS];

interface ImportResult {
  imported: number;
  skipped: number;
  errors: string[];
}

export function ImportModal() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [preview, setPreview] = useState<ImportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const processFile = (file: File) => {
    setFile(file);
    setResult(null);
    setParseError(null);
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const data = normalizeRows(res.data as Record<string, string>[]);
          if (data.length === 0) {
            setParseError("Aucune ligne valide trouvée dans le fichier CSV.");
            return;
          }
          setRows(data);
          setPreview(data.slice(0, 5));
        },
        error: (err) => setParseError(err.message),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target?.result, { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });
          const normalized = normalizeRows(data);
          if (normalized.length === 0) {
            setParseError("Aucune ligne valide trouvée dans le fichier Excel.");
            return;
          }
          setRows(normalized);
          setPreview(normalized.slice(0, 5));
        } catch (err) {
          setParseError("Erreur lors de la lecture du fichier Excel.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      setParseError("Format non supporté. Utilisez .xlsx, .xls ou .csv");
    }
  };

  const normalizeRows = (raw: Record<string, string>[]): ImportRow[] => {
    return raw
      .map((row) => {
        const normalized: Record<string, string> = {};
        Object.entries(row).forEach(([k, v]) => {
          normalized[k.toLowerCase().trim().replace(/\s+/g, "_")] = String(v ?? "").trim();
        });
        return normalized as unknown as ImportRow;
      })
      .filter((row) => row.name && row.city);
  };

  const handleImport = async () => {
    if (rows.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });
      const data: ImportResult = await res.json();
      setResult(data);
      if (data.imported > 0) {
        toast.success(`${data.imported} établissement(s) importé(s) avec succès !`);
      }
      if (data.skipped > 0) {
        toast.warning(`${data.skipped} ligne(s) ignorée(s)`);
      }
    } catch {
      toast.error("Erreur lors de l'import");
    }
    setLoading(false);
  };

  const reset = () => {
    setFile(null);
    setRows([]);
    setPreview([]);
    setResult(null);
    setParseError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Template Download */}
      <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl border border-blue-100 dark:border-blue-900 p-5">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Format du fichier
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          Votre fichier Excel/CSV doit contenir les colonnes suivantes :
        </p>
        <div className="flex flex-wrap gap-1.5">
          {REQUIRED_COLUMNS.map((col) => (
            <span key={col} className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-xs font-mono font-bold">
              {col} *
            </span>
          ))}
          {OPTIONAL_COLUMNS.map((col) => (
            <span key={col} className="px-2.5 py-1 bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-mono">
              {col}
            </span>
          ))}
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
          * Colonnes obligatoires. Les programmes, langues et diplômes peuvent être séparés par des virgules.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed p-10 text-center transition-colors cursor-pointer ${
          file
            ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20"
            : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
        }`}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) processFile(f);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) processFile(f);
          }}
        />
        {file ? (
          <div className="space-y-2">
            <FileSpreadsheet className="w-10 h-10 text-blue-600 mx-auto" />
            <p className="font-semibold text-gray-900 dark:text-white">{file.name}</p>
            <p className="text-sm text-muted-foreground">{rows.length} lignes détectées</p>
            <button
              onClick={(e) => { e.stopPropagation(); reset(); }}
              className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1 mx-auto"
            >
              <X className="w-3 h-3" /> Retirer le fichier
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-10 h-10 text-muted-foreground/40 mx-auto" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Glissez un fichier ici ou cliquez pour parcourir
              </p>
              <p className="text-sm text-muted-foreground mt-1">Excel (.xlsx, .xls) ou CSV</p>
            </div>
          </div>
        )}
      </div>

      {/* Parse Error */}
      {parseError && (
        <div className="bg-red-50 dark:bg-red-950 rounded-xl border border-red-100 dark:border-red-900 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-100 text-sm">Erreur de lecture</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">{parseError}</p>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Aperçu — {rows.length} lignes à importer
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  {["name", "type", "city", "category", "programs"].map((col) => (
                    <th key={col} className="text-left font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {preview.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white max-w-48 truncate">{row.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.type}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.city}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.category ?? "—"}</td>
                    <td className="px-4 py-2.5 text-muted-foreground max-w-48 truncate">
                      {typeof row.programs === "string" ? row.programs : (row.programs as string[])?.join(", ") ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 5 && (
              <p className="px-5 py-3 text-xs text-muted-foreground border-t border-gray-100 dark:border-gray-700">
                + {rows.length - 5} ligne(s) supplémentaire(s)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Import Button */}
      {rows.length > 0 && !result && (
        <button
          onClick={handleImport}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-4 rounded-2xl transition-colors shadow-lg shadow-blue-500/20"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Import en cours...</>
          ) : (
            <><Upload className="w-5 h-5" /> Importer {rows.length} établissement{rows.length > 1 ? "s" : ""}</>
          )}
        </button>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-2xl border p-6 ${
          result.errors.length === 0
            ? "bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900"
            : "bg-amber-50 dark:bg-amber-950 border-amber-100 dark:border-amber-900"
        }`}>
          <div className="flex items-start gap-3">
            <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${
              result.errors.length === 0 ? "text-green-500" : "text-amber-500"
            }`} />
            <div>
              <h3 className={`font-semibold text-base ${
                result.errors.length === 0
                  ? "text-green-900 dark:text-green-100"
                  : "text-amber-900 dark:text-amber-100"
              }`}>
                Import terminé
              </h3>
              <p className="text-sm mt-1 text-muted-foreground">
                ✅ {result.imported} importé(s) · ⏩ {result.skipped} ignoré(s)
              </p>
              {result.errors.length > 0 && (
                <div className="mt-3 space-y-1">
                  {result.errors.slice(0, 5).map((err, i) => (
                    <p key={i} className="text-xs text-red-600 dark:text-red-400">• {err}</p>
                  ))}
                </div>
              )}
              <button
                onClick={reset}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Faire un nouvel import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

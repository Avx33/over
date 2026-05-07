import type { Metadata } from "next";
import { ImportModal } from "@/components/admin/ImportModal";

export const metadata: Metadata = { title: "Admin – Import de données" };

export default function AdminImportPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Import de données</h1>
        <p className="text-muted-foreground mt-1">
          Importez des universités en masse depuis un fichier Excel ou CSV
        </p>
      </div>
      <ImportModal />
    </div>
  );
}

import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-gray-900 dark:text-white mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              EduMaroc
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              La plateforme de référence pour découvrir et comparer les universités et grandes écoles du Maroc.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Accueil" },
                { href: "/universities", label: "Universités" },
                { href: "/login", label: "Connexion" },
                { href: "/register", label: "Inscription" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Villes</h3>
            <ul className="space-y-2.5">
              {["Casablanca", "Rabat", "Fès", "Marrakech", "Agadir", "Tanger"].map((city) => (
                <li key={city}>
                  <Link
                    href={`/universities?city=${encodeURIComponent(city)}`}
                    className="text-sm text-muted-foreground hover:text-blue-600 transition-colors"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} EduMaroc. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground">
            Fait avec ❤️ pour les étudiants marocains
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { ArrowRight, BookOpen, Building2, GraduationCap, MapPin, Search, Star, Users } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { createClient } from "@/lib/supabase/server";

async function getStats() {
  const supabase = await createClient();
  const [{ count: univCount }, { count: cityCount }] = await Promise.all([
    supabase.from("universities").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("universities").select("city", { count: "exact", head: true }).eq("is_active", true),
  ]);
  return { universities: univCount ?? 0, cities: 20, programs: 200 };
}

async function getFeatured() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("universities")
    .select("id, name, city, type, logo_url, programs, tuition_fees_min, tuition_fees_max, slug")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(6);
  return data ?? [];
}

export default async function HomePage() {
  const [stats, featured] = await Promise.all([getStats(), getFeatured()]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-blue-100 dark:border-blue-900">
              <Star className="w-3.5 h-3.5" />
              Plateforme #1 de l&apos;enseignement supérieur au Maroc
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
              Trouvez votre{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                université idéale
              </span>{" "}
              au Maroc
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Comparez les universités, explorez les programmes et prenez les meilleures décisions pour votre avenir académique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/universities"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                <Search className="w-5 h-5" />
                Explorer les universités
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:-translate-y-0.5"
              >
                Créer un compte gratuit
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Building2, label: "Établissements", value: `${stats.universities}+` },
              { icon: MapPin, label: "Villes couvertes", value: `${stats.cities}+` },
              { icon: BookOpen, label: "Programmes", value: `${stats.programs}+` },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 text-center border border-white dark:border-gray-700 shadow-sm"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-xl mb-3">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-sm text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Universities */}
      {featured.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Établissements à la une
              </h2>
              <p className="text-muted-foreground">
                Les meilleures universités et grandes écoles du Maroc
              </p>
            </div>
            <Link
              href="/universities"
              className="hidden sm:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Voir tous
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.slug ?? uni.id}`}
                className="group block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 flex items-center justify-center flex-shrink-0 border border-blue-100 dark:border-blue-900">
                    {uni.logo_url ? (
                      <img src={uni.logo_url} alt={uni.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <GraduationCap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                      {uni.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{uni.city}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      uni.type === "public"
                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400"
                    }`}
                  >
                    {uni.type === "public" ? "Public" : "Privé"}
                  </span>
                  {uni.programs?.slice(0, 2).map((p: string) => (
                    <span
                      key={p}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Voir tous les établissements
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              EduMaroc vous offre tous les outils pour prendre les meilleures décisions académiques
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Recherche avancée",
                desc: "Filtrez par ville, type, catégorie, programme ou langue d'enseignement pour trouver l'établissement parfait.",
              },
              {
                icon: Star,
                title: "Favoris personnalisés",
                desc: "Sauvegardez vos établissements préférés et créez votre liste de candidatures en un clic.",
              },
              {
                icon: Users,
                title: "Comparaison complète",
                desc: "Comparez les frais de scolarité, les programmes proposés et les diplômes décernés côte à côte.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Prêt à commencer votre parcours ?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Rejoignez des milliers d&apos;étudiants qui ont trouvé leur établissement grâce à EduMaroc.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5"
            >
              Créer un compte gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

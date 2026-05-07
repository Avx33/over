import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, BookOpen, Building2, ExternalLink, Facebook,
  Globe, GraduationCap, Heart, Instagram, Languages,
  Linkedin, Mail, MapPin, Phone, Users, Youtube,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatTuitionRange } from "@/lib/utils";
import { FavoriteButton } from "@/components/universities/FavoriteButton";
import type { University } from "@/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("universities")
    .select("name, description, city")
    .or(`slug.eq.${id},id.eq.${id}`)
    .single();

  if (!data) return { title: "Université introuvable" };

  return {
    title: data.name,
    description: data.description ?? `${data.name} - ${data.city}, Maroc`,
  };
}

export default async function UniversityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: university } = await supabase
    .from("universities")
    .select("*, category:categories(id, name, slug, icon)")
    .or(`slug.eq.${id},id.eq.${id}`)
    .eq("is_active", true)
    .single();

  if (!university) notFound();

  const uni = university as unknown as University & { category: { id: string; name: string; slug: string; icon: string } };

  const { data: { user } } = await supabase.auth.getUser();
  let isFavorited = false;
  if (user) {
    const { data } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("university_id", uni.id)
      .single();
    isFavorited = !!data;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cover */}
      <div className="relative h-48 sm:h-64 bg-gradient-to-br from-blue-600 to-cyan-600 overflow-hidden">
        {uni.cover_url && (
          <img src={uni.cover_url} alt="" className="w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <div className="pt-6 mb-4">
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux universités
          </Link>
        </div>

        {/* Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 -mt-16 relative z-10 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Logo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 flex items-center justify-center border border-blue-100 dark:border-blue-900 flex-shrink-0">
              {uni.logo_url ? (
                <img src={uni.logo_url} alt={uni.name} className="w-16 h-16 object-contain" />
              ) : (
                <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      uni.type === "public"
                        ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                        : "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400"
                    }`}>
                      {uni.type === "public" ? "Public" : "Privé"}
                    </span>
                    {uni.category && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                        {uni.category.icon} {uni.category.name}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{uni.name}</h1>
                  {uni.name_fr && uni.name_fr !== uni.name && (
                    <p className="text-muted-foreground mt-1">{uni.name_fr}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{uni.city}{uni.address ? `, ${uni.address}` : ""}</span>
                  </div>
                </div>
                <FavoriteButton
                  universityId={uni.id}
                  userId={user?.id}
                  initialFavorited={isFavorited}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {uni.description && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  À propos
                </h2>
                <p className="text-muted-foreground leading-relaxed">{uni.description}</p>
                {uni.founded_year && (
                  <p className="text-sm text-muted-foreground mt-3">
                    Fondée en <strong>{uni.founded_year}</strong>
                    {uni.student_count && ` · ${uni.student_count.toLocaleString()} étudiants`}
                  </p>
                )}
              </div>
            )}

            {/* Programs */}
            {uni.programs && uni.programs.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Filières & Programmes
                </h2>
                <div className="flex flex-wrap gap-2">
                  {uni.programs.map((prog) => (
                    <span
                      key={prog}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Diplomas */}
            {uni.diplomas && uni.diplomas.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Diplômes délivrés
                </h2>
                <div className="flex flex-wrap gap-2">
                  {uni.diplomas.map((diploma) => (
                    <span
                      key={diploma}
                      className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium border border-gray-100 dark:border-gray-600"
                    >
                      {diploma}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {uni.languages && uni.languages.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Languages className="w-5 h-5 text-blue-600" />
                  Langues d&apos;enseignement
                </h2>
                <div className="flex flex-wrap gap-2">
                  {uni.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 rounded-lg text-sm font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tuition */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Frais de scolarité</h3>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatTuitionRange(uni.tuition_fees_min, uni.tuition_fees_max, uni.tuition_currency)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">par an · {uni.tuition_currency}</p>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
              <div className="space-y-3">
                {uni.website && (
                  <a href={uni.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-blue-600 transition-colors group">
                    <Globe className="w-4 h-4 text-muted-foreground group-hover:text-blue-600" />
                    <span className="truncate">{uni.website.replace(/^https?:\/\//, "")}</span>
                    <ExternalLink className="w-3 h-3 ml-auto flex-shrink-0" />
                  </a>
                )}
                {uni.email && (
                  <a href={`mailto:${uni.email}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{uni.email}</span>
                  </a>
                )}
                {uni.phone && (
                  <a href={`tel:${uni.phone}`}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>{uni.phone}</span>
                  </a>
                )}
              </div>

              {/* Social */}
              {(uni.instagram || uni.facebook || uni.linkedin || uni.youtube) && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Réseaux sociaux</p>
                  <div className="flex items-center gap-2">
                    {uni.instagram && (
                      <a href={uni.instagram} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-pink-50 dark:hover:bg-pink-950 hover:text-pink-600 transition-colors">
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {uni.facebook && (
                      <a href={uni.facebook} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 transition-colors">
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {uni.linkedin && (
                      <a href={uni.linkedin} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 transition-colors">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {uni.youtube && (
                      <a href={uni.youtube} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 transition-colors">
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Favorite CTA */}
            {!user && (
              <div className="bg-blue-50 dark:bg-blue-950 rounded-2xl p-5 border border-blue-100 dark:border-blue-900">
                <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-3" />
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Sauvegardez cet établissement
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                  Connectez-vous pour ajouter à vos favoris
                </p>
                <Link
                  href="/login"
                  className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

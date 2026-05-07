export type UserRole = "user" | "admin";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  name_ar: string | null;
  name_fr: string | null;
  slug: string;
  icon: string | null;
  description: string | null;
  created_at: string;
}

export interface University {
  id: string;
  name: string;
  name_ar: string | null;
  name_fr: string | null;
  slug: string | null;
  type: "public" | "private";
  category_id: string | null;
  city: string;
  address: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  facebook: string | null;
  linkedin: string | null;
  youtube: string | null;
  programs: string[];
  tuition_fees_min: number | null;
  tuition_fees_max: number | null;
  tuition_currency: string;
  languages: string[];
  diplomas: string[];
  logo_url: string | null;
  cover_url: string | null;
  description: string | null;
  description_ar: string | null;
  founded_year: number | null;
  student_count: number | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Favorite {
  id: string;
  user_id: string;
  university_id: string;
  created_at: string;
  university?: University;
}

export interface UniversityFilters {
  search?: string;
  city?: string;
  type?: "public" | "private" | "all";
  category?: string;
  program?: string;
  language?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ImportRow {
  name: string;
  type: string;
  category: string;
  city: string;
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
}

export const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Fès",
  "Marrakech",
  "Agadir",
  "Tanger",
  "Meknès",
  "Oujda",
  "Kenitra",
  "Tétouan",
  "El Jadida",
  "Béni Mellal",
  "Nador",
  "Khouribga",
  "Mohammedia",
  "Ifrane",
  "Settat",
  "Safi",
  "Essaouira",
  "Errachidia",
  "Laâyoune",
  "Dakhla",
] as const;

export type MoroccanCity = (typeof MOROCCAN_CITIES)[number];

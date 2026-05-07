export const APP_NAME = "EduMaroc";
export const APP_DESCRIPTION =
  "La plateforme de référence pour l'enseignement supérieur au Maroc";

export const ITEMS_PER_PAGE = 12;

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
  "Laâyoune",
  "Dakhla",
];

export const UNIVERSITY_TYPES = [
  { value: "all", label: "Tous les types" },
  { value: "public", label: "Public" },
  { value: "private", label: "Privé" },
] as const;

export const LANGUAGES = [
  "Arabe",
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
];

export const DIPLOMAS = [
  "Licence",
  "Master",
  "Doctorat",
  "Ingénieur d'État",
  "Master Spécialisé",
  "MBA",
  "Bachelor",
  "DUT",
  "BTS",
  "Certificat",
];

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/universities", label: "Universités" },
];

export const SOCIAL_LINKS = {
  twitter: "https://twitter.com",
  linkedin: "https://linkedin.com",
  facebook: "https://facebook.com",
};

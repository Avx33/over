-- ============================================
-- SEED CATEGORIES
-- ============================================
insert into public.categories (name, name_ar, name_fr, slug, icon, description) values
  ('Engineering', 'هندسة', 'Ingénierie', 'engineering', '⚙️', 'Engineering and technology schools'),
  ('Medicine', 'طب', 'Médecine', 'medicine', '🏥', 'Medical and health sciences'),
  ('Business', 'أعمال', 'Commerce', 'business', '💼', 'Business and management schools'),
  ('Law', 'حقوق', 'Droit', 'law', '⚖️', 'Law and political science'),
  ('Sciences', 'علوم', 'Sciences', 'sciences', '🔬', 'Natural and exact sciences'),
  ('Arts & Humanities', 'آداب وعلوم إنسانية', 'Lettres & Sciences Humaines', 'arts-humanities', '🎨', 'Arts, languages and humanities'),
  ('Architecture', 'هندسة معمارية', 'Architecture', 'architecture', '🏛️', 'Architecture and urban planning'),
  ('Agriculture', 'زراعة', 'Agriculture', 'agriculture', '🌱', 'Agronomy and agricultural sciences'),
  ('IT & Digital', 'تكنولوجيا المعلومات', 'Informatique & Numérique', 'it-digital', '💻', 'Computer science and digital'),
  ('Education', 'تربية', 'Éducation', 'education', '📚', 'Education and teacher training');

-- ============================================
-- SEED UNIVERSITIES (sample data)
-- ============================================
insert into public.universities (
  name, name_fr, type, city, address, website, email, phone,
  programs, tuition_fees_min, tuition_fees_max, tuition_currency,
  languages, diplomas, description, founded_year, is_featured, slug
) values
(
  'Université Mohammed V de Rabat',
  'Université Mohammed V de Rabat',
  'public', 'Rabat',
  'Avenue des Nations Unies, Agdal, Rabat',
  'https://www.um5.ac.ma', 'contact@um5.ac.ma', '+212 537 77 11 37',
  ARRAY['Sciences', 'Law', 'Medicine', 'Engineering', 'Humanities', 'Economics'],
  0, 800, 'MAD',
  ARRAY['Arabic', 'French'],
  ARRAY['Licence', 'Master', 'Doctorat', 'DUT'],
  'La première et plus grande université publique du Maroc, fondée en 1957.',
  1957, true, 'universite-mohammed-v-rabat'
),
(
  'Université Hassan II de Casablanca',
  'Université Hassan II de Casablanca',
  'public', 'Casablanca',
  'Km 8, Route El Jadida, Casablanca',
  'https://www.univh2c.ma', 'contact@univh2c.ma', '+212 522 23 06 80',
  ARRAY['Sciences', 'Technology', 'Medicine', 'Law', 'Economics', 'Sports'],
  0, 800, 'MAD',
  ARRAY['Arabic', 'French'],
  ARRAY['Licence', 'Master', 'Doctorat', 'DTS'],
  'Grande université publique au cœur de Casablanca, couvrant de nombreux domaines.',
  1992, true, 'universite-hassan-ii-casablanca'
),
(
  'École Nationale Supérieure d''Informatique et d''Analyse des Systèmes',
  'ENSIAS - Rabat',
  'public', 'Rabat',
  'Avenue Mohammed Ben Abdellah Regragui, Madinat Al Irfane, Rabat',
  'https://ensias.um5.ac.ma', 'ensias@um5.ac.ma', '+212 537 77 71 00',
  ARRAY['Computer Science', 'Software Engineering', 'Networks', 'AI', 'Data Science'],
  0, 1000, 'MAD',
  ARRAY['French', 'Arabic', 'English'],
  ARRAY['Ingénieur d''État', 'Master Spécialisé'],
  'Grande école d''ingénieurs spécialisée en informatique et systèmes d''information.',
  1992, true, 'ensias-rabat'
),
(
  'École Mohammadia d''Ingénieurs',
  'EMI - Rabat',
  'public', 'Rabat',
  'Avenue Ibn Sina, Agdal, Rabat',
  'https://www.emi.ac.ma', 'contact@emi.ac.ma', '+212 537 68 72 00',
  ARRAY['Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Industrial Engineering'],
  0, 1000, 'MAD',
  ARRAY['French', 'Arabic'],
  ARRAY['Ingénieur d''État', 'Master Spécialisé', 'Doctorat'],
  'L''une des plus grandes et plus anciennes écoles d''ingénieurs du Maroc.',
  1959, true, 'emi-rabat'
),
(
  'EMSI - École Marocaine des Sciences de l''Ingénieur',
  'EMSI',
  'private', 'Casablanca',
  '2, Rue Abou Inane, Agdal, Rabat / Casablanca',
  'https://www.emsi.ma', 'info@emsi.ma', '+212 522 25 77 00',
  ARRAY['Software Engineering', 'Networks & Telecom', 'Industrial Engineering', 'Data Science'],
  35000, 60000, 'MAD',
  ARRAY['French', 'English', 'Arabic'],
  ARRAY['Ingénieur', 'Licence Professionnelle', 'Master Spécialisé'],
  'Ecole privée d''ingénieurs avec plusieurs campus au Maroc, reconnue par l''État.',
  1986, true, 'emsi-casablanca'
),
(
  'ESCA École de Management',
  'ESCA',
  'private', 'Casablanca',
  '7, rue Abou Youssef El Kindî, Casablanca',
  'https://www.esca.ma', 'info@esca.ma', '+212 522 25 88 25',
  ARRAY['Management', 'Finance', 'Marketing', 'International Business', 'Entrepreneurship'],
  50000, 80000, 'MAD',
  ARRAY['French', 'English'],
  ARRAY['Bachelor', 'Master', 'MBA', 'Executive MBA'],
  'École de management de référence en Afrique du Nord, triple accréditée.',
  1992, true, 'esca-casablanca'
),
(
  'Université Cadi Ayyad',
  'Université Cadi Ayyad de Marrakech',
  'public', 'Marrakech',
  'Avenue Prince My Abdellah, Marrakech',
  'https://www.uca.ma', 'contact@uca.ma', '+212 524 43 34 84',
  ARRAY['Sciences', 'Technology', 'Medicine', 'Law', 'Economics', 'Arts'],
  0, 800, 'MAD',
  ARRAY['Arabic', 'French'],
  ARRAY['Licence', 'Master', 'Doctorat'],
  'Université publique de Marrakech, l''une des plus grandes du Maroc.',
  1978, false, 'universite-cadi-ayyad-marrakech'
),
(
  'Université Sidi Mohammed Ben Abdellah',
  'USMBA - Fès',
  'public', 'Fès',
  'Route Imouzzer, Fès',
  'https://www.usmba.ac.ma', 'contact@usmba.ac.ma', '+212 535 61 82 00',
  ARRAY['Sciences', 'Medicine', 'Law', 'Technology', 'Literature', 'Economics'],
  0, 800, 'MAD',
  ARRAY['Arabic', 'French'],
  ARRAY['Licence', 'Master', 'Doctorat', 'DUT'],
  'Université publique de la ville de Fès, haut lieu du savoir au Maroc.',
  1975, false, 'usmba-fes'
),
(
  'Institut National des Postes et Télécommunications',
  'INPT',
  'public', 'Rabat',
  'Avenue Allal Al Fassi, Madinat Al Irfane, Rabat',
  'https://www.inpt.ac.ma', 'contact@inpt.ac.ma', '+212 537 77 30 73',
  ARRAY['Telecommunications', 'Networks', 'Software Engineering', 'AI', 'Cybersecurity'],
  0, 1500, 'MAD',
  ARRAY['French', 'English'],
  ARRAY['Ingénieur d''État', 'Master Spécialisé'],
  'Grande école d''ingénieurs spécialisée dans les télécommunications et le numérique.',
  1961, true, 'inpt-rabat'
),
(
  'Al Akhawayn University in Ifrane',
  'Al Akhawayn University',
  'private', 'Ifrane',
  'Avenue Hassan II, Ifrane',
  'https://www.aui.ma', 'info@aui.ma', '+212 535 86 20 00',
  ARRAY['Business Administration', 'Computer Science', 'Engineering', 'Humanities', 'Sciences', 'Law'],
  60000, 90000, 'MAD',
  ARRAY['English'],
  ARRAY['Bachelor', 'Master', 'MBA'],
  'Université anglophone privée inspirée du modèle américain, au cœur du Moyen Atlas.',
  1993, true, 'al-akhawayn-ifrane'
);

-- Set category_id for universities
update public.universities u
set category_id = c.id
from public.categories c
where c.slug = 'engineering'
and u.slug in ('ensias-rabat', 'emi-rabat', 'emsi-casablanca', 'inpt-rabat');

update public.universities u
set category_id = c.id
from public.categories c
where c.slug = 'business'
and u.slug in ('esca-casablanca');

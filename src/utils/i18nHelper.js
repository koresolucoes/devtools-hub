export const getLocalizedField = (obj, field, lang) => {
  if (!obj) return '';
  // e.g. field = 'shortDescription', lang = 'pt' => looks for 'pt_shortDescription'
  const localizedField = `${lang}_${field}`;
  return obj[localizedField] || obj[field];
};

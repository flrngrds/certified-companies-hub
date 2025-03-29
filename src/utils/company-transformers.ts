
import { Company } from "@/types/company";
import { parseDate, isCompanyNew } from "@/utils/date-utils";

export const transformCertifiedCompanyData = (data: any): Company => {
  // Parse the verification date string into a Date object
  const verificationDate = data["Last verified"] ? parseDate(data["Last verified"]) : null;
  const isNew = isCompanyNew(verificationDate);

  return {
    name: data.Entreprise || 'Unknown Company',
    website: data.Website || '#',
    certificationLevel: data.Niveau || null,
    employeeCount: data.Employees?.toString() || 'Not Specified',
    industry: data.Industry || 'Not Specified',
    country: data.Country || 'Not Specified',
    isNew,
    logo: data.image || '/placeholder.svg',
    description: data.Description || 'No description available.',
    publicationDate: data["Publication source"] || 'Not Specified',
    sourceLink: data.Lien || '#',
    lastVerified: data["Last verified"] || 'Not Specified',
    keywords: data.Keywords || 'No keywords available',
    linkedin: data.LinkedIn || '#',
    annualRevenue: data["Annual Revenue"]?.toString() || 'Not Specified',
    isEcoVadisCertified: true,
    addedAt: data["Date de création"] || null
  };
};

export const transformNonCertifiedCompanyData = (data: any): Company => {
  // Parse the verification date string into a Date object
  const verificationDate = data["Last verified"] ? parseDate(data["Last verified"]) : null;
  const isNew = isCompanyNew(verificationDate);

  return {
    name: data.Company || 'Unknown Company',
    website: data.Website || '#',
    certificationLevel: null,
    employeeCount: data.Employees?.toString() || 'Not Specified',
    industry: data.Industry || 'Not Specified',
    country: data.Country || 'Not Specified',
    isNew,
    logo: data.Logo || '/placeholder.svg',
    description: 'No description available.',
    lastVerified: data["Last verified"] || 'Not Specified',
    keywords: data.Keywords || 'No keywords available',
    annualRevenue: data["Annual Revenue"]?.toString() || 'Not Specified',
    isEcoVadisCertified: false,
    addedAt: data["Date de création"] || null
  };
};


export interface Company {
  name: string;
  website: string;
  certificationLevel: string | null;
  employeeCount: string;
  industry: string;
  country: string;
  isNew?: boolean;
  logo?: string;
  description?: string;
  publicationDate?: string;
  sourceLink?: string;
  lastVerified?: string;
  keywords?: string;
  linkedin?: string;
  annualRevenue?: string;
  isEcoVadisCertified?: boolean;
  addedAt?: string;
}

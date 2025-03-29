
/**
 * Helper function to parse dates in DD/MM/YYYY format
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  // Handle the DD/MM/YYYY format
  const dateParts = dateString.split('/');
  if (dateParts.length === 3) {
    // In DD/MM/YYYY format, parts are [day, month, year]
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // JavaScript months are 0-indexed
    const year = parseInt(dateParts[2], 10);
    
    // Create date (handles validation automatically)
    const date = new Date(year, month, day);
    
    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Fallback for other formats
  console.warn(`Date format not recognized for: ${dateString}, returning current date`);
  return new Date();
};

/**
 * Check if a company is new based on verification date (within last 30 days)
 */
export const isCompanyNew = (verificationDate: Date | null): boolean => {
  if (!verificationDate) return false;
  
  // Consider companies verified in last 30 days as new
  return (new Date().getTime() - verificationDate.getTime()) < (30 * 24 * 60 * 60 * 1000);
};

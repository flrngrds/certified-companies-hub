
/**
 * Helper function to parse dates in various formats (DD/MM/YYYY or stored text representations)
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null;
  
  console.log(`Attempting to parse date: "${dateString}"`);
  
  // Handle the DD/MM/YYYY format
  const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const ddmmyyyyMatch = dateString.match(ddmmyyyyRegex);
  
  if (ddmmyyyyMatch) {
    const day = parseInt(ddmmyyyyMatch[1], 10);
    const month = parseInt(ddmmyyyyMatch[2], 10) - 1; // JavaScript months are 0-indexed
    const year = parseInt(ddmmyyyyMatch[3], 10);
    
    const date = new Date(year, month, day);
    console.log(`Parsed DD/MM/YYYY date: ${dateString} → ${date.toISOString()}`);
    
    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  // Try to extract date from text format like "Saturday, March 29, 2025"
  try {
    // This will handle various date formats including text representations
    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate.getTime())) {
      console.log(`Parsed text date: ${dateString} → ${parsedDate.toISOString()}`);
      return parsedDate;
    }
  } catch (e) {
    console.warn(`Failed to parse date from text: ${dateString}`);
  }
  
  console.warn(`Date format not recognized for: ${dateString}, returning null`);
  return null;
};

/**
 * Check if a company is new based on verification date (within last 30 days)
 */
export const isCompanyNew = (verificationDate: Date | null): boolean => {
  if (!verificationDate) return false;
  
  // Consider companies verified in last 30 days as new
  return (new Date().getTime() - verificationDate.getTime()) < (30 * 24 * 60 * 60 * 1000);
};

/**
 * Format a date to a user-friendly string representation
 * 
 * @param date - The date to format (can be Date object or string in DD/MM/YYYY format)
 * @param format - The output format ('full', 'medium', 'short')
 * @returns A formatted date string
 */
export const formatDate = (date: Date | string | null, format: 'full' | 'medium' | 'short' = 'medium'): string => {
  if (!date) return 'N/A';
  
  // If date is a string, try to parse it
  if (typeof date === 'string') {
    const parsedDate = parseDate(date);
    if (!parsedDate) return 'Invalid date';
    date = parsedDate;
  }
  
  // Format options based on requested format style
  try {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: format === 'short' ? 'numeric' : 'long',
      day: 'numeric',
    };
    
    // Add additional details for fuller formats
    if (format === 'full') {
      options.weekday = 'long';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error formatting date';
  }
};

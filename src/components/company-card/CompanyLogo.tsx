
import { useState } from "react";

interface CompanyLogoProps {
  logo: string;
  name: string;
}

export const CompanyLogo = ({ logo, name }: CompanyLogoProps) => {
  const [imageError, setImageError] = useState(false);

  // Handle invalid logo URLs by setting a flag
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
      {!imageError ? (
        <img
          src={logo}
          alt={`${name} logo`}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        // Display first letter of company name as fallback
        <span className="text-lg font-semibold text-gray-400">
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
};

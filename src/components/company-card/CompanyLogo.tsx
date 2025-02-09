
interface CompanyLogoProps {
  logo: string;
  name: string;
}

export const CompanyLogo = ({ logo, name }: CompanyLogoProps) => {
  return (
    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
      <img
        src={logo}
        alt={`${name} logo`}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/placeholder.svg";
        }}
      />
    </div>
  );
};

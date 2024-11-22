import { CardContent } from "@/components/ui/card";
import { PictureCard } from "./PictureCard";

interface GenericCardProps {
  title: string;
  subtitle: string;
  image?: string | null;
  imageAlt?: string;
  children?: React.ReactNode;
  className?: string;
}

export function GenericCard({
  title,
  subtitle,
  image,
  imageAlt,
  children,
  className,
}: GenericCardProps) {
  return (
    <CardContent
      className={`${className && className} flex min-w-72 rounded-md border`}
    >
      <div className="flex items-center space-x-4 p-4 max-h-32">
        {image && (
          <PictureCard
            imageSrc={image}
            name={imageAlt || title}
            className="w-1/4"
          />
        )}
        <div className="flex-1 space-y-1 overflow-x-auto min-w-min min-h-min">
          <p className="text-sm font-medium leading-none">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </CardContent>
  );
}

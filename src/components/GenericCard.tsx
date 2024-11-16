import { CardContent } from "@/components/ui/card";
import { PictureCard } from "./PictureCard";

interface GenericCardProps {
  title: string;
  subtitle: string;
  useImage?: boolean;
  image?: string;
  imageAlt?: string;
  children?: React.ReactNode;
}

export function GenericCard({
  title,
  subtitle,
  image,
  useImage = true,
  imageAlt,
  children,
}: GenericCardProps) {
  return (
    <CardContent className="sm:flex min-w-72 rounded-md border">
      <div className="flex items-center space-x-4 p-4 max-h-32">
        {useImage && (
          <PictureCard
            imageSrc={"https://placehold.co/400"}
            name={imageAlt || title}
            className="max-w-20 sm:max-w-48"
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

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
    <CardContent className="grid gap-4">
      <div className=" flex items-center space-x-4 rounded-md border p-4 h-32">
        {useImage && (
          <PictureCard
            imageSrc={image || "https://placehold.co/400"}
            name={imageAlt || title}
          />
        )}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-medium leading-none">{title}</p>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </CardContent>
  );
}

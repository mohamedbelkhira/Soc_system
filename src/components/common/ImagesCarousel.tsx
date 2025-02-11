import { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { env } from "@/config/environment";
import { Box } from "lucide-react";

export default function ImagesCarousel({ imageUrls }: { imageUrls: string[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setActiveIndex(api.selectedScrollSnap());
    });
  }, [api]);

  if (imageUrls.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full flex items-center justify-center bg-muted rounded-md">
        <Box size={164} className="text-slate-400" />
      </div>
    );
  }
  console.log("Detail product page", imageUrls);
  return (
    <div className="relative w-full rounded-md">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {imageUrls.map((url, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-[4/3] w-full">
                <img
                  src={`${env.BACKEND_URL}/${url}`}
                  alt={`Slide ${index + 1}`}
                  className="object-cover w-full h-full rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex justify-center gap-2 mt-4">
        {imageUrls.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              activeIndex === index
                ? "bg-primary w-4"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

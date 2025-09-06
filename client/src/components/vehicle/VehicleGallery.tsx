import { useState } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, Maximize, X } from "lucide-react";

interface VehicleGalleryProps {
  images: string[];
}

const VehicleGallery = ({ images }: VehicleGalleryProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // If no images provided, show placeholder
  const displayImages = images.length > 0 
    ? images 
    : ["https://via.placeholder.com/800x600?text=No+Image+Available"];
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {/* Main gallery image */}
        <div className="relative">
          <img 
            src={displayImages[currentImage]} 
            alt={`Vehicle image ${currentImage + 1}`} 
            className="w-full h-[400px] object-cover"
          />
          
          {/* Fullscreen button */}
          <Dialog>
            <DialogTrigger asChild>
              <button 
                className="absolute top-4 right-4 bg-white/80 text-neutral-dark p-2 rounded-full hover:bg-white transition"
                aria-label="View fullscreen"
              >
                <Maximize className="h-5 w-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] p-0">
              <div className="relative h-full">
                <img 
                  src={displayImages[currentImage]} 
                  alt={`Vehicle image ${currentImage + 1}`} 
                  className="w-full h-[80vh] object-contain"
                />
                
                <button 
                  onClick={() => setCurrentImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-neutral-dark p-2 rounded-full hover:bg-white transition"
                  aria-label="Previous image"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                <button 
                  onClick={() => setCurrentImage(prev => (prev + 1) % displayImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-neutral-dark p-2 rounded-full hover:bg-white transition"
                  aria-label="Next image"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full">
                  {currentImage + 1} / {displayImages.length}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Image navigation arrows */}
          {displayImages.length > 1 && (
            <>
              <button 
                onClick={() => setCurrentImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-neutral-dark p-2 rounded-full hover:bg-white transition"
                aria-label="Previous image"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <button 
                onClick={() => setCurrentImage(prev => (prev + 1) % displayImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-neutral-dark p-2 rounded-full hover:bg-white transition"
                aria-label="Next image"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </>
          )}
          
          {/* Image counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full">
              {currentImage + 1} / {displayImages.length}
            </div>
          )}
        </div>
        
        {/* Thumbnail carousel */}
        {displayImages.length > 1 && (
          <div className="py-3 px-4 bg-gray-100">
            <Carousel 
              opts={{ 
                align: "start",
                slidesToScroll: 1
              }}
              className="w-full"
            >
              <CarouselContent>
                {displayImages.map((image, index) => (
                  <CarouselItem key={index} className="basis-1/4 md:basis-1/6 lg:basis-1/8">
                    <button
                      onClick={() => setCurrentImage(index)}
                      className={`relative w-full h-16 rounded overflow-hidden ${
                        currentImage === index ? "ring-2 ring-primary" : ""
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleGallery;

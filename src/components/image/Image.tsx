import { useState, forwardRef } from "react";

// Image
import FallBackImage from "../../assets/images/no_image.png";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  textColor?: string;
}

const Image = forwardRef<HTMLImageElement, ImageProps>((
  {
    src, 
    alt, 
    className,
    onLoad,
    textColor = "#000000",
  }, 
  ref
) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const srcToUse = src?.trim() ? src : FallBackImage;

  return (
    <div className="relative flex justify-center items-center w-full h-full">
      {!imageLoaded && (
        <span className="absolute text-[14px] font-bold" style={{ color: textColor }}>{"กำลังโหลดภาพ..."}</span>
      )}
      <img
        ref={ref}
        src={srcToUse}
        loading="lazy"
        onLoad={() => {
          setImageLoaded(true);
          onLoad?.();
        }}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== window.location.origin + FallBackImage) {
            target.src = FallBackImage;
          }
          setImageLoaded(true);
        }}
        className={className}
        alt={alt}
      />
    </div>
  )
})

export default Image;
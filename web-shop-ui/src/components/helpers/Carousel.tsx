import { useState } from "react";
import { Transition } from "@headlessui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { ICarouselProp } from "./types";
import { APP_ENV } from "../../env";
import noimage from "../../assets/no-image.webp";

function validateURL(url: string) {
  return /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(
    url
  );
}

const Carousel = ({ images }: ICarouselProp) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="flex h-96 justify-center items-center">
          {images.map((image, index) => (
            <Transition
              key={index}
              show={currentIndex === index}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              className="flex h-96 justify-center items-center"
            >
              <img
                src={
                  image
                    ? validateURL(image)
                      ? image
                      : `${APP_ENV.IMAGE_PATH}500x500_${image}`
                    : noimage
                }
                className="object-contain max-h-full max-w-full"
                alt=""
              />
            </Transition>
          ))}
        </div>
      </div>
      <button className="absolute inset-y-1/2 left-0 z-10" onClick={prevImage}>
        <ArrowLeftIcon className="w-6 h-6 text-black" />
      </button>
      <button className="absolute inset-y-1/2 right-0 z-10" onClick={nextImage}>
        <ArrowRightIcon className="w-6 h-6 text-black" />
      </button>

      <div className="flex justify-center mt-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`mx-1 h-20 w-20 flex justify-center items-center ${
              currentIndex === index
                ? "border-indigo-300 border-2"
                : "border-indigo-400 hover:border-indigo-500 hover:border-2"
            }`}
            onClick={() => selectImage(index)}
          >
            <img
              src={
                image
                  ? validateURL(image)
                    ? image
                    : `${APP_ENV.IMAGE_PATH}100x100_${image}`
                  : noimage
              }
              className="max-h-16"
              alt=""
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;

import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { useDropzone } from "react-dropzone";

interface Props {
  onDrop: (files: File[]) => void;
  title?: string;
  description?: string;
}

export const DropZone: React.FC<Props> = ({
  onDrop,
  title = "Завантажити",
  description = "Завантажте або перекиньте ваші файли PNG, JPEG або JPG",
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
        'image/png': ['.png'],
        'image/jpeg':['.jpg','.jpeg']
      }
  });
  return (
    <>
      <div className="relative overflow-hidden rounded-lg shadow-md cursor-pointer">
        <div
          className="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl"
          {...getRootProps()}
        >
          <CloudArrowUpIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />

          <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
            {title}
          </h2>
          {isDragActive ? (
            <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
              Кидайте файли сюди...
            </p>
          ) : (
            <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        <input {...getInputProps()} />
      </div>
    </>
  );
};

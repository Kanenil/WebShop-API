import { TagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface Props {
  search: string;
  to: string;
  onClick: (item: string) => void;
}

export const SearchItem: React.FC<Props> = ({ to, search, onClick }) => {
  return (
    <span
      key={search}
      className="mr-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
    >
      <TagIcon className="flex-shrink-0 -ml-0.5 mr-1.5 h-4 w-4 text-gray-400" />
      {search}
      <Link onClick={() => onClick(search)} to={to}>
        <XMarkIcon className="flex-shrink-0 ml-0.5 mr-1.5 h-4 w-4 text-gray-800" />
      </Link>
    </span>
  );
};

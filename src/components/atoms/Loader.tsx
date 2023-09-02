import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

const sizeMap = {
  small: "h-4 w-4",
  medium: "h-6 w-6",
  large: "h-8 w-8",
};

type LoaderProps = {
  size?: keyof typeof sizeMap;
  classes?: string;
};
const Loader = ({ size, classes }: LoaderProps) => {
  return (
    <Loader2
      className={cn(
        "animate-spin ring-[#9918b3]",
        sizeMap[size ?? "small"],
        classes
      )}
    />
  );
};

export default Loader;

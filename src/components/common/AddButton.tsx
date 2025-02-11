import { useNavigate } from "react-router-dom";

import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle } from "lucide-react";

import { Button } from "../ui/button";

export default function AddButton({
  label,
  href,
}: {
  label: string;
  href?: string;
}) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <Button
      type="button"
      size={isMobile ? "icon" : "default"}
      className="flex items-center gap-2"
      onClick={href ? handleClick : undefined}
    >
      <PlusCircle className="h-4 w-4" />
      <span className="hidden md:block">{label}</span>
    </Button>
  );
}

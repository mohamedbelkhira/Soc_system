import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ViewAction({ href }: { href?: string }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <Button
      type="button"
      variant={"ghost"}
      size={"icon"}
      onClick={href ? handleClick : undefined}
    >
      <Eye className="text-primary" />
    </Button>
  );
}

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeleteAction({ href }: { href?: string }) {
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
      <Trash2 className="text-destructive" />
    </Button>
  );
}

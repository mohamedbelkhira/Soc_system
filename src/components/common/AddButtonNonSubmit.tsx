import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddButtonNonSubmit({ label, href }: { label: string; href?: string; }) {
    const navigate = useNavigate();
    
    const handleClick = () => {
      if (href) {
        navigate(href);
      }
    };
  
    return (
      <Button
        type="button" // Explicitly set to button
        className="flex items-center gap-2"
        onClick={href ? handleClick : undefined}
      >
        <PlusCircle className="h-4 w-4" />
        {label}
      </Button>
    );
  }
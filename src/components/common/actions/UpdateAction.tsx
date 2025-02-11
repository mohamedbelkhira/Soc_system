import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit3 } from "lucide-react";

export default function UpdateAction({
  disabled = false,
  href,
  tooltipMessage = "This action is currently disabled",
}: {
  disabled?: boolean;
  href?: string;
  tooltipMessage?: string;
}) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (href) {
      navigate(href);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={href ? handleClick : undefined}
              disabled={disabled}
            >
              <Edit3 className="text-primary" />
            </Button>
          </div>
        </TooltipTrigger>
        {disabled && (
          <TooltipContent side="top">
            <p>{tooltipMessage}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

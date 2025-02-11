import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PageRootProps extends React.HTMLAttributes<HTMLDivElement> {
  showBackButton?: boolean;
}
const PageRoot = React.forwardRef<HTMLDivElement, PageRootProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="p-1">
        <div
          ref={ref}
          className={cn(
            "h-full rounded-xl border bg-card text-card-foreground shadow-sm",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }
);
PageRoot.displayName = "Page";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showBackButton?: boolean;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, showBackButton, children, ...props }, ref) => {
    const navigate = useNavigate();

    // If children is an array, treat the first child as the title and the rest as additional content.
    let title: React.ReactNode = children;
    let rest: React.ReactNode = null;
    if (Array.isArray(children)) {
      title = children[0];
      rest = children.slice(1);
    }

    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
      >
        <div className="flex items-center space-x-2">
          {showBackButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <ChevronLeft />
            </Button>
          )}
          {title}
        </div>
        {rest}
      </div>
    );
  }
);
PageHeader.displayName = "PageHeader";

const PageTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-base md:text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
PageTitle.displayName = "PageTitle";

const PageDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-2 text-sm text-muted-foreground", className)}
    {...props}
  />
));
PageDescription.displayName = "PageDescription";

const PageContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 md:p-6 pt-0", className)} {...props} />
));
PageContent.displayName = "PageContent";

const PageFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
PageFooter.displayName = "PageFooter";

export {
  PageRoot as Page,
  PageHeader,
  PageFooter,
  PageTitle,
  PageDescription,
  PageContent,
};
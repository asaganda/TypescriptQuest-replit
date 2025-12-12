import { BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentationLink {
  title: string;
  url: string;
}

interface DocumentationButtonProps {
  links: DocumentationLink[];
}

export default function DocumentationButton({ links }: DocumentationButtonProps) {
  if (!links || links.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          data-testid="button-documentation"
        >
          <BookOpen className="w-4 h-4" />
          Documentation
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {links.map((link, index) => (
          <DropdownMenuItem key={index} asChild>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 cursor-pointer"
            >
              <span>{link.title}</span>
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

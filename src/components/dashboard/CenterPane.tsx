import React from "react";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CenterPaneProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  children: React.ReactNode;
  className?: string;
}

const CenterPane = ({
  title,
  searchPlaceholder = "Rechercher...",
  onSearch,
  onAdd,
  addLabel = "Ajouter",
  children,
  className,
}: CenterPaneProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className={cn("w-80 shadow-lg border-0 flex flex-col h-full bg-card rounded-2xl mx-2 my-2", className)}>
      {/* Header */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">{title}</h2>
          {onAdd && (
            <Button size="sm" onClick={onAdd} className="h-9 rounded-xl shadow-sm hover:shadow-md transition-all">
              <Plus className="h-4 w-4 mr-1" />
              {addLabel}
            </Button>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 pr-9 h-10 text-sm rounded-xl bg-muted/30 border-0 shadow-sm focus:shadow-md transition-all"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1 px-2 pb-2">
        <div className="space-y-2">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CenterPane;

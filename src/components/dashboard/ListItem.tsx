import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ListItemProps {
  title: string;
  subtitle?: string;
  avatar?: string;
  initials?: string;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "secondary" | "outline";
  icon?: React.ReactNode;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  rightContent?: React.ReactNode;
}

const ListItem = ({
  title,
  subtitle,
  avatar,
  initials,
  badge,
  badgeVariant = "default",
  icon,
  isSelected,
  onClick,
  className,
  rightContent,
}: ListItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 text-left transition-all rounded-xl hover:bg-muted/30 hover:shadow-sm",
        isSelected && "bg-primary/10 shadow-sm ring-2 ring-primary/20",
        className
      )}
    >
      {(avatar || initials) && (
        <Avatar className="h-10 w-10 shrink-0 shadow-sm">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-primary text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}
      
      {icon && (
        <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 shadow-sm">
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate">{title}</span>
          {badge && (
            <Badge variant={badgeVariant} className="text-[10px] h-5 px-1.5 rounded-full shadow-sm">
              {badge}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      
      {rightContent && (
        <div className="shrink-0">
          {rightContent}
        </div>
      )}
    </button>
  );
};

export default ListItem;

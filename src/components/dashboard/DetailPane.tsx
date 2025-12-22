import React from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

interface DetailPaneProps {
  title: string;
  subtitle?: string;
  tabs?: Tab[];
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

const DetailPane = ({
  title,
  subtitle,
  tabs,
  onClose,
  children,
  className,
  actions,
}: DetailPaneProps) => {
  const [isMaximized, setIsMaximized] = React.useState(false);

  return (
    <div className={cn("flex-1 flex flex-col h-full bg-card min-w-0 rounded-2xl shadow-lg border-0 m-2", className)}>
      {/* Header */}
      <div className="h-16 px-6 flex items-center justify-between shrink-0">
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-lg truncate">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {actions}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-muted/50 hover:shadow-sm"
            onClick={() => setIsMaximized(!isMaximized)}
          >
            {isMaximized ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-muted/50 hover:shadow-sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      {tabs ? (
        <Tabs defaultValue={tabs[0]?.id} className="flex-1 flex flex-col min-h-0">
          <div className="px-6">
            <TabsList className="h-11 bg-muted/30 p-1 rounded-xl w-full justify-start shadow-sm">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg px-4 h-9 transition-all"
                >
                  {tab.icon && <tab.icon className="h-4 w-4 mr-2" />}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="flex-1 m-0 min-h-0">
              <ScrollArea className="h-full">
                <div className="p-6">
                  {tab.content}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default DetailPane;

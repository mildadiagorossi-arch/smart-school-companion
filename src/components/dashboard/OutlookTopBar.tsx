import { useState } from "react";
import { Bell, Search, User, ChevronDown, LogOut, Settings, RefreshCw, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useSchoolProfile } from "@/hooks/useOfflineData";
import NetworkStatus from "./NetworkStatus";
import { usePaneContext } from "./OutlookLayout";
import { cn } from "@/lib/utils";

const OutlookTopBar = () => {
  const { user, logout } = useAuth();
  const schoolProfile = useSchoolProfile();
  const { setIsCommandPaletteOpen } = usePaneContext();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate sync
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <header className="h-14 bg-card shadow-md border-0 px-4 flex items-center justify-between rounded-b-2xl mx-2">
      {/* Left Section - Logo & School */}
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg text-gradient hidden sm:block">
          {schoolProfile?.name || "SchoolGenius"}
        </span>
        <Badge variant="outline" className="hidden md:flex text-xs rounded-full bg-muted/50 border-0 shadow-sm">
          2024-2025
        </Badge>
      </div>

      {/* Center - Search */}
      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-muted/30 hover:bg-muted/50 rounded-xl transition-all shadow-sm hover:shadow-md max-w-md w-full mx-4"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground flex-1 text-left hidden sm:block">
          Rechercher...
        </span>
        <kbd className="hidden md:inline-flex h-6 select-none items-center gap-1 rounded-lg bg-background/80 px-2 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Sync Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl hover:bg-muted/50 hover:shadow-sm"
          onClick={handleSync}
        >
          <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
        </Button>

        {/* Network Status */}
        <NetworkStatus />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-muted/50 hover:shadow-sm">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center shadow-sm">
                7
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-lg border-0">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-destructive">⚠️</span>
                <span className="font-medium text-sm">Alerte absence</span>
              </div>
              <p className="text-xs text-muted-foreground">
                3 élèves absents non justifiés en 4B
              </p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-accent">🤖</span>
                <span className="font-medium text-sm">Recommandation IA</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Programmer soutien maths pour 5 élèves
              </p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary text-sm rounded-lg">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 h-9 rounded-xl hover:bg-muted/50 hover:shadow-sm">
              <Avatar className="h-7 w-7 shadow-sm">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-0">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm">{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {user?.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg">
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg">
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive rounded-lg" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default OutlookTopBar;

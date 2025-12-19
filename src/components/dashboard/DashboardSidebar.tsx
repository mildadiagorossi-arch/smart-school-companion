import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Calendar,
  FileText,
  Clock,
  MessageSquare,
  FolderOpen,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", badge: null },
  { icon: Users, label: "Élèves", href: "/dashboard/students", badge: null },
  { icon: GraduationCap, label: "Enseignants", href: "/dashboard/teachers", badge: null },
  { icon: School, label: "Classes & Matières", href: "/dashboard/classes", badge: null },
  { icon: Calendar, label: "Emploi du Temps", href: "/dashboard/timetable", badge: null },
  { icon: FileText, label: "Examens & Notes", href: "/dashboard/exams", badge: null },
  { icon: Clock, label: "Présence", href: "/dashboard/attendance", badge: "3" },
  { icon: MessageSquare, label: "Communication", href: "/dashboard/messages", badge: "5" },
  { icon: FolderOpen, label: "Documents", href: "/dashboard/documents", badge: null },
  { icon: Bot, label: "Assistant IA", href: "/dashboard/ai-assistant", badge: "✨" },
  { icon: Settings, label: "Administration", href: "/dashboard/settings", badge: null },
];

const DashboardSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 sticky top-0",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <GraduationCap className="h-8 w-8 text-primary" />
              <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1" />
            </div>
            <span className="font-bold text-lg text-gradient">SchoolGenius</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "animate-pulse")} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 font-medium truncate">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badge === "✨" ? "default" : "destructive"}
                          className={cn(
                            "text-xs",
                            item.badge === "✨" && "bg-accent text-accent-foreground"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm">Assistant IA</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Besoin d'aide ? L'IA est là pour vous 🚀
            </p>
            <Button variant="hero" size="sm" className="w-full">
              Demander à l'IA
            </Button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;

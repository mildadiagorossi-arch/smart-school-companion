import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Calendar,
  FileText,
  Clock,
  MessageSquare,
  CreditCard,
  FolderOpen,
  Bot,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePaneContext } from "./OutlookLayout";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", badge: null, roles: ['direction', 'admin', 'teacher', 'parent'] },
  { icon: Users, label: "Élèves", href: "/dashboard/students", badge: null, roles: ['direction', 'admin', 'teacher'] },
  { icon: GraduationCap, label: "Enseignants", href: "/dashboard/teachers", badge: null, roles: ['direction', 'admin'] },
  { icon: School, label: "Classes", href: "/dashboard/classes", badge: null, roles: ['direction', 'admin', 'teacher'] },
  { icon: Calendar, label: "Planning", href: "/dashboard/timetable", badge: null, roles: ['direction', 'admin', 'teacher', 'parent'] },
  { icon: FileText, label: "Notes", href: "/dashboard/exams", badge: null, roles: ['direction', 'admin', 'teacher', 'parent'] },
  { icon: Clock, label: "Présence", href: "/dashboard/attendance", badge: "3", roles: ['direction', 'admin', 'teacher', 'parent'] },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/communication", badge: "5", roles: ['direction', 'admin', 'teacher', 'parent'] },
  { icon: CreditCard, label: "Finance", href: "/dashboard/finance", badge: null, roles: ['direction', 'admin'] },
  { icon: FolderOpen, label: "Documents", href: "/dashboard/documents", badge: null, roles: ['direction', 'admin', 'teacher', 'parent'] },
  { icon: Settings, label: "Admin", href: "/dashboard/settings", badge: null, roles: ['direction', 'admin'] },
];

const OutlookSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { setIsCopilotOpen } = usePaneContext();

  const filteredMenuItems = menuItems.filter(item =>
    !user || item.roles.includes(user.role)
  );

  return (
    <TooltipProvider delayDuration={100}>
      <aside className="w-16 bg-card shadow-lg border-0 flex flex-col h-full rounded-r-2xl">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center">
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 shadow-sm">
            <GraduationCap className="h-7 w-7 text-primary" />
            <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-2 px-2">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== "/dashboard" && location.pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.href}
                        className={cn(
                          "relative flex items-center justify-center h-11 w-11 rounded-xl transition-all duration-200 mx-auto",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-sm"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.badge && (
                          <Badge
                            variant={item.badge === "✨" ? "default" : "destructive"}
                            className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] flex items-center justify-center rounded-full"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium rounded-xl shadow-md">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Copilot Button */}
        <div className="p-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsCopilotOpen(true)}
                className="flex items-center justify-center h-11 w-11 rounded-xl mx-auto bg-gradient-to-br from-primary/30 to-accent/30 text-primary hover:from-primary/40 hover:to-accent/40 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Bot className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium rounded-xl shadow-md">
              Copilot IA
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default OutlookSidebar;

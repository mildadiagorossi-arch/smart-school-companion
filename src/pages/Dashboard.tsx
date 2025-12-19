import { Routes, Route, Navigate } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import DashboardHome from "./DashboardHome";
import Students from "./Students";
import Teachers from "./Teachers";
import Timetable from "./Timetable";
import Classes from "./Classes";
import Exams from "./Exams";
import Communication from "./Communication";
import Documents from "./Documents";
import Invoicing from "./Invoicing";
import Attendance from "./Attendance";
import AIAssistant from "./AIAssistant";
import Settings from "./Settings";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg text-primary"></div>
          <p className="text-muted-foreground font-medium animate-pulse">Initialisation de SchoolGenius...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background w-full">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar />

        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/home" element={<DashboardHome />} />
            <Route path="/students" element={<Students />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/finance" element={<Invoicing />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/settings" element={<Settings />} />
            {/* Fallback to Home for unfinished routes */}
            <Route path="*" element={<DashboardHome />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

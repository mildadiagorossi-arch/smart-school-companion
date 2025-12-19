import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import KPICards from "@/components/dashboard/KPICards";
import AIAlertsSection from "@/components/dashboard/AIAlertsSection";
import QuickActions from "@/components/dashboard/QuickActions";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import RecentActivity from "@/components/dashboard/RecentActivity";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-background w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Tableau de Bord
                </h1>
                <p className="text-muted-foreground">
                  Vue d'ensemble de votre établissement • Jeudi 19 Décembre 2024
                </p>
              </div>
            </div>

            {/* KPI Cards */}
            <KPICards />

            {/* Quick Actions */}
            <QuickActions />

            {/* AI Alerts & Recommendations */}
            <AIAlertsSection />

            {/* Charts */}
            <DashboardCharts />

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

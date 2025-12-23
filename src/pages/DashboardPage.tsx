import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export const DashboardPage: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">{t('dashboard.dashboard')}</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'dashboard.total_students', value: '1,245', color: 'blue' },
                    { label: 'dashboard.total_classes', value: '45', color: 'green' },
                    { label: 'dashboard.avg_attendance', value: '92%', color: 'purple' },
                    { label: 'dashboard.avg_score', value: '78%', color: 'orange' }
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg shadow p-6">
                        <p className="text-gray-600 text-sm font-medium uppercase tracking-wide">{t(stat.label)}</p>
                        <p className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6 h-96">
                    <h3 className="font-semibold mb-4 text-lg">Attendance Over Time</h3>
                    {/* Chart placeholder */}
                    <div className="h-full bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        Chart Placeholder
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 h-96">
                    <h3 className="font-semibold mb-4 text-lg">Performance Distribution</h3>
                    <div className="h-full bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        Chart Placeholder
                    </div>
                </div>
            </div>
        </div>
    );
};

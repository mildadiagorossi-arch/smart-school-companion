import React, { useState } from 'react';
import { useClasses } from '@/hooks/useClasses';
import { useStudents } from '@/hooks/useStudents';
import { useAttendance } from '@/hooks/useAttendance';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/forms/Select';
import { Input } from '@/components/forms/Input';
import { Save, Check, X, Clock } from 'lucide-react';

export const AttendancePage: React.FC = () => {
    const { t } = useLanguage();
    const { classes } = useClasses();
    const [selectedClass, setSelectedClass] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Fetch students for selected class
    const { students: classStudents } = useStudents(selectedClass);

    // Fetch existing attendance
    const { attendance: existingAttendance, saveAttendance } = useAttendance(selectedClass, date);

    const [attendanceState, setAttendanceState] = useState<Record<string, string>>({});

    // Initialize state when students load (or when existing attendance loads)
    React.useEffect(() => {
        if (classStudents.length > 0) {
            const initial: Record<string, string> = {};
            classStudents.forEach(s => {
                const existing = existingAttendance.find(a => a.studentId === s.id);
                initial[s.id] = existing?.status || 'present';
            });
            setAttendanceState(initial);
        }
    }, [classStudents, existingAttendance]);


    const handleSave = async () => {
        try {
            const records = Object.entries(attendanceState).map(([studentId, status]) => ({
                classId: selectedClass,
                studentId,
                date,
                status: status as 'present' | 'absent' | 'late' | 'excused',
                remarks: ''
            }));

            await saveAttendance(records);
            alert(t('attendance.attendance_saved'));
        } catch (e) {
            console.error(e);
            alert('Error saving attendance');
        }
    };

    const toggleStatus = (studentId: string) => {
        const statuses = ['present', 'absent', 'late', 'excused'];
        const current = attendanceState[studentId] || 'present';
        const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
        setAttendanceState(prev => ({ ...prev, [studentId]: next }));
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'present': return <Check className="text-green-600" />;
            case 'absent': return <X className="text-red-600" />;
            case 'late': return <Clock className="text-yellow-600" />;
            case 'excused': return <span className="text-blue-600 font-bold">E</span>;
            default: return <Check className="text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-green-50 border-green-200';
            case 'absent': return 'bg-red-50 border-red-200';
            case 'late': return 'bg-yellow-50 border-yellow-200';
            case 'excused': return 'bg-blue-50 border-blue-200';
            default: return 'bg-white border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{t('attendance.attendance')}</h1>
                {selectedClass && (
                    <Button icon={Save} onClick={handleSave}>
                        {t('attendance.save_attendance')}
                    </Button>
                )}
            </div>

            <div className="flex gap-4 bg-white p-4 rounded-lg shadow">
                <div className="w-64">
                    <Select
                        label={t('students.class')}
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        options={classes.map(c => ({ label: c.name, value: c.id }))}
                    />
                </div>
                <div className="w-64">
                    <Input
                        label={t('attendance.attendance_date')}
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {selectedClass ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold">{t('attendance.student')}</th>
                                <th className="px-6 py-4 text-center font-semibold">{t('attendance.status')}</th>
                                <th className="px-6 py-4 text-left font-semibold">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {classStudents.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">
                                        {student.firstName} {student.lastName}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => toggleStatus(student.id)}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(attendanceState[student.id])}`}
                                        >
                                            {getStatusIcon(attendanceState[student.id])}
                                            <span className="capitalize">{attendanceState[student.id]}</span>
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            className="w-full px-3 py-1 border rounded"
                                            placeholder="Optional remarks..."
                                        />
                                    </td>
                                </tr>
                            ))}
                            {classStudents.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        {t('attendance.no_students_in_class')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-gray-500 mt-12">
                    Please select a class to view attendance
                </div>
            )}
        </div>
    );
};

import { useLiveQuery } from 'dexie-react-hooks';
import { db, Attendance, generateLocalId, getCurrentTimestamp } from '@/lib/db';
import { useAuth } from '@/hooks/useAuth';
import { syncEngine } from '@/lib/syncEngine';

export function useAttendance(classId?: string, date?: string) {
    const { user } = useAuth();
    const schoolId = user?.schoolId || 'demo_school'; // Fallback for dev

    const attendance = useLiveQuery(
        () => {
            if (!schoolId || !classId || !date) return [];
            // This query is simplified; Dexie compound index usage depends on schema.
            // Assuming simple filtering for now.
            return db.attendance
                .where('schoolId').equals(schoolId)
                .filter(a => a.classId === classId && a.date === date)
                .toArray();
        },
        [schoolId, classId, date]
    ) || [];

    const saveAttendance = async (records: Omit<Attendance, 'id' | 'localId' | 'syncStatus' | 'createdAt' | 'updatedAt' | 'schoolId'>[]) => {
        // Bulk put
        const timestamp = getCurrentTimestamp();
        const recordsToSave = records.map(record => ({
            ...record,
            schoolId,
            localId: generateLocalId(), // Ideally check if exists to update vs create, but strict create for new records here
            syncStatus: 'pending' as const,
            createdAt: timestamp,
            updatedAt: timestamp
        }));

        // In a real app, we'd upsert (update if exists for that student/date, else create)
        // For simplicity, we just add here, or use put to overwrite by ID if we had it.
        // Assuming records have everything needed.

        await db.attendance.bulkPut(recordsToSave as any); // Type assertion for now due to omit

        // Queue sync? Bulk sync queueing is complex, let's just queue individual or improve engine later.
        for (const rec of recordsToSave) {
            await syncEngine.queueAction('CREATE', 'attendance', rec.localId, rec, rec.schoolId);
        }
    };

    return {
        attendance,
        saveAttendance
    };
}

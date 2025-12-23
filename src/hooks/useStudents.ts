import { useLiveQuery } from 'dexie-react-hooks';
import { db, Student, generateLocalId, getCurrentTimestamp } from '@/lib/db';
import { useAuth } from '@/hooks/useAuth';
import { syncEngine } from '@/lib/syncEngine';

export function useStudents(classId?: string) {
    const { user } = useAuth();
    const schoolId = user?.schoolId || 'demo_school'; // Fallback for dev

    const students = useLiveQuery(
        () => {
            if (!schoolId) return [];
            const query = db.students.where('schoolId').equals(schoolId);
            if (classId) {
                return query.filter(s => s.classId === classId).toArray();
            }
            return query.toArray();
        },
        [schoolId, classId]
    ) || [];

    const isLoading = students === undefined;

    const create = async (data: Omit<Student, 'id' | 'localId' | 'syncStatus' | 'createdAt' | 'updatedAt' | 'schoolId'>) => {
        const student: Student = {
            ...data,
            schoolId: schoolId,
            localId: generateLocalId(),
            syncStatus: 'pending',
            createdAt: getCurrentTimestamp(),
            updatedAt: getCurrentTimestamp(),
        };

        const id = await db.students.add(student);
        await syncEngine.queueAction('CREATE', 'student', student.localId, student, student.schoolId);
        return { ...student, id };
    };

    const update = async (id: string, data: Partial<Student>) => {
        const student = await db.students.get(id);
        if (student) {
            const updatedStudent = {
                ...student,
                ...data,
                updatedAt: getCurrentTimestamp(),
                syncStatus: 'pending' as const
            };
            await db.students.put(updatedStudent);
            await syncEngine.queueAction('UPDATE', 'student', student.localId, updatedStudent, student.schoolId);
        }
    };

    const remove = async (id: string) => { // Rename delete to remove to avoid conflict
        const student = await db.students.get(id);
        if (student) {
            await db.students.delete(id);
            await syncEngine.queueAction('DELETE', 'student', student.localId, null, student.schoolId);
        }
    };

    return {
        students,
        isLoading,
        error: null, // Dexie doesn't provide direct error state in useLiveQuery, handle globally or wrap
        create,
        update,
        delete: remove
    };
}

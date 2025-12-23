import { useLiveQuery } from 'dexie-react-hooks';
import { db, Class, generateLocalId, getCurrentTimestamp } from '@/lib/db';
import { useAuth } from '@/hooks/useAuth';
import { syncEngine } from '@/lib/syncEngine';

export function useClasses() {
    const { user } = useAuth();
    const schoolId = user?.schoolId || 'demo_school';

    const classes = useLiveQuery(
        () => {
            if (!schoolId) return [];
            return db.classes.where('schoolId').equals(schoolId).toArray();
        },
        [schoolId]
    ) || [];

    const isLoading = classes === undefined;

    const create = async (data: Omit<Class, 'id' | 'localId' | 'syncStatus' | 'createdAt' | 'updatedAt' | 'schoolId'>) => {
        const classData: Class = {
            ...data,
            schoolId: schoolId,
            localId: generateLocalId(),
            syncStatus: 'pending',
            createdAt: getCurrentTimestamp(),
            updatedAt: getCurrentTimestamp(),
        };

        const id = await db.classes.add(classData);
        await syncEngine.queueAction('CREATE', 'class', classData.localId, classData, classData.schoolId);
        return { ...classData, id }; // Return with ID
    };

    const update = async (id: string, data: Partial<Class>) => {
        const classItem = await db.classes.get(id);
        if (classItem) {
            const updatedClass = {
                ...classItem,
                ...data,
                updatedAt: getCurrentTimestamp(),
                syncStatus: 'pending' as const
            };
            await db.classes.put(updatedClass);
            await syncEngine.queueAction('UPDATE', 'class', classItem.localId, updatedClass, classItem.schoolId);
        }
    };

    const remove = async (id: string) => {
        const classItem = await db.classes.get(id);
        if (classItem) {
            await db.classes.delete(id);
            await syncEngine.queueAction('DELETE', 'class', classItem.localId, null, classItem.schoolId);
        }
    };

    return {
        classes,
        isLoading,
        create,
        update,
        delete: remove
    };
}

/**
 * SchoolGenius - Hooks pour les données offline
 * Utilisation avec React et Dexie
 */

import { useLiveQuery } from 'dexie-react-hooks';
import {
    db,
    Student,
    Teacher,
    SchoolClass,
    Attendance,
    Grade,
    AIAlert,
    generateLocalId,
    getCurrentTimestamp
} from '../lib/db';
import { syncEngine } from '../lib/syncEngine';

// ============================================
// STUDENTS HOOKS
// ============================================

export function useStudents(classId?: string) {
    return useLiveQuery(
        () => {
            if (classId) {
                return db.students.where('classId').equals(classId).toArray();
            }
            return db.students.toArray();
        },
        [classId]
    );
}

export function useStudent(localId: string) {
    return useLiveQuery(
        () => db.students.where('localId').equals(localId).first(),
        [localId]
    );
}

export function useStudentCount() {
    return useLiveQuery(() => db.students.where('status').equals('active').count());
}

export async function addStudent(data: Omit<Student, 'id' | 'localId' | 'syncStatus' | 'createdAt' | 'updatedAt'>) {
    const student: Student = {
        ...data,
        localId: generateLocalId(),
        syncStatus: 'pending',
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
    };

    const id = await db.students.add(student);

    // Queue sync action
    await syncEngine.queueAction('CREATE', 'student', student.localId, student);

    return { ...student, id };
}

export async function updateStudent(localId: string, data: Partial<Student>) {
    const student = await db.students.where('localId').equals(localId).first();
    if (!student) throw new Error('Student not found');

    const updates = {
        ...data,
        syncStatus: 'pending' as const,
        updatedAt: getCurrentTimestamp(),
    };

    await db.students.update(student.id!, updates);
    await syncEngine.queueAction('UPDATE', 'student', localId, { ...student, ...updates });
}

export async function deleteStudent(localId: string) {
    const student = await db.students.where('localId').equals(localId).first();
    if (!student) throw new Error('Student not found');

    await db.students.delete(student.id!);
    await syncEngine.queueAction('DELETE', 'student', localId, { id: localId });
}

// ============================================
// TEACHERS HOOKS
// ============================================

export function useTeachers() {
    return useLiveQuery(() => db.teachers.toArray());
}

export function useTeacher(localId: string) {
    return useLiveQuery(
        () => db.teachers.where('localId').equals(localId).first(),
        [localId]
    );
}

export async function addTeacher(data: Omit<Teacher, 'id' | 'localId' | 'syncStatus' | 'createdAt' | 'updatedAt'>) {
    const teacher: Teacher = {
        ...data,
        localId: generateLocalId(),
        syncStatus: 'pending',
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
    };

    const id = await db.teachers.add(teacher);
    await syncEngine.queueAction('CREATE', 'teacher', teacher.localId, teacher);

    return { ...teacher, id };
}

// ============================================
// CLASSES HOOKS
// ============================================

export function useClasses() {
    return useLiveQuery(() => db.classes.toArray());
}

export function useClass(localId: string) {
    return useLiveQuery(
        () => db.classes.where('localId').equals(localId).first(),
        [localId]
    );
}

export function useClassCount() {
    return useLiveQuery(() => db.classes.count());
}

export async function addClass(data: Omit<SchoolClass, 'id' | 'localId' | 'syncStatus' | 'createdAt' | 'updatedAt'>) {
    const schoolClass: SchoolClass = {
        ...data,
        localId: generateLocalId(),
        syncStatus: 'pending',
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp(),
    };

    const id = await db.classes.add(schoolClass);
    await syncEngine.queueAction('CREATE', 'class', schoolClass.localId, schoolClass);

    return { ...schoolClass, id };
}

// ============================================
// ATTENDANCE HOOKS
// ============================================

export function useAttendanceToday(classId?: string) {
    const today = new Date().toISOString().split('T')[0];

    return useLiveQuery(
        () => {
            let query = db.attendance.where('date').equals(today);
            if (classId) {
                return query.and(a => a.classId === classId).toArray();
            }
            return query.toArray();
        },
        [classId, today]
    );
}

export function useAttendanceRate(classId?: string) {
    const today = new Date().toISOString().split('T')[0];

    return useLiveQuery(async () => {
        let attendance: Attendance[];

        if (classId) {
            attendance = await db.attendance
                .where('date').equals(today)
                .and(a => a.classId === classId)
                .toArray();
        } else {
            attendance = await db.attendance.where('date').equals(today).toArray();
        }

        if (attendance.length === 0) return 100;

        const present = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
        return Math.round((present / attendance.length) * 100);
    }, [classId]);
}

export async function markAttendance(
    studentId: string,
    classId: string,
    status: 'present' | 'absent' | 'late' | 'excused',
    markedBy: string,
    reason?: string
) {
    const today = new Date().toISOString().split('T')[0];

    // Vérifier si déjà marqué
    const existing = await db.attendance
        .where(['studentId', 'date'])
        .equals([studentId, today])
        .first();

    const attendance: Attendance = {
        localId: existing?.localId || generateLocalId(),
        studentId,
        classId,
        date: today,
        status,
        reason,
        markedBy,
        markedAt: getCurrentTimestamp(),
        syncStatus: 'pending',
    };

    if (existing) {
        await db.attendance.update(existing.id!, attendance);
        await syncEngine.queueAction('UPDATE', 'attendance', attendance.localId, attendance);
    } else {
        await db.attendance.add(attendance);
        await syncEngine.queueAction('CREATE', 'attendance', attendance.localId, attendance);
    }
}

// ============================================
// GRADES HOOKS
// ============================================

export function useGrades(studentId?: string, subjectId?: string) {
    return useLiveQuery(
        () => {
            if (studentId && subjectId) {
                return db.grades
                    .where('studentId').equals(studentId)
                    .and(g => g.subjectId === subjectId)
                    .toArray();
            }
            if (studentId) {
                return db.grades.where('studentId').equals(studentId).toArray();
            }
            return db.grades.toArray();
        },
        [studentId, subjectId]
    );
}

export function useAverageGrade(classId?: string) {
    return useLiveQuery(async () => {
        let grades: Grade[];

        if (classId) {
            grades = await db.grades.where('classId').equals(classId).toArray();
        } else {
            grades = await db.grades.toArray();
        }

        if (grades.length === 0) return 0;

        const total = grades.reduce((sum, g) => sum + (g.value / g.maxValue) * 20, 0);
        return Math.round((total / grades.length) * 10) / 10;
    }, [classId]);
}

export async function addGrade(data: Omit<Grade, 'id' | 'localId' | 'syncStatus' | 'createdAt'>) {
    const grade: Grade = {
        ...data,
        localId: generateLocalId(),
        syncStatus: 'pending',
        createdAt: getCurrentTimestamp(),
    };

    const id = await db.grades.add(grade);
    await syncEngine.queueAction('CREATE', 'grade', grade.localId, grade);

    return { ...grade, id };
}

// ============================================
// AI ALERTS HOOKS
// ============================================

export function useAIAlerts(unhandledOnly = false) {
    return useLiveQuery(
        () => {
            if (unhandledOnly) {
                return db.aiAlerts.where('isHandled').equals(0).toArray();
            }
            return db.aiAlerts.toArray();
        },
        [unhandledOnly]
    );
}

export function useUnhandledAlertCount() {
    return useLiveQuery(() => db.aiAlerts.where('isHandled').equals(0).count());
}

export async function markAlertAsHandled(localId: string) {
    const alert = await db.aiAlerts.where('localId').equals(localId).first();
    if (alert) {
        await db.aiAlerts.update(alert.id!, { isHandled: true });
    }
}

/**
 * Génère des alertes IA localement (mode offline)
 * Basé sur des heuristiques simples
 */
export async function generateOfflineAlerts(): Promise<AIAlert[]> {
    const alerts: AIAlert[] = [];
    const today = new Date().toISOString().split('T')[0];

    // Alertes absences répétées (3+ absences cette semaine)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const recentAttendance = await db.attendance
        .where('date').between(weekAgo, today, true, true)
        .and(a => a.status === 'absent')
        .toArray();

    // Grouper par étudiant
    const absencesByStudent: Record<string, number> = {};
    recentAttendance.forEach(a => {
        absencesByStudent[a.studentId] = (absencesByStudent[a.studentId] || 0) + 1;
    });

    // Créer alertes pour les élèves avec 3+ absences
    for (const [studentId, count] of Object.entries(absencesByStudent)) {
        if (count >= 3) {
            const student = await db.students.where('localId').equals(studentId).first();
            if (student) {
                alerts.push({
                    localId: generateLocalId(),
                    type: 'absence',
                    severity: count >= 5 ? 'danger' : 'warning',
                    studentId,
                    title: 'Absences répétées',
                    description: `${count} absences cette semaine`,
                    suggestedAction: 'Contacter les parents',
                    isRead: false,
                    isHandled: false,
                    generatedAt: getCurrentTimestamp(),
                    generatedOffline: true,
                    syncStatus: 'pending',
                });
            }
        }
    }

    // Sauvegarder les alertes
    for (const alert of alerts) {
        await db.aiAlerts.add(alert);
    }

    return alerts;
}

// ============================================
// TIMETABLE HOOKS
// ============================================

export function useTimetable(classId?: string) {
    return useLiveQuery(
        () => {
            if (classId) {
                return db.timetable.where('classId').equals(classId).toArray();
            }
            return db.timetable.toArray();
        },
        [classId]
    );
}

// ============================================
// EXAMS HOOKS
// ============================================

export function useExams(classId?: string) {
    return useLiveQuery(
        () => {
            if (classId) {
                return db.exams.where('classId').equals(classId).toArray();
            }
            return db.exams.toArray();
        },
        [classId]
    );
}

// ============================================
// INVOICES HOOKS
// ============================================

export function useInvoices(studentId?: string) {
    return useLiveQuery(
        () => {
            if (studentId) {
                return db.invoices.where('studentId').equals(studentId).toArray();
            }
            return db.invoices.toArray();
        },
        [studentId]
    );
}

// ============================================
// DOCUMENTS HOOKS
// ============================================

export function useDocuments(classId?: string) {
    return useLiveQuery(
        () => {
            if (classId) {
                return db.documents.where('classId').equals(classId).toArray();
            }
            return db.documents.toArray();
        },
        [classId]
    );
}

// ============================================
// MESSAGES HOOKS
// ============================================

export function useMessages() {
    return useLiveQuery(() => db.messages.orderBy('sentAt').reverse().toArray());
}

export async function sendMessage(data: Omit<Message, 'id' | 'localId' | 'syncStatus' | 'sentAt'>) {
    const message: Message = {
        ...data,
        localId: generateLocalId(),
        sentAt: getCurrentTimestamp(),
        syncStatus: 'pending',
    };

    await db.messages.add(message);
    await syncEngine.queueAction('CREATE', 'message', message.localId, message);
}

// ============================================
// SYNC STATUS HOOKS
// ============================================

export function usePendingSyncCount() {
    return useLiveQuery(() => db.syncActions.where('status').equals('pending').count());
}

export function useIsOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

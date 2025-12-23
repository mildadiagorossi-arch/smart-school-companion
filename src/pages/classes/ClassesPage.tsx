import React, { useState } from 'react';
import { useClasses } from '@/hooks/useClasses';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { ClassForm } from './ClassForm';

export const ClassesPage: React.FC = () => {
    const { t } = useLanguage();
    const { classes, isLoading, delete: deleteClass, create, update } = useClasses();
    const [showForm, setShowForm] = useState(false);
    const [selectedClass, setSelectedClass] = useState<any>(null);

    const handleCreate = async (data: any) => {
        await create(data);
        setShowForm(false);
    };

    const handleUpdate = async (data: any) => {
        await update(selectedClass.id, data);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">{t('classes.classes')}</h1>
                <Button icon={Plus} onClick={() => { setSelectedClass(null); setShowForm(true); }}>
                    {t('classes.add_class')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <p>{t('common.loading')}</p>
                ) : classes.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold">{cls.name}</h3>
                                <p className="text-gray-600">{cls.level}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-gray-400 hover:text-blue-600" onClick={() => { setSelectedClass(cls); setShowForm(true); }}>
                                    <Edit2 className="h-5 w-5" />
                                </button>
                                <button className="text-gray-400 hover:text-red-600" onClick={() => deleteClass(cls.id)}>
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{cls.studentCount || 0} Students</span>
                            </div>
                            <p><strong>{t('classes.teacher')}:</strong> {cls.mainTeacherId || 'Not assigned'}</p>
                            <p><strong>{t('classes.room')}:</strong> {cls.room || 'N/A'}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={selectedClass ? t('classes.edit_class') : t('classes.add_class')}>
                <ClassForm
                    classItem={selectedClass}
                    onSubmit={selectedClass ? handleUpdate : handleCreate}
                    onCancel={() => setShowForm(false)}
                />
            </Modal>
        </div>
    );
};

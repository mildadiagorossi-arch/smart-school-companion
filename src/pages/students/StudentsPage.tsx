import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/forms/Input';
import { Modal } from '@/components/common/Modal';
import { StudentForm } from './StudentForm';
import { StudentDetail } from './StudentDetail';

export const StudentsPage: React.FC = () => {
    const { t } = useLanguage();
    const { students, isLoading, delete: deleteStudent, create, update } = useStudents();
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    const filteredStudents = students.filter((s) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateStudent = async (data: any) => {
        await create(data);
        setShowForm(false);
    };

    const handleUpdateStudent = async (data: any) => {
        await update(selectedStudent.id, data);
        setShowForm(false);
    };

    const handleSelectStudent = (student: any) => {
        setSelectedStudent(student);
        setShowDetail(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">{t('students.students')}</h1>
                    <p className="text-gray-600 mt-1">{filteredStudents.length} students</p>
                </div>
                <Button icon={Plus} onClick={() => { setSelectedStudent(null); setShowForm(true); }}>
                    {t('students.add_student')}
                </Button>
            </div>

            {/* Search */}
            <Input
                placeholder={t('students.search_students')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
            />

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">{t('students.no_students')}</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold">{t('students.name')}</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold">{t('students.email')}</th>
                                {/* <th className="px-6 py-3 text-left text-sm font-semibold">{t('students.class')}</th> */}
                                <th className="px-6 py-3 text-left text-sm font-semibold">{t('students.phone')}</th>
                                {/* <th className="px-6 py-3 text-left text-sm font-semibold">{t('students.status')}</th> */}
                                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{student.firstName} {student.lastName}</td>
                                    <td className="px-6 py-4 text-gray-600">{student.email}</td>
                                    {/* <td className="px-6 py-4 text-gray-600">{student.className}</td> */}
                                    <td className="px-6 py-4 text-gray-600">{student.phone}</td>
                                    {/* <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      student.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {t(`students.${student.status}`)}
                    </span>
                  </td> */}
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            icon={Eye}
                                            onClick={() => handleSelectStudent(student)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            icon={Edit2}
                                            onClick={() => {
                                                setSelectedStudent(student);
                                                setShowForm(true);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            icon={Trash2}
                                            onClick={() => deleteStudent(student.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Forms */}
            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={selectedStudent ? t('students.edit_student') : t('students.add_student')}>
                <StudentForm
                    student={selectedStudent}
                    onSubmit={selectedStudent ? handleUpdateStudent : handleCreateStudent}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedStudent(null);
                    }}
                />
            </Modal>

            <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title={t('students.student_details')}>
                {selectedStudent && <StudentDetail student={selectedStudent} />}
            </Modal>
        </div>
    );
};

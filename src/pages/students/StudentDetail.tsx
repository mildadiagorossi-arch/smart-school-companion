import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Mail, Phone, MapPin, Users, Calendar } from 'lucide-react';

interface StudentDetailProps {
    student: any;
}

export const StudentDetail: React.FC<StudentDetailProps> = ({ student }) => {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>
                <div>
                    <h3 className="text-2xl font-bold">{student.firstName} {student.lastName}</h3>
                    <p className="text-gray-600">{student.className}</p>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                        <p className="text-sm text-gray-600">{t('students.email')}</p>
                        <p className="font-medium">{student.email}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                        <p className="text-sm text-gray-600">{t('students.phone')}</p>
                        <p className="font-medium">{student.phone}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                        <p className="text-sm text-gray-600">{t('students.date_of_birth')}</p>
                        <p className="font-medium">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                        <p className="text-sm text-gray-600">{t('students.address')}</p>
                        <p className="font-medium">{student.address}</p>
                    </div>
                </div>
            </div>

            {/* Parent Info */}
            <div className="border-t pt-4">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t('students.parent_name')}
                </h4>
                <div className="space-y-2">
                    <p><strong>Name:</strong> {student.parentName}</p>
                    <p><strong>Phone:</strong> {student.parentPhone}</p>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { useForm } from '@/hooks/useForm';
import { createStudentSchema } from '@/lib/validators';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Textarea } from '@/components/forms/Textarea';

interface StudentFormProps {
    student?: any;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmit, onCancel }) => {
    const { t } = useLanguage();
    const form = useForm(
        student || {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            classId: '',
            parentName: '',
            parentPhone: '',
            address: ''
        },
        onSubmit,
        createStudentSchema
    );

    return (
        <form onSubmit={form.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label={t('students.name')}
                    name="firstName"
                    value={form.values.firstName}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.touched.firstName && form.errors.firstName}
                />
                <Input
                    label={t('students.name')}
                    name="lastName"
                    value={form.values.lastName}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.touched.lastName && form.errors.lastName}
                />
            </div>

            <Input
                label={t('students.email')}
                type="email"
                name="email"
                value={form.values.email}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.touched.email && form.errors.email}
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label={t('students.phone')}
                    name="phone"
                    value={form.values.phone}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.touched.phone && form.errors.phone}
                />
                <Input
                    label={t('students.date_of_birth')}
                    type="date"
                    name="dateOfBirth"
                    value={form.values.dateOfBirth}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    error={form.touched.dateOfBirth && form.errors.dateOfBirth}
                />
            </div>

            <Select
                label={t('students.class')}
                name="classId"
                value={form.values.classId}
                onChange={form.handleChange}
                options={[
                    { label: 'Class A', value: '1' },
                    { label: 'Class B', value: '2' },
                    { label: 'Class C', value: '3' }
                ]}
            />

            <Input
                label={t('students.parent_name')}
                name="parentName"
                value={form.values.parentName}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.touched.parentName && form.errors.parentName}
            />

            <Input
                label={t('students.parent_phone')}
                name="parentPhone"
                value={form.values.parentPhone}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.touched.parentPhone && form.errors.parentPhone}
            />

            <Textarea
                label={t('students.address')}
                name="address"
                value={form.values.address}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                error={form.touched.address && form.errors.address}
            />

            <div className="flex gap-4 justify-end">
                <Button variant="outline" type="button" onClick={onCancel}>
                    {t('common.cancel')}
                </Button>
                <Button type="submit" isLoading={form.isSubmitting}>
                    {t('common.save')}
                </Button>
            </div>
        </form>
    );
};

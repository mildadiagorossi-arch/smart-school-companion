import React from 'react';
import { useForm } from '@/hooks/useForm';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';

interface ClassFormProps {
    classItem?: any;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export const ClassForm: React.FC<ClassFormProps> = ({ classItem, onSubmit, onCancel }) => {
    const { t } = useLanguage();
    // Simplified schema integration for now
    const form = useForm(
        classItem || {
            name: '',
            level: '',
            capacity: 30,
            room: '',
            mainTeacherId: ''
        },
        onSubmit
    );

    return (
        <form onSubmit={form.handleSubmit} className="space-y-4">
            <Input
                label={t('classes.class_name')}
                name="name"
                value={form.values.name}
                onChange={form.handleChange}
                required
            />
            <Select
                label={t('classes.level')}
                name="level"
                value={form.values.level}
                onChange={form.handleChange}
                options={[
                    { label: 'Primary 1', value: 'P1' },
                    { label: 'Primary 2', value: 'P2' },
                    { label: 'Secondary 1', value: 'S1' },
                    { label: 'Secondary 2', value: 'S2' }
                ]}
                required
            />
            <Input
                label={t('classes.capacity')}
                type="number"
                name="capacity"
                value={form.values.capacity}
                onChange={form.handleChange}
            />
            <Input
                label={t('classes.room')}
                name="room"
                value={form.values.room}
                onChange={form.handleChange}
            />

            <div className="flex gap-4 justify-end mt-6">
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

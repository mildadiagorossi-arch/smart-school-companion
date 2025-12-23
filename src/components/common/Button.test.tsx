import { render, screen } from '@testing-library/react';
import { Button } from '@/components/common/Button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
    it('renders correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        render(<Button isLoading>Click me</Button>);
        // Loader2 from lucide-react might not have text, but button should be disabled
        expect(screen.getByRole('button')).toBeDisabled();
    });
});

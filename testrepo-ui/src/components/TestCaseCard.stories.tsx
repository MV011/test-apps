import type { Meta, StoryObj } from '@storybook/react';
import TestCaseCard from './TestCaseCard';

const meta = {
    title: 'Components/TestCaseCard',
    component: TestCaseCard,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof TestCaseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        testCase: {
            id: 1,
            title: 'Login Authentication',
            description: 'Verify user can login with valid credentials',
            status: 'pending',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
        },
        onStatusChange: async (id, status) => {
            console.log('Status changed:', id, status);
        },
        onDelete: async (id) => {
            console.log('Delete clicked:', id);
        },
    },
};

export const Passed: Story = {
    args: {
        ...Default.args,
        testCase: {
            ...Default.args.testCase!,
            status: 'passed',
        },
    },
};

export const Failed: Story = {
    args: {
        ...Default.args,
        testCase: {
            ...Default.args.testCase!,
            status: 'failed',
        },
    },
};
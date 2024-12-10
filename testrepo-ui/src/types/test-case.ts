export type TestCase = {
    id: number;
    title: string;
    description: string;
    status: 'pending' | 'passed' | 'failed';
    created_at: string;
    updated_at: string;
    owner_id: number;
};

export type NewTestCase = {
    title: string;
    description: string;
    status: TestCase['status'];
};
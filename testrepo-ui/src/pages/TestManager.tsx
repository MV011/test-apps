import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TestCase, NewTestCase } from '../types/test-case';
import { testCaseApi } from '../api/test-cases';
import CreateTestCaseForm from '../components/CreateTestCaseForm';
import TestCaseCard from '../components/TestCaseCard';

const TestManager: React.FC = () => {
    const [testCases, setTestCases] = useState<TestCase[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const fetchTestCases = async () => {
        try {
            const data = await testCaseApi.getAll();
            setTestCases(data);
            setError('');
        } catch (err) {
            setError('Failed to fetch test cases. Please try again later.');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestCases();
    }, []);

    const handleCreateTestCase = async (newTest: NewTestCase) => {
        try {
            const createdTest = await testCaseApi.create(newTest);
            setTestCases(prev => [...prev, createdTest]);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create test case');
            throw err;
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: TestCase['status']) => {
        try {
            const testCase = testCases.find(test => test.id === id);
            if (!testCase) return;

            const updatedTest = await testCaseApi.update(id, {
                title: testCase.title,
                description: testCase.description,
                status: newStatus,
            });

            setTestCases(prev =>
                prev.map(test => (test.id === id ? updatedTest : test))
            );
            setError('');
        } catch (err) {
            setError('Failed to update test case status. Please try again.');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await testCaseApi.delete(id);
            setTestCases(prev => prev.filter(test => test.id !== id));
            setError('');
        } catch (err) {
            setError('Failed to delete test case. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <RefreshCw className="animate-spin h-8 w-8 text-blue-500" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <CreateTestCaseForm onSubmit={handleCreateTestCase} />

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {testCases.map((testCase) => (
                    <TestCaseCard
                        key={testCase.id}
                        testCase={testCase}
                        onStatusChange={handleStatusUpdate}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default TestManager;
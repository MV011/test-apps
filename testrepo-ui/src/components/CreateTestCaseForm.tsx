import React, { useState } from 'react';
import { PlusCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewTestCase, TestCase } from '../types/test-case';

interface CreateTestCaseFormProps {
    onSubmit: (testCase: NewTestCase) => Promise<void>;
}

const CreateTestCaseForm: React.FC<CreateTestCaseFormProps> = ({ onSubmit }) => {
    const [newTest, setNewTest] = useState<NewTestCase>({
        title: '',
        description: '',
        status: 'pending'
    });
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            await onSubmit(newTest);
            setNewTest({ title: '', description: '', status: 'pending' });
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <Card className="mb-6" id="create-test-case-form">
            <CardHeader>
                <CardTitle>Create New Test Case</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter test title"
                            value={newTest.title}
                            onChange={(e) => setNewTest(prev => ({ ...prev, title: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter test description"
                            value={newTest.description}
                            onChange={(e) => setNewTest(prev => ({ ...prev, description: e.target.value }))}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={newTest.status}
                            onValueChange={(value: TestCase['status']) =>
                                setNewTest(prev => ({ ...prev, status: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="passed">Passed</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={submitLoading}
                    >
                        {submitLoading ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <PlusCircle className="mr-2 h-4 w-4" />
                        )}
                        Add Test Case
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateTestCaseForm;
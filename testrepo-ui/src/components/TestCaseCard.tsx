import React from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestCase } from '../types/test-case';

interface TestCaseCardProps {
    testCase: TestCase;
    onStatusChange: (id: number, status: TestCase['status']) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

const TestCaseCard: React.FC<TestCaseCardProps> = ({
                                                       testCase,
                                                       onStatusChange,
                                                       onDelete,
                                                   }) => {
    return (
        <Card id="test-case-card">
            <CardHeader>
                <CardTitle className="text-lg">{testCase.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 mb-4">{testCase.description}</p>
                <div className="text-sm text-gray-500">
                    Created: {new Date(testCase.created_at).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">
                    Updated: {new Date(testCase.updated_at).toLocaleDateString()}
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Select
                    value={testCase.status}
                    onValueChange={(value: TestCase['status']) =>
                        onStatusChange(testCase.id, value)
                    }
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => onDelete(testCase.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TestCaseCard;
import {API_BASE_URL} from '../config/api';
import {TestCase, NewTestCase} from '../types/test-case';
import {getAuthHeaders} from "@/api/auth.ts";

export const testCaseApi = {
    async getAll(): Promise<TestCase[]> {
        const response = await fetch(`${API_BASE_URL}/test-cases/`,
            {headers: getAuthHeaders()});
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    },

    async create(testCase: NewTestCase): Promise<TestCase> {
        const response = await fetch(`${API_BASE_URL}/test-cases/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(testCase),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create test case');
        }

        return response.json();
    },

    async update(id: number, testCase: NewTestCase): Promise<TestCase> {
        const response = await fetch(`${API_BASE_URL}/test-cases/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(testCase),
        });

        if (!response.ok) {
            throw new Error('Failed to update test case');
        }

        return response.json();
    },

    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/test-cases/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to delete test case');
        }
    },
};
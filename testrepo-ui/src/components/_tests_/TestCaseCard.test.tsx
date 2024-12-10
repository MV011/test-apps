// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '../../utils/test-utils';
// import TestCaseCard from '../TestCaseCard';
// import { TestCase } from '../../types/test-case';
//
// const mockTestCase: TestCase = {
//     id: 1,
//     title: 'Test Title',
//     description: 'Test Description',
//     status: 'pending',
//     created_at: '2024-01-01T00:00:00Z',
//     updated_at: '2024-01-01T00:00:00Z',
// };
//
// describe('TestCaseCard', () => {
//     const mockOnStatusChange = jest.fn();
//     const mockOnDelete = jest.fn();
//
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
//
//     it('renders test case details correctly', () => {
//         render(
//             <TestCaseCard
//                 testCase={mockTestCase}
//                 onStatusChange={mockOnStatusChange}
//                 onDelete={mockOnDelete}
//             />
//         );
//
//         expect(screen.getByText(mockTestCase.title)).toBeInTheDocument();
//         expect(screen.getByText(mockTestCase.description)).toBeInTheDocument();
//         expect(screen.getByText(/Created:/)).toBeInTheDocument();
//         expect(screen.getByText(/Updated:/)).toBeInTheDocument();
//     });
//
//     it('calls onDelete when delete button is clicked', async () => {
//         render(
//             <TestCaseCard
//                 testCase={mockTestCase}
//                 onStatusChange={mockOnStatusChange}
//                 onDelete={mockOnDelete}
//             />
//         );
//
//         const deleteButton = screen.getByRole('button', { name: /delete/i });
//         fireEvent.click(deleteButton);
//
//         await waitFor(() => {
//             expect(mockOnDelete).toHaveBeenCalledWith(mockTestCase.id);
//         });
//     });
// });
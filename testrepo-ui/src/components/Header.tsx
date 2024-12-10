import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '../types/auth';

interface HeaderProps {
    user: User;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    return (
        <div className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Test Management App</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user?.username}</span>
                    <Button variant="outline" id="logout-button" onClick={onLogout}>
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
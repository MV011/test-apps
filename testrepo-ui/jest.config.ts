import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {}
    disconnect() {}
    observe() {}
    unobserve() {}
};
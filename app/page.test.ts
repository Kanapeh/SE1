import { describe, it, expect } from 'vitest';
import { page } from './page';

describe('page module', () => {
    it('should return correct value', () => {
        expect(page()).toBe('expected value');
    });
});
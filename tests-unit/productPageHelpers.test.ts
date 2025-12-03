import { describe, it, expect } from 'vitest';
import { getHelpers } from '../src/utils/productPageHelpers';

describe('getHelpers', () => {
  const mockProducts = [
    { id: 1, name: 'Apple', price$: 1.5, categories: ['Fruits', 'Fresh'] },
    { id: 2, name: 'Banana', price$: 0.5, categories: ['Fruits'] },
    { id: 3, name: 'Carrot', price$: 0.8, categories: ['Vegetables', 'Fresh'] },
  ];

  it('returns products array', () => {
    const result = getHelpers(mockProducts);
    expect(result.products).toHaveLength(3);
    expect(result.products[0].name).toBe('Apple');
  });

  it('returns empty array for null/undefined input', () => {
    expect(getHelpers(null).products).toEqual([]);
    expect(getHelpers(undefined).products).toEqual([]);
  });

  it('creates categories with counts', () => {
    const result = getHelpers(mockProducts);
    expect(result.categories).toContain('All (3)');
    expect(result.categories).toContain('Fruits (2)');
    expect(result.categories).toContain('Fresh (2)');
    expect(result.categories).toContain('Vegetables (1)');
  });

  it('returns sort options', () => {
    const result = getHelpers(mockProducts);
    expect(result.sortOptions).toHaveLength(4);
    expect(result.sortDescriptions).toContain('Price (low to high)');
    expect(result.sortDescriptions).toContain('Product name (a-z)');
  });

  it('sorts categories alphabetically', () => {
    const result = getHelpers(mockProducts);
    const categoriesWithoutAll = result.categories.slice(1);
    const sorted = [...categoriesWithoutAll].sort();
    expect(categoriesWithoutAll).toEqual(sorted);
  });
});

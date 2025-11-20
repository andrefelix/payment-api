import { Amount } from './amount.vo';

describe('Amount', () => {
  it('creates a valid amount', () => {
    const amount = Amount.create(100);
    expect(amount.value).toBe(100);
  });

  it('rejects non-positive or non-integer values', () => {
    expect(() => Amount.create(0)).toThrow('Invalid amount');
    expect(() => Amount.create(-10)).toThrow('Invalid amount');
    expect(() => Amount.create(10.5)).toThrow('Invalid amount');
  });

  it('enforces immutability', () => {
    const amount = Amount.create(50);
    expect(Object.isFrozen(amount)).toBe(true);
    expect(() => {
      (amount as any).raw = 30;
    }).toThrow();
  });

  it('exposes value through getter', () => {
    const amount = Amount.create(75);
    expect(amount.value).toBe(75);
  });
});

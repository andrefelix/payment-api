import { PaymentStatus } from './payment-status.vo';

describe('PaymentStatus', () => {
  it('creates a valid payment status', () => {
    const status = PaymentStatus.create('PAID');
    expect(status.value).toBe('paid');
  });

  it('rejects empty status', () => {
    expect(() => PaymentStatus.create('')).toThrow('Payment status is required');
  });

  it('rejects unknown status', () => {
    expect(() => PaymentStatus.create('unknown')).toThrow('Invalid payment status');
  });

  it('enforces immutability', () => {
    const status = PaymentStatus.create('pending');
    expect(Object.isFrozen(status)).toBe(true);
    expect(() => {
      (status as any).raw = 'paid';
    }).toThrow();
  });

  it('exposes value through getter', () => {
    const status = PaymentStatus.create('pending');
    expect(status.value).toBe('pending');
  });
});

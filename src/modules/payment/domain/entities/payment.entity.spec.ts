import { Payment } from './payment.entity';

describe('Payment', () => {
  it('creates a payment with valid data', () => {
    const payment = Payment.create({
      cpf: '52998224725',
      description: 'Test payment',
      amount: 1500,
      paymentMethod: 'pix',
      status: 'pending'
    });

    expect(payment.id).toBeDefined();
    expect(payment.cpf.value).toBe('52998224725');
    expect(payment.description).toBe('Test payment');
    expect(payment.amount.value).toBe(1500);
    expect(payment.paymentMethod.value).toBe('pix');
    expect(payment.status.value).toBe('pending');
    expect(payment.createdAt).toBeInstanceOf(Date);
    expect(payment.updatedAt).toBeInstanceOf(Date);
  });

  it('enforces invariants on creation', () => {
    expect(() =>
      Payment.create({
        cpf: '52998224725',
        description: '',
        amount: 100,
        paymentMethod: 'pix',
        status: 'pending'
      })
    ).toThrow('Description is required');

    expect(() =>
      Payment.create({
        cpf: 'invalid',
        description: 'Test',
        amount: 100,
        paymentMethod: 'pix',
        status: 'pending'
      })
    ).toThrow('Invalid CPF');
  });

  it('enforces immutability', () => {
    const payment = Payment.create({
      cpf: '52998224725',
      description: 'Test payment',
      amount: 200,
      paymentMethod: 'pix',
      status: 'pending'
    });

    expect(Object.isFrozen(payment)).toBe(true);
    expect(() => {
      (payment as any).description = 'Changed';
    }).toThrow();
    expect(() => {
      (payment as any).status = 'paid';
    }).toThrow();
  });

  it('allows valid status change by creating a new instance', () => {
    const createdAt = new Date('2024-01-01T00:00:00.000Z');
    const payment = Payment.create({
      id: 'payment-id',
      cpf: '52998224725',
      description: 'Test payment',
      amount: 300,
      paymentMethod: 'pix',
      status: 'pending',
      createdAt
    });

    const updatedAt = new Date(createdAt.getTime() + 1000);
    const updatedPayment = Payment.create({
      id: payment.id,
      cpf: payment.cpf.value,
      description: payment.description,
      amount: payment.amount.value,
      paymentMethod: payment.paymentMethod.value,
      status: 'paid',
      preferenceId: payment.preferenceId,
      externalId: payment.externalId,
      createdAt: payment.createdAt,
      updatedAt
    });

    expect(updatedPayment.status.value).toBe('paid');
    expect(updatedPayment.updatedAt.getTime()).toBe(updatedAt.getTime());
    expect(updatedPayment.createdAt.getTime()).toBe(payment.createdAt.getTime());
    expect(updatedPayment.id).toBe(payment.id);
  });

  it('rejects invalid status change when creating a new instance', () => {
    const createdAt = new Date('2024-01-01T00:00:00.000Z');
    const payment = Payment.create({
      id: 'payment-id',
      cpf: '52998224725',
      description: 'Test payment',
      amount: 300,
      paymentMethod: 'pix',
      status: 'pending',
      createdAt
    });

    expect(() =>
      Payment.create({
        id: payment.id,
        cpf: payment.cpf.value,
        description: payment.description,
        amount: payment.amount.value,
        paymentMethod: payment.paymentMethod.value,
        status: 'invalid',
        preferenceId: payment.preferenceId,
        externalId: payment.externalId,
        createdAt: payment.createdAt
      })
    ).toThrow('Invalid payment status');
  });

  it('updates updatedAt when creating a new instance', () => {
    const createdAt = new Date('2024-01-01T00:00:00.000Z');
    const payment = Payment.create({
      id: 'payment-id',
      cpf: '52998224725',
      description: 'Test payment',
      amount: 300,
      paymentMethod: 'pix',
      status: 'pending',
      createdAt
    });

    const later = new Date(createdAt.getTime() + 5000);
    const updatedPayment = Payment.create({
      id: payment.id,
      cpf: payment.cpf.value,
      description: payment.description,
      amount: payment.amount.value,
      paymentMethod: payment.paymentMethod.value,
      status: payment.status.value,
      createdAt: payment.createdAt,
      updatedAt: later
    });

    expect(updatedPayment.updatedAt.getTime()).toBeGreaterThan(payment.updatedAt.getTime());
    expect(updatedPayment.updatedAt.getTime()).toBe(later.getTime());
  });
});

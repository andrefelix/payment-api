import { Cpf } from './cpf.vo';

describe('Cpf', () => {
  it('creates a valid cpf', () => {
    const cpf = Cpf.create('52998224725');
    expect(cpf.value).toBe('52998224725');
  });

  it('rejects invalid length', () => {
    expect(() => Cpf.create('123')).toThrow('Invalid CPF');
  });

  it('rejects repeated digits', () => {
    expect(() => Cpf.create('00000000000')).toThrow('Invalid CPF');
  });

  it('rejects invalid check digits', () => {
    expect(() => Cpf.create('52998224724')).toThrow('Invalid CPF');
  });

  it('enforces immutability', () => {
    const cpf = Cpf.create('52998224725');
    expect(Object.isFrozen(cpf)).toBe(true);
    expect(() => {
      (cpf as any).raw = '12345678901';
    }).toThrow();
  });

  it('exposes value through getter', () => {
    const cpf = Cpf.create('52998224725');
    expect(cpf.value).toBe('52998224725');
  });
});

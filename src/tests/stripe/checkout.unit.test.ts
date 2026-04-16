import { validatePlan } from '@/app/api/checkout/route';

test('validatePlan returns true for known plans', () => {
  expect(validatePlan('solo')).toBe(true);
  expect(validatePlan('salon')).toBe(true);
  expect(validatePlan('enterprise')).toBe(true);
});

test('validatePlan returns false for unknown plan', () => {
  expect(validatePlan('premium')).toBe(false);
});

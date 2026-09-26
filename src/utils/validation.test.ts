import { describe, expect, it } from 'vitest';
import { validateContactDetails, validateEventDetails } from './validation';

describe('Form Validation Engine (validation.ts)', () => {
  it('validates contact details format (name, email, Indian mobile phone)', () => {
    const invalid = validateContactDetails({
      fullName: 'A',
      email: 'not-an-email',
      phone: '12345',
    });
    expect(invalid.fullName).toBeDefined();
    expect(invalid.email).toBeDefined();
    expect(invalid.phone).toBeDefined();

    const valid = validateContactDetails({
      fullName: 'Priya Sharma',
      email: 'priya.sharma@company.in',
      phone: '+91 9876543210',
      organization: 'Acme Events',
    });
    expect(Object.keys(valid)).toHaveLength(0);
  });

  it('rejects unavailable or pre-booked event dates in Step 1 validation', () => {
    const errors = validateEventDetails(
      {
        eventDate: '2026-10-11',
        eventType: 'Wedding',
        eventCity: 'Mumbai',
        audienceSize: 300,
      },
      'artist-1',
      [{ start: '2026-10-10', end: '2026-10-12', label: 'Booked Show' }],
      []
    );
    expect(errors.eventDate).toContain('Booked Show');
  });
});

import { describe, expect, it } from 'vitest';
import {
  calculateDynamicPrice,
  getAudienceTierInfo,
  getDateTierInfo,
  OUTSTATION_TRAVEL_ALLOWANCE,
} from './pricing';

describe('Dynamic Price Calculation Engine (pricing.ts)', () => {
  it('identifies standard weekdays (Mon-Thu) with 1.0x multiplier', () => {
    // 2026-10-14 is a Wednesday
    const tierInfo = getDateTierInfo('2026-10-14');
    expect(tierInfo.tier).toBe('weekday');
    expect(tierInfo.multiplier).toBe(1.0);
  });

  it('identifies Friday and Sunday as weekend demand with 1.15x multiplier', () => {
    // 2026-10-16 is a Friday, 2026-10-18 is a Sunday
    expect(getDateTierInfo('2026-10-16').multiplier).toBe(1.15);
    expect(getDateTierInfo('2026-10-18').multiplier).toBe(1.15);
  });

  it('identifies Saturday as prime weekend night with 1.25x multiplier', () => {
    // 2026-10-17 is a Saturday
    const satInfo = getDateTierInfo('2026-10-17');
    expect(satInfo.tier).toBe('saturday-peak');
    expect(satInfo.multiplier).toBe(1.25);
  });

  it('identifies festive dates (e.g. Dec 31 NYE) with 1.35x peak multiplier', () => {
    const nyeInfo = getDateTierInfo('2026-12-31');
    expect(nyeInfo.tier).toBe('festive-peak');
    expect(nyeInfo.multiplier).toBe(1.35);
  });

  it('calculates exact base + weekday + private party price without surcharges', () => {
    const breakdown = calculateDynamicPrice({
      basePrice: 100000,
      dateStr: '2026-10-14', // Wednesday (1.0x)
      eventType: 'Private Party', // 1.0x
      audienceSize: 150, // <= 250 (0%)
      artistHomeCity: 'Mumbai',
      eventCity: 'Mumbai',
    });

    expect(breakdown.dateSurcharge).toBe(0);
    expect(breakdown.eventTypeAdjustment).toBe(0);
    expect(breakdown.audienceSurcharge).toBe(0);
    expect(breakdown.outstationTravelFee).toBe(0);
    expect(breakdown.subtotal).toBe(100000);
    expect(breakdown.platformAndGstFee).toBe(12000);
    expect(breakdown.totalPrice).toBe(112000);
  });

  it('applies Saturday peak (1.25x), Wedding (1.30x), large audience (+15%), and outstation travel fee', () => {
    const breakdown = calculateDynamicPrice({
      basePrice: 100000,
      dateStr: '2026-10-17', // Saturday (+25% = 25,000)
      eventType: 'Wedding', // +30% = 30,000
      audienceSize: 1000, // +15% = 15,000
      artistHomeCity: 'Mumbai',
      eventCity: 'Jaipur', // Outstation = +18,000
    });

    expect(breakdown.dateSurcharge).toBe(25000);
    expect(breakdown.eventTypeAdjustment).toBe(30000);
    expect(breakdown.audienceSurcharge).toBe(15000);
    expect(breakdown.isOutstation).toBe(true);
    expect(breakdown.outstationTravelFee).toBe(OUTSTATION_TRAVEL_ALLOWANCE);
    // Subtotal: 100,000 + 25,000 + 30,000 + 15,000 + 18,000 = 188,000
    expect(breakdown.subtotal).toBe(188000);
    // 12% GST & Platform Fee: 22,560
    expect(breakdown.platformAndGstFee).toBe(22560);
    expect(breakdown.totalPrice).toBe(210560);
  });

  it('applies youth campus discount (-10%) for College Fest events', () => {
    const breakdown = calculateDynamicPrice({
      basePrice: 80000,
      dateStr: '2026-10-14', // Wednesday (1.0x)
      eventType: 'College Fest', // 0.9x (-8,000)
      audienceSize: 200,
      artistHomeCity: 'Delhi NCR',
      eventCity: 'Delhi NCR',
    });

    expect(breakdown.eventTypeAdjustment).toBe(-8000);
    expect(breakdown.subtotal).toBe(72000);
  });

  it('scales audience tier rates accurately across thresholds', () => {
    expect(getAudienceTierInfo(100).rate).toBe(0);
    expect(getAudienceTierInfo(500).rate).toBe(0.08);
    expect(getAudienceTierInfo(1500).rate).toBe(0.15);
    expect(getAudienceTierInfo(3500).rate).toBe(0.25);
  });
});

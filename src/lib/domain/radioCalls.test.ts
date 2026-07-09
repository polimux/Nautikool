import { describe, expect, it } from 'vitest';
import { coreRadioCallCards, h323ElinaMobRadioSituation, srcTrainingNotes } from '$lib/content/radioCallCards';
import {
  buildRadioCallCard,
  getRadioCallPrefix,
  sortRadioCallCardsByUrgency,
  summarizeRadioCallDrills
} from './radioCalls';

describe('radio call cards', () => {
  it('uses recognised SRC urgency prefixes', () => {
    expect(getRadioCallPrefix('distress')).toBe('MAYDAY MAYDAY MAYDAY');
    expect(getRadioCallPrefix('urgency')).toBe('PAN-PAN PAN-PAN PAN-PAN');
    expect(getRadioCallPrefix('safety')).toBe('SECURITE SECURITE SECURITE');
  });

  it('builds a read-aloud MOB distress card with vessel identity and position prompt', () => {
    const card = buildRadioCallCard(h323ElinaMobRadioSituation);

    expect(card.urgency).toBe('distress');
    expect(card.channel).toContain('VHF channel 16');
    expect(card.readAloud[0]).toBe('MAYDAY MAYDAY MAYDAY');
    expect(card.readAloud.join(' ')).toContain('Elina / DH5891 / 211257390');
    expect(card.readAloud.join(' ')).toContain('MOB position');
    expect(card.skipperPrompts.join(' ')).toContain('visual contact');
  });

  it('sorts training cards so true distress and urgency are not buried by routine material', () => {
    const sorted = sortRadioCallCardsByUrgency(coreRadioCallCards);

    expect(sorted[0].urgency).toBe('distress');
    expect(sorted[1].urgency).toBe('urgency');
    expect(sorted.at(-1)?.urgency).toBe('safety');
  });

  it('keeps conservative SRC training limitations visible', () => {
    const allLimitations = coreRadioCallCards.flatMap((card) => card.limitations).join(' ');

    expect(allLimitations).toContain('not legal advice');
    expect(allLimitations).toContain('do not practise live emergency phrases on air');
    expect(srcTrainingNotes.join(' ')).toContain('not as a live transmission');
  });

  it('summarizes the H-323 Elina SRC drill pack for cockpit display', () => {
    const summary = summarizeRadioCallDrills(coreRadioCallCards, srcTrainingNotes);

    expect(summary.cardCount).toBe(3);
    expect(summary.distressCards).toBe(1);
    expect(summary.urgencyCards).toBe(1);
    expect(summary.safetyCards).toBe(1);
    expect(summary.highestUrgency).toBe('distress');
    expect(summary.firstReadAloudLine).toBe('MAYDAY MAYDAY MAYDAY');
    expect(summary.mustNotTransmitLiveEmergencyPractice).toBe(true);
  });
});

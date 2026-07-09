import { describe, expect, it } from 'vitest';
import { h323ElinaTurkuParnuDepartureBrief } from '$lib/content/departureBriefs';
import { h323ElinaTurkuParnuDepartureDashboard } from '$lib/content/departureDashboard';
import { buildDepartureSkipperBrief } from './departureBrief';

const baseBriefInput = {
  id: 'departure-brief:test',
  title: 'Test skipper brief',
  dashboard: h323ElinaTurkuParnuDepartureDashboard,
  generatedAtLabel: 'test static copy',
  routeFocus: ['Keep the first leg short and preserve bailout options.'],
  weatherCheckpoints: ['Compare wind, gust, wave and visibility forecasts before departure.'],
  crewAssignments: ['Skipper navigates; crew confirms lookout and log prompts.'],
  boatChecks: ['Confirm engine, fuel, bilge and safety blockers are closed.'],
  electronicsChecks: ['Confirm DSC position and AIS target path before relying on cockpit data.'],
  goNoGoQuestion: 'Would we still depart if the first bailout harbour became unavailable?',
  printNotes: ['Paper copy must be marked up after every forecast change.']
};

describe('departure skipper brief', () => {
  it('converts the dashboard into a printable multi-section skipper brief', () => {
    const brief = buildDepartureSkipperBrief(baseBriefInput);

    expect(brief.status).toBe(h323ElinaTurkuParnuDepartureDashboard.status);
    expect(brief.canDepart).toBe(false);
    expect(brief.sectionCount).toBeGreaterThanOrEqual(6);
    expect(brief.sections.map((section) => section.kind)).toContain('weather');
    expect(brief.sections.map((section) => section.kind)).toContain('electronics');
    expect(brief.printChecklist[0]).toContain('NO-GO');
  });

  it('keeps the first unresolved dashboard action visible for wet-hands use', () => {
    const brief = buildDepartureSkipperBrief(baseBriefInput);

    expect(brief.firstAction).toBe(h323ElinaTurkuParnuDepartureDashboard.nextActions[0]);
    expect(brief.readAloudLines[1]).toContain(brief.firstAction);
    expect(brief.sections[0].lines.join(' ')).toContain('Go/no-go question');
  });

  it('keeps static-copy and skipper-judgement limitations visible', () => {
    const brief = buildDepartureSkipperBrief(baseBriefInput);

    expect(brief.limitations.join(' ')).toContain('not live navigation');
    expect(brief.limitations.join(' ')).toContain('current forecast');
    expect(brief.readAloudLines[3]).toContain('live conditions differ');
  });

  it('publishes the H-323 Elina family-passage departure brief as product content', () => {
    expect(h323ElinaTurkuParnuDepartureBrief.vesselName).toBe('Elina');
    expect(h323ElinaTurkuParnuDepartureBrief.passageTitle).toContain('Turku to Pärnu');
    expect(h323ElinaTurkuParnuDepartureBrief.generatedAtLabel).toContain('26 July 2026');
    expect(h323ElinaTurkuParnuDepartureBrief.sections.find((section) => section.kind === 'crew')?.lines.join(' ')).toContain(
      'father'
    );
    expect(h323ElinaTurkuParnuDepartureBrief.sections.find((section) => section.kind === 'route')?.lines.join(' ')).toContain(
      '50 nautical miles'
    );
  });
});

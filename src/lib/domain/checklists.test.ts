import { describe, expect, it } from 'vitest';
import {
  completeChecklistRun,
  createChecklistRun,
  setChecklistItemStatus,
  summarizeChecklistRun
} from './checklists';
import type { ChecklistTemplate } from './types';

const template: ChecklistTemplate = {
  id: 'checklist-template:departure',
  title: 'Departure checklist',
  category: 'departure',
  vesselSpecific: true,
  safetyCritical: true,
  assumptions: [
    {
      id: 'assumption:forecast-reviewed',
      statement: 'The skipper has reviewed the current forecast before departure.',
      source: 'user',
      confidence: 'medium',
      safetyImpact: 'high'
    }
  ],
  contentVersion: '0.1.0',
  items: [
    {
      id: 'item:seacocks',
      text: 'Check seacocks and bilge.',
      required: true,
      warningIfSkipped: 'Skipping seacocks and bilge removes an important flooding check.'
    },
    {
      id: 'item:logbook',
      text: 'Write departure note in logbook.',
      required: false
    }
  ]
};

const startedAt = '2026-07-08T00:00:00.000Z';

function newRun() {
  return createChecklistRun(template, {
    id: 'checklist-run:test',
    vesselId: 'vessel:elina',
    startedAt
  });
}

describe('checklist domain logic', () => {
  it('creates a checklist run with all template items open', () => {
    const run = newRun();

    expect(run.templateId).toBe(template.id);
    expect(run.vesselId).toBe('vessel:elina');
    expect(run.itemStates).toEqual([
      { itemId: 'item:seacocks', status: 'open' },
      { itemId: 'item:logbook', status: 'open' }
    ]);
  });

  it('marks an item done without mutating the original run', () => {
    const run = newRun();
    const updated = setChecklistItemStatus(run, 'item:seacocks', 'done', {
      at: '2026-07-08T00:05:00.000Z'
    });

    expect(run.itemStates[0].status).toBe('open');
    expect(updated.itemStates[0]).toEqual({
      itemId: 'item:seacocks',
      status: 'done',
      completedAt: '2026-07-08T00:05:00.000Z',
      note: undefined
    });
    expect(updated.audit.version).toBe(run.audit.version + 1);
  });

  it('reports incomplete while any item is still open', () => {
    const run = setChecklistItemStatus(newRun(), 'item:seacocks', 'done', {
      at: '2026-07-08T00:05:00.000Z'
    });

    expect(summarizeChecklistRun(template, run)).toMatchObject({
      status: 'incomplete',
      openItems: 1,
      doneItems: 1
    });
  });

  it('treats skipped required items as complete with warnings, not clean complete', () => {
    const withRequiredSkipped = setChecklistItemStatus(newRun(), 'item:seacocks', 'skipped', {
      at: '2026-07-08T00:05:00.000Z',
      note: 'Could not access bilge hatch.'
    });
    const completeWithWarning = setChecklistItemStatus(
      withRequiredSkipped,
      'item:logbook',
      'done',
      { at: '2026-07-08T00:06:00.000Z' }
    );

    const summary = summarizeChecklistRun(template, completeWithWarning);

    expect(summary.status).toBe('complete-with-warnings');
    expect(summary.requiredSkippedItems).toBe(1);
    expect(summary.warnings).toContain(
      'Skipping seacocks and bilge removes an important flooding check.'
    );
  });

  it('completes a checklist only after all items are resolved', () => {
    const done = setChecklistItemStatus(newRun(), 'item:seacocks', 'done', {
      at: '2026-07-08T00:05:00.000Z'
    });
    const resolved = setChecklistItemStatus(done, 'item:logbook', 'not-applicable', {
      at: '2026-07-08T00:06:00.000Z'
    });

    expect(summarizeChecklistRun(template, resolved).status).toBe('complete');
    expect(completeChecklistRun(template, resolved, '2026-07-08T00:07:00.000Z').completedAt).toBe(
      '2026-07-08T00:07:00.000Z'
    );
  });

  it('rejects completion while items remain open', () => {
    expect(() => completeChecklistRun(template, newRun())).toThrow(
      'Cannot complete checklist while items are still open.'
    );
  });

  it('throws when updating an unknown checklist item', () => {
    expect(() => setChecklistItemStatus(newRun(), 'item:missing', 'done')).toThrow(
      'Checklist item not found: item:missing'
    );
  });
});

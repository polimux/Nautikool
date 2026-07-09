import { describe, expect, it } from 'vitest';
import {
  h323ElinaMaintenanceFindings,
  h323ElinaMaintenanceSummary,
  h323ElinaMaintenanceTasks
} from '$lib/content/maintenanceTasks';
import {
  assessMaintenanceTasks,
  inferMaintenanceStatus,
  summarizeMaintenanceReadiness,
  type MaintenanceTask
} from './maintenance';

describe('maintenance readiness', () => {
  it('infers overdue, due-soon, unknown and done status from dates and evidence gaps', () => {
    const baseTask: MaintenanceTask = {
      id: 'maintenance:test',
      vesselId: 'vessel:test',
      system: 'engine',
      title: 'Test task',
      whyItMatters: 'It keeps the test vessel honest.',
      severity: 'caution',
      skipperAction: 'Inspect and record.',
      evidence: ['Checked'],
      tags: ['test']
    };

    expect(inferMaintenanceStatus({ ...baseTask, dueAt: '2026-07-01' }, { asOf: '2026-07-09' })).toBe('overdue');
    expect(inferMaintenanceStatus({ ...baseTask, dueAt: '2026-07-18' }, { asOf: '2026-07-09' })).toBe('due-soon');
    expect(inferMaintenanceStatus({ ...baseTask, lastCompletedAt: '2026-07-01' }, { asOf: '2026-07-09' })).toBe('done');
    expect(inferMaintenanceStatus(baseTask, { asOf: '2026-07-09' })).toBe('unknown');
  });

  it('uses engine hours as another maintenance trigger', () => {
    const task: MaintenanceTask = {
      id: 'maintenance:test:hours',
      vesselId: 'vessel:test',
      system: 'engine',
      title: 'Engine-hours service',
      whyItMatters: 'Oil-service windows should not be hidden by calendar dates.',
      dueEngineHours: 500,
      currentEngineHours: 493,
      severity: 'caution',
      skipperAction: 'Plan the service before the next long motor leg.',
      evidence: ['Engine-hour meter read'],
      tags: ['engine-hours']
    };

    expect(inferMaintenanceStatus(task, { asOf: '2026-07-09' })).toBe('due-soon');
    expect(inferMaintenanceStatus({ ...task, currentEngineHours: 505 }, { asOf: '2026-07-09' })).toBe('overdue');
  });

  it('summarizes the H-323 Elina maintenance pack for a conservative pre-passage decision', () => {
    expect(h323ElinaMaintenanceTasks).toHaveLength(8);
    expect(h323ElinaMaintenanceSummary.taskCount).toBe(8);
    expect(h323ElinaMaintenanceSummary.canDepart).toBe(false);
    expect(h323ElinaMaintenanceSummary.blockerFindings).toBeGreaterThanOrEqual(3);
    expect(h323ElinaMaintenanceSummary.firstBlocker).toContain('Raw-water cooling flow');
    expect(h323ElinaMaintenanceSummary.systemsCovered).toContain('engine');
    expect(h323ElinaMaintenanceSummary.systemsCovered).toContain('safety');
  });

  it('keeps skipper actions visible for unknown safety and DSC readiness tasks', () => {
    const findings = h323ElinaMaintenanceFindings;

    expect(findings.map((finding) => finding.taskId)).toContain('maintenance:h323-elina:liferaft-service-date');
    expect(findings.map((finding) => finding.taskId)).toContain('maintenance:h323-elina:vhf-dsc-position');
    expect(findings.find((finding) => finding.taskId === 'maintenance:h323-elina:liferaft-service-date')?.skipperAction).toContain(
      'Record service date'
    );
    expect(findings.find((finding) => finding.taskId === 'maintenance:h323-elina:vhf-dsc-position')?.skipperAction).toContain(
      'Confirm Ray90 displays current position'
    );
  });

  it('does not create a false green when only caution and unknown items remain', () => {
    const reducedTasks = h323ElinaMaintenanceTasks.filter((task) => task.severity !== 'blocker');
    const summary = summarizeMaintenanceReadiness(reducedTasks, { asOf: '2026-07-26', dueSoonDays: 14 });
    const findings = assessMaintenanceTasks(reducedTasks, { asOf: '2026-07-26', dueSoonDays: 14 });

    expect(summary.canDepart).toBe(true);
    expect(summary.cautionFindings).toBeGreaterThan(0);
    expect(findings.some((finding) => finding.status === 'due-soon')).toBe(true);
    expect(summary.nextActions.join(' ')).toContain('brief');
  });
});

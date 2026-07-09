export type MaintenanceSystem =
  | 'engine'
  | 'fuel'
  | 'cooling'
  | 'electrical'
  | 'rig'
  | 'safety'
  | 'navigation'
  | 'documentation';

export type MaintenanceStatus = 'done' | 'due-soon' | 'overdue' | 'unknown';
export type MaintenanceSeverity = 'info' | 'caution' | 'blocker';

export interface MaintenanceTask {
  id: string;
  vesselId: string;
  system: MaintenanceSystem;
  title: string;
  whyItMatters: string;
  lastCompletedAt?: string;
  dueAt?: string;
  dueEngineHours?: number;
  currentEngineHours?: number;
  intervalEngineHours?: number;
  status?: MaintenanceStatus;
  severity: MaintenanceSeverity;
  skipperAction: string;
  evidence: string[];
  tags: string[];
}

export interface MaintenanceFinding {
  taskId: string;
  system: MaintenanceSystem;
  severity: MaintenanceSeverity;
  status: MaintenanceStatus;
  text: string;
  skipperAction: string;
}

export interface MaintenanceReadinessSummary {
  taskCount: number;
  overdueTasks: number;
  dueSoonTasks: number;
  unknownTasks: number;
  blockerFindings: number;
  cautionFindings: number;
  systemsCovered: MaintenanceSystem[];
  canDepart: boolean;
  firstBlocker?: string;
  nextActions: string[];
}

const dayMs = 24 * 60 * 60 * 1000;

function parseDate(date: string): number {
  return new Date(`${date}T00:00:00Z`).getTime();
}

export function inferMaintenanceStatus(
  task: MaintenanceTask,
  options: { asOf: string; dueSoonDays?: number } = { asOf: new Date().toISOString().slice(0, 10) }
): MaintenanceStatus {
  if (task.status) {
    return task.status;
  }

  const dueSoonDays = options.dueSoonDays ?? 14;
  const asOf = parseDate(options.asOf);

  if (task.dueAt) {
    const daysUntilDue = Math.ceil((parseDate(task.dueAt) - asOf) / dayMs);

    if (daysUntilDue < 0) {
      return 'overdue';
    }

    if (daysUntilDue <= dueSoonDays) {
      return 'due-soon';
    }
  }

  if (task.dueEngineHours !== undefined && task.currentEngineHours !== undefined) {
    const hoursRemaining = task.dueEngineHours - task.currentEngineHours;

    if (hoursRemaining < 0) {
      return 'overdue';
    }

    if (hoursRemaining <= 10) {
      return 'due-soon';
    }
  }

  if (!task.dueAt && task.dueEngineHours === undefined && task.lastCompletedAt === undefined) {
    return 'unknown';
  }

  return 'done';
}

export function assessMaintenanceTasks(
  tasks: MaintenanceTask[],
  options: { asOf: string; dueSoonDays?: number }
): MaintenanceFinding[] {
  return tasks
    .map((task) => ({ task, status: inferMaintenanceStatus(task, options) }))
    .filter(({ status }) => status !== 'done')
    .map(({ task, status }) => ({
      taskId: task.id,
      system: task.system,
      severity: task.severity,
      status,
      text: `${task.title} is ${status.replace('-', ' ')}: ${task.whyItMatters}`,
      skipperAction: task.skipperAction
    }));
}

export function summarizeMaintenanceReadiness(
  tasks: MaintenanceTask[],
  options: { asOf: string; dueSoonDays?: number }
): MaintenanceReadinessSummary {
  const findings = assessMaintenanceTasks(tasks, options);
  const systemsCovered = Array.from(new Set(tasks.map((task) => task.system))).sort();
  const blockerFindings = findings.filter((finding) => finding.severity === 'blocker').length;
  const cautionFindings = findings.filter((finding) => finding.severity === 'caution').length;

  return {
    taskCount: tasks.length,
    overdueTasks: findings.filter((finding) => finding.status === 'overdue').length,
    dueSoonTasks: findings.filter((finding) => finding.status === 'due-soon').length,
    unknownTasks: findings.filter((finding) => finding.status === 'unknown').length,
    blockerFindings,
    cautionFindings,
    systemsCovered,
    canDepart: blockerFindings === 0,
    firstBlocker: findings.find((finding) => finding.severity === 'blocker')?.text,
    nextActions: findings.map((finding) => finding.skipperAction)
  };
}

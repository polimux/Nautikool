import type {
  ChecklistItemState,
  ChecklistItemStatus,
  ChecklistRun,
  ChecklistRunSummary,
  ChecklistTemplate,
  IsoDateTime
} from './types';

const nowIso = (): IsoDateTime => new Date().toISOString();

export function createChecklistRun(
  template: ChecklistTemplate,
  input: {
    id: string;
    vesselId: string;
    passageId?: string;
    startedAt?: IsoDateTime;
  }
): ChecklistRun {
  const createdAt = input.startedAt ?? nowIso();

  return {
    id: input.id,
    templateId: template.id,
    vesselId: input.vesselId,
    passageId: input.passageId,
    startedAt: createdAt,
    itemStates: template.items.map((item) => ({
      itemId: item.id,
      status: 'open'
    })),
    audit: {
      createdAt,
      updatedAt: createdAt,
      version: 1
    }
  };
}

export function setChecklistItemStatus(
  run: ChecklistRun,
  itemId: string,
  status: ChecklistItemStatus,
  options: {
    at?: IsoDateTime;
    note?: string;
  } = {}
): ChecklistRun {
  const updatedAt = options.at ?? nowIso();
  let itemFound = false;

  const itemStates = run.itemStates.map((itemState): ChecklistItemState => {
    if (itemState.itemId !== itemId) {
      return itemState;
    }

    itemFound = true;

    return {
      itemId,
      status,
      completedAt: status === 'done' || status === 'skipped' || status === 'not-applicable' ? updatedAt : undefined,
      note: options.note
    };
  });

  if (!itemFound) {
    throw new Error(`Checklist item not found: ${itemId}`);
  }

  return {
    ...run,
    itemStates,
    completedAt: undefined,
    audit: {
      ...run.audit,
      updatedAt,
      version: run.audit.version + 1
    }
  };
}

export function summarizeChecklistRun(
  template: ChecklistTemplate,
  run: ChecklistRun
): ChecklistRunSummary {
  const templateItemsById = new Map(template.items.map((item) => [item.id, item]));
  const warnings: string[] = [];
  const blockers: string[] = [];
  let openItems = 0;
  let doneItems = 0;
  let skippedItems = 0;
  let notApplicableItems = 0;
  let requiredOpenItems = 0;
  let requiredSkippedItems = 0;

  for (const itemState of run.itemStates) {
    const templateItem = templateItemsById.get(itemState.itemId);

    if (!templateItem) {
      warnings.push(`Checklist run contains an item that is not in the template: ${itemState.itemId}`);
      continue;
    }

    if (itemState.status === 'open') {
      openItems += 1;

      if (templateItem.required) {
        requiredOpenItems += 1;
        blockers.push(`Required checklist item is still open: ${templateItem.text}`);
      }
    }

    if (itemState.status === 'done') {
      doneItems += 1;
    }

    if (itemState.status === 'skipped') {
      skippedItems += 1;

      if (templateItem.required) {
        requiredSkippedItems += 1;
        warnings.push(
          templateItem.warningIfSkipped ?? `Required checklist item was skipped: ${templateItem.text}`
        );
      }
    }

    if (itemState.status === 'not-applicable') {
      notApplicableItems += 1;
    }
  }

  const resolvedItems = doneItems + skippedItems + notApplicableItems;
  const completionPercent =
    template.items.length === 0 ? 100 : Math.round((resolvedItems / template.items.length) * 100);
  const canComplete = openItems === 0;
  const status =
    !canComplete
      ? 'incomplete'
      : requiredSkippedItems > 0 || warnings.length > 0
        ? 'complete-with-warnings'
        : 'complete';

  return {
    status,
    totalItems: template.items.length,
    openItems,
    doneItems,
    skippedItems,
    notApplicableItems,
    requiredOpenItems,
    requiredSkippedItems,
    completionPercent,
    canComplete,
    warnings,
    blockers
  };
}

export function completeChecklistRun(
  template: ChecklistTemplate,
  run: ChecklistRun,
  at: IsoDateTime = nowIso()
): ChecklistRun {
  const summary = summarizeChecklistRun(template, run);

  if (!summary.canComplete) {
    throw new Error('Cannot complete checklist while items are still open.');
  }

  return {
    ...run,
    completedAt: at,
    audit: {
      ...run.audit,
      updatedAt: at,
      version: run.audit.version + 1
    }
  };
}
import { describe, expect, it } from 'vitest';
import {
  coreChecklistTemplates,
  departureReadinessTemplate,
  enginePreStartTemplate,
  getChecklistTemplateById,
  listChecklistTemplatesByCategory
} from './checklistTemplates';

describe('starter checklist template content', () => {
  it('contains product-relevant departure and engine starter templates', () => {
    expect(coreChecklistTemplates.map((template) => template.id)).toEqual([
      'checklist-template:departure-readiness-baltic-coastal',
      'checklist-template:engine-pre-start-diesel-inboard'
    ]);
  });

  it('keeps every starter template safety critical and assumption-backed', () => {
    for (const template of coreChecklistTemplates) {
      expect(template.safetyCritical).toBe(true);
      expect(template.assumptions.length).toBeGreaterThan(0);
      expect(template.items.length).toBeGreaterThan(0);
      expect(template.items.every((item) => item.warningIfSkipped)).toBe(true);
    }
  });

  it('lists departure templates by category', () => {
    expect(listChecklistTemplatesByCategory('departure')).toEqual([departureReadinessTemplate]);
  });

  it('finds templates by stable content identifier', () => {
    expect(getChecklistTemplateById(enginePreStartTemplate.id)).toBe(enginePreStartTemplate);
    expect(getChecklistTemplateById('checklist-template:missing')).toBeUndefined();
  });
});

import { describe, expect, it } from 'vitest';
import {
  coreChecklistTemplates,
  departureReadinessTemplate,
  enginePreStartTemplate,
  getChecklistTemplateById,
  listChecklistTemplatesByCategory,
  nightArrivalTemplate
} from './checklistTemplates';

describe('starter checklist template content', () => {
  it('contains product-relevant departure, engine and night-arrival starter templates', () => {
    expect(coreChecklistTemplates.map((template) => template.id)).toEqual([
      'checklist-template:departure-readiness-baltic-coastal',
      'checklist-template:engine-pre-start-diesel-inboard',
      'checklist-template:night-arrival-baltic-guest-harbour'
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

  it('lists templates by category', () => {
    expect(listChecklistTemplatesByCategory('departure')).toEqual([departureReadinessTemplate]);
    expect(listChecklistTemplatesByCategory('engine')).toEqual([enginePreStartTemplate]);
    expect(listChecklistTemplatesByCategory('night')).toEqual([nightArrivalTemplate]);
  });

  it('finds templates by stable content identifier', () => {
    expect(getChecklistTemplateById(enginePreStartTemplate.id)).toBe(enginePreStartTemplate);
    expect(getChecklistTemplateById(nightArrivalTemplate.id)).toBe(nightArrivalTemplate);
    expect(getChecklistTemplateById('checklist-template:missing')).toBeUndefined();
  });

  it('models night arrival as conservative pilotage content', () => {
    expect(nightArrivalTemplate.items.map((item) => item.id)).toContain('item:night-arrival-bailout-or-hold');
    expect(nightArrivalTemplate.assumptions.every((assumption) => assumption.safetyImpact === 'high')).toBe(true);
    expect(nightArrivalTemplate.items.every((item) => item.required)).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import {
  coreChecklistTemplates,
  departureReadinessTemplate,
  enginePreStartTemplate,
  getChecklistTemplateById,
  heavyWeatherDepartureTemplate,
  listChecklistTemplatesByCategory,
  mobImmediateActionsTemplate,
  nightArrivalTemplate
} from './checklistTemplates';

describe('starter checklist template content', () => {
  it('contains product-relevant departure, engine, night, heavy-weather and emergency templates', () => {
    expect(coreChecklistTemplates.map((template) => template.id)).toEqual([
      'checklist-template:departure-readiness-baltic-coastal',
      'checklist-template:engine-pre-start-diesel-inboard',
      'checklist-template:night-arrival-baltic-guest-harbour',
      'checklist-template:heavy-weather-departure-defensive',
      'checklist-template:mob-immediate-actions-underway'
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
    expect(listChecklistTemplatesByCategory('heavy-weather')).toEqual([heavyWeatherDepartureTemplate]);
    expect(listChecklistTemplatesByCategory('emergency')).toEqual([mobImmediateActionsTemplate]);
  });

  it('finds templates by stable content identifier', () => {
    expect(getChecklistTemplateById(enginePreStartTemplate.id)).toBe(enginePreStartTemplate);
    expect(getChecklistTemplateById(nightArrivalTemplate.id)).toBe(nightArrivalTemplate);
    expect(getChecklistTemplateById(heavyWeatherDepartureTemplate.id)).toBe(heavyWeatherDepartureTemplate);
    expect(getChecklistTemplateById(mobImmediateActionsTemplate.id)).toBe(mobImmediateActionsTemplate);
    expect(getChecklistTemplateById('checklist-template:missing')).toBeUndefined();
  });

  it('models night arrival as conservative pilotage content', () => {
    expect(nightArrivalTemplate.items.map((item) => item.id)).toContain('item:night-arrival-bailout-or-hold');
    expect(nightArrivalTemplate.assumptions.every((assumption) => assumption.safetyImpact === 'high')).toBe(true);
    expect(nightArrivalTemplate.items.every((item) => item.required)).toBe(true);
  });

  it('models heavy-weather departure as a conservative go/no-go workflow', () => {
    expect(heavyWeatherDepartureTemplate.items.map((item) => item.id)).toContain('item:heavy-weather-no-go-thresholds');
    expect(heavyWeatherDepartureTemplate.items.map((item) => item.id)).toContain('item:heavy-weather-turn-back-point');
    expect(heavyWeatherDepartureTemplate.assumptions.every((assumption) => assumption.safetyImpact === 'high')).toBe(true);
  });

  it('models MOB as immediate emergency action content', () => {
    expect(mobImmediateActionsTemplate.category).toBe('emergency');
    expect(mobImmediateActionsTemplate.items[0].id).toBe('item:mob-shout-point-throw');
    expect(mobImmediateActionsTemplate.items.map((item) => item.id)).toContain('item:mob-distress-call-decision');
    expect(mobImmediateActionsTemplate.items.every((item) => item.required)).toBe(true);
  });
});
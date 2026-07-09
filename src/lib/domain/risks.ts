import type {
  RiskAssessment,
  RiskAssessmentInput,
  RiskLevel,
  RiskRuleFinding,
  RiskRuleSeverity
} from './types';
import { summarizePassagePlan } from './passages';
import { missingCriticalEquipment } from './vessels';

function levelRank(level: RiskLevel): number {
  return { green: 0, yellow: 1, red: 2 }[level];
}

function maxRiskLevel(levels: RiskLevel[]): RiskLevel {
  return levels.reduce<RiskLevel>((highest, level) => (levelRank(level) > levelRank(highest) ? level : highest), 'green');
}

function finding(
  id: string,
  severity: RiskRuleSeverity,
  level: RiskLevel,
  text: string,
  recommendation: string
): RiskRuleFinding {
  return { id, severity, level, text, recommendation };
}

function hasLikelyNightOrOvernightLeg(input: RiskAssessmentInput): boolean {
  return input.passage.legs.some((leg) => !leg.daylightPreferred);
}

export function assessPassageRisk(input: RiskAssessmentInput): RiskAssessment {
  const passageSummary = summarizePassagePlan(input.passage);
  const missingCritical = missingCriticalEquipment(input.vessel);
  const findings: RiskRuleFinding[] = [];
  const likelyNightOrOvernightLeg = hasLikelyNightOrOvernightLeg(input);

  if (input.weather.forecastAgeHours === undefined) {
    findings.push(
      finding(
        'risk:weather-forecast-age-unknown',
        'caution',
        'yellow',
        'Forecast age is unknown.',
        'Refresh and timestamp the forecast before making a departure decision.'
      )
    );
  } else if (input.weather.forecastAgeHours > 12) {
    findings.push(
      finding(
        'risk:weather-forecast-stale',
        'no-go',
        'red',
        `Forecast is ${input.weather.forecastAgeHours} hours old.`,
        'Do not depart on stale weather for a coastal or open-water leg.'
      )
    );
  }

  if (input.weather.sustainedWindKn === undefined || input.weather.gustKn === undefined) {
    findings.push(
      finding(
        'risk:wind-data-missing',
        'caution',
        'yellow',
        'Sustained wind or gust data is missing.',
        'Treat the risk as at least yellow until wind and gusts are checked for every leg.'
      )
    );
  } else {
    if (input.weather.sustainedWindKn >= 20 || input.weather.gustKn >= 25) {
      findings.push(
        finding(
          'risk:baltic-wind-no-go',
          'no-go',
          'red',
          `Baltic small-yacht limit exceeded: ${input.weather.sustainedWindKn} kn sustained, ${input.weather.gustKn} kn gusts.`,
          'Postpone departure or choose a sheltered harbour day.'
        )
      );
    } else if (input.weather.sustainedWindKn >= 15 || input.weather.gustKn >= 20) {
      findings.push(
        finding(
          'risk:baltic-wind-caution',
          'caution',
          'yellow',
          `Wind is in the caution band: ${input.weather.sustainedWindKn} kn sustained, ${input.weather.gustKn} kn gusts.`,
          'Shorten the leg, reef early, define bailout harbours and brief crew before departure.'
        )
      );
    }
  }

  if (input.weather.visibilityNm !== undefined) {
    if (input.weather.visibilityNm < 2) {
      findings.push(
        finding(
          'risk:restricted-visibility-no-go',
          'no-go',
          'red',
          `Visibility is restricted to ${input.weather.visibilityNm} nautical miles.`,
          'Do not depart a family coastal or open-water leg in restricted visibility; wait for a clearer window.'
        )
      );
    } else if (input.weather.visibilityNm < 5) {
      findings.push(
        finding(
          'risk:restricted-visibility-caution',
          'caution',
          'yellow',
          `Visibility is limited to ${input.weather.visibilityNm} nautical miles.`,
          'Brief radar/AIS limitations, sound signals, lookout duties and harbour-entry alternatives before departure.'
        )
      );
    }
  } else if (likelyNightOrOvernightLeg || passageSummary.openWaterLegs > 0) {
    findings.push(
      finding(
        'risk:visibility-data-missing',
        'caution',
        'yellow',
        'Visibility data is missing for an exposed or likely overnight passage.',
        'Check visibility, fog risk and local warnings before committing to the leg.'
      )
    );
  }

  if (input.weather.thunderstormRisk === 'moderate' || input.weather.thunderstormRisk === 'high') {
    findings.push(
      finding(
        'risk:thunderstorm-risk',
        input.weather.thunderstormRisk === 'high' ? 'no-go' : 'caution',
        input.weather.thunderstormRisk === 'high' ? 'red' : 'yellow',
        `Thunderstorm risk is ${input.weather.thunderstormRisk}.`,
        'Avoid exposed legs unless the thunderstorm window is clearly outside the passage plan.'
      )
    );
  } else if (input.weather.thunderstormRisk === 'unknown') {
    findings.push(
      finding(
        'risk:thunderstorm-risk-unknown',
        'caution',
        'yellow',
        'Thunderstorm risk is unknown.',
        'Check convective forecast, radar trend and local warnings before departure.'
      )
    );
  }

  if (input.weather.waveHeightMeters !== undefined && input.weather.waveHeightMeters >= 1.5) {
    findings.push(
      finding(
        'risk:wave-height-caution',
        input.weather.waveHeightMeters >= 2 ? 'no-go' : 'caution',
        input.weather.waveHeightMeters >= 2 ? 'red' : 'yellow',
        `Planned sea state includes ${input.weather.waveHeightMeters} m waves.`,
        'Reassess comfort, seasickness, bailout options and whether the leg should be delayed.'
      )
    );
  }

  if (passageSummary.openWaterLegs > 0) {
    findings.push(
      finding(
        'risk:open-water-leg-present',
        'caution',
        'yellow',
        `Passage contains ${passageSummary.openWaterLegs} open-water leg(s).`,
        'Require a fresh forecast, watch plan, charged devices, VHF/DSC readiness and explicit bailout logic.'
      )
    );
  }

  if (passageSummary.highSeverityHazards > 0) {
    findings.push(
      finding(
        'risk:high-severity-route-hazards',
        'caution',
        'yellow',
        `Passage contains ${passageSummary.highSeverityHazards} high-severity hazard(s).`,
        'Review hazards leg by leg and avoid compressing decisions into a single all-day go decision.'
      )
    );
  }

  if (likelyNightOrOvernightLeg && input.crew.hasNightExperience === false) {
    findings.push(
      finding(
        'risk:night-leg-without-night-experience',
        'caution',
        'yellow',
        'The passage includes a likely night or overnight leg, but night experience is not recorded for the skipper/crew setup.',
        'Use a daylight alternative, add experienced crew or run a dedicated night-approach briefing and watch plan.'
      )
    );
  } else if (likelyNightOrOvernightLeg && input.crew.hasNightExperience === undefined) {
    findings.push(
      finding(
        'risk:night-experience-unknown',
        'caution',
        'yellow',
        'The passage includes a likely night or overnight leg, but night experience is unknown.',
        'Record crew night experience and define watch, lighting, lookout and harbour-entry discipline before departure.'
      )
    );
  }

  if (input.crew.crewCount < 2 && passageSummary.openWaterLegs > 0) {
    findings.push(
      finding(
        'risk:singlehanded-open-water',
        'no-go',
        'red',
        'Open-water leg is planned with fewer than two crew recorded.',
        'Add crew, split the route, or wait for conditions that make the leg unnecessary.'
      )
    );
  }

  if (input.crew.minorsOnBoard && input.crew.minorsOnBoard > 0 && passageSummary.totalPlannedHours > 10) {
    findings.push(
      finding(
        'risk:family-crew-long-day',
        'caution',
        'yellow',
        `Family crew passage has ${passageSummary.totalPlannedHours} planned hours across the route.`,
        'Treat each leg as a fresh decision and keep day legs near the agreed family workload limit.'
      )
    );
  }

  if (input.crew.fatigueLevel === 'high' || input.crew.fatigueLevel === 'unknown') {
    findings.push(
      finding(
        'risk:crew-fatigue',
        input.crew.fatigueLevel === 'high' ? 'no-go' : 'caution',
        input.crew.fatigueLevel === 'high' ? 'red' : 'yellow',
        `Crew fatigue is ${input.crew.fatigueLevel}.`,
        'Use a shorter leg, delay departure or add a rest day before committing to exposed navigation.'
      )
    );
  }

  if (missingCritical.length > 0) {
    findings.push(
      finding(
        'risk:vessel-critical-equipment-missing',
        'no-go',
        'red',
        `${missingCritical.length} critical vessel equipment item(s) are not marked as installed.`,
        'Resolve critical equipment blockers before using this passage as a go decision.'
      )
    );
  }

  const level = maxRiskLevel(findings.map((item) => item.level));

  return {
    id: input.id,
    title: input.title,
    level,
    canDepart: level !== 'red',
    findings,
    assumptions: input.assumptions,
    summary: {
      noGoFindings: findings.filter((item) => item.severity === 'no-go').length,
      cautionFindings: findings.filter((item) => item.severity === 'caution').length,
      infoFindings: findings.filter((item) => item.severity === 'info').length,
      highSeverityHazards: passageSummary.highSeverityHazards,
      openWaterLegs: passageSummary.openWaterLegs,
      missingCriticalEquipment: missingCritical.length
    }
  };
}

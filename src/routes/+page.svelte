<script lang="ts">
  import { coreAisWatchBriefDrills } from '$lib/content/aisWatchBriefs';
  import { coreAisWatchDebriefs } from '$lib/content/aisDebriefs';
  import { coreChecklistTemplates, departureReadinessTemplate } from '$lib/content/checklistTemplates';
  import { h323ElinaTurkuParnuDepartureDashboard } from '$lib/content/departureDashboard';
  import {
    h323ElinaMaintenanceFindings,
    h323ElinaMaintenanceSummary,
    h323ElinaMaintenanceTasks
  } from '$lib/content/maintenanceTasks';
  import {
    h323ElinaNmeaNetworkProfile,
    h323ElinaNmeaNetworkSummary
  } from '$lib/content/nmeaNetworks';
  import { turkuToParnuFamilyPassagePlan } from '$lib/content/passagePlans';
  import { coreRadioCallCards, srcTrainingNotes } from '$lib/content/radioCallCards';
  import {
    h323ElinaRadioLogExamples,
    h323ElinaRadioLogFollowUps,
    h323ElinaRadioLogSummary
  } from '$lib/content/radioLogs';
  import { coreRiskAssessments } from '$lib/content/riskAssessments';
  import {
    h323ElinaSpareFindings,
    h323ElinaSpareRequirements,
    h323ElinaSpareSummary
  } from '$lib/content/spareRequirements';
  import {
    h323ElinaTripLogDebrief,
    h323ElinaTripLogSummary,
    h323ElinaTurkuParnuTripLog
  } from '$lib/content/tripLogs';
  import { h323ElinaVesselProfile } from '$lib/content/vesselProfiles';
  import { createChecklistRun, summarizeChecklistRun } from '$lib/domain/checklists';
  import { summarizePassagePlan } from '$lib/domain/passages';
  import { summarizeRadioCallDrills } from '$lib/domain/radioCalls';
  import { getVesselEquipmentByCategory, summarizeVesselProfile } from '$lib/domain/vessels';

  const run = createChecklistRun(departureReadinessTemplate, {
    id: 'checklist-run:demo',
    vesselId: 'vessel:demo'
  });
  const summary = summarizeChecklistRun(departureReadinessTemplate, run);
  const starterDepartureDashboard = h323ElinaTurkuParnuDepartureDashboard;
  const starterTemplates = coreChecklistTemplates;
  const starterPassagePlan = turkuToParnuFamilyPassagePlan;
  const starterPassageSummary = summarizePassagePlan(starterPassagePlan);
  const starterVessel = h323ElinaVesselProfile;
  const starterVesselSummary = summarizeVesselProfile(starterVessel);
  const starterRiskAssessments = coreRiskAssessments;
  const starterNmeaNetwork = h323ElinaNmeaNetworkProfile;
  const starterNmeaSummary = h323ElinaNmeaNetworkSummary;
  const starterAisDrills = coreAisWatchBriefDrills;
  const starterAisDebriefs = coreAisWatchDebriefs;
  const starterRadioCallCards = coreRadioCallCards;
  const starterRadioCallSummary = summarizeRadioCallDrills(starterRadioCallCards, srcTrainingNotes);
  const starterRadioLogEntries = h323ElinaRadioLogExamples;
  const starterRadioLogSummary = h323ElinaRadioLogSummary;
  const starterRadioLogFollowUps = h323ElinaRadioLogFollowUps;
  const starterMaintenanceTasks = h323ElinaMaintenanceTasks;
  const starterMaintenanceFindings = h323ElinaMaintenanceFindings;
  const starterMaintenanceSummary = h323ElinaMaintenanceSummary;
  const starterSpareRequirements = h323ElinaSpareRequirements;
  const starterSpareFindings = h323ElinaSpareFindings;
  const starterSpareSummary = h323ElinaSpareSummary;
  const starterTripLogEntries = h323ElinaTurkuParnuTripLog;
  const starterTripLogSummary = h323ElinaTripLogSummary;
  const starterTripLogDebrief = h323ElinaTripLogDebrief;
  const navigationEquipment = getVesselEquipmentByCategory(starterVessel, 'navigation');
  const safetyEquipment = getVesselEquipmentByCategory(starterVessel, 'safety');
</script>

<svelte:head>
  <title>Nautikool</title>
  <meta
    name="description"
    content="A local-first sailing companion for preparation, learning, checklists and conservative skipper decisions."
  />
</svelte:head>

<main>
  <p class="eyebrow">Local-first sailing companion</p>
  <h1>Nautikool</h1>
  <p class="lead">
    Nautikool is being built as a calm co-skipper for coastal sailors: practical, conservative,
    offline-capable and explicit about assumptions.
  </p>

  <section aria-labelledby="dashboard-title">
    <h2 id="dashboard-title">Pre-departure dashboard</h2>
    <p>
      The dashboard aggregates the preparation slices into one conservative cockpit summary for the H-323 Elina
      Turku to Pärnu family passage: checklist state, risk cards, maintenance, spares, NMEA/AIS and last-trip follow-ups.
    </p>
    <dl>
      <div><dt>Status</dt><dd>{starterDepartureDashboard.status}</dd></div>
      <div><dt>Readiness score</dt><dd>{starterDepartureDashboard.readinessScore}</dd></div>
      <div><dt>Blockers / cautions</dt><dd>{starterDepartureDashboard.blockerCount} / {starterDepartureDashboard.cautionCount}</dd></div>
      <div><dt>Headline</dt><dd>{starterDepartureDashboard.headline}</dd></div>
    </dl>
    <div class="risk-card-list">
      {#each starterDepartureDashboard.findings.slice(0, 6) as finding}
        <article>
          <p class="template-category">{finding.source} · {finding.severity}</p>
          <h3>{finding.title}</h3>
          <p>{finding.skipperAction}</p>
        </article>
      {/each}
    </div>
    <p class="small-note">Read-aloud: {starterDepartureDashboard.readAloudBrief.join(' ')}</p>
  </section>

  <section aria-labelledby="slice-title">
    <h2 id="slice-title">First product content slice</h2>
    <p>
      The app includes typed checklist content for Baltic coastal departure, diesel inboard pre-start,
      night arrival, heavy-weather departure and MOB immediate actions. The checklist engine reports
      progress, blockers and warned completion so the UI can distinguish preparation from actual readiness.
    </p>
    <dl>
      <div><dt>Demo checklist</dt><dd>{departureReadinessTemplate.title}</dd></div>
      <div><dt>Current status</dt><dd>{summary.status}</dd></div>
      <div><dt>Completion</dt><dd>{summary.completionPercent}%</dd></div>
      <div><dt>Open items</dt><dd>{summary.openItems}</dd></div>
      <div><dt>Required blockers</dt><dd>{summary.requiredOpenItems}</dd></div>
      <div><dt>Required skipped items</dt><dd>{summary.requiredSkippedItems}</dd></div>
    </dl>
  </section>

  <section aria-labelledby="vessel-title">
    <h2 id="vessel-title">Starter vessel profile</h2>
    <p>
      The first vessel profile models the H-323 Elina as a Baltic coastal cruiser with explicit dimensions,
      engine checks, electronics, safety gear and assumptions about still-unverified capacities.
    </p>
    <dl>
      <div><dt>Vessel</dt><dd>{starterVessel.name} · {starterVessel.type}</dd></div>
      <div>
        <dt>Dimensions</dt>
        <dd>{starterVessel.dimensions.loaMeters} m LOA · {starterVessel.dimensions.beamMeters} m beam · {starterVessel.dimensions.draftMeters} m draft</dd>
      </div>
      <div><dt>Engine</dt><dd>{starterVessel.engine?.make} {starterVessel.engine?.model}</dd></div>
      <div><dt>Installed equipment</dt><dd>{starterVesselSummary.installedEquipmentCount} items recorded</dd></div>
      <div><dt>Readiness blockers</dt><dd>{starterVesselSummary.blockerCount}</dd></div>
      <div><dt>Assumptions</dt><dd>{starterVesselSummary.assumptionCount}</dd></div>
    </dl>
    <div class="equipment-list">
      <article>
        <p class="template-category">Navigation</p>
        <ul>{#each navigationEquipment as item}<li>{item.name}</li>{/each}</ul>
      </article>
      <article>
        <p class="template-category">Safety</p>
        <ul>{#each safetyEquipment as item}<li>{item.name}</li>{/each}</ul>
      </article>
    </div>
  </section>

  <section aria-labelledby="maintenance-title">
    <h2 id="maintenance-title">H-323 maintenance readiness</h2>
    <p>
      The new maintenance slice turns engine, cooling, fuel, safety, electrical, rig and DSC checks into
      a conservative pre-passage readiness card for Elina before the Turku to Pärnu family passage.
    </p>
    <dl>
      <div><dt>Tracked tasks</dt><dd>{starterMaintenanceSummary.taskCount}</dd></div>
      <div><dt>Overdue / due soon</dt><dd>{starterMaintenanceSummary.overdueTasks} / {starterMaintenanceSummary.dueSoonTasks}</dd></div>
      <div><dt>Unknown tasks</dt><dd>{starterMaintenanceSummary.unknownTasks}</dd></div>
      <div><dt>Blockers / cautions</dt><dd>{starterMaintenanceSummary.blockerFindings} / {starterMaintenanceSummary.cautionFindings}</dd></div>
      <div><dt>Departure posture</dt><dd>{starterMaintenanceSummary.canDepart ? 'maintenance caution' : 'maintenance no-go until blockers are closed'}</dd></div>
    </dl>
    <div class="network-list">
      {#each starterMaintenanceFindings.slice(0, 4) as finding}
        <article>
          <p class="template-category">{finding.system} · {finding.severity} · {finding.status}</p>
          <h3>{finding.text}</h3>
          <p>{finding.skipperAction}</p>
        </article>
      {/each}
    </div>
    <p class="small-note">
      Coverage: {starterMaintenanceSummary.systemsCovered.join(', ')} · task evidence examples include
      {starterMaintenanceTasks[0].evidence.slice(0, 2).join(', ')}.
    </p>
  </section>

  <section aria-labelledby="spares-title">
    <h2 id="spares-title">H-323 spare readiness</h2>
    <p>
      The spares slice turns maintenance risks into a locker-level preparation plan: what must be onboard,
      where it should live and which failure mode it supports before a Baltic family passage.
    </p>
    <dl>
      <div><dt>Tracked spares</dt><dd>{starterSpareSummary.spareCount}</dd></div>
      <div><dt>Critical spares</dt><dd>{starterSpareSummary.criticalSpares}</dd></div>
      <div><dt>Missing / unknown critical</dt><dd>{starterSpareSummary.missingCriticalSpares} / {starterSpareSummary.unknownCriticalSpares}</dd></div>
      <div><dt>Blockers / cautions</dt><dd>{starterSpareSummary.blockerFindings} / {starterSpareSummary.cautionFindings}</dd></div>
      <div><dt>Departure posture</dt><dd>{starterSpareSummary.canDepart ? 'spares ready' : 'spares no-go until blockers are closed'}</dd></div>
    </dl>
    <div class="network-list">
      {#each starterSpareFindings.slice(0, 4) as finding}
        <article>
          <p class="template-category">{finding.system} · {finding.severity} · {finding.status}</p>
          <h3>{finding.text}</h3>
          <p>{finding.skipperAction}</p>
        </article>
      {/each}
    </div>
    <p class="small-note">
      Example kit: {starterSpareRequirements.slice(0, 3).map((spare) => spare.title).join(', ')}.
    </p>
  </section>

  <section aria-labelledby="nmea-title">
    <h2 id="nmea-title">Starter NMEA/AIS network profile</h2>
    <p>
      The network slice documents how Elina should share GNSS, AIS, plotter and VHF/DSC data, with skipper-facing
      readiness findings for backbone termination, network power and AIS/position data paths.
    </p>
    <dl>
      <div><dt>Network</dt><dd>{starterNmeaNetwork.title}</dd></div>
      <div><dt>Installed devices</dt><dd>{starterNmeaSummary.installedDevices}</dd></div>
      <div><dt>Transmit / receive PGNs</dt><dd>{starterNmeaSummary.transmitPgns} / {starterNmeaSummary.receivePgns}</dd></div>
      <div><dt>Warnings / blockers</dt><dd>{starterNmeaSummary.warnings} / {starterNmeaSummary.blockers}</dd></div>
    </dl>
  </section>

  <section aria-labelledby="ais-title">
    <h2 id="ais-title">AIS traffic drills and watch briefs</h2>
    <p>
      Static AIS drills turn target snapshots into skipper-facing findings, prioritised watch actions and compact handover briefs.
    </p>
    <div class="network-list">
      {#each starterAisDrills as drill}
        <article>
          <p class="template-category">{drill.scenario.area}</p>
          <h3>{drill.scenario.title}</h3>
          <p>{drill.brief.headline}</p>
          <ul>{#each drill.brief.watchHandover.slice(0, 4) as line}<li>{line}</li>{/each}</ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="ais-debrief-title">
    <h2 id="ais-debrief-title">AIS scenario debriefs</h2>
    <p>Watch briefs feed a debrief layer: lessons, data-quality prompts, repeat drills and conservative safety notes.</p>
    <div class="network-list">
      {#each starterAisDebriefs as drill}
        <article>
          <p class="template-category">{drill.debrief.area}</p>
          <h3>{drill.debrief.title}</h3>
          <p>{drill.debrief.headline}</p>
          <ul>{#each drill.debrief.lessons.slice(0, 2) as lesson}<li>{lesson.title}: {lesson.skipperQuestion}</li>{/each}</ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="radio-title">
    <h2 id="radio-title">SRC/VHF radio call cards</h2>
    <p>
      Radio call cards turn emergency and traffic scenarios into short read-aloud scripts for SRC preparation.
    </p>
    <dl>
      <div><dt>Training cards</dt><dd>{starterRadioCallSummary.cardCount}</dd></div>
      <div><dt>Distress / urgency / safety</dt><dd>{starterRadioCallSummary.distressCards} / {starterRadioCallSummary.urgencyCards} / {starterRadioCallSummary.safetyCards}</dd></div>
      <div><dt>Highest priority first line</dt><dd>{starterRadioCallSummary.firstReadAloudLine}</dd></div>
    </dl>
    <div class="network-list">
      {#each starterRadioCallCards as card}
        <article>
          <p class="template-category">{card.urgency} · {card.area}</p>
          <h3>{card.title}</h3>
          <p>{card.channel}</p>
          <ul>{#each card.readAloud.slice(0, 4) as line}<li>{line}</li>{/each}</ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="radio-log-title">
    <h2 id="radio-log-title">Radio log and handover entries</h2>
    <p>
      Radio call cards feed a small log layer so training, traffic decisions and safety broadcasts leave a cockpit handover trail.
    </p>
    <dl>
      <div><dt>Log entries</dt><dd>{starterRadioLogSummary.entryCount}</dd></div>
      <div><dt>Sent / decision / training</dt><dd>{starterRadioLogSummary.sentCalls} / {starterRadioLogSummary.decisionNotes} / {starterRadioLogSummary.trainingNotes}</dd></div>
      <div><dt>Follow-ups</dt><dd>{starterRadioLogFollowUps.length}</dd></div>
      <div><dt>Read-back prompt</dt><dd>{starterRadioLogSummary.readBackChecklist[3]}</dd></div>
    </dl>
    <div class="network-list">
      {#each starterRadioLogEntries as entry}
        <article>
          <p class="template-category">{entry.entryType} · {entry.urgency}</p>
          <h3>{entry.situationTitle}</h3>
          <p>{entry.summary}</p>
          <ul>
            <li>{entry.actionTaken}</li>
            {#if entry.followUpAt}<li>Follow-up: {entry.followUpAt}</li>{/if}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="trip-log-title">
    <h2 id="trip-log-title">Trip logbook and debrief</h2>
    <p>
      The trip-log slice converts a sailed leg into learning data: passage-plan deviations, weather reality,
      engine hours, maintenance follow-ups and family-crew lessons for the next departure decision.
    </p>
    <dl>
      <div><dt>Log entries</dt><dd>{starterTripLogSummary.entryCount}</dd></div>
      <div><dt>Incidents / maintenance / lessons</dt><dd>{starterTripLogSummary.incidentCount} / {starterTripLogSummary.maintenanceNotes} / {starterTripLogSummary.lessonCount}</dd></div>
      <div><dt>Cautions / blockers</dt><dd>{starterTripLogSummary.cautionEntries} / {starterTripLogSummary.blockerEntries}</dd></div>
      <div><dt>Engine-hour delta</dt><dd>{starterTripLogSummary.engineHoursDelta} h</dd></div>
      <div><dt>First review item</dt><dd>{starterTripLogSummary.firstCriticalEntry}</dd></div>
    </dl>
    <div class="network-list">
      {#each starterTripLogEntries as entry}
        <article>
          <p class="template-category">{entry.entryType} · {entry.severity}</p>
          <h3>{entry.title}</h3>
          <p>{entry.summary}</p>
          {#if entry.followUp}<p><strong>Follow-up:</strong> {entry.followUp}</p>{/if}
        </article>
      {/each}
    </div>
    <p class="small-note">Debrief: {starterTripLogDebrief.join(' ')}</p>
  </section>

  <section aria-labelledby="risk-title">
    <h2 id="risk-title">Starter risk cards</h2>
    <p>
      The risk engine converts vessel, route, weather and crew inputs into conservative traffic-light assessments.
    </p>
    <div class="risk-card-list">
      {#each starterRiskAssessments as assessment}
        <article>
          <p class="template-category">{assessment.level} · {assessment.canDepart ? 'caution' : 'no-go'}</p>
          <h3>{assessment.title}</h3>
          <ul>{#each assessment.findings.slice(0, 3) as finding}<li>{finding.text}</li>{/each}</ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="templates-title">
    <h2 id="templates-title">Starter checklist templates</h2>
    <div class="template-list">
      {#each starterTemplates as template}
        <article>
          <p class="template-category">{template.category}</p>
          <h3>{template.title}</h3>
          <p>{template.items.length} items · content {template.contentVersion}</p>
          <ul>{#each template.items.slice(0, 3) as item}<li>{item.text}</li>{/each}</ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="passage-title">
    <h2 id="passage-title">Starter passage plan</h2>
    <p>A first typed passage plan sample covers the family H-323 route from Turku to Pärnu.</p>
    <dl>
      <div><dt>Plan</dt><dd>{starterPassagePlan.title}</dd></div>
      <div><dt>Total distance</dt><dd>{starterPassageSummary.totalDistanceNm} nm</dd></div>
      <div><dt>Planned time</dt><dd>{starterPassageSummary.totalPlannedHours} h at leg speeds</dd></div>
      <div><dt>High-severity hazards</dt><dd>{starterPassageSummary.highSeverityHazards}</dd></div>
    </dl>
    <div class="leg-list">
      {#each starterPassagePlan.legs as leg}
        <article>
          <p class="template-category">{leg.exposure}</p>
          <h3>{leg.from} → {leg.to}</h3>
          <p>{leg.distanceNm} nm · {leg.plannedSpeedKn} kn planning speed</p>
          <ul>
            <li>{leg.hazards[0].text}</li>
            <li>Bailout: {leg.bailoutHarbours.map((harbour) => harbour.name).join(', ')}</li>
          </ul>
        </article>
      {/each}
    </div>
  </section>
</main>

<style>
  :global(body) {
    margin: 0;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f6f4ee;
    color: #172026;
  }

  main {
    max-width: 900px;
    margin: 0 auto;
    padding: 4rem 1.5rem;
  }

  .eyebrow {
    margin: 0 0 0.75rem;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  h1 {
    margin: 0;
    font-size: clamp(3rem, 8vw, 5.5rem);
    line-height: 0.95;
  }

  .lead {
    max-width: 42rem;
    font-size: 1.25rem;
    line-height: 1.6;
  }

  section {
    margin-top: 3rem;
    padding: 1.5rem;
    border: 1px solid #d8d2c4;
    border-radius: 1rem;
    background: #fffdf8;
  }

  dl {
    display: grid;
    gap: 1rem;
    margin: 1.5rem 0 0;
  }

  dt {
    font-weight: 700;
  }

  dd {
    margin: 0.25rem 0 0;
  }

  .template-list,
  .leg-list,
  .equipment-list,
  .risk-card-list,
  .network-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
  }

  .leg-list,
  .equipment-list,
  .risk-card-list,
  .network-list {
    margin-top: 1rem;
  }

  article {
    padding: 1rem;
    border: 1px solid #e4dece;
    border-radius: 0.75rem;
    background: #ffffff;
  }

  h3 {
    margin: 0.25rem 0 0.5rem;
  }

  ul {
    padding-left: 1.25rem;
  }

  .template-category,
  .small-note {
    margin: 0;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #5b6470;
  }
</style>

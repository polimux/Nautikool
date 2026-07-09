<script lang="ts">
  import { coreAisWatchBriefDrills } from '$lib/content/aisWatchBriefs';
  import { coreAisWatchDebriefs } from '$lib/content/aisDebriefs';
  import { coreChecklistTemplates, departureReadinessTemplate } from '$lib/content/checklistTemplates';
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

  <section aria-labelledby="slice-title">
    <h2 id="slice-title">First product content slice</h2>
    <p>
      The app now includes typed starter checklist content for Baltic coastal departure, diesel
      inboard pre-start, night arrival, heavy-weather departure and MOB immediate actions. The
      checklist engine reports progress, blockers and warned completion so the UI can distinguish
      preparation from actual readiness.
    </p>
    <dl>
      <div>
        <dt>Demo checklist</dt>
        <dd>{departureReadinessTemplate.title}</dd>
      </div>
      <div>
        <dt>Current status</dt>
        <dd>{summary.status}</dd>
      </div>
      <div>
        <dt>Completion</dt>
        <dd>{summary.completionPercent}%</dd>
      </div>
      <div>
        <dt>Open items</dt>
        <dd>{summary.openItems}</dd>
      </div>
      <div>
        <dt>Required blockers</dt>
        <dd>{summary.requiredOpenItems}</dd>
      </div>
      <div>
        <dt>Required skipped items</dt>
        <dd>{summary.requiredSkippedItems}</dd>
      </div>
    </dl>
  </section>

  <section aria-labelledby="vessel-title">
    <h2 id="vessel-title">Starter vessel profile</h2>
    <p>
      The first vessel profile models the H-323 Elina as a Baltic coastal cruiser with explicit
      dimensions, engine checks, electronics, safety gear and assumptions about still-unverified
      capacities.
    </p>
    <dl>
      <div>
        <dt>Vessel</dt>
        <dd>{starterVessel.name} · {starterVessel.type}</dd>
      </div>
      <div>
        <dt>Dimensions</dt>
        <dd>
          {starterVessel.dimensions.loaMeters} m LOA · {starterVessel.dimensions.beamMeters} m beam ·
          {starterVessel.dimensions.draftMeters} m draft
        </dd>
      </div>
      <div>
        <dt>Engine</dt>
        <dd>{starterVessel.engine?.make} {starterVessel.engine?.model}</dd>
      </div>
      <div>
        <dt>Installed equipment</dt>
        <dd>{starterVesselSummary.installedEquipmentCount} items recorded</dd>
      </div>
      <div>
        <dt>Readiness blockers</dt>
        <dd>{starterVesselSummary.blockerCount}</dd>
      </div>
      <div>
        <dt>Assumptions</dt>
        <dd>{starterVesselSummary.assumptionCount}</dd>
      </div>
    </dl>
    <div class="equipment-list">
      <article>
        <p class="template-category">Navigation</p>
        <ul>
          {#each navigationEquipment as item}
            <li>{item.name}</li>
          {/each}
        </ul>
      </article>
      <article>
        <p class="template-category">Safety</p>
        <ul>
          {#each safetyEquipment as item}
            <li>{item.name}</li>
          {/each}
        </ul>
      </article>
    </div>
  </section>

  <section aria-labelledby="nmea-title">
    <h2 id="nmea-title">Starter NMEA/AIS network profile</h2>
    <p>
      The new network slice documents how Elina should share GNSS, AIS, plotter and VHF/DSC data,
      with skipper-facing readiness findings for backbone termination, network power and AIS/position
      data paths.
    </p>
    <dl>
      <div>
        <dt>Network</dt>
        <dd>{starterNmeaNetwork.title}</dd>
      </div>
      <div>
        <dt>Installed devices</dt>
        <dd>{starterNmeaSummary.installedDevices}</dd>
      </div>
      <div>
        <dt>Transmit / receive PGNs</dt>
        <dd>{starterNmeaSummary.transmitPgns} / {starterNmeaSummary.receivePgns}</dd>
      </div>
      <div>
        <dt>Warnings / blockers</dt>
        <dd>{starterNmeaSummary.warnings} / {starterNmeaSummary.blockers}</dd>
      </div>
    </dl>
    <div class="network-list">
      {#each starterNmeaNetwork.devices as device}
        <article>
          <p class="template-category">{device.role}</p>
          <h3>{device.name}</h3>
          <p>{device.protocols.join(', ')} · {device.pgns.length} PGN capabilities</p>
          <ul>
            {#each device.pgns.slice(0, 2) as capability}
              <li>{capability.label}: {capability.userValue}</li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="ais-title">
    <h2 id="ais-title">AIS traffic drills and watch briefs</h2>
    <p>
      Static AIS drills now turn target snapshots into skipper-facing findings, prioritised watch
      actions and compact handover briefs. The product is starting to answer: who needs to look where,
      when does the skipper take the watch, and what should be read aloud before the next decision?
    </p>
    <div class="network-list">
      {#each starterAisDrills as drill}
        <article>
          <p class="template-category">{drill.scenario.area}</p>
          <h3>{drill.scenario.title}</h3>
          <p>{drill.brief.headline}</p>
          <dl>
            <div>
              <dt>Targets</dt>
              <dd>{drill.summary.targetCount}</dd>
            </div>
            <div>
              <dt>Close / stale</dt>
              <dd>{drill.summary.closeTargets} / {drill.summary.staleTargets}</dd>
            </div>
            <div>
              <dt>Immediate / soon</dt>
              <dd>{drill.brief.immediateActions.length} / {drill.brief.soonActions.length}</dd>
            </div>
          </dl>
          <ul>
            {#each drill.brief.watchHandover.slice(0, 4) as line}
              <li>{line}</li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="ais-debrief-title">
    <h2 id="ais-debrief-title">AIS scenario debriefs</h2>
    <p>
      Watch briefs now feed a debrief layer for scenario training: what required skipper ownership,
      what overloaded the handover, which AIS symbols needed distrust, and what drill should be repeated.
    </p>
    <div class="network-list">
      {#each starterAisDebriefs as drill}
        <article>
          <p class="template-category">{drill.debrief.area}</p>
          <h3>{drill.debrief.title}</h3>
          <p>{drill.debrief.headline}</p>
          <dl>
            <div>
              <dt>Lessons</dt>
              <dd>{drill.debrief.lessons.length}</dd>
            </div>
            <div>
              <dt>Positive signals</dt>
              <dd>{drill.debrief.positiveSignals.length}</dd>
            </div>
          </dl>
          <ul>
            {#each drill.debrief.lessons.slice(0, 2) as lesson}
              <li>{lesson.title}: {lesson.skipperQuestion}</li>
            {/each}
          </ul>
          <p>{drill.debrief.followUpDrill}</p>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="radio-title">
    <h2 id="radio-title">SRC/VHF radio call cards</h2>
    <p>
      Radio call cards now turn emergency and traffic scenarios into short read-aloud scripts for
      SRC preparation. They are intentionally conservative: use them for offline training, and only
      transmit distress or urgency wording when the real situation justifies it.
    </p>
    <dl>
      <div>
        <dt>Training cards</dt>
        <dd>{starterRadioCallSummary.cardCount}</dd>
      </div>
      <div>
        <dt>Distress / urgency / safety</dt>
        <dd>
          {starterRadioCallSummary.distressCards} / {starterRadioCallSummary.urgencyCards} /
          {starterRadioCallSummary.safetyCards}
        </dd>
      </div>
      <div>
        <dt>Highest priority first line</dt>
        <dd>{starterRadioCallSummary.firstReadAloudLine}</dd>
      </div>
    </dl>
    <div class="network-list">
      {#each starterRadioCallCards as card}
        <article>
          <p class="template-category">{card.urgency} · {card.area}</p>
          <h3>{card.title}</h3>
          <p>{card.channel}</p>
          <ul>
            {#each card.readAloud.slice(0, 4) as line}
              <li>{line}</li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="radio-log-title">
    <h2 id="radio-log-title">Radio log and handover entries</h2>
    <p>
      Radio call cards now feed a small log layer so training, traffic decisions and safety broadcasts
      can leave a cockpit handover trail: what was said, where the boat was, what action followed and
      what still needs follow-up.
    </p>
    <dl>
      <div>
        <dt>Log entries</dt>
        <dd>{starterRadioLogSummary.entryCount}</dd>
      </div>
      <div>
        <dt>Sent / decision / training</dt>
        <dd>
          {starterRadioLogSummary.sentCalls} / {starterRadioLogSummary.decisionNotes} /
          {starterRadioLogSummary.trainingNotes}
        </dd>
      </div>
      <div>
        <dt>Follow-ups</dt>
        <dd>{starterRadioLogFollowUps.length}</dd>
      </div>
      <div>
        <dt>Read-back prompt</dt>
        <dd>{starterRadioLogSummary.readBackChecklist[3]}</dd>
      </div>
    </dl>
    <div class="network-list">
      {#each starterRadioLogEntries as entry}
        <article>
          <p class="template-category">{entry.entryType} · {entry.urgency}</p>
          <h3>{entry.situationTitle}</h3>
          <p>{entry.summary}</p>
          <ul>
            <li>{entry.actionTaken}</li>
            {#if entry.followUpAt}
              <li>Follow-up: {entry.followUpAt}</li>
            {/if}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="risk-title">
    <h2 id="risk-title">Starter risk cards</h2>
    <p>
      The risk engine now converts vessel, route, weather and crew inputs into conservative
      traffic-light assessments, including dedicated night-leg and visibility cautions for the
      Turku to Pärnu H-323 family passage.
    </p>
    <div class="risk-card-list">
      {#each starterRiskAssessments as assessment}
        <article>
          <p class="template-category">{assessment.level} · {assessment.canDepart ? 'caution' : 'no-go'}</p>
          <h3>{assessment.title}</h3>
          <dl>
            <div>
              <dt>No-go findings</dt>
              <dd>{assessment.summary.noGoFindings}</dd>
            </div>
            <div>
              <dt>Caution findings</dt>
              <dd>{assessment.summary.cautionFindings}</dd>
            </div>
            <div>
              <dt>Open-water legs</dt>
              <dd>{assessment.summary.openWaterLegs}</dd>
            </div>
          </dl>
          <ul>
            {#each assessment.findings.slice(0, 3) as finding}
              <li>{finding.text}</li>
            {/each}
          </ul>
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
          <ul>
            {#each template.items.slice(0, 3) as item}
              <li>{item.text}</li>
            {/each}
          </ul>
        </article>
      {/each}
    </div>
  </section>

  <section aria-labelledby="passage-title">
    <h2 id="passage-title">Starter passage plan</h2>
    <p>
      A first typed passage plan sample covers the family H-323 route from Turku to Pärnu with
      realistic leg distances, hazards, bailout harbours and crew notes.
    </p>
    <dl>
      <div>
        <dt>Plan</dt>
        <dd>{starterPassagePlan.title}</dd>
      </div>
      <div>
        <dt>Total distance</dt>
        <dd>{starterPassageSummary.totalDistanceNm} nm</dd>
      </div>
      <div>
        <dt>Planned time</dt>
        <dd>{starterPassageSummary.totalPlannedHours} h at leg speeds</dd>
      </div>
      <div>
        <dt>High-severity hazards</dt>
        <dd>{starterPassageSummary.highSeverityHazards}</dd>
      </div>
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

  .template-category {
    margin: 0;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #5b6470;
  }
</style>

<script lang="ts">
  import { coreChecklistTemplates, departureReadinessTemplate } from '$lib/content/checklistTemplates';
  import { turkuToParnuFamilyPassagePlan } from '$lib/content/passagePlans';
  import { turkuToParnuModerateRiskAssessment } from '$lib/content/riskAssessments';
  import { h323ElinaVesselProfile } from '$lib/content/vesselProfiles';
  import { createChecklistRun, summarizeChecklistRun } from '$lib/domain/checklists';
  import { summarizePassagePlan } from '$lib/domain/passages';
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
  const starterRiskAssessment = turkuToParnuModerateRiskAssessment;
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

  <section aria-labelledby="risk-title">
    <h2 id="risk-title">Starter risk card</h2>
    <p>
      The first risk engine slice converts vessel, route, weather and crew inputs into a conservative
      traffic-light assessment for the Turku to Pärnu H-323 family passage.
    </p>
    <dl>
      <div>
        <dt>Assessment</dt>
        <dd>{starterRiskAssessment.title}</dd>
      </div>
      <div>
        <dt>Risk level</dt>
        <dd>{starterRiskAssessment.level}</dd>
      </div>
      <div>
        <dt>Can depart</dt>
        <dd>{starterRiskAssessment.canDepart ? 'yes, with cautions' : 'no-go'}</dd>
      </div>
      <div>
        <dt>No-go findings</dt>
        <dd>{starterRiskAssessment.summary.noGoFindings}</dd>
      </div>
      <div>
        <dt>Caution findings</dt>
        <dd>{starterRiskAssessment.summary.cautionFindings}</dd>
      </div>
      <div>
        <dt>Open-water legs</dt>
        <dd>{starterRiskAssessment.summary.openWaterLegs}</dd>
      </div>
    </dl>
    <div class="risk-findings">
      {#each starterRiskAssessment.findings.slice(0, 4) as finding}
        <article>
          <p class="template-category">{finding.level} · {finding.severity}</p>
          <h3>{finding.text}</h3>
          <p>{finding.recommendation}</p>
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
  .risk-findings {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
  }

  .leg-list,
  .equipment-list,
  .risk-findings {
    margin-top: 1rem;
  }

  article {
    padding: 1rem;
    border: 1px solid #e4dece;
    border-radius: 0.75rem;
    background: #ffffff;
  }

  h3 {
    margin: 0.35rem 0 0.5rem;
  }

  ul {
    padding-left: 1.25rem;
  }

  li + li {
    margin-top: 0.5rem;
  }

  .template-category {
    margin: 0;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
</style>

<script lang="ts">
  import { coreChecklistTemplates, departureReadinessTemplate } from '$lib/content/checklistTemplates';
  import { turkuToParnuFamilyPassagePlan } from '$lib/content/passagePlans';
  import { createChecklistRun, summarizeChecklistRun } from '$lib/domain/checklists';
  import { summarizePassagePlan } from '$lib/domain/passages';

  const run = createChecklistRun(departureReadinessTemplate, {
    id: 'checklist-run:demo',
    vesselId: 'vessel:demo'
  });
  const summary = summarizeChecklistRun(departureReadinessTemplate, run);
  const starterTemplates = coreChecklistTemplates;
  const starterPassagePlan = turkuToParnuFamilyPassagePlan;
  const starterPassageSummary = summarizePassagePlan(starterPassagePlan);
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
      inboard pre-start and night arrival preparation. This keeps the project moving from
      documentation toward usable skipper workflows.
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
        <dt>Open items</dt>
        <dd>{summary.openItems}</dd>
      </div>
      <div>
        <dt>Required skipped items</dt>
        <dd>{summary.requiredSkippedItems}</dd>
      </div>
    </dl>
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
  .leg-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1rem;
  }

  .leg-list {
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

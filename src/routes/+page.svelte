<script lang="ts">
  import { createChecklistRun, summarizeChecklistRun } from '$lib/domain/checklists';
  import type { ChecklistTemplate } from '$lib/domain/types';

  const departureTemplate: ChecklistTemplate = {
    id: 'checklist-template:departure-basics',
    title: 'Departure basics',
    category: 'departure',
    vesselSpecific: false,
    safetyCritical: true,
    assumptions: [
      {
        id: 'assumption:weather-reviewed',
        statement: 'The skipper has reviewed a current forecast before departure.',
        source: 'user',
        confidence: 'medium',
        safetyImpact: 'high'
      }
    ],
    items: [
      {
        id: 'item:seacocks',
        text: 'Check seacocks and bilge.',
        required: true,
        warningIfSkipped: 'Skipping seacocks and bilge removes an important flooding check.'
      },
      {
        id: 'item:weather',
        text: 'Confirm weather, wind, gusts and bailout options.',
        required: true,
        warningIfSkipped: 'Skipping the weather review should prevent a clean departure status.'
      }
    ],
    contentVersion: '0.1.0'
  };

  const run = createChecklistRun(departureTemplate, {
    id: 'checklist-run:demo',
    vesselId: 'vessel:demo'
  });
  const summary = summarizeChecklistRun(departureTemplate, run);
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
    <h2 id="slice-title">First implementation slice</h2>
    <p>
      The app skeleton now includes pure TypeScript domain logic for checklist runs before storage,
      sync, charts or hardware integrations are added.
    </p>
    <dl>
      <div>
        <dt>Demo checklist</dt>
        <dd>{departureTemplate.title}</dd>
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
    max-width: 760px;
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
</style>

<script setup lang="ts">
</script>

<template>
  <div class="branding">
  <div class="row">
      <h1>Branding & Design Tokens</h1>
      <p>Diese View zeigt beispielhaft den Einsatz der Design Tokens für das gewählte Branding. Es kann bereits zwischen Light und Dark Mode gewechselt werden (Systemeinstellung).</p>
      <p>Unter Sessions kann man sehen, dass der statische Datensatz bereits eingelesen wird.</p>
      <p><strong>Diese View dient nur zu Test-Zwecken und wird im weiteren Verlauf des Projekts wieder entfernt.</strong></p>
    </div>
  
    <section class="card">
      <h2>Session-Karte</h2>
      <div class="row">
        <span class="badge">Läuft gerade</span>
        <time>10:30 – 11:15</time>
        <span class="secondary">Saal A</span>
      </div>
      <p>Primärer Text auf <code>surface</code>. <span class="secondary">Sekundärer Text für Meta-Infos.</span></p>
      <p>Ein <a href="#">Link zum Speaker-Profil</a> und <span class="highlight-text">orange hervorgehobener Text</span>.</p>
      <div class="row">
        <button class="button" type="button">Zum Programm hinzufügen</button>
        <input type="text" placeholder="Sessions durchsuchen" />
      </div>
    </section>
  
    <section class="raised">
      <p>Fläche <code>surface-raised</code> mit primärem Text.</p>
      <p class="secondary">Und sekundärem Text darauf.</p>
    </section>
  
    <section class="card">
      <h2>Status</h2>
      <p class="danger">⚠ Fehler: Programm konnte nicht gespeichert werden.</p>
      <p class="success">✓ Dein Programm ist offline gespeichert.</p>
    </section>
  </div>
</template>

<style scoped>
  .branding {
    display: grid;
    gap: var(--space-6);
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    align-items: center;
  }
 
  .card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    padding: var(--space-6);
    display: grid;
    gap: var(--space-3);
  }
 
  .raised {
    background: var(--color-surface-raised);
    border-radius: var(--radius-md);
    padding: var(--space-4);
  }
 
  .secondary { color: var(--color-text-secondary); }
  .highlight-text { color: var(--color-highlight-text); font-weight: var(--font-weight-bold); }
  .danger { color: var(--color-danger); }
  .success { color: var(--color-success); }
  a { color: var(--color-link); }
 
  .button {
    background: var(--color-accent);
    color: var(--color-on-accent);
    border: 0;
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-4);
    font: inherit;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
  }
 
  .button:focus-visible,
  input:focus-visible {
    outline: 3px solid var(--color-focus-ring);
    outline-offset: 2px;
  }

  .badge {
    background: var(--color-highlight);
    color: var(--color-on-highlight);
    border-radius: var(--radius-full);
    padding: var(--space-1) var(--space-3);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
  }
 
  input {
    font: inherit;
    color: var(--color-text-primary);
    background: var(--color-surface);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
  }
 
  time { font-family: var(--font-family-mono); font-size: var(--font-size-sm); }
</style>
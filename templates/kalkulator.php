<div x-data="doohCalculator()" class="dooh-wrap">

    <div class="dooh-header">
        <h2 class="dooh-title">Mediaspace DOOH Kalkulator</h2>
        <p class="dooh-subtitle">Ermittlung von Budget und Reichweite basierend auf Stelen-Verfuegbarkeit.</p>
    </div>

    <div x-show="view === 'calculator'" x-transition>
        <div class="dooh-admin-btn-wrap">
            <button @click="view = 'admin'" class="dooh-btn-secondary">&#9881; Administration</button>
        </div>
        <div class="dooh-card">
            <div class="dooh-field">
                <label class="dooh-label">EBL EINGABE</label>
                <input type="number" x-model="zielEbl" placeholder="Optional: Ziel EBL" class="dooh-input">
            </div>
            <div class="dooh-field">
                <label class="dooh-label">ANZAHL STELEN *</label>
                <input type="number" x-model="stelen" placeholder="z.B. 12" class="dooh-input">
            </div>
            <div class="dooh-info-box">
                Basis: <span x-text="settings.eblPerDayPerStele"></span> EBL/Tag &amp; 3.5 Kontakte/EBL
            </div>
            <div class="dooh-field">
                <label class="dooh-label">STARTDATUM *</label>
                <input type="date" x-model="startDate" class="dooh-input">
            </div>
            <div class="dooh-field" style="margin-bottom:24px;">
                <label class="dooh-label">ENDDATUM (OPTIONAL)</label>
                <input type="date" x-model="endDate" class="dooh-input">
            </div>
            <button @click="calculate()" class="dooh-btn-primary dooh-full">Berechnen</button>
        </div>

        <template x-if="result">
            <div class="dooh-card dooh-result-card">
                <div class="dooh-result-header">
                    <span class="dooh-result-title">Kalkulations-Ergebnis</span>
                    <button @click="exportPDF()" class="dooh-btn-pdf">&#8659; PDF Export</button>
                </div>
                <div class="dooh-result-row">
                    <span class="dooh-result-label">Gewaehltes Tier</span>
                    <span class="dooh-tier" x-text="result.tierName"></span>
                </div>
                <div class="dooh-result-row">
                    <span class="dooh-result-label">Rate / CPM</span>
                    <span>
                        <strong x-text="result.rateCent.toFixed(2) + ' ct'"></strong>
                        <span class="dooh-muted" x-text="'(' + formatCurrency(result.rateCent / 100 * 1000, 2) + ' EUR CPM)'"></span>
                    </span>
                </div>
                <div class="dooh-result-row">
                    <span class="dooh-result-label">Werktage (Mo-Sa)</span>
                    <strong x-text="result.days + ' Tage'"></strong>
                </div>
                <div class="dooh-stat-block">
                    <p class="dooh-stat-label">GESAMT EBL</p>
                    <p class="dooh-stat-value" x-text="formatNumber(result.finalEbl)"></p>
                </div>
                <div class="dooh-stat-block">
                    <p class="dooh-stat-label">BRUTTOKONTAKTE</p>
                    <p class="dooh-stat-value" x-text="formatNumber(result.contacts)"></p>
                </div>
                <div class="dooh-budget-block">
                    <p class="dooh-budget-label">ERFORD. BUDGET</p>
                    <p class="dooh-budget-value" x-text="formatCurrency(result.budget) + ' EUR'"></p>
                </div>
                <template x-if="result.isRealisierbar">
                    <div class="dooh-status-ok">
                        <span class="dooh-dot-green"></span>
                        <div>
                            <p class="dooh-status-title">Kampagne realisierbar</p>
                            <p class="dooh-status-text">Die gewuenschten <span x-text="formatNumber(result.finalEbl)"></span> EBL koennen im gewaehlten Zeitraum ausgespielt werden.</p>
                        </div>
                    </div>
                </template>
                <template x-if="result.recommendation">
                    <div class="dooh-status-info">
                        <span>&#8594;</span>
                        <div>
                            <p class="dooh-status-title">Empfehlung fuer vollstaendige Ausspielung:</p>
                            <p class="dooh-status-text">Benoetigte Werktage: <strong x-text="result.recommendation.days"></strong> | Empfohlenes Enddatum: <strong x-text="result.recommendation.endDate"></strong></p>
                        </div>
                    </div>
                </template>
            </div>
        </template>
    </div>

    <div x-show="view === 'admin'" style="display:none;" x-transition>
        <h3 class="dooh-admin-title">&#9881; Konfiguration</h3>
        <div class="dooh-card">
            <div class="dooh-field" style="margin-bottom:32px;">
                <label class="dooh-label">EBL PRO TAG PRO STELE</label>
                <input type="number" x-model="settings.eblPerDayPerStele" class="dooh-input">
            </div>
            <h4 class="dooh-section-title">Preis-Tiers</h4>
            <table class="dooh-table">
                <thead>
                    <tr><th>Name</th><th>Min. Budget (EUR)</th><th>Rate (Cent)</th></tr>
                </thead>
                <tbody>
                    <template x-for="(tier, index) in settings.tiers" :key="index">
                        <tr>
                            <td x-text="tier.name" class="dooh-tier-name"></td>
                            <td><input type="number" x-model.number="tier.minBudget" class="dooh-input-sm"></td>
                            <td><input type="number" step="0.1" x-model.number="tier.rateCent" class="dooh-input-sm"></td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="dooh-btn-row">
            <button @click="saveAdmin()" class="dooh-btn-primary dooh-flex-1">&#10003; Speichern &amp; Zurueck</button>
            <button @click="resetAdmin()" class="dooh-btn-secondary">&#8635; Zuruecksetzen</button>
        </div>
    </div>

</div>

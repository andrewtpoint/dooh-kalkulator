function doohCalculator() {
    return {
        view: 'calculator',
        settings: {
            eblPerDayPerStele: 350,
            tiers: [
                { name: 'XL', minBudget: 15000, rateCent: 0.5 },
                { name: 'L',  minBudget: 10000, rateCent: 0.6 },
                { name: 'M',  minBudget: 5000,  rateCent: 0.8 },
                { name: 'S',  minBudget: 0,     rateCent: 1.0 }
            ]
        },
        defaultSettings: null,
        zielEbl: '', stelen: '', startDate: '', endDate: '',
        result: null,

        init() { this.defaultSettings = JSON.parse(JSON.stringify(this.settings)); },

        calculate() {
            if (!this.stelen || !this.startDate) { alert('Bitte Anzahl Stelen und Startdatum angeben.'); return; }
            const stelenCount = parseInt(this.stelen);
            const start = new Date(this.startDate);
            let end = this.endDate ? new Date(this.endDate) : new Date(this.startDate);
            if (end < start) { alert('Enddatum darf nicht vor Startdatum liegen.'); return; }

            const days = this.calculateWorkdays(start, end);
            const maxEbl = stelenCount * days * this.settings.eblPerDayPerStele;
            let finalEbl = maxEbl, isCapped = false, isRealisierbar = true, recommendation = null;

            if (this.zielEbl && parseInt(this.zielEbl) > 0) {
                const target = parseInt(this.zielEbl);
                if (target <= maxEbl) { finalEbl = target; isCapped = true; }
                else {
                    finalEbl = maxEbl; isRealisierbar = false;
                    const neededDays = Math.ceil(target / (stelenCount * this.settings.eblPerDayPerStele));
                    const recEnd = this.addWorkdays(start, neededDays - 1);
                    recommendation = { days: neededDays, endDate: this.formatDate(recEnd) };
                }
            }

            const contacts = finalEbl * 3.5;

            // -------------------------------------------------------
            // TIER-LOGIK (FIXED)
            // Sortiere Tiers aufsteigend nach minBudget (S → XL).
            // Berechne fuer jeden Tier das Bruttobudget mit dessen Rate.
            // Waehle den hoechsten Tier, bei dem das berechnete Budget
            // >= minBudget des naechsthoeheren Tiers liegt – also den
            // guenstigsten qualifizierten Tier fuer den Kunden.
            // Konkret: iteriere von hoeherem zu niedrigerem Tier (XL→S),
            // nimm den ersten bei dem finalEbl * rateCent/100 >= minBudget.
            // -------------------------------------------------------
            const sortedDesc = [...this.settings.tiers].sort((a, b) => b.minBudget - a.minBudget);
            let appliedTier = sortedDesc[sortedDesc.length - 1]; // Fallback: guenstigster Tier (S)
            for (let tier of sortedDesc) {
                const budgetAtThisRate = finalEbl * (tier.rateCent / 100);
                if (budgetAtThisRate >= tier.minBudget) {
                    appliedTier = tier;
                    break;
                }
            }
            const finalBudget = finalEbl * (appliedTier.rateCent / 100);

            this.result = {
                days, finalEbl, isCapped, isRealisierbar, contacts,
                tierName: appliedTier.name,
                rateCent: appliedTier.rateCent,
                budget: finalBudget,
                recommendation
            };
        },

        calculateWorkdays(start, end) {
            let count = 0, cur = new Date(start);
            while (cur <= end) { if (cur.getDay() !== 0) count++; cur.setDate(cur.getDate() + 1); }
            return count;
        },

        addWorkdays(start, workdays) {
            let cur = new Date(start), added = 0;
            while (added < workdays) { cur.setDate(cur.getDate() + 1); if (cur.getDay() !== 0) added++; }
            return cur;
        },

        formatDate(date) {
            const d = ['So','Mo','Di','Mi','Do','Fr','Sa'];
            return d[date.getDay()] + '. ' + String(date.getDate()).padStart(2,'0') + '.' +
                   String(date.getMonth()+1).padStart(2,'0') + '.' + date.getFullYear();
        },

        exportPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(18); doc.setFont(undefined, 'bold');
            doc.text('Mediaspace DOOH Kalkulation', 105, 18, { align: 'center' });
            doc.setFontSize(9); doc.setFont(undefined, 'normal');
            doc.text('Erstellt: ' + new Date().toLocaleDateString('de-DE'), 105, 26, { align: 'center' });
            doc.setDrawColor(200,200,200); doc.line(20, 32, 190, 32);
            let y = 44;
            doc.setFontSize(12); doc.setFont(undefined, 'bold');
            doc.text('Kalkulations-Ergebnis', 20, y); y += 10;
            const rows = [
                ['Gewaehltes Tier', this.result.tierName],
                ['Rate / CPM', this.result.rateCent.toFixed(2) + ' ct (' + this.formatCurrency(this.result.rateCent/100*1000,2) + ' EUR CPM)'],
                ['Werktage (Mo-Sa)', this.result.days + ' Tage'],
                ['Gesamt EBL', this.formatNumber(this.result.finalEbl)],
                ['Bruttokontakte', this.formatNumber(this.result.contacts)],
            ];
            rows.forEach(([label, value]) => {
                doc.setFontSize(10); doc.setFont(undefined, 'bold'); doc.text(label + ':', 20, y);
                doc.setFont(undefined, 'normal'); doc.text(value, 100, y); y += 9;
            });
            y += 4;
            doc.setFillColor(37,99,235);
            doc.roundedRect(20, y, 170, 18, 3, 3, 'F');
            doc.setTextColor(255,255,255); doc.setFontSize(12); doc.setFont(undefined, 'bold');
            doc.text('Erforderliches Budget: ' + this.formatCurrency(this.result.budget) + ' EUR', 105, y+11, { align: 'center' });
            doc.setTextColor(0,0,0); y += 28;
            if (this.result.isRealisierbar) {
                doc.setFontSize(10); doc.setTextColor(0,128,0); doc.setFont(undefined, 'bold');
                doc.text('Kampagne realisierbar', 20, y); doc.setTextColor(0,0,0); y += 8;
                doc.setFont(undefined, 'normal'); doc.setFontSize(9);
                doc.text('Die gewuenschten ' + this.formatNumber(this.result.finalEbl) + ' EBL koennen ausgespielt werden.', 20, y); y += 12;
            }
            if (this.result.recommendation) {
                doc.setFontSize(10); doc.setFont(undefined, 'bold');
                doc.text('Empfehlung fuer vollstaendige Ausspielung:', 20, y); y += 8;
                doc.setFont(undefined, 'normal'); doc.setFontSize(9);
                doc.text('Benoetigte Werktage: ' + this.result.recommendation.days, 20, y); y += 7;
                doc.text('Empfohlenes Enddatum: ' + this.result.recommendation.endDate, 20, y);
            }
            doc.save('DOOH_Kalkulation_' + new Date().toLocaleDateString('de-DE').replace(/\./g,'-') + '.pdf');
        },

        saveAdmin() { this.view = 'calculator'; if(this.result) this.calculate(); },
        resetAdmin() { this.settings = JSON.parse(JSON.stringify(this.defaultSettings)); },
        formatNumber(num) { return new Intl.NumberFormat('de-DE').format(Math.round(num)); },
        formatCurrency(num, d=2) {
            return new Intl.NumberFormat('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d }).format(num);
        }
    }
}

// ATTENZIONE PROPRIETA' PRIVATA SFRISO PAOLO //

function calcolaStato() {
    const oraSistema = new Date();
    console.log("Ora di Sistema: " + oraSistema);
    const giorno = oraSistema.getDay(); // 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato
    const hh = oraSistema.getHours();
    const mm = oraSistema.getMinutes();

    const adesso = (hh * 60) + mm;

    const apriMattina = (7 * 60) + 30;     // 07:30
    const chiudiMattina = (12 * 60) + 50;  // 12:50
    const apriPome = 16 * 60;              // 16:00
    const chiudiPome = (19 * 60) + 30;     // 19:30

    const banner = document.getElementById('statusBanner');
    const testoStato = document.getElementById('statusText');
    const testoContoRovescio = document.getElementById('countdownText');

    // Reset delle classi del banner
    banner.className = 'status-banner';

    // Rimuove l'evidenziazione da tutti i giorni
    document.querySelectorAll('.day-block').forEach(riga => riga.classList.remove('today-highlight'));

    // Evidenzia il giorno corrente nella tabella
    const rigaOggi = document.getElementById(`day-${giorno}`);
    if (rigaOggi) rigaOggi.classList.add('today-highlight');

    // --- LOGICA DI CALCOLO ORARI ---

    // DOMENICA
    if (giorno === 0) {
        impostaNegozioChiuso(banner, testoStato, testoContoRovescio, "Ci vediamo domani alle 07:30");
    }
    // SABATO
    else if (giorno === 6) {
        if (adesso < apriMattina) {
            const attesa = apriMattina - adesso;
            impostaNegozioChiuso(banner, testoStato, testoContoRovescio, `Oggi apriamo tra ${formattaTempo(attesa)} (ore 07:30)`);
        }
        else if (adesso >= apriMattina && adesso < chiudiMattina) {
            impostaNegozioAperto(banner, testoStato, testoContoRovescio, chiudiMattina - adesso);
        }
        else {
            impostaNegozioChiuso(banner, testoStato, testoContoRovescio, "Pomeriggio chiuso. Ci vediamo Lunedì alle 07:30");
        }
    }
    // GIORNI INFRASETTIMANALI (Lunedì - Venerdì)
    else {
        if (adesso < apriMattina) {
            const attesa = apriMattina - adesso;
            impostaNegozioChiuso(banner, testoStato, testoContoRovescio, `Apriamo stamattina tra ${formattaTempo(attesa)}`);
        }
        else if (adesso >= apriMattina && adesso < chiudiMattina) {
            impostaNegozioAperto(banner, testoStato, testoContoRovescio, chiudiMattina - adesso);
        }
        else if (adesso >= chiudiMattina && adesso < apriPome) {
            const attesa = apriPome - adesso;
            impostaNegozioChiuso(banner, testoStato, testoContoRovescio, `Al pomeriggio apriamo tra ${formattaTempo(attesa)}`);
        }
        else if (adesso >= apriPome && adesso < chiudiPome) {
            impostaNegozioAperto(banner, testoStato, testoContoRovescio, chiudiPome - adesso);
        }
        else {
            impostaNegozioChiuso(banner, testoStato, testoContoRovescio, "Adesso siamo chiusi. A domani mattina alle 07:30!");
        }
    }
}

function impostaNegozioAperto(banner, titolo, sottoTitolo, minutiMancanti) {
    banner.classList.add('aperto');
    titolo.textContent = "● APERTO ORA";
    sottoTitolo.textContent = `Chiudiamo tra ${formattaTempo(minutiMancanti)}`;
}

function impostaNegozioChiuso(banner, titolo, sottoTitolo, testo) {
    banner.classList.add('chiuso');
    titolo.textContent = "○ CHIUSO ORA";
    sottoTitolo.textContent = testo;
}

function formattaTempo(minutiTotali) {
    const ore = Math.floor(minutiTotali / 60);
    const minuti = minutiTotali % 60;
    if (ore === 0) return `${minuti} min`;
    return `${ore} ore e ${minuti} min`;
}

// Avvio immediato e controllo ogni 15 secondi
calcolaStato();
setInterval(calcolaStato, 15000);
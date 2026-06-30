// ATTENZIONE PROPRIETA' PRIVATA SFRISO PAOLO //

// FUNZIONE DI SUPPORTO: Converte un numero da 1 a 99 in lettere in italiano
function numeroInLettere(num) {
    if (num === 0) return "zero";

    const unita = ["", "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove"];
    const speciali = ["dieci", "undici", "dodici", "tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove"];
    const decine = ["", "", "venti", "trenta", "quaranta", "cinquanta", "sessanta", "settanta", "ottanta", "novanta"];

    if (num < 10) return unita[num];
    if (num >= 10 && num < 20) return speciali[num - 10];

    if (num >= 20 && num < 100) {
        const d = Math.floor(num / 10); // Estrae la decina
        const u = num % 10;             // Estrae l'unità

        let testoDecina = decine[d];
        let testoUnita = unita[u];

        // Regola fonetica italiana: elisione con uno e otto (es: ventuno, trentotto)
        if (u === 1 || u === 8) {
            testoDecina = testoDecina.slice(0, -1);
        }

        return testoDecina + testoUnita;
    }
    return num; // per numeri superiori a 99
}

// FUNZIONE PRINCIPALE: Carica il testo, calcola gli anni e formatta l'HTML
async function caricaStoriaDinamica() {
    let commento = "quasi";
    try {
        // 1. Calcolo degli anni passati dal 4/12/1999 e Logica del Commento sul testo es. 'quasi ventisette'
        const dataCorrente = new Date();

        const annoCorrente = dataCorrente.getFullYear();
        const meseCorrente = (dataCorrente.getMonth()) + 1;
        const giornoCorrente = dataCorrente.getDate();

        // script per le prove:
        //const annoCorrente = 2026;
        //const meseCorrente = 12;
        //const giornoCorrente = 1;

        const annoFondazione = 1999;
        const meseFondazione = 12;
        const giornoFondazione = 4;

        let anniPassati = annoCorrente - annoFondazione;
        if ((meseFondazione - meseCorrente) > 3) {
            anniPassati = anniPassati - 1;
            commento = "più di";
        }
        if (meseCorrente == meseFondazione && giornoCorrente == giornoFondazione) {
            commento = "esattamente";
        }
        if (meseCorrente == meseFondazione && giornoCorrente > giornoFondazione) {
            commento = "più di";
        }
        //console.log(annoCorrente);
        //console.log(meseCorrente);
        //console.log(giornoCorrente);
        //console.log(anniPassati);

        // Convertiamo il numero in parola (es: 27 -> "ventisei")
        const anniInLettere = numeroInLettere(anniPassati);
        const commentoEanniInLettere = commento + " " + anniInLettere;

        // 2. Recupero del file storia.txt dalla cartella assets
        // PRIMA ERA COSÌ:
        // const risposta = await fetch('assets/storia.txt');
        // MODIFICATO COSÌ PER FAR APRIRE PAGINE GIA' IN CACHE E AVERLE SEMPRE AGGIORNATE:
        const risposta = await fetch('assets/storia.txt?v=' + new Date().getTime());
        if (!risposta.ok) throw new Error("File storia.txt non trovato nella cartella assets");

        let testoOriginale = await risposta.text();

        // 3. Sostituzione globale di tutti i tag [ANNI] con il testo in lettere
        let testoModificato = testoOriginale.replace(/\[ANNI\]/g, commentoEanniInLettere);

        // 4. Dividiamo il testo in base alle righe, ripulendo gli spazi vuoti
        const righe = testoModificato.split('\n').map(r => r.trim()).filter(r => r !== "");

        let htmlFinale = "";

        // 5. Analizziamo riga per riga per applicare la formattazione corretta
        righe.forEach((riga, indice) => {
            if (indice === 0) {
                // La prima riga è il Titolo Principale
                htmlFinale += `<h1 class="titolo-storia">${riga}</h1>`;
            }
            else if (indice === 1) {
                // La seconda riga è il Sottotitolo
                htmlFinale += `<h2 class="sottotitolo-storia">${riga}</h2>`;
            }
            else if (riga === "Paolo e Luisa.") {
                // Se incontra la firma finale, applica la classe firma
                htmlFinale += `<p class="firma-storia"><strong>${riga}</strong></p>`;
            }
            else if (riga.includes("Paolo:") || riga.includes("Luisa:") || riga.includes("Insieme:")) {
                // Se la riga inizia con uno dei tuoi titoli dei paragrafi, diventa un H3 blu
                htmlFinale += `<h3 class="titolo-paragrafo">${riga}</h3>`;
            }
            else {
                // Tutto il resto è testo normale dei paragrafi
                htmlFinale += `<p class="testo-normale">${riga}</p>`;
            }
        });

        // 6. Iniettiamo l'HTML formattato dentro la card della pagina
        const contenitoreHTML = document.getElementById('testo-storia');
        if (contenitoreHTML) {
            contenitoreHTML.innerHTML = htmlFinale;
        }

    } catch (errore) {
        console.error("Errore nel caricamento della storia:", errore);
        const contenitoreHTML = document.getElementById('testo-storia');
        if (contenitoreHTML) {
            contenitoreHTML.textContent = "Impossibile caricare la storia del negozio al momento.";
        }
    }
}

// Avviamo lo script quando l'HTML della pagina è completamente pronto
document.addEventListener('DOMContentLoaded', caricaStoriaDinamica);
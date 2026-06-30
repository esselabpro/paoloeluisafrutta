// ATTENZIONE PROPRIETA' PRIVATA SFRISO PAOLO //

// Ottenere il canvas e il contesto
let mioCanvas = document.getElementById("canvas1");
let context = mioCanvas.getContext("2d");

// Posizione iniziale e velocità separate per asse
let x = 150; 
let y = 100; 
let raggio = 50; 

// Gestendo le velocità separatamente hai il controllo totale del movimento diagonale
let velocitaX = 4;   
let velocitaY = 3; 

// Memorizziamo il tempo dell'ultimo fotogramma per il calcolo anti-risparmio energetico
let ultimoTempo = performance.now();

function aggiorna(tempoAttuale) {
    // Cancellare il canvas
    context.clearRect(0, 0, mioCanvas.width, mioCanvas.height);

    // Calcoliamo quanti millisecondi sono passati dall'ultimo fotogramma rispetto a uno standard di 60Hz (16.66ms)
    let deltaTime = (tempoAttuale - ultimoTempo) / 16.66;
    ultimoTempo = tempoAttuale;

    // Se il deltaTime è troppo alto (es. cambi scheda del browser), lo blocchiamo per evitare balzi giganti della pallina
    if (deltaTime > 4) deltaTime = 4;

    // Disegno del cerchio
    context.beginPath();
    context.fillStyle = "rgba(0, 250, 0, 0.6)";  // Verde trasparente
    context.arc(x, y, raggio, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.closePath();

    // MOLTIPLICHIAMO LA VELOCITÀ PER IL DELTATIME: movimento costante su ogni telefono!
    x += velocitaX * deltaTime;
    y += velocitaY * deltaTime;

    // --- GESTIONE RIMBALZI ---
    if (x + raggio >= mioCanvas.width || x - raggio <= 0) {
        velocitaX = -velocitaX; 
    }
    if (y + raggio >= mioCanvas.height || y - raggio <= 0) {
        velocitaY = -velocitaY; 
    }

    // Passiamo il tempo attuale in automatico al prossimo ciclo
    requestAnimationFrame(aggiorna);
}

// Avviare l'animazione passando il tempo iniziale
requestAnimationFrame(aggiorna);
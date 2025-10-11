// sketch.js
// RULES: column1 < 0  &&  column2 % 3 === 0


let table;
let filteredRows = []; //QUI CI SONO LE RIGHE FILTRATE


//IMPOSTO LA TABLE
function preload() {
  table = loadTable('dataset.csv', 'csv', 'header');
}


//IMPOSTO LA CANVA
function setup() {
  createCanvas(windowWidth, windowHeight+1000);//come funziona l'altezza della finestra? come posso renderla adattabile alla lunghezza dell'array di righe filtrate? 
  background(240);
  textFont('monospace');
  fill(0);
  noLoop(); // disegno una volta (se vuoi animazione, rimuovi)

  // FILTRAGGIO
  for (let i = 0; i < table.getRowCount(); i++) {
    let row = table.getRow(i);
    let col1 = float(row.get('column1')); // seconda colonna
    let col2 = float(row.get('column2')); // terza colonna

    if (col1 < 0 && col2 % 3 === 0) {
      filteredRows.push(row);
    }
  }
                //PREPARAZIONE ALL'OPERAZIONE

  // Prepara gli array numerici per le colonne di interesse (dal filteredRows)
  let col0_vals = filteredRows.map(r => float(r.get('column0'))); // prima colonna
  let col1_vals = filteredRows.map(r => float(r.get('column1'))); // seconda colonna
  let col2_vals = filteredRows.map(r => float(r.get('column2'))); // terza colonna
  let col3_vals = filteredRows.map(r => float(r.get('column3'))); // quarta colonna
  let col4_vals = filteredRows.map(r => float(r.get('column4'))); // quinta colonna


                //  Calcoli richiesti
  // media prima colonna (column0)
  let mean_col0 = mean(col0_vals);

  // scarto quadratico medio (deviazione standard) della seconda colonna (column1)
  let std_col1 = stdDev(col1_vals);

  // moda della terza colonna (column2)
  let mode_col2 = mode(col2_vals);

  // mediana della quarta colonna (column3)
  let median_col3 = median(col3_vals);

  // media della quinta colonna (column4)
  let mean_col4 = mean(col4_vals);

  // scarto quadratico medio (deviazione standard) della quinta colonna (column4)
  let std_col4 = stdDev(col4_vals);

  
  

                // VISUALIZZAZIONE RISULTATI
  background(240);
  textAlign(LEFT, TOP);

  const leftX = 20;
  let y = 20;

  //textSize(18);
 // text(`Righe totali nel file: ${table.getRowCount()}`, leftX, y); y += 26;TOT 448
  //text(`Righe filtrate: ${filteredRows.length}`, leftX, y); y += 30; TOT 76

  textSize(24);
  text('Statistiche calcolate (solo sulle righe filtrate):', leftX, y); y += 40;

  textSize(16);
  text(`• Media prima colonna : ${nf(mean_col0, 1, 3)}`, leftX, y); y += 30;

  text(`• Deviazione standard seconda colonna : ${nf(std_col1, 1, 3)}`, leftX, y); y += 30;

  // moda: può essere multipla => mostra come array o valore
  let modeText = Array.isArray(mode_col2) ? `[${mode_col2.map(v=>nf(v,1,0)).join(', ')}]` : nf(mode_col2,1,0);
  text(`• Moda terza colonna : ${modeText}`, leftX, y); y += 30;

  text(`• Mediana quarta colonna : ${nf(median_col3, 1, 3)}`, leftX, y); y += 30;

  text(`• Media quinta colonna : ${nf(mean_col4, 1, 3)}`, leftX, y); y += 20;
  text(`  Deviazione standard quinta colonna: ${nf(std_col4, 1, 3)}`, leftX, y); y += 50; //(la y mi serve per aggiungere spazio tra le righe)

  
             // SCRIVE TUTTE LE RIGHE FILTRATE IN ORDINE

  //textSize(12);
  // mostra le righe fino a riempire la pagina
  //for (let i = 0; i < filteredRows.length; i++) {
    //let r = filteredRows[i];
    //let line = `${r.get('column0')}, ${r.get('column1')}, ${r.get('column2')}, ${r.get('column3')}, ${r.get('column4')}`;
    //text(line, leftX, y);
    //y += 16;
    //if (y > height - 30) {
     // text('... (altre righe non mostrate)', leftX, y);
    //  break;
   // }
  //}


  // stampa anche in console per debug
  console.log('STATISTICHE:');
  console.log('media col0', mean_col0);
  console.log('std col1', std_col1);
  console.log('mode col2', mode_col2);
  console.log('median col3', median_col3);
  console.log('mean col4', mean_col4);
  console.log('std col4', std_col4);
}

                /* OPERAZIONI UTILIZZATE PER FARE I CALCOLI STATISTICI */

 // mean - media aritmetica di un array di numeri
function mean(arr) {
  if (!arr || arr.length === 0) return NaN;
  let s = 0;
  for (let v of arr) s += v;
  return s / arr.length;
}

// stdDev - scarto quadratico medio (deviazione standard, population)
// formula: sqrt( mean( (x - mean)^2 ) )
function stdDev(arr) {
  if (!arr || arr.length === 0) return NaN;
  let m = mean(arr);
  let s = 0;
  for (let v of arr) {
    let d = v - m;
    s += d * d;
  }
  return sqrt(s / arr.length);
}

// median - La media in questo caso è calcolata
function median(arr) {
  if (!arr || arr.length === 0) return NaN;
  // copia e ordina in modo non distruttivo
  let a = arr.slice().sort((x, y) => x - y);
  let n = a.length;
  let mid = floor(n / 2);
  if (n % 2 === 1) {
    return a[mid];
  } else {
    return (a[mid - 1] + a[mid]) / 2;
  }
}

// mode - moda: ritorna un singolo valore se unica moda, altrimenti array di valori con freq massima
function mode(arr) {
  if (!arr || arr.length === 0) return null;
  let freq = {};
  let maxCount = 0;
  for (let v of arr) {
    // usa string key (per sicurezza), ma salva numerico nel risultato
    let key = String(v);
    freq[key] = (freq[key] || 0) + 1;
    if (freq[key] > maxCount) maxCount = freq[key];
  }
  // raccogli tutte le chiavi con maxCount
  let modes = [];
  for (let k in freq) {
    if (freq[k] === maxCount) modes.push(Number(k));
  }
  // se c'è una sola moda, restituisci il valore singolo (non array)
  if (modes.length === 1) return modes[0];
  return modes; // array di modalità
}



/* -------------------------------------------------
   NUOVE PARTI PER LA UI E I GRAFICI
   ------------------------------------------------- */
setTimeout(()=> {
  try {
    buildUIAndCharts();
  } catch(e) {
    console.error('Errore nella generazione UI:', e);
  }
}, 50);

/* buildUIAndCharts()
   Crea la struttura HTML (header / center / footer), inserisce
   i risultati calcolati e genera tre canvas con i grafici:
   - bell-curve per deviazione standard (column1)
   - istogramma per moda (column2) con barra evidenziata
   - barra orizzontale che mostra la media (column4)
*/
function buildUIAndCharts() {
  // rimuovo eventuale canvas p5 visibile (non è necessario per la UI)
  let p5canvas = document.querySelector('canvas');
  if (p5canvas) p5canvas.style.display = 'none';

  // prendo le statistiche calcolate nello scope precedente se presenti
  // (le variabili esistono in console log; qui ricavo di nuovo dai filteredRows)
  if (!filteredRows || filteredRows.length === 0) {
    // crea UI minima per il messaggio
    const wrapper = document.createElement('div');
    wrapper.className = 'site-wrap';
    const hdr = document.createElement('div');
    hdr.className = 'header';
    hdr.innerHTML = `<h1 class="title">Dataset Analysis</h1><p class="subtitle">Nessuna riga rispetta i criteri di filtro.</p>`;
    wrapper.appendChild(hdr);
    document.body.innerHTML = '';
    document.body.appendChild(wrapper);
    return;
  }

  // ricostruisco gli array numerici da filteredRows (sicurezza)
  const col0_vals = filteredRows.map(r => Number(r.get('column0')));
  const col1_vals = filteredRows.map(r => Number(r.get('column1')));
  const col2_vals = filteredRows.map(r => Number(r.get('column2')));
  const col3_vals = filteredRows.map(r => Number(r.get('column3')));
  const col4_vals = filteredRows.map(r => Number(r.get('column4')));

  // ricalcolo le stesse statistiche (in modo locale)
  const mean_col0 = mean(col0_vals);
  const std_col1 = stdDev(col1_vals);
  const mode_col2 = mode(col2_vals);
  const median_col3 = median(col3_vals);
  const mean_col4 = mean(col4_vals);
  const std_col4 = stdDev(col4_vals);

  // costruzione DOM principale
  const site = document.createElement('div');
  site.className = 'site-wrap';

  // HEADER - prima sezione
  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <h1 class="title">First assignment</h1>
    <p class="subtitle">filtrarre, calcolare, rappresentare </p>`;
  site.appendChild(header);

  // CENTER - area nera con 3 box
  const center = document.createElement('section');
  center.className = 'center';
  const inner = document.createElement('div');
  inner.className = 'inner';

  // CARD 1 - deviazione standard (bell curve)
  const card1 = document.createElement('div');
  card1.className = 'card';
  card1.innerHTML = `<h3>Deviazione standard della seconda colonna</h3><div class="chart" id="chart-std"></div><div class="desc">Lo scarto quadratico medio misura la dispersione dei valori rispetto alla media. Qui è rappresentata con una curva gaussiana e l'area attorno alla media.</div>`;
  inner.appendChild(card1);

  // CARD 2 - moda (histogram)
  const card2 = document.createElement('div');
  card2.className = 'card';
  card2.innerHTML = `<h3>Moda della terza colonna</h3><div class="chart" id="chart-mode"></div><div class="desc">La moda è il valore più frequente. Qui un istogramma mostra le frequenze e la moda è evidenziata.</div>`;
  inner.appendChild(card2);

  // CARD 3 - media (mean)
  const card3 = document.createElement('div');
  card3.className = 'card';
  card3.innerHTML = `<h3>Media della quinta colonna</h3><div class="chart" id="chart-mean"></div><div class="desc">La media aritmetica dei valori della quinta colonna, rappresentata anche come barra relativa al range dei dati.</div>`;
  inner.appendChild(card3);

  center.appendChild(inner);
  site.appendChild(center);

  // FOOTER - area inferiore con box bianca contenente tutti i risultati
  const footer = document.createElement('footer');
  footer.className = 'footer';
  const resultsBox = document.createElement('div');
  resultsBox.className = 'results-box';
  resultsBox.innerHTML = `<h4>Risultati delle operazioni per ogni colonna</h4>
    <div class="list" id="results-list"></div>`;
  footer.appendChild(resultsBox);
  site.appendChild(footer);

  //class
  document.body.innerHTML = '';
  document.body.appendChild(site);

  // Popolo i risultati testuali nella box inferiore
  const resultsList = document.getElementById('results-list');

  // utility per creare una riga di risultato
  function addStat(title, value) {
    const el = document.createElement('div');
    el.className = 'stat';
    el.innerHTML = `<strong>${title}</strong><div>${value}</div>`;
    resultsList.appendChild(el);
  }

  addStat('Righe totali nel file', table.getRowCount());
  addStat('Righe filtrate', filteredRows.length); 
  addStat('Media prima colonna (column0)', mean_col0.toFixed(3));
  addStat('Deviazione standard seconda colonna (column1)', std_col1.toFixed(3));
  addStat('Moda terza colonna (column2)', Array.isArray(mode_col2) ? mode_col2.join(', ') : String(mode_col2));
  addStat('Mediana quarta colonna (column3)', median_col3.toFixed(3));
  addStat('Media quinta colonna (column4)', mean_col4.toFixed(3));
  addStat('Deviazione standard quinta colonna (column4)', std_col4.toFixed(3));



  // ----- Creazione grafici su canvas HTML5 -----

  // 1) Chart - deviazione standard (bell curve)
  const cStd = document.createElement('canvas');
  cStd.width = 400; cStd.height = 140;
  document.getElementById('chart-std').appendChild(cStd);
  drawBellCurve(cStd, col1_vals, std_col1, mean(col1_vals));
  card1.classList.add('visible');

  // 2) Chart - moda (istogramma)
  const cMode = document.createElement('canvas');
  cMode.width = 400; cMode.height = 140;
  document.getElementById('chart-mode').appendChild(cMode);
  drawHistogram(cMode, col2_vals, mode_col2);
  card2.classList.add('visible');

  // 3) Chart - media (barra orizzontale)
  const cMean = document.createElement('canvas');
  cMean.width = 400; cMean.height = 140;
  document.getElementById('chart-mean').appendChild(cMean);
  drawMeanBar(cMean, col4_vals, mean_col4);
  card3.classList.add('visible');

  // opzionale: scroll to results on click a card
  [card1, card2, card3].forEach(c => {
    c.addEventListener('click', ()=> {
      resultsBox.scrollIntoView({behavior:'smooth', block:'center'});
    });
  });
}

/* 
   FUNZIONI DI DISEGNO GRAFICI (canvas 2D)
   - drawBellCurve(canvas, vals, sigma, mu)
   - drawHistogram(canvas, vals, modeValue)
   - drawMeanBar(canvas, vals, meanVal) */

/* drawBellCurve
   Disegna una curva gaussiana approssimata usando la media e std,
   e colora l'area +/- 1 sigma.
*/
function drawBellCurve(canvas, vals, sigma, mu) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);

  // se sigma è zero, disegno una linea orizzontale
  if (!sigma || isNaN(sigma) || sigma === 0) {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, h/2 - 2, w, 4);
    return;
  }

  // calcolo una gaussiana su un range [-4σ, +4σ]
  const samples = 200;
  const left = mu - 4 * sigma;
  const right = mu + 4 * sigma;

  // gaussian function
  function gauss(x) {
    return Math.exp(-((x - mu) ** 2) / (2 * sigma * sigma));
  }

  // normalizzo per la grafica
  let maxY = 0;
  const ys = [];
  for (let i=0;i<samples;i++){
    const x = left + (i / (samples-1)) * (right - left);
    const y = gauss(x);
    ys.push({x,y});
    if (y>maxY) maxY = y;
  }

  // sfondo e asse
  ctx.fillStyle = '#0b0b0b';
  ctx.fillRect(0,0,w,h);
  ctx.translate(0,0);

  // disegno area +1 sigma (tra mu-sigma e mu+sigma)
  ctx.beginPath();
  for (let i=0;i<ys.length;i++){
    const nx = (i / (ys.length-1)) * w;
    const ny = h - (ys[i].y / maxY) * (h*0.75) - 10;
    if (i === 0) ctx.moveTo(nx, ny);
    else ctx.lineTo(nx, ny);
  }
  // chiudo e riempio con trasparenza chiara
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#fff';
  ctx.stroke();

  // shading +/- sigma
  const leftIdx = Math.floor(((mu - sigma - left) / (right - left)) * (ys.length-1));
  const rightIdx = Math.ceil(((mu + sigma - left) / (right - left)) * (ys.length-1));
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  for (let i = leftIdx; i <= rightIdx; i++) {
    const nx = (i / (ys.length-1)) * w;
    const ny = h - (ys[i].y / maxY) * (h*0.75) - 10;
    if (i === leftIdx) ctx.moveTo(nx, ny);
    else ctx.lineTo(nx, ny);
  }
  // chiudo la forma verso il basso
  ctx.lineTo((rightIdx / (ys.length-1)) * w, h-6);
  ctx.lineTo((leftIdx / (ys.length-1)) * w, h-6);
  ctx.closePath();
  ctx.fill();

  // ridisegno la curva sopra lo shading
  ctx.beginPath();
  for (let i=0;i<ys.length;i++){
    const nx = (i / (ys.length-1)) * w;
    const ny = h - (ys[i].y / maxY) * (h*0.75) - 10;
    if (i === 0) ctx.moveTo(nx, ny);
    else ctx.lineTo(nx, ny);
  }
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // testo: mu e sigma
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '12px Inter, sans-serif';
  ctx.fillText(`μ ≈ ${mu.toFixed(2)}`, 8, 14);
  ctx.fillText(`σ ≈ ${sigma.toFixed(2)}`, 8, 30);
}

/* drawHistogram
   Disegna un istogramma delle frequenze; evidenzia la barra della moda.
*/
function drawHistogram(canvas, vals, modeValue) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = '#0b0b0b';
  ctx.fillRect(0,0,w,h);

  // calcolo frequenze discrete (i valori sono integer nella maggior parte dei casi)
  const freq = {};
  let min = Infinity, max = -Infinity;
  vals.forEach(v => {
    const k = String(v);
    freq[k] = (freq[k] || 0) + 1;
    if (v < min) min = v;
    if (v > max) max = v;
  });

  const keys = Object.keys(freq).sort((a,b) => Number(a)-Number(b));
  const counts = keys.map(k => freq[k]);
  const maxCount = Math.max(...counts);

  // margini e dimensione barre
  const pad = 10;
  const innerW = w - pad*2;
  const barW = innerW / keys.length;
  for (let i=0;i<keys.length;i++){
    const k = keys[i];
    const c = freq[k];
    const barH = (c / maxCount) * (h - 30);
    const x = pad + i * barW;
    const y = h - barH - 10;

    // evidenzia la moda
    const isMode = (Array.isArray(modeValue) ? modeValue.map(String).includes(k) : String(modeValue) === k);
    ctx.fillStyle = isMode ? '#ffffff' : 'rgba(255,255,255,0.12)';
    ctx.fillRect(x+4, y, barW-8, barH);

    // piccola etichetta sotto (solo per alcuni per non ingombrare)
    if (i % Math.ceil(keys.length / 6) === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(k, x+2, h-2);
    }
  }

  // legenda testo
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '12px Inter, sans-serif';
  ctx.fillText(`Moda: ${Array.isArray(modeValue) ? modeValue.join(', ') : String(modeValue)}`, 8, 14);
}

/* drawMeanBar
   Mostra la media come barra relativa al range dei dati.
*/
function drawMeanBar(canvas, vals, meanVal) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = '#0b0b0b';
  ctx.fillRect(0,0,w,h);

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = (max - min) || 1;
  const rel = (meanVal - min) / range;

  // barra di background
  const pad = 20;
  const barW = w - pad*2;
  const barH = 18;
  const barX = pad;
  const barY = h/2 - barH/2;

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  roundRect(ctx, barX, barY, barW, barH, 8);
  ctx.fill();

  // barra riempita fino alla media
  ctx.fillStyle = '#fff';
  const fillW = Math.max(2, Math.min(barW, barW * rel));
  roundRect(ctx, barX, barY, fillW, barH, 8);
  ctx.fill();

  // linea verticale che indica la media
  ctx.fillStyle = '#e6e6e6';
  const markerX = barX + fillW;
  ctx.fillRect(markerX - 1, barY - 6, 2, barH + 12);

  // testo
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.font = '12px Inter, sans-serif';
  ctx.fillText(`media ≈ ${meanVal.toFixed(2)}`, pad, barY - 12);
  ctx.fillText(`range: ${min.toFixed(2)} — ${max.toFixed(2)}`, pad + 120, barY - 12);
}

/* helper per rettangolo con angoli arrotondati su canvas */
function roundRect(ctx, x, y, width, height, radius) {
  if (width < 0) return;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}



/* windowResized - adatta la canvas alla finestra quando ridimensionata
   (mantengo questa funzione come nel tuo codice originale)
*/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight+1000);
  redraw(); // ridisegna con le nuove dimensioni
}

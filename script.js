// SELECTORS
const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStop');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsBox = document.getElementById('laps');
const noLaps = document.getElementById('noLaps');
const modeBtn = document.getElementById('modeBtn');

// STOPWATCH VARIABLES
let startTime = 0;
let elapsedBefore = 0;
let running = false;
let rafId = null;
let laps = [];

// TIME
function now() { return performance.now(); }

function format(ms){
  ms = Math.floor(ms);
  let h = Math.floor(ms / 3600000);
  let m = Math.floor((ms % 3600000) / 60000);
  let s = Math.floor((ms % 60000) / 1000);
  let ms3 = ms % 1000;

  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(ms3).padStart(3,"0")}`;
}

// UPDATE UI
function updateDisplay(){
  let elapsed = running ? (now() - startTime + elapsedBefore) : elapsedBefore;
  display.textContent = format(elapsed);
}

function tick(){
  updateDisplay();
  rafId = requestAnimationFrame(tick);
}


// START
function start(){
  if(running) return;
  startTime = now();
  running = true;
  startStopBtn.textContent = "Stop";
  startStopBtn.className = "btn stop";
  rafId = requestAnimationFrame(tick);
  animatePulse();
}

// STOP
function stop(){
  if(!running) return;
  elapsedBefore += now() - startTime;
  running = false;
  cancelAnimationFrame(rafId);
  startStopBtn.textContent = "Start";
  startStopBtn.className = "btn start";
  updateDisplay();
  animatePulse();
}

// RESET
function reset(){
  stop();
  elapsedBefore = 0;
  startTime = 0;
  laps = [];
  display.textContent = "00:00:00.000";
  lapsBox.innerHTML = "";
  lapsBox.appendChild(noLaps);
}


// LAP
function addLap(){
  let elapsed = running ? (now() - startTime + elapsedBefore) : elapsedBefore;
  if(elapsed <= 0) return;

  laps.unshift({ time: elapsed, text: format(elapsed) });
  renderLaps();
}

function renderLaps(){
  lapsBox.innerHTML = "";

  laps.forEach((lap, idx)=>{
    let row = document.createElement("div");
    row.className = "lap-row";
    if(idx === 0) row.classList.add("new");

    row.innerHTML = `
      <div>Lap ${laps.length - idx}</div>
      <div>${lap.text}</div>
    `;

    lapsBox.appendChild(row);
  });
}


// SMALL ANIMATION
function animatePulse(){
  display.style.transform = "scale(1.04)";
  setTimeout(()=> display.style.transform = "scale(1)", 160);
}


// EVENTS
startStopBtn.onclick = ()=> running ? stop() : start();
lapBtn.onclick = addLap;
resetBtn.onclick = reset;


// KEYBOARD
window.addEventListener("keydown", (e)=>{
  if(e.code === "Space"){ e.preventDefault(); running ? stop() : start(); }
  if(e.key === "l" || e.key === "L"){ addLap(); }
  if(e.key === "r" || e.key === "R"){ reset(); }
});


// MODE TOGGLE
modeBtn.onclick = ()=>{
  let dark = document.body.classList.toggle("dark");
  modeBtn.textContent = dark ? "Light Mode" : "Dark Mode";
};

// INIT
updateDisplay();
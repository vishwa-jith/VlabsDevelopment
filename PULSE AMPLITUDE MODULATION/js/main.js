let amplitudeMessage = document.querySelector("#amplitudeMessage");
let amplitudeMessageUp = document.querySelector("#amplitudeMessageUp");
let amplitudeMessageDown = document.querySelector("#amplitudeMessageDown");
let messageSlider = document.querySelector("#message-slider");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");

// Initialization
let messageAmp = 0;
let messageFreq = 100;

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

const PI = Math.PI;

// Canvas Initialization
let context = oscilloscopeCanvas.getContext("2d");

//Variables
var WIDTH = 600,
  HEIGHT = 600,
  mapObj = new Map(),
  incrementStep = 1,
  yPostOff = HEIGHT / 3,
  f = 0,
  c = 0,
  t = 0,
  tPAM = 0,
  pamYPos = [],
  messsageYPos = [];

// Draws Line with Arrow Heads
function canvas_arrow(context, fromx, fromy, tox, toy) {
  var headlen = 10;
  var dx = tox - fromx;
  var dy = toy - fromy;
  var angle = Math.atan2(dy, dx);
  context.moveTo(fromx, fromy);
  context.lineTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(tox, toy);
  context.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  );
}

// Displays Signal Labels
const displaySignalLabel = () => {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("m(t)", 10, 20);
  context.fillText("c(t)", 10, oscilloscopeCanvas.height / 3 + 20);
  context.fillText("time(t)", 550, oscilloscopeCanvas.height / 3 + 75);
  context.fillText("pam(t)", 10, (2 * oscilloscopeCanvas.height) / 3 + 20);
  context.fillText("time(t)", 550, (2 * oscilloscopeCanvas.height) / 3 + 75);
  context.fillText("1", 10, 50);
  context.fillText("0", 10, 90);
  context.fillText("1", 10, (2 * oscilloscopeCanvas.height) / 3 + 50);
  context.fillText("0", 10, (2 * oscilloscopeCanvas.height) / 3 + 90);
  context.closePath();
  context.beginPath();
  context.strokeStyle = darkCyan;
  canvas_arrow(
    context,
    0,
    oscilloscopeCanvas.height / 2,
    oscilloscopeCanvas.width,
    oscilloscopeCanvas.height / 2
  );
  context.stroke();
  context.closePath();
  context.beginPath();
  context.strokeStyle = darkCyan;
  canvas_arrow(
    context,
    0,
    oscilloscopeCanvas.height / 6,
    oscilloscopeCanvas.width,
    oscilloscopeCanvas.height / 6
  );
  context.stroke();
  context.closePath();
  context.beginPath();
  context.strokeStyle = darkCyan;
  canvas_arrow(
    context,
    0,
    oscilloscopeCanvas.height - oscilloscopeCanvas.height / 6,
    oscilloscopeCanvas.width,
    oscilloscopeCanvas.height - oscilloscopeCanvas.height / 6
  );
};

// Plot Graph Points
const drawSignal = (amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, 2 * yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    if (i % 250 == 0) {
      context.fillText(
        `(${i}, ${parseInt(arr[i])})`,
        i + 5,
        2 * yPostOff - yPostOff / 2 - arr[i] - 5
      );
      context.arc(i, 2 * yPostOff - yPostOff / 2 - arr[i], 5, 0, 2 * PI);
    }
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};

// Plot PAM Graph Points
const drawPAMSignal = (amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, 3 * yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.lineTo(i, 3 * yPostOff - yPostOff / 2);
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};

// Draws Message Signal
const drawMessageSignal = (t) => {
  drawSignal(messageAmp, messageFreq, t, messsageYPos);
};

initializeMapObj();

//function to setup the mapObj
function initializeMapObj() {
  t = 0;
  bitIndex = 0;
  for (; t < WIDTH; t += incrementStep) {
    if (t % 15 !== 0) {
      mapObj.set(t, bitIndex);
    } else {
      bitIndex = bitIndex ? 0 : 1;
    }
  }
}

//function to draw the Pulse Train
function drawPulseTrain() {
  context.fillStyle = darkCyan;
  context.strokeStyle = lightCyan;
  context.moveTo(0, yPostOff - yPostOff / 2);
  context.lineTo(WIDTH, yPostOff - yPostOff / 2);
  context.stroke();
  for (const k of mapObj.keys()) {
    if (mapObj.get(k) == 0) {
      context.beginPath();
      context.arc(k, yPostOff - yPostOff / 2, 2, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
    } else {
      context.beginPath();
      context.arc(k, yPostOff - yPostOff / 2 - 50, 2, 0, 2 * Math.PI);
      context.lineTo(k, yPostOff - yPostOff / 2);
      context.stroke();
      context.fill();
      context.closePath();
    }
  }
}

// Loop Animation
function loop() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  drawPulseTrain();
  drawMessageSignal(t);
  drawPAMSignal(messageAmp, messageFreq, tPAM, pamYPos);
  displaySignalLabel();
  if (c % 15 == 0) {
    tPAM += (PI / 180 / 200) * 15;
  }
  t += PI / 180 / 200;
  c += 1;
  requestAnimationFrame(loop);
}
loop();

// Handles change in Carrier Amplitude
const handleAmplitudeMessage = (event) => {
  messageAmp = parseInt(event.target.value);
  amplitudeMessage.value = messageAmp;
  messageSlider.value = messageAmp;
};

// Listener for increasing Carrrier Amplitude
amplitudeMessageUp.addEventListener("click", () => {
  if (messageAmp < 50) {
    messageAmp += 1;
    amplitudeMessage.value = messageAmp;
    messageSlider.value = messageAmp;
  }
});

// Listener for decreasing Carrrier Amplitude
amplitudeMessageDown.addEventListener("click", () => {
  if (messageAmp > 0) {
    messageAmp -= 1;
    amplitudeMessage.value = messageAmp;
    messageSlider.value = messageAmp;
  }
});

messageSlider.addEventListener("change", handleAmplitudeMessage);

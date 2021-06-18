let amplitudeMessage = document.querySelector("#amplitudeMessage");
let amplitudeMessageUp = document.querySelector("#amplitudeMessageUp");
let amplitudeMessageDown = document.querySelector("#amplitudeMessageDown");
let messageSlider = document.querySelector("#message-slider");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");
let toggle = document.querySelector("#toggle");

// Initialization
let messageAmp = 0;
let messageFreq = 100;

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";
let status = false;

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
  tDELTA = 0,
  YPos = [],
  messsageYPos = [],
  qLevel = 15,
  binaryArr = [];

// Plot Graph Points
const drawSignal = (amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  if (status) {
    arr.unshift(y);
  }
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.stroke();
    context.fill();
    if (i % 250 == 0) {
      context.fillText(
        `(${i}, ${parseInt(arr[i])})`,
        i + 5,
        yPostOff - yPostOff / 2 - arr[i] - 5
      );
      context.arc(i, yPostOff - yPostOff / 2 - arr[i], 5, 0, 2 * PI);
    }
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};

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

const drawBinaryMessage = (i, bin) => {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "15px Arial";
  context.fillText(bin, i, 3 * yPostOff - yPostOff / 2);
  context.closePath();
};

// Plot DELTA Graph Points
const drawDELTASignal = (amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  if (status) {
    arr.unshift(y);
  }
  let prev = -amplitude;
  for (let i = 0; i < arr.length; i++) {
    if (i % qLevel == 0) {
      if (arr[i] > prev) {
        prev += qLevel;
        drawBinaryMessage(i, 1);
      } else {
        prev -= qLevel;
        drawBinaryMessage(i, 0);
      }
    }
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, 2 * yPostOff - yPostOff / 2 - prev, 2, 0, 2 * PI);
    context.lineTo(i, 2 * yPostOff - yPostOff / 2);
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
    if (binaryArr.length > WIDTH / qLevel) {
      binaryArr.pop();
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
    if (t % qLevel !== 0) {
      mapObj.set(t, bitIndex);
    } else {
      bitIndex = bitIndex ? 0 : 1;
    }
  }
}

// Loop Animation
function loop() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.fillStyle = darkCyan;
  context.strokeStyle = lightCyan;
  drawMessageSignal(t);
  drawDELTASignal(messageAmp, messageFreq, tDELTA, YPos);
  if (c % qLevel == 0) {
    tDELTA += (PI / 180 / 200) * qLevel;
  }
  t += PI / 180 / 200;
  c += 1;
  context.font = "16px Arial";
  context.fillText("m(t)", 10, 20);
  context.fillText("dm(t)", 10, yPostOff);
  context.fillText("time(t)", 550, 75);
  context.fillText("time(t)", 550, yPostOff + 75);
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
  context.stroke();
  context.closePath();
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

toggle.addEventListener("click", () => {
  status = !status;
  if (status) {
    toggle.innerHTML = "Pause";
  } else {
    toggle.innerHTML = "Play";
  }
});

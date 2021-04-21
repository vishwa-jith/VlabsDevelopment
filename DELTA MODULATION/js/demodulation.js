let oscilloscopeCanvas1 = document.querySelector("#oscilloscope-canvas1");
let oscilloscopeCanvas2 = document.querySelector("#oscilloscope-canvas2");
let oscilloscopeCanvas3 = document.querySelector("#oscilloscope-canvas3");
let canvas = document.querySelectorAll("canvas");
let selectWave = document.querySelector("#selectWave");
let selectedWave = document.querySelector("#selectedWave");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");
let amplitudeMessage = document.querySelector("#amplitudeMessage");

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

// Canvas Initialization
let context1 = oscilloscopeCanvas1.getContext("2d");
let context2 = oscilloscopeCanvas2.getContext("2d");
let context3 = oscilloscopeCanvas3.getContext("2d");
let context = oscilloscopeCanvas.getContext("2d");

//Variables
var WIDTH = 600,
  HEIGHT = 600,
  mapObj = new Map(),
  incrementStep = 1,
  yPostOff = 100,
  f = 0,
  c = 0,
  t = 0,
  tDelta = 0,
  qLevel = 15;

const PI = Math.PI;
let currentCanvas = null;

let parameters = [
  {
    context: context1,
    messageAmp: 39,
    messageFreq: 100,
    messsageYPos: [],
    deltaYPos: [],
  },
  {
    context: context2,
    messageAmp: 30,
    messageFreq: 100,
    messsageYPos: [],
    deltaYPos: [],
  },
  {
    context: context3,
    messageAmp: 50,
    messageFreq: 100,
    messsageYPos: [],
    deltaYPos: [],
  },
];

// Plot Graph Points
const drawSignal = (context, amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, 150 - 150 / 2 - arr[i], 2, 0, 2 * PI);
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};

const drawBinaryMessage = (context, i, bin) => {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "15px Arial";
  context.fillText(bin, i, yPostOff - yPostOff / 2);
  context.closePath();
};

// Plot DELTA Graph Points
const drawDELTASignal = (context, amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  let prev = -amplitude;
  for (let i = 0; i < arr.length; i++) {
    if (i % qLevel == 0) {
      if (arr[i] > prev) {
        prev += qLevel;
        drawBinaryMessage(context, i, 1);
      } else {
        prev -= qLevel;
        drawBinaryMessage(context, i, 0);
      }
    }
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};

// Draws Message Signal
const drawMessageSignal = (
  context,
  messageAmp,
  messageFreq,
  t,
  messsageYPos
) => {
  drawSignal(context, messageAmp, messageFreq, t, messsageYPos);
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

// Loop Animation
function loop() {
  for (var i = 0; i < parameters.length; i++) {
    parameters[i].context.clearRect(0, 0, WIDTH, HEIGHT);
    parameters[i].context.fillStyle = darkCyan;
    parameters[i].context.strokeStyle = light;
    drawDELTASignal(
      parameters[i].context,
      parameters[i].messageAmp,
      parameters[i].messageFreq,
      tDelta,
      parameters[i].deltaYPos
    );
  }
  if (c % 15 == 0) {
    tDelta += (PI / 180 / 200) * 15;
  }
  t += PI / 180 / 200;
  c += 1;

  requestAnimationFrame(loop);
}
loop();

canvas.forEach((item) => {
  item.addEventListener("click", (event) => {
    currentCanvas = parseInt(event.target.id.slice(-1));
    selectWave.classList.add("d-none");
    selectedWave.classList.remove("d-none");

    var t = 0,
      messageYPos = [];

    // loop
    function loop() {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      drawMessageSignal(
        context,
        parameters[currentCanvas - 1].messageAmp,
        parameters[currentCanvas - 1].messageFreq,
        t,
        messageYPos
      );
      amplitudeMessage.value = parameters[currentCanvas - 1].messageAmp;
      t += PI / 180 / 200;
      requestAnimationFrame(loop);
    }
    loop();
  });
});

backButton.addEventListener("click", () => {
  selectWave.classList.remove("d-none");
  selectedWave.classList.add("d-none");
});

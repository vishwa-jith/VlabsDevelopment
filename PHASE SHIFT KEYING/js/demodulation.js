let oscilloscopeCanvas1 = document.querySelector("#oscilloscope-canvas1");
let oscilloscopeCanvas2 = document.querySelector("#oscilloscope-canvas2");
let oscilloscopeCanvas3 = document.querySelector("#oscilloscope-canvas3");
let canvas = document.querySelectorAll("canvas");
let selectWave = document.querySelector("#selectWave");
let selectedWave = document.querySelector("#selectedWave");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

// Canvas Initialization
let context1 = oscilloscopeCanvas1.getContext("2d");
let context2 = oscilloscopeCanvas2.getContext("2d");
let context3 = oscilloscopeCanvas3.getContext("2d");
let context = oscilloscopeCanvas.getContext("2d");

// Initialization
var t = 0,
  bitSize = 0,
  incrementStep = 1,
  WIDTH = 600,
  HEIGHT = 150,
  phaseDiff = 0,
  f = 0,
  yPostOff = 150,
  bitIndex = 0,
  mapObj = new Map();

let graphType = "Oscilloscope";
const PI = Math.PI;
let currentCanvas = null;

let parameters = [
  {
    context: context1,
    messageBits: [0, 0, 0, 1, 0, 0, 0, 1],
    carrierAmp: 39,
    carrierFreq: 100,
  },
  {
    context: context2,
    messageBits: [0, 1, 1, 0, 0, 0, 1, 1],
    carrierAmp: 30,
    carrierFreq: 100,
  },
  {
    context: context3,
    messageBits: [0, 0, 1, 0, 1, 1, 0, 0],
    carrierAmp: 50,
    carrierFreq: 100,
  },
];

//function to setup the mapObj
function initializeMapObj(messageBits) {
  t = 0;
  bitIndex = 0;
  bitSize = WIDTH / messageBits.length;
  var mapObj = new Map();
  for (; t < WIDTH; t += incrementStep) {
    if (t >= bitIndex * bitSize && t < (bitIndex + 1) * bitSize) {
      mapObj.set(t, messageBits[bitIndex]);
    } else {
      bitIndex++;
    }
  }
  return mapObj;
}

//function to draw the message signal
function drawMessageSignal(context, carrierAmp, mapObj) {
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
      context.arc(k, yPostOff - yPostOff / 2 - carrierAmp, 2, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
    }
  }
}

//FSK Signal
function FSKSignal(context, phase, carrierAmp, mapObj) {
  context.fillStyle = darkCyan;
  context.strokeStyle = lightCyan;
  context.moveTo(0, yPostOff - yPostOff / 2);
  context.lineTo(WIDTH, yPostOff - yPostOff / 2);
  context.stroke();
  for (const k of mapObj.keys()) {
    if (mapObj.get(k) == 0) {
      context.beginPath();
      context.arc(
        k,
        yPostOff -
          yPostOff / 2 -
          carrierAmp * Math.sin(2 * Math.PI * f + phase + Math.PI),
        2,
        0,
        2 * Math.PI
      );
      context.fill();
      context.closePath();
      if (carrierAmp) {
        f += 1 / carrierAmp;
      }
    } else {
      context.beginPath();
      context.arc(
        k,
        yPostOff -
          yPostOff / 2 -
          carrierAmp * Math.sin(2 * Math.PI * f + phase),
        2,
        0,
        2 * Math.PI
      );
      context.fill();
      context.closePath();
      f += 1 / carrierAmp;
    }
  }
}

// Loop Animation
function loop() {
  for (var i = 0; i < parameters.length; i++) {
    parameters[i].context.clearRect(0, 0, WIDTH, HEIGHT);

    FSKSignal(
      parameters[i].context,
      phaseDiff,
      parameters[i].carrierAmp,
      initializeMapObj(parameters[i].messageBits)
    );
  }

  //   drawMessageSignal();
  phaseDiff += 0.05;
  t += PI / 180 / 100;
  requestAnimationFrame(loop);
}
loop();

canvas.forEach((item) => {
  item.addEventListener("click", (event) => {
    currentCanvas = parseInt(event.target.id.slice(-1));
    selectWave.classList.add("d-none");
    selectedWave.classList.remove("d-none");

    // loop
    function loop() {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      drawMessageSignal(
        context,
        parameters[currentCanvas - 1].carrierAmp,
        initializeMapObj(parameters[currentCanvas - 1].messageBits)
      );

      t += PI / 180 / 100;
      phaseDiff += 0.05;
      requestAnimationFrame(loop);
    }
    loop();
  });
});

backButton.addEventListener("click", () => {
  selectWave.classList.remove("d-none");
  selectedWave.classList.add("d-none");
});

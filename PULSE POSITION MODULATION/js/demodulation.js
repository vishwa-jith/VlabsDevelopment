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
  yPostOff = 150,
  f = 0,
  c = 0,
  t = 0,
  tPAM = 0;

const PI = Math.PI;
let currentCanvas = null;

let parameters = [
  {
    context: context1,
    messageAmp: 39,
    messageFreq: 100,
    sawYPos: [],
    messageYPos: [],
    duty: 34,
  },
  {
    context: context2,
    messageAmp: 30,
    messageFreq: 100,
    sawYPos: [],
    messageYPos: [],
    duty: 10,
  },
  {
    context: context3,
    messageAmp: 50,
    messageFreq: 100,
    sawYPos: [],
    messageYPos: [],
    duty: 93,
  },
];

// Plot Graph Points
const drawSignal = (context, messageAmp, frequency, t, arr, duty, sawYPos) => {
  let y = messageAmp * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  var prev = 0;
  for (let i = 0; i < arr.length; i++) {
    let val = (duty * messageAmp * 2) / 100 - messageAmp;
    val = -val;
    if (prev < val && arr[i] >= val) {
      sawYPos.unshift([i, 0]);
    } else if (prev > val && arr[i] <= val) {
      sawYPos.unshift([i, -messageAmp]);
    }
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
    prev = arr[i];
  }
};

// Plot PPM Graph Points
const drawPPMSignal = (context, sawYPos) => {
  context.fillStyle = darkCyan;
  context.strokeStyle = darkCyan;
  context.beginPath();
  context.moveTo(0, yPostOff - yPostOff / 2);
  context.lineTo(WIDTH, yPostOff - yPostOff / 2);
  context.closePath();
  context.stroke();
  for (let i = 1; i < sawYPos.length; i++) {
    context.beginPath();
    context.moveTo(sawYPos[i - 1][0] + 50, yPostOff - yPostOff / 2);
    context.lineTo(
      sawYPos[i - 1][0] + 50,
      yPostOff - yPostOff / 2 + sawYPos[i - 1][1]
    );
    context.lineTo(
      sawYPos[i - 1][0],
      yPostOff - yPostOff / 2 + sawYPos[i - 1][1]
    );
    context.lineTo(sawYPos[i - 1][0], yPostOff - yPostOff / 2);
    context.stroke();
    context.closePath();
    if (sawYPos.length > WIDTH / 50) {
      sawYPos.pop();
    }
  }
};

// Draws Message Signal
const drawMessageSignal = (
  context,
  messageAmp,
  messageFreq,
  t,
  messsageYPos,
  duty,
  sawYPos
) => {
  drawSignal(context, messageAmp, messageFreq, t, messsageYPos, duty, sawYPos);
};

initializeMapObj();

//function to setup the mapObj
function initializeMapObj() {
  t = 0;
  bitIndex = 0;
  for (; t < WIDTH; t += incrementStep) {
    if (t % 50 !== 0) {
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
    drawMessageSignal(
      context,
      parameters[i].messageAmp,
      parameters[i].messageFreq,
      t,
      parameters[i].messageYPos,
      parameters[i].duty,
      parameters[i].sawYPos
    );
    drawPPMSignal(parameters[i].context, parameters[i].sawYPos);
  }
  if (c % 50 == 0) {
    tPAM += (PI / 180 / 200) * 50;
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
      messageYPos = [],
      sawYPos = [];

    // loop
    function loop() {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      drawMessageSignal(
        context,
        parameters[currentCanvas - 1].messageAmp,
        parameters[currentCanvas - 1].messageFreq,
        t,
        messageYPos,
        parameters[currentCanvas - 1].duty,
        sawYPos
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

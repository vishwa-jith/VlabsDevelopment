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
    messsageYPos: [],
    pamYPos: [],
  },
  {
    context: context2,
    messageAmp: 30,
    messageFreq: 100,
    messsageYPos: [],
    pamYPos: [],
  },
  {
    context: context3,
    messageAmp: 50,
    messageFreq: 100,
    messsageYPos: [],
    pamYPos: [],
  },
];

// Plot Graph Points
const drawSignal = (context, amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  context.font = "16px Arial";
  context.fillText("pam(t)", 10, 20);
  context.fillText("time(t)", 550, 65);
  context.beginPath();
  context.fillStyle = darkCyan;
  canvas_arrow(
    context,
    0,
    oscilloscopeCanvas.height / 2,
    oscilloscopeCanvas.width,
    oscilloscopeCanvas.height / 2
  );
  context.stroke();
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    if (i % 300 == 0) {
      context.fillText(
        `(${i}, ${parseInt(arr[i])})`,
        i + 5,
        yPostOff - yPostOff / 2 - arr[i] - 5
      );
      context.arc(i, yPostOff - yPostOff / 2 - arr[i], 5, 0, 2 * PI);
    }
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};

// creates line with arrow heads
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

// Plot PAM Graph Points
const drawPAMSignal = (context, amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  context.font = "16px Arial";
  context.fillText("pam(t)", 10, 20);
  context.fillText("time(t)", 550, 65);
  context.beginPath();
  context.fillStyle = darkCyan;
  canvas_arrow(
    context,
    0,
    oscilloscopeCanvas.height / 2,
    oscilloscopeCanvas.width,
    oscilloscopeCanvas.height / 2
  );
  context.stroke();
  context.closePath();
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.strokeStyle = darkCyan;
    context.arc(i, yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.lineTo(i, yPostOff - yPostOff / 2);
    context.stroke();
    context.fill();
    context.closePath();
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
    drawPAMSignal(
      parameters[i].context,
      parameters[i].messageAmp,
      parameters[i].messageFreq,
      tPAM,
      parameters[i].pamYPos
    );
  }
  if (c % 15 == 0) {
    tPAM += (PI / 180 / 200) * 15;
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

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
  levelHeight = 0.25,
  tSampling = 0,
  samplingInterval = 15;

const PI = Math.PI;
let currentCanvas = null;

let parameters = [
  {
    context: context1,
    messageAmp: 39,
    messageFreq: 150,
    messsageYPos: [],
    samYPos: [],
  },
  {
    context: context2,
    messageAmp: 30,
    messageFreq: 100,
    messsageYPos: [],
    samYPos: [],
  },
  {
    context: context3,
    messageAmp: 50,
    messageFreq: 200,
    messsageYPos: [],
    samYPos: [],
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

const findQuantizationLevel = (amplitude, currentLevel) => {
  let val = -4 * amplitude * levelHeight;
  if (currentLevel > amplitude * 3 * levelHeight) {
    val = amplitude * 4 * levelHeight;
  } else if (currentLevel > amplitude * 2 * levelHeight) {
    val = amplitude * 3 * levelHeight;
  } else if (currentLevel > amplitude * levelHeight) {
    val = amplitude * 2 * levelHeight;
  } else if (currentLevel > 0) {
    val = amplitude * 1 * levelHeight;
  } else if (currentLevel > -amplitude * levelHeight) {
    val = 0;
  } else if (currentLevel > -2 * amplitude * levelHeight) {
    val = -amplitude * levelHeight;
  } else if (currentLevel > -3 * amplitude * levelHeight) {
    val = -2 * amplitude * levelHeight;
  } else if (currentLevel > -4 * amplitude * levelHeight) {
    val = -3 * amplitude * levelHeight;
  }
  return val;
};

const drawBinaryMessage = (context, i, bin) => {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "15px Arial";
  var s = "";
  for (var j = 0; j < 3 - bin.length; j++) {
    s += "0";
  }
  context.fillText(
    `${s.length ? s : ""}${bin}`,
    2 * i + samplingInterval,
    yPostOff - yPostOff / 2
  );
  context.closePath();
};

// Plot Sampling Graph Points
const drawSampleSignal = (context, amplitude, frequency, t, arr, c) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  if (c % 30 <= samplingInterval) {
    y = 0;
  }
  arr.unshift(y);
  var l = [];
  for (let i = 0; i < arr.length; i++) {
    level = findQuantizationLevel(amplitude, arr[i]);
    l.push(parseInt((level / (levelHeight * amplitude)) * (arr[i] / arr[i])));
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
  for (var i = 0; i < l.length; i++) {
    if (i % samplingInterval == 0 && l[i]) {
      drawBinaryMessage(context, i, (l[i] + 3).toString(2));
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
    drawSampleSignal(
      parameters[i].context,
      parameters[i].messageAmp,
      parameters[i].messageFreq,
      tSampling,
      parameters[i].samYPos
    );
  }
  if (c % 15 == 0) {
    tSampling += (PI / 180 / 200) * 15;
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

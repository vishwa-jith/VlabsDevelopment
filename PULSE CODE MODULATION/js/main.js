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
  HEIGHT = 800,
  mapObj = new Map(),
  incrementStep = 1,
  yPostOff = HEIGHT / 4,
  f = 0,
  c = 0,
  t = 0,
  tSampling = 0,
  samYPos = [],
  messsageYPos = [],
  levelHeight = 0.25,
  samplingInterval = 15,
  binaryArr = [];
// Plot Graph Points
const drawSignal = (amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};
const drawQuantizationLevels = (amplitude) => {
  for (var i = 0; i <= 4; i++) {
    context.moveTo(
      0,
      3 * yPostOff - yPostOff / 2 - amplitude * i * levelHeight
    );
    context.lineTo(
      WIDTH,
      3 * yPostOff - yPostOff / 2 - amplitude * i * levelHeight
    );
    context.moveTo(
      0,
      3 * yPostOff - yPostOff / 2 + amplitude * i * levelHeight
    );
    context.lineTo(
      WIDTH,
      3 * yPostOff - yPostOff / 2 + amplitude * i * levelHeight
    );
  }
  context.stroke();
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

const drawBinaryMessage = (i, bin) => {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "15px Arial";
  var s = "";
  for (var j = 0; j < 3 - bin.length; j++) {
    s += "0";
  }
  context.fillText(
    `${s.length ? s : ""}${bin}`,
    1.25 * i + samplingInterval,
    4 * yPostOff - yPostOff / 2
  );
  context.closePath();
};

// Plot Sampling Graph Points
const drawSampleSignal = (amplitude, frequency, t, arr, c) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  if (c % 30 <= samplingInterval) {
    y = 0;
  }
  arr.unshift(y);
  drawQuantizationLevels(amplitude);
  var l = [];
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, 2 * yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.lineTo(i, 2 * yPostOff - yPostOff / 2);
    context.stroke();
    context.fill();
    context.closePath();
    context.beginPath();
    level = findQuantizationLevel(amplitude, arr[i]);
    l.push(parseInt((level / (levelHeight * amplitude)) * (arr[i] / arr[i])));
    context.arc(i, 3 * yPostOff - yPostOff / 2 - level, 2, 0, 2 * PI);
    context.lineTo(i, 3 * yPostOff - yPostOff / 2);
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
    if (binaryArr.length > WIDTH) {
      binaryArr.pop();
    }
  }
  for (var i = 0; i < l.length; i++) {
    if (i % samplingInterval == 0 && l[i]) {
      drawBinaryMessage(i, (l[i] + 3).toString(2));
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
    if (t % samplingInterval !== 0) {
      mapObj.set(t, bitIndex);
    } else {
      bitIndex = bitIndex ? 0 : 1;
    }
  }
}

// Loop Animation
function loop() {
  context.fillStyle = darkCyan;
  context.strokeStyle = lightCyan;
  context.clearRect(0, 0, WIDTH, HEIGHT);
  drawMessageSignal(t);
  drawSampleSignal(messageAmp, messageFreq, tSampling, samYPos, c);
  if (c % samplingInterval == 0) {
    tSampling += (PI / 180 / 400) * samplingInterval;
  }
  t += PI / 180 / 400;
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

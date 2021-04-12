let amplitudeCarrier = document.querySelector("#amplitudeCarrier");
let amplitudeCarrierUp = document.querySelector("#amplitudeCarrierUp");
let amplitudeCarrierDown = document.querySelector("#amplitudeCarrierDown");
let carrierSlider = document.querySelector("#carrier-slider");
let dutyCycle = document.querySelector("#dutyCycle");
let dutyCycleSlider = document.querySelector("#dutyCycle-slider");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");

// Initialization
let carrierAmp = 0;
let carrierFreq = 100;

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

const PI = Math.PI;

// Canvas Initialization
let context = oscilloscopeCanvas.getContext("2d");

//Variables
var messageBits = [0, 0, 0, 0, 0, 0, 0, 0],
  WIDTH = 600,
  HEIGHT = 600,
  bitSize = WIDTH / messageBits.length,
  bitIndex = 0,
  mapObj = new Map(),
  incrementStep = 1,
  yPostOff = HEIGHT / 3,
  f = 0,
  phaseDiff = 0,
  carrierYPos = [],
  pamYPos = [],
  sawYPos = [],
  c = 0,
  t = 0,
  tPAM = 0,
  duty = 0;

// Plot Graph Points
const drawSignal = (amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  var prev = 0;
  for (let i = 0; i < arr.length; i++) {
    let val = (duty * carrierAmp * 2) / 100 - carrierAmp;
    val = -val;
    if (prev < val && arr[i] >= val) {
      sawYPos.unshift([i, 0]);
    } else if (prev > val && arr[i] <= val) {
      sawYPos.unshift([i, -carrierAmp]);
    }
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, 2 * yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
    prev = arr[i];
  }
};

// Plot PWM Graph Points
const drawPWM = () => {
  context.fillStyle = darkCyan;
  context.strokeStyle = darkCyan;
  context.moveTo(0, 3 * yPostOff - yPostOff / 2);
  context.lineTo(WIDTH, 3 * yPostOff - yPostOff / 2);
  context.stroke();
  for (let i = 1; i < sawYPos.length; i++) {
    context.beginPath();
    context.moveTo(sawYPos[i - 1][0], 3 * yPostOff - yPostOff / 2);
    context.lineTo(
      sawYPos[i - 1][0],
      3 * yPostOff - yPostOff / 2 + sawYPos[i - 1][1]
    );
    context.lineTo(
      sawYPos[i][0],
      3 * yPostOff - yPostOff / 2 + sawYPos[i - 1][1]
    );
    context.lineTo(sawYPos[i][0], 3 * yPostOff - yPostOff / 2);
    context.stroke();
    context.closePath();
    if (sawYPos.length > WIDTH / 50) {
      sawYPos.pop();
    }
  }
};

// Draws Carrier Signal
const drawCarrierSignal = (t) => {
  drawSignal(carrierAmp, carrierFreq, t, carrierYPos);
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

//function to draw the message signal
function drawMessageSignal() {
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
  drawMessageSignal();
  drawCarrierSignal(t);
  drawPWM();
  if (c % 50 == 0) {
    tPAM += (PI / 180 / 200) * 50;
  }
  t += PI / 180 / 200;
  c += 1;
  requestAnimationFrame(loop);
}
loop();

// Handles change in Carrier Amplitude
const handleAmplitudeCarrier = (event) => {
  carrierAmp = parseInt(event.target.value);
  amplitudeCarrier.value = carrierAmp;
  carrierSlider.value = carrierAmp;
};

// Handles change in Duty Cycle
const handleDutyCycle = (event) => {
  duty = parseInt(event.target.value);
  dutyCycle.value = duty;
  dutyCycleSlider.value = duty;
};

// Listener for increasing Carrrier Amplitude
amplitudeCarrierUp.addEventListener("click", () => {
  if (carrierAmp < 50) {
    carrierAmp += 1;
    amplitudeCarrier.value = carrierAmp;
    carrierSlider.value = carrierAmp;
  }
});

// Listener for decreasing Carrrier Amplitude
amplitudeCarrierDown.addEventListener("click", () => {
  if (carrierAmp > 0) {
    carrierAmp -= 1;
    amplitudeCarrier.value = carrierAmp;
    carrierSlider.value = carrierAmp;
  }
});

carrierSlider.addEventListener("change", handleAmplitudeCarrier);
dutyCycleSlider.addEventListener("change", handleDutyCycle);

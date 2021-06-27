let amplitudeMessage = document.querySelector("#amplitudeMessage");
let amplitudeMessageUp = document.querySelector("#amplitudeMessageUp");
let amplitudeMessageDown = document.querySelector("#amplitudeMessageDown");
let messageSlider = document.querySelector("#message-slider");
let dutyCycle = document.querySelector("#dutyCycle");
let dutyCycleSlider = document.querySelector("#dutyCycle-slider");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");

// Initialization
let messageAmp = 0;
let messageFreq = 100;
let status = false;

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
  bitIndex = 0,
  mapObj = new Map(),
  incrementStep = 1,
  yPostOff = HEIGHT / 3,
  carrierYPos = [],
  sawYPos = [],
  f = 0,
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
    let val = (duty * messageAmp * 2) / 100 - messageAmp;
    val = -val;
    if (prev < val && arr[i] >= val) {
      sawYPos.unshift([i, 0]);
    } else if (prev > val && arr[i] <= val) {
      sawYPos.unshift([i, -messageAmp]);
    }
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
    prev = arr[i];
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

// Displays Signal Labels
const displaySignalLabel = () => {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("b(t)", 10, 20);
  context.fillText("m(t)", 10, 2 * yPostOff - yPostOff / 2 - 75);
  context.fillText("time(t)", 550, 2 * yPostOff - yPostOff / 2 - 20);
  context.fillText("message", 530, 2 * yPostOff - yPostOff / 2 - 75);
  context.fillText("pwm(t)", 10, 3 * yPostOff - yPostOff / 2 - 75);
  context.fillText("time(t)", 550, 3 * yPostOff - yPostOff / 2 - 20);
  context.fillText("pwm signal", 510, 3 * yPostOff - yPostOff / 2 - 75);
  context.closePath();
  context.beginPath();
  context.strokeStyle = darkCyan;
  canvas_arrow(
    context,
    0,
    yPostOff / 2,
    oscilloscopeCanvas.width,
    yPostOff / 2
  );
  context.stroke();
  context.closePath();
  context.beginPath();
  context.strokeStyle = darkCyan;
  canvas_arrow(
    context,
    0,
    2 * yPostOff - yPostOff / 2,
    oscilloscopeCanvas.width,
    2 * yPostOff - yPostOff / 2
  );
  context.stroke();
  context.closePath();
  context.beginPath();
  context.strokeStyle = darkCyan;
  canvas_arrow(
    context,
    0,
    3 * yPostOff - yPostOff / 2,
    oscilloscopeCanvas.width,
    3 * yPostOff - yPostOff / 2
  );
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
  drawSignal(messageAmp, messageFreq, t, carrierYPos);
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
  displaySignalLabel();
  drawCarrierSignal(t);
  drawPWM();
  if (c % 50 == 0) {
    tPAM += (PI / 180 / 200) * 50;
  }
  t += PI / 180 / 200;
  c += 1;
  if (status) {
    requestAnimationFrame(loop);
  }
}
loop();

// Handles change in Carrier Amplitude
const handleAmplitudeMessage = (event) => {
  messageAmp = parseInt(event.target.value);
  amplitudeMessage.value = messageAmp;
  messageSlider.value = messageAmp;
};

// Handles change in Duty Cycle
const handleDutyCycle = (event) => {
  duty = parseInt(event.target.value);
  dutyCycle.value = duty;
  dutyCycleSlider.value = duty;
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
dutyCycleSlider.addEventListener("change", handleDutyCycle);

toggle.addEventListener("click", () => {
  status = !status;
  loop();
  if (status) {
    toggle.innerHTML = "Pause";
  } else {
    toggle.innerHTML = "Play";
  }
});

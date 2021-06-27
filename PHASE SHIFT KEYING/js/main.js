let amplitudeCarrier = document.querySelector("#amplitudeCarrier");
let amplitudeCarrierUp = document.querySelector("#amplitudeCarrierUp");
let amplitudeCarrierDown = document.querySelector("#amplitudeCarrierDown");
let carrierSlider = document.querySelector("#carrier-slider");
let binInput1 = document.querySelector("#bin1");
let binInput2 = document.querySelector("#bin2");
let binInput3 = document.querySelector("#bin3");
let binInput4 = document.querySelector("#bin4");
let binInput5 = document.querySelector("#bin5");
let binInput6 = document.querySelector("#bin6");
let binInput7 = document.querySelector("#bin7");
let binInput8 = document.querySelector("#bin8");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");

// Initialization
let carrierAmp = 0;
let carrierFreq = 100;
let status = false;

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
  t = 0,
  incrementStep = 1,
  yPostOff = HEIGHT / 3,
  f = 0,
  phaseDiff = 0,
  carrierYPos = [];

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
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
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
    if (t >= bitIndex * bitSize && t < (bitIndex + 1) * bitSize) {
      mapObj.set(t, messageBits[bitIndex]);
    } else {
      bitIndex++;
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
      context.arc(k, yPostOff - yPostOff / 2 - carrierAmp, 2, 0, 2 * Math.PI);
      context.fill();
      context.closePath();
    }
  }
}

// Displays Signal Labels
const displaySignalLabel = () => {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("m(t)", 10, 20);
  context.fillText("c(t)", 10, oscilloscopeCanvas.height / 3 + 20);
  context.fillText("fsk(t)", 10, (2 * oscilloscopeCanvas.height) / 3 + 20);
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
  canvas_arrow(
    context,
    0,
    oscilloscopeCanvas.height / 6 - carrierAmp,
    600,
    oscilloscopeCanvas.height / 6 - carrierAmp
  );
  canvas_arrow(
    context,
    0,
    oscilloscopeCanvas.height / 2 - carrierAmp,
    600,
    oscilloscopeCanvas.height / 2 - carrierAmp
  );
  canvas_arrow(
    context,
    0,
    oscilloscopeCanvas.height / 2 + carrierAmp,
    600,
    oscilloscopeCanvas.height / 2 + carrierAmp
  );
  canvas_arrow(
    context,
    0,
    oscilloscopeCanvas.height / 2,
    600,
    oscilloscopeCanvas.height / 2
  );
  context.stroke();
  context.closePath();
};

//PSK Signal
function PSKSignal(phase) {
  context.fillStyle = darkCyan;
  context.strokeStyle = lightCyan;
  context.moveTo(0, 3 * yPostOff - yPostOff / 2);
  context.lineTo(WIDTH, 3 * yPostOff - yPostOff / 2);
  context.stroke();
  for (const k of mapObj.keys()) {
    if (mapObj.get(k) == 0) {
      context.beginPath();
      context.arc(
        k,
        3 * yPostOff -
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
        3 * yPostOff -
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

// Loop Animation
function loop() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  drawMessageSignal();
  displaySignalLabel();
  drawCarrierSignal(t);
  PSKSignal(phaseDiff);
  phaseDiff += 0.05;
  t += PI / 180 / 100;
  if (status) {
    requestAnimationFrame(loop);
  }
}
loop();

// Handles change in Carrier Amplitude
const handleAmplitudeCarrier = (event) => {
  carrierAmp = parseInt(event.target.value);
  amplitudeCarrier.value = carrierAmp;
  carrierSlider.value = carrierAmp;
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

// Input Binary Sequence Listeners
binInput1.addEventListener("click", () => {
  messageBits[0] = messageBits[0] + messageBits[0] ? 0 : 1;
  binInput1.innerHTML = messageBits[0];
  initializeMapObj();
});
binInput2.addEventListener("click", () => {
  messageBits[1] = messageBits[1] + messageBits[1] ? 0 : 1;
  binInput2.innerHTML = messageBits[1];
  initializeMapObj();
});
binInput3.addEventListener("click", () => {
  messageBits[2] = messageBits[2] + messageBits[2] ? 0 : 1;
  binInput3.innerHTML = messageBits[2];
  initializeMapObj();
});
binInput4.addEventListener("click", () => {
  messageBits[3] = messageBits[3] + messageBits[3] ? 0 : 1;
  binInput4.innerHTML = messageBits[3];
  initializeMapObj();
});
binInput5.addEventListener("click", () => {
  messageBits[4] = messageBits[4] + messageBits[4] ? 0 : 1;
  binInput5.innerHTML = messageBits[4];
  initializeMapObj();
});
binInput6.addEventListener("click", () => {
  messageBits[5] = messageBits[5] + messageBits[5] ? 0 : 1;
  binInput6.innerHTML = messageBits[5];
  initializeMapObj();
});
binInput7.addEventListener("click", () => {
  messageBits[6] = messageBits[6] + messageBits[6] ? 0 : 1;
  binInput7.innerHTML = messageBits[6];
  initializeMapObj();
});
binInput8.addEventListener("click", () => {
  messageBits[7] = messageBits[7] + messageBits[7] ? 0 : 1;
  binInput8.innerHTML = messageBits[7];
  initializeMapObj();
});
toggle.addEventListener("click", () => {
  status = !status;
  loop();
  if (status) {
    toggle.innerHTML = "Pause";
  } else {
    toggle.innerHTML = "Play";
  }
});

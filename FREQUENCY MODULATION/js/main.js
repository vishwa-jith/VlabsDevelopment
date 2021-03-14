let frequencyCarrier = document.querySelector("#frequencyCarrier");
let frequencyMessage = document.querySelector("#frequencyMessage");
let frequencyCarrierUp = document.querySelector("#frequencyCarrierUp");
let frequencyCarrierDown = document.querySelector("#frequencyCarrierDown");
let frequencyMessageUp = document.querySelector("#frequencyMessageUp");
let frequencyMessageDown = document.querySelector("#frequencyMessageDown");
let modulationIndex = document.querySelector("#modulationIndex");
let graphRep = document.querySelector("#graphRep");
let oscilloscope = document.querySelector("#oscilloscope");
let spectrum = document.querySelector("#spectrum");
let heading = document.querySelector("#heading");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");
let power = document.querySelector("#power");
let carrierSlider = document.querySelector("#carrier-slider");
let messageSlider = document.querySelector("#message-slider");
let spectrumCanvas = document.querySelector("#spectrum-canvas");

// Initialization
let carrierAmp = 30;
let messageAmp = 30;
let messageFreq = 0;
let carrierFreq = 100;
let graphType = "Oscilloscope";

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

// Canvas Initialization
let context = oscilloscopeCanvas.getContext("2d");
let spectrumContext = spectrumCanvas.getContext("2d");

var messageYPos = [],
  carrierYPos = [],
  fmYPos = [],
  t = 0;
const PI = Math.PI,
  beta = 5;

// Determines Type of Modulation
// const findModulation = () => {
//   if (carrierAmp < messageAmp) {
//     overModulation.style["background-color"] = darkCyan;
//     overModulation.style["color"] = lightCyan;
//     modulation.style["background-color"] = lightCyan;
//     modulation.style["color"] = darkCyan;
//     underModulation.style["background-color"] = lightCyan;
//     underModulation.style["color"] = darkCyan;
//   } else if (carrierAmp > messageAmp) {
//     overModulation.style["background-color"] = lightCyan;
//     overModulation.style["color"] = darkCyan;
//     modulation.style["background-color"] = lightCyan;
//     modulation.style["color"] = darkCyan;
//     underModulation.style["background-color"] = darkCyan;
//     underModulation.style["color"] = lightCyan;
//   } else {
//     overModulation.style["background-color"] = lightCyan;
//     overModulation.style["color"] = darkCyan;
//     modulation.style["background-color"] = darkCyan;
//     modulation.style["color"] = lightCyan;
//     underModulation.style["background-color"] = lightCyan;
//     underModulation.style["color"] = darkCyan;
//   }
// };

// Calculate Modulation Index
const calculateModulationIndex = () => {
  modulationIndex.value = ((10 * messageAmp) / messageFreq).toFixed(3);
};

// Calculate Power
const calculatePower = () => {
  power.value = (Math.pow(carrierAmp, 2) / 2).toFixed(2);
};

// Handles change in Carrier Frequency
const handleFrequencyCarrier = (event) => {
  carrierFreq = parseInt(event.target.value);
  frequencyCarrier.value = carrierFreq;
  carrierSlider.value = carrierFreq;
  // findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
};

// Handles change in Message Frequency
const handleFrequencyMessage = (event) => {
  messageFreq = parseInt(event.target.value);
  frequencyMessage.value = messageFreq;
  messageSlider.value = messageFreq;
  // findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
};

// Displays Signal Labels
const displaySignalLabel = () => {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("m(t)", 10, 20);
  context.fillText("c(t)", 10, oscilloscopeCanvas.height / 3 + 20);
  context.fillText("fm(t)", 10, (2 * oscilloscopeCanvas.height) / 3 + 20);
  context.closePath();
};

// Displays Spectrum Labels
function displaySpectrumLabel(context) {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("fc - fm", 130, 420);
  context.fillText("fc", 295, 420);
  context.fillText("fc + fm", 430, 420);
  context.fillText("Vc", 295, 390 - carrierFreq);
  context.fillText("mVc/2", 130, 390 - (carrierFreq - messageFreq));
  context.fillText("mVc/2", 430, 390 - (carrierFreq + messageFreq));
  context.closePath();
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

// Plot Graph Points
const drawSignal = (amplitude, frequency, t, arr, yOffset) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, yOffset - arr[i], 2, 0, 2 * PI);
    context.fill();
    context.closePath();
    if (arr.length > oscilloscopeCanvas.width) {
      arr.pop();
    }
  }
};

// Draws Message Signal
const drawMessageSignal = (t) => {
  drawSignal(
    messageAmp,
    messageFreq,
    t,
    messageYPos,
    oscilloscopeCanvas.height / 3 / 2
  );
};

// Draws Carrier Signal
const drawCarrierSignal = (t) => {
  drawSignal(
    carrierAmp,
    carrierFreq,
    t,
    carrierYPos,
    oscilloscopeCanvas.height / 3 + oscilloscopeCanvas.height / 3 / 2
  );
};

// Draws Modulated Signal
const drawFrequencyModulationSignal = (t, amArr, yOffset) => {
  let tempMessageValue = beta * Math.sin(2 * PI * messageFreq * t);
  let y = carrierAmp * Math.cos(2 * PI * carrierFreq * t + tempMessageValue);

  amArr.unshift(y);
  for (let i = 0; i < amArr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, yOffset - amArr[i], 2, 0, 2 * PI);
    context.fill();
    context.closePath();
    if (amArr.length > oscilloscopeCanvas.width) {
      amArr.pop();
    }
  }
};

// Draws Modulation Graphs
const drawSignals = (t) => {
  displaySignalLabel();
  drawMessageSignal(t);
  drawCarrierSignal(t);
  drawFrequencyModulationSignal(
    t,
    fmYPos,
    (2 * oscilloscopeCanvas.height) / 3 + oscilloscopeCanvas.height / 3 / 2
  );
};

// Resursive Ploting
function loop() {
  context.clearRect(0, 0, oscilloscopeCanvas.width, oscilloscopeCanvas.height);
  t += PI / 180 / 100;
  drawSignals(t);
  requestAnimationFrame(loop);
}
loop();

// Draws Spectrum
const drawSpectrum = () => {
  spectrumContext.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);
  displaySpectrumLabel(spectrumContext);
  spectrumContext.beginPath();
  spectrumContext.fillStyle = darkCyan;
  canvas_arrow(spectrumContext, 10, 400, 580, 400);
  canvas_arrow(spectrumContext, 11, 400, 10, 400);
  canvas_arrow(
    spectrumContext,
    150,
    400,
    150,
    400 - (carrierFreq - messageFreq)
  );
  canvas_arrow(
    spectrumContext,
    450,
    400,
    450,
    400 - (carrierFreq + messageFreq)
  );
  canvas_arrow(spectrumContext, 300, 400, 300, 400 - carrierFreq);
  spectrumContext.stroke();
};

// Controls Listeners
carrierSlider.addEventListener("change", handleFrequencyCarrier);
messageSlider.addEventListener("change", handleFrequencyMessage);
frequencyCarrier.addEventListener("change", handleFrequencyCarrier);
frequencyMessage.addEventListener("change", handleFrequencyMessage);

// Listener for increasing Carrrier Amplitude
frequencyCarrierUp.addEventListener("click", () => {
  if (carrierFreq < 200) {
    carrierFreq += 1;
    frequencyCarrier.value = carrierFreq;
    carrierSlider.value = carrierFreq;
  }
  // findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
});

// Listener for decreasing Carrrier Amplitude
frequencyCarrierDown.addEventListener("click", () => {
  if (carrierFreq > 100) {
    carrierFreq -= 1;
    frequencyCarrier.value = carrierFreq;
    carrierSlider.value = carrierFreq;
  }
  // findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
});

// Listener for increasing Message Amplitude
frequencyMessageUp.addEventListener("click", () => {
  if (messageFreq < 50) {
    messageFreq += 1;
    frequencyMessage.value = messageFreq;
    messageSlider.value = messageFreq;
  }
  // findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
});

// Listener for decreasing Message Amplitude
frequencyMessageDown.addEventListener("click", () => {
  if (messageFreq > 0) {
    messageFreq -= 1;
    frequencyMessage.value = messageFreq;
    messageSlider.value = messageFreq;
  }
  // findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
});

// Changes Graph Representation
graphRep.addEventListener("click", () => {
  tempRep = graphRep.innerHTML;
  graphRep.innerHTML = graphType;
  graphType = tempRep;
  if (graphType === "Oscilloscope") {
    oscilloscope.classList.remove("d-none");
    spectrum.classList.add("d-none");
  } else {
    spectrum.classList.remove("d-none");
    oscilloscope.classList.add("d-none");
  }
  heading.innerHTML = graphType;
  drawSpectrum();
});

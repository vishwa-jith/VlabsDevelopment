let amplitudeCarrier = document.querySelector("#amplitudeCarrier");
let amplitudeMessage = document.querySelector("#amplitudeMessage");
let amplitudeCarrierUp = document.querySelector("#amplitudeCarrierUp");
let amplitudeCarrierDown = document.querySelector("#amplitudeCarrierDown");
let amplitudeMessageUp = document.querySelector("#amplitudeMessageUp");
let amplitudeMessageDown = document.querySelector("#amplitudeMessageDown");
let modulation = document.querySelector("#modulation");
let overModulation = document.querySelector("#overModulation");
let underModulation = document.querySelector("#underModulation");
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
let toggle = document.querySelector("#toggle");

// Initialization
let carrierAmp = 0;
let messageAmp = 0;
let messageFreq = 20;
let carrierFreq = 100;
let graphType = "Oscilloscope";
let status = false;

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

// Canvas Initialization
let context = oscilloscopeCanvas.getContext("2d");
let spectrumContext = spectrumCanvas.getContext("2d");

var messageYPos = [],
  carrierYPos = [],
  amYPos = [],
  t = 0;
const PI = Math.PI;

// Determines Type of Modulation
const findModulation = () => {
  if (carrierAmp < messageAmp) {
    overModulation.style["background-color"] = darkCyan;
    overModulation.style["color"] = lightCyan;
    modulation.style["background-color"] = lightCyan;
    modulation.style["color"] = darkCyan;
    underModulation.style["background-color"] = lightCyan;
    underModulation.style["color"] = darkCyan;
  } else if (carrierAmp > messageAmp) {
    overModulation.style["background-color"] = lightCyan;
    overModulation.style["color"] = darkCyan;
    modulation.style["background-color"] = lightCyan;
    modulation.style["color"] = darkCyan;
    underModulation.style["background-color"] = darkCyan;
    underModulation.style["color"] = lightCyan;
  } else {
    overModulation.style["background-color"] = lightCyan;
    overModulation.style["color"] = darkCyan;
    modulation.style["background-color"] = darkCyan;
    modulation.style["color"] = lightCyan;
    underModulation.style["background-color"] = lightCyan;
    underModulation.style["color"] = darkCyan;
  }
};

// Calculate Modulation Index
const calculateModulationIndex = () => {
  modulationIndex.value = (messageAmp / carrierAmp).toFixed(3);
};

// Calculate Power
const calculatePower = () => {
  power.value = (Math.pow(messageAmp / Math.sqrt(2), 2) / 2).toFixed(2);
};

// Handles change in Carrier Amplitude
const handleAmplitudeCarrier = (event) => {
  carrierAmp = parseInt(event.target.value);
  amplitudeCarrier.value = carrierAmp;
  carrierSlider.value = carrierAmp;
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
};

// Handles change in Message Amplitude
const handleAmplitudeMessage = (event) => {
  messageAmp = parseInt(event.target.value);
  amplitudeMessage.value = messageAmp;
  messageSlider.value = messageAmp;
  findModulation();
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
  context.fillText("am(t)", 10, (2 * oscilloscopeCanvas.height) / 3 + 20);
  context.fillText(
    "time(t)",
    oscilloscopeCanvas.width - 80,
    oscilloscopeCanvas.height / 6 - 10
  );
  context.fillText(
    "time(t)",
    oscilloscopeCanvas.width - 80,
    oscilloscopeCanvas.height / 2 - 10
  );
  context.fillText(
    "time(t)",
    oscilloscopeCanvas.width - 80,
    oscilloscopeCanvas.height - oscilloscopeCanvas.height / 6 - 10
  );
  context.closePath();
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
  context.beginPath();
  context.fillStyle = darkCyan;
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
  context.fillStyle = darkCyan;
  canvas_arrow(
    context,
    0,
    oscilloscopeCanvas.height - oscilloscopeCanvas.height / 6,
    oscilloscopeCanvas.width,
    oscilloscopeCanvas.height - oscilloscopeCanvas.height / 6
  );
  context.stroke();
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
  context.fillText("Vc", 295, 390 - 2 * carrierAmp);
  context.fillText("mVc/2", 130, 390 - modulationIndex.value * carrierAmp);
  context.fillText("mVc/2", 430, 390 - modulationIndex.value * carrierAmp);
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
    if (i % 250 == 0) {
      context.fillText(
        `(${i}, ${parseInt(arr[i])})`,
        i + 5,
        yOffset - arr[i] - 5
      );
      context.arc(i, yOffset - arr[i], 5, 0, 2 * PI);
    }
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
const drawAmplitudeModulationSignal = (t, amArr, yOffset) => {
  let tempMessageValue = messageAmp * Math.cos(2 * PI * messageFreq * t);
  let y =
    (parseInt(carrierAmp) + tempMessageValue) *
    Math.cos(2 * PI * carrierFreq * t);
  amArr.unshift(y);
  for (let i = 0; i < amArr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, yOffset - amArr[i], 2, 0, 2 * PI);
    if (i % 250 == 0) {
      context.fillText(
        `(${i}, ${parseInt(amArr[i])})`,
        i + 5,
        yOffset - amArr[i] - 5
      );
      context.arc(i, yOffset - amArr[i], 5, 0, 2 * PI);
    }
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
  drawAmplitudeModulationSignal(
    t,
    amYPos,
    (2 * oscilloscopeCanvas.height) / 3 + oscilloscopeCanvas.height / 3 / 2
  );
};

// Resursive Ploting
function loop() {
  context.clearRect(0, 0, oscilloscopeCanvas.width, oscilloscopeCanvas.height);
  t += PI / 180 / 100;
  drawSignals(t);
  if (status) {
    requestAnimationFrame(loop);
  }
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
  if (carrierAmp !== 0 && parseFloat(modulationIndex.value) !== 0) {
    canvas_arrow(
      spectrumContext,
      150,
      400,
      150,
      400 - parseFloat(modulationIndex.value) * carrierAmp
    );
    canvas_arrow(
      spectrumContext,
      450,
      400,
      450,
      400 - parseFloat(modulationIndex.value) * carrierAmp
    );
  }
  if (carrierAmp !== 0) {
    canvas_arrow(spectrumContext, 300, 400, 300, 400 - 2 * carrierAmp);
  }
  spectrumContext.stroke();
};

// Controls Listeners
carrierSlider.addEventListener("change", handleAmplitudeCarrier);
messageSlider.addEventListener("change", handleAmplitudeMessage);
amplitudeCarrier.addEventListener("change", handleAmplitudeCarrier);
amplitudeMessage.addEventListener("change", handleAmplitudeMessage);

// Listener for increasing Carrrier Amplitude
amplitudeCarrierUp.addEventListener("click", () => {
  if (carrierAmp < 50) {
    carrierAmp += 1;
    amplitudeCarrier.value = carrierAmp;
    carrierSlider.value = carrierAmp;
  }
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
});

// Listener for decreasing Carrrier Amplitude
amplitudeCarrierDown.addEventListener("click", () => {
  if (carrierAmp > 0) {
    carrierAmp -= 1;
    amplitudeCarrier.value = carrierAmp;
    carrierSlider.value = carrierAmp;
  }
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
});

// Listener for increasing Message Amplitude
amplitudeMessageUp.addEventListener("click", () => {
  if (messageAmp < 50) {
    messageAmp += 1;
    amplitudeMessage.value = messageAmp;
    messageSlider.value = messageAmp;
  }
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
});

// Listener for decreasing Message Amplitude
amplitudeMessageDown.addEventListener("click", () => {
  if (messageAmp > 0) {
    messageAmp -= 1;
    amplitudeMessage.value = messageAmp;
    messageSlider.value = messageAmp;
  }
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
});

// Generates normal Modulation
modulation.addEventListener("click", () => {
  random = Math.floor(Math.random() * 51);
  carrierAmp = random;
  amplitudeCarrier.value = carrierAmp;
  carrierSlider.value = carrierAmp;
  messageAmp = random;
  amplitudeMessage.value = messageAmp;
  messageSlider.value = messageAmp;
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
});

// Generates Over Modulation
overModulation.addEventListener("click", () => {
  random = Math.floor(Math.random() * 8) + 8;
  carrierAmp = random;
  amplitudeCarrier.value = carrierAmp;
  carrierSlider.value = carrierAmp;
  messageAmp = 50 - random;
  amplitudeMessage.value = messageAmp;
  messageSlider.value = messageAmp;
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
});

// Generates Under Modulation
underModulation.addEventListener("click", () => {
  random = Math.floor(Math.random() * 8) + 8;
  carrierAmp = 50 - random;
  amplitudeCarrier.value = carrierAmp;
  carrierSlider.value = carrierAmp;
  messageAmp = random;
  amplitudeMessage.value = messageAmp;
  messageSlider.value = messageAmp;
  findModulation();
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

toggle.addEventListener("click", () => {
  status = !status;
  loop();
  if (status) {
    toggle.innerHTML = "Pause";
  } else {
    toggle.innerHTML = "Play";
  }
});

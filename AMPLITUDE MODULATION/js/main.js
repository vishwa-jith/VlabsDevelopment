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

let carrierAmp = 0;
let messageAmp = 0;
let messageFreq = 20;
let carrierFreq = 100;
let graphType = "Oscilloscope";

let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";
let isModulated = true;

let context = oscilloscopeCanvas.getContext("2d");
let spectrumContext = spectrumCanvas.getContext("2d");

var messageYPos = [],
  carrierYPos = [],
  amYPos = [],
  t = 0;
const PI = Math.PI;
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
function displaySignalLabel() {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("m(t)", 10, 20);
  context.fillText("c(t)", 10, oscilloscopeCanvas.height / 3 + 20);
  context.fillText("am(t)", 10, (2 * oscilloscopeCanvas.height) / 3 + 20);
  context.closePath();
}
const drawMessageSignal = (t) => {
  drawSignal(
    messageAmp,
    messageFreq,
    t,
    messageYPos,
    oscilloscopeCanvas.height / 3 / 2
  );
};

const drawCarrierSignal = (t) => {
  drawSignal(
    carrierAmp,
    carrierFreq,
    t,
    carrierYPos,
    oscilloscopeCanvas.height / 3 + oscilloscopeCanvas.height / 3 / 2
  );
};

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
    context.fill();
    context.closePath();
    if (amArr.length > oscilloscopeCanvas.width) {
      amArr.pop();
    }
  }
};

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
function loop() {
  context.clearRect(0, 0, oscilloscopeCanvas.width, oscilloscopeCanvas.height);
  t += PI / 180 / 100;
  drawSignals(t);
  requestAnimationFrame(loop);
}
loop();

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

const calculateModulationIndex = () => {
  modulationIndex.value = (messageAmp / carrierAmp).toFixed(3);
};
const calculatePower = () => {
  power.value = (Math.pow(messageAmp / Math.sqrt(2), 2) / 2).toFixed(2);
};

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

const handleAmplitudeCarrier = (event) => {
  carrierAmp = parseInt(event.target.value);
  amplitudeCarrier.value = carrierAmp;
  carrierSlider.value = carrierAmp;
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
};

const handleAmplitudeMessage = (event) => {
  messageAmp = parseInt(event.target.value);
  amplitudeMessage.value = messageAmp;
  messageSlider.value = messageAmp;
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
};

carrierSlider.addEventListener("change", handleAmplitudeCarrier);
messageSlider.addEventListener("change", handleAmplitudeMessage);
amplitudeCarrier.addEventListener("change", handleAmplitudeCarrier);
amplitudeMessage.addEventListener("change", handleAmplitudeMessage);

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

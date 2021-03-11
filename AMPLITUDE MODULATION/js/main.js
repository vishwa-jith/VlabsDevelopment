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

let carrierAmp = 100;
let messageAmp = 0;
let graphType = "Oscilloscope";

let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

let context = oscilloscopeCanvas.getContext("2d");
var messageYPos = [],
  carrierYPos = [],
  amplitude = 30,
  frequency = 20,
  t = 0;
const PI = Math.PI;
const drawSignals = (t) => {
  displaySignalLabel();
  drawMessageSignal(t);
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
  drawSignal(messageAmp, t, messageYPos, oscilloscopeCanvas.height / 3 / 2);
};

const drawCarrierSignal = (t) => {
  drawSignal(carrierAmp, t, carrierYPos, oscilloscopeCanvas.height / 3 / 2);
};

const drawSignal = (amplitude, t, arr, yOffset) => {
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

const calculateModulationIndex = () => {
  modulationIndex.value = (messageAmp / carrierAmp).toFixed(3);
};

const findModulation = () => {
  console.log(carrierAmp, messageAmp);
  if (carrierAmp > messageAmp) {
    overModulation.style["background-color"] = darkCyan;
    overModulation.style["color"] = lightCyan;
    modulation.style["background-color"] = lightCyan;
    modulation.style["color"] = darkCyan;
    underModulation.style["background-color"] = lightCyan;
    underModulation.style["color"] = darkCyan;
  } else if (carrierAmp < messageAmp) {
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
  carrierAmp = event.target.value;
  amplitudeCarrier.value = carrierAmp;
  findModulation();
  calculateModulationIndex();
};

const handleAmplitudeMessage = (event) => {
  messageAmp = event.target.value;
  amplitudeMessage.value = messageAmp;
  findModulation();
  calculateModulationIndex();
};

amplitudeCarrier.addEventListener("change", handleAmplitudeCarrier);
amplitudeMessage.addEventListener("change", handleAmplitudeMessage);

amplitudeCarrierUp.addEventListener("click", () => {
  if (carrierAmp <= 160) {
    carrierAmp += 20;
    amplitudeCarrier.value = carrierAmp;
  }
  findModulation();
  calculateModulationIndex();
});

amplitudeCarrierDown.addEventListener("click", () => {
  if (carrierAmp >= 120) {
    carrierAmp -= 20;
    amplitudeCarrier.value = carrierAmp;
  }
  findModulation();
  calculateModulationIndex();
});

amplitudeMessageUp.addEventListener("click", () => {
  if (messageAmp <= 160) {
    messageAmp += 20;
    amplitudeMessage.value = messageAmp;
  }
  findModulation();
  calculateModulationIndex();
});

amplitudeMessageDown.addEventListener("click", () => {
  if (messageAmp >= 120) {
    messageAmp -= 20;
    amplitudeMessage.value = messageAmp;
  }
  findModulation();
  calculateModulationIndex();
});

modulation.addEventListener("click", () => {
  carrierAmp = 140;
  amplitudeCarrier.value = carrierAmp;
  messageAmp = 140;
  amplitudeMessage.value = messageAmp;
  findModulation();
  calculateModulationIndex();
});

overModulation.addEventListener("click", () => {
  carrierAmp = 160;
  amplitudeCarrier.value = carrierAmp;
  messageAmp = 120;
  amplitudeMessage.value = messageAmp;
  findModulation();
  calculateModulationIndex();
});

underModulation.addEventListener("click", () => {
  carrierAmp = 120;
  amplitudeCarrier.value = carrierAmp;
  messageAmp = 160;
  amplitudeMessage.value = messageAmp;
  findModulation();
  calculateModulationIndex();
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
});

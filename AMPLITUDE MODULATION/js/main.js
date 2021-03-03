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

let carrierAmp = 100;
let messageAmp = 100;
let graphType = "Oscilloscope";

let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

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
  if (carrierAmp == 120 && event.target.value < 120) {
    carrierAmp = 100;
    amplitudeCarrier.value = carrierAmp;
  } else if (carrierAmp == 140 && event.target.value < 140) {
    carrierAmp = 120;
    amplitudeCarrier.value = carrierAmp;
  } else if (carrierAmp == 160 && event.target.value < 160) {
    carrierAmp = 140;
    amplitudeCarrier.value = carrierAmp;
  } else if (carrierAmp == 180 && event.target.value < 180) {
    carrierAmp = 160;
    amplitudeCarrier.value = carrierAmp;
  } else if (event.target.value < 100) {
    carrierAmp = 100;
    amplitudeCarrier.value = carrierAmp;
  } else if (event.target.value > 100 && event.target.value < 120) {
    carrierAmp = 120;
    amplitudeCarrier.value = carrierAmp;
  } else if (event.target.value > 120 && event.target.value < 140) {
    carrierAmp = 140;
    amplitudeCarrier.value = carrierAmp;
  } else if (event.target.value > 140 && event.target.value < 160) {
    carrierAmp = 160;
    amplitudeCarrier.value = carrierAmp;
  } else {
    carrierAmp = 180;
    amplitudeCarrier.value = carrierAmp;
  }
  findModulation();
  calculateModulationIndex();
};

const handleAmplitudeMessage = (event) => {
  if (messageAmp == 120 && event.target.value < 120) {
    messageAmp = 100;
    amplitudeMessage.value = messageAmp;
  } else if (messageAmp == 140 && event.target.value < 140) {
    messageAmp = 120;
    amplitudeMessage.value = messageAmp;
  } else if (messageAmp == 160 && event.target.value < 160) {
    messageAmp = 140;
    amplitudeMessage.value = messageAmp;
  } else if (messageAmp == 180 && event.target.value < 180) {
    messageAmp = 160;
    amplitudeMessage.value = messageAmp;
  } else if (event.target.value < 100) {
    messageAmp = 100;
    amplitudeMessage.value = messageAmp;
  } else if (event.target.value > 100 && event.target.value < 120) {
    messageAmp = 120;
    amplitudeMessage.value = messageAmp;
  } else if (event.target.value > 120 && event.target.value < 140) {
    messageAmp = 140;
    amplitudeMessage.value = messageAmp;
  } else if (event.target.value > 140 && event.target.value < 160) {
    messageAmp = 160;
    amplitudeMessage.value = messageAmp;
  } else {
    messageAmp = 180;
    amplitudeMessage.value = messageAmp;
  }
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

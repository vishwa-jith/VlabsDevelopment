let oscilloscopeCanvas1 = document.querySelector("#oscilloscope-canvas1");
let oscilloscopeCanvas2 = document.querySelector("#oscilloscope-canvas2");
let oscilloscopeCanvas3 = document.querySelector("#oscilloscope-canvas3");
let canvas = document.querySelectorAll("canvas");
let selectWave = document.querySelector("#selectWave");
let selectedWave = document.querySelector("#selectedWave");
let amplitudeMessage = document.querySelector("#amplitudeMessage");
let frequencyMessage = document.querySelector("#frequencyMessage");
let oscilloscope = document.querySelector("#oscilloscope");
let spectrum = document.querySelector("#spectrum");
let graphRep = document.querySelector("#graphRep");
let heading = document.querySelector("#heading");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");
let backButton = document.querySelector("#backButton");
let spectrumCanvas = document.querySelector("#spectrum-canvas");

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

// Canvas Initialization
let context1 = oscilloscopeCanvas1.getContext("2d");
let context2 = oscilloscopeCanvas2.getContext("2d");
let context3 = oscilloscopeCanvas3.getContext("2d");
let spectrumContext = spectrumCanvas.getContext("2d");

// Initialization
var amYPos1 = [],
  amYPos2 = [],
  amYPos3 = [],
  t = 0;
let graphType = "Oscilloscope";
const PI = Math.PI;
let currentCanvas = null;
let parameters = [
  {
    amArr: amYPos1,
    context: context1,
    messageAmp: 10,
    messageFreq: 20,
    carrierAmp: 40,
    carrierFreq: 100,
  },
  {
    amArr: amYPos2,
    context: context2,
    messageAmp: 30,
    messageFreq: 20,
    carrierAmp: 30,
    carrierFreq: 100,
  },
  {
    amArr: amYPos3,
    context: context3,
    messageAmp: 43,
    messageFreq: 20,
    carrierAmp: 7,
    carrierFreq: 100,
  },
];

// displays signals label
function displaySignalLabel(context) {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("am(t)", 10, 20);
  context.fillText(
    "time(t)",
    oscilloscopeCanvas.width - 80,
    oscilloscopeCanvas.height / 2 - 10
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
}

// draws amplitude modulation signal
const drawAmplitudeModulationSignal = (
  context,
  t,
  amArr,
  yOffset,
  messageAmp,
  messageFreq,
  carrierAmp,
  carrierFreq
) => {
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
    if (amArr.length > oscilloscopeCanvas1.width) {
      amArr.pop();
    }
  }
};

// draws signals
const drawSignals = (
  context,
  t,
  amYPos,
  messageAmp,
  messageFreq,
  carrierAmp,
  carrierFreq
) => {
  displaySignalLabel(context);
  drawAmplitudeModulationSignal(
    context,
    t,
    amYPos,
    oscilloscopeCanvas1.height / 2,
    messageAmp,
    messageFreq,
    carrierAmp,
    carrierFreq
  );
};

// loop
function loop() {
  context1.clearRect(
    0,
    0,
    oscilloscopeCanvas1.width,
    oscilloscopeCanvas1.height
  );
  context2.clearRect(
    0,
    0,
    oscilloscopeCanvas1.width,
    oscilloscopeCanvas1.height
  );
  context3.clearRect(
    0,
    0,
    oscilloscopeCanvas1.width,
    oscilloscopeCanvas1.height
  );
  t += PI / 180 / 100;
  for (var i = 0; i < parameters.length; i++) {
    drawSignals(
      parameters[i].context,
      t,
      parameters[i].amArr,
      parameters[i].messageAmp,
      parameters[i].messageFreq,
      parameters[i].carrierAmp,
      parameters[i].carrierFreq
    );
  }
  requestAnimationFrame(loop);
}
loop();

canvas.forEach((item) => {
  item.addEventListener("click", (event) => {
    currentCanvas = event.target.id.slice(-1);
    selectWave.classList.add("d-none");
    selectedWave.classList.remove("d-none");
    amplitudeMessage.value = parameters[currentCanvas - 1].messageAmp;
    frequencyMessage.value = parameters[currentCanvas - 1].messageFreq;

    // Initialize
    let context = oscilloscopeCanvas.getContext("2d");
    var messageYPos = [],
      t = 0;
    const PI = Math.PI;

    // displays Signal Labels
    function displaySignalLabel() {
      context.beginPath();
      context.fillStyle = darkCyan;
      context.font = "16px Arial";
      context.fillText("m(t)", 10, 20);
      context.closePath();
    }

    // draws signals
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

    // draws message signals
    const drawMessageSignal = (t) => {
      drawSignal(
        parameters[currentCanvas - 1].messageAmp,
        parameters[currentCanvas - 1].messageFreq,
        t,
        messageYPos,
        oscilloscopeCanvas.height / 2
      );
    };

    // draws signals
    const drawSignals = (t) => {
      displaySignalLabel();
      drawMessageSignal(t);
    };

    // loop
    function loop() {
      context.clearRect(
        0,
        0,
        oscilloscopeCanvas.width,
        oscilloscopeCanvas.height
      );
      t += PI / 180 / 100;
      drawSignals(t);
      requestAnimationFrame(loop);
    }
    loop();
  });
});

// displays spectrum Labels
function displaySpectrumLabel(context) {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("fc - fm", 130, 420);
  context.fillText("fc", 295, 420);
  context.fillText("fc + fm", 430, 420);
  context.fillText(
    "Vc",
    295,
    390 - 2 * parameters[currentCanvas - 1].carrierAmp
  );
  context.fillText(
    "mVc/2",
    130,
    390 - parameters[currentCanvas - 1].messageAmp
  );
  context.fillText(
    "mVc/2",
    430,
    390 - parameters[currentCanvas - 1].messageAmp
  );
  context.closePath();
}

// creates line with arrow heads
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

// draws spectrum
const drawSpectrum = () => {
  spectrumContext.clearRect(0, 0, spectrumCanvas.width, spectrumCanvas.height);
  displaySpectrumLabel(spectrumContext);
  spectrumContext.beginPath();
  spectrumContext.fillStyle = darkCyan;
  canvas_arrow(spectrumContext, 10, 400, 580, 400);
  canvas_arrow(spectrumContext, 11, 400, 10, 400);
  if (
    parameters[currentCanvas - 1].carrierAmp !== 0 &&
    parseFloat(
      parameters[currentCanvas - 1].messageAmp /
        parameters[currentCanvas - 1].carrierAmp
    ) !== 0
  ) {
    canvas_arrow(
      spectrumContext,
      150,
      400,
      150,
      400 - parameters[currentCanvas - 1].messageAmp
    );
    canvas_arrow(
      spectrumContext,
      450,
      400,
      450,
      400 - parameters[currentCanvas - 1].messageAmp
    );
  }
  if (parameters[currentCanvas - 1].carrierAmp !== 0) {
    canvas_arrow(
      spectrumContext,
      300,
      400,
      300,
      400 - 2 * parameters[currentCanvas - 1].carrierAmp
    );
  }
  spectrumContext.stroke();
};

graphRep.addEventListener("click", () => {
  tempRep = graphRep.innerHTML;
  graphRep.innerHTML = graphType;
  graphType = tempRep;
  if (graphType === "Oscilloscope") {
    oscilloscopeCanvas.classList.remove("d-none");
    spectrum.classList.add("d-none");
  } else {
    spectrum.classList.remove("d-none");
    oscilloscopeCanvas.classList.add("d-none");
  }
  heading.innerHTML = graphType;
  drawSpectrum();
});

backButton.addEventListener("click", () => {
  selectWave.classList.remove("d-none");
  selectedWave.classList.add("d-none");
  currentCanvas = null;
  graphRep.innerHTML = "Spectrum";
  graphType = "Oscilloscope";
  oscilloscopeCanvas.classList.remove("d-none");
  spectrum.classList.add("d-none");
});

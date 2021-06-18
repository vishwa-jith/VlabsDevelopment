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

let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";
var fmYPos1 = [],
  fmYPos2 = [],
  fmYPos3 = [],
  t = 0,
  beta = 5;
let graphType = "Oscilloscope";
const PI = Math.PI;
let context1 = oscilloscopeCanvas1.getContext("2d");
let context2 = oscilloscopeCanvas2.getContext("2d");
let context3 = oscilloscopeCanvas3.getContext("2d");
let spectrumContext = spectrumCanvas.getContext("2d");

let currentCanvas = null;

let parameters = [
  {
    amArr: fmYPos1,
    context: context1,
    messageAmp: 10,
    messageFreq: 30,
    carrierAmp: 20,
    carrierFreq: 200,
  },
  {
    amArr: fmYPos2,
    context: context2,
    messageAmp: 30,
    messageFreq: 45,
    carrierAmp: 30,
    carrierFreq: 200,
  },
  {
    amArr: fmYPos3,
    context: context3,
    messageAmp: 43,
    messageFreq: 20,
    carrierAmp: 30,
    carrierFreq: 200,
  },
];

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

function displaySignalLabel(context) {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("am(t)", 10, 20);
  context.fillText("am(t)", 550, 65);
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
}

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
  let tempMessageValue = beta * Math.sin(2 * PI * messageFreq * t);
  let y = carrierAmp * Math.cos(2 * PI * carrierFreq * t + tempMessageValue);

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
    if (amArr.length > oscilloscopeCanvas1.width) {
      amArr.pop();
    }
  }
};

const drawMessageSignal = (t) => {
  drawSignal(
    messageAmp,
    messageFreq,
    t,
    messageYPos,
    oscilloscopeCanvas.height / 3 / 2
  );
};

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

    let context = oscilloscopeCanvas.getContext("2d");
    var messageYPos = [],
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
      context.closePath();
    }
    const drawMessageSignal = (t) => {
      drawSignal(
        parameters[currentCanvas - 1].messageAmp,
        parameters[currentCanvas - 1].messageFreq,
        t,
        messageYPos,
        oscilloscopeCanvas.height / 2
      );
    };

    const drawSignal = (amplitude, frequency, t, arr, yOffset) => {
      let y = amplitude * Math.cos(2 * PI * frequency * t);
      context.fillText("time(t)", 550, 65);
      arr.unshift(y);
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

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
  carrierYPos = [],
  c = 0,
  tPAM = 0,
  pamYPos = [];

// Plot Graph Points
const drawSignal = (amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, 2 * yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};
// Plot PAM Graph Points
const drawPAMSignal = (amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, 3 * yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.lineTo(i, 3 * yPostOff - yPostOff / 2);
    context.stroke();
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
    if (t % 15 !== 0) {
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

// Loop Animation
function loop() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  drawMessageSignal();
  drawCarrierSignal(t);
  drawPAMSignal(carrierAmp, carrierFreq, tPAM, pamYPos);
  phaseDiff += 0.05;
  if (c % 15 == 0) {
    tPAM += (PI / 180 / 200) * 15;
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

// // https://www.youtube.com/watch?v=H81Tdrmz2LA
// // In leui of a 3d renderer (like webgl/3js etc)
// // I use overlapped rectangled of different colors
// // to imply 3d when threeD is set to true

// var threeD = false;
// var numLines = 30;
// var speed = 0.03;
// var rads = 2;
// var phase = 1;
// var lineGap = 3;
// var boxMaxHeight = 150;
// var numRows = 20;
// var lines = [];
// var startAngle = 0,t=0;

// function setup() {
//   background(0);
//   createCanvas(600, 200);
//   rectMode(CENTER);
//   // strokeWeight(2);
//   // stroke(255);
//   noFill();
//   dataSet = []
//   if (threeD == false) {
//     dataSet.push(createData(0, 'white'))
//   } else {
//     for (var i=0; i<numRows; i++){
//      data = createData(
//        phase*PI*i/numRows,
//        color(random(255),random(255),random(255))
//                       );
//      dataSet.push(data)
//     }
//     // console.log(lines[0])
//   }
// }

// function draw() {
//   background(0);
//   translate(width/2, height/2)
//   dataSet.forEach(set=>drawRect(set))
// }

// function createData(startAngle=0, col) {
//   var arr = []
//   var visWidth = width/2 - 30
//   for (var i=0; i<numLines; i ++ ){
//     var obj = {
//       angle: 20 * Math.cos(2 * PI * 100 * t),
//       width: (visWidth/numLines),
//       offset: i*(visWidth/numLines),
//       col: col
//     }
//     arr.push(obj)
//       t += PI / 180 / 100;
//   }
//   return arr
// }

// function drawRect(lines) {
//   lines.forEach(box => {
//     fill(box.col)
//     // stroke(box.col)
//     rect(
//       box.offset,
//       0,
//       box.width - lineGap,
//       sinValue(box.angle)
//         );
//     rect(
//       - box.offset,
//       0,
//       box.width - lineGap,
//       sinValue(box.angle)
//         );
//     box.angle -= speed
//   })
// }

// function sinValue(angle) {
//   return map(sin(angle), -1, 1, 0, boxMaxHeight)
// }

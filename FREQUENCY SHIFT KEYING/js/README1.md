# javascript
---
```
let oscilloscopeCanvas1 = document.querySelector("#oscilloscope-canvas1");
let oscilloscopeCanvas2 = document.querySelector("#oscilloscope-canvas2");
let oscilloscopeCanvas3 = document.querySelector("#oscilloscope-canvas3");
let canvas = document.querySelectorAll("canvas");
let selectWave = document.querySelector("#selectWave");
let selectedWave = document.querySelector("#selectedWave");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");


let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";


let context1 = oscilloscopeCanvas1.getContext("2d");
let context2 = oscilloscopeCanvas2.getContext("2d");
let context3 = oscilloscopeCanvas3.getContext("2d");
let context = oscilloscopeCanvas.getContext("2d");

```
The **document.querySelector()** method returns the first element that matches a specified CSS selector(s) in the document . The oscilloscopeCanvas1 , oscilloscopeCanvas2 , oscilloscopeCanvas3 , canvas , selectWave , selectedWave , oscilloscopeCanvas . *darkCyan, lightCyan, light* defines the colors used in the application. **context1,context2 ,context3, context** canvas is initialized to draw **2D objects**.

```
var t = 0,
  bitSize = 0,
  incrementStep = 1,
  WIDTH = 600,
  HEIGHT = 150,
  phaseDiff = 0,
  f = 0,
  yPostOff = 150,
  bitIndex = 0,
  mapObj = new Map();

let graphType = "Oscilloscope";
const PI = Math.PI;
let currentCanvas = null;
```
The above code block initializes required **keywords**, The variable *t,bitsize,phaseDiff,bitIndex, f* is assigned to zero. The width is assigned to 600. The height is assigned to 150 . The yPostOff is assigned to 150 .The currentCanvas  is assigned to null.

```
let parameters = [
  {
    context: context1,
    messageBits: [1, 1, 0, 1, 0, 0, 1, 0],
    carrierAmp: 40,
    carrierFreq: 100,
  },
  {
    context: context2,
    messageBits: [0, 1, 1, 0, 0, 0, 1, 1],
    carrierAmp: 30,
    carrierFreq: 100,
  },
  {
    context: context3,
    messageBits: [0, 0, 1, 0, 1, 1, 0, 0],
    carrierAmp: 50,
    carrierFreq: 100,
  },
];
```
_In the  code parameteres variable assign value for **context , messageBits,  carrierAmp, carrierFreq** values respectively._


```
function initializeMapObj(messageBits) {
  t = 0;
  bitIndex = 0;
  bitSize = WIDTH / messageBits.length;
  var mapObj = new Map();
  for (; t < WIDTH; t += incrementStep) {
    if (t >= bitIndex * bitSize && t < (bitIndex + 1) * bitSize) {
      mapObj.set(t, messageBits[bitIndex]);
    } else {
      bitIndex++;
    }
  }
  return mapObj;
}
```
The **initializeMapObj** function is declared , t is assigned to zero and bitIndex is assigned to zero . For all the variables if t is lesser tham width ,enters the if condition , if its true then the mapobj is called . Else the BitImdex is incremented .

```
function drawMessageSignal(context, carrierAmp, mapObj) {
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
```
In the above code the function **drawMessageSignal** is declared , The *fillStyle* property fills the color of the label with darkCyan.
The *strokeStyle* property specifies the color, gradient, or pattern to use for the strokes (outlines) around shapes. The default is #000 (black), but lightCyan is assgined here.The *moveTo* begins a new sub-path at the point specified by the given (x, y) coordinates.The *lineTo* adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates. For all the constant k in  mapObj.keys() function . If that value is equal to 0 then the ,the beginPath() is used to start the canvas. .The arc() method creates a circular arc centered at (x, y) with a radius of radius. The path starts at startAngle, ends at endAngle, and travels in the direction given by counterclockwise.ClosePath() is used to close the canvas. Else the same is reapeated with different values .

```
function FSKSignal(context, phase, carrierAmp, mapObj) {
  context.fillStyle = darkCyan;
  context.strokeStyle = lightCyan;
  context.moveTo(0, yPostOff - yPostOff / 2);
  context.lineTo(WIDTH, yPostOff - yPostOff / 2);
  context.stroke();
  for (const k of mapObj.keys()) {
    if (mapObj.get(k) == 0) {
      context.beginPath();
      context.arc(
        k,
        yPostOff -
          yPostOff / 2 -
          carrierAmp * Math.sin(2 * Math.PI * f + phase),
        2,
        0,
        2 * Math.PI
      );
      context.fill();
      context.closePath();
      if (carrierAmp) {
        f += (1 / carrierAmp) * 0.64;
      }
    } else {
      context.beginPath();
      context.arc(
        k,
        yPostOff -
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
```
In the above code the function **FSKSignal** is declared , The *fillStyle* property fills the color of the label with darkCyan.
The *strokeStyle* property specifies the color, gradient, or pattern to use for the strokes (outlines) around shapes. The default is #000 (black), but lightCyan is assgined here.The *moveTo* begins a new sub-path at the point specified by the given (x, y) coordinates.The *lineTo* adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates. For all the constant k in  mapObj.keys() function . If that value is equal to 0 then the ,the beginPath() is used to start the canvas. .The arc() method creates a circular arc centered at (x, y) with a radius of radius. The path starts at startAngle, ends at endAngle, and travels in the direction given by counterclockwise.ClosePath() is used to close the canvas.Then f is assigned to zero . Else the same is reapeated with different values .

```
function loop() {
  for (var i = 0; i < parameters.length; i++) {
    parameters[i].context.clearRect(0, 0, WIDTH, HEIGHT);

    FSKSignal(
      parameters[i].context,
      phaseDiff,
      parameters[i].carrierAmp,
      initializeMapObj(parameters[i].messageBits)
    );
  }

  //   drawMessageSignal();
  phaseDiff += 0.05;
  t += PI / 180 / 100;
  requestAnimationFrame(loop);
}
loop();
```
The **loop** function resursively on completion of one cyle of drawing animated graphs. For all the variables,when the i is equal to 1 and if  i is less than parameters.length, then the clearRect() method clears the specified pixels within a given rectangle.Then the phasediff is incremented by 0.05 . T is incremented by PI / 180 /100. Atlast loop function is called .

```
canvas.forEach((item) => {
  item.addEventListener("click", (event) => {
    currentCanvas = parseInt(event.target.id.slice(-1));
    selectWave.classList.add("d-none");
    selectedWave.classList.remove("d-none");

    
    function loop() {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      drawMessageSignal(
        context,
        parameters[currentCanvas - 1].carrierAmp,
        initializeMapObj(parameters[currentCanvas - 1].messageBits)
      );

      t += PI / 180 / 100;
      phaseDiff += 0.05;
      requestAnimationFrame(loop);
    }
    loop();
  });
});
```
The forEach() method calls a function once for each element in an array, in order.To the item variable  click event is added using addEventListener.The  currentCanvas  variable is assigned to the parseInt() Function.The  parseInt()  function  parses  a  string  and  returns  an  integer.  In the parseInt() Function  is assigned to Target . The  target  event property  returns  the value  of  the  element  that  triggered  the  event.  d-none is removed from the  selectWave'classlist  and  is added to the  selectedWave'classlist . In th  loop function the clearRect() method clears the specified pixels within a given rectangle . The drawMessageSignal function is called . Then the phasediff is incremented by 0.05 . T is incremented by PI / 180 /100. Atlast loop function is called .

```
backButton.addEventListener("click", () => {
  selectWave.classList.remove("d-none");
  selectedWave.classList.add("d-none");
});
```
_In the above  code backButton variable ,click event is assigned using the addEventListener. d-none is removed from the  selectWave'classlist  and  is added to the  selectedWave'classlist .



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
var WIDTH = 600,
  HEIGHT = 600,
  mapObj = new Map(),
  incrementStep = 1,
  yPostOff = 150,
  f = 0,
  c = 0,
  t = 0,
  tPAM = 0;

const PI = Math.PI;
let currentCanvas = null;
```
The above code block initializes required **keywords**, The variable *t,c, f,tPAM* is assigned to zero. The width is assigned to 600. The height is assigned to 600 . The yPostOff is assigned to 150 .The currentCanvas  is assigned to null.

```
let parameters = [
  {
    context: context1,
    messageAmp: 39,
    messageFreq: 100,
    messsageYPos: [],
    pamYPos: [],
  },
  {
    context: context2,
    messageAmp: 30,
    messageFreq: 100,
    messsageYPos: [],
    pamYPos: [],
  },
  {
    context: context3,
    messageAmp: 50,
    messageFreq: 100,
    messsageYPos: [],
    pamYPos: [],
  },
];
```
_In the  code parameteres variable assign value for **context ,messageAmp,messageFreq,messsageYPos, pamYPos** values respectively._

```
const drawSignal = (context, amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};
```
The **drawSignal** function draws signals based on the parameters context,amplitude, frequency, time. The y position of the Signal is determined using the below formula,

### y = A cos(2πft)
where,
    A - amplitude of message/carrier signal  
    f - frequency of message/carrier signal  

The *unsift* function inserts the calculated y position into the array **arr**. The *arc* function draws arcs based on the provided data points with its phase shift. The *fillStyle* property fills the color of the label with darkCyan. The *closePath* close the path of the canvas context. 

```
const drawPAMSignal = (context, amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.strokeStyle = darkCyan;
    context.arc(i, yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.lineTo(i, yPostOff - yPostOff / 2);
    context.stroke();
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};

```
The **drawPAMSignal** function draws signals based on the parameters context,amplitude, frequency, time. The y position of the Signal is determined using the below formula,

### y = A cos(2πft)
where,
    A - amplitude of message/carrier signal  
    f - frequency of message/carrier signal  

The *unsift* function inserts the calculated y position into the array **arr**. The *arc* function draws arcs based on the provided data points with its phase shift. The *fillStyle* property fills the color of the label with darkCyan. The *closePath* close the path of the canvas context.The *lineTo* adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates.

```
const drawMessageSignal = (
  context,
  messageAmp,
  messageFreq,
  t,
  messsageYPos
) => {
  drawSignal(context, messageAmp, messageFreq, t, messsageYPos);
};

initializeMapObj();
```
The **drawMessageSignal** function draws carrier signal based on the paramters amplitude, frequency, time, message signal positions of carrier signal and its offset. The **drawSignal** functions draws signals based on carrier signals points.The initializeMapObj function is called here 

```
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

```
The **initializeMapObj** function is declared , t is assigned to zero and bitIndex is assigned to zero . For all the variables if t is lesser tham width ,enters the if condition , if its true then the mapobj is called . Else the BitImdex is incremented .


```
function loop() {
  for (var i = 0; i < parameters.length; i++) {
    parameters[i].context.clearRect(0, 0, WIDTH, HEIGHT);
    drawPAMSignal(
      parameters[i].context,
      parameters[i].messageAmp,
      parameters[i].messageFreq,
      tPAM,
      parameters[i].pamYPos
    );
  }
  if (c % 15 == 0) {
    tPAM += (PI / 180 / 200) * 15;
  }
  t += PI / 180 / 200;
  c += 1;

  requestAnimationFrame(loop);
}
loop();
```
The **loop** function resursively on completion of one cyle of drawing animated graphs. For all the variables,when the i is equal to 0 and if  i is less than parameters.length, then the clearRect() method clears the specified pixels within a given rectangle. T is incremented by PI / 180 /100. Atlast loop function is called .

```

canvas.forEach((item) => {
  item.addEventListener("click", (event) => {
    currentCanvas = parseInt(event.target.id.slice(-1));
    selectWave.classList.add("d-none");
    selectedWave.classList.remove("d-none");

    var t = 0,
      messageYPos = [];

    // loop
    function loop() {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      drawMessageSignal(
        context,
        parameters[currentCanvas - 1].messageAmp,
        parameters[currentCanvas - 1].messageFreq,
        t,
        messageYPos
      );
      amplitudeMessage.value = parameters[currentCanvas - 1].messageAmp;
      t += PI / 180 / 200;
      requestAnimationFrame(loop);
    }
    loop();
  });
});
```
The forEach() method calls a function once for each element in an array, in order.To the item variable  click event is added using addEventListener.The  currentCanvas  variable is assigned to the parseInt() Function.The  parseInt()  function  parses  a  string  and  returns  an  integer.  In the parseInt() Function  is assigned to Target . The  target  event property  returns  the value  of  the  element  that  triggered  the  event.  d-none is removed from the  selectWave'classlist  and  is added to the  selectedWave'classlist . In th  loop function the clearRect() method clears the specified pixels within a given rectangle . The drawMessageSignal function is called .  T is incremented by PI / 180 /100. Atlast loop function is called .

```
backButton.addEventListener("click", () => {
  selectWave.classList.remove("d-none");
  selectedWave.classList.add("d-none");
});
```
_In the above  code backButton variable ,click event is assigned using the addEventListener. d-none is removed from the  selectWave'classlist  and  is added to the  selectedWave'classlist .


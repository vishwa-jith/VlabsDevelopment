# Javascript
---
```
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
```
 The **document.querySelector()** method returns the first element that matches a specified CSS selector(s) in the document . The amplitudeCarrier, amplitudeCarrierUp ,amplitudeCarrierDown, carrierSlider,binInput1, binInput2,binInput3,binInput4,binInput5,binInput6 , binInput7 ,binInput 8 ,oscilloscopeCanvas variables are declared above 

```
let carrierAmp = 0
let carrierFreq = 100;

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

const PI = Math.PI;

// Canvas Initialization
let context = oscilloscopeCanvas.getContext("2d");
```
The above code block initializes required **keywords**, The variables carrierAmp ,carrierFreq with values *0,100* respectively .  *darkCyan, lightCyan, light* defines the colors used in the application.**context** canvas is initialized to draw **2D objects**.

```
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
  carrierYPos = [];
```
In the above the **width and Height**  is initialized to 600 value . The bitIndex , t , f , phaseDiff is assigned to as zero. The incrementStep is inntialized to 1 value .The bitsize is declared to the value dividing width and messageBits.length .

```
const drawSignal = (amplitude, frequency, t, arr) => {
  let y = amplitude * Math.cos(2 * PI * frequency * t);
  arr.unshift(y);
  for (let i = 0; i < arr.length; i++) {
    context.beginPath();
    context.fillStyle = darkCyan;
    context.arc(i, 2 * yPostOff - yPostOff / 2 - arr[i], 2, 0, 2 * PI);
    context.fill();
    context.closePath();
    if (arr.length > WIDTH) {
      arr.pop();
    }
  }
};
```
The **drawSignal** function draws signals based on the parameters amplitude, frequency, time. The y position of the Signal is determined using the below formula,

### y = A cos(2πft)
where,
    A - amplitude of message/carrier signal  
    f - frequency of message/carrier signal  

The *unsift* function inserts the calculated y position into the array **arr**. The *arc* function draws arcs based on the provided data points with its phase shift. The *fillStyle* property fills the color of the label with darkCyan. The *closePath* close the path of the canvas context. 

```
const drawCarrierSignal = (t) => {
  drawSignal(carrierAmp, carrierFreq, t, carrierYPos);
};

initializeMapObj();

```
The **drawCarrierSignal** function draws carrier signal based on the paramters amplitude, frequency, time, message signal positions of carrier signal and its offset. The **drawSignal** functions draws signals based on carrier signals points.The initializeMapObj function is called here .

```
function initializeMapObj() {
  t = 0;
  bitIndex = 0;
  for (; t < WIDTH; t += incrementStep) {
    if (t >= bitIndex * bitSize && t < (bitIndex + 1) * bitSize) {
      mapObj.set(t, messageBits[bitIndex]);
    } else {
      bitIndex++;
    }
  }
}
```
The **initializeMapObj** function is declared , t is assigned to zero and bitIndex is assigned to zero . For all the variables if t is lesser tham width ,enters the if condition , if its true then the mapobj is called . Else the BitImdex is incremented .

```
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
```
In the above code the function **FSKSignal** is declared , The *fillStyle* property fills the color of the label with darkCyan.
The *strokeStyle* property specifies the color, gradient, or pattern to use for the strokes (outlines) around shapes. The default is #000 (black), but lightCyan is assgined here.The *moveTo* begins a new sub-path at the point specified by the given (x, y) coordinates.The *lineTo* adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates. For all the constant k in  mapObj.keys() function . If that value is equal to 0 then the ,the beginPath() is used to start the canvas. .The arc() method creates a circular arc centered at (x, y) with a radius of radius. The path starts at startAngle, ends at endAngle, and travels in the direction given by counterclockwise.ClosePath() is used to close the canvas.Then f is assigned to zero . Else the same is reapeated with different values .

```
function loop() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  drawMessageSignal();
  drawCarrierSignal(t);
  ASKSignal(phaseDiff);
  phaseDiff += 0.05;
  t += PI / 180 / 100;
  requestAnimationFrame(loop);
}
loop();
```
The **loop** function resursively on completion of one cyle of drawing animated graphs. The *clearRect* function is clears the canvas on every cyle of animation to avoid overlaping if animations. *requestAnimationFrame* function animates the canvas by rescursively plotting the updated points in the canvas. The 
drawMessageSignal , drawCarrierSignal , ASKSignal is called here .

```
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

```
The constant *handleAmplitudeCarrier* is assigned  to event  method . The  carrierFreq  variable is assigned to the parseInt() Function. The  parseInt()  function  parses  a  string  and  returns  an  integer. In the parseInt() Function  is assigned to Target . The  target  event property  returns  the value  of  the  element  that  triggered  the  event. The amplitudeCarrier.value and carrierSlider.value is assigned to carrierAmp . 

In  the  above  code ,  to  the  amplitudeCarrierUp  Variable  click event is added using the  addEventListener method .  If the carrierAmp is less than 50 then , the  carrierAmp is incremented , the amplitudeCarrier'value  and   carrierSlider'value is   assigned  to the  carrierAmp .

```
amplitudeCarrierDown.addEventListener("click", () => {
  if (carrierAmp > 0) {
    carrierAmp -= 1;
    amplitudeCarrier.value = carrierAmp;
    carrierSlider.value = carrierAmp;
  }
});

carrierSlider.addEventListener("change", handleAmplitudeCarrier);

```
In  the  above  code ,  to  the  amplitudeCarrierDown  Variable  click event is added using the  addEventListener method .  If the carrierAmp is less than 0 then , the  carrierAmp is decremented , the amplitudeCarrier'value  and   carrierSlider'value is   assigned  to the  carrierAmp .To the **carrierSlider** variable change event is addes using the addEventListener .

```
binInput1.addEventListener("click", () => {
  messageBits[0] = messageBits[0] + messageBits[0] ? 0 : 1;
  binInput1.innerHTML = messageBits[0];
  initializeMapObj();
});
```
The **binInput1** is variable to this  click event is added using addListener method .In the messageBits variable , the binary input is saved and when the variable is clicked binary values will be toggled.then is save in BinInput1 using innerHTMl method . At Last initializeMapObj function is called.

```
binInput2.addEventListener("click", () => {
  messageBits[1] = messageBits[1] + messageBits[1] ? 0 : 1;
  binInput2.innerHTML = messageBits[1];
  initializeMapObj();
});

```
The **binInput2** is variable to this  click event is added using addListener method .In the messageBits variable , the binary input is saved and when the variable is clicked binary values will be toggled.then is save in BinInput2 using innerHTMl method . At Last initializeMapObj function is called.

```
binInput3.addEventListener("click", () => {
  messageBits[2] = messageBits[2] + messageBits[2] ? 0 : 1;
  binInput3.innerHTML = messageBits[2];
  initializeMapObj();
});

```
The **binInput3** is variable to this  click event is added using addListener method .In the messageBits variable , the binary input is saved and when the variable is clicked binary values will be toggled.then is save in BinInput3 using innerHTMl method . At Last initializeMapObj function is called.

```
binInput4.addEventListener("click", () => {
  messageBits[3] = messageBits[3] + messageBits[3] ? 0 : 1;
  binInput4.innerHTML = messageBits[3];
  initializeMapObj();
});

```
The **binInput4** is variable to this  click event is added using addListener method .In the messageBits variable , the binary input is saved and when the variable is clicked binary values will be toggled.then is save in BinInput4 using innerHTMl method . At Last initializeMapObj function is called.

```
binInput5.addEventListener("click", () => {
  messageBits[4] = messageBits[4] + messageBits[4] ? 0 : 1;
  binInput5.innerHTML = messageBits[4];
  initializeMapObj();
});
```
The **binInput5** is variable to this  click event is added using addListener method .In the messageBits variable , the binary input is saved and when the variable is clicked binary values will be toggled.then is save in BinInput5 using innerHTMl method . At Last initializeMapObj function is called.

```
binInput6.addEventListener("click", () => {
  messageBits[5] = messageBits[5] + messageBits[5] ? 0 : 1;
  binInput6.innerHTML = messageBits[5];
  initializeMapObj();
});

```
The **binInput6** is variable to this  click event is added using addListener method .In the messageBits variable , the binary input is saved and when the variable is clicked binary values will be toggled.then is save in BinInput6 using innerHTMl method . At Last initializeMapObj function is called.

```
binInput7.addEventListener("click", () => {
  messageBits[6] = messageBits[6] + messageBits[6] ? 0 : 1;
  binInput7.innerHTML = messageBits[6];
  initializeMapObj();
});
```
The **binInput7** is variable to this  click event is added using addListener method .In the messageBits variable , the binary input is saved and when the variable is clicked binary values will be toggled.then is save in BinInput7 using innerHTMl method . At Last initializeMapObj function is called.

```
binInput8.addEventListener("click", () => {
  messageBits[7] = messageBits[7] + messageBits[7] ? 0 : 1;
  binInput8.innerHTML = messageBits[7];
  initializeMapObj();
});
```
The **binInput8** is variable to this  click event is added using addListener method .In the messageBits variable , the binary input is saved and when the variable is clicked binary values will be toggled.then is save in BinInput8 using innerHTMl method . At Last initializeMapObj function is called.
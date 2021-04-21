# Javascript
---
```
let amplitudeCarrier = document.querySelector("#amplitudeCarrier")
let amplitudeCarrierUp = document.querySelector("#amplitudeCarrierUp");
let amplitudeCarrierDown = document.querySelector("#amplitudeCarrierDown");
let carrierSlider = document.querySelector("#carrier-slider");
let oscilloscopeCanvas = document.querySelector("#oscilloscope-canvas");
```
 The **document.querySelector()** method returns the first element that matches a specified CSS selector(s) in the document . The amplitudeCarrier, amplitudeCarrierUp ,amplitudeCarrierDown, carrierSlider,oscilloscopeCanvas variables are declared above.

```
let messageAmp = 0;
let messageFreq = 100;

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

const PI = Math.PI;

// Canvas Initialization
let context = oscilloscopeCanvas.getContext("2d");
```
The above code block initializes required **keywords**, The variables messageAmp ,messageFreq with values *0,100* respectively .  *darkCyan, lightCyan, light* defines the colors used in the application.**context** canvas is initialized to draw **2D objects**.

```
var WIDTH = 600,
  HEIGHT = 600,
  mapObj = new Map(),
  incrementStep = 1,
  yPostOff = HEIGHT / 3,
  f = 0,
  c = 0,
  t = 0,
  tPAM = 0,
  pamYPos = [],
  messsageYPos = [];
```
In the above the **width and Height**  is initialized to 600 value . The c, t , f ,tPAM, phaseDiff is assigned to as zero. The incrementStep is inntialized to 1 value .

```
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

```
The **drawSignal** function draws signals based on the parameters amplitude, frequency, time. The y position of the Signal is determined using the below formula,

### y = A cos(2πft)
where,
    A - amplitude of message/carrier signal  
    f - frequency of message/carrier signal  

The *unsift* function inserts the calculated y position into the array **arr**. The *arc* function draws arcs based on the provided data points with its phase shift. The *fillStyle* property fills the color of the label with darkCyan. The *closePath* close the path of the canvas context. 


```
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
```
The **drawPAMSignal** function draws signals based on the parameters amplitude, frequency, time. The y position of the Signal is determined using the below formula,

### y = A cos(2πft)
where,
    A - amplitude of message/carrier signal  
    f - frequency of message/carrier signal  

The *unsift* function inserts the calculated y position into the array **arr**. The *arc* function draws arcs based on the provided data points with its phase shift. The *fillStyle* property fills the color of the label with darkCyan. The *closePath* close the path of the canvas context.The *lineTo* adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates.

```
const drawMessageSignal = (t) => {
  drawSignal(messageAmp, messageFreq, t, messsageYPos);
};

initializeMapObj();

```
The **drawMessageSignal** function draws carrier signal based on the paramters amplitude, frequency, time, message signal positions of carrier signal and its offset. The **drawSignal** functions draws signals based on carrier signals points.The initializeMapObj function is called here .

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
The **initializeMapObj** function is declared , t is assigned to zero and bitIndex is assigned to zero .For all the variables if t is lesser tham width ,enters the if condition , if its true then the mapobj is called . Else the BitImdex is incremented 

```
function drawPulseTrain() {
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

```
In the above code the function **drawPulseSignal** is declared , The *fillStyle* property fills the color of the label with darkCyan.
The *strokeStyle* property specifies the color, gradient, or pattern to use for the strokes (outlines) around shapes. The default is #000 (black), but lightCyan is assgined here.The *moveTo* begins a new sub-path at the point specified by the given (x, y) coordinates.The *lineTo* adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates. For all the constant k in  mapObj.keys() function . If that value is equal to 0 then the ,the beginPath() is used to start the canvas. .The arc() method creates a circular arc centered at (x, y) with a radius of radius. The path starts at startAngle, ends at endAngle, and travels in the direction given by counterclockwise.ClosePath() is used to close the canvas. Else the same is reapeated with different values .


```
function loop() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  drawPulseTrain();
  drawMessageSignal(t);
  drawPAMSignal(messageAmp, messageFreq, tPAM, pamYPos);
  if (c % 15 == 0) {
    tPAM += (PI / 180 / 200) * 15;
  }
  t += PI / 180 / 200;
  c += 1;
  requestAnimationFrame(loop);
}
loop();
```
The **loop** function resursively on completion of one cyle of drawing animated graphs. The *clearRect* function is clears the canvas on every cyle of animation to avoid overlaping if animations. *requestAnimationFrame* function animates the canvas by rescursively plotting the updated points in the canvas. The 
drawMessageSignal , drawMessageSignal , drawPAMSignal is called here .


```
const handleAmplitudeMessage = (event) => {
  messageAmp = parseInt(event.target.value);
  amplitudeMessage.value = messageAmp;
  messageSlider.value = messageAmp;
};

// Listener for increasing Carrrier Amplitude
amplitudeMessageUp.addEventListener("click", () => {
  if (messageAmp < 50) {
    messageAmp += 1;
    amplitudeMessage.value = messageAmp;
    messageSlider.value = messageAmp;
  }
});

```
The constant *handleAmplitudeCarrier* is assigned  to event  method . The  messageAmp  variable is assigned to the parseInt() Function. The  parseInt()  function  parses  a  string  and  returns  an  integer. In the parseInt() Function  is assigned to Target . The  target  event property  returns  the value  of  the  element  that  triggered  the  event. The amplitudeMessage.value and messageSlider.value is assigned to carrierAmp . 

In  the  above  code ,  to  the  amplitudeMessageUp  Variable  click event is added using the  addEventListener method .  If the MessageAmp is less than 50 then , the  messageAmp is incremented , the amplitudeMessage'value  and   messageSlider'value is   assigned  to the  messageAmp .

```
amplitudeMessageDown.addEventListener("click", () => {
  if (messageAmp > 0) {
    messageAmp -= 1;
    amplitudeMessage.value = messageAmp;
    messageSlider.value = messageAmp;
  }
});

messageSlider.addEventListener("change", handleAmplitudeMessage);

```
In  the  above  code ,  to  the  amplitudeMessageDown  Variable  click event is added using the  addEventListener method .  If the messageAmp is less than 0 then , the  messgaeAmp is decremented , the amplitudemessgae'value  and   messgaeSlider'value is   assigned  to the  messgaeAmp .To the **messgaeSlider** variable change event is addes using the addEventListener .

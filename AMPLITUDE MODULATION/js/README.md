# **Javascript**

---

## main.js

```js:
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

```

**document.querySelector()** method returns the first element that matches a specified CSS selector(s) in the document. The amplitudeCarrier, amplitudeMessage, amplitudeCarrierUp, amplitudeCarrierDown, amplitudeMessageUp, amplitudeMessageDown, modulation, overModulation, underModulation, modulationIndex, graphRep, oscilloscope, spectrum, heading, oscilloscopeCanvas, power, carrierSlider, messageSlider, spectrumCanvas variables are declared above.


```js:

// Initialization
let carrierAmp = 0;
let messageAmp = 0;
let messageFreq = 20;
let carrierFreq = 100;
let graphType = "Oscilloscope";

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

// Canvas Initialization
let context = oscilloscopeCanvas.getContext("2d");
let spectrumContext = spectrumCanvas.getContext("2d");

var messageYPos = [],
  carrierYPos = [],
  amYPos = [],
  t = 0;
const PI = Math.PI;

```

The above code block initializes required **keywords**, The variables *carrierAmp, messageAmp, messageFreq, carrierFreq, graphType* with values *0, 0, 30 and 100* respectively. *darkCyan, lightCyan, light* defines the colors used in the application. **context, spectrumContext** canvas is initialized to draw **2D objects**.


```js:

// Determines Type of Modulation
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

```

The **findModulation** function determines the type of modulation by calculating **modulation index** based on the carrier amplitude and message amplitude.  

Formula for Determining modulation in given below.  
### modulation = carrierAmp/messageAmp  

If carrierAmp < messageAmp
this causes **over modulation**, the indicators background-color changes from *lightCyan* to *darkCyan* as an indication.  

else If carrier > messageAmp
this causes **under modulation**, the indicators background-color changes from *lightCyan* to *darkCyan* as an indication.  

else this causes **normal modulation**, the indicators background-color changes from *lightCyan* to darkCyan* as an indication.

```js:

// Calculate Modulation Index
const calculateModulationIndex = () => {
  modulationIndex.value = (messageAmp / carrierAmp).toFixed(3);
};

```

The **calculateModulationIndex** function calculates the modulation index for a given carrier and message amplitude upto 3 decimal precision.  

Formula for finding modulatin index is given below,
### Modulation Index = Vm/Vc

where,  
    Vm - Amplitude of message Signal
    Vc - Amplitude of carrier Signal


```js:

// Calculate Power
const calculatePower = () => {
  power.value = (Math.pow(messageAmp / Math.sqrt(2), 2) / 2).toFixed(2);
};

```

The **calculatePower** function calculates the modulation index for a given carrier and message amplitude upto 2 decimal precision.  

Formula for finding power of modulated signal is given below,  
### Power (P) = (Vm/√2)²/2	

where,  
    Vm - Amplitude of message Signal

```js:

// Handles change in Carrier Amplitude
const handleAmplitudeCarrier = (event) => {
  carrierAmp = parseInt(event.target.value);
  amplitudeCarrier.value = carrierAmp;
  carrierSlider.value = carrierAmp;
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
};

```
The **handleAmplitudeCarrier** function handles the updation of carrier amplitude based on interaction with the interface. The value updation is reflected in all the carrier amplitude controls slider and input. 

**findModulation** function calculates the type of modulation based on the updated values.  
**calculateModulationIndex** function calculates the modulation Index of of the modulated eaveform based on the updated message and carrier amplitude.  
**calculatePower** function calculates the Power of modulated signal with the updated values.  
**drawSpectrum** function draws the spectrum for the updated message and carrier signal.

```js:

// Handles change in Message Amplitude
const handleAmplitudeMessage = (event) => {
  messageAmp = parseInt(event.target.value);
  amplitudeMessage.value = messageAmp;
  messageSlider.value = messageAmp;
  findModulation();
  calculateModulationIndex();
  calculatePower();
  drawSpectrum();
};

```
The **handleAmplitudeCarrier** function handles the updation of message amplitude based on interaction with the interface. The value updation is reflected in all the message amplitude controls slider and input. 

**findModulation** function calculates the type of modulation based on the updated values.  
**calculateModulationIndex** function calculates the modulation Index of of the modulated eaveform based on the updated message and carrier amplitude.  
**calculatePower** function calculates the Power of modulated signal with the updated values.  
**drawSpectrum** function draws the spectrum for the updated message and carrier signal.

```js:

// Displays Signal Labels
const displaySignalLabel = () => {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("m(t)", 10, 20);
  context.fillText("c(t)", 10, oscilloscopeCanvas.height / 3 + 20);
  context.fillText("am(t)", 10, (2 * oscilloscopeCanvas.height) / 3 + 20);
  context.closePath();
};

```
The **displaySignalLabel** function displays Labels for the signals message, amplitude and modulated signal in a canvas initialized as **context**. The *fillStyle* property fills the color of the label with darkCyan. The *font* property sets the font for the labels, *fillText* property used for displaying the text in the desired x and y coordinates and the *closePath* close the path of the canvas context.

```js:

// Displays Spectrum Labels
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

```

The **displaySpectrumLabel** function displays Labels for the signals message, amplitude and modulated signal in a canvas initialized as **context**. The *fillStyle* property fills the color of the label with darkCyan. The *font* property sets the font for the labels, *fillText* property used for displaying the text in the desired x and y coordinates and the *closePath* close the path of the canvas context.

```js:

// Draws Line with Arrow Heads
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

```

The **convas_arrow** function draws line with arrow heads on the canvas context. The headlen variable is used to define the length of the length of the arrow head. **moveTo** function moves the drawing pointer to the desired x and y coordinates. **lineTo** function draws lines from the moved position till the position specified to the movedTo function. The linTo function draws the arrow head with some inclination from cos(angle - π / 6) to sin(angle - π / 6).

```js:

// Plot Graph Points
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

```

The **drawSignal** function draws signals based on the parameters amplitude, frequency, time, offset. The y position of the Signal is determined using the below formula,

### y = A cos(2πft)
where,
    A - amplitude of message/carrier signal  
    f - frequency of message/carrier signal  

The *unsift* function inserts the calculated y position into the array **arr**. The *arc* function draws arcs based on the provided data points with its phase shift. The *fillStyle* property fills the color of the label with darkCyan. The *closePath* close the path of the canvas context.
 
```js:

// Draws Message Signal
const drawMessageSignal = (t) => {
  drawSignal(
    messageAmp,
    messageFreq,
    t,
    messageYPos,
    oscilloscopeCanvas.height / 3 / 2
  );
};

```

The **drawMessageSignal** function draws message signal based on the paramters amplitude, frequency, time, message signal positions, and its offset. The **drawSignal** functions draws signals based on message signals points.


```js:

// Draws Carrier Signal
const drawCarrierSignal = (t) => {
  drawSignal(
    carrierAmp,
    carrierFreq,
    t,
    carrierYPos,
    oscilloscopeCanvas.height / 3 + oscilloscopeCanvas.height / 3 / 2
  );
};
```

The **drawCarrierSignal** function draws carrier signal based on the paramters amplitude, frequency, time, message signal positions of carrier signal and its offset. The **drawSignal** functions draws signals based on carrier signals points.

```js:

// Draws Modulated Signal
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


```

The **drawAmplitudeModulationSignal** function draws signals based on the parameters amplitude, frequency, time, offset. The y position of the Signal is determined using the below formula,  
### y = (Ac + Am cos(2πfmt)) * cos(2πfct), 

where,  
    Ac - amplitude pf carrier signal  
    Am - amplitude of message signal  
    fm - frequency of message signal  
    fc - frequency of carrier signal

The *unsift* function inserts the calculated y position in the begining of the array **arr**. The *arc* function draws arcs based on the provided data points with its phase shift. The *fillStyle* property fills the color of the label with darkCyan. The *closePath* close the path of the canvas context.  


```js:

// Draws Modulation Graphs
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

```

The **drawSignals** is a function which is responsible for drawing all signals associated with osciloscope. The function is responsible for displaying signal labels and drawing the message, carrier, modulated signal based on its x and y co-ordinates.

```js:

// Resursive Ploting
function loop() {
  context.clearRect(0, 0, oscilloscopeCanvas.width, oscilloscopeCanvas.height);
  t += PI / 180 / 100;
  drawSignals(t);
  requestAnimationFrame(loop);
}
loop();

```

The **loop** function resursively on completion of one cyle of drawing animated graphs. The *clearRect* function is clears the canvas on every cyle of animation to avoid overlaping if animations. *requestAnimationFrame* function animates the canvas by rescursively plotting the updated points in the canvas. 

```js:

// Draws Spectrum
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

```

The **drawSpectrum** function draws the spectrum. The *clearRect* function clear the canvas on every updates to avois overlapping of animated canvas frames. The **displaySpectrumLabel** function displays the necessary labels for drawing a spectrum. The *fillStyle* property fills the color of the label with darkCyan. The **canvas_arrow** draws lines with arrows with the given x and y co-ordinates. The *stroke* function plots the above design in the canvas.


```js:

// Controls Listeners
carrierSlider.addEventListener("change", handleAmplitudeCarrier);
messageSlider.addEventListener("change", handleAmplitudeMessage);
amplitudeCarrier.addEventListener("change", handleAmplitudeCarrier);
amplitudeMessage.addEventListener("change", handleAmplitudeMessage);

```

The carrierSilder, amplitudeCarrier and amplitudeMessage, messageSlider, are the controls where onChange **addEventListeners** are attached to update the values with handleAmplitudeCarrier and handleAmplitudeMessage respectively.

```js:

// Listener for increasing Carrrier Amplitude
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

```

The **amplitudeCarrierUp** element is attached with a *onclick* event listener. The listener increments the value of the carrier amplitude on if its value ranges below 50.
**findModulation** function calculates the type of modulation based on the updated values.  
**calculateModulationIndex** function calculates the modulation Index of of the modulated eaveform based on the updated message and carrier amplitude.  
**calculatePower** function calculates the Power of modulated signal with the updated values.  
**drawSpectrum** function draws the spectrum for the updated message and carrier signal.

```js:

// Listener for decreasing Carrrier Amplitude
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

```


The **amplitudeCarrierDown** element is attached with a *onclick* event listener. The listener increments the value of the carrier amplitude on if its value ranges above 0.
**findModulation** function calculates the type of modulation based on the updated values.  
**calculateModulationIndex** function calculates the modulation Index of of the modulated eaveform based on the updated message and carrier amplitude.  
**calculatePower** function calculates the Power of modulated signal with the updated values.  
**drawSpectrum** function draws the spectrum for the updated message and carrier signal.


```js:

// Listener for increasing Message Amplitude
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

```

The **amplitudeMessageUp** element is attached with a *onclick* event listener. The listener increments the value of the carrier amplitude on if its value ranges below 50.
**findModulation** function calculates the type of modulation based on the updated values.  
**calculateModulationIndex** function calculates the modulation Index of of the modulated eaveform based on the updated message and carrier amplitude.  
**calculatePower** function calculates the Power of modulated signal with the updated values.  
**drawSpectrum** function draws the spectrum for the updated message and carrier signal.

```js:

// Listener for decreasing Message Amplitude
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

```


The **amplitudeMessageUp** element is attached with a *onclick* event listener. The listener increments the value of the carrier amplitude on if its value ranges above 0.
**findModulation** function calculates the type of modulation based on the updated values.  
**calculateModulationIndex** function calculates the modulation Index of of the modulated eaveform based on the updated message and carrier amplitude.  
**calculatePower** function calculates the Power of modulated signal with the updated values.  
**drawSpectrum** function draws the spectrum for the updated message and carrier signal.

```js:

// Generates normal Modulation
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

```

The **mmodulation** element is attached with a *onclick* event listener. The listener generates normal modulation with random carrier amplitude and message amplitude whenever an onclick event occurs. amplitudeCarrier and carrierSilder values are updated with the random value generated by **Math.random** function.  
**findModulation** function calculates the type of modulation based on the updated values.  
**calculateModulationIndex** function calculates the modulation Index of of the modulated eaveform based on the updated message and carrier amplitude.  
**calculatePower** function calculates the Power of modulated signal with the updated values.  
**drawSpectrum** function draws the spectrum for the updated message and carrier signal.

```js:

// Generates Over Modulation
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

```
The **overMmodulation** element is attached with a *onclick* event listener. The listener generates normal modulation with random carrier amplitude and message amplitude whenever an onclick event occurs. amplitudeCarrier and carrierSilder values are updated with the random value generated by **Math.random** function similary for messageAmplitude and messageSlider.  
**findModulation** function calculates the type of modulation based on the updated values.  
**calculateModulationIndex** function calculates the modulation Index of of the modulated eaveform based on the updated message and carrier amplitude.  
**calculatePower** function calculates the Power of modulated signal with the updated values.  
**drawSpectrum** function draws the spectrum for the updated message and carrier signal.

```js:

// Generates Under Modulation
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

```

The **underMmodulation** element is attached with a *onclick* event listener. The listener generates normal modulation with random carrier amplitude and message amplitude whenever an onclick event occurs. amplitudeCarrier and carrierSilder values are updated with the random value generated by **Math.random** function similary for messageAmplitude and messageSlider.  
**findModulation** function calculates the type of modulation based on the updated values.  
**calculateModulationIndex** function calculates the modulation Index of of the modulated eaveform based on the updated message and carrier amplitude.  
**calculatePower** function calculates the Power of modulated signal with the updated values.  
**drawSpectrum** function draws the spectrum for the updated message and carrier signal.

```js:

// Changes Graph Representation
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

```

The **graphRep** is attached with a **onclick** event listeners. The graph switches between Osciloscope and Spectrum based on the *innerHTML* in tempRep.  
If graphType is *Oscilloscope* then display the oscilloscope animated graph.  
else it displays the Spectrum graph.  

---

## demodulation.js

```js:
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

```


**document.querySelector()** method returns the first element that matches a specified CSS selector(s) in the document. The oscilloscopeCanvas1, oscilloscopeCanvas2, oscilloscopeCanvas3, canvas, selectWave, selectedWave, amplitudeMessage, frequencyMessage, oscilloscope, spectrum, graphRep, heading, oscilloscopeCanvas, backButton, spectrumCanvas, power, carrierSlider, messageSlider, spectrumCanvas variables are declared above.

```js:

// Colors
let darkCyan = "#00796b";
let lightCyan = "#b2dfdb";
let light = "#eee";

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

// Canvas Initialization
let context1 = oscilloscopeCanvas1.getContext("2d");
let context2 = oscilloscopeCanvas2.getContext("2d");
let context3 = oscilloscopeCanvas3.getContext("2d");
let spectrumContext = spectrumCanvas.getContext("2d");

```

The above code block initializes required **keywords**. The variables  amYPos1, amYPos2, amYPos3, t, graphType, PI, currentCanvas are initialized with necessary values. **context1, context2, context3, spectrumContext** canvas is initialized to draw **2D objects**.

```js:

// displays signals label
function displaySignalLabel(context) {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("am(t)", 10, 20);
  context.closePath();
}

```

The **displaySignalLabel** function displays Labels for the signals message, amplitude and modulated signal in a canvas initialized as **context**. The *fillStyle* property fills the color of the label with darkCyan. The *font* property sets the font for the labels, *fillText* property used for displaying the text in the desired x and y coordinates and the *closePath* close the path of the canvas context.

```js:

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

```

The **drawAmplitudeModulationSignal** function draws signals based on the parameters amplitude, frequency, time, offset. The y position of the Signal is determined using the below formula,  
### y = (Ac + Am cos(2πfmt)) * cos(2πfct), 

where,  
    Ac - amplitude pf carrier signal  
    Am - amplitude of message signal  
    fm - frequency of message signal  
    fc - frequency of carrier signal

The *unsift* function inserts the calculated y position in the begining of the array **arr**. The *arc* function draws arcs based on the provided data points with its phase shift. The *fillStyle* property fills the color of the label with darkCyan. The *closePath* close the path of the canvas context.  

```js:

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

```

The **drawSignals** is a function which is responsible for drawing all signals associated with osciloscope. The function is responsible for displaying signal labels and drawing the message, carrier, modulated signal based on its x and y co-ordinates.

```js:

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

```


The **loop** function resursively on completion of one cyle of drawing animated graphs. The *clearRect* function is clears the canvas on every cyle of animation to avoid overlaping if animations in context1, context2, context3. **drawSignals** function draws necessary waveforms to be demodulated.*requestAnimationFrame* function animates the canvas by rescursively plotting the updated points in the canvas.  

```js:

// displays Signal Labels
function displaySignalLabel() {
  context.beginPath();
  context.fillStyle = darkCyan;
  context.font = "16px Arial";
  context.fillText("m(t)", 10, 20);
  context.closePath();
}

```

The **displaySignalLabel** function displays Labels for the signals message, amplitude and modulated signal in a canvas initialized as **context**. The *fillStyle* property fills the color of the label with darkCyan. The *font* property sets the font for the labels, *fillText* property used for displaying the text in the desired x and y coordinates and the *closePath* close the path of the canvas context.

```js:
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
```

The **drawSignals** is a function which is responsible for drawing all signals associated with osciloscope. The function is responsible for displaying signal labels and drawing the message, carrier, modulated signal based on its x and y co-ordinates.

```js:
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

```

The **drawMessageSignal** function draws message signal based on the paramters amplitude, frequency, time, message signal positions, and its offset. The **drawSignal** functions draws signals based on message signals points.

```js:

// draws signals
const drawSignals = (t) => {
  displaySignalLabel();
  drawMessageSignal(t);
};

```

The **drawSignals** is a function which is responsible for drawing all signals associated with osciloscope. The function is responsible for displaying signal labels and drawing the message signal based on its x and y co-ordinates.

```js:
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

```

The **loop** function resursively on completion of one cyle of drawing animated graphs. The *clearRect* function is clears the canvas on every cyle of animation to avoid overlaping if animations. *requestAnimationFrame* function animates the canvas by rescursively plotting the updated points in the canvas. 

```js:

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

```

The **displaySpectrumLabel** function displays Labels for the signals message, amplitude and modulated signal in a canvas initialized as **context**. The *fillStyle* property fills the color of the label with darkCyan. The *font* property sets the font for the labels, *fillText* property used for displaying the text in the desired x and y coordinates and the *closePath* close the path of the canvas context.

```js:

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

```

The **convas_arrow** function draws line with arrow heads on the canvas context. The headlen variable is used to define the length of the length of the arrow head. **moveTo** function moves the drawing pointer to the desired x and y coordinates. **lineTo** function draws lines from the moved position till the position specified to the movedTo function. The linTo function draws the arrow head with some inclination from cos(angle - π / 6) to sin(angle - π / 6).

```js:

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


```

The **drawSpectrum** function draws the spectrum. The *clearRect* function clear the canvas on every updates to avois overlapping of animated canvas frames. The **displaySpectrumLabel** function displays the necessary labels for drawing a spectrum. The *fillStyle* property fills the color of the label with darkCyan. The **canvas_arrow** draws lines with arrows with the given x and y co-ordinates. The *stroke* function plots the above design in the canvas.

```js:

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

```

The **graphRep** is attached with a **onclick** event listeners. The graph switches between Osciloscope and Spectrum based on the *innerHTML* in tempRep.  
If graphType is *Oscilloscope* then display the oscilloscope animated graph.  
else it displays the Spectrum graph.  

```js:

backButton.addEventListener("click", () => {
  selectWave.classList.remove("d-none");
  selectedWave.classList.add("d-none");
  currentCanvas = null;
  graphRep.innerHTML = "Spectrum";
  graphType = "Oscilloscope";
  oscilloscopeCanvas.classList.remove("d-none");
  spectrum.classList.add("d-none");
});

```

The **backButton** element is attached with a **onclick** event listener. This button navigates to list of modulated waveforms. The **currentCanvas** variable is set to null. *d-none* class is added to oscilloscopeCanvas element and removed from spectrum element.  
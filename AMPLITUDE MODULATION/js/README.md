# **Javascript**

---

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
***modulation = carrierAmp/messageAmp**  

If carrierAmp < messageAmp
this causes **over modulation**, the indicators background-color changes from *lightCyan* to *darkCyan* as an indication.  

else If carrier > messageAmp
this causes **under modulation**, the indicators background-color changes from *lightCyan* to *darkCyan* as an indication.  

else this causes **normal modulation**, the indicators background-color changes from *lightCyan* to darkCyan* as an indication.
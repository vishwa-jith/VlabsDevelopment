# CSS
---
```
.wave-container {
  height: 600px;
  background-color: #eee;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```
_In  the  above  code  wave  container  is  defined  as  the  class  selector. The  CSS  Style that are used in the above are  **height , background, overflow, display, fex-direction, align-items, justify-content**. The height property sets the height of an element.The Height  Value is  600px.The align-items property specifies the default alignment for items inside the flexible container. The Elemnet in the wave container are aligned to the center .The justify-content property aligns the flexible container's items when the items do not use all available space on the main-axis . In the above code ,the Items are positioned in the center of the container._

```
#oscilloscope-canvas {
  background-color: #eee;
}

.quantity {
  position: relative;
}
```
_**#** is used to define the id selector . **.** is used to define the class selector. The background-color property sets the background color of an element.
#eee  color  denotes the gray  color. The position property specifies the type of positioning method used for an element. An element with position: relative; is positioned relative to its normal position._


```
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

```
_The input type is declared as number . The ::-webkit-inner-spin-button CSS  pseudo-element  is  used  to  style  the inner  part  of  the   spinner  button  of  number  picker  input  elements. The -webkit-outer-spin-button is used to style the outer part of the spinner button of number picker output elements. The -moz-appearance property is used in Gecko (Firefox) to show an element using platform-native styling based on the operating system's theme._

```
.quantity input {
  width: 75px;
  height: 40px;
  line-height: 1.65;
  float: left;
  display: block;
  padding: 0;
  margin: 0;
  border: 2px solid #fff;
  color: #00796b;
  font-weight: bold;
  font-size: 16px;
  background-color: #b2dfdb;
  border-radius: 10px;
  text-align: center;
}
```
_The **width , height , line-height ,  float , line-height , float ,  display , padding , margin , border , color , font-weight , font-size , background-color , border-radius , text-align** these are the styles that are used in the above code  to  style  the  element  that  are  set  inside  the  quantity  input. The line-height property  specifies  the  height  of  a  line.  Negative  values are  not  allowed .The CSS border properties allow you to specify the style, width, and color of an element's border. The  border  is  designed  as  2px thickness  of  solid  type . In  the  above  code  quantity input  is  defined  as  the  id  selector. The background-color property sets the background color of an element. #B2DFDB -Aqua Island colour description_

```
.quantity input:focus {
  border: 3px solid #4db6ac;
  outline: 0;
}

.quantity-nav {
  float: left;
  position: relative;
  height: 40px;
  right: -30px;
}

```
_In the above code  inside the Quantity , the border is designed as 3px thickness solid type  and the outline is 0 . Focus is the pseudo selector this  will get activated when we click the input field .And inside the quantity selector , the height is assigned as 40 px._

```
.quantity-button {
  position: relative;
  cursor: pointer;
  width: 30px;
  text-align: center;
  color: #00796b;
  font-size: 13px;
  font-family: "Trebuchet MS", Helvetica, sans-serif !important;
  line-height: 1.7;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
```
 
_In   the  above  code quantity is declared as  class  selector . **The position , cursor , width , text-align , color , font-size , font-family , line-height , -webkit-transform , transform , -webkit-user-select , -moz-user-select , -ms-user-select , -o-user-select ,  user-select** , these style are used to style the code inside the quantity selector.The position property specifies the type of positioning method  used for an element . An element with position: relative; is positioned relative to its normal position. The cursor property specifies the mouse cursor to be displayed when pointing over an element . The width property sets the width of an element. 30px is width of the element placed inside the quantity selector. The text-align property specifies the horizontal alignment of text in an element. Test inside the quantity selctor is aligned to the center . #00796b is color assigned . The font-size of the text is 13px. The line-height property  specifies  the  height  of  a  line.  Negative  values are not  allowed . The translateX() CSS function repositions an element horizontally on the 2D plane. The TranslateX value is -100% ._

```
.quantity-button:hover {
  background-color: #eee;
}

.quantity-button.quantity-up {
  position: absolute;
  height: 50%;
  top: 0;
}

.quantity-button.quantity-down {
  position: absolute;
  bottom: -1px;
  height: 50%;
}
```
In above code quantity is defined as the  class  selector , when  we hover on the button the Backgroundcolor changes to #eee. 

```
.range-style {
  width: 100%;
  height: 10px;
  border-radius: 10px;
  background: #eee;
  margin: 10px 0px;
}
.range-style::-webkit-slider-runnable-track {
  display: flex;
  align-items: center;
  height: 20px;
  border-radius: 10px;
}
.range-style::-webkit-slider-thumb {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #e0e0e0;
  background-image: linear-gradient(-45deg, #b2dfdb, transparent);
  ```
In the above code range is the class selector , inside that the css style are assigned . The **width, Height,Border-radius, background ,margin**  these are assigned . The width value is 100% , the height is 10px. The border-radius property defines the radius of the element's corners. the border -radius is 10px. The CSS margin properties are used to create space around elements, outside of any defined borders .The  CSS  margin  properties  are  used  to  create  space  around  elements,  outside  of  any  defined  borders. The  webkit-slider-runnable-track is the pseudo selector where this is applied to the sliders track . The  webkit-slider-thumb is  applied to the circle structure in the slider named range - style. The linear-gradient provides variant colors like half one color and the remaining half some other color with some inclination.

```
.range-style::-moz-range-track {
  display: flex;
  align-items: center;
  height: 20px;
  border-radius: 10px;
}
.range-style::-moz-range-thumb {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #b2dfdb;
  background-image: linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.8),
    transparent
  );
}

```
In  the  above  code  the  range  is  the  defined  as  the   class  selector. In which moz-range-track  is assgined . The **display , align-items, height  ,  border- radius** are assigned .  The flex property sets the flexible length on flexible items .The items assigned in the range class selector is aligned to the center . The Border-radius of the element declared in the range class selector is 10px . The  height  is  20px. The  range  is  class  selector   which  is  assigned  to  moz-range-thumb   style . The Background color is assigned to  linear-gradient method . The linear-gradient  provides  variant  colors  like  half  one  color  and  the  remaining  half  some  other  color  with  some  inclination.

```
#oscilloscope-canvas1,
#oscilloscope-canvas2,
#oscilloscope-canvas3 {
  cursor: pointer;
  box-shadow: inset -2px -2px 8px white, inset 2px 2px 8px rgba(0, 0, 0, 0.5);
}

#oscilloscope-canvas,
#spectrum-canvas {
  box-shadow: inset -2px -2px 8px white, inset 2px 2px 8px rgba(0, 0, 0, 0.5);
}
```
In the above code oscilloscope-canvas1 ,  oscilloscope-canvas2,  oscilloscope-canvas3  is the declared as  the  id  selector . The  cursor  property  specifies  the  mouse  cursor  to  be  displayed  when pointing  over  an  element . 


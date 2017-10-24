/**Cross Section toggle function used for check box*/
function showCrossSectionFn(scope) {
   
    scope.CrossSection ? showHideCrossSection(scope, 1, 0.5, scope) : showHideCrossSection(scope, 0, 0, scope);
    ultrasonic_Interferometer_stage.update();
}
/**  */

/**Function for toggling cross section */
function showHideCrossSection(scope, showHide_value, showHide_valueMedium) {
   
    getChild("cross_Section").alpha = showHide_value;
    changeMediumColors(scope, currentMediumSelected_number);
    getChild("piston").alpha = showHide_value;
    /**Condition for toggling selected medium. */
    if (currentMediumSelected_number === 2) {
        getChild("color_castorOil").alpha = showHide_value;
    } else if (currentMediumSelected_number === 3) {

        getChild("color_kerosene").alpha = showHide_value;
    } else {

        getChild("color_common").alpha = showHide_value;

    }
    ultrasonic_Interferometer_stage.update();

}
/** Function for change medium. */
function changeMediumFn(scope) {
   
    scope.showResult_mdl = false;
    showCrossSectionFn(scope);
    document.getElementById("resultSection").style.display = 'none';
    document.getElementById("resultSection_two").style.display = 'none';
    currentMediumSelected_number = scope.select_Medium_mdl;
    scope.result_one = resultVelocity[currentMediumSelected_number];
    scope.result_two = resultAdiabatic[currentMediumSelected_number];
    if (scope.CrossSection) {
        changeMediumColors(scope, currentMediumSelected_number);
    }
    ultrasonic_Interferometer_stage.update();
}
/**Function for selecting Frequency  */

function changeFrequencyFn(scope) {
   
    curren_Frequency_Glb = scope.curren_Frequency;
}

/**Function for power On and Reset  */
function powerOn_resetFn(scope, checkPara) {
   
    /** If the button_clickFlag if true then power on functionality will trigger.  */
    if (button_clickFlag) {
        scope.btn_labl = _("Reset");
        getChild("light_On").alpha = 1;
        getChild("switch_Off").alpha = 1;
        getChild("switch_On").alpha = 0;
        button_clickFlag = false;
    } else {
        getChild("light_On").alpha = 0;
        getChild("switch_Off").alpha = 0;
        getChild("switch_On").alpha = 1;
        scope.btn_labl = _("Power on");
        button_clickFlag = true;
        resetFn(scope);
    }
    ultrasonic_Interferometer_stage.update();
    /**Checking if the function triggered from arrows */
    if (checkPara) {
        scope.$apply();
    }

}
/** Function for toggle graph */
function showHide_graphFn(scope) {
   
    scope.graphHide ? document.getElementById("graphDiv").style.opacity = '1' : document.getElementById("graphDiv").style.opacity = '0';
    ultrasonic_Interferometer_stage.update();
}
/**Function for select gain */
function gainSelectionFn(scope, arrow_check) {    
    gainStTrigger = true;
    if (parseFloat(gain_value).toFixed(2) >= 0 && parseFloat(gain_value).toFixed(2) < 93.00 && arrow_check && !button_clickFlag) {
        gain_value += 1.86;
        adjs_value += 1.86;
        if (adjStTrigger) {
            commonGainValue = setGainValue += 2;
        } else {
            commonGainValue += 2;
        }
        setadjValue = commonGainValue;
        if (commonGainValue > commonAdjValue) {

            document.getElementById("error_section").style.display = 'block';
        } else {
            document.getElementById("error_section").style.display = 'none';
        }
        getChild("needle").rotation = Number(parseFloat(gain_value + 135).toFixed(2));
    } else if (parseFloat(gain_value).toFixed(2) > 0 && parseFloat(gain_value).toFixed(2) <= 93.00 && !arrow_check && !button_clickFlag) {
        gain_value -= 1.86;
        adjs_value -= 1.86;
        if (adjStTrigger) {

            commonGainValue = setGainValue -= 2;

        } else {
            commonGainValue -= 2;
        }
        setadjValue = commonGainValue;
        getChild("needle").rotation = Number(parseFloat(gain_value + 135).toFixed(2));
        if (commonGainValue > commonAdjValue) {

            document.getElementById("error_section").style.display = 'block';
        } else {
            document.getElementById("error_section").style.display = 'none';
        }
    }
    fixed_gainValue = gain_value;
    gain_NeedlePosition = parseFloat(gain_value + 135).toFixed(2);
    //console.log("gain_NeedlePosition " + gain_NeedlePosition)
    console.log("commonGainValue "+commonGainValue)
    ultrasonic_Interferometer_stage.update();

}
/** Function for select adj */
function adjusteSelsectionFn(scope, arrow_check) {
   
    adjStTrigger = true;
    if (parseFloat(adjs_value).toFixed(2) >= 0 && parseFloat(adjs_value).toFixed(2) < 93.00 && arrow_check && !button_clickFlag) {
        gain_value += 1.86
        adjs_value += 1.86
        if (gainStTrigger) {
            commonAdjValue = setadjValue += 2;
        } else {
            commonAdjValue += 2;
        }
        setGainValue = commonAdjValue
        getChild("needle").rotation = Number(parseFloat(adjs_value + 135).toFixed(2));
        if (commonGainValue > commonAdjValue) {

            document.getElementById("error_section").style.display = 'block';
        } else {
            document.getElementById("error_section").style.display = 'none';
        }
    } else if (parseFloat(adjs_value).toFixed(2) > 0 && parseFloat(adjs_value).toFixed(2) <= 93.00 && !arrow_check && !button_clickFlag) {
        gain_value -= 1.86
        adjs_value -= 1.86
        if (gainStTrigger) {
            commonAdjValue = setadjValue -= 2
            setGainValue = commonAdjValue
        } else {
            commonGainValue -= 2;
            commonAdjValue -= 2;
        }
        setGainValue = commonAdjValue
        getChild("needle").rotation = Number(parseFloat(adjs_value + 135).toFixed(2));
        if (commonGainValue > commonAdjValue) {

            document.getElementById("error_section").style.display = 'block';
        } else {
            document.getElementById("error_section").style.display = 'none';
        }
    }
    fixed_adjsValue = adjs_value;
    adj_NeedlePosition = parseFloat(adjs_value + 135).toFixed(2)
    //console.log("adj_NeedlePosition " +  getChild("needle").rotation)
    ultrasonic_Interferometer_stage.update();

}
/**Function for main right  Arrow */
function vernierMove_rightArrow(scope,side_right) {
    if (!button_clickFlag) {
        scope.showResult_btn_disable = false;
        scope.$apply();
    }
    vernierMove_rightInterval = setInterval(function () {
        if (getChild("smallScale").y > 166.44) {
            vernier_clicks += 0.02;
            commonVernierReading += 0.01;
            vernier_clicks_forZoom += 3.08;
            vernier_clicks_device_Front += 0.04;
            getChild("screw_Guage_Top").y = parseFloat(123 - vernier_clicks).toFixed(2)
            smallScale_polygon.graphics.clear().moveTo(103, parseFloat(200 - vernier_clicks).toFixed(2)).lineTo(130, parseFloat(200 - vernier_clicks).toFixed(2)).lineTo(131, parseFloat(225 - vernier_clicks).toFixed(2)).lineTo(129, parseFloat(238 - vernier_clicks).toFixed(2)).lineTo(105, parseFloat(238 - vernier_clicks).toFixed(2)).lineTo(102, parseFloat(225 - vernier_clicks).toFixed(2)).lineTo(103, parseFloat(200 - vernier_clicks).toFixed(2)).command;
            getChild("smallScale").y = parseFloat(200 - vernier_clicks * 0.9).toFixed(2)
            getChild("smallScale").x = parseFloat(-4088 + vernier_clicks * 110).toFixed(2)
            getChild("zoom_Scale").x = parseFloat(-5644 + vernier_clicks_forZoom).toFixed(2)
            getChild("device_Front_two").y = parseFloat(-598 + vernier_clicks_device_Front).toFixed(2)
            //getChild("piston").y=parseFloat(0-vernier_clicks_forZoom).toFixed(2)
            getChild("piston").y = parseFloat(0 - vernier_clicks_device_Front).toFixed(2)
            ////console.log("side "+side_right)
            mainCalculation(scope,side_right)
            
            ultrasonic_Interferometer_stage.update();
        }
    }, 50);

}

function vernierMove_leftArrow(scope,side) {
    if (!button_clickFlag) {
        scope.showResult_btn_disable = false;
        scope.$apply();
    }
    vernierMove_rightInterval = setInterval(function () {
        if (getChild("smallScale").y < 200) {
            vernier_clicks -= 0.02;
            vernier_clicks_forZoom -= 3.08;
            vernier_clicks_device_Front -= 0.04;
            commonVernierReading -= 0.01;
            getChild("screw_Guage_Top").y = parseFloat(123 - vernier_clicks).toFixed(2)
            smallScale_polygon.graphics.clear().moveTo(103, parseFloat(200 - vernier_clicks).toFixed(2)).lineTo(130, parseFloat(200 - vernier_clicks).toFixed(2)).lineTo(131, parseFloat(225 - vernier_clicks).toFixed(2)).lineTo(129, parseFloat(238 - vernier_clicks).toFixed(2)).lineTo(105, parseFloat(238 - vernier_clicks).toFixed(2)).lineTo(102, parseFloat(225 - vernier_clicks).toFixed(2)).lineTo(103, parseFloat(200 - vernier_clicks).toFixed(2)).command;
            getChild("smallScale").y = parseFloat(200 - vernier_clicks * 0.9).toFixed(2)
            getChild("smallScale").x = parseFloat(-4088 + vernier_clicks * 80).toFixed(2)
            getChild("zoom_Scale").x = parseFloat(-5644 + vernier_clicks_forZoom).toFixed(2)
            getChild("device_Front_two").y = parseFloat(-598 + vernier_clicks_device_Front).toFixed(2)
            getChild("piston").y = parseFloat(0 - vernier_clicks_device_Front).toFixed(2)
            
           
             mainCalculation(scope,side)
            
            ultrasonic_Interferometer_stage.update();
        }
    }, 50);

}

function vernierMove_rightArrowClear() {
    clearInterval(vernierMove_rightInterval);
    ultrasonic_Interferometer_stage.update();

}
var needleCount = 0
var needleCountTwo = 0

function mainCalculation(scope,side) {
    currentMediumSelected_Arry[currentMediumSelected_number]

    comprasabilityArry[currentMediumSelected_number]

    var velocityOfSound_liquid = Math.sqrt(comprasabilityArry[currentMediumSelected_number] * Math.pow(10, 9) / currentMediumSelected_Arry[currentMediumSelected_number]);

    var distance_mater = velocityOfSound_liquid / (2 * curren_Frequency_Glb * Math.pow(10, 6))

    var distance_millimeter = distance_mater * Math.pow(10, 3)

    var microammeterReading = commonAdjValue * Math.pow(Math.sin((1.57 / distance_millimeter * commonVernierReading)), 20)
    if (getChild("needle").rotation <= gain_NeedlePosition) {
        var differnce_gainAgdj = gain_NeedlePosition - adj_NeedlePosition;
    } else {
        var differnce_gainAgdj = adj_NeedlePosition - gain_NeedlePosition;

    }

    var gainNeedle_rtn = differnce_gainAgdj / 5;
  
    
    if (microammeterReading >  commonGainValue){
   
      getChild("needle").rotation=parseFloat(135+microammeterReading*0.938.toFixed(0))
       
        
    }else if(microammeterReading < commonGainValue ){
    
        //getChild("needle").rotation=gain_NeedlePosition;  
        getChild("needle").rotation =parseFloat(gain_NeedlePosition+microammeterReading*0.938.toFixed(0))
        

    }
    if (commonGainValue !=0 && microammeterReading < commonGainValue) {
        
        needleCount++
        microammeterReading = commonGainValue;
        if (needleCount > 0 && needleCount < 6 && commonGainValue < commonAdjValue) {
            if (getChild("needle").rotation <= gain_NeedlePosition) {} 
            else {
                //getChild("needle").rotation -= gainNeedle_rtn;
            }
            needleCountTwo = 0;
			
        }
    } else {
        microammeterReading = commonAdjValue * Math.pow(Math.sin((1.57 / distance_millimeter * commonVernierReading)), 20)
        
        needleCountTwo++
    
       
        if (needleCountTwo > 0 && needleCountTwo < 6 && commonGainValue < commonAdjValue) {
   
            if (getChild("needle").rotation <= gain_NeedlePosition) {
               // getChild("needle").rotation -= gainNeedle_rtn;
			
            } else if(commonGainValue==0){
               // getChild("needle").rotation -= gainNeedle_rtn; 
                
            }
            else {
                //getChild("needle").rotation += gainNeedle_rtn;
               
            }
            needleCount = 0;
        }else{
            if(microammeterReading >1 ){
              
             
             //  getChild("needle").rotation = adj_NeedlePosition;   
            }else{
                 // getChild("needle").rotation = gain_NeedlePosition;   
                
            }
          
        }
            
         
                
             
        
        
    }
  
if(side=="rightHand"){
    
      dataplot_array.push({
        x: commonVernierReading.toFixed(2),
        y: microammeterReading
    });
    makeGraph(); 
}else{
    dataplot_array.pop()
            makeGraph();
    
}
  
    ultrasonic_Interferometer_stage.update();
}


/** Function for change medium color */
function changeMediumColors(scope, count) {
    getChild("color_common").alpha = 0;
    getChild("color_kerosene").alpha = 0;
    getChild("color_castorOil").alpha = 0;
    if (count == 2) {
        getChild("color_castorOil").alpha = 1;
    } else if (count == 3) {

        getChild("color_kerosene").alpha = 1;
    } else {

        getChild("color_common").alpha = 1;

    }
    ultrasonic_Interferometer_stage.update();
}

/** Draws a chart in canvas js for making graph plotting */
function makeGraph() {
    /* Graph features */
    chart = new CanvasJS.Chart("graphDiv", {
        axisX: {
            title: grph_x_lbl,
            /** X axis label */
            labelFontColor: "black",
            minimum: 0,
            maximum: 6,
            interval: 1
        },
        axisY: {
            title: grph_y_lbl + "(μA)",
            /** Y axis label */
            labelFontColor: "black",
            minimum: 0,
            maximum: 120,
            interval: 20,
            margin: 10
        },
        data: [{
            color: "RED",
            type: "line",
            markerType: "circle",
            markerSize: 1,
            lineThickness: 2,
            dataPoints: dataplot_array /** Array contains the data */
        }]
    });
    chart.render(); /** Rendering the graph */
    ultrasonic_Interferometer_stage.update();
}

function resetFn(scope) {
    initialisationOfVariables(scope)
    getChild("needle").rotation = 135;
    scope.CrossSection = false;
    scope.showResult_mdl = false;
    showCrossSectionFn(scope);
    scope.graphHide = false;
    showHide_graphFn(scope)
    getChild("piston").y = 0;
    getChild("smallScale").y = 200;
    getChild("smallScale").x = -4088;
    getChild("zoom_Scale").x = -5644;
    getChild("device_Front_two").y = -598;
    getChild("screw_Guage_Top").y = 123;
    document.getElementById("resultSection").style.display = 'none';
    document.getElementById("resultSection_two").style.display = 'none';
    document.getElementById("error_section").style.display = 'none';
    scope.showResult_btn_disable = true;
    scope.select_Medium_mdl = 0;
    changeMediumFn(scope);
    dataplot_array = [];
    makeGraph()
    scope.curren_Frequency = 1;
    needleCount = 0
    needleCountTwo = 0
    changeFrequencyFn(scope)
}

function showHideResultFn(scope) {
    scope.showResult_mdl ? document.getElementById("resultSection").style.display = 'block' : document.getElementById("resultSection").style.display = 'none';
    scope.showResult_mdl ? document.getElementById("resultSection_two").style.display = 'block' : document.getElementById("resultSection_two").style.display = 'none';
    ultrasonic_Interferometer_stage.update();
}

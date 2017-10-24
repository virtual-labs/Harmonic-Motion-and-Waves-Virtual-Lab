(function () {
    angular.module('users')
        .directive("experiment", directiveFunction)
})();

var ultrasonic_Interferometer_stage, exp_canvas, tick, currentMediumSelected_number;
var initial_frequency, final_frequency;
var polygon = new createjs.Shape();
var smallScale_polygon = new createjs.Shape();
var zoomed_view_of_vernier_mask = new createjs.Shape();
var vernierPiston_mask = new createjs.Shape();
var button_clickFlag, arrow_check = true;
var mediumColorArray = ["color_common", "color_common", "color_kerosene", "color_castorOil", "color_common"];
var gain_value, adjs_value, fixed_gainValue, fixed_adjsValue, vernier_clicks, vernier_clicks_forZoom, vernier_clicks_device_Front, curren_Frequency_Glb;
var vernierMove_rightInterval;
var currentMediumSelected_Arry = [996.458, 790, 810, 956.14, 1260];
var comprasabilityArry = [2.15, 0.92, 1.3, 0.96, 21];
var commonGainValue, commonAdjValue, commonVernierReading;
var dataplot_array = [];
var gainStTrigger, adjStTrigger;
var setAdjst, setGain, setGainValue, setadjValue;
var resultVelocity = [];
var resultAdiabatic = [];
var gain_NeedlePosition, adj_NeedlePosition, differnce_gainAgdj,microammeterReading;

function directiveFunction() {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            /** Variable that decides if something should be drawn on mouse move */
            var experiment = true;
            if (element[0].width > element[0].height) {
                element[0].width = element[0].height;
                element[0].height = element[0].height;
            } else {
                element[0].width = element[0].width;
                element[0].height = element[0].width;
            }
            if (element[0].offsetWidth > element[0].offsetHeight) {
                element[0].offsetWidth = element[0].offsetHeight;
            } else {
                element[0].offsetWidth = element[0].offsetWidth;
                element[0].offsetHeight = element[0].offsetWidth;
            }
            exp_canvas = document.getElementById("demoCanvas");
            exp_canvas.width = element[0].width;
            exp_canvas.height = element[0].height;
            ultrasonic_Interferometer_stage = new createjs.Stage("demoCanvas");
            queue = new createjs.LoadQueue(true);
            queue.loadManifest([{
                id: "background",
                src: "././images/background.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "cross_Section",
                src: "././images/cross_Section.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "device_Back",
                src: "././images/device_Back.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "device_Front",
                src: "././images/device_Front.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "light_On",
                src: "././images/light_on.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "screw_Guage_Top",
                src: "././images/screw_Guage_Top.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "switch_Off",
                src: "././images/switch_Off.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "switch_On",
                src: "././images/switch_On.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "zoom_Scale",
                src: "././images/zoom_Scale.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "zoom_Portion",
                src: "././images/zoom_Portion.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "reading_Area_Top",
                src: "././images/reading_Area_Top.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "arrow",
                src: "././images/arrow.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "needle",
                src: "././images/needle.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "piston",
                src: "././images/piston.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "color_common",
                src: "././images/color_common.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "color_kerosene",
                src: "././images/color_kerosene.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
                id: "color_castorOil",
                src: "././images/color_castorOil.svg",
                type: createjs.LoadQueue.IMAGE
			}]);
            loadingProgress(queue, ultrasonic_Interferometer_stage, exp_canvas.width);
            ultrasonic_Interferometer_stage.enableDOMEvents(true);
            ultrasonic_Interferometer_stage.enableMouseOver();
            createjs.Touch.enable(ultrasonic_Interferometer_stage);
            queue.on("complete", handleComplete, this);
            tick = setInterval(updateTimer, 5); /** Stage update function in a timer */

            zoomScale_view_container = new createjs.Container(); /** Creating the zoomout view container */
            zoomScale_view_container.name = "zoomScale_view_container";
            ultrasonic_Interferometer_stage.addChild(zoomScale_view_container); /** Append it in the stage */

            function handleComplete() {
                loadImages(queue.getResult("background"), "background", 0, 0, 1, "", 0, ultrasonic_Interferometer_stage);

                loadImages(queue.getResult("device_Back"), "device_Back", 0, 0, 1, "", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("device_Front"), "device_Front", 0, 0, 1, "", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("cross_Section"), "cross_Section", 0, 0, 1, "", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("piston"), "piston", 0, 0, 1, "", 0, ultrasonic_Interferometer_stage);

                loadImages(queue.getResult("color_common"), "color_common", 98.2, 432, 0.34, "", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("color_kerosene"), "color_kerosene", 98.2, 432, 0.34, "", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("color_castorOil"), "color_castorOil", 98.2, 432, 0.34, "", 0, ultrasonic_Interferometer_stage);



                loadImages(queue.getResult("light_On"), "light_On", 0, 0, 1, "", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("screw_Guage_Top"), "screw_Guage_Top", 99, 123, 1, "", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("needle"), "needle", 371, 471, 1, "", 135, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("reading_Area_Top"), "reading_Area_Top", 0, 0, 1, "", 0, ultrasonic_Interferometer_stage);

               
                loadImages(queue.getResult("arrow"), "gain_arrow_right", 557, 371, 1, "pointer", 270, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("arrow"), "adj_arrow_left", 578, 362, 1, "pointer", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("arrow"), "adj_arrow_right", 615, 371, 1, "pointer", 270, ultrasonic_Interferometer_stage);

                

                /* loadImages(queue.getResult("zoom_Portion"), "zoom_Portion", 0, 0, 1, "", 0, ultrasonic_Interferometer_stage);*/
                loadImages(queue.getResult("device_Front"), "device_Front_two", -80, -598, 2.8, "", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("screw_Guage_Top"), "screw_Guage_TopTwo", 197, -250, 2.8, "", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("zoom_Scale"), "zoom_Scale", -5644, 18, 0.7, "", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("zoom_Scale"), "smallScale", -4088, 200, 0.5, "", 0, ultrasonic_Interferometer_stage);

                loadImages(queue.getResult("switch_Off"), "switch_Off", 0, 0, 1, "pointer", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("switch_On"), "switch_On", 0, 0, 1, "pointer", 0, ultrasonic_Interferometer_stage);
                /** For masking the zoomed vernier machine */
                ultrasonic_Interferometer_stage.addChild(zoomed_view_of_vernier_mask);
                zoomed_view_of_vernier_mask.graphics.beginStroke("#FFFFFF");
                zoomed_view_of_vernier_mask.graphics.setStrokeStyle(3);
                zoomed_view_of_vernier_mask.graphics.drawRect(170, 20, 150, 150).command;
                zoomed_view_of_vernier_mask.alpha = 1;

                /** For masking the polygon */
                zoomScale_view_container.addChild(polygon);
                polygon.graphics.beginStroke("red");
                polygon.graphics.moveTo(209, 18).lineTo(284, 18).lineTo(284, 50).lineTo(277, 78).lineTo(215, 78).lineTo(209, 50).lineTo(209, 18).command;
                polygon.alpha = 0.01;

                /** For masking the polygon */
                ultrasonic_Interferometer_stage.addChild(smallScale_polygon);
                smallScale_polygon.graphics.beginStroke("red");
                smallScale_polygon.graphics.moveTo(103, 200).lineTo(130, 200).lineTo(131, 225).lineTo(129, 238).lineTo(105, 238).lineTo(102, 225).lineTo(103, 200).command;
                smallScale_polygon.alpha = 0.01;

                /** For masking the vernier Piston */
                ultrasonic_Interferometer_stage.addChild(vernierPiston_mask);
                    vernierPiston_mask.graphics.beginStroke("#FFFFFF");
                vernierPiston_mask.graphics.setStrokeStyle(3);
                vernierPiston_mask.graphics.drawRect(50, 430, 150, 100).command;
                vernierPiston_mask.alpha = 0.01;
                loadImages(queue.getResult("arrow"), "gain_arrow_left", 520, 362, 1, "pointer", 0, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("arrow"), "main_left_arrow", 95, 110, 2, "pointer", 45, ultrasonic_Interferometer_stage);
                loadImages(queue.getResult("arrow"), "main_right_arrow", 138, 135, 2, "pointer", 230, ultrasonic_Interferometer_stage);
                initialisationOfVariables(); /** Initializing the variables */
                translationLabels(); /** Translation of strings using gettext */
                initialisationOfControls(scope); /** Initializing the controls */
      
                initialisationOfImages(scope); /** Function call for images used in the apparatus visibility */

                getChild("switch_Off").addEventListener("click", function (evt) {
                    button_clickFlag = false;
                    powerOn_resetFn(scope, true)
                });
                getChild("switch_On").addEventListener("click", function (evt) {
                    button_clickFlag = true;
                    powerOn_resetFn(scope, true)
                });

                

                getChild("adj_arrow_left").addEventListener("click", function (evt) {
                    adjusteSelsectionFn(scope, false)
                });
                getChild("adj_arrow_right").addEventListener("click", function (evt) {
                    adjusteSelsectionFn(scope, true)
                });


                getChild("main_right_arrow").addEventListener("mousedown", function (evt) {
                    vernierMove_rightArrow(scope,"rightHand")
                });
                getChild("main_right_arrow").addEventListener("pressup", function (evt) {
                    vernierMove_rightArrowClear(scope)
                      ultrasonic_Interferometer_stage.update();
                });


                getChild("main_left_arrow").addEventListener("mousedown", function (evt) {
                    vernierMove_leftArrow(scope,"leftHand")
                      ultrasonic_Interferometer_stage.update();
                });
                getChild("main_left_arrow").addEventListener("pressup", function (evt) {
                    vernierMove_rightArrowClear(scope)
                      ultrasonic_Interferometer_stage.update();
                });
                //getChild("main_left_arrow").addEventListener("click", function(evt){adjusteSelsectionFn()});

                    getChild("gain_arrow_right").addEventListener("click", function (evt) {
                    gainSelectionFn(scope, true)
                         ultrasonic_Interferometer_stage.update();
                });
                getChild("gain_arrow_left").addEventListener("click", function (evt) {
                    gainSelectionFn(scope, false)
                     ultrasonic_Interferometer_stage.update();
                });
                makeGraph(1.2, 2.3)
                ultrasonic_Interferometer_stage.update();
            }


            /** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */
            function translationLabels() {
                /** This help array shows the hints for this experiment */
                help_array = [_("help1"), _("help2"), _("help3"), _("help4"), _("help5"), _("help6"), _("help7"), _("help8"), _("help9"), _("Next"), _("Close")];
                scope.heading = _("Ultrasonic Interferometer");
                scope.variables = _("Variables");
                scope.choose_medium_lbl = _("Choose medium :");
                scope.frequency_lbl = _("Frequency of wave(MHz) :");
                scope.power_on_labl = _("Power on");
                scope.cross_section_lbl = _("Show cross section");
                scope.show_graph_lbl = _("Show graph");
                scope.water_lbl = _("Water_one");
                scope.showresult_lbl = _("Show result");
                scope.result_one_lbl = _("Velocity of ultrasonic wave(m/s):");
                scope.result_two_lbl = _("Adiabatic compressibility: ");
                scope.error_lbl = _("ADJ reading should be greater than the GAIN");
                scope.copyright = _("copyright");
                scope.reset_lbl = _("Reset");
                grph_x_lbl = _("Distance(mm)");
                grph_y_lbl = _("Current");
                /** Select Material dropdown */
                scope.meterial_array = [{
                    Material: _("Water"),
                    index: 0
				}, {
                    Material: _("Acetone"),
                    index: 1
				}, {
                    Material: _("Kerosene"),
                    index: 2
				}, {
                    Material: _("Castor Oil"),
                    index: 3
				}, {
                    Material: _("Glycerine"),
                    index: 4
				}];
                scope.$apply();
                ultrasonic_Interferometer_stage.update();
            }
        }
    }

}

/** Createjs stage updation happens in every interval */
function updateTimer() {
    ultrasonic_Interferometer_stage.update();
}
/** Function to return child element of stage */
function getChild(child_name) {
    return ultrasonic_Interferometer_stage.getChildByName(child_name); /** Returns the child element of stage */
}
/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, scale, cursor, rot, container) {
    var _bitmap = new createjs.Bitmap(image).set({});
    _bitmap.x = xPos;
    _bitmap.y = yPos;
    _bitmap.scaleX = _bitmap.scaleY = scale;
    if (name == "screw_Guage_TopTwo" || name == "device_Front_two") {
        _bitmap.mask = zoomed_view_of_vernier_mask;
    }
    if (name == "zoom_Scale") {
        _bitmap.mask = polygon;
    }
    if (name == "smallScale") {
        _bitmap.mask = smallScale_polygon;
    }
    if (name == "piston") {
        _bitmap.mask = vernierPiston_mask;
    }
    _bitmap.name = name;
    _bitmap.alpha = 1;

    _bitmap.rotation = rot;
    _bitmap.cursor = cursor;
    container.addChild(_bitmap); /** Adding bitmap to the container */
}
/** All variables initialising in this function */
function initialisationOfVariables(scope) {
    currentMediumSelected_number = 0;
    gain_value = 0;
    adjs_value = 0;
    fixed_gainValue = 0;
    fixed_adjsValue = 0;
    button_clickFlag = true;
    vernier_clicks = 0;
    vernier_clicks_forZoom = 0;
    vernier_clicks_device_Front = 0;
    curren_Frequency_Glb = 1;
    commonGainValue = 0;
    commonAdjValue = 0;
    commonVernierReading = 0;
    gainStTrigger = false;
    adjStTrigger = false;
    setAdjst = false;
    setGain = false;
    setGainValue = 0;
    setadjValue = 0;
    resultVelocity = ["996.458 ms-¹", "790 ms-¹", "810 ms-¹", "956.14 ms-¹", "1260 ms-¹"];
    resultAdiabatic = ["2.15 X 10-¹⁰ m² N-¹", "0.92 X 10-¹⁰ m² N-¹", "1.3 ⁴ x 10-¹⁰ m² N-¹", "0.96 X 10-¹⁰ m² N-¹", "21 X 10-¹⁰ m² N-¹"];
    gain_NeedlePosition = 135;
    adj_NeedlePosition = 135;
}
/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages(scope) {


    getChild("cross_Section").alpha = 0;
    getChild("piston").alpha = 0;
    getChild("light_On").alpha = 0;
    getChild("switch_Off").alpha = 0;
    getChild("color_common").alpha = 0;
    getChild("color_kerosene").alpha = 0;
    getChild("color_castorOil").alpha = 0;
    document.getElementById("graphDiv").style.opacity = 0;
    scope.btn_labl = _("Power on");
}

/** All controls initialising in this function */
function initialisationOfControls(scope) {
    scope.initial_frequency = 1
    scope.final_frequency = 5
    scope.curren_frequency_steps = 1;
    scope.curren_frequency_min = 1;
    scope.curren_frequency_max = 5;
    scope.showResult_btn_disable = true;
    scope.change_rangeOf_ovenMdl = 0;
    scope.range_of_current = 0;
    scope.result_one = resultVelocity[0];
    scope.result_two = resultAdiabatic[0];
    scope.curren_Frequency = 1;

}
/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize, container, font) {
    var text = new createjs.Text(value, "bold " + fontSize + font, color);
    text.x = textX;
    text.y = textY;
    text.textBaseline = "alphabetic";
    text.name = name;
    text.text = value;
    text.color = color;
    container.addChild(text); /** Adding text to the container */
    ultrasonic_Interferometer_stage.update();
}

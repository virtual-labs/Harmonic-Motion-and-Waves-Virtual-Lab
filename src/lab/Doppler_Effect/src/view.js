(function() {
    angular.module('users')
        .directive("experiment", directiveFunction)
})();

/** Variables declarations */

var selected_medium_index, selected_source_index, selected_destination_index, source_counter,air_velocity;

var detector_container, circle_name, radius, circle_centre, source_x, source_y, detected_x, detected_y, det_counter;

var medium_velocity, source_velocity, detector_velocity, source_frequency, detected_frequency, detector_x, detector_y;

var source_graph_final, listener_graph_final, detector_speed, frame, state, temp_y, hit_flag, timer, reverse_flag, BOUND_WIDTH;

var container_border_rect = new createjs.Shape();
var source_graph_line = new createjs.Shape();
var receiver_graph_line = new createjs.Shape();
var source_graph_middle_line = new createjs.Shape();
var receiver_graph_middle_line = new createjs.Shape();
var source_wave_container = new createjs.Container();
var receiver_wave_container = new createjs.Container();
var dragOffset = new createjs.Point();

/** Arrays declarations */
var source_points, detected_points, help_array;

function directiveFunction() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            /** Variable that decides if something should be drawn on mouse move */
            var experiment = true;
            if ( element[0].width > element[0].height ) {
                element[0].width = element[0].height;
                element[0].height = element[0].height;
            } else {
                element[0].width = element[0].width;
                element[0].height = element[0].width;
            }
            if ( element[0].offsetWidth > element[0].offsetHeight ) {
                element[0].offsetWidth = element[0].offsetHeight;
            } else {
                element[0].offsetWidth = element[0].offsetWidth;
                element[0].offsetHeight = element[0].offsetWidth;
            }
			exp_canvas = document.getElementById("demoCanvas"); /** Initialization of canvas element */
			exp_canvas.width = element[0].width;
            exp_canvas.height = element[0].height;
			doppler_effect_stage  = new createjs.Stage("demoCanvas") /** Initialization of stage element */
			queue = new createjs.LoadQueue(true); /** Initialization of queue object */
			loadingProgress(queue,doppler_effect_stage,exp_canvas.width) /** Preloader function */
            queue.on("complete", handleComplete, this);
            queue.loadManifest([{ /** Loading all images into queue */
				id: "detector",
                src: "././images/detector.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
				id: "light_on",
                src: "././images/light_on.svg",
                type: createjs.LoadQueue.IMAGE
			}, {
				id: "light_off",
                src: "././images/light_off.svg",
                type: createjs.LoadQueue.IMAGE
			}
            ]);
            
			/** Activates mouse listeners on the stage */
            doppler_effect_stage.enableDOMEvents(true);
            doppler_effect_stage.enableMouseOver();
			createjs.Touch.enable(doppler_effect_stage);
			detector_container = new createjs.Container(); 
            detector_container.name = "detector_container"; 			 
            function handleComplete() {
				/** Loading images */
				loadImages(queue.getResult("detector"), "detector",20,250, "move", 1,detector_container);
				loadImages(queue.getResult("light_on"), "light_on", 0,360, "", 1,detector_container);
				loadImages(queue.getResult("light_off"), "light_off", 0,360, "", 1,detector_container);
				setText("detector_txt", 40, 400, _("0"), "#000000", 1, detector_container);/** To display the detected frequency in the detector*/
				setText("source_text", 50, 540, _("waves emitted from the source"), "black", 1, doppler_effect_stage); /** Label for source wave text */
                setText("reciever_text", 400, 540, _("waves detected by the receiver"), "black", 1, doppler_effect_stage); /** Label for receiver wave text */
				doppler_effect_stage.addChild(container_border_rect); /** Appending the border rectangle in the container */  
				doppler_effect_stage.addChild(detector_container); /** Appending the detector container in the stage */
				setText("source_txts",75, 275, _("source"), "#000000", 1, doppler_effect_stage); /** Label for source text */
                translationLabels(); /** Translation of strings using gettext */
                initialisationOfVariables(scope); /** Function call to initialise all variables */
				initialisationOfImages(scope); /** Function call to reset the image positions */
				timer = setInterval(function() { updateStage(scope); },0);
				var source_mask_rect = new createjs.Shape(); /** Rect for mask the source wave */
				source_mask_rect.graphics.beginStroke("#BDC2C8").drawRect(0, 560, 330, 140); 
				source_graph_line.mask = source_mask_rect; /** Mask the source sine waves */
				doppler_effect_stage.addChild(source_mask_rect);/** Adding that rectangle to the stage */
				var receiver_mask_rect = new createjs.Shape(); /** Rect for mask the detected wave */
				receiver_mask_rect.graphics.beginStroke("#BDC2C8").drawRect(361, 560, 339, 140); 
				source_graph_middle_line.graphics.moveTo(0, 630).setStrokeStyle(1).beginStroke("#BDC2C8").lineTo(330, 630); /** Adding the middle line of source wave*/
				receiver_graph_middle_line.graphics.moveTo(360, 630).setStrokeStyle(1).beginStroke("#BDC2C8").lineTo(700, 630); /** Adding the middle line of detected wave*/
				doppler_effect_stage.addChild(source_graph_middle_line); /** Adding middle line to the stage */
				doppler_effect_stage.addChild(receiver_graph_middle_line); /** Adding middle line to the stage */
				receiver_graph_line.mask = receiver_mask_rect; /** Mask the detected sine waves */
				doppler_effect_stage.addChild(receiver_mask_rect); /** Adding that rectangle to the stage */
				doppler_effect_stage.addChild(source_graph_line); /** Adding the source graph line to the stage */
				doppler_effect_stage.addChild(receiver_graph_line); /** Adding the received graph line to the stage */
				moveSource(scope);/** Function call to create and move sound waves based on the velocity */
				/** Stage listeners for checking mouse events */
				detector_container.addEventListener("mousedown", startDrag); // start drag listener    
				detector_container.addEventListener("mouseup", stopDrag);   // stop drag listener
			}

			/** Add all the strings used for the language translation here. '_' is the short cut for 
            calling the gettext function defined in the gettext-definition.js */
			function translationLabels() {
				/** This help array shows the hints for this experiment */
				help_array = [_("help1"), _("help2"), _("help3"), _("help4"),_("help5"),_("help6"),_("help7"), _("Next"), _("Close")];
				/** Experiment name */
				scope.heading = _("Doppler Effect");
				/** Labels for buttons */
				scope.reset = _("reset");
				scope.variables = _("variables");
				scope.result = _("result");
				scope.copyright = _("copyright");
				/** Labels for Select Medium */
				scope.medium_label = _("Select Medium:");
				/** Labels for Select Source Direction */
				scope.source_direction_label = _("Select Source Direction");
				/** Labels for Select Receiver Direction */
				scope.receiver_direction_label = _("Select Receiver Direction");
				/** Labels for Select Medium */
				scope.source_velocity_label = _("Source Velocity");
				/** Labels for Select Source Direction */
				scope.detector_velocity_label = _("Detector Velocity");
				/** Labels for Select Receiver Direction */
				scope.source_frequency_label = _("Source Frequency");
				/** Labels for Select Receiver Direction */
				scope.detected_frequency_label = _("Detected Frequency");
				/** Unit for velocity */
				scope.velocity_unit = _("m/s");
				/** Unit for frequency */
				scope.frequency_unit = _("Hz");
				/** Initializing Medium array */
				scope.mediumArray = [{optionsMedium: _('Air, dry at 20 C,343m/s'),type: 0}, {optionsMedium: _('Water at 15 C, 1482m/s'),type: 1}, {optionsMedium: _('Glass, 3962m/s'),type: 2},{optionsMedium: _('Steel, 5800m/s'),type: 3}];
				/** Initializing Medium array */
				scope.sourceArray = [{optionsSource: _('right'),type: 0}, {optionsSource: _('left'),type: 1}];
				/** Initializing Medium array */
				scope.destinationArray = [{optionsDestination: _('right'),type: 0}, {optionsDestination: _('left'),type: 1}];
            }
        }
    }	
}

/** Function for draggable listeners */
/** Function to drag detector */
function startDrag(){
	dragOffset.x = doppler_effect_stage.mouseX - detector_container.x;
	detector_container.addEventListener("pressmove", moveDrag);   
} 
  
/** Function to stop dragging detector */	
function stopDrag(){
	 detector_container.removeEventListener("pressmove", moveDrag);   
} 

/** Function to stop dragging detector */	
function moveDrag(evt){
	switch(evt.stageX > 0) {
		case(evt.stageX - dragOffset.x > 575) : detector_container.x = 575; break; /** Left restriction of the detector*/
		case(evt.stageX - dragOffset.x < 0) : detector_container.x = 0; break; /** Right restriction of the detector */
		case(evt.stageX - dragOffset.x <= 575 && evt.stageX - dragOffset.x > 0) : /** Setting detector position within the boundary */
			detector_container.x = evt.stageX - dragOffset.x; break; /** Setting the container x position after drag and drop */
	}
}    

/** Function to move the director */
function moveDetector(scope) { 
	switch( detector_velocity > 0 ) {
		case ( selected_destination_index == 0 ): /** Right movement of the detector */
			switch ( detector_container.x > -1 ) {
				case( detector_container.x  >= 700 ) : initialisationOfImages(scope); break; /** Repositioning the detector if it reaches the right boundary */
				case( detector_container.x  < 700 ) : detector_container.x += detector_speed+1;break; /** Move the detector to up to the boundary */
			} break;
		case ( selected_destination_index == 1 ): /** Left movement of the detector */
			if ( detector_container.x  <= -100 ) { /** Repositioning the detector if it reaches the left boundary */
				detector_container.x  = 700;	
			}
			detector_container.x -= detector_speed+1; /** Setting the speed of the detector */
			break;
	}
}

/** All variables initialising in this function */
function initialisationOfVariables(scope) {
	selected_medium_index = scope.medium_Mdl = 0; /** Initialising selected medium index variable */
	selected_source_index = scope.source_Mdl = 0; /** Initialising selected source index variable */
	selected_destination_index = scope.destination_Mdl = 0; /** Initialising selected destination index variable */
	scope.source_velocity_value = scope.detector_velocity_value = 0;
	frame = hit_flag = detected_frequency = source_counter = det_counter = 0; 
	scope.source_frequency_value = source_frequency = 100;
	source_points = detected_points = {}; /** Initialising the array used to plot graph */
	scope.detected_frequency_value = 0; /** Setting initial detected frequency */
	BOUND_WIDTH = 700; /** Width of the canvas */
	source_velocity = detector_velocity  = 0;
	source_frequency = 100; /** Setting initial source frequency */
	source_graph_final = 370; /** Setting the end point of source sine wave */
	listener_graph_final = 340; /** Setting the end point of detected sine wave */
	circle_centre = 100; /** Setting centre position of circles */
	source_x = -40; /** Setting initial x point of source wave */
	detected_x = 360; /** Setting initial x point of detected wave */
	air_velocity = 343; /** Initialising the air velocity */
	detector_x = 20; /** Setting detector x position */
	detector_y = 250;  /** Setting detector y position  */
	reverse_flag = false;
	state = null;
}

/** Initialising the x,y position of slider images in this function */
function initialisationOfImages(scope) {
	detector_container.x = detector_container.y = 0;
	detector_container.getChildByName("detector").x = 20; /** Initialising the x position of detector */
	detector_container.getChildByName("light_off").x = detector_container.x+100; /** Initialising the x position of light */
	detector_container.getChildByName("light_on").x = detector_container.x+100; /** Initialising the x position of light */
	detector_container.getChildByName("detector_txt").x = 40; /** Setting the x position of detector text*/
	detector_container.getChildByName("light_on").visible = detector_container.getChildByName("light_off").visible = false;	
	getChild("source_txts").x = 75; /** Setting the x position of source label */
	getChild("source_txts").y = 275;/** Setting the y position of source label */
}

/** Function to set the table values based on the drop down selection */
function setMediumFn(scope) {
	selected_medium_index = scope.medium_Mdl;
	switch(selected_medium_index >-1) {
		case (selected_medium_index == 0) :container_border_rect.graphics.clear().beginFill("#f4ffff ").drawRect(0, 0, 700, 500).endFill();
				  medium_velocity = 343;  break;scope.$apply();
		case (selected_medium_index == 1) :container_border_rect.graphics.clear().beginFill("#EBF4FA").drawRect(0, 0, 700, 500).endFill();
				  medium_velocity = 1482;  break;scope.$apply();
		case (selected_medium_index == 2) :container_border_rect.graphics.clear().beginFill("#BBD9EE").drawRect(0, 0, 700, 500).endFill();
				  medium_velocity = 3962;  break;scope.$apply();
		case (selected_medium_index == 3) :container_border_rect.graphics.clear().beginFill("#cccccc").drawRect(0, 0, 700, 500).endFill();
				  medium_velocity = 5800;  break;scope.$apply();
	}
}

/** Function to set the source velocity */
function setSourceVelocityFn(scope) {
	source_velocity = scope.source_velocity_value; /** Setting the source speed based on the slider value */
	circle_centre = 100; /**Resetting the  circle radius while changing the slider */
}

/** Function to set the detector velocity */
function setDetectorVelocityFn(scope) {
	detector_velocity = scope.detector_velocity_value;
	if ( detector_velocity > 0 ) { 
		detector_speed = (detector_velocity/1200)*3;/** Setting the detector speed based on the slider value */
	}
	else {
		detector_speed = 0;
		detector_container.x = detector_container.y = 0;
	}
}

/** Function to set the source frequency */
function setSourceFrequencyFn(scope) {
	source_frequency = scope.source_frequency_value; /**Frequency of sound will be slider's current value */
}

/** Function to set the source direction */
function setsourceDirectionFn(scope) {
	selected_source_index = scope.source_Mdl;
}

/** Function to set the receiver direction */
function setReceiverDirectionFn(scope) {
	selected_destination_index = scope.destination_Mdl;
}

/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize, container) { 
    var _text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    _text.x = textX;
    _text.y = textY;
    _text.textBaseline = "alphabetic";
    _text.name = name;
    _text.text = value;
    _text.color = color;
	container.addChild(_text);/** Adding the text to the stage */
}

/** All the images loading and added to the stage */
function loadImages(image, name, xPos, yPos, cursor, scale,container) {
	var _bitmap = new createjs.Bitmap(image).set({});
    _bitmap.x = xPos;
    _bitmap.y = yPos;
	_bitmap.scaleX = _bitmap.scaleY = scale;
    _bitmap.name = name;
	_bitmap.cursor = cursor;
	container.addChild(_bitmap); /** Adding bitmap to the stage */
}

/** Function to create circles and movement of circles based on the drop down menu selection */
function moveSource(scope) {  
	var	obj = [];
	function animate(canvas, generate) { /** Changes circle element from one state to another by changing it's properties */
		var drawCircle = function(state) {
			doppler_effect_stage.removeChild(circle_name); /** Removing the circle element from the stage */
			circle_name = new createjs.Shape(); /** Creating new instance of circle and applying new properties */
			state.map(function(obj) { /** To set the properties for each elements in the array where obj is the current element */
				obj.stroke  = 1- obj.r/250;  /** Reducing the colour of circle based on it's radius */
				radius = (20/source_frequency)*100; /** Reducing circle radiusius while increasing the frequency using the slider */
				switch(source_velocity > -1) {
					case( source_velocity == 0 ) : obj.x = 100; getChild("source_txts").x = 75; break; /** Setting the circle position if source velocity has no changes */
					case( source_velocity > 0 ) : 					
						if ( selected_source_index == 1 ) { /** Assigning the position of circle left movement */
							obj.x = -obj.x+700;
							if ( obj.x < 0) { /** Resetting the circle position to right when it reaches the left boundary */ 
								obj.x = 700;
							}
						}
						/** Assigning the centre circle as source */
						if ( obj.color ) {/** For checking if the current object is the source */
							circle_centre = obj.x; /** Assigning the x position of centre circle to a variable */
							
							getChild("source_txts").x = circle_centre - 20; /** Set the source label x position */
						} break; 
				}
				circle_name.graphics.beginStroke('rgba(255,0,0,'+obj.stroke+')'); /** Drawing the circle and reducing the colour */
				if ( obj.color ) { /** Checking if the circle is the centre */
					circle_name.graphics.beginStroke("white");
					circle_name.graphics.beginFill(obj.color).arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI,false);				
					if ( obj.x >=  BOUND_WIDTH ) { /** Drawing the circle from the initial point if it reaches the boundary */
						frame = 0;
						frame++;
					}
				}  
				circle_name.graphics.setStrokeStyle(1.5); /** Setting the line colour of circle */
				circle_name.graphics.beginFill('rgba(255,0,0,'+obj.stroke*.05+')').arc(obj.x, obj.y, obj.r, 0, 2 * Math.PI,false); /**Creating the black circle*/				
				doppler_effect_stage.addChild(circle_name); /** Adding the circle element to the stage */
				doppler_effect_stage.setChildIndex(detector_container, doppler_effect_stage.getNumChildren()-1);/** Setting the position of detector on top of all circles created */	
			});
        }
        var animateCircle = function() {
			var state = generate({ /** Variable which holds the animation details to draw each time  */
                width: 700, /** Setting the height and width to which circle to be drawn on the canvas */
                height: 500,
                frame:  frame++ 
            });
			if ( state == null ) { /** Drawing the circle from the initial point */
				frame = 0;
				frame++;
            } 
			drawCircle(state); /** Function call to draw the circles and passing the new state to redraw circles */
			requestAnimationFrame(animateCircle);/** Passing the current element to be animate and update the animation */
        };
        animateCircle(); /** Function call for circle animation */
    }
	
    animate(exp_canvas, function(state) { /** Function call to animate the circle with the following properties */
		if ( obj.x >= BOUND_WIDTH ) { /** Checking boundary of canvas */
			return null; /** For drawing the circle from the first frame */
		} 
		if ( source_velocity == 0 && state.frame >354 )	{ /** for drawing circle from the middle if source velocity has no changes.*/
			frame = 177; /** For drawing the circle from the 177 th frame while source velocity has no changes.*/
		}
		objs = [];
		objs = [
            {
                type: 'circle',
                color: 'black',/** Setting the colour of centre circle */
				x: frame+state.frame*(source_velocity/1200)*(60/radius), /** Adjusting the movement speed of centre circle */
                y: state.height / 2, /** Setting the Y position of centre circle */
                r: 5 /** Setting the radius of centre circle */
            }
        ];
        for(var i=1; i<=state.frame/radius; i++) {
			objs.push({
                type: 'circle',
				x:frame+ i * radius*(source_velocity/1200)*(60/radius),//3, /** Setting the movement speed of all circles except centre circle */
                y: state.height / 2, /** Setting the Y position of all circles except centre circle */
				r:((state.frame - (i * radius)) /2)*3 /** Setting the radius of all circles except centre circle  */
			});
			setDetectorFrequency(scope); /** Function call to calculate the detector frequency */
        } 
		if ( detector_velocity > 0 ) { /** Checking the detector velocity */
			moveDetector(scope); /** Function call to move the detector */
		}
        return objs;
    });	
}

/** Function to draw the detected sine wave  */
function detectedSineWave(scope) {
	var detected_degree = (2*180*detected_frequency*detected_x/1000) / (180 / Math.PI);
	switch ( det_counter > -1 ) {
		case( det_counter < listener_graph_final ) : /** Drawing the line from  starting point to end point */
			receiver_graph_line.graphics.setStrokeStyle(1).beginStroke("green");
			receiver_graph_line.graphics.lineTo(detected_x,detected_y); 
			detected_x += 1; /** Incrementing the x position for getting the x values of sine wave */
			detected_y = detectorYValue(detected_degree); /** Function call to get the Y value of the detected sine wave */
			detected_points[detected_x] = detected_y; /** Setting the Y value of the detected sine wave */    
			receiver_graph_line.graphics.lineTo(detected_x,detected_y).setStrokeStyle(1).beginStroke("red");
			break;
		case( det_counter >= listener_graph_final ) :/** Clearing the line and redrawing */
			receiver_graph_line.graphics.clear(); /** Clearing the line and start from the beginning  */
			receiver_graph_line.graphics.moveTo(0,630).setStrokeStyle(1).beginStroke("green");
			if ( hit_flag == 1 ){ /** If the detector hit any of the the circle */
				detected_points[detected_x] = detected_y; 
				temp_y = detected_y; /** Assigning the current y position to a variable */
			} else { /** If the detector is away from the circles */
				detected_points[detected_x] = temp_y; /** Drawing a straight line when the detector value is 0 */
			}	  
			detected_x += 1; /** Incrementing the x position for getting the x values of sine wave */
			detected_y = detectorYValue(detected_degree); /** Function call to get the Y value of the detected sine wave */
			for ( var i = 360; i < 700; i++ ) {
				receiver_graph_line.graphics.lineTo(i, detected_points[i + det_counter - listener_graph_final]);
			}  
			break;
	}
	det_counter++; /** Increment the value of detected counter */
}

/** Function to get the Y value of detected sine wave  */
function detectorYValue(detected_x) {
	if ( detected_frequency <= 0 ) {
		return 630;  /** Setting the graph as a straight line while detected frequency reaches zero */
	}
	else {
		/** Amplitude = 5*SIN(RADIANS(2*180*detected frequency*time)) */
		return 50 * Math.sin((3/Math.abs(radius))* detected_x)+630 ;
	} 
}

/** Function to draw the source sine wave */
function sourceSineWave(scope) {
	var source_degree = (2*180*scope.source_frequency_value*source_x/1000) / (180 / Math.PI);
	/** To draw the sign wave in the beginning */
	switch ( source_counter > -1 ){
		case ( source_counter < source_graph_final ) : /** Drawing the line from  starting point to end point */
			source_graph_line.graphics.setStrokeStyle(1).beginStroke("red");
			source_graph_line.graphics.lineTo(source_x,source_y); 
			source_x += 1; /** Incrementing the x position for getting the x values of sine wave */
			source_y = sourceYValue(source_degree); /** Function call to get the Y value of the source sine wave */
			source_points[source_x] = source_y; /** Setting the Y value of the source sine wave */
			source_graph_line.graphics.lineTo(source_x,source_y).setStrokeStyle(1).beginStroke("red");
			break;
		case ( source_counter >= source_graph_final ) :
			source_graph_line.graphics.clear(); /** Clearing the line and start from the beginning  */
			source_graph_line.graphics.moveTo(0,630).setStrokeStyle(1).beginStroke("red");	
			source_points[source_x] = source_y; /** Setting the Y value of the source sine wave */
			source_x += 1; /** Incrementing the x position for getting the x values of sine wave */
			source_y = sourceYValue(source_degree); /** Function call to get the Y value of the source sine wave */
			for ( var i = -40; i < source_graph_final; i++ ) { /** redrawing sine wave from the beginning */
				source_graph_line.graphics.lineTo(i, source_points[i + source_counter - source_graph_final]);
			} break; 
	} 
    source_counter++; /** Increment the value of source counter */
}

/** Function to get the Y value of source sine wave  */
function sourceYValue(source_x)  {
	/**Amplitude = 5*SIN(RADIANS(2*180*source frequency*time)) */
	return 50 * Math.sin((3/Math.abs(radius))* source_x)+630 ; 
}

/** Reset the experiment in the reset button event */
function resetExperiment(scope) {
	initialisationOfVariables(scope); /** Resetting all variable values */
	initialisationOfImages(scope); /** Function call to reset the image positions */
	setMediumFn(scope); /** Resetting drop down menu to initial value */
	source_graph_line.graphics.clear();/** Removing the source wave from the stage */
	receiver_graph_line.graphics.clear(); /** Removing the detected wave from the stage */
	doppler_effect_stage.update(); /** Updating the stage */	
}

/** Function to return child element of stage */
function getChild(child_name) {
    return doppler_effect_stage.getChildByName(child_name);
}

/** Createjs stage updation happens in every interval */
function updateStage(scope) {
	sourceSineWave(scope); /** Function call to draw the source sine wave graph */
	detectedSineWave(scope);  /** Function call to draw the detector sine wave graph */
	doppler_effect_stage.update(); /** Updating the stage */
}


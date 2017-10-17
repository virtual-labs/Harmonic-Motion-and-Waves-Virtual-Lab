(function(){
  angular
       .module('users')
	   .directive("experiment",directiveFunction)
})();

var stage, exp_canvas, stage_width, stage_height;

var buttonContainer;

var harmonics_graph_x_0,sum_graph_x_0;

var harmonics=[],harmonicsBar=[],barColor=["#ffff00"],curves=[],sumCurve,sum,sumXY=[];

var harmonicsYaxix,sumYaxis,harmonicsLabelBG=[];

var button_border,button_harmonic_pluse,button_harmonic_minus;

var YAXISINTERVAL;

function directiveFunction(){
	return {
		restrict: "A",
		link: function(scope, element,attrs){
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
			 /** Array to store all file name of images used in experiment and it used to create each image objects */
            images_array = ["BG",];
            barColor = ["#ff0000","#ff8000","#ffff00","#00ff00","#00c957","#6495ed","#0000ff","#000080","#91219e","#ba55d3","#ff69b4"];
            sum=[[],[],[],[],[],[],[],[],[],[],[]];
            exp_canvas=document.getElementById("demoCanvas");
			exp_canvas.width=element[0].width;
			exp_canvas.height=element[0].height;            
    		stage = new createjs.Stage("demoCanvas");
			queue = new createjs.LoadQueue(true);
			loadingProgress(queue, stage, exp_canvas.width);
			queue.on("complete", handleComplete, this);
			var queue_obj = [];/** Array to store object of each images */
            for ( i = 0; i < images_array.length; i++ ) {/** Creating object of each element */
                queue_obj[i] = {id: images_array[i],src: "././images/"+images_array[i]+".svg",type: createjs.LoadQueue.IMAGE};
            }
			queue.loadManifest(queue_obj);			
			stage.enableDOMEvents(true);
            stage.enableMouseOver();
            createjs.Touch.enable(stage);
        //    tick = setInterval(updateTimer, 100); /** Stage update function in a timer */
            
            container = new createjs.Container(); /** Creating gerneral  container */
            container.name = "container";
            stage.addChild(container); /** Append it in the stage */
            
            
            
            bg_amplitude = new createjs.Shape();
            bg_amplitude.graphics.setStrokeStyle(1).beginStroke('#000').beginFill('#c3c3c3').drawRect(1,1,698,229);
            stage.addChild(bg_amplitude);
            bg_harmonics = new createjs.Shape();
            bg_harmonics.graphics.setStrokeStyle(1).beginStroke('#000').beginFill('#cdcccc').drawRect(1,237,698,228);
            stage.addChild(bg_harmonics);
            bg_sum = new createjs.Shape();
            bg_sum.graphics.setStrokeStyle(1).beginStroke('#000').beginFill('#cdcccc').drawRect(1,470,698,228);
            stage.addChild(bg_sum);
            
            buttonContainer = new createjs.Container(); /** Container for buttons */
            container.name = "buttonContainer";
            stage.addChild(buttonContainer); /** Append it in the stage */
            
            amplitude_container = new createjs.Container(); /** Creating container for amplitude graph*/
            amplitude_container.name = "amplitude_container";
            stage.addChild(amplitude_container); /** Append it in the stage */
            
            amplitude_graph = new createjs.Shape();
            amplitude_graph.graphics.setStrokeStyle(0.5).beginStroke('#000').beginFill('#fff').drawRect(70,50,600,160);
            amplitude_container.addChild(amplitude_graph);
            
            amplitude_graph_x_0 = new createjs.Shape();
            drawAxis(amplitude_graph_x_0,70,130,670,130,amplitude_container);
            
            amplitude_graph_x_5 = new createjs.Shape();
            drawAxis(amplitude_graph_x_5,70,95,670,95,amplitude_container);
            
            amplitude_graph_x_1 = new createjs.Shape();
            drawAxis(amplitude_graph_x_1,70,60,670,60,amplitude_container);
            
            amplitude_graph_x5 = new createjs.Shape();
            drawAxis(amplitude_graph_x_5,70,165,670,165,amplitude_container);
            
            amplitude_graph_x1 = new createjs.Shape();
            drawAxis(amplitude_graph_x_1,70,200,670,200,amplitude_container);
            
            harmonics_container = new createjs.Container(); /** Creating container for harmonics graph*/
            harmonics_container.name = "harmonics_container";
            stage.addChild(harmonics_container); /** Append it in the stage */
            
            harmonicsYaxix = new createjs.Shape();
            stage.addChild(harmonicsYaxix); /** Append it in the stage */
            sumYaxis = new createjs.Shape();
            stage.addChild(sumYaxis); /** Append it in the stage */
            
            harmonics_graph = new createjs.Shape();
            harmonics_graph.graphics.setStrokeStyle(0.5).beginStroke('#000').beginFill('#fff').drawRect(70,287,520,160);
            harmonics_container.addChild(harmonics_graph);
            
            harmonics_graph_x_0 = new createjs.Shape();
            drawAxis(harmonics_graph_x_0,70,367,590,367,harmonics_container);
            drawAxis(harmonics_graph_x_0,330,287,330,447,harmonics_container);
            
            harmonics_graph_x_5 = new createjs.Shape();
            drawAxis(harmonics_graph_x_5,70,332,590,332,harmonics_container);
            
            harmonics_graph_x_1 = new createjs.Shape();
            drawAxis(harmonics_graph_x_1,70,297,590,297,harmonics_container);
            
            harmonics_graph_x5 = new createjs.Shape();
            drawAxis(harmonics_graph_x5,70,402,590,402,harmonics_container);
            
            harmonics_graph_x1 = new createjs.Shape();
            drawAxis(harmonics_graph_x1,70,437,590,437,harmonics_container);
            
            sum_container = new createjs.Container(); /** Creating container for sum graph*/
            sum_container.name = "sum_container";
            stage.addChild(sum_container); /** Append it in the stage */
            
            sum_graph = new createjs.Shape();
            sum_graph.graphics.setStrokeStyle(0.5).beginStroke('#000').beginFill('#fff').drawRect(70,520,520,160);
            amplitude_container.addChild(sum_graph);
            
            sum_graph_x_0 = new createjs.Shape();
            drawAxis(sum_graph_x_0,70,600,590,600,sum_container);
            drawAxis(sum_graph_x_0,330,520,330,680,harmonics_container);
            
            sum_graph_x_5 = new createjs.Shape();
            drawAxis(sum_graph_x_5,70,565,590,565,sum_container);
            
            sum_graph_x_1 = new createjs.Shape();
            drawAxis(sum_graph_x_1,70,530,590,530,sum_container);
            
            sum_graph_x5 = new createjs.Shape();
            drawAxis(sum_graph_x5,70,635,590,635,sum_container);
            
            sum_graph_x1 = new createjs.Shape();
            drawAxis(sum_graph_x1,70,670,590,670,sum_container);
            
            SAPCE = 8.75;
            INIX = 78.75;
           
			function handleComplete(){
                initialisationOfVariables(); /** Initializing the variables */			
               // loadImages(queue.getResult("bg_side_view_bottom"),"background",0,0,"",0,container,1); 
                for(i = 0; i < 11; i++){ /** To create eleven sign waves */
                    curves[i] = new createjs.Shape();
                    // set line width to 2px
                    curves[i].graphics.setStrokeStyle(2);
                    // select a random color for the line
                    curves[i].graphics.beginStroke(barColor[i]);
                    // start first line segment at position (0, f(0))
                    curves[i].graphics.moveTo(70, f(0,70,1+i));
                    // keep on drawing line segments to (i, f(i)) as i moves across the width of the canvas
                    stage.addChild(curves[i]);
                }
                sumCurve = new createjs.Shape();
                sumCurve.graphics.setStrokeStyle(2);
                sumCurve.graphics.beginStroke("#029E9F");
                sumCurve.graphics.moveTo(70, 600);
                sumCurve.mask = sum_graph;
                stage.addChild(sumCurve);
                for(i = 0; i < 11; i++){
                    harmonicsBar[i] = new createjs.Shape();
                    harmonicsBar[i].graphics.setStrokeStyle(0.5).beginStroke('#000').beginFill(barColor[i]).drawRect(INIX,130,45,i == 0 ? -34: 0);
                    harmonicsBar[i].cursor = 'pointer';
                    amplitude_container.addChild(harmonicsBar[i]);
                    harmonicsLabelBG[i] = new createjs.Shape();                
                    harmonicsLabelBG[i].graphics.setStrokeStyle(0.5).beginFill('#ffffff').drawRect(INIX+5,22,35,20);
                    amplitude_container.addChild(harmonicsLabelBG[i]);

                    harmonics[i] = new createjs.Shape();                
                    harmonics[i].graphics.setStrokeStyle(0.5).beginStroke('#000').beginFill('#000000').drawRect(INIX,128,45,4);
                    harmonics[i].cursor = 'pointer';
                    amplitude_container.addChild(harmonics[i]);

                    setText("amplitude_lbl"+(i+1),INIX+11, 17,"A"+(i+1),"black",1,amplitude_container);
                    setText("A"+(i+1),INIX+9, 37,i == 0 ? "0.5" : "0.00","black",0.9,amplitude_container);

                    addDragEvent(harmonics[i],harmonicsBar[i],INIX,barColor[i],"A"+(i+1),(1+i),curves[i]);
                    addClickEventOnBar(harmonics[i],harmonicsBar[i],INIX,barColor[i],"A"+(i+1),(1+i),curves[i]);
                    INIX += 45 + SAPCE;

                }
                drawYaxis(YAXISINTERVAL);
                
                harmonics[0].y = -34;
                button_border = new createjs.Shape();
                buttonContainer.addChild(button_border);
                button_harmonic_pluse = new createjs.Shape();
                button_harmonic_minus = new createjs.Shape();
                button_sumX_minus = new createjs.Shape();
                button_sumX_pluse = new createjs.Shape();
                button_sumY_minus = new createjs.Shape();
                button_sumY_pluse = new createjs.Shape();
                
				
                /** Text box loading */
                setText("amplitude_graph_x_0_lbl",58, 134,"0","black",1,amplitude_container);
                setText("amplitude_graph_x_5_lbl",45, 99,"0.5","black",1,amplitude_container);
                setText("amplitude_graph_x_1_lbl",58, 64,"1","black",1,amplitude_container);
                setText("amplitude_graph_x5_lbl",39, 169,"-0.5","black",1,amplitude_container);
                setText("amplitude_graph_x1_lbl",53, 204,"-1","black",1,amplitude_container);
                setText("amplitude_graph_lbl",32, 180,_("Amplitude"),"#0399D7",1.3,amplitude_container);
                amplitude_container.getChildByName("amplitude_graph_lbl").rotation = -90;
                setText("harmonics_graph_x_0_lbl",58, 371,"0","black",1,harmonics_container);
                setText("harmonics_graph_x_5_lbl",45, 336,"0.5","black",1,harmonics_container);
                setText("harmonics_graph_x_1_lbl",58, 301,"1","black",1,harmonics_container);
                setText("harmonics_graph_x5_lbl",39, 406,"-0.5","black",1,harmonics_container);
                setText("harmonics_graph_x1_lbl",53, 441,"-1","black",1,harmonics_container);
                setText("harmonics_x_pluse",52, 461,"-0.39","black",1,harmonics_container);
                setText("harmonics_x_centre",326, 461,"0","black",1,harmonics_container);
                setText("harmonics_x_centre",570, 461,"-0.39","black",1,harmonics_container);
                setText("amplitude_graph_lbl",32, 420,_("Harmonics"),"#0399D7",1.3,harmonics_container);
                harmonics_container.getChildByName("amplitude_graph_lbl").rotation = -90;
                setText("sum_graph_x_0_lbl",58, 604,"0","black",1,sum_container);
                setText("sum_graph_x_5_lbl",45, 569,"0.5","black",1,sum_container);
                setText("sum_graph_x_1_lbl",58, 534,"1","black",1,sum_container);
                setText("sum_graph_x5_lbl",39, 639,"-0.5","black",1,sum_container);
                setText("sum_graph_x1_lbl",53, 674,"-1","black",1,sum_container);
                setText("sum_graph_x_pluse",52, 694,"-0.39","black",1,sum_container);
                setText("sum_graph_x_centre",326, 694,"0","black",1,sum_container);
                setText("sum_graph_x_centre",570, 694,"-0.39","black",1,sum_container);
                setText("amplitude_graph_lbl",32, 620,_("Sum"),"#0399D7",1.3,sum_container);
                sum_container.getChildByName("amplitude_graph_lbl").rotation = -90;
                
                
			    
				initialisationOfControls(scope); /** Function call for initialisation of control side variables */
				initialisationOfImages(); /** Function call for images used in the apparatus visibility */
                translationLabels(); /** Translation of strings using gettext */
                
                for(var i=0; i<= 520; i++) {
                    curves[0].graphics.lineTo(70+i, f(i,35,1));
                    sum[0][i] = 367 - f(i,-35,1);
                    sumCurve.graphics.lineTo(70+i, (233+f(i,35,1)));
                    sumXY[i] = sum[0][i];
                }
                for(var j = 1; j< 11; j++) {
                    for(i = 0;i <= 520; i++){
                        sum[j][i] = 0;
                    }
                }
                
				
                stage.update();
			}
            
			/** Add all the strings used for the language translation here. '_' is the short cut for calling the gettext function defined in the gettext-definition.js */	
			function translationLabels(){
                /** This help array shows the hints for this experiment */
				helpArray=[_("help1"),_("help2"),_("help3"),_("Next"),_("Close")];
                scope.heading=_("Fourier: Making Waves");
				scope.variables=_("Variables"); 
                scope.harmonics_txt = _("Harmonics");
				scope.result=_("Result");  
				scope.copyright=_("copyright");
				scope.reset_txt = _("Reset");
                scope.$apply();				
			}
		}
	}
}

/** All the texts loading and added to the stage */
function setText(name, textX, textY, value, color, fontSize, container){
    var text = new createjs.Text(value, "bold " + fontSize + "em Tahoma, Geneva, sans-serif", color);
    text.x = textX;
    text.y = textY;
    text.textBaseline = "alphabetic";
    text.name = name;
    text.text = value;
    text.color = color;
    container.addChild(text); /** Adding text to the container */
    stage.update();
}

/** function to return chiled element of container */
function getChild(chldName){
    return container.getChildByName(chldName);
}

/** function to return chiled element of containerm, 'container_final' */
function getChildFinal(chldName){
    return container_final.getChildByName(chldName);
}

function initialisationOfControls(scope){
    document.getElementById("site-sidenav").style.display = "block";
    scope.harmonicsNum = 11;
    

}
/** All variables initialising in this function */
function initialisationOfVariables() {
   YAXISINTERVAL = 4;
    
}
/** Set the initial status of the bitmap and text depends on its visibility and initial values */
function initialisationOfImages() {
   
}

function f(x,amplitude,mode) {
    return amplitude*Math.sin((.69*x*mode)*3.14/180)+367;//amplitude*Math.sin((.69*x*mode)*3.14/180)+367;
    
}



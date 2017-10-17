/** Controls and all functionalities of experiments defined here*/

function addDragEvent(barHead,harmonicBar,barX,barColor,amplitude_txt,mode,waveShapes){    
    barHead.on("pressmove", function(evt) {
        
        var _boundary = evt.stageY - 130 < 0 ? -1 * (evt.stageY - 130) : (evt.stageY - 130);
        if(_boundary < 40){
            barHead.y = evt.stageY - 130;
            reDrawHarmonicBar(harmonicBar,barHead.y,barX,barColor);
            amplitude_container.getChildByName(amplitude_txt).text = (parseInt(barHead.y < 0 ? -1 * barHead.y : barHead.y) * 0.0143).toFixed(2); 
            waveShapes.graphics.clear();
            waveShapes.graphics.setStrokeStyle(2);
            waveShapes.graphics.beginStroke(barColor);
            waveShapes.graphics.moveTo(70, f(0,70,mode));
            for(var i=0; i<= 520; i++) {
                waveShapes.graphics.lineTo(70+i, f(i,parseInt(barHead.y) * ((mode%2) == 0 ? 1 :-1),mode));
                sum[mode-1][i] = 367 - f(i,parseInt(barHead.y) * ((mode%2) == 0 ? -1 : 1),mode);
            }
            sumCurve.graphics.clear();
            sumCurve.graphics.setStrokeStyle(2);
            sumCurve.graphics.beginStroke("#029E9F");
            sumCurve.graphics.moveTo(70, 600);  
            for(var i=0; i<= 520; i++) {
                var _sum = 0
                for(j = 0;j < 11; j++){
                    _sum += sum[j][i];
                }
                sumXY[i] = _sum;
                sumCurve.graphics.lineTo(70+i, (600+_sum));
            }
        
        }
        
        stage.update();
    });

}

function addClickEventOnBar(barHead,harmonicBar,barX,barColor,amplitude_txt,mode,waveShapes){
    harmonicBar.on("mousedown", function (evt) {
        barHead.y = evt.stageY - 130;
        reDrawHarmonicBar(harmonicBar,barHead.y,barX,barColor);
        amplitude_container.getChildByName(amplitude_txt).text = (parseInt(barHead.y < 0 ? -1 * barHead.y : barHead.y) * 0.0143).toFixed(2);
        stage.update();
    });
    harmonicBar.on("pressmove", function(evt) {
        var _boundary = evt.stageY - 130 < 0 ? -1 * (evt.stageY - 130) : (evt.stageY - 130);
        if(_boundary < 40){
            barHead.y = evt.stageY - 130;
            reDrawHarmonicBar(harmonicBar,barHead.y,barX,barColor);
            amplitude_container.getChildByName(amplitude_txt).text = (parseInt(barHead.y < 0 ? -1 * barHead.y : barHead.y) * 0.0143).toFixed(2);
            waveShapes.graphics.clear();
            waveShapes.graphics.setStrokeStyle(2);
            waveShapes.graphics.beginStroke(barColor);
            waveShapes.graphics.moveTo(70, f(0,70,mode));
            for(var i=0; i<= 520; i++) {
                waveShapes.graphics.lineTo(70+i, f(i,parseInt(barHead.y) * -1,mode));
                sum[mode-1][i] = 367 - f(i,parseInt(barHead.y) * ((mode%2) == 0 ? -1 : 1),mode);
            }
            sumCurve.graphics.clear();
            sumCurve.graphics.setStrokeStyle(2);
            sumCurve.graphics.beginStroke("#029E9F");
            sumCurve.graphics.moveTo(70, 600);  
            for(var i=0; i<= 520; i++) {
                var _sum = 0
                for(j = 0;j < 11; j++){
                    _sum += sum[j][i];
                }
                sumXY[i] = _sum;
                sumCurve.graphics.lineTo(70+i, (600+_sum));
            }
        }
        stage.update();
    });

}

function drawAxis(obj,x1,y1,x2,y2,container){
    var _strokeSize = 1;
    if(obj == harmonics_graph_x_0 || obj == sum_graph_x_0){
        _strokeSize = 2;
    }else{
        _strokeSize = 1;
    }
    obj.graphics.setStrokeStyle(_strokeSize).beginStroke('#000').moveTo(x1,y1).lineTo(x2,y2);
    container.addChild(obj);
}

function reDrawHarmonicBar(harmonicBar,height,barX,barColor){
    harmonicBar.graphics.clear();
    harmonicBar.graphics.setStrokeStyle(0.5).beginStroke('#000').beginFill(barColor).drawRect(barX,130,45,height);
}

function drawYaxis(interval){
    var _unitDistance = 260 / interval;
    harmonicsYaxix.graphics.clear();
    sumYaxis.graphics.clear();
    for(i = (330-_unitDistance); i >= 70; i = i - _unitDistance){
        harmonicsYaxix.graphics.setStrokeStyle(1).beginStroke('#000').moveTo(i,287).lineTo(i,447);
        sumYaxis.graphics.setStrokeStyle(1).beginStroke('#000').moveTo(i,520).lineTo(i,680);
    }
    for(i = (330+_unitDistance); i <= 590; i = i + _unitDistance){
        harmonicsYaxix.graphics.setStrokeStyle(1).beginStroke('#000').moveTo(i,287).lineTo(i,447);
        sumYaxis.graphics.setStrokeStyle(1).beginStroke('#000').moveTo(i,520).lineTo(i,680);
    }
    stage.update();
}


function harmonicsDisplay(scope){
    for(i = 10; i >= scope.harmonicsNum; i--){
        harmonics[i].alpha = 0;
        curves[i].graphics.clear();
        amplitude_container.getChildByName("A"+(i+1)).alpha = 0;
        amplitude_container.getChildByName("A"+(i+1)).text = "0.00";
        amplitude_container.getChildByName("amplitude_lbl"+(i+1)).alpha = 0;
        harmonicsLabelBG[i].alpha = 0;
        harmonics[i].y = 0;
        harmonicsBar[i].graphics.clear().setStrokeStyle(0.5).beginStroke('#000').beginFill(barColor[i]);
        sumCurve.graphics.clear();
        sumCurve.graphics.setStrokeStyle(2);
        sumCurve.graphics.beginStroke("#029E9F");
        sumCurve.graphics.moveTo(70, 600); 
        for(var k=0; k<= 520; k++) {
            var _sum = 0
            for(j = 10;j >= scope.harmonicsNum; j--){
                _sum += sum[j][k];
                sum[j][k] = 0;
            }
            var _remainingXY = sumXY[k] - _sum;
            sumXY[k] = _remainingXY;
            sumCurve.graphics.lineTo(70+k, (600+_remainingXY));
        }
    }
    for(i = 0; i < scope.harmonicsNum; i++){
        harmonics[i].alpha = 1;
        curves[i].alpha = 1;
        amplitude_container.getChildByName("A"+(i+1)).alpha = 1;
        amplitude_container.getChildByName("amplitude_lbl"+(i+1)).alpha = 1;
        harmonicsLabelBG[i].alpha = 1;
    }
    stage.update();
}
/** Resetting the experiment */
function resetExperiment(scope){
    scope.harmonicsNum = 11;
    for(i = 0; i < 11; i++){
        harmonics[i].alpha = 1;
        amplitude_container.getChildByName("A"+(i+1)).alpha = 1;
        amplitude_container.getChildByName("amplitude_lbl"+(i+1)).alpha = 1;
        harmonicsLabelBG[i].alpha = 1;
        harmonics[i].y = i == 0 ? -34 : 0;
        amplitude_container.getChildByName("A"+(i+1)).text = "0.00";
        amplitude_container.getChildByName("A1").text = "0.5";        
        if(i != 0){
            harmonicsBar[i].graphics.clear().setStrokeStyle(0.5).beginStroke('#000').beginFill(barColor[i]); 
            curves[i].graphics.clear();
            for(k = 0;k <= 520; k++){
                sum[i][k] = 0;
            }
        }else{
            harmonicsBar[i].graphics.clear().setStrokeStyle(0.5).beginStroke('#000').beginFill(barColor[i]).drawRect(78.75,130,45,-34);
            curves[0].graphics.clear();
            curves[0].graphics.setStrokeStyle(2);
            curves[0].graphics.beginStroke(barColor[0]);
            curves[0].graphics.moveTo(70, f(0,70,1));
            sumCurve.graphics.clear().setStrokeStyle(2).beginStroke("#029E9F").moveTo(70, 600);
            for(var j=0; j<= 520; j++) {
                curves[0].graphics.lineTo(70+j, f(j,35,1));
                sum[0][j] = 367 - f(j,-70,1);
                sumCurve.graphics.lineTo(70+j, (233+f(j,35,1)));
                sumXY[j] = sum[0][j];
            }
        }
        
    }
    stage.update();
}
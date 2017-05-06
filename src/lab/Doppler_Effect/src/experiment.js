
/** Function to calculate and assign the detected frequency */
function setDetectorFrequency(scope) {
	/** Check whether the detector hit the sound wave */
	if ( circle_name.hitTest(detector_container.x + detector_x, detector_container.y + detector_y)) {  //if the sound wave hit the detector
		hit_flag = 1; /** Setting the hit flag value as 1 if hit   */
		if ( selected_source_index == selected_destination_index ) { /** If the source and detector moves in the same direction */
			reverse_flag = false; /** Setting reverse flag as false in forward movement*/
			changeOperatorFn(scope);
		}
		else { /** If the source and detector moves in opposite direction */
			changeOperatorFn(scope);
			reverse_flag = true; /** Setting reverse flag as true in reverse movement */
		}		
		if ( detected_frequency < 0 ) { /** Setting the negative frequency as zero */
			setResultValue(scope,0,false,true) /** Setting the detector frequency as zero for negative values */
		} else {
			setResultValue(scope,detected_frequency.toFixed(2),true,false) /** Function call to set the detector frequency in result */
		}
	} else { // If the sound wave not hit the detector
		hit_flag = 0; /** Setting the hit flag value as 0 if the detector not hit the circle  */
		setResultValue(scope,0,false,true) /** Setting the detector frequency as zero*/
	}  
	scope.$apply();	
}

/** Function to set the result */
function setResultValue(scope,detected_frequency,light_on_flag,light_off_flag) {
	detector_container.getChildByName("detector_txt").text = detected_frequency; /** Setting the detected frequency in the detector */
	scope.detected_frequency_value = detected_frequency; /** Setting the detected frequency in the result */	
	detector_container.getChildByName("light_on").visible = light_on_flag; /** Turn off/Turn on yellow light */	
	detector_container.getChildByName("light_off").visible = light_off_flag; /** Turn on/Turn off red light */
}

/** Function to change the operator value based on the selected source direction */
function changeOperatorFn(scope) {
	if ( selected_source_index == 1 ) { // if the source direction is left 
		if ( reverse_flag == true) { // if the source moving left and detector moving in right direction.
			_op1 = 1;
			backwardMovementFn(_op1,scope); /** Function call to set the operator and calculate frequency while backward movement */
		} else { // if the source and detector moving in left direction.
			_op1 = -1;_op2 = 1;_op3 = -1;
			forwardMovementFn(_op1,_op2,_op3,scope); /** Function call to set the operator while forward movement */
		}
	} else { // if the source direction is right 
		if ( reverse_flag == true ) { // if the source moving right and detector moving in left direction.
			_op1 = -1;
			backwardMovementFn(_op1,scope); /** Function call to set the operator and calculate frequency while backward movement */
		} else { // if the source and detector moving in right direction.
			_op1 = 1;_op2 = -1;_op3 = 1;
			forwardMovementFn(_op1,_op2,_op3,scope);/** Function call to set the operator while forward movement */
		}
	}
}
function backwardMovementFn(op1,scope) {
	switch ( circle_centre > 0 ) { 
		/** Finding the detected frequency if the source and detector moving towards  */
		case ( circle_centre > detector_container.x+45 ) : detected_frequency = source_frequency *(medium_velocity +op1* detector_velocity)/ (medium_velocity -op1* source_velocity);break;
		/** Finding the detected frequency if the source and detector moves away from each other */
		case ( circle_centre <= detector_container.x+45 ) : detected_frequency = source_frequency *(medium_velocity -op1* detector_velocity)/ (medium_velocity +op1* source_velocity);break;	
	}
}

/** Function to change the direction value based on the selected source direction */
function forwardMovementFn(op1,op2,op3,scope) {
	if ( medium_velocity == air_velocity ) { /** If the selected medium is air */
		if ( detector_velocity <= source_velocity){ /** Calculating the detected frequency when source velocity greater than the detector frequency */
			calculateDetectorFrequency(scope,op1); /** Function call to set the detected frequency */
		} else{ 
			calculateDetectorFrequency(scope,op2); /** Function call to set the detected frequency when source velocity less than the detector frequency */
		}
	} else { /** If the selected medium is water,glass or steel */
		calculateDetectorFrequency(scope,op3); /** Function call to set the detected frequency when the medium is water,glass or steel*/
	}
}

/** Function to calculate the detected frequency */
function calculateDetectorFrequency(scope,operator) {
	var _distance = circle_centre - detector_container.x - 50; /** Calculating the distance between source and detector */
	var _distance_temp;	
	if ( operator*_distance < 0 ) { /** When both source and detector moving towards */
		/** Calculating the detected frequency and interchanging the frequency if getting high value while source and detector moving away */
		detected_frequency = source_frequency *(medium_velocity - detector_velocity)/ (medium_velocity - source_velocity)	
		_distance_temp = source_frequency *(medium_velocity + detector_velocity)/ (medium_velocity + source_velocity)	
		if ( _distance_temp > detected_frequency  && detector_velocity > 0 && medium_velocity == air_velocity) { /** Interchanging the frequency if getting high value while source and detector moving away */
			detected_frequency = _distance_temp;
		}
	} else {
		/** Calculating the detected frequency if both source and detector moves away from each other */
		detected_frequency = source_frequency *( medium_velocity + detector_velocity )/ ( medium_velocity + source_velocity )
		_distance_temp = source_frequency *( medium_velocity - detector_velocity )/ ( medium_velocity - source_velocity )						
		if ( detected_frequency > _distance_temp && detector_velocity > 0 && medium_velocity == air_velocity  ) { /** Interchanging the frequency if getting high value while source and detector moving away */
			detected_frequency = _distance_temp;	
		}  	
	}
}





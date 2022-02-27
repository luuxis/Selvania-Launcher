function FixOverlay(context) {
	FixHead2(context);
	FixBody2(context);
	FixRightArm2(context);
	FixLeftArm2(context);
	FixRightLeg2(context);
	FixLeftLeg2(context);
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the head overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixHead2(context) {
	// Front
	if(HasTransparency(context, 40, 8, 8, 8)) return;
	
	// Top, Bottom, Right, Left, Back
	if(HasTransparency(context, 40, 0, 8, 8)) return;
	if(HasTransparency(context, 48, 0, 8, 8)) return;
	if(HasTransparency(context, 32, 8, 8, 8)) return;
	if(HasTransparency(context, 48, 8, 8, 8)) return;
	if(HasTransparency(context, 56, 8, 8, 8)) return;
	
	// Didn't have transparency, clearing the head overlay area.
	context.clearRect(40, 0, 8, 8);
	context.clearRect(48, 0, 8, 8);
	context.clearRect(32, 8, 8, 8);
	context.clearRect(40, 8, 8, 8);
	context.clearRect(48, 8, 8, 8);
	context.clearRect(56, 8, 8, 8);
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the body overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixBody2(context) {
	// Front
	if(HasTransparency(context, 20, 36, 8, 12)) return;
	
	// Top, Bottom, Right, Left, Back
	if(HasTransparency(context, 20, 32, 8, 4)) return;
	if(HasTransparency(context, 28, 32, 8, 4)) return;
	if(HasTransparency(context, 16, 36, 4, 12)) return;
	if(HasTransparency(context, 28, 36, 4, 12)) return;
	if(HasTransparency(context, 32, 36, 8, 12)) return;
	
	// Didn't have transparency, clearing the body overlay area.
	context.clearRect(20, 32, 8, 4);
	context.clearRect(28, 32, 8, 4);
	context.clearRect(16, 36, 4, 12);
	context.clearRect(20, 36, 8, 12);
	context.clearRect(28, 36, 4, 12);
	context.clearRect(32, 36, 8, 12);
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the right arm overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixRightArm2(context) {
	// Front
	if(HasTransparency(context, 44, 36, 4, 12)) return;
	
	// Top, Bottom, Right, Left, Back
	if(HasTransparency(context, 44, 32, 4, 4)) return;
	if(HasTransparency(context, 48, 32, 4, 4)) return;
	if(HasTransparency(context, 40, 36, 4, 12)) return;
	if(HasTransparency(context, 48, 36, 4, 12)) return;
	if(HasTransparency(context, 52, 36, 4, 12)) return;
	
	// Didn't have transparency, clearing the right arm overlay area.
	context.clearRect(44, 32, 4, 4);
	context.clearRect(48, 32, 4, 4);
	context.clearRect(40, 36, 4, 12);
	context.clearRect(44, 36, 4, 12);
	context.clearRect(48, 36, 4, 12);
	context.clearRect(52, 36, 4, 12);
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the left arm overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixLeftArm2(context) {
	// Front
	if(HasTransparency(context, 52, 52, 4, 12)) return;
	
	// Top, Bottom, Right, Left, Back
	if(HasTransparency(context, 52, 48, 4, 4)) return;
	if(HasTransparency(context, 56, 48, 4, 4)) return;
	if(HasTransparency(context, 48, 52, 4, 12)) return;
	if(HasTransparency(context, 56, 52, 4, 12)) return;
	if(HasTransparency(context, 60, 52, 4, 12)) return;
	
	// Didn't have transparency, clearing the left arm overlay area.
	context.clearRect(52, 48, 4, 4);
	context.clearRect(56, 48, 4, 4);
	context.clearRect(48, 52, 4, 12);
	context.clearRect(52, 52, 4, 12);
	context.clearRect(56, 52, 4, 12);
	context.clearRect(60, 52, 4, 12);
}
// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the right overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixRightLeg2(context) {
	// Front
	if(HasTransparency(context, 4, 36, 4, 12)) return;
	
	// Top, Bottom, Right, Left, Back
	if(HasTransparency(context, 4, 32, 4, 4)) return;
	if(HasTransparency(context, 8, 32, 4, 4)) return;
	if(HasTransparency(context, 0, 36, 4, 12)) return;
	if(HasTransparency(context, 8, 36, 4, 12)) return;
	if(HasTransparency(context, 12, 36, 4, 12)) return;
	
	// Didn't have transparency, clearing the right leg overlay area.
	context.clearRect(4, 32, 4, 4);
	context.clearRect(8, 32, 4, 4);
	context.clearRect(0, 36, 4, 12);
	context.clearRect(4, 36, 4, 12);
	context.clearRect(8, 36, 4, 12);
	context.clearRect(12, 36, 4, 12);
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the left overlay transparent if it is has no transparent pixels (how Minecraft does it)
function FixLeftLeg2(context) {
	// Front
	if(HasTransparency(context, 4, 52, 4, 12)) return;
	
	// Top, Bottom, Right, Left, Back
	if(HasTransparency(context, 4, 48, 4, 4)) return;
	if(HasTransparency(context, 8, 48, 4, 4)) return;
	if(HasTransparency(context, 0, 52, 4, 12)) return;
	if(HasTransparency(context, 8, 52, 4, 12)) return;
	if(HasTransparency(context, 12, 52, 4, 12)) return;
	
	// Didn't have transparency, clearing the left leg overlay area.
	context.clearRect(4, 48, 4, 4);
	context.clearRect(8, 48, 4, 4);
	context.clearRect(0, 52, 4, 12);
	context.clearRect(4, 52, 4, 12);
	context.clearRect(8, 52, 4, 12);
	context.clearRect(12, 52, 4, 12);
}

// Expects a canvas with a 64x32 Minecraft skin drawn in the very top left corner (0,0)
// Your canvas should be 64x64 in size to show the skin parts that were converted
function Convert6432To6464(context) {
	// Convert old format to new format
	Copy(context, 4, 16, 4, 4, 20, 48, true);	// Top Leg
	Copy(context, 8, 16, 4, 4, 24, 48, true);	// Bottom Leg
	Copy(context, 0, 20, 4, 12, 24, 52, true);	// Outer Leg
	Copy(context, 4, 20, 4, 12, 20, 52, true);	// Front Leg
	Copy(context, 8, 20, 4, 12, 16, 52, true);	// Inner Leg
	Copy(context, 12, 20, 4, 12, 28, 52, true);	// Back Leg
	
	Copy(context, 44, 16, 4, 4, 36, 48, true);	// Top Arm
	Copy(context, 48, 16, 4, 4, 40, 48, true);	// Bottom Arm
	Copy(context, 40, 20, 4, 12, 40, 52, true);	// Outer Arm
	Copy(context, 44, 20, 4, 12, 36, 52, true);	// Front Arm
	Copy(context, 48, 20, 4, 12, 32, 52, true);	// Inner Arm
	Copy(context, 52, 20, 4, 12, 44, 52, true);	// Back Arm
}

// Expects a canvas with a Minecraft skin drawn in the very top left corner (0,0)
// Makes the non-visible parts of the Minecraft skin transparent
function FixNonVisible(context) {
	// 64x32 and 64x64 skin parts
	context.clearRect(0, 0, 8, 8);
	context.clearRect(24, 0, 16, 8);
	context.clearRect(56, 0, 8, 8);
	context.clearRect(0, 16, 4, 4);
	context.clearRect(12, 16, 8, 4);
	context.clearRect(36, 16, 8, 4);
	context.clearRect(52, 16, 4, 4);
	context.clearRect(56, 16, 8, 32);
	
	// 64x64 skin parts
	context.clearRect(0, 32, 4, 4);
	context.clearRect(12, 32, 8, 4);
	context.clearRect(36, 32, 8, 4);
	context.clearRect(52, 32, 4, 4);
	context.clearRect(0, 48, 4, 4);
	context.clearRect(12, 48, 8, 4);
	context.clearRect(28, 48, 8, 4);
	context.clearRect(44, 48, 8, 4);
	context.clearRect(60, 48, 8, 4);
}

// Checks if the given part of the canvas contains a pixel with 0 alpha value (transparent)
function HasTransparency(context, x, y, w, h) {
	var imgData = context.getImageData(x, y, w, h);
	
	for(y = 0; y < h; y++) {
		for(x = 0; x < w; x++) {
			var index = (x + y * w) * 4;
			if(imgData.data[index + 3] == 0) return true;	// Has transparency
		}
	}
	
	return false;
}

// Copies one part of the canvas to another, with the option of flipping it horizontally
function Copy(context, sX, sY, w, h, dX, dY, flipHorizontal) {
	var imgData = context.getImageData(sX, sY, w, h);
	
	if(flipHorizontal)
	{
		// Flip horizontal
		for(y = 0; y < h; y++) {
			for(x = 0; x < (w / 2); x++) {
				index = (x + y * w) * 4;
				index2 = ((w - x - 1) + y * w) * 4;
				var pA1 = imgData.data[index];
				var pA2 = imgData.data[index+1];
				var pA3 = imgData.data[index+2];
				var pA4 = imgData.data[index+3];
				
				var pB1 = imgData.data[index2];
				var pB2 = imgData.data[index2+1];
				var pB3 = imgData.data[index2+2];
				var pB4 = imgData.data[index2+3];
				
				imgData.data[index] = pB1;
				imgData.data[index+1] = pB2;
				imgData.data[index+2] = pB3;
				imgData.data[index+3] = pB4;
				
				imgData.data[index2] = pA1;
				imgData.data[index2+1] = pA2;
				imgData.data[index2+2] = pA3;
				imgData.data[index2+3] = pA4;
			}
		}
	}
	
	context.putImageData(imgData,dX,dY);
}

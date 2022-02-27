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

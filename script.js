// Predefining classes
class City {
	constructor(alphaName, X, Y) {
		this.name = alphaName;
		this.x = X;
		this.y = Y;
		this.radius = 5;
		this.distFromCOM = Infinity;
	}

	getName(){ return this.name; }
	getX(){ return this.x; }
	getY(){ return this.y; }

	setName(cityName){ this.name = cityName; }
	setX(x_pos){ this.x = x_pos; }
	setY(y_pos){ this.y = y_pos; }
	setDistFromCOM(distance){ this.distFromCOM = distance; }
	drawCityName(){
		ctx.font = '20px Arial';
		ctx.fillStyle = 'white';
		let x_offset = 20;
		let y_offset = 20;
		if(this.x < 40 ) { 
			x_offset = -40;
		}
		if(this.y < 40 ) { 
			y_offset = -20;
		}
		ctx.fillText(this.name, this.x - x_offset, this.y - y_offset);
	}
}

//	Canvas Setup
const canvas = document.getElementById('canvas1');
const ctx =  canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
ctx.strokeStyle = 'white';

//	Random city generation
numCities = 7; 	// MUST BE <= 26
RADIUS = 5;
var cityNames = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T','U', 'V', 'W', 'X', 'Y', 'Z');
var region = new Array();
var xCoords = new Array();
var yCoords = new Array();

for (var i = 0; i < numCities; i++){
	var temp = new City(cityNames[i], getRandomInt(0, canvas.width), getRandomInt(0, canvas.height));
	xCoords.push(temp.getX());
	yCoords.push(temp.getY());
	region.push(temp);
}


// Draws Cities
for (var i = 0; i < region.length; i++) {
	drawFilledCircle(region[i].getX(), region[i].getY(), RADIUS, 'white');
	console.log("tick");
}

//		(1) Brute force - test all possible paths for optimal solution
const allPaths = generatePermutations(region);
const solutionPath = findShortestPath(allPaths);
console.log(solutionPath);
console.log(findPathDistance(solutionPath));
console.log("Solution Space = ", allPaths.length);

// Draws Solution
solutionPath.push(solutionPath[0]);
for (var i = 0; i < solutionPath.length-1; i++) {
	drawLine(solutionPath[i].x, solutionPath[i].y, solutionPath[i+1].x, solutionPath[i+1].y, 'yellow', 2);
}
solutionPath.pop();

//		(2) My Approach - Center of Mass Convergence
var x_avg = getArrayAvg(xCoords);
var y_avg = getArrayAvg(yCoords);
drawFilledCircle(x_avg, y_avg, RADIUS, 'blue');

// Update distances from Center of Mass point within each City
for (var i = 0; i < region.length; i++) {
	region[i].setDistFromCOM(calculateDistance(region[i].getX(), region[i].getY(), x_avg, y_avg));
}
region.sort((a,b) => b.distFromCOM - a.distFromCOM);


// Dot Product: ((point.x - line.x1) * (line.x2 - line.x1) + (point.y - line.y1) * (line.y2 - line.y1)) / line_length

// !! MUST PUT A CHECK TO ENSURE numCities ISN'T LESS THAN 3
var myPath = region.splice(0, 3);
myPath.push(myPath[0]);
console.log(myPath.length, myPath);
var insertCityHere;
for (var i = 0; i < region.length; i++) {
	var smallest_P2L_dist = Infinity;
	console.log("Checking: ", region[i]);
	for (var j = 0; j < myPath.length - 1; j++){
		let temp_P2L_dist = distanceClosestLine(region[i].getX(), region[i].getY(), myPath[j].getX(), myPath[j].getY(), myPath[j+1].getX(), myPath[j+1].getY());
		//console.log("Checking City ", region[i], " within: ", myPath);
		if (temp_P2L_dist < smallest_P2L_dist) {
			console.log(temp_P2L_dist, " < ", smallest_P2L_dist, " for Cities: ", myPath[j].getName(), " & ", myPath[j+1].getName());
			insertCityHere = j+1;
			smallest_P2L_dist = temp_P2L_dist;
		}
	}
	console.log("Insert: ", region[i], "between ", myPath[insertCityHere-1], myPath[insertCityHere]);
	myPath.splice(insertCityHere, 0, region[i]);
}
console.log(myPath);

for (var i = 0; i < myPath.length-1; i++) {
	drawLine(myPath[i].x, myPath[i].y, myPath[i+1].x, myPath[i+1].y, 'red', 2);
	myPath[i].drawCityName();
}
console.log("My Path's Distance: ", findPathDistance(myPath));



function distanceClosestLine(x_point, y_point, x1_line, y1_line, x2_line, y2_line){
	var dist_point2Line1 = calculateDistance(x_point, y_point, x1_line, y1_line);
	var dist_point2Line2 = calculateDistance(x_point, y_point, x2_line, y2_line);
	var line_length = Math.sqrt(dx_line*dx_line + dy_line*dy_line);
	var dx_line = x2_line - x1_line;
	var dy_line = y2_line - y1_line;
	var dotProduct = ((x_point - x1_line) * (dx_line) + (y_point - y1_line) * (dy_line)) / (line_length*line_length);
	if(dotProduct < 0) { // Point(x,y) lies beyond City(x1,y1) on the imaginary extention line
		console.log("Imaginary - A");
		return dist_point2Line2;
	}
	else if(dotProduct > (line_length*line_length)){ // Point(x,y) lies beyond City(x2, y2) on the imaginary extention line
		console.log("Imaginary - B");
		return dist_point2Line1;
	}
	else {
		return Math.floor(Math.abs((x1_line - x_point) * (y2_line - y_point) - (x2_line - x_point) * (y1_line - y_point)) / line_length);

		// var closest_x_line = x1_line + (dotProduct * (x2_line - x1_line) / (line_length*line_length));
		// var closest_y_line = y1_line + (dotProduct * (y2_line - y1_line) / (line_length*line_length));
		// drawFilledCircle(closest_x_line, closest_y_line, 3, 'orange');
		// drawLine(closest_x_line, closest_y_line, x_point, y_point, 'orange', 1);
		// return calculateDistance(x_point, y_point, closest_x_line, closest_y_line);
	}
	
}

function findShortestPath(possiblePaths) {
	var bestPath;
	var dist = Infinity;
	for (let i = 0; i < possiblePaths.length; i++) {
		if (dist > findPathDistance(possiblePaths[i])) {
			dist = findPathDistance(possiblePaths[i]);
			bestPath = possiblePaths[i];
		}
	}
	return bestPath;
}

function findPathDistance(path) {
	var dist = 0;
	var test = path.slice();
	test.push(path[0]);
	for (let i = 0; i < test.length - 1; i++) {
		dist += calculateDistance(test[i].getX(), test[i].getY(), test[i+1].getX(), test[i+1].getY());
	}
	return dist;
}

function permute(permutation, remaining, results) {
	if (remaining.length ===0) {
		results.push(permutation.slice());
	} else {
		for (let i = 0; i < remaining.length; i++) {
			const current = remaining[i];
			remaining.splice(i, 1);
			permutation.push(current);
			permute(permutation, remaining, results);
			permutation.pop();
			remaining.splice(i, 0, current);
		}
	}
}

function generatePermutations(arr) {
	const permutation = [];
	permute([], arr, permutation);
	return permutation;
}

function connectCities(pathArray) {
	for (var i = 0; i < pathArray.length; i++){
		if (i == pathArray.length - 1){
			drawLine(pathArray[i].getX(), pathArray[i].getY(), pathArray[0].getX(), pathArray[0].getY(), 'white', 2);
			break;
		}
			drawLine(pathArray[i].getX(), pathArray[i].getY(), pathArray[i+1].getX(), pathArray[i+1].getY(), 'white', 2);
	}
}

function displayText() {
	ctx.font = '20px Georgia';
	ctx.fillStyle = 'white';
	ctx.fillText('Hello, World!', 50, 50);
}

function drawLine(x1, y1, x2, y2, color, width) {
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function drawFilledCircle(x, y, radius, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2*Math.PI);
	ctx.fill();
}

function calculateDistance(x1, y1, x2, y2) {
	var dx = x2 - x1;
	var dy = y2 - y1;
	var distance = Math.floor(Math.sqrt(dx*dx + dy*dy));
	return distance;
}

function getRandomInt(min, max) {
	var minValue = Math.ceil(min);
	var maxValue = Math.floor(max + 1);
	return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
}

function getArrayAvg(array) {
	var temp = 0;
	for (var j = 0; j < array.length; j++) {
		temp += array[j];
	}
	return Math.floor(temp/array.length);
}

function findArrayMin(array) {
	var temp = array[0];
	for (var j = 1; j < array.length; j++) {
		if (array[j] < temp) {
			temp = array[j];
		}
	}
	return temp;
}

function findArrayMax(array) {
	var temp = array[0];
	for (var j = 1; j < array.length; j++) {
		if (array[j] > temp) {
			temp = array[j];
		}
	}
	return temp;
}
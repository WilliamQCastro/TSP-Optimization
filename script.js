// Predefining classes
class City {
	constructor(alphaName, X, Y) {
		this.name = alphaName;
		this.x = X;
		this.y = Y;
		this.radius = 5;
	}

	getName(){ return this.cityName; }
	getX(){ return this.x; }
	getY(){ return this.y; }

	setName(cityName){ this.name = cityName; }
	setX(x_pos){ this.x = x_pos; }
	setY(y_pos){ this.y = y_pos; }

	drawCity(){
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
		ctx.stroke();
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
let windowFrame = 0;


//	Random city generation
numCities = 9; 	// MUST BE <= 26
RADIUS = 5;
var coolCityNames = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T','U', 'V', 'W', 'X', 'Y', 'Z');
var region = new Array();
var xCoords = new Array();
var yCoords = new Array();

for (var i = 0; i < numCities; i++){
	var temp = new City(coolCityNames[i], getRandomInt(0, canvas.width), getRandomInt(0, canvas.height));
	xCoords.push(temp.getX());
	yCoords.push(temp.getY());
	region.push(temp);
}

//	Making array of distances between cities
var distances = new Array();
// This loop inserts dummy values to create a full n-by-n matrix
for (var i = 0; i < region.length; i++) {
	distances.push(xCoords.slice());
}
// These nested loops populate the n-by-n matrix with accurate distance data
for (var i = 0; i < region.length; i++) {
	for (var j = 0; j < region.length; j++) {
		distances[i][j] = calculateDistance(region[i].getX(), region[i].getY(), region[j].getX(), region[j].getY());
	}
}

//	Draw Cities on Canvas
for (var i = 0; i < numCities; i++){
	region[i].drawCity();
}
//		Slow rendering to view progress
//	Algorithm play: Brute Force vs. My Optimizations
//		(1) Brute force - test all possible paths for optimal solution
//		(2) My Approach
//			(a) Center of Mass
var x_COM = getArrayAvg(xCoords);
var y_COM = getArrayAvg(yCoords);
drawFilledCircle(x_COM, y_COM, RADIUS, 'blue');

//			(b) Bounding Box Center
var minX = findArrayMin(xCoords);
var minY = findArrayMin(yCoords);
var maxX = findArrayMax(xCoords);
var maxY =findArrayMax(yCoords);

drawFilledCircle(Math.floor((minX + maxX)/2), Math.floor((minY + maxY)/2), RADIUS, 'orange');

drawLine(minX, minY, minX, maxY, 'orange', 1);
drawLine(minX, maxY, maxX, maxY, 'orange', 1);
drawLine(maxX, maxY, maxX, minY, 'orange', 1);
drawLine(maxX, minY, minX, minY, 'orange', 1);

//			(c) Sticky Ping from Center of Mass
//			(c.1) Nearest Neighbor w/ Bounding box considerations
//			(d) Enclosing Circle on Center of Mass
//			(e) Clustering (a/b)?

const allPaths = generatePermutations(region);
const solutionPath = findShortestPath(allPaths);
connectCities(solutionPath);
console.log("--------------------------------");
console.log(solutionPath);
console.log(findPathDistance(solutionPath));



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

function bruteForceFind(cityList) {
	var bestPathLength = 99999999;
	var bestPathList = cityList.splice();
	var temp;
	for (i = 0; i < cityList.length; i++) {
		if (cityList.length == 2) {
			returncalculateDistance(cityList.getX(), cityList.getX(), cityList.getX(), cityList.getX()) 
		}
		else {

			bruteForceFind(bestPathList.splice(1));
		}
	}
	console.log(bestPathLength);
	return bestPathList;
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
	drawFilledCircle(x1, y1, 3, 'purple');
	drawFilledCircle(x2, y2, 3, 'purple');
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
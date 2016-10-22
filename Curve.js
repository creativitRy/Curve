//min value 0 - 255
//max value

///////////CODE/////////////

if (parseInt(org.pepsoft.worldpainter.Version.BUILD) > 20160820173357)
	print("This WorldPainter version probably includes CaptainChaos's new scripting system. Ask ctRy to update his scripts!");

print('Script by ctRy');

if (arguments.length < 1 || arguments[0] == "")
    throw "Arguments needed, format each line like below:\ninput height = output height\n";

var points = [];

outerloop:
for (var j = 0; j < arguments.length; j++)
{
	if (arguments[j] == "")
		continue;

	var temp = arguments[j].split("=");
	if (temp.length != 2)
		throw "= sign not found in argument " + j + ".\n";

	var point = {i:parseFloat(temp[0].trim()), o:parseFloat(temp[1].trim())};

	if (point.i < 0)
		throw "input cannot be below 0 in argument " + j + ".\n";
	if (point.i > 255)
		throw "input cannot be above 255 in argument " + j + ".\n";
	if (point.o < 0)
		throw "output cannot be below 0 in argument " + j + ".\n";
	if (point.o > 255)
		throw "output cannot be above 255 in argument " + j + ".\n";
	
	if (points.length == 0)
	{
		points.push(point);
		continue;
	}

	//sort points
	for (var k = points.length - 1; k >= 0; k++)
	{
		if (points[k].i == point.i)
			throw "one of the inputs are the same value\n";
		else if (points[k].i < point.i)
		{
			points.splice(k + 1, 0, point);
			continue outerloop;
		}
	}

	points.splice(0, 0, point);
}

if (points[0].i != 0)
	points.splice(0, 0, {i:0.0, o:0.0});
if (points[points.length - 1].i != 255)
	points.push({i:255.0, o:255.0});

var slopes = [];
for (var i = 1; i < points.length; i++)
{
	var mm = (points[i].o - points[i - 1].o)/(points[i].i - points[i - 1].i);
	slopes.push({start:points[i - 1].i, fin:points[i].i, m:mm, b:(points[i].o - mm * points[i].i)});
}


var rect = dimension.getExtent();
var xMin = rect.getX() * 128;
var yMin = rect.getY() * 128;

for (var x = xMin; x < rect.getWidth() * 128 + xMin; x++)
{
    for (var y = yMin; y < rect.getHeight() * 128 + yMin; y++)
    {
    	var height = dimension.getHeightAt(x, y);
    	var index = indexOf(height);
    	dimension.setHeightAt(x, y, slopes[index].m * height + slopes[index].b);
    }
}

print('Done! :D');

//binary search of the slopes array
function indexOf(height)
{
	var minIndex = 0;
	var maxIndex = slopes.length - 1;
	var currentIndex;
	var currentElement;
 
	while (minIndex <= maxIndex)
	{
		currentIndex = (minIndex + maxIndex) / 2 | 0; //Math.floor
		currentElement = slopes[currentIndex];
		if (currentElement.fin < height)
			minIndex = currentIndex + 1;
        else if (currentElement.start > height)
			maxIndex = currentIndex - 1;
		else
			return currentIndex;
	}
	return -1;
}
<?
require_once('config.php');
require_once('helper.php');

connect2db($mysql_host, $mysql_login, $mysql_password, $mysql_database);

// get the data we need brah!
$query = mysql_query("SELECT id, encoded_coords, levels, start, middle, end, name, type, difficulty, length FROM data") or die(mysql_error());

$output = array();

while($row = mysql_fetch_array($query)) {	
	$start = explode(", ", $row['start']);
	$middle = explode(", ", $row['middle']);
	$end = explode(", ", $row['end']);
	$output[] = array($row['id'], $row['encoded_coords'], $row['levels'], $start[0], $start[1], $middle[0], $middle[1], $end[0], $end[1], $row['name'], $row['type'], $row['difficulty'], $row['length']);	
}	
//set header
header('Content-type: application/javascript');
?>

/* google.load("visualization", "1", {packages: ["columnchart"]});  */


/* var mydata = []; */


var infowindow = new google.maps.InfoWindow();
var whistler = new google.maps.LatLng(50.12774899999999,-122.94078100000002);
var map;
var elevator;
var chart;
var coords;
var mousemarker;
var trailLayer;
var coords;
var myLocation;
var latlng;
var myZoom = 15;
var maxZoom = 20;
var minZoom = 13;
var zoomSelect;
var markerSet = false;
var newMarkerSet = false;
var currentTrail;
var trailMarker;
var trailMarkerSet = false;
var newTrailMarkerSet = false;
var accuracy;


var data = <?=json_encode($output)?>;
console.log(data);


/*
function getData() {
  $.getJSON("data.json", function(json) {
    mydata = json;
    console.log(mydata);
  });
};
*/
//--------------IU ELEMENTS--------------//

function zoomIn() {

	if (myZoom !== maxZoom) {
		myZoom++;
		map.setZoom(myZoom);		
/*		
		if (myZoom == maxZoom) {
			zoomSelect.className = "off";
		} else {
			zoomSelect.className = ""
		};		
		zoomSelect = document.getElementById('zoomin');
*/
	};
	//console.log(myZoom);

};

function zoomOut() {
	if (myZoom !== minZoom) {
		myZoom--;
		map.setZoom(myZoom);
/*
		if (myZoom == minZoom) {
			zoomSelect.className = "off";
		} else {
			zoomSelect.className = ""
		};		
		zoomSelect = document.getElementById('zoomout');
*/
	};	
	//console.log(myZoom);

};
	
/*
	if (myZoom !== minZoom) {
		myZoom--;
		map.setZoom(myZoom);
		
		zoomSelect = document.getElementById('zoomout');
		
		if (myZoom == maxZoom) {
			zoomSelect.className = "off";
		} else {
			zoomSelect.className = "";
			};
	};
};
*/

function closeAlert() {document.getElementById("alertbox").style.display = "none";};

function infoBox() {document.getElementById("info").style.display = "block";}

function closeInfo() {document.getElementById("info").style.display = "none";};

//--------------INFOWINDOW--------------//

/*
function createInfoWindow(place, name, type, difficulty, length, decodedPath) {
    google.maps.event.addListener(place, 'click', function(event) {
        
        // lay basic content - u make look gud olol
        infowindow.content = '<div id="infowindow"><h2>' + name + '</h2><br />Type: ' + type + '<br />Difficulty: ' + difficulty + '<br />Length: ' + length + 'm<br /><br /><div id="elevation_chart"></div></div>';
        infowindow.position = event.latLng;
        
        coords = decodedPath;
        infowindow.open(map);
    });
}
*/


function infoAlert(place, name, type, difficulty, length, midLat, midLng, decodedPath){
	google.maps.event.addListener(place, 'click', function(event) {
		
		trailMarkerSet = newTrailMarkerSet;
		//console.log(trailMarkerSet);
		traillatlng = new google.maps.LatLng(midLat, midLng);
		
		var trailMarkerIcon = new google.maps.MarkerImage(
			"images/tab-trail-2x.png", 
			new google.maps.Size(88,108),
			new google.maps.Point(0,0),
			new google.maps.Point(22,54),
			new google.maps.Size(44, 54)
		);
		
		 var trailMarkerShadow = new google.maps.MarkerImage(
	 		'images/tab-check-shadow.png',
     		new google.maps.Size(172, 108),
     		new google.maps.Point(0,0),
     		new google.maps.Point(22, 54),
      		new google.maps.Size(88, 54)
     	);

		
		if (trailMarkerSet === false) {
			trailMarker = new google.maps.Marker({
				map: map,
				position: traillatlng,
				draggable:false,
				shadow: trailMarkerShadow,
				icon:trailMarkerIcon		
			});
			
			newTrailMarkerSet = true;
			
		} else { trailMarker.setPosition(traillatlng); }
		//console.log(traillatlng);
		//drawPath(coords);
/*
	});
			
};
*/
		
		var alertbox = document.getElementById("alertbox");
		var alertboxContent = document.getElementById('alertbox-content');
		alertboxContent.innerHTML = '<h2>' + name + '</h2>Type: ' + type + '<br />Difficulty: ' + difficulty + '<br />Length: ' + length + 'm<br />';
		alertbox.style.display = 'block';

	});
}

/*
//elevation location on map
google.maps.event.addListener(infowindow, 'domready', function() {
    drawPath(coords);
	google.visualization.events.addListener(chart, 'onmouseover', function(e) {
		if (mousemarker == null) {
			mousemarker = new google.maps.Marker({
			position: elevations[e.row].location,
			map: map,
			icon: 'http://labs.google.com/ridefinder/images/mm_20_blue.png',
			zIndex: 211
    		});
  		} else {
    		mousemarker.setPosition(elevations[e.row].location);
  		}
	});
});
*/

/*
//elevation profile
function drawPath(decodedPath) {
	// Create a new chart in the elevation_chart DIV.
	chart = new google.visualization.AreaChart(document.getElementById('elevation_chart'));	
	// Create a PathElevationRequest object using this array.
	// Ask for 256 samples along that path.
	var pathRequest = {
	  'path': decodedPath,
	  'samples': 256
	}    
	// Initiate the path request.
	elevator.getElevationAlongPath(pathRequest, plotElevation);
}

// Takes an array of ElevationResult objects, draws the path on the map
// and plots the elevation profile on a Visualization API ColumnChart.
function plotElevation(results, status) {
	if (status == google.maps.ElevationStatus.OK) {
  		elevations = results;

  		// Extract the elevation samples from the returned results
  		// and store them in an array of LatLngs.
  		var elevationPath = [];
  		for (var i = 0; i < results.length; i++) {
    		elevationPath.push(elevations[i].location);
  		}

		// Extract the data from which to populate the chart.
		// Because the samples are equidistant, the 'Sample'
		// column here does double duty as distance along the
		// X axis.
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Sample');
		data.addColumn('number', 'Elevation');
		for (var i = 0; i < results.length; i++) {
			data.addRow(['', elevations[i].elevation]);
		}

		// Draw the chart using the data within its DIV. 
		document.getElementById('elevation_chart').style.display = 'block';
		chart.draw(data, {
			width: 170,
			height: 120,
			legend: 'none',
			lineWidth: 0.5,
		titleY: 'Elevation (m)',
		colors: ['00CC44']
		});
	}
} 
*/
//Segment Selecter
/*
function segmentSelect(place, trail) {
	google.maps.event.addListener(place, 'click', function() {
	
	var selectedTrail = place;
	
		var decodedPath = google.maps.geometry.encoding.decodePath(trail[1]);
		var reversePath = google.maps.geometry.encoding.decodePath(trail[1]);
		reversePath.reverse();
		
		var decodedLevels = decodeLevels(trail[2]);
		var reverseLevels = decodeLevels(trail[2]);
		reverseLevels.reverse();
		
		var line = new google.maps.Polyline({ path: decodedPath, 
			strokeColor: '#FF8844', strokeOpacity: 1, strokeWeight: 3, map: map, zIndex: 250})
			
		var startLatLng = new google.maps.LatLng(trail[3], trail[4]);
		var middleLatLng = new google.maps.LatLng(trail[5], trail[6]);
		var endLatLng = new google.maps.LatLng(trail[7], trail[8]);
		
		//start points markers
		var startmarker = new google.maps.Marker({
			position: startLatLng,
			map: map,
			icon: 'http://labs.google.com/ridefinder/images/mm_20_green.png',
			title: trail[9],
			zIndex: 251
		});
		//end points markers
		var endmarker = new google.maps.Marker({
			position: endLatLng,
			map: map,
			icon: 'http://labs.google.com/ridefinder/images/mm_20_red.png',
			title: trail[7],
			zIndex: 252
		});
		
		//console.log(trail[1]);
		console.log(decodedPath);
		console.log(reversePath);
  	});
};
*/

//function reverseSegment(segment){};


//--------------GEOLOCATION--------------//

function doGeolocation() {
	
	if (navigator.geolocation) {
		var timeoutVal = 10 * 1000 * 1000;
		navigator.geolocation.getCurrentPosition(
			success,
			error,
			{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0  }
		);
	} else {
		error('not supported');
	};

};

function success(position) {
  
	latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	
	
	markerSet = newMarkerSet;
	
	var LocateMarkerIcon = new google.maps.MarkerImage(
		"images/tab-check-2x.png", 
		new google.maps.Size(88,108),
		new google.maps.Point(0,0),
		new google.maps.Point(22,54),
		new google.maps.Size(44, 54)
	);
		
	 var LocateMarkerShadow = new google.maps.MarkerImage(
	 'images/tab-check-shadow.png',
      new google.maps.Size(172, 108),
      new google.maps.Point(0,0),
      new google.maps.Point(22, 54),
      new google.maps.Size(88, 54)
     );
							
    if (markerSet === false) {
    	myLocation = new google.maps.Marker({
			map: map,
			position: latlng,
			draggable:false,
			animation: google.maps.Animation.DROP,
			shadow: LocateMarkerShadow,
			icon:LocateMarkerIcon
			});
		
		myZoom = 17;
		map.setZoom (myZoom);
		map.setCenter(latlng);
		newMarkerSet = true;

	} else {
    	myLocation.setPosition(latlng);
    	myLocation.setAnimation(google.maps.Animation.DROP);
    	map.setCenter(latlng);
    }
	
	accuracy = position.coords.accuracy;
	
	var alertbox = document.getElementById("alertbox");
	var alertboxContent = document.getElementById("alertbox-content");
	alertboxContent.innerHTML = "Accurate to within " + accuracy + " metres.";
	alertbox.style.display = "block";
};

function error(msg) {
	var errors = {
		1: 'Permission denied.',
		2: 'Position unavailable.',
    	3: 'Request timeout.'
	};
	
	alert('Sorry,can not locate your position, ' + errors[msg.code]);
};


//--------------DrawTrails--------------//

function decodeLevels(encodedLevelsString) {
    var decodedLevels = [];

    for (var i = 0; i < encodedLevelsString.length; ++i) {
        var level = encodedLevelsString.charCodeAt(i) - 63;
        decodedLevels.push(level);
    };
    return decodedLevels;
};


function drawTrails() {

	for(var i in data) {
		var trail = data[i];
		var decodedPath = google.maps.geometry.encoding.decodePath(trail[1]); 
		var decodedLevels = decodeLevels(trail[2]);
			
		var strokecolor;
		var strokewidth;
		var icon;
		var opacity;

		// check difficulty
		if (trail[11] === "Double Black Diamond") {
			strokecolor = "#000000";
			icon = 'images/blank.gif';
			opacity = 1;
		} else if(trail[11] === "Black Diamond") {
			strokecolor = "#000000";
			icon = 'images/blank.gif';
			opacity = 1;
		} else if(trail[11] === "Blue Square") {
			strokecolor = "#4444FF";
			icon = 'images/blank.gif';
			opacity = 1; 		
		} else if(trail[11] === "Green Circle") {
			strokecolor = "#00CC22";
			icon = 'images/blank.gif';
			opacity = 1;
		} else if(trail[11] === "Access") {
			strokecolor = "#FF8844";
			opacity = 1;
			icon = 'images/blank.gif';	
		} else if(trail[11] === "Valley Trail") {
			strokecolor = "#FFFF00";
			opacity = 1;
			icon = 'images/blank.gif';	
		} else {
			strokecolor = "#FF8844";
			icon = 'images/blank.gif';
			opacity = 1;
		}
		
		//check type
		if (trail[10] === "Doubletrack"){
			strokewidth = 3;
		} else {
			strokewidth = 2;
		}		
				
		var line = new google.maps.Polyline({ path: decodedPath, levels: decodedLevels, 
			strokeColor: strokecolor, strokeOpacity: opacity, strokeWeight: strokewidth, map: map});

		//createInfoWindow(line,trail[9],trail[10],trail[11],trail[12],decodedPath);
		infoAlert(line,trail[9],trail[10],trail[11],trail[12],trail[5],trail[6],decodedPath);
		//segmentSelect(line,trail);
	};
};

//--------------PAGE LOADED--------------//

function initialize() {
/*   getData(); */
  
	latlng = whistler; 
  
	myOptions = {
    	zoom: myZoom,
    	center: latlng,
    	disableDefaultUI: true,
    	mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
  	//Create Map
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	
	//Get Elevation Service from Google
	//elevator = new google.maps.ElevationService();
	drawTrails();
	//doGeolocation()
	
	document.getElementById("zoomin").onclick = function() { zoomIn(); };
	document.getElementById("zoomout").onclick = function() { zoomOut(); };
	document.getElementById("locate").onclick = function() { doGeolocation(); };
	document.getElementById("alertbox-close").onclick = function() { closeAlert(); };
	document.getElementById("info-button").onclick = function() { infoBox(); };
	document.getElementById("info-close").onclick = function() { closeInfo(); };
	
};
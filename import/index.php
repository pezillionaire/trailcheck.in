<?

require_once('config.php');
require_once('helper.php');
require_once('class.polylineEncoder.php');


connect2db($mysql_host, $mysql_login, $mysql_password, $mysql_database);
$c = file_get_contents("./whistler-1.6.kml");


// ugly regexp
preg_match_all('/<td>FID<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr bgcolor=\"#D4E4F3\">\s+<td>Type<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr>\s+<td>Name<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr bgcolor=\"#D4E4F3\">\s+<td>Source<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr>\s+<td>Location<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr bgcolor=\"#D4E4F3\">\s+<td>Origin<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr>\s+<td>Status<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr bgcolor=\"#D4E4F3\">\s+<td>Difficulty<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr>\s+<td>Access<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr bgcolor=\"#D4E4F3\">\s+<td>MTN_BIKE<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr>\s+<td>MOTORIZED<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr bgcolor=\"#D4E4F3\">\s+<td>HIKING<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr>\s+<td>EQUESTRIAN<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr bgcolor=\"#D4E4F3\">\s+<td>TRIALS<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr>\s+<td>Shape_Leng<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr bgcolor=\"#D4E4F3\">\s+<td>Comment<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<tr>\s+<td>Length<\/td>\s+<td>(.*?)<\/td>\s+<\/tr>\s+<\/table>\s+<\/td>\s+<\/tr>\s+<\/table>\s+]]><\/description>\s+<styleUrl>(.*?)<\/styleUrl>\s+<LineString>\s+<tessellate>1<\/tessellate>\s+<coordinates>\n([^<]*)<\/coordinates>/', $c, $matches);

$data = array();
$i = 0;

for($i = 0; $i < count($matches[1]); $i++) {

	$type = $matches[2][$i];
	$name = $matches[3][$i];
	$difficulty = $matches[8][$i];
	$length = $matches[17][$i];
	$coords = $matches[19][$i];
	
	// clean up coords, put into array
	$coords = trim($coords);
	$coords = str_replace(",0.000000", "", $coords);
	$coords = str_replace(" ","", $coords);
	
	$coords_array = dumbCoords($coords);
	
	
	// new data
	
	$data[$i] = array();
	$data[$i]['name'] = $name;
	$data[$i]['length'] = $length;
	$data[$i]['type'] = $type;
	$data[$i]['difficulty'] = $difficulty;
	$data[$i]['coords'] = $coords_array;
	$data[$i]['start'] = $coords_array[0];
	$mid = round(count($coords_array) / 2);
	$data[$i]['middle'] = $coords_array[$mid];
	$data[$i]['end'] = end($coords_array);
	
	
	// check if key exists already - if so it's a segment of the trail	
	/*
	if(!empty($name) and array_key_exists($name, $data) and $name != "Valley Trail") {

		$new = array_merge($data[$name]['coords'], $coords_array);
		$data[$name]['coords'] = $new;
		
		//find middle
		$mid = round((count($data[$name]['coords'])) / 2);
		$data[$name]['middle'] = $data[$name]['coords'][$mid];	
		
		$data[$name]['end'] = end($data[$name]['coords']);	
		
	} else {
		// new data
		$data[$name] = array();
		$data[$name]['length'] = $length;
		$data[$name]['type'] = $type;
		$data[$name]['difficulty'] = $difficulty;
		$data[$name]['coords'] = $coords_array;
		$data[$name]['start'] = $coords_array[0];
		
		$mid = round(count($coords_array) / 2);
		$data[$name]['middle'] = $coords_array[$mid];
		
		$data[$name]['end'] = end($coords_array);

	}
	*/
}

// add to mysql 
foreach($data as $key=>$val) {
	
	// encode coords
	$points = array();
	foreach($val['coords'] as $c) {
		$points[] = explode(", ", $c);
	}

	$encoder = new PolylineEncoder(18, 2, .000001, true);
	$polyline = $encoder->encode($points);
	
	$name = mysql_real_escape_string($val['name']);
	$type = mysql_real_escape_string($val['type']);
	$difficulty = mysql_real_escape_string($val['difficulty']);
	
	$encoded_coords = $polyline->points; 
	$levels = $polyline->levels;


	$coords = serialize($val['coords']);

	mysql_query("INSERT INTO data VALUES(null, '$name', '$type', '$difficulty', $val[length], '$val[start]', '$val[middle]', '$val[end]', '$coords', '$encoded_coords', '$levels', '')") or die(mysql_error());

}

function dumbCoords($coords) {
	$ret = array();
	
	$tmp = explode("\n", $coords);
	foreach($tmp as $t) {
		$c = explode(",", $t);
		$ret[] = sprintf('%s, %s', trim($c[1]), trim($c[0]));
	}
	return $ret;
}


?>


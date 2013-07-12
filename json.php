
<?
require_once('scripts/config.php');
require_once('scripts/helper.php');

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

  $data = json_encode($output);

  $json = $data;
  
  if (json_decode($json) != null) { /* sanity check */
    $file = fopen('new_map_data.json','w+');
    fwrite($file, $json);
    fclose($file);
  } else {
  // handle error 
  }

?>

<?

function connect2db($mysql_host, $mysql_login, $mysql_password, $mysql_database) {

	$cnx = mysql_connect($mysql_host, $mysql_login, $mysql_password) or die(mysql_error());
	mysql_select_db($mysql_database) or die(mysql_error());
}


?>
<!DOCTYPE html> 
<html> 
<head> 
<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;" /> 
<meta name="apple-mobile-web-app-capable" content="yes" /> 
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="keywords" content="trail, bike, bicycle, map, location, gps, hike, hiking, whistler, british columbia, vancouver, guide" />
<meta name="description" content="Trail map and location guide for Whistler, BC." />
 
<title>TrailCheckIn | Whistler Bike Trail Map</title> 

<link rel="apple-touch-icon-precomposed" href="apple-touch-icon-precomposed.png"/>
<link rel="apple-touch-startup-image" href="startup.png" />
<!-- <link rel="apple-touch-startup-image" sizes="640x960" href="startup.png" /> -->

<link rel="stylesheet" href="style/reset.css"/> 
<link rel="stylesheet" href="style/style.css"/>
<link href="//get.pictos.cc/fonts/232/4" rel="stylesheet" type="text/css" />

<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.min.js"/></script>
<script type="text/javascript" src="http://use.typekit.com/tby7hws.js"></script>
<script type="text/javascript">try{Typekit.load();}catch(e){}</script>


</head> 
 
<body onload="initialize()"> 
  
<div id="map_canvas"></div>

<header class="group"> 

<a href="#" id="info-button" data-icon="i"></a>
<!--<a href="#" id="settings_button" data-icon="?"></a>-->

<img src="images/logo2.png" alt="logo" id="logo" width="44" height="44" />
<h1>TrailCheck.in</h1>

<a href="#" id="locate" data-icon="@"></a>
</header> 

<div id="controls">
<a href="#" id="zoomin">+</a>
<a href="#" id="zoomout">-</a> 
</div>

<section id="overlay">

<div id="alertbox" class="group">
<p id="alertbox-content"></p>
<a href="#" id="alertbox-close">&times;</a>
</div>

</section> <!-- End overlay -->

<section id="info" class="group">

<article id="info-content" class="group">
<h3>TrailCheckIn<span> Beta</span></h3>

<p>TrailCheckIn is a <strong>free</strong> web-app you can use on the desktop or mobile to get your location and find trails in Whistler, BC. Canada. TrailCheckIn is currently in public beta. I will be adding more features and updating trail info as my time and resources allow. If you have questions, or wish to contribute (trail GPS Data, trail information, suggestions are all welcome). <a href="mailto:&#112;&#101;&#122;&#64;&#108;&#105;&#110;&#101;&#97;&#110;&#100;&#112;&#105;&#120;&#101;&#108;&#46;&#99;&#111;&#109;">Email me</a> or talk directly on <a href="http://twitter.com/pezillionaire">twitter</a>.</p>

<h3><img src="images/trailcheck-icon.png" alt="trailcheck-icon" width="32" height="32" id="app-icon"/>TAKE IT WITH YOU!</h3>
<p>You can add TrailCheckIn as an App to your iPhone, Android, or iPad by bookmarking <span class="book">#</span> this site and taping <strong>"Add to Home Screen"</strong>. Enjoy!</p>


<a href="#" id="info-close">&times;</a>

</article>



</section> <!-- End info -->





<footer>
<!-- <section id="cascade"> -->

<!-- </section> -->
<!-- <section id="lineandpixel"> -->
<!--Data: <a href="http://cerg.ca">Cascade</a>&nbsp;&bull;&nbsp;-->Built by: <a href="http://lineandpixel.com">LiNE & PiXEL</a><img src="images/landpicon.gif" alt="landpicon" class="landpicon" width="16px" height="16px" />
<!-- </section> -->
</footer>
</body>


<script type="text/javascript" src="http://maps.google.com/maps/api/js?libraries=geometry&sensor=true"></script>
<script type="text/javascript" src="scripts/trails.php.js"></script>

<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-5059376-7']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
</html>
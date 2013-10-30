<?php
function terms()
{
	$css  = '<style type="text/css">' . 
			file_get_contents( dirname(__FILE__)."\\terms.css") .
			'</style>';
	$html = file_get_contents( dirname(__FILE__)."\\terms.html" );
	
	echo $css.$html;
}


?>
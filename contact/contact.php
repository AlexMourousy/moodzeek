<?php
function sendContactForm()
{
	$css  = '<style type="text/css">' . 
			file_get_contents( dirname(__FILE__)."\contact.ajax.css") .
			'</style>';
	$html = file_get_contents( dirname(__FILE__)."\contact.ajax.html" );
	
	echo $css . $html ;
}

// INFO  - php.ini
// ; For Win32 only.
// ; http://php.net/sendmail-from
// sendmail_from = aesv@bbox.fr	

function sendMail()
{

	$hisIP = 		$_SERVER['REMOTE_ADDR'];
	$hisName = 		(isset($_POST['info']['message']['nom'])) ? 	$_POST['info']['message']['nom'] : 	'... champ vide ...'; // htmlentities OFF
	$hisEmail = 	(isset($_POST['info']['message']['email'])) ? 	$_POST['info']['message']['email'] : 	'... champ vide ...'; // idem
	$hisMessage = 	(isset($_POST['info']['message']['message']))?	$_POST['info']['message']['message'] :	'... champ vide ...'; // idem
	
	$rn = "\n"; //"\r\n"

	$headers =	'From: <'.$hisEmail.'>'.$rn;
	$headers .=	'Reply-To: '.$hisEmail.$rn; 
	$headers .=	"Content-Type: text/plain; charset=\"UTF-8\"".$rn; // iso-8859-1
	$headers .=	'Content-Transfer-Encoding: 8bit'; 

	$myEMail = 	'alex_mourousy@hotmail.com';
	$object  = 	'** MESSAGE MOODZEEK **';
	$message = 	$rn."De : ".$hisName . $rn.$rn . "Email : ".$hisEmail. $rn ."IP :    ".$hisIP
				.$rn.$rn.$hisMessage.$rn;

	if( mail( $myEMail, $object, $message ,$headers ) ){
		echo "** Thank you for your message **";
	}else{
		echo "Your message could not be sent<br/>Please try again later";
	}
}

?>

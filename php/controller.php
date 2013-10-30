<?php
require_once dirname(__FILE__) . '/../contact/contact.php' ;
require_once dirname(__FILE__) . '/../terms/terms.php' ;

require_once dirname(__FILE__) . '/domain/Member.class.php' ;
require_once dirname(__FILE__) . '/domain/Tags.class.php' ;
require_once dirname(__FILE__) . '/domain/Track.class.php' ;
require_once dirname(__FILE__) . '/service/Service.class.php';

// ACTION à réaliser
if( isset($_POST['info']['action']) )
{
	$action = $_POST['info']['action'];
	$ip = $_SERVER['REMOTE_ADDR'];
	
	// MEMBER
	$idMemberDZ = isset($_POST['info']['user']['id']) ? $_POST['info']['user']['id'] : '';
	$name = isset($_POST['info']['user']['name']) ? $_POST['info']['user']['name'] : '';
	$firstname = isset($_POST['info']['user']['firstname']) ? $_POST['info']['user']['firstname'] : '';
	$lastname = isset($_POST['info']['user']['lastname']) ? $_POST['info']['user']['lastname'] : '';
	$email = isset($_POST['info']['user']['email']) ? $_POST['info']['user']['email'] : '';
	$birthday = isset($_POST['info']['user']['birthday']) ? $_POST['info']['user']['birthday'] : '';
	$gender = isset($_POST['info']['user']['gender']) ? $_POST['info']['user']['gender'] : '';
	$member = new Member( '', $idMemberDZ, $name, $firstname, $lastname, $email, $birthday, $gender, $ip, '', '', '', '' );

	// TAGS
	$mood = isset($_POST['info']['tags']['mood']) ? $_POST['info']['tags']['mood'] : array();
	$activ = isset($_POST['info']['tags']['activ'])	? $_POST['info']['tags']['activ'] : array();
	$tags = new Tags( $mood, $activ );
	
	// TRACK
	$idTrackDZ = isset($_POST['info']['track']['id']) ? $_POST['info']['track']['id'] : '';
	$artist = isset($_POST['info']['track']['artist']) ? $_POST['info']['track']['artist'] : '';
	$album = isset($_POST['info']['track']['album']) ? $_POST['info']['track']['album'] : '';
	$title = isset($_POST['info']['track']['title']) ? $_POST['info']['track']['title'] : '';
	$track = new Track( '', $idTrackDZ, $artist, $album, $title );
	
	// VOTE - FILTER(straight sanitized)
	$intention = isset($_POST['info']['vote']['intention']) ? $_POST['info']['vote']['intention'] : '';
	$voteFilter = isset($_POST['info']['vote']['filter']) && is_numeric($_POST['info']['vote']['filter']) ? $_POST['info']['vote']['filter'] : null;
		
			
	// ACTION
	switch( $action )
	{
		case "login" :	{
			$ack = Service::login( $member );
			header( 'Content-type: application/json' );
			echo json_encode( $ack );			 			
			break;
		}
		case "playAll": {
			$list = Service::getAll( $tags, $voteFilter ); 
			header( 'Content-type: application/json' );
			echo json_encode( $list );	
			break;
		}
		case "addFav" : {
			$rep = Service::addFav( $member, $track, $tags, $ip );
			header( 'Content-type: application/json' );
			echo json_encode( $rep ); // ack + vote
			break;
		}
		case "remove" : {
			$ack = Service::removeTrack( $member, $track );
			header( 'Content-type: application/json' );
			echo json_encode( $ack );
			break;
		}
		case "playFav": {
			$list = Service::getFav( $member, $tags, $voteFilter );
			header( 'Content-type: application/json' );
			echo json_encode( $list );	
			break;
		}
		case "vote": {
			$ack = Service::vote( $member, $track, $intention );  //'true';
			header( 'Content-type: application/json' );
			echo json_encode( $ack );
			break;
		}		
		case "contact": sendContactForm(); 		break;
		
		case "message":	sendMail(); 			break;
		
		case "terms": 	terms(); 				break;
		
		default: break;
	}
}

/** DEV eventuel **/
/*	$response = array(	'ack'     => $ack,
 'message' => $message,
		'playlist'=> $playlist );
*/	//$response = array();


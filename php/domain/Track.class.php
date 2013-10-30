<?php

class Track {
	
	private $idTrackMZ;
	private $idTrackDZ;
	private $artist;
	private $album;
	private $title;

	//private $mood ... !! INTEGER
	
	function __construct( $idTrackMZ, $idTrackDZ, $artist, $album, $title ) //,$mood=array(), $activ=array(), $occurence=0, $likes=0) 
	{
		$this->idTrackMZ = 	$idTrackMZ;
		$this->idTrackDZ = 	$idTrackDZ;
		$this->artist = 	$artist;
		$this->album = 		$album;
		$this->title = 		$title;
	}
	
	// Magic getter
	public function __get( $property ) {
		if (property_exists($this, $property)) return $this->$property;
		user_error("undefined property $property");
	}

	// Magic setter. Silently ignore invalid fields
	public function __set( $property, $value ) {
		if (property_exists($this, $property)) $this->$property = $value;
	}
		
	/** Returns an associative array of defined object accessible non-static properties */
	public function dismount()
	{
		return get_object_vars( $this );
	}
}

/*	function __get( $p ) {
 $m = "get_$p";
if(method_exists($this, $m)) return $this->$m();
user_error("undefined property $p");
}
*/
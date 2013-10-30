<?php

class Tags {

	private $mood;
	private $activ;

	function __construct( $mood, $activ )
	{
		// Sanitize
		$mood =  $this->splice_non_numeric_entries( $mood );
		$activ = $this->splice_non_numeric_entries( $activ );
		// Set Mood flags
		$this->mood =  array_fill( 0, 4, false );
		foreach( $mood as $key=>$i ){
			$this->mood[$i-1] = true ;
		}
		// Set Activ flags
		$this->activ = array_fill( 0, 9, false);
		foreach ( $activ as $key=>$i ){
			$this->activ[$i-1] = true ;
		}			
	}
	
	public function __get($property) {
		if (property_exists($this, $property)) return $this->$property;
		user_error("undefined property $property");
	}
	
	/**
	 * 	 Supprime les entrées non numériques dans un tableau
	 * */
	private function splice_non_numeric_entries( $tab )
	{
		foreach( $tab as $key=>$value ){
			if( !is_numeric($tab[$key]) ) unset( $tab[$key] );
		}
		return array_values( $tab ); // And re-index
	}
}

<?php

class Member 
{
	private $idMemberMZ;

	private $idMemberDZ;
	private $name;
	private $firstname;
	private $lastname; 
	private $email;
	private $birthday;
	private $gender;
	private $ip;
	
	private $tracks;
	private $votes;
	private $connections;
	private $latest;

	
	/** CONSTRUCTEUR DYNAMIQUE ET MULTIPLE SUIVANT LE NOMBRE D'ARGUMENTS */	
	function __construct( )
	{
		if( func_num_args()>0 ){
			$args = func_get_args();
			$i=0;
			foreach ( get_class_vars(get_class($this)) as $prop=>$val )
				$this->{$prop} = $args[$i++];
		}
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
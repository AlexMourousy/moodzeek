<?php
require_once dirname(__FILE__) . '/../domain/Track.class.php' ;
require_once dirname(__FILE__) . '/../domain/Tags.class.php' ;

class TagsDAO 
{
	private $pdo;

	function __construct()
	{
		$connect = Connect::getInstance();
		$this->pdo = $connect->pdo;
	}
	
	/** Retourne les tuples 'idTrackDZ' et 'vote' de 'mz_track' et 'mz_track' en jointure sur 'idTrackDZ'
	 * selon les Tags et le voteFilter */
	public function getFav( Member $member, Tags $tags, $voteFilter )
	{		
		//GET TRACK LIST
		// Préparer la requête
		$query = 'SELECT mz_track.idTrackDZ, vote FROM mz_track INNER JOIN mz_tags'
				.' ON mz_track.idTrackDZ=mz_tags.idTrackDZ WHERE idMemberDZ=:idMemberDZ';	
		// Ecriture dynamique : WHERE "mood conditions" AND "activ conditions"
		if ( in_array( true, $tags->mood ) ){
			$query.= ' AND (';
			foreach( $tags->mood as $i=>$flag ) if($flag) $query.= ' mz_tags.mood'.($i+1).'=1 OR';
			$query = rtrim( $query, ' OR' ) . ' )';
		}
		if ( in_array( true, $tags->activ ) ){
			$query.= ' AND (';
			foreach( $tags->activ as $i=>$flag ) if($flag) $query.= ' mz_tags.activ'.($i+1).'=1 OR';
			$query = rtrim( $query, ' OR' ) . ' )';
		}
		// Selecteur $voteFilter
		if( isset($voteFilter) ){
			$query.= ' AND vote>='.$voteFilter ;
		}
		$query.= ' GROUP BY idTrackDZ ORDER BY RAND() LIMIT 50';
		// Exécution
		try{
			$stmt = $this->pdo->prepare( $query );
			$stmt->execute( array( ':idMemberDZ' => $member->idMemberDZ ) );
			$result = $stmt->fetchAll( PDO::FETCH_ASSOC );
			return $result;
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';
		}		
	}
	
	/** SET TAGS DES FAVORIS - Retourne 'true' si 1 row affecté */
	public function addTags( Member $member, Track $track, Tags $tags , $ip )
	{
		// Recherche du titre en BD
		$query = "SELECT COUNT(*) FROM mz_tags WHERE idTrackDZ = :idTrackDZ AND idMemberDZ = :idMemberDZ";
		try{
			$stmt = $this->pdo->prepare( $query );
			$stmt->execute( array(	':idTrackDZ' => $track->idTrackDZ ,
									':idMemberDZ'=> $member->idMemberDZ ));
			$exists = $stmt->fetchColumn();
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';
		}
		// Ajout nouveau titre en BD
		if( !$exists ){
			// Prepare track data + tags for query
			$tagsArray['idTrackDZ'] = $track->idTrackDZ;
			$tagsArray['idMemberDZ'] = $member->idMemberDZ;
			foreach( $tags->mood as $i=>$flag )  if($flag) $tagsArray['mood'.($i+1)] = $flag;
			foreach( $tags->activ as $i=>$flag ) if($flag) $tagsArray['activ'.($i+1)] = $flag;
			$tagsArray['weekDay'] = date("N", time());
			$tagsArray['season'] = $this->getSeason();
			$tagsArray['ip'] = $ip;
			// Prepare pdo prepared request query
			$columns = implode( ', ', array_keys($tagsArray) );
			$placeholders = str_repeat( '?, ', count($tagsArray)-1 ) . '?';				
			$query = "INSERT INTO mz_tags ($columns) VALUES ($placeholders)";
			// Go !
			try{
				$stmt = $this->pdo->prepare( $query );
				$i = 1;
				foreach( $tagsArray as $value )
					$stmt->bindValue( $i++, $value, PDO::PARAM_STR );
				$stmt->execute();
				return ( $stmt->rowCount() == 1 ); //? true : false ;
				
			}catch(PDOException $e){
				return DEBUG ? $e->getMessage() : 'Exception';
			}	
		// Tag déjà existant !				
		}else{
			return false;
		}
	}
	
	private function getSeason()
	{
		$currentMonth = date("m");
		//retrieve season
		IF ($currentMonth>="03" && $currentMonth<="05") $season = "2";
		ELSEIF ($currentMonth>="06" && $currentMonth<="08") $season = "3";
		ELSEIF ($currentMonth>="09" && $currentMonth<="11") $season = "4";
		ELSE $season = "1";
		return $season;
	}

	/** EFFACE DES FAVORIS - Retourne 'true' si 1 row affecté */
	public function removeFav( Member $member, Track $track )
	{
		$query = "DELETE FROM mz_tags WHERE idTrackDZ = :idTrackDZ AND idMemberDZ = :idMemberDZ";
		try{
			$stmt = $this->pdo->prepare( $query );
			$stmt->execute( array(	':idTrackDZ' => $track->idTrackDZ ,
									':idMemberDZ'=> $member->idMemberDZ ));
			return ( $stmt->rowCount() == 1 );
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';
		}
	}	

}
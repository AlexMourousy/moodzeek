<?php
require_once dirname(__FILE__) . '/../domain/Track.class.php' ;
require_once dirname(__FILE__) . '/../domain/Tags.class.php' ;

class TrackDAO 
{
	private $pdo;
	private $trackDB;

	function __construct()
	{
		$connect = Connect::getInstance();
		$this->pdo = $connect->pdo;
	}
	/** Retourne les tuples 'idTrackDZ' et 'vote' de 'mz_track' selon les Tags et le voteFilter */
	public function getAll( Tags $tags, $voteFilter )
	{
		// Préparer la requête
		$query = 'SELECT idTrackDZ, vote FROM mz_track';	
		// Ecriture dynamique : WHERE "mood conditions" AND "activ conditions" AND voteFilter (snitized)
		if( in_array(true,$tags->mood) || in_array(true,$tags->activ) || isset($voteFilter)){	
			$query.= ' WHERE (';
			if( in_array(true,$tags->mood) ){
				foreach( $tags->mood as $i=>$flag )
					if($flag) $query.= ' mood'.($i+1).'>0 OR';
				$query = rtrim( $query, ' OR' ) . ' )';
				if ( in_array(true,$tags->activ)||isset($voteFilter) ) $query.= ' AND (';
			}
			if( in_array(true,$tags->activ) ){
				foreach( $tags->activ as $i=>$flag )
					if($flag) $query.= ' activ'.($i+1).'>0 OR';
				$query = rtrim( $query, ' OR' ) . ' )';
				if ( isset($voteFilter) ) $query.= ' AND (';
			}
			if( isset($voteFilter) ){
				$query.= ' vote>='.$voteFilter.' )';
			}
		}
		$query.= ' GROUP BY idTrackDZ ORDER BY RAND() LIMIT 50';
		// Exécution
		try{
			$tracks = $this->pdo->query( $query )->fetchAll(PDO::FETCH_ASSOC);
			return $tracks;
			
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';
		}		
	}
	
	/** Insère le titre en BD s'il n'existe pas. Retourne true si déroulement sans problème */ 
	public function insertTrack( Track $track )
	{
		// Recherche du titre en BD
		$query = "SELECT * FROM mz_track WHERE idTrackDZ = :idTrackDZ";
		try{
			$stmt = $this->pdo->prepare( $query );
			$stmt->execute( array( ':idTrackDZ' => $track->idTrackDZ ) );
			$this->trackDB = $stmt->fetchObject();
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';
		}
		// Ajout nouveau titre en BD
		if( ! $this->trackDB ){
			// Prepare track data + tags for query
			$trackArray = $track->dismount();
			// Prepare pdo prepared request query
			$columns = implode( ', ', array_keys($trackArray) );
			$placeholders = str_repeat( '?, ', count($trackArray)-1 ) . '?';				
			$query = "INSERT INTO mz_track ($columns) VALUES ($placeholders)";
			try{ // Go !
				$stmt = $this->pdo->prepare( $query );
				$i = 1;
				foreach( $trackArray as $value )
					$stmt->bindValue( $i++, $value, PDO::PARAM_STR );
				$stmt->execute();
			}catch(PDOException $e){
				return DEBUG ? $e->getMessage() : 'Exception';
			}
		}
		return true;
	}
	
	/** MAJ tags globaux du titre. A appeler apres insertTrack ou checkTracks. Retourne 'true' si pas de problème */				
	public function updateTrack( Track $track, Tags $tags )
	{
		// Retrieve initial states, prepare update query data and increment on flags
		$majTags=array();
		foreach( $tags->mood as $i=>$flag )
			if($flag) 
				$majTags['mood'.($i+1)] =  $this->trackDB ? $this->trackDB->{'mood'.($i+1)} + 1 : 1;
		foreach( $tags->activ as $i=>$flag )
			if($flag) 
				$majTags['activ'.($i+1)] = $this->trackDB ? $this->trackDB->{'activ'.($i+1)} + 1 : 1;
		// Write pdo prepared query
		$columns = implode('=?, ', array_keys($majTags)).'=?, '.'occurence=?' ;
		$query = "UPDATE mz_track SET $columns WHERE idTrackDZ=?";
		try{ // Go !
			$stmt = $this->pdo->prepare( $query );
			$i = 1;
			foreach( $majTags as $value )
				$stmt->bindValue( $i++, $value, PDO::PARAM_STR );
			$stmt->bindValue( $i++, $this->trackDB ? $this->trackDB->occurence + 1 : 1, PDO::PARAM_STR );
			$stmt->bindValue( $i++, $track->idTrackDZ, PDO::PARAM_STR );
			$stmt->execute();
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';
		}
		return true;
	}
	
	/** Retourne un objet 'trackBD' du titre existant, 'false' sinon */
	public function checkTrack( Track $track )
	{
		// Recherche du titre en BD
		$query = "SELECT * FROM mz_track WHERE idTrackDZ = :idTrackDZ";
		try{
			$stmt = $this->pdo->prepare( $query );
			$stmt->execute( array( ':idTrackDZ' => $track->idTrackDZ ) );
			return $this->trackDB = $stmt->fetchObject();
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';
		}
	}	
	
	/** Décrémente l'occurence ou efface le titre si celle ci devient nulle. Retourne 'true' si query OK */
	public function removeOrUpdateTrack( Track $track )
	{
		// Retrieve initial occurence state, prepare update or delete
		if( $this->trackDB->occurence > 1 ){
			$query = "UPDATE mz_track SET occurence=:occurence WHERE idTrackDZ=:idTrackDZ";
			try{ // Go !
				$stmt = $this->pdo->prepare( $query );
				return $stmt->execute( array( 	':occurence' => $this->trackDB->occurence-1,
												':idTrackDZ' => $track->idTrackDZ ) );
			}catch(PDOException $e){
				return DEBUG ? $e->getMessage() : 'Exception';
			}
		}else{
			$query = "DELETE FROM mz_track WHERE idTrackDZ=:idTrackDZ";
			try{
				$stmt = $this->pdo->prepare( $query );
				return $stmt->execute( array(	':idTrackDZ' => $track->idTrackDZ ));
				
			}catch(PDOException $e){
				return DEBUG ? $e->getMessage() : 'Exception';
			}			
		}
	}
	
	/** Lors d'un ajout de favori. Retourne valeur 'vote' si le titre existait. A appeler apres insertTrack ou checkTracks*/
	public function getVote()
	{
		return $this->trackDB ? $this->trackDB->vote : '0' ;
	}

	/** MAJ Track selon l'intention de vote. Retourne 'true' si 1 row affecté */
	public function vote( Track $track, $intention )
	{
		$op="";
		if ( $intention == 'voteUp' )   $op = "+ 1";
		if ( $intention == 'voteDown' ) $op = "- 1";
		$query = "UPDATE mz_track SET vote = vote $op WHERE idTrackDZ = :idTrackDZ";
		try{ // Go !
			$stmt = $this->pdo->prepare( $query );
			$stmt->execute( array( ':idTrackDZ' => $track->idTrackDZ ) );
			return ( $stmt->rowCount() == 1 );
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';
		}
	}
	
	/** GET VOTE TABLE VALUES WITH LIST OF TRACKS - Plus utilisée */
	public function getVotes( $tracks )
	{
		// Préparer la requête
		$query = 'SELECT vote FROM mz_track WHERE idTrackDZ=:idTrackDZ';
		$idTrackDZ = '';
		$stmt = $this->pdo->prepare( $query );
		$stmt->bindParam( ':idTrackDZ', $idTrackDZ, PDO::PARAM_STR );
		// Executing prepared statements in a loop
		try{
			foreach( $tracks as $row) {
				$idTrackDZ = $row['idTrackDZ'];
				$stmt->execute();
				$votes[]=$stmt->fetch(PDO::FETCH_ASSOC);
			}
			return $votes;
	
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';
		}
	}

}
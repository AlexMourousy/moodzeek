<?php
require_once dirname(__FILE__) . '/../domain/Member.class.php' ;

class MemberDAO 
{
	private $pdo;

	function __construct()
	{
		$connect = Connect::getInstance();
		$this->pdo = $connect->pdo;
	}
	
	public function login( Member $member ) // $tags->mood;$tags->activ;
	{
		// Recherche du membre en BD
		$query = "SELECT * FROM mz_member WHERE idMemberDZ = :idMemberDZ";
		try{ 
			$stmt = $this->pdo->prepare( $query );
			$stmt->execute( array( ':idMemberDZ' => $member->idMemberDZ ) );
			//$stmt->setFetchMode( PDO::FETCH_CLASS | PDO::FETCH_PROPS_LATE, 'Member' );
			$memberDB = $stmt->fetchObject('Member');
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';
		}	
		// Membre existant : champ 'connections' à incrémenter et date latest connection
		if( $memberDB )
		{
			$query =  "UPDATE mz_member SET connections=connections+1, latest=NOW()"
					." WHERE idMemberDZ = :idMemberDZ";
			try{
				$stmt = $this->pdo->prepare( $query );
				$stmt->execute( array( ':idMemberDZ' => $member->idMemberDZ ) );
				return true;
			}catch(PDOException $e){
				return DEBUG ? $e->getMessage() : 'Exception';
			}	
		}
		// Nouveau membre		
		else{		
			$memberArray = $member->dismount();
			$columns = implode( ', ', array_keys($memberArray) );
			$placeholders = str_repeat( '?, ', count($memberArray)-1 ) . '?';	
			$query = "INSERT INTO mz_member ($columns) VALUES ($placeholders)";
			try{
				$stmt = $this->pdo->prepare( $query );				
				$i = 1;			
				foreach( $memberArray as $value )
					$stmt->bindValue( $i++, $value, PDO::PARAM_STR );	
				$stmt->execute();
				return true;
			}catch(PDOException $e){
				return DEBUG ? $e->getMessage() : 'Exception';		
			}
		}
	}
	
	/** Incrémente 'tracks' le nombre de titres ajoutés. Retourne 'true' si query OK */
	public function majTracks( Member $member, $op )
	{
		$op = ($op=='++') ? "+ 1" : "- 1";

		$query = "UPDATE mz_member SET tracks = tracks ".$op." WHERE idMemberDZ = :idMemberDZ";
		try{
			$stmt = $this->pdo->prepare( $query );
			return $stmt->execute( array( ':idMemberDZ' => $member->idMemberDZ ) );
			
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';	
		}
	}
	
	/* Incrémente le nombre de votes de Member. Retourne 'true' si 1 row affecté */
	public function majVotes( Member $member )
	{
		$query = "UPDATE mz_member SET votes = votes+1 WHERE idMemberDZ = :idMemberDZ";
		try{
			$stmt = $this->pdo->prepare( $query );
			$stmt->execute( array( ':idMemberDZ' => $member->idMemberDZ ) );
			return ( $stmt->rowCount() == 1 );
			
		}catch(PDOException $e){
			return DEBUG ? $e->getMessage() : 'Exception';		
		}
	}	
	
}

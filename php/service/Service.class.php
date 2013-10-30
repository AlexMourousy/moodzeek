<?php
define('DEBUG', false);
require_once dirname(__FILE__) . '/../dao/MemberDAO.class.php';
require_once dirname(__FILE__) . '/../dao/TrackDAO.class.php' ;
require_once dirname(__FILE__) . '/../dao/TagsDAO.class.php' ;
require_once dirname(__FILE__) . '/../dao/database.php' ;

class Service {

	/**
	 * Insère nouveau Membre. Sinon MAJ nb 'connections'
	 **/	
	public static function login ( Member $member )
	{
		$memberDAO = new MemberDAO();
		return $memberDAO->login( $member );
	}	
	
	/** 
	 * Retourne un tableau d'idTrackDZ selon les tags
	 **/
	public static function getAll( Tags $tags, $voteFilter )
	{
		$trackDAO = new TrackDAO();
		return $trackDAO->getAll( $tags, $voteFilter );
	}
	
	/**
	 * Retourne un tableau d'idTrackDZ selon les tags et le membre
	 **/
	public static function getFav( Member $member, Tags $tags, $voteFilter )
	{
		$tagsDAO = new TagsDAO();
		return $tagsDAO->getFav( $member, $tags, $voteFilter );
	}
	
	/**
	 * Insère Track et Tags. Sinon MAJ
	 **/	
	public static function addFav( Member $member, Track $track, Tags $tags, $ip )
	{
		$trackDAO = new TrackDAO();
		$tagsDAO =  new TagsDAO();
		$memberDAO = new MemberDAO();
		
		if( true === 		($rep['ack'] = $trackDAO->insertTrack( $track )) )
			if( true === 	($rep['ack'] = $tagsDAO->addTags( $member, $track, $tags, $ip )) )
				if( true ===($rep['ack'] = $memberDAO->majTracks( $member, '++' )) )
							 $rep['ack'] = $trackDAO->updateTrack( $track, $tags );
		$rep['vote'] = $trackDAO->getVote();
		return $rep;
	}
	
	/**
	 * Efface Track des favoris (mz_tags) et MAJ titres (mz_tracks)
	 **/
	public static function removeTrack( Member $member, Track $track )
	{
		$trackDAO = new TrackDAO();
		$tagsDAO =  new TagsDAO();
		$memberDAO = new MemberDAO();
	
		if( 				 $ack = $trackDAO->checkTrack( $track ) )
			if( true ===	($ack = $tagsDAO->removeFav( $member, $track )) )
				if( true ===($ack = $memberDAO->majTracks( $member, '--' )) )
							 $ack = $trackDAO->removeOrUpdateTrack( $track );
		return $ack;
	}
	
	/**
	 * MAJ Track selon l'intention de vote, et MAJ nb votes de Member
	 **/	
	public static function vote( Member $member, Track $track, $intention )
	{
		$trackDAO = new TrackDAO();
		$memberDAO = new MemberDAO();		
		return $trackDAO->vote( $track, $intention ) && $memberDAO->majVotes( $member );
	}
}

var DEBUG = false;

//////////////////////// GLOBAL VAR & INIT ////////////////
/////////////// "info" will be shared to controler ////////
var info = {};
function initInfo()
{
	info = 	{
			user : {
				connected : false,
				id : null,
				name : '',
				firstname : '',
				lastname : '',
				email : '',
				birthday : '',
				gender : ''
			},
			track : {
				id : null,
				artist :'',
				album : '',
				title : '',
				artist :'',
				vote : {}
			},
			tags : {
				mood : new Array(),
				activ : new Array()
			},
			vote : {
				filter : '',
				intention : ''
			},
			message : {
				nom : '',
				email : '',
				message : ''
			},
			action : '' // playAll / login / addFav / remove / playFav / contact / message / terms / vote
	};
	
};
initInfo();

// Système de vote
var	vote = {
		res : {},			// valeur du vote en base MZ + offset
		offset  : {},		// valeur votes client
		$render	: '',		// element jQuery
		filtering : false	// fonction de filtrage par vote désactivee
	};

/////////// SERVER CONTROLER for AJAX //////////////
var urlajax = "php/controller.php";

//////////////////////////// DOCUMENT READY ///////////////////////////////

jQuery(document).ready(function($)
{
	var mzPlay=[]; // Contient la liste des titres MZ à jouer
	vote.$render = $('#voteCount');
	// ANALYSE DONNEES FORMULAIRE
	var retrieveForm = function(){
		// ACTIVITES
		info.tags.activ = [];
		$(".activ:checked").each(function() {
			// Inscription en variable globale
			info.tags.activ.push($(this).val());
		});
		// HUMEURS
		info.tags.mood = [];
		$(".mood:checked").each(function() {
			// Inscription en variable globale
			info.tags.mood.push($(this).val());
		});
		if(DEBUG) console.log('TAGS RETRIEVED = '+JSON.stringify(info.tags));
	};
	
	
	//////////////////////////////////////////////////////////////////
	//////////// AJOUT EN FAVORI ( en BD et DZ ) /////////////////////
	//////////////////////////////////////////////////////////////////
	$('#buttonAdd').click(function(e) 
	{
		e.preventDefault();
		witnessingLoader();
		// VERIF TRACK EN LECTURE
		if( info.track.id ){
			// VERIF USER CONNECTED ( via callback sur variable globale )
			getUserStatus( function (){
				if ( info.user.connected ){
					// PATCH verif si statut login a change via pop-up des 30s
					if($loginButton.text()=='Login') patchLogin30s(true);
					// ANALYSE FORMULAIRE : TAGS
					retrieveForm();
					// VERIF NB ACTIV et NB MOOD CHECKED > 0
					if ( info.tags.activ.length && info.tags.mood.length )
					{
						info.action = 'addFav';
						// ENVOI REQUETE SERVEUR
						$.ajax({
							url: urlajax,
							type: "post",
							data: {info : info},
							success: function( data ) { if(DEBUG) console.log( data ); 
								// Retour {ack,vote}
								if( typeof(data)=='object' ) {									
									if( data.ack == true ) witnessing('Track &laquo; '+info.track.title+' &raquo; has been added !');
									else if( data.ack == false ) witnessing('Track &laquo; '+info.track.title+' &raquo; seems to be in your Favorites !');
									vote.res[info.track.id] = parseInt(data.vote) - (vote.offset[info.track.id]||0) ;
									printVote();
								}else witnessing('Oops : Try again later...');
							},
							error: function(jqXHR,textStatus,errorThrown) {console.log("ADD TRACK in DB failed: "+textStatus );
								witnessing('Oops : Try again later...'); console.log(errorThrown);
							}
						});
						// AJOUT SUR LE COMPTE DEEZER DU CLIENT
						DZ.api('/user/me/tracks?track_id='+info.track.id, 'POST', function( response ) {
							if(DEBUG) console.log('[ADD FAVORITE TRACKS in DZ] DZ.api =' + JSON.stringify(response,"",""));
						});
					} else witnessing('Please select at least one Mood AND one Activity for adding');
				} else witnessing('Please Login for adding title !');
			});
		} else witnessing('Please play a track before adding !');
	});
	
	//////////////////////////////////////////////////////////////////
	//////////// EFFACER DES FAVORIS ( en BD et DZ ) /////////////////
	//////////////////////////////////////////////////////////////////
	$('#buttonRem').click(function(e) 
	{
		e.preventDefault();
		witnessingLoader();
		// VERIF TRACK EN LECTURE
		if( info.track.id ){
			// VERIF USER CONNECTED ( via callback sur variable globale )
			getUserStatus( function (){
				if ( info.user.connected ){
					// PATCH verif si statut login a change via pop-up des 30s
					if($loginButton.text()=='Login') patchLogin30s(true);

					info.action = 'remove';
					// ENVOI REQUETE SERVEUR
					$.ajax({
						url: urlajax,
						type: "post",
						data: {info : info},
						success: function( data ) { if(DEBUG) console.log( data ); 
							// ATTENTE DE TRUE
							if( data == true ) witnessing('Track &laquo; '+info.track.title+' &raquo; has been removed from your Favorites !');
							else if( data == false ) witnessing('Track &laquo; '+info.track.title+' &raquo; is not in your Favorites !');
							else witnessing('Oops : Try again later...');
						},
						error: function(jqXHR,textStatus,errorThrown) {console.log("ADD TRACK in DB failed: "+textStatus );
							witnessing('Oops : Try again later...'); console.log(errorThrown);
						}
					});
					// RETIRER DU COMPTE DEEZER DU CLIENT
					DZ.api('/user/me/tracks?track_id='+info.track.id, 'DELETE', function( response ) {
						if(DEBUG) console.log('[REMOVE FAVORITE TRACKS in DZ] DZ.api =' + JSON.stringify(response,"",""));
					});
				} else witnessing('Please login for removing title from your Favorites !');
			});
		} else witnessing('Please play a track before removing !');
	});

	//////////////////////////////////////////////////////////////////
	///////////// /////// PLAY FROM COMMUNITY /////  /////////////////
	//////////////////////////////////////////////////////////////////
	$('#buttonList').click(function(e) 
	{
		e.preventDefault();
		witnessingLoader();
		// ANALYSE FORMULAIRE : tags
		retrieveForm();
		// STATUT CONNEXION - NON BLOQUANT
		getUserStatus( function (){
			if ( ! info.user.connected ) witnessing(' You\'d better log in ! ');
			// PATCH verif si statut login a change via pop-up des 30s
			else if($loginButton.text()=='Login') patchLogin30s(false);
			
			info.action = 'playAll';
			// ENVOI REQUETE SERVEUR
			$.ajax({
				url: urlajax,
				type: "post",
				data: {info : info},
				success: function( data ) { if(DEBUG) console.log( data );
					// ATTENTE 'object'
					if( typeof(data)=='object' ) {
						if(data.length){
							mzPlay=[], vote.res={};
							$.each( data, function( i, row ){
								mzPlay[i] = row['idTrackDZ'];
								vote.res[row['idTrackDZ']] = row['vote'] - (vote.offset[row['idTrackDZ']]||0);
							});
							// ENVOI TRACKLIST A DEEZER
							DZ.player.playTracks( mzPlay , 0, function(){
								// INTERACTION CLIENT
								witnessingForm(); 
								setTimeout( function(){ addWitnessingTxt(' from Community'); } , 1000 );
							});
						}else{
							witnessingForm();
							setTimeout( function(){ addWitnessingTxt('  ->  empty list from Community'); } , 1000 );
						}
					}else witnessing('Oops : Try again later...');
				},
				error: function(jqXHR,textStatus,errorThrown) { console.log("Request 'GENERATION DE PLAYLIST' failed:"+textStatus);
					witnessing('Oops : Try again later...'); console.log(errorThrown);
				}
			});
		});
	});

	//////////////////////////////////////////////////////////////////
	/////////////////// PLAY FROM FAVORITES //////////////////////////
	//////////////////////////////////////////////////////////////////
	$('#buttonFav').click(function(e) 
	{
		e.preventDefault();
		witnessingLoader();
		// IS USER CONNECTED ( via callback sur variable globale )
		getUserStatus( function (){
			if( info.user.connected )
			{
				// PATCH verif si statut login a change via pop-up des 30s
				if( $loginButton.text()=='Login' ) patchLogin30s(false);
				// ANALYSE FORMULAIRE : tags
				retrieveForm();
				
				info.action = 'playFav';
				// ENVOI REQUETE SERVEUR
				$.ajax({
					url: urlajax,
					type: "post",
					data: {info : info},
					success: function( data ) { if(DEBUG) console.log( data );
						// ATTENTE 'object'
						if( typeof(data)=='object' ) {
							if(data.length){
								mzPlay=[], vote.res={};
								$.each( data, function( i, row ){
									mzPlay[i] = row['idTrackDZ'];
									vote.res[row['idTrackDZ']] = row['vote'] - (vote.offset[row['idTrackDZ']]||0);
								});
								// ENVOI TRACKLIST A DEEZER
								DZ.player.playTracks( mzPlay , 0, function(){
									// INTERACTION CLIENT
									witnessingForm();
									setTimeout( function(){ addWitnessingTxt(' from your Favorites'); } , 1000 );
								});
							}else{
								witnessingForm();
								setTimeout( function(){ addWitnessingTxt('  ->  empty list from your Favorites'); } , 1000 );
							}
						}else witnessing('Oops : Try again later...');
					},
					error: function(jqXHR,textStatus,errorThrown){console.log("Request 'JOUER FAVORIS' failed: " + textStatus );
						witnessing('Oops : Try again later...'); console.log(errorThrown);
					}	
				});
			} else witnessing('Please Login before playing favorites !');
		});
	});
	
	//////////////////////////////////////////////////////////////////
	/////////////////////          VOTE          /////////////////////
	//////////////////////////////////////////////////////////////////
	$('#buttonTable #voteCell div a').click(function(e) 
	{
		e.preventDefault();
		var id = $(this).attr('id');
		
		// VOTING
		if( id == 'voteUp' || id == 'voteDown' )
		{
			witnessingLoader();		
			info.vote.intention = id;
			
			// VERIF TRACK EN LECTURE
			if( info.track.id && vote.res[info.track.id]!=undefined ){
				// VERIF USER CONNECTED ( via callback sur variable globale )
				getUserStatus( function (){
					if( info.user.connected ){
						// PATCH verif si statut login a change via pop-up des 30s
						if( $loginButton.text()=='Login' ) patchLogin30s(true);
						// ANALYSE INTENTION				
						var operation = (info.vote.intention == 'voteUp') ? 1 : -1;
						var offset = operation + (vote.offset[info.track.id] || 0);
						// VERIFICATION CONTRE VOTE COMPULSIF
						if ( Math.abs( offset ) <= 3 )
						{
							info.action = 'vote';
							// ENVOI REQUETE SERVEUR
							$.ajax({
								url: urlajax,
								type: "post",
								data: {info : info},
								success: function( data ) { if(DEBUG) console.log( data ); 
									// ATTENTE DE 'TRUE'
									if( data == true ){
										vote.offset[ info.track.id ] = offset; // parseInt OFF
										vote.$render.text( vote.res[info.track.id] + offset );
										witnessing('Thank you for voting for &laquo; '+info.track.title+' &raquo; !');									
									}
									else if( data == false ) witnessing('Track &laquo; '+info.track.title+' &raquo; is not in our database ');
									else witnessing('Oops : Try again later...'); 
								},
								error: function(jqXHR,textStatus,errorThrown) {console.log("ADD TRACK in DB failed: "+textStatus );
									witnessing('Oops : Try again later...'); console.log(errorThrown);
								}
							});
						} else witnessing('You already voted for &laquo; '+info.track.title+' &raquo; !' );
					} else witnessing('Please Login before voting for a track !');
				});
			} else witnessing('Play from Community or Favorites before Voting - Or add Track');	
		}
		// FILTERING
		else if( id == 'filterUp' || id == 'filterDown' )
		{
			info.vote.filter += (id == 'filterUp') ? 1 : -1;
			vote.$render.text( info.vote.filter );
		}
	});
	
	///////////////////////////////////////////////////////
	//////// AFFICHAGE PLAYLISTS DEEZER DANS QTIP /////////
	///////////////////////////////////////////////////////
	$('#buttonRetr').click( function(e)
	{
		e.preventDefault();
		witnessingLoader();
		// IS USER CONNECTED ( via callback sur variable globale )
		getUserStatus( function (){
			if ( info.user.connected )
			{
				// PATCH verif si statut login a change via pop-up des 30s
				if($loginButton.text()=='Login') patchLogin30s(false);

				$('<div />').qtip(
				{
					//overwrite: false,
					content: { text: 'Loading your deezer playlists...'},
					position: { my: 'center', at: 'center', target: $(window)},
					show: {
						ready: true,
						solo:  true,
						effect: function() { $(this).fadeTo(700, 1); },
						modal: { on: true , blur: true }
					},
					hide: {
						effect: true,
						event: 'unfocus',
						effect : function(offset) { $(this).fadeTo(1000,0.1); }
					},
					style: { classes: 'MZ-no-width MZ-qtip-dark qtip-rounded MZ-qtip-shadow' },
					events: {
						show : function(event, api) {
							// RECUPERATION DES PLAYLISTS DEEZER
							DZ.api( 'user/me/playlists', function( response ){
								if( response.total>0 ){
									var html= 
										"<div id='userPlaylist'>"+
										"<img src='./img/deezer_v0.jpg'/>";
									// RECUPERATION DE LA LISTE DES TRACK IDs
									$.each( response.data, function( i, data ){ //console.log(JSON.stringify(data));
										html+="<a href='#' playlistID='"+data.id+"'>"+ data.title +"</a>";
									});
									html+="</div>";
									api.set('content.text', html);
									witnessing(' ');
									$('#userPlaylist a').click(function(ev){
										ev.preventDefault();
										witnessingLoader();
										var listTitle = $(this).text();
										DZ.player.playPlaylist( parseInt($(this).attr('playlistID')), function(){
											witnessing('Playing from your Deezer Playlists : "'+listTitle+'"');
										});
										api.hide(event);										
									});
								}		
							});
						},
						hide: function(event, api) { api.destroy(); }
					}
				});
			} else witnessing('Please Login before retrieving your Deezer playlists !');
		});
	});	
	
	///////////////////////////////////////////////////////
	//////////// RECHERCHE DE TITRES SUR DZ ///////////////
	///////////////////////////////////////////////////////
	$('#goSearch').click( function(e) 
	{
		e.preventDefault();
		witnessingLoader();
		
		var tracklist = [], $inputSearch = $('#inputSearch');
		// GET QUESTION
		var question = $inputSearch.val();
		if( checkQuestion( question ) )
		{
			// USER CONNECTED ? ( via callback sur variable globale )
			getUserStatus( function (){
				if ( ! info.user.connected ) witnessing(' You\'d better log in ! ');
				// PATCH verif si statut login a change via pop-up des 30s
				else if($loginButton.text()=='Login') patchLogin30s(false);
			});

			// SOUMISSION DE LA QUESTION A DEEZER
			DZ.api( 'search?q='+question, function( response ){

				if( response.total > 0 ){
					// BLUR
					if( $inputSearch.is(":focus")) $inputSearch.blur();
					// RECUPERATION DE LA LISTE DES TRACK IDs
					$.each( response.data, function( i, data ){
						tracklist.push( data.id );
					});
					// ENVOI LISTE POUR ETRE CHARGEE DANS LE PLAYER
					DZ.player.playTracks( tracklist , 0, function( response ){
						if(DEBUG) console.log('DZ.player.playTracks : '+JSON.stringify(response));
						//DZ.player.pause();
						witnessing('Playing tracks from your research &laquo; '+question+' &raquo;');
					});
				}else witnessing('Sorry ... Research negative in Deezer database for &laquo; '+question+' &raquo;');
			});
		}
	});			


});
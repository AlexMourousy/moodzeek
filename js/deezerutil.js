var getUserStatus,
	getUserInfo,
	sendUserLoginToServer,
	patchLogin30s,
	failTimerDisp=null;


//////////////////////////////////////////////////////////////////////////////
///// CALLBACK CHARGEMENT DU PLAYER ( deezerinit.js ) [après document.ready]//
//////////////////////////////////////////////////////////////////////////////
function onPlayerLoaded ( param, status ) 
{
	if( status == "player_loaded" )
	{
		clearTimeout( loadTimer );
		if( failTimerDisp ) clearTimeout( failTimerDisp );
		witnessing( 'Ready to play !' );
		showPlayer();

		///////// GET CURRENT TRACK INFO /////
		DZ.Event.subscribe('current_track', function(rep, evt_name){
			info.track.id = rep.track.id;
			info.track.artist = rep.track.artist.name;
			info.track.album = rep.track.album.title;
			info.track.title = rep.track.title;
			printVote();
			if(DEBUG) console.log( 'Current track ID : '+ rep.track.id +' / Title : '+rep.track.title );
		});
		
		// ERGONOMIE CLAVIER <-> PLAYER
		var play=false;
		DZ.Event.subscribe('player_play', function(evt_name){ play = true; });
		DZ.Event.subscribe('player_paused', function(evt_name){ play = false; });			
		$(document).keydown(function (e) {
			if( ! $(document.activeElement).is(":input,[contenteditable]") ){
				if ( ( e.which == 32 || e.which == 13 ) ) { e.preventDefault();
					play ? DZ.player.pause() : DZ.player.play();
				}
				else if ( ( e.which == 39 || e.which == 40 ) ) { e.preventDefault();
					DZ.player.next();
				}
				else if ( ( e.which == 37 || e.which == 38 ) ) { e.preventDefault();
					DZ.player.prev();
				}
			}
		});		
		
		// OBTENIR LES INFORMATIONS DU CLIENT : S'IL EST RESTE CONNECTE
		getUserStatus( function(){
			getUserInfo( function(ok){
				if(ok) witnessingWelcome();
				// ENVOI AU SERVEUR
				if(info.user.connected) sendUserLoginToServer();
				// affichage
				showLoginButton();
				// BOUTON LOGIN DYNAMIQUE -> chgt en logout si client connecté
				if( info.user.connected ) changeLoginButton();
			});
		});
		
		// Animation : définie dans animation.js
		formOpacity();
		footerOpacity();
	}
	else // LOAD FAILED
	{
		if(DEBUG) console.log("Failed loading Deezer Player ; status = " + status);
		clearTimeout( loadTimer );
		footerOpacity();
		witnessing("... Deezer Player couldn't be loaded ...");
		failTimerDisp = setTimeout( function(){	addWitnessingTxt(
			"<p style='font-weight:lighter;'>Are your browser and plugins (Flash) up to date ?<br/>"+
			"Check your network connection, or try changing zoom resolution, or contact us</p>");
		},2500);
		//throw "stop execution : loading player time passed";
	}
};

//////////////////////////////////////////////////////////////////////////////
jQuery(document).ready(function($)
{
		
	//////////////////////////////////////////////////////////////////////////////
	///////// GET USER STATUS et ID - avec callback pour réponse asynchrone //////
	//////////////////////////////////////////////////////////////////////////////
	getUserStatus = function( callback )
	{
		// Réinit variable globale
		info.user.connected = false;
		// Requète Deezer
		DZ.getLoginStatus( function( response ) {
			if(DEBUG) console.log('[getUserStatus()] DZ.getLoginStatus = \n' + JSON.stringify(response,"",""));
			if( response.status == "connected" ){
				info.user.connected = true;
				info.user.id = response.userID;
			}
			callback(); // ( Si absence de réponse : non géré )
		});
	};

	//////////////////////////////////////////////////////////////////////////////
	///////// GET USER INFO - avec callback pour réponse asynchrone         //////
	//////////////////////////////////////////////////////////////////////////////
	getUserInfo = function( callback )
	{
		var ok = false;
		DZ.api('/user/me', function( response ) {
			if(DEBUG) console.log('[getUserInfo()] DZ.api user/me =' + JSON.stringify(response,"",""));
			// Set variable globale
			if( response.error == undefined )
			{
				info.user.id =		response.id;
				info.user.name =	response.name;
				info.user.firstname=response.firstname;
				info.user.lastname= response.lastname;
				info.user.email = 	response.email;
				info.user.birthday= response.birthday;
				info.user.gender = 	response.gender;
				ok = true;
			}
			callback( ok );
		});	
	};
	
	/////////////////////////////////////////////////////////////////////////////////////
	///////// AJAX USER INFO TO SURPRISEMUSIC AT LOGIN ( and id only at player loaded )//
	/////////////////////////////////////////////////////////////////////////////////////
	sendUserLoginToServer = function()
	{
		info.action = 'login';
		// ENVOI INFOS USER A LA CONNEXION
		$.ajax({
			url: urlajax,
			type: "post",
			data: {info : info},
			success: function( data ) { if(DEBUG) console.log( 'RETOUR ACTION LOGIN DU SERVEUR = '+ data );
				// ATTENTE DE 'TRUE'
				if( ! data ) witnessing('Oops : Server error while login ... Try again later !');
			},
			error: function(jqXHR,textStatus,errorThrown) { if(DEBUG) console.log("AJAX LOGIN failed: "+textStatus );
				witnessing('Oops : Server error while login ... Try again later !');
			}
		});
	};

	
	////////////    PATCH verif si statut login a change via pop-up des 30s   //////////
	patchLogin30s = function()
	{
		getUserInfo(function(value){ 
			if (value){ 
				changeLoginButton();
				sendUserLoginToServer();
			} 
		});
	};

});


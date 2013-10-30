
var loadTimer;

jQuery(document).ready(function($)
{
	// Detection PROBLEME reseau ou navigateur : 
	// SI EVENNEMENT "onload" n'est pas appele dans dzAsyncInit
	loadTimer = setTimeout( function(){onPlayerLoaded(undefined,false);} , 8000 );
	
	//////////////////////////////////////////////////////////////////////////////
	//////////////////// DZ APP & PLAYER INITIALISATION //////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	window.dzAsyncInit = function() {
		DZ.init({
			appId : '125385',
			channelUrl : 'http://'+$(location).attr('hostname')+$(location).attr('pathname')+'deezer/channel.php',
			player : {
				container :	'player',
				cover : 	true,
				playlist : 	true,
				width :  	200,
				height : 	600,
				format : 	'vertical',
				onload : 	onPlayerLoaded //defined in deezerutil.js (2 args:[object,string])
			}
		});
	};
	//////////////////////////////////////////////////////////////////////////////
	//////////////////////////// LOAD JS SDK /////////////////////////////////////
	//////////////////////////////////////////////////////////////////////////////
	(function() {
		var e = document.createElement('script');
		e.src = 'http://cdn-files.deezer.com/js/min/dz.js';
		e.async = true;
		document.getElementById('dz-root').appendChild(e);
	}());

});

//////////////////////////////////////////////////////////////////////////////
////////////////////// LOGIN & LOGOUT FUNCTIONS  /////////////////////////////
//////////////////////////////////////////////////////////////////////////////
var login, loginStatus, logout;

jQuery(window).load(function($){

	////////////////////////////// ON CLICK LOGIN ////////////////////////////
	login = function()
	{
		DZ.login( function( response ) {
			// AUTORISE ET CONNECTE ?
			if( response.authResponse ) {
				info.user.connected = true;
				witnessingLoader();//witnessing( 'Welcome! Fetching your information.... ');
				// GET USER INFORMATIONS
				getUserInfo( function(value){
					if (value){
						// BOUTON LOGIN DYNAMIQUE et PSEUDO
						changeLoginButton();
						// DIRE BONJOUR
						witnessingWelcome();
						// ENVOI INFO AU SERVEUR
						sendUserLoginToServer();
					}
				});
			}
			else witnessing('You cancelled login or did not fully authorize.');

		}, {perms: 'email,manage_library,delete_library,listening_history'});
	};


	////////////////////////////// ON CLICK LOGOUT ////////////////////////////
	logout = function()
	{
		witnessing('Hope to see you soon !');
		DZ.player.pause();
		DZ.logout();
		initInfo();
		// BOUTON LOGIN DYNAMIQUE
		changeLoginButton();
	};
	
		
});
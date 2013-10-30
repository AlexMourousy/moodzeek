var $loginButton, changeLoginButton, showLoginButton;
var witnessing, addWitnessing, addWitnessingTxt, witnessingLoader;
var witnessingWelcome, checkQuestion, witnessingForm;
var formOpacity, footerOpacity, showPlayer;
var initVote;


// OVERLAY DISAPEARS ON PAGE LOADED
$(window).load(function() {
	$('#hideAll').fadeOut(function(){$(this).css('display','none');});
});

jQuery(document).ready(function($)
{
	var $window = $(window);
	
 	// MODAL QTIP WELCOME	
	$('<div />').qtip({
		content: { text:  $('#welcomeTipHtml').html() },
		position: { my: 'center', at: 'center', target: $window  },
		show: {
			ready: true,
			solo: true,
			delay: 500,
			effect: function() { $(this).fadeTo(700, 1); },
			modal: { on: true , blur: true }
		},
		hide: {
			effect: true,
			event: 'unfocus', inactive: 3000,
			effect : function(offset) { $(this).fadeTo(1000,0.1); }
		},
		style: { classes: 'MZ-no-width MZ-qtip-welcome qtip-rounded MZ-qtip-shadow' },
		events: { hide: function(event, api){ api.destroy(); } }
	});

	// VERTICAL ALIGN ON DOCCUMENT
 	var	$container = $('body');
	$window.resize(function(){
		$container.css('margin-top',
			Math.max(($window.height() / 2) - ($container.height() / 2), 0)
		);
	}).resize();

	// ACCUEIL PLAYER OPACITY
	var $player = $('#player');
	$player.css('opacity',0.5);
	showPlayer = function(){
		$player.animate({opacity: 0.8}, 900);
	};	
	
	// DIRECTIONS TOOLTIP
	$('#logo, #teaser').click(function(e){ 
		e.preventDefault();
		
		$(this).qtip({
		
			overwrite: false,
			content: { text: $('#teaserTipHtml').html() },
			position: { my: 'top left', at : 'bottom center', viewport: $window },
			show: {
				ready: true,
				solo: true,
				effect: function() { $(this).fadeTo(700, 1); },
				modal: { on: true , blur: true }
			},
			hide: {
				effect: true,
				event: 'unfocus',
				effect : function(offset) { $(this).fadeTo(1000,0.1); }
			},
			style: { 	
				classes: 'MZ-no-width MZ-qtip-dark qtip-rounded MZ-qtip-shadow',
				tip: { width:  25, height: 25 }
			},
			events: { 
				show :  function(event, api) { setTimeout( function(){ /* CSS Hack for FF Bug */
							$('.qtip-content').css('word-wrap','normal');}, 10);/*'break-word'*/
						},
				hide: function(event, api) { api.destroy(); }  }
		});
	});	

	// TAGS TOOLTIPS ( Text in title attribute )
	$('#moodTable tr td, #activTable tr td').qtip( 
	{
		position: { target: 'mouse', my: 'left bottom', adjust: { x: 10, y: -15 }, viewport: $window },
		show: { solo: true, delay: 100, effect: function() { $(this).fadeTo(600, 0.8); } },
		hide: { event: 'click mouseleave', inactive: 1200 },
		style: { 
			classes: 'MZ-qtip-dashboard qtip-rounded qtip-shadow',
			tip: { width:  10, height: 15 }
		}
	});	
	// 'SELECT ALL' TOOLTIPS and LOGIN
	$('#moodSelect, #activSelect ,#loginButton').qtip(
	{
		position: { target: 'mouse', my: 'left center', adjust: { x: 20, y: 0 }, viewport: $window },
		show: { solo: true, delay: 100, effect: function() { $(this).fadeTo(600, 0.7); } },
		hide: { event: 'click mouseleave', inactive: 1200 },	
		style: {
			classes: 'MZ-qtip-dashboard qtip-rounded qtip-shadow',
			tip: { width:  12, height: 30 }
		}
	});
	// BUTTON TOOLTIPS ( Text in title attribute )
	$('#buttonTable a.buttonRect, #buttonTable a.buttonRound').qtip( 
	{
		position: { target: 'mouse', my: 'bottom left', adjust: { x: 10, y: -15 }, viewport: $window },
		show: { solo: true, delay: 100, effect: function() { $(this).fadeTo(600, 0.8); } },
		hide: { event: 'click mouseleave', inactive: 1200 },
		style: { 
			classes: 'MZ-no-width MZ-qtip-dashboard qtip-rounded qtip-shadow',
			tip: { width:  10, height: 15 }
		}
	});

	// DEEZER LOGO TOOLTIP ON PSEUDO
	$('#pseudo a').qtip( 
	{
		content: { text: "<img src='./img/deezer_v0.jpg'/>" },
		position: {
			target: 'mouse', adjust: { x: 35, y: 8 }, viewport: $window,
			my: 'top right', at : 'bottom left'
		},
		show: { solo: true, delay: 200, effect: function() { $(this).fadeTo(600, 1); } },
		hide: { event: 'click mouseleave' },
		style: { 
			classes: 'qtip-tipsy qtip-rounded qtip-shadow',
			tip: { width:  15, height: 15 }
		}
	});
	// EMAIL TOOLTIP
	$('#footer #contact_us').qtip( 
	{
		content: { text: "<img src='./img/webmaster_v1.0.gif' style='width:160px'/>"
		},
		position: {
			target: $('#footer #contact_us'), viewport: $window, //adjust: { x: 35, y: 8 },
			my: 'bottom center', at : 'top center'
		},
		show: { solo: true, delay: 200, effect: function() { $(this).fadeTo(600, 1); } },
		hide: { fixed: true, event: 'click mouseleave' },
		style: { 
			classes: 'qtip-tipsy qtip-rounded MZ-qtip-shadow',
			tip: { width:  15, height: 15 }
		}
	});
	// 'TERMS OF SERVICE' TOOLTIP
	$('#termsLink').click(function(e){

		e.preventDefault();
		$(this).qtip({
		
			overwrite: false,
			content: { text: 'Loading terms of service ...' },
			position: { my: 'bottom left', at: 'top left', viewport: $window, adjust: { y: 8 } },
			show: {
				ready: true,
				solo: true,
				effect: function() { $(this).fadeTo(700, 1); },
				modal: { on: true , blur: true }
			},
			hide: {
				effect: true,
				event: 'unfocus',
				effect : function(offset) { $(this).fadeTo(1000,0.1); }
			},
			style: { 	
				classes: 'MZ-qtip-dark MZ-qtip-rounded MZ-qtip-shadow',
				tip: { width:  25, height: 25 }
			},
			events: {
				show : function(event, api) {
					if (!api.cache.ajaxed) {
						info.action = 'terms';
						$.ajax({
							url: urlajax,
							type: 'post',
							data: {info : info},
							success: function(data) { 
								api.set('content.text', data);						
							}
						});
						api.cache.ajaxed = true;
					}
				},
				hide: function(event, api) { api.destroy(); }
			}
		});
	});	
	
	
	
	// GESTION BOUTON LOGIN/LOGOUT
	$loginButton = $('#loginButton');
	var $pseudo = $('#pseudo a');
	//BOUTON CACHE
	$loginButton.css('opacity',0.2);
	//AFFICHAGE qd player charge
	showLoginButton = function(){
		$loginButton.animate({opacity: 0.8}, 900);
	};
	// AFFICHAGE LOGIN/LOGOUT DYNAMIQUE - init : login()
	changeLoginButton = function()
	{
		if( $loginButton.text()=='Login' ){
			$loginButton.attr('onclick','logout(); return false;')
				.fadeOut( function(){ $(this).text('Logout').fadeIn(); });
			$pseudo.text( info.user.name ).fadeIn();
		}
		else if( $loginButton.text()=='Logout' ){
			$loginButton.attr('onclick','login(); return false;')
				.fadeOut(function(){ $(this).text('Login').fadeIn(); });
			$pseudo.hide().text('');
		}
	};


	
	// INIT PLUGIN CHECKBOXES - need screwdefaultbuttonsV2
	$('input:checkbox').screwDefaultButtons({ 
		image: "url(./checkbox/images/radioSmall_v703b.png)",
		width:	 43,
		height:	 43
	});	
	// SELECT, DESELECT ALL CHECKBOXES
	var moodChecked='uncheck', activChecked='uncheck',
		$mood = $('.mood'), $activ = $('.activ');
	$('#moodSelect').click(function(e) {
		e.preventDefault();
		moodChecked = (moodChecked=='check') ? 'uncheck' : 'check';
		$mood.screwDefaultButtons( moodChecked );
	});	
	$('#activSelect').click(function(e) {
		e.preventDefault();
		activChecked = (activChecked=='check') ? 'uncheck' : 'check';
		$activ.screwDefaultButtons( activChecked );
	});	
	
	
	
	// ANIMATION << BLUR FOCUS >> SUR INPUT RESEARCH
    var $inputSearch = $('#inputSearch');
	var inputSearchInit = $inputSearch.val();
	$inputSearch
		.blur( function(){
			$(this).removeClass("focus");//.val('Track Search');	
		})
		.focus( function() {
			$(this).addClass("focus");
			
			if( $inputSearch.val() == inputSearchInit ) $(this).val('');
		});
	// EVENEMENT TOUCHE ENTREE SUR INPUT SEARCH
	$inputSearch.keydown( function(event) {
		if (event.which == 13) {
			event.preventDefault();
			$('#goSearch').trigger('click');
		}
	});
	// VERIFICATION INPUT RESEARCH
	checkQuestion = function( question ){
		if( question == 'Track Search' || question == '' ){
			witnessing('Please retype your track research !');
			$inputSearch.focus();
			$inputSearch.addClass("focus").val('');
			return false;
		} else {
			return true;
		}
	};

	//////////////////////////////////////////////////////////
	//////////       WITNESSING CLIENT INFO          /////////
	//////////////////////////////////////////////////////////
	
	
	
	// AFFICHAGE BALISE TEMOIN
	var $witness = $('#witness');
	witnessing = function( text ) {
		$witness.fadeOut(function(){
			$(this).html('').append('<p>'+text+'</p>').fadeIn();
		});
	};
	// AJOUTER BALISE TEMOIN
	addWitnessing = function( addtext ){
		$witness.append('').hide().append('<p>'+addtext+'</p>').fadeIn();
		
	};
	// COMPLETER BALISE TEMOIN
	addWitnessingTxt = function( addtext ){
		$witness.find('p').append( addtext ).fadeIn();
	};	
	
	// BONJOUR AVEC PSEUDO ( appel login ou player charg� )
	witnessingWelcome = function(){
		witnessing( 'Good to see you, ' + info.user.name + ' !');
	};
	// WITNESSING LOADER
	witnessingLoader = function(){ // opacity definie dans styles !
		witnessing("<img id='loader' src='img/heart-loader.v1.gif'/>");
	};		

	// INTERACTION AVEC CLIENT EN CAS DE NON SELECTION de FORMULAIRE pour lecture de playlist
	witnessingForm = function(){
		if( ! info.tags.mood.length ) {
			witnessing('No filter on Mood ');
			if( ! info.tags.activ.length ) witnessing('All Moods and Activities');
		}else if( ! info.tags.activ.length ) witnessing('No filter on Activity');
		else witnessing('Filter set on Mood and on Activity');
	};

	//////////////////////////////////////////////////////////////
	////////////          VOTE UTILITIES              ////////////     
	//////////////////////////////////////////////////////////////

//	VOTE TOOLTIPS 
	$('#buttonTable #voteCell div a').each( function(){
		$(this).qtip(
		{
			overwrite : false, // tooltip won't be overridden once created
			content: { text: $(this).html()	},
			position: { target: 'mouse', my: 'left center', adjust: { x: 20, y: 0 } },
			show: { solo: true, effect: function() { $(this).fadeTo(500, 0.8); } },
			hide: { event: 'click mouseleave', inactive: 1500 },
			style: { 
				classes: 'MZ-qtip-dashboard qtip-rounded qtip-shadow',
				tip: { width:  12, height: 30 }
			}
		});
	});
	// RESULT AND TOGGLE TOOLTIP
	$('#buttonTable #voteCell div span').qtip(
	{
		position: { target: 'mouse', my: 'left center', adjust: { x: 20, y: 0 } },
		show: {	solo: true,	effect: function() { $(this).fadeTo(500, 0.9); } },
		hide: { event: 'mouseleave', inactive: 2000 },	
		style: {
			classes: 'MZ-qtip-dashboard qtip-rounded qtip-shadow', //qtip-tipsy
			tip: { width:  12, height: 30 }
		}
	});		
	// Affichage Resultat vote client
	printVote = function()
	{
		// Affichage valeur 'vote' si vote actif
		if( !vote.filtering ){			
			if( vote.res[info.track.id] != undefined ){
				vote.$render.text( 'Vote' );
				setTimeout( function(){ 
					vote.$render.text( parseInt(vote.res[info.track.id]) + parseInt(vote.offset[info.track.id]||0) );
				}, 1000 );
			}else vote.$render.text( '( Vote )' );
		}
	}

	// Toggle VOTE / FILTRE
	var timerFilter, 
		lastFilter=0;
	vote.$render.click( function(e)
	{
		e.preventDefault();
		
		// SET TO FILTERING
		if( vote.filtering = !vote.filtering ){
			witnessing('Vote Filtering Activated ! Influences playlist generation');
			// IDs & qTip handling
			$('#buttonTable #voteCell div span').qtip('option', 'content.text', "&nbsp;<br>Switch to Vote<br>&nbsp;" ).qtip('show');
			$('#buttonTable #voteUp').attr( 'id', 'filterUp' ).html( 'Increase Filtering' );
			$('#buttonTable #voteDown').attr( 'id', 'filterDown' ).html( 'Decrease Filtering' );
			// Activate filter and set oldvalue or zero
			info.vote.filter = lastFilter ; 
			// Render filter state
			vote.$render.text( 'Filter' );
			timerFilter = setTimeout( function(){ vote.$render.text( info.vote.filter );} , 1000 );
		
		// SET TO VOTING
		}else{
			witnessing('Ready to Vote - Filtering Deactivated');
			clearTimeout( timerFilter );
			// IDs & qTip handling
			$('#buttonTable #voteCell div span').qtip('option', 'content.text', "&nbsp;<br>Switch to Filter<br>&nbsp;" ).qtip('show');
			$('#buttonTable #filterUp').attr( 'id','voteUp' ).html( 'Vote Up !' );
			$('#buttonTable #filterDown').attr( 'id','voteDown' ).html( 'Vote Down' );
			// Deactivate filter and save oldvalue
			lastFilter = info.vote.filter;
			info.vote.filter = '' ; // Deactivate
			// Render Vote state
			printVote();
		}
		
		// RESET QTIP UP DOWN TEXT
		$('#buttonTable #voteCell div a').each( function(){
			$(this).qtip('option', 'content.text', $(this).html() );
		});
		
		
	});
	
	//////////////////////////////////////////////////////////
	///////////////        OPACITY START        //////////////
	//////////////////////////////////////////////////////////
	
	
	// EFFET D'OPACITY SUR FORMULAIRE ET FOOTER AU CHARGEMENT DU PLAYER
	$('#moodTable, #activTable, #footer').css({ opacity: 0.2 });
	// Appel de cette fonction une fois le player charge
	formOpacity = function(){
		$('#moodTable, #activTable').animate({opacity: 1}, 1500);
	};	
	footerOpacity = function(){
		$('#footer').animate({opacity: 0.6}, 1500);		
	};
	
	// START WITNESSING LOADER
	witnessingLoader();
	
});
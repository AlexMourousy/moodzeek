v0
	CONFIG
	php extension : openssl ON

	Comprendre OAuth 2.0 - côté serveur (php) ou client (js) ?

	Error: Token Invalid, Need to Ping !
	OK : PB de cookie tiers à activer

	
	
	
v1
	Mise en place scripts.js et imports
	Bouton image de test jQuery Ajax vers 'process.php'

	
	
	
v2
	
	Amélioration formulaire
	
	Réflexion sur une variable globale objet
	
	Etablissement dialogue JS/AJAX/PHP avec les bons formats d'échanges
	
	/////////////////////////////////////////////////////////////////////////////
	Validation de formulaire multiple
		AJOUT TITRE
		GENERATION PLAYLIST
	
	/////////////////////////////////////////////////////////////////////////////
	// EVENT CURRENT TRACK
	current_track : Indicates that the current track has changed in the player and return an object
	{
		index : 0,
		track : {
			album : {...},
			artist : {...},
			duration : 123,
			id : 2322,
			title : "track title",
		}
	}
	///// USE /////
	DZ.Event.subscribe('current_track', function(track, evt_name){
	console.log("current track object", track);
	});						
	*/	
	
	/////////////////////////////////////////////////////////////////////////////
	SEARCH DEEZER

	REQUETE : http://api.deezer.com/2.0/search?q=eminem	
	-> REPONSE :
	{
	  "data": [
		{
		  "id": "1109731",
		  "readable": true,
		  "title": "Lose Yourself",
		  "link": "http://www.deezer.com/track/1109731",
		  "duration": "326",
		  "rank": "960854",
		  "preview": "http://cdn-preview-d.deezer.com/stream/dffe27d65abf0236b1a3259e63bc494e-0.mp3",
		  "artist": {
			"id": "13",
			"name": "Eminem",
			"link": "http://www.deezer.com/artist/13",
			"picture": "http://api.deezer.com/2.0/artist/13/image"
		  },
		  "album": {
			"id": "119606",
			"title": "Curtain Call",
			"cover": "http://api.deezer.com/2.0/album/119606/image"
		  },
		  "type": "track"
		},
		{
			...
		}
	}
	-> Pour avoir tous les tracks.id :
		DZ.api('search?q=eminem', function(response){
		console.log(response.data[0 à 50].id);
		});
	
	Mettre les id dans player.track
	Puis DZ.player.pause();	// Pause ne marche pas.

	/////////////////////////////////////////////////////////////////////
	?? PLAYER TRACKS : COMBIEN DE TRACKS ?
	
	-> Idée : pour génération de playlist : 50 titres élus au hasard !?
	MySQL : SELECT column FROM table ORDER BY RAND() LIMIT 50

	Note : Set LECTURE ALEATOIRE possible : DZ.player.setShuffle();
	
	/////////////////////////////////////////////////////////////////////
	GESTION USER

	REQUETE UNLOGED :
	"DZ.api user/me ={"error":{"type":"OAuthException","message":"An active access token must be used to query information about the current user","code":200}}"
	... response.error = object
	"DZ.getLoginStatus = {"authResponse":null,"status":"unknown","userID":null}"	
		{
			status: 'connected',
			authResponse: {
				accessToken: '...',
				expiresIn:'...',
				userID:'...'
			}
		}	
	LOGED IN
	"DZ.api user/me ={"id":3599111,"name":"alexmourousy","lastname":"Mourousy","firstname":"Alexandre","email":"alex_mourousy@hotmail.com","birthday":"1980-09-12","inscription_date":"2008-09-22","gender":"M","link":"http://www.deezer.com/profile/3599111","picture":"https://api.deezer.com/2.0/user/3599111/image","country":"FR","lang":"fr","type":"user","status":0}"
	... response.error = UNDEFINED	
	"DZ.getLoginStatus = {"authResponse":{"accessToken":"frnLDrM5HC51f6a6774a952rvj8vEuY51f6a6774a98eZug6VJ","expire":0},"status":"connected","userID":"3599111"}"

	
	
	
v3



	index.php : formulaire à organiser dans un tableau

	styles.CSS : formulaires à gauche et player à droite et à agrandir

	Autorisation : basic_access, email, manage_library
	
	AJOUTER EN FAVORI DS DZ : user/{user_id}/tracks ;	param = track_id
	
	EVENT : "on player loaded"
	OBTENIR LES INFORMATIONS DU CLIENT S'IL EST RESTE CONNECTE
	Transmission serveur
	
	IDEM pour LOGIN
	
	
	Note :
	// TEST si erreur AJAX pour GENERATION PLAYLIST
	DZ.player.playTracks([2404642,16534163,945217], 0, function(response){
		console.log('FAIL debug'+ JSON.stringify(response));

	
	/////////////////////////////////
		INFORMATIONS
	////////////////////////////////
	
	Chemins à configurer :
	
	AJAX : Appel de "process.php"
	surprisemusic.js:65/101/132
	deezerutil.js:72
	
	INIT DEEZER APP
	channelUrl : 'http://localhost/SURPRISEMUSIC/3/channel.php',
	deezerinit.js:8
	

	
v4

	/////////////////////////////////////////////////////////////////////
					DONE
	/////////////////////////////////////////////////////////////////////
	
	Possibilité de filtrer par les tags en Lecture favoris.
	Ajout retrievForm() avant envoi requete.
	
	Accueil : Opacity synchro avec player.
	
	Variable globale pour url AJAX : urlajax
	
	Pied de page : 
	www.mysurprisemusic.com design & developpement © 2013 by Aurelie Hampel & Alex Mourousy

v4.1

	Création dossiers
	
	Etudier la manière d'écrire les variables globales hors $(document).ready
	-> ~ OK	
	
	Ajustement logo index.html + CSS
	
	Création LOGO : MyMoodSic
	
	surprisemusic.js : nouvelle variable globale : var DEBUG = true;
	-> affichage complet retour PHP à chaque requete AJAX si "succes".
	
	Au LOGIN ou chargement du player (si client connecté) :
	Appel fonction sendUserLoginToServer() :
	ENVOI DES INFORMATIONS par AJAX avec commande: info.action = 'login'.
	Note : 	Au chargement du player, si l'utilisateur est connecté, 
			On estime qu'il s'est déjà logué une fois et a donc envoyé ses informations annexes.
			Le serveur vérifie que l'ID est bien présent.
	
	IDEES FUTUR : infos USER serveur : sexe, age, date arrivee, id serveur autoincrement.
	
	Pour Generation playlist et Lecture Favoris : liste attendue.
	Test sur retour contenu AJAX valide : typeof(data) == "object"
	
	Pour Login ou Chargement player , et ajout favori : 'true' attendu
	Test sur retour AJAX valide : << data == 'false' >> -> PB !

	BUG gener playlist : il reste les anciens tags à la requete suivante ?
	Test : retrieveForm OK.
	
	Appel script "deezerinit.js" mis en entete et protégé par << $(document).ready >>, etc

	TESTS LOGIN LOGOUT FADE IN OUT -> BOF : OFF
	
	BOUTON LOGIN LOGOUT Dynamique : Ne garder qu'un seul bouton LogIn ou LogOut.
	Bouton init : logout.
	Appel fonction 	changeLoginButton() :
		Après login ou player chargé si client connecté
		Après logout
	ANIM fadeIn Out et transition

	
	
	
v5.0

	LOGO : MoodZeek
	
	Réunion JS / PHP
	BUG info.user.id ="" résolu
	
	LOADER .GIF : affichage avec witnessing() 
	-> à l'accueil et à chaque action.
	TODO : Vérifier sa "durée de vie"
	
V5.1
	
	FAVICON
	
	Reconfig boutons
	
	PB : LOGIN 'EVENT' via popup après 30s d'écoute non géré ...
	Soumis à Deezer, pas de solution pour l'instant.

V5.2
	
	Témoin du pseudo mis en haut à droite avec un lien vers la liste des favoris sur Deezer.
	
	Position #container stabilisée au chargement en fixant la hauteur du header (72px)
					
	//////////////////////IDEES RAPPORT /////////////////////////////////

	4 actions AJAX : login / add / playlist / fav
	Si retour serveur ( sinon erreur ajax ), vérifications suivantes :
	
		login & add
			ATTENTE DE 'true' 
				php : << header('Content-Type: text/plain'); echo $myBoolean ; >>
			else : witnessing server error

		playlist & fav 
			ATTENTE type 'object' 
				php : << header('Content-type: application/json');	echo json_encode( $list ); >>
			else : witnessing server error	("Oops : Try again later...")
		
	
V6.0
	??
	PHP : pb Warning: mysql_num_rows() expects parameter 1 to be resource, 
	boolean given in ...\lib\centrallib.php on line 16
	
	Envoyer à chaque playerLoaded la commande login meme si user non 'connected' ?
	Pas la peine : rajout condition 'connected' sinon pas d'AJAX.
	
	?? Un seul tag activ en BD ?? dans la table membre_titre_tag ??
	?? Un seul tag humeur ?? ptet ok, vérif client TODO !?
	
	RECONFIG MESSAGES ACKNOWLEDGMENT PHP
        header('Content-Type', 'application/json');
        echo false;
		//ou echo true; (booleen)
	
	ECHANGE MAIL AURELIE
	Note :
	Lorsque l'utilisateur ajoute un titre qui est déjà dans sa base, ce n'est pas une erreur en soi, précisons, au cas où.
	Donc j'attends "true" même si.


	Question :
	Toujours dans la lignée philosophique des messages d'acknowledgment,
	Si la liste demandée ( play fav ou play list ) ne contient rien dans la base, que renvoies tu ?
	Car ""[vide]"" me fait une erreur
	Dans ce cas je te propose de renvoyer un titre par défaut quand même, et que moi je peux détecter.

		70224014-> en mode zen
		 Empty Dream
		Youn Sun Nah

		801987 -> en mode trash ( mood angry lol ;-)
		(Empty Words (Album Version)    Death )	

	BOUTON STATUS enlevé

v6.1	

	Tooltip pour chaque activite ( title="..." )
	
	Changement TAGS activite	: 
		cooking -> housework, 
		 sunny -> bored
	
	SECURITE PHP
	
		FICHIER .htaccess ( dans /lib )
		<< deny from all >>
		
		process.php
			Eviter injection de code sql ; htmlentities peut être pas nécessaire chez nous.
			-> mysql_real_escape_string() sur chaque $POST
			-> def fonction splice_non_numeric_entries pour les $POST mood et activ.

v7.0		
	<label ...> apparence curseur cliquable (cursor:pointer;)
	
	Integration custom checkboxes
	https://github.com/mattSOLANO/ScrewDefaultButtonsV2	
	
	Integration custom tooltip
	http://qtip2.com/demos
	
	BUG : l'évènement onload dans DZ.init ne se produit plus si la console est activée
	
v7.1
	Gestion du pb d'API deezer si l'internaute s'identifie par la popup des 30s
	-> A chaque action on vérifie le statut bouton login et l'etat de connexion.
	
	corrections styles.css - taille des div à afiner (!! TODO !!)
	cf http://forum.hardware.fr/hfr/Programmation/HTML-CSS-Javascript/resolu-position-page-sujet_107148_1.htm
	
	Nouveau div sous les deux colonnes pour ajustement : .clear{clear: both;}
	
	Formulaire de contact en ajax et dans qTip2 et avec jQueryValidate en mode modal.

v7.2
	Terms of Use en ajax dans qTIp2.
	Photos dans formulaire de contact (ie : "qui sommes nous")
	
	Gestion du cas ou l'utilisateur se connecte par la popup des 30s
	Vérification de l'etat du systeme (connected) à chaque action client.
	
	qTIP SOUS-TEASER : 
    Redesign foto favicon (cf repertoire "DOC")
    CSS dans styles/css + TXT dans javaScript ...
    " Music enhances emotions and gives rythm to our steps
		Not finding the right track at the right moment ? Let Moozeek surprise you !
		Want to be active for community or own playlist ? Add your favorite titles ! "

	Toolip email photographié sur "contact"	
		
	// MISE EN LIGNE - PORTAGE SUR www.moodzeek.com
	Ecriture du ".htacces" - Redirection -> toujours "www. ..."
	DEVELOPERS.DEEZER.COM : Changer le domaine de l'application dans MyApp de DeezerDev
	DEEZERINIT.JS : Changer chemin absolu vers channel.php
	BD/lib : Tables de moodzeek préfixées par "mz_" et changements dans lib
	Changer nom BDD : "amourquartet"  etc ... 
	Changer parametres php de connection dans MZ (nom, utilisateur, mdp)
	Chemins dans contact/contact.php : pas \ mais /
	Chemins dans terms/terms.php : pas \ mais /
	JS: DEBUG=false !
	
	Gestion EMAIL sur OVH	

	Prévoir le cas où Deezer.com indisponible ou problème réseau
	Idem IE8 ... Player ne se charge pas.
	SetTimeOut : présenter un message d'erreur et affichage correct (opacity) : réglé à 6s

v7.3

	Accueil qTIP modal : "SITE IS STILL BEING EMPROVED" // "site under construction"
	
	"Deezer Playlists" : bouton pour récupérer ses playlists deezer 
	Affichage des titres de playlists dans QTIP et lien dynamique vers player.
	
	HTML du Sous-Teaser caché dans index.php pour affichage en qTip2
	
	Correction : BUG CSS Chrome : positionnement qtip "select mood/activ"
	
	CSS : modifs pour avoir des contenus centrés
	
	"Vrais" liens sur quelques clicks et pas '#' : deezer, moodzek, contact ...

	sitemap.xml ( exemple amq (par WP ) : sitemap-generator-url="http://www.arnebrachhold.de" )

	Google Analytics : ga.js
	DNS : .moodzeek.com TXT	google-site-verification=FVT5Vq46dckJiaNPb e4eTogHD5egUoIupSbJL5Kz7j4
  
	REFERENCEMENT
	
	FICHIER robots.txt ( à la racine )
	# Ligne de commentaire	
	User-Agent: *
	Disallow: /lib/	

v7.4

	Réduction de fichiers
	
	JS parametre : pour chemin absolu de channel.php

	Nouvel app_id = 125385 pour MoodZeekDev en local
	
	Alignement des checkboxes : display: inline-block; float: left; padding: 15px 20px 10px 10px;

	Contact.php
	$myEMail = 	'webmaster@moodzeek.com'; -> ne marche pas
	
	!! QTIP CSS IMG : indiquer height et width sinon bug positionnement Chrome en Zoom
	
v8.0

	Rajout dans actions.js : AJOUT en FAV -> Patch Login : sendUserLoginToServer()
	
	( DB : mz_member en MyIsam : resoud le problème d'auto-increment systématique )
	
	RETEST : $a = $statement->fetchObject('modelArea');

	Création des tables :
	
	Tables

	Colonne	Contrainte de clé étrangère (INNODB)
	» mz_tags
	mz_track.idTrackDZ ON DELETE  cascade ON UPDATE  cascade
	mz_member.idMemberDZ ON DELETE set null ON UPDATE  cascade
	
	Gérer retour si playlist fav ou generale est vide

v8.1

	Mise en place système de VOTE
	Refonte html/css en deux tables séparées.
	
	Nouveau bouton REMOVE
	Effacer dans mz_fav
	MAJ occurence dans mz_track et effacer si nécessaire
	
	EMAIL OK : destiner directement à une boite email existante, 
	car webmaster@moodzeek.com n'a pas de POP.
	
	OLD DB :
		1494543	Julie	
		2933507	nuizance	
		3599111	alexmourousy	
		15101508	GP


v8.2

	4ème MOOD : EASY
	
	Dev FILTRE selon les votes - dev algo sur le même espace.
	
	CSS witnessing corrigé ( jQuery - fadeOut au lieu de hide )
	
	BUG witnessing : pb avec fadeOut -> synchro addWitnessing : settimeout...
	
	Note [ couleur proche des boutons rgb(145, 12, 12); ]
	
	CNIL : OK Site Web Personnel à usage privé
	
	MOOD Diner to ChillOut
	
	Ecriture Teaser directions + Mentions remerciements dont djgango pour PHOTO background
	QTIP Bug FF ... -> MAJ d'un style pour recalculer la largeur après l'évènement 'show'
	
	Nettoyage JS : classes qTip2 personnalisées : écrites dans jquery.qtip.min.css

	VOTE : BD :  nouvelle colonne 'votes' dans mz_member / PHP MAJ BD : incrémente à chaque vote.
	
	BD Occurence = 0 -->> 1 Par défault au rajout.

	BUG identifié en BD : 'member tracks' ne s'incremente pas au rajout ..
	PHP Correc 'return PDO->execute()' : ne renvoie pas le nombre de rows affectés, mais rowCount() !!
	Return ( rowCount == XXX ); -> en fin de fonctions DAO ( et pas rowCount() direct car booleen attendu )
	
	DZ : Authorisation EraseLib en plus pour 'Remove track'

	TODO - Mise en ligne :
	robots.txt : Disallow: /php/
	deezerinit : appId : 122295 pour www.moodzeek.com/
	JS : Debug False / PHP Messages d'Exception désactivés.
	SiteMap
	Readme.txt - Pas sur serveur !
	Changer nom BDD : "amourquartet" etc
	? Chemins dans contact/contact.php : pas \ mais / -> propager modif dans /contact/contact.php !!
	? Chemins dans terms/terms.php : pas \ mais /
	
	BUG PHP Header : Convertir tous les PHP en UTF-8 sans BOM
	
	ERROR JQUERY...MAP : Rermplacer dans la biblio jQuery cette première ligne
	/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license */

	JS: Mot "Deezer Search " à vérifier et plus "Track Search" 
	-> Vérif dynamique en comparant avec la première valeur html
	
	Changements: 
	----------
	Réédition Class Diagramm
	Favicon
	Logo MoodZeek sur site et chez Deezer.
	bouton Login/Logout
	class "big"
	CSS select all : green hover
	ajout liens perso dans contacts
	AFFILIATION Ajout n° App sur les liens pointant vers deezer. SAUF celui du player ... aie.
	Fonctions ERGONOMIE CLAVIER <-> PLAYER et Blur() si recherche fructueuse.
	Lien vers ma musique dans Contact
	Ré-écriture directions

	Sitemap n'a pas changé !
	W3C ok
	
	CSS & BACKGROUND
	Redef Charte graphique
	CSS hover opacity sur teaser et logo
	CSS/JS : CENTRAGE vertical
	
	deezerutil2 : amélioration message d'erreur player DZ : "besoin de flash à jour"
	PB CACHE OVH : renommage en deezerutil2.js pour prendre en compte les modifs
	
	Note : DZ Player a besoin de flash et est bloqué par FF s'il n'est pas à jour !
	
	BUG : Player ne démarre pas si résolution d'écran / zoom trop faible...
	
	BUG QTIP "connect" <--> "disconnect" // LOGIN <--> LOGOUT
	Abandon Animation.JS : changement dynamique de contenu qTip LOGIN/LOGOUT
	
	Oups index.html : permutation mood n° 3 et mood n° 4 ; propagée dans SQL
	
	actions.js ->> deezerutil.js
	Refactoring Patch si statut login a change via pop-up des 30s :
	
	OVH CACHE !!!! ->> deezerutil.js renommé en deezerutil2.js
	Résolu...
	
	OVH PHP NOTE : VERSION 5.4 par défaut.
	
	PB OVH MySQL PDO : PB Caractères et accents
	Résolu : new PDO( ...;charset=ut8" ... ) NE MARCHE PAS CHEZ OVH !!!!!!!!!
	->>> $this->pdo-> exec("set names utf8"); /* POUR PRISE EN COMPTE PAR OVH */

	
	CACHER LE DOCUMENT JUSQU'A "ONLOAD" : overlay BACKGROUND GRADIENT
	http://ie.microsoft.com/testdrive/graphics/cssgradientbackgroundmaker/
	Elliptical
		Stops: 	
				Start 	End
		Offset: 0	.9
		Color: 	995C01	000000	

	DASHBOARD DESIGN :
	HOVER sur labels 
	min-width en %
	Changement boutons checkboxes : puzzles
	
	PHP : rajout constante : define 'DEBUG' pour gérer le retour des exceptions
	
	SQL : rajout colonne member : 'latest' : date de dernière connexion
		
	
	/////////////////////////////////////////////////////////////////////
					TO DO
	/////////////////////////////////////////////////////////////////////

	Lien "SOME MORE" ->> Last track added ; playlist of the week ; etc...
	
	Minify JS	- CSS enlever comments !!
	
	Mettre sur GITHUB
	
	JS Ajouter DZ MoodZeek playlist ?!
	
	Faire un forum à côté .. WordPress ?
	
	Contacter DJGANGO -> photo
	
	CSS : Coller footer en bas ?

	"REMEMBER THIS PLALIST" -> ajouter un bouton avec generation id de playlist en favoris
	
	ARTIST OF THE WEEK
	
	----

	FILTRES :
	
	ACTIV : MORNING ??!! à la place de Diner !! ChillOut Hammam
	SPIRIT Calm excited stressed
	CULTURE European, African, Oriental, Latino, Asian
	SEXUALITY Spicy, Normal, Gay, Frustrated
	
	PLACE : studio concert chanson 
	
	SEXE : homme/femme
	AGE : enfant/adolescent/adulte/sénile
	SEASON

	Activité supp : Zen / Thoughts	
	Boutons (Widget ?) FK et TW
	
	-----
	
	BOUTON disable tooltip
			
	BOUTON Erase account
	Proposer à l'utilisateur d'effacer son compte par demande messagerie.
	
	Evaluation avec des étoiles  ?!
	
	WHO : Chaque titre : "added by ..."
	
	Affichage information communauté à la connexion :
		Last track added : "xxx" par "pseudo" 
		Nombre de membres = ...
		Nombre de titres = ...	

	----
	
	Check securité depuis serveur : verif si utilisateur authentifié
	
	PHP/BD : time selon timezone et pas serveur sql
	
	SEO ...	Liens boutons : Faire le dossier "links".
	
	VERIF FOND D'ECRAN copyright ...
	http://www.hebus.com/membre192828-page1.html

	ORGANISATION du code : 
	"sendUserLoginToServer()" à mettre dans la catégorie actions.js (?)
	Refactoriser les actions tooltip, contenus et css.
	
	PB DEEZER API : reconnaître connexion client par popup automatique des 30s
	Gestion évenenement ... en cours chez DZ
	
	Gestion langues : $_GET['lang'] + url rewriting

	Affiliation plateforme de téléchargement -> "qobuz" (AlexI)
	
	Fond d'écran dynamique : (cf: wetransfer) (AlexI)
	
	Template page php ? 4 columns + header / footer fixed

  
	Prévoir email deezer d'annonce : David Quenet
	
	DESK
	Pour avoir le chemin absolu : écrire un fichier chemin.php et l'executer avec navigateur
	<?php echo realpath('chemin.php'); ?>

	<> Mode d'emploi / Terms of Use / Mentions légales
	
	Ecrire help plus détaillé :
	--------------------------
	Future : we already think of tons of funny and useful filters ! Wait and hear ;-)
	
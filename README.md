MoodZeek
========

Smart radio based on participative playlist plus mood and activities filtering

![ScreenShot](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/01%20PPT%20-%20PageGarde%20-%20v2.jpg)


Principle
---------

![Principle](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/02%20PPT%20-%20Principes%20-%20v2.jpg)


Use Cases
---------

#### Client

![Client Use Case Diagram](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/UseCase%20-%20CLIENT%20-%20v1.jpg)

#### Deezer

![Deezer Use Case Diagram](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/UseCase%20-%20DEEZER%20-%20v1.jpg)

#### Moodzeek

![Moodzeek Use Case Diagram](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/UseCase%20-%20MOODZEEK%20-%20v1.jpg)



Class Diagram
--------------

![Class Diagram](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/ClassDiagram%20-%20v8.2.jpg)



Sequence Diagrams
------------------

#### Load Page

![Load Page Sequence Diagram](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/SequenceDiagram%20-%20LOAD_PAGE%20-%20v2.jpg)

#### Play

![Play Sequence Diagram](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/SequenceDiagram%20-%20PLAY%20-%20v2.jpg)

#### Add Favorite Title

![Add Sequence Diagram](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/SequenceDiagram%20-%20ADD_TO_FAVORITES%20-%20v2.jpg)

#### Deezer Search

![Search Sequence Diagram](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/SequenceDiagram%20-%20SEARCH%20-%20v1.jpg)

#### Authentification OAuth2

![OAuth2 Sequence Diagram](https://raw.github.com/AlexMourousy/moodzeek/master/presentation/SequenceDiagram%20-%20AUTHENTIFICATION%20-%20v2.jpg)



Front : Data handling
-----------------------

Global variable "info" is sent to controler for each transaction

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



Front : Usefull Plugins
-----------------------

 * qTip2 - Pretty powerful tooltips - v2.1.1
   http://qtip2.com
   Copyright (c) 2013 Craig Michael Thompson


 * ScrewDefaultButtons v2.0.6
   http://screwdefaultbuttons.com/
   Copyright 2013 Matt Solano




jQuery(document).ready(function($)
{
	$('#contactLink').click(function(e){

		e.preventDefault();
		$(this).qtip({
		
			overwrite: false,
			content: { text: 'Loading Contact form ...' },
			position: { my: 'bottom center', at: 'top center', viewport: $(window) },
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
						info.action = 'contact';
						$.ajax({
							url: urlajax,
							type: 'post',
							data: {info : info},
							success: function(data) { 
								api.set('content.text', data);
								$.getScript('js/jquery.validate.min.js', function(){
									validationProcess(function(){
										api.set('style.tip.corner', false);
										setTimeout(function(){ api.hide(event); }, 3000);
									});
								});							
							}
						});
						api.cache.ajaxed = true;
					}
				},
				hide: function(event, api) { api.destroy(); } // $('#contactLink').qtip();
			}
		});
	});

	function validationProcess( callback )
	{
			jQuery.validator.addMethod("notEqual", function(value, element, param) {
				return this.optional(element) || value != param;
			}, "Please specify a different (non-default) value");
			
			$("#contactform").validate({
				debug: false,
				rules: {
					nom: 	{ required: true, minlength: 3, maxlength: 60, notEqual: "Your Name"},	
					email: 	{ required: true, email: true, minlength: 7, maxlength: 60 },
					message:{ required: true, minlength: 5, maxlength: 1000, notEqual: "Your message" }
				},
				messages: {
					nom: "Please let us know who you are.",
					email: "A valid email helps us to get in touch with you.",
					message: "Please enter a valid message"
				},
			});
			
			$("#buttonContact").click(function(e){
				e.preventDefault();
				
				if( $("#contactform").valid() ) 
				{
					$("#buttonContact").hide();
					info.action='message';
					info.message.nom =		$("#nom").val();
					info.message.email =	$("#email").val();
					info.message.message =	$("#message").val();
					$.ajax({
						url: urlajax,
						type: 'post',
						data: {info : info},
						success: function(data) { 
							$("#contactform").fadeOut(1000).queue(function() 
							{
								$("#retour").hide().html(data).fadeIn(500).animate({color:"#C00000"},1500);
								$(this).dequeue();
								callback();
							});					
						}
					});
				}	
			});

		
		// ANIMATION << BLUR FOCUS >> SUR INPUT
		$('#nom')
			.focus( function() {
				if( $(this).val() == 'Your Name') $(this).val(''); });
			//.blur( function() { if( $(this).val() == '') $(this).val('Your Name');});
		$('#email')
			.focus( function() {
				if( $(this).val() == 'Your Email') $(this).val(''); });
			//.blur( function() { if( $(this).val() == '') $(this).val('Your Email');});	
		$('#message')
			.focus( function() {
				if( $(this).val() == 'Your message') $(this).val(''); });
	}
	 
	 
});
jQuery(function($) {
  "use strict";

  // ---------------------------------------------------------------------------------------

  $('[data-toggle="tooltip"]').tooltip();
////////////////////////////////////////////////////////
///////////////preloader ///////////////////////////
////////////////////////////////////////////////////////

	jQuery(window).load(function() { // makes sure the whole site is loaded
				jQuery('#status').fadeOut(); // will first fade out the loading animation
				jQuery('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the focal_person.
				jQuery('body').delay(350).css({'overflow':'visible'});
	});
////////////////////////////////////////////////////////
///////////////back to top ///////////////////////////
////////////////////////////////////////////////////////
		var offset = 220;
		var duration = 500;
		jQuery(window).scroll(function() {
			if (jQuery(this).scrollTop() > offset) {
				jQuery('.back-to-top').fadeIn(duration);
			} else {
				jQuery('.back-to-top').fadeOut(duration);
			}
		});

		jQuery('.back-to-top').click(function(event) {
			event.preventDefault();
			jQuery('html, body').animate({scrollTop: 0}, duration);
			return false;
	});
		if($('.inner-content-div').length > 0){
		$('.inner-content-div').slimScroll({
        height: '385px'
    });
		}
});

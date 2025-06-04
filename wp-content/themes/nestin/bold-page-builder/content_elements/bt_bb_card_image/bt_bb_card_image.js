(function( $ ) {
	"use strict";

	/*$('.bt_bb_card_image').hover(function() {
		$(this).find('.bt_bb_card_image_content_inner').animate({
			height: "toggle",
			opacity: "toggle"
		}, 300);
	});*/

	$('.bt_bb_card_image').mouseenter(function() {
		$(this).find('.bt_bb_card_image_content_inner').stop().slideDown('slow');
	}).mouseleave(function() {
		$(this).find('.bt_bb_card_image_content_inner').stop().slideUp('slow');
	});


})( jQuery );
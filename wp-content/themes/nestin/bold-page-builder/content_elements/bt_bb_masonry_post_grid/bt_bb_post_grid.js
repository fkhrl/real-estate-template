(function( $ ) {
	"use strict";
	
	var bt_bb_post_grid_resize = function( root ) {
		root.each(function() {
			$( this ).find( '.bt_bb_grid_item' ).each(function() {
				$( this ).find( '.bt_bb_grid_item_post_thumbnail' ).height( Math.floor( $( this ).width() * $( this ).data( 'hw' ) ) );
			});
		});
	}

	var bt_bb_post_grid_load_images = function( root ) {
		root.each(function() {
			var page_bottom = $( window ).scrollTop() + $( window ).height();
			$( this ).find( '.bt_bb_grid_item' ).each(function() {
				var this_top = $( this ).offset().top;
				if ( this_top < page_bottom + $( window ).height() ) {
					var img_src = $( this ).data( 'src' );
					if ( img_src !== '' && $( this ).find( '.bt_bb_grid_item_post_thumbnail a' ).html() == '' ) {
						$( this ).find( '.bt_bb_grid_item_post_thumbnail a' ).html( '<img src="' + img_src + '" alt="' + $( this ).data( 'alt' ) + '">' );
					}
				}
			});
		});
	}

	var bt_bb_post_grid_load_items = function( root ) {
		root.each(function() {
			var loading = root.data( 'loading' );
			if ( loading === undefined || ( loading != 'loading' && loading != 'no_more' ) ) {
				var page_bottom = $( window ).scrollTop() + $( window ).height();
				$( this ).find( '.bt_bb_grid_item' ).each(function() {
					var this_top = $( this ).offset().top;
					if ( this_top < page_bottom + $( window ).height() ) {
						if ( $( this ).is( ':last-child' ) ) {
							var root_data_offset = root.data( 'offset' );
							var offset = parseInt( root_data_offset === undefined ? 0 : root_data_offset ) + parseInt( root.data( 'number' ) );
							bt_bb_post_grid_load_posts( root, offset );
							return false;
						}
					}
				});
			}
		});
	}

	var bt_bb_post_grid_load_posts = function( root, offset ) {
		if ( offset == 0 ) {
			root.addClass( 'bt_bb_grid_hide' );
			root.find( '.bt_bb_grid_item' ).remove();
			if ( root.hasClass( 'masonry' ) ) {
				root.masonry( 'destroy' );
			}
		}

		root.parent().find( '.bt_bb_post_grid_loader' ).show();
		root.parent().find( '.btMasonryPostGridPagination' ).hide();
		
		var action = 'bt_bb_masonry_post_get_grid';

		var root_data_number = root.data( 'number' );

		var return_type		= root.data( 'return-type' );
		
		if ( offset > 0 && return_type == 'paging' ) {
			root.find( '.bt_bb_grid_item' ).remove();
			root.masonry({
				columnWidth: '.bt_bb_grid_sizer',
				itemSelector: '.bt_bb_grid_item',
				gutter: 0,
				percentPosition: true
			});
		}			
		
		var data = {
			'action': action,
			'number': root_data_number,
			'category': root.data( 'category' ),
			'show': root.data( 'show' ),
			'bt-bb-masonry-post-grid-nonce': root.data( 'bt-bb-masonry-post-grid-nonce' ),
			'post-type': root.data( 'post-type' ),
			'offset': offset,
			'return-type': root.data( 'return-type' )
		};

		root.data( 'loading', 'loading' );
		
		$.ajax({
			type: 'POST',
			url: ajax_object.ajax_url,
			data: data,
			async: true,
			success: function( response ) {

				if ( response == '' ) {
					root.data( 'loading', 'no_more' );
					root.parent().find( '.bt_bb_post_grid_loader' ).hide();
					root.parent().find( '.btMasonryPostGridPagination' ).hide();
					return;
				}

				var $content = $( response );
				root.append( $content );
				bt_bb_post_grid_resize( root );

				root.data( 'offset', offset );

				if ( offset > 0 ) {
					root.masonry( 'appended', $content );
				} else {					
					if ( $( 'html' ).attr( 'dir' ) == 'rtl' ) {
						root.masonry({
							columnWidth: '.bt_bb_grid_sizer',
							itemSelector: '.bt_bb_grid_item',
							gutter: 0,
							percentPosition: true,
							isRTL: true
						});	
					} else {
						root.masonry({
							columnWidth: '.bt_bb_grid_sizer',
							itemSelector: '.bt_bb_grid_item',
							gutter: 0,
							percentPosition: true
						});
					}

				}
				root.parent().find( '.bt_bb_post_grid_loader' ).hide();
				root.parent().find( '.btMasonryPostGridPagination' ).show();

				root.removeClass( 'bt_bb_grid_hide' );
				$( '.bt_bb_grid_container' ).css( 'height', 'auto' );
				
				bt_bb_post_grid_load_images( root );

				if ( root.data( 'auto-loading' ) == 'auto_loading' ) {
					root.data( 'loading', '' );
				} else {
					root.data( 'loading', 'no_more' );
				}

			},
			error: function( response ) {
				root.parent().find( '.bt_bb_post_grid_loader' ).hide();
				root.removeClass( 'bt_bb_grid_hide' );	
				root.parent().find( '.btMasonryPostGridPagination' ).hide();
			}
		});
	}

	var bt_bb_post_grid_load_posts_pagination = function( root, offset, page ) {			
			var action	= 'bt_bb_masonry_post_get_grid_pagination';
			var data = {
				'action': action,
				'number': root.data( 'number' ),
				'category': root.data( 'category' ),
				'bt-bb-masonry-post-grid-nonce': root.data( 'bt-bb-masonry-post-grid-nonce' ),
				'post-type': root.data( 'post-type' ),
				'url': root.data( 'url' ),
				'page': page
			};
			
			$.ajax({
				type: 'POST',
				url: ajax_object.ajax_url,
				data: data,
				async: true,
				success: function( response ) {
					if ( response == '' ) {
						root.parent().find( '.btMasonryPostGridPagination' ).hide();
						root.parent().find( '.btMasonryPostGridPagination .port' ).html( '' );
						return;
					}
					var $content = $( response );					
					root.parent().find('.btMasonryPostGridPagination .port').html( $content );
				},
				error: function( response ) {					
					root.removeClass( 'bt_bb_grid_hide' );
					root.parent().find( '.btMasonryPostGridPagination' ).hide();
				}
			});
	}


	$( document ).ready(function() {

		$( window ).on( 'resize', function() {
			bt_bb_post_grid_resize( $( '.bt_bb_masonry_post_grid_content' ) );
		});

		$( window ).on( 'scroll', function() {
			$( '.bt_bb_masonry_post_grid' ).each(function() {
				$( this ).find( '.bt_bb_masonry_post_grid_content_loading' ).each(function() {	
						if (bt_bb_masonry_post_grid_isOnScreen( $( this ), -200 )){
								bt_bb_post_grid_load_images( $( this ) );
								bt_bb_post_grid_load_items( $( this ) );
						}
				});
				$( this ).find( '.bt_bb_masonry_post_grid_content_paging' ).each(function() {	
						if (bt_bb_masonry_post_grid_isOnScreen( $( this ), -200 )){
								bt_bb_post_grid_load_images( $( this ) );
						}
				});
			});
		});

		$( '.bt_bb_masonry_post_grid_content' ).each(function() {
			var grid_content = $( this );
			var offset	= 0;
			var return_type = grid_content.data( 'return-type');
			if ( return_type == 'paging' )
			{
				offset					= grid_content.data( 'page' );
				var root_data_number	= grid_content.data( 'number' );
				offset = offset > 0 ? parseInt(offset)-1 : offset; 
				offset = parseInt(offset) * parseInt(root_data_number);
			}			

			bt_bb_post_grid_load_posts( grid_content, offset );
		});

		$( '.bt_bb_post_grid_filter_item' ).on( 'click', function() {
			var root = $( this ).closest( '.bt_bb_grid_container' );
			root.height( root.height() );
			root.parent().find( '.btMasonryPostGridPagination' ).hide();

			$( this ).parent().find( '.bt_bb_post_grid_filter_item' ).removeClass( 'active' ); 
			$( this ).addClass( 'active' );

			var grid_content = $( this ).closest( '.bt_bb_masonry_post_grid' ).find( '.bt_bb_masonry_post_grid_content' );
			grid_content.data( 'category', $( this ).data( 'category' ) );

			bt_bb_post_grid_load_posts( grid_content, 0 );

			var return_type = grid_content.data( 'return-type');			
			if ( return_type == 'paging' )
			{
				bt_bb_post_grid_load_posts_pagination( grid_content, 0, 0 );
			}
		});

		$(document).on("click", 'a.masonry-post-grid-pagination', function(event) { 
			event.preventDefault();	

			$( this ).parent().parent().find( 'li' ).removeClass( 'active' );
			$( this ).parent().addClass( 'active' );

			var grid_content = $( this ).closest( '.bt_bb_masonry_post_grid' ).find( '.bt_bb_masonry_post_grid_content' );
			
			var page = $( this ).data( 'page' );
			grid_content.attr( 'data-page', page );
			
			var offset				= page;
			var root_data_number	= grid_content.data( 'number' );			
			offset = (parseInt(offset)-1) * parseInt(root_data_number);
			
			bt_bb_post_grid_load_posts( grid_content, offset );

			var return_type = grid_content.data( 'return-type');			
			if ( return_type == 'paging' )
			{
				bt_bb_post_grid_load_posts_pagination( grid_content, offset, page );
				$(window).scrollTop( $( this ).closest( '.bt_bb_masonry_post_grid' ).offset().top - $( this ).closest( '.bt_bb_masonry_post_grid' ).find( '.bt_bb_post_grid_filter' ).height() );
			}			
		});

	});

	// isOnScreen fixed	
	function bt_bb_masonry_post_grid_iOSversion() {
	  if (/iP(hone|od|ad)/.test(navigator.platform)) {
		// supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
		var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
		return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
	  } else {
		  return false;
	  }
	}

	var ver = bt_bb_masonry_post_grid_iOSversion();
	
	// isOnScreen	
	function bt_bb_masonry_post_grid_isOnScreen( elem, top_offset ) {
		if ( ver && ver[0] == 13 ) return true;
		top_offset = ( top_offset === undefined ) ? 75 : top_offset;
		var element = elem.get( 0 );
		if ( element == undefined ) return false;
		var bounds = element.getBoundingClientRect();
		var output = bounds.top + top_offset < window.innerHeight && bounds.bottom > 0;
		return output;
	}
})( jQuery );
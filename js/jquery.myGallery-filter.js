jQuery(function ($) {
    // myGallery
    $(".myGallery").myGallery({
    helpers: {
            buttons: {}
        } 
    });
    // filter selector
    $(".filter").on("click", function () {
        var $this = $(this);
        // if we click the active tab, do nothing
        if ( !$this.hasClass("active") ) {
            $(".filter").removeClass("active");
            $this.addClass("active"); // set the active tab
            // get the data-rel value from selected tab and set as filter
            var $filter = $this.data("ngdesc"); 
            // if we select view all, return to initial settings and show all
            $filter == 'all' ? 
                $(".myGallery")
                .attr("data-myGallery-group", "gallery")
                .not(":visible")
                .fadeIn() 
            : // otherwise
                $(".myGallery")
                .fadeOut(0)
                .filter(function () {
                        var year = $(this).find('.data-ngdesc').text();
                            return year.match( /2009$/ );
  }
                })
                // set data-myGallery-group and show filtered elements
                .attr("data-myGallery-group", $filter)
                .fadeIn(1000); 
        } // if
    }); // on
}); // ready


'$( "div[id]" ).one( "click", function() {
  var idString = $( this ).text() + " = " + $( this ).attr( "id" );
  $( this ).text( idString );
});'
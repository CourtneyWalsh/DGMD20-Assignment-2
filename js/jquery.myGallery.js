/**
*
* myGallery JavaScript
* Outside Sources: 
*** Kris-B  - https://github.com/Kris-B/nanoGALLERY
*** Julian Shapiro -  https://gist.github.com/julianshapiro/9098609
*** John Hrvatin - http://blogs.msdn.com/b/ie/archive/2011/10/28/a-best-practice-for-programming-with-vendor-prefixes.aspx
**/
(function ($) {
  jQuery.fn.myGallery = function (options) {
    var settings = $.extend(true, {
      // default settings
      userID : '',
      kind : '',
      album : '',
      photoset : '',
      blackList : 'scrapbook|profil',
      whiteList : '',
      albumList : '',
      galleryToolbarWidthAligned : true,
      galleryToolbarHideIcons : false,
      galleryFullpageButton : false,
      galleryFullpageBgColor : '#111',
      breadcrumbAutoHideTopLevel : false,
      displayBreadcrumb : false,
      theme : 'default',
      colorScheme : 'none',
      colorSchemeViewer : 'default',
      items : null,
      itemsBaseURL : '',
      paginationMaxLinesPerPage : 0,
      maxWidth : 0,
      viewer : 'internal',
      viewerDisplayLogo : false,
      imageTransition : 'slide',
      viewerToolbar : {position : 'bottom', style : 'innerImage', autoMinimize:800},
      thumbnailAlignment : 'center',
      thumbnailWidth : 230,
      thumbnailHeight : 154,
      thumbnailGutterWidth : 2,
      thumbnailGutterHeight : 2,
      thumbnailAdjustLastRowHeight : true,
      thumbnailFeatured : false,
      thumbnailHoverEffect : null,
      thumbnailLabel : {position : 'overImageOnBottom', display : true, displayDescription : true, titleMaxLength : 0, descriptionMaxLength : 0, hideIcons : false, title : '', itemsCount : '' },
      thumbnailDisplayInterval : 30,
      thumbnailDisplayTransition : true,
      thumbnailLazyLoad : false,
      thumbnailLazyLoadTreshold : 100,
      thumbnailGlobalImageTitle : '',
      thumbnailGlobalAlbumTitle : '',
      thumbnailSizeSM : 480,
      thumbnailSizeME : 992,
      thumbnailSizeLA : 1200,
      thumbnailSizeXL : 1800,
      fnThumbnailInit : null,
      fnThumbnailHoverInit : null,
      fnThumbnailHoverResize : null,
      fnThumbnailHover : null,
      fnThumbnailHoverOut : null,
      fnThumbnailDisplayEffect : null,
      fnViewerInfo : null,
      fnProcessData : null,
      touchAnimation : true,
      touchAutoOpenDelay : 0,
      useTags : false,
      preset : 'none',
      locationHash : false,
      slideshowDelay : 3000,
      slideshowAutoStart : false,
      photoSorting : '',
      albumSorting : '',
      dataSorting : '',
      lazyBuild : 'none',
      lazyBuildTreshold : 150,
      flickrSkipOriginal : true,
      i18n : {
        'breadcrumbHome' : 'Galleries', 'breadcrumbHome_FR' : 'Galeries',
        'paginationPrevious' : 'Previous', 'paginationPrevious_FR' : 'Pr&eacute;c&eacute;dent', 'paginationPrevious_DE' : 'Zur&uuml;ck', 'paginationPrevious_IT' : 'Indietro',
        'paginationNext' : 'Next', 'paginationNext_FR' : 'Suivant', 'paginationNext_DE' : 'Weiter', 'paginationNext_IT' : 'Avanti',
        'thumbnailLabelItemsCountPart1' : '| ',
        'thumbnailLabelItemsCountPart2' : ' photos', 'thumbnailLabelItemsCountPart2_DE' : ' Fotos',
        'thumbnailImageTitle' : '',
        'thumbnailAlbumTitle' : '',
        'thumbnailImageDescription' : '',
        'thumbnailAlbumDescription' : '',
        'infoBoxPhoto' : 'Photo',
        'infoBoxDate' : 'Date',
        'infoBoxAlbum' : 'Album',
        'infoBoxDimensions' : 'Dimensions',
        'infoBoxFilename' : 'Filename',
        'infoBoxFileSize' : 'File size',
        'infoBoxCamera' : 'Camera',
        'infoBoxFocalLength' : 'Focal length',
        'infoBoxExposure' : 'Exposure',
        'infoBoxFNumber' : 'F Number',
        'infoBoxISO' : 'ISO',
        'infoBoxMake' : 'Make',
        'infoBoxFlash' : 'Flash',
        'infoBoxViews' : 'Views',
        'infoBoxComments' : 'Comments'
      }
    }, options );

    return this.each( function () {
      var myGallery_obj = new myGallery();
      myGallery_obj.Initiate(this, settings );
    });
  };
}( jQuery ));


// Script

function myGallery() {
    var g_i18nTranslations = {'paginationPrevious':'Previous', 'paginationNext':'Next', 'breadcrumbHome':'List of Albums', 'thumbnailImageTitle':'', 'thumbnailAlbumTitle':'', 'thumbnailImageDescription':'', 'thumbnailAlbumDescription':'' };
    var gO = null,
    gI = [],                  
    $gE = { 
      base: null,             
      conTnParent: null,      
      conLoadingB: null,      
      conConsole: null,       
      conTn: null,            
      conTnHid: null,         
      conPagin: null,         
      conBC: null,            
      conNavB: null,          
      conNavBCon: null,       
      conNavBFullpage: null,  
      conVwCon: null,         
      conVw: null,            
      conVwTb: null,          
      vwImgP: null,           
      vwImgN: null,           
      vwImgC: null,           
      vwContent: null,        
      vwLogo: null            
    },
    $currentTouchedThumbnail = null,
    g_baseEltID = null,
    g_containerTags = null,
    g_containerNavigationbarContDisplayed = false,
    g_containerViewerDisplayed = false,
    g_containerThumbnailsDisplayed = false,
    g_tn = {                      
      displayInterval: 30,
      lazyLoadTreshold: 100,
      scale: 1,
      borderWidth: 0,               
      borderHeight: 0,              
      imgcBorderHeight: 0,          
      imgcBorderWidth:0 ,           
      labelHeight: 0,               
      outerWidth: {                 // default thumbnail outerWidths (not used in case thumbnailWidth='auto'
        l1 : { xs:0, sm:0, me:0, la:0, xl:0 }, lN : { xs:0, sm:0, me:0, la:0, xl:0 } 
      },
      outerHeight: {                // default thumbnail outerHeights (not used in case thumbnailHeight='auto'
        l1 : { xs:0, sm:0, me:0, la:0, xl:0 }, lN : { xs:0, sm:0, me:0, la:0, xl:0 }
      },
      settings: {                   // user defined width/height to display depending on the screen size
        width: {  l1 : { xs:0, sm:0, me:0, la:0, xl:0, xsc:'u', smc:'u', mec:'u', lac:'u', xlc:'u' },
                  lN : { xs:0, sm:0, me:0, la:0, xl:0, xsc:'u', smc:'u', mec:'u', lac:'u', xlc:'u' } },
        height: { l1 : { xs:0, sm:0, me:0, la:0, xl:0, xsc:'u', smc:'u', mec:'u', lac:'u', xlc:'u' }, 
                  lN : { xs:0, sm:0, me:0, la:0, xl:0, xsc:'u', smc:'u', mec:'u', lac:'u', xlc:'u' } }
      }
    },
    g_tnHE = [],
    g_blackList = null,
    g_whiteList = null,
    g_albumList = null,
    g_galleryItemsCount = 0,
    g_playSlideshow = false,
    g_toolbarVisible = true,
    g_playSlideshowTimerID = 0,
    g_slideshowDelay = 3000,
    g_touchAutoOpenDelayTimerID = 0,
    g_supportFullscreenAPI = false,
    g_viewerIsFullscreen = false,
    g_i18nLang = '',
    g_timeImgChanged = 0,
    g_timeLastTouchStart = 0,
    g_pgMaxNbThumbnailsPerRow = 1,
    g_pgMaxLinesPerPage = 0,
    g_lastOpenAlbumID = -1,
    g_lastLocationHash = '',
    g_viewerImageIsChanged = false,
    g_viewerResizeTimerID = -1,
    g_viewerCurrentItemIdx = -1,
    g_imageSwipePosX = 0,
    g_albumIdxToOpenOnViewerClose = -1,
    g_custGlobals = {},
g_thumbSize = 0,
    g_delayedAlbumIdx = -1,
    g_curAlbumIdx = -1,
    g_delayedSetLocationHash = false,
    g_viewerSwipe = null,
    g_aengine = 'animate',
    g_scrollTimeOut = 0,
    g_scrollTimeOut2 = 0,
    g_maxAlbums = 1000000,
    g_maxPhotos = 1000000,
    g_curNavLevel = 'l1',
    g_curWidth = 'me',
    g_gallerySwipeInitDone = false,
    g_emptyGif = 'data:image/gif;base64,R0lGODlhEAAQAIAAAP///////yH5BAEKAAEALAAAAAAQABAAAAIOjI+py+0Po5y02ouzPgUAOw==',
    g_CSStransformName = FirstSupportedPropertyName(["transform", "msTransform", "MozTransform", "WebkitTransform", "OTransform"]),
    g_CSStransformStyle = FirstSupportedPropertyName(["transformStyle", "msTransformStyle", "MozTransformStyle", "WebkitTransformStyle", "OTransformStyle"]),
    g_CSSperspective = FirstSupportedPropertyName(["perspective", "msPerspective", "MozPerspective", "WebkitPerspective", "OPerspective"]),
    g_CSSbackfaceVisibilityName = FirstSupportedPropertyName(["backfaceVisibility", "msBackfaceVisibility", "MozBackfaceVisibility", "WebkitBackfaceVisibility", "OBackfaceVisibility"]),
    g_CSStransitionName = FirstSupportedPropertyName(["transition", "msTransition", "MozTransition", "WebkitTransition", "OTransition"]),
    g_CSSanimationName = FirstSupportedPropertyName(["animation", "msAnimation", "MozAnimation", "WebkitAnimation", "OAnimation"]);
    

    /* IE detection */
    var g_IE = (function() {
      if (document.documentMode) {
        return document.documentMode;
      }
      else {
        for (var i = 7; i > 4; i--) {
          var div = document.createElement("div");
          div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";
          if (div.getElementsByTagName("span").length) {
            div = null;
            return i;
          }
        }
      }
      return undefined;
    })();
    var g_iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
    var g_isGingerbread =/Android 2\.3\.[3-7]/i.test(navigator.userAgent),
    g_openNoDelay=false;

    
  
    
  // Color schemes - Gallery
  var g_colorScheme_default = {
    navigationbar : { background:'none', borderTop:'1px solid #555', borderBottom:'1px solid #555', borderRight:'', borderLeft:'', color:'#ccc', colorHover:'#fff' },
    thumbnail : { background:'#000', border:'1px solid #000', labelBackground:'rgba(34, 34, 34, 0.75)', titleColor:'#eee', titleShadow:'', descriptionColor:'#ccc', descriptionShadow:''}
  };


  // Color schemes - lightbox
  var g_colorSchemeViewer_default = {
    background:'#000', imageBorder:'4px solid #000', imageBoxShadow:'#888 0px 0px 0px', barBackground:'rgba(4, 4, 4, 0.7)', barBorder:'0px solid #111', barColor:'#eee', barDescriptionColor:'#aaa'
    //background:'rgba(1, 1, 1, 0.75)', imageBorder:'4px solid #f8f8f8', imageBoxShadow:'#888 0px 0px 20px', barBackground:'rgba(4, 4, 4, 0.7)', barBorder:'0px solid #111', barColor:'#eee', barDescriptionColor:'#aaa'
  },
  g_colorSchemeViewer_dark = {
    background:'rgba(1, 1, 1, 0.75)', imageBorder:'4px solid #f8f8f8', imageBoxShadow:'#888 0px 0px 20px', barBackground:'rgba(4, 4, 4, 0.7)', barBorder:'0px solid #111', barColor:'#eee', barDescriptionColor:'#aaa'
  };
  

  // class to store one item (= one thumbnail)
  var NGItems = (function () {
    var nextId = 1;                   // private static --> all instances

    // constructor
    function NGItems( paramTitle, paramID ) {
      var ID = 0;                     // private

      // public (this instance only)
      if( paramID === undefined || paramID === null ) {
        ID = nextId++;
      }
      else {
        ID = paramID;
      }
      this.GetID = function () { return ID; };
      
      // public
      this.title = paramTitle;       
      this.description = '';         
      this.src = '';                  
      this.width = 0;                 
      this.height = 0;                
      this.destinationURL = '';       
      this.kind = '';                 
this.thumbsrc = '';             
      this.thumbX2src = '';           
this.thumbImgWidth = 0;            
this.thumbImgHeight = 0;           
      this.thumbFullWidth = 0;        
      this.thumbFullHeight = 0;       
      this.thumbLabelWidth = 0;
      this.thumbLabelHeight = 0;
      this.thumbSizes = {};           
      this.thumbs = {                 
          url: { l1 : { xs:'', sm:'', me:'', la:'', xl:'' }, lN : { xs:'', sm:'', me:'', la:'', xl:'' } },
          width: { l1 : { xs:0, sm:0, me:0, la:0, xl:0 }, lN : { xs:0, sm:0, me:0, la:0, xl:0 } },
          height: { l1 : { xs:0, sm:0, me:0, la:0, xl:0 }, lN : { xs:0, sm:0, me:0, la:0, xl:0 } }
        }
      this.picasaThumbs = null;         
      this.hovered = false;           
      this.hoverInitDone = false;
      this.$elt = null;               
      this.contentIsLoaded = false;   
      this.contentLength = 0;         
      this.imageNumber = 0;           
      this.eltTransform = {};
      this.albumID = 0;               
      this.paginationLastPage = 0;
      this.paginationLastWidth = 0;
      this.customData = {};
    }

    // public static
    NGItems.get_nextId = function () {
      return nextId;
    };

    // public (shared across instances)
    NGItems.prototype = {
      thumbSetImgHeight: function(h) {              // set thumbnail image real height for current level/resolution, and for all others level/resolutions having the same settings
        var lst=['xs','sm','me','la','xl'];
        for( var i=0; i< lst.length; i++ ) {
          if( g_tn.settings.height.l1[lst[i]] == g_tn.settings.height[g_curNavLevel][g_curWidth] && g_tn.settings.width.l1[lst[i]] == g_tn.settings.width[g_curNavLevel][g_curWidth] ) {
            this.thumbs.height.l1[lst[i]]=h;
          }
        }
        for( var i=0; i< lst.length; i++ ) {
          if( g_tn.settings.height.lN[lst[i]] == g_tn.settings.height[g_curNavLevel][g_curWidth] && g_tn.settings.width.l1[lst[i]] == g_tn.settings.width[g_curNavLevel][g_curWidth] ) {
            this.thumbs.height.lN[lst[i]]=h;
          }
        }
      },
      
      thumbSetImgWidth: function(w) {              // set thumbnail image real width for current level/resolution, and for all others level/resolutions having the same settings
        var lst=['xs','sm','me','la','xl'];
        for( var i=0; i< lst.length; i++ ) {
          if( g_tn.settings.height.l1[lst[i]] == g_tn.settings.height[g_curNavLevel][g_curWidth] && g_tn.settings.width.l1[lst[i]] == g_tn.settings.width[g_curNavLevel][g_curWidth] ) {
            this.thumbs.width.l1[lst[i]]=w;
          }
        }
        for( var i=0; i< lst.length; i++ ) {
          if( g_tn.settings.height.lN[lst[i]] == g_tn.settings.height[g_curNavLevel][g_curWidth] && g_tn.settings.width.l1[lst[i]] == g_tn.settings.width[g_curNavLevel][g_curWidth] ) {
            this.thumbs.width.lN[lst[i]]=w;
          }
        }
      },
    
      thumbImg: function () {   //g_thumbSize
        var tnImg = { src:'', width:0, height:0 };

        if( this.title == 'dummydummydummy' ) {
          tnImg.src=g_emptyGif;
          return tnImg;
        }
        switch(gO.kind) {
          case 'smugmug':
            tnImg.src=this.thumbsrc;
            tnImg.width=this.thumbImgWidth;
            tnImg.height=this.thumbImgHeight;
            break;

          case '':  // inline & API
          case 'flickr':
          case 'picasa':
          default:
            tnImg.src=this.thumbs.url[g_curNavLevel][g_curWidth];
            tnImg.width=this.thumbs.width[g_curNavLevel][g_curWidth];
            tnImg.height=this.thumbs.height[g_curNavLevel][g_curWidth];
            // tnImg.src=itemThumbURL;
            // tnImg.width=this.thumbImgWidth;
            // tnImg.height=this.thumbImgHeight;
            break;
        }
        return tnImg;
      },
      
      // for future use...
      responsiveURL: function () {
        var url = '';
        switch(gO.kind) {
          case '':
            url = this.src;
            break;
          case 'flickr':
            url = this.src;
            break;
          case 'smugmug':
            url = this.src;
            break;
          case 'picasa':
          default:
            url = this.src;
            break;
        }
        return url;
      }
    };
    return NGItems;
  })();

  
    
  // Initialization
  this.Initiate = function( element, params ) {
    "use strict";
    gO = params;
    $gE.base = jQuery(element);
    g_baseEltID = $gE.base.attr('id');
    
 
    if (!Function.prototype.bind) {
      Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {

          throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1), 
            fToBind = this, 
            fNOP = function () {},
            fBound = function () {
              return fToBind.apply(this instanceof fNOP && oThis
                     ? this
                     : oThis,
                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
      };
    }
    
    // detect the animation engine
    // default is jQuery
    if( toType(jQuery.velocity) == 'object' ) {
      // Velocity.js
      g_aengine='velocity';
    }
    else
      // Transit.js
      // if( jQuery.support.transition ) {    // conflict with bootstrap
      if( toType(jQuery.transit) == 'object' ) {
        g_aengine='transition';
      }
  
    // Set theme and colorScheme
    jQuery(element).addClass('myGallery_theme_'+gO.theme);
    SetColorScheme(element);

    // Hide icons (thumbnails and breadcrumb)
    if( gO.thumbnailLabel.hideIcons ) {
      var s1 = '.myGallery_thumbnails_icons_off ',
      s = s1+'.myGalleryContainer .myGalleryThumbnailContainer .labelImageTitle:before { display:none !important; }'+'\n';
      s += s1+'.myGalleryContainer .myGalleryThumbnailContainer .labelFolderTitle:before { display:none !important; }'+'\n';
      jQuery('head').append('<style>'+s+'</style>');
      jQuery(element).addClass('myGallery_thumbnails_icons_off');
    }
    if( gO.galleryToolbarHideIcons ) {
      var s1 = '.myGallery_breadcrumb_icons_off ',
      s=s1+'.myGalleryNavigationbar .folderHome:before { display:none !important; }'+'\n';
      s += s1+'.myGalleryNavigationbar .folder:before { display:none !important; }'+'\n';
      jQuery('head').append('<style>'+s+'</style>');
      jQuery(element).addClass('myGallery_breadcrumb_icons_off');
    }


    if( gO.thumbnailLabel.align == 'right' ) {
      var s1 = '.myGallery_thumbnails_label_align_right ',
      s = s1+'.myGalleryContainer .myGalleryThumbnailContainer .labelImage { text-align : right !important; }'+'\n';
      jQuery('head').append('<style>'+s+'</style>');
      jQuery(element).addClass('myGallery_thumbnails_label_align_right');
    }

    if( gO.thumbnailLabel.align == 'center' ) {
      var s1 = '.myGallery_thumbnails_label_align_center ',
      s = s1+'.myGalleryContainer .myGalleryThumbnailContainer .labelImage { text-align : center !important; }'+'\n';
      jQuery('head').append('<style>'+s+'</style>');
      jQuery(element).addClass('myGallery_thumbnails_label_align_center');
    }
      
    if( gO.thumbnailLabel.align == 'left' ) {
      var s1 = '.myGallery_thumbnails_label_align_left ',
      s = s1+'.myGalleryContainer .myGalleryThumbnailContainer .labelImage { text-align : left !important; }'+'\n';
      jQuery('head').append('<style>'+s+'</style>');
      jQuery(element).addClass('myGallery_thumbnails_label_align_left');
    }

    // Build the gallery structure - add the containers
    $gE.conNavBCon=jQuery('<div class="myGalleryNavigationbarContainer"></div>').appendTo(element);
    $gE.conNavBCon.hide();//css('visibility','hidden');
    $gE.conNavB=jQuery('<div class="myGalleryNavigationbar"></div>').appendTo($gE.conNavBCon);
    $gE.conBC=jQuery('<div class="myGalleryBreadcrumb"></div>').appendTo($gE.conNavB);
    $gE.conLoadingB=jQuery('<div class="myGalleryLBar" style="visibility:hidden;"><div></div><div></div><div></div><div></div><div></div></div>').appendTo(element);
    $gE.conTnParent=jQuery('<div class="myGalleryContainerParent"></div>').appendTo(element);
    $gE.conTn=jQuery('<div class="myGalleryContainer"></div>').appendTo($gE.conTnParent);
    $gE.conConsole=jQuery('<div class="myGalleryConsoleParent"></div>').appendTo(element);
    switch( gO.thumbnailAlignment ) {
      case 'left':
        $gE.conTnParent.css({'text-align':'left'});
        $gE.conNavBCon.css({'margin-left':0 });
        break;
      case 'right':
        $gE.conTnParent.css({'text-align':'right'});
        $gE.conNavBCon.css({ 'margin-right':0});
        break;
    }

    jQuery('head').append('<style>.myGalleryHideElement {position: absolute !important; top: -9999px !important; left: -9999px !important;}</style>');
    var t1=jQuery('<div class="myGalleryHideElement '+jQuery(element).attr('class')+'"></div>').appendTo('body'),
    t2=jQuery('<div class="myGalleryContainerParent"></div>').appendTo(t1);
    $gE.conTnHid=jQuery('<div class="myGalleryContainer"></div>').appendTo(t2);

    // check parameters consistency
    checkPluginParameters();

    //if( g_pgMaxLinesPerPage > 0 ) {
      $gE.conPagin=jQuery('<div class="myGalleryPagination"></div>').appendTo($gE.conTnParent);
    //}
    var t= new userEventsGallery($gE.conTn[0]);

    // i18n translations
    i18n();

    // fullscreen API support
    if( document.fullscreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled || document.mozFullScreenEnabled) {
      g_supportFullscreenAPI=true;
    } else {
      nanoConsoleLog('Your browser does not support the fullscreen API. Fullscreen button will not be displayed.');
    }
    
    // cache some elements sizes of the thumbnail
    retrieveThumbnailSizes();
    
    // lazy build the gallery
    if( gO.lazyBuild != 'loadData' ) { NGFinalize(); }
    
    // GLOBAL EVENT MANAGEMENT
    // Page resize
    var g_resizeTimeOut=0;
    jQuery(window).resize(function() { 
      if(g_resizeTimeOut) clearTimeout(g_resizeTimeOut);
      if( g_containerViewerDisplayed ) {
          ResizeInternalViewer($gE.vwImgC);
      }
      else {
        g_resizeTimeOut = setTimeout(function () {
          var nw=RetrieveCurWidth();
          // if( g_curAlbumIdx != -1 && g_curWidth != nw ) {
          if( g_curAlbumIdx != -1 && 
                ( g_tn.settings.height[g_curNavLevel][g_curWidth] != g_tn.settings.height[g_curNavLevel][nw] || 
                g_tn.settings.width[g_curNavLevel][g_curWidth] != g_tn.settings.width[g_curNavLevel][nw] ) ) {
            // thumbnail size changed --> render gallery
            g_curWidth= nw;
            renderGallery( g_curAlbumIdx, 0 );
          }
          else {
            ResizeGallery();
          }
          return;
        }, 50);
      }
    });
    
    // Event page scrolled
    jQuery(window).on('scroll', function () {
      if(g_scrollTimeOut) clearTimeout(g_scrollTimeOut);
      g_scrollTimeOut = setTimeout(function () {

        if( gO.lazyBuild == 'loadData' ) {
          if( inViewportVert($gE.conTnParent,gO.lazyBuildTreshold) ){
            gO.lazyBuild='none';
            NGFinalize();
          }
        }
      
        if( g_delayedAlbumIdx != -1 ) {
          if( inViewportVert($gE.conTnParent,gO.lazyBuildTreshold) ){
          DisplayAlbumFinalize( g_delayedAlbumIdx, g_delayedSetLocationHash );
          }
        }
        
        thumbnailsLazySetSrc();
        return;
      }, 200);
    });
    
    
    $gE.base.on('scroll', function () {
      if(g_scrollTimeOut2) clearTimeout(g_scrollTimeOut2);
      g_scrollTimeOut2 = setTimeout(function () {
        thumbnailsLazySetSrc();
      }, 200);
    });

  }
  

  
  function ExposedObjects() {
    return {
      animationEngine:g_aengine,
      t:'test'
    };
  }
  
  
  function FirstSupportedPropertyName(prefixedPropertyNames) {
    var tempDiv = document.createElement("div");
    for (var i = 0; i < prefixedPropertyNames.length; ++i) {
      if (typeof tempDiv.style[prefixedPropertyNames[i]] != 'undefined')
        return prefixedPropertyNames[i];
    }
    return null;
  }

  function NGFinalize() {
  
    var sizeImageMax=Math.max(window.screen.width, window.screen.height);

		for( var j=0; j<g_tnHE.length; j++) {
			switch(g_tnHE[j].name ) {
				case 'imageScale150':
				case 'imageScale150Outside':
				case 'imageScaleIn80':
				case 'imageSlide2Up':
				case 'imageSlide2Down':
				case 'imageSlide2Left':
				case 'imageSlide2Right':
				case 'imageSlide2UpRight':
				case 'imageSlide2UpLeft':
				case 'imageSlide2DownRight':
				case 'imageSlide2DownLeft':
				case 'imageSlide2Random':
          g_tn.scale=Math.max(g_tn.scale, 1.5);
					break;
				case 'scale120':
          g_tn.scale=Math.max(g_tn.scale, 1.2);
					break;
			}
		}
    
    switch(gO.kind) {
      // MARKUP / API
      case '':
        NGAddItem(g_i18nTranslations.breadcrumbHome, '', '', '', '', 'album', '', '0', '-1' );
        if( gO.itemsBaseURL.length >0 ) {gO.itemsBaseURL+='/';}
        if( gO.items !== undefined && gO.items !== null ) {
          ProcessItemOption();
          if( !ProcessLocationHash(false) ) {
            DisplayAlbum(0,false);
          }
        }
        else {
          var elements=jQuery($gE.base).children('a');
          if( elements.length > 0 ) {
            ProcessHREF(elements);
            if( !ProcessLocationHash(false) ) {
              DisplayAlbum(0,false);
            }
          }
          else
            nanoAlert('error: no image to process.');
        }
        break;
      
      
      case 'picasa':
      default:
        if( gO.album.length > 0 ) {
          var p=gO.album.indexOf('&authkey=');
          if( p >= 0 ) {
            var albumId=gO.album.substring(0,p),
            opt=gO.album.substring(p);
            if( opt.indexOf('Gv1sRg') == -1 ) {
              opt='&authkey=Gv1sRg'+opt.substring(9);
            }
            var newItem=NGAddItem(g_i18nTranslations.breadcrumbHome, '', '', '', '', 'album', '', albumId, '-1' );
            newItem.customData.authkey=opt;
          }
          else {
            NGAddItem(g_i18nTranslations.breadcrumbHome, '', '', '', '', 'album', '', gO.album, '-1' );
          }
          
          
        }
        else {
          NGAddItem(g_i18nTranslations.breadcrumbHome, '', '', '', '', 'album', '', '0', '-1' );
        }
        PicasaProcessItems(0,true,-1,false);
        break;
    }



    // browser back-button to close the image currently displayed
    jQuery(window).bind( 'hashchange', function( event ) {

      if( gO.locationHash ) {
        ProcessLocationHash(true);
      }
      return;
      
    });
    
    // gallery fullpage
    if( gO.galleryFullpageButton ) {
      $gE.conNavBFullpage =jQuery('<div class="myGalleryFullpage setFullPageButton"></div>').appendTo($gE.conNavB);
      $gE.conNavBFullpage.on('click', function(e){
        if( $gE.conNavBFullpage.hasClass('setFullPageButton') ) {
          // switch to fullpage display mode
          if( gO.maxWidth > 0 ) { 
            jQuery($gE.base).css({'maxWidth':''});
          }
          $gE.conNavBFullpage.removeClass('setFullPageButton').addClass('removeFullPageButton');
          setElementOnTop('', $gE.base);
          $gE.base.addClass('fullpage');
          jQuery('body').css({overflow:'hidden'});
          ResizeGallery();
        }
        else {
          // normal display
          $gE.conNavBFullpage.removeClass('removeFullPageButton').addClass('setFullPageButton');
          if( gO.maxWidth > 0 ) { 
            jQuery($gE.base).css({'maxWidth':gO.maxWidth});
          }
          $gE.base.removeClass('fullpage');
          jQuery('body').css({overflow:'inherit'});
          ResizeGallery();
        }
      });
     }
    
  }
  
  function ElementTranslateX( element, posX ) {
    jQuery(element).css({ 'left': posX }); 
    

  }
  
  // My Code




  //Not my code
  // based on "Implement Custom Gestures" from Google
  // https://developers.google.com/web/fundamentals/input/touch-input/touchevents/
  function userEventsGallery(element) {
    var elementToSwipe=element,
    isAnimating=false,
    initialTouchPos=null,
    lastTouchPos=null,
    currentXPosition=0,
    onlyX=false,
    startViewport=null;
    
    var initialViewport=0;
    
    // Handle the start of gestures -->  click event
    this.handleGestureStartNoDelay = function(e) {
      // delay to ignore click event after touchstart event
      if( g_containerViewerDisplayed ) { return; }
      if( (new Date().getTime()) - g_timeLastTouchStart < 400 ) { return; }
      g_openNoDelay=true;
      this.handleGestureStart(e);
    }.bind(this);
    
    // Handle the start of gestures
    this.handleGestureStart = function(e) {
      if( g_containerViewerDisplayed ) { return; }

      //e.preventDefault();
      
      if( (new Date().getTime()) - g_timeLastTouchStart < 400 ) { return; }
      g_timeLastTouchStart=new Date().getTime();
      var target = e.target || e.srcElement;
      var found=false;
      while( target != $gE.conTn[0] ) {       // go element parent up to find the thumbnail element
        if( target.getAttribute('class') == 'myGalleryThumbnailContainer' ) {
          // if( $currentTouchedThumbnail != jQuery(target) ) {
          if( $currentTouchedThumbnail != null && !$currentTouchedThumbnail.is(jQuery(target)) ) {
            ThumbnailHoverOutAll();
          }
          $currentTouchedThumbnail=jQuery(target);
          found=true;
          //return;
        }
        target = target.parentNode;
      }
      //$currentTouchedThumbnail=null;
      
      if( !found ) { return; }
      
      initialViewport=getViewport();
      
      //if(e.touches && e.touches.length > 1) { return; }
      initialTouchPos = getGesturePointFromEvent(e);

      initialOffsetTop=getViewport().t;

      //if( g_gallerySwipeInitDone ) { return; }
      
      // Add the move and end listeners
      if (window.navigator.msPointerEnabled) {
        // Pointer events are supported.
        document.addEventListener('MSPointerMove', this.handleGestureMove, true);
        document.addEventListener('MSPointerUp', this.handleGestureEnd, true);
      } else {
        // Add Touch Listeners
        document.addEventListener('touchmove', this.handleGestureMove, true);
        document.addEventListener('touchend', this.handleGestureEnd, true);
        document.addEventListener('touchcancel', this.handleGestureEnd, true);
      
        // Add Mouse Listeners
        document.addEventListener('mousemove', this.handleGestureMove, true);
        document.addEventListener('mouseup', this.handleGestureEnd, true);
      }
      
      // makes content unselectable --> avoid image drag during 'mouse swipe'
      $gE.base.addClass('unselectable').find('*').attr('draggable', 'false').attr('unselectable', 'on');
      g_gallerySwipeInitDone=true;
      
    }.bind(this);
    
    // Handle move gestures
    this.handleGestureMove = function (e) {
      //e.preventDefault(); // --> uncomment this to avoid viewport scrolling on touchscreen
      lastTouchPos = getGesturePointFromEvent(e);
      
      if( isAnimating ) { return; }

      if( g_pgMaxLinesPerPage > 0 && g_tn.settings.height[g_curNavLevel][g_curWidth] != 'auto' && g_tn.settings.width[g_curNavLevel][g_curWidth] != 'auto' ) {
        var differenceInX = initialTouchPos.x - lastTouchPos.x;
        if( Math.abs(differenceInX) > 15 || onlyX ) {
          e.preventDefault(); // if swipe horizontaly the gallery, avoid moving page also
          onlyX=true;
          isAnimating = true;
          window.requestAnimFrame(onAnimFrame);
        }
      }

    }.bind(this);

    
    // Handle end gestures
    this.handleGestureEnd = function(e) {
      e.preventDefault();

      // if(e.touches && e.touches.length > 0) {
      //   return;
      // }
      isAnimating = false;
      onlyX=false;
      
      // Remove Event Listeners
      if (window.navigator.msPointerEnabled) {
        // Remove Pointer Event Listeners
        document.removeEventListener('MSPointerMove', this.handleGestureMove, true);
        document.removeEventListener('MSPointerUp', this.handleGestureEnd, true);
      } else {
        // Remove Touch Listeners
        document.removeEventListener('touchmove', this.handleGestureMove, true);
        document.removeEventListener('touchend', this.handleGestureEnd, true);
        document.removeEventListener('touchcancel', this.handleGestureEnd, true);
      
        // Remove Mouse Listeners
        document.removeEventListener('mousemove', this.handleGestureMove, true);
        document.removeEventListener('mouseup', this.handleGestureEnd, true);
      }

      // allow text + image selection again
      $gE.base.addClass('unselectable').find('*').attr('draggable', 'true').attr('unselectable', 'off');

      updateSwipeRestPosition();
    }.bind(this);
    
    function OpenTouchedThumbnail() {
      currentXPosition=0;
      initialTouchPos=null;
      lastTouchPos=null;
      ElementTranslateX($gE.conTn[0],0);
      
      if( g_containerViewerDisplayed ) {
        $currentTouchedThumbnail=null;
        g_openNoDelay=false;
      }
      else {
        if( $currentTouchedThumbnail != null ) {
          
          if( Math.abs(initialViewport.t-getViewport().t) > 10 ) {
            // viewport has been scrolled (touchscreen)--> open is cancelled
            $currentTouchedThumbnail=null;
            g_openNoDelay=false;
            return;
          }
          
          var $t=$currentTouchedThumbnail;
          var n=$t.data('index');
          if( n == undefined ) { return; }
          
          if( gO.touchAnimation && !g_openNoDelay ) {
            // automatically opens the touched thumbnail (to disply an image or to open an album)
            if( gO.touchAutoOpenDelay > 0 ) { 
              ThumbnailHoverOutAll();
              ThumbnailHover($t);
              window.clearInterval(g_touchAutoOpenDelayTimerID);
              g_touchAutoOpenDelayTimerID=window.setInterval(function(){
                window.clearInterval(g_touchAutoOpenDelayTimerID);
                if( Math.abs(initialViewport.t-getViewport().t) > 10 ) {
                  // viewport has been scrolled after hover effect delay (touchscreen)--> open is cancelled
                  g_openNoDelay=false;
                  $currentTouchedThumbnail=null;
                  ThumbnailHoverOut($t);
                }
                else {
                  OpenThumbnail(n);
                }
              }, gO.touchAutoOpenDelay);
            }
            else {
              // 2 touch scenario
              if( !gI[n].hovered ) {
                // first touch
                ThumbnailHoverOutAll();
                ThumbnailHover($t);
              }
              else {
                // second touch
                OpenThumbnail(n);
              }
            }
          }
          else {
            OpenThumbnail(n);
          }

        }
        else {
          g_openNoDelay=false;
        }
      }
      return;
    }
    
    function updateSwipeRestPosition() {

      if( lastTouchPos == null || initialTouchPos == null ) {      // touchend without touchmove
        // currentXPosition=0;
        // initialTouchPos=null;
        OpenTouchedThumbnail();
        return;
      }

      var differenceInX = initialTouchPos.x - lastTouchPos.x;
      var differenceInY = initialTouchPos.y - lastTouchPos.y;
      currentXPosition = currentXPosition - differenceInX;
      if( g_pgMaxLinesPerPage > 0 && g_tn.settings.height[g_curNavLevel][g_curWidth] != 'auto' && g_tn.settings.width[g_curNavLevel][g_curWidth] != 'auto' ) {
        // pagination
        if( Math.abs(differenceInX) > 30) {
          $currentTouchedThumbnail=null;
          currentXPosition=0;
          initialTouchPos=null;
          lastTouchPos=null;
          ThumbnailHoverOutAll();
          if( differenceInX < -30 ) {
            paginationPreviousPage();
          }
          else {
            paginationNextPage();
          }
        }
        else {
          OpenTouchedThumbnail();
        }
      }
      else {
        // no pagination
        OpenTouchedThumbnail();
      }

      // currentXPosition=0;
      // initialTouchPos=null;
      // lastTouchPos=null;
      // $currentTouchedThumbnail=null;
        
      return;
    }

    function getGesturePointFromEvent(e) {
      var point = {};

      if(e.targetTouches) {
        point.x = e.targetTouches[0].clientX;
        point.y = e.targetTouches[0].clientY;
      } else {
        // Either Mouse event or Pointer Event
        point.x = e.clientX;
        point.y = e.clientY;
      }

      return point;
    }
    
    function onAnimFrame() {
      if(!isAnimating) { return; }
      
      if( g_pgMaxLinesPerPage > 0 && g_tn.settings.height[g_curNavLevel][g_curWidth] != 'auto' && g_tn.settings.width[g_curNavLevel][g_curWidth] != 'auto'  ) {
        var differenceInX = initialTouchPos.x - lastTouchPos.x;
        ElementTranslateX(elementToSwipe,currentXPosition - differenceInX);
      }

      isAnimating = false;
    }

    
    // Check if pointer events are supported.
    if (window.navigator.msPointerEnabled) {
    // Add Pointer Event Listener
      elementToSwipe.addEventListener('MSPointerDown', this.handleGestureStartNoDelay, true);
    }
    else {
      // Add Touch Listener
      elementToSwipe.addEventListener('touchstart', this.handleGestureStart, true);
      
      // Add Mouse Listener
      if( !g_iOS ) {
        elementToSwipe.addEventListener('mousedown', this.handleGestureStartNoDelay, true);
      }
    }
    
    // MOUSE OVER
    elementToSwipe.addEventListener('mouseenter', ThumbnailOnMouseenter, true);
    elementToSwipe.addEventListener('mouseleave', ThumbnailOnMouseleave, true);
    
  }

  function ThumbnailOnMouseenter(e) {
  if( g_containerViewerDisplayed ) { return; }
    var target = e.target || e.srcElement;
    if( target.getAttribute('class') == 'myGalleryThumbnailContainer' ) {
      //if( $currentTouchedThumbnail == null ) {
        ThumbnailHover(jQuery(target));
      //}
    }
  }
  function ThumbnailOnMouseleave(e) {
    var target = e.target || e.srcElement;
    if( target.getAttribute('class') == 'myGalleryThumbnailContainer' ) {
      ThumbnailHoverOut(jQuery(target));
    }
  }


  // Shim for requestAnimationFrame from Paul Irishpaul ir
  // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/ 
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
  })();

  
  // Check Plugin
  function checkPluginParameters() {

    if( gO.viewer == 'fancybox' ) {
      if( typeof(jQuery.fancybox) === 'undefined' ) {
        gO.viewer = 'internal';
        nanoConsoleLog('Fancybox could not be found. Fallback to internal viewer. Please check the file includes of the page.');
      }
    }

    if( gO.userID.toUpperCase() == 'CBRISBOIS@GMAIL.COM' || gO.userID == '111186676244625461692' ) {
      if( gO.blackList == '' || gO.blackList.toUpperCase() == 'SCRAPBOOK|PROFIL' ) { gO.blackList='profil|scrapbook|forhomepage'; }
    }
    
    if( gO.blackList != '' ) { g_blackList=gO.blackList.toUpperCase().split('|'); }
    if( gO.whiteList != '' ) { g_whiteList=gO.whiteList.toUpperCase().split('|'); }
    if( gO.albumList != '' ) { g_albumList=gO.albumList.toUpperCase().split('|'); }

    if( gO.kind == 'picasa' || gO.kind == 'flickr' || gO.kind == 'smugmug' ) {
      gO.displayBreadcrumb=true;
    }
    
    

    if( gO.maxWidth > 0 ) { 
      jQuery($gE.base).css({'maxWidth':gO.maxWidth});
      jQuery($gE.base).css({'margin-left':'auto'});
      jQuery($gE.base).css({'margin-right':'auto'});
    }
  
    if( toType(gO.slideshowDelay) == 'number' && gO.slideshowDelay >= 2000 ) {
      g_slideshowDelay=gO.slideshowDelay;
    }
    else {
      nanoConsoleLog('Parameter "slideshowDelay" must be an integer >= 2000 ms.');
    }

    if( toType(gO.thumbnailDisplayInterval) == 'number' && gO.thumbnailDisplayInterval >= 0 ) {
      g_tn.displayInterval=gO.thumbnailDisplayInterval;
    }
    else {
      nanoConsoleLog('Parameter "thumbnailDisplayInterval" must be an integer.');
    }

    if( toType(gO.thumbnailLazyLoadTreshold) == 'number' && gO.thumbnailLazyLoadTreshold >= 0 ) {
      g_tn.lazyLoadTreshold=gO.thumbnailLazyLoadTreshold;
    }
    else {
      nanoConsoleLog('Parameter "thumbnailLazyLoadTreshold" must be an integer.');
    }

    if( toType(gO.paginationMaxLinesPerPage) == 'number' && gO.paginationMaxLinesPerPage >= 0 ) {
      g_pgMaxLinesPerPage=gO.paginationMaxLinesPerPage;
    }
    else {
      nanoConsoleLog('Parameter "paginationMaxLinesPerPage" must be an integer.');
    }

    /*
    if( SettingsGetTnHeight() == 'auto' || SettingsGetTnWidth() == 'auto' ) {
      if( gO.paginationMaxLinesPerPage >0 ) {
        nanoConsoleLog('Parameters "paginationMaxLinesPerPage" and "thumbnailWidth/thumbnailHeight" value "auto" are not compatible.');
      }
      g_pgMaxLinesPerPage=0;

    }
    */
    
    // random sorting
    var s1=gO.albumSorting.toUpperCase();
    if( s1.indexOf('RANDOM') == 0 && s1.length > 6 ) {
      n= parseInt(s1.substring(6));
      if( n > 0 ) {
        g_maxAlbums=n;
      }
      gO.albumSorting='random';
    }
    var s2=gO.photoSorting.toUpperCase();
    if( s2.indexOf('RANDOM') == 0 && s2.length > 6 ) {
      n= parseInt(s2.substring(6));
      if( n > 0 ) {
        g_maxPhotos=n;
      }
      gO.photoSorting='random';
    }

    
    // thumbnails hover effects
    switch( toType(gO.thumbnailHoverEffect) ) {
      case 'string':
        var tmp=gO.thumbnailHoverEffect.split(',');
        for(var i=0; i<tmp.length; i++) {
          if( tmp[i] != 'none' && isAEngineSupported(tmp[i]) ) {
            var oDef=NewTHoverEffect();
            oDef.name=tmp[i];
            g_tnHE.push(oDef);
          }
        }
        break;
      case 'object':
        if( gO.thumbnailHoverEffect.name != 'none' && isAEngineSupported(gO.thumbnailHoverEffect.name) ) {
          var oDef=NewTHoverEffect();
          g_tnHE.push(jQuery.extend(oDef,gO.thumbnailHoverEffect));
        }
        break;
      case 'array':
        for(var i=0; i<gO.thumbnailHoverEffect.length; i++) {
          if( gO.thumbnailHoverEffect[i].name != 'none' && isAEngineSupported(gO.thumbnailHoverEffect[i].name) ) {
            var oDef=NewTHoverEffect();
            g_tnHE.push(jQuery.extend(oDef,gO.thumbnailHoverEffect[i]));
          }
        }
        break;
      case 'null':
        break;
      default:
        nanoAlert('incorrect parameter for "thumbnailHoverEffect".');
    }
    
    if( g_tnHE.length == 0 ) {
      gO.touchAnimation=false;
    }

    // management of screen width
    g_curWidth=RetrieveCurWidth();
    

    
    if( toType(gO.thumbnailWidth) == 'number' ) {
      ThumbnailsDefaultSize( 'width', 'l1', gO.thumbnailWidth, 'u');
      ThumbnailsDefaultSize( 'width', 'lN', gO.thumbnailWidth, 'u');
    }
    else {
      var ws=gO.thumbnailWidth.split(' ');
      var v='auto';
      if( ws[0].substring(0,4) != 'auto' ) { v=parseInt(ws[0]); }
      var c='u';
      if( ws[0].charAt(ws[0].length - 1) == 'C' ) { c='c'; }
      ThumbnailsDefaultSize( 'width', 'l1', v, c );   // default value for all resolutions and navigation levels
      ThumbnailsDefaultSize( 'width', 'lN', v, c );
      for( var i=1; i<ws.length; i++ ) {
        var r=ws[i].substring(0,2).toLowerCase();
        if( /xs|sm|me|la|xl/i.test(r) ) {
          var w=ws[i].substring(2);
          var v='auto';
          if( w.substring(0,4) != 'auto' ) { v=parseInt(w); }
          var c='u';
          if( w.charAt(w.length - 1) == 'C' ) { c='c'; }
          g_tn.settings.width['l1'][r]=v;
          g_tn.settings.width['lN'][r]=v;
          g_tn.settings.width['l1'][r+'c']=c;
          g_tn.settings.width['lN'][r+'c']=c;
        }
      }
    }
    if( gO.thumbnailL1Width != undefined ) {
      if( toType(gO.thumbnailL1Width) == 'number' ) {
        ThumbnailsDefaultSize( 'width', 'l1', gO.thumbnailL1Width, 'u');
      }
      else {
        var ws=gO.thumbnailL1Width.split(' ');
        var v='auto';
        if( ws[0].substring(0,4) != 'auto' ) { v=parseInt(ws[0]); }
        var c='u';
        if( ws[0].charAt(ws[0].length - 1) == 'C' ) { c='c'; }
        ThumbnailsDefaultSize( 'width', 'l1', v, c );
        for( var i=1; i<ws.length; i++ ) {
          var r=ws[i].substring(0,2).toLowerCase();
          if( /xs|sm|me|la|xl/i.test(r) ) {
            var w=ws[i].substring(2);
            var v='auto';
            if( w.substring(0,4) != 'auto' ) { v=parseInt(w); }
            var c='u';
            if( w.charAt(w.length - 1) == 'C' ) { c='c'; }
            g_tn.settings.width['l1'][r]=v;
            g_tn.settings.width['l1'][r+'c']=c;
          }
        }
      }
    }
    
    
    if( toType(gO.thumbnailHeight) == 'number' ) {
      ThumbnailsDefaultSize( 'height', 'l1', gO.thumbnailHeight, 'u');
      ThumbnailsDefaultSize( 'height', 'lN', gO.thumbnailHeight, 'u');
    }
    else {
      var ws=gO.thumbnailHeight.split(' ');
      var v='auto';
      if( ws[0].substring(0,4) != 'auto' ) { v=parseInt(ws[0]); }
      var c='u';
      if( ws[0].charAt(ws[0].length - 1) == 'C' ) { c='c'; }
      ThumbnailsDefaultSize( 'height', 'l1', v, c );   // default value for all resolutions and navigation levels
      ThumbnailsDefaultSize( 'height', 'lN', v, c );
      for( var i=1; i<ws.length; i++ ) {
        var r=ws[i].substring(0,2).toLowerCase();
        if( /xs|sm|me|la|xl/i.test(r) ) {
          var w=ws[i].substring(2);
          var v='auto';
          if( w.substring(0,4) != 'auto' ) { v=parseInt(w); }
          var c='u';
          if( w.charAt(w.length - 1) == 'C' ) { c='c'; }
          g_tn.settings.height['l1'][r]=v;
          g_tn.settings.height['lN'][r]=v;
          g_tn.settings.height['l1'][r+'c']=c;
          g_tn.settings.height['lN'][r+'c']=c;
        }
      }
    }
    if( gO.thumbnailL1Height != undefined ) {
      if( toType(gO.thumbnailL1Height) == 'number' ) {
        ThumbnailsDefaultSize( 'height', 'l1', gO.thumbnailL1Height, 'u');
      }
      else {
        var ws=gO.thumbnailL1Height.split(' ');
        var v='auto';
        if( ws[0].substring(0,4) != 'auto' ) { v=parseInt(ws[0]); }
        var c='u';
        if( ws[0].charAt(ws[0].length - 1) == 'C' ) { c='c'; }
        ThumbnailsDefaultSize( 'height', 'l1', v, c );
        for( var i=1; i<ws.length; i++ ) {
          var r=ws[i].substring(0,2).toLowerCase();
          if( /xs|sm|me|la|xl/i.test(r) ) {
            var w=ws[i].substring(2);
            var v='auto';
            if( w.substring(0,4) != 'auto' ) { v=parseInt(w); }
            var c='u';
            if( w.charAt(w.length - 1) == 'C' ) { c='c'; }
            g_tn.settings.height['l1'][r]=v;
            g_tn.settings.height['l1'][r+'c']=c;
          }
        }
      }
    }
    
    
      
  }
  
  // ##### THUMBNAIL SIZE MANAGEMENT
  function ThumbnailsDefaultSize( dir, level, v, crop ) {
    g_tn.settings[dir][level]['xs']=v;
    g_tn.settings[dir][level]['sm']=v;
    g_tn.settings[dir][level]['me']=v;
    g_tn.settings[dir][level]['la']=v;
    g_tn.settings[dir][level]['xl']=v;
    g_tn.settings[dir][level]['xsc']=crop;
    g_tn.settings[dir][level]['smc']=crop;
    g_tn.settings[dir][level]['mec']=crop;
    g_tn.settings[dir][level]['lac']=crop;
    g_tn.settings[dir][level]['xlc']=crop;
  }
  
  function SettingsGetTnWidth() {
//    console.log('w: '+g_tn.settings.width[g_curNavLevel][g_curWidth]);
    return g_tn.settings.width[g_curNavLevel][g_curWidth];
  }
  function SettingsGetTnHeight() {
    return g_tn.settings.height[g_curNavLevel][g_curWidth];
  }
  
  function ThumbnailOuterWidth() {
    return g_tn.outerWidth[g_curNavLevel][g_curWidth];
  }
  function ThumbnailOuterHeight() {
    return g_tn.outerHeight[g_curNavLevel][g_curWidth];
  }

  function RetrieveCurWidth() {
    var vpW= getViewport().w;
    
    if( gO.thumbnailSizeSM > 0 && vpW < gO.thumbnailSizeSM) { return 'xs'; }
    if( gO.thumbnailSizeME > 0 && vpW < gO.thumbnailSizeME) { return 'sm'; }
    if( gO.thumbnailSizeLA > 0 && vpW < gO.thumbnailSizeLA) { return 'me'; }
    if( gO.thumbnailSizeXL > 0 && vpW < gO.thumbnailSizeXL) { return 'la'; }
    
    return 'xl';
  }
  
  
  // HOVER EFFECTS
  function NewTHoverEffect() {
    // easing : jQuery supports only 'swing' and 'linear'
    var oDef={'delay':0, 'delayBack':0, 'duration':400, 'durationBack':200, 'easing':'swing', 'easingBack': 'swing', 'animParam':null };
    if( g_aengine != 'animate' ) {
      oDef.easing='ease';
      oDef.easingBack='ease';
    }
    return oDef;
  }
  
  // check if effect is compatible to animation engine
  // check also consistency of thumbnail configuration with hover effect
  function isAEngineSupported( effect ) {
    
    // var isBasic = /labelOpacity50|borderLighter|borderDarker/i.test(effect),
    var isBasic = /labelOpacity50|borderLighter|borderDarker/i.test(effect),
    // isStd = /imageFlipVertical|imageFlipHorizontal|imageRotateCornerBR|imageRotateCornerBL|rotateCornerBL|rotateCornerBR|imageScale150|overScale|overScaleOutside|imageScaleIn80|imageScale150Outside|scale120|scaleLabelOverImage|slideUp|slideDown|slideLeft|slideRight|imageSlideUp|imageSlideDown|imageSlideLeft|imageSlideRight|labelAppear|labelAppear75|descriptionAppear|labelSlideDown|labelSlideUp|labelSlideUpTop|imageInvisible|imageOpacity50|descriptionSlideUp|labelSplitVert|labelSplit4|labelAppearSplitVert|labelAppearSplit4|imageSplitVert|imageSplit4|imageSlide2Up|imageSlide2Down|imageSlide2Left|imageSlide2Right|imageSlide2Random|imageSlide2UpRight|imageSlide2UpLeft|imageSlide2DownRight|imageSlide2DownLeft/i.test(effect),
    isStd = /imageFlipVertical|imageFlipHorizontal|imageRotateCornerBR|imageRotateCornerBL|rotateCornerBL|rotateCornerBR|imageScale150|overScale|overScaleOutside|imageScaleIn80|imageScale150Outside|scale120|scaleLabelOverImage|slideUp|slideDown|slideLeft|slideRight|imageSlideUp|imageSlideDown|imageSlideLeft|imageSlideRight|labelAppear|labelAppear75|descriptionAppear|labelSlideDown|labelSlideUp|labelSlideUpTop|imageInvisible|imageOpacity50|descriptionSlideUp|labelSplitVert|labelSplit4|labelAppearSplitVert|labelAppearSplit4|imageSplitVert|imageSplit4/i.test(effect),
    // isAdv = /imageScaleIn80|imageScale150|imageScale150Outside|scale120|overScale|overScaleOutside|scaleLabelOverImage|imageFlipHorizontal|imageFlipVertical|rotateCornerBR|rotateCornerBL|imageRotateCornerBR|imageRotateCornerBL|imageExplode/i.test(effect);
    isAdv = /imageExplode/i.test(effect);

    /* MY CODE USED FOR GALLERY
    
    var gallery /labelAppear75/i.test(effect);
     $( "thumbnail" ).hover(function() {
       $( thumbnail ).fadeTo( "slow", 0.75 );
        });

    var gallery /limageScale150/i.test(effect);
     $( "thumbnail" ).hover(function() {
       $( "#toggle" ).toggle( "scale, 150%" );
        });

    if( gO.thumbnailLabel.position == 'imageScale150|descriptionAppear/i.test(effect);
     $( "thumbnail" ).hover(function() {
       $( thumbnail ).fadeTo( "slow", 0.75 );
        });
        
    */
    
    gO.touchAutoOpenDelay= parseInt(gO.touchAutoOpenDelay);
    if( gO.touchAutoOpenDelay == 0 ) {
      gO.touchAutoOpenDelay=1000;
    }
    

    if( !isBasic && !isStd && !isAdv ) {
      nanoAlert('Unknow parameter value: thumbnailHoverEffect="'+effect+'".');
      return false;
    }
    
    if( gO.thumbnailLabel.position == 'onBottom' && !/borderLighter|borderDarker|imageOpacity50|imageScale150|imageScaleIn80|imageSlide2Up|imageSlide2Down|imageSlide2Left|imageSlide2Right|imageSlide2Random|imageSlide2UpRight|imageSlide2UpLeft|imageSlide2DownRight|imageSlide2DownLeft|imageScale150Outside|scale120/i.test(effect) ) {
      nanoAlert('The parameter combination thumbnailHoverEffect="'+effect+'" and thumbnailLabel.position="onBottom" is not supported.');
      return false;
    }
    
    //if( gO.thumbnailLabel.position == 'overImageOnBottom' && /descriptionSlideUp/i.test(effect) ) {
    //  nanoAlert('The parameter combination thumbnailHoverEffect="'+effect+'" and thumbnailLabel.position="overImageOnBottom" is not supported.');
    //  return false;
    //}
    if( (isAdv && (g_aengine == 'animate' || g_CSStransformName == null) ) ) {
      nanoConsoleLog('Parameter thumbnailHoverEffect="'+effect+'" requires one of the additionals jQuery plugins "Velocity" or "Transit".');
      return false;
    }
    
    return true;
    
  }

  // define text translations
  function i18n() {

    // browser language
    g_i18nLang = (navigator.language || navigator.userLanguage).toUpperCase();
    if( g_i18nLang === 'UNDEFINED') { g_i18nLang=''; }

    var llang=-('_'+g_i18nLang).length;
    
    if( toType(gO.i18n) == 'object' ){
      Object.keys(gO.i18n).forEach(function(key) {
        var s=key.substr(llang);
        if( s == ('_'+g_i18nLang) ) {
          g_i18nTranslations[key.substr(0,key.length-s.length)]=gO.i18n[key];
        } 
        else {
          g_i18nTranslations[key]=gO.i18n[key];
        }
      });
    }
  }
  
  function ProcessLocationHash(eventLocationHash) {

    if( !gO.locationHash ) { return false; }

    var albumID=null,
    imageID=null,
    curGal='#myGallery/'+g_baseEltID+'/',
    hash=location.hash;

    if( hash == g_lastLocationHash ) { return; }
    
    if( hash == '' ) {
      if( g_lastOpenAlbumID != -1 ) {
        // back button and no hash --> display first album
        g_lastLocationHash='';
        OpenAlbum(0,false,-1,false);
      }
    }
    
    if( hash.indexOf(curGal) == 0 ) {
      var s=hash.substring(curGal.length),
      p=s.indexOf('/'),
      albumIdx=-1,
      imageIdx=-1,
      l=gI.length;
      
      if( p > 0 ) {
        albumID=s.substring(0,p);
        imageID=s.substring(p+1);
        for(var i=0; i<l; i++ ) {
          if( gI[i].kind == 'image' && gI[i].GetID() == imageID ) {
            imageIdx=i;
            break;
          }
        }
      }
      else {
        albumID=s;
      }
      for(var i=0; i<l; i++ ) {
        if( gI[i].kind == 'album' && gI[i].GetID() == albumID ) {
          albumIdx=i;
          break;
        }
      }

      if( imageID !== null ) {
        // process IMAGE
        if( !eventLocationHash ) {
          g_albumIdxToOpenOnViewerClose=albumIdx;
        }
        if( gO.kind == '' ) {
          DisplayImage(imageIdx);
        }
        else {
          if( imageIdx == -1 ) {
            OpenAlbum(albumIdx,false,imageID,eventLocationHash);
          }
          else {
            DisplayImage(imageIdx);
          }
        }
        return true;

      }
      else {
        // process ALBUM
        OpenAlbum(albumIdx,false,-1,eventLocationHash);
        return true;
      }
    }
  
    //return {albumID:albID, imageID:imgID};
  }

  // build a dummy thumbnail to get different sizes (--> sizes are cached)
  function retrieveThumbnailSizes() {
    gI=[];

    var desc='';
    if( gO.thumbnailLabel.displayDescription ) { desc='d'; }
    var item=NGAddItem('dummydummydummy', g_emptyGif, g_emptyGif, desc, '', 'image', '', '1', '0' ),
    $newDiv=thumbnailBuild(item, 0, 0, false);

    g_tn.borderWidth=$newDiv.outerWidth(true)-$newDiv.width();
    g_tn.borderHeight=$newDiv.outerHeight(true)-$newDiv.height();

    g_tn.imgcBorderWidth=$newDiv.find('.imgContainer').outerWidth(true)-$newDiv.find('.imgContainer').width();
    g_tn.imgcBorderHeight=$newDiv.find('.imgContainer').outerHeight(true)-$newDiv.find('.imgContainer').height();
    
    g_tn.labelBorderHeight=$newDiv.find('.labelImage').outerHeight(true)-$newDiv.find('.labelImage').height();
    g_tn.labelBorderWidth=$newDiv.find('.labelImage').outerWidth(true)-$newDiv.find('.labelImage').width();
    
    if( gO.thumbnailLabel.position == 'onBottom' ) {
      g_tn.labelHeight=$newDiv.find('.labelImage').outerHeight(true);
    }

    var lst=['xs','sm','me','la','xl'];
    for( var i=0; i< lst.length; i++ ) {
      var w=g_tn.settings.width['l1'][lst[i]];
      if( w != 'auto' ) {
        g_tn.outerWidth['l1'][lst[i]]=w+g_tn.borderWidth+g_tn.imgcBorderWidth;
      }
      else {
        g_tn.outerWidth['l1'][lst[i]]=0;
      }
      w=g_tn.settings.width['lN'][lst[i]];
      if( w != 'auto' ) {
        g_tn.outerWidth['lN'][lst[i]]=w+g_tn.borderWidth+g_tn.imgcBorderWidth;
      }
      else {
        g_tn.outerWidth['lN'][lst[i]]=0;
      }
    }
    for( var i=0; i< lst.length; i++ ) {
      var h=g_tn.settings.height['l1'][lst[i]];
      if( h != 'auto' ) {
        g_tn.outerHeight['l1'][lst[i]]=h+g_tn.borderHeight+g_tn.imgcBorderHeight;
      }
      else {
        g_tn.outerHeight['l1'][lst[i]]=0;
      }
      h=g_tn.settings.height['lN'][lst[i]];
      if( h != 'auto' ) {
        g_tn.outerHeight['lN'][lst[i]]=h+g_tn.borderHeight+g_tn.imgcBorderHeight;
      }
      else {
        g_tn.outerHeight['lN'][lst[i]]=0;
      }
    }
//console.log(g_tn.outerWidth);

//    if( SettingsGetTnWidth() != 'auto' ) {
//      g_tn.outerWidth=$newDiv.outerWidth(true);
//    }
//    if( SettingsGetTnHeight() != 'auto' ) {
//      g_tn.outerHeight=$newDiv.outerHeight(true);
//    }
    
    
    // pagination
    g_pgMaxNbThumbnailsPerRow=NbThumbnailsPerRow();
    
    // backup values used in animations/transitions
    g_custGlobals.oldBorderColor=$newDiv.css('border-color');
    if( g_custGlobals.oldBorderColor == '' || g_custGlobals.oldBorderColor == null || g_custGlobals.oldBorderColor == undefined ) { g_custGlobals.oldBorderColor='#000'; }
    g_custGlobals.oldLabelOpacity=$newDiv.find('.labelImage').css('opacity');
    var c=jQuery.Color($newDiv.find('.labelImage'),'backgroundColor');
    g_custGlobals.oldLabelRed=c.red();
    g_custGlobals.oldLabelGreen=c.green();
    g_custGlobals.oldLabelBlue=c.blue();

    gI=[];
  }

  function GetI18nItem( item, property ) {
    var s='';
    if( g_i18nLang != '' ) {
      if( item[property+'_'+g_i18nLang] !== undefined && item[property+'_'+g_i18nLang].length>0 ) {
        s=item[property+'_'+g_i18nLang];
        return s;
      }
    }
    s=item[property];
    return s;
  }

  

  // ##### LIST OF ITEMS IN OPTIONS #####

  
  
  function GetImageTitle( imageSRC ) {
    if( gO.thumbnailLabel.title == '%filename' ) {
      return (imageSRC.split('/').pop()).replace('_',' ');
    }
    
    if( gO.thumbnailLabel.title == '%filenameNoExt' ) {
      var s=imageSRC.split('/').pop();
      return (s.split('.').shift()).replace('_',' ');
    }
    return imageSRC;
  }
    
  function ProcessItemOption() {
    
    var foundAlbumID=false;
    
		if( typeof gO.dataSorting !== 'undefined' ) {
			if( gO.dataSorting == 'random' ) {
				gO.items=AreaShuffle(gO.items);
			}else if( gO.dataSorting == 'reversed' ) {
        gO.items=gO.items.reverse();
			}
		}
    
    jQuery.each(gO.items, function(i,item){
      
      var title='';
      title=GetI18nItem(item,'title');
      if( title === undefined ) { title=''; }
      
      var src=gO.itemsBaseURL+item.src;

      var thumbsrc='';
      if( item.srct !== undefined && item.srct.length>0 ) {
        thumbsrc=gO.itemsBaseURL+item.srct;
      }
      else {
        thumbsrc=src;
      }
      
      var thumbsrcX2='';
      if( item.srct2x !== undefined && item.srct2x.length>0 ) {
        thumbsrcX2=gO.itemsBaseURL+item.srct2x;
      }
      else {
        if( thumbsrc != '' ) {
          thumbsrcX2=thumbsrc;
        }
        else {
          thumbsrcX2=src;
        }
      }


      if( gO.thumbnailLabel.title != '' ) {
        title=GetImageTitle(src);
      }

      var description='';     //'&nbsp;';
      description=GetI18nItem(item,'description');
      if( description === undefined ) { description=''; }
      //if( toType(item.description) == 'string' ) {
      //  description=item.description;
      //}

      var destinationURL='';
      if( item.destURL !== undefined && item.destURL.length>0 ) {
        destinationURL=item.destURL;
      }

      //if( item.tags !== undefined && item.tags.length>0 ) {
      //  tags=item.tags;
      //}
      var tags=GetI18nItem(item,'tags');
      if( tags === undefined ) { tags=''; }

      var albumID=0;
      if( item.albumID !== undefined  ) {
        albumID=item.albumID;
        foundAlbumID=true;
      }
      var ID=null;
      if( item.ID !== undefined ) {
        ID=item.ID;
      }
      var kind='image';
      if( item.kind !== undefined && item.kind.length>0 ) {
        kind=item.kind;
      }
      
      var newItem=NGAddItem(title, thumbsrc, src, description, destinationURL, kind, tags, ID, albumID );
      newItem.thumbX2src=thumbsrcX2;

      // thumbnail image size
      var tw=0;
      if( item.thumbnailWidth !== undefined && item.imgtWidth>0 ) {
        tw=item.imgtWidth;
        newItem.thumbImgWidth=tw;
      }
      var th=0;
      if( item.thumbnailHeight !== undefined && item.imgtHeigt>0 ) {
        th=item.imgtHeight;
        newItem.thumbImgHeight=th;
      }

      newItem.thumbs = {
        url: { l1 : { xs:thumbsrc, sm:thumbsrc, me:thumbsrc, la:thumbsrc, xl:thumbsrc }, lN : { xs:thumbsrc, sm:thumbsrc, me:thumbsrc, la:thumbsrc, xl:thumbsrc } },
        width: { l1 : { xs:tw, sm:tw, me:tw, la:tw, xl:tw }, lN : { xs:tw, sm:tw, me:tw, la:tw, xl:tw } },
        height: { l1 : { xs:th, sm:th, me:th, la:th, xl:th }, lN : { xs:th, sm:th, me:th, la:th, xl:th } }
      };

      
      if( typeof gO.fnProcessData == 'function' ) {
        gO.fnProcessData(newItem, 'api', null);
      }
    });
    
    if( foundAlbumID ) {
      gO.displayBreadcrumb=true;
    }

    // get the number of images per album for all the items
    var l=gI.length,
    nb=0,
    nbImages=0;
    for( var i=0; i<l; i++ ){
      nb=0;
      nbImages=0;
      for( var j=0; j<l; j++ ){
        if( i!=j && gI[i].GetID() == gI[j].albumID ) {
          nb++;
          if( gI[j].kind == 'image' ) {
            gI[j].imageNumber=nbImages++;
          }
        }
      }
      gI[i].contentLength=nb;
    }

  }


  // ###################################
  // ##### LIST OF HREF ATTRIBUTES #####
  // ###################################

  function ProcessHREF(elements) {
    var foundAlbumID=false;
    
    if( typeof gO.dataSorting !== 'undefined' ) {
			if( gO.dataSorting == 'random' ) {
				elements=AreaShuffle(elements);
			}else if( gO.dataSorting == 'reversed' ) {
        jQuery.fn.reverse = [].reverse;
				elements=elements.reverse();
			}
		}

    
    jQuery.each(elements, function(i,item){
      var thumbsrc='';
      if( jQuery(item).attr('data-ngthumb') !== undefined && jQuery(item).attr('data-ngthumb').length>0 ) {
        thumbsrc=gO.itemsBaseURL+jQuery(item).attr('data-ngthumb');
      }
      if( jQuery(item).attr('data-ngThumb') !== undefined && jQuery(item).attr('data-ngThumb').length>0 ) {
        thumbsrc=gO.itemsBaseURL+jQuery(item).attr('data-ngThumb');
      }
      var thumbsrcX2='';
      if( jQuery(item).attr('data-ngthumb2x') !== undefined && jQuery(item).attr('data-ngthumb2x').length>0 ) {
        thumbsrcX2=gO.itemsBaseURL+jQuery(item).attr('data-ngthumb2x');
      }
      if( jQuery(item).attr('data-ngThumb2x') !== undefined && jQuery(item).attr('data-ngThumb2x').length>0 ) {
        thumbsrcX2=gO.itemsBaseURL+jQuery(item).attr('data-ngThumb2x');
      }

      
      src=gO.itemsBaseURL+jQuery(item).attr('href');
      //newObj.description=jQuery(item).attr('data-ngdesc');
      var description='';
      if( jQuery(item).attr('data-ngdesc') !== undefined && jQuery(item).attr('data-ngdesc').length>0 ) {
        description=jQuery(item).attr('data-ngdesc');
      }
      if( jQuery(item).attr('data-ngDesc') !== undefined && jQuery(item).attr('data-ngDesc').length>0 ) {
        description=jQuery(item).attr('data-ngDesc');
      }

      var destURL='';
      if( jQuery(item).attr('data-ngdest') !== undefined && jQuery(item).attr('data-ngdest').length>0 ) {
        destURL=jQuery(item).attr('data-ngdest');
      }
      if( jQuery(item).attr('data-ngDest') !== undefined && jQuery(item).attr('data-ngDest').length>0 ) {
        destURL=jQuery(item).attr('data-ngDest');
      }

      var albumID=0;
      if( jQuery(item).attr('data-ngalbumid') !== undefined ) {
        albumID=jQuery(item).attr('data-ngalbumid');
        foundAlbumID=true;
      }
      if( jQuery(item).attr('data-ngAlbumID') !== undefined ) {
        albumID=jQuery(item).attr('data-ngAlbumID');
        foundAlbumID=true;
      }
      
      var ID=null;
      if( jQuery(item).attr('data-ngid') !== undefined ) {
        ID=jQuery(item).attr('data-ngid');
      }
      if( jQuery(item).attr('data-ngID') !== undefined ) {
        ID=jQuery(item).attr('data-ngID');
      }

      var kind='image';
      if( jQuery(item).attr('data-ngkind') !== undefined && jQuery(item).attr('data-ngkind').length>0 ) {
        kind=jQuery(item).attr('data-ngkind');
      }
      if( jQuery(item).attr('data-ngKind') !== undefined && jQuery(item).attr('data-ngKind').length>0 ) {
        kind=jQuery(item).attr('data-ngKind');
      }

      var title=jQuery(item).text();
      if( !(gO.thumbnailLabel.title == '' || gO.thumbnailLabel.title == undefined) ) {
        title=GetImageTitle(src);
      }

      //NGAddItem(jQuery(item).text(), thumbsrc, src, description, destURL, 'image', '' );
      var newItem=NGAddItem(title, thumbsrc, src, description, destURL, kind, '', ID, albumID );
      newItem.thumbX2src=thumbsrcX2;
      
      // thumbnail image size
      var tw=0;
      if( jQuery(item).attr('data-ngthumbImgWidth') !== undefined && jQuery(item).attr('data-ngthumbImgWidth').length>0 ) {
        tw=jQuery(item).attr('data-ngthumbImgWidth');
        newItem.thumbImgWidth=tw;
      }
      var th=0;
      if( jQuery(item).attr('data-ngthumbImgHeight') !== undefined && jQuery(item).attr('data-ngthumbImgHeight').length>0 ) {
        th=jQuery(item).attr('data-ngthumbImgHeight');
        newItem.thumbImgHeight=th;
      }

      newItem.thumbs = {
        url: { l1 : { xs:thumbsrc, sm:thumbsrc, me:thumbsrc, la:thumbsrc, xl:thumbsrc }, lN : { xs:thumbsrc, sm:thumbsrc, me:thumbsrc, la:thumbsrc, xl:thumbsrc } },
        width: { l1 : { xs:tw, sm:tw, me:tw, la:tw, xl:tw }, lN : { xs:tw, sm:tw, me:tw, la:tw, xl:tw } },
        height: { l1 : { xs:th, sm:th, me:th, la:th, xl:th }, lN : { xs:th, sm:th, me:th, la:th, xl:th } }
      };
      
      if( typeof gO.fnProcessData == 'function' ) {
        gO.fnProcessData(newItem, 'markup', null);
      }

    });
    
    jQuery.each(elements, function(i,item){ jQuery(item).remove(); });
    
    if( foundAlbumID ) {
      gO.displayBreadcrumb=true;
    }

    // get the number of images per album for all the items
    var l=gI.length,
    nb=0,
    nbImages=0;
    for( var i=0; i<l; i++ ){
      nb=0;
      nbImages=0;
      for( var j=0; j<l; j++ ){
        if( i!=j && gI[i].GetID() == gI[j].albumID ) {
          nb++;
          if( gI[j].kind == 'image' ) {
            gI[j].imageNumber=nbImages++;
          }
        }
      }
      gI[i].contentLength=nb;
    }
    
  }

  

  
  // NG Items
  function NGAddItem(title, thumbSrc, imageSrc, description, destinationURL, kind, tags, ID, albumID ) {
    var newObj=new NGItems(title,ID);
    newObj.thumbsrc=thumbSrc;
    newObj.src=imageSrc;
    newObj.description=description;
    newObj.destinationURL=destinationURL;
    newObj.kind=kind;
    newObj.albumID=albumID;
    if( tags.length == 0 ) {
      newObj.tags=null;
    }
    else {
      newObj.tags=tags.split(' ');
    }
    gI.push(newObj);
    return newObj;
  }

  function GetNGItem( ID ) {
    var l=gI.length;
    for( var i=0; i<l; i++ ) {
      if( gI[i].GetID() == ID ) {
        return gI[i];
      }
    }
    return null;
  }

  
  // check album name - blackList/whiteList
  function CheckAlbumName( title, ID) {
    var s=title.toUpperCase();

    if( g_albumList !== null ) {
      for( var j=0; j<g_albumList.length; j++) {
        if( s == g_albumList[j].toUpperCase() || ID == g_albumList[j] ) {
          return true;
        }
      }
    }
    else {
      var found=false;
      if( g_whiteList !== null ) {
        //whiteList : authorize only album cointaining one of the specified keyword in the title
        for( var j=0; j<g_whiteList.length; j++) {
          if( s.indexOf(g_whiteList[j]) !== -1 ) {
            found=true;
          }
        }
        if( !found ) { return false; }
      }


      if( g_blackList !== null ) {
        //blackList : ignore album cointaining one of the specified keyword in the title
        for( var j=0; j<g_blackList.length; j++) {
          if( s.indexOf(g_blackList[j]) !== -1 ) { 
            return false;
          }
        }
      }
      
      return true;
    }
  }
  
  // Toolbar

  function DisplayAlbum( albumIdx, setLocationHash ) {
    if( gO.lazyBuild == 'display' ) {
      if( inViewportVert($gE.conTnParent,gO.lazyBuildTreshold) ){
        DisplayAlbumFinalize( albumIdx, setLocationHash );
      }
      else {
        g_delayedAlbumIdx=albumIdx;
        g_delayedSetLocationHash=setLocationHash;
      }
    }
    else{
      DisplayAlbumFinalize( albumIdx, setLocationHash );
    }
  }
  
  
  function DisplayAlbumFinalize( albumIdx, setLocationHash ) {
    gO.lazyBuild='none';
    g_delayedAlbumIdx=-1;
    
    g_albumIdxToOpenOnViewerClose=-1;

    if( g_containerViewerDisplayed ) {
      CloseInternalViewer(false);
    }
    
    if( albumIdx == g_lastOpenAlbumID ) {
      return;
    }
    
    if( gO.locationHash ) {
      if( setLocationHash ) {
        var s='myGallery/'+g_baseEltID+'/'+gI[albumIdx].GetID();
        g_lastLocationHash='#'+s;
        top.location.hash=s;
      }
    }
    g_lastOpenAlbumID=gI[albumIdx].GetID();
    manageGalleryToolbar(albumIdx);
   
    var p=0;
    if( gI[albumIdx].paginationLastPage > 0 && gI[albumIdx].paginationLastWidth == $gE.conTnParent.width()) {
      p=gI[albumIdx].paginationLastPage;
    }
    renderGallery(albumIdx,p);
    
  }
  
  
  // add album to breadcrumb
  function breadcrumbAdd( albumIdx ) {
    
    var cl="folder";
    if(albumIdx == 0 ) {
      cl="folderHome";
    }
    var newDiv =jQuery('<div class="'+cl+' oneFolder">'+gI[albumIdx].title+'</div>').appendTo($gE.conBC);
    jQuery(newDiv).data('albumIdx',albumIdx);
    newDiv.click(function() {
      var cAlbumIdx=jQuery(this).data('albumIdx');
      jQuery(this).nextAll().remove();
      OpenAlbum(cAlbumIdx, false, -1, true);
      return;
    });
  }

  // add separator to breadcrumb
  function breadcrumbAddSeparator( lastAlbumID ) {
    var newSep=jQuery('<div class="separator"></div>').appendTo($gE.conBC);
    jQuery(newSep).data('albumIdx',lastAlbumID);
    newSep.click(function() {
      var sepAlbumIdx=jQuery(this).data('albumIdx');
      jQuery(this).nextAll().remove();
      jQuery(this).remove();
      OpenAlbum(sepAlbumIdx, false, -1, true);
      return;
    });
  }

  
  function manageGalleryToolbar( albumIdx ) {
    var displayToolbar=false;
  
    // Breadcrumb
    if( gO.displayBreadcrumb == true ) {
      if( $gE.conBC.children().length == 0 ) {
          $gE.conNavBCon.css({opacity:0, 'max-height':'0px'});
      }

      displayToolbar=true;
      
      // $gE.conBC.children().not(':first').remove();
      $gE.conBC.children().remove();
      breadcrumbAdd(0);
      if( albumIdx != 0 ) {
        var l=gI.length,
        parentID=0,
        lstItems=[];
        
        lstItems.push(albumIdx);
        var curIdx=albumIdx;
        
        while ( gI[curIdx].albumID != 0 ) {
          for(i=1; i < l; i++ ) {
            if( gI[i].GetID() == gI[curIdx].albumID ) {
              curIdx=i;
              lstItems.push(curIdx);
              break;
            }
          }
        }
        
        breadcrumbAddSeparator(0);
        for( i=lstItems.length-1; i>=0 ; i-- ) {
          if( i > 0 ) {
            breadcrumbAddSeparator(lstItems[i-1]);
          }
          breadcrumbAdd(lstItems[i]);
        }
      }
      
      
      var bcItems=$gE.conBC.children(),
      l1=bcItems.length;
      if( l1 == 0 ) {
        g_curNavLevel='l1';
        if( gO.breadcrumbAutoHideTopLevel ) {
          $gE.conNavBCon.css({opacity:0, 'max-height':'0px'});
          displayToolbar=false;
        }
        //breadcrumbAdd(0);
      }
      else {
        if( l1 == 1 ) {
          g_curNavLevel='l1';
        }
        else {
          g_curNavLevel='lN';
        }
        if( l1 == 1 && gO.breadcrumbAutoHideTopLevel ) {
          $gE.conNavBCon.animate({'opacity':'0','max-height':'0px'});
        }
        else {
          $gE.conNavBCon.animate({'opacity':'1','max-height':'50px'});
        }
        //$gE.conBC.children().not(':first').remove();
      }
      
      
    }
    
    // Tag-bar
    if( gO.useTags ) {
      displayToolbar=true;
      if( g_containerTags == null ) {
        g_containerTags =jQuery('<div class="myGalleryTags"></div>').appendTo($gE.conNavB);
      }
    }
    
    if( gO.galleryFullpageButton ) { displayToolbar=true; }
    
    if( !g_containerNavigationbarContDisplayed && displayToolbar ) {
      g_containerNavigationbarContDisplayed=true;
      $gE.conNavBCon.show();
    }

    
  }

  function PreloaderShow() {
    //if( gO.displayBreadcrumb == true ) { $gE.conBC.find('.oneFolder').last().addClass('loading'); }
    $gE.conLoadingB.css({visibility:'visible'});
  }
  
  function PreloaderHide() {
    //if( gO.displayBreadcrumb == true ) { $gE.conBC.find('.oneFolder').last().removeClass('loading'); }
    $gE.conLoadingB.css({visibility:'hidden'});
  }

  
  // ##### Open one album
  function OpenAlbum ( albumIdx, processLocationHash, imageID, setLocationHash ) {

    switch(gO.kind) {
      case '':
        //renderGallery(albumIdx,0);
        DisplayAlbum(albumIdx,setLocationHash);
        break;
      case 'flickr':
        FlickrProcessItems(albumIdx, processLocationHash, imageID, setLocationHash);
        break;
      case 'smugmug':
        SmugmugProcessItems(albumIdx, processLocationHash, imageID, setLocationHash);
        break;
      case 'picasa':
      default:
        PicasaProcessItems(albumIdx, processLocationHash, imageID, setLocationHash);
        break;
    }
  }

  // ##### REPOSITION THUMBNAILS ON SCREEN RESIZE EVENT
  function ResizeGallery() {
    if( SettingsGetTnHeight() == 'auto' ) {
      ResizeGalleryHeightAuto();
    }
    else 
      if ( SettingsGetTnWidth() == 'auto' ) {
        ResizeGalleryWidthtAuto();
      }
      else {
        ResizeGalleryGrid();
      }

    thumbnailsLazySetSrc();
    setGalleryToolbarWidth(0);
  }

  // CASCADING LAYOUT
  function ResizeGalleryHeightAuto() {
    var areaW=$gE.conTnParent.width(),
    curCol=0,
    curRow=0,
    cnt=0,
    colHeight=[],
    maxCol=NbThumbnailsPerRow(),      //parseInt(areaW/g_tn.defaultFullWidth);
    gutterWidth=0,
    gutterHeight=gO.thumbnailGutterHeight,
    tnW=ThumbnailOuterWidth(),
    $thumbnails=$gE.conTn.find('.myGalleryThumbnailContainer');

    if( gO.thumbnailAlignment == 'justified' ) {
      maxCol=Math.min(maxCol,$thumbnails.length);
      gutterWidth=(maxCol==1?0:(areaW-(maxCol*tnW))/(maxCol-1));
    }
    else {
      gutterWidth=gO.thumbnailGutterWidth;
    }
    
    var nbCol=0;
    $thumbnails.each(function() {
      var $this=jQuery(this),
      n=$this.data("index");
      
      if( n !== undefined ) {
        if( gO.thumbnailLabel.position == 'onBottom' ) {
          setThumbnailSize($this,gI[n]);      // [TODO] remove --> this should not be here but issue on labelHeight
        }
        var curPosX=0,
        curPosY=0;

        if( curRow == 0 ) {
          curPosX=curCol*(ThumbnailOuterWidth()+gutterWidth);
          colHeight[curCol]=gI[n].thumbFullHeight+gutterHeight;
          
          curCol++;
          nbCol++;
          if( curCol >= maxCol ) { 
            curCol=0;
            curRow++;
          }
        }
        else {
          var c=0,
          minColHeight=colHeight[0];
          for( i=1; i<maxCol; i++) {
            if( (colHeight[i]+5) < minColHeight ) {     // +5 --> threshold
              minColHeight=colHeight[i];
              c=i;
              break;
            }
          }
          curPosY=colHeight[c];
          curPosX=c*(ThumbnailOuterWidth()+gutterWidth);
          colHeight[c]=curPosY+gI[n].thumbFullHeight+gutterHeight;
        }

        $this.css({ top: curPosY, left: curPosX });
        ThumbnailAppear($this, gI[n], cnt);
        
        cnt++;
      }
    });

    var w=(((colHeight.length)*(tnW+gutterWidth))-gutterWidth)
    var h=colHeight[0];
    for(i=1;i<nbCol;i++) {
      h=Math.max(h, colHeight[i]);
    }
    $gE.conTn.width(w).height(h);

  }

  // JUSTIFIED LAYOUT
  function ResizeGalleryWidthtAuto() {
    var areaW=$gE.conTnParent.width(),
    curWidth=0,
    lastPosX=0,
    curPosY=0,
    rowLastItem=[],
    rowNum=0,
    rowHeight=[],
    bNewRow=false,
    cnt=0,
    tnFeaturedH=0,
    tnFeaturedW=0,
    tnFeaturedW2=0,
    gutterWidth=gO.thumbnailGutterWidth,
    gutterHeight=gO.thumbnailGutterHeight;
    // by grief-of-these-days
    var maxRowHeightVertical=0;     // max height of a row with vertical thumbs
    var maxRowHeightHorizontal=0;   // max height of a row with horizontal thumbs
    var rowHasVertical=false;       // current row has vertical thumbs
    var rowHasHorizontal=false;     // current row has horizontal thumbs
    
    var $thumbnails=$gE.conTn.find('.myGalleryThumbnailContainer');
    $thumbnails.each(function() {
      var n=jQuery(this).data("index");
      if( n !== undefined && gI[n].thumbImg().width > 0 ) {
        var item=gI[n],
        w=Math.floor(item.thumbImg().width/item.thumbImg().height*SettingsGetTnHeight())+ g_tn.borderWidth+g_tn.imgcBorderWidth; // +gutterWidth;
        if( gO.thumbnailFeatured && cnt == 0 ) { 
          w=w*2;
          tnFeaturedW=w;
        }
        
        if( bNewRow ) {
          bNewRow=false;
          rowNum++;
          curWidth=0;
          rowHasVertical=false;
          rowHasHorizontal=false;
          if( rowNum == 1 && tnFeaturedW > 0 ) {
            curWidth=tnFeaturedW;
            tnFeaturedW=0;
          }
        }

        // by grief-of-these-days
        if( item.thumbHeight > item.thumbWidth ) {
          rowHasVertical = true;
        }
        else {
          rowHasHorizontal = true;
        }
        
        // down scale image resolution
        if( (curWidth + w + gutterWidth) < areaW ) {
          // last row
          curWidth+=w+gutterWidth;
          rowHeight[rowNum]=SettingsGetTnHeight();
          // rowHeight[rowNum]=item.thumbFullHeight;
          
          // prevent incomplete row from being heigher than the previous ones.
          // by grief-of-these-days
          var rowHeightLimit=Math.max(rowHasVertical ? maxRowHeightVertical : 0, rowHasHorizontal ? maxRowHeightHorizontal : 0);
          if( gO.thumbnailAdjustLastRowHeight && rowHeightLimit > 0 ) {
            rowHeight[rowNum]=Math.min(rowHeight[rowNum],rowHeightLimit);
          }
          
          rowLastItem[rowNum]=n;
        }
        else {
          // new row after current item
          curWidth+=w;
          var rH=Math.floor(SettingsGetTnHeight()*areaW/curWidth);
          // var rH=Math.floor(item.thumbFullHeight*areaW/curWidth);
          rowHeight[rowNum]=rH;
          
          // save the max row height for each thumb orientation.
          // by grief-of-these-days
          if( rowHasVertical ) {
            maxRowHeightVertical=Math.max(maxRowHeightVertical,rH);
          }
          if( rowHasHorizontal ) {
            maxRowHeightHorizontal=Math.max(maxRowHeightHorizontal,rH);
          }
          
          rowLastItem[rowNum]=n;
          bNewRow=true;
        }
        
      cnt++;
      }
    });
    
    rowNum=0;
    curPosY=0;
    lastPosX=0;
    cnt=0;
    $thumbnails.each(function() {
      var $this=jQuery(this),
      n=$this.data("index");
      if( n !== undefined && gI[n].thumbImg().width>0 ) {
        var item=gI[n],
        // w=Math.ceil(item.thumbImgWidth/item.thumbImg().height*rowHeight[rowNum]);//+g_tn.borderWidth+g_tn.imgContBorderWidth;
        w=Math.floor(item.thumbImg().width/item.thumbImg().height*rowHeight[rowNum]);//+g_tn.borderWidth+g_tn.imgContBorderWidth;

        if( cnt == 0 && gO.thumbnailFeatured ) { 
          w=w*2;
          if( rowHeight.length == 1 ) {
            // only 1 row
            tnFeaturedH=parseInt(rowHeight[0])*2;
          }
          else {
            tnFeaturedH=parseInt(rowHeight[0])+parseInt(rowHeight[1])+g_tn.borderHeight+g_tn.imgcBorderHeight;
          }
        }
        
        if( n == rowLastItem[rowNum] ) {
          // last row item
          if( rowLastItem.length != (rowNum+1) ) {
            w=areaW-lastPosX- g_tn.borderWidth-g_tn.imgcBorderWidth;//-gutterWidth;
          }
          else {
            // very last item
            if( (lastPosX+w + g_tn.borderWidth+g_tn.imgcBorderWidth +gutterWidth) > areaW ) {
              // reduce size
              w=areaW-lastPosX-g_tn.borderWidth-g_tn.imgcBorderWidth;//-gutterWidth;
            }
          }
        }
        
        var rh=0;
        if( cnt == 0 && gO.thumbnailFeatured ) {
          rh=tnFeaturedH;
          tnFeaturedW2=w+ g_tn.borderWidth+g_tn.imgcBorderWidth;
          item.customData.featured=true;
          $this.find('img').attr('src',item.thumbX2src);
        }
        else {
          rh=rowHeight[rowNum];
        }
        
        rh=parseInt(rh);
        w=parseInt(w);
        $this.width(w+g_tn.imgcBorderWidth).height(rh+g_tn.imgcBorderHeight+g_tn.labelHeight);
        $this.find('.imgContainer').height(rh).width(w);
        $this.find('img').css({'max-height':rh+2, 'max-width':w+2});
        $this.find('.subcontainer').width(w+g_tn.imgcBorderWidth).height(rh+g_tn.imgcBorderHeight+g_tn.labelHeight);
        //$this.find('.labelImage').css({left:0, right:0});
        $this.css({ top: curPosY , left: lastPosX });
        item.thumbFullWidth=w+g_tn.borderWidth+g_tn.imgcBorderWidth;
        item.thumbFullHeight=rh+g_tn.borderHeight+g_tn.imgcBorderHeight+g_tn.labelHeight;
        ThumbnailOverResize($this);
        ThumbnailAppear($this, item, cnt);
        
        lastPosX+=w+g_tn.borderWidth+g_tn.imgcBorderWidth+gutterWidth;
        
        if( n == rowLastItem[rowNum] ) {
          // curPosY+=rowHeight[rowNum]+g_tn.outerHeight+g_tn.labelHeight+gutterHeight;
          curPosY+=rowHeight[rowNum]+g_tn.labelHeight+gutterHeight+g_tn.imgcBorderHeight+g_tn.borderHeight;
          rowNum++;
          lastPosX=0;
          if( rowNum == 1 && tnFeaturedW2 > 0 ) { 
            lastPosX= tnFeaturedW2;
            tnFeaturedW2=0;
          }
        }
      }
      cnt++;
    });
    
    if( rowNum > 0 ) {
      curPosY-=gutterHeight;
    }
    tnFeaturedH=tnFeaturedH+ThumbnailOuterHeight()+g_tn.labelHeight;
    $gE.conTn.width(areaW).height(curPosY>tnFeaturedH?curPosY:tnFeaturedH);  //+gO.thumbnailHeight);
  }
  
  function NbThumbnailsPerRow() {
  
    var tnW=SettingsGetTnWidth()+g_tn.borderWidth+g_tn.imgcBorderWidth;
    var areaW=$gE.conTnParent.width();
    
    var nbMaxTn=0;
    if( gO.thumbnailAlignment == 'justified' ) {
      nbMaxTn=Math.floor((areaW)/(tnW));
    }
    else {
      nbMaxTn=Math.floor((areaW+gO.thumbnailGutterWidth)/(tnW+gO.thumbnailGutterWidth));
    }
    
    if(  gO.maxItemsPerLine >0 && nbMaxTn >  gO.maxItemsPerLine ) {
      nbMaxTn=gO.maxItemsPerLine;
    }
    
    if( nbMaxTn < 1 ) { nbMaxTn=1; }
    
    return nbMaxTn
  }
  
  
  // GRID LAYOUT
  function ResizeGalleryGrid() {
    var curPosX=0,
    curPosY=0,   
    gutterWidth=0,
    gutterHeight=gO.thumbnailGutterHeight,
    areaW=$gE.conTnParent.width(),
    maxCol=NbThumbnailsPerRow(),
    cnt=0,
    h=0,
    w=0,
    cols=[],
    curCol=0;

    // pagination - max lines per page mode
    if( g_pgMaxLinesPerPage > 0 ) {
      if( ThumbnailOuterWidth() > 0 ) {
        if( maxCol != g_pgMaxNbThumbnailsPerRow ) {
          g_pgMaxNbThumbnailsPerRow=maxCol;
          var aIdx=$gE.conPagin.data('galleryIdx');
          renderGallery(aIdx,0);
          return;
        }
      }
    }

    var $thumbnails=$gE.conTn.find('.myGalleryThumbnailContainer'),
    nbTn=$thumbnails.length;
    
    if( gO.thumbnailAlignment == 'justified' ) {
      maxCol=Math.min(maxCol,nbTn);
      gutterWidth=(maxCol==1?0:(areaW-(maxCol*ThumbnailOuterWidth()))/(maxCol-1));
    }
    else {
      gutterWidth=gO.thumbnailGutterWidth;
    }
    
    $thumbnails.each(function() {
      var $this=jQuery(this);

      var n=$this.data("index");
      if( n !== undefined ) {
        if( curPosY == 0 ) {
          curPosX=curCol*(ThumbnailOuterWidth()+gutterWidth)
          cols[curCol]=curPosX;
          w=curPosX;
        }
        else {
          curPosX=cols[curCol];
          h=curPosY;
        }
        
        $this.css({ top: curPosY , left: curPosX });
        ThumbnailAppear($this, gI[n], cnt);

        curCol++;
        if( curCol >= maxCol ){
          curCol=0;
          curPosY+=ThumbnailOuterHeight()+gutterHeight;
        }
        cnt++;
      }
    });

    $gE.conTn.width(w+ThumbnailOuterWidth()).height(h+ThumbnailOuterHeight());

  }
  
  function ThumbnailAppear($this, item, n) {
    if( $this.css('opacity') == 0 ) {
      $this.removeClass('myGalleryHideElement');
      if( gO.thumbnailDisplayTransition ) {
        if( typeof gO.fnThumbnailDisplayEffect == 'function' ) { 
          gO.fnThumbnailDisplayEffect($this, item, 0);
        }
        else {
          $this.delay(n*g_tn.displayInterval).fadeTo(150, 1);
        }
      }
      else {
        $this.css({opacity:1});
      }
    }
  }
  

  function setGalleryToolbarWidth(pageNumber) {
    if( gO.galleryToolbarWidthAligned ) {
      if( $gE.conNavBCon !== undefined ) {
        var w=$gE.conTn.outerWidth(true);
        //if( pageNumber > 0 ) {
          if( $gE.conNavBCon.width() < w ) {
            $gE.conNavBCon.width(w);
          }
        //}
        else {
          $gE.conNavBCon.width(w);
        }
      }
    }
  }

  // thumbnail image lazy load
  function thumbnailsLazySetSrc() {
    var $eltInViewport=$gE.conTn.find('.myGalleryThumbnailContainer').filter(function() {
       return inViewport(jQuery(this), g_tn.lazyLoadTreshold);
    });

    jQuery($eltInViewport).each(function(){
        var $image=jQuery(this).find('img');
        if( jQuery($image).attr('src') == g_emptyGif ) {
          var idx=jQuery(this).data('index');
          // jQuery($image).attr('src',gI[idx].thumbsrc);
          jQuery($image).attr('src',gI[idx].thumbImg().src);
        }
    });
  }

  
  // Gallery



  
  // Display pagination
  function managePagination( albumIdx, pageNumber ) {
    if( $gE.conPagin == undefined ) return;
    
    $gE.conPagin.children().remove();

    //if( g_tn.settings.height[g_curNavLevel][g_curWidth] == 'auto' || g_tn.settings.width[g_curNavLevel][g_curWidth] == 'auto' ) { return; }
    if( g_tn.settings.height[g_curNavLevel][g_curWidth] == 'auto' || g_tn.settings.width[g_curNavLevel][g_curWidth] == 'auto' ) {
      // Hide pagination container, if not used.
      $gE.conPagin.hide();
      return;
    }    
    
    // Must show the container for width calculation to work.
    $gE.conPagin.show();
    
    $gE.conPagin.data('galleryIdx',albumIdx);
    $gE.conPagin.data('currentPageNumber',pageNumber);
    var n2=0,
    w=0;
    if( pageNumber > 0 ) {
      var eltPrev=jQuery('<div class="paginationPrev">'+g_i18nTranslations.paginationPrevious+'</div>').appendTo($gE.conPagin);
      w+=jQuery(eltPrev).outerWidth(true);
      eltPrev.click(function(e) {
        paginationPreviousPage();
      });
    }

    var firstPage=0;
    // pagination - max lines per page mode
    if( g_pgMaxLinesPerPage > 0 && g_tn.settings.height[g_curNavLevel][g_curWidth] != 'auto' && g_tn.settings.width[g_curNavLevel][g_curWidth] != 'auto' ) {
      n2=Math.ceil(gI[albumIdx].contentLength/(g_pgMaxLinesPerPage*g_pgMaxNbThumbnailsPerRow));
    }

    if( pageNumber >= 5 ) {
      firstPage=pageNumber-5;
      if( n2 > pageNumber+6 ) {
        n2=pageNumber+6;
      }
    }
    else {
      if( n2 > 10 ) {
        n2=10;
      }
    }
    
    // only one page -> do not display anything
    // if( n2==1 ) { return; }
    if( n2==1 ) {
      // Hide pagination container, if not used.
      $gE.conPagin.hide ();
      return;
    }
    
    for(var i=firstPage; i < n2; i++ ) {
      var c='';
      if( i == pageNumber ) { c=' currentPage'; }
      var elt$=jQuery('<div class="paginationItem'+c+'">'+(i+1)+'</div>').appendTo($gE.conPagin);
      elt$.data('pageNumber',i);
      w+=elt$.outerWidth(true);
      elt$.click(function(e) {
        var aIdx=$gE.conPagin.data('galleryIdx'),
        pn=jQuery(this).data('pageNumber');
        if( !inViewportVert($gE.base, 0) ) {
          $('html, body').animate({scrollTop: $gE.base.offset().top}, 200);
        }
        renderGallery(aIdx,pn);
      });

    }

    if( (pageNumber+1) < n2 ) {
      var $eltNext=jQuery('<div class="paginationNext">'+g_i18nTranslations.paginationNext+'</div>').appendTo($gE.conPagin);
      w+=$eltNext.outerWidth(true);
      $eltNext.click(function(e) {
        paginationNextPage();
      });
    }

    $gE.conPagin.width(w);

  }

  function paginationNextPage() {
    var aIdx=$gE.conPagin.data('galleryIdx'),
    n1=0;
    
    // pagination - max lines per page mode
    if( g_pgMaxLinesPerPage > 0 ) {
      n1=gI[aIdx].contentLength/(g_pgMaxLinesPerPage*g_pgMaxNbThumbnailsPerRow);
    }
    n2=Math.ceil(n1);
    
    var pn=$gE.conPagin.data('currentPageNumber');
    if( pn < (n2-1) ) {
      pn++;
    }
    else {
      pn=0;
    }
    
    if( !inViewportVert($gE.base, 0) ) {
      $('html, body').animate({scrollTop: $gE.base.offset().top }, 200);
    }

    renderGallery(aIdx,pn);
  }
  
  function paginationPreviousPage() {
    var aIdx=$gE.conPagin.data('galleryIdx'),
    n1=0;
    
    // pagination - max lines per page mode
    if( g_pgMaxLinesPerPage > 0 ) {
      n1=gI[aIdx].contentLength/(g_pgMaxLinesPerPage*g_pgMaxNbThumbnailsPerRow);
    }
    n2=Math.ceil(n1);
    
    var pn=$gE.conPagin.data('currentPageNumber');
    if( pn > 0 ) {
      pn--;
    }
    else {
      pn=n2-1;
    }

    if( !inViewportVert($gE.base, 0) ) {
      $('html, body').animate({scrollTop: $gE.base.offset().top }, 200);
    }

    renderGallery(aIdx,pn);
  }

  function renderGallery( albumIdx, pageNumber ) {
    g_curAlbumIdx=-1;
    var $elt=$gE.conTn.parent();
    $elt.animate({opacity: 0}, 100).promise().done(function(){

      // remove gallery elements
      g_containerThumbnailsDisplayed=false;
      $gE.conTn.off().empty();
      var l=gI.length;
      for( var i=0; i < l ; i++ ) {
        gI[i].hovered=false;
      }

      $gE.conTnParent.css({ left:0, opacity:1 });
      ElementTranslateX($gE.conTn[0],0);
      renderGallery2(albumIdx, pageNumber, renderGallery2Complete);
    });
  }


  function renderGallery2( albumIdx, pageNumber, onComplete ) {
    if( albumIdx == -1 || gI[albumIdx] == undefined) { return; }

    gI[albumIdx].paginationLastPage=pageNumber;
    gI[albumIdx].paginationLastWidth=$gE.conTnParent.width();


    var l=gI.length;
    // if one description is defined then put a value to those without
    var foundDesc=false;
    /*if( gO.thumbnailLabel.position == 'onBottom'  ) {
      for(var i=0; i<l; i++ ) {
        if( gI[i].albumID == gI[albumIdx].albumID && gI[i].description.length > 0 ) { foundDesc=true; }
      }
    }*/
    var g_galleryItemsCount=0,
    currentCounter=0,
    firstCounter=0,
    lastCounter=0;
    
    if( g_pgMaxLinesPerPage > 0 && g_tn.settings.height[g_curNavLevel][g_curWidth] != 'auto' && g_tn.settings.width[g_curNavLevel][g_curWidth] != 'auto' ) {
      firstCounter=pageNumber*g_pgMaxLinesPerPage*g_pgMaxNbThumbnailsPerRow;
      lastCounter=firstCounter+g_pgMaxLinesPerPage*g_pgMaxNbThumbnailsPerRow;
    }

    PreloaderHide();

    var eltOpacity=0;
    //var eltOpacity='1';
    //if( gO.thumbnailDisplayTransition || gO.thumbnailHeight == 'auto' || gO.thumbnailWidth == 'auto' || gO.thumbnailWidth == 'autoUpScale') {
    //  eltOpacity='0';
    //}
    var endInViewportTest=false,
    startInViewportTest=false,
    idx=0;
    
    (function(){

      for( var i=0; i<100; i++ ) {
        if( idx >= l ) {
          onComplete(albumIdx, pageNumber);
          return;
        }

        var item=gI[idx];
        if( item.albumID == gI[albumIdx].GetID() ) {
          currentCounter++;

          // pagination - max lines per page mode
          if( g_pgMaxLinesPerPage > 0 && g_tn.settings.height[g_curNavLevel][g_curWidth] != 'auto' && g_tn.settings.width[g_curNavLevel][g_curWidth] != 'auto' ) {
            if( (g_galleryItemsCount+1) > (g_pgMaxLinesPerPage*g_pgMaxNbThumbnailsPerRow) ) {
              onComplete(albumIdx, pageNumber);
              return;
            }
          }
          
          if( currentCounter > firstCounter ) {
            g_galleryItemsCount++;
            
            var $newDiv=thumbnailBuild(item, idx, eltOpacity, foundDesc);

            //thumbnailPositionContent($newDiv, item);
            setThumbnailSize($newDiv, item);
            
            //var checkImageSize=(gO.thumbnailHeight == 'auto' && item.thumbImgHeight == 0) || ( (gO.thumbnailWidth == 'auto' || gO.thumbnailWidth == 'autoUpScale') && item.thumbImgWidth == 0 ),
            $p=$newDiv.detach();
            //if( checkImageSize ) {
            $p.css({opacity:0});
            //}
            //else {
            //  $p.css('opacity',eltOpacity);
            //}
            $p.appendTo($gE.conTn);

            //if( (gO.thumbnailHeight == 'auto' && item.thumbImgHeight > 0) || ( ( gO.thumbnailWidth == 'auto' || gO.thumbnailWidth == 'autoUpScale') && item.thumbImgWidth > 0) ) {
            //  ResizeGallery();
            //}
//            $p.removeClass('myGalleryHideElement');

            // display animation (fadeIn or custom)
            // if( !checkImageSize ) {
            
            // image lazy load
            if( gO.thumbnailLazyLoad ) {
              if( !endInViewportTest ) {
                if( inViewport($newDiv, g_tn.lazyLoadTreshold) ) {
                  $newDiv.find('img').attr('src',item.thumbImg().src);
                  startInViewportTest=true;
                }
                else {
                  if( startInViewportTest ) { endInViewportTest=true; }
                }
              }
            }
            // Set CSS depending on choosen hover effect
            ThumbnailInit($newDiv);
            ThumbnailOverResize($newDiv);
            
          }
        }
        idx++;
      }

      if( idx < l ) {
        //setGalleryToolbarWidth(pageNumber);
        setTimeout(arguments.callee,0);
      }
      else {
        onComplete(albumIdx, pageNumber);
      }
    })();
  }
  
  function renderGallery2Complete( albumIdx, pageNumber ) {
  
    //if( gO.thumbnailHeight == 'auto' || gO.thumbnailWidth == 'auto' || gO.thumbnailWidth == 'autoUpScale' ) {
      ResizeGallery();
    //}
     
    // SetGalleryWidth(pageNumber);
    //setGalleryToolbarWidth(pageNumber);
    managePagination(albumIdx,pageNumber);
    g_containerThumbnailsDisplayed=true;
    g_curAlbumIdx=albumIdx;

  }


  function thumbnailBuild( item, idx, eltOpacity, foundDesc ) {
    var newElt=[],
    newEltIdx=0;
    
    var pos='';
    var ch=' myGalleryHideElement'
    if( gO.thumbnailLazyLoad && SettingsGetTnWidth() == 'auto' ) {
      pos='top:0px;left:0px;';
      ch='';
    }
    // newElt[newEltIdx++]='<div class="myGalleryThumbnailContainer myGalleryHideElement" style="display:inline-block,opacity:'+eltOpacity+'" ><div class="subcontainer" style="display: inline-block">';
    newElt[newEltIdx++]='<div class="myGalleryThumbnailContainer'+ch+'" style="display:block,opacity:'+eltOpacity+';'+pos+'" ><div class="subcontainer" style="display:block;">';
    
    var src='';
    if( gO.thumbnailLazyLoad ) {
      src=g_emptyGif;
    }
     else {
      src=item.thumbImg().src;
    }

    var sTitle=getThumbnailTitle(item),
    sDesc=getTumbnailDescription(item);
    
    var checkImageSize=false;
    if( SettingsGetTnHeight() == 'auto' ) {
      newElt[newEltIdx++]='<div class="imgContainer" style="width:'+SettingsGetTnWidth()+'px;"><img class="image" src='+src+' alt=" " style="max-width:'+SettingsGetTnWidth()+'px;"></div>';
      if( gI[idx].thumbImg().height == 0 ) { checkImageSize=true; }
    }
    else if( SettingsGetTnWidth() == 'auto' ) {
        // newElt[newEltIdx++]='<div class="imgContainer" style="height:'+gO.thumbnailHeight+'px;"><img class="image" src='+src+' alt=" " style="height:'+gO.thumbnailHeight+'px;" ></div>';
        newElt[newEltIdx++]='<div class="imgContainer" style="height:'+SettingsGetTnHeight()+'px;"><img class="image" src='+src+' alt=" " style="max-height:'+SettingsGetTnHeight()+'px;" ></div>';
        if( gI[idx].thumbImg().width == 0 ) { checkImageSize=true; }
      }
      else {
        newElt[newEltIdx++]='<div class="imgContainer" style="width:'+SettingsGetTnWidth()+'px;height:'+SettingsGetTnHeight()+'px;"><img class="image" src='+src+' alt=" " style="max-width:'+SettingsGetTnWidth()+'px;max-height:'+SettingsGetTnHeight()+'px;" ></div>';
//        newElt[newEltIdx++]='<div class="imgContainer" style="width:'+gO.thumbnailWidth+'px;height:'+gO.thumbnailHeight+'px;"><img class="image" src='+src+' alt=" " style="max-width:100%;max-height:100%;" ></div>';
      }

    if( item.kind == 'album' ) {
      // ALBUM
      if( gO.thumbnailLabel.display == true ) {
        var imageCount='';
        if( item.contentLength > 0 ) {
          switch( gO.thumbnailLabel.itemsCount) {
            case 'title':
              sTitle += ' ' + g_i18nTranslations.thumbnailLabelItemsCountPart1 + item.contentLength + g_i18nTranslations.thumbnailLabelItemsCountPart2;
              break;
            case 'description':
              sDesc += ' ' + g_i18nTranslations.thumbnailLabelItemsCountPart1 + item.contentLength + g_i18nTranslations.thumbnailLabelItemsCountPart2;
              break;
            }
          }
        //newElt[newEltIdx++]='<div class="labelImage" style="width:'+gO.thumbnailWidth+'px;max-height:'+gO.thumbnailHeight+'px;"><div class="labelFolderTitle labelTitle" >'+sTitle+'</div><div class="labelDescription" >'+sDesc+'</div></div>';
        newElt[newEltIdx++]='<div class="labelImage" style="width:'+SettingsGetTnWidth()+'px;"><div class="labelFolderTitle labelTitle" >'+sTitle+'</div><div class="labelDescription" >'+sDesc+'</div></div>';
      }
    }
    else {
      // IMAGE
      if( gO.thumbnailLabel.display == true ) {
        if( foundDesc && sDesc.length == 0 && gO.thumbnailLabel.position == 'onBottom' ) { sDesc='&nbsp;'; }
        //newElt[newEltIdx++]='<div class="labelImage" style="width:'+gO.thumbnailWidth+'px;max-height:'+gO.thumbnailHeight+'px;"><div class="labelImageTitle labelTitle" >'+sTitle+'</div><div class="labelDescription" >'+sDesc+'</div></div>';
        newElt[newEltIdx++]='<div class="labelImage" style="width:'+SettingsGetTnWidth()+'px;"><div class="labelImageTitle labelTitle" >'+sTitle+'</div><div class="labelDescription" >'+sDesc+'</div></div>';
      }
    }
    newElt[newEltIdx++]='</div></div>';
    
    var $newDiv =jQuery(newElt.join('')).appendTo($gE.conTnHid); //.animate({ opacity: 1},1000, 'swing');  //.show('slow'); //.fadeIn('slow').slideDown('slow');
    item.$elt=$newDiv;
    $newDiv.data('index',idx);
    $newDiv.find('img').data('index',idx);

    thumbnailPositionContent($newDiv, item);

    if( checkImageSize ) {
      var gi_imgLoad = ngimagesLoaded( $newDiv );
      gi_imgLoad.on( 'always', function( instance ) {
      //$newDiv.ngimagesLoaded().always( function( instance ) {
        var item=gI[jQuery(instance.images[0].img).data('index')];
        if( item == undefined || jQuery(instance.images[0].img).attr('src') == g_emptyGif ) { return; }    // also fired for blank image --> ignore
        var b=false;
        if( item.thumbImg().height != instance.images[0].img.naturalHeight ) {
          item.thumbImgHeight=instance.images[0].img.naturalHeight;
          item.thumbImgWidth=instance.images[0].img.naturalWidth;
          item.thumbSetImgHeight(instance.images[0].img.naturalHeight);
          item.thumbSetImgWidth(instance.images[0].img.naturalWidth);
          b=true;
        }
        if( item.thumbImg().width != instance.images[0].img.naturalWidth ) {
          item.thumbImgHeight=instance.images[0].img.naturalHeight;
          item.thumbImgWidth=instance.images[0].img.naturalWidth;
          item.thumbSetImgHeight(instance.images[0].img.naturalHeight);
          item.thumbSetImgWidth(instance.images[0].img.naturalWidth);
          b=true;
        }
        
        if( b ) {
          setThumbnailSize(item.$elt, item);
          ThumbnailOverResize(item.$elt);
          ResizeGallery();
        }
      });
    }
    
    // thumbnailPositionContent($newDiv, item);

    return $newDiv;
  }
  
  function getThumbnailTitle( item ) {
    var sTitle=item.title;
    if( gO.thumbnailLabel.display == true ) {
      if( sTitle === undefined || sTitle.length == 0 ) { sTitle='&nbsp;'; }

      if( g_i18nTranslations.thumbnailImageTitle != '' ) {
        sTitle=g_i18nTranslations.thumbnailImageTitle;
      }
      if( gO.thumbnailLabel.titleMaxLength > 3 && sTitle.length > gO.thumbnailLabel.titleMaxLength ){
        sTitle=sTitle.substring(0,gO.thumbnailLabel.titleMaxLength)+'...';
      }
    }
    
    return sTitle;
  }

  function getTumbnailDescription( item ) {
    var sDesc='';
    if( gO.thumbnailLabel.displayDescription == true ) { 
      if( item.kind == 'album' ) {
        if( g_i18nTranslations.thumbnailImageDescription != '' ) {
          sDesc=g_i18nTranslations.thumbnailAlbumDescription;
        }
        else {
          sDesc=item.description;
        }
      }
      else {
        if( g_i18nTranslations.thumbnailImageDescription != '' ) {
          sDesc=g_i18nTranslations.thumbnailImageDescription;
        }
        else {
          sDesc=item.description;
        }
      }
      if( gO.thumbnailLabel.descriptionMaxLength > 3 && sDesc.length > gO.thumbnailLabel.descriptionMaxLength ){
        sDesc=sDesc.substring(0,gO.thumbnailLabel.descriptionMaxLength)+'...';
      }
    }
    
    return sDesc;
  }
  
  
  function setThumbnailSize( $elt, item ) {

    if( SettingsGetTnHeight() == 'auto' ) {
      // CASCADING LAYOUT
      if( item.thumbImg().height > 0 ) {
        var ratio=item.thumbImg().height/item.thumbImg().width;
        $elt.find('.imgContainer').height(SettingsGetTnWidth()*ratio); //.css({'overflow':'hidden'});
        if( gO.thumbnailLabel.position == 'onBottom' ) {
          item.thumbLabelHeight=$elt.find('.labelImage').outerHeight(true);
          item.thumbFullHeight=SettingsGetTnWidth()*ratio + item.thumbLabelHeight + g_tn.borderHeight+g_tn.imgcBorderHeight;
          $elt.width(ThumbnailOuterWidth()-g_tn.borderWidth).height(item.thumbFullHeight-g_tn.borderHeight);
          $elt.find('.labelImage').css({'position':'absolute', 'top':'', 'bottom':'0px'});
        }
        else {
          item.thumbFullHeight=SettingsGetTnWidth()*ratio + item.thumbLabelHeight + g_tn.borderHeight+g_tn.imgcBorderHeight;
          $elt.width(ThumbnailOuterWidth() - g_tn.borderWidth).height(item.thumbFullHeight-g_tn.borderHeight);
        }
      }
      item.thumbFullWidth=ThumbnailOuterWidth();
      $elt.find('.subcontainer').width(ThumbnailOuterWidth()-g_tn.borderWidth).height(item.thumbFullHeight-g_tn.borderHeight); //.css({'overflow':'hidden'});
    }
    else

      // JUSTIFIED LAYOUT
      if( SettingsGetTnWidth() == 'auto' ) {
        return;
        
        // evrything is done in ResizeGalleryWidthtAuto()
        if( item.thumbImg().width > 0 ) {
          // var ratio=item.thumbImg().height/item.thumbImg().width;
          var ratio=item.thumbImg().width/item.thumbImg().height;
          $elt.find('.imgContainer').width(SettingsGetTnHeight()*ratio).css({overflow:'hidden'});
          if( gO.thumbnailLabel.position == 'onBottom' ) {
            item.thumbFullWidth=SettingsGetTnHeight()*ratio + g_tn.borderWidth+g_tn.imgcBorderWidth ;
            $elt.width(item.thumbFullWidth).height(ThumbnailOuterHeight()+g_tn.labelHeight-ThumbnailOuterHeight());
          }
          else {
          }
        }
        item.thumbFullHeight=ThumbnailOuterHeight()+g_tn.labelHeight;
        $elt.find('.subcontainer').width(item.thumbFullWidth-g_tn.borderWidth).height(ThumbnailOuterHeight()-g_tn.borderHeight); //.css({'overflow':'hidden'});
      }
      
      else {
        // GRID LAYOUT
        item.thumbFullHeight=ThumbnailOuterHeight();  //g_tn.defaultFullHeight;
        item.thumbFullWidth=ThumbnailOuterWidth();   //g_tn.defaultFullWidth;
        if( gO.thumbnailLabel.position == 'onBottom' ) {
          $elt.width(item.thumbFullWidth-g_tn.borderWidth).height(item.thumbFullHeight-g_tn.borderHeight);
          //$elt.find('.labelImage').height(g_tn.labelHeight-g_tn.labelBorderHeight).css({overflow:'hidden'});
        }
        else {
          $elt.width(item.thumbFullWidth-g_tn.borderWidth).height(item.thumbFullHeight-g_tn.borderHeight);
        }
        $elt.find('.subcontainer').width(item.thumbFullWidth-g_tn.borderWidth).height(item.thumbFullHeight-g_tn.borderHeight); //.css({'overflow':'hidden'});
      }
  }
  
  
  function thumbnailPositionContent( $e, item ) {
  
    if( typeof gO.fnThumbnailInit == 'function' ) { 
      gO.fnThumbnailInit($e, item, ExposedObjects());
      return;
    }    

    switch( gO.thumbnailLabel.position ){
      case 'onBottom':
        // $e.find('.labelImage').css({'top':'0', 'position':'relative', 'width':'100%'});
        $e.find('.labelImage').css({top:0, position:'relative', left:0, right:0});
        if( SettingsGetTnHeight() == 'auto' ) {
          $e.find('.labelImageTitle').css({'white-space':'normal'});    // line break
          $e.find('.labelFolderTitle').css({'white-space':'normal'});
          $e.find('.labelDescription').css({'white-space':'normal'});
        }
        else {
          $e.find('.labelImageTitle').css({'white-space':'nowrap'});    // no line break
          $e.find('.labelFolderTitle').css({'white-space':'nowrap'});
          $e.find('.labelDescription').css({'white-space':'nowrap'});
        }
        break;
      case 'overImageOnTop':
        // $e.find('.labelImage').css({'top':'0', 'height':'100%', 'width':'100%'});
        // $e.find('.labelImage').css({top:-g_tn.imgcBorderHeight/2, bottom:g_tn.imgcBorderWidth/2, left:0, right:0 });
        $e.find('.labelImage').css({top:0, bottom:0, left:0, right:0 });
        break;
      case 'overImageOnMiddle':
        // $e.find('.labelImage').css({'top':'0', 'height':'100%', 'width':'100%'});
        // $e.find('.labelImage').css({top:-g_tn.imgcBorderHeight/2, bottom:g_tn.imgcBorderWidth/2, left:0, right:0});
        $e.find('.labelImage').css({top:0, bottom:0, left:0, right:0});
        $e.find('.labelFolderTitle').css({left:0, right:0, position:'absolute', bottom:'50%'});
        $e.find('.labelImageTitle').css({left:0, right:0, position:'absolute', bottom:'50%'});
        $e.find('.labelDescription').css({left:0, right:0, position:'absolute', top:'50%'});
        break;
      case 'overImageOnBottom':
      default :
        gO.thumbnailLabel.position='overImageOnBottom';
        // $e.find('.labelImage').css({'bottom':'0', 'width':'100%'});
        // $e.find('.labelImage').css({bottom:g_tn.imgcBorderWidth/2, left:0, right:0});
        $e.find('.labelImage').css({bottom:0, left:0, right:0});
        break;
    }
  }
  
  function ThumbnailClick( $e ) {
    $currentTouchedThumbnail=null;
    var n=$e.data('index');
    if( n == undefined ) { return; }
    
    if( gO.touchAnimation == false || gI[n].hovered === true ) {
      OpenThumbnail(n);
    }
    else {
      // hover effect on click --> touchscreen
      ThumbnailHoverOutAll();
      ThumbnailHover($e);
    }
  }
  
  function OpenThumbnail( n ) {
    if( n == undefined ) { return; }
    
    $currentTouchedThumbnail=null;
    
    // open URL
    if( gI[n].destinationURL !== undefined && gI[n].destinationURL.length >0 ) {
      window.location = gI[n].destinationURL;
      return;
    }

    g_openNoDelay=false;
    if( gI[n].kind == 'album' ) {
      OpenAlbum(n, false, -1, true);
    }
    else {
      // Display image
      DisplayImage(n,false);
    }
  }
  
  function ThumbnailHoverOutAll() {
  // [TODO] --> only check displayed items
    var l=gI.length;
    for( var i=0; i < l ; i++ ) {
      if( gI[i].hovered ) {
        ThumbnailHoverOut(gI[i].$elt);
      }
    }
  }
  
  function ThumbnailInit( $e ) {
    var n=$e.data("index");
    if( n == undefined ) { return; }    // required because can be fired on ghost elements
    var item=gI[n];
    if( typeof gO.fnThumbnailHoverInit == 'function' ) {
      gO.fnThumbnailHoverInit($e, item, ExposedObjects() );
    }
    removeCSSTransform(item);
    
    for( j=0; j<g_tnHE.length; j++) {
      switch( g_tnHE[j].name ) {

        case 'imageSplit4':
          var $subCon=$e.find('.subcontainer'),
          $lI=$e.find('.labelImage'),
          $iC=$e.find('.imgContainer');
          $e.find('.imgContainer').css({position:'absolute'});
          $subCon.css({overflow:'hidden', position:'relative', width:'100%', height:'100%'});
          $subCon.prepend($iC.clone());
          $subCon.prepend($e.find('.imgContainer').clone());
          $iC=$e.find('.imgContainer');
          setElementOnTop('', $iC);
          
          newCSSTransform(item, 'imgContainer0', $iC.eq(0));
          SetCSSTransform(item, 'imgContainer0');
          newCSSTransform(item, 'imgContainer1', $iC.eq(1));
          SetCSSTransform(item, 'imgContainer1');
          newCSSTransform(item, 'imgContainer2', $iC.eq(2));
          SetCSSTransform(item, 'imgContainer2');
          newCSSTransform(item, 'imgContainer3', $iC.eq(3));
          SetCSSTransform(item, 'imgContainer3');
          break;
          
        case 'imageSplitVert':
          var $subCon=$e.find('.subcontainer'),
          $iC=$e.find('.imgContainer');
          $iC.css({position:'absolute'});
          $subCon.css({overflow:'hidden', position:'relative'});  //, width:'100%', height:'100%'});
          $subCon.prepend($iC.clone());
          $iC=$e.find('.imgContainer');
          setElementOnTop('', $iC);

          newCSSTransform(item, 'imgContainer0', $iC.eq(0));
          SetCSSTransform(item, 'imgContainer0');
          newCSSTransform(item, 'imgContainer1', $iC.eq(1));
          SetCSSTransform(item, 'imgContainer1');
          break;
          
        case 'labelSplit4':
          var $subCon=$e.find('.subcontainer'),
          $lI=$e.find('.labelImage').css({top:0, bottom:0});
          $subCon.css({overflow:'hidden', position:'relative'});
          $lI.clone().appendTo($subCon);
          $e.find('.labelImage').clone().appendTo($subCon);
          $lI=$e.find('.labelImage');
          
          newCSSTransform(item, 'labelImage0', $lI.eq(0));
          SetCSSTransform(item, 'labelImage0');
          newCSSTransform(item, 'labelImage1', $lI.eq(1));
          SetCSSTransform(item, 'labelImage1');
          newCSSTransform(item, 'labelImage2', $lI.eq(2));
          SetCSSTransform(item, 'labelImage2');
          newCSSTransform(item, 'labelImage3', $lI.eq(3));
          SetCSSTransform(item, 'labelImage3');

          break;
          
        case 'labelSplitVert':
          var $subCon=$e.find('.subcontainer'),
          $lI=$e.find('.labelImage');
          $subCon.css({overflow:'hidden', position:'relative'});
          $lI.clone().appendTo($subCon);
          $lI=$e.find('.labelImage');
          
          newCSSTransform(item, 'labelImage0', $lI.eq(0));
          SetCSSTransform(item, 'labelImage0');
          newCSSTransform(item, 'labelImage1', $lI.eq(1));
          SetCSSTransform(item, 'labelImage1');
          break;

        case 'labelAppearSplit4':
          var $subCon=$e.find('.subcontainer');
          $lI=$e.find('.labelImage'),
          $lI.css({left:0, top:0, right:0, bottom:0});
          $subCon.css({overflow:'hidden', position:'relative'});
          $lI.clone().appendTo($subCon);
          $e.find('.labelImage').clone().appendTo($subCon);
          $lI=$e.find('.labelImage');

          var o=newCSSTransform(item, 'labelImage0', $lI.eq(0));
          o.translateX=-item.thumbFullWidth/2;
          o.translateY=-item.thumbFullHeight/2;
          SetCSSTransform(item, 'labelImage0');
          o=newCSSTransform(item, 'labelImage1', $lI.eq(1));
          o.translateX=item.thumbFullWidth/2;
          o.translateY=-item.thumbFullHeight/2;
          SetCSSTransform(item, 'labelImage1');
          o=newCSSTransform(item, 'labelImage2', $lI.eq(2));
          o.translateX=item.thumbFullWidth/2;
          o.translateY=item.thumbFullHeight/2;
          SetCSSTransform(item, 'labelImage2');
          o=newCSSTransform(item, 'labelImage3', $lI.eq(3));
          o.translateX=-item.thumbFullWidth/2;
          o.translateY=item.thumbFullHeight/2;
          SetCSSTransform(item, 'labelImage3');

          break;
          
        case 'labelAppearSplitVert':
          var $subCon=$e.find('.subcontainer'),
          $lI=$e.find('.labelImage');
          $subCon.css({overflow:'hidden', position:'relative'});
          $lI.clone().appendTo($subCon);
          $lI=$e.find('.labelImage');

          newCSSTransform(item, 'labelImage0', $lI.eq(0)).translateX=-item.thumbFullWidth/2;
          SetCSSTransform(item, 'labelImage0');
          newCSSTransform(item, 'labelImage1', $lI.eq(1)).translateX=item.thumbFullWidth/2;
          SetCSSTransform(item, 'labelImage1');
          break;
          
        case 'imageScale150Outside':
          $gE.base.css({overflow: 'visible'});
          $gE.conTn.css({overflow: 'visible'});
          $e.css({overflow: 'visible'});
          $e.find('.subcontainer').css({overflow: 'visible'});
          $e.find('.imgContainer').css({overflow: 'visible'});
          newCSSTransform(item, 'img0', $e.find('img'));
          SetCSSTransform(item, 'img0');
          setElementOnTop($e.find('.imgContainer'), $e.find('.labelImage'));
          break;
          
        case 'scale120':
          $gE.base.css({overflow: 'visible'});
          $gE.conTn.css({overflow: 'visible'});
          newCSSTransform(item, 'base', $e);
          SetCSSTransform(item, 'base');
          break;
          
        case 'scaleLabelOverImage':
          var $t=$e.find('.imgContainer');
          var $l=$e.find('.labelImage');
          setElementOnTop($t, $l);
          $e.find('.labelImage').css({opacity:0});

          newCSSTransform(item, 'labelImage0', $l).scale=50;
          SetCSSTransform(item, 'labelImage0');
          newCSSTransform(item, 'imgContainer0', $t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'overScale':
          $e.css({overflow: 'hidden'});
          var $t=$e.find('.imgContainer');
          var $l=$e.find('.labelImage');
          setElementOnTop('', $l);
          $l.css({opacity:0});
          $t.css({ opacity: 1});

          newCSSTransform(item, 'labelImage0', $l).scale=150;
          SetCSSTransform(item, 'labelImage0');
          newCSSTransform(item, 'imgContainer0', $t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'overScaleOutside':
          $gE.base.css({overflow: 'visible'});
          $gE.conTn.css({overflow: 'visible'});
          $e.css({overflow: 'visible'});
          var $t=$e.find('.imgContainer');
          var $l=$e.find('.labelImage');
          setElementOnTop('', $l);
          $l.css({opacity:0 });
          $t.css({ opacity: 1});

          newCSSTransform(item, 'labelImage0', $l).scale=150;
          SetCSSTransform(item, 'labelImage0');
          newCSSTransform(item, 'imgContainer0', $t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'rotateCornerBL':
          $e.css({overflow: 'hidden'});
          var $t=$e.find('.labelImage');
          $t.css({opacity:1});
          $t[0].style[g_CSStransformName+'Origin'] = '100% 100%';
          newCSSTransform(item, 'labelImage0', $t).rotateZ=-90;
          SetCSSTransform(item, 'labelImage0');
          $t=$e.find('.imgContainer');
          $t[0].style[g_CSStransformName+'Origin'] = '100% 100%';;
          newCSSTransform(item, 'imgContainer0', $t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'rotateCornerBR':
          $e.css({overflow: 'hidden'});
          var $t=$e.find('.labelImage');
          $t.css({opacity:1});
          $t[0].style[g_CSStransformName+'Origin'] = '0% 100%';
          newCSSTransform(item, 'labelImage0', $t).rotateZ=90;
          SetCSSTransform(item, 'labelImage0');
          $t=$e.find('.imgContainer');
          $t[0].style[g_CSStransformName+'Origin'] = '0 100%';
          newCSSTransform(item, 'imgContainer0', $t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'imageRotateCornerBL':
          var $t=$e.find('.imgContainer');
          setElementOnTop($e, $t);
          $e.css({overflow: 'hidden'});
          $e.find('.labelImage').css({opacity: 1});
          $t[0].style[g_CSStransformName+'Origin'] = 'bottom right';
          newCSSTransform(item, 'imgContainer0', $t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'imageRotateCornerBR':
          var $t=$e.find('.imgContainer');
          setElementOnTop($e, $t);
          $e.css({overflow: 'hidden'});
          $e.find('.labelImage').css({opacity: 1});
          $t[0].style[g_CSStransformName+'Origin'] = '0 100%';
          newCSSTransform(item, 'imgContainer0', $t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'slideUp':
          $e.css({overflow: 'hidden'});
          $t=$e.find('.labelImage');
          $t.css({opacity:1, top:0});
          newCSSTransform(item, 'labelImage0',$t).translateY=item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          $t=$e.find('.imgContainer');
          $t.css({left:0, top:0});
          newCSSTransform(item, 'imgContainer0',$t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'slideDown':
          $e.css({overflow: 'hidden'});
          $t=$e.find('.labelImage');
          $t.css({opacity:1, top:0});
          newCSSTransform(item, 'labelImage0',$t).translateY=-item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          $t=$e.find('.imgContainer');
          $t.css({left:0, top:0});
          newCSSTransform(item, 'imgContainer0',$t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'slideRight':
          $e.css({overflow: 'hidden'});
          $t=$e.find('.labelImage');
          $t.css({opacity:1, top:0});
          newCSSTransform(item, 'labelImage0',$t).translateX=-item.thumbFullWidth;
          SetCSSTransform(item, 'labelImage0');
          $t=$e.find('.imgContainer');
          $t.css({left:0, top:0});
          newCSSTransform(item, 'imgContainer0',$t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'slideLeft':
          $e.css({overflow: 'hidden'});
          $t=$e.find('.labelImage');
          $t.css({opacity:1, top:0});
          newCSSTransform(item, 'labelImage0',$t).translateX=item.thumbFullWidth;
          SetCSSTransform(item, 'labelImage0');
          $t=$e.find('.imgContainer');
          $t.css({left:0, top:0});
          newCSSTransform(item, 'imgContainer0',$t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'imageSlideUp':
        case 'imageSlideDown':
        case 'imageSlideRight':
        case 'imageSlideLeft':
          $t=$e.find('.imgContainer');
          setElementOnTop($e, $t);
          $e.css({overflow: 'visible'});
          $e.find('.labelImage').css({opacity: 1});
          $t.css({left:0, top:0});
          newCSSTransform(item, 'imgContainer0',$t);
          SetCSSTransform(item, 'imgContainer0');
          break;
          
        case 'labelAppear':
        case 'labelAppear75':
          var c='rgb('+g_custGlobals.oldLabelRed+','+g_custGlobals.oldLabelGreen+','+g_custGlobals.oldLabelBlue+',0)';
          $e.find('.labelImage').css({backgroundColor: c});
          //$e.find('.labelImage')[0].style.setProperty( 'backgroundColor',c, 'important' );
          $e.find('.labelImageTitle').css({opacity: 0});
          $e.find('.labelFolderTitle').css({opacity: 0});
          $e.find('.labelDescription').css({opacity: 0});
          break;

        case 'descriptionAppear':
          $e.find('.labelDescription').css({opacity: 0});
          break;
          
        case 'labelSlideUpTop':
          $e.css({overflow: 'hidden'});
          $e.find('.labelImage').css({top:0, bottom:0});
          newCSSTransform(item, 'labelImage0',$e.find('.labelImage')).translateY=item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          break;
          
        case 'labelSlideUp':
          $e.css({overflow: 'hidden'});
          newCSSTransform(item, 'labelImage0',$e.find('.labelImage')).translateY=item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          break;
          
        case 'labelSlideDown':
          $e.css({overflow: 'hidden'});
          newCSSTransform(item, 'labelImage0',$e.find('.labelImage')).translateY=-item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          break;

        case 'descriptionSlideUp':
          $e.css({overflow: 'hidden'});
          var lh=(item.kind == 'album' ? $e.find('.labelFolderTitle').outerHeight(true) : $e.find('.labelImageTitle').outerHeight(true));
          $e.find('.labelDescription').css({opacity:0});
          $e.find('.labelImage').css({height:lh});
          newCSSTransform(item, 'labelImage0',$e.find('.labelImage'));//.translateY=-lh;
          SetCSSTransform(item, 'labelImage0');
          break;

        case 'imageExplode':
          // $gE.base.css('overflow', 'visible');
          // $gE.conTn.css('overflow', 'visible');
          // $e.css('overflow', 'visible');
          
          setElementOnTop( '', $e);
          setElementOnTop( $e.find('.labelImage'), $e.find('.imgContainer'));
          var $subCon=$e.find('.subcontainer'),
          n=7,
          th=item.thumbFullHeight,      //$e.outerHeight(true);
          $iC=$e.find('.imgContainer'),
          w=$iC.outerWidth(true)/n,
          h=$iC.outerHeight(true),
          h=$iC.outerHeight(true)/n;
          for(var r=0; r<n; r++ ) {
            for(var c=0; c<n; c++ ) {
              var s='rect('+h*r+'px, '+w*(c+1)+'px, '+h*(r+1)+'px, '+w*c+'px)';
              $iC.clone().appendTo($subCon).css({top:0, scale:1, clip:s, left:0, position:'absolute'}).data('ngScale',1);
            }
          }
          $iC.remove();
          break;
          
        case 'imageFlipHorizontal':
          switch( gO.thumbnailLabel.position ){
            case 'overImageOnTop':
              $e.find('.labelImage').css({top:-g_tn.imgcBorderHeight/2, bottom:g_tn.imgcBorderWidth/2, left:0, right:0 });
              break;
            case 'overImageOnMiddle':
              $e.find('.labelImage').css({top:-g_tn.imgcBorderHeight/2, bottom:g_tn.imgcBorderWidth/2, left:0, right:0});
              break;
            case 'overImageOnBottom':
            default :
              $e.find('.labelImage').css({bottom:g_tn.imgcBorderWidth/2, left:0, right:0});
              break;
          }
          $gE.base.css({overflow: 'visible'});
          $gE.conTn.css({overflow: 'visible'});
          $e.css({overflow: 'visible'});
          setElementOnTop( '', $e);
          setElementOnTop( $e.find('.labelImage'), $e.find('.imgContainer'));
          var $t=$e.find('.subcontainer');
          $t.css({overflow: 'visible'});
          $t[0].style[g_CSStransformStyle] = 'preserve-3d'
          var n= Math.round(item.thumbFullHeight*1.2) + 'px';
          $t[0].style[g_CSSperspective] = n;

          
          // $e.find('.imgContainer').data('ngRotateX','0');
          $t=$e.find('.imgContainer');
          $t[0].style[g_CSSbackfaceVisibilityName]= 'hidden';
          // $t[0].style[g_CSStransformName]= 'rotateX:(0deg)';
          newCSSTransform(item, 'imgContainer0', $t);
          SetCSSTransform(item, 'imgContainer0');
          
          $e.find('.image')[0].style[g_CSSbackfaceVisibilityName] = 'hidden';
          
          // $e.find('.labelImage').data('ngRotateX','180');
          $t=$e.find('.labelImage');
          $t[0].style[g_CSSbackfaceVisibilityName] = 'hidden';
          // $t[0].style[g_CSStransformName] = 'rotateX(180deg)';
          newCSSTransform(item, 'labelImage0',$t).rotateX=180;
          SetCSSTransform(item, 'labelImage0');
          break;
          
        case 'imageFlipVertical':
          switch( gO.thumbnailLabel.position ){
            case 'overImageOnTop':
              $e.find('.labelImage').css({top:-g_tn.imgcBorderHeight/2, bottom:g_tn.imgcBorderWidth/2, left:0, right:0 });
              break;
            case 'overImageOnMiddle':
              $e.find('.labelImage').css({top:-g_tn.imgcBorderHeight/2, bottom:g_tn.imgcBorderWidth/2, left:0, right:0});
              break;
            case 'overImageOnBottom':
            default :
              $e.find('.labelImage').css({bottom:g_tn.imgcBorderWidth/2, left:0, right:0});
              break;
          }
          $gE.base.css({overflow: 'visible'});
          $gE.conTn.css({overflow: 'visible'});
          $e.css({overflow: 'visible'});
          setElementOnTop( '', $e);
          setElementOnTop( $e.find('.labelImage'), $e.find('.imgContainer'));
          var $t=$e.find('.subcontainer');
          $t.css({overflow: 'visible'});
          $t[0].style[g_CSStransformStyle] = 'preserve-3d'
          var n= Math.round(item.thumbFullWidth*1.2) + 'px';
          $t[0].style[g_CSSperspective] = n;

          $t=$e.find('.imgContainer');
          $t[0].style[g_CSSbackfaceVisibilityName]= 'hidden';
          newCSSTransform(item, 'imgContainer0', $t);
          SetCSSTransform(item, 'imgContainer0');
          
          $e.find('.image')[0].style[g_CSSbackfaceVisibilityName] = 'hidden';
          
          $t=$e.find('.labelImage');
          $t[0].style[g_CSSbackfaceVisibilityName] = 'hidden';
          newCSSTransform(item, 'labelImage0',$t).rotateY=180;
          SetCSSTransform(item, 'labelImage0');
          
          break;
          
        // case 'flipHorizontal':  // ONLY TO TEST --> hover issue
          // var n= Math.round(item.thumbFullHeight*1.2) + 'px';
          // $e.find('.labelImage').css({ perspective: n, rotateX: '180deg', 'backface-visibility': 'hidden', 'opacity':'1', 'height':'100%' });
          // break;
          
        // case 'flipVertical':  // OONLY TO TEST --> hover issue
          // var n= Math.round(item.thumbFullWidth*1.2) + 'px';
          // $e.find('.subcontainer').css({ perspective: n, rotateY: '0deg'});
          // $e.find('.labelImage').css({ perspective: n, rotateY: '180deg', 'backface-visibility': 'hidden', 'opacity':'1', 'height':'100%' });
          // break;
          
        case 'imageScale150':
          $e.css({overflow: 'hidden'});
          newCSSTransform(item, 'img0', $e.find('img'));
          SetCSSTransform(item, 'img0');
          break;
          
        case 'imageScaleIn80':
          $e.css({overflow: 'hidden'});
          newCSSTransform(item, 'img0', $e.find('img')).scale=120;
          SetCSSTransform(item, 'img0');
          break;

        case 'imageSlide2Up':
        case 'imageSlide2Down':
        case 'imageSlide2Left':
        case 'imageSlide2Right':
        case 'imageSlide2UpRight':
        case 'imageSlide2UpLeft':
        case 'imageSlide2DownRight':
        case 'imageSlide2DownLeft':
          $e.css({overflow:'hidden'});
          item.customData.hoverEffectRDir=g_tnHE[j].name;
          ThumbnailInitImageSlide($e, item);
          break;
          
        case 'imageSlide2Random':
          $e.css({overflow:'hidden'});
          var dir= ['imageSlide2Up','imageSlide2Down','imageSlide2Left','imageSlide2Left','imageSlide2UpRight','imageSlide2UpLeft','imageSlide2DownRight','imageSlide2DownLeft'];
          item.customData.hoverEffectRDir=dir[Math.floor(Math.random()*dir.length)];
          ThumbnailInitImageSlide($e, item);
          break;
      }
    }
    item.hoverInitDone=true;

  }
  
  function ThumbnailInitImageSlide( $e, item ) {
    // var w=item.thumbImgWidth;    //$e.outerWidth(true),
    // h=item.thumbImg().height,       //$e.outerHeight(true);
    var w=item.thumbFullWidth,    //$e.outerWidth(true),
    h=item.thumbFullHeight,       //$e.outerHeight(true);
    c=null;
    var t=newCSSTransform(item, 'img0', $e.find('img'));
    t.scale=140;
    switch( item.customData.hoverEffectRDir ){
      case 'imageSlide2Up':
        // c={top:h*.1, left: -w*.1};
        // t.translateY=h*.1;
        // t.translateX=-w*.1;
        t.translateY= item.thumbFullHeight < (item.thumbImg().height*1.4) ? ((item.thumbImg().height*1.4)-item.thumbFullHeight)/2 : 0;
        t.translateX= item.thumbFullWidth < (item.thumbImg().width*1.4) ? -((item.thumbImg().width*1.4)-item.thumbFullWidth)/2 : 0;
        break;
      case 'imageSlide2Down':
        // c={top:-h*.1, left: -w*.1};
        // t.translateY=-h*.1;
        var tY=item.thumbFullHeight < (item.thumbImg().height*1.4) ? Math.min(((item.thumbImg().height*1.4)-item.thumbFullHeight)/2*.1,h*.1) : 0;
        t.translateY = -tY;
        var tX=item.thumbFullWidth < (item.thumbImg().width*1.4) ? Math.min(((item.thumbImg().width*1.4)-item.thumbFullWidth)/2*.1,w*.1) : 0;
        t.translateX = tX;
        break;
      case 'imageSlide2Left':
        // c={top:-h*.1, left: w*.1};
        t.translateY=-h*.1;
        t.translateX=w*.1;
        break;
      case 'imageSlide2Right':
        // c={top:-h*.1, left: -w*.1};
        t.translateY=-h*.1;
        t.translateX=-w*.1;
        break;

      case 'imageSlide2UpRight':
        // c={top:h*.05, left: -w*.05};
        t.translateY=h*.05;
        t.translateX=-w*.05;
        break;
      case 'imageSlide2UpLeft':
        // c={top:h*.05, left: w*.05};
        t.translateY=h*.05;
        t.translateX=w*.05;
        break;
      case 'imageSlide2DownRight':
        // c={top:-h*.05, left: -w*.05};
        t.translateY=-h*.05;
        t.translateX=-w*.05;
        break;
      case 'imageSlide2DownLeft':
        // c={top:-h*.05, left: w*.05};
        t.translateY=-h*.05;
        t.translateX=w*.05;
        break;
    }
    SetCSSTransform(item, 'img0');
    //$e.find('.subcontainer').width(w).height(h);
    // $e.find('img').css({'max-width':w*1.5, 'max-height':h*1.5});
    // $e.find('img')[0].style[g_CSStransformName] = 'scale(1.4)';
    // $e.find('img').css(c);  //.css({'width':w*1.5, 'height':h*1.5});
    //$e.find('.imgContainer').css(c).css({'width':w*1.5, 'height':h*1.5});
  }
  

  function ThumbnailOverResize( $e ) {
    var n=$e.data("index");
    if( n == undefined ) { return; }    // required because can be fired on ghost elements
    var item=gI[n];
    if( !item.hoverInitDone ) {
      ThumbnailInit($e);
      return;
    }
    if( typeof gO.fnThumbnailHoverResize == 'function' ) {
      gO.fnThumbnailHoverResize($e, item, ExposedObjects() );
    }
    for( j=0; j<g_tnHE.length; j++) {
      switch( g_tnHE[j].name ) {
        case 'imageSplit4':
          var w=item.thumbFullWidth-g_tn.borderWidth-g_tn.imgcBorderWidth,
          h=item.thumbFullHeight-g_tn.borderHeight-g_tn.imgcBorderHeight,
          $iC=$e.find('.imgContainer'),
          s='rect(0px, '+Math.ceil(w/2)+'px, '+Math.ceil(h/2)+'px, 0px)';
          $iC.eq(0).css({ clip:s});
          s='rect(0px, '+w+'px, '+Math.ceil(h/2)+'px, '+Math.ceil(w/2)+'px)';
          $iC.eq(1).css({ clip:s });
          s='rect('+Math.ceil(h/2)+'px, '+w+'px, '+h+'px, '+Math.ceil(w/2)+'px)';
          $iC.eq(2).css({ clip:s });
          s='rect('+Math.ceil(h/2)+'px, '+Math.ceil(w/2)+'px, '+h+'px, 0px)';
          $iC.eq(3).css({ clip:s });
          break;
          
        case 'imageSplitVert':
          var $iC=$e.find('.imgContainer'),
          w=item.thumbFullWidth-g_tn.borderWidth-g_tn.imgcBorderWidth,
          h=item.thumbFullHeight-g_tn.borderHeight-g_tn.imgcBorderHeight,
          s='rect(0px, '+Math.ceil(w/2)+'px, '+h+'px, 0px)';
          $iC.eq(0).css({ clip:s });
          s='rect(0px, '+w+'px, '+h+'px, '+Math.ceil(w/2)+'px)';
          $iC.eq(1).css({clip:s });
          break;
          
        case 'labelSplit4':
          var w=item.thumbFullWidth-g_tn.borderWidth-g_tn.imgcBorderWidth,
          h=item.thumbFullHeight-g_tn.borderHeight-g_tn.imgcBorderHeight,
          $lI=$e.find('.labelImage');
          s='rect(0px, '+Math.ceil(w/2)+'px, '+Math.ceil(h/2)+'px, 0px)',
          $lI.eq(0).css({ clip:s });
          s='rect(0px, '+w+'px, '+Math.ceil(h/2)+'px, '+Math.ceil(w/2)+'px)';
          $lI.eq(1).css({ clip:s });
          s='rect('+Math.ceil(h/2)+'px, '+w+'px, '+h+'px, '+Math.ceil(w/2)+'px)';
          $lI.eq(2).css({ clip:s });
          s='rect('+Math.ceil(h/2)+'px, '+Math.ceil(w/2)+'px, '+h+'px, 0px)';
          $lI.eq(3).css({ clip:s });
          break;
          
        case 'labelSplitVert':
          var w=item.thumbFullWidth-g_tn.borderWidth-g_tn.imgcBorderWidth,
          h=item.thumbFullHeight-g_tn.borderHeight-g_tn.imgcBorderHeight,
          $lI=$e.find('.labelImage');
          var s='rect(0px, '+Math.ceil(w/2)+'px, '+h+'px, 0px)';
          $lI.eq(0).css({ clip:s});
          s='rect(0px, '+w+'px, '+h+'px, '+Math.ceil(w/2)+'px)';
          $lI.eq(1).css({ clip:s});
          break;

        case 'labelAppearSplit4':
          var w=item.thumbFullWidth-g_tn.borderWidth-g_tn.imgcBorderWidth,
          h=item.thumbFullHeight-g_tn.borderHeight-g_tn.imgcBorderHeight;
          $lI=$e.find('.labelImage');
          var s='rect(0px, '+Math.ceil(w/2)+'px, '+Math.ceil(h/2)+'px, 0px)';
          $lI.eq(0).css({ clip:s });
          s='rect(0px, '+w+'px, '+Math.ceil(h/2)+'px, '+Math.ceil(w/2)+'px)';
          $lI.eq(1).css({ clip:s });
          s='rect('+Math.ceil(h/2)+'px, '+w+'px, '+h+'px, '+Math.ceil(w/2)+'px)';
          $lI.eq(2).css({ clip:s });
          s='rect('+Math.ceil(h/2)+'px, '+Math.ceil(w/2)+'px, '+h+'px, 0px)';
          $lI.eq(3).css({ clip:s });
          
          
          item.eltTransform['labelImage0'].translateX=-item.thumbFullWidth/2;
          item.eltTransform['labelImage0'].translateY=-item.thumbFullHeight/2;
          SetCSSTransform(item, 'labelImage0');
          item.eltTransform['labelImage1'].translateX=item.thumbFullWidth/2;
          item.eltTransform['labelImage1'].translateY=-item.thumbFullHeight/2;
          SetCSSTransform(item, 'labelImage1');
          item.eltTransform['labelImage2'].translateX=item.thumbFullWidth/2;
          item.eltTransform['labelImage2'].translateY=item.thumbFullHeight/2;
          SetCSSTransform(item, 'labelImage2');
          item.eltTransform['labelImage3'].translateX=-item.thumbFullWidth/2;
          item.eltTransform['labelImage3'].translateY=item.thumbFullHeight/2;
          SetCSSTransform(item, 'labelImage3');
          break;
          
        case 'labelAppearSplitVert':
          var w=item.thumbFullWidth-g_tn.borderWidth-g_tn.imgcBorderWidth,
          h=item.thumbFullHeight-g_tn.borderHeight-g_tn.imgcBorderHeight;
          $lI=$e.find('.labelImage');
          var s='rect(0px, '+Math.ceil(w/2)+'px, '+h+'px, 0px)';
          $lI.eq(0).css({ clip:s});
          s='rect(0px, '+w+'px, '+h+'px, '+Math.ceil(w/2)+'px)';
          $lI.eq(1).css({ clip:s});
          item.eltTransform['labelImage0'].translateX=-item.thumbFullWidth/2;
          SetCSSTransform(item, 'labelImage0');
          item.eltTransform['labelImage1'].translateX=item.thumbFullWidth/2;
          SetCSSTransform(item, 'labelImage1');

          break;
          item.transformLabelImage[0].translateX=-item.thumbFullWidth/2;
          SetCSSTransform($lI.eq(0),item.transformLabelImage[0]);
          item.transformLabelImage[1].translateX=item.thumbFullWidth/2;
          SetCSSTransform($lI.eq(1),item.transformLabelImage[1]);
          break;
        
        case 'slideUp':
          // $e.find('.labelImage').css({top:item.thumbFullHeight});
          item.eltTransform['labelImage0'].translateY=item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          break;
          
        case 'slideDown':
          // $e.find('.labelImage').css({bottom:item.thumbFullHeight});  //, 'background':'none'});
          item.eltTransform['labelImage0'].translateY=-item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          break;
          
        case 'slideRight':
          // $e.find('.labelImage').css({left:-item.thumbFullWidth});
          item.eltTransform['labelImage0'].translateX=-item.thumbFullWidth;
          SetCSSTransform(item, 'labelImage0');
          break;
          
        case 'slideLeft':
          // $e.find('.labelImage').css({left:item.thumbFullWidth});
          item.eltTransform['labelImage0'].translateX=item.thumbFullWidth;
          SetCSSTransform(item, 'labelImage0');
          break;
          
        case 'imageExplode':
          var $subCon=$e.find('.subcontainer'),
          $iC=$e.find('.imgContainer'),
          n=Math.sqrt($iC.length),
          w=$iC.eq(0).outerWidth(true)/n,
          h=$iC.eq(0).outerHeight(true)/n,
          i=0;
          for(var r=0; r<n; r++ ) {
            for(var c=0; c<n; c++ ) {
              var s='rect('+h*r+'px, '+w*(c+1)+'px, '+h*(r+1)+'px, '+w*c+'px)';
              //$iC.eq(i++).css({ 'clip':s });
            }
          }
          break;
          
        case 'imageFlipHorizontal':
          var $t=$e.find('.subcontainer');
          var n= Math.round(item.thumbFullHeight*1.2) + 'px';
          $t[0].style[g_CSSperspective] = n;
          // $e.find('.imgContainer').css({perspective: n, rotateX: '0deg', 'backface-visibility': 'hidden'});
          // $e.find('.labelImage').css({ perspective: n, rotateX: '180deg', 'backface-visibility': 'hidden','height':item.thumbFullHeight,'opacity':'1' });
          break;
          
        case 'imageFlipVertical':
          var $t=$e.find('.subcontainer');
          var n= Math.round(item.thumbFullWidth*1.2) + 'px';
          $t[0].style[g_CSSperspective] = n;
          //$e.find('.imgContainer').css({perspective: n, rotateY: '0deg', 'backface-visibility': 'hidden'});
          //$e.find('.labelImage').css({ perspective: n, rotateY: '180deg', 'backface-visibility': 'hidden','height':item.thumbFullHeight,'opacity':'1' });
          break;
          
        case 'imageSlide2Up':
        case 'imageSlide2Down':
        case 'imageSlide2Left':
        case 'imageSlide2Right':
        case 'imageSlide2UpRight':
        case 'imageSlide2UpLeft':
        case 'imageSlide2DownRight':
        case 'imageSlide2DownLeft':
        case 'imageSlide2Random':
          ThumbnailInitImageSlide($e, item );
          break;

        case 'slideUp':
          item.eltTransform['labelImage0'].translateY=item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          break;
        case 'slideDown':
          item.eltTransform['labelImage0'].translateY=-item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          break;
        case 'slideRight':
          item.eltTransform['labelImage0'].translateX=-item.thumbFullWidth;
          SetCSSTransform(item, 'labelImage0');
          break;
        case 'slideLeft':
          item.eltTransform['labelImage0'].translateX=item.thumbFullWidth;
          SetCSSTransform(item, 'labelImage0');
          break;
          
        case 'labelSlideUpTop':
        case 'labelSlideUp':
          item.eltTransform['labelImage0'].translateY=item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          break;
          
        case 'labelSlideDown':
          $e.css({overflow: 'hidden'});
          // $e.find('.labelImage').css({top:-item.thumbFullHeight, bottom:''});
          item.eltTransform['labelImage0'].translateY=-item.thumbFullHeight;
          SetCSSTransform(item, 'labelImage0');
          break;

        case 'descriptionSlideUp':
          // var lh=(item.kind == 'album' ? $e.find('.labelFolderTitle').outerHeight(true) : $e.find('.labelImageTitle').outerHeight(true));
          // var p=item.thumbFullHeight - lh -g_tn.borderHeight-g_tn.imgcBorderHeight;
          // var lh2=$e.find('.labelDescription').outerHeight(true);
          //item.eltTransform['labelImage0'].translateY=lh2;
          //SetCSSTransform(item, 'labelImage0');

          
      }
    }

  };

  

  function newCSSTransform(item, eltClass, $e) {
    if( item.eltTransform[eltClass] == undefined ) {
      item.eltTransform[eltClass]=InitCSSTransform();
      item.eltTransform[eltClass].$elt=$e;
    }
    return item.eltTransform[eltClass];
  }
  function removeCSSTransform(item) {
     for (var p in item.eltTransform) {
        delete item.eltTransform[p];
     }
  }
  
  function InitCSSTransform() {
    var obj={translateX:0, translateY:0, rotateX:0, rotateY:0, rotateZ:0, scale:100};
    return obj;
  }
  
  function SetCSSTransform(item, objClass) {
    var obj=item.eltTransform[objClass];
    // var v = 'translateX('+obj.translateX+'px) translateY('+obj.translateY+'px)  scale('+obj.scale/100+')';
    var v = 'translateX('+obj.translateX+'px) translateY('+obj.translateY+'px) scale('+obj.scale/100+')';
    if( !(g_IE <= 9) && !g_isGingerbread ) {
      v += ' rotateX('+obj.rotateX+'deg) rotateY('+obj.rotateY+'deg) rotateZ('+obj.rotateZ+'deg)';
    }
    else {
      v += ' rotate('+obj.rotateZ+'deg)';
    }
    obj.$elt[0].style[g_CSStransformName]= v;
  }
  

  function TnAni( $e, n, anime, item, eltClass) {

    var transform=['translateX','translateY', 'scale', 'rotateX', 'rotateY', 'rotateZ'];

    if( g_aengine == 'animate' ) {
      // internal support for CCS transform (not supported by jQuery)
      for( var i=0; i<transform.length; i++ ) {
      var tf=transform[i];
        if( anime[tf] !== undefined ) {
          var from = {v: parseInt(item.eltTransform[eltClass][tf]), item:item, tf:tf, eltClass:eltClass, to:parseInt(anime[tf]) };
          var to = {v: parseInt(anime[tf])};
          if( g_tnHE[n].delay > 0 ) {
            jQuery(from).delay(g_tnHE[n].delay).animate(to, { duration:g_tnHE[n].duration, easing:g_tnHE[n].easing, queue:false, step: function(currentValue) {
                if( this.item.hovered ) {
                  item.eltTransform[this.eltClass][this.tf]=currentValue;
                  SetCSSTransform(this.item, this.eltClass);
                }
              }, complete: function() {
                if( this.item.hovered ) {
                  item.eltTransform[this.eltClass][this.tf]=this.to;
                  SetCSSTransform(this.item, this.eltClass);
                }
              }
            });
          }
          else {
            jQuery(from).animate(to, { duration:g_tnHE[n].duration, easing:g_tnHE[n].easing, queue:false, step: function(currentValue) {
              // var i = Math.round(this.v);
              // this.curr || (this.curr = i);
              // if (!this.curr || this.curr != i) { 
                if( this.item.hovered ) {
                  item.eltTransform[this.eltClass][this.tf]=currentValue;
                  SetCSSTransform(this.item, this.eltClass);
                }
              }, complete: function() {
                if( this.item.hovered ) {
                  item.eltTransform[this.eltClass][this.tf]=this.to;
                  SetCSSTransform(this.item, this.eltClass);
                }
              }
            });
          }
          delete anime[tf];
        }
      
      }
    
    
    }

    if( anime.length == 0 ) { return; }
 
    //$e.find('.imgContainer').eq(0).delay(g_tnHE[n].delay)[g_aengine]({'right':'50%', 'top':'-50%'},g_tnHE[n].duration, g_tnHE[n].easing);
    if( g_tnHE[n].delay > 0 ) {
      // $e.delay(g_tnHE[n].delay)[g_aengine](anime, g_tnHE[n].duration, g_tnHE[n].easing);
      if( g_aengine == 'transition' ) {
        // transit has a bug on queue --> we do not use it
        $e.delay(g_tnHE[n].delay)[g_aengine](anime, g_tnHE[n].duration , g_tnHE[n].easing );
      }
      else {
        $e.delay(g_tnHE[n].delay)[g_aengine](anime, {duration:g_tnHE[n].duration , easing:g_tnHE[n].easing, queue:false });
      }
    }
    else {
      // $e[g_aengine](anime, g_tnHE[n].duration, g_tnHE[n].easing);
      if( g_aengine == 'transition' ) {
        // transit has a bug on queue --> we do not use it
        //anime.queue=false;
        //anime.duration=5000;
        $e[g_aengine](anime, g_tnHE[n].duration, g_tnHE[n].easing );
      } 
      else {
        $e[g_aengine](anime, {duration:g_tnHE[n].duration , easing:g_tnHE[n].easing, queue:false});
      }
    }
  }
  
  
  function ThumbnailHover( $e ) {
    var n=$e.data('index');
    if( n == undefined ) { return; }    // required because can be fired on ghost elements
    if( g_aengine == 'velocity' ) {
      $e.find('*').velocity('stop', true);
    }
    else {
      $e.find('*').stop(true,false);
    }
    var item=gI[n];
    item.hovered=true;
    var dscale=(g_aengine == 'animate' ? 1 : 100);
    
    if( typeof gO.fnThumbnailHover == 'function' ) { 
      gO.fnThumbnailHover($e, item, ExposedObjects());
    }    
    
    try {
      for( j=0; j<g_tnHE.length; j++) {
        switch(g_tnHE[j].name ) {
          case 'imageSplit4':
            var $t=$e.find('.imgContainer');
            TnAni($t.eq(0), j, {translateX:-item.thumbFullWidth/2, translateY:-item.thumbFullHeight/2}, item, 'imgContainer0' );
            TnAni($t.eq(1), j, {translateX:item.thumbFullWidth/2, translateY:-item.thumbFullHeight/2}, item, 'imgContainer1' );
            TnAni($t.eq(2), j, {translateX:item.thumbFullWidth/2, translateY:item.thumbFullHeight/2}, item, 'imgContainer2' );
            TnAni($t.eq(3), j, {translateX:-item.thumbFullWidth/2, translateY:item.thumbFullHeight/2}, item, 'imgContainer3' );
            break;
            
          case 'imageSplitVert':
            var $t=$e.find('.imgContainer');
            TnAni($t.eq(0), j, {translateX:-item.thumbFullWidth/2}, item, 'imgContainer0' );
            TnAni($t.eq(1), j, {translateX:item.thumbFullWidth/2}, item, 'imgContainer1' );
            break;
            
          case 'labelSplit4':
            var $t=$e.find('.labelImage');
            TnAni($t.eq(0), j, {translateX:-item.thumbFullWidth/2, translateY:-item.thumbFullHeight/2}, item, 'labelImage0' );
            TnAni($t.eq(1), j, {translateX:item.thumbFullWidth/2, translateY:-item.thumbFullHeight/2}, item, 'labelImage1' );
            TnAni($t.eq(2), j, {translateX:item.thumbFullWidth/2, translateY:item.thumbFullHeight/2}, item, 'labelImage2' );
            TnAni($t.eq(3), j, {translateX:-item.thumbFullWidth/2, translateY:item.thumbFullHeight/2}, item, 'labelImage3' );
            break;
            
          case 'labelSplitVert':
            var $t=$e.find('.labelImage');
            TnAni($t.eq(0), j, {translateX:-item.thumbFullWidth/2}, item, 'labelImage0' );
            TnAni($t.eq(1), j, {translateX:item.thumbFullWidth/2}, item, 'labelImage1' );
            break;
            
          case 'labelAppearSplit4':
            var $t=$e.find('.labelImage');
            TnAni($t.eq(0), j, {translateX:0, translateY:0}, item, 'labelImage0' );
            TnAni($t.eq(1), j, {translateX:0, translateY:0}, item, 'labelImage1' );
            TnAni($t.eq(2), j, {translateX:0, translateY:0}, item, 'labelImage2' );
            TnAni($t.eq(3), j, {translateX:0, translateY:0}, item, 'labelImage3' );
            break;
            
          case 'labelAppearSplitVert':
            var $t=$e.find('.labelImage');
            TnAni($t.eq(0), j, {translateX:0}, item, 'labelImage0' );
            TnAni($t.eq(1), j, {translateX:0}, item, 'labelImage1' );
            break;
            
          case 'scaleLabelOverImage':
            TnAni($e.find('.labelImage'), j, { scale:100/dscale, opacity: 1}, item, 'labelImage0' );
            TnAni($e.find('.imgContainer'), j, { scale:50/dscale}, item, 'imgContainer0' );
            break;
            
          case 'overScale':
          case 'overScaleOutside':
            TnAni($e.find('.labelImage'), j, { opacity: 1, scale:100/dscale}, item, 'labelImage0' );
            TnAni($e.find('.imgContainer'), j, { opacity: 0, scale:50/dscale}, item, 'imgContainer0' );
            break;
            
          case 'imageInvisible':
            TnAni($e.find('.imgContainer'), j, { opacity: 0}, item );
            break;

          case 'rotateCornerBL':
            var r=(g_aengine=='transition'?{rotate:'0deg'}:{rotateZ:'0'});
            TnAni($e.find('.labelImage'), j, r, item, 'labelImage0' );
            r=(g_aengine=='transition'?{rotate:'90deg'}:{rotateZ:'90'});
            TnAni($e.find('.imgContainer'), j, r, item, 'imgContainer0' );
            break;
            
          case 'rotateCornerBR':
            var r=(g_aengine=='transition'?{rotate:'0deg'}:{rotateZ:'0'});
            TnAni($e.find('.labelImage'), j, r, item, 'labelImage0' );
            r=(g_aengine=='transition'?{rotate:'-90deg'}:{rotateZ:'-90'});
            TnAni($e.find('.imgContainer'), j, r, item, 'imgContainer0' );
            break;
            
          case 'imageRotateCornerBL':
            var r=(g_aengine=='transition'?{rotate:'90deg'}:{rotateZ:'90'});
            TnAni($e.find('.imgContainer'), j, r, item, 'imgContainer0' );
            break;
            
          case 'imageRotateCornerBR':
            var r=(g_aengine=='transition'?{rotate:'-90deg'}:{rotateZ:'-90'});
            TnAni($e.find('.imgContainer'), j, r, item, 'imgContainer0' );
            break;
            
          case 'slideUp':
            TnAni($e.find('.imgContainer'), j, { translateY: -item.thumbFullHeight}, item, 'imgContainer0' );
            TnAni($e.find('.labelImage'), j, { translateY: 0}, item, 'labelImage0' );
            break;
            
          case 'slideDown':
            TnAni($e.find('.imgContainer'), j, { translateY: item.thumbFullHeight}, item, 'imgContainer0' );
            TnAni($e.find('.labelImage'), j, { translateY: 0}, item, 'labelImage0' );
            break;
            
          case 'slideRight':
            TnAni($e.find('.imgContainer'), j, { translateX: item.thumbFullWidth}, item, 'imgContainer0' );
            TnAni($e.find('.labelImage'), j, { translateX: 0}, item, 'labelImage0' );
            break;
            
          case 'slideLeft':
            TnAni($e.find('.imgContainer'), j, { translateX: -item.thumbFullWidth}, item, 'imgContainer0' );
            TnAni($e.find('.labelImage'), j, { translateX: 0}, item, 'labelImage0' );
            break;
            
          case 'imageSlideUp':
            TnAni($e.find('.imgContainer'), j, { translateY: -item.thumbFullHeight }, item, 'imgContainer0' );
            break;
            
          case 'imageSlideDown':
            TnAni($e.find('.imgContainer'), j, { translateY: item.thumbFullHeight }, item, 'imgContainer0' );
            break;
            
          case 'imageSlideLeft':
            TnAni($e.find('.imgContainer'), j, { translateX: -item.thumbFullWidth }, item, 'imgContainer0' );
            break;
            
          case 'imageSlideRight':
            TnAni($e.find('.imgContainer'), j, { translateX: item.thumbFullWidth }, item, 'imgContainer0' );
            break;
            
          case 'labelAppear':
            if( g_aengine == 'velocity' ) {
              TnAni($e.find('.labelImage'), j, { backgroundColorRed:g_custGlobals.oldLabelRed, backgroundColorGreen:g_custGlobals.oldLabelGreen, backgroundColorBlue:g_custGlobals.oldLabelBlue, backgroundColorAlpha:1 }, item );
            }
            else {
              var c='rgba('+g_custGlobals.oldLabelRed+','+g_custGlobals.oldLabelGreen+','+g_custGlobals.oldLabelBlue+',1)';
              TnAni($e.find('.labelImage'), j, { backgroundColor: c}, item );
            }
            TnAni($e.find('.labelImageTitle'), j, { opacity: 1}, item );
            TnAni($e.find('.labelFolderTitle'), j, { opacity: 1}, item );
            TnAni($e.find('.labelDescription'), j, { opacity: 1}, item );
            break;
            
          case 'labelAppear75':
            if( g_aengine == 'velocity' ) {
              TnAni($e.find('.labelImage'), j, { backgroundColorRed:g_custGlobals.oldLabelRed, backgroundColorGreen:g_custGlobals.oldLabelGreen, backgroundColorBlue:g_custGlobals.oldLabelBlue, backgroundColorAlpha:0.75 }, item );
            }
            else {
              var c='rgba('+g_custGlobals.oldLabelRed+','+g_custGlobals.oldLabelGreen+','+g_custGlobals.oldLabelBlue+',0.75)';
              TnAni($e.find('.labelImage'), j, { backgroundColor: c}, item );
            }
            TnAni($e.find('.labelImageTitle'), j, { opacity: 1}, item );
            TnAni($e.find('.labelFolderTitle'), j, { opacity: 1}, item );
            TnAni($e.find('.labelDescription'), j, { opacity: 1}, item );
            break;
            
          case 'descriptionAppear':
            TnAni($e.find('.labelDescription'), j, { opacity: 1}, item );
            break;
            
          case 'labelSlideDown':
            TnAni($e.find('.labelImage'), j, { translateY: 0}, item, 'labelImage0' );
            // TnAni($e.find('.labelImage'), j, { top: 0}, item );
            break;
            
          case 'labelSlideUpTop':
          case 'labelSlideUp':
            TnAni($e.find('.labelImage'), j, { translateY: 0}, item, 'labelImage0' );
            break;
            
          case 'descriptionSlideUp':
            var lh=(item.kind == 'album' ? $e.find('.labelFolderTitle').outerHeight(true) : $e.find('.labelImageTitle').outerHeight(true));
            var lh2=$e.find('.labelDescription').outerHeight(true);
            var p=item.thumbFullHeight - lh -lh2;
            if( p<0 ) { p=0; }
            TnAni($e.find('.labelImage'), j, { translateY:0, height:lh+lh2 }, item, 'labelImage0' );
            TnAni($e.find('.labelDescription'), j, { opacity: 1}, item );
            break;
            
          case 'labelOpacity50':
            TnAni($e.find('.labelImage'), j, { opacity: 0.5 }, item );
            break;
            
          case 'imageOpacity50':
            TnAni($e.find('.imgContainer'), j, { opacity: 0.5 }, item );
            break;
            
          case 'borderLighter':
            if( g_aengine == 'velocity' ) {
              var colorString=lighterColor(g_custGlobals.oldBorderColor,0.5),
              co = colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')')).split(/,\s*/);
              TnAni($e, j, { borderColorRed:co[0], borderColorGreen:co[1], borderColorBlue:co[2], colorAlpha:co[3] }, item );
            }
            else {
              TnAni($e, j, { borderColor: lighterColor(g_custGlobals.oldBorderColor,0.5) }, item );
            }
            break;
            
          case 'borderDarker':
            if( g_aengine == 'velocity' ) {
              var colorString=darkerColor(g_custGlobals.oldBorderColor,0.5),
              co = colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')')).split(/,\s*/);
              TnAni($e, j, { borderColorRed:co[0], borderColorGreen:co[1], borderColorBlue:co[2], colorAlpha:co[3] }, item );
            }
            else {
              TnAni($e, j, { borderColor: darkerColor(g_custGlobals.oldBorderColor,0.5) }, item );
            }
            break;
            
          case 'imageScale150':
            TnAni($e.find('img'), j, { scale: 150/dscale }, item, 'img0' );
            break;

          case 'imageScaleIn80':
            TnAni($e.find('img'), j, { scale: 100/dscale }, item, 'img0' );
            break;
            
          case 'imageSlide2Up':
          case 'imageSlide2Down':
          case 'imageSlide2Left':
          case 'imageSlide2Right':
          case 'imageSlide2UpRight':
          case 'imageSlide2UpLeft':
          case 'imageSlide2DownRight':
          case 'imageSlide2DownLeft':
          case 'imageSlide2Random':
            switch(item.customData.hoverEffectRDir) {
              case 'imageSlide2Up':
                var tY=item.thumbFullHeight < (item.imgHeight*1.4) ? ((item.imgHeight*1.4)-item.thumbFullHeight)/2 : 0;
                TnAni($e.find('img'), j, { translateY: -tY }, item, 'img0' );
                break;
              case 'imageSlide2Down':
                var tY=item.thumbFullHeight < (item.imgHeight*1.4) ? ((item.imgHeight*1.4)-item.thumbFullHeight)/2 : 0;
                TnAni($e.find('img'), j, { translateY: tY }, item, 'img0' );
                break;
              case 'imageSlide2Left':
                TnAni($e.find('img'), j, { translateX: -item.thumbFullWidth*.1 }, item, 'img0' );
                break;
              case 'imageSlide2Right':
                TnAni($e.find('img'), j, { translateX: item.thumbFullWidth*.1 }, item, 'img0' );
                break;
                
              case 'imageSlide2UpRight':
                TnAni($e.find('img'), j, { translateY: -item.thumbFullHeight*.05, translateX: item.thumbFullWidth*.05 }, item, 'img0' );
                break;
              case 'imageSlide2UpLeft':
                TnAni($e.find('img'), j, { translateY: -item.thumbFullHeight*.05, translateX: -item.thumbFullWidth*.05 }, item, 'img0' );
                break;
              case 'imageSlide2DownRight':
                TnAni($e.find('img'), j, { translateY: item.thumbFullHeight*.05, translateX: item.thumbFullWidth*.05 }, item, 'img0' );
                break;
              case 'imageSlide2DownLeft':
                TnAni($e.find('img'), j, { translateY: item.thumbFullHeight*.05, translateX: -item.thumbFullWidth*.05 }, item, 'img0' );
                break;
            }
            break;
            
          case 'imageScale150Outside':
            setElementOnTop('', $e);
            TnAni($e.find('img'), j, { scale: 150/dscale }, item, 'img0');
            break;
            
          case 'scale120':
            setElementOnTop('', $e);
            TnAni($e, j, { scale: 120/dscale }, item, 'base' );
            break;

          case 'imageExplode':
            setElementOnTop('', $e);
            var $iC=$e.find('.imgContainer');
            n=Math.sqrt($iC.length);
            var l = [];
            for(var i=0; i<=Math.PI; i+=Math.PI/(n-1) ){
              l.push(Math.sin(i));
            }
            var w=$iC.outerWidth(true)/n,
            h=$iC.outerHeight(true)/n,
            i=0;
            for(var r=0; r<n; r++ ) {
             for(var c=0; c<n; c++ ) {
                TnAni($iC.eq(i++), j, { top:((-h*n/3)+h*r-h)*l[c], left:((-w*n/3)+w*c-w)*l[r], scale:1.5, opacity:0}, item );
              }
            }
            break;
            
          case 'imageFlipHorizontal':
            setElementOnTop('', $e);
            TnAni($e.find('.imgContainer'), j, { rotateX: 180}, item, 'imgContainer0' );
            TnAni($e.find('.labelImage'), j, { rotateX: 360}, item, 'labelImage0' );
            break;
            
          case 'imageFlipVertical':
            setElementOnTop('', $e);
            TnAni($e.find('.imgContainer'), j, { rotateY: 180}, item, 'imgContainer0' );
            TnAni($e.find('.labelImage'), j, { rotateY: 360}, item, 'labelImage0' );
            break;
            
          // case 'flipHorizontal':
            // setElementOnTop('', $e);
            // var n= Math.round(item.thumbFullHeight*1.2) + 'px';
            // TnAni($e, j, { perspective: n, rotateX: '180deg'}, item );
            // break;
            
          // case 'flipVertical':
            // setElementOnTop('', $e);
            // var n= Math.round(item.thumbFullWidth*1.2) + 'px';
            // TnAni($e, j, { perspective: n, rotateY: '180deg'}, item );
            // break;
            
          case 'TEST':
            //$e.find('img').stop(true, true);
            // TnAni($e.find('.subcontainer'), j, { scale: 80//dscale }, item );
            break;
        }
      }
    }
    catch (e) { 
      nanoAlert( 'error on hover ' +e.message );
    }
  };


  
  function TnAniO( $e, n, anime, item, eltClass) {
    
    var transform=['translateX', 'translateY', 'scale', 'rotateX', 'rotateY', 'rotateZ'];

    if( g_aengine == 'animate' ) {
      for( var i=0; i<transform.length; i++ ) {
        var tf=transform[i];
        if( anime[tf] !== undefined ) {
          var from = {v: parseInt(item.eltTransform[eltClass][tf]), item:item, tf:tf, eltClass:eltClass, to:parseInt(anime[tf]) };
          var to = {v: parseInt(anime[tf])};
          if( g_tnHE[n].delayBack > 0 ) {
            jQuery(from).delay(g_tnHE[n].delayBack).animate(to, { duration:g_tnHE[n].durationBack, easing:g_tnHE[n].easingBack, queue:false, step: function(currentValue) {
                item.eltTransform[this.eltClass][this.tf]=currentValue;
                SetCSSTransform(this.item, this.eltClass);
                // transformElt[this.tf]=currentValue;
                // SetCSSTransform(this.$e, this.transformElt);
              }, complete: function() {
                item.eltTransform[this.eltClass][this.tf]=this.to;
                SetCSSTransform(this.item, this.eltClass);
                // transformElt[this.tf]=this.to;
                // SetCSSTransform(this.$e, this.transformElt);
              }
            });
          }
          else {
            jQuery(from).animate(to, { duration:g_tnHE[n].durationBack, easing:g_tnHE[n].easingBack, queue:false, step: function(currentValue) {
              item.eltTransform[this.eltClass][this.tf]=currentValue;
              SetCSSTransform(this.item, this.eltClass);
              // var i = Math.round(this.v);
              // this.curr || (this.curr = i);
              // if (!this.curr || this.curr != i) { 
                // transformElt[this.tf]=currentValue;
                // transformElt[tf]=this.v;
                // SetCSSTransform(this.$e, this.transformElt);
              }, complete: function() {
                  item.eltTransform[this.eltClass][this.tf]=this.to;
                  SetCSSTransform(this.item, this.eltClass);
                // transformElt[this.tf]=this.to;
             // console.clear();
             // console.log(this.to);
                // SetCSSTransform(this.$e, this.transformElt);
              }
            });
          }
          delete anime[tf];
        }
      }
    }
    

    if( anime.length == 0 ) { return; }
  
    //$e.find('.imgContainer').eq(0).delay(g_tnHE[j].delay)[g_aengine]({'right':'50%', 'top':'-50%'},g_tnHE[j].duration, g_tnHE[j].easing);
    if( g_tnHE[n].delay > 0 ) {
      if( g_aengine == 'transition' ) {
        // transit has a bug on queue --> we do not use it
        $e.delay(g_tnHE[n].delayBack)[g_aengine](anime, g_tnHE[n].durationBack, g_tnHE[n].easingBack);
      }
      else {
        $e.delay(g_tnHE[n].delayBack)[g_aengine](anime, {duration:g_tnHE[n].durationBack , easing:g_tnHE[n].easingBack, queue:false });
      }
    }
    else {
      if( g_aengine == 'transition' ) {
        // transit has a bug on queue --> we do not use it
        $e[g_aengine](anime, g_tnHE[n].durationBack, g_tnHE[n].easingBack);
      }
      else {
        $e[g_aengine](anime, {duration:g_tnHE[n].durationBack , easing:g_tnHE[n].easingBack, queue:false});
      }
    }
  }
  

  function ThumbnailHoverOut( $e ) {
    if( g_containerViewerDisplayed ) { return; }

    var n=$e.data("index");
    if( n == undefined ) { return; }    // required because can be fired on ghost elements

    if( g_aengine == 'velocity' ) {
      $e.find('*').velocity('stop', true);
    }
    else {
      $e.find('*').filter(":animated").stop(true,false);
    }
    var item=gI[n];
    
    item.hovered=false;
    var dscale=(g_aengine == 'animate' ? 1 : 100);

    if( typeof gO.fnThumbnailHoverOut == 'function' ) { 
      gO.fnThumbnailHoverOut($e, item, ExposedObjects());
    }    

    try {
      for( j=0; j<g_tnHE.length; j++) {
        switch(g_tnHE[j].name ) {
          case 'imageSplit4':
            var $t=$e.find('.imgContainer');
            TnAniO($t.eq(0), j, {translateX:0, translateY:0}, item, 'imgContainer0' );
            TnAniO($t.eq(1), j, {translateX:0, translateY:0}, item, 'imgContainer1' );
            TnAniO($t.eq(2), j, {translateX:0, translateY:0}, item, 'imgContainer2' );
            TnAniO($t.eq(3), j, {translateX:0, translateY:0}, item, 'imgContainer3' );
            break;
            TnAniO($t.eq(0), j, {right:'0%', top:'0%'} );
            TnAniO($t.eq(1), j, {left:'0%', top:'0%'} );
            TnAniO($t.eq(2), j, {left:'0%', bottom:'0%'} );
            TnAniO($t.eq(3), j, {right:'0%', bottom:'0%'} );
            break;
            
          case 'imageSplitVert':
            var $t=$e.find('.imgContainer');
            TnAniO($t.eq(0), j, {translateX:0}, item, 'imgContainer0' );
            TnAniO($t.eq(1), j, {translateX:0}, item, 'imgContainer1' );
            break;
            
          case 'labelSplit4':
            var $t=$e.find('.labelImage');
            TnAniO($t.eq(0), j, {translateX:0, translateY:0}, item, 'labelImage0' );
            TnAniO($t.eq(1), j, {translateX:0, translateY:0}, item, 'labelImage1' );
            TnAniO($t.eq(2), j, {translateX:0, translateY:0}, item, 'labelImage2' );
            TnAniO($t.eq(3), j, {translateX:0, translateY:0}, item, 'labelImage3' );
            break;
            
          case 'labelSplitVert':
            var $t=$e.find('.labelImage');
            TnAniO($t.eq(0), j, {translateX:0}, item, 'labelImage0' );
            TnAniO($t.eq(1), j, {translateX:0}, item, 'labelImage1' );
            break;
            
          case 'labelAppearSplit4':
            var $t=$e.find('.labelImage');
            TnAniO($t.eq(0), j, {translateX:-item.thumbFullWidth/2, translateY:-item.thumbFullHeight/2}, item, 'labelImage0' );
            TnAniO($t.eq(1), j, {translateX:item.thumbFullWidth/2, translateY:-item.thumbFullHeight/2}, item, 'labelImage1' );
            TnAniO($t.eq(2), j, {translateX:item.thumbFullWidth/2, translateY:item.thumbFullHeight/2}, item, 'labelImage2' );
            TnAniO($t.eq(3), j, {translateX:-item.thumbFullWidth/2, translateY:item.thumbFullHeight/2}, item, 'labelImage3' );
            break;
            
          case 'labelAppearSplitVert':
            var $t=$e.find('.labelImage');
            TnAniO($t.eq(0), j, {translateX:-item.thumbFullWidth/2}, item, 'labelImage0' );
            TnAniO($t.eq(1), j, {translateX:item.thumbFullWidth/2}, item, 'labelImage1' );
            break;

          case 'scaleLabelOverImage':
            TnAniO($e.find('.labelImage'), j, { opacity: 0, scale: 50/dscale}, item, 'labelImage0' );
            TnAniO($e.find('.imgContainer'), j, { scale: 100/dscale }, item, 'imgContainer0' );
            break;
            
          case 'overScale':
          case 'overScaleOutside':
            TnAniO($e.find('.labelImage'), j, { opacity: 0, scale:150/dscale}, item, 'labelImage0' );
            TnAniO($e.find('.imgContainer'), j, { opacity: 1, scale:100/dscale}, item, 'imgContainer0' );
            break;
            
          case 'imageInvisible':
            TnAniO($e.find('.imgContainer'), j, { opacity: 1} );
            break;
            
          case 'rotateCornerBL':
            var r=(g_aengine=='transition'?{rotate:'-90deg'}:{rotateZ:'-90'});
            TnAniO($e.find('.labelImage'), j, r, item, 'labelImage0' );
            r=(g_aengine=='transition'?{rotate:'0deg'}:{rotateZ:'0'});
            TnAniO($e.find('.imgContainer'), j, r, item, 'imgContainer0' );
            break;
            
          case 'rotateCornerBR':
            var r=(g_aengine=='transition'?{rotate:'90deg'}:{rotateZ:'90'});
            TnAniO($e.find('.labelImage'), j, r, item, 'labelImage0' );
            r=(g_aengine=='transition'?{rotate:'0deg'}:{rotateZ:'0'});
            TnAniO($e.find('.imgContainer'), j, r, item, 'imgContainer0' );
            break;
            
          case 'imageRotateCornerBL':
          case 'imageRotateCornerBR':
            var r=(g_aengine=='transition'?{rotate:'0deg'}:{rotateZ:'0'});
            TnAniO($e.find('.imgContainer'), j, r, item, 'imgContainer0' );
            break;
            
          case 'slideUp':
            TnAniO($e.find('.imgContainer'), j, { translateY: 0}, item, 'imgContainer0' );
            TnAniO($e.find('.labelImage'), j, { translateY: item.thumbFullHeight}, item, 'labelImage0' );
            break;
            
          case 'slideDown':
            TnAniO($e.find('.imgContainer'), j, { translateY: 0}, item, 'imgContainer0' );
            TnAniO($e.find('.labelImage'), j, { translateY: -item.thumbFullHeight}, item, 'labelImage0' );
            break;
            
          case 'slideRight':
            TnAniO($e.find('.imgContainer'), j, { translateX: 0}, item, 'imgContainer0' );
            TnAniO($e.find('.labelImage'), j, { translateX: -item.thumbFullWidth}, item, 'labelImage0' );
            break;
            
          case 'slideLeft':
            TnAniO($e.find('.imgContainer'), j, { translateX: 0}, item, 'imgContainer0' );
            TnAniO($e.find('.labelImage'), j, { translateX: item.thumbFullWidth}, item, 'labelImage0' );
            break;
            
          case 'imageSlideUp':
          case 'imageSlideDown':
            TnAniO($e.find('.imgContainer'), j, { translateY: 0 }, item, 'imgContainer0' );
            break;
            
          case 'imageSlideLeft':
          case 'imageSlideRight':
            TnAniO($e.find('.imgContainer'), j, { translateX: 0 }, item, 'imgContainer0' );
            break;
            
          case 'labelAppear':
          case 'labelAppear75':
            if( g_aengine == 'velocity' ) {
              TnAniO($e.find('.labelImage'), j, { backgroundColorRed:g_custGlobals.oldLabelRed, backgroundColorGreen:g_custGlobals.oldLabelGreen, backgroundColorBlue:g_custGlobals.oldLabelBlue, backgroundColorAlpha:0 } );
            }
            else {
              var c='rgb('+g_custGlobals.oldLabelRed+','+g_custGlobals.oldLabelGreen+','+g_custGlobals.oldLabelBlue+',0)';
              TnAniO($e.find('.labelImage'), j, { backgroundColor: c} );
            }
            TnAniO($e.find('.labelImageTitle'), j, { opacity: 0 } );
            TnAniO($e.find('.labelFolderTitle'), j, { opacity: 0 } );
            TnAniO($e.find('.labelDescription'), j, { opacity: 0 } );
            break;

          case 'descriptionAppear':
            TnAniO($e.find('.labelDescription'), j, { opacity: 0 } );
            break;
            
          case 'labelSlideDown':
            TnAniO($e.find('.labelImage'), j, { translateY:-item.thumbFullHeight}, item, 'labelImage0' );
            break;
            
          case 'labelSlideUpTop':
          case 'labelSlideUp':
            TnAniO($e.find('.labelImage'), j, { translateY: item.thumbFullHeight}, item, 'labelImage0' );
            break;

          case 'descriptionSlideUp':
            var lh=(item.kind == 'album' ? $e.find('.labelFolderTitle').outerHeight(true) : $e.find('.labelImageTitle').outerHeight(true));
            var p=item.thumbFullHeight - lh -g_tn.borderHeight-g_tn.imgcBorderHeight;
            TnAniO($e.find('.labelImage'), j, {translateY:0, height:lh}, item, 'labelImage0' );
            break;
            
            
          case 'labelOpacity50':
            TnAniO($e.find('.labelImage'), j, { opacity: g_custGlobals.oldLabelOpacity } );
            break;
            
          case 'imageOpacity50':
            TnAniO($e.find('.imgContainer'), j, { opacity: 1 } );
            break;
            
          case 'borderLighter':
          case 'borderDarker':
            if( g_aengine == 'velocity' ) {
              var colorString=g_custGlobals.oldBorderColor;
              var co = colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')')).split(/,\s*/);
              TnAniO($e, j, { borderColorRed:co[0], borderColorGreen:co[1], borderColorBlue:co[2], colorAlpha:co[3] } );
            }
            else {
              TnAniO($e, j, { borderColor: g_custGlobals.oldBorderColor } );
            }
            break;
            
          case 'imageScale150':
          case 'imageScale150Outside':
            TnAniO($e.find('img'), j, { scale: 100/dscale }, item, 'img0');
            break;

          case 'imageScaleIn80':
            TnAniO($e.find('img'), j, { scale: 120/dscale }, item, 'img0');
            break;

          case 'imageSlide2Up':
          case 'imageSlide2Down':
          case 'imageSlide2Left':
          case 'imageSlide2Right':
          case 'imageSlide2UpRight':
          case 'imageSlide2UpLeft':
          case 'imageSlide2DownRight':
          case 'imageSlide2DownLeft':
          case 'imageSlide2Random':
            switch(item.customData.hoverEffectRDir) {
              case 'imageSlide2Up':
                var tY=item.thumbFullHeight < (item.imgHeight*1.4) ? ((item.imgHeight*1.4)-item.thumbFullHeight)/2 : 0;
                TnAniO($e.find('img'), j, { translateY: tY }, item, 'img0' );
                break;
              case 'imageSlide2Down':
                var tY=item.thumbFullHeight < (item.imgHeight*1.4) ? ((item.imgHeight*1.4)-item.thumbFullHeight)/2 : 0;
                TnAniO($e.find('img'), j, { translateY: -tY }, item, 'img0' );
                break;
              case 'imageSlide2Left':
                TnAniO($e.find('img'), j, { translateX: item.thumbFullWidth*.1 }, item, 'img0' );
                break;
              case 'imageSlide2Right':
                TnAniO($e.find('img'), j, { translateX: -item.thumbFullWidth*.1 }, item, 'img0' );
                break;
                
              case 'imageSlide2UpRight':
                TnAniO($e.find('img'), j, { translateY: item.thumbFullHeight*.05, translateX: -item.thumbFullWidth*.05 }, item, 'img0' );
                break;
              case 'imageSlide2UpLeft':
                TnAniO($e.find('img'), j, { translateY: item.thumbFullHeight*.05, translateX: item.thumbFullWidth*.05 }, item, 'img0' );
                break;
              case 'imageSlide2DownRight':
                TnAniO($e.find('img'), j, { translateY: -item.thumbFullHeight*.05, translateX: -item.thumbFullWidth*.05 }, item, 'img0' );
                break;
              case 'imageSlide2DownLeft':
                TnAniO($e.find('img'), j, { translateY: -item.thumbFullHeight*.05, translateX: item.thumbFullWidth*.05 }, item, 'img0' );
                break;
            }
            break;


            
          case 'scale120':
            TnAniO($e, j, { scale: 100/dscale }, item, 'base' );
            break;

          case 'imageExplode':
            var $iC=$e.find('.imgContainer');
            n=Math.sqrt($iC.length);
            var i=0;
            for(var r=0; r<n; r++ ) {
              for(var c=0; c<n; c++ ) {
                TnAniO($iC.eq(i++), j, { top:0, left:0, scale:1, opacity:1} );
              }
            }
            break;

            
          case 'imageFlipHorizontal':
            // var n= Math.round(item.thumbFullHeight*1.2) + 'px';
            TnAniO($e.find('.imgContainer'), j, { rotateX: 0}, item, 'imgContainer0' );
            TnAniO($e.find('.labelImage'), j, { rotateX: 180}, item, 'labelImage0' );
            break;
            
          case 'imageFlipVertical':
            // var n= Math.round(item.thumbFullWidth*1.2) + 'px';
            TnAniO($e.find('.imgContainer'), j, { rotateY: 0}, item, 'imgContainer0' );
            TnAniO($e.find('.labelImage'), j, { rotateY: 180}, item, 'labelImage0' );
            break;
            
          // case 'flipHorizontal':
            // var n= Math.round(item.thumbFullHeigh*1.2) + 'px';
            // TnAniO($e, j, { rotateX: '0deg'} );
            // break;
            
          // case 'flipVertical':
            // var n= Math.round(item.thumbFullWidth*1.2) + 'px';
            // TnAniO($e, j, { rotateY: '0deg'} );
            // break;
            
          case 'TEST':
            // TnAniO($e.find('.subcontainer'), j, { scale: 0.85 } );
            break;
        }
      }
    }
    catch (e) { 
      nanoAlert( 'error on hoverOut ' +e.message );
    }
  };

    

  // #########################
  // ##### IMAGE DISPLAY #####
  // #########################

  function DisplayImage( imageIdx ) {

    if( gO.viewer == 'fancybox' ) {
      OpenFancyBox(imageIdx);
    }
    else {
      if( !g_containerViewerDisplayed ) {
        OpenInternalViewer(imageIdx);
      }
      else {
        DisplayInternalViewer(imageIdx, '');
      }
    }
  };
  
  function OpenInternalViewer( imageIdx ) {

    //if( !gO.locationHash ) {
    //  top.location.hash='myGallery/'+g_baseEltID+'/v';
    //}
    // if( gO.viewerScrollBarHidden ) {
      jQuery('body').css({overflow:'hidden'});  //avoid scrollbars
    // }
    
    $gE.conVwCon=jQuery('<div  class="myGalleryViewerContainer" style="visibility:visible"></div>').appendTo('body');
    $gE.conVwCon.addClass('myGallery_theme_'+gO.theme);
    SetColorSchemeViewer($gE.conVwCon);

    $gE.conVw=jQuery('<div  id="myGalleryViewer" class="myGalleryViewer" style="visibility:visible" itemscope itemtype="http://schema.org/ImageObject"></div>').appendTo($gE.conVwCon);
    
    var sImg='',
    l=gI.length;

    sImg+='<img class="image" src="'+gI[imageIdx].responsiveURL()+'" alt=" " style="visibility:visible;opacity:0;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;zoom:1;" itemprop="contentURL">';
    sImg+='<img class="image" src="'+gI[imageIdx].responsiveURL()+'" alt=" " style="visibility:visible;opacity:0;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;zoom:1;" itemprop="contentURL">';
    sImg+='<img class="image" src="'+gI[imageIdx].responsiveURL()+'" alt=" " style="visibility:visible;opacity:0;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;zoom:1;" itemprop="contentURL">';

    $gE.vwContent=jQuery('<div class="content">'+sImg+'<div class="contentAreaPrevious"></div><div class="contentAreaNext"></div></div>').appendTo($gE.conVw);
    $gE.vwImgP=$gE.conVw.find('.image').eq(0);
    $gE.vwImgC=$gE.conVw.find('.image').eq(1);
    $gE.vwImgN=$gE.conVw.find('.image').eq(2);

    if( gO.enableElevatezoom && toType(jQuery().elevateZoom) == 'function' ) {
      $gE.vwImgP.elevateZoom({ zoomType : "lens", lensShape : "round", lensSize : 200, onZoomedImageLoaded: function(){
        setElementOnTop('','.zoomContainer');
      } });
      $gE.vwImgN.elevateZoom({ zoomType : "lens", lensShape : "round", lensSize : 200, onZoomedImageLoaded: function(){
        setElementOnTop('','.zoomContainer');} 
      });
      $gE.vwImgC.elevateZoom({ zoomType : "lens", lensShape : "round", lensSize : 200, onZoomedImageLoaded: function(){
        setElementOnTop('','.zoomContainer');
      } });
    }
    
    // makes content unselectable --> avoid image drag effect during 'mouse swipe'
    $gE.conVwCon.find('*').attr('draggable', 'false').attr('unselectable', 'on');

    
    var $closeB=jQuery('<div class="closeButtonFloating"></div>').appendTo($gE.conVw);
    // $closeB.on("click",function(e){
    $closeB.on("touchstart click",function(e){
      e.stopPropagation();
      if( (new Date().getTime()) - g_timeImgChanged < 400 ) { return; }
      CloseInternalViewer(true);
    });

    var fs='';
    if( g_supportFullscreenAPI ) {
      fs='<div class="ngbt setFullscreenButton fullscreenButton"></div>';
    }

    var sInfo='';
    if( typeof gO.fnViewerInfo == 'function' ) {
      sInfo='<div class="ngbt infoButton"></div>';
    }

    $gE.conVwTb=jQuery('<div class="toolbarContainer" style="visibility:hidden;"><div class="toolbar"><div class="visibilityButton hideToolbarButton ngbt"></div><div class="previousButton ngbt"></div><div class="pageCounter"></div><div class="nextButton ngbt"></div><div class="playButton playPauseButton ngbt"></div>'+fs+sInfo+'<div class="closeButton ngbt"></div><div class="label"><div class="title" itemprop="name"></div><div class="description" itemprop="description"></div></div></div>').appendTo($gE.conVw);
    if( gO.viewerDisplayLogo ) {
      $gE.vwLogo=jQuery('<div class="nanoLogo"></div>').appendTo($gE.conVw);
    }

    if( !g_toolbarVisible || (gO.viewerToolbar.autoMinimize > 0 && gO.viewerToolbar.autoMinimize >= getViewport().w) ) {
      ToolbarVisibilityOff();
    }

    
    setElementOnTop('',$gE.conVw);
    ResizeInternalViewer($gE.vwImgC);

    g_timeImgChanged=new Date().getTime();
    
    $gE.conVwTb.find('.closeButton').on("touchstart click",function(e){
      e.stopPropagation();
      if( (new Date().getTime()) - g_timeImgChanged < 400 ) { return; }
      CloseInternalViewer(true);
    });


    $gE.conVwTb.find('.playPauseButton').on("touchstart click",function(e){ 
      e.stopPropagation();
      SlideshowToggle();
    });
    
    $gE.conVwTb.find('.visibilityButton').on("touchstart click",function(e){ 
      e.stopPropagation();
      ToolbarVisibilityToggle();
    });
    
    $gE.conVwTb.find('.fullscreenButton').on("touchstart click",function(e){ 
      e.stopPropagation();
      ViewerFullscreenToggle();
    });
    
    $gE.conVwTb.find('.infoButton').on("touchstart click",function(e){ 
      e.stopPropagation();
      if( typeof gO.fnViewerInfo == 'function' ) {
        gO.fnViewerInfo(gI[g_viewerCurrentItemIdx], ExposedObjects());
      }
    });

    $gE.conVwTb.find('.nextButton').on("touchstart click",function(e){ e.stopPropagation(); DisplayNextImagePart1(); });
    $gE.conVwTb.find('.previousButton').on("touchstart click",function(e){ e.stopPropagation(); DisplayPreviousImage(); });
    $gE.vwContent.find('.contentAreaNext').on("touchstart click",function(e){ e.stopPropagation(); DisplayNextImagePart1(); });
    $gE.vwContent.find('.contentAreaPrevious').on("touchstart click",function(e){ e.stopPropagation(); DisplayPreviousImage(); });

    $gE.vwContent.on("click",function(e){ 
      if( (new Date().getTime()) - g_timeImgChanged < 400 ) { return; }
      e.stopPropagation();
      CloseInternalViewer(true);
    });
    
    // makes images unselectable (avoid blue overlay)
    $gE.conVw.find('.image').attr('draggable', 'false').attr('unselectable', 'on').css({ '-moz-user-select':'none', '-khtml-user-select': 'none', '-webkit-user-select': 'none', '-o-user-select': 'none', 'user-select': 'none'});

    DisplayInternalViewer(imageIdx, '');

    if( gO.slideshowAutoStart ) {
      g_playSlideshow=true;
      $gE.conVwTb.find('.playPauseButton').removeClass('playButton').addClass('pauseButton');
      DisplayNextImage();
      g_playSlideshowTimerID=window.setInterval(function(){DisplayNextImage();},g_slideshowDelay);
    }

  };

  // based on "Implement Custom Gestures" from Google
  // https://developers.google.com/web/fundamentals/input/touch-input/touchevents/
  function ViewerSwipeSupport(element) {

  var elementToSwipe=element,
    isAnimating=false,
    initialTouchPos=null,
    lastTouchPos=null,
    currentXPosition=0;
    
    // Handle the start of gestures
    this.handleGestureStart = function(e) {

      if( !g_containerViewerDisplayed ) { return; }
      
      e.preventDefault();

      if(e.touches && e.touches.length > 1) { return; }

      initialTouchPos = getGesturePointFromEvent(e);

      // Add the move and end listeners
      if (window.navigator.msPointerEnabled) {
        // Pointer events are supported.
        document.addEventListener('MSPointerMove', this.handleGestureMove, true);
        document.addEventListener('MSPointerUp', this.handleGestureEnd, true);
      } else {
        // Add Touch Listeners
        document.addEventListener('touchmove', this.handleGestureMove, true);
        document.addEventListener('touchend', this.handleGestureEnd, true);
        document.addEventListener('touchcancel', this.handleGestureEnd, true);
      
        // Add Mouse Listeners
        document.addEventListener('mousemove', this.handleGestureMove, true);
        document.addEventListener('mouseup', this.handleGestureEnd, true);
      }
      
    }.bind(this);
    
    // Handle move gestures
    this.handleGestureMove = function (e) {
      e.preventDefault();

      lastTouchPos = getGesturePointFromEvent(e);
      
      if(isAnimating) { return; }
      
      isAnimating = true;
      
      window.requestAnimFrame(onAnimFrame);
    }.bind(this);

    
    // Handle end gestures
    this.handleGestureEnd = function(e) {
      e.preventDefault();

      if(e.touches && e.touches.length > 0) {
        return;
      }

      isAnimating = false;
      
      // Remove Event Listeners
      if (window.navigator.msPointerEnabled) {
        // Remove Pointer Event Listeners
        document.removeEventListener('MSPointerMove', this.handleGestureMove, true);
        document.removeEventListener('MSPointerUp', this.handleGestureEnd, true);
      } else {
        // Remove Touch Listeners
        document.removeEventListener('touchmove', this.handleGestureMove, true);
        document.removeEventListener('touchend', this.handleGestureEnd, true);
        document.removeEventListener('touchcancel', this.handleGestureEnd, true);
      
        // Remove Mouse Listeners
        document.removeEventListener('mousemove', this.handleGestureMove, true);
        document.removeEventListener('mouseup', this.handleGestureEnd, true);
      }
      
      updateSwipeRestPosition(this);
    }.bind(this);
    
    function updateSwipeRestPosition(me) {
      if( lastTouchPos == null ) {      // touchend without touchmove
        currentXPosition=0;
        initialTouchPos=null;
        return; 
      }

      var differenceInX = initialTouchPos.x - lastTouchPos.x;
      currentXPosition = currentXPosition - differenceInX;
    
      if( differenceInX < -50 ) {
        //removeEventListener(me);
        DisplayPreviousImage();
      }
      if( differenceInX > 50 ) {
        //removeEventListener(me);
        DisplayNextImagePart1();
      }
      currentXPosition=0;
      initialTouchPos=null;
      lastTouchPos=null;
        
      if(Math.abs(differenceInX) < 50) {
        ImageSwipeTranslateX(currentXPosition);
      }
      return;
    }
    

    function getGesturePointFromEvent(e) {
      var point = {};

      if(e.targetTouches) {
        point.x = e.targetTouches[0].clientX;
        point.y = e.targetTouches[0].clientY;
      } else {
        // Either Mouse event or Pointer Event
        point.x = e.clientX;
        point.y = e.clientY;
      }

      return point;
    }
    
    function onAnimFrame() {
      if(!isAnimating) { return; }
      
      var differenceInX = initialTouchPos.x - lastTouchPos.x;
      
      ImageSwipeTranslateX(currentXPosition - differenceInX);
      
      isAnimating = false;
    }

    function removeEventListener(me) {
      if (window.navigator.msPointerEnabled) {
        elementToSwipe.removeEventListener('MSPointerDown', me.handleGestureStart, true);
      }
      else {
        elementToSwipe.removeEventListener('touchstart', me.handleGestureStart, true);
        elementToSwipe.removeEventListener('mousedown', me.handleGestureStart, true);
      }
    }
    
    // Check if pointer events are supported.
    if (window.navigator.msPointerEnabled) {
      // Add Pointer Event Listener
      elementToSwipe.addEventListener('MSPointerDown', this.handleGestureStart, true);
    }
    else {
      // Add Touch Listener
      elementToSwipe.addEventListener('touchstart', this.handleGestureStart, true);
      
      // Add Mouse Listener
      //elementToSwipe.addEventListener('mousedown', this.handleGestureStart, true);
    }
    
  }

  function ImageSwipeTranslateX( posX ) {
    g_imageSwipePosX=posX;
    if( g_CSStransformName == null ) {
      $gE.vwImgC.css({ left: posX }); 
    }
    else {
      $gE.vwImgC[0].style[g_CSStransformName]= 'translateX('+posX+'px)';
      if(  gO.imageTransition == 'slide' ) {
        if( posX > 0 ) {
          var $new=$gE.vwImgP;
          var dir=getViewport().w;
          $gE.vwImgP.css({visibility:'visible', left:0, opacity:1});
          $gE.vwImgP[0].style[g_CSStransformName]= 'translateX('+(-dir+posX)+'px) '
          $gE.vwImgN[0].style[g_CSStransformName]= 'translateX('+(-dir)+'px) '
        }
        else {
          var $new=$gE.vwImgN;
          var dir=-getViewport().w;
          $gE.vwImgN.css({visibility:'visible', left:0, opacity:1});
          $gE.vwImgN[0].style[g_CSStransformName]= 'translateX('+(-dir+posX)+'px) '
          $gE.vwImgP[0].style[g_CSStransformName]= 'translateX('+(-dir)+'px) '
        }
      }
    }
  }
  
  // Toggle fullscreen mode on/off
  function ViewerFullscreenToggle(){
    if( g_viewerIsFullscreen ) {
      if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            }

      g_viewerIsFullscreen=false;
      $gE.conVwTb.find('.fullscreenButton').removeClass('removeFullscreenButton').addClass('setFullscreenButton');
    }
    else {
      if ($gE.conVwCon[0].requestFullscreen) {
                  $gE.conVwCon[0].requestFullscreen();
              } else if ($gE.conVwCon[0].webkitRequestFullscreen) {
                $gE.conVwCon[0].webkitRequestFullscreen();
              } else if ($gE.conVwCon[0].msRequestFullscreen) {
                $gE.conVwCon[0].msRequestFullscreen();
              } else if ($gE.conVwCon[0].mozRequestFullScreen) {
                $gE.conVwCon[0].mozRequestFullScreen();
              }
      g_viewerIsFullscreen=true;
      $gE.conVwTb.find('.fullscreenButton').removeClass('setFullscreenButton').addClass('removeFullscreenButton');
    }
  }

  // toggle slideshow mode on/off
  function SlideshowToggle(){
    if( g_playSlideshow ) {
      window.clearInterval(g_playSlideshowTimerID);
      g_playSlideshow=false;
      $gE.conVwTb.find('.playPauseButton').removeClass('pauseButton').addClass('playButton');
    }
    else {
      g_playSlideshow=true;
      $gE.conVwTb.find('.playPauseButton').removeClass('playButton').addClass('pauseButton');
      DisplayNextImage();
      g_playSlideshowTimerID=window.setInterval(function(){DisplayNextImage();},g_slideshowDelay);
    }
  }
  
  // toggle toolbar visibility
  function ToolbarVisibilityToggle(){
    if( g_toolbarVisible) {
      ToolbarVisibilityOff();
    }
    else {
      ToolbarVisibilityOn();
    }
  }
  
  function ToolbarVisibilityOn() {
    g_toolbarVisible=true;
    $gE.conVwTb.find('.visibilityButton').removeClass('viewToolbarButton').addClass('hideToolbarButton');
    $gE.conVwTb.find('.ngbt').not(':first').show();
    $gE.conVwTb.find('.description').show();
    $gE.conVwTb.find('.pageCounter').show();
    ResizeInternalViewer($gE.vwImgC);
  }
  function ToolbarVisibilityOff() {
    g_toolbarVisible=false;
    $gE.conVwTb.find('.visibilityButton').removeClass('hideToolbarButton').addClass('viewToolbarButton');
    $gE.conVwTb.find('.ngbt').not(':first').hide();
    $gE.conVwTb.find('.description').hide();
    $gE.conVwTb.find('.pageCounter').hide();
    ResizeInternalViewer($gE.vwImgC);
  }
  
  
  
  
  // Display next image
  function DisplayNextImagePart1() {
    if( g_playSlideshow ) {
      window.clearInterval(g_playSlideshowTimerID);
      g_playSlideshowTimerID=window.setInterval(function(){DisplayNextImage();},g_slideshowDelay);
    }
    DisplayNextImage();
  }
  function DisplayNextImage() {
    if( g_viewerImageIsChanged ) { return; }
    if( (new Date().getTime()) - g_timeImgChanged < 300 ) { return; }
    var l=gI.length;

    var newImageIdx=GetNextImageIdx(g_viewerCurrentItemIdx);
    DisplayInternalViewer(newImageIdx, 'nextImage');
  };
  
  // Display previous image
  function DisplayPreviousImage() {
    if( g_viewerImageIsChanged ) { return; }
    if( (new Date().getTime()) - g_timeImgChanged < 300 ) { return; }
    if( g_playSlideshow ) {
      SlideshowToggle();
    }
    
    var newImageIdx=GetPreviousImageIdx(g_viewerCurrentItemIdx);
    DisplayInternalViewer(newImageIdx, 'previousImage');
  };

  // Display image (and run animation)
  function DisplayInternalViewer( imageIdx, displayType ) {
    g_timeImgChanged=new Date().getTime();
    g_viewerImageIsChanged=true;
    var displayNext=true;
    
    if( gO.locationHash ) {
      var s ='myGallery/'+g_baseEltID+'/'+gI[imageIdx].albumID+"/"+gI[imageIdx].GetID();
      if( ('#'+s) != location.hash ) {
        g_lastLocationHash='#'+s;
        top.location.hash = s;
      }
      else {
        g_lastLocationHash=top.location.hash;
      }
    }
    
    DisplayInternalViewerToolbar(imageIdx);
    ResizeInternalViewer($gE.vwImgC);
    
    g_viewerCurrentItemIdx=imageIdx;
    
    if( displayType == '' ) {
      // first image --> just appear / no animation
      $gE.vwImgC.css({ opacity:0, left:0, visibility: 'visible'}).attr('src',g_emptyGif).attr('src',gI[imageIdx].responsiveURL());

      if( gO.enableElevatezoom && toType(jQuery().elevateZoom) == 'function' ) {
        $gE.vwImgC.attr('data-zoom-image',gI[imageIdx].responsiveURL());
      }

      jQuery.when(
        $gE.vwImgC.animate({ opacity: 1 }, 300)
      ).done(function () {
        DisplayInternalViewerComplete(imageIdx, displayType);
      });
    }
    else {
      // animate image change
      switch( gO.imageTransition ) {
        case 'fade':
          $gE.vwImgN.css({ opacity:0, left:0, visibility:'visible'});
          jQuery.when(
            $gE.vwImgC.animate({ opacity: 0 }, 5000), 
            $gE.vwImgN.animate({ opacity: 1 }, 300)
          ).done(function () {
            DisplayInternalViewerComplete(imageIdx, displayType);
          });
          break;
          
        case 'slideBETA':
          var $new=(displayType == 'nextImage' ? $gE.vwImgN : $gE.vwImgP);
          $new.css({ opacity:1, left:0, visibility:'visible'});
          if( g_CSStransformName == null ) {
            // animate LEFT
            jQuery.when(
              $gE.vwImgC.animate({ left: (displayType == 'nextImage' ? -getViewport().w : getViewport().w)+'px', opacity: 0 }, 500), 
              $new.animate({ opacity: 1 }, 300)
            ).done(function () {
              DisplayInternalViewerComplete(imageIdx, displayType);
            });
          }
          else {
            // animate TRANSLATEX
            var dir=(displayType == 'nextImage' ? - getViewport().w : getViewport().w);
            $new[0].style[g_CSStransformName]= 'translateX('+(-dir)+'px) '
            var from = {v: g_imageSwipePosX };
            var to = {v: (displayType == 'nextImage' ? - getViewport().w : getViewport().w)};
            jQuery(from).animate(to, { duration:500, step: function(currentValue) {
                $gE.vwImgC[0].style[g_CSStransformName]= 'translateX('+currentValue+'px)';
                $gE.vwImgC.css({ opacity: (1-Math.abs(currentValue/dir)) });
                $new[0].style[g_CSStransformName]= 'translateX('+(-dir+currentValue)+'px) '
              }, complete: function() {
                $gE.vwImgC[0].style[g_CSStransformName]= '';
                $gE.vwImgC.css({ opacity:0 });
                DisplayInternalViewerComplete(imageIdx, displayType);
              }
            });
          }
          break;

        case 'slide':
          var $new=(displayType == 'nextImage' ? $gE.vwImgN : $gE.vwImgP);
          if( g_CSStransformName == null ) {
            // animate LEFT
            $new.css({ opacity:0, left:0, visibility:'visible'});
            jQuery.when(
              $gE.vwImgC.animate({ left: (displayType == 'nextImage' ? -getViewport().w : getViewport().w)+'px' }, 500), 
              $new.animate({ opacity: 1 }, 300)
            ).done(function () {
              DisplayInternalViewerComplete(imageIdx, displayType);
            });
          }
          else {
            // animate TRANSLATEX
            $new.css({ opacity:1, left:0, visibility:'visible'});
            var dir=(displayType == 'nextImage' ? - getViewport().w : getViewport().w);
            $new[0].style[g_CSStransformName]= 'translateX('+(-dir)+'px) '
            var from = {v: g_imageSwipePosX };
            var to = {v: (displayType == 'nextImage' ? - getViewport().w : getViewport().w)};
            jQuery(from).animate(to, { duration:500, easing:'linear', step: function(currentValue) {
                $gE.vwImgC[0].style[g_CSStransformName]= 'translateX('+currentValue+'px)';
                //$gE.vwImgC.css({ opacity: (1-Math.abs(currentValue/dir)) });
                $new[0].style[g_CSStransformName]= 'translateX('+(-dir+currentValue)+'px) '
              }, complete: function() {
                $gE.vwImgC[0].style[g_CSStransformName]= '';
                //$gE.vwImgC.css({ opacity:0 });
                DisplayInternalViewerComplete(imageIdx, displayType);
              }
            });
          }
          break;
          
        case 'slideAppear':
        default:
          var dir= getViewport().w+'px';
          var $new=$gE.vwImgP;
          if( displayType == 'nextImage' ) {
            dir='-'+dir;
            $new=$gE.vwImgN;
          }
          $new.css({ opacity:0, left:0, visibility:'visible'});
          jQuery.when(
            $gE.vwImgC.animate({ left: dir, opacity: 0 }, 500), 
            $new.animate({ opacity: 1 }, 300)
          ).done(function () {
            DisplayInternalViewerComplete(imageIdx, displayType);
          });
          break;
      }
    }


/*    
    switch( displayType ) {
      case 'nextImage':
        if( transitionScroll ) {
          var s='-'+(1*jQuery(window).width())+'px';
          animImgCurrent = { left: s, opacity: 0 };
        }
        else {
          animImgCurrent = { opacity: 0 };
        }
        $gE.vwContent.find('*').stop(true,true);
        $gE.vwImgN.css({ opacity:0, left:0, visibility:'visible'});  //.attr('src',gI[imageIdx].responsiveURL());
        //$gE.vwImgN.css({'opacity':0, 'right':'0', visibility: 'visible'});  //.attr('src',gI[imageIdx].responsiveURL());
        
        if( g_aengine == 'velocity' ) {
          $gE.vwImgC.velocity(animImgCurrent, 500), 
          $gE.vwImgN.velocity({ opacity: 1 }, 300)
          setTimeout(function () {
            DisplayInternalViewerComplete(imageIdx, displayType);
          }, 500);
        }
        else {
          jQuery.when(
//            $gE.vwImgC.animate({left:'10px', right:'10px'}, 5000);
            $gE.vwImgC.animate(animImgCurrent, 5000), 
            $gE.vwImgN.animate({ opacity: 1 }, 300)
          ).done(function () {
            DisplayInternalViewerComplete(imageIdx, displayType);
          });
        }
        break;

      case 'previousImage':
        if( transitionScroll ) {
          var s=(1*jQuery(window).width())+'px';
          animImgCurrent = { left: s, opacity: 0 };
          //animImgCurrent = { right : s,'opacity': 0 };
        }
        else {
          animImgCurrent = { opacity: 0 };
        }
        $gE.vwContent.find('*').stop(true,true);
        $gE.vwImgP.css({ opacity:0, left:0, visibility: 'visible'});  //.attr('src',gI[imageIdx].responsiveURL());
        //$gE.vwImgP.css({'opacity':0, 'right':'0', visibility: 'visible'});  //.attr('src',gI[imageIdx].responsiveURL());
        
        if( g_aengine == 'velocity' ) {
          $gE.vwImgC.velocity(animImgCurrent, 500), 
          $gE.vwImgP.velocity({ opacity: 1 }, 300)
          setTimeout(function () {
            DisplayInternalViewerComplete(imageIdx, displayType);
          }, 500);
        }
        else {
          jQuery.when(
            $gE.vwImgC.animate(animImgCurrent, 5000), 
            $gE.vwImgP.animate({ opacity: 1 }, 300)
          ).done(function () {
            DisplayInternalViewerComplete(imageIdx, displayType);
          });
        }
        break;
        
      default:
        $gE.vwContent.find('*').stop(true,true);
        $gE.vwImgC.css({ opacity:0, left:0, visibility: 'visible'}).attr('src',g_emptyGif).attr('src',gI[imageIdx].responsiveURL());
        //$gE.vwImgC.css({'opacity':0, 'right':'0', visibility: 'visible'}).attr('src',gI[imageIdx].responsiveURL());

        if( gO.enableElevatezoom && toType(jQuery().elevateZoom) == 'function' ) {
          $gE.vwImgC.attr('data-zoom-image',gI[imageIdx].responsiveURL());
        }

        jQuery.when(
          $gE.vwImgC.animate({ opacity: 1 }, 300)
        ).done(function () {
          DisplayInternalViewerComplete(imageIdx, displayType);
        });
        break;
    }
    */

    g_containerViewerDisplayed=true;

  }
  

  function DisplayInternalViewerComplete( imageIdx, displayType ) {
    //DisplayInternalViewerToolbar(imageIdx);

    g_imageSwipePosX=0;
    
    $gE.vwImgC.off("click");
    $gE.vwImgC.removeClass('imgCurrent');
  
    var $tmp=$gE.vwImgC;
    switch( displayType ) {
      case 'nextImage':
        $gE.vwImgC=$gE.vwImgN;
        $gE.vwImgN=$tmp;
        break;
      case 'previousImage':
        $gE.vwImgC=$gE.vwImgP;
        $gE.vwImgP=$tmp;
        break;
    }
    $gE.vwImgC.addClass('imgCurrent');
    
    // if( typeof(Hammer) == 'undefined' ) {
    if( g_viewerSwipe == null ) {
      //g_viewerSwipe=null;
      //g_viewerSwipe = new ViewerSwipeSupport($gE.vwImgC[0]);
      g_viewerSwipe = new ViewerSwipeSupport($gE.conVwCon[0]);
    }
    
    $gE.vwImgN.css({ opacity:0, left:0, visibility:'hidden' }).attr('src',g_emptyGif).attr('src',gI[GetNextImageIdx(imageIdx)].responsiveURL());
    //$gE.vwImgN.css({'opacity':0, 'right':'0', 'left':'0', visibility: 'hidden'}).attr('src',gI[GetNextImageIdx(imageIdx)].responsiveURL());
    $gE.vwImgP.css({ opacity:0, left:0, visibility:'hidden'}).attr('src',g_emptyGif).attr('src',gI[GetPreviousImageIdx(imageIdx)].responsiveURL());
    //$gE.vwImgP.css({'opacity':0, 'right':'0', 'left':'0', visibility: 'hidden'}).attr('src',gI[GetPreviousImageIdx(imageIdx)].responsiveURL());


    $gE.vwImgC.on("click",function(e){
      e.stopPropagation();
      if( e.pageX < (jQuery(window).width()/2) ) {
        DisplayPreviousImage();
      }
      else {
        DisplayNextImagePart1();
      }
    });

    if( gO.enableElevatezoom && toType(jQuery().elevateZoom) == 'function' ) {
      $gE.vwImgN.attr('data-zoom-image',gI[GetNextImageIdx(imageIdx)].responsiveURL());
      $gE.vwImgP.attr('data-zoom-image',gI[GetPreviousImageIdx(imageIdx)].responsiveURL());
      jQuery('.zoomContainer').remove();
      var ez = $gE.vwImgC.data('elevateZoom');
      ez.imageSrc=$gE.vwImgC.attr('src');
      ez.zoomImage=$gE.vwImgC.attr('src');
      ez.fetch(ez.imageSrc);
    }
  
    ResizeInternalViewer($gE.vwImgC);

    // TODO: this code does not work
    //jQuery(g_containerViewerContent).find('img').on('resize', function(){ 
    //  ResizeInternalViewer('.imgCurrent');
    //  console.log('resized');
    //});


    g_viewerImageIsChanged=false;
  }

  function GetNextImageIdx( imageIdx ) {
    var l=gI.length;
    var newImageIdx=-1;

    for(var i=imageIdx+1; i<l; i++ ){
      if( gI[i].albumID == gI[imageIdx].albumID && gI[i].kind == 'image' ) {
        newImageIdx=i;
        break;
      }
    }
    if( newImageIdx == -1 ) {
      for(var i=0; i<=imageIdx; i++ ){
        if( gI[i].albumID == gI[imageIdx].albumID && gI[i].kind == 'image' ) {
          newImageIdx=i;
          break;
        }
      }
    }
    
    return newImageIdx;
  }

  function GetPreviousImageIdx( imageIdx ) {
    var newImageIdx=-1;
    for(var i=imageIdx-1; i>=0; i-- ){
      if( gI[i].albumID == gI[imageIdx].albumID && gI[i].kind == 'image' ) {
        newImageIdx=i;
        break;
      }
    }
    if( newImageIdx == -1 ) {
      for(var i=gI.length-1; i>=imageIdx; i-- ){
        if( gI[i].albumID == gI[imageIdx].albumID && gI[i].kind == 'image' ) {
          newImageIdx=i;
          break;
        }
      }
    }
    
    return newImageIdx;
  }

  function HideInternalViewerToolbar() {
    $gE.conVwTb.css({'visibility':'hidden'});
  }

  
  function DisplayInternalViewerToolbar( imageIdx ) {
//    $gE.conVwTb.css({'visibility':'visible'});
    // set title
    if( gI[imageIdx].title !== undefined ) {
      $gE.conVwTb.find('.title').html(gI[imageIdx].title);
    }
    else {
      $gE.conVwTb.find('.title').html('');
    }
    // set description
    if( gI[imageIdx].description !== undefined ) {
      $gE.conVwTb.find('.description').html(gI[imageIdx].description);
    }
    else {
      $gE.conVwTb.find('.description').html('');
    }

    // set page number
    var viewerMaxImages=0;
    var l=gI.length;
    for( var i=0; i <  l ; i++ ) {
      if( gI[i].albumID == gI[imageIdx].albumID && gI[i].kind == 'image' ) {
        viewerMaxImages++;
      }
    }
    if( viewerMaxImages > 0 ) {
      $gE.conVwTb.find('.pageCounter').html((gI[imageIdx].imageNumber+1)+'/'+viewerMaxImages);
    }
    
    //ResizeInternalViewer();
  }
  
  function CloseInternalViewer( setLocationHash ) {

    if( g_viewerImageIsChanged ) {
      $gE.vwContent.find('*').stop(true,true);
    }

    if( g_containerViewerDisplayed ) {
      g_viewerSwipe=null;
      window.clearInterval(g_viewerResizeTimerID);
      if( g_playSlideshow ) {
        window.clearInterval(g_playSlideshowTimerID);
        g_playSlideshow=false;
      }
      if( g_viewerIsFullscreen ) {
        ViewerFullscreenToggle()
      }
      g_containerViewerDisplayed=false;
      $gE.conVwCon.off().remove();

      if( !$gE.base.hasClass('fullpage') ) {
        jQuery('body').css({overflow:'inherit'});
      }
      
      // if( gO.viewerScrollBarHidden ) {
        // jQuery('body').css({overflow:'inherit'});
      // }
      
      if( g_albumIdxToOpenOnViewerClose != -1 ) {
        DisplayAlbum(g_albumIdxToOpenOnViewerClose,true);
      }
      else {
        if( gO.locationHash && setLocationHash ) {
          var albumID=gI[g_viewerCurrentItemIdx].albumID,
          s='myGallery/'+g_baseEltID+'/'+albumID;
          g_lastLocationHash='#'+s;
          top.location.hash=s;
        }

        ThumbnailHoverOutAll();
      }
    }
  };
  
  function ResizeInternalViewer($imgElt) {

    window.clearInterval(g_viewerResizeTimerID);
    g_viewerResizeTimerID=window.setInterval(function(){ResizeInternalViewer($gE.vwImgC)},200);
  
    //var windowsW=jQuery(window).width();
    var windowsW=$gE.conVw.width();
    //var windowsH=jQuery(window).height();
    var windowsH=$gE.conVw.height();

    $gE.conVw.css({
      visibility:'visible',
      position: 'fixed'    //"absolute",
      //"top":0,
      //"left":0,
      //"width":jQuery(window).width(),
      //"height":jQuery(window).height()
    });

    var $elt=$imgElt;
    
    if( $gE.vwImgC.height() <= 40 ) {
      $gE.conVwTb.css({visibility:'hidden'});
    }
    else {
      $gE.conVwTb.css({visibility:'visible'});
    }
    
    var contentOuterWidthV=Math.abs($gE.vwContent.outerHeight(true)-$gE.vwContent.height()),  // vertical margin+border+padding
    contentOuterWidthH=Math.abs($gE.vwContent.outerWidth(true)-$gE.vwContent.width()),  // horizontal margin+border+padding
    imgBorderV=$elt.outerHeight(false)-$elt.innerHeight(),
    imgBorderH=Math.abs($elt.outerWidth(false)-$elt.innerWidth()),
    imgPaddingV=Math.abs($elt.innerHeight()-$elt.height()),
    imgPaddingH=Math.abs($elt.innerWidth()-$elt.width()),
    tV=imgBorderV+imgPaddingV,  //+tmargin;
    tH=imgBorderH+imgPaddingH,  //+tmargin;
    toolbarH=0;
    if( gO.viewerToolbar.style != 'innerImage' ) {
      toolbarH=$gE.conVwTb.find('.toolbar').outerHeight(true);
    }
    var h=windowsH-toolbarH-contentOuterWidthV,
    w=windowsW-contentOuterWidthH;
        
    switch( gO.viewerToolbar.position ) {
      case 'top':
        $gE.vwContent.css({height:h, width:w, top:toolbarH  });
        var posY=0;
        if( gO.viewerToolbar.style == 'innerImage' ) {
          posY= Math.abs($gE.vwImgC.outerHeight(true)-$gE.vwImgC.height())/2 +5;
        }
        if( gO.viewerToolbar.style == 'stuckImage' ) {
          posY= Math.abs($gE.vwImgC.outerHeight(true)-$gE.vwImgC.height())/2 -tV;
        }
        $gE.conVwTb.css({top: posY});
        break;

      case 'bottom':
      default:
        $gE.vwContent.css({height:h, width:w });
        var posY=0;
        if( gO.viewerToolbar.style == 'innerImage' ) {
          posY= Math.abs($gE.vwImgC.outerHeight(true)-$gE.vwImgC.height())/2 +5;//- $gE.conVwTb.outerHeight(true) ;
        }
        if( gO.viewerToolbar.style == 'stuckImage' ) {
          posY= Math.abs($gE.vwImgC.outerHeight(true)-$gE.vwImgC.height())/2 -tV;
        }
        $gE.conVwTb.css({bottom: posY});
        break;
    }
    
    if( gO.viewerToolbar.style == 'innerImage' ) {
      $gE.conVwTb.find('.toolbar').css({'max-width': $gE.vwImgC.width()});
    }
    
    if( gO.viewerToolbar.style == 'fullWidth' ) {
      $gE.conVwTb.find('.toolbar').css({width: w});
    }

    $gE.conVwTb.css({height: $gE.conVwTb.find('.toolbar').outerHeight(true)});
    $gE.vwContent.children('img').css({'max-width':(w-tH), 'max-height':(h-tV) });
  }
  
  
  function OpenFancyBox( imageIdx ) {
    var n=imageIdx,
    lstImages=[],
    current=0;

    lstImages[current]=new Object;
    lstImages[current].href=gI[n].responsiveURL();
    lstImages[current].title=gI[n].title;
    
    var l=gI.length;
    for( var j=n+1; j<l ; j++) {
      if( gI[j].kind == 'image' && gI[j].albumID == gI[imageIdx].albumID && gI[j].destinationURL == '' ) {
        current++;
        lstImages[current]=new Object;
        lstImages[current].href=gI[j].responsiveURL();
        lstImages[current].title=gI[j].title;
      }
    }
    for( var j=0; j<n; j++) {
      if( gI[j].kind == 'image' && gI[j].albumID == gI[imageIdx].albumID && gI[j].destinationURL == '' ) {
        current++;
        lstImages[current]=new Object;
        lstImages[current].href=gI[j].responsiveURL();
        lstImages[current].title=gI[j].title;
      }
    }
    jQuery.fancybox(lstImages,{'autoPlay':false, 'nextEffect':'fade', 'prevEffect':'fade','scrolling':'no',
      helpers    : {  buttons  : { 'position' : 'bottom'} }
    });
  };
  
  // ##### BREADCRUMB/THUMBNAIL COLOR SCHEME #####
  function SetColorScheme( element ) {
    var cs=null;
    switch(toType(gO.colorScheme)) {
      case 'object':    // user custom color scheme object 
        cs=g_colorScheme_default;
        jQuery.extend(true,cs,gO.colorScheme);
        g_colorSchemeLabel='myGallery_colorscheme_custom_'+g_baseEltID;
        break;
      case 'string':    // name of an internal defined color scheme
        switch( gO.colorScheme ) {
          case 'none':
            return;
            break;
          case 'light':
            cs=g_colorScheme_light;
            g_colorSchemeLabel='myGallery_colorscheme_light';
            break;
          case 'lightBackground':
            cs=g_colorScheme_lightBackground;
            g_colorSchemeLabel='myGallery_colorscheme_lightBackground';
            break;
          case 'darkRed':
            cs=g_colorScheme_darkRed;
            g_colorSchemeLabel='myGallery_colorscheme_darkred';
            break;
          case 'darkGreen':
            cs=g_colorScheme_darkGreen;
            g_colorSchemeLabel='myGallery_colorscheme_darkgreen';
            break;
          case 'darkBlue':
            cs=g_colorScheme_darkBlue;
            g_colorSchemeLabel='myGallery_colorscheme_darkblue';
            break;
          case 'darkOrange':
            cs=g_colorScheme_darkOrange;
            g_colorSchemeLabel='myGallery_colorscheme_darkorange';
            break;
          case 'default':
          case 'dark':
          default:
            cs=g_colorScheme_default;
            g_colorSchemeLabel='myGallery_colorscheme_default';
        }
        break;
      default:
        nanoAlert('Error in colorScheme parameter.');
        return;
    }

    
 
    
    //var s1='.myGallery_theme_'+gO.theme+' ';
    var s1='.' + g_colorSchemeLabel + ' ';
    var s=s1+'.myGalleryNavigationbar { background:'+cs.navigationbar.background+' !important; }'+'\n';
    if( cs.navigationbar.border !== undefined ) { s+=s1+'.myGalleryNavigationbar { border:'+cs.navigationbar.border+' !important; }'+'\n'; }
    if( cs.navigationbar.borderTop !== undefined ) { s+=s1+'.myGalleryNavigationbar { border-top:'+cs.navigationbar.borderTop+' !important; }'+'\n'; }
    if( cs.navigationbar.borderBottom !== undefined ) { s+=s1+'.myGalleryNavigationbar { border-bottom:'+cs.navigationbar.borderBottom+' !important; }'+'\n'; }
    if( cs.navigationbar.borderRight !== undefined ) { s+=s1+'.myGalleryNavigationbar { border-right:'+cs.navigationbar.borderRight+' !important; }'+'\n'; }
    if( cs.navigationbar.borderLeft !== undefined ) { s+=s1+'.myGalleryNavigationbar { border-left:'+cs.navigationbar.borderLeft+' !important; }'+'\n'; }
    s+=s1+'.myGalleryNavigationbar .oneFolder  { color:'+cs.navigationbar.color+' !important; }'+'\n';
    s+=s1+'.myGalleryNavigationbar .separator  { color:'+cs.navigationbar.color+' !important; }'+'\n';
    s+=s1+'.myGalleryNavigationbar .myGalleryTags { color:'+cs.navigationbar.color+' !important; }'+'\n';
    s+=s1+'.myGalleryNavigationbar .setFullPageButton { color:'+cs.navigationbar.color+' !important; }'+'\n';
    s+=s1+'.myGalleryNavigationbar .removeFullPageButton { color:'+cs.navigationbar.color+' !important; }'+'\n';
    s+=s1+'.myGalleryNavigationbar .oneFolder:hover { color:'+cs.navigationbar.colorHover+' !important; }'+'\n';
    s+=s1+'.myGalleryNavigationbar .separator:hover { color:'+cs.navigationbar.colorHover+' !important; }'+'\n';
    s+=s1+'.myGalleryNavigationbar .myGalleryTags:hover { color:'+cs.navigationbar.colorHover+' !important; }'+'\n';
    s+=s1+'.myGalleryNavigationbar .setFullPageButton:hover { color:'+cs.navigationbar.colorHover+' !important; }'+'\n';
    s+=s1+'.myGalleryNavigationbar .removeFullPageButton:hover { color:'+cs.navigationbar.colorHover+' !important; }'+'\n';

    s+=s1+'.myGalleryContainer > .myGalleryThumbnailContainer { background:'+cs.thumbnail.background+' !important; border:'+cs.thumbnail.border+' !important; }'+'\n';
    s+=s1+'.myGalleryContainer > .myGalleryThumbnailContainer .imgContainer { background:'+cs.thumbnail.background+' !important; }'+'\n';
    // s+=s1+'.myGalleryContainer .myGalleryThumbnailContainer .labelImage { background:'+cs.thumbnail.labelBackground+' !important; }'+'\n';
    s+=s1+'.myGalleryContainer > .myGalleryThumbnailContainer .labelImage{ background:'+cs.thumbnail.labelBackground+' ; }'+'\n';
    s+=s1+'.myGalleryContainer > .myGalleryThumbnailContainer .labelImageTitle  { color:'+cs.thumbnail.titleColor+' !important; Text-Shadow:'+cs.thumbnail.titleShadow+' !important; }'+'\n';
    s+=s1+'.myGalleryContainer > .myGalleryThumbnailContainer .labelImageTitle:before { color:'+cs.thumbnail.titleColor+' !important; Text-Shadow:'+cs.thumbnail.titleShadow+' !important; }'+'\n';
    s+=s1+'.myGalleryContainer > .myGalleryThumbnailContainer .labelFolderTitle { color:'+cs.thumbnail.titleColor+' !important; Text-Shadow:'+cs.thumbnail.titleShadow+' !important; }'+'\n';
    s+=s1+'.myGalleryContainer > .myGalleryThumbnailContainer .labelFolderTitle:before { color:'+cs.thumbnail.titleColor+' !important; Text-Shadow:'+cs.thumbnail.titleShadow+' !important; }'+'\n';
    s+=s1+'.myGalleryContainer > .myGalleryThumbnailContainer .labelDescription { color:'+cs.thumbnail.descriptionColor+' !important; Text-Shadow:'+cs.thumbnail.descriptionShadow+' !important; }'+'\n';
    // s+='.' + g_colorSchemeLabel +'.fullpage { background:'+gO.galleryFullpageBgColor+' !important; }'+'\n';
  
    // gallery fullpage background color
    var gbg='myGallery_galleryfullpage_bgcolor_'+g_baseEltID;
    s+='.' + gbg +'.fullpage { background:'+gO.galleryFullpageBgColor+' !important; }'+'\n';

    jQuery('head').append('<style>'+s+'</style>');
    jQuery(element).addClass(g_colorSchemeLabel);
    jQuery(element).addClass(gbg);

  };
  
  // ##### VIEWER COLOR SCHEME #####
  function SetColorSchemeViewer( element ) {

    var cs=null;
    switch(toType(gO.colorSchemeViewer)) {
      case 'object':    // user custom color scheme object 
        cs=g_colorSchemeViewer_default;
        jQuery.extend(true,cs,gO.colorSchemeViewer);
        g_colorSchemeLabel='myGallery_colorschemeviewer_custom';
        break;
      case 'string':    // name of an internal defined color scheme
        switch( gO.colorSchemeViewer ) {
          case 'none':
            return;
            break;
          case 'light':
            cs=g_colorSchemeViewer_light;
            g_colorSchemeLabel='myGallery_colorschemeviewer_light';
            break;
          case 'darkRed':
            cs=g_colorSchemeViewer_darkRed;
            g_colorSchemeLabel='myGallery_colorschemeviewer_darkred';
            break;
          case 'darkGreen':
            cs=g_colorSchemeViewer_darkGreen;
            g_colorSchemeLabel='myGallery_colorschemeviewer_darkgreen';
            break;
          case 'darkBlue':
            cs=g_colorSchemeViewer_darkBlue;
            g_colorSchemeLabel='myGallery_colorschemeviewer_darkblue';
            break;
          case 'darkOrange':
            cs=g_colorSchemeViewer_darkOrange;
            g_colorSchemeLabel='myGallery_colorschemeviewer_darkorange';
            break;
          case 'dark':
            cs=g_colorSchemeViewer_dark;
            g_colorSchemeLabel='myGallery_colorschemeviewer_dark';
            break;
          case 'default':
          default:
            cs=g_colorSchemeViewer_default;
            g_colorSchemeLabel='myGallery_colorschemeviewer_default';
        }
        break;
      default:
        nanoAlert('Error in colorSchemeViewer parameter.');
        return;
    }

    
    //var s1='.myGallery_theme_'+gO.theme+' ';
    var s1='.' + g_colorSchemeLabel + ' ';
    var s=s1+'.myGalleryViewer { background:'+cs.background+' !important; }'+'\n';
    //s+=s1+'.myGalleryViewer { background:'+cs.viewer.background+'; color:'+cs.viewer.color+'; }'+'\n';
    s+=s1+'.myGalleryViewer .content img { border:'+cs.imageBorder+' !important; box-shadow:'+cs.imageBoxShadow+' !important; }'+'\n';
    s+=s1+'.myGalleryViewer .toolbar { background:'+cs.barBackground+' !important; border:'+cs.barBorder+' !important; color:'+cs.barColor+' !important; }'+'\n';
    s+=s1+'.myGalleryViewer .toolbar .previousButton:after { color:'+cs.barColor+' !important; }'+'\n';
    s+=s1+'.myGalleryViewer .toolbar .nextButton:after { color:'+cs.barColor+' !important; }'+'\n';
    s+=s1+'.myGalleryViewer .toolbar .closeButton:after { color:'+cs.barColor+' !important; }'+'\n';
    //s+=s1+'.myGalleryViewer .toolbar .label { background:'+cs.barBackground+'; }'+'\n';
    s+=s1+'.myGalleryViewer .toolbar .label .title { color:'+cs.barColor+' !important; }'+'\n';
    s+=s1+'.myGalleryViewer .toolbar .label .description { color:'+cs.barDescriptionColor+' !important; }'+'\n';
    jQuery('head').append('<style>'+s+'</style>');
    jQuery(element).addClass(g_colorSchemeLabel);
  };


  
// #################
// ##### TOOLS #####
// #################
  
  // Display a message
  function nanoAlert( msg ) {
    nanoConsoleLog(msg);
    if( $gE.conConsole != null ) {
      $gE.conConsole.css({visibility:'visible', height:'60px'});
      $gE.conConsole.append('<p>myGallery: '+msg+ ' ['+g_baseEltID+']</p>');
      //alert('myGallery: ' + msg);
    }
  };
  
  // write to console log
  function nanoConsoleLog( msg ) {
    if (window.console) { console.log('myGallery: ' + msg + ' ['+g_baseEltID+']'); }
  };
  
  // get viewport coordinates and size
  function getViewport() {
    var $win = jQuery(window);
    return {
      l: $win.scrollLeft(),
      t: $win.scrollTop(),
      w: $win.width(),
      h: $win.height()
    }
  }


  function inViewport( $elt, threshold ) {
    var wp=getViewport(),
    eltOS=$elt.offset(),
    th=$elt.outerHeight(true),
    tw=$elt.outerWidth(true);
    if( eltOS.top >= (wp.t-threshold) 
      && (eltOS.top+th) <= (wp.t+wp.h+threshold)
      && eltOS.left >= (wp.l-threshold) 
      && (eltOS.left+tw) <= (wp.l+wp.w+threshold) ) {
      return true;
    }
    else {
      return false;
    }
  }

  function inViewportVert( $elt, threshold ) {
    var wp=getViewport(),
    eltOS=$elt.offset(),
    th=$elt.outerHeight(true),
    tw=$elt.outerWidth(true);

    if( wp.t == 0 && (eltOS.top) <= (wp.t+wp.h ) ) { return true; }

    if( eltOS.top >= (wp.t) 
      && (eltOS.top+th) <= (wp.t+wp.h-threshold) ) {
        return true;
    }
    else {
      return false;
    }
  }

  
  // set z-index to display element on top of all others
  function setElementOnTop( start, elt ) {
    var highest_index = 0;
    if( start=='' ) { start= '*'; }
    jQuery(start).each(function() {
      var cur = parseInt(jQuery(this).css('z-index'));
      highest_index = cur > highest_index ? cur : highest_index;
    });
    highest_index++;
    jQuery(elt).css('z-index',highest_index);
  };

  // set z-index to display 2 elements on top of all others
  function set2ElementsOnTop( start, elt1, elt2 ) {
    var highest_index = 0;
    if( start=='' ) { start= '*'; }
    jQuery(start).each(function() {
      var cur = parseInt(jQuery(this).css('z-index'));
      highest_index = cur > highest_index ? cur : highest_index;
    });
    highest_index++;
    jQuery(elt2).css('z-index',highest_index+1);
    jQuery(elt1).css('z-index',highest_index);
  };

  
  // return the real type of the object
  var toType = function( obj ) {
    // by Angus Croll - http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  };

  
  // return true if current jQuery version match the minimum required
  function jQueryMinVersion( version ) {
    var $vrs = window.jQuery.fn.jquery.split('.'),
    min = version.split('.');
    for (var i=0, len=$vrs.length; i<len; i++) {
      if (min[i] && (+$vrs[i]) < (+min[i])) {
        return false;
      }
    }
    return true;
  };
  
  
  //+ Jonas Raoni Soares Silva
  //@ http://jsfromhell.com/array/shuffle [v1.0]
  function AreaShuffle(o){ //v1.0
      for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
      return o;
  };
 
  
  // color lighter or darker
  // found on http://stackoverflow.com/questions/1507931/generate-lighter-darker-color-in-css-using-javascript/5747818#5747818
  // Ratio is between 0 and 1
  var changeColor = function( color, ratio, darker ) {
    // Trim trailing/leading whitespace
    color = color.replace(/^\s*|\s*$/, '');

    // Expand three-digit hex
    color = color.replace(
      /^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i,
      '#$1$1$2$2$3$3'
    );

    // Calculate ratio
    var difference = Math.round(ratio * 256) * (darker ? -1 : 1),
      // Determine if input is RGB(A)
      rgb = color.match(new RegExp('^rgba?\\(\\s*' +
        '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
        '\\s*,\\s*' +
        '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
        '\\s*,\\s*' +
        '(\\d|[1-9]\\d|1\\d{2}|2[0-4][0-9]|25[0-5])' +
        '(?:\\s*,\\s*' +
        '(0|1|0?\\.\\d+))?' +
        '\\s*\\)$'
      , 'i')),
      alpha = !!rgb && rgb[4] != null ? rgb[4] : null,

      // Convert hex to decimal
      decimal = !!rgb? [rgb[1], rgb[2], rgb[3]] : color.replace(
        /^#?([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])([a-f0-9][a-f0-9])/i,
        function() {
          return parseInt(arguments[1], 16) + ',' +
            parseInt(arguments[2], 16) + ',' +
            parseInt(arguments[3], 16);
        }
      ).split(/,/),
      returnValue;

    // Return RGB(A)
    return !!rgb ?
      'rgb' + (alpha !== null ? 'a' : '') + '(' +
        Math[darker ? 'max' : 'min'](
          parseInt(decimal[0], 10) + difference, darker ? 0 : 255
        ) + ', ' +
        Math[darker ? 'max' : 'min'](
          parseInt(decimal[1], 10) + difference, darker ? 0 : 255
        ) + ', ' +
        Math[darker ? 'max' : 'min'](
          parseInt(decimal[2], 10) + difference, darker ? 0 : 255
        ) +
        (alpha !== null ? ', ' + alpha : '') +
        ')' :
      // Return hex
      [
        '#',
        pad(Math[darker ? 'max' : 'min'](
          parseInt(decimal[0], 10) + difference, darker ? 0 : 255
        ).toString(16), 2),
        pad(Math[darker ? 'max' : 'min'](
          parseInt(decimal[1], 10) + difference, darker ? 0 : 255
        ).toString(16), 2),
        pad(Math[darker ? 'max' : 'min'](
          parseInt(decimal[2], 10) + difference, darker ? 0 : 255
        ).toString(16), 2)
      ].join('');
  };
  var lighterColor = function(color, ratio) {
    return changeColor(color, ratio, false);
  };
  var darkerColor = function(color, ratio) {
    return changeColor(color, ratio, true);
  };
  var pad = function(num, totalChars) {
    var pad = '0';
    num = num + '';
    while (num.length < totalChars) {
      num = pad + num;
    }
    return num;
  };
  
}





/*!
 * jQuery Color Animations v2.1.2
 * https://github.com/jquery/jquery-color
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * Date: Wed Jan 16 08:47:09 2013 -0600
 */
(function( jQuery, undefined ) {

  var stepHooks = "backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color columnRuleColor outlineColor textDecorationColor textEmphasisColor",

  // plusequals test for += 100 -= 100
  rplusequals = /^([\-+])=\s*(\d+\.?\d*)/,
  // a set of RE's that can match strings and generate color tuples.
  stringParsers = [{
      re: /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      parse: function( execResult ) {
        return [
          execResult[ 1 ],
          execResult[ 2 ],
          execResult[ 3 ],
          execResult[ 4 ]
        ];
      }
    }, {
      re: /rgba?\(\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      parse: function( execResult ) {
        return [
          execResult[ 1 ] * 2.55,
          execResult[ 2 ] * 2.55,
          execResult[ 3 ] * 2.55,
          execResult[ 4 ]
        ];
      }
    }, {
      // this regex ignores A-F because it's compared against an already lowercased string
      re: /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/,
      parse: function( execResult ) {
        return [
          parseInt( execResult[ 1 ], 16 ),
          parseInt( execResult[ 2 ], 16 ),
          parseInt( execResult[ 3 ], 16 )
        ];
      }
    }, {
      // this regex ignores A-F because it's compared against an already lowercased string
      re: /#([a-f0-9])([a-f0-9])([a-f0-9])/,
      parse: function( execResult ) {
        return [
          parseInt( execResult[ 1 ] + execResult[ 1 ], 16 ),
          parseInt( execResult[ 2 ] + execResult[ 2 ], 16 ),
          parseInt( execResult[ 3 ] + execResult[ 3 ], 16 )
        ];
      }
    }, {
      re: /hsla?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\%\s*,\s*(\d+(?:\.\d+)?)\%\s*(?:,\s*(\d?(?:\.\d+)?)\s*)?\)/,
      space: "hsla",
      parse: function( execResult ) {
        return [
          execResult[ 1 ],
          execResult[ 2 ] / 100,
          execResult[ 3 ] / 100,
          execResult[ 4 ]
        ];
      }
    }],

  // jQuery.Color( )
  color = jQuery.Color = function( color, green, blue, alpha ) {
    return new jQuery.Color.fn.parse( color, green, blue, alpha );
  },
  spaces = {
    rgba: {
      props: {
        red: {
          idx: 0,
          type: "byte"
        },
        green: {
          idx: 1,
          type: "byte"
        },
        blue: {
          idx: 2,
          type: "byte"
        }
      }
    },

    hsla: {
      props: {
        hue: {
          idx: 0,
          type: "degrees"
        },
        saturation: {
          idx: 1,
          type: "percent"
        },
        lightness: {
          idx: 2,
          type: "percent"
        }
      }
    }
  },
  propTypes = {
    "byte": {
      floor: true,
      max: 255
    },
    "percent": {
      max: 1
    },
    "degrees": {
      mod: 360,
      floor: true
    }
  },
  support = color.support = {},

  // element for support tests
  supportElem = jQuery( "<p>" )[ 0 ],

  // colors = jQuery.Color.names
  colors,

  // local aliases of functions called often
  each = jQuery.each;

// determine rgba support immediately
supportElem.style.cssText = "background-color:rgba(1,1,1,.5)";
support.rgba = supportElem.style.backgroundColor.indexOf( "rgba" ) > -1;

// define cache name and alpha properties
// for rgba and hsla spaces
each( spaces, function( spaceName, space ) {
  space.cache = "_" + spaceName;
  space.props.alpha = {
    idx: 3,
    type: "percent",
    def: 1
  };
});

function clamp( value, prop, allowEmpty ) {
  var type = propTypes[ prop.type ] || {};

  if ( value == null ) {
    return (allowEmpty || !prop.def) ? null : prop.def;
  }

  // ~~ is an short way of doing floor for positive numbers
  value = type.floor ? ~~value : parseFloat( value );

  // IE will pass in empty strings as value for alpha,
  // which will hit this case
  if ( isNaN( value ) ) {
    return prop.def;
  }

  if ( type.mod ) {
    // we add mod before modding to make sure that negatives values
    // get converted properly: -10 -> 350
    return (value + type.mod) % type.mod;
  }

  // for now all property types without mod have min and max
  return 0 > value ? 0 : type.max < value ? type.max : value;
}

function stringParse( string ) {
  var inst = color(),
    rgba = inst._rgba = [];

  string = string.toLowerCase();

  each( stringParsers, function( i, parser ) {
    var parsed,
      match = parser.re.exec( string ),
      values = match && parser.parse( match ),
      spaceName = parser.space || "rgba";

    if ( values ) {
      parsed = inst[ spaceName ]( values );

      // if this was an rgba parse the assignment might happen twice
      // oh well....
      inst[ spaces[ spaceName ].cache ] = parsed[ spaces[ spaceName ].cache ];
      rgba = inst._rgba = parsed._rgba;

      // exit each( stringParsers ) here because we matched
      return false;
    }
  });

  // Found a stringParser that handled it
  if ( rgba.length ) {

    // if this came from a parsed string, force "transparent" when alpha is 0
    // chrome, (and maybe others) return "transparent" as rgba(0,0,0,0)
    if ( rgba.join() === "0,0,0,0" ) {
      jQuery.extend( rgba, colors.transparent );
    }
    return inst;
  }

  // named colors
  return colors[ string ];
}

color.fn = jQuery.extend( color.prototype, {
  parse: function( red, green, blue, alpha ) {
    if ( red === undefined ) {
      this._rgba = [ null, null, null, null ];
      return this;
    }
    if ( red.jquery || red.nodeType ) {
      red = jQuery( red ).css( green );
      green = undefined;
    }

    var inst = this,
      type = jQuery.type( red ),
      rgba = this._rgba = [];

    // more than 1 argument specified - assume ( red, green, blue, alpha )
    if ( green !== undefined ) {
      red = [ red, green, blue, alpha ];
      type = "array";
    }

    if ( type === "string" ) {
      return this.parse( stringParse( red ) || colors._default );
    }

    if ( type === "array" ) {
      each( spaces.rgba.props, function( key, prop ) {
        rgba[ prop.idx ] = clamp( red[ prop.idx ], prop );
      });
      return this;
    }

    if ( type === "object" ) {
      if ( red instanceof color ) {
        each( spaces, function( spaceName, space ) {
          if ( red[ space.cache ] ) {
            inst[ space.cache ] = red[ space.cache ].slice();
          }
        });
      } else {
        each( spaces, function( spaceName, space ) {
          var cache = space.cache;
          each( space.props, function( key, prop ) {

            // if the cache doesn't exist, and we know how to convert
            if ( !inst[ cache ] && space.to ) {

              // if the value was null, we don't need to copy it
              // if the key was alpha, we don't need to copy it either
              if ( key === "alpha" || red[ key ] == null ) {
                return;
              }
              inst[ cache ] = space.to( inst._rgba );
            }

            // this is the only case where we allow nulls for ALL properties.
            // call clamp with alwaysAllowEmpty
            inst[ cache ][ prop.idx ] = clamp( red[ key ], prop, true );
          });

          // everything defined but alpha?
          if ( inst[ cache ] && jQuery.inArray( null, inst[ cache ].slice( 0, 3 ) ) < 0 ) {
            // use the default of 1
            inst[ cache ][ 3 ] = 1;
            if ( space.from ) {
              inst._rgba = space.from( inst[ cache ] );
            }
          }
        });
      }
      return this;
    }
  },
  is: function( compare ) {
    var is = color( compare ),
      same = true,
      inst = this;

    each( spaces, function( _, space ) {
      var localCache,
        isCache = is[ space.cache ];
      if (isCache) {
        localCache = inst[ space.cache ] || space.to && space.to( inst._rgba ) || [];
        each( space.props, function( _, prop ) {
          if ( isCache[ prop.idx ] != null ) {
            same = ( isCache[ prop.idx ] === localCache[ prop.idx ] );
            return same;
          }
        });
      }
      return same;
    });
    return same;
  },
  _space: function() {
    var used = [],
      inst = this;
    each( spaces, function( spaceName, space ) {
      if ( inst[ space.cache ] ) {
        used.push( spaceName );
      }
    });
    return used.pop();
  },
  transition: function( other, distance ) {
    var end = color( other ),
      spaceName = end._space(),
      space = spaces[ spaceName ],
      startColor = this.alpha() === 0 ? color( "transparent" ) : this,
      start = startColor[ space.cache ] || space.to( startColor._rgba ),
      result = start.slice();

    end = end[ space.cache ];
    each( space.props, function( key, prop ) {
      var index = prop.idx,
        startValue = start[ index ],
        endValue = end[ index ],
        type = propTypes[ prop.type ] || {};

      // if null, don't override start value
      if ( endValue === null ) {
        return;
      }
      // if null - use end
      if ( startValue === null ) {
        result[ index ] = endValue;
      } else {
        if ( type.mod ) {
          if ( endValue - startValue > type.mod / 2 ) {
            startValue += type.mod;
          } else if ( startValue - endValue > type.mod / 2 ) {
            startValue -= type.mod;
          }
        }
        result[ index ] = clamp( ( endValue - startValue ) * distance + startValue, prop );
      }
    });
    return this[ spaceName ]( result );
  },
  blend: function( opaque ) {
    // if we are already opaque - return ourself
    if ( this._rgba[ 3 ] === 1 ) {
      return this;
    }

    var rgb = this._rgba.slice(),
      a = rgb.pop(),
      blend = color( opaque )._rgba;

    return color( jQuery.map( rgb, function( v, i ) {
      return ( 1 - a ) * blend[ i ] + a * v;
    }));
  },
  toRgbaString: function() {
    var prefix = "rgba(",
      rgba = jQuery.map( this._rgba, function( v, i ) {
        return v == null ? ( i > 2 ? 1 : 0 ) : v;
      });

    if ( rgba[ 3 ] === 1 ) {
      rgba.pop();
      prefix = "rgb(";
    }

    return prefix + rgba.join() + ")";
  },
  toHslaString: function() {
    var prefix = "hsla(",
      hsla = jQuery.map( this.hsla(), function( v, i ) {
        if ( v == null ) {
          v = i > 2 ? 1 : 0;
        }

        // catch 1 and 2
        if ( i && i < 3 ) {
          v = Math.round( v * 100 ) + "%";
        }
        return v;
      });

    if ( hsla[ 3 ] === 1 ) {
      hsla.pop();
      prefix = "hsl(";
    }
    return prefix + hsla.join() + ")";
  },
  toHexString: function( includeAlpha ) {
    var rgba = this._rgba.slice(),
      alpha = rgba.pop();

    if ( includeAlpha ) {
      rgba.push( ~~( alpha * 255 ) );
    }

    return "#" + jQuery.map( rgba, function( v ) {

      // default to 0 when nulls exist
      v = ( v || 0 ).toString( 16 );
      return v.length === 1 ? "0" + v : v;
    }).join("");
  },
  toString: function() {
    return this._rgba[ 3 ] === 0 ? "transparent" : this.toRgbaString();
  }
});
color.fn.parse.prototype = color.fn;

// hsla conversions adapted from:
// https://code.google.com/p/maashaack/source/browse/packages/graphics/trunk/src/graphics/colors/HUE2RGB.as?r=5021

function hue2rgb( p, q, h ) {
  h = ( h + 1 ) % 1;
  if ( h * 6 < 1 ) {
    return p + (q - p) * h * 6;
  }
  if ( h * 2 < 1) {
    return q;
  }
  if ( h * 3 < 2 ) {
    return p + (q - p) * ((2/3) - h) * 6;
  }
  return p;
}

spaces.hsla.to = function ( rgba ) {
  if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
    return [ null, null, null, rgba[ 3 ] ];
  }
  var r = rgba[ 0 ] / 255,
    g = rgba[ 1 ] / 255,
    b = rgba[ 2 ] / 255,
    a = rgba[ 3 ],
    max = Math.max( r, g, b ),
    min = Math.min( r, g, b ),
    diff = max - min,
    add = max + min,
    l = add * 0.5,
    h, s;

  if ( min === max ) {
    h = 0;
  } else if ( r === max ) {
    h = ( 60 * ( g - b ) / diff ) + 360;
  } else if ( g === max ) {
    h = ( 60 * ( b - r ) / diff ) + 120;
  } else {
    h = ( 60 * ( r - g ) / diff ) + 240;
  }

  // chroma (diff) == 0 means greyscale which, by definition, saturation = 0%
  // otherwise, saturation is based on the ratio of chroma (diff) to lightness (add)
  if ( diff === 0 ) {
    s = 0;
  } else if ( l <= 0.5 ) {
    s = diff / add;
  } else {
    s = diff / ( 2 - add );
  }
  return [ Math.round(h) % 360, s, l, a == null ? 1 : a ];
};

spaces.hsla.from = function ( hsla ) {
  if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
    return [ null, null, null, hsla[ 3 ] ];
  }
  var h = hsla[ 0 ] / 360,
    s = hsla[ 1 ],
    l = hsla[ 2 ],
    a = hsla[ 3 ],
    q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
    p = 2 * l - q;

  return [
    Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
    Math.round( hue2rgb( p, q, h ) * 255 ),
    Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
    a
  ];
};


each( spaces, function( spaceName, space ) {
  var props = space.props,
    cache = space.cache,
    to = space.to,
    from = space.from;

  // makes rgba() and hsla()
  color.fn[ spaceName ] = function( value ) {

    // generate a cache for this space if it doesn't exist
    if ( to && !this[ cache ] ) {
      this[ cache ] = to( this._rgba );
    }
    if ( value === undefined ) {
      return this[ cache ].slice();
    }

    var ret,
      type = jQuery.type( value ),
      arr = ( type === "array" || type === "object" ) ? value : arguments,
      local = this[ cache ].slice();

    each( props, function( key, prop ) {
      var val = arr[ type === "object" ? key : prop.idx ];
      if ( val == null ) {
        val = local[ prop.idx ];
      }
      local[ prop.idx ] = clamp( val, prop );
    });

    if ( from ) {
      ret = color( from( local ) );
      ret[ cache ] = local;
      return ret;
    } else {
      return color( local );
    }
  };

  // makes red() green() blue() alpha() hue() saturation() lightness()
  each( props, function( key, prop ) {
    // alpha is included in more than one space
    if ( color.fn[ key ] ) {
      return;
    }
    color.fn[ key ] = function( value ) {
      var vtype = jQuery.type( value ),
        fn = ( key === "alpha" ? ( this._hsla ? "hsla" : "rgba" ) : spaceName ),
        local = this[ fn ](),
        cur = local[ prop.idx ],
        match;

      if ( vtype === "undefined" ) {
        return cur;
      }

      if ( vtype === "function" ) {
        value = value.call( this, cur );
        vtype = jQuery.type( value );
      }
      if ( value == null && prop.empty ) {
        return this;
      }
      if ( vtype === "string" ) {
        match = rplusequals.exec( value );
        if ( match ) {
          value = cur + parseFloat( match[ 2 ] ) * ( match[ 1 ] === "+" ? 1 : -1 );
        }
      }
      local[ prop.idx ] = value;
      return this[ fn ]( local );
    };
  });
});

// add cssHook and .fx.step function for each named hook.
// accept a space separated string of properties
color.hook = function( hook ) {
  var hooks = hook.split( " " );
  each( hooks, function( i, hook ) {
    jQuery.cssHooks[ hook ] = {
      set: function( elem, value ) {
        var parsed, curElem,
          backgroundColor = "";

        if ( value !== "transparent" && ( jQuery.type( value ) !== "string" || ( parsed = stringParse( value ) ) ) ) {
          value = color( parsed || value );
          if ( !support.rgba && value._rgba[ 3 ] !== 1 ) {
            curElem = hook === "backgroundColor" ? elem.parentNode : elem;
            while (
              (backgroundColor === "" || backgroundColor === "transparent") &&
              curElem && curElem.style
            ) {
              try {
                backgroundColor = jQuery.css( curElem, "backgroundColor" );
                curElem = curElem.parentNode;
              } catch ( e ) {
              }
            }

            value = value.blend( backgroundColor && backgroundColor !== "transparent" ?
              backgroundColor :
              "_default" );
          }

          value = value.toRgbaString();
        }
        try {
          elem.style[ hook ] = value;
        } catch( e ) {
          // wrapped to prevent IE from throwing errors on "invalid" values like 'auto' or 'inherit'
        }
      }
    };
    jQuery.fx.step[ hook ] = function( fx ) {
      if ( !fx.colorInit ) {
        fx.start = color( fx.elem, hook );
        fx.end = color( fx.end );
        fx.colorInit = true;
      }
      jQuery.cssHooks[ hook ].set( fx.elem, fx.start.transition( fx.end, fx.pos ) );
    };
  });

};

color.hook( stepHooks );

jQuery.cssHooks.borderColor = {
  expand: function( value ) {
    var expanded = {};

    each( [ "Top", "Right", "Bottom", "Left" ], function( i, part ) {
      expanded[ "border" + part + "Color" ] = value;
    });
    return expanded;
  }
};

// Basic color names only.
// Usage of any of the other color names requires adding yourself or including
// jquery.color.svg-names.js.
colors = jQuery.Color.names = {
  // 4.1. Basic color keywords
  aqua: "#00ffff",
  black: "#000000",
  blue: "#0000ff",
  fuchsia: "#ff00ff",
  gray: "#808080",
  green: "#008000",
  lime: "#00ff00",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  purple: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  teal: "#008080",
  white: "#ffffff",
  yellow: "#ffff00",

  // 4.2.3. "transparent" color keyword
  transparent: [ null, null, null, 0 ],

  _default: "#ffffff"
};

})( jQuery );





















/*!
 * imagesLoaded PACKAGED v3.1.5
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */


/*!
 * EventEmitter v4.2.6 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
	

	/**
	 * Class for managing events.
	 * Can be extended to provide event functionality in other classes.
	 *
	 * @class EventEmitter Manages event registering and emitting.
	 */
	function ngEventEmitter() {}

	// Shortcuts to improve speed and size
	var proto = ngEventEmitter.prototype;
	var exports = this;
	var originalGlobalValue = exports.ngEventEmitter;

	/**
	 * Finds the index of the listener for the event in it's storage array.
	 *
	 * @param {Function[]} listeners Array of listeners to search through.
	 * @param {Function} listener Method to look for.
	 * @return {Number} Index of the specified listener, -1 if not found
	 * @api private
	 */
	function indexOfListener(listeners, listener) {
		var i = listeners.length;
		while (i--) {
			if (listeners[i].listener === listener) {
				return i;
			}
		}

		return -1;
	}

	/**
	 * Alias a method while keeping the context correct, to allow for overwriting of target method.
	 *
	 * @param {String} name The name of the target method.
	 * @return {Function} The aliased method
	 * @api private
	 */
	function alias(name) {
		return function aliasClosure() {
			return this[name].apply(this, arguments);
		};
	}

	/**
	 * Returns the listener array for the specified event.
	 * Will initialise the event object and listener arrays if required.
	 * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
	 * Each property in the object response is an array of listener functions.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Function[]|Object} All listener functions for the event.
	 */
	proto.getListeners = function getListeners(evt) {
		var events = this._getEvents();
		var response;
		var key;

		// Return a concatenated array of all matching events if
		// the selector is a regular expression.
		if (typeof evt === 'object') {
			response = {};
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					response[key] = events[key];
				}
			}
		}
		else {
			response = events[evt] || (events[evt] = []);
		}

		return response;
	};

	/**
	 * Takes a list of listener objects and flattens it into a list of listener functions.
	 *
	 * @param {Object[]} listeners Raw listener objects.
	 * @return {Function[]} Just the listener functions.
	 */
	proto.flattenListeners = function flattenListeners(listeners) {
		var flatListeners = [];
		var i;

		for (i = 0; i < listeners.length; i += 1) {
			flatListeners.push(listeners[i].listener);
		}

		return flatListeners;
	};

	/**
	 * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
	 *
	 * @param {String|RegExp} evt Name of the event to return the listeners from.
	 * @return {Object} All listener functions for an event in an object.
	 */
	proto.getListenersAsObject = function getListenersAsObject(evt) {
		var listeners = this.getListeners(evt);
		var response;

		if (listeners instanceof Array) {
			response = {};
			response[evt] = listeners;
		}

		return response || listeners;
	};

	/**
	 * Adds a listener function to the specified event.
	 * The listener will not be added if it is a duplicate.
	 * If the listener returns true then it will be removed after it is called.
	 * If you pass a regular expression as the event name then the listener will be added to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.addListener = function addListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var listenerIsWrapped = typeof listener === 'object';
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
				listeners[key].push(listenerIsWrapped ? listener : {
					listener: listener,
					once: false
				});
			}
		}

		return this;
	};

	/**
	 * Alias of addListener
	 */
	proto.on = alias('addListener');

	/**
	 * Semi-alias of addListener. It will add a listener that will be
	 * automatically removed after it's first execution.
	 *
	 * @param {String|RegExp} evt Name of the event to attach the listener to.
	 * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.addOnceListener = function addOnceListener(evt, listener) {
		return this.addListener(evt, {
			listener: listener,
			once: true
		});
	};

	/**
	 * Alias of addOnceListener.
	 */
	proto.once = alias('addOnceListener');

	/**
	 * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
	 * You need to tell it what event names should be matched by a regex.
	 *
	 * @param {String} evt Name of the event to create.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.defineEvent = function defineEvent(evt) {
		this.getListeners(evt);
		return this;
	};

	/**
	 * Uses defineEvent to define multiple events.
	 *
	 * @param {String[]} evts An array of event names to define.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.defineEvents = function defineEvents(evts) {
		for (var i = 0; i < evts.length; i += 1) {
			this.defineEvent(evts[i]);
		}
		return this;
	};

	/**
	 * Removes a listener function from the specified event.
	 * When passed a regular expression as the event name, it will remove the listener from all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to remove the listener from.
	 * @param {Function} listener Method to remove from the event.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.removeListener = function removeListener(evt, listener) {
		var listeners = this.getListenersAsObject(evt);
		var index;
		var key;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				index = indexOfListener(listeners[key], listener);

				if (index !== -1) {
					listeners[key].splice(index, 1);
				}
			}
		}

		return this;
	};

	/**
	 * Alias of removeListener
	 */
	proto.off = alias('removeListener');

	/**
	 * Adds listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
	 * You can also pass it a regular expression to add the array of listeners to all events that match it.
	 * Yeah, this function does quite a bit. That's probably a bad thing.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.addListeners = function addListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(false, evt, listeners);
	};

	/**
	 * Removes listeners in bulk using the manipulateListeners method.
	 * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be removed.
	 * You can also pass it a regular expression to remove the listeners from all events that match it.
	 *
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to remove.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.removeListeners = function removeListeners(evt, listeners) {
		// Pass through to manipulateListeners
		return this.manipulateListeners(true, evt, listeners);
	};

	/**
	 * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
	 * The first argument will determine if the listeners are removed (true) or added (false).
	 * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
	 * You can also pass it an event name and an array of listeners to be added/removed.
	 * You can also pass it a regular expression to manipulate the listeners of all events that match it.
	 *
	 * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
	 * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
	 * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
		var i;
		var value;
		var single = remove ? this.removeListener : this.addListener;
		var multiple = remove ? this.removeListeners : this.addListeners;

		// If evt is an object then pass each of it's properties to this method
		if (typeof evt === 'object' && !(evt instanceof RegExp)) {
			for (i in evt) {
				if (evt.hasOwnProperty(i) && (value = evt[i])) {
					// Pass the single listener straight through to the singular method
					if (typeof value === 'function') {
						single.call(this, i, value);
					}
					else {
						// Otherwise pass back to the multiple function
						multiple.call(this, i, value);
					}
				}
			}
		}
		else {
			// So evt must be a string
			// And listeners must be an array of listeners
			// Loop over it and pass each one to the multiple method
			i = listeners.length;
			while (i--) {
				single.call(this, evt, listeners[i]);
			}
		}

		return this;
	};

	/**
	 * Removes all listeners from a specified event.
	 * If you do not specify an event then all listeners will be removed.
	 * That means every event will be emptied.
	 * You can also pass a regex to remove all events that match it.
	 *
	 * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.removeEvent = function removeEvent(evt) {
		var type = typeof evt;
		var events = this._getEvents();
		var key;

		// Remove different things depending on the state of evt
		if (type === 'string') {
			// Remove all listeners for the specified event
			delete events[evt];
		}
		else if (type === 'object') {
			// Remove all events matching the regex.
			for (key in events) {
				if (events.hasOwnProperty(key) && evt.test(key)) {
					delete events[key];
				}
			}
		}
		else {
			// Remove all listeners in all events
			delete this._events;
		}

		return this;
	};

	/**
	 * Alias of removeEvent.
	 *
	 * Added to mirror the node API.
	 */
	proto.removeAllListeners = alias('removeEvent');

	/**
	 * Emits an event of your choice.
	 * When emitted, every listener attached to that event will be executed.
	 * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
	 * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
	 * So they will not arrive within the array on the other side, they will be separate.
	 * You can also pass a regular expression to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {Array} [args] Optional array of arguments to be passed to each listener.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.emitEvent = function emitEvent(evt, args) {
		var listeners = this.getListenersAsObject(evt);
		var listener;
		var i;
		var key;
		var response;

		for (key in listeners) {
			if (listeners.hasOwnProperty(key)) {
				i = listeners[key].length;

				while (i--) {
					// If the listener returns true then it shall be removed from the event
					// The function is executed either with a basic call or an apply if there is an args array
					listener = listeners[key][i];

					if (listener.once === true) {
						this.removeListener(evt, listener.listener);
					}

					response = listener.listener.apply(this, args || []);

					if (response === this._getOnceReturnValue()) {
						this.removeListener(evt, listener.listener);
					}
				}
			}
		}

		return this;
	};

	/**
	 * Alias of emitEvent
	 */
	proto.trigger = alias('emitEvent');

	/**
	 * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
	 * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
	 *
	 * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
	 * @param {...*} Optional additional arguments to be passed to each listener.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.emit = function emit(evt) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.emitEvent(evt, args);
	};

	/**
	 * Sets the current value to check against when executing listeners. If a
	 * listeners return value matches the one set here then it will be removed
	 * after execution. This value defaults to true.
	 *
	 * @param {*} value The new value to check for when executing listeners.
	 * @return {Object} Current instance of ngEventEmitter for chaining.
	 */
	proto.setOnceReturnValue = function setOnceReturnValue(value) {
		this._onceReturnValue = value;
		return this;
	};

	/**
	 * Fetches the current value to check against when executing listeners. If
	 * the listeners return value matches this one then it should be removed
	 * automatically. It will return true by default.
	 *
	 * @return {*|Boolean} The current value to check for or the default, true.
	 * @api private
	 */
	proto._getOnceReturnValue = function _getOnceReturnValue() {
		if (this.hasOwnProperty('_onceReturnValue')) {
			return this._onceReturnValue;
		}
		else {
			return true;
		}
	};

	/**
	 * Fetches the events object and creates one if required.
	 *
	 * @return {Object} The events storage object.
	 * @api private
	 */
	proto._getEvents = function _getEvents() {
		return this._events || (this._events = {});
	};

	/**
	 * Reverts the global {@link ngEventEmitter} to its previous value and returns a reference to this version.
	 *
	 * @return {Function} Non conflicting ngEventEmitter class.
	 */
	ngEventEmitter.noConflict = function noConflict() {
		exports.ngEventEmitter = originalGlobalValue;
		return ngEventEmitter;
	};

	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define('ngEventEmitter/ngEventEmitter',[],function () {
			return ngEventEmitter;
		});
	}
	else if (typeof module === 'object' && module.exports){
		module.exports = ngEventEmitter;
	}
	else {
		this.ngEventEmitter = ngEventEmitter;
	}
}.call(this));

/*!
 * eventie v1.0.4
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else {
  // browser global
  window.eventie = eventie;
}

})( this );

/*!
 * imagesLoaded v3.1.5
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( [
      'ngEventEmitter/ngEventEmitter',
      'eventie/eventie'
    ], function( ngEventEmitter, eventie ) {
      return factory( window, ngEventEmitter, eventie );
    });
  } else if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ngEventEmitter'),
      require('eventie')
    );
  } else {
    // browser global
    window.ngimagesLoaded = factory(
      window,
      window.ngEventEmitter,
      window.eventie
    );
  }

})( this,

// --------------------------  factory -------------------------- //

function factory( window, ngEventEmitter, eventie ) {



var $ = window.jQuery;
var console = window.console;
var hasConsole = typeof console !== 'undefined';

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

  // -------------------------- imagesLoaded -------------------------- //

  /**
   * @param {Array, Element, NodeList, String} elem
   * @param {Object or Function} options - if function, use as callback
   * @param {Function} onAlways - callback function
   */
  function ngImagesLoaded( elem, options, onAlways ) {
    // coerce ngImagesLoaded() without new, to be new ngImagesLoaded()
    if ( !( this instanceof ngImagesLoaded ) ) {
      return new ngImagesLoaded( elem, options );
    }
    // use elem as selector string
    if ( typeof elem === 'string' ) {
      elem = document.querySelectorAll( elem );
    }

    this.elements = makeArray( elem );
    this.options = extend( {}, this.options );

    if ( typeof options === 'function' ) {
      onAlways = options;
    } else {
      extend( this.options, options );
    }

    if ( onAlways ) {
      this.on( 'always', onAlways );
    }

    this.getImages();

    if ( $ ) {
      // add jQuery Deferred object
      this.jqDeferred = new $.Deferred();
    }

    // HACK check async to allow time to bind listeners
    var _this = this;
    setTimeout( function() {
      _this.check();
    });
  }

  ngImagesLoaded.prototype = new ngEventEmitter();

  ngImagesLoaded.prototype.options = {};

  ngImagesLoaded.prototype.getImages = function() {
    this.images = [];

    // filter & find items if we have an item selector
    for ( var i=0, len = this.elements.length; i < len; i++ ) {
      var elem = this.elements[i];
      // filter siblings
      if ( elem.nodeName === 'IMG' ) {
        this.addImage( elem );
      }
      // find children
      // no non-element nodes, #143
      if ( !elem.nodeType || !( elem.nodeType === 1 || elem.nodeType === 9 ) ) {
        continue;
      }
      var childElems = elem.querySelectorAll('img');
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        var img = childElems[j];
        this.addImage( img );
      }
    }
  };

  /**
   * @param {Image} img
   */
  ngImagesLoaded.prototype.addImage = function( img ) {
    var loadingImage = new LoadingImage( img );
    this.images.push( loadingImage );
  };

  ngImagesLoaded.prototype.check = function() {
    var _this = this;
    var checkedCount = 0;
    var length = this.images.length;
    this.hasAnyBroken = false;
    // complete if no images
    if ( !length ) {
      this.complete();
      return;
    }

    function onConfirm( image, message ) {
      if ( _this.options.debug && hasConsole ) {
        console.log( 'confirm', image, message );
      }

      _this.progress( image );
      checkedCount++;
      if ( checkedCount === length ) {
        _this.complete();
      }
      return true; // bind once
    }

    for ( var i=0; i < length; i++ ) {
      var loadingImage = this.images[i];
      loadingImage.on( 'confirm', onConfirm );
      loadingImage.check();
    }
  };

  ngImagesLoaded.prototype.progress = function( image ) {
    this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
    // HACK - Chrome triggers event before object properties have changed. #83
    var _this = this;
    setTimeout( function() {
      _this.emit( 'progress', _this, image );
      if ( _this.jqDeferred && _this.jqDeferred.notify ) {
        _this.jqDeferred.notify( _this, image );
      }
    });
  };

  ngImagesLoaded.prototype.complete = function() {
    var eventName = this.hasAnyBroken ? 'fail' : 'done';
    this.isComplete = true;
    var _this = this;
    // HACK - another setTimeout so that confirm happens after progress
    setTimeout( function() {
      _this.emit( eventName, _this );
      _this.emit( 'always', _this );
      if ( _this.jqDeferred ) {
        var jqMethod = _this.hasAnyBroken ? 'reject' : 'resolve';
        _this.jqDeferred[ jqMethod ]( _this );
      }
    });
  };

  // -------------------------- jquery -------------------------- //

  if ( $ ) {
    $.fn.ngimagesLoaded = function( options, callback ) {
      var instance = new ngImagesLoaded( this, options, callback );
      return instance.jqDeferred.promise( $(this) );
    };
  }


  // --------------------------  -------------------------- //

  function LoadingImage( img ) {
    this.img = img;
  }

  LoadingImage.prototype = new ngEventEmitter();

  LoadingImage.prototype.check = function() {
    // first check cached any previous images that have same src
    var resource = cache[ this.img.src ] || new Resource( this.img.src );
    if ( resource.isConfirmed ) {
      this.confirm( resource.isLoaded, 'cached was confirmed' );
      return;
    }

    // If complete is true and browser supports natural sizes,
    // try to check for image status manually.
    if ( this.img.complete && this.img.naturalWidth !== undefined ) {
      // report based on naturalWidth
      this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
      return;
    }

    // If none of the checks above matched, simulate loading on detached element.
    var _this = this;
    resource.on( 'confirm', function( resrc, message ) {
      _this.confirm( resrc.isLoaded, message );
      return true;
    });

    resource.check();
  };

  LoadingImage.prototype.confirm = function( isLoaded, message ) {
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  // -------------------------- Resource -------------------------- //

  // Resource checks each src, only once
  // separate class from LoadingImage to prevent memory leaks. See #115

  var cache = {};

  function Resource( src ) {
    this.src = src;
    // add to cache
    cache[ src ] = this;
  }

  Resource.prototype = new ngEventEmitter();

  Resource.prototype.check = function() {
    // only trigger checking once
    if ( this.isChecked ) {
      return;
    }
    // simulate loading on detached element
    var proxyImage = new Image();
    eventie.bind( proxyImage, 'load', this );
    eventie.bind( proxyImage, 'error', this );
    proxyImage.src = this.src;
    // set flag
    this.isChecked = true;
  };

  // ----- events ----- //

  // trigger specified handler for event type
  Resource.prototype.handleEvent = function( event ) {
    var method = 'on' + event.type;
    if ( this[ method ] ) {
      this[ method ]( event );
    }
  };

  Resource.prototype.onload = function( event ) {
    this.confirm( true, 'onload' );
    this.unbindProxyEvents( event );
  };

  Resource.prototype.onerror = function( event ) {
    this.confirm( false, 'onerror' );
    this.unbindProxyEvents( event );
  };

  // ----- confirm ----- //

  Resource.prototype.confirm = function( isLoaded, message ) {
    this.isConfirmed = true;
    this.isLoaded = isLoaded;
    this.emit( 'confirm', this, message );
  };

  Resource.prototype.unbindProxyEvents = function( event ) {
    eventie.unbind( event.target, 'load', this );
    eventie.unbind( event.target, 'error', this );
  };

  // -----  ----- //

  return ngImagesLoaded;

});







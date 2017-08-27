//==========================================//
// Navigation to be used below width 767px  //
//==========================================//

//==================================================//
// jQuery event for toggling mobile nav in and out  //
//==================================================//

$('#nav-icon2').on('click', function() {
  $('.list-box').toggleClass('list-box-open');
  $(this).toggleClass('open');
  var sideHeight = $('.list-box').outerHeight();
  $('#mapDiv').height(sideHeight);
});

//=============================================//
// Close mobile nav when list item is clicked  //
//=============================================//

$('.list-item').on('click', function() {
  $('list-box').toggleClass('list-box-open');
});


//====================//
// Script for map     //
//====================//


//===================================//
// Initializing Varibales to be used //
//===================================//

var map;
var marker;
var markers = [];


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 15.2993, lng: 74.1240},
    zoom: 10,
      
    //==============================================================//
    // Styles by Michelle Reijngoud                                 //
    // https://snazzymaps.com/style/81435/paris-inspiration-tour    //
    //==============================================================//
      
    styles : [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-70},{"lightness":-5}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#70bfe0"},{"visibility":"on"}]}]
  });

  //=========================================//
  // Initialize info windows and map bounds  //
  //=========================================//
    
  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 200
  });
  var bounds = new google.maps.LatLngBounds();

  //==========================================================//
  // Open info window when marker is clicked 'this' = marker  // 
  //==========================================================//
      
   var markerAnimation = function() {
      toggleBounce(this);
      map.panTo(marker.getPosition());
      populateInfoWindow(this, infoWindow);
    };

    function toggleBounce(marker) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        marker.setAnimation(null);
      }, 1500);
    }

  //===================================================//  
  // Populate infowindow with marker title             // 
  // & wikipedia API info when the marker is clicked   //
  //===================================================//
    
  function populateInfoWindow(marker, infowindow) {

      var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&imlimit=5&format=json&callback=wikiCallback';
      
      //=================================================//
      // Wikipedia AJAX Request to add Wikipedia entry   //
      // on selected places to infoWindow                //
      //=================================================//
        
      $.ajax({
        url: wikiUrl,
        dataType: 'jsonp'
      }).done(function(data) {
        console.log(data);

        var dataUrl = data[3][0];
        var dataDescr = data[2][0];

        //====================================================================//
        // Error handling for if no articles are returned from Wikipedia API  //
        //====================================================================//
        
        if (dataUrl === undefined) {
          infowindow.setContent('<div>' + '<h2>' + marker.title + '</h2>' + '<p>' + 'Sorry wikipedia entry not found.' + '</p>' + '</div>');
          infowindow.open(map, marker);

        } else {

          infowindow.marker = marker;
          infowindow.setContent('<div>' + '<h2>' + marker.title + '</h2>' + '<p>' + dataDescr + '<a href="' + dataUrl + '" target="blank">' + '..' + ' Read More' + '</a>' + '</p>' + '</div>');
          infowindow.open(map, marker);
        }

        //================================================//
        // Error handling for if Wikipedia API call fails //
        //================================================//
          
      }).fail(function() {
        infowindow.setContent('<div>' + '<h2>' + marker.title + '</h2>' + '<p>' + 'Sorry wikipedia entry not found.' + '</p>' + '</div>');
        infowindow.open(map, marker);

      });

      //================================================//
      // Google Maps event listeners:                   //
      // Close info window when user clicks on the      //
      // x in the infoWindow or anywhere on the map,    //
      //================================================//
        
      google.maps.event.addListener(map, 'click', function() {
        infowindow.close();
        infowindow.setMarker = null;
      });
      google.maps.event.addListener(infowindow, 'closeclick', function() {
        infowindow.close();
        infowindow.setMarker = null;
      });
    }
    
  //====================================================//
  // Add markers from locations listed in datamodel.js  //
  //====================================================//

  for (i = 0, len = locations.length; i < len; i++) {
    var position = locations[i].location;
    var title = locations[i].title;

    marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
    });
    bounds.extend(marker.position);
    VM.locationList()[i].marker = marker;

    marker.addListener('click', markerAnimation);
    map.fitBounds(bounds);
  }

  //==============================//    
  // Apply Knockout.js bindings   //
  //==============================//
  ko.applyBindings(VM);
}

//=====================================//
// Error handling for google maps api  //
//=====================================//

function mapErrorHandling() {
  var errorMsg = 'Sorry, not working. Please refresh and try again!';

  var mapDiv = document.getElementById('map');
  var errorDiv = document.createElement('h1');
  errorDiv.innerHTML = errorMsg;
  mapDiv.appendChild(errorDiv);
}
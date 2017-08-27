//===================================//
//      View Model for the app       //
//===================================//

var ViewModel = function() {
  var self = this;

  //===================================================//
  // Location constructor to be used to set locations  //
  // to the list view as well as for markers           //
  //===================================================//
    
  var Location = function(data) {
    this.title = data.title;
    this.marker = data.marker;
    this.visible = ko.observable(true);
  };

  self.locationList = ko.observableArray([]);


  //===================================================//
  // Push all locations to an array - locationList     //
  //===================================================//
  
  locations.forEach(function(locationItem) {
    self.locationList.push(new Location(locationItem));
  });


  //=================================================//
  // Filter list items corresponding markers         //
  // according to input                              //
  //=================================================//
  
  this.searchTerm = ko.observable("");
  self.filteredList = ko.computed(function() {
		var filter = self.searchTerm().toLowerCase();
      
		if (!filter) {
			self.locationList().forEach(function(locationItem){
				if (locationItem.marker) {
                    locationItem.visible(true);
                    locationItem.marker.setVisible(true);
                }
			});
			return self.locationList();
		} else {
			return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
				var string = locationItem.title.toLowerCase();
				var result = (string.search(filter) >= 0);
				locationItem.visible(result);
                locationItem.marker.setVisible(result);
				return result;
			});
		}
	}, self);

  //================================================//
  //  Initiate google event to open infoWindow      //
  //  when list item is clicked                     //
  //================================================//
    
  self.openWindow = function(place) {
    google.maps.event.trigger(place.marker, 'click');
  };

}; // View Model Finish

//==========================================//
// Store ViewModel in vm variable           //
// for instantiation in app.js              //
//==========================================//

var VM = new ViewModel();

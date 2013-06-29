var socket = io.connect();

function MapUtil() {
  this.loadMap();
  this.loadControls();

};

MapUtil.prototype.loadMap = function() {
  var options={
    elt:document.getElementById('map'),       /*ID of element on the page where you want the map added*/ 
    zoom:1,                                  /*initial zoom level of the map*/ 
    latLng:{lat:40.735383, lng:-73.984655},   /*center of map in latitude/longitude */ 
    mtype:'osm',                              /*map type (osm)*/ 
    bestFitMargin:0,                          /*margin offset from the map viewport when applying a bestfit on shapes*/ 
    zoomOnDoubleClick:true                    /*zoom in when double-clicking on map*/ 
  };

  /*Construct an instance of MQA.TileMap with the options object*/

  //interesting. this makes the map var global 
  window.map = new MQA.TileMap(options);
};

MapUtil.prototype.loadControls = function() {
  MQA.withModule('largezoom','viewoptions','geolocationcontrol','insetmapcontrol','mousewheel', function() {
  
    map.addControl(
      new MQA.LargeZoom(),
      new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5))
    );

    map.addControl(new MQA.ViewOptions());

    map.addControl(
      new MQA.GeolocationControl(),
      new MQA.MapCornerPlacement(MQA.MapCorner.TOP_RIGHT, new MQA.Size(10,50))
    );

    map.enableMouseWheelZoom();
  });
};

MapUtil.prototype.getLocation = function(callback) {
  var location = null;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      location = position;
      callback(position);
    });
  }
  else {
    location = {"coords": 
                  {latitude: 0,
                  longitude: 0}
                }
  }
}



MapUtil.prototype.addMarker = function(position, id) {
  var poi=new MQA.Poi({lat:position.coords.latitude, lng:position.coords.longitude});
  poi.setKey(id);
  //http://developer.mapquest.com/web/documentation/sdk/javascript/v6.0.0/api/MQA.Poi.html
  //check here. can fire event that pop the info window.
  // poi.setInfoTitleHTML('Sports Authority Field at Mile High');
  // poi.setInfoContentHTML('Home of the Denver Broncos');
  map.addShape(poi);
}
MapUtil.prototype.addMarkers = function(list) {
  for(var key in list) {
    if(map.getByKey(key) == null) {
      console.log("created");
      this.addMarker(list[key].loc, key);
    }
  }
}

MapUtil.prototype.removeMarker = function(id) {
  map.removeShape(map.getByKey(id));
}

MapUtil.prototype.loadMarkers = function(list) {
  for(var i = 0; i < list.length; i++) {
    this.addMarker(list[i].loc, list[i].id);
  }
}
//helper functions
function sendMsg() {
  socket.emit('message', {
    message: $('#msgBox').val()
  })
}

function clearBox() {
  $('#msgBox').val('');
}




$(function() {
  var mu = new MapUtil();
  

  socket.on('message', function(data) {
    //toggle marker for 5sec
    var poi = map.getByKey(data.user);

    poi.setInfoTitleHTML(data.message);
    if(typeof poi._isRollover == 'undefined' || poi._isRollover == 0) {

      poi.toggleInfoWindowRollover();
    }

    setTimeout(function() {
      poi.toggleInfoWindowRollover();
    }, 1000);

  });

  socket.on('joinEvent', function(data) {
    //user joined
    mu.addMarker(data.loc, data.id);
  });

  socket.on('init', function(data) {
    mu.addMarkers(data);
  })

  socket.on('disconnect', function(data) {
    mu.removeMarker(data.id);
  });

  mu.getLocation(function(position) {
    socket.emit('joinEvent', {
      loc: position
    });
  });

  $('#msgBox').keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      sendMsg();
      clearBox();
    }
  });
})
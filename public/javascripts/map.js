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


MapUtil.prototype.addMarker = function(position, user) {
  var poi=new MQA.Poi({lat:position.coords.latitude, lng:position.coords.longitude});
  poi.setKey(user.id);
  //http://developer.mapquest.com/web/documentation/sdk/javascript/v6.0.0/api/MQA.Poi.html
  //check here. can fire event that pop the info window.
  poi.setInfoTitleHTML('Sports Authority Field at Mile High');
  poi.setInfoContentHTML('Home of the Denver Broncos');
  map.addShape(poi);
}

MapUtil.prototype.pinMarker = function(user) {
  var thisMap = this;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      //callback from current position
      thisMap.addMarker(position, user);
    });
  }
  else {
    alert("Geolocation is not supported by this browser.");
    thisMap.addMarker({"coords": 
                        {latitude: 0,
                        longitude: 0}
                      }, user);
  }
}

MapUtil.prototype.removeMarker = function() {
  map.removeShape(map.getByKey("abc"));
}

//helper functions
function sendMsg() {
  socket.emit('message', {
    user: $('#uId').val(),
    message: $('#msgBox').val()
  })
}

function clearBox() {
  $('#msgBox').val('');
}

function async(poi, callback) {
  
}



$(function() {
  var mu = new MapUtil();
  

  socket.on('message', function(data) {
    //toggle marker for 5sec
    var poi = map.getByKey(data.user);

    poi.setInfoTitleHTML(data.message);
    console.log(poi._isRollover);
    if(typeof poi._isRollover == 'undefined' || poi._isRollover == 0) {

      poi.toggleInfoWindowRollover();
    }

    setTimeout(function() {
      poi.toggleInfoWindowRollover();
    }, 1000);

  });

  socket.on('joinEvent', function(user) {
    console.log(user);
    //user joined
    mu.pinMarker(user);
  });

  // socket.on('disconnect', function(user) {
  //   mu.removeMarker(user);
  // });

  socket.emit('joinEvent', {
    uId: $('#uId').val()
  });


  $('#msgBox').keypress(function(e) {
    if(e.which == 13) {
      e.preventDefault();
      sendMsg();
      clearBox();
    }
  });
})
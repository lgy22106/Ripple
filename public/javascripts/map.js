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

MapUtil.prototype.getGeo = function() {
  if (navigator.geolocation) {
    console.log(navigator.geolocation.getCurrentPosition);
    this.addMarker(navigator.geolocation.getCurrentPosition);
  }
  else {
    alert("no position");
  }
}

MapUtil.prototype.addMarker = function(position) {
  var poi=new MQA.Poi({lat:postion.coords.latitude, lng:postion.coords.longitude});
  //http://developer.mapquest.com/web/documentation/sdk/javascript/v6.0.0/api/MQA.Poi.html
  //check here. can fire event that pop the info window.
  poi.setInfoTitleHTML('Sports Authority Field at Mile High');
  poi.setInfoContentHTML('Home of the Denver Broncos');
  map.addShape(poi);
}



$(function() {
  var mu = new MapUtil();
  mu.getGeo();
})
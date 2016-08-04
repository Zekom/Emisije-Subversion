// Vir : https://developers.google.com/maps/documentation/javascript/shapes
// This example creates an interactive map which constructs a
// polyline based on user clicks. Note that the polyline only appears
// once its path property contains two LatLng coordinates.
//var editMode="<?php echo isset($_GET["mode"])?$_GET["mode"]:""?>";

var editMode="transit";
var markers=[];
var StationMarkers=[];
var stationMarkerObjects=[];
var TransitPathAll=[];
var TransitPathCoordinates=[];
var TrainStationCount=0;
var TransitPathCoordinates=[];
var TransitFixedPoint=49;
var TransitTicketNumber=0;
//var railPolyLines=[];
//railPolyLines[0]=[[45.8985,15.655],[45.923,15.59],[45.987,15.4701]];
var map=null;

StationInfoWindowA = new google.maps.InfoWindow({
  content: "StationsInfoText[markerID]"
});

StationInfoWindowB = new google.maps.InfoWindow({
  content: "StationsInfoText[markerID]"
});

var polyOptions = {};

var TransitStationIcon = {
path: 'M 0,0 -10,-3 -6,-10 0,-10 6,-10 10,-3 z',
fillColor: 'blue',
fillOpacity: 0.8,
scale: 1,
strokeColor: 'red',
strokeWeight: 1
};

if (editMode=="rails")
{
var TransitStationIcon = {
path: 'M 0,0 -5,-3 -3,-5 0,-5 3,-5 5,-3 z',
fillColor: 'blue',
fillOpacity: 0.6,
scale: 1,
strokeColor: 'red',
strokeWeight: 1
};
}

if (editMode=="transit")
{
var TransitStationIcon = {
path: 'M 0,0 -5,-3 -3,-5 0,-5 3,-5 5,-3 z',
fillColor: 'blue',
fillOpacity: 0.3,
scale: 1,
strokeColor: 'red',
strokeWeight: 1
};
}

var TransitStationAIcon = {
path: 'M 0,0 -30,-20 0,-10 31,-20 z',
fillColor: 'green',
fillOpacity: 0.8,
scale: 1,
strokeColor: 'red',
strokeWeight: 1
};

var TransitStationBIcon = {
path: 'M 0,0 -30,20 0,10 31,20 z',
fillColor: 'red',
fillOpacity: 0.8,
scale: 1,
strokeColor: 'green',
strokeWeight: 1
};

var TransitStationSelected=0;
var TransitStationMarkerASelectedID=1;
var TransitStationMarkerBSelectedID=1;

var TransitStationMarkerA= new google.maps.Marker({
position: new google.maps.LatLng(46.886277,13.902437),
title: '#StationA' ,
map: map
});

var TransitStationMarkerB= new google.maps.Marker({
position: new google.maps.LatLng(46.05809,13.617254),
title: '#StationB' ,
map: map
});

var poly;// = new google.maps.Polyline(polyOptions);

function FindMarkerByStationID(StationID)
{
//alert("FindMarkerByStationID");
var tempSizeStationsData=StationsData.length;
//alert(tempSizeStationsData);
var MarkerID=-1;
for(var i=0; i<tempSizeStationsData; i++)
{
          // alert(i+":"+StationID+"StationsData:"+StationsData[i][0]);
    if (StationsData[i][0] == StationID)
    {
        //alert(i+"StationsData: "+StationsData[i][0]);
        MarkerID=i;
        break;
    }
}

//alert ("FindMarkerByStationID result:"+MarkerID);
return MarkerID;
}

function InitRailPolyLines()
{
//vir:https://developers.google.com/maps/documentation/javascript/shapes

var StationA=-1;
var StationB=-1;

var i=-1;
//alert("InitRailPolyLines");
//var railPathCoordinates=[]; <--- global variable
TrainStationCount=BusPolyLines[0].length;
var busPolyLinesIndex = TrainStationCount;


for ( TransitPolyLines of busPolyLines )
{
  busPolyLinesIndex++;
  for (TransitPath of TransitPolyLines)
  {
   i++;
   TransitPathCoordinates=[];

   for ( TransitPathCoord of TransitPath)
   {
       //alert(TransitPathCoord);
       TransitPathCoordinates[TransitPathCoordinates.length]=new google.maps.LatLng(TransitPathCoord[0], TransitPathCoord[1]);
       //alert(TransitPathCoord.length);
       if (TransitPathCoord.length===4) // Pri prvem zapisu je v 3. in 4. stolpcu še zaporedna št. postaje
       {
           StationA=FindMarkerByStationID(TransitPathCoord[2]);
           StationB=FindMarkerByStationID(TransitPathCoord[3]);
           //alert(StationA+":"+StationB);
       }
   }

//alert("Add new polyline:"+"i:"+ i +":" + StationA +" : "+StationB);

TransitPathAll.push( new google.maps.Polyline({
      path: TransitPathCoordinates,
      geodesic: true,
      strokeColor: TransitPolyLinesColor[busPolyLinesIndex],
      strokeOpacity: 0.7,
      strokeWeight: 6
  }));

//alert("Add Listener: "+railPathAll[railPathAll.length-1]+":"+i+":"+StationA+":"+StationB);

google.maps.event.addListener(TransitPathAll[TransitPathAll.length-1],

        'click', function (i,StationMarkerIDA,StationMarkerIDB)
           {
               return function ()
               {
                   //alert(i+" : OnClick, RailAB -  StationA:"+StationMarkerIDA+" StationB:"+StationMarkerIDB);
                   //alert("AddListener:Marker:"+i);
                   SelectStationMarker(StationMarkerIDA);
                   SelectStationMarker(StationMarkerIDB);
                   //StationMarkersNotifyPHP();

               };

           }(i-TrainStationCount,StationA,StationB)
        );

        TransitPathAll[TransitPathAll.length-1].setMap(map);
      }

    }

}

function initialize() {
// Vir : https://developers.google.com/maps/documentation/javascript/markers
var mapOptions = {
zoom: 9,
// Center the map on Kamnik, Slovenija.
center: new google.maps.LatLng(46.0587, 14.5127)
};

  map = new google.maps.Map(document.getElementById('div-map-canvas'), mapOptions);

ResetMarkers();
AddStationMarkers();
InitTransitPath();
if ($("input#checkbox-gama:checkbox:checked").val()=="Gama"){LoadGamaInfo();}

// Add a listener for the click event
google.maps.event.addListener(map, 'click', addLatLng);
google.maps.event.addListener(TransitStationMarkerA, "mouseover", DisplayStationInfo(1,StationInfoWindowA));
google.maps.event.addListener(TransitStationMarkerB, "mouseover", DisplayStationInfo(2,StationInfoWindowB));

}

/**
* Handles click events on a map, and adds a new point to the Polyline.
* @param {google.maps.MouseEvent} event
*/

function ResetPolyLine()
{
var path=[];
for( var i=0; i<markers.length; i++ )
{
 path.push(new google.maps.LatLng(markers[i]["position"].lat(),markers[i]["position"].lng()));
 //alert(path[i]+"::"+i+":"+markers[i]["position"].lat()+"/"+markers[i]["position"].lng());
}
//alert(path.length);

polyOptions =
{
path: path,
strokeColor: '#000000',
strokeOpacity: 1.0,
strokeWeight: 3
};
if (typeof poly != 'undefined'){ poly.setMap(null); }
poly = new google.maps.Polyline(polyOptions);
poly.setMap(map);

}

function addSQLStationRail()
{
StationAID=StationsData[TransitStationMarkerASelectedID][0];
StationBID=StationsData[TransitStationMarkerBSelectedID][0];

if (StationAID>=StationBID) // ID-ji postaj naj bodo urejeni naraščajoče od manjšega ID, proti večjemu, če je StationAID > StationBID, postaji zamenjamo
{
   StationTMP=StationBID;
   StationBID=StationAID;
   StationAID=StationTMP;
}

document.getElementById("div-path-data").innerHTML=
       "Transit-Path-Data :<br/>" +
       "-->"+StationAID+"-"+StationBID+"' <---,---> '"+StationAID+"', '"+StationBID+"'<--";

}

function addLatLng(event) {

var path = poly.getPath();

// Because path is an MVCArray, we can simply append a new coordinate
// and it will automatically appear.
//
//path.push(event.latLng);

// Add a new marker at the new plotted point on the polyline.
var marker = new google.maps.Marker   ({
position: event.latLng,
title: '#' + path.getLength(),
map: map
});

markers.push(marker);
ResetPolyLine();
//INSERT INTO `test`.`Train-Rails-Location`
//(`IDRailAB`, `IDStationA`, `IDStationB`, `Type`)
//VALUES ('99999-111111', '99999', '111111', '0');

//INSERT INTO `test`.`Train-Rails-Details`
// (`IDRailABLatLng`, `IDRailAB`, `RailIndex`, `Lat`, `Lng`)
// VALUES ('99999', '11111', '1', '123123', '2312312');

addSQLStationRail();

for (var i=0;i<markers.length;i++)
{

"INSERT INTO `test`.`Transit-Rails-Details`"
"(`IDRailABLatLng`, `IDRailAB`, `RailIndex`, `Lat`, `Lng`) "
"VALUES ('99999', '11111', '1', '123123', '2312312');"

  document.getElementById("div-path-data").innerHTML=
  document.getElementById("div-path-data").innerHTML+
  "<br/>"+"#"+i+":"+markers[i]["position"].toString()+"/"+markers[i]["title"].toString();
}

ResetPolyLine();
}

function ResetMarkers()
{

  for (var i=0;i<markers.length;i++)
  {
    markers[i].setMap(null);
  }
  markers=[];

  ResetPolyLine();
}

function ResetStations()
{
   for (var TransitPathSingle of TransitPath)
   {
     TransitPathSingle.setMap(null);
   }
   TransitPath=[];
   TransitPathCoordinates=[];

   for (var StationMarkersSingle of StationMarkers)
   {
     StationMarkersSingle.setMap(null);
   }

   StationMarkers=[];

   //$('#div-path-data').html($("input#checkbox-train:checkbox:checked").val()+'<------------');
   //$('#div-path-data').append($("input#checkbox-bus:checkbox:checked").val()+'<<---');
   //$('#div-path-data').append($("input#checkbox-gama:checkbox:checked").val()+'<<---');

   initialize();



}

function DeleteLastMarker()
{
// TODO : add check if zero markers
markers[markers.length-1].setMap(null);
markers=markers.slice(0,markers.length-1);
ResetPolyLine();

}

// Source : https://developers.google.com/maps/documentation/javascript/examples/event-domListener
google.maps.event.addDomListener(window, 'load', initialize);

function DisplayStationInfo(markerID, StationInfoWindow )
{
//alert("DisplayStationInfo");
StationInfoWindow.close();

StationInfoWindow = new google.maps.InfoWindow({
  content: StationsInfoText[markerID]
});

//StationInfoWindow.open(map, stationMarkers [markerID] );
}

function SelectStationMarker(markerID)
{
//alert("TransitStationSelected"+TransitStationSelected);

ResetMarkers();
switch (TransitStationSelected)
{
case 0 :
    RailSelectA(markerID);
    //alert("RailSelectA()"+TransitStationSelected);
    TransitStationSelected=10;
    break;

case 10 :
    RailSelectB(markerID);
    //alert("RailSelectB()"+TransitStationSelected);
    TransitStationSelected=0;
    break;
}

addSQLStationRail();
    //alert("SelectStationMarker:"+stationMarkers[markerID].getPosition().lat()+":"+stationMarkers[markerID].getPosition().lng());
}

function RailSelectA(markerID)
{
TransitStationMarkerA.setPosition(
        new google.maps.LatLng(
        StationMarkers[markerID].getPosition().lat(),
        StationMarkers[markerID].getPosition().lng())
);

TransitStationMarkerASelectedID=markerID;

//alert("RailSelectA:"+stationMarkers[markerID].getPosition().lat()+":"+stationMarkers[markerID].getPosition().lng());

//document.getElementById("div-path-data").innerHTML=TransitStationMarkerA.keys.toString();
}

function RailSelectB(markerID)
{
    TransitStationMarkerB.setPosition(
        new google.maps.LatLng(
        StationMarkers[markerID].getPosition().lat(),
        StationMarkers[markerID].getPosition().lng())
);

TransitStationMarkerBSelectedID=markerID;

//alert("RailSelectB:"+stationMarkers[markerID].getPosition().lat()+":"+stationMarkers[markerID].getPosition().lng());
//document.getElementById("div-path-data").innerHTML=trainStationMarkerB.keys.toString();
}

function ZoomStationA()
{
map.panTo(TransitStationMarkerA.getPosition());
window.setTimeout(function() {
  map.setZoom(16);
}, 500);

}

function ZoomStationB()
{
map.panTo(TransitStationMarkerA.getPosition());

window.setTimeout(function() {
  map.setZoom(9);
}, 500);

window.setTimeout(function() {
  map.panTo(TransitStationMarkerB.getPosition());
}, 1000);

window.setTimeout(function() {
<<<<<<< .mine
  map.setZoom(16);
}, 3000);
=======
  map.setZoom(16);
}, 1000);
>>>>>>> .r48

}

<<<<<<< .mine
function ZoomStationX()
=======
function ZoomStationX()
{
map.panTo(trainStationMarkerA.getPosition());

window.setTimeout(function() {
  map.setZoom(11);
}, 500);

window.setTimeout(function() {
  map.panTo(trainStationMarkerB.getPosition());
}, 1000);

window.setTimeout(function() {
  map.setZoom(9);
}, 2000);

}

function StationMarkersNotifyPHP ()
>>>>>>> .r48
{
map.panTo(TransitStationMarkerA.getPosition());

window.setTimeout(function() {
  map.setZoom(11);
}, 500);

window.setTimeout(function() {
  map.panTo(TransitStationMarkerB.getPosition());
}, 1000);

window.setTimeout(function() {
  map.setZoom(9);
}, 2000);

}

function StationMarkersNotifyPHP (markerID)
{
//alert("StationMarkersNotifyPHP");
alert("Map info request :"&markerID);

/*$.ajax({
method: "POST",
url: "./controler/MapDataUpdate.php",
data: { StationA: StationAID, StationB: StationBID }
})
.done(function( msg ) {
  alert("Map update"&markerID);
});*/


}


function AddStationMarkers()
{
//alert("AddStationMarkers");
var markerObject;
var marker;
var markerEvent;
var i=0;

for (i=0; i<Stations.length; i++)
{
    marker = new google.maps.Marker({
            position: Stations[i],
            title: StationsData[i][0].toString() + '#' + StationsData[i][1].toString(),
            map: map,
            icon:TransitStationIcon
        })
    StationMarkers.push(marker);

     //markerEvent=
    markerObject =
    {
        stationID:i
    }
    stationMarkerObjects.push( markerObject );

    google.maps.event.addListener(StationMarkers[i],
           'click', function(i)
           {
               return function()
               {
                   //alert("AddListener:Marker:"+i);
                   SelectStationMarker(i);
                   onClickInfo();
                   //StationMarkersNotifyPHP(i);
               }

           }(i)
        );
}

TransitStationMarkerA= new google.maps.Marker({
position: new google.maps.LatLng(46.00,13.00),
title: '#StationA' ,
icon:TransitStationAIcon,
map: map
});


TransitStationMarkerB= new google.maps.Marker({
position: new google.maps.LatLng(47.00,13.00),
title: '#StationB' ,
icon:TransitStationBIcon,
map: map
});

}

function SaveRail()
{

}

function UndoRail()
{

}

function RefreshStation()
{

}

function ExecuteSQL()
{
SQLString="";
//document.getElementById("div-path-data").innerHTML;
//document.getElementById("div-path-data").innerHTML=
var GoogLatLng = new google.maps.LatLng(44,77);
for (var i=0; i<Stations.length ; i++)
{
 GoogLatLng = Stations[i];

SQLString=SQLString+
"\n INSERT INTO `emisije`.`TransitStations` " +
"(`IDStation`, `Name`, `Lat`, `Lng`) " +
" VALUES ('"+StationsData[i][0]+"','"+StationsData[i][1]+"', '"+GoogLatLng.lat() +"', '"+GoogLatLng.lng()+"'); \n" ;
}
document.getElementById("div-path-data").innerHTML=SQLString;
}

// https://developers.google.com/maps/documentation/javascript/examples/overlay-symbol-animate


// This example adds an animated symbol to a polyline.

var TransitPath=[];

function InitTransitPathData()
{
TransitPathCoordinates=[];
var TransitPathIndex=-1;
var i=-1;
for (TransitPolyLines of BusPolyLines)
{
TransitPathIndex++;

for (var TransitPathSingle of TransitPolyLines )
{
   if(TransitPathIndex>0)
   {
     if(!($("input#checkbox-bus:checkbox:checked").val()=="Bus"))
     {
       break;
     }
   }
   var TransitPathCoordinatesSingle=[];
   for ( TransitPathCoord of TransitPathSingle )
   {
     if(TransitPathIndex==0)
     {
       if(!($("input#checkbox-train:checkbox:checked").val()=="Train")){break;}
     }
       TransitPathCoordinatesSingle.push(
               new google.maps.LatLng(TransitPathCoord[0], TransitPathCoord[1]));
       //alert(TransitPathCoord.length);
       /*if (TransitPathCoord.length===4) // Pri prvem zapisu je v 3. in 4. stolpcu še zaporedna št. postaje
       {
           StationA=FindMarkerByStationID(TransitPathCoord[2]);
           StationB=FindMarkerByStationID(TransitPathCoord[3]);
           //alert(StationA+":"+StationB);
       }*/
   }
   TransitPathCoordinates.push(TransitPathCoordinatesSingle);
//alert("Add new polyline:"+"i:"+ i +":" + StationA +" : "+StationB);
var TransitSymbol = {
path: google.maps.SymbolPath.CIRCLE,
scale: 8,
strokeColor: TransitPolyLinesColor[TransitPathIndex]
};

TransitPath.push(
        new google.maps.Polyline({
path: TransitPathCoordinatesSingle,
icons: [{
  icon: TransitSymbol,
  offset: '100%'
}],
strokeWeight: 0,
map: map

}));

}
}
}

function InitTransitPath()
{
// var TransitPathCoordinates=[];
InitTransitPathData();

/*TrainPathCoordinates[0]= [
new google.maps.LatLng(16.11, 15.191),
new google.maps.LatLng(50, 16)
];*/

// Define the symbol, using one of the predefined paths ('CIRCLE')
// supplied by the Google Maps JavaScript API.
var TransitSymbol = {
path: google.maps.SymbolPath.CIRCLE,
scale: 8,
strokeColor: '#393'
};

// Create the polyline and add the symbol to it via the 'icons' property.
TransitPath[0] = new google.maps.Polyline({
path: TransitPathCoordinates[0],
icons: [{
  icon: TransitSymbol,
  offset: '100%'
}],
map: map
});

animateCircle();
}

// Use the DOM setInterval() function to change the offset of the symbol
// at fixed intervals.
function animateCircle() {
var count = 0;
window.setInterval(function() {

  for (var TransitPathSingle of TransitPath)
  {
    count = (count + 1) % 200;

    var icons = TransitPathSingle.get('icons');
    icons[0].offset = (count / 2) + '%';
    TransitPathSingle.set('icons', icons);
  }
}, 1000);
}


function onClickInfo()
{
  var url="";
  var NewStation=StationAID;
  url='http://www.lpp.si/sites/default/files/lpp_vozniredi/iskalnik/index.php?stop='+NewStation;

//alert(url);

StationAID=StationsData[TransitStationMarkerASelectedID][0];
StationBID=StationsData[TransitStationMarkerBSelectedID][0];
$('#div-path-data').append('<br/>-----( Url )---------><br/><a target="_blank" href="'+url+'">'+url+'</a>');
$('#div-path-data').append('<br/>-----( StationA :) )--------->'+StationAID);
$('#div-path-data').append('<br/>-----( StationB :) )--------->'+StationBID);

//alert(url);

$('#iframe-toolbar-left').attr('src', url);
return NewStation;
//$('iframeId').contents().get(0).location.href
}

//google.maps.event.addDomListener(window, 'load', initialize);
function StartMacro(RepeatX)
{

  Station=Math.ceil(Math.random()*StationMarkers.length);
  SelectStationMarker(Station);

  Station=Math.ceil(Math.random()*StationMarkers.length);
  SelectStationMarker(Station);

<<<<<<< .mine
  var NewStation=onClickInfo();
=======
setTimeout(ZoomStationA(),1000);
setTimeout(ZoomStationB(),6000);
setTimeout(ZoomStationX(),9000);
>>>>>>> .r48

<<<<<<< .mine
  $('#div-path-data').append('<br/>-----( NewStation :) )--------->'+NewStation);
  $('#div-path-data').append('<br/>-----( ZoomA :) )--------->'+StationAID);
  $('#div-path-data').append('<br/>-----( ZoomB :) )--------->'+StationBID);
  //$('#div-path-data').append('<br/>-----( ZoomX :) )--------->'+(NewStation === StationAID));
  //$('#div-path-data').append('<br/>-----( ZoomY :) )--------->'+(NewStation === StationBID));

  //$('#div-path-data').append('<br/>-----( A:'+StationsData[TransitStationMarkerASelectedID][0]+' B:'+StationsData[TransitStationMarkerBSelectedID][0]+')');

  if (NewStation === StationAID)
  {
    //$('#div-path-data').append('<br/>-----( ZoomA :) )--------->'+StationBID);
    setTimeout(ZoomStationA(),500);
  }
  else if (NewStation === StationBID)
  {
    //$('#div-path-data').append('<br/>-----( ZoomB :) )--------->'+StationBID);
    setTimeout(ZoomStationB(),500);
  }
  else
  {
    //$('#div-path-data').append('-----( ZoomX :) )---------><br/>'+NewStation);
    setTimeout(ZoomStationX(),500);
  }

  if ( RepeatX>0 ) {setTimeout(StartMacro(RepeatX-1),1000);}

=======
if ( RepeatX>0 ) {setTimeout(StartMacro(RepeatX-1),11000);}

>>>>>>> .r48
}

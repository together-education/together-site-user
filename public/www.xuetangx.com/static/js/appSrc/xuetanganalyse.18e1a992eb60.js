var beaconSrc = '../../../beacon.gif-type=page_visible.gif'/*tpa=http://www.xuetangx.com/beacon.gif?type=page_visible*/, bl;
bl = new Image();
bl.src = beaconSrc + '&rnd=' + parseInt(Math.random()*100000);
if(window.addEventListener) window.addEventListener('beforeunload', function(){}, false);
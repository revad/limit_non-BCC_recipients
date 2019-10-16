function onInit() {

// Retrieve the stored prefs, or initialise them
// Same code here and in prefs.js
    var prefs = new Object() ;
    let gettingItem = browser.storage.local.get('prefs');
    gettingItem.then(onGot, onError);
  
    function onGot(item) {
//console.log("Limit non-BCC recipients - PI "+JSON.stringify(item));
      
    if (item['prefs']!=null) {
//console.log("Limit non-BCC recipients - PA "+JSON.stringify(item['prefs']));
      prefs = item['prefs'] ;
    }
    else {   
// Set up defaults if prefs absent  
//console.log("Limit non-BCC recipients - PB: no stored prefs");   
      prefs['maxNonBCC'] = 10 ;	

      browser.storage.local.set({'prefsStr': prefs})
        .then( null, onError);
    }

// Sets a  listener for all new windows
    var prefsStr = JSON.stringify(prefs);
    browser.myapi.setWindowListener(prefsStr);

  };
  
  function onError(error) {
    console.log("Limit non-BCC recipients: "+ error)
  }
   
}

document.addEventListener("DOMContentLoaded", onInit, {once : true});

// Attempt to do in-flight prefs change failed
// Causes alerts with both old and new prefs
// Unable to remove callbacks

// If prefs change re-call the API with new argument
function storageChange(changes, area) {
//console.log("Limit non-BCC recipients. Change in storage area: " + area);
 
  var changedItems = Object.keys(changes); 
  for (var item of changedItems) {
    if (item == "prefs") {      
      onInit() ;
    }
  }
}

// Comment this out to prevent in-flight prefs change 
//browser.storage.onChanged.addListener(storageChange);



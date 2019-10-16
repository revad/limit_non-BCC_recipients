window.onload = function() {

// Retrieve the stored prefs
// Same code here and in background.js in case this runs first if addon page open
  var prefs = new Object() ;
  let gettingItem = browser.storage.local.get('prefs');
  gettingItem.then(onGot, onError);

  function onGot(item) {
//console.log("Limit non-BCC recipients - PJ: "+JSON.stringify(item));
    
    if (item['prefs']!=null) {
//console.log("Limit non-BCC recipients - PK"+JSON.stringify(item['prefs']));
      prefs = item['prefs'] ;
    }
    else {
// Set up defaults if prefs absent
//console.log("Limit non-BCC recipients - PL: no stored prefs" );
      prefs['maxNonBCC'] = 10 ;	
    	
      browser.storage.local.set({'prefs': prefs})
        .then( null, onError);
      }
 // Populate prefs on page
      var maxNonBCCParam = document.querySelector('#maxNonBCC');
      maxNonBCCParam.value = prefs['maxNonBCC'] ;
  }
  
  function onError(error) {
    console.log("Limit non-BCC recipients: "+ error)
  }

// Listen for change to a pref
  const inputMaxNonBCC = document.getElementById('maxNonBCC');
  inputMaxNonBCC.addEventListener('change', updateValue);
  
  function updateValue(e) {
    prefs['maxNonBCC'] = e.srcElement.value;
    browser.storage.local.set({'prefs': prefs}, onCompletion ) ;
  }
  
  function onCompletion() {                                                   /* log error is there is one */
    if (chrome.runtime.lastError) {
      console.error("Limit non-BCC recipients: "+ chrome.runtime.lastError);
    } 
  }

};

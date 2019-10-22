function onInit() {

// Retrieve the stored prefs, or initialise them
// Same code here and in prefs.js
    var prefs = new Object() ;
    let gettingItem = browser.storage.local.get('prefs');
    gettingItem.then(onGot, onError);
  
    function onGot(item) {
      
    if (item['prefs']!=null) {
      prefs = item['prefs'] ;
    }
    else {   
// Set up defaults if prefs absent  
      prefs['maxNonBCC'] = 10 ;	

      browser.storage.local.set({'prefsStr': prefs})
        .then( null, onError);
    }

// Set up localised text for dialogue box
    var l10n = new Object() ;
    l10n['dialogueTitle'] = browser.i18n.getMessage("dialogueTitle");
    l10n['dialogueCountLabel'] = browser.i18n.getMessage("dialogueCountLabel");
    l10n['dialogueLimitLabel'] = browser.i18n.getMessage("dialogueLimitLabel");
    l10n['dialogueQuestion'] = browser.i18n.getMessage("dialogueQuestion");
    l10n['dialogueCheckboxLabel'] = browser.i18n.getMessage("dialogueCheckboxLabel");
    var l10nStr = JSON.stringify(l10n);

// Sets a  listener for all new windows
    var prefsStr = JSON.stringify(prefs);
    browser.myapi.setWindowListener(prefsStr, l10nStr);

  };
  
  function onError(error) {
    console.log("Limit non-BCC recipients: "+ error)
  }
   
}

document.addEventListener("DOMContentLoaded", onInit, {once : true});

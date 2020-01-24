myServices = ChromeUtils.import("resource://gre/modules/Services.jsm");
Services = myServices.Services;
var myapi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      myapi : {

        setWindowListener(prefsStr, l10nStr) {

// Adds a listener to detect new compose windows and then detect sending mail
console.log("Limit non-BCC recipients - limit: "+ JSON.parse(prefsStr)['maxNonBCC']);

          var WindowListener = {
            onOpenWindow: function(xulWindow) {
              var my_compose_window = xulWindow.QueryInterface(
                Components.interfaces.nsIInterfaceRequestor).
                getInterface(Components.interfaces.nsIDOMWindow);

              function onWindowLoad() {
          
                my_compose_window.removeEventListener("load",onWindowLoad);
                var document = my_compose_window.document;
              
                if (document.documentElement.getAttribute("windowtype") === "msgcompose") 
                {
                  var mySendButton = document.getElementById("button-send");
                  var myAlertForClosure = function(event) {myAlertToSend(event,prefsStr,l10nStr,document);}  
/* These were to capture send commands as well as the send button - does not work
                  var  myAlertForClosureCommand = function(event) {myAlertToSendCommand(event,prefsStr,l10nStr,document);}
                  document.addEventListener("command",myAlertForClosureCommand,{useCapture:true});
*/
                  mySendButton.addEventListener("click",myAlertForClosure,{useCapture:true});

                }
              }

              my_compose_window.addEventListener("load",onWindowLoad);
            },
          };

          Services.wm.addListener(WindowListener);
        }
      }
    }
  }
};


/* Does not work - command actions (eg blank subject) done before BCC check 
// Send button pressed or a command that closes the window
function myAlertToSendCommand(e,prefsStr,l10nStr,document) {
  switch (e.target.id) {
    case "cmd_sendButton":    
    case "key_sendLater":
    case "key_send":
    case "cmd_sendNow":
    case "cmd_sendLater":
      e.stopPropagation();
      myAlertToSend(e,prefsStr,l10nStr,document);
    default:
      break;
    }
}
*/


// Mail sent - do the business!
function myAlertToSend(e,prefsStr,l10nStr,document) { 

  e.stopPropagation();

  var prefs = JSON.parse(prefsStr);        
  var win = Services.wm.getMostRecentWindow("msgcompose");
  var gCompose = win["gMsgCompose"];
  var msgCompFields = gCompose.compFields;

  win.Recipients2CompFields(gCompose.compFields);
// Expands mailing lists
  win.expandRecipients()

  var toAddress = msgCompFields.to;          
  var ccAddress = msgCompFields.cc;
// Remove anything in quotes that contains @
  toAddress = toAddress.replace(/\"[^\,]*@[^\,]*\"/g,'""'); 
  ccAddress = ccAddress.replace(/\"[^\,]*@[^\,]*\"/g,'""'); 

// Count @ symbols
  var nonbccount = (toAddress.match(/@/g) || []).length + (ccAddress.match(/@/g) || []).length;
  maxNonBCCParam = prefs['maxNonBCC'] ;
  if (nonbccount > maxNonBCCParam) { 

//TO + CC exceeds parameter - consult user
    var l10n = JSON.parse(l10nStr);
    var dialogueTitle  = l10n['dialogueTitle'];
    var dialogueCountLabel  = l10n['dialogueCountLabel'];
    var dialogueLimitLabel  = l10n['dialogueLimitLabel'];
    var dialogueQuestion  = l10n['dialogueQuestion'];
    var dialogueCheckboxLabel  = l10n['dialogueCheckboxLabel'];

    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                          .getService(Components.interfaces.nsIPromptService);
    var checkbox = {value: false};                   // default the checkbox to false
    var message = dialogueCountLabel + ": " + nonbccount + "\n" + dialogueLimitLabel + ": " + maxNonBCCParam + "\n\n" + dialogueQuestion + "\n" 
    var result = prompts.confirmCheck(null, dialogueTitle, message, dialogueCheckboxLabel, checkbox);

    if(result)
    {
      if (checkbox['value']) {

// Change all to BCC

        if (msgCompFields.to) {        
          win.awAddRecipients(msgCompFields, "addr_bcc", msgCompFields.to);
          win.awRemoveRecipients(msgCompFields, "addr_to", msgCompFields.to);
        }  
        if (msgCompFields.cc) {        
        win.awAddRecipients(msgCompFields, "addr_bcc", msgCompFields.cc);
        win.awRemoveRecipients(msgCompFields, "addr_cc", msgCompFields.cc);
        }
      }
    }    
    else {
// Cancel pressed       
      e.preventDefault();
    }  
  }
};


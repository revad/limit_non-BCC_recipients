myServices = ChromeUtils.import("resource://gre/modules/Services.jsm");
Services = myServices.Services;
var myapi = class extends ExtensionCommon.ExtensionAPI {
  getAPI(context) {
    return {
      myapi : {

        setWindowListener(prefsStr) {
// Adds a listener to detect new compose windows and then detect sending mail
// Most of this copied from Graeme's Single_domain addon

console.log("Limit non-BCC recipients - limit: "+ JSON.parse(prefsStr)['maxNonBCC']);

          var WindowListener = {
            onOpenWindow: function(xulWindow) {
              var my_compose_window = xulWindow.QueryInterface(
                Components.interfaces.nsIInterfaceRequestor).
                getInterface(Components.interfaces.nsIDOMWindow);

              function onWindowLoad() {
//console.log("Limit non-BCC recipients - B");                
                my_compose_window.removeEventListener("load",onWindowLoad);
                var document = my_compose_window.document;
//console.log("Limit non-BCC recipients - C: "+document.documentElement.getAttribute("windowtype"));                
                if (document.documentElement.getAttribute("windowtype") === "msgcompose") 
                {
                  var mySendButton = document.getElementById("button-send");
                  var myAlertForClosure = function(event) {myAlertToSend(event,prefsStr,document);}  
                  var  myAlertForClosureCommand = function(event) {myAlertToSendCommand(event,prefsStr,document);}
// this does _not_ remove the old event listeners on change of prefs for some reason
//                  document.removeEventListener("command",myAlertForClosureCommand);
//                  mySendButton.removeEventListener("click",myAlertForClosure);
                  document.addEventListener("command",myAlertForClosureCommand,{useCapture:true});
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


// Send button pressed or a command that closes the window
function myAlertToSendCommand(e,prefsStr,document) {
//console.log("Limit non-BCC recipients - D: "+e.target.id);
  switch (e.target.id) {
    case "cmd_sendButton":    
    case "key_sendLater":
    case "key_send":
    case "cmd_sendNow":
    case "cmd_sendLater":
      e.stopPropagation();
      myAlertToSend(e,prefsStr,document);
    default:
      break;
    }
}
// Mail sent - do the business!
function myAlertToSend(e,prefsStr,document) { 
//console.log("Limit non-BCC recipients - C");
  var prefs = JSON.parse(prefsStr);        
  var win = Services.wm.getMostRecentWindow("msgcompose");
  var gCompose = win["gMsgCompose"];
  var msgCompFields = gCompose.compFields;
// Built-in functions to expand mailing lists
  win.Recipients2CompFields(gCompose.compFields);
  win.expandRecipients()

  var toAddress = msgCompFields.to;          
  var ccAddress = msgCompFields.cc;
// Remove anything in quotes that contains @
  toAddress = toAddress.replace(/\"[^\,]*@[^\,]*\"/g,'""'); 
  ccAddress = ccAddress.replace(/\"[^\,]*@[^\,]*\"/g,'""');    

//console.log("Limit non-BCC recipients - To: "+toAddress);
//console.log("Limit non-BCC recipients - CC: "+ccAddress);

// Count @ symbols
//console.log("Limit non-BCC recipients - TO: "+(toAddress.match(/@/g) || []).length);
//console.log("Limit non-BCC recipients - CC: "+(ccAddress.match(/@/g) || []).length);
  var nonbccount = (toAddress.match(/@/g) || []).length + (ccAddress.match(/@/g) || []).length;

  maxNonBCCParam = prefs['maxNonBCC'] ;

  if (nonbccount > maxNonBCCParam) { 

//TO + CC exceeds parameter - consult user
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                          .getService(Components.interfaces.nsIPromptService);
    var checkbox = {value: false};                   // default the checkbox to false
    var message = "Non-BCC count: "+nonbccount + "\n" + "Your limit: " + maxNonBCCParam + "\n\n" + "Send anyway?" + "\n" 
    var result = prompts.confirmCheck(null, "Non-BCC recipients limit exceeded!", message,"Change all to BCC?",  checkbox);

    if(result)
    {

//console.log("Limit non-BCC recipients - Checkbox: "+JSON.stringify(checkbox));
      if (checkbox['value']) {

// Change all to BCC
// Save changes to both message composition fields and recipient widgets (why?)
        msgCompFields.bcc = msgCompFields.bcc + "," + msgCompFields.to + "," + msgCompFields.cc ;
//console.log("Limit non-BCC recipients - V BCC: "+msgCompFields.bcc);
  
        var recipients = document.getElementById("addressingWidget");
        var recipientCount = recipients.getRowCount();
  
        for(var i = 0; i < recipientCount; i++)
        {
          var elementId = "addressCol1#" + (i+1);
          var recipientType = document.getElementById(elementId);
          if(recipientType)
          {
            switch(recipientType.value)
            {
              case "addr_to":
              case "addr_cc":
                document.getElementById(elementId).value = "addr_bcc" ;
              default:
                break;
            }  
          }    
        }
      }
    }    
    else {
// Cancel pressed       
      e.preventDefault();
    }  
  }
};


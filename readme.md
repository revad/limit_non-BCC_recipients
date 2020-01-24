# Thunderbird addon: Limit non-BCC Recipients - TB v73+

## Description

This is a potential partial replacement for the Use BCC Instead C addon, which will not work after TBv70 due to removal of legacy addons. It offers these features of Use BCC Instead:
* Counts email recipients and compares that with the user's limit (parameter)
* Recipients in mailing lists are counted
* If the limit is exceeded it displays a dialog - cancel or continue
* There is an option to continue but change all recipients to BCC
* If recipients are changed to BCC expanded mailing lists appear in the BCC address field

It does not offer these features of Use BCC Instead:
* Change the default in the compose window from TO to BCC
* A button to change all recipients between TO, CC, and BCC

Limitations:
* It only acts after pressing the SEND button - not the commands 'Send now' or 'Send later'
* A restart is needed if you change the non-BCC limit

It uses a MailExtension Experiment API containing code derived from legacy addons so is very likely to change, or stop working altogether, as a result of changes in TB between now and the next release, TBv76. A new MailExtension API is needed to implement it properly (bug 1585995).

## Installation

This may or may not be uploaded to ATN in future. Before that use the procedure outlined here:
https://github.com/revad/use_bcc_instead_A

Please raise issues here.
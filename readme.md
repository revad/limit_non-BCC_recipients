# Thunderbird addon: Limit non-BCC Recipients

## Description

This is a replacement for the Use BCC Instead C addon, which will not work after TB v70 due to removal of legacy features in TB

It uses a MailExtension Experiment API contining code derived from legacy addons so is subject to change resulting from changes in TB core. 

* Counts email recipients and compares that with the user's limit (parameter)
* Recipients in mailing lists are counted but the list is not expanded
* If exceeded displays a dialog - cancel or continue
* If continuing, option to change all recipients to BCC

A restart is needed if you change the non-BCC limit

## Installation

TBA

Please raise issues here.
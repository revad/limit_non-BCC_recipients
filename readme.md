# Thunderbird addon: Limit non-BCC Recipients MX

## Description

This Mail Extension is a partial replacement for the Use BCC Instead C addon, which will not work after TBv70. 
It offers these features of Use BCC Instead:
* Counts email recipients and compares that with the user's limit (parameter)
* Recipients in mailing lists are counted
* If the limit is exceeded it displays a dialog - cancel or continue
* There is an option to continue but change all recipients to BCC

It does not offer these features of Use BCC Instead:
* Change the default in the compose window from TO to BCC
* A button to change all recipients between TO, CC, and BCC

## Requirements

Requires Thunderbird version 75+

## Limitations

Currently, sending fails with mailing lists.
(But you can expand them and then send: https://github.com/revad/expand_mailing_lists )

appengine-user-manager
======================

List / manage users with appengine access

We have 10s of appengine projects (microservices) and 10s of users with need to access them in various ways. Occasionally new users come and old users leave. Hundreds of clicks later we might or might not have the appropriate access controls. Google is promising that a better way of implementing access controls is on their roadmap but until then ... this chrome extension tries to make the chore more manageable. 

![Screenshot](https://raw.githubusercontent.com/frumpel/appengine-user-manager/master/screenshot.png)

Disclaimer
----------

Use entirely at your own risk! This could very well do bad things to your account setup! For this to be useful you need to run this as a privileged user so you can do privileged damage. You've been warned.

Installation
------------

This is a chrome extension - download the whole folder, enable developer mode in chrome, load unpacked extension.

Usage
-----

The UX is workable but there are a few idiosyncracies left. The current process to get to the overview stage is:

* open your appengine dashboard on the permissions tab
  * the content script runs and passes the list of avalaible projects to the background store
* click on the extension icon
  * this shold open a dashboard tab 
* on the dashboard tab click the "Get Data" button.
  * this will open a new window with a tab with the permissions page for every project you have. In parallel. This will max out your CPU and still take a long time. 
    * each of the tabs runs its content script and populates the background store
  * there is a setTimeout that will close the new window after 60s. If you find that you are not getting all the results you expect try adjusting the wait time
* reload the dashboard tab

A note on naming conventions / assumptions:

* The highlighting / CSS logic assumes that you have your projects named APPNAME-(...|prod) and you will get different highlights for prod vs non-prod projects
* There is the assumption that you have preferred email domains. As such there is variable named "okDomains" with list of accepted domains in message_read.js. Season to taste

appengine-user-manager
======================

List / manage users with appengine access

We have 10s of appengine projects (microservices) and 10s of users with need to access them in various ways. Occasionally new users come and old users leave. Hundreds of clicks later we might or might not have the appropriate access controls. Google is promising that a better way of implementing access controls is on their roadmap but until then ... this chrome extension tries to make the chore more manageable. 

Installation
------------

This is a chrome extension - download the whole folder, enable developer mode in chrome, load unpacked extension.

Usage
-----

The UX is still rather rough and so far only the overview and DELETE functionality is implemented. The current process to get to the overview stage is:

* open your appengine dashboard on the permissions tab
  * the content script runs and passes the list of avalaible projects to the background store
* click on the extension icon
  * this shold open a dashboard tab 
* on the dashboard tab click the "Get Data" button.
  * this will open a new window with a tab with the permissions page for every project you have. In parallel. This will max out your CPU and still take a long time. 
    * each of the tabs runs its content script and populates the background store
  * there is a setTimeout that will close the new window after 60s. If you find that you are not getting all the results you expect try adjusting the wait time
* reload the dashboard 

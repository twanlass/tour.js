tour.js - v0.1
=======

A simple webapp tour system. Highlight new features and track funnels with MixPanel.  

Features
=======

+ Simple, lightweight. 
+ Highlights elements on the page. Just feed in a selector (.class or #id).
+ Smooth scrolls to any tour element off screen or partially hidden.
+ Supports pausing of the tour - allow users to complete a task before moving on.
+ Only dependency is jQuery. 
+ Easily styled w/ 2 or 3 css classes.
+ Fully autonomus - no need to change any of your page markup. Easily add or remove the tour. 
+ Optionally supports MixPanel Funnels. Simply configure the step names of your tour and TourJS will send funnel actions for you. 

Setup
=======

+ Include tour.js and tour.css:
++	<link rel="stylesheet" href="css/tour.css">
++	<script src="js/tour.js"></script>

+ Add your tour steps:
++	Add stops to the TourSteps object at the top of tour.js - see Tour Step Config below.


Tour Step Config
=======

+"msg": "Welcome to TourJS.", // tour dialog text
+"actionName" : false, // name of Mixpanel event used for funnel analysis - spaces are fine, use friendly names. 
+"selector" : "body", // selector for highlighted feature. Comma seperated list = (dialog target, additional items highlight). Don't forget your '.' or '#' 
+"position" : "center", // dialog location in relation to target feature (selector). top, bottom, left, right, (or 'center' which centers to screen)
+"btnMsg" : "Start Tour &raquo", // if you'd like a button on the dialog simply add a message here
+"nextSelector" : "#tour_dialog_btn", // does the user need click something to advance? Omit for any action click to advance.
+"waitForTrigger" : false, // should we pause the tour here while the user does something? Pass a seletor as the trigger to resume the tour from this point
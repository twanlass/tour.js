Tour.js - v0.1
=======

A simple webapp tour system. Walk users through features and track funnels with MixPanel. Great for first run experiences. 

Features
=======

+ Simple, lightweight. 
+ **Only dependency is jQuery**. 
+ Easily elements on the page. Just feed in a selector (.class or #id).
+ Smooth scrolls to any tour element off screen or partially hidden.
+ Supports pausing of the tour allowing users to complete a task before moving on.
+ Easily styled w/ 2 or 3 css classes.
+ Fully autonomus - no need to change any of your page markup. Easily add or remove the tour. 
+ Supports MixPanel Funnels. Simply configure the step names of your tour and TourJS will send funnel actions for you. 

Setup
=======

+ Include tour.js and tour.css:

		<link rel="stylesheet" href="css/tour.css">

		<script src="js/tour.js"></script>

+ Create a new object:

		var tourSteps = [{"msg":"Hello Tour!", "selector":"body", "position"":"center"}]
		
+ Call the tour to start it:
	
		tourJS(tourSteps);

Additional Tour Step Options
=======

+ **msg** [string] : text to display in the dialog box.
+ **actionName** [string] : name of Mixpanel event used for funnel analysis. Spaces are fine, use friendly names. 
+ **selector** [string - css selector] : the item to highlight or feature for this step. Accepts a comma seperated list, first item will get dialog box focus. Don't forget your '.' or '#'. 
+ **position** [string] : dialog location in relation to target selector. **top**, **bottom**, **left**, **right**, or **center** (which centers to screen).
+ **btnMsg** [string] : if present, the dialog will feature a button w/ this text ("Start Tour, etc").
+ **nextSelector** [string - css selector] : force the user to click a specific selector to advance. Else any click will advance.
+ **waitForTrigger** [string - css selector] : this will pause the tour when this step is done. It will only advance / resume when this selector is clicked (use .trigger() to fire).
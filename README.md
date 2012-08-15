Tour.js - v0.1
=======

A simple webapp tour system. Walk users through features and track funnels with MixPanel. Great for first run experiences. 

Features
=======

+ Simple, lightweight.  
+ Easily highlights elements / buttons / features on the page. Just feed in a selector ( .class or #id ).
+ Automatically scrolls to any tour element off screen or partially hidden.
+ Supports pausing of the tour allowing users to complete a task or action before moving on.
+ Styles or lightweight and super easy to customize.
+ Fully autonomus / self contained. No need to change any of your page markup.
+ Supports MixPanel Funnels. Simply configure the step names of your tour and TourJS will send funnel actions for you (requires mixpanel account and js includes).
+ **Only dependency is jQuery**.

Setup
=======

+ Include tour.js and tour.css:

		<link rel="stylesheet" href="css/tour.css">

		<script src="js/tour.js"></script>

+ Create a new object in a new script tag or external js file:

		var tourSteps = [{"msg":"Hello Tour!", "selector":"body", "position"":"center"}]
		
+ Call the tour and pass your new tourSteps object to start it:
	
		tourJS(tourSteps);

Additional Tour Step Options
=======

+ **msg** [string] : text to display in the dialog box.
+ **actionName** [string] : name of Mixpanel event used for funnel analysis. Spaces are fine, use friendly names. 
+ **selector** [string - css selector] : the item to highlight or feature for this step. Accepts a comma seperated list, first item will get dialog box focus. Don't forget your '.' or '#'. 
+ **position** [string] : dialog location in relation to target selector. **top**, **bottom**, **left**, **right**, or **center** (which centers to screen).
+ **btnMsg** [string] : if present, the dialog will feature a button w/ this text ("Start Tour, etc").
+ **nextSelector** [string - css selector] : force the user to click a specific selector to advance. Else any click will advance.
+ **waitForTrigger** [string - css selector] : this will pause the tour when this step is done. It will only advance / resume when this selector is clicked (use jQuery .trigger() to fire).
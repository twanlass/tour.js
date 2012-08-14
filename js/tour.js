function tourJS() {

	var TourSteps = [
	   	{
			"msg": "Welcome to TourJS. Let's check out a simple tour.", // tour bubble / dialog text
		    "actionName" : false, // name of Mixpanel event used for funnel analysis - spaces are fine, use friendly names. You'll need to setup MP yourself however and include the libs.
		    "selector" : "body", // selector for highlighted feature. Comma seperated list = (dialog target, additional items to pop above mask). Don't forget your '.' or '#' 
		    "position" : "center", // dialog location in relation to target (selector). top, bottom, left, right, (or 'center' which centers to screen)
		    "btnMsg" : "Start Tour &raquo", // if you'd like a button on the dialog simply add a message here
		    "nextSelector" : "#tour_dialog_btn", // does the user need to do something specific to advance? For example, clicking the tour bubble ok button. Omit for any action click to advance.
			"waitForTrigger" : false, // should we pause the tour here? while the user does something? Pass a seletor as the trigger to resume the tour from this point
		},
	    {
			"msg": "Notice how the item is pulled out of the page and highlighed?", 
		    "selector" : ".step1", 
		    "position" : "right",
		},	 
		{
			"msg": "You can require an action from the user before moving on:", 
		    "selector" : ".step2", 
		    "position" : "left",
		   	"nextSelector" : "#action",
		},	 
		{
			"msg": "Did you notice the smooth transitions between steps?", 
		    "selector" : ".step3", 
		    "position" : "bottom",
		},	 
		{
			"msg": "TourJS will automatically scroll to hidden items.", 
		    "selector" : ".step4", 
		    "position" : "top",
		},			
		{
			"msg": "That's it. You've completed the tour!", 
		    "selector" : "body", 
		    "position" : "center",
		    "btnMsg" : "Finish &raquo",
		},
	] 

	var Tour = {
		curStop: 0, // override this to star the tour from a specified point
		offsetFudge: 15, // adjusts distance from target for tour dialog 
		allowSkip: false, // coming in a future update
		funnelID: "tourV1", // we'll pass this to Mixpanel to segement on and guage future funnel improvment 

		init: function() {
			window.tourActive = true; //@hack - prevent certain elements from being clicked while in tour
			$('body').prepend('<div id="tour_mask"></div><div id="tour_dialog"><div class="arrow top"></div><div class="msg"></div></div>');
			// this.setupSelectors(); // helper class 
			this.showStep();
		},

		// increment steps or pause if we're waiting on a trigger to advance
		nextStep: function() {
			var latent = TourSteps[this.curStop].waitForTrigger; // should we proceed? 
			this.curStop += 1;
			this.curStop < TourSteps.length && !latent ? this.showStep() : this.tourComplete();
		},

		// build dialog content, set focus on elements, and finally fade in the step
		showStep: function() {
			var parent = this;
			this.setupSelectorsLive();

			$('.tour_item').removeClass('active');
			this.getContent();
			this.setDialogPos(TourSteps[this.curStop].position);
			$('*').bind('click', {stop: this.curStop}, this.tourClickHandler);

			if(!$('#tour_mask').is(":visible")) { $('#tour_mask').fadeIn(); }
			
			$(TourSteps[this.curStop].selector).addClass('active').fadeIn();
			$('#tour_dialog').fadeIn(function() {
				parent.dialogVisible();
			});
		},

		stepComplete: function() {
			this.mpEvent(TourSteps[this.curStop].actionName);
			$('*').unbind('click', this.tourClickHandler);
			var parent = this;
			$('#tour_dialog').fadeOut(function() {
				parent.nextStep();
				this.inProgress = true;
			});
		},

		tourComplete: function() {
			$('#tour_dialog').fadeOut();
			// sipmle check to see if we're pausing or at the end of our tour
			// if we're just pausing, we want to keep focus on the area until we move forward
			if(this.curStop == TourSteps.length) {
				$('#tour_mask').fadeOut(function() {
					$('.tour_item').removeClass('active');
				});
				window.tourActive = false; // @ hack - prevent some elments from being clickable until the tour is over
			}
		},

		mpEvent: function(eventName) {
			if(eventName){
				mixpanel.track(eventName, {"funnelVersion": this.funnelID});
			}
		},		

		getContent: function() {
			var message = TourSteps[this.curStop].msg;
			message += TourSteps[this.curStop].btnMsg ? "<hr><div id='tour_dialog_btn' class='button'>"+  TourSteps[this.curStop].btnMsg +"</div>" : "";
			message += this.allowSkip ? "<a id='tour_skip'>Skip Tour &raquo</a>" : "";
			$('#tour_dialog .msg').html(message);
		},

		setDialogPos: function(position) {

			var selArray = TourSteps[this.curStop].selector.split(",");
			var target = $(selArray[0]);
			var dialog = $('#tour_dialog');

			switch(position) {
				case "top":
					var top = target.offset().top - dialog.outerHeight() - this.offsetFudge;
					var left = target.offset().left + target.outerWidth()/2 - dialog.outerWidth()/2;
					break;
				case "right":
					var top = target.offset().top; 
					var left = target.offset().left + target.outerWidth() + this.offsetFudge;
					break;
				case "bottom":
					var top = target.offset().top + target.outerHeight() + this.offsetFudge;
					var left = target.offset().left + target.outerWidth()/2 - dialog.outerWidth()/2;
					break;
				case "left":
					var top = target.offset().top;
					var left = target.offset().left - dialog.outerWidth() - this.offsetFudge;
					break;
				case "center": // screen center hor & vert
					var top = Math.max(0, (($(window).height() - dialog.outerHeight()) / 2) + $(window).scrollTop());
					var left = Math.max(0, (($(window).width() - dialog.outerWidth()) / 2) + $(window).scrollLeft());
					break;
			}

			dialog.children('.arrow').attr('class','arrow ' + position);
			dialog.css({top:top, left:left});

		},

		// Is our next tour item visible on screen? If not, scroll to it! 
		dialogVisible: function() {
			var dialog = $('#tour_dialog');
			var docViewTop = $(window).scrollTop();
			var docViewBottom = docViewTop + $(window).height();

			var elemTop = $(dialog).offset().top;
			var elemBottom = elemTop + $(dialog).height();

			if(!((elemBottom >= docViewTop) && (elemTop <= docViewBottom)
			&& (elemBottom <= docViewBottom) &&  (elemTop >= docViewTop) )) {
				$('html, body').animate({
					scrollTop: $(dialog).offset().top - 25
				}, 500);
			}
		},

		setupSelectorsLive: function() {
			// tour item class allows us to pull a an element up the z-index and focus on it
			// if we pass more than one selector, loop through and add the class to all of them
			var selArray=TourSteps[this.curStop].selector.split(",");
			for (var i = 0; i < selArray.length; i++) {
				$(selArray[i]).addClass('tour_item');
			}
			
			// setup triggers for latent actions - use .trigger() to fire these off
			var trigger = TourSteps[this.curStop].waitForTrigger;
			if(trigger){
				$('body').append('<div id="'+trigger.substring(1)+'" style="display: none;"></div>');
				$(trigger).bind('click.tour', {selector: trigger}, this.resumeClickHandler);
			}
		},		

		// namespaced for tour resume triggers
		// if a trigger has been activated let's resume the tour where we left off
		resumeClickHandler: function(e) {
			$(e.data.selector).unbind('click.tour', this.resumeClickHandler);
			Tour.showStep();
		},

		// custom click handler when tour is active. 
		// Check to see if the next action was clicked to advance the tour (nextSelector)
		tourClickHandler: function(e) {
			var nextSel = TourSteps[e.data.stop].nextSelector;
			if(nextSel) { // we only proceed when THIS selector is clicked 
				if($(e.currentTarget).is(nextSel) || $(nextSel).find(e.currentTarget).length > 0){
					Tour.stepComplete();
				}
			}else{
				Tour.stepComplete();
			}
		}
	}
	Tour.init(); // kickoff our tour
};
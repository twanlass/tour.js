// (c) 2012 Tyler Wanalss / tdub.co

function tourJS(TourSteps) {

	var Tour = {
		curStop: 0, // override this to start the tour from a specified point
		offsetFudge: 15, // adjusts distance from target for tour dialog 
		allowSkip: false, // coming in a future update
		funnelID: "tourV1", // we'll pass this to Mixpanel to segement on and guage future funnel improvment 

		init: function() {
			$('body').prepend('<div id="tour_mask"></div><div id="tour_dialog"><div class="arrow top"></div><div class="msg"></div></div>');
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
			// sipmle check to see if we're pausing or at the end of our tour step
			// if we're just pausing, we want to keep focus on the area until we move forward
			if(this.curStop == TourSteps.length) {
				$('#tour_mask').fadeOut(function() {
					$('.tour_item').removeClass('active');
				});
			}
		},

		// To use: include MixPanel js (see mixpanel.com). Set identity or person info *before* the tour starts. 
		// Add a "actionName" string to each step and upon user completion it will be automatically sent to MixPanel for funnel tracking
		mpEvent: function(eventName) {
			if(eventName){
				mixpanel.track(eventName, {"funnelVersion": this.funnelID});
			}
		},		

		getContent: function() {
			var message = TourSteps[this.curStop].msg;
			message += TourSteps[this.curStop].btnMsg ? "<hr><div id='tour_dialog_btn' class='button'>"+  TourSteps[this.curStop].btnMsg +"</div>" : "";
			$('#tour_dialog .msg').html(message);
		},

		setDialogPos: function(position) {

			// @todo - need to calculate arrow position in px instead of %

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
			// tour item class allows us to pull an element up the z-index and focus on it
			// if we pass more than one selector, loop through and add the class to all of them
			var selArray=TourSteps[this.curStop].selector.split(",");
			for (var i = 0; i < selArray.length; i++) {
				$(selArray[i]).addClass('tour_item');
			}
			
			// setup triggers for latent actions - use .trigger() to fire these off once the user has complete a custom action in your app
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
			if(nextSel) { // we only proceed when THIS selector is clicked i.e. #ok_button
				if($(e.currentTarget).is(nextSel) || $(nextSel).find(e.currentTarget).length > 0){
					Tour.stepComplete();
				}
			}else{ // no next selector specified. Any click or action will continue the tour
				Tour.stepComplete();
			}
		}
	}
	Tour.init(); // kickoff our tour
};
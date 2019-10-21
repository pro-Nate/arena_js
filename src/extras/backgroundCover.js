/** 
 * @class backgroundCover
 * @constructs directive
 * @description Lazy load and transition a background image with background-size: cover;
 *
 * @example 
		`<div background-cover="adventures.jpg" 
		 			background-cover-mobile="adventures-small.jpg" 
					transition-class="fadeIn"
		 			data-bg-attachment="scroll">
		 		<!-- Some stuff -->
		 </div>`
 *
 * @requires $
 * @requires jQuery.backstretch (for css2 Fallback)
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */

function backgroundCoverDirective($, $app, $browser, $breakpointMonitor) {
	return {
    data: {
			backgroundCover: undefined,
			backgroundCoverMobile: undefined,
			bgTransitionDuration: 600,
			deferCompile: false,
			useBackstretch: false,
			bgPosition: "50% 50%",
			bgAttachment: "scroll",
			transitionClass: "",
			bgZindex: -1,
			scrollLoadOffset: 0.1,
			backgroundCoverCallback: function () {},
			bgLoadedClass: "bg-cover-loaded",
			bgLoadedEvent: "bgCoverLoaded",	
			mobileBreakpoint: undefined,
			mobileOnlyClass: undefined,
			mobileHideClass: undefined
		},
    link: function ($el, $scope, data) {
			var imgSrc = data.stretchedBg||data.stretchedBgMobile
				,	scrollMonitor = new $app.ScrollMonitor()
				,	scrollTracker = scrollMonitor.bind($el, 0, data.scrollLoadOffset);

			function isMobile() { 
				return data.mobileBreakpoint && $breakpointMonitor.breakpoint('<=', data.mobileBreakpoint);
			}

			function bugFixCss(style) {
				style[$browser.prefix.css+"background-size"] = "cover";         // Prefix bg-size prop
				if($browser.IOS || $browser.Chrome) 
					style["background-attachment"] = "scroll";     								// TODO: Fix chrome fixed position bug
				//style[$browser.prefix.css+"transform"] = "translateZ(0)";     // Chrome fixed position background hack
				//style[$browser.prefix.css+"transform-style"] = "preserve-3d";
				//style[$browser.prefix.css+"backface-visibility"] = "hidden";  // Safari bug fixes
				return style;
			}

			function chooseRandomFromMultiple(src) {
					var srcList = src.split(',');
					return srcList[Math.floor(Math.random() * srcList.length)];
			}
			
			function display(e) {
				if ( data.useBackstretch || (!$browser.backgroundSizing && $el.backstretch) ) {
					$el.backstretch(imgSrc, {fade: data.bgTransitionDuration})
							.on("backstretch.after", data.backgroundCoverCallback)
							.addClass(data.bgLoadedClass)
							.trigger(data.bgLoadedEvent);
				} else {
					if(!/absolute|fixed|relative/.test($el.css("position")))
						$el.css("position", "relative");

					var style = bugFixCss({
								"position" : "absolute",
								"top" : 0, "left" : 0, "right" : 0, "bottom" : 0,
								"width": "100%", "height": "100%",
								"background-image" : "url("+imgSrc+")",
								"background-size" : "cover",
								"background-position": data.bgPosition,
								"background-attachment": data.bgAttachment,
								"z-index": data.bgZindex
							}),
							div = $("<div/>");

					if(data.transitionClass && data.transitionClass.length) 
						div.addClass(data.transitionClass);

					$el.addClass(data.bgLoadedClass)
							.prepend(div.css(style))
							.trigger(data.bgLoadedEvent);

					if(data.useBackstretch || !$browser.transitions)
						div.css({opacity: 0}).fadeTo(data.bgTransitionDuration, 1, data.backgroundCoverCallback);
					else
						div.one($browser.transitions.end+" "+$browser.animations.end, data.backgroundCoverCallback);
				}
				$scope.$trigger({type: data.bgLoadedEvent, image: div});
			}

			function watchScroll() {
				scrollTracker.$on("inView", function () {
					if(data.stretchedBgMobile && isMobile())
						imgSrc = data.stretchedBgMobile;

					imgSrc = chooseRandomFromMultiple(imgSrc);

					var loadImage = $app.loadImgSrc(imgSrc).then(display);
					if (data.deferCompile) $scope.$deferCompile(loadImage);
					
					scrollMonitor.unbind(scrollTracker);
				});
				scrollTracker.checkPosition();
				$scope.$on("$destroy", scrollMonitor.destroy);
			}

			function watchViewportBreakpoint(waitForMobile) {
				$breakpointMonitor.$on("viewportBreakpointChanged", function vl(e) {
					if (isMobile() === waitForMobile) {
						$breakpointMonitor.$off("viewportBreakpointChanged", vl);
						watchScroll();
					}
				});
			}
			
			if (isMobile()) {
				if (data.mobileHideClass && $el.hasClass(data.mobileHideClass)) watchViewportBreakpoint(false);
				else watchScroll();
			} else {
				if (data.mobileOnlyClass && $el.hasClass(data.mobileOnlyClass)) watchViewportBreakpoint(true);
				else watchScroll();
			}
		}
  };
}

backgroundCoverDirective.$dependencies = ["$", "$app", "$browser", "$breakpointMonitor"];

if (window.ARENA) ARENA.$directive("backgroundCover", backgroundCoverDirective);
if (typeof module !== 'undefined') module.exports = backgroundCoverDirective;
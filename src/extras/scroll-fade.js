(function ($) {

	AMAN.$directive(".scroll-fade", function () {
		return {
			data: {
				minBreakpoint: 'small',
				transitionDistance: 460,
				scrollOffset: 0,
				transitionDirection: "out",
				context: function ($element, $scope) {return true;}
			},
			link: function ($element, $scope, data) {
				var scrollRange = [data.scrollOffset, -1],
					offsetElement = typeof data.scrollOffset == "string" ? $(data.scrollOffset) : false,
					css = {opacity: 1},
					SX, SY;
				
				if (!data.context($element, $scope)) return;
				
				function watcher(e, scrollPosition, prvScrollPosition, direction) {
					var distanceFromDocumentTop = $element.offset().top,
							distanceFromViewportTop = $element[0].getBoundingClientRect().top,
							offsetDistanceFromViewportTop = offsetElement ? 
								offsetElement[0].getBoundingClientRect().top + offsetElement.height() 
								: data.scrollOffset;
					SX = distanceFromViewportTop - offsetDistanceFromViewportTop;
					SY = distanceFromDocumentTop - offsetDistanceFromViewportTop;

					if (distanceFromViewportTop <= offsetDistanceFromViewportTop) 
						css.opacity = 0;
					else 
						css.opacity = SX / SY;
					if (data.transitionDirection == "in") 
						css.opacity = 1 - css.opacity;
					
					$element.css(css);
				}

				if (!data.minBreakpoint || AMAN.$breakpointMonitor.breakpoint('>', data.minBreakpoint)) {
					var scrollMonitor = new AMAN.ScrollMonitor()
						,	scrollTracker = scrollMonitor.bind($element, 0);
					scrollTracker.$on("inView", watcher);
					scrollTracker.checkPosition();
					$scope.$on("$destroy", scrollMonitor.destroy);
				}
			}
		}
	});

})(jQuery);
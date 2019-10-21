/** 
 * @class LazyLoadImg
 * @constructs directive
 * @description Lazy load an image. 
 		Image loaded when scrolled to (and visible), or image element fires "inView" event.
 *
 * @example 
		`<img lazy-load-img="adventures-2.jpg" 
					lazy-load-img-mobile="adventures-2-small.jpg" 
					retina-slug="@2x"
					svg-src="true"
					scroll-offset="-5" 
					src="placeholder.gif" />`
 *
 * @requires $
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */

function lazyLoadImgDirective($, $app, $browser, $breakpointMonitor) {
	return {
    data: {
			lazyLoadImg: undefined,
			lazyLoadImgMobile: undefined,
			retinaSlug: undefined,
			svgSrc: false,
			forceJsTransitions: false,
			scrollLoadOffset: 0.1,
			mobileBreakpoint: undefined,
			mobileOnlyClass: undefined,
			mobileHideClass: undefined,
			hideLazyLoad: false,
			imgLoadedEvent: "lazyImageLoaded"
		},
    link: function ($el, $scope, data) {
			var jsTransitions = data.forceJsTransitions || !$browser.transitions
				,	scrollMonitor = new $app.ScrollMonitor()
				,	scrollTracker = scrollMonitor.bind($el, 0, data.scrollLoadOffset)
				,	retinaSlug
				,	imgSrc;
			
			function isMobile() { 
				return data.mobileBreakpoint && $breakpointMonitor.breakpoint('<=', data.mobileBreakpoint);
			}

			function chooseRandomFromMultiple(src) {
					var srcList = src.split(',');
					return srcList[Math.floor(Math.random() * srcList.length)];
			}
			
			function endLoad(e){
				$el[0].src = imgSrc;
				$el.trigger(data.imgLoadedEvent, [e]);
				if (!data.hideLazyLoad) {
					$el.removeClass('lazy-loading').addClass('lazy-loaded').trigger(data.imgLoadedEvent);
					if (jsTransitions) $el.fadeIn("slow");
				}
				$scope.$trigger({type: data.imgLoadedEvent, image: $el});
			}

			function beginLoad() {
				if (jsTransitions) $el.hide();
				
				if (data.lazyLoadImgMobile && isMobile())
					imgSrc = data.lazyLoadImgMobile;
				else 
					imgSrc = data.lazyLoadImg;
				imgSrc = chooseRandomFromMultiple(imgSrc);

				if ($browser.supportsSvgImg && data.svgSrc) {
					imgSrc = imgSrc.replace("."+imgSrc.replace(/^.*\./, ''), '.svg');
				} else if (typeof data.retinaSlug == "string" && data.retinaSlug.length) {
					imgSrc = imgSrc.replace(/.([^.]*)$/, data.retinaSlug+'.$1');
				}

				var loadImage = $app.loadImgSrc(imgSrc).then(endLoad);
					if (data.deferCompile)
						$scope.$deferCompile.push(loadImage);
				
				scrollMonitor.unbind(scrollTracker);
			}

			function watchScroll() {
				$el.addClass('lazy-loading');
				function offScrollView() {
					beginLoad();
					$el.off("inView", offScrollView);
					scrollMonitor.unbind(scrollTracker);
				}
				$el.on("inView", offScrollView);
				scrollTracker.$on("inView", offScrollView);
				scrollTracker.checkPosition();
				$scope.$on("$destroy", scrollMonitor.destroy);
			}

			function watchViewportBreakpoint(waitForMobile) {
				function vl(e) {
					if (isMobile() === waitForMobile) {
						$el.off("inView", vl);
						$breakpointMonitor.$off("viewportBreakpointChanged", vl);
						watchScroll();
					}
				}
				$el.on("inView", vl);
				$breakpointMonitor.$on("viewportBreakpointChanged", vl);
			}
			
			if (isMobile()) {
				if (data.mobileHideClass && $el.hasClass(data.mobileHideClass)) watchViewportBreakpoint(true);
				else watchScroll();
			} else {
				if (data.mobileOnlyClass && $el.hasClass(data.mobileOnlyClass)) watchViewportBreakpoint(false);
				else watchScroll();
			}
		}
  };
}

lazyLoadImgDirective.$dependencies = ["$", "$app", "$browser", "$breakpointMonitor"];

if (window.ARENA) ARENA.$directive("lazyLoadImg", lazyLoadImgDirective);
if (typeof module !== 'undefined') module.exports = lazyLoadImgDirective;
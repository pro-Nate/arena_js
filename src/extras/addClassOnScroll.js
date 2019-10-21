/** 
 * @class AddClassOnScroll
 * @constructs directive
 * @description Add a class to an element when it is scrolled to
 *
 * @param {String} addClassOnScroll class name to add when scrolled to.
 * @param {String} scrollEvent scroll event to respond to eg: 'topEnterScreen'. Default: 'inView'.
 * @param {Number} scrollOffset offset the scroll position. If scrollOffset == 0.33, 
 *					event will be fired when element has moved 1/3 of the way into viewport. Default: 0.1;
 *
 * @example 
		`<div data-add-class-on-scroll="fade-in">Scroll to meeeee</div>`
 *
 * @requires ScrollMonitor
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */
	
function addClassOnScrollDirective($app) {
	return {
		data: {
			addClassOnScroll: undefined,
 			scrollEvent: 'inView',
 			scrollOffset: 0.1
		},
    link: function ($el, $scope, data) {
    	var scrollMonitor = new $app.ScrollMonitor(),
			scrollTracker = scrollMonitor.bind($el, 0, data.scrollOffset);
		scrollTracker.$on(data.scrollEvent, function () {
			$el.addClass(data.addClassOnScroll);
			scrollMonitor.unbind(scrollTracker);
		});
		scrollTracker.checkPosition();
		$scope.$on("$destroy", scrollMonitor.destroy);
    }
  };
}

addClassOnScrollDirective.$dependencies = ["$app"];

if (window.ARENA) ARENA.$directive("addClassOnScroll", addClassOnScrollDirective);
if (typeof module !== 'undefined') module.exports = addClassOnScrollDirective;
/** 
 * @class ViewportHeight
 * @constructs directive
 * @description Make an element height a percentage of viewport hight. Mimics behaviour of css VH property.
 * 
 * @param {Number} viewportHeight Percentage of viewport: Default: 100.
 * @param {Boolean} forceHeight Use 'height' property instead of 'min-height'. Default: false.
 * @param {Number|Element|String} offset Subtract pixels from the calculated viewportHeight and add margin.
 							If an element is provided the height of the element will be subtracted from calculated vh.
 							If a string is provided it will be used as a selector to find element and get height.
 * @param {Boolean} usePadding If true, space for offset will be created with padding instead of margin.
 *
 * @example 
		`<body>
				<header>
					<nav />
				</header>
				<div viewport-height="90" offset="header > nav"></div>
		 </body>`
 *
 * @requires $
 *
 * @author Nathan Johnson <professionalnathan@gmail.com>
 */

function viewportHeightDirective($) {
	var $window = $(window);
	return {
    data: {
			viewportHeight: 100,
			usePadding: false,
			forceHeight: false,
			offset: 0
		},
		link: function ($el, $scope, data) {
			var offsetProp = data.usePadding? 'padding-top' : 'margin-top'
				, heightProp = data.forceHeight || $el.is('[force-height]')? 'height' : 'min-height'
				, offset
				,	css = {};
			
			function upDateEl() {
				css[offsetProp] = offset()+"px";
				css[heightProp] = ($window.height()/100 * data.viewportHeight) - offset();
				$el.css(css);
			}
			
			if (typeof data.offset !== "number") {
				data.offset = $(data.offset);
				if(data.offset.length) offset = function () { return data.offset.height(); };
				else data.offset = function () { return 0; };
			} else {
				offset = function () { return data.offset; };
			}
			
			upDateEl();
			$window.on("resize", upDateEl);
			$scope.$on("$destroy", function () { $window.off("resize", upDateEl); });
    }
  };
}

viewportHeightDirective.$dependencies = ["$"];

if (window.ARENA) ARENA.$directive("viewportHeight", viewportHeightDirective);
if (typeof module !== 'undefined') module.exports = viewportHeightDirective;
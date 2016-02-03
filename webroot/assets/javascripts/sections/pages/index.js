window.CAKE.pages['pages-index'] = function($, window, document) {

	function set(g, h) {
		var e = document.getElementById(g),
			f = "rotate(" + h + "deg)";
		e.style.transform = f;
		e.style.webkitTransform = f
	};

	/**
	 * Run the script
	 *
	 * @return void
	 */
	function run() {
		set("hours", 30 * new Date().getHours());
		set("minutes", 6 * new Date().getMinutes());
		set("seconds", 10 * new Date().getSeconds());
	}

	return { run: run };

} (window.jQuery, window, document);
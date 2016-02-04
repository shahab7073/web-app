window.CAKE.pages['users-add'] = function($, window, document) {

	var $providerEl = $(document.getElementById('provider'));

	/**
	 * Run the script
	 *
	 * @return void
	 */
	function run() {
		
		$('.socials').on('click', 'a', function () {
			var provider = $(this).attr('data-provider');
			if (!provider) {
				return;
			}
			$providerEl.val(provider);
			document.forms[0].submit();
		});
	}

	return { run: run };

} (window.jQuery, window, document);
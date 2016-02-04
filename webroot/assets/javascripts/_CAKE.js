var pageId = document.body.getAttribute('id');

window.CAKE = window.CAKE || {};

if (CAKE.pages && CAKE.pages[pageId]) {
	CAKE.pages[pageId].run();
}

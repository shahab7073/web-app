//= require <jquery.min.js>
//= require <underscore-min.js>
//= require <jquery.blockUI.js>
//= require <jquery.requestAnimationFrame.min.js>
//= require <jquery.nanoscroller.min.js>
//= require <materialize.min.js>
//= require <Sortable.min.js>
//= require <jquery.dataTables.min.js>
//= require <dataTables.tableTools.min.js>

//= require <_con.min.js>
//= require "base.js"

//= require "pages/index.js"

var pageId = document.body.getAttribute('id');

window.CAKE = window.CAKE || {};

if (CAKE.pages && CAKE.pages[pageId]) {
	CAKE.pages[pageId].run();
}

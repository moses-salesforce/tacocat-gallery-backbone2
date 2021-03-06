/**
 * This is the initial javascript file that's called by HTML page.
 *
 * I set up and kick off the app
 */

// define the global variable 'app'
/*global app, $*/
window.app = {

	/**
	 * Containers for Backbone Models, Views, etc.
	 */
	Models: {},
	Collections: {},
	Views: {},
	Routers: {},

	/**
	 * Flag as to whether the system should be run offline.
	 * Only for development when disconnected.
	 */
	mock: false,

	/**
	 * The base of the URL for all JSON calls
	 */
	baseAjaxUrl: "http://tacocat.com/pictures/main.php?g2_view=",
	
	/**
	 * Helper function to set the browser title
	 */
	setTitle: function(title) {
		if (title) {
			document.title = title + " - Dean, Lucie, Felix and Milo Moses";
		}
		else {
			document.title = "Dean, Lucie, Felix and Milo Moses";
		}
	},

	/**
	 * Helper for managing templates
	 *
	 * @param templateId ID of template
	 * @param context - the model attributes, or whatever data you pass to a template
	 */
	renderTemplate : function(templateId, context) {
		//console.log("app.renderTemplate(["+templateId+"])");
		var template = this.getTemplate(templateId);
		//var template = Handlebars.getTemplate(templateId);
		if (!template) throw "Error retrieving template [" + templateId + "]";
		return template(context);
	},

	/**
	 * Return the compiled template
	 *
	 * @param templateId ID of template
	 */
	getTemplate : function(templateId) {
		if (Handlebars.templates === undefined || Handlebars.templates[templateId] === undefined) {
			//console.log("app.getTemplate("+templateId+"): fetching from server");
			$.ajax({
				url : 'templates/' + templateId + '.handlebars',
				async : false
			}).done(function(data) {
				if (Handlebars.templates === undefined) {
					Handlebars.templates = {};
				}
				Handlebars.templates[templateId] = Handlebars.compile(data);
			}).fail(function(data, textStatus, jqXHR) {
				throw "Failed to retrieve template [" + templateId + "]: " + jqXHR
			});
		}
		return Handlebars.templates[templateId];
	},

	/**
	 * Kick off the app.
	 *
	 * Called when HTML page is fully loaded
	 */
	init: function () {
		'use strict';
		//console.log('main.js Backbone app.init()');

		// Fetching this model will trigger a render of the authentication view,
		// which writes some CSS classes into the body tag
		app.Models.authenticationModel.fetch({
			error : function(model, xhr, options) {
				console.log("gallery.authentication.fetch() - error.  xhr: ", xhr);
			}
		});

		// Trigger the initial route 
		Backbone.history.start({ pushState: false /* turn on/off the HTML5 History API */});
	}
};

// Handles authentication of admins (aka Dean & Lucie) to 
// the tacocat menalto gallery PHP server
app.Models.authenticationModel = new Authentication.Model();

// Will write CSS classes into the body if the user is authenticated
app.Models.authenticationView = new Authentication.View({model:app.Models.authenticationModel});

// Get the firsts
app.Models.firstsModel = new Firsts.Model();
app.Models.firstsModel.fetch();

// Create the master router.  All navigation is triggered from this
app.Routers.main = new Router();

$(document).ready(function () {
    'use strict';
    app.init();
});

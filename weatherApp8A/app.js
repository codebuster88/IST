"use strict";

// using a function contructor form to create an object
function MyApp()
{
	var version = "8.2";

	// creating a private function
	function setStatus(message)
	{
		$("#app>footer").text(message);
	}

	// creating a public function
	this.start = function()
	{
		var $widget = $("#weather-widget");
		var widget = new WeatherWidget($widget);
		$("#getWeather").click(function (){
			widget.update();
		});
		$("#app>header").append(version);
		setStatus("ready");
	};
} // end MyApp

/* 	JQuery's shorthand for the document ready event handler
		could be written: $(document).ready(handler);

		When this page loads, we'll create a global variable
		named "app" by attaching it to the "window" object
		(part of the BOM - Browser Object Model)
*/
$(function() {
	window.app = new MyApp();
	window.app.start();
});

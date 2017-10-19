"use strict";

// using a function contructor form to create an object
function MyApp()
{
	var version = "v1.0";

	// creating a private function
	function setStatus(message)
	{
		$("#app>footer").text(message);
	}

	// creating a public function
	this.start = function()
	{
		$("#gButton").click(function(){
			guess();
		});
		$("#restart").click(function(){
			restart();
		});
		$("#app>header").append(version);
		setStatus("ready");
	};
	
	function guess(){
	var yg = document.getElementById("yg").value;
	var mn = document.getElementById("mn").value;
	document.getElementById('mn').setAttribute('readonly', 'readonly');
		if(mn === yg){
			document.getElementById("guess").innerHTML = '';
			document.getElementById('result').innerHTML = "<span style='color:green'>Your guess " + yg + " is correct! </span>";
		}
		else{
			document.getElementById('result').innerHTML += yg + "<span style='color:red'> is incorrect! Try again.<br>";
			document.getElementById("yg").value = '';
		}
	
	}

	function restart(){
		location.reload();
}

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
	/*$('#gButton').click(function(){
		window.app.guess();
	});
	
	$('#restart').click(function(){
		window.app.restart();
	});*/
	
	
	
});


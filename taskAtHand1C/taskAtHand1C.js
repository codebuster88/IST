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
function TaskAtHandApp(){

	var version = "v1.0", appStorage = new AppStorage("taskAtHand");

	function saveTaskList(){
		var tasks = [];
		$("#task-list .task span.task-name").each(function(){
			tasks.push($(this).text())
		});
		appStorage.setValue("taskList", tasks);
	}
	function loadTaskList(){
		var tasks = appStorage.getValue("taskList");
		if (tasks) {
			for (var i in tasks) {
				addTaskElement(tasks[i]);
			}
		}
	}

	function setStatus(message)
	{
		$("#app>footer").text(message);
	}

	this.start = function()
	{
		$("#new-task-name").keypress(function(e) {
			if (e.which == 13){
				addTask();
				return false;
			}

		})
		.focus();

		loadTaskList();

		$("#app>header").append(version);
		setStatus("ready");

	};

	function addTask()
	{
		var taskName = $("#new-task-name").val();
		if (taskName){
			addTaskElement(taskName);
			$("#new-task-name").val("").focus();
		}
	}

	function addTaskElement (taskName){
		var $task = $("#task-template .task").clone();
		$("span.task-name", $task).text(taskName);

		$("#task-list").append($task);

		$("button.delete", $task).click(function(){
			removeTask($task);
		});

		$("button.move-up", $task).click(function(){
			moveTask($task, true);
		});
		$("button.move-down", $task).click(function(){
			moveTask($task, false);
		});

		$("span.task-name", $task).click(function(){
			onEditTaskName($(this));
		});

		$("input.task-name", $task).change(function(){
			onChangeTaskName($(this));
		})
		.blur(function() {
				$(this).hide().siblings("span.task-name").show();
			});
	}
	function removeTask($task){
		$task.remove();
		saveTaskList();
	}
	function moveTask($task, moveUp){
		if (moveUp) {
			$task.insertBefore($task.prev());
		}
		else {
			$task.insertAfter($task.next());
		}
		saveTaskList();
	}


	function onEditTaskName($span){
			$span.hide()
				.siblings("input.task-name")
				.val($span.text())
				.show()
				.focus();
	}
	function onChangeTaskName($input){
			$input.hide();
			var $span = $input.siblings("span.task-name");
			if ($input.val()){
				$span.text($input.val());
			}
			$span.show();
		}
	function AppStorage(appName){
		var prefix = (appName ? appName + "." : "");
		this.localStorageSupported = (('localStorage' in window) && window['localStorage']);
		this.setValue = function(key, val){
			if (this.localStorageSupported)
				localStorage.setItem(prefix + key, JSON.stringify(val));
				return this;
		};
		this.getValue = function(key){
			if (this.localStorageSupported) {
					return JSON.parse(localStorage.getItem(prefix + key));
			} else return null;
		};
		this.removeValue = function(key){
			if (this.localStorageSupported)
						localStorage.removeItem(prefix + key);
						return this;
		};
		this.removeAll = function(){
			var keys = this.getKeys();
			for (var i in keys){
				this.remove(keys[i]);
			}
			return this;
		};
		this.getKeys = function(filter){
			var keys = [];
			if (this.localStorageSupported) {
				for (var key in localStorage) {
					if (isAppKey(key)) {
						if(prefix) key = key.slice(prefix.length);
						if (!filter || filter(key)) {
							keys.push(key);
						}
					}
				}
			}
			return keys;
		};

		function isAppKey(key){
			if (prefix) {
				return key.indexOf(prefix) == 0;
			}
			return true;
		};
		this.contains = function(key){
			return this.get(key) !== null;
		};



	}
}


$(function() {
	window.app = new TaskAtHandApp();
	window.app.start();
});

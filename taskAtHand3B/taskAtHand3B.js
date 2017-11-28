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

	var version = "v3.3", appStorage = new AppStorage("taskAtHand"),
	taskList = new TaskList(),
	timeoutId = 0;

	function saveTaskList(){
		// var tasks = [];
		// $("#task-list .task span.task-name").each(function(){
		// 	tasks.push($(this).text())
		// });
		if (timeoutId) clearTimeout (timeoutId); 
		setStatus("saving changes...", true);
		timeoutId = setTimeout (function (){
			appStorage.setValue("taskList", taskList.getTasks());
			//appStorage.setValue("nextTaskId", Task.nextTaskId);
			timeoutId = 0;
			setStatus("changes saved.");
		}, 2000);
	}
	function loadTaskList(){
		// if (tasks) {
		// 	for (var i in tasks) {
		// 		addTaskElement(tasks[i]);
		// 	}
		// }
		var tasks = appStorage.getValue("taskList");
		taskList = new TaskList(tasks);
		rebuildTaskList();
	}
	function rebuildTaskList(){
		$("#task-list").empty();
		taskList.each(function(task){
			addTaskElement(task);
		});
	}

	function setStatus(message, noFade)
	{
		$("#app>footer").text(message).show();
		if(!noFade){
			$("#app>footer").fadeOut(1000);
		}
	}

	this.start = function()
	{
		$("#theme").change(onChangeTheme);

		$("#new-task-name").keypress(function(e) {
			if (e.which == 13){
				addTask();
				return false;
			}

		})
		.focus();

		loadTheme();

		loadTaskList();

		$("#app>header").append(version);
		setStatus("ready");

	};

	function onChangeTheme() {
		var theme = $("#theme>option").filter(":selected").val();
		setTheme(theme);
		appStorage.setValue("theme",theme);
	}

	function setTheme(theme) {
		$("#theme-style").attr("href", "themes/" + theme + ".css");
	}

	function loadTheme() { 
		var theme = appStorage.getValue("theme");
		if (theme) {
			setTheme(theme);
			$("#theme>option[value=" + theme + "]").attr("selected", "selected");
		}
	 }

	function addTask()
	{
		var taskName = $("#new-task-name").val();
		if (taskName){
			var task = new Task(taskName);
			taskList.addTask(task);
			appStorage.setValue("nextTaskId", Task.nextTaskId);
			addTaskElement(task);
			saveTaskList();
			$("#new-task-name").val("").focus();
		}
	}

	function addTaskElement (task){
		var $task = $("#task-template .task").clone();
		$task.data("task-id", task.id);
		$("span.task-name", $task).text(task.name);
		$(".details input, .details select", $task).each(function (){
			var $input = $(this);
			var fieldName = $input.data("field");
			$input.val(task[fieldName]);
		});
		$(".details input, .details select", $task).change(function (){

			onChangeTaskDetails(task.id, $(this));
		});

		$("span.task-name", $task).text(task.name);

		$("#task-list").append($task);

		$("button.toggle-details", $task).click(function () {
			toggleDetails($task);
		});
		$task.click(function () {
			onSelectTask($task);
		});

		$("button.delete", $task).click(function(){
			removeTask(task, $task);
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

	function onChangeTaskDetails(taskId, $input) {
		var task = taskList.getTask(taskId);
		if (task){
			var fieldName = $input.data("field");
			task[fieldName] = $input.val();
			//newFunction(task, fieldName, $input);
			saveTaskList();
		}
	}

	function toggleDetails($task){
		$(".details", $task).slideToggle();
		$("button.toggle-details", $task).toggleClass("expanded");
	}
	
	function onSelectTask($task) {
		if ($task) {
			$task.siblings(".selected").removeClass("selected");
			$task.addClass("selected");
		}
	}

	function removeTask(taskId, $task){
		$task.remove();
		taskList.removeTask(taskId.id);
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
			saveTaskList();
	}
	function onChangeTaskName($input){
			$input.hide();
			var $span = $input.siblings("span.task-name");
			if ($input.val()){
				$span.text($input.val());
			}
			$span.show();
			saveTaskList();
		}
	

		function isAppKey(key){
			if (prefix) {
				return key.indexOf(prefix) == 0;
			}
			return true;
		};
		this.contains = function(key){
			return this.get(key) !== null;
		};
	function newFunction(task, fieldName, $input) {
	task[fieldName] = $input.val();
}
}


$(function() {
	window.app = new TaskAtHandApp();
	window.app.start();
});



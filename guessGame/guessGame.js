

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

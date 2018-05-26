/*********************************************************************************************/
/* Definition of Some Utility Functions used in Race class */
/*********************************************************************************************/

String.prototype.padLeft = function (stringToPad, length) {
	var str = this;
	while (str.length < length)
		str = stringToPad + str;
	return str;
}
String.prototype.toMinutesAndSeconds = function () {
	return this;
}

Date.prototype.toLogDateTimeString = function () {
	return String().concat(this.getDate(), '/',  this.getMonth().toString().padLeft("0", 2), '/',  this.getFullYear(), " @ ", this.getHours().toString().padLeft("0", 2), ":", this.getMinutes().toString().padLeft("0", 2), ":", this.getSeconds().toString().padLeft("0", 2), ".", this.getMilliseconds().toString().padLeft("4", 2));
}

Number.prototype.toMinutesAndSeconds = function(){
	var minutes = Math.floor(this / 60000),
		seconds = ((this % 60000) / 1000).toFixed(3);
	return (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

/*********************************************************************************************/
/* Definition of Class Race */
/*********************************************************************************************/
this.Race = function () {
	this.StartTime = null;
	this.EndTime = null;
	this.TotalDuration = null;
	this.Runners = new Array();

	this.Racing = false;
}

Race.prototype.start = function () {
	this.StartTime = new Date();
	this.Racing = true;
}

Race.prototype.stop = function () {
	this.EndTime = new Date();
	this.TotalDuration = this.EndTime - this.StartTime;
	this.Racing = false;
}

Race.prototype.reset = function () {
	this.StartTime = null;
	this.EndTime = null;
	this.TotalDuration = null;
	this.Runners = new Array();
	this.Racing = false;
}

Race.prototype.getResult = function () {
	var winner = {
		name: '',
		lapCount : '',
		lapAvgTime : ''
	},
	fastest = {
		name : '',
		lap : '',
		time : Number.MAX_VALUE
	};
	this.Runners.forEach(function(runner){
		if(runner.lapCount > winner.lapCount){
			winner = {
				name: runner.name,
				lapCount : runner.lapCount,
				lapAvgTime : runner.lapAvgTime
			};
		} else if(runner.lapCount == winner.lapCount){
			if(runner.lapAvgTime < winner.lapAvgTime){
				winner = {
					name: runner.name,
					lapCount : runner.lapCount,
					lapAvgTime : runner.lapAvgTime
				};
			}
		}

		if(runner.lapHistory.time < fastest.time ){
			fastest = {
				name : runner.name,
				lap : runner.lapHistory.lap,
				time : runner.lapHistory.time

			};
		}
	});

	if(fastest.time == Number.MAX_VALUE)  fastest.time = '';

	return {winner, fastest};
}
/*********************************************************************************************/
/* Definition of Class Runner */
/*********************************************************************************************/
this.Runner = function (id, name){
	this.id = id;
	this.name = name;
	this.lapCount = 0;
	this.lapTotalTime = 0;
	this.lapAvgTime = 0;
	this.lapLastTime = 0;

	this.lapHistory = {};

	this.lapLastStartTime = null;
}

Runner.prototype.LapCompleted = function(){
	this.lapCount++;
	if(this.lapLastStartTime == null){
		this.lapLastStartTime = app.race.StartTime;
	} 
	
	this.lapTotalTime = (new Date() - app.race.StartTime);
	this.lapAvgTime = this.lapTotalTime/this.lapCount;

	this.lapLastTime = new Date() - this.lapLastStartTime;
	if(this.lapHistory.hasOwnProperty('time')){
		if(this.lapHistory.time > this.lapLastTime){
			this.lapHistory = {
				lap : this.lapCount,
				time : this.lapLastTime
			};
		}
	} else{
		this.lapHistory = {
			lap : this.lapCount,
			time : this.lapLastTime
		};
	}

	this.lapLastStartTime = new Date();
}

/*********************************************************************************************/
/* Definition of Class App */
/*********************************************************************************************/
this.App = function(bRerender){
	this.race = new Race();
	this.race.reset();
}

App.prototype.controls = function(){
	var inputName = document.querySelector('#inputname'),
		btnAdd = document.querySelector('#btnAdd'),
		btnStr = document.querySelector('#btnStart'),
		btnEnd = document.querySelector('#btnEnd');

	function disableCounterBtns(flag){
		var counterBtns = document.getElementsByClassName('btn-warning');
		for(var i=0; i< counterBtns.length; i++){
			counterBtns[i].disabled = flag;
		}
	}

	inputName.addEventListener('keyup', function(evt){
		evt.preventDefault();
  		// Number 13 is the "Enter" key on the keyboard
  		if (evt.keyCode === 13) this.addName();
	}.bind(this));

	btnAdd.addEventListener('click', function(){
		btnAdd.disabled = false;
		btnStr.disabled = false;
		btnEnd.disabled = true;
		this.addName();
	}.bind(this));    
	btnStr.addEventListener('click', function(){
		inputName.readOnly = true;
		btnAdd.disabled = true;
		btnStr.disabled = true;
		btnEnd.disabled = false;
		disableCounterBtns(false);
		this.startRace();
	}.bind(this));    
	btnEnd.addEventListener('click', function(){
		inputName.readOnly = false;
		btnAdd.disabled = false;
		btnEnd.disabled = true;
		disableCounterBtns(true);
		this.endRace();
	}.bind(this));  
}

App.prototype.details = function(){
	var details = document.querySelector('.race-details'),
		el = details.cloneNode(false);
    details.parentNode.replaceChild(el, details);

	this.race.Runners.forEach(function(runner, index){
		var runnerEl = document.createElement('div'),
	    	counterBtn = document.createElement('button'),
	    	runnerCol1 = document.createElement('span'),
	    	runnerCol2 = document.createElement('span'),
	    	runnerCol3 = document.createElement('span'),
	    	runnerCol4 = document.createElement('span'),
	    	runnerCol5 = document.createElement('span');

	    function updateDetails(){
		    counterBtn.innerText = runner.name;
			runnerCol2.innerText = runner.lapCount;
			runnerCol3.innerText = runner.lapTotalTime.toMinutesAndSeconds();
			runnerCol4.innerText = runner.lapAvgTime.toMinutesAndSeconds();
			runnerCol5.innerText = runner.lapLastTime.toMinutesAndSeconds();
	    }
      	runnerEl.className = 'runner col-md-12 ' + ((index+1) % 2 > 0 ? 'odd-row' : 'even-row');
        runnerEl.id = 'runner_' + (index+1);

	    counterBtn.className = 'btn btn-warning';
	    counterBtn.disabled = true;
	    runnerCol1.className = 'column col_1';
		runnerCol2.className = 'column col_2';
		runnerCol3.className = 'column col_3 start_time';
		runnerCol4.className = 'column col_4';
		runnerCol5.className = 'column col_5';

		runnerCol1.appendChild(counterBtn);
		runnerEl.appendChild(runnerCol1);
		runnerEl.appendChild(runnerCol2);
		runnerEl.appendChild(runnerCol3);
		runnerEl.appendChild(runnerCol4);
		runnerEl.appendChild(runnerCol5);
        el.appendChild(runnerEl);

        updateDetails();

        counterBtn.addEventListener('click', function(){
        	if(app.race.Racing){
	        	runner.LapCompleted();
		        updateDetails();
        	}
        });

	});
}

App.prototype.updateInfo = function(){
	var result = this.race.getResult(),
		defaultDateFormat = '__/__/____ @ __:__:___.___';

	document.getElementById('winnername').innerHTML = result.winner.name + '<small> (Name)<small>';
	document.getElementById('winnerlapcount').innerHTML = result.winner.lapCount + '<small> (Total Laps)</small>';
	document.getElementById('winnerlapavgtime').innerHTML = result.winner.lapAvgTime.toMinutesAndSeconds() + '<small> (Average lap time)</small>';
	
	document.getElementById('fastestname').innerHTML = result.fastest.name + '<small> (Name)<small>';
	document.getElementById('fastestlap').innerHTML = result.fastest.lap + '<small> (Fastest Lap number)</small>';
	document.getElementById('fastesttime').innerHTML = result.fastest.time.toMinutesAndSeconds() + '<small> (Lap completed time)</small>';

	document.getElementById('racestarttime').innerText = (this.race.StartTime != null) ? this.race.StartTime.toLogDateTimeString() : defaultDateFormat;
	document.getElementById('raceendtime').innerText = (this.race.EndTime != null) ? this.race.EndTime.toLogDateTimeString() : defaultDateFormat;
}

App.prototype.addName = function(evt){
	var inputName = document.getElementById('inputname');
	if(!this.race.Racing && inputName.value.length > 0){
		this.race.Runners.push(new Runner(this.race.Runners.length+1, inputName.value));

		app.details();
		document.querySelector('#btnStart').disabled = false;
	}
	inputName.value = '';
	inputName.focus();

	this.updateInfo();
}

App.prototype.startRace = function(){
	this.race.start();
	this.updateInfo();
}

App.prototype.endRace = function(){
	this.race.stop();
	this.updateInfo();
	this.race.reset();
}
var app = null;
window.addEventListener('DOMContentLoaded', function(){
	app = new App();
	app.controls();
});

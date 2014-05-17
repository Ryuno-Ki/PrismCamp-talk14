// TODO: Sanity checks
// http://www.html5rocks.com/en/tutorials/file/dndfiles/
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

var fileInput  = document.getElementById('file-handler')
												 .addEventListener('change',handleFileSelect, false);

function handleFileSelect(e) {
				var file    = e.target.files[0];
				var reader = new FileReader();
				reader.readAsText(file);
				reader.onloadend = function() {
								var rows = CSV.parse(this.result);
								//handleCsvHeader(rows[0]);
								var users = {};
								var retw  = {};
								for (var row = 1; row < rows.length; ++row) {
												//handleCsvRow(rows[row]);
												var reply2user  = rows[row][2];
												var timestamp   = rows[row][3];
												var retweetUser = rows[row][7];
												if(!users[reply2user]) {
													users[reply2user] = 1;
												} else {
													users[reply2user]++;
												}
												if(!retw[retweetUser]) {
													retw[retweetUser] = 1;
												} else {
													retw[retweetUser]++;
												}
								}
								delete users[""];
								delete retw[""];
								var usersKeys   = Object.keys(users);
								var retwKeys    = Object.keys(retw);
								var commonKeys  = usersKeys.concat(retwKeys).unique();
								var uniqueUsers = commonKeys.diff(usersKeys);
								var uniqueRetw  = commonKeys.diff(retwKeys);
								var abstract = document.getElementById('file-viz');
								abstract.innerHTML = '<h5>Mit ' + usersKeys.length + ' Benutzern kommunziert, davon waren ' + uniqueUsers.length + ' einmalig.</h5>\n';
								abstract.innerHTML += '<h5>' + retwKeys.length + ' Benutzer retweetet, davon waren ' + uniqueRetw.length + ' einmalig.</h5>\n';
								/*
								csv2svg(rows[1]);
								csv2svg(rows[2]);
								*/
				}
};

function handleCsvHeader(csv) {
	var table = document.getElementById('file-output');
	var tr    = document.createElement('tr');
	var th    = document.createElement('th');
	var text  = document.createTextNode(csv[2]);
	th.appendChild(text);
	tr.appendChild(th);
	var th    = document.createElement('th');
	var text  = document.createTextNode(csv[3]);
	th.appendChild(text);
	tr.appendChild(th);
	var th    = document.createElement('th');
	var text  = document.createTextNode(csv[7]);
	th.appendChild(text);
	tr.appendChild(th);
	table.appendChild(tr);
};

function handleCsvRow(csv) {
	var table = document.getElementById('file-output');
	var tr    = document.createElement('tr');
	var td    = document.createElement('td');
	var text  = document.createTextNode(csv[2]);
	td.appendChild(text);
	tr.appendChild(td);
	var td    = document.createElement('td');
	var text  = document.createTextNode(csv[3]);
	td.appendChild(text);
	tr.appendChild(td);
	//console.log(d3.time.format('%Y-%m-%d %X %Z').parse(csv[3]))
	var td    = document.createElement('td');
	var text  = document.createTextNode(csv[7]);
	td.appendChild(text);
	tr.appendChild(td);
	table.appendChild(tr);
};

function csv2svg(csv) {
	var canvas = d3.select('#twitter-input')
								 .append('svg')
								 .attr('width', 500)
								 .attr('height', 500);
	var circle = canvas.append('circle')
										 .attr('cx', 250)
										 .attr('cy', 10)
										 .attr('r', 10)
										 .attr('fill', 'red');
	var label = canvas.append('g')
										.style('text-anchor', 'end');
	label.append('text')
			 .attr('class', 'label')
			 .text('Label');
};

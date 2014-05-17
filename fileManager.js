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
								}
								delete users[""];
								delete retw[""];
								var usersKeys   = Object.keys(users);
								var retwKeys    = Object.keys(retw);
								var commonKeys  = usersKeys.concat(retwKeys).unique();
								var uniqueUsers = commonKeys.diff(usersKeys);
								var uniqueRetw  = commonKeys.diff(retwKeys);
								var abstract = document.getElementById('file-viz');
								abstract.innerHTML = '<h5>Mit ' + usersKeys.length
																	 + ' Benutzern kommunziert, davon waren '
																	 + uniqueUsers.length + ' einmalig.</h5>\n';
								abstract.innerHTML += '<h5>' + retwKeys.length 
												           + ' Benutzer retweetet, davon waren ' 
																	 + uniqueRetw.length + ' einmalig.</h5>\n';
								csv2svg();
				}
};

function csv2svg() {
	var width    = 500;
	var height   = 500;
	var treshold = 30;
	d3.text('tweets/tweets.csv', function(raw) {
		var data   = d3.csv.parseRows(raw);
		var users  = [];
		var retw   = [];
		users['Sonstiges'] = 0;
		retw['Sonstiges']  = 0;
		var canvas = d3.select('#twitter-output').append('svg')
																						 .attr('width', width)
																						 .attr('height', height);
		canvas.append('rect').attr('class', 'background')
												 .attr('width', width)
												 .attr('height', height);
		canvas.append('g').attr('class', 'x axis');
		canvas.append('g').attr('class', 'y axis').append('line').attr('y1','100%');
	
		var calledData = canvas.selectAll('rect').data(data).enter();
		for (var row = 1; row < data.length; ++row) {
			var reply2user  = data[row][2];
			var timestamp   = data[row][3];
			var retweetUser = data[row][7];
			users = sumUpTweets(users, reply2user);
			retw  = sumUpTweets(retw, retweetUser);
		}
		delete users[""];
		delete retw[""];

		users = truncateTweets(users, treshold);
		retw = truncateTweets(retw, treshold);
		console.log(users);
		console.log(retw);
		var viz = document.getElementById('file-viz');
		viz.innerHTML = users['Max'].key + ' mit einem Wert von ' + users['Max'].val;
		calledData.append('rect').attr('y', function(d, i) {
			// i = line, d = data
			var keys = Object.keys(users);
			return 20;
		})
	});
};

function sumUpTweets(group, people) {
	if(!group[people]) {
		group[people] = 1;
	} else {
		group[people]++;
	}
	return group;
};

function truncateTweets(group, treshold) {
	var firstKey = Object.keys(group)[0];
	group['Max'] = {key: firstKey, val: group[firstKey]}
	
	for (twitterId in group) {
		if (group[twitterId] < treshold) {
			group['Sonstiges']++;
			delete group[twitterId];
			continue;
		}
		if (!isNumeric(twitterId) && group[twitterId] > group['Max'].val) {
			group['Max'].key = twitterId;
			group['Max'].val = group[twitterId];
		}
	}
	return group;
};

function isNumeric(obj) {
	return !isNaN(parseFloat(obj));
};

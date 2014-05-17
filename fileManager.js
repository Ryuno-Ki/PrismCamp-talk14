// TODO: Sanity checks
// http://www.htmlrocks.com/en/tutorials/file/dndfiles/
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
								csv2svg();
				}
};

function csv2svg() {
	var treshold = 30;
	d3.text('tweets/tweets.csv', function(raw) {
		var data   = d3.csv.parseRows(raw);

		var canvas = prepareCanvas();
		var users  = [];
		users['Sonstiges'] = 0;
		for (var row = 1; row < data.length; ++row) {
			var reply2user  = data[row][2];
			users = sumUpTweets(users, reply2user);
		}
		delete users[""];

		users = truncateTweets(users, treshold);
		visualize(canvas, users);

	  var canvas = prepareCanvas();
		var retw   = [];
		retw['Sonstiges']  = 0;
		for (var row = 1; row < data.length; ++row) {
			var retweetUser = data[row][7];
			retw  = sumUpTweets(retw, retweetUser);
		}
		delete retw[""];

		retw  = truncateTweets(retw, treshold);
		visualize(canvas, retw);
	});
};

function prepareCanvas() {
	var width    = 600;
	var height   = 600;
	var canvas = d3.select('#twitter-output').append('svg')
																					 .attr('width', width)
																					 .attr('height', height);
	canvas.append('rect').attr('class', 'background')
											 .attr('width', width)
											 .attr('height', height);
	canvas.append('g').attr('class', 'x axis');
	canvas.append('g').attr('class', 'y axis').append('line')
	return canvas;
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
		if (isNumeric(twitterId) && group[twitterId] > group['Max'].val) {
			group['Max'].key = twitterId;
			group['Max'].val = group[twitterId];
		}
	}
	return group;
};

function isNumeric(obj) {
	return !isNaN(parseFloat(obj));
};

function visualize(canvas, group) {
	var viz           = document.getElementById('file-viz');
	// Subtract Max, Sonstiges and the monkeypatched functions
	var keys          = [];
	var values        = [];
	var textYPosition = 20;
	for (key in group) {
		if (isNumeric(key)) {
			keys.push(key);
		}
	}
	for (key in group) {
		if (isNumeric(key)) {
			values.push(group[key]);
		}
	}
	var curr          = 0;
	var barSparse     = 10;
	var barWidth      = (600-keys.length*barSparse)/keys.length;
	var maxData       = group['Max'].val;
	var horBarDist    = barWidth + barSparse;
	var barHeight     = 600/maxData;
	var textXOffset   = horBarDist/2;
	var textYOffset   = 20;
	var calledData = canvas.selectAll('rect').data(values).enter();

	calledData.append('rect')
					  .attr('x', function(d) {
		curr++;
		return curr*horBarDist; })
					  .attr('y', function(d) {
		// current value: d
		return 600-d*barHeight;
	}).attr('width', function(d, i) {
		return barWidth;
	}).attr('height', function(d, i) {
		return d*barHeight;
	})

	curr = 0;
	calledData.append('text')
					  .text(function(d) {
		return d;
						}).attr('x', function(d) {
		curr++;
		return curr*horBarDist;
						}).attr('y', textYPosition)
							.style('text-anchor', 'end')
};

// TODO: Sanity checks
// http://www.html5rocks.com/en/tutorials/file/dndfiles/

var fileInput  = document.getElementById('file-handler')
												 .addEventListener('change',handleFileSelect, false);

function handleFileSelect(e) {
				var file    = e.target.files[0];
				var reader = new FileReader();
				reader.readAsText(file);
				reader.onloadend = function() {
								var rows = CSV.parse(this.result);
								handleCsvHeader(rows[0]);
								for (var row = 1; row < 5/*rows.length*/; ++row) {
												handleCsvRow(rows[row]);
								}
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
	console.log(d3.time.format('%Y-%m-%d %X %Z').parse(csv[3]))
	var td    = document.createElement('td');
	var text  = document.createTextNode(csv[7]);
	td.appendChild(text);
	tr.appendChild(td);
	table.appendChild(tr);
};

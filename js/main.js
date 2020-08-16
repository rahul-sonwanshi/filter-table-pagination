var showRows = 10;
var startRow = 0;
var rawData;
var filteredData =[];

fetch('../data/airports.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        rawData = data;
        filteredData =  rawData;
        populateTable(data, startRow, showRows);
    })
    .catch(error => console.log('error is', error));


function populateTable(data, startRow, showRows) {
    var table = document.getElementById('airportInfoTable');
    var paginationContent =  document.getElementById('paginationContent');
    let tStartRow = startRow+1;
    let tEndRow = tStartRow+showRows;

    paginationContent.innerHTML = 'Showing <span class="u-bold">' + tStartRow + '-' + (tEndRow < data.length ? tEndRow : data.length) + '</span> of <span class="u-bold">' + data.length + '</span> results';

    for(let i = startRow;i < startRow+showRows && i < data.length;i++) {
        var tr = document.createElement('tr');
        var tbody = document.getElementById('tableBody');
        tr.innerHTML = '<td>' + data[i].name + '</td>' +
            '<td>' + data[i].icao + '</td>' +
            '<td>' + data[i].iata + '</td>' +
            '<td>' + data[i].elevation + '</td>' +
            '<td>' + data[i].latitude + '</td>' +
            '<td>' + data[i].longitude + '</td>' +
            '<td>' + data[i].type + '</td>';
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    var tableContainer = document.getElementsByClassName('tableData')[0];
    tableContainer.setAttribute('style', 'max-height: '+showRows*8.33+'vh');
}

function filterTableByType() {
    filteredData = [];
    if(smallAT.checked || mediumAT.checked || largeAT.checked || heliportAT.checked || closedAT.checked || favoritesAT.checked) {
        for(let i = 0;i < rawData.length;i++) {
            if(smallAT.checked && rawData[i].type === "small") {
                filteredData.push(rawData[i]);
            }

            if(mediumAT.checked && rawData[i].type === "medium") {
                filteredData.push(rawData[i]);
            }

            if(largeAT.checked && rawData[i].type === "large") {
                filteredData.push(rawData[i]);
            }

            if(heliportAT.checked && rawData[i].type === "heliport") {
                filteredData.push(rawData[i]);
            }

            if(closedAT.checked && rawData[i].type === "closed") {
                filteredData.push(rawData[i]);
            }

            if(favoritesAT.checked && rawData[i].type === "favorities") {
                filteredData.push(rawData[i]);
            }
            startRow = 0;
        }

        clearTable();
        populateTable(filteredData, startRow, showRows);
    }
    else {
        filteredData = rawData;
        clearTable();
        populateTable(rawData, startRow, showRows);
    }
    
}

function filterBySearch() {
    var searchInp = document.getElementById('searchInp');
    console.log(searchInp.value);

    // for(let i = startRow;i < startRow+showRows && i < data.length;i++) {
    //     var tr = document.createElement('tr');
    //     var tbody = document.getElementById('tableBody');
    //     tr.innerHTML = '<td>' + data[i].name + '</td>' +
    //         '<td>' + data[i].icao + '</td>' +
    //         '<td>' + data[i].iata + '</td>' +
    //         '<td>' + data[i].elevation + '</td>' +
    //         '<td>' + data[i].latitude + '</td>' +
    //         '<td>' + data[i].longitude + '</td>' +
    //         '<td>' + data[i].type + '</td>';
    //     tbody.appendChild(tr);
    // }
}


function clearTable() {
    var tbody = document.getElementById('tableBody');
    tbody.innerHTML = "";
}

function previousAction() {
    if(startRow != 0) {
        startRow-= showRows;
    }
    clearTable();
    populateTable(filteredData, startRow, showRows);
}

function nextAction() {
    if(startRow+showRows < filteredData.length) {
        startRow+= showRows;
    }
    clearTable();
    populateTable(filteredData, startRow, showRows);
}
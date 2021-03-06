var showRows = 4; // You can change this value to show more rows
var startRow = 0; // Used to indicate start of pagination
var rawData; // data fetched from the server
var filteredData = []; // filtered data
var pseudofilteredDataBySearch = []; // search filtered data by search input
var pseudofilteredDataByType = []; // search filtered data by type

fetch('https://rahul-sonwanshi.github.io/filter-table-pagination/data/airports.json')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        rawData = data;
        filteredData =  rawData;
        populateTable(data, startRow, showRows);
    })
    .catch(error => console.log('error is', error));


function populateTable(data, startRow, showRows) {
    try {
        var table = document.getElementById('airportInfoTable');
        var paginationContent =  document.getElementById('paginationContent');
        let tStartRow = startRow+1;
        let tEndRow = tStartRow+showRows;

        // generating pagination bar
        paginationContent.innerHTML = 'Showing <span class="u-bold">' + tStartRow + '-' + (tEndRow < data.length ? tEndRow : data.length) + '</span> of <span class="u-bold">' + data.length + '</span> results';

        // generating table body
        for(let i = startRow;i < startRow+showRows && i < data.length;i++) {
            var tr = document.createElement('tr');
            var tbody = document.getElementById('tableBody');
            tr.innerHTML = '<td>' + data[i].name + '</td>' +
                '<td>' + data[i].icao + '</td>' +
                '<td>' + data[i].iata + '</td>' +
                '<td>' + data[i].elevation + '</td>' +
                '<td>' + convertToDms(data[i].latitude, false) + '</td>' +
                '<td>' + convertToDms(data[i].longitude, true) + '</td>' +
                '<td>' + data[i].type + '</td>';
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        var tableContainer = document.getElementsByClassName('tableData')[0];
        tableContainer.setAttribute('style', 'max-height: '+showRows*8.33+'vh');
    }
    catch(err) {
        console.log("error is : "+err);
    }

}

function filterTableByType() {
    filteredData = [];
    let tFilteredData = [];
    //assuming search is made
    if(pseudofilteredDataBySearch.length != 0) {
        tFilteredData = pseudofilteredDataBySearch;
    }
    else {
        tFilteredData = rawData;
    }
    if(smallAT.checked || mediumAT.checked || largeAT.checked || heliportAT.checked || closedAT.checked || favoritesAT.checked) {
        for(let i = 0;i < tFilteredData.length;i++) {
            if(smallAT.checked && tFilteredData[i].type === "small") {
                filteredData.push(tFilteredData[i]);
            }

            if(mediumAT.checked && tFilteredData[i].type === "medium") {
                filteredData.push(tFilteredData[i]);
            }

            if(largeAT.checked && tFilteredData[i].type === "large") {
                filteredData.push(tFilteredData[i]);
            }

            if(heliportAT.checked && tFilteredData[i].type === "heliport") {
                filteredData.push(tFilteredData[i]);
            }

            if(closedAT.checked && tFilteredData[i].type === "closed") {
                filteredData.push(tFilteredData[i]);
            }

            if(favoritesAT.checked && tFilteredData[i].type === "favorities") {
                filteredData.push(tFilteredData[i]);
            }
            startRow = 0;
        }

        pseudofilteredDataByType = filteredData;
        clearTable();
        populateTable(filteredData, startRow, showRows);
    }
    else {
        filteredData = tFilteredData;
        pseudofilteredDataByType = [];
        clearTable();
        populateTable(filteredData, startRow, showRows);
    }
    
}

function filterBySearch() {
    try {
        var searchInp = document.getElementById('searchInp');
        
        let searchVal = searchInp.value.toString().toLowerCase();

        pseudofilteredDataBySearch = rawData;
        filteredData = [];
        let tFilteredData = [];

        //assuming search is made
        if(pseudofilteredDataByType.length != 0) {
            tFilteredData = pseudofilteredDataByType;
        }
        else {
            tFilteredData = rawData;
        }

        if(searchVal) {
            
            for(let i = 0;i < tFilteredData.length; i++) {
                if(tFilteredData[i].name.toLowerCase().indexOf(searchVal) > -1) {
                    filteredData.push(tFilteredData[i]);
                }
                else if(String(tFilteredData[i].icao).toLowerCase().indexOf(searchVal) > -1) {
                    filteredData.push(tFilteredData[i]);
                }
                else if(String(tFilteredData[i].iata).toLowerCase().indexOf(searchVal) > -1) {
                    filteredData.push(tFilteredData[i]);
                }
                else if(tFilteredData[i].elevation.toString().toLowerCase().indexOf(searchVal) > -1) {
                    filteredData.push(tFilteredData[i]);
                }
                else if(convertToDms(tFilteredData[i].latitude, false).toString().toLowerCase().indexOf(searchVal) > -1) {
                    filteredData.push(tFilteredData[i]);
                }
                else if(convertToDms(tFilteredData[i].longitude, true).toString().toLowerCase().indexOf(searchVal) > -1) {
                    filteredData.push(tFilteredData[i]);
                }
            }

            //assuming
            pseudofilteredDataBySearch = filteredData;
            startRow = 0;
            clearTable();
            // console.log(filteredData);
            populateTable(filteredData, startRow, showRows);
        }
        else {
            pseudofilteredDataBySearch = [];
            filteredData = tFilteredData;
            startRow = 0;
            clearTable();
            // console.log(filteredData);
            populateTable(filteredData, startRow, showRows);
        }
        
    }
    catch(err) {
        console.log("error is : "+err);
    }
    
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

function convertToDms(dd, isLng) { // isLng is it a Longitude to determine W / S
    var dir = dd < 0
      ? isLng ? 'W' : 'S'
      : isLng ? 'E' : 'N';
  
    var absDd = Math.abs(dd);
    var deg = absDd | 0;
    var frac = absDd - deg;
    var min = (frac * 60) | 0;
    var sec = frac * 3600 - min * 60;
    // Round it to 2 decimal points.
    sec = Math.round(sec * 100) / 100;
    return dir + deg + "°" + min + "'" + sec + '"';
}
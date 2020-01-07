(function() {
    csv_injectButton();
})();

function csv_injectButton()
{
    var addBtn = $('#travelHistoryItems').find('#saveAndAddBtn')[0];

    var butt = document.createElement('input');
    butt.id = "travelhistory-file-button";
    butt.type = 'file';
    butt.style.cssText = "width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; position: absolute; z-index: -1;";
    butt.addEventListener('change', csv_uploadFile);

    var labl = document.createElement('label');
    labl.className = addBtn.className;
    labl.innerHTML = "Choose a .csv file";
    labl.htmlFor = "travelhistory-file-button";

    addBtn.parentNode.insertBefore(butt, addBtn.nextSibling);
    addBtn.parentNode.insertBefore(labl, addBtn.nextSibling);
}

function csv_uploadFile(files)
{
    var file = this.files[0];

    var reader = new FileReader()
    reader.onload = function(progressEvent){
        var gridId = 'travelHistoryItems'; 
        var divId = 'travelHistoryItemsContent';
        var lastIndex = $('#tblAppendGrid_travelHistoryItems').appendGrid('getRowCount');
        var lines = this.result.split('\n');
        for(var i = 0; i < 50 - lastIndex ; i++){
            // Regex to match cities. Can't use split
            var arr = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
            arr = arr || [];

            var countryName = arr[0].replace(/['"]+/g, '');
            var countryLovId = csv_getLovIdForCountryName(countryName);
            if (countryLovId === -1)
            {
              countryName = "PROBLEM HERE";
            }
            var item = getElement("#tblAppendGrid_travelHistoryItems");
            item.appendGrid('appendRow', [
                {
                    arrivalDate: csv_prepareDate(arr[2]),
                    departureDate: csv_prepareDate(arr[1]),
                    divCol: "travelHistoryItemsContent",
                    isOngoing: "false",
                    selected: "false",
                    travellingPurpose: arr[4].replace(/['"]+/g, ''),
                    visitingCity: arr[3].replace(/['"]+/g, ''),
                    visitingCountry: countryName
                }
            ]);

            var countryCtrl = item.appendGrid("getCellCtrl", "visitingCountry", lastIndex + i);
            countryCtrl.setAttribute("data-lovid", countryLovId);
        }
        // update on page
        validateAgainstServer(0, gridId, divId);
        updateGrid(gridId);
    };

    reader.readAsText(file);
}

function csv_prepareDate(oldDate)
{
    return oldDate.split('.').reverse().join('-');
}

function csv_getLovIdForCountryName(country)
{
    var visCountry = $("#visitingCountry").find("option").filter(function (index, elem) {
        return elem.text === country.replace(/['"]+/g, '');
    });

    if (visCountry.length == 0)
    {
        alert("WRONG COUNTRY FORMAT: " + country);
        return -1;
    }

    return visCountry[0].value;
}

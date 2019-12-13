(function() {
    var addBtn = $('#travelHistoryItems').find('#saveAndAddBtn')[0];

    var butt = document.createElement('input');
    butt.id = "travelhistory-file-button";
    butt.type = 'file';
    butt.style.cssText = "width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; position: absolute; z-index: -1;";
    butt.addEventListener('change', foo);

    var labl = document.createElement('label');
    labl.className = addBtn.className;
    labl.innerHTML = "Choose a .csv file";
    labl.htmlFor = "travelhistory-file-button";

    addBtn.parentNode.insertBefore(butt, addBtn.nextSibling);
    addBtn.parentNode.insertBefore(labl, addBtn.nextSibling);

    $(document).ajaxSuccess(function(event, xhr, settings) {
        if (settings.url.match(/^\/eapp\/loadData.do.*/) != null)
        {
            insertUpDownButtons();
        }
    });
})();

function foo()
{
    uploadFile(this.files);
}

function insertUpDownButtons()
{
    var rowCount = $('#tblAppendGrid_travelHistoryItems').appendGrid('getRowCount');

    for(var i = 1; i <= rowCount ; i++){
        deleteButtonId = '#travelHistoryItems_Delete_' + i.toString();
        var deleteButton = $('#travelHistoryItems').find(deleteButtonId)[0];

        var buttonUp = document.createElement('input');
        buttonUp.type = 'button';
        buttonUp.className = deleteButton.className;
        buttonUp.value = "\u21E7";
        buttonUp.addEventListener('click', moveGridRowUp);

        var buttonDown = document.createElement('input');
        buttonDown.type = 'button';
        buttonDown.value = "\u21E9";
        buttonDown.className = deleteButton.className;
        buttonDown.addEventListener('click', moveGridRowDown);

        deleteButton.parentNode.insertBefore(buttonUp, deleteButton.nextSibling);
        buttonUp.parentNode.insertBefore(buttonDown, buttonUp.nextSibling);
    }
}

function getRowNumber(evtObj)
{
    return evtObj.path[2].rowIndex - 1;
}

function moveGridRowUp(evtObj, uniqueIndex, rowData) {
	var rowIndex = getRowNumber(evtObj);
    var item = getItem("#tblAppendGrid_travelHistoryItems");
    item.appendGrid('moveUpRow', rowIndex);
}

function moveGridRowDown(evtObj)
{
	var rowIndex = getRowNumber(evtObj);
    var item = getItem("#tblAppendGrid_travelHistoryItems");
    item.appendGrid('moveDownRow', rowIndex);
}

function getItem(selector)
{
    return $(selector);
}

function uploadFile(files)
{
    var file = files[0];

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
            var countryLovId = getLovIdForCountryName(countryName);
            if (countryLovId === -1)
            {
              countryName = "PROBLEM HERE";
            }
            var item = getItem("#tblAppendGrid_travelHistoryItems");
            item.appendGrid('appendRow', [
                {
                    arrivalDate: prepareDate(arr[2]),
                    departureDate: prepareDate(arr[1]),
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
            // add to page
            validateAgainstServer(0, gridId, divId);
     	    updateGrid(gridId);
    };

    reader.readAsText(file);
}

function prepareDate(oldDate)
{
    return oldDate.split('.').reverse().join('-');
}

function getLovIdForCountryName(country)
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

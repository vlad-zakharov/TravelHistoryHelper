(function() {
    $(document).ajaxSuccess(function(event, xhr, settings) {
        if (settings.url.match(/^\/eapp\/loadData.do.*/) != null)
        {
            insertUpDownButtons();
        }
    });
})();

function insertUpDownButtons()
{
    var allGrids = getElement('table[id^="tblAppendGrid"]');
    allGrids.each(function(index, gridHTML){
        var currentDiv = gridHTML.id.split('_')[1].toString();
        var gridId = "#" + gridHTML.id;
        var gridEl = getElement(gridId);
        var rowCount = gridEl.appendGrid('getRowCount');

        for(var i = 1; i <= rowCount ; i++){
            deleteButtonId = '#' + currentDiv + '_Delete_' + i.toString();
            var deleteButton = $(deleteButtonId)[0];

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
    });

}

function getRowNumber(evtObj)
{
    return evtObj.path[2].rowIndex - 1;
}

function getGridId(evtObj)
{
    return '#' + evtObj.path[4].id;
}

function moveGridRowUp(evtObj, uniqueIndex, rowData) {
	var rowIndex = getRowNumber(evtObj);
    var item = getItem(getGridId(evtObj));
    item.appendGrid('moveUpRow', rowIndex);
}

function moveGridRowDown(evtObj)
{
    var rowIndex = getRowNumber(evtObj);
    var item = getItem(getGridId(evtObj));
    item.appendGrid('moveDownRow', rowIndex);
}

function getItem(selector)
{
    return $(selector);
}


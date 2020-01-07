(function() {
    $(document).ajaxSuccess(function(event, xhr, settings) {
        if ((settings.url.match(/^\/eapp\/loadData.do.*/) != null) ||
            (settings.url.match(/^\/eapp\/showNext.do.*/) != null))
        {
            upb_insertUpDownButtons();
            // if we can insert csv button and if it is not present. Workaround
            if (typeof csv_injectButton !== 'undefined' && $("#travelhistory-file-button").length == 0){
                csv_injectButton();
            }
        }
    });
})();

function upb_insertUpDownButtons()
{
    var allGrids = getElement('table[id^="tblAppendGrid"]');
    allGrids.each(function(index, gridHTML){
        var currentDiv = gridHTML.id.split('_')[1].toString();
        var gridId = "#" + gridHTML.id;
        var gridEl = getElement(gridId);
        var rowCount = gridEl.appendGrid('getRowCount');

        for(var i = 1; i <= rowCount ; i++){
            deleteButtonId = '#' + currentDiv + '_Delete_' + i.toString();
            buttonUpId = currentDiv + '_Up_' + i.toString();
            buttonDownId = currentDiv + '_Down_' + i.toString();
            var deleteButton = $(deleteButtonId)[0];

            if (!deleteButton || $('#' + buttonUpId).length > 0){
                continue;
            }

            var buttonUp = document.createElement('input');
            buttonUp.id = buttonUpId;
            buttonUp.type = 'button';
            buttonUp.className = deleteButton.className;
            buttonUp.value = "\u21E7";
            buttonUp.disabled = deleteButton.disabled;
            if (!buttonUp.disabled){
                buttonUp.addEventListener('click', upb_moveGridRowUp);
            }

            var buttonDown = document.createElement('input');
            buttonDown.id = buttonDownId;
            buttonDown.type = 'button';
            buttonDown.value = "\u21E9";
            buttonDown.className = deleteButton.className;
            buttonDown.disabled = deleteButton.disabled;
            if (!buttonDown.disabled){
                buttonDown.addEventListener('click', upb_moveGridRowDown);
            }

            deleteButton.parentNode.insertBefore(buttonUp, deleteButton.nextSibling);
            buttonUp.parentNode.insertBefore(buttonDown, buttonUp.nextSibling);
        }
    });

}

function upb_getRowNumber(evtObj)
{
    return evtObj.path[2].rowIndex - 1;
}

function upb_getGridId(evtObj)
{
    return '#' + evtObj.path[4].id;
}

function upb_moveGridRowUp(evtObj, uniqueIndex, rowData) {
    var rowIndex = upb_getRowNumber(evtObj);
    var item = getElement(upb_getGridId(evtObj));
    item.appendGrid('moveUpRow', rowIndex);
}

function upb_moveGridRowDown(evtObj)
{
    var rowIndex = upb_getRowNumber(evtObj);
    var item = getElement(upb_getGridId(evtObj));
    item.appendGrid('moveDownRow', rowIndex);
}


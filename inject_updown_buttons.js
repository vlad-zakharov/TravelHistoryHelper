(function() {
    $(document).ajaxSuccess(function(event, xhr, settings) {
        if (settings.url.match(/^\/eapp\/loadData.do.*/) != null)
        {
            upb_insertUpDownButtons();
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
            var deleteButton = $(deleteButtonId)[0];

            var buttonUp = document.createElement('input');
            buttonUp.type = 'button';
            buttonUp.className = deleteButton.className;
            buttonUp.value = "\u21E7";
            buttonUp.addEventListener('click', upb_moveGridRowUp);

            var buttonDown = document.createElement('input');
            buttonDown.type = 'button';
            buttonDown.value = "\u21E9";
            buttonDown.className = deleteButton.className;
            buttonDown.addEventListener('click', upb_moveGridRowDown);

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


var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject_upload_csv.js');
s.onload = function() {
    this.remove();
};

(document.head || document.documentElement).appendChild(s);

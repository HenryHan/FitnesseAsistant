function InitLibrary(){
	var fs = document.createElement('frameset'),
    f1 = document.createElement('frame'),
    f2 = document.createElement('frame');
    fs.cols = "70%,30%";
    f1.name = "center";
    f1.src = window.location.href;
    f2.name = "rightframe";
    f2.src = chrome.extension.getURL ("content.html")+"?"+window.location.href.split("?")[0];
    fs.appendChild(f1);
    fs.appendChild(f2);
    $("body").replaceWith(fs); 
}
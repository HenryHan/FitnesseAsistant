function activate(){
	if(localStorage['isactivate']==1){
		$("#sidebar").remove();
		$('body').css({
		'padding-right': ''
		});
		$('nav').css({
		'padding-right': ''
		});
		localStorage['isactivate']=0;
	}
	else{
	  var sidebar;
	  $('body').css({
		'padding-right': '30%'
	  });
	  $('nav').css({
		'padding-right': '30%'
	  });
	  var src=chrome.extension.getURL ("content.html")+"?"+window.location.href.split("?")[0];
	sidebar = $("<div id='sidebar'><iframe id='right' src='"+src+"' style='height:100%;visibility:inherit;width:100%;z-index:1'></iframe></div>");
	  sidebar.css({
		'position': 'fixed',
		'right': '0px',
		'top': '0px',
		'z-index': 9999,
		'width': '30%',
		'height': '100%',
	  });
	  $('body').append(sidebar);
	  localStorage['isactivate']=1;
	}
}
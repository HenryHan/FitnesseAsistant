$(document).ready(function() {
	$("p.scenario_head,p.section_head,p.page_head").click(function() {
                $(this).next("div.Toggle_body").slideToggle(300);

    });
	
	$("#GenerateAndCopy").click(function() {
		var url=window.location.href.split("?")[1];
		$.get(url,function(data,status){
			if(status=="success"){
				console.log(data);
			}
			else{
				console.log("failed to fetch the content");
			}
			
		});
	});
})

function getScenarios(url){
	$.get(url,function(data,status){
			if(status=="success"){
				var scenarios = [];
				$(data).find("table:contains('comment:')").each(function (rowIndex, r) {
					var tds=$(this).find('td');
					matches=tds[0].textContent.match(/comment:\s*parameters for (\S*)/);
					if(matches){
						var scenario = {name:matches[1],parameters:[]};
						if(tds.length%5==1){
							for (var i=0;i<(tds.length-6)/5;i++){
								var parameter=new Object();
								parameter["Name"]=tds[i*5+6].textContent;
								parameter["Mandatory"]=tds[i*5+7].textContent;
								parameter["Type"]=tds[i*5+8].textContent;
								parameter["Example"]=tds[i*5+9].textContent;
								parameter["Remark"]=tds[i*5+10].textContent;
								scenario.parameters.push(parameter);
							}
						}
						scenarios.push(scenario);
					}
					
					
				});
				for (var i=0;i<scenarios.length;i++){
					renderScenario(scenarios[i]);
				}
				
			}
			else{
				console.log("failed to fetch the content");
			}
			
		});
}
function renderScenario(scenario){
	var scenario_div=$("#scenario_template").clone(true);
	scenario_div.removeAttr("hidden");
	scenario_div.removeAttr("id");
	scenario_div.find("label.scenario_title").text(scenario["name"]);
	var table=scenario_div.find("table.parameters");
	var rows="";
	for (var i=0;i<scenario.parameters.length;i++){
		rows+=renderParameter(scenario.parameters[i]);
	}
	table.html(rows);
	$("body").append(scenario_div);
}
function renderParameter(parameter){
	required="";
	if(parameter["Mandatory"].toLowerCase()=="yes"){
		required='<label style="color: red;">*</label>';
	}
	var input=$($.parseHTML('<div><input class="Parameter"/></div>')).children().attr("name", parameter["Name"]).attr("value",parameter["Example"]);
	var tr='<tr><td>'+parameter["Name"]+required+'</td><td>'+input.parent().html()+'</td><td>('+parameter["Remark"]+')</td></tr>';
	return tr;
}
$(document).ready(function() {
	$("p.scenario_head,p.section_head,p.page_head").click(function() {
                $(this).next("div.Toggle_body").slideToggle(300);

    });
	var url=window.location.href.split("?")[1];
	$("#url").val(url);
	$("#Find").click(function() {
		getScenarios($("#url").val());
	});
	$(".GenerateAndCopy").click(function() {
		var title=$(this).siblings("p.scenario_head").children("label.scenario_title").text();
		var hash="";
		var paras=$(this).siblings("div.Toggle_body").find(".Parameter").each(function(){
			  if($(this).val()){
				  hash+=$(this).attr("name")+":"+$(this).val()+",";
			  }
			}
		);
		if(hash.length==0)
		{
			alert("include at least one parameter!");
		}
		else{
			var code="|"+title+"|!{"+hash.substring(0,hash.length-1)+"}|";
			$(this).siblings("label.code").text(code);
			$(this).attr("data-clipboard-text",code);
			new Clipboard('.GenerateAndCopy');
		}
	});
})

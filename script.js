function getData(url){
	$.get(url,function(data,status){
			if(status=="success"){
				var page_count=0;
				$(data).find("p.title:contains('Included page:')").each(function(){
					
					matches=$(this).text().match(/Included page:\s*([A-Za-z0-9\.<]*)/);
					if(matches&&matches[1]){
						var page_name=matches[1];
						var library_body=$(this).next().clone();
						library_body.find("p.title:contains('Included page:')").next().remove();
						var scenarios=getScenarios(library_body);
						if(scenarios.length>0){
							var page_div=$("#page_template").clone(true);
							page_div.removeAttr("hidden");
							page_div.removeAttr("id");
							page_div.find("label.page_title").text(page_name);
							$("body").append(page_div);
							page_count++;
							var container=page_div.find("div.Toggle_body");
							for (var i=0;i<scenarios.length;i++){
								renderScenario(container,scenarios[i]);
							}
							
						}	
					}
				});
				if(page_count==0){
					$("body").append($("<p>No Scenario is found on current page!</p>"));
				}
			}
			else{
				console.log("failed to fetch the content");
			}
			
		});
}

function getScenarios(obj){
	
	var scenarios = [];
	obj.find("table:contains('comment:')").each(function (rowIndex, r) {
					
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
    console.log(scenarios);
	return scenarios;
}

function renderScenario(div,scenario){
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
	div.append(scenario_div);
}
function renderParameter(parameter){
	required="";
	if(parameter["Mandatory"].toLowerCase()=="yes"){
		required='<label style="color: red;">*</label>';
	}
	var input=$($.parseHTML('<div><input class="Parameter" style="width: 100%;"/></div>')).children().attr("name", parameter["Name"]).attr("title", parameter["Remark"]).attr("value",parameter["Example"]);
	var tr='<tr><td>'+parameter["Name"]+required+'</td><td>'+input.parent().html()+'</td></tr>';
	return tr;
}
$(document).ready(function() {
	$("p.scenario_head,p.section_head,p.page_head").click(function() {
                $(this).next("div.Toggle_body").slideToggle(300);

    });
	var url=window.location.href.split("?")[1];
	$("#url").val(url);
	$("#Find").click(function() {
		getData($("#url").val());
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

function getData(url){
	$("div:visible").remove();
	var group=url.split("/")
	var path=group[group.length-1]
	var base=url.substring(0,(url.length-path.length))
	var base_length=base.length
	var arr=path.split(".")
	var page_count=0;
	var lib_name=""
	for (i in arr){
		base=base+arr[i]+".";
		liburl=base+"ScenarioLibrary";
		lib_name=liburl.substring(base_length,liburl.length)
		processUrl(liburl,lib_name)
	}
}
function processUrl(liburl,lib_name){
$.get(liburl,function(data,status){
				if($(data).find("table").text()){
					var library_div=$("#library_template").clone(true);
					library_div.removeAttr("hidden");
					library_div.removeAttr("id");
					library_div.find("label.page_title").text(lib_name);
					$("body").append(library_div);
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
								library_div.find("div.Lib_Toggle_body").append(page_div);
								
								var container=page_div.find("div.Page_Toggle_body");
								for (var i=0;i<scenarios.length;i++){
									renderScenario(container,scenarios[i]);
								}
								
							}	
						}
					});
				}
				else{
					console.log("failed to fetch the content from the url:"+liburl);
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
	$("p.scenario_head,p.section_head,p.page_head,p.library_head").click(function() {
                $(this).next("div.Page_Toggle_body").slideToggle(300);
				$(this).next("div.Lib_Toggle_body").slideToggle(300);
				$(this).next("div.Para_Toggle_body").slideToggle(300);
    });
	var url=document.referrer.split("?")[0];
	$("#url").val(url);
	getData($("#url").val());
	$("#Find").click(function() {
		getData($("#url").val());
	});
	$(".GenerateAndCopy").click(function() {
		var title=$(this).siblings("p.scenario_head").children("label.scenario_title").text();
		var hash="";
		var paras=$(this).siblings("div.Para_Toggle_body").find(".Parameter").each(function(){
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

$(document).ready(function() {
	$("#test").val(window.location.href);
	$(".scenario p.scenario_head").click(function() {
                $(this).next("div.scenario_body").slideToggle(300);

    });
})

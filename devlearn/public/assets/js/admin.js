$(document).ready(function(){
	$("button#delUsr").click(function(e){
		var user = $(this).attr("data");
		var alert = $("div#alertAdmin");
		$.ajax({
			url:"/admin/delUsr/"+user,
			method:"DELETE",
			success:function(res){
				$("html, body").animate({scrollTop:"0px"});
				if(!res.toString().includes("Error")){
					alert.addClass("alert-success");
          alert.html("<strong>"+res.toString()+"</strong>");
					delay(alert);
				}else{
					alert.addClass("alert-danger");
					alert.html("<strong>"+res.toString()+"</strong>");
				}

			}
		});
	});

	$("button#chgeUsr").click(function(e){
		var user = $(this).attr("data");
		var alert = $("div#alertAdmin");
		$.ajax({
			url:"/admin/chgeUsr/"+user,
			method:"POST",
			success:function(res){
				$("html, body").animate({scrollTop:"0px"});
				if(!res.toString().includes("Error")){
					alert.addClass("alert-success");
          alert.html("<strong>"+res.toString()+"</strong>");
					delay(alert);
				}else{
					alert.addClass("alert-danger");
					alert.html("<strong>"+res.toString()+"</strong>");
				}
			}
		});
	});
	$("button#editUsr").click(function(){
			var div = $("div#editAcct");
			div.show();
			var user = $(this).attr("data");
	});

	$("button#addNewAcct").click(function(){
		var div = $("div#newAcct");
		div.show();

	});
	/*
	$("button#editUsr").click(function(e){
		var user = $(this).attr("data1");
		var alert = $("div#alertAdmin");
		$.ajax({
			url:"/admin/editUsr/"+user,
			method:"POST",
			success:function(res){
				$("html, body").animate({scrollTop:"0px"});
				if(!res.toString().includes("Error")){
					alert.addClass("alert-success");
          alert.html("<strong>"+res.toString()+"</strong>");
					delay(alert);
				}else{
					alert.addClass("alert-danger");
					alert.html("<strong>"+res.toString()+"</strong>");
				}
			}
		});


	});
*/
/*  $("a#delUsr").onclick(function(e){
    var data = {"username":"test"};
    $.ajax({
        url:"/admin/usr",
        data:data,
        method:"DELETE",
        success:function(res){
          if(!res.toString().includes("Error")){
            $("div#editup").hide();
            location.reload();
          }else{
            alert.addClass("alert-danger");
            alert.html("<strong>"+res.toString()+"</strong>");
          }
        }
    });
  });*/
});
function closeLog(){
	$("div#editAcct").hide();
	$("div#editup").hide();
	$("div#newAcct").hide();
}

function delay(alert){
	setTimeout(function(){
		alert.removeClass();
		alert.html("");
		location.reload();
	},2000);
}

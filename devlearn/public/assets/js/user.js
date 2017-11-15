function editMe(){
	$("div#editup").show();
}

$(document).ready(function(){
	$("#editUsr").submit(function (e){
      e.preventDefault();
			var data = {"username" : $("#uname").val(),
		 							"password": $("#pass").val(),
									"repass": $("#repass").val()};

			var alert = $("div#editUpAlert");
			alert.removeClass();
			alert.html("");

			$.ajax({
					url:"/edit",
					data:data,
					method:"POST",
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
	});


});

function closeLog(){
	$("div#editup").hide();
}

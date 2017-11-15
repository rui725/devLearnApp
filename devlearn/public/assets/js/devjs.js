
$(document).ready(function() {
	// get current URL path and assign 'active' class
	var pathname = window.location.pathname;
	$('.nav-item a[href="'+pathname+'"]').addClass('active');
})

var min_w = 300;
var vid_w_orig;
var vid_h_orig;

$(function() {

    vid_w_orig = parseInt($('video').attr('width'));
    vid_h_orig = parseInt($('video').attr('height'));

    $(window).resize(function () { fitVideo(); });
    $(window).trigger('resize');

});

function fitVideo() {

    $('#video-viewport').width($('.fullsize-video-bg').width());
    $('#video-viewport').height($('.fullsize-video-bg').height());

    var scale_h = $('.fullsize-video-bg').width() / vid_w_orig;
    var scale_v = $('.fullsize-video-bg').height() / vid_h_orig;
    var scale = scale_h > scale_v ? scale_h : scale_v;

    if (scale * vid_w_orig < min_w) {scale = min_w / vid_w_orig;};

    $('video').width(scale * vid_w_orig);
    $('video').height(scale * vid_h_orig);

    $('#video-viewport').scrollLeft(($('video').width() - $('.fullsize-video-bg').width()) / 2);
    $('#video-viewport').scrollTop(($('video').height() - $('.fullsize-video-bg').height()) / 2);

};


function logMe(){
	$("div#login").show();
	var alert = $("div#loginAlert");
	alert.removeClass();
	alert.html("");
}
function signMe(){
	$("div#login").hide();
	$("div#signup").show();
	$("#uname").val("");
	$("#pass").val("");
	$("#repass").val("");
}

function closeLog(){
	$("div#login").hide();
	$("div#signup").hide();
	$("div#signup-s").hide();
	$("div#editup").hide();
	var signs = $("div#signup-s");
	if(signs.length != 0){
		signs.remove()
		location.reload();
	}

}

$(document).ready(function(){
	$("#loginF").submit(function (e){
		e.preventDefault();
		var data = {"username" : $("#loguname").val(),
	 							"password": $("#logpass").val()};

		var alert = $("div#loginAlert");
		alert.removeClass();
		alert.html("");

		$.ajax({
				url:"/login",
				data:data,
				method:"POST",
				success:function(res){
					if(!res.toString().includes("Error")){
						location.reload();
					}else{
						alert.addClass("alert-danger");
						alert.html("<strong>"+res.toString()+"</strong>");
					}
				}
		});
	});

	$("#signU").submit(function (e){
			e.preventDefault();
			var data = {"username" : $("#uname").val(),
		 							"password": $("#pass").val(),
									"repass": $("#repass").val()};

			var alert = $("div#signUpAlert");
			alert.removeClass();
			alert.html("");

			$.ajax({
					url:"/signup",
					data:data,
					method:"POST",
					success:function(res){
						if(!res.toString().includes("Error")){
							$("div#signup").hide();
							$("div#popup").append(res);
						}else{
							alert.addClass("alert-danger");
							alert.html("<strong>"+res.toString()+"</strong>");
						}
					}
			});
	});


});

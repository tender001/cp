function sresult(){
	var result = location.search.getParam('result');
	
	if(result == "idcard"){
		$("#div2").show();
	}else if(result =="code"){
		$("#div1").show();
	}else if(result =="zhuce"){
		$("#div3").show();
	}else if(result =="phone"){
		$("#div4").show();
	}else if(result =="bdbank"){
		$("#div5").show();
	}else if(result =="tikuan"){
		$("#div6").show();
	}
	
	
}
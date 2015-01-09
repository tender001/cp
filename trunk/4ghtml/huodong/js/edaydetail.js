$(document).ready(function(){
	chklogin();
	var tid = location.search.getParam('tid');
	if(tid){
		showinfo(tid);
	}
	
})



function showinfo(tid){ //查看详情
	$.ajax({
	     url:'/phpu/q.phpx?fid=ttfq_detail&tid='+tid,
	     type : "POST",
		 dataType : "json",
	     success :function (xml){
	    	 var R = xml.Resp;
				var code = R.code;
				var desc = R.desc;
		        if(code== "0"){
		    	   var rs = xml.Resp.row;
		        	if(!isArray(rs)){rs = new Array(rs);}
					$.each(rs, function(o,r){
						
						var cawardcode = r.cawardcode;
						var ccodes = r.ccodes.split(":")[0];
						var iaward = r.iaward;
						var cawardtime = r.cawardtime.substring(5,16);
						
						
						$("#headerinfo").html('<span class="fr">'+r.cjrs+'人参与</span>'+$_sys.getlotname(r.cgameid)+'<span><em>第'+r.cperiodid+'期</em></span>');
						$("#cpmoney").html(r.imoney+"元");
						
						var iawardcode="";
						var betcodes = ccodes.replaceAll(","," ");
						var cpibonus=cpibonus = "<p ><span style='color:#333'>"+cawardtime+"</span></p>开奖时间" ;
						if(iaward==2){
							if(cawardcode){
								if(cawardcode.split("|").length>1){
									iawardcode = "<em>"+cawardcode.split("|")[0].split(",").join("</em><em>")+"</em>"+"<em class=blue>"+cawardcode.split("|")[1].split(",").join("</em><em class=blue>")+"</em>"
								}else{
									iawardcode = "<em>"+cawardcode.split(",").join("</em><em>")+"</em>"
								}
							}
							cpibonus = "<p >"+r.ibonus+"元</p>中奖金额" ;
						}else if(iaward == 1){
							iawardcode = '<em>正</em><em>在</em><em>计</em><em>奖</em>';
							
						}else{
							iawardcode = '<em>等</em><em>待</em><em>开</em><em>奖</em>';
							
						}
						if(betcodes.split("|").length>1) {
							betcodes ="<em>"+ betcodes.split("|")[0]+"</em>&nbsp;&nbsp;<cite>"+ betcodes.split("|")[1]+"</cite>";
						}else{
							betcodes ="<em>"+ betcodes.split("|")[0]+"</em>";
						}
						$("#cpibonus").html(cpibonus);
						$("#iawardcode").html(iawardcode);
						$("#betcode").html(betcodes);
						$("#cpid").html("编号："+r.cprojid);
					})
		    	   
		        }
		       
	     }
	   });
	
}
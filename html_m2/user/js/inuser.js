var lotid = location.search.getParam('lotid')
var projid = location.search.getParam("projid");
var ititle = location.search.getParam("title");
var page = 0;
var cacheHTML = "";
var zys = 1;
var chedan = "1";






$(function() {
    if (lotid == "" || projid == "") {
        if (history.length == 0) {
            window.opener = "";
            window.close()
        } else {
            history.go( - 1)
        }
        return false
    }
    chedan = location.search.getParam("chedan");
    if (ititle == "partake") {
        $("#iTitle").html("参与用户");
        LoadList();
        $("#moresult1").bind("click",
        function() {
            $("#loading").show();
//            $("#moresult1").hide();
            LoadList()
        })
    } else if (ititle == "myRecord") {
        $("#iTitle").html("我的认购");
        $("#loading").show();
        myLoadList()
    }
});

function LoadList() {
    page++;
    if (page > zys) {
        $("#loading,#moresult1").hide();
        return false
    }
    var postData = "hid=" + projid + "&gid=" + lotid + "&state=" + chedan + "&pn=" + page + "&ps=20";
    $.ajax({
		url : $_trade.url.jlist,
		type : "POST",
		dataType : "json",
		data :postData,
		success : function(obj) {
			var code = obj.Resp.code;
			var desc = obj.Resp.desc;
			if (code == "0") {
				var row = obj.Resp.row;
				var cacheHTML="";
				if(page==1){
					cacheHTML="<li><span class=\"inFirst\">用户</span><span>认购金额(元)</span><span style=\"border-right:none;width:26%\">购买时间</span></li>";
				}
				
				var ct =obj.Resp.count;
			
				var ps=20;	
				var pmon=0;//标识方案是否有中奖信息
				var r = obj.Resp.row;		
				var nn=0;
				var bmoneys=0;
				zys = obj.Resp.count.tp;
//				$("#cp_hmlist").html('合买用户<font class="fontred" style="font-size:14px">('+rc+')</font>人');
//				var jlist = option.data.Resp.myjoins;
//				var istate = option.data.Resp.row.istate;
//				if(jlist)joins = jlist.myjoin;
				
				if(!isArray(r)){r = new Array(r);}
					
					$.each(r,function(i,rt) {
						var nickid = rt.nickid;// 认购人
						var buydate = rt.buydate;// 认购时间
						var bmoney = rt.bmoney;// 认购金额
						var cancel = rt.cancel;// 是否撤销(0 未撤销 1 本人撤销 2 系统撤销）
						var amoney = rt.amoney;// 派奖金额
						var rmoney = rt.rmoney;// 认购派奖金额
						
						pmon = rmoney>0? 1 : 0;
						bmoneys =bmoneys+ parseFloat(bmoney);
						cacheHTML += '<li><span class="inFirst">' + nickid + '</span><span class="red">' + bmoney + '</span><span class="inLast"><em>' + buydate.substring(2, 10) + "</em><cite>" + buydate.substring(11, 19) + "</cite></span></li>"
						nn++;
					});
					
					
				
				if (nn==0){
					cacheHTML += '<li class="yellow" style="text-align:center;border-bottom:none;">亲!木有认购记录耶</li>'
				}
				if ($("#inUser").html() == "") cacheHTML = "";
//                cacheHTML += html;
				$("#loading").hide();
                $(".inUser").append(cacheHTML);
			}
		}
	});	
    
    
}
function myLoadList() {

	var lotid = location.search.getParam('lotid');
	var proid = location.search.getParam('projid');
	if (lotid == "" || proid == "") {
		if (history.length == 0) {
			window.location = "/";
		} else {
			history.go(-1);
		}
		return;
	}
	$("#lotid").val(lotid);
	$("#proid").val(proid);
	$.ajax({
		url : $_trade.url.pinfo,
		type : "POST",
		dataType : "json",
		data : {
			gid : lotid,
			hid : proid
		},
		success : function(d) {
			var code = d.Resp.code;
			var desc = d.Resp.desc;
			if (code == "0") {
				var row = d.Resp.row;
				var canc=false;
				if ((row.nums-row.lnum+row.pnum)/row.nums<0.8){					
					canc=true;
				}
				showjoin({data:d,canc:canc});
			} else {
				showTips(desc);
			}
		},
		error : function() {
			showTips("网络异常!");
			return false;
		}
	});

	
	
	
	
	
	
	
	
	

}
showjoin = function(option){
	var html = '<li><span>认购金额(元)</span><span>奖金(元)</span><span style="border-right:none">购买时间</span></li>';
	
	var jlist = option.data.Resp.myjoins;
	var istate = option.data.Resp.row.istate;
	if(jlist)var joins = jlist.myjoin;
	if(joins === undefined || joins.length < 1){
		 $("#moresult1").hide();
        html += '<li class="yellow" style="text-align:center;border-bottom:none;">亲!木有你的认购记录耶</li>'
	} else{
		if(!isArray(joins)){joins = new Array(joins);}
		if(joins == undefined || joins.length < 1){
			 $("#moresult1").hide();
	         html += '<li class="yellow" style="text-align:center;border-bottom:none;">亲!木有你的认购记录耶</li>'
		} else {
			$.each(joins,function(i,r) {
				var buyid = r.buyid;
				var buydate = r.buydate;
				var bmoney = r.bmoney;
				var cancel = r.cancel;
				var rmoney = r.rmoney;
				var isource = r.source;// 
				 html += '<li "><span class="yellow">' + bmoney + '</span><span class="yellow">' + rmoney + '</span><span class="inLast"><em>' + buydate.substring(2, 10) + "</em><cite>" + buydate.substring(11, 19) + "</cite></span></li>"
				
			});
		}
	}

	$(".inUser").html(html);
    $("#loading").hide();
    $("#moresult1").hide()
};
function goTo() {
    history.go( - 1)
}
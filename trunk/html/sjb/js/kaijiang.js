$(document).ready(function(){
	selectProject = function(cnickid){
		if(!!$("#findstr")){$("#findstr").val(cnickid);}
		Class.C("findstr",cnickid);
		if(Class.C("lotid") == '00'){
			loadHotProj();
		}else{
			loadGameProj();
		}
	};
	loadPeriod = function(){
			Y.ajax({				
				url : "/cpdata/game/aopencode.json?rnd=" + Math.random(),
				type : "get",
				cache:false,
				dataType : "json",
				end : function(data) {
					var obj = eval("(" + data.text + ")");
					var r = obj.rows.rownow;
					var d = Y.getDate(data.date).format('YY-MM-DD');
					r.each(function(rt,o) {
						var nd = Y.getDate(rt.nowendtime).format('YY-MM-DD');
						if(nd==d){
							
							$('.todaykj a[id='+rt.gid+']').show().addClass("a1");
						}else{
							
							$('.todaykj a[id='+rt.gid+']').hide();
						}
						if(Class.C('lotid') == rt.gid){
							Class.C('nowpid', rt.nowpid);
						}
					});
				},
				error : function() {
					this.alert("Õ¯¬Áπ ’œ!");
					return false;
				}
			});
	};
	page = function(pn){
		Class.C("pn",pn);
		if(Class.C("lotid") == '00'){
			
			loadHotProj();
		}else{
			loadGameProj();
		}
	};
	gopage = function(){
		page($("#govalue").val());
	};
	psort = function(obj,fsort){
		Class.C("fsort",fsort);
		$("span[id^='sort_']").each(function(o,r){
		
			if($(r).attr("id") == obj){
				var cls = $(r).attr("class");
				if(cls == "hm_sx1" || cls == "hm_sx3"){
					
					$(r).removeClass().addClass("hm_sx2");
					Class.C("dsort","");
				} else if(cls == 'hm_sx2'){
					$(r).removeClass().addClass("hm_sx3");
					Class.C("dsort","descending");
				}
			}else{
				$(r).removeClass().addClass("hm_sx1");
			}
		});
		loadGameProj();
	};
	initHM = function (glist){
		glist.each(function(o,gr){
			if($(gr).attr("id") == Class.C('lotid')){ $(gr).addClass("cur"); }else{ $(gr).removeClass("cur"); }
			$(gr).find("img").remove();
			$(gr).unbind("click").click(function(){
				if($(gr).attr("id") == '00'){
					location.href="/hemai/index.html";
				}else{
					location.href="/hemai/index.html?lotid=" + $(gr).attr("id");
				}
			});
		});
	};
	initPage = function(){
		var lotid = location.search.getParam('lotid');
		if(!!lotid){
			Class.C('lotid', lotid);
		}else{
			Class.C('lotid', "00");
		}
		Class.C("findstr","");
		Class.C("fsort","jindu");
		Class.C("dsort","descending");
		Class.C("state","0");
		Class.C("expect","");
		Class.C("pn","1");
		Class.C("ps","30");
		loadPeriod();	
	};
	initPage();
});
//加载 期次-对阵
    Class('LoadExpect',{
    	index:function(){
    		this.TbindMsg();		
    	},
    	TbindMsg: function(){
    		return this.LoadDuiZhen();    		
    	},	
        
    	LoadDuiZhen : function() {	
    		Class.config('playId', parseInt(this.need('#playid').val()) );  //彩种
    		var url="/cpdata/match/jczq/jczq_spf.json";
    		switch (Class.config('playId')) {
			case 72 :    //让球胜平负
				url="/cpdata/match/jczq/jczq_rspf.json";
				break;
			case 40 :    //总进球数
				url="/cpdata/match/jczq/jczq_jqs.json";
				break;
			case 42 :    //比分
				url="/cpdata/match/jczq/jczq_cbf.json";
				break;
			case 51 :    //半全场
				url="/cpdata/match/jczq/jczq_bqc.json";
				break;
			case 43 :    //让球胜平负单关配
				url="/cpdata/match/jczq/jczq_rspf.json";
				break;
			case 34 :    
				url="/cpdata/match/jczq/jczq_spf.json";
				break;
			default :
		}
		this.ajax({
			        url: url+"?v=" + Math.random(),
			        cache:false,
					end : function(data) {
						var obj = eval("(" + data.text + ")");
						var code = obj.match.code;
						var desc = obj.match.desc;
						if (code == "0") {
							switch (Class.config('playId')) {
							case 72 :    //让球胜平负
								this.rqspf(data);
								break;
							case 40 :    //总进球数
								this.jq(data);
								break;
							case 42 :    //比分
								this.bf(data);
								break;
							case 51 :    //半全场
								this.bq(data);
								break;
							case 43 :    //让球胜平负单关配
								this.rqspfdgp(data);
								break;
							case 34 :    //胜平负
								this.spf(data);
								break;
							default :	
							}
						} else {
							this.alert(desc);
						}
					},
					error : function() {
						this.alert("网络故障,请重新刷新。");
						return false;
					}
				});
    	},
    	spf:function(data){
    		 var html="" ;
    		 var tableTpl=['<div class="sf-left dp-basic">'
                 +'<h2>{$gn}VS{$hn}</h2>'
                 +'<div class="bod">'
                 +'<p>'
                 +'<span>投注截止时间：{$short_et}</span>'
                 +'{$mname}<i>{$short_mt}</i>开赛'
                 +'</p>'
                 +'<div class="bod-m">'
                 +'<ul>'
                 +'<li><span style="height: {$zsp3}px"><i>{$zsp3}%支持率</i></span></li>'
                 +'<li><span style="height: {$zsp1}px"><i>{$zsp1}%支持率</i></span></li>'
                 +'<li><span style="height: {$zsp0}px"><i>{$zsp0}%支持率</i></span></li>'
                 +'</ul>'
                 +'<dl>'
                 +'<dd>{$lgn}&nbsp;胜<em>{$sp3}</em></dd>'
                 +'<dd>平局<em>{$sp1}</em></dd>'
                 +'<dd>{$lhn}&nbsp;胜<em>{$sp0}</em></dd>'
                 +'</dl>'
                 +'</div>'
                 +'</div>'
                 +'</div>','<div class="sf-left dp-basic">'
                 +'<h2>{$gn}VS{$hn}</h2>'
                 +'<div class="bod">'
                 +'<p>'
                 +'<span>距投注截止时间：{$short_et}</span>'
                 +'{$mname}<i>{$short_mt}</i>开赛'
                 +'</p>'
                 +'<div class="bod-m">'
                 +'<ul>'
                 +'<li><span style="height: {$zsp3}px"><i>{$zsp3}%支持率</i></span></li>'
                 +'<li><span style="height: {$zsp1}px"><i>{$zsp1}%支持率</i></span></li>'
                 +'<li><span style="height: {$zsp0}px"><i>{$zsp0}%支持率</i></span></li>'
                 +'</ul>'
                 +'<dl>'
                 +'<dd class="un-time">{$lgn}&nbsp;胜<em>{$sp3}</em></dd>'
                 +'<dd class="un-time">平局<em>{$sp1}</em></dd>'
                 +'<dd class="un-time">{$lhn}&nbsp;胜<em>{$sp0}</em></dd>'
                 +'</dl>'
                 +'</div>'
                 +'</div>'
                 +'</div>'];
    		
    		var mathdate=[];
    		var wk=["日","一","二","三","四","五","六"];
    		
    		var stop_sale="no";
    		var all_matches=0;
    		var numstr=[];
    		var num=0;
    		var lgstr="";
    		var obj = eval("(" + data.text + ")");
			var code = obj.match.code;
			var desc = obj.match.desc;
			var r = obj.match.row;
			if(!this.isArray(r)){r=new Array(r);}
			r.each(function(row,i){
//				if(row.idanguan & 1L << 1)
				if(((row.idanguan*1) & 1 << 4) == (1 << 4)){
//				row.idanguan& 1L << 4 == 1L<<4
				row.classname=i%2==0?"even odd":"even";
				row.enddate=((Y.getDate(row.mt).getHours()<11 || (Y.getDate(row.mt).getHours()==11 && Y.getDate(row.mt).getMinutes()<30))?(Y.getDate(Date.parse(Y.getDate(row.mt))-1000*60*60*24).format('YY-MM-DD')):Y.getDate(row.mt).format('YY-MM-DD'));
    			row.index=row.mid;
    				
    			row.short_et=Y.getDate(row.et).format('YY-M-D hh:mm');
    			row.short_mt=Y.getDate(row.mt).format('M/D hh:mm');
    			
    			var spstr=row.spf.split(",");
    			row.sp3=(spstr[0]!=''?(parseFloat(spstr[0]).rmb(false,2)):'--');
    			row.sp1=(spstr[1]!=''?(parseFloat(spstr[1]).rmb(false,2)):'--');
    			row.sp0=(spstr[2]!=''?(parseFloat(spstr[2]).rmb(false,2)):'--');
    			row.zsp=row.sp3*1+row.sp1*1+row.sp0*1;
    			row.fsp3=row.zsp*1-row.sp3*1;
    			row.fsp1=row.zsp*1-row.sp1*1;
    			row.fsp0=row.zsp*1-row.sp0*1;
    			row.fzsp=row.fsp3*1+row.fsp1*1+row.fsp0*1;
    			row.zsp3 =parseInt(row.fsp3*1/row.fzsp*100)+3;
    			row.zsp1 =parseInt(row.fsp1*1/row.fzsp*100)-2;
    			row.zsp0 =100-row.zsp3*1-row.zsp1*1-1;
				row.sid=row.sid;
				row.gtid=row.gtid;
    			all_matches++;		
    		
    			row.lmname=row.mname;
    			row.lhn=row.hn.substr(0,4);
    			row.lgn=row.gn.substr(0,4);
    			
    			row.mname=row.mname.substr(0,4);
    			row.name=row.name;
    			
    			if (Y.getDate(data.date)>Y.getDate(row.et)){//已经过期的场次
    				
    				html += tableTpl[1].tpl(row);
    			}else{//未过期的场次
    				num++;    
    				html += tableTpl[0].tpl(row);
    				
    			};
			}
    		});
			
    		this.get("#vsTable").html(html);
    		
    		

    		
//    		for(ii=0;ii<numstr.length;ii++){
//    			this.get("#num"+ii).html(numstr[ii]);
//    		}
    		this.get("#vsTable").show();
    
    		if(this.get("#vsTable").html().trim()==""){
    			this.get("#vsTable").html('<div class="event-no event-no1"><p>当前无赛事可投注，请等待官方公布新赛程！<br> <a href="http://bf.159cai.com/jingcaii">查看赛程预告&gt;&gt;</a> <a href="/dating/">购买其他彩种&gt;&gt;</a> </p></div>');
    		}
       		
       		
       
    		
//    		this.postMsg('load_duizhen_succ');			
    	}	
    });
Class('Selector', {
    maxM  : 199998,
    index : function()
    {
        var Y = this;
        $("#vslist a[sp]").die().live("click",function()      //点击投注选项(胜平负、让球胜平负)
        {
            var rcs = Class.C("isspf")? "x_hh_a" : Class.C("lotid") == "91"? "l_x_hh_i" : Class.C("lotid") == "92"? "l_gg_bq_a1" : Class.C("lotid") == "93"? "l_gg_bq_a" : "";
            $(this).toggleClass(rcs);
            Y.changeCodeList($(this),$(this).parents("li"));
            Y.changemomey();           //更新投注总金额及预估总奖金
            Y.changebuybtn();          //更新购买等按钮样式状态
        });
        $("#chooselist input[zid]").die().live("change paste",function()     //购买金额输入校验
        {
            var value = $(this).val();
            if(!(/^\+?[0-9]*$/.test(value)))
            {
                var tv = isNaN(parseInt(value))? (2) : (parseInt(value));
                $(this).val(tv > 0? tv : 2);
            }
            else if(value > Y.maxM)
            {
                $(this).val(Y.maxM);
            }
            else if(value <= 1)
            {
                $(this).val(2);
            }
            if($(this).val() % 2 != 0)
            {
                $(this).val($(this).val() - 1);
            }
            Y.changebonus("0",$(this));     //更新预估奖金(单个选项)
            $("#tzmoney").val("");
        });
        $("#tzmoney").die().live("change paste",function()     //购买金额输入校验(全局)
        {
            var value = $(this).val();
            if(value == "" || !(/^\+?[0-9]*$/.test(value)))
            {
                var tv = isNaN(parseInt(value))? (2) : (parseInt(value));
                $(this).val(tv > 0? tv : 2);
            }
            else if(value > Y.maxM)
            {
                $(this).val(Y.maxM);
            }
            else if(value <= 1)
            {
                $(this).val(2);
            }
            if($(this).val() % 2 != 0)
            {
                $(this).val($(this).val() - 1);
            }
            if($(this).val() != "")
            {
                $("#chooselist input[zid]").val($(this).val());
                Y.changebonus("1",null);        //更新预估奖金(单个选项)
                Y.changemomey();                //更新投注总金额及预估总奖金
            }
        });
        $("#chooselist .cm_jcqc").die().live("click",function()       //删除单个已选比赛
        {
            $("li[zid='" + $(this).attr("zid") + "_li']").remove();
            Y.changeselect("0",$(this).attr("zid"));       //清除选中状态
            Y.changemomey();           //更新投注总金额及预估总奖金
            Y.changebuybtn();          //更新购买等按钮样式状态
        });
        $("#chooselist a[sp]").die().live("click",function()    //删除单个选项
        {
            var ids = $(this).parents("tr").attr("zid").split("_");
            $("tr[zid='" + ids[0] + "_" + ids[1] + "']").remove();
            if($("table[zid='" + ids[0] + "_tbs'] tr").length <= 1)
            {
                $("li[zid='" + ids[0] + "_li']").remove();
            }
            var rcs = Class.C("isspf")? "x_hh_a" : Class.C("lotid") == "91"? "l_x_hh_i" : Class.C("lotid") == "92"? "l_gg_bq_a1" : Class.C("lotid") == "93"? "l_gg_bq_a" : "";
            $("li[zid='" + ids[0] + "'] a[value='" + ids[1] + "']").removeClass(rcs);
            Y.changemomey();           //更新投注总金额及预估总奖金
            Y.changebuybtn();          //更新购买等按钮样式状态
        });
        $(".bfzsgd").live("click",function()        //比分-主胜更多选项
	    {
	        var zid = $(this).attr("zid");
	        if($(".bfzsgdc[zid='" + zid + "']").is(":visible"))
	        {
	            $(".bfzsgdc[zid='" + zid + "']").hide();
	            $(this).find("span").show();
	        }
	        else
	        {
	            $(".bfzsgdc[zid='" + zid + "']").show();
	            $(this).find("span").hide();
	        }
	        $(this).toggleClass("l_x_hh_i");
	        if($(".bfzsgdc[zid='" + zid + "'] a.l_x_hh_i").length > 0)
	        {
	            $(this).toggleClass("l_x_hh_i");
	            $(this).find("span").hide();
	        }
	    });
	    $(".bfzfgd").live("click",function()        //比分-客胜更多选项
	    {
	        var zid = $(this).attr("zid");
	        if($(".bfzfgdc[zid='" + zid + "']").is(":visible"))
	        {
	            $(".bfzfgdc[zid='" + zid + "']").hide();
	            $(this).find("span").show();
	        }
	        else
	        {
	            $(".bfzfgdc[zid='" + zid + "']").show();
	            $(this).find("span").hide();
	        }
	        $(this).toggleClass("l_x_hh_i");
	        if($(".bfzfgdc[zid='" + zid + "'] a.l_x_hh_i").length > 0)
	        {
	            $(this).toggleClass("l_x_hh_i");
	            $(this).find("span").hide();
	        }
	    });
	    $("#plgmbtn").die().live("click",function()     //点击批量购买
        {
            var node = $("#plgmtrs");
            if(node.is(":visible"))
            {
                $("#tzmoney").val("");
                node.hide();
            }
            else
            {
                node.show();
            }
        });
        $("#jjyhbtn").die().live("click",function()     //奖金优化
        {
            if($("#chooselist input[zid]").length == 0)
            {
                Y.alert("您好,请先至少选择一个选项进行投注");
            }
            else
            {
                var params = {};
                var playname = codenames[Class.C("lotid")];
                var pre = playname + '|';
                var codes = "";
                $.each($("#chooselist li[zid*='_li']"),function()
                {
                    var temp = "";
                    $.each($(this).find("a[sp]"),function()
                    {
                        temp += $(this).attr("value") + ",";
                    });
                    temp = temp.substring(0,temp.length - 1);
                    codes += pre + ($(this).attr("zid").split("_"))[0] + "=[";
                    codes += temp + "];";
                });
                params.lotid = Class.C("lotid");
                params.playid = $("#playid").val();
                params.codes = codes.substring(0,codes.length - 1);
                params.totalmoney = parseInt($("#totalmoney").html());
                params.beishu = 1;
                params.zhushu = $("#chooselist a[sp]").length;
                params.gggroup = "1";
                params.playtype = playname;
                params.sgtypename = '单关固赔';
                params.appScheme = 'DGGP';
                
                //提交参数
                Y.sendForm({url:'/trade/jczq/jczq_project_gdpl_jjyhck.go',data:params,target:'_blank'});
            }
        });
        //投注区域固定
        //投注区域固定
	    var ltop = $("#vslist").prev().offset().top;
		var rtop = $("#chooselist").offset().top;
        $(window).scroll(function()
        {
			Y.rscroll(ltop,rtop);
	    }); 
    },
	rscroll : function(ltop,rtop){
		var dt = $(".dggp_tj").offset().top;
		var ch = $("#chooselist").height();
        var wtop = $(window).scrollTop();
		if(dt>(ch+wtop)){
			if(wtop < ltop)
			{
				$("#vslist").prev().css({"position":"","top":ltop,"background":"","margin-top":"9px","z-index":""});
				$("#chooselist").css({"position":"","top":(rtop)});
				$("#chooselist").find("p.xl_dggp_p").css("margin-top","9px");
			}
			else
			{
				$("#vslist").prev().css({"position":"absolute","top":wtop,"background":"#fff","width":"690px","margin-top":"0","z-index":"999"});
				$("#chooselist").css({"position":"absolute","top":wtop});
				$("#chooselist").find("p.xl_dggp_p").css("margin-top","0");
			}
		}else{
				$("#vslist").prev().css({"position":"absolute","top":wtop,"background":"#fff","width":"690px","margin-top":"0","z-index":"999"});
				$("#chooselist").css({"position":"absolute","top":dt-ch});
				$("#chooselist").find("p.xl_dggp_p").css("margin-top","0");			
		}
	},
    changeCodeList:function(node,pnode)      //更新投注选项
    {
        var data = new Object();
        if(Class.C("lotid") == "91")
        {
            pnode = pnode.parents("li");
        }
        data.tzv = node.attr("value");
        data.zid = pnode.attr("zid");
        data.hn = pnode.attr("hn");
        data.gn = pnode.attr("gn");
        if(Class.C("lotid") == "90")
        {
            data.close = "(" + pnode.attr("close") + ")";
        }
        var rcs = Class.C("isspf")? "x_hh_a" : Class.C("lotid") == "91"? "l_x_hh_i" : Class.C("lotid") == "92"? "l_gg_bq_a1" : Class.C("lotid") == "93"? "l_gg_bq_a" : "";
        if(!node.hasClass(rcs))
        {
            $("tr[zid='" + data.zid + "_" + data.tzv + "']").remove();
            if($("table[zid='" + data.zid + "_tbs'] tr").length <= 1)
            {
                $("li[zid='" + data.zid + "_li']").remove();
            }
        }
        else
        {
            var tzmoney = $("#tzmoney").val();
            tzmoney = (isNaN(tzmoney) || tzmoney == "")? 2 : tzmoney;
            if(Class.C("isspf"))     //胜平负、让球胜平负
            {
               data.tzx = tzxxnames[data.tzv];
               data.sp = node.attr("sp");
            }
            else if(Class.C("lotid") == "91" || Class.C("lotid") == "92" || Class.C("lotid") == "93")
            {
                 data.tzx = node.html();
                 data.sp = node.attr("sp");
            }
            data.bonus = isNaN(data.sp)? 0.00 : (data.sp * tzmoney).toFixed(2);
            data.tzm = tzmoney;
            var xxnode = $("li[zid='" + data.zid + "_li']");
            if(xxnode == undefined || xxnode.length == 0)
            {
                $("#chooselist ul.x_dggp_ul").append(choosetrs[0].tpl(data));
            }
            else
            {
                $("table[zid='" + data.zid + "_tbs']").append(choosetrs[1].tpl(data));
            }
        }
    },
    changebonus:function(type,node)
    {
        if(type == "0")
        {
            var sp = node.parent().prev("a").attr("sp");
            sp = isNaN(sp)? 0.00 : sp;
            node.parents("td").next().html((sp * node.val()).toFixed(2));
            this.changemomey();
        }
        else if(type == "1")
        {
            var Y = this;
            $.each($("#chooselist input[zid]"),function()
            {
                Y.changebonus("0",$(this));
            });
        }
    },
    changemomey:function()     //计算投注总金额及预估总奖金
    {
        var totalmoney = 0;
        var totalbonus = 0.00;
        $("#chooselist input[zid]").each(function()
        {
            totalmoney += parseInt($(this).val());
        });
        $("#totalmoney").html(totalmoney);
        $("#chooselist li[zid*='_li']").each(function()
        {
            var temp = 0.00;
            $(this).find("td[zid]").each(function(i,m)
            {
                temp = Math.max(temp,parseFloat($(m).html()));
            });
            totalbonus += temp;
        });
        $("#totalbonus").html(totalbonus.toFixed(2));
    },
    changeselect:function(type,zid)
    {
        var rcs = Class.C("isspf")? "x_hh_a" : Class.C("lotid") == "91"? "l_x_hh_i" : Class.C("lotid") == "92"? "l_gg_bq_a1" : Class.C("lotid") == "93"? "l_gg_bq_a" : "";
        $("#vslist li[zid='" + zid + "'] a[sp]").removeClass(rcs);
    },
    changebuybtn:function()
    {
		var Y = this;
        var temp = $("#chooselist input[zid]");
        if(temp.length > 0)
        {
            $("#x_match_style").toggleClass("cm_jclq_red",true);
            $("#moneylist").show();
            $("#codemsg").hide();
            $("#gohm").toggleClass("l_a3",true);
            $("#gobuy").toggleClass("l_a4",true);
			
			var ltop = $("#vslist").prev().offset().top;
			var rtop = $("#chooselist").offset().top;
			Y.rscroll(ltop,rtop);
        }
        else
        {
            $("#x_match_style").removeClass("cm_jclq_red");
            $("#moneylist").hide();
            $("#codemsg").show();
            $("#gohm").removeClass("l_a3");
            $("#gobuy").removeClass("l_a4");
        }
        if(temp.length >= 2)
        {
            $("#jjyhbtn").show();
            $("#plgmbtn").show();
        }
        else
        {
            $("#jjyhbtn").hide();
            $("#plgmbtn").hide();
            $("#plgmtrs").hide();
            $("#tzmoney").val("");
        }
        var linode = $("#chooselist li[zid*='_li']");
        if(linode.length > 0)
        {
            linode.css("border-bottom","1px dashed #CCCCCC");
            linode.slice(-1).css("border-bottom","0");
        }
    },
    counthidenmu:function(itemid)
    {
        var Y = this;
        var num = 0;    //统计隐藏场数
        Y.need('tr[zid^='+itemid+']').each(function(o,n){
            if(o.style.display=="none")
            {
                num++;
            }
        });
        $("#yccs_"+itemid).html(num);
        Y.isshowall(itemid);
    },
    isshowall:function(itemid)
    {
        var Y=this;
        $("a[id^=showall_"+itemid+"]").click(function()     //显示所有已隐藏的赛事
        {
            Y.need('tr[zid^='+itemid+']').show();
            $("#yccs_"+itemid).html(0);
        });
    }
});
//引导启动类
Class({
    ready: true,
	index:function (){
    	this.lib.LoadExpect();
//    	 this.goTotop();//返回顶部
//    	Class.C('odds_t','jczq/odds'); 
//    	this.oneodds=true;
//		this.onMsg('load_duizhen_succ', function () {
//			this._index();
//			
//		});            
    },
    
   
	goTotop:function (){
        var isIE=!!window.ActiveXObject;
        var isIE6 = isIE&&!window.XMLHttpRequest;
        var btn = $("#goTotop");
        var right = 0;
        var top = $(window).height()-247;
        var ietop = $(window).height()-247+$(window).scrollTop();
        var flag = true;
        $(window).resize(function(){
            btn.css({"position":"fixed",top:top,right:right});
            if(isIE6)btn.css({"position":"absolute",top:ietop,right:right});
        })
        btn.css({"position":"fixed",top:top,right:right});
        var areaTop = Y.get("#right_area").getXY().y;
        
        $(window).scroll(function(){
        	 if ($(this).scrollTop() > areaTop){//跟踪对齐当滚动条超过右侧区域则开始滚动
	            	var V = $('#titleTable_r');
	        		if (V[0]) {
	        			var T = $(document),
	        			H = $("#main div.box_m").eq(0),
	        			M = H.offset().top + H.outerHeight(),
	        			F = V.innerWidth(),
	        			B = V.offset().top,
	        			L = V.outerHeight(), 
	        			u = T.scrollTop();
	        			Z = Math.min(0, M - (L + u));
	        			
	        			if (B == Z) {
	        				V.css({left: "auto", top: "auto",width: F, position: "static"});
	        			} else {
	        				if(isIE6){
	        					V.css({left: "auto",top: Z+$(window).scrollTop()-140, width: F,position: "absolute"});
	        				}else{
	        					V.css({left: "auto",top: Z, width: F, position: "fixed"});
	        				}
	        			}
	        			Y.get("#titleTable_r").setStyle('z-index: 1;');
	        		}
	            	
	             }else{//停止浮动对齐
            	 Y.get("#titleTable_r").setStyle('z-index: 1; top:0;  left: auto;position: static;');
            }
        	
            if(flag)
            {
                btn.show();
                flag = false;
            }
            if($(this).scrollTop() == 0)
            {
                btn.hide();
                flag = true;
            }
            btn.css({"position":"fixed",top:top,right:right});
            ietop = $(window).height()-247+$(window).scrollTop();
            if(isIE6)btn.css({"position":"absolute",top:ietop,right:right});
        })
    },
    _index:function (){
        var isgg = this.get('#isgg').val() == '2';//是否是过关
        var ini = {
           focusCss: 'x_sz'
        };
        this.C('choose_data', []);//选中状态;
        switch(this.get('#playtype').val()){
        case 'bqc':
            this.C('optKeys', ['33','31','30','13','11','10','03','01','00']);
            this.C('maxSelectVs', 4);
            this.C('spXml', 4);
            this.C('dggp',true);
            break;
        case 'bf':
            this.C('optKeys', ["3A","10","20","21","30","31","32","40","41","42","50","51","52","1A","00",
                "11","22","33","0A","01","02","12","03","13","23","04","14","24","05","15","25"]);
            this.C('maxSelectVs', 4);
            this.C('spXml', 3);
            break;
        case 'jqs':
            this.C('optKeys', ['0', '1','2','3','4','5','6','7']);
            this.C('spXml', 2);
            break;
        default://spf
            this.C('single_line', true, true);//单行呈现, spf
            this.C('optKeys', ['3', '1', '0']);
            this.C('spXml', 1);
            this.C('maxSelectVs', 8);
            ini.focusCss = 'x_s'
        }
        if (isgg) {
            this.C('maxSelectVs', 15)  //最多选择60场
        }
        this.lib.Choose(ini);
        this.lib.ToolSet();//用户工具初始化
        this.vs = this.lib.Vs();//对阵
        this.lib.Buy();//购买类
        //this.lib.SPUpdate(isgg);//自动更新SP
        this.lib.Clock('#sysTime');
//		this.lib.ScrollStill();
        if (isgg) {
            this.lib.GgType();//过关方式
            this.C('_isgg', true, true);
            this.C('-all-gg-type',{dc: false, zy:[]});
            this.use('mask', function (){
                this.lib.PrixList();//奖金明细
                this.parseBackEdit();
            })            
        }else{
            this.C('_current_gg_type', '单关');
            this.C('-all-gg-type',{dc: '单关', zy:[]});
            this.parseBackEdit();
        }
        //设置表头浮动
        Y.get('<div id="title_folats" style="z-index:9;"></div>').insert().setFixed({
            area: '#vsTable',
            offset:0,
            init: function(){
                var This = this,
                    title = this.area.parent().find('#tabletop').one(0),
                    floatTitle = title.cloneNode(true);
                this.get(floatTitle).insert(this);
                this.floatTitle = floatTitle;
                this.title = title;
                this.hide();
                Y.get(window).resize(function(){
                    This.setStyle('left:'+(This.area.getXY().x)+'px;width:'+(This.area.prop('offsetWidth'))+'px')
                });
                Yobj.get('div.jcslt').remove();
            },
            onin: function (){
                this.show();
                this.title.swapNode(this.floatTitle);
                var offset = this.ns.ie == 6 ? 2 : 0;
                this.setStyle('left:'+(this.area.getXY().x+offset)+'px;width:'+this.area.prop('offsetWidth')+'px')
            },
            onout: function (){
                this.hide();
                this.title.swapNode(this.floatTitle);
            }
        });

    },
    parseBackEdit: function (codes){//返回修改
        var backData = Y.dejson(Y.cookie('jczq_back_edit')),
            vs = this.vs,
            data = {};
        var fzx = Y.dejson(decodeURIComponent(Y.cookie(this.get('#lotid').val()+'_codes')));//来源于资讯跳转
        backData = backData || fzx;
        if (fzx) {
            var json = this.dejson(this.get('#jsonggtype').val());
            fzx.sgtype = json[fzx.codes.split('/').length+'串1']+'';//默认都是串1
            Y.cookie(this.get('#lotid').val()+'_codes', 0, {timeout: -1, path:'/'});
        }
        if (backData) {
            data = backData.codes.split('/').map(function (a){
                var o = {},
                    m = (a+'').match(/(\d+)\|(\d+)\[([^\]]+)\]/);
                if (m) {
                    o.mid = m[1],
                    o.pname = m[2],
                    o.options = (m[3]+'').split(',').each(function (n){
                        return '"'+n+'"'
                    })
                }
                return o
            });// data is Array
            vs._getList();//初始化快速列表
            var ggs, tr, tr2, isbf = this.get('#playtype').val() == 'bf';// 比分
            this.get('#bs').val(backData.beishu);//设置倍数
            data.each(function (o){
                if (tr = vs.vObj[o.mid]) {
                    var tr2 = isbf ? this.get(tr).next() : tr,
                        opts = o.options;// string array
                    this.get(':checkbox', tr2).each(function (c){
                        if (opts.indexOf(c.value) > -1) {
                            c.checked = true;
                            this.get(c).fireEvent('click')
                        }
                    }, this);
                    if (isbf) {
                        this.get('a.bf_btn', tr).swapClass('public_Lblue', 'public_Dora').find('span').html('隐藏选项').end().find('s').prop('className', 'c_up')
                        tr2.show()
                    }
                }
            }, this);
            if (ggs = backData.sgtype) {
                var isDuoc, ggStr = ggs.split(',').map(function (t){
                    return this.ggid2str(t)
                }, this);
                isDuoc = (ggStr.join(' ')+' ').indexOf('串1 ')==-1;//多串
                var chks = this.get('input', isDuoc ? '#ggList' : '#ggListFree');
                if (isDuoc) {
                    this.postMsg('msg_ggTabs_focus', 1)//如果是多串，切换到多串面板
                }
                ggStr.each(function (s){//选中过关方式
                    var ggChk = chks.filter(function (el){
                        return el.value == s
                    });
                    if (ggChk.size()) {
                        ggChk.prop('checked', false).one().click()//use form elements method
                    }                           
                }, this)
            }
            var danma;
            if (danma = backData.danma) {//如果有胆码
                danma.split('/').each(function (c){
                    var id = '#choose_'+c.split('|')[0];
                    setTimeout(function() {
                        Yobj.get(id).find('input[dan]').one().click();
                    },10);                        
                }, this)
            }
            Y.cookie('jczq_back_edit', '{}', {timeout:-1})
        }//end if
    },
    ggid2str: function (id){//过关方式
        var json, m = this.C('ggid2str');
        if (!m) {
            json = this.dejson(this.get('#jsonggtype').val());
            m = {};
            for(var k in json){
                m[json[k]] = k
            }
            this.C('ggid2str', m);
        }
        return m[id]
    }
}); 
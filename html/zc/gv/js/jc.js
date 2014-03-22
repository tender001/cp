$(function(){
//频道导航
$("#a_buy_ticket,#box_sell").hover(function(){
  $("#a_buy_ticket").addClass("sel");
  $("#box_sell").css("display","block");
  },function(){
  $("#a_buy_ticket").removeClass("sel");
  $("#box_sell").css("display","none");
  })
//平均欧指
	var x = 10;
	var y = 20;
	$(".rate_num").mouseover(function(e){
	    var tabCon="<table width='100%' border='0' cellspacing='0' cellpadding='0'><thead><tr><th>变化时间<\/th><th width='50'>胜<\/th><th width='50'>平<\/th><th width='50'>负<\/th><\/tr><\/thead>"+"<tbody><tr><td>04-20 14:07<\/td><td class='color_red'>2.21↑<\/td><td class='color_green'>2.21↓<\/td><td>2.21→<\/td><\/tr><\/tbody><\/table>";
		var tooltip = "<div id='tooltip'><h3>即时SP值变化表<\/h3>"+tabCon+"<\/div>"; //创建 div 元素
		$("body").append(tooltip);	//把它追加到文档中						 
		$("#tooltip")
			.css({
				"top": (e.pageY+y) + "px",
				"left":  (e.pageX+x)  + "px"
			}).show("fast");	  //设置x坐标和y坐标，并且显示
    }).mouseout(function(){
		$("#tooltip").remove();	 //移除 
    }).mousemove(function(e){
		$("#tooltip")
			.css({
				"top": (e.pageY+y) + "px",
				"left": (e.pageX+x)  + "px"
			});
	});
  $(".special_td").toggle(function(){
  $(this).addClass("special_td02");
  },function(){
  $(this).removeClass("special_td02");
  })
  $(".special_td").hover(function(){
    $(this).addClass("special_td03");
  },function(){
    $(this).removeClass("special_td03");
  })
  $(".tab_team_fight tr").hover(function(){
  $(this).addClass("sel_tr");
  },function(){
  $(this).removeClass("sel_tr");
  })
  $(".playgame_sel").hover(function(){
  $(this).addClass("playgame_sel02");
  $(this).find(".sel_outbox").show();
  },function(){
  $(this).removeClass("playgame_sel02");
  $(this).find(".sel_outbox").hide();
  })
  $(".playgame_category").hover(function(){
  $(this).addClass("playgame_category02");
  $(this).find(".category_outbox").show();
  },function(){
  $(this).removeClass("playgame_category02");
  $(this).find(".category_outbox").hide();
  })
  //问号弹出层
  $(".icon_more2").hover(function(){
  $(this).find(".more_con").show();
  },function(){
  $(this).find(".more_con").hide();
  })
  //串关方式选择
  $("#ul_guoguan>li").click(function(){
	showTab(this,"#ul_guoguan>li","#con_guoguan>ul");
	})
  //比分展开方投注方式
  $(".buy_sel_way").toggle(function(){
	$(this).addClass("buy_sel_way02");
	$(this).text("隐藏投注选项");
	$(this).parents("tr").next("tr").has(".border_show_play").show();
  },function(){
	$(this).removeClass("buy_sel_way02");
	$(this).text("显示投注选项");
	$(this).parents("tr").next("tr").has(".border_show_play").hide();
	})
  //显示隐藏当天的比赛列表
  $(".show_hide").toggle(function(){
	$(this).parent().next(".tab_team_fight").hide();
	$(this).html("<span class='color_link'>显示</span><b></b>");
  },function(){
	$(this).parent().next(".tab_team_fight").show();
	$(this).html("<span class='color_link'>隐藏</span><b></b>");
	  })
  //奖金预测详细
  $("#bonus_mask").height($("body").height());
  $(".bonus_close").click(function(){
		$(this).parent().parent().hide();
		$("#bonus_mask").hide();
  })
  $("#btn_bonus_budget").click(function(){
	  $(".bonus_outbox_s").show();								
  })
  $(".unify_sel").hover(function(){
    $(this).addClass("unify_sel02");
    $(this).find(".unify_con").show();
  },function(){
    $(this).removeClass("unify_sel02");
    $(this).find(".unify_con").hide();
  })
  $("#single_bonus").toggle(function(){
    $(this).next().addClass("icon_optimize_bow02");
  },function(){
    $(this).next().removeClass("icon_optimize_bow02");
  })
})



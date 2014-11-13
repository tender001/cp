$(function(){
        $("ul.tit li").mouseover(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".kj_main .kj_anc_main").eq($(".kj_announce ul.tit li").index(this)).show().siblings().hide();
        });  
		$(".zj_ph ul li").click(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".zj_main div").eq($(".zj_ph ul li").index(this)).show().siblings().hide();
        }); 
		
		$(".rig_hm_t ul li").click(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".rig_hm_main table").eq($(".rig_hm_t ul li").index(this)).show().siblings().hide();
        }); 
		$(".rig_tj_t ul li").click(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".rig_tj_main div").eq($(".rig_tj_t ul li").index(this)).show().siblings().hide();
        }); 
		$(".kscm div").mouseover(function(){
            
            $(".quick_main .quick_m").eq($(".kscm div").index(this)).show().siblings().hide();
        }); 
		$(".hm_col_5_top ul li").click(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".hm_col_5_m div").eq($(".hm_col_5_top ul li").index(this)).show().siblings().hide();
        }); 
		$(".acct_rig_1 ul li").click(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".record_main .my_reco").eq($(".acct_rig_1 ul li").index(this)).show().siblings().hide();
        }); 
		$(".acct_rig_1 ul li").click(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".recharge").eq($(".acct_rig_1 ul li").index(this)).show().siblings().hide();
        });
		$(".news_right_1 a").click(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".news_right_2 .news_tb").eq($(".news_right_1 a").index(this)).show().siblings().hide();
        });
		$(".help_right table.co1 a").click(function(){
			$(".help_right table.co1 a").each(function(){
				$(this).removeClass("cur");
			
			});
			$(this).addClass("cur");
            $(".sy_list div").eq($(".help_right table.co1 a").index(this)).show().siblings().hide();
        });
		$(".zj_top_2 ul li").click(function(){
            $(this).addClass("cur").siblings().removeClass("cur");
            $(".zj_top_1 table").eq($(".zj_top_2 ul li").index(this)).show().siblings().hide();
			$(".zj_mab .tb_q").eq($(".zj_top_2 ul li").index(this)).show().siblings().hide();
        });
		$(".ad_top_2 ul li").click(function(){
			$(this).addClass("cur").siblings().removeClass("cur");
			$(".ad_mab .tb_q").eq($(".ad_top_2 ul li").index(this)).show().siblings().hide();
        });
		$(".gg_co1 a").click(function(){
			$(this).addClass("cur").siblings().removeClass("cur");
			$(".gg_co2 div").eq($(".gg_co1 a").index(this)).show().siblings().hide();
        });
		$(".gcm_list a").mouseover(function(){
			$(this).addClass("cur").siblings().removeClass("cur");
			$(".gcdt_m .gcdt_ever").eq($(".gcm_list a").index(this)).show().siblings().hide();
        });
        $(".help_pro_t ul li").mouseover(function(){
			$(this).addClass("cur").siblings().removeClass("cur");
			$(".ts_bz .ts_bz_col").eq($(".help_pro_t ul li").index(this)).show().siblings().hide();
			$(".ts_bz .help_pro_m").eq($(".help_pro_t ul li").index(this)).show().siblings().hide();
        });
       $(".help_pro_t  ul li").mouseover(function(){
			$(this).addClass("cur").siblings().removeClass("cur");
			$(".record_main .jiajiang_say").eq($(".help_pro_t  ul li").index(this)).show().siblings().hide();
        });
	
		     
    });
function click_a(divDisplay)
        {
            if(document.getElementById(divDisplay).style.display != "block")
            {
                document.getElementById(divDisplay).style.display = "block";
               
            }
            else
            {
                document.getElementById(divDisplay).style.display = "none";
                $("#bigD").css({width:0, height: 0});
            }
        }
		function click_b(divDisplay)
        {
           
                document.getElementById(divDisplay).style.display = "block";
                
            
        }
//
 $(function(){
		$(".zc_hm_fann h2 a").click(function() {
			if(document.getElementById("Program_Content").style.display != "table")
            {
                document.getElementById("Program_Content").style.display = "table";
                $(".zc_hm_fann h2 a").text("关闭");
                $(".zc_hm_fann h2 a").addClass('zc_hm_fann h2 span cur');//a.cur
                $(".zc_hm_fann h2 span").addClass('zc_hm_fann h2 a cur');
                $(".zc_hm_fann h2 a").removeClass('zc_hm_fann');
                
              //  $(".zc_hm_fann h2 a").css("background:url(../images/hm/zhm_05.gif)");
            }
            else
            {
                document.getElementById("Program_Content").style.display = "none";
                $(".zc_hm_fann h2 a").text("打开");
                $(".zc_hm_fann h2 a").removeClass("zc_hm_fann h2 span cur");
                $(".zc_hm_fann h2 span").removeClass('zc_hm_fann h2 a cur');
            }
		});
		});


		
		
$(function(){
        $("li.bfzb").mouseover(function(){
            $("#bf_xl").css('display','block');
        });
		$("li.bfzb").mouseout(function(){
            $("#bf_xl").css('display','none');

        });
		$("#bf_xl").mouseover(function(){
           $("#bf_xl").css('display','block');
        });
		$("#bf_xl").mouseout(function(){
           $("#bf_xl").css('display','none');
        });
		
});	
$(function(){
        $("li.zqzx").mouseover(function(){
            $("#zq_xl").css('display','block');
        });
		$("li.zqzx").mouseout(function(){
            $("#zq_xl").css('display','none');

        });
		$("#zq_xl").mouseover(function(){
           $("#zq_xl").css('display','block');
        });
		$("#zq_xl").mouseout(function(){
           $("#zq_xl").css('display','none');
        });
		
});	
		
$(function(){
        $(".nav h2").mouseover(function(){
            $("#nav_main").css('display','block');
        });
		$(".nav h2").mouseout(function(){
            $("#nav_main").css('display','none');

        });
		$("#nav_main").mouseover(function(){
           $("#nav_main").css('display','block');
        });
		$("#nav_main").mouseout(function(){
           $("#nav_main").css('display','none');
        });
		
});
$(function(){
        $(".nav h2").mouseover(function(){
            $("#nav_main").css('display','block');
        });
		$(".nav h2").mouseout(function(){
            $("#nav_main").css('display','none');

        });
		$("#nav_main").mouseover(function(){
           $("#nav_main").css('display','block');
        });
		$("#nav_main").mouseout(function(){
           $("#nav_main").css('display','none');
        });
		
});

$(function(){
        $(".gcdt_t .g_t_ssq").mouseover(function(){
		  $(".g_ssq_co1").css('display','none');
          $(".g_ssq_co2").css('display','block');
		 })
		 $(".gcdt_t .g_t_ssq").mouseout(function(){
		  $(".g_ssq_co1").css('display','block');
          $(".g_ssq_co2").css('display','none');
		 })
		  $(".gcdt_t .g_t_11x5").mouseover(function(){
		  $(".g_11x5_co1").css('display','none');
          $(".g_11x5_co2").css('display','block');
		 })
		 $(".gcdt_t .g_t_11x5").mouseout(function(){
		  $(".g_11x5_co1").css('display','block');
          $(".g_11x5_co2").css('display','none');
		 })
		  $(".gcdt_t .g_t_jc").mouseover(function(){
		  $(".g_jc_co1").css('display','none');
          $(".g_jc_co2").css('display','block');
		 })
		 $(".gcdt_t .g_t_jc").mouseout(function(){
		  $(".g_jc_co1").css('display','block');
          $(".g_jc_co2").css('display','none');
		 })
		 
		
});
$(function(){
        $(".kj_dlt h4").mouseover(function(){
          $(".gd_xl_dlt").css('display','block');
		})
		$(".kj_dlt h4").mouseout(function(){
          $(".gd_xl_dlt").css('display','none');
		})
		$(".gd_xl_dlt").mouseover(function(){
          $(".gd_xl_dlt").css('display','block');
		})
		 $(".gd_xl_dlt").mouseout(function(){
          $(".gd_xl_dlt").css('display','none');
		})
});

function click_c(divDisplay)
{
   
        document.getElementById(divDisplay).style.display = "block";
        var w=document.body.clientWidth;  
        var h= document.body.clientHeight;
       
        $("#bigD").css({width:w, height: h,"z-index":99998,position:"fixed","background-color":"transparent","opacity":"0.2"})
    
}
$(function(){
        $(".bind ul li.l1").mouseover(function(){
          $(".t1").css('display','block');
		})
		$(".bind ul li.l1").mouseout(function(){
          $(".t1").css('display','none');
		})
		 $(".bind ul li.l2").mouseover(function(){
          $(".t2").css('display','block');
		})
		$(".bind ul li.l2").mouseout(function(){
          $(".t2").css('display','none');
		})
		 $(".bind ul li.l3").mouseover(function(){
          $(".t3").css('display','block');
		})
		$(".bind ul li.l3").mouseout(function(){
          $(".t3").css('display','none');
		})
		 $(".bind ul li.l4").mouseover(function(){
          $(".t4").css('display','block');
		})
		$(".bind ul li.l4").mouseout(function(){
          $(".t4").css('display','none');
		})
		 $(".bind ul li.l5").mouseover(function(){
          $(".t5").css('display','block');
		})
		$(".bind ul li.l5").mouseout(function(){
          $(".t5").css('display','none');
		})
		
});
$(function(){
        $(".bank_select").mouseover(function(){
           
        	$(".bank_select").css('backgroundImage','url(/images/bank/bank1_03.gif)');
        });
		$(".bank_select").mouseout(function(){
            $(".bank_select").css('backgroundImage','url(/images/bank/bank_03.gif)');
        });
		
		
});	
$(function(){
        $(".bank_select").mouseover(function(){
          $(".bank_tan").css('display','block');
		})
		$(".bank_select").mouseout(function(){
          $(".bank_tan").css('display','none');
		})
		$(".bank_tan").mouseover(function(){
          $(".bank_tan").css('display','block');
		})
		 $(".bank_tan").mouseout(function(){
          $(".bank_tan").css('display','none');
		})
});
$(function(){
	$(".help_pro_m h3").click(function(){
	
		if($(this).attr("class")=="cur")
		{
		$(this).removeClass("cur");
		$(".sy_pro_list").each(function(){
			$(this).hide();
		})
		return false;
		}
		$(this).siblings().removeClass("cur");
		$(this).addClass("cur");
		$(".sy_pro_list").each(function(){
			$(this).hide();
		})
		$(this).next().show();
	})
});


$(function(){
	$(".help_lc_t li").click(function(){
		$(this).addClass("cur").siblings().removeClass("cur");
		$(".help_lc_mz .help_lc_m").eq($(".help_lc_t li").index(this)).show().siblings().hide();
    });
	$(".help_lcb li").click(function(){
		$(this).addClass("cur").siblings().removeClass("cur");
		$(".h_i_mz .h_i_m").eq($(".help_lcb li").index(this)).show().siblings().hide();
    });
	$(".help_lca a").click(function(){
		$(this).addClass("cur").siblings().removeClass("cur");
		$(".help_comz .help_com").eq($(".help_lca a").index(this)).show().siblings().hide();
    });
	
	$("#reg .h_i_m").click(function(){
		$("#"+"rcur"+($(this).index()+2)+"").addClass('cur').siblings().removeClass("cur");
		$("#reg .h_i_m").eq($(this).index()+1).show().siblings().hide();
	})
	$("#chongzhi .h_i_m").click(function(){
		$("#"+"ccur"+($(this).index()+2)+"").addClass('cur').siblings().removeClass("cur");
		$("#chongzhi .h_i_m").eq($(this).index()+1).show().siblings().hide();
	});
	$("#zhongjiang .h_i_m").click(function(){
		$("#"+"zcur"+($(this).index()+2)+"").addClass('cur').siblings().removeClass("cur");
		$("#zhongjiang .h_i_m").eq($(this).index()+1).show().siblings().hide();
	});
	$("#tikuan .h_i_m").click(function(){
		$("#"+"tcur"+($(this).index()+2)+"").addClass('cur').siblings().removeClass("cur");
		$("#tikuan .h_i_m").eq($(this).index()+1).show().siblings().hide();
	});
	$("#buy .h_i_m").click(function(){
		$("#"+"bcur"+($(this).index()+2)+"").addClass('cur').siblings().removeClass("cur");
		$("#buy .h_i_m").eq($(this).index()+1).show().siblings().hide();
	});
	$("#hemai .h_i_m").click(function(){
		$("#"+"hcur"+($(this).index()+2)+"").addClass('cur').siblings().removeClass("cur");
		$("#hemai .h_i_m").eq($(this).index()+1).show().siblings().hide();
	});

});
$(function(){
//	if (document.URL)  
	var tmpUPage =(document.URL).split( "/" );  
	var thisUPage = tmpUPage[tmpUPage.length-2 ];  
	if(thisUPage==""){
		$(".nav .li_a").addClass('cur').siblings().removeClass("cur");
	}
	if(thisUPage=="jc"||thisUPage=="zc"){
		$("#t_dating").addClass('cur').siblings().removeClass("cur");
	}
	$(".nav li a").each(function(){
		var Url=($(this).attr("href")).split( "/" )[1];
		
		if(thisUPage==Url){
			$(this).parent().addClass('cur').siblings().removeClass("cur");
		}
	});

});


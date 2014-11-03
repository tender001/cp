var TodayDate;
var LiuLanQi;
var isBrowser;
var SelectDate;
var MatchList 	= [];
var LotteryType = '';
//var base_url 	= '';
var base_url = 'http://test.qiuwin.com';
var DateArr 	= [];
var NoticeMatch	= [];
var match_ing	= [];
var GDiffOdds	= [];
var GDiffOddsKeyName	= ['1-5','6-10','11-15','16-20','21-25','26+'];
var match_zhiding	= [];
var OnTime = [];
var GMatchIng = ',1,2,3,4,5,6,7,8,50,';
var GMatchEnd = ',-1,-3,';
var GNotMatchState = ',0,-2,-4,-5,';
var GKeyNumArr = {'one':5,'two':6,'three':7,'four':8,'odds':13, 'handicap':15,'bs':14,'goalsdiff':12};
$(function(){
	makePage();
	
	updateQiHao();
	
	updateLeagueList();
	
	lotteryNoFuDong();
	
	tableCol();
	
	changeAllOddsCol();	

	//关闭遮罩层
	closeDiv();
		
	onTimeFun();
});


function onTimeFun(){

	OnTime['eventEveryTime'] = setInterval('ZBlive()',2000);
	return true;
}


function lotteryNoFuDong(){
	$(".subitem").hover(function(){
	  $(this).addClass("open").find(".subitem_cont").show();
	},function(){
	  $(this).removeClass("open").find(".subitem_cont").hide();
	});
	$("li.date").hover(function(){
		$(this).addClass("hoverbg");
	},function(){
		$(this).removeClass("hoverbg");
	});
}


function tableCol(){
	//表格交替颜色
	$(".interlaced_color tr:not('.nnnbg'):odd").addClass("odd");
	$(".interlaced_color tr:not('.nnnbg'):even").addClass("even")
	$(".interlaced_color tr").not(".nnnbg").hover(function(){
		$(this).addClass("hover")
	},function(){
		$(this).removeClass("hover")
	});
	return true;
}


function makePage(){
	var url_arr = GetRequest();
	var is_ok   = MainTable(url_arr['date']);
	return is_ok;
}


/*获取数据*/
function MainTable( date_select ){
	var is_ok = 1;
	$.ajax({
		url: base_url+'/Match/AjaxBaskMatchZB.php',
		type: 'GET',
		dataType: 'jsonp',
		async: false,
		jsonp:'callback',
		jsonpCallback:"jsonpCallbackE",
		data: 'date='+date_select+'&lx='+2,
		timeout:5000,
		success: function (data) {
			return;
			if( data!=null ){
				LotteryType = data['type'];
				DateArr 	= data['LotteryNoList'];
				TodayDate 	= data['TodayDate'];
				SelectDate 	= data['SelectDate'];
				GDiffOdds 	= data['DiffOdds'];
				
				var title_str = makeTitleUl();
				var table_str = makeTable( data['MatchList'] );
				
				$('#list_tbody').html(table_str);
			}else{
				alert('No Data');
			}
		},
		error:function(){
			is_ok = 2;
		}
	});
	return is_ok;
}

function jsonpCallbackE(data) {
		if( data!=null ){
			LotteryType = data['type'];
			DateArr 	= data['LotteryNoList'];
			TodayDate 	= data['TodayDate'];
			SelectDate 	= data['SelectDate'];
			GDiffOdds 	= data['DiffOdds'];
			
			var title_str = makeTitleUl();
			var table_str = makeTable( data['MatchList'] );
			
			$('#list_tbody').html(table_str);
			updateQiHao();
		}else{
			alert('No Data');
		}
		}


function makeTable( match_list ){
	
	if( match_list==null || match_list.length==0 ){
		var page_str = '<tr><td colspan=18 align="center" style="color:red;">当前暂无比赛</td></tr>';
		return page_str;
	}
	
	var table_str = '';
	var match = [];
	var color_big = 'li_redbig ';
	var away_one = home_one = away_two = home_two = away_three = home_three = away_four = home_four  = '-';
	var home_add = away_add = home_up = home_down = away_up = away_down = home_goals = away_goals = goals_cha = '-';
	var match_remark = '';	
	var away_odds = home_odds = '';
	var away_h = home_h = '';
	var away_bs = home_bs = show_time = '';
	var show_time_arr = [];
	var time_c = 0;
	for( var k_m in match_list ){
		match = match_list[k_m];

		table_str += '<tr match_id="'+match['MatchID']+'" num="'+k_m+'" id="'+match['MatchID']+'_tr" >';
		//序号
		table_str += '<td SclassType="'+match['SclassType']+'" >'+match['BetOrderN']+'</td>';
		//联赛
		table_str += '<td style="background:'+match['Color']+';color:#fff" >'+match['LeagueNameJS']+'</td>';
		//时间
		show_time = match['MatchDateTimeN'];
		show_time_arr = show_time.split(' ');
		time_c = show_time_arr.length;
		if( time_c>1 ){
			show_time = '<div width="100%">'+show_time_arr[0]+'</div><div width="100%">'+show_time_arr[1]+'</div>';
		}
		table_str += '<td style="white-space: pre-line;line-height: 21px;">'+show_time+'</td>';
		//状态
		table_str += '<td status="'+match['MatchState']+'">'+match['MatchStateName'];
		if(GMatchIng.indexOf(','+match['MatchState']+',')!=-1&& match['MatchState']!=50 ){
			table_str += '<br>'+match['RemainTime'];
		}
		table_str +='</td>';
		//队伍名称
		table_str += '<td class="basteam">';
		table_str += '<li class="li_rangqiu_0"><i class="away">客</i><label name="away_j">'+match['AwayName']+'</label><label style="display:none;" name="away_f">'+match['AwayNameF']+'</label>';
		if(match['AwayRank']!=null && match['AwayRank'].length>0 )
		{
			table_str += '<sup class="awayrank">['+match['AwayRank']+']</sup>';
		}
		table_str += '</li>';
		table_str += '<li class="li_rangqiu_1"><i class="home">主</i><label name="home_j">'+match['HomeName']+'</label><label style="display:none;" name="home_f">'+match['HomeNameF']+'</label>';
		if(match['HomeRank']!=null && match['HomeRank'].length>0 )
		{
			table_str += '<sup class="homerank">['+match['HomeRank']+']</sup>';
		}
		table_str += '</li></td>';
		
		away_one = home_one = away_two = home_two = away_three = home_three = away_four = home_four  = '-';
		home_add = away_add = home_up = home_down = away_up = away_down = home_goals = away_goals = goals_cha = '-';
		
		if( GNotMatchState.indexOf(','+match['MatchState']+',')==-1 ){
			home_add = match['HomeAddSum'];
			away_add = match['AwayAddSum'];
			
			home_up = match['HomeHalf1'];
			home_down = match['HomeHalf2'];
			away_up = match['AwayHalf1'];
			away_down = match['AwayHalf2'];
			
			home_goals = match['HomeGoals'];
			away_goals = match['AwayGoals'];
			
			goals_cha  = match['GoalsCha'];
			if(match['SclassType']!='2'){
				away_one   = match['AwayOne'];
				home_one   = match['HomeOne'];
				away_three = match['AwayThree'];
				home_three = match['HomeThree'];
			}
		
			away_two  = match['AwayTwo'];
			home_two  = match['HomeTwo'];
			away_four = match['AwayFour'];
			home_four = match['HomeFour'];
		}

		//一节
		table_str += '<td class="noborder noborder point"><li class="li_rangqiu_0">'+away_one+'</li><li class="li_rangqiu_1">'+home_one+'</li></td>';
		//二节
		table_str += '<td class="noborder point"><li class="li_rangqiu_0">'+away_two+'</li><li class="li_rangqiu_1">'+home_two+'</li></td>';
		//三节
		table_str += '<td class="noborder point"><li class="li_rangqiu_0">'+away_three+'</li><li class="li_rangqiu_1">'+home_three+'</li></td>';
		//四节
		table_str += '<td class="noborder point"><li class="li_rangqiu_0">'+away_four+'</li><li class="li_rangqiu_1">'+home_four+'</li></td>';
		
		//加时
		table_str += '<td class="noborder point"><li class="li_rangqiu_0">'+away_add+'</li><li class="li_rangqiu_1">'+home_add+'</li></td>';
		
		//上/下
		table_str += '<td class="noborder point"><li class="li_rangqiu_0">'+away_up+'/'+away_down+'</li><li class="li_rangqiu_1">'+home_up+'/'+home_down+'</li></td>';
		
		//全场
		if( match['MatchState']>=1 && match['MatchState']<=8){
			quan_class = 'bluebold';
		}else{
			quan_class = 'redbold';
		}
		table_str += '<td class="noborder point '+quan_class+'"><li class="li_rangqiu_0">'+away_goals+'</li><li class="li_rangqiu_1">'+home_goals+'</li></td>';
		
		//分差
		table_str += '<td>';
		table_str += '<li class="li_rangqiu_0 " style="text-align:left" ><span style="display: inline-block; width: 35px;text-align:center">'+goals_cha+'</span></li>';
		table_str += '<li class="li_rangqiu_1 " style="text-align:left;" ><span style="display: inline-block; width: 35px;text-align:center;"></span>&nbsp;&nbsp;<span ></span></li>';
		table_str +='</td>';
			
		//胜负
		away_odds = home_odds = '';
		if( match['odds']['LostOdds'] ){
			away_odds = '客&nbsp;<span>'+match['odds']['LostOdds']+'</span>';
			home_odds = '主&nbsp;<span>'+match['odds']['WinOdds']+'</span>';
		}
		table_str += '<td><li class="li_rangqiu_0 ">'+away_odds+'</li><li class="li_rangqiu_1 ">'+home_odds+'</li></td>';
			
		//大小分
		away_bs = home_bs = '';
		if( match['b_s']['HandicapNumber'] ){
			away_bs = '＞<span>'+match['b_s']['HandicapNumber']+'</span>&nbsp;&nbsp;<span>'+match['b_s']['SmallOdds']+'</span>';	
			home_bs =  '＜<span>'+match['b_s']['HandicapNumber']+'</span>&nbsp;&nbsp;<span>'+match['b_s']['BigOdds']+'</span>';
		}
		table_str += '<td><li class="li_rangqiu_0 ">'+away_bs+'</li><li class="li_rangqiu_1 ">'+home_bs+'</li></td>';

		//让分胜负
		away_h = home_h = '';
		if( match['handicap']['UnderLine'] ){
		away_h = '<span >客&nbsp;'+match['handicap']['UnderLine']+'</span>';
		home_h = '<span>'+match['handicap']['HandicapNumber']+'</span>&nbsp;<span>主&nbsp;'+match['handicap']['OverLine']+'</span>';	
		}
		table_str += '<td><li class="li_rangqiu_0 " style="text-align:right;padding-right:10px;">'+away_h+'</li><li class="li_rangqiu_1 " style="text-align:right;padding-right:10px;" >'+home_h+'</li></td>';
		//直播
		table_str += '<td></td>';
		//置顶
		table_str += '<td><a class="stick" title="置顶" onclick="getAccessNotice('+match['MatchID']+');zhiding('+match['MatchID']+','+k_m+');" href="javascript:void(0)"></a></td>';
		table_str += '</tr>';
		
		//直播
		table_str += '<tr id="trzb_'+match['MatchID']+'" class="sperate"><td class="noborder point"><i class="word_h">文字直播</i></td ><td colspan="18"><span class="word_h">';
		
		match_remark = '';
		if( match['MatchRemark'].length>0 ){ match_remark = match['MatchRemark']; }	
		if( GNotMatchState.indexOf(','+ match['MatchState']+',')==-1 ){ 
			match_remark = '暂无数据'; 
		}
		
		table_str += match_remark;	
		table_str += '</span></td></tr>';
		
	}	
	return table_str;
}


	function toggleHomeAwayIcon(){
		
		$('i[class="away"]').toggle();
		$('i[class="home"]').toggle();
		return true;
	}


	function toggleRank(){
		$('sup').toggle();
		return true;
	}

	function hideMatchTr( match_id ){
		$('#'+match_id+'_tr').hide();
		$('#trzb_'+match_id).hide();
		return true;
	}


	function showMatchTr( match_id ){
		$('#'+match_id+'_tr').show();
		$('#trzb_'+match_id).show();
		return true;
	}


	function zhiding( match_id ,num){
		$('#zhiding_tbody').show();
	    $('#zhiding_tr_match').show();
		
		var match_str = $('#'+match_id+'_tr').html();
		var zb_str = $('#trzb_'+match_id).html();
		
		$('#'+match_id+'_tr').remove();
		$('#trzb_'+match_id).remove();
		
		match_str = '<tr name="MatchIDTr" class="nnnbg zhidingbg" num="'+num+'" match_id="'+match_id+'" id="'+match_id+'_tr" >'+match_str+'</tr>';
		
		zb_str = '<tr id="trzb_'+match_id+'" class="sperate odd">'+zb_str+'</tr>';
		
		match_str +=zb_str;
		$('#zhiding_tr_match').before( match_str ); 
		
		var a_str = '<a href="javascript:void(0);" title="撤销置顶" onclick="delNoticeMatch('+match_id+');unzhiding('+match_id+','+num+')" class="stick on"></a>';
		$('#'+match_id+'_tr td:last').html( a_str );
		
		return true;	
	}


	function delNoticeMatch(){
		return true;
	}


	function unzhiding( match_id,num ){
		var str_list = $('#'+match_id+'_tr').html();
		var zb_str = $('#trzb_'+match_id).html();
		
		$('#'+match_id+'_tr').remove();
		$('#trzb_'+match_id).remove();
		
		str_list = '<tr name="MatchIDTr" class="color1" num="'+num+'" match_id="'+match_id+'" id="'+match_id+'_tr" >'+str_list+'</tr>';
		zb_str = '<tr id="trzb_'+match_id+'" class="sperate odd">'+zb_str+'</tr>';
		
		str_list +=zb_str;
		
		var is_last = 2;
		var num_list = 0;
		$('#list_tbody>tr').each(function(){
			num_list = $(this).attr('num');
			if( num_list>num ){
			$(this).before(str_list);
			is_last = 1;
			return false;
		}
	});
	if( is_last==2 ){
		$('#list_tbody').append( str_list );
	}
	
	var a_str = '<a href="javascript:void(0);" title="置顶" onclick="getAccessNotice('+match_id+');zhiding('+match_id+','+num+')" class="stick"></a>';
	$('#'+match_id+'_tr td:last').html( a_str );
	
	if($('#zhiding_tbody>tr:not("#zhiding_tr_match")').length<=0){
		$('#zhiding_tbody').hide();
		$('#zhiding_tr_match').hide();
	}
	
	delZhidingArr(match_id);
	tableCol();
	return true;
}



function unzhidingAll(){
	var match_id,num;
	$('#zhiding_tbody>tr:not("#zhiding_tr_match")').each(function(){
		match_id = $(this).attr('match_id');
		num 	 = $(this).attr('num');
		if( match_id !=undefined ){
			unzhiding( match_id ,num);
		}
	});
	return;
}


function onloadSong(){
	$("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			$(this).jPlayer("setMedia", {mp3:"./swf/ga.mp3"});
		},
		swfPath: "./swf",
		supplied: "mp3"
	});
}


function teamRank(){
	$('sup[class="awayrank"]').toggle();
	$('sup[class="homerank"]').toggle();
	return true;
}




/*ZB*/
function ZBlive(){
	$.getScript('http://221.228.229.211/live/baskbf.js', function() {
		eval(mlist);
		for( var match_id in mlist ){ 
			match = mlist[match_id];
			match_arr = match.split('^');
			ZBchangeMatch( match_arr );
		}
	});
}

function ZBchangeMatch( match_arr ){
  
	ZBchangeGoals( match_arr );
	ZBchangeStatus(match_arr);
	ZBchangeWord(match_arr);
	ZBchangeGoalsCol(match_arr);
	ZBchangeOdds(match_arr[22]);
	return true;
}



function ZBchangeGoalsCol( match_arr ){
	var match_id = match_arr[22];
	var e_num = {1:'one',2:'two',3:'three',4:'four',5:'addGoals',6:'addGoals',7:'addGoals',8:'addGoals'};
	var e_arr = {1:5,2:7,3:9,4:11,5:16,6:16,7:16,8:16};
	var match_state = parseInt(match_arr[1]);
	//--td
	var e_td_num = e_num[match_state];	
	if( e_td_num==undefined ){ return true; }
	var td_num = GKeyNumArr[e_td_num];
	var home_goals = GetMatchInfo( match_id,'home'+td_num );
	var away_goals = GetMatchInfo( match_id,'away'+td_num );
	
	//--arr
	var home_key = parseInt(e_arr[match_state]);
	var away_key = home_key+1;	
	
	if( home_goals!=match_arr[home_key] ){
		addGoalsCol( match_id,td_num,1 );
		setTimeout('removeGoalsCol('+match_id+','+td_num+',1)',10000  );		
	}	
	if( away_goals!=match_arr[away_key] ){
		addGoalsCol( match_id,td_num,0 );	
		setTimeout('removeGoalsCol('+match_id+','+td_num+',0)',10000  );		
	}
	return true;
}


function addGoalsCol( match_id,td_num,li_index ){
	$('#'+match_id+'_tr>td:eq('+td_num+')>li:eq('+li_index+')').addClass('time_goal');
	return true;
}


function removeGoalsCol( match_id,td_num,li_index ){
	$('#'+match_id+'_tr>td:eq('+td_num+')>li:eq('+li_index+')').removeClass('time_goal');
	return true;
}


function ZBchangeGoals(match_arr){
	
	var match_id = match_arr[22];
	var sclasstype = GetMatchInfo( match_id,'SclassType' );
	if( sclasstype=='4' )
	{	
		$('#'+match_id+'_tr>td:eq(5)>li:eq(0)').text(match_arr[6]);
		$('#'+match_id+'_tr>td:eq(5)>li:eq(1)').text(match_arr[5]);
		
		$('#'+match_id+'_tr>td:eq(6)>li:eq(0)').text(match_arr[8]);
		$('#'+match_id+'_tr>td:eq(6)>li:eq(1)').text(match_arr[7]);
	  
		$('#'+match_id+'_tr>td:eq(7)>li:eq(0)').text(match_arr[10]);
		$('#'+match_id+'_tr>td:eq(7)>li:eq(1)').text(match_arr[9]);
	  
		$('#'+match_id+'_tr>td:eq(8)>li:eq(0)').text(match_arr[12]);
		$('#'+match_id+'_tr>td:eq(8)>li:eq(1)').text(match_arr[11]);
	  
		$('#'+match_id+'_tr>td:eq(9)>li:eq(0)').text(match_arr[17]);
		$('#'+match_id+'_tr>td:eq(9)>li:eq(1)').text(match_arr[16]);
	}
	$('#'+match_id+'_tr>td:eq(10)>li:eq(0)').text(match_arr[27]+'/'+match_arr[28]);
        $('#'+match_id+'_tr>td:eq(10)>li:eq(1)').text(match_arr[25]+'/'+match_arr[26]);
	  
	$('#'+match_id+'_tr>td:eq(11)>li:eq(0)').text(match_arr[4]);
	$('#'+match_id+'_tr>td:eq(11)>li:eq(1)').text(match_arr[3]);
  	var cha = match_arr[4]-match_arr[3];
	if( cha>0 ){
		cha = '+'+cha;
	}
	$('#'+match_id+'_tr>td:eq(12)>li:eq(0)>span:eq(0)').text(cha);
	return true;
}


function ZBchangeStatus( match_arr ){
  //0:未开赛,1:一节,2:二节,5:1'OT，以此类推，-1:完场, -2:待定,-3:中断,-4:取消,-5:推迟,50中场
  var text_status= '';
  var status_match = {1:"第一节",2:"第二节",3:"第三节",4:"第四节",5:'加时一',6:"加时二",7:"加时三",8:"加时四"};
  var match_id = match_arr[22];
  var new_time = '';
  switch(match_arr[1]){
	case '0':
		text_status = '未';
		break;
	case '1':
	case '2':
	case '3':
	case '4':
	case '5':
	case '6':
	case '7':
		text_status = status_match[match_arr[1]];
		new_time = match_arr[2].replace(/[ ]/g,"");
		if( new_time.length>0 ){
			text_status += '<br>'+match_arr[2];
		}else{
			text_status += '<br>完';
		}

		break;
	case '-1':
		text_status = '完场';
		break;
	case '-2':
		text_status = '待定';
		break;
	case '-3':
		text_status = '中断';
		break;
	case '-5':
		text_status = '推迟';
		break;
	case '50':
		text_status = '中场';
		break;
  }
  $('#'+match_id+'_tr>td:eq(3)').html(text_status);  
  return true;
}


function ZBchangeWord( match_arr ){
	var match_id = match_arr[22];
	$('#trzb_'+match_id+'>td:eq(1)>span:eq(0)').html( match_arr[14] );
	return true;
}


function ZBchangeOdds(match_id){
	if( match_id.length<0 ||match_id==undefined||match_id==null ){ return false; }
	var home_g = GetMatchInfo( match_id,'HomeGoals' );
	var away_g = GetMatchInfo( match_id,'AwayGoals' );	
	var bs_home = GetMatchInfo( match_id,'BSHome' );	
	var handicap_num = GetMatchInfo( match_id,'HandicapNumberH' );	
	var diff_goals = GetMatchInfo( match_id,'DiffGoals' );	
	var MatchState = GetMatchInfo( match_id,'MatchState' );	
	
	var is_win = 0;
	if(home_g>away_g  ){ is_win = 1;}
	var is_win_h = 0;
	var home_g_rang = parseInt(home_g)+parseFloat( handicap_num);
	if( home_g_rang>away_g ){ is_win_h=1; }
	var sum_g = parseInt(home_g)+parseInt(away_g);
	
	//胜负
	odds_td_num = GKeyNumArr['odds'];
	$('#'+match_id+'_tr>td:eq('+odds_td_num+')>li:eq('+is_win+')').addClass('li_redbig').siblings('li').removeClass('li_redbig');
	//大小分
	bs_td_num = GKeyNumArr['bs'];
	var is_big = 0;
	if( sum_g<bs_home ){ is_big = 1; }
	$('#'+match_id+'_tr>td:eq('+bs_td_num+')>li:eq('+is_big+')').addClass('li_redbig').siblings('li').removeClass('li_redbig');
	//让分胜负
	handicap_td_num = GKeyNumArr['handicap'];
	$('#'+match_id+'_tr>td:eq('+handicap_td_num+')>li:eq('+is_win_h+')>span:eq('+is_win_h+')').addClass( 'li_span_redbig' ).parent('li').siblings('li').children('span').removeClass('li_span_redbig');
	
	//分差赔率
	var diff_key = GetDiffType( diff_goals );	
	if( diff_key!=10 && GDiffOdds[match_id]!=undefined ){
		var is_ha = 'home';
		if(diff_goals<0){ is_ha = 'away' }
		var diff_td_num = GKeyNumArr['goalsdiff'];	
		var diff_odds = GDiffOdds[match_id][is_ha];
		var diff_key_add = parseInt(diff_key)+1;
		var odds_val = diff_odds['Odds'+diff_key_add];
		odds_val = parseFloat(odds_val).toFixed(2);
		var odds_key_name = GDiffOddsKeyName[diff_key];
	}else{
		odds_key_name = odds_val = '';
	}

	$('#'+match_id+'_tr>td:eq('+diff_td_num+')>li:eq(1)>span:eq(0)').text(odds_key_name).addClass('li_span_redbig');
	$('#'+match_id+'_tr>td:eq('+diff_td_num+')>li:eq(1)>span:eq(1)').text(odds_val).addClass('li_span_redbig');
}


function GetDiffType( diff_goals ){
	var diff_goals = Math.abs( diff_goals );
	var type_num = 10;
	if( diff_goals>=1&& diff_goals<=5 ){
		type_num = 0;
	}

	if( diff_goals>=6&& diff_goals<=10 ){
		type_num = 1;
	}
	
	if( diff_goals>=11&& diff_goals<=15 ){
		type_num = 2;
	}	
	if( diff_goals>=16&& diff_goals<=20 ){
		type_num = 3;
	}

	if( diff_goals>=21&& diff_goals<=25 ){
		type_num = 4;
	}	
	if( diff_goals>25 ){
		type_num = 5;
	}	
	return type_num;

}

/*ZB END*/

function GetMatchInfo( match_id,key_num ){
	var value = '';
	switch(key_num){
		case 'MatchState':
			value = $('#'+match_id+'_tr>td:eq(3)').attr('status');
			break;
    		case 'HomeGoals':
      			value = $('#'+match_id+'_tr>td:eq(11)>li:eq(1)').text();
      			break;
    		case 'AwayGoals':
       			value = $('#'+match_id+'_tr>td:eq(11)>li:eq(0)').text();
      			break;
    		case 'DiffGoals':
      			value = $('#'+match_id+'_tr>td:eq(12)>li:eq(0)>span:eq(0)').text();
      			break;
    		case 'BSHome':
      			value = $('#'+match_id+'_tr>td:eq(14)>li:eq(0)>span:eq(0)').text();
      			break;
		case 'HandicapNumberH':
			value = $('#'+match_id+'_tr>td:eq(15)>li:eq(1)>span:eq(0)').text();
			break;
		case 'SclassType':
			value = $('#'+match_id+'_tr>td:eq(0)').attr('SclassType');
			break;
		case 'HomeOne':
		case 'home5':
			value = $('#'+match_id+'_tr>td:eq(5)>li:eq(1)').text();
			break;
		case 'AwayOne':
		case 'away5':
			value = $('#'+match_id+'_tr>td:eq(5)>li:eq(0)').text();
			break;
		case 'HomeTwo':
		case 'home6':
			value = $('#'+match_id+'_tr>td:eq(6)>li:eq(1)').text();
			break;
		case 'AwayTwo':
		case 'away6':
			value = $('#'+match_id+'_tr>td:eq(6)>li:eq(0)').text();
			break;
		case 'HomeThree':
		case 'home7':
			value = $('#'+match_id+'_tr>td:eq(7)>li:eq(1)').text();
			break;
		case 'AwayThree':
		case 'away7':
			value = $('#'+match_id+'_tr>td:eq(7)>li:eq(0)').text();
			break;
		case 'HomeFour':
		case 'home8':
			value = $('#'+match_id+'_tr>td:eq(8)>li:eq(1)').text();
			break;
		case 'AwayFour':
		case 'away8':
			value = $('#'+match_id+'_tr>td:eq(8)>li:eq(0)').text();
			break;
			
	}
	return value;
}


function changeAllOddsCol(){
	var match_id;
	var status_match;
	var match_str;
	$('#list_tbody>tr').each(function(){
		match_id = $(this).attr('match_id');
		if(isNaN(parseInt(match_id))  ){return true;}
		
		status_match = GetMatchInfo( match_id,'MatchState' );
		match_str = GMatchIng+GMatchEnd;
		if( match_str.indexOf(','+status_match+',')==-1 ){ return true; }
		ZBchangeOdds( match_id );
	});
}

function allData(){
	$('#list_tbody>tr').show();

	$('input[name="league_list"]').attr('checked',true);

	return true;
}


function toggleWordLive(){
	$('.word_h').toggle();		
	return true;
}

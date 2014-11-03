var ip_211 				= '221.228.229.211';	/*221.228.229.211*/
var ip_210 				= 'http://www.qiuwin.com';	/*221.228.229.210*/
//var base_url 			= '/trunk/dataweb';
//var base_url 			= '';
var base_url 			= 'http://test.qiuwin.com';
var LotteryType 		= '';
var NoticeMatch			= [];
var match_ing 			= [];
var OnTime				= [];
var match_zhiding		= [];
var noticeTimeoutId 	= '' ;
var isOldData 			= new Array;
var OddsList 			= new Array;
var AllOdds 			= new Array;
var isOutLine 			= 2;
var updateDataUpTime 	= (new Date()).valueOf();
var TodayDate 			= '';
var SelectDate 			= '';
var DateArr 			= new Array;
var onmatch_str 		= ',1,3,4,';
var onmatch_color_str 	= ',1,2,3,4,';
var odds_type_arr 		= ['JOdds','EOdds','Handicap'];
var m_checked_arr 		= ['fun2','fun3'];
var mcheckname_arr 		= ['league_list'];
var hidden_name_arr 	= ['home_f','away_f'];
var days_name			= ['今天','昨天','前天'];
var fun4_arr			= ['','让球'];
var five_league_str 	= '英超,意甲,法甲,德甲,西甲';
var LiuLanQi 			= 'other';
var LocalStorageArrKey	= ['BF_fun4','BF_fun5'];
var STime				= 0;
var CTime				= 0;
$(function(){
	/*read localStorage*/
	getLocalStorageCheck();
	
	//--base make
	MakeBaseData();
	
	makeCTime();
	
	getMatchIDAll();
	
	//--初始化参数
	flushFun();

	//--标头显示
	$('#bfbiaotou li').not('.change_lau').each(function(){
		var vals_t = $(this).children('a').attr('vals_t');
		if( vals_t.indexOf(LotteryType)!=-1 ){
			$(this).addClass('score_page');
		}else{
			$(this).removeClass('score_page');
		}
	});

	$("li.date").hover(function(){
		$(this).addClass("hoverbg");
	},function(){
		$(this).removeClass("hoverbg");
	});
	
	closeDiv();
	$(window).resize(showCheckBoxFudong);
});


function MakeBaseData(){
	//--获取参数
	var url_arr = GetRequest();
	
	var is_ok   = MainTable(url_arr['date'],url_arr['type']);
	//alert(is_ok);
	
	/*
	if( is_ok!=2 ){
		//--更新函数
		minFlushPage();
	}
	
	//*/
	return is_ok;
}


function oddsTitleClass(){

	$(".sptitle").not(".tabed").hover(function(){
	   $(this).addClass("hover");	
	},function(){
	   $(this).removeClass("hover");	
	});
	return true;
}


function tableTrColor(){
	//表格交替颜色
	$(".interlaced_color>tr:not('.nnnbg'):odd").removeClass('even').addClass("odd");
	$(".interlaced_color>tr:not('.nnnbg'):even").removeClass('odd').addClass("even")
	$(".interlaced_color>tr").not(".nnnbg").hover(function(){
		$(this).addClass("hover")
	},function(){
		$(this).removeClass("hover")
	});
	return ;
}



/*刷新*/
function flushFun(){
	
	isBrowser();
	
	onloadSong();
	//--
	unzhidingAll();
	
	updateQiHao();
	
	FirstChecked();
	
	onTimeFun();
	//--get access
	if( notify.permissionLevel()=='default' ){
		notify.requestPermission();
	}
	return ;
}


function minFlushPage(){
	
	oddsTitleClass();
	//--
	if( LotteryType=='jingcaizuqiu' ){
		//var fun4_check = fun4Checked();
		//if( fun4_check==1 ){
		//	$('i[name="rangqiu_i_h"]').show();
		//}
		
		changeOdds('JOdds');
	}else{
		
		changeOdds('EOdds');
	}

	//--time/league浮动
	addFundong();
	
	//--图表浮动
	SorHPL();
	
	bifenFudong();
	
	updateLeagueList();
	tableTrColor();
	
	setLeagueCount();
	$.sortTable({tableId:"data_table"});
	
}


function onTimeFun(){

	OnTime['updateData'] 				= setInterval('updateData()',2000);
	OnTime['eventEveryTime'] 			= setInterval('eventEveryTime()',60000);
	OnTime['startChangeEventPlayer'] 	= setInterval('startChangeEventPlayer()',50000);
	OnTime['startChangeTechState'] 		= setInterval('startChangeTechState()',300000);
	return true;
}

function addOnTimeFun( sliderIntervalID,m_second ){

	OnTime[sliderIntervalID] = setInterval(sliderIntervalID+'()',m_second);
	return true;
}

function clearOnTimeFun( sliderIntervalID ){
	
	if( OnTime[sliderIntervalID]==undefined ){ return false; }
	
	clearInterval(OnTime[sliderIntervalID]);
	return true;
}


function startChangeEventPlayer(){
	var is_checked = getHightStatus();
	if(is_checked==true  ){ return true; }
	$.getScript('http://221.228.229.211/live/bfplayer.js', function() {
		var mlist_c = mlist.length;
		if(mlist_c>0){
			eval(mlist);
			var rq_arr = checkData( mlist );
			appentEventPlayer(rq_arr,1);
		}
	});
}


function checkData( rq ){
	var arr_one = '';
	var re_arr  = new Array;
	for( var k in rq )
	{	
		arr_one = rq[k].split('^');
		
		if( re_arr[arr_one[0]] instanceof Array ==false  )
		{
			re_arr[arr_one[0]] = new Array;
		}
		arr_len = re_arr[arr_one[0]].length;
		
		re_arr[arr_one[0]][arr_len] = arr_one;
	}
	return re_arr;
}


function FirstChecked(){
	var id_m = name = '';
	for( var k_m in m_checked_arr ){
		id_m = m_checked_arr[k_m];
		$('#'+id_m).attr('checked','checked');
	}
	
	for( var k_n in mcheckname_arr ){
		name = mcheckname_arr[k_n];
		$('input[name="'+name+'"]').attr('checked','checked');
	}
	return ;
}


function FirstHidden(){
	
}


function updateQiHao(){
	var date_str = date_class = '';
	for( var date_k in DateArr ){
		date_class = '';
		
		if( date_k 	== TodayDate ){ date_class = 'score_today'; }
		jump_url 	= '?type='+LotteryType+'&date='+date_k;
		
		if(LiuLanQi=='chrome'&& LotteryType!='jingcaizuqiu'  )
		{
			date_str = '<li onclick=jumpPage("'+jump_url+'"); class="'+date_class+' date" >'+DateArr[date_k]+'</li>'+date_str;
		}
		else
		{
			date_str += '<li onclick=jumpPage("'+jump_url+'"); class="'+date_class+' date" >'+DateArr[date_k]+'</li>';
		}
	}
	$('#qihaoBox').append( date_str );
	
	$('#select_date_h').val( SelectDate );
	$('#select_date_a').text( SelectDate );
	
	return true;
}


function isBrowser(){
	var Sys={};
	
	var ua=navigator.userAgent.toLowerCase();
	var s;
	(s=ua.match(/msie ([\d.]+)/))?Sys.ie=s[1]:
	(s=ua.match(/firefox\/([\d.]+)/))?Sys.firefox=s[1]:
	(s=ua.match(/chrome\/([\d.]+)/))?Sys.chrome=s[1]:
	(s=ua.match(/opera.([\d.]+)/))?Sys.opera=s[1]:
	(s=ua.match(/version\/([\d.]+).*safari/))?Sys.safari=s[1]:0;
	
	if(Sys.ie){//Js判断为IE浏览器		
		if(Sys.ie=='9.0'){//Js判断为IE 9
			LiuLanQi = 'IE9';
		}else if(Sys.ie=='8.0'){//Js判断为IE 8
			LiuLanQi = 'IE8';
		}else{
			LiuLanQi = 'IE';
		}
	}
	if(Sys.firefox){//Js判断为火狐(firefox)浏览器
		LiuLanQi = 'FF';
	}
	if(Sys.chrome){//Js判断为谷歌chrome浏览器
		LiuLanQi = 'chrome';
	}
	if(Sys.opera){//Js判断为opera浏览器
		
		LiuLanQi = 'opera';
	}
	if(Sys.safari){//Js判断为苹果safari浏览器
		LiuLanQi = 'safari';
	}
	return ;
}

function jumpPage(jump_url){
	window.location.href=jump_url; 
}


function updateLeagueList(){
	var ss= new Array;
	var league_str = '';
	var tr_str = '<tr>';
	var i = 1;
	$( '#list_tbody>tr' ).each(function(){
		
		//now_league = $(this).children('td:eq(1)').children('input[name="league_id_h"]').val();
		now_league = $(this).children('td:eq(1)').text();
		
		if( league_str.indexOf(now_league)==-1 )
		{        
			league_str +=now_league+',';		
			tr_str +='<td><label>';
			tr_str +='<input type="checkbox" name="league_list" onclick="checkMatch();" value="'+now_league+'" checked="checked"> &nbsp;'+now_league+'</label></td>';
			if( i%5==0 ){
				tr_str +='</tr>';
			} 
			i++;
		}	
	});

	if( i%5==0 ){
		tr_str +='</tr>';
	}

  $('#league_list_tbody').html( tr_str );
}


function startChangeTechState(){
	var is_checked = getHightStatus();
	if( is_checked==true ){ return true; }
	$.getScript('http://'+ip_211+'/live/livestate.js', function() {
		eval(stateList);
		makeTeachState( stateList );
	});
}


function getMatchTeachState( MatchIDs ){
	if( MatchIDs.length<=0 ){ return false;}
	$.ajax({
		url: base_url+'/Match/AjaxMatchLiveTeachState.php',
		type: 'GET',
		dataType: 'jsonp',
		async: false,
		jsonp: 'callback',
		jsonpCallback:"jsonpCallbackA",
		data: 'MatchIDs='+MatchIDs+'&lx='+2,
		timeout: 5000,
		success: function (data) {
			return;
			if( data!=null ||data=='2'  ){
				makeTeachState( data );
			}
		}
	});
}

function jsonpCallbackA(data) {
			if( data!=null ||data=='2'  ){
				makeTeachState( data );
			}
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

function getMatchIDAll(){

	//--ajax获取event
	var matchid_arr = new Array();
	var is_over ,match_id;
	$('#list_tbody>tr').each(function(){
		//--获取所有的MatchID
		match_id = $(this).attr('match_id');		
		if( match_id!=undefined ){
			matchid_arr.push( match_id );
		}

		//--将正在比赛的ID加入到计时器队列
		is_over  = parseInt( $(this).children('td:eq(4)').attr('is_over'),10);
		
		if( is_over==1 || is_over==3||is_over==4 )
		{
			addMatchIng( match_id );
		}	
	});
	return matchid_arr;
}


function addMatchIng( match_id ){
	if( match_id.length<=0 ){ return false; }
	
	var match_ing_str = match_ing.join(',');
	
	if( match_ing_str.indexOf( match_id )==-1 ){ 
		match_ing.push( match_id );
	}
	return true;
}


function addFundong(){
	$(".subitem").hover(function(){
		$(this).addClass("open").find(".subitem_cont").show();
	},function(){
		$(this).removeClass("open").find(".subitem_cont").hide();
	});
}


/*获取url*/
function GetRequest() {
   var url = location.search; 
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}


/*获取数据*/
function MainTable(date_select,type){
	var is_ok = 1;
    //alert(type);
	$.ajax({
		url: base_url+'/Match/AjaxMatchZB.php',
		type: 'GET',
		dataType: 'jsonp',
		async: false,
		jsonp: 'callback',
		jsonpCallback:"jsonpCallbackB",
		data: 'date='+date_select+'&type='+type+'&lx='+2,
		timeout:5000,
		success: function (data) {
			return;
    			//alert(data);
			if( data!=null ){
				DateArr  	= data['date'];
				SelectDate 	= data['select'];
				TodayDate 	= data['now'];
				LotteryType = data['type'];
				OddsList 	= data['odds'];
				AllOdds 	= data['AllOdds'];
				STime 		= data['NowTime'];
				
				var old_str = makeOldUrl();
				var title_str 	= makeTitleUl();
				var thead_str 	= makeTableThead();
				var table_str 	= makeTable( data['data'] );
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

function jsonpCallbackB(data) //回调函数
{
			if( data!=null ){
				DateArr  	= data['date'];
				SelectDate 	= data['select'];
				TodayDate 	= data['now'];
				LotteryType = data['type'];
				OddsList 	= data['odds'];
				AllOdds 	= data['AllOdds'];
				STime 		= data['NowTime'];
				
				var old_str = makeOldUrl();
				var title_str 	= makeTitleUl();
				var thead_str 	= makeTableThead();
				var table_str 	= makeTable( data['data'] );
				$('#list_tbody').html(table_str);
				//alert($('#list_tbody').html);
				minFlushPage();
				updateQiHao();
				
				$('#bfbiaotou li').not('.change_lau').each(function(){
					var vals_t = $(this).children('a').attr('vals_t');
					if( vals_t.indexOf(LotteryType)!=-1 ){
						$(this).addClass('score_page');
					}else{
						$(this).removeClass('score_page');
					}
				});
				
			}else{
				alert('No Data');
			}
}

/*生成HTML 旧版url*/
function makeOldUrl(){
	var url_str = 'http://live.cpdyj.com';
	switch( LotteryType ){
		case 'jingcaizuqiu':
			url_str += '/jingcai';	break;
		case 'bjdanchange':
			url_str += '/danchang';	break;
		case 'zucaibanquan':
			url_str +='/zucai/bq';	break;
		case 'zucaijingqiu':
			url_str += '/zucai/jq';	break;
		case 'zucai14':
			url_str += '/zucai';	break;	
	}
	var a_str = '<a href="'+url_str+'">切换到旧版</a>';
	$('#old_url').html( a_str );
}

/*MakeHTML Title*/
function makeTitleUl(){
	
	var class_1 = class_2 = class_3 = '';	
	
	if( LotteryType!='bjdanchang' && LotteryType!='jingcaizuqiu' ){
	
		if( LotteryType=='zucai14' ){
			class_1 = 'on';
		}
		if(  LotteryType=='zucaijingqiu'  ){
			class_2 = 'on';
		}
		if( LotteryType=='zucaibanquan'  ){
			class_3 = 'on';
		}
		var is_make = $('#di_pre').prevAll('.score_submenu').html();
		if( is_make==null ){
			var html_str = '<li class="score_submenu last '+class_1+'"><a href="?type=zucai14" title="胜负彩">胜负彩</a></li><li class="score_submenu '+class_2+'"><a href="?type=zucaijingqiu" title="四场进球">四场进球</a></li><li class="score_submenu '+class_3+'"><a href="?type=zucaibanquan" title="六场半全场">六场半全场</a></li>';
			
			$('#di_pre').before(html_str);
		}
	}
	else
	{
		var is_make = $('#di_pre').nextAll('#match_select_a').html();
		if( is_make==null ){
			var title_str = '<li id="match_select_a" class="subitem today_march" style="width:97px;">';
			title_str += '<span>赛事筛选</span><s></s>';
			title_str += '<div id="league_div_h" class="subitem_cont march_screen"><table cellpadding="0" cellspacing="0" width="100%">';
			
			title_str += '<tbody name="showTan" id="league_list_tbody" > </tbody>';
			title_str += '<tbody><tr><td colspan="2"><input id="show_over" type="checkbox" name="show_over" value="1" onclick="checkMatch();">&nbsp;隐藏完场比赛</td><td colspan="3" ><input id="show_five" type="checkbox" name="show_five" onclick="showFive();checkMatch();">&nbsp;五大联赛</td></tr></tbody>';
			title_str +='<tfoot><tr><td ><input type="button" onclick="leagueChecked();checkMatch();"  value="全选" class="screen_btn"></td><td><input type="button" onclick="leagueFan();checkMatch();" value="反选" class="screen_btn"></td><td></td><td></td><td></td></tr></tfoot>';
			
			title_str +='</table> </div></li>';
			title_str +='<li><input type="button" onclick="allData();" value="恢复" class="recovery_btn"></li>';
			$('#di_pre').after(title_str);
		}
	}
	return;
}


function makeTableThead(){
	
	var table_colgropu = '<col width="5%" /><col width="6%" /><col width="6%" /> <col width="4%" /> <col width="4%" /><col width="15%" /> <col width="5%" /><col width="15%" />';
	
	var thead_str = '<tr><th>序号</th><th><a href="#reorder" class="reorder">赛事<i></i></a></th><th class="noSort">轮次/阶段</th><th class="noSort" >时间</th><th class="noSort">状态</th><th class="noSort">主队<!--<div id="fun4_div" style="cursor:pointer;" onclick="fun4Click();SorHRanqiu();" class="fr join"><i></i><span>让球</span></div>--></th><th class="noSort">比分</th><th class="noSort">客队</th>';
	
	table_colgropu +='<col width="4%" />';
	thead_str += "<th class='noSort'>让球</th>";
	
	table_colgropu +='<col width="6%" /><col width="7%" /><col width="6%" />';
	if(LotteryType=='jingcaizuqiu'){
		thead_str +=" <th id='th_JOdds' class='sp_noborder sptitle noSort' onclick=changeOdds('JOdds')><a href='javascript:void(0)'>竞赔<i></i></a></th>";
		thead_str +=" <th id='th_EOdds' class='sp_noborder sptitle noSort' onclick=changeOdds('EOdds') ><a href='javascript:void(0)'>欧赔<i></i></a></th>";	
	}else{		
		thead_str += '<th id="th_EOdds" class="sp_noborder sptitle noSort" onclick=changeOdds("EOdds") ><a href="javascript:void(0)">欧赔<i></i></a></th>';
		thead_str += ' <th class="sp_noborder noSort" ></th>';			
	}
	
	thead_str +='<th id="th_Handicap" class="sptitle noSort" onclick=changeOdds("Handicap") ><a href="javascript:void(0)">亚盘<i></i></a></th>';
	thead_str +='<th class="noSort">半场/</br>天气</th ><th class="noSort">数据</th><th class="noSort">直播</th><th class="noSort">置顶</th></tr>';
	table_colgropu += '<col width="5%" /> <col width="4%" /><col width="4%" /><col width="4%" />';
	
	$('#table_thead').html(thead_str);
	$('#table_colgropu').html(table_colgropu);
	return ;
}



/*--提示框--*/
function showDiv(){   
	$('#notice_div').css('display','block');  
	$('#notice_bg').css('display','block');   
	$('#popIframe').css('display','block');   
}   
function closeDiv(){   
	$('#notice_div').css('display','none');  
	$('#notice_bg').css('display','none');   
	$('#popIframe').css('display','none');   
}  


function makeTeachState( data ){
	
	var k_Cnarr = new Array;
	k_Cnarr = ['先开球', '第一个角球', '第一张黄牌', '射门次数', '射正次数','犯规次数', '角球次数', '角球次数(加时)', '任意球次数', '越位次数', '乌龙球数', '黄牌数', '黄牌数(加时)', '红牌数', '控球时间', '头球', '救球', '守门员出击', '丟球', '成功抢断', '阻截', '长传', '短传', '助攻', '成功传中', '第一个换人', '最后换人', '第一个越位', '最后越位', '换人数', '最后角球', '最后黄牌', '换人数(加时)', '越位次数(加时)', '红牌数(加时)'];

	//每个比赛
	for( var k in data )
	{
		var v_data = data[k];
		//每个技术统计
		var state_str = '<tr><td colspan="3" >技术统计</td></tr>';	
		for( var k_state in v_data)
		{ 
			v_state	   = v_data[k_state];
			CnName 	   = k_Cnarr[k_state];
			state_arr  = v_state.split(',');
		    
			//--互换
			is_reve = getIsReverse( k );
			if( is_reve=='Y' )
			{
				state_arr = checkDataIsReve( 2,state_arr );
			}
			
			state_str += '<tr>';
			state_str += '<td>'+state_arr[0]+'</td>';
			state_str += '<td>'+CnName+'</td>';
			state_str += '<td>'+state_arr[1]+'</td>';
			state_str += '</tr>';
		}
		$('#'+k+'_state_new').html( state_str );
	}
}


//--筛选选择
function checkMatch(){
	var league_str = '';
	var date_tr = league_tr ='';
	//--获取选项
	//--时间获取
	var date_str = $('#select_date_h').val();
	
	//--联赛选项
	$('input[name="league_list"]:checked').each(function(){
		league_str += $(this).val()+',';
	});
	
	var is_over = $('input[name="show_over"]:checked').val();

	var is_ding = '';
	$('#list_tbody>tr').each(function(){
	
		is_ding 	= $(this).attr( 'is_ding' );
		date_tr 	= $(this).children('td:eq(0)').children('label').children('input[name="match_date_h"]').val();
		league_tr 	= $(this).children('td:eq(1)').text();
		over_tr 	= $(this).children('td:eq(4)').attr('is_over');
		
		if( (is_over=='1' && over_tr=='-1' ) || is_ding =='1' || league_str.indexOf(league_tr)==-1 ){
			$(this).hide();
			$(this).children('td:eq(6)').children('.showscore_area').hide();
		}else{
			$(this).show();
			$(this).children('td:eq(6)').children('.showscore_area').show();
		}		
	});
	return true;
}


function appentEventPlayer( rq_arr,from_f ){
	
	/*from_f 1=js 2=php*/
	var is_reve;
	for( var rq_k in rq_arr ){
		var event_num = 1;
		//--every_match
		now_match = rq_arr[rq_k];
		is_reve = getIsReverse( rq_k );
		if($('#'+rq_k+'_event_new').html()==null){ continue; }
		
		$('#'+rq_k+'_event_new').html('');
		for(var event_k in now_match )
		{	
			now_event = now_match[event_k];
			if( from_f == 1 )
			{
				now_event = makeStrKeyPlayer( now_event );
			}
			if( is_reve=='Y' ){
				checkDataIsReve( 3,now_event );
			}
			appendOneEventPlayer( rq_k,now_event);
		}
	}
}


function appendOneEventPlayer( match_id,now_event ){
	
	if( match_id.length<=0 ){ return 2; }
	var class_val = class_type0 = class_type1 = i_str0 = i_str1 = player0 = player1 = '';
	class_val = getClassByEventType( now_event['EventType'] );
	
	if( now_event['ISHomeAway']==1 ){
		player1 = now_event['PlayerNameJ'];
		i_str1 = '<i class="'+class_val+'"></i>';
	}else{
		player0 = now_event['PlayerNameJ'];
		i_str0 = '<i class="'+class_val+'"></i>';
	}
	var tr_str ='<tr class="nnnbg"><td class="home">'+i_str1+'<span>'+player1+'</span></td><td>'+now_event['EventTime']+'\'</td><td class="visitor">'+i_str0+'<span>'+player0+'</span></td></tr>';
	
	$('#'+match_id+'_event_new').append( tr_str );
	return;
}


function getClassByEventType( num ){
	
	var type_arr = new Array;
	type_arr[1]='jq_icon';
	type_arr[2]='wr_icon';
	type_arr[3]='wy_icon';
	type_arr[7]='dq_icon';
	type_arr[8]='wl_icon';
	type_arr[9]='wr_icon';//--暂时用红色
	return type_arr[num]; 
}


function makeStrKeyPlayer( data_arr ){

	var key_player = new Array;
        key_player[0]='MatchID';
        key_player[1]='OtherId';
        key_player[2]='ISHomeAway';
        key_player[3]='EventType';
        key_player[4]='EventTime';
        key_player[5]='PlayerNameF';
        key_player[6]='PlayerID';
        key_player[7]='PlayerNameJ';
	var re_arr = new Array;
	for( var k =0;k<8; k++ )
	{
		re_arr[key_player[k]] = data_arr[k];
	}
	return re_arr;
}


//--撤销置顶
function unzhiding( match_id ,num){
    //$('#'+match_id+'_tr').attr('is_ding','2').show();
	var str_list = $('#'+match_id+'_tr').html();
	$('#'+match_id+'_tr').remove();
	
	str_list = '<tr name="MatchIDTr" class="color1" num="'+num+'" match_id="'+match_id+'" id="'+match_id+'_tr" >'+str_list+'</tr>';
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
	//--隔行换色
	tableTrColor();
	bifenFudong();
	//--页面图标浮动
	hightChartsFudong();
	return;
}


//--置顶 /* tr is_ding 1/2 */
function zhiding( match_id ,num){
	$('#zhiding_tbody').show();
    $('#zhiding_tr_match').show();
	var str_list = $('#'+match_id+'_tr').html();
	
	$('#'+match_id+'_tr').remove();
    
	str_list = '<tr name="MatchIDTr" class="nnnbg zhidingbg" num="'+num+'" match_id="'+match_id+'" id="'+match_id+'_tr" >'+str_list+'</tr>';
    
	$('#zhiding_tr_match').before( str_list ); 
	
	var a_str = '<a href="javascript:void(0);" title="撤销置顶" onclick="delNoticeMatch('+match_id+');unzhiding('+match_id+','+num+')" class="stick on"></a>';
	$('#'+match_id+'_tr td:last').html( a_str );
	
	//--addZhiding
	addZhidingArr(match_id);
	
	bifenFudong();
	tableTrColor();
	hightChartsFudong();
	return;
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


function allData(){

	$('#show_over').attr('checked',false);
	var show_five = $('#show_five').attr('checked',false);
	$('#list_tbody>tr').each(function(){
		$(this).show();
		$(this).children('td:eq(6)').children('.showscore_area').show();	
	});
	
	$('#table_thead>tr>th:eq(0)').data('dir',1).click();
	$('#table_thead>tr>th:eq(1)>a:eq(0)').removeClass('ordered down');
	return true;	
}


function showFive(){
	//--英超 意甲  法甲 德甲 西甲
	var league_str = '英超,意甲,法甲,德甲,西甲';
	var show_five = $('#show_five').attr('checked');
	
	if( show_five=='checked' ){
		$('input[name="league_list"]').each(function(){
			if( league_str.indexOf( $(this).val() )==-1 ){
				$(this).attr('checked',false);
			}else{
				$(this).attr( 'checked',true );
			}
		});
	}else{
		$('input[name="league_list"]').each(function(){
			$(this).attr('checked',true);
		});
	}
	return true;
}


function hideTr( match_id ){
	$('#'+match_id+'_tr').hide();
}


function leagueChecked(){
	$('input[name="league_list"]').attr( 'checked',true );
	return ;
}


function leagueFan(){	
	var check_league;
	$('input[name="league_list"]').each(function(){
			check_league = $(this).attr('checked');
			if( check_league=='checked' ){
			  $(this).attr( 'checked',false );
			}else{
			  $(this).attr( 'checked',true );
			}
	});
	return;
}


function delMatchIng( match_id ){
	if( match_id.length<=0 ){ return false; }
	
	for( var k in match_ing){
		if(match_ing[k] == match_id )
		{
			delete match_ing[k];
		}
	}
	return true;
}


function SorHTeamSort(){
	var is_checked = $('#fun2').is( ":checked" );
	if( is_checked==true ){
		is_checked = 1;
	}else{
		is_checked = 0;
	}
	setLocalStorageVal('BF_fun2',is_checked);
	$('sup[name="_home_sup_rank"]').toggle();
	$('sup[name="_away_sup_rank"]').toggle();
	return true;
}


function SorHCodeR(){
	var is_checked = $('#fun3').is( ":checked" );
	if( is_checked==true ){
		is_checked = 1;
	}else{
		is_checked = 0;
	}
	setLocalStorageVal('BF_fun3',is_checked);
	
	$('i[class="warning"]').toggle();
		
	return true;
}


function SorHRanqiu(type_i){
	if( type_i=='2' )
	{
		is_checked = 0;
		$('i[name="rangqiu_i_h"]').hide();
	}
	else if(type_i=='1')
	{
		is_checked = 1;
		$('i[name="rangqiu_i_h"]').show();
	}
	else
	{
		var is_checked = fun4Checked();
		if( is_checked==true ){
			is_checked = 1;
		}else{
			is_checked = 0;
		}
		$('i[name="rangqiu_i_h"]').toggle();
	}
	setLocalStorageVal('BF_fun4',is_checked);
	
	if( $('#th_JOdds').hasClass('tabed')==true ){
		changeOdds( 'JOdds' );
	}
	
	return ;
}


function changeJF( l_type ){
	var show_w 		= 'f';
	var hide_w 		= 'f';
	var a_lang_id 	= 'lang_a_';
	if( l_type=='1' ){ 
		show_w = 'j'; 
	}else{
		hide_w = 'j';
	}
	$('label[name="home_'+show_w+'"]').show();
	$('label[name="away_'+show_w+'"]').show();
	$('label[name="home_'+hide_w+'"]').hide();
	$('label[name="away_'+hide_w+'"]').hide();
		
	$('#'+a_lang_id+show_w).addClass( 'now_lau' );
	$('#'+a_lang_id+hide_w).removeClass( 'now_lau' );
	
	return ;
}


function songUnSong(){
	$('#song_a').toggle();
	$('#unsong_a').toggle();
}


/*初始化声音*/
function onSongA(){
	$('#song_a').show();
	$('#unsong_a').hide();
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


/*下拉数据duo*/
function setHightChartsXMore(match_id){
	var odds_time 	= [];
	var odds_data 	= [];
	odds_data['WinOdds'] 	= [];
	odds_data['LostOdds'] 	= [];
	odds_data['DrawnOdds'] 	= [];
	var odds 	  	= [];
	
	var is_checked = getNowLiNumHightCharts();
	//var is_reve = getIsReverse(match_id);
	
	for(var i in AllOdds[is_checked][match_id]){
		
		odds = AllOdds[is_checked][match_id][i];
		time_now = parseInt(odds['AddTime'],10);
		odds_time.push(timeToDate(time_now,1));
		
		//if( is_reve=='Y' ){
		//	odds = checkDataIsReve(5,odds);
		//}
		
		odds_data['WinOdds'].push( parseFloat(odds['WinOdds']) );
		odds_data['LostOdds'].push( parseFloat(odds['LostOdds']) );
		odds_data['DrawnOdds'].push( parseFloat(odds['DrawnOdds']) );
	}
	odds['time'] = odds_time;
	odds['data'] = odds_data;
	return odds;
}


function fun4Checked(){
	var is_checked = 1;
/*	if( $('#fun4').is(':checked')==false ){
		is_checked = 0;
	}
*/
	if( $('#fun4_div').hasClass('join')){
		is_checked = 0;
	}
	
	
	return is_checked;
}


function fun4Click(){
	if($('#fun4_div').hasClass('join_cont')){
		$('#fun4_div').removeClass('join_cont').addClass('join');
	}else{
		$('#fun4_div').removeClass('join').addClass('join_cont');
	}
	return true;
}

/*下拉数据*/
function setHightChartsX( match_id,type ){
	var odds_time 	= [];
	var odds_second	= [];
	var odds_data 	= [];
	var odds 	  	= [];
	var key_w		= '';
	//var is_reve = getIsReverse( match_id );
	switch( type ){
		case 'home':
			key_w = 'WinOdds';
			break;
		case 'visitor':
			key_w = 'LostOdds';
			break;
		case 'showscore':
			key_w = 'DrawnOdds';break;	
	}
	//if( is_reve=='Y' ){
	//	key_w = checkDataIsReve(6,key_w);
	//}
	var is_checked = rangqiuChecked();
	for(var i in AllOdds[is_checked][match_id]){
		
		odds 	 = AllOdds[is_checked][match_id][i];
		time_now = parseInt(odds['AddTime'],10);
		odds_time.push(timeToDate(time_now,1));
		odds_second.push( time_now );
		odds_data.push( parseFloat(odds[key_w]) );
	}
	odds['second'] = odds_second;
	odds['time'] = odds_time;
	odds['data'] = odds_data;
	return odds;
}


function timeToDate( i_time,type ){
	var str_time;
	
	if(i_time>0){
		var now 	= new Date(i_time);
	}else{
		var now 	= new Date();
	}
	var year	= now.getYear();     
	var month	= addZeroByTime(now.getMonth()+1);     
	var date	= addZeroByTime(now.getDate());     
	var hour	= addZeroByTime(now.getHours());     
	var minute	= addZeroByTime(now.getMinutes());     
	var second	= addZeroByTime(now.getSeconds());  
	if( type==1 ){
		str_time = month+"/"+date+" "+hour+":"+minute; 
	}else{
		str_time = month+"/"+date+" "+hour+":"+minute+':'+second; 
	}
	return  str_time    
}


function hightChartsShowMore( id,odds_time,odds_data ){
	
	$('#'+id).highcharts({
		colors:[ '#ff0000','#666666','#2f7fd8' ],
		title: {
            	text: '',
            	x: -20 
		},
		subtitle: {
			text: '',
			x: -20
		},
		credits:{
		  enabled:false
		},
		chart: {                
            height: 200,
            width: 348   
            
        },
		xAxis: {
			categories: odds_time
		},
		yAxis: {
			
			title: {
				text: ''
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			valueSuffix: ''
		},
		legend: {
			layout: 'horizontal',
            align: 'top',
            verticalAlign: 'top',
            x: 165,
            y: 0,
            borderWidth: 1
		},
		PlotOptions:{
			line:{
				lineWidth:1			
			},
			marker:{
				radius: 2
			}		
		},
		series: [		
			{
			name:'胜',
			data:odds_data['WinOdds']  },
			{
			name:'平',
			data:odds_data['DrawnOdds']  },
			{
			name:'负',
			data:odds_data['LostOdds']  }
		]
    });
	
   return ;
}


function beforeOddsData( match_id,type ){
	
	if( type!='spcon' ){
		var odds = setHightChartsX(match_id,type);
	}else{
		var odds = setHightChartsXMore( match_id );
	}
	//--showData
	var cha_str = '';
	var cont_odds = odds['second'].length;
	var html_str = '';
	var show_date = '';
	var next_data = 0;
	var col_str = '';
	for( var i=cont_odds-1;i>=0;i-- ){
	
		show_date 	= TimeToDateDay( odds['second'][i]);
		
		odds_one 	= parseFloat(odds['data'][i]).toFixed(2);
		j_odds_one = odds_one*100;
		cha_index 	= i-1;
		cha_str = '';
		var cha = cha_biao= ''; 
		
		if( i!=0 )
		{
			next_data	= parseFloat(odds['data'][cha_index]).toFixed(2);
			j_next_data = next_data*100;
			cha = ((j_odds_one-j_next_data)/100).toFixed(2);
			if( cha>0 ){
				col_str = 'red';
				cha_biao = '↑';
				cha = '+'+cha.toString();
			}
			if( cha<0 ){
				col_str = 'blue';
				cha_biao = '↓';
			}	
			cha_str = '<font color="'+col_str+'">'+cha_biao+'</font>';
			cha ='(<font color="'+col_str+'">'+cha+'</font>)';
		}
		html_str 	+= '<tr><td style="text-align:right;border-right-width:0px;" >'+odds_one+'</td><td style="text-align:left">'+cha_str+''+cha+'</td><td>'+show_date+'</td></tr>';
		next_data 	= odds_one;
	}
	
	setGloalFloatTfoot( match_id ,[40,30,30] );
	
	$('#'+match_id+'_state_new').html(html_str);
	return ;
}


function TimeToDateDay( i_time ){
	
	var timestamp 	= (new Date()).valueOf();
	var now_date	= getDateArrByTime( timestamp );
	var day 		= getDayName( i_time );
	var i_date		= getDateArrByTime( i_time );
	
	var hour 		= addZeroByTime(i_date['hour']);
	var minute 		= addZeroByTime(i_date['minute']);
	var days_num 	= days_name.length-1;
	
	if(  day<=days_num && i_date['month']==now_date['month'] )
	{
		res = days_name[day]+''+hour+':'+minute+'';
	}
	else
	{
		res = timeToDate( i_time,1)
	}
	return res;	
}


function getDayName( i_time ){
	var timestamp 	= (new Date()).valueOf();
	var now_date	= getDateArrByTime( timestamp );
	var re_key 		= 9;
	var i_date		= getDateArrByTime( i_time );
	
	if( now_date['day']==i_date['day'] ){
		re_key = 0;
	}else{
		var yestoday = timestamp-3600*24*1000;
		var y_date	 = getDateArrByTime( yestoday );
		if( i_date['day']==y_date['day'] ){
			re_key = 1;
		}else{
			
			var today2 = timestamp-3600*24*1000*2;
			var t2_date	 = getDateArrByTime( today2 );
			
			if(  i_date['day']==t2_date['day'] ){
				re_key = 2;
			}
		}
	}
	return re_key;
}


function addZeroByTime( date ){
	
	date = parseInt( date ,10);
	
	if( date<10 ){
		date = '0'+date.toString();
	}
	return date;
}


function getDateArrByTime( time_sump ){
	var re_arr = [];
	var now  = new Date(time_sump)
	re_arr['year']		= now.getFullYear();     
	re_arr['month']		= now.getMonth()+1;     
	re_arr['day']		= now.getDate();     
	re_arr['hour']		= now.getHours();     
	re_arr['minute']	= now.getMinutes();     
	re_arr['second']	= now.getSeconds();
	return re_arr;
}




function setGloalFloatTfoot( match_id,num_arr){
	
	for( var i=0 ;i<=2;i++ ){
		if( num_arr[i]==0 ){ continue; }
		$('#'+match_id+'_state_new').siblings('colgroup').children('col:eq('+i+')').attr('width',num_arr[i]+'%');
	}
	return ;
}


function backEventStateNew(match_id){
	var is_over = $('#'+match_id+'_tr>td:eq(4)').attr('is_over');
	if( is_over=='0' ){
		$('#'+match_id+'_event_new').html('');
		$('#'+match_id+'_state_new').html('');
		setGloalFloatTfoot( match_id ,[20,60,20] );
	}
	return true;
}


function updateData(){

/*var mlist = {
比赛ID:'0比赛状态^1主队比分^2客队比分^3主队上半场比分^4客队上半场比分^5主队红牌^6客队红牌^7比赛时间^8开场时间^9赛程说明^10是否有阵容^11主队黄牌^12客队黄牌'*/
	var is_ok = 1;
	var nowTime = (new Date()).valueOf();
	onlineOrNot();
	//上次请求时间大于30s 或是 有断网记录则更新	
	if((nowTime-updateDataUpTime)>300000 || isOutLine==1  ){
		var new_zhding_arr = match_zhiding;
		unzhidingAll();
		is_ok = MakeBaseData();	
		//--添加置顶
		var num = 0;
		for( var kz in new_zhding_arr ){
			num = $('#'+new_zhding_arr[kz]+'_tr').attr('num');
			zhiding( new_zhding_arr[kz],num );
		}
		
		if( is_ok!=2 ){
			isOutLine=2;
			updateDataUpTime = (new Date()).valueOf();
		}
	}else{
		$.getScript('http://221.228.229.211/live/bf.js?',function() {
			eval(mlist);
			var event_arr = is_have = '';
			for( var k in mlist )
			{
					event_arr = spileEventNew( mlist[k] );
					is_have  = $('#'+k+'_tr').attr('match_id');
					if( parseInt(event_arr[0],10)==0 || is_have==undefined  ){ continue; }
					changeMatch( k,event_arr );
			}
			updateDataUpTime = (new Date()).valueOf();
		});
	}
	
	return;
}


function onlineOrNot()
{
	if(oClientCaps.connectionType == "offline"){
		isOutLine=1 ;
		$('#webStatus').text('OFF');	
	}else{
		$('#webStatus').text('ON');
	}
}


function ajaxMatchEventNew( matchid_str ){
	
	if(matchid_str.length<=0 ) return false;
	$.ajax({
		url: base_url+'/Match/AjaxMatchEventPlayer.php',
		type: 'GET',
		dataType: 'jsonp',
		jsonp: 'callback',
		jsonpCallback:"jsonpCallbackC",
		data: 'match_ids=' + matchid_str+'&lx='+2,
		timeout: 5000,
		success: function (data) {
			return;
			if( data!='2' ){
				appentEventPlayer( data,2 );
			}
		}
	});	
	return true;
}

function jsonpCallbackC(data) {
			if( data!='2' ){
				appentEventPlayer( data,2 );
			}
}

function ajGetMatchEvent( matchid_str  ){	
	if(matchid_str.length<=0) return false;
	$.ajax({
		url: base_url+'/Match/AjaxMatchEventNew.php',
		type: 'GET',
		dataType: 'jsonp',
		jsonp: 'callback',
		jsonpCallback:"jsonpCallbackD",
		data: 'match_ids=' + matchid_str+'&lx='+2,
		timeout: 5000,
		success: function (data) {
			return;
			if( data=='1'  ){return false;  }
			for( var key_data in data  ){
				appendEventTong( key_data,data_son[k_son] );	
			}
			//--表示已经处理完断网
			isOutLine=2;	
		}
	});
}

function jsonpCallbackD(data) {
			if( data=='1'  ){return false;  }
			for( var key_data in data  ){
				appendEventTong( key_data,data_son[k_son] );	
			}
			//--表示已经处理完断网
			isOutLine=2;	
		}

function appendEventTong( match_id,data ){
	//--update bifen
	
	$('#'+match_id+'_home_goals').text(data['HomeGoals']);
	$('#'+match_id+'_away_goals').text(data['AwayGoals']);
	//--update R
	$('#'+match_id+'_home_ry').val(data['HomeRC']+'-'+data['HomeYC']);
	$('#'+match_id+'_away_ry').val(data['AwayRC']+'-'+data['AwayYC']);
	
	var home_str = $('#'+match_id+'_tr>td:eq(5)>span:eq(0)').html();
	var away_str = $('#'+match_id+'_tr>td:eq(7)>span:eq(0)').html();

	if( data['HomeRC']>0 )
	{
		home_str += '<i class="warning" >'+data['HomeRC']+'</i>';
	}
	
	if( data['AwayRC']>0 )
	{
		away_str += '<i class="warning" >'+data['AwayRC']+'</i>';
	}
	
	
	$('#'+match_id+'_tr>td:eq(4)').html(data['EventTimeNew']); 	
	$('#'+match_id+'_tr>td:eq(5)').html(home_str);
	$('#'+match_id+'_tr>td:eq(7)').html(away_str);

	return true;
}



/*将数据拆开处理*/
function spileEventNew( data ){
	
	//-'0^0^0^^^0^0^11-15 16:30^2013, 10  , 15 ,16 , 30 , 00^^1^0^0',
	var tr_str = '';
	var data_arr = data.split( '^' );
	var data_int_key = [1,2,3,4,5,6,10,11,12]; 
	var key_int ;
	//--需要转换为int类型的数据
	var count_int_key = data_int_key.length;
	for( var i=0;i<count_int_key;i++ ){
		key_int = data_int_key[i];
		
		if(data_arr[key_int]==undefined||data_arr[key_int].length<=0){
			data_arr[key_int] = 0;
		}else{
			data_arr[key_int] = parseInt(data_arr[key_int],10);
		}
	}
	return data_arr;
}


/*修改数据*/
function changeMatch( match_id,event_arr ){
	
	var is_reve = getIsReverse( match_id );
	var half_change_bifen = ',1,2,';
	if( is_reve=='Y' ){
		event_arr = checkDataIsReve(4,event_arr)
	}
	
	var is_change = 2;

	//--修改红/黄牌
	changeRY( match_id,event_arr );
	
	//--修改比分
	
	//--延迟不做比分改动
	if(event_arr[0] != '-14'){ 
		changeBifen( match_id,event_arr );
		//--上半场可以修改比分
		
		if( half_change_bifen.indexOf(','+event_arr[0].toString()+',')!=-1 ){
			changeHalfBiFen( match_id,event_arr  );
		}
	}

	//--修改状态
	changeState( match_id,event_arr );	
	
	//-中场
	var is_over=$('#'+match_id+'_tr>td:eq(4)').attr('is_over');
	if( event_arr[0]==2 && parseInt(is_over,10)!=2 )
	{
		changeMiddle( match_id,event_arr  );
	}
	return true;
}


function changeHalfBiFen( match_id,event_arr ){
	var half_home = '<em style="color:#666" id="'+match_id+'_half_home_goals" >'+event_arr[1]+'-</em>';
	
	half_home += '<em style="color:#666" id="'+match_id+'_half_away_goals" >'+event_arr[2]+'</em>';
	$('#'+match_id+'_half_td').html(half_home);
	return true;
}



function changeRY( match_id,event_arr ){
	var is_change = 2;
	/* 1-2  1r  2y */
	home_ry = $('#'+match_id+'_home_ry').val();
	away_ry = $('#'+match_id+'_away_ry').val();
	home_ry_arr = home_ry.split('-');
	away_ry_arr = away_ry.split('-');
	
	var event = new Array;
	event[1] = 2;
	
	//主队-red
	if(event_arr[5]!=home_ry_arr[0]){
		if( event_arr[5]>0 ){
			var home_red = parseInt(home_ry_arr[0],10);
		
			if( !isNaN(home_red)  && home_red>0  )
			{
				var count_home_r = event_arr[5];
				$('#'+match_id+'_tr>td:eq(5)>i.warning').text( count_home_r );
			}
			else
			{	
				var count_home_r = event_arr[5];
				var str = '<i class="warning">'+event_arr[5]+'</i>';
				$('#'+match_id+'_tr>td:eq(5)').append( str );
			}
		
			$('#'+match_id+'_home_ry').val(count_home_r+'-'+home_ry_arr[1]);
			event[0] = 1;
			is_change = 1;
		}
	}
	
	//客队-red
	if( event_arr[6]!=away_ry_arr[0] ){
		if( event_arr[6]>0 ){
			var away_red = parseInt(away_ry_arr[0],10);
			if(away_red!=NaN && away_red>0  )
			{
				var count_away_r = event_arr[6];
				$('#'+match_id+'_tr>td:eq(7)>i.warning').text( count_away_r );
			}
			else
			{
				var count_away_r = event_arr[6];
				var str = '<i class="warning">'+event_arr[6]+'</i>';
				$('#'+match_id+'_tr>td:eq(7)').append( str );
			}
	
			$('#'+match_id+'_away_ry').val(count_away_r+'-'+away_ry_arr[1]);
			event[0] = 2;
			is_change = 1;
		}
	}
	//客队-y
	return is_change;
}


/*修改比分*/
function changeBifen( match_id,event_arr ){
	var is_change  = 2;
	var home_goals = $('#'+match_id+'_home_goals').text();
	var away_goals = $('#'+match_id+'_away_goals').text();
	var event_t = new Array;
	event_t[1] = 1;
	if(event_arr[1] != home_goals)
	{
		home_goals++;
		$('#'+match_id+'_home_goals').html( event_arr[1] );
		event_t[0] = 1;
		is_change = 1;
	}else if( home_goals=='' ){
	   $('#'+match_id+'_home_goals').html(0);
	}

	if( event_arr[2] != away_goals ){
		away_goals ++;
		$('#'+match_id+'_away_goals').html( event_arr[2] );
		event_t[0] = 2;
		is_change = 1;
	}else if( away_goals=='' ){
	   $('#'+match_id+'_away_goals').html(0);
	}
	
	if( is_change==1 ){
		//--提示
		if( $('#ga_checkbox:checked').val()=='1'  ){
			if( noticeTimeoutId.length>0  ){
				clearTimeout(noticeTimeoutId);
			}
			showNotice( match_id,event_arr[13],event_t[0] );
			showSoftNotice( match_id,event_arr[13],event_t[0] );	
			noticeTimeoutId = setTimeout(closeNotice,30000);	
		}
		
		//--声音
		if( $('#song_a').css('display')=='block'  ){
			showSong();
		}
		
		//--修改赔率颜色
		changeOddsCol(match_id);
	}
	return is_change;
}

function changeMiddle( match_id,event_arr  ){

	var half_event_str = '<tr class="banchang nnnbg"><td><i class="bcicon"></i><span>上半场结束</span></td><td>45\'</td><td></td></tr>';
	$('#'+match_id+'_event_new').append( half_event_str );
	return true;
}


function changeState(match_id,event_arr){
	var str_td = '';
	var date_str = checkApiJsDate( match_id,event_arr[8] );
	switch(parseInt( event_arr[0],10) ){
		case 0:
			str_td = '未'; break;
		case 1:
			var old_status = parseInt($('#'+match_id+'_tr>td:eq(4)').attr('is_over'),10);
			if( old_status==0 ){ changeOddsCol( match_id ); }

			str_td = event_arr[13]+'′'; 
			$('#'+match_id+'_tr>td:eq(6)>div:eq(0)').children('.showscore').css('color','blue');
			
			//--修改开始时间 
			$('#'+match_id+'_ji_time_h').val( date_str );
			break;
		case 2:
			str_td = '中';
			$('#'+match_id+'_tr>td:eq(4)').removeClass('under_way');
			//delMatchIng( match_id );  
			break;
		case 3:
			str_td = event_arr[13]+'′';
			
			//--修改开始时间 
			$('#'+match_id+'_ji_time_h').val( date_str );
			break;
		case 4:
			//str_td = 90+'+';
			str_td = event_arr[13]+'′';
			break;
		case -11:
			str_td = '待';break;
		case -12:
			str_td = '腰斩';break;
		case -13:
			str_td = '中断';break;
		case -14:
			str_td = '推迟';
			
			break;
		case -1:
			str_td = '完';
			$('#'+match_id+'_tr>td:eq(6)>div:eq(0)').children('.showscore').css('color','red');
			$('#'+match_id+'_tr>td:eq(4)').removeClass('under_way');
			break;
		case -10:
			str_td = '消';break;
		default:
			str_td = '完';
	}
	if( onmatch_str.indexOf(','+event_arr[0].toString()+',')!=-1 )
	{
		addMatchIng( match_id );
		$('#'+match_id+'_tr>td:eq(4)').addClass('under_way');
	}
	else
	{
		delMatchIng( match_id );
	}
	$('#'+match_id+'_tr>td:eq(4)').text( str_td ).attr('is_over',event_arr[0]);
	return true;
}


function closeNotice(){
	$('#ga_notice_div').hide();
}


function showSong(){
	$("#jquery_jplayer_1").jPlayer('play');
	return;
}


function getMatchInfo( match_id ){
	var jf_str = 'j';
	var is_j = $('#lang_a_j').hasClass('now_lau');
	if(!is_j){ jf_str = 'f'; }
	var match_info  = [];
	match_info['league_name'] 	= $('#'+match_id+'_tr>td:eq(1)').text();
	match_info['home_name']		= $('#'+match_id+'_tr>td:eq(5)>label[name="home_'+jf_str+'"]').text();
	match_info['away_name'] 	= $('#'+match_id+'_tr>td:eq(7)>label[name="away_'+jf_str+'"]').text();
	match_info['home_goals'] 	= $('#'+match_id+'_home_goals' ).text();
	match_info['away_goals'] 	= $('#'+match_id+'_away_goals' ).text();
	
	return match_info;
}


function showNotice( match_id,event_time,type ){
	
	if( match_id.length<=0||event_time<=0||type.length<=0  ){ return ;  }
	
	var match_info = getMatchInfo( match_id );
 	
	if( match_info['league_name']==undefined ||match_info['home_name']==undefined ||match_info['away_name']==undefined){ return; }
	
	closeNotice();
	
   	$('#notice_league_name').text( match_info['league_name'] );
    	$('#notice_home').text( match_info['home_name'] );
    	$('#notice_away').text( match_info['away_name'] );
    	$('#notice_bifen').text( match_info['home_goals']+'-'+match_info['away_goals'] );
    	$('#notice_event_time').text( event_time+"'" );
    	if( type==1 ){
        	$('#notice_home').append('<i class="goalin">1</i>');
        	$('#notice_gif_1').show();
        	$('#notice_gif_2').hide();
        
    	}else{
        	$('#notice_away').append('<i class="goalin">1</i>');
        	$('#notice_gif_2').show();
        	$('#notice_gif_1').hide();
    	}
    	$('#ga_notice_div').show();
	return;
}


function jisuanX( time_arr ){
	var count_t = time_arr.length;
	delta = time_arr[count_t-1] - time_arr[0];
	
	return delta;
}



function hightChartsShow( id,odds_time,odds_data,type ){
	var team_name = '';
	switch( type ){
		case 'home':
			line_name = '胜';
			index_num = 5;
			color_t = '#ff0000';
			break;
		case 'visitor':
			line_name = '负';
			index_num = 7;
			color_t = '#2f7fd8';
			break;
		case 'showscore':
			line_name = '平';
			index_num = 99;
			color_t = '#666';
			break;	
		default :
			line_name = '全'; 
	}
	id_arr  = id.split('_');
	match_id= id_arr[0];
	var title_arr = '';	
	if( index_num!=99 )
	{
		$('#'+match_id+'_tr>td:eq('+index_num+')>label').each(function(){
			if( $(this).css('display')!='none' ){
				team_name = $(this).text();
			}
		});
		
		var is_checked = rangqiuChecked();
		
		title_arr ='竞彩'+fun4_arr[is_checked]+'赔率';
	}else{
		title_arr = '平局竞彩赔率';
	}
	
	var x_tickInterval = jisuanX( odds_time );
	//alert( x_tickInterval );
	$('#'+id).highcharts({
		colors:[ color_t ],
		title: {
            text: team_name,
            x: -20 
		},
		subtitle: {
			text: title_arr,
			x: -20
		},
		credits:{ enabled:false },
		chart: {                
            height: 200,
            width: 348       
        },
		xAxis: {
			type: 'datetime',
			tickInterval : parseInt(x_tickInterval/5,10),
			minTickInterval : parseInt(x_tickInterval/5,10),			
			dateTimeLabelFormats: { 
				minute: '%H:%M',
				hour: '%H:%M',
				day: '%d日',
				week: '%e. %b',
				month: '%m-%d',
				year: '%Y'                		
			}
		},
		yAxis: {
			lineWidth:2,	
			title: {
				text: ''
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			valueSuffix: ''
		},
		legend: {
			enabled:false,
			layout: 'horizontal',
            align: 'top',
            verticalAlign: 'top',
            x: 200,
            y: 0,
            borderWidth: 1
		},
		PlotOptions:{
			line:{
				lineWidth:1			
			},
			marker:{
				radius: 2
			}		
		},
		series: [		
			{
				name:line_name,
				data:odds_data
			}
		]
    });
	
   return ;
}


function getLeagueCount(){
	var league_count_arr = [];
	$('input[name="league_id_h"]').each(function(){
		league_id = $(this).val();
		if( isNaN(parseInt( league_count_arr[league_id],10)) ){
			league_count_arr[league_id]  = 1;
		}else{
			league_count_arr[league_id] ++;
		}
	});
	return league_count_arr;
}


function setLeagueCount(){
	var league_id 			= 0;
	var league_name 		= '';
	var num_league = '';

	$('#list_tbody>tr').each(function(){
		league_name = $(this).children( 'td:eq(1)' ).text();
		num_league  = parseInt(five_league_str.indexOf( league_name),10);	
		if( num_league==-1 ){
			num_league=0;
		}else{
			num_league+=10000;
		}
		league_id = parseInt($(this).children('td:eq(1)').children('input[name="league_id_h"]').val(),10);
		sum_num = league_id+num_league;
		$(this).children( 'td:eq(1)' ).children('input[name="sort_input"]').val(sum_num);
	});
	return ;
}




/*TAN*/

function NotificationCenter($scope) {
	var permissionLevels = {};
	permissionLevels[notify.PERMISSION_GRANTED] = 0;
	permissionLevels[notify.PERMISSION_DEFAULT] = 1;
	permissionLevels[notify.PERMISSION_DENIED] = 2;

	$scope.isSupported = notify.isSupported;
	$scope.permissionLevel = permissionLevels[notify.permissionLevel()];

	$scope.getClassName = function() {
		if ($scope.permissionLevel === 0) {
			return "allowed"
		}else if ($scope.permissionLevel === 1){
			return "default"
		}else{
			return "denied"
		}
	}

	$scope.callback = function() {
		console.log("test");
	}

	$scope.requestPermissions = function() {
		
		notify.requestPermission(function() {
			$scope.$apply($scope.permissionLevel = permissionLevels[notify.permissionLevel()]);
		});
	}
}


function getAccessNotice( match_id ){
	
	addNoticeMatch(match_id);
	if( notify.permissionLevel()!='default' ){ return true; }
	notify.requestPermission();
	return true;
}


function addNoticeMatch( match_id ){
	
	var match_notice_str = NoticeMatch.join(',');	
	if( match_notice_str.indexOf( match_id )==-1 ){ 
		NoticeMatch.push( match_id );
	}
	return ;
}


function delNoticeMatch(match_id){
	if( match_id.length<=0 ){ return true; }
	
	for( var k in NoticeMatch){
		if(NoticeMatch[k] == match_id )
		{
			delete match_ing[k];
		}
	}
	return true;
}


function showSoftNotice(match_id,event_time,type) {
	
	var match_notice_str = NoticeMatch.join(',');
	
	if( match_notice_str.indexOf( match_id )==-1 ){ return true;}
	
	var match_info = getMatchInfo(match_id);
	var title_str = match_info['away_name'];
	if( type==1 ){
		title_str = match_info['home_name'];
	}
	title_str +=' '+event_time+'′'+'进球 ';  
	notify.createNotification(
		title_str,
		{
			body:match_info['home_name']+' '+match_info['home_goals']+'-'+match_info['away_goals'] +' '+match_info['away_name'], 
			icon: "images/dyjiconsds.jpg"
		}
	);
	return true;
}



//--1850 add

function hightChartsText( match_id ,type){
	if( type!='spcon' ){
		var odds = setHightChartsData(match_id,type);
	}else{
		var odds = setHightChartsXMore( match_id );
	}
	var id_str = match_id+'_hightc';
	var line_name = '';
	var no_odds = '本场无赔率';
	
	var now = Date.parse(new Date());
	if( type!='spcon' ){
		if(odds['data'][0]!= undefined ){
		
			if( odds['time'].length<=1 ){
                               
				date_arr = getDateArrByTime( now );
				date_arr['month'] = parseInt(date_arr['month'])-1;
				zheng = Date.UTC( date_arr['year'],date_arr['month'],date_arr['day'],date_arr['hour'],date_arr['minute'] ,date_arr['second']);
				
				odds['time'].push(zheng );
				odds['data'].push([zheng ,odds['data'][0][1]]); 
			}
                       
			hightChartsShow( id_str,odds['time'],odds['data'],type );
		}else{	
			$('#'+match_id+'_hightc').html( no_odds );
		}
	}else{
		if(odds['data']['WinOdds'][0]!=undefined){
			if( odds['time'].length<=1 ){
				now_date = timeToDate(0,1);
				odds['time'].push(now_date);
				
				odds['data']['WinOdds'].push( odds['data']['WinOdds'][0] );
				odds['data']['DrawnOdds'].push( odds['data']['DrawnOdds'][0] );
				odds['data']['LostOdds'].push( odds['data']['LostOdds'][0] );
			}
			hightChartsShowMore( id_str,odds['time'],odds['data'] );
		}else{	
			$('#'+match_id+'_hightc').html( no_odds );
		}
	}
	return ;
}



function setHightChartsData( match_id,type ){
	var odds_time 	= [];
	var odds_second	= [];
	var odds_data 	= [];
	var odds 	  	= [];
	var key_w		= '';
	//var is_reve = getIsReverse(match_id);
	switch( type ){
		case 'home':
			key_w = 'WinOdds';
			break;
		case 'visitor':
			key_w = 'LostOdds';
			break;
		case 'showscore':
			key_w = 'DrawnOdds';
			break;	
	}
	//if( is_reve=='Y' ){
	//	key_w = checkDataIsReve(6,key_w);
	//}
	var is_checked = rangqiuChecked();
	for(var i in AllOdds[is_checked][match_id]){
		
		odds 	 = AllOdds[is_checked][match_id][i];
		time_now = parseInt(odds['AddTime'],10);
		
		date_arr = getDateArrByTime(time_now  );
		date_arr['month'] = parseInt(date_arr['month'])-1;
		time_zheng = Date.UTC( date_arr['year'],date_arr['month'],date_arr['day'],date_arr['hour'],date_arr['minute'],date_arr['second']);
		
		odds_time.push(time_zheng);
		odds_data.push( [time_zheng,parseFloat(odds[key_w])] );
	}
	odds['time'] = odds_time;
	odds['data'] = odds_data;
	return odds;
}


function addZhidingArr( match_id ){
	if( match_id.length<=0 ){ return false; }
	var match_zhiding_str = match_zhiding.join(',');	
	if( match_zhiding_str.indexOf( match_id )==-1 ){ 
		match_zhiding.push( match_id );
	}
	return true;
}

function delZhidingArr( match_id ){
	if( match_id.length<=0 ){ return false; }
	
	for( var k in match_ing){
		if(match_zhiding[k] == match_id )
		{
			delete match_zhiding[k];
		}
	}
	return true;
}


function showCheckBoxFudong(){
	var has_checked = 0;
	$('input[name="match_tr_checkbox"]:checked').each(function(){
		has_checked = 1;return false;
	});
	if(has_checked==0){$('#match_filter_layer').hide(); return true;}
	
	var width = $(window).width();
	var hight = $(window).height();
	var left_px = (width-1000)/2-27;
	var top_px  = hight/2-70;
	$('#match_filter_layer').css( 'left',left_px);
	$('.btn_gray_s').css('display','block');
	$('#match_filter_layer').css('top',top_px).show();
	return true;
}


function showChecked(){
	var is_checked = '';
	$('input[name="match_tr_checkbox"]').each(function(){
		is_checked = $(this).attr('checked');
		
		if( is_checked=='checked' ){
			$(this).parent('label').parent('td').parent('tr').show();
			$(this).parent('label').parent('td').nextAll('td[role="比分"]').children('.showscore_area').show();
		}else{
			$(this).parent('label').parent('td').parent('tr').hide();
			$(this).parent('label').parent('td').nextAll('td[role="比分"]').children('.showscore_area').hide();
		}
	});
	return true;
}

function hideChecked(){
	var is_checked = '';
	$('input[name="match_tr_checkbox"]').each(function(){
		is_checked = $(this).attr('checked');
		
		if( is_checked=='checked' ){
			$(this).parent('label').parent('td').parent('tr').hide();
			$(this).parent('label').parent('td').nextAll('td[role="比分"]').children('.showscore_area').hide();
		}else{
			$(this).parent('label').parent('td').parent('tr').show();
			$(this).parent('label').parent('td').nextAll('td[role="比分"]').children('.showscore_area').show();
		}
	});
	return true;
}


/*add-04-04-10*/
function getHightStatus(){
	 return $('#fun5').is( ":checked" );
}

function getMatchState(match_id){	
	return $('#'+match_id+'_tr>td:eq(4)').attr('is_over');
}


function clearHightFuDong(){
	$('.home').unbind( 'hover' );
	$('.visitor').unbind( 'hover' );
	$('.spcon').unbind( 'hover' );
	return true;
}


function getLocalStorageCheck(){
	var i_count = LocalStorageArrKey.length;
	var key_l 	= '';
	var val_local;
	for( var i =0 ;i<i_count;i++ ){
		key_l = LocalStorageArrKey[i];
		val_local 	= getLocalStorageVal( key_l );
		key_arr 	= key_l.split('_');
		
		if( key_arr[2]!=null ){
			check_id = key_arr[1]+'_'+key_arr[2];
		}else{
			check_id = key_arr[1];
		}	
		
		if(val_local==1)
		{
			$('#'+check_id).attr('checked',true);
		}
		else
		{
			$('#'+check_id).attr('checked',false);
		}
	}
	return true;
}


function setLocalStorageVal( key,val ){
	if(window.localStorage){
		localStorage[key] = val;
	}
	return true;
}


function getLocalStorageVal(key){
	//--默认数组
	var default_arr = [];
	default_arr['BF_fun1'] = 1;
	default_arr['BF_fun2'] = 1;
	default_arr['BF_fun3'] = 1;
	
	var val_re;
	if( window.localStorage ){
		val_re = localStorage[key];
	}else{
		//--默认
		val_re = default_arr[key];
	}
	return val_re;
}

/*0408*/
function SorHPL(){
	var is_checked = getHightStatus();
	var match_id 	 = 0;
	var match_id_arr = [];
	var is_check_num = 0;
	
	hightChartsFudong();
	if( is_checked == true )
	{	//--图表显示	
		is_check_num = 1;
	}
	else if( is_checked == false  )
	{	//--比分
		//--所有is_over！= 0
		$('tr[name="MatchIDTr"]').each(function(){
			match_id = $(this).attr('match_id');
			is_over  = parseInt(getMatchState( match_id ));
			if( is_over!=0 )
			{
				match_id_arr.push( match_id);
				clearHightFuDongMatchID(match_id);
				//--clear
				$('#'+match_id+'_state_new').html('');
				$('#'+match_id+'_event_new').html('');
			}
		});
		var match_id_count = match_id_arr.length;
		//clearHightFuDong();
		if(match_id_count>0)
		{
			var match_id_str = match_id_arr.join(',');
			ajaxMatchEventNew( match_id_str );
			getMatchTeachState( match_id_str );
		}
	}
	setLocalStorageVal('BF_fun5',is_check_num);
	return true;
}


function clearHightFuDongMatchID(match_id){
	$('#'+match_id+'_tr>td:eq(5)').unbind('hover');
	$('#'+match_id+'_tr>td:eq(7)').unbind('hover');
	return true;
}


function bifenFudong(){
	//比分浮动层
	var match_id =event_new = state_new= id_str ='';
	
	$('.showscore').hover(function(){
		id_str = $(this).children('h3').children('label').attr('id');
		id_arr = id_str.split( '_' );
		match_id = id_arr[0];
		
		var is_checked  = getHightStatus();
		var match_state = getMatchState( match_id );
		var match_state_str = ',-1,1,2,3,4';
		if( (is_checked==true || match_state_str.indexOf(','+match_state)==-1)&& LotteryType=='jingcaizuqiu' )
		{	//--hightcharts
			hightChartsMove( match_id,'showscore' );
			beforeOddsData( match_id,'showscore' );
		}
		else
		{	//-Goals
			event_new = $('#'+match_id+'_event_new').html();
			state_new = $('#'+match_id+'_state_new').html();
			
			if( event_new.length>0 || state_new.length>0 )
			{
				$(this).parent().addClass("z_index100").find(".match_log").show();
			}
		}
	}, function(){
		$(this).parent().removeClass("z_index100").find('.match_log').hide();
	});
	return;
}


function hightChartsFudong(){
	//比分浮动层	
	if( LotteryType!='jingcaizuqiu'){ 
		//--清除图表弹框事件
		clearHightFuDong();
		return true;
	}

	var match_id = '';
	$('.home').hover(function(){
		match_id = $(this).parent('tr').attr('match_id');
		hightChartsMove( match_id,'home' );
	}, function(){
		match_id = $(this).parent('tr').attr('match_id');
		$(this).parent().removeClass("z_index100").find('.match_log').hide();
		backEventStateNew(match_id);
	});
	
	$('.visitor').hover(function(){
		match_id = $(this).parent('tr').attr('match_id');
		hightChartsMove( match_id,'visitor' );
		
	}, function(){
		match_id = $(this).parent('tr').attr('match_id');
		$(this).parent().removeClass("z_index100").find('.match_log').hide();
		backEventStateNew(match_id);
	});
	
	bindHightChartsMore();
	
	return true;
}


function getNowLiNumHightCharts(){
	return $('#li_num_hightcharts').val();
}


function hightChartsMove(match_id,type){
	var is_checked = getHightStatus();
	var match_state = getMatchState( match_id );
	var match_state_str = ',-1,1,2,3,4';
	if((is_checked==false && match_state_str.indexOf( match_state )==-1) || is_checked==true){
		str_hightcharts = '<tr ><td colspan="3"><div id="'+match_id+'_hightc" width="100%"></div></td></tr>';
		
		$('#'+match_id+'_event_new').html(str_hightcharts);
		hightChartsText( match_id,type );
		$('#'+match_id+'_tr>td:eq(6)>div:eq(0)').find('.match_log').addClass("z_index100").show();
		
		if( type!='spcon' ){
			beforeOddsData( match_id,type );
		}else{
			$('#'+match_id+'_state_new').html('');
		}
	}
	return true;
}


function eventEveryTime(){
    var int_time 	= 0;
	var is_over 	= 0;
	var time_date 	= '';
    for( var k in match_ing)
    {
		is_over 	= parseInt($('#'+match_ing[k]+'_tr>td:eq(4)').attr('is_over'));
		time_date 	= $('#'+match_ing[k]+'_ji_time_h').val();
		
		var int_time_str = getEventTimeNew( time_date,is_over );
        $('#'+match_ing[k]+'_tr>td:eq(4)').html( int_time_str);  
    }
	return true;
}


function makeCTime(){
	var time_stamp = Date.parse(new Date());
	CTime = STime-time_stamp/1000;
	return true;
}


function getEventTimeNew( real_start_time,match_state ){
	var c_time 			= CTime;
	var now_time_stamp 	= Date.parse(new Date())/1000;
	var real_timestamp 	= getTime( real_start_time );
	var event_time		= (now_time_stamp+c_time)-real_timestamp;
	
	event_time = parseInt(event_time/60);
	if( match_state==3 ){
		event_time += 45;
	}
	
	var event_time_str = event_time.toString()+'′';
	
	if( match_state==1 && event_time>45 ){
		event_time_str = '45′+';
	}
	
	if( (match_state==3 && event_time>90) || match_state==4 ){
		event_time_str = '90′+';
	}
	return event_time_str;
}


function getTime(day){
	var re = /(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?/.exec(day);
	return new Date(re[1],(re[2]||1)-1,re[3]||1,re[4]||0,re[5]||0,re[6]||0).getTime()/1000;
}


function makeTable( matchList ){
	
	if( matchList.length==0 ){
		var page_str = '<tr><td colspan=16 align="center">今日暂无比赛</td></tr>';
		return page_str;
	}
	
	var match_state = ',1,3,4,';
	var match_state_weather = ',1,2,3,4,-1,';
	var match_state_bifen = ',0,-14,';
	var table_str = ' ';
	var rangqiu = '';
	var ZLKUrl = 'http://zlk.cpdyj.com';
	var show_time = '';
	var time_c = 0;
	var show_time_arr = [];
	for( var list in matchList ){
		var match 	= matchList[list];
		match_id  	= match['MatchID'];
		if( match['isReverse']=='Y' ){
		 	match = checkDataIsReve( 1,match );
		}
		//--tr start
		table_str += "<tr name='MatchIDTr' is_reve='"+match['isReverse']+"' is_ding = '2' num = "+list+" class=''  match_id='"+match_id+"' id='"+match_id+"_tr' >";
		table_str += "";
		
		//--序号
		table_str +='<td role="序号"><label><input  type="checkbox" name="match_tr_checkbox" onclick="showCheckBoxFudong()">&nbsp;'+match['number']+'</label><input type="hidden" value='+parseInt(match['number'],10)+' name="sort_input" ></td>';
		
		//--leaguename
		table_str +='<td style="color:#fff;" role="competition" bgcolor="'+match['Color']+'"><a target="_blank" style="color:#fff;" href="'+ZLKUrl+'/Match/MatchCenterMatch.php?LeagueID='+match['LeagueID']+'" >'+match['LeagueName']+'</a><input type="hidden" name="league_id_h"  value="'+match['LeagueID']+'"><input type="hidden" league_id="'+match['LeagueID']+'" name="sort_input" ></td>';
		
		//--分组
		table_str += '<td role="分组"><div class="shortenTitle"><a style="color:#000;" target="_blank" href="'+ZLKUrl+'/Match/MatchCenterMatch.php?FixtureID='+match['FixtureID']+'&TurnID='+match['TurnID']+'&GroupID='+match['GroupID']+'">';
		if( match['GroupName']=='默认分组'||match['GroupName']=='联赛' ){
			table_str += '第'+match['TurnID']+'轮';
		}else{
			table_str += match['GroupName'];
		}
		table_str += '</a></div></td>';
		
		//--时间
		
		show_time = match['showTime'];
//		show_time = show_time===undefined?'':show_time;
		show_time_arr = show_time.split(' ');
		time_c = show_time_arr.length;
		if( time_c>1 ){
			show_time = '<div width="100%">'+show_time_arr[0]+'</div><div width="100%">'+show_time_arr[1]+'</div>';
		}
		table_str +='<td style="white-space: pre-line;line-height: 21px;" role="比赛时间">'+show_time+'<input type="hidden" id="'+match_id+'_ji_time_h"  value="'+match['RealStartTime']+'"></td>';

		//--事件/时间
		table_str += '<td is_over='+match['MatchState'];
		if( onmatch_str.indexOf( ','+match['MatchState']+',' )!=-1 ){
			table_str +=' class="under_way" ';
		}
		table_str += ' >';
		if( match_state.indexOf(','+match['MatchState']+',')==-1 )
		{
			table_str += match['MatchStateName'];
		}
		else
		{
			table_str += match['TimeEvent']+'′';
		}
		table_str += '</td>';
		
		//--主队名称 
		table_str += '<td role="主队" class="home">';
		
		if (match.HomeRC>0)
		{
			table_str += '<i class="warning">'+match['HomeRC']+'</i>';	
		}
		
		if(match['HomeRank'].length>0  ){
			table_str += '<sup name="_home_sup_rank">['+match['HomeRank']+']</sup>';
		}else{
			table_str += '<sup name="_home_sup_rank"></sup>';
		}
		table_str += '<label name="home_j" ><a style="color:#000;" target="_blank" href="'+ZLKUrl+'/Match/MatchCenterTeam.php?GroupID='+match['GroupID']+'&TeamID='+match['HomeID']+'" >'+match['HomeName']+'</a></label>';
		
		table_str += '<label style="display:none;" name="home_f"><a style="color:#000;" target="_blank" href="'+ZLKUrl+'/Match/MatchCenterTeam.php?GroupID='+match['GroupID']+'&TeamID='+match['HomeID']+'" >'+match['HomeNameF']+'</a></label>';
		
		table_str += '<input type="hidden" value="'+match['HomeRC']+'" id="'+match_id+'_home_ry">';
		if( match['Ranqiu']!='0' )
		{
			class_rangqiu = 'concede';		
			if( match['Rangqiu'] == '+1' ){ class_rangqiu = 'plus_concede'; }
			//table_str += '<i  name="rangqiu_i_h" style="display:none" class="'+class_rangqiu+'">('+match['Rangqiu']+')</i>';
		}
		table_str += '</td>';
		
		//--比分
		table_str += '<td  role="比分"><div class="showscore_area">';
		table_str += '<a href="#1" class="showscore" ';
		if( onmatch_color_str.indexOf( ','+match['MatchState']+',')!=-1 )
		{	
			table_str += ' style="color:blue;" ';
		}
		table_str+='><h3>';
		
		if ( match_state_bifen.indexOf( ','+match['MatchState']+',')!=-1 )
		{	
			match['HomeGoals'] = '';
			match['AwayGoals'] = '';
		}
		table_str +='<label id="'+match_id+'_home_goals" >'+match['HomeGoals']+'</label>-<label id="'+match_id+'_away_goals" >'+match['AwayGoals']+'</label>';
	
		table_str +='</h3></a>';
		
		//--下拉
		table_str +='<div class="match_log" style="display:none;"><table  cellpadding="0" cellspacing="0" width="100%"><colgroup><col width="30%" /><col width="10%" /><col width="30%" /></colgroup><tbody id="'+match_id+'_event_new" ></tbody><tfoot><tr><td  colspan="3" ><table  cellpadding="0" cellspacing="0" width="100%"  ><colgroup> <col width="20%" /> <col width="60%" /> <col width="20%" /> </colgroup><tbody id="'+match_id+'_state_new" ></tbody></table></td></tr></tfoot></table></div></div></td>';
		
		//--客队信息		
		table_str += '<td role="客队" class="visitor">';
		
		table_str += '<label name="away_f" style="display:none;"><a style="color:#000;" target="_blank" href="'+ZLKUrl+'/Match/MatchCenterTeam.php?GroupID='+match['GroupID']+'&TeamID='+match['AwayID']+'" >'+match['AwayNameF']+'</a></label>';
		
		table_str += '<label name="away_j"><a style="color:#000;" target="_blank" href="'+ZLKUrl+'/Match/MatchCenterTeam.php?GroupID='+match['GroupID']+'&TeamID='+match['AwayID']+'" >'+match['AwayName']+'</a></label>';
		if( match['AwayRank'].length>0){
			table_str +='<sup name="_away_sup_rank" >['+match['AwayRank']+']</sup>';
		}else{
			table_str +='<sup name="_away_sup_rank" ></sup>';
		}
		table_str += '<input type="hidden" value="'+match['AwayRC']+'" id="'+match_id+'_away_ry">'
		if (parseInt(match['AwayRC'],10)>0){
			table_str +='<i class="warning">'+match['AwayRC']+'</i>';
		}
		table_str += '</td>';
		
		//--让球
		if( match['Ranqiu']!='0' )
		{
			class_rangqiu = 'concede';		
			if( match['Rangqiu'] == '+1' ){ class_rangqiu = 'plus_concede'; }
		}
		
		if( LotteryType=='jingcaizuqiu' ){
			table_str += '<td role="让球"><li class="li_rangqiu_0">0</li><li class="li_rangqiu_1">'+match['Rangqiu']+'</li></td>';
		}else{
			table_str += '<td role="让球"><li class="li_rangqiu_0">'+match['Rangqiu']+'</li></td>';
		}
		//--竞赔
		table_str += '<td role="win" class="sp_noborder spcon"><span ></span></td>';
		table_str += '<td role="DrawnOdds" class="sp_noborder spcon"><span></span></td>';
        table_str += '<td role="Lost" class="spcon"><span></span></td>';
	
		//--半场比分/天气
		table_str +='<td class="weather_or_halfscore" id="'+match_id+'_half_td" >';
		if( match_state_weather.indexOf(','+match['MatchState']+','  )==-1 ){
			if( match['Weather'].length>0 ){
				table_str +='<i class="'+match['weatherClass']+'" title="'+match['Weather']+'"></i>';
			}
		}else{
			table_str += '<em style="color:#666"  id="'+match_id+'_half_home_goals" >'+match['HalfHomeGoals']+'-</em><em style="color:#666"  id="'+match_id+'_half_away_goals" >'+match['HalfAwayGoals']+'</em>'; 
		}
		table_str +='</td>';
		
		//--欧/析
		table_str += '<td role="数据"><a target="_blank" href="'+ZLKUrl+'/Match/EuropeLast.php?MatchID='+match_id+'">欧</a>/<a target="_blank" href="'+ZLKUrl+'/Match/LastMatch.php?MatchID='+match_id+'">析</a></td>';
		
		//--直播
		zhibo_str = '';
		if( match['SwfUrl']!=null ){
			zhibo_class = 'live';
			if( match['SwfType']==2 ){
				zhibo_class += ' highlight';
			}
			zhibo_str = '<a href="'+match['SwfUrl']+'" target="_blank" title="直播" class="'+zhibo_class+'">直播</a>';
		}
		table_str +='<td role="直播">'+zhibo_str+'</td>' ;
		//--置顶
		table_str += '<td role="置顶"><a href="javascript:void(0)" onclick="getAccessNotice('+match_id+');zhiding('+match_id+','+list+');" title="置顶" class="stick"></a></td>';	
	}
	return table_str;
}


function clearOddsVal( match_id,num ){
	if( $('#'+match_id+'_tr>td:eq(9)>span:eq('+num+')').text==undefined ){
		return false;
	}else{
		$('#'+match_id+'_tr>td:eq(9)>span:eq('+num+')').text('');
		$('#'+match_id+'_tr>td:eq(10)>span:eq('+num+')').text('');
		$('#'+match_id+'_tr>td:eq(11)>span:eq('+num+')').text('');
	}
	return ;
}

function changeOddsClass( odds_type ){
	
	for(var k_o in odds_type_arr){
		if( odds_type ==odds_type_arr[k_o] ){
			$('#th_'+odds_type_arr[k_o]).addClass( 'tabed' );
		}else{
			$('#th_'+odds_type_arr[k_o]).removeClass( 'tabed' );
		}
	}
	oddsTitleClass();
	return ;
}


function changeOddsCol( match_id ){

	var home_goals,away_goals,td_eq;
	var odds_count = [0,0,0]	
	var is_checked = fun4Checked();
	var rang_qiu = 0;
	var is_selectJ = $('#th_JOdds').hasClass( 'tabed' );
	var is_selectE = $('#th_EOdds').hasClass( 'tabed' );
	var is_selectH = $('#th_Handicap').hasClass( 'tabed' );
	var num_odds = '4';
	var handicap_num = 0;
	
	//主队进球
	home_goals = parseInt($('#'+match_id+'_home_goals').text(),10);
	if( is_selectJ ) {
		//--竞彩让球
		rang_qiu = $('#'+match_id+'_tr>td:eq(8)>li:eq(1)').text();
		rang_qiu = parseInt(rang_qiu.replace(/\(|\)/g,""),10);
		var home_goals_j = home_goals+rang_qiu;
		
	}else if( is_selectH ){
		if( OddsList['Handicap'][match_id]!=undefined ){	
			handicap_num = parseFloat(OddsList['Handicap'][match_id]['HandicapNumber']);
		}
		home_goals = parseFloat(home_goals-handicap_num);
	}
	//客队进球
	away_goals = parseInt($('#'+match_id+'_away_goals').text(),10);
	
	//td num
	if(!isNaN( home_goals )&&!isNaN( away_goals ) ){
		
		res = getHAGoalsMaxMin( home_goals,away_goals );
		num_odds = getNumOdds( match_id,res,'0');		
		//上色
		setOddsColByNum( num_odds,match_id,res,'0' );
		
		//--如果是竞彩则多一次操作
		if( is_selectJ )
		{	//--竞彩
			res = getHAGoalsMaxMin( home_goals_j,away_goals );	
			num_odds_j = getNumOdds( match_id,res,'1' );
			setOddsColByNum( num_odds_j,match_id,res,'1' );
			num_odds;
		}
	}else{
		clearOddsCol(match_id);
	}
	return num_odds;
}


function setOddsColByNum(num_odds,match_id,res,i_index){
	
	var handicap_check = $('#th_Handicap').hasClass( 'tabed' );
	var tdnum_arr = [];
	tdnum_arr[0]  = 11;
	tdnum_arr[1]  = 10;
	tdnum_arr[3]  = 9;
	var span_class = ['first_compensate', 'sec_compensate', 'thr_compensate'];
	var td_eq = tdnum_arr[res];
	
	if( num_odds!='4' ){
		//--压盘只有一个颜色
		if( !handicap_check ){
			span_c = span_class[num_odds];
		}else{
			span_c = span_class[0];
		}
		for( var i=9;i<=11;i++ )
		{
			$('#'+match_id+'_tr>td:eq('+i+')>li:eq('+i_index+')>span:eq(0)').removeClass();
		}
		if( !(td_eq==10 && handicap_check ))
		{
			$('#'+match_id+'_tr>td:eq('+td_eq+')>li:eq('+i_index+')>span:eq(0)').removeClass().addClass( span_c );	
		}
	}else{
		clearOddsCol( match_id );
	}
	return true;
}


function getHAGoalsMaxMin( home_goals,away_goals ){
	var res = 0;
	if( home_goals > away_goals ){ res = 3; }
	if( home_goals == away_goals ){ res = 1; }
	return res;
}


function changeColCount( odds_count ){
	
	var odds_count_str = ['fir','sec','thr'];
	var odds_name = ['首指','次赔','末赔'];
	for(var i=0 ;i<=2;i++ ){
		$('.'+odds_count_str[i]).text(odds_name[i]+'='+ odds_count[i] );
	}
	return;
}

function clearOddsCol(match_id){
	$('#'+match_id+'_tr>td:eq(9)>span:eq(0)').removeClass();
	$('#'+match_id+'_tr>td:eq(10)>span:eq(0)').removeClass();
	$('#'+match_id+'_tr>td:eq(11)>span:eq(0)').removeClass();
	return ;
}


function getNumOdds( match_id,res,i_index ){
	var num_odds = 1;
	var num_arr = [];
	num_arr[0] = 11;
	num_arr[1] = 10;
	num_arr[3] = 9;
	
	var num_3 = parseFloat($('#'+match_id+'_tr>td:eq(9)>li:eq('+i_index+')>span:eq(0)').text());
	var num_1 = parseFloat($('#'+match_id+'_tr>td:eq(10)>li:eq('+i_index+')>span:eq(0)').text());
	var num_0 = parseFloat($('#'+match_id+'_tr>td:eq(11)>li:eq('+i_index+')>span:eq(0)').text());	
	var select_num	= parseFloat($('#'+match_id+'_tr>td:eq('+num_arr[res]+')>li:eq('+i_index+')>span:eq(0)').text());
	//alert( i_index +'--'+num_3+'--'+num_1+'--'+num_0);
	if( isNaN( num_3 ) || isNaN( num_0 )){    return '4';   }
	
	if( isNaN( num_1 )){
		var max_n = Math.max( num_3,num_0 );	
		if( max_n==select_num )
		{ 
			num_odds = 2; 
		}
		else
		{
			var min_n = Math.min(num_3,num_0 );	
			if( min_n==select_num ){ num_odds = 0; }
		}
	}
	else
	{
		var max_n = Math.max( num_3,num_1,num_0 );	
		if( max_n==select_num )
		{ 
			
			num_odds = 2; 
		}
		else
		{
			var min_n = Math.min(num_3,num_1,num_0 );	
			if( min_n==select_num ){ num_odds = 0; }
		}
	}
	return num_odds;
}


function changeOdds( odds_type ){
	var odds_count = [];
	odds_count[0] = odds_count[1]  =odds_count[2] =0;
	changeOddsClass( odds_type );
	var is_selectH = $('#th_Handicap').hasClass( 'tabed' );
	
	//--copy zhiding
	$('#list_tbody>tr').each(function(){
		
		match_id = $(this).attr('match_id');
		
		var is_ok = changeOddsData( match_id,odds_type );
		if( !is_ok ){
			clearOddsVal(match_id,0);	
			clearOddsVal(match_id,1);	
		}	
		num_odds = changeOddsCol(match_id);
		if( num_odds!='4' ){
			odds_count[num_odds]++;	
		}
	});
	
	var zhiding_count = $('#zhiding_tbody>tr').length;
	if( zhiding_count>0 ){	
		$('#zhiding_tbody>tr').not('#zhiding_tr_match').each(function(){
			
			match_id = $(this).attr('match_id');
			
			var is_ok = changeOddsData( match_id,odds_type );
			if( !is_ok ){
				clearOddsVal(match_id,0);	
				clearOddsVal(match_id,1);	
			}	
			num_odds = changeOddsCol(match_id);
			if( num_odds!='4' ){
				
				odds_count[num_odds]++;	
			}
		});
	}
	
	if( is_selectH ){
		odds_count[1] = 0;
	}
	//添加hightCharts
	bindHightChartsMore();
	//统计
	changeColCount( odds_count );
	return;
}


function bindHightChartsMore(){
	$('.li_hight_0').hover(function(){
		if( $('#th_JOdds').hasClass('tabed')==true ){
			$('#li_num_hightcharts').val('0');
			match_id = $(this).parent('td').parent('tr').attr('match_id');
			hightChartsMove( match_id,'spcon' );
			
		}
	},function(){
		if( $('#th_JOdds').hasClass('tabed')==true ){
			match_id = $(this).parent('td').parent('tr').attr('match_id');
			$(this).parent().parent().removeClass("z_index100").find('.match_log').hide();
			backEventStateNew(match_id);
		}
	});
	
	$('.li_hight_1').hover(function(){
		if( $('#th_JOdds').hasClass('tabed')==true ){
			$('#li_num_hightcharts').val('1');
			match_id = $(this).parent('td').parent('tr').attr('match_id');
			hightChartsMove( match_id,'spcon' );
		}
	},function(){
		if( $('#th_JOdds').hasClass('tabed')==true ){
			match_id = $(this).parent('td').parent('tr').attr('match_id');
			$(this).parent().parent().removeClass("z_index100").find('.match_log').hide();
			backEventStateNew(match_id);
		}
	});
	return true;
}

function getDoubleStatus(){
	var is_checked = 1;
	if( $('#funDouble').is(':checked')==false ){
		is_checked = 2;
	}
	return is_checked;
}

function showHideDouble(  ){
	//-1单(未选中) 2 双(选中) 
	var is_d = getDoubleStatus();
	if( is_d==1 ){
		$('.li_rangqiu_1').hide();
		$('.li_hight_1').hide();
	}else{
		$('.li_rangqiu_1').show();
		$('.li_rangqiu_1').show();
	}
	return true;
}


/*修改Odds*/
function changeOddsData( match_id,odds_type ){
	var type_str = 'JOdds,EOdds,Handicap';
	var data8 = data9 = data10 = '';
	var data_arr = [];
	if( odds_type.length<=0 || type_str.indexOf( odds_type ) == -1 ){ return false; }
	if( !OddsList ){ return false; }
	
	var odds = OddsList[odds_type];
	var is_reve = getIsReverse( match_id );
	data_arr = getOddsDataByType( match_id,odds,odds_type );
	
	if( odds_type=='JOdds' ){
		var td_str_9 ='<li class="li_hight_0" ><span>';
		var td_str_10 ='<li class="li_hight_0" ><span>';
		var td_str_11 ='<li class="li_hight_0" ><span>';
		
		if(!isNaN( data_arr[0][0] ) && data_arr[0][0].length>0 ){
			td_str_9 += data_arr[0][0];
			td_str_10 += data_arr[0][1];
			td_str_11 += data_arr[0][2];
		}
		td_str_9 +='</span></li>';
		td_str_10 +='</span></li>';
		td_str_11 +='</span></li>';
		
		td_str_9 +='<li class="li_hight_1" ><span>';
		td_str_10 +='<li class="li_hight_1" ><span>';
		td_str_11 +='<li class="li_hight_1" ><span>';
		if(!isNaN( data_arr[1][0] ) &&  data_arr[1][0].length>0 ){
			td_str_9 += data_arr[1][0];
			td_str_10 += data_arr[1][1];
			td_str_11 += data_arr[1][2];	
		}
		td_str_9 +='</span></li>';
		td_str_10 +='</span></li>';
		td_str_11 +='</span></li>';
		
		
		$('#'+match_id+'_tr>td:eq(9)').html(td_str_9);
		$('#'+match_id+'_tr>td:eq(11)').html(td_str_11);
		$('#'+match_id+'_tr>td:eq(10)').html(td_str_10);
		
	}else{
		if(data_arr[0]==undefined || data_arr[0]==null){
			clearOddsVal( match_id ,0);
		}else{
			if( is_reve=='Y' ){
				data_arr = checkDataIsReve(7,data_arr);
			}
			var td_str_9 = '<li class="li_hight_0" ><span>'+data_arr[0]+'</span></li>';
			var td_str_10 = '<li class="li_hight_0" ><span>'+data_arr[1]+'</span></li>';
			var td_str_11 = '<li class="li_hight_0" ><span>'+data_arr[2]+'</span></li>';

			$('#'+match_id+'_tr>td:eq(9)').html(td_str_9);
			$('#'+match_id+'_tr>td:eq(11)').html(td_str_11);
			$('#'+match_id+'_tr>td:eq(10)').html(td_str_10);
		}
	}
	return true;
}


function getOddsDataByType( match_id,odds,odds_type ){
	
	var re_data = [];
	var data8 = data10 = '';
	var col_1 = col_2 = 'blue';
	
	if((odds_type!='JOdds' && odds[match_id]==null) ){
		return false;
	}
	if( odds_type=='JOdds' || odds_type=='EOdds' )
	{
		if( odds_type=='JOdds' ){
			re_data[0] = ['','',''];
			re_data[1] = ['','',''];
			if(odds[0][match_id]!=null){
				re_data[0][0] = parseFloat(odds[0][match_id]['WinOdds']).toFixed(2);
				re_data[0][1] = parseFloat(odds[0][match_id]['DrawnOdds']).toFixed(2);
				re_data[0][2] = parseFloat(odds[0][match_id]['LostOdds']).toFixed(2);
			}
			if(odds[1][match_id]!=null){
				re_data[1][0] = parseFloat(odds[1][match_id]['WinOdds']).toFixed(2);
				re_data[1][1] = parseFloat(odds[1][match_id]['DrawnOdds']).toFixed(2);
				re_data[1][2] = parseFloat(odds[1][match_id]['LostOdds']).toFixed(2);
			}
		}else{
			re_data = ['','',''];
			re_data[0] = parseFloat(odds[match_id]['WinOdds']).toFixed(2);
			re_data[1] = parseFloat(odds[match_id]['DrawnOdds']).toFixed(2);
			re_data[2] = parseFloat(odds[match_id]['LostOdds']).toFixed(2);
		}
	}
	else
	{
		re_data[0] = re_data[1]  = re_data[2] ='';
		data8 = parseFloat(odds[match_id]['UnderLine']).toFixed(2);		
		if( !isNaN(data8) )
		{
			if(odds[match_id]['underline_str']=='↑'){ col_1 = 'red'; }
			re_data[0] = data8.toString() +'<font color="'+col_1+'">'+odds[match_id]['underline_str']+'</font>';
		}	
		if( !isNaN(data8) )
		{
			re_data[1] ='<font style="font-size:12px;">'+ odds[match_id]['HandicapName']+'</font>';
		}
		
		data10 = parseFloat(odds[match_id]['OverLine']).toFixed(2);	
		if( !isNaN(data10) )
		{
			if(odds[match_id]['overline_str']=='↑'){ col_2 = 'red'; }
			re_data[2] = data10.toString()+'<font color="'+col_2+'">'+odds[match_id]['overline_str']+'</font>';
		}		
	}
	return re_data
}


function rangqiuChecked(){
	var re = 0;
	var is_checked = $('#rangqiu_check').is(":checked");
	if( is_checked==true ){
		re = 1;
	}
	return re;
}


function getIsReverse( match_id ){
	return $('#'+match_id+'_tr').attr('is_reve');
}



/**/
function checkDataIsReve( type,data ){
	var new_data;
	var key_arr = [];
	switch( type ){
		case 1: //makeTable
			key_arr = [
			['HomeName','HomeGoals','HalfHomeGoals','HomeRC','HomeRank','HomeID','HomeYC'],
			['AwayName','AwayGoals','HalfAwayGoals','AwayRC','AwayRank','AwayID','AwayYC']];
			new_data = isReveData( data,key_arr );
			break; 
		case 2: //makeTeachState
			key_arr = [['0'],['1']];
			new_data = isReveData( data,key_arr );
			break;
		case 3: //appentEventPlayer
			var is_hora_arr = [1,0];
			data['ISHomeAway'] = is_hora_arr[data['ISHomeAway']];
			new_data = data;
			break;
		case 4: //changeMatch 2s API
			key_arr = [[1,3,5,11],[2,4,6,12]];
			new_data = isReveData( data,key_arr );
			break;
		case 5: //setHightChartsXMore
			key_arr = [['WinOdds'],['LostOdds']];
			new_data = isReveData( data,key_arr );
			break;
		case 6: //setHightChartsData - setHightChartsX
			if( data=='WinOdds' ){
				new_data='LostOdds';
			}
			if( data=='LostOdds' ){
				new_data='WinOdds';
			}
			if( data=='DrawnOdds' ){
				new_data=data;
			}
			break;	
		case 7: //--
			key_arr = [['0'],['2']];
			new_data = isReveData( data,key_arr );
			break;
	}
	
	return new_data;
}


function isReveData( data,key_arr ){
	//if( key_arr[0]==undefined ){ alert( key_arr ); }
	var key_len0 = key_arr[0].length;
	if( key_len0==0 ){ return data; }
	
	var f_k = s_k = '';
	var middle_val;
	
	for(var i=0;i<key_len0;i++  ){
		f_k = key_arr[0][i];
		s_k = key_arr[1][i];
		
		middle_val = data[f_k];
		data[f_k]  = data[s_k];
		data[s_k]  = middle_val;
	}
	return data;
}


function getMatchRealStartTime( match_id ){
	return $('#'+match_id+'_ji_time_h').val();
}


function checkApiJsDate( match_id,date_d ){
	
	if(date_d.length<=0 || date_d==null|| date_d==undefined ){ 
		return getMatchRealStartTime( match_id ); 
	}
	
	var date_arr = date_d.split(',');
	date_arr[1]++;
	var date_str = date_arr[0]+'-'+date_arr[1]+'-'+date_arr[2]+' '+date_arr[3]+':'+date_arr[4]+':'+date_arr[5];
	return date_str;	
}



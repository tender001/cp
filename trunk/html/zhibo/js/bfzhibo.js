var match_ing = [];
var noticeTimeoutId = '' ;
var isOldData = new Array;
var isOutLine = 2;
var updateDataUpTime = (new Date()).valueOf();
var TodayDate = '';
var DateArr = new Array;
var LotteryType = '';
var onmatch_str = '1,3,4,';
var onmatch_color_str = '1,2,3,4,';
var ip_211 = '127.0.0.1';/*221.228.229.211*/
var ip_210 = '127.0.0.1';/*221.228.229.210*/



$(function(){
	
	//--获取参数
	var url_arr = GetRequest();
	
	var talbe = MainTable(url_arr['date'],url_arr['type']);
	
	//--标头显示
	$('#bfbiaotou li').each(function(){
		vals_t = $(this).children('a').attr('vals_t');
		if( vals_t.indexOf(LotteryType)!=-1 ){
			$(this).addClass('mouseon');
		}else{
			$(this).removeClass('mouseon');
		}
	});
	
	/*-add-*/
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
	//表格交替颜色
	$(".interlaced_color tr:not('.nnnbg'):odd").addClass("odd");
	$(".interlaced_color tr:not('.nnnbg'):even").addClass("even")
	$(".interlaced_color tr").not(".nnnbg").hover(function(){
		$(this).addClass("hover")
	},function(){
		$(this).removeClass("hover")
	});

	//赔率切换
	$(".sptitle").not(".tabed").hover(function(){
	   $(this).addClass("hover");	
	},function(){
	   $(this).removeClass("hover");	
	})
});


function onloadF(){
	
	onloadSong();	
	var ss = firstInput();
	$(".iframe").not('#match_select_a').click(function(){
		$(this).find(".hide_frame").toggle();
	});
	$('#league_div_a').hide();
	for( var date_k in DateArr ){
		date_str = '<a href="?type='+LotteryType+'&date='+DateArr[date_k]+'"  class="timer">'+DateArr[date_k]+'</a>';
		$('#qihaoBox').append(date_str);
	}

	//--时间初始化
	$('#select_date_h').val( TodayDate );
	$('#select_date_a').text( TodayDate );
	$('#ga_checkbox').attr('checked','checked');
	
	setInterval('updateData()',2000);
	setInterval('eventEveryTime()',60000);
	setInterval('startChangeEventPlayer()',50000);
	setInterval('startChangeTechState()',100000);
	return;
}


function firstInput(){
	//--ajax获取event
	var matchid_arr = new Array();
	var is_over ,match_id;
	$('#list_tbody>tr:gt(0)').each(function(){
		//--获取所有的MatchID
		match_id = $(this).attr('match_id');		
		if( match_id!=undefined ){
			matchid_arr.push( match_id );
		}

		//--将正在比赛的ID加入到计时器队列
		is_over  = parseInt( $(this).children('td:eq(4)').attr('is_over'));
		if( is_over==1 || is_over==3||is_over==4 ){
			addMatchIng( match_id );
		}	
	});	
	matchid_str = matchid_arr.join(',');
	
	//ajGetMatchEvent( matchid_str  );
	ajaxMatchEventNew( matchid_str  );
	
	unzhidingAll();
	
	updateLeagueList();	

	//表格交替颜色
	$(".truecolor tr").not('.zhiding').not('.nnnbg').each(function (i){
		$(this).removeClass(i%2?'color2':'color1').addClass(i%2?'color1':'color2').hover(function (){
			$(this).addClass('color3')
		},function (){
			$(this).removeClass('color3')
		})
	});
	getMatchTeachState(matchid_str);
	//比分浮动层
	fudong();
	return ;
}



/*更换球员名称-start*/
function startChangeEventPlayer(){
	
	$.getScript('http://'+ip_211+'/live/bfplayer.js', function() {
		eval(mlist);
		var rq_arr = checkData( mlist );
		//changeEventPlayer( rq_arr );
		appentEventPlayer(rq_arr,1);
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


function getEventTypeNum( type_str ){
	var type_num=0;
	switch( type_str ){
		case 'jq_icon':
			type_num = 1;break;
		case 'wr_icon':
			type_num = 2;break;
		case 'wy_icon':
			type_num = 3;break;
	}
	return type_num;
}


function ajaxMatchEventNew( matchid_str ){
	
	if(matchid_str.length<=0) return false;
	$.ajax({
		url: '/Match/AjaxMatchEventPlayer.php',
		type: 'POST',
		dataType: 'json',
		data: 'match_ids=' + matchid_str,
		success: function (data) {
			if( data!='2' ){
				appentEventPlayer( data,2 );
			}
			//--表示已经处理完断网
			isOutLine=2;	
		}
	});	
}


function appentEventPlayer( rq_arr,from_f ){
	
	/*from_f 1=js 2=php*/

	for( var rq_k in rq_arr ){
		var event_num = 1;
		//--every_match
		now_match = rq_arr[rq_k];
		if($('#'+rq_k+'_event_new').html()==null){ continue; }
		
		$('#'+rq_k+'_event_new').html('');
		for(var event_k in now_match )
		{	
			now_event = now_match[event_k];
			if( from_f == 1 )
			{
				now_event = makeStrKeyPlayer( now_event );
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
/*更换球员名称-end*/


function getClassByEventType( num ){
	
	var type_arr = new Array;
	type_arr[1]='jq_icon';
	type_arr[2]='wr_icon';
	type_arr[3]='wy_icon';
	type_arr[7]='wl_icon';
	type_arr[8]='dq_icon';
	type_arr[9]='wr_icon';//--暂时用红色
	return type_arr[num]; 
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
		home_str += '<i class="red_warning" >'+data['HomeRC']+'</i>';
	}
	if( data['AwayRC']>0 )
	{
		away_str += '<i class="red_warning" >'+data['AwayRC']+'</i>';
	}
	if( data['HomeYC']>0 )
	{
		home_str += '<i class="yellow_warning" >'+data['HomeYC']+'</i>';
	}
	if( data['AwayYC']>0 )
	{
		away_str += '<i class="yellow_warning" >'+data['AwayYC']+'</i>';
	}

	$('#'+match_id+'_tr>td:eq(5)').html(home_str);
	$('#'+match_id+'_tr>td:eq(7)').html(away_str);

	//--update MatchState
}



function showSong(){
	$("#jquery_jplayer_1").jPlayer('play');
	return;
}


function appendEvent( event_arr ){
	var str = '';
	var player = '';
	var class_type = '';
	var event_arr_1 = event_arr[1];
	var event_arr_2 = event_arr[2];
	
	var home_str = str =  away_str = first = last = class_type = '';
	
	//--第0分钟不显示
	if( parseInt(event_arr_2['EventTime'])==0 ){ return ; }
	
	//--中场休息
	if( event_arr_2['TypeCode']=='ZCXX' )
	{
		str += '<tr class="banchang nnnbg"><td><i class="bcicon"></i><span>上半场结束</span></td><td>45\'</td><td></td></tr>';
	}
	else
	{
		/*
			1=>事件 2=>参数 
		*/
		var type_code_arr = event_arr_2['TypeCode'].split(',');
		for(var k in event_arr_1){
			class_type = '';
			first = event_arr_1[k].substring(0,4);
			last  = event_arr_1[k].substring(4);
			
			switch( last ){
				case 'Goals':
					class_type = 'jq_icon';
					break;
				case 'RC':
					class_type = 'wr_icon';break;
				case 'YC':
					class_type = 'wy_icon';break;	
			}
			if( first == 'Home' ){
				if( class_type=='jq_icon' )
				{
					if( type_code_arr[1]=='7'  ){ class_type='wl_icon'; }
					if( type_code_arr[1]=='8'  ){ class_type='dq_icon'; }
				}
				home_str = '<i class="'+class_type+'" ></i>';
			}else{
				if( class_type=='jq_icon' )
				{
					if( type_code_arr[0]=='7'  ){ class_type='wl_icon'; }
					if( type_code_arr[0]=='8'  ){ class_type='dq_icon'; }
				}
				away_str = '<i class="'+class_type+'" ></i>';
			}			
		}

		str +='<tr class="nnnbg"><td class="home">'+home_str;
		if( home_str.length>0 )
		{
			str += '<span>'+event_arr_2['HomePlayer']+'</span>';
		}
		str +='</td>';
		str +='<td>'+event_arr_2['EventTime']+'\'</td>';
		str +='<td class="visitor">'+away_str;
		if( away_str.length>0 )
		{
			str += '<span>'+event_arr_2['AwayPlayer']+'</span>';
		}
		str +='</td></tr>';
		
	}
	
	//--添加
	$('#'+event_arr_2['MatchID']+'_event_new').append( str );
}



function updateData(){

/*var mlist = {
比赛ID:'0比赛状态^1主队比分^2客队比分^3主队上半场比分^4客队上半场比分^5主队红牌^6客队红牌^7比赛时间^8开场时间^9赛程说明^10是否有阵容^11主队黄牌^12客队黄牌'*/
	var nowTime = (new Date()).valueOf();
	onlineOrNot();
	//上次请求时间大于30s 或是 有断网记录则更新	
	if((nowTime-updateDataUpTime)>30000 || isOutLine==1  ){
		
		var matchid_arr = new Array;
		$('#list_tbody>tr:gt(0)').each(function(){

			//--将正在比赛的ID加入到update队列
			match_id = $(this).attr('match_id');
			if(  match_id!=undefined ){
				matchid_arr.push( match_id );
			}	
		});	
		matchid_str = matchid_arr.join(',');
		ajGetMatchEvent( matchid_str  );
	}else{
	
		$.getScript('http://221.228.229.211/live/bf.js?', function() {
			eval(mlist);
			var event_arr = is_have = '';
			for( var k in mlist ){
					event_arr = spileEventNew( mlist[k] );
					is_have  = $('#'+k+'_tr').attr('match_id');
					if( parseInt(event_arr[0])==0 || is_have==undefined  ){ continue; }
					changeMatch( k,event_arr );
				}
		});
	}
	updateDataUpTime = (new Date()).valueOf();
	return;
}


/*修改数据*/
function changeMatch( match_id,event_arr ){
	var is_change = 2;
	
	//--修改红/黄牌
	changeRY( match_id,event_arr );
	//changeY( match_id,event_arr );
	
	//--修改比分
	//--延迟不做比分改动
	if(event_arr[0] != '-14')
	{ 
		changeBifen( match_id,event_arr );
	}
	
	var is_over=$('#'+match_id+'_tr>td:eq(4)').attr('is_over');
	
	//--完场
	if( event_arr[0]=='-1' && parseInt(is_over)!=-1)
	{
		isOverMatch( match_id );
	}
	
	//-中场
	if( event_arr[0]==2 && parseInt(is_over)!=2 )
	{
		changeMiddle( match_id,event_arr  );
	}
	
	//--修改状态
	changeState( match_id,event_arr );	
	return true;
}

/*完场后改动*/
function isOverMatch( match_id ){
	$('#'+match_id+'_tr>td:eq(4)').removeClass('onmatch');
	$('#'+match_id+'_tr>td:eq(6)>div:eq(0)>a:eq(0)').css('color','red');
	return;
}


/*修改比分*/
function changeBifen( match_id,event_arr ){
	var is_change  = 2;
	var home_goals = $('#'+match_id+'_home_goals').text();
	var away_goals = $('#'+match_id+'_away_goals').text();
	var event_t	   = new Array;
	event_t[1] 	   = 1;
	
	if(event_arr[1] != home_goals)
	{
		home_goals++;
		$('#'+match_id+'_home_goals').html( event_arr[1] );
		event_t[0] = 1;
		is_change  = 1;
	}else if( home_goals=='' ){
	   $('#'+match_id+'_home_goals').html(0);
	}

	if( event_arr[2] != away_goals ){
		away_goals ++;
		$('#'+match_id+'_away_goals').html( event_arr[2] );
		event_t[0] = 2;
		is_change  = 1;
	}else if( away_goals=='' ){
	   $('#'+match_id+'_away_goals').html(0);
	}
	
	//--操作
	if( is_change==1 ){
		//changeOneEvent( match_id,event_arr,event_t );
		
		/*弹窗*/
		if( $('#ga_checkbox:checked').val()=='1'  ){
			if( noticeTimeoutId.length>0  ){
				clearTimeout(noticeTimeoutId);
			}
			showNotice( match_id,event_arr[13],event_t[0] );
			noticeTimeoutId = setTimeout(closeNotice,30000);
		}
		
		/*声音*/
		if( $('#'+match_id+'_song_check:checked').val()=='1' && $('#song_a').css('display')=='block'  ){
			showSong();
		}
	}
	return is_change;
}


function changeMiddle( match_id,event_arr  ){
	
	var half_home = '<em style="color:#666" id="'+match_id+'_half_home_goals" >'+event_arr[1]+'-</em>';
	
	half_home += '<em style="color:#666" id="'+match_id+'_half_away_goals" >'+event_arr[2]+'</em>';
	$('#'+match_id+'_half_td').html(half_home);
	
	var half_event_str = '<tr class="banchang nnnbg"><td><i class="bcicon"></i><span>上半场结束</span></td><td>45\'</td><td></td></tr>';
	$('#'+match_id+'_event_new').append( half_event_str );
}


function changeY( match_id,event_arr ){
	/*暂时不用已废弃(保留)*/
	var is_change = 2;
	/* 1-2  1r  2y */
	home_ry = $('#'+match_id+'_home_ry').val();
	away_ry = $('#'+match_id+'_away_ry').val();
	home_ry_arr = home_ry.split('-');
	away_ry_arr = away_ry.split('-');
	
	var event = new Array;
	event[1] = 3;
	
	var homeevent_y = event_arr[11];
	var awayevent_y = event_arr[12];
	
	var homenow_y = parseInt(home_ry_arr[1]);
	var awaynow_y =  parseInt(away_ry_arr[1]);
	
	//主队-red
	if(homeevent_y!=homenow_y &&homeevent_y>0 ){
		
		if(!isNaN(homenow_y) && homenow_y>0  )
		{
			$('#'+match_id+'_tr>td:eq(5)>i.yellow_warning').text( homeevent_y );
		}
		else
		{	
			var str = '<i class="yellow_warning">'+homeevent_y+'</i>';
			$('#'+match_id+'_tr>td:eq(5)').append( str );
		}	
		$('#'+match_id+'_home_ry').val(home_ry_arr[0]+'-'+homeevent_y);		
		event[0] = 1;
		is_change = 1;
	}
	
	//客队-red
	if( awayevent_y!=awaynow_y && awayevent_y>0){
	
		if(!isNaN(awaynow_y) && awaynow_y>0)
		{
			$('#'+match_id+'_tr>td:eq(7)>i.yellow_warning').text( awayevent_y );
		}
		else
		{
			var str = '<i class="yellow_warning">'+awayevent_y+'</i>';
			$('#'+match_id+'_tr>td:eq(7)').append( str );
		}

		$('#'+match_id+'_away_ry').val(away_ry_arr[0]+'-'+awayevent_y);
		event[0] = 2;
		is_change = 1;
	}

	/*if( is_change==1 ){
		changeOneEvent( match_id,event_arr,event );
	}*/	
	//客队-y
	return is_change;
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
			var home_red = parseInt(home_ry_arr[0]);
		
			if(home_red!=NaN && home_red>0  )
			{
				var count_home_r = event_arr[5];
				$('#'+match_id+'_tr>td:eq(5)>i.red_warning').text( count_home_r );
			}
			else
			{	
				var count_home_r = event_arr[5];
				var str = '<i class="red_warning">'+event_arr[5]+'</i>';
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
			var away_red = parseInt(away_ry_arr[0]);
			if(away_red!=NaN && away_red>0  )
			{
				var count_away_r = event_arr[6];
				$('#'+match_id+'_tr>td:eq(7)>i.red_warning').text( count_away_r );
			}
			else
			{
				var count_away_r = event_arr[6];
				var str = '<i class="red_warning">'+event_arr[6]+'</i>';
				$('#'+match_id+'_tr>td:eq(7)').append( str );
			}
	
			$('#'+match_id+'_away_ry').val(count_away_r+'-'+away_ry_arr[1]);
			event[0] = 2;
			is_change = 1;
		}
	}

	/*if( is_change==1 ){
		changeOneEvent( match_id,event_arr,event );
	}*/
	
	return is_change;
}


function changeState( match_id,event_arr  ){
	var str_td = '';
	
	switch(parseInt( event_arr[0]) ){
		case 0:
			str_td = '未'; break;
		case 1:
		  	addMatchIng( match_id );
			str_td = event_arr[13]+"'"; 
			break;
		case 2:
			str_td = '中';
			delMatchIng( match_id );  
			break;
		case 3:
			str_td = parseInt(event_arr[13])+"'";
			addMatchIng( match_id );
			break;
		case 4:
			str_td = 90+'+'; break;
		case -11:
			str_td = '待';break;
		case -12:
			str_td = '腰斩';break;
		case -13:
			str_td = '终端';break;
		case -14:
			str_td = '推迟';break;
		case -1:
			str_td = '完';
			 delMatchIng( match_id );
			break;
		case -10:
			str_td = '消';break;
		default:
			str_td = '完';
	}
	if( onmatch_str.indexOf(event_arr[1]+',')!=-1 )
	{
		$('#'+match_id+'_tr>td:eq(4)').addClass('onmatch');
	}
	$('#'+match_id+'_tr>td:eq(4)').text( str_td ).attr('is_over',event_arr[0]);
}


/*event 0=>主1/客2  1=>类型 进球1/红牌2 */
function changeOneEvent( match_id,event_arr,event_t ){
	//--用球员名称做事件
	return true;
	
	if( match_id.length<=0 ){ return 2; }
	var class_val = '';
	var class_type1 = class_type2 = i_str1= i_str2= '';
	
	if( event_t[1]==1 )
	{
		class_val = 'jq_icon';
	}
	else if( event_t[1]==2 )
	{
		class_val = 'wr_icon';
	}
	else if( event_t[1]==3  )
	{
		class_val = 'wy_icon';
	}

	var var_str = 'class_type'+event_t[0]+'=class_val';
	
	eval( var_str );

	if( class_type1.length>0 ){
		i_str1 = '<i class="'+class_type1+'"></i>';
	}
	if( class_type2.length>0  ){
		i_str2 = '<i class="'+class_type2+'"></i>';
	}

	var tr_str ='<tr class="nnnbg"><td class="home">'+i_str1+'<span></span></td><td>'+event_arr[13]+'\'</td><td class="visitor">'+i_str2+'<span></span></td></tr>';
	
	$('#'+match_id+'_event_new').append( tr_str );
}


function closeMatch(){
	$('#match_select_a').find(".hide_frame").hide();
	return true;
}


/*将数据拆开处理*/
function spileEventNew( data ){
	//-'0^0^0^^^0^0^11-15 16:30^2013, 10  , 15 ,16 , 30 , 00^^1^0^0',
	var tr_str = '';
	var data_arr = data.split( '^' );
	var data_int_key = [1,2,3,4,5,6,10,11,12,13,14,15,16]; 
	
	//--需要转换为int类型的数据
	var count_int_key = data_int_key.length;
	for( var i=0;i<count_int_key;i++ ){
		if(data_arr[i].length<=0){
			data_arr[0];
		}else{
			data_arr[i] = parseInt(data_arr[i]);
		}
	}
	return data_arr;
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
	$('#list_tbody>tr:gt(0)').each(function(){
	
		is_ding 	= $(this).attr( 'is_ding' );
		date_tr 	= $(this).children('td:eq(0)').children('label').children('input[name="match_date_h"]').val();
		league_tr 	= $(this).children('td:eq(1)').children('input[name="league_id_h"]').val();
		over_tr 	= $(this).children('td:eq(4)').attr('is_over');
		
		if( (is_over=='1' && over_tr!='-1' ) || is_ding =='1' || league_str.indexOf(league_tr)==-1 ){
			$(this).hide();
		}else{
			$(this).show();
			$(this).children( 'td:eq(0)' ).children('label').children('input[type="checkbox"]').attr('checked',true);
		}		
	});
	return true;
}


//--撤销置顶
function unzhiding( match_id ,num){
    //$('#'+match_id+'_tr').attr('is_ding','2').show();
	var str_list = $('#'+match_id+'_tr').html();
	$('#'+match_id+'_tr').remove();
	
	str_list = '<tr class="color1" num="'+num+'" match_id="'+match_id+'" id="'+match_id+'_tr" >'+str_list+'</tr>';
	var num_list = 0;
	$('#list_tbody>tr').each(function(){
		num_list = $(this).attr('num');
		if( num_list>num ){
			$(this).before(str_list);
			return false;
		}
	});
	var a_str = '<a href="javascript:void(0);" title="置顶" onclick="zhiding('+match_id+','+num+')" class="zhiding"></a>';
	$('#'+match_id+'_tr td:last').html( a_str );
	
	if($('#zhiding_tbody>tr').length<=0){
		$('#zhiding_tr_match').hide();
	}
	
	return;
}


//--置顶 /* tr is_ding 1/2 */
function zhiding( match_id ,num){
	$('#zhiding_tr_match').show();
    var str_list = $('#'+match_id+'_tr').html();
	$('#'+match_id+'_tr').remove();
    str_list = '<tr class="nobg" num="'+num+'" match_id="'+match_id+'" id="'+match_id+'_tr" >'+str_list+'</tr>';
    $('#zhiding_tbody').append(str_list ); 
	var a_str = '<a href="javascript:void(0);" title="撤销置顶" onclick="unzhiding('+match_id+','+num+')" class="qxzhiding"></a>';
	$('#'+match_id+'_tr td:last').html( a_str );
	fudong();
}


function changePR( num ){
	h_num = 1;
	if( num==1 ){
    	h_num = 0;
	}
	$('#list_tbody>tr:gt(0)').each(function(){

  		$(this).children( 'td:eq(8)' ).children('i:eq('+num+')').show();
   		$(this).children( 'td:eq(8)' ).children('i:eq('+h_num+')').hide();
    
	});
	return;	
}


function closeNotice(){
	$('#ga_notice_div').hide();
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


function shLeague(){
	$('#league_div_h').toggle();
}


function showNotice( match_id,event_time,type ){
    
	if( match_id.length<=0||event_time<=0||type.length<=0  ){ return ;  }
    var league_name = $('#'+match_id+'_tr>td:eq(1) input[name="league_id_h"]').val();
    var home_name =  $('#'+match_id+'_tr>td:eq(5) span:eq(0)').text();
    var away_name = $('#'+match_id+'_tr>td:eq(7) span:eq(0)').text();
	var home_goals = $( '#'+match_id+'_home_goals' ).text();
	var away_goals = $( '#'+match_id+'_away_goals' ).text();
	
	if( league_name==undefined ||home_name==undefined ||away_name==undefined){ return; }
	
	closeNotice();
    
	$('#notice_league_name').text( league_name );
    $('#notice_home').text( home_name );
    $('#notice_away').text( away_name );
    $('#notice_bifen').text( home_goals+'-'+away_goals );
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


function allData(){
	var show_five = $('#show_five').attr('checked',false);
	$('#show_over').attr('checked',false);
	showFive();
	return true;
}


function hideTr( match_id ){
	$('#'+match_id+'_tr').hide();
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


function eventEveryTime(  ){
    var int_time = 0;
	
    for( var k in match_ing)
    {
        int_time =parseInt($('#'+match_ing[k]+'_tr>td:eq(4)').text());
		
		if( isNaN( int_time )){ int_time=0; }
		
        int_time++;
        $('#'+match_ing[k]+'_tr>td:eq(4)').html( int_time+"'" );  
    }
}


function leagueChecked(){
	$('input[name="league_list"]').attr( 'checked',true );
	return ;
}


function ajGetMatchEvent( matchid_str  ){	
	if(matchid_str.length<=0) return false;
	
	$.ajax({
		url: '/Match/AjaxMatchEvent.php',
		type: 'POST',
		dataType: 'json',
		data: 'match_ids=' + matchid_str,
		success: function (data) {
			if( data=='1'  ){return false; }
			for( var key_data in data  ){
				data_son = data[key_data];
				
				$( '#'+key_data+'_event_new' ).html('');
				for ( var k_son in data_son )
				{
					if( data_son[k_son]==undefined 
						|| data_son[k_son][1]==undefined 
						|| data_son[k_son][1].length<=0 
					){ continue; }
					
					if( k_son!='tong' )
					{	//addEvent
						appendEvent( data_son[k_son] );
					}
					else
					{	//update Last Data
						appendEventTong( key_data,data_son[k_son] );
					}
				}
			}
			//--表示已经处理完断网
			isOutLine=2;	
		}
	});
}


function makeTableHead(){
	var col_2 = '';
	var col_3 = '';
	var td_caiguo = '';
	var col_4 = '';
	if( LotteryType == 'jingcaizuqiu' || LotteryType=='bjdanchang' )
	{
		col_2 = '8%';
		col_4 = '4%';
	}
	else
	{
		col_2 = '6%';
		col_3 = '<col width="3%" />';
		td_caiguo = '<td>彩果</td>';
		col_4 = '3%';
	}
	var html_str = '<colgroup> <col width="8%"/><col width="'+col_2+'%" /> <col width="7%"/><col width="8%" /> <col width="4%" /><col width="16%" /><col width="5%"/><col width="16%" /><col width="10%" /><col width="6%" /> '+col_3+'<col width="4%" /> <col width='+col_4+'/>  <col width="4%" /></colgroup> <tr><td>序号</td><td>赛事</td><td>轮次/阶段</td><td>时间</td> <td>状态</td><td>主队</td><td>比分</td><td>客队</td><td>盘口<!--<select id="panRang" onchange="changePR(this.value)" ><option value="1">让球</option><option selected value="0">盘口</option></select>--></td><td>半场/天气</td>'+td_caiguo+'<td>让球</td><td>语音</td> <td>置顶</td></tr> ';
	$('#headt_title').html(html_str);
	
	
	var body_str = ' <col width="8%"/><col width="'+col_2+'%" /> <col width="7%"/><col width="8%" /> <col width="4%" /><col width="16%" /><col width="5%"/><col width="16%" /><col width="10%" /><col width="6%" /> '+col_3+'<col width="4%" /> <col width='+col_4+'/>  <col width="4%" />';
	
	$('#body_table_colgroup').html(body_str);
	return true;
}



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
		var html_str = '<li class="score_submenu last '+class_1+'"><a href="?type=zucai14" title="胜负彩">胜负彩</a></li><li class="score_submenu '+class_2+'"><a href="?type=zucaijingqiu" title="四场进球">四场进球</a></li><li class="score_submenu '+class_3+'"><a href="?type=zucaibanquan" title="六场半全场">六场半全场</a></li>';
		
		$('#di_pre').before(html_str);
	}else{
		var title_str = '<li class="iframe"  id="match_select_a" style="width:75px;"><a onclick="shLeague();"  href="javascript:void(0)">联赛选择</a><em onclick="shLeague()" ></em><div id="league_div_h"  class="hide_frame" style="width:400px;"> <table cellpadding="0" cellspacing="0" class="saishi_table" width="100%"> <colgroup> <col width="20%"/><col width="20%"/><col width="20%"/><col width="20%"/><col width="20%"/></colgroup> <tbody name="showTan" id="league_list_tbody" > </tbody><td colspan="5"><a href="javascript:void(0)" onclick="leagueChecked();"  title="全选" class="saishi_btn">全选</a><a href="javascript:void(0)" onclick="leagueFan();"  title="反选" class="saishi_btn">反选</a><a href="javascript:void(0)" title="筛选" onclick="checkMatch();" class="saishi_btn">筛选</a><a href="javascript:void(0);" title="关闭" onclick="closeMatch();" class="saishi_btn">关闭</a></td></tr></table> </div></li><li> <label class="outinput"> <input type="checkbox" id="show_over" onclick="checkMatch();" value="1" name="show_over" >&nbsp;显示完场比赛</label></li><li> <label class="outinput"> <input type="checkbox" onclick="showFive();checkMatch();" name="show_five" id="show_five" >&nbsp;只显示五大联赛 </label></li><li><a href="javascript:void(0)" title="恢复"  onclick="allData();checkMatch();" class="return_btn">恢复</a></li>';
		$('#title_ul').append(title_str);
	}
	return;
}



function MainTable(date_select,type){
	
	$.ajax({
		url: '/Match/AjaxMatchLiveApi.php',
		type: 'POST',
		dataType: 'json',
		async: false,
		data: 'date='+date_select+'&type='+type,
		success: function (data) {
			if( data!=null ){
				DateArr  = data['date'];
				TodayDate = data['now'];
				LotteryType = data['type'];
				var old_str = makeOldUrl();
				var title_str = makeTitleUl();
				var head_str = makeTableHead();
				var table_str = makeTable( data['data'] );
				$('#list_tbody').html(table_str);
				
				//--预处理
				onloadF();
			}else{
				alert('No Data');
			}
		}
	});
	closeDiv();
}


function makeOldUrl(){
	var url_str = 'http://live.cpdyj.com';
	switch( LotteryType ){
		case 'jingcaizuqiu':
			url_str += '/jingcai';break;
		case 'bjdanchange':
			url_str += '/danchang';break;
		case 'zucaibanquan':
			url_str +='/zucai/bq';break;
		case 'zucaijingqiu':
			url_str += '/zucai/jq';break;
		case 'zucai14':
			url_str += '/zucai';break;	
	}
	var a_str = '<a href="'+url_str+'">切换到旧版</a>';
	$('#old_url').html( a_str );
}


function GetRequest() {
   var url = location.search; //获取url中"?"符后的字串
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


function onloadSong(){
	$("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			$(this).jPlayer("setMedia", {mp3:"./swf/ga.mp3"});
		},
		swfPath: "./swf",
		supplied: "mp3"
	});
}




function makeTable( matchList ){
	
	var table_str = ' <tr id="zhiding_tr_match" class="zhiding"> <td colspan="13"><span>置顶赛事</span>&nbsp;&nbsp;[<a href="javascript:void(0);" onclick="unzhidingAll()" >撤销置顶</a>]</td></tr>';
	var match_state = '1,3,4,';
	var match_state_weather = ' 2,3,4,-1,';
	var match_state_bifen = '0,-14,';
	
	for( var list in matchList ){
		one_match = matchList[list];
		match_id  = one_match['MatchID'];
		
		//--tr start
		table_str += "<tr is_ding = '2' num = "+list+"   match_id='"+match_id+"' id='"+match_id+"_tr' >";
		
		//--期号
		table_str += '<td><label><input type="checkbox" name="match_tr_checkbox" onclick="hideTr('+match_id+')" checked="checked">&nbsp;'+one_match['number']+'<input type="hidden" name="match_date_h" value="'+one_match['MatchDate']+'"><input type="hidden" name="match_team_id_h" value="'+one_match['HomeID']+'-'+one_match['AwayID']+'"></label></td>';
		
		//--联赛名称
		table_str += '<td class="team_name" style="background-color:'+one_match['Color']+'">'+one_match['LeagueName']+'<input type="hidden" name="league_id_h"  value="'+one_match['LeagueName']+'"></td>';
		
		//--分组
		table_str += '<td>';
		if( one_match['GroupName']=='默认分组'||one_match['GroupName']=='联赛' ){
			table_str += '第'+one_match['TurnID']+'轮';
		}else{
			table_str += one_match['GroupName'];
		}
		table_str += '</td>';
		
		//--时间
		table_str +='<td>'+one_match['showTime']+'<input type="hidden" name="'+match_id+'_ji_time_h"  value="'+one_match['StartTimeH']+'"></td>';
		
		//--事件/时间
		table_str += '<td is_over='+one_match['MatchState'];
		if( onmatch_str.indexOf( one_match['MatchState']+',' )!=-1 ){
			table_str +=' class="onmatch" ';
		}
		table_str += ' >';
		if( match_state.indexOf(one_match['MatchState']+',')==-1 )
		{
			table_str += one_match['MatchStateName'];
		}
		else
		{
			table_str += one_match['TimeEvent'];
		}
		table_str += '</td>';
		
		//--红黄牌主队名称
		table_str += '<td class="home_team"><span>['+one_match['HomeRank']+']'+one_match['HomeName']+'</span>';
		table_str += '<input type="hidden" value="'+one_match['HomeRC']+'-'+one_match['HomeYC']+'" id="'+match_id+'_home_ry">';
		if (one_match.HomeRC>0){
			table_str += '<i class="red_warning">'+one_match['HomeRC']+'</i>';	
		}
		if (one_match.HomeYC>0){
			table_str += '<i class="yellow_warning">'+one_match['HomeYC']+'</i>';	
		}
		table_str += '</td>';
		
		//-- 比分
		table_str += '<td class="match_score"><div class="showscore_area">';
		
		table_str +='<a href="#1" class="red showscore" ';
		if( onmatch_color_str.indexOf( one_match['MatchState']+',')!=-1 )
		{
			table_str += ' style="color:blue;" ';
		}
		table_str+='><h3>';

		if ( match_state_bifen.indexOf( one_match['MatchState']+',')==-1 )
		{	
			table_str +='<em id="'+match_id+'_home_goals" >'+one_match['HomeGoals']+'</em>-<em id="'+match_id+'_away_goals" >'+one_match['AwayGoals']+'</em>';
		}
		else
		{	
			table_str +='<em id="'+match_id+'_home_goals" ></em>-<em id="'+match_id+'_away_goals" ></em>';
		}
		table_str +='</h3></a>';
		table_str +='<div class="match_log" style="display:none;"><table  cellpadding="0" cellspacing="0" width="100%"><colgroup><col width="30%" /><col width="10%" /><col width="30%" /></colgroup><tbody id="'+match_id+'_event_new" ></tbody><tfoot><tr><td  colspan="3" ><table  cellpadding="0" cellspacing="0" width="100%"  ><colgroup> <col width="20%" /> <col width="60%" /> <col width="20%" /> </colgroup><tbody id="'+match_id+'_state_new" ></tbody></table></td></tr></tfoot></table></div></div></td>';
		
		//--客队信息
		table_str +='<td class="visitor_team"><span>';
		table_str +=''+one_match['AwayName']+'['+one_match['AwayRank']+']</span><input type="hidden" value="'+one_match['AwayRC']+'-'+one_match['AwayYC']+'" id="'+match_id+'_away_ry">';
		if (parseInt(one_match['AwayRC'])>0){
			table_str +='<i class="red_warning">'+one_match['AwayRC']+'</i>';
		}
		if (parseInt(one_match['AwayYC'])>0){
			table_str +='<i class="yellow_warning">'+one_match['AwayYC']+'</i>';
		}
		table_str += '</td>';
		
		//--让球/盘口
		table_str +='<td><i>'+one_match['HandicapName']+'</i><i style="display:none"  ><strong>'+one_match['Rangqiu']+'</strong></i></td>';
		
		//--半场比分/天气
		table_str +='<td class="weather_or_halfscore" id="'+match_id+'_half_td" >';
		if( match_state_weather.indexOf( one_match['MatchState']+','  )==-1 ){
			if( one_match['Weather'].length>0 ){
				table_str +='<i class="'+one_match['weatherClass']+'" title="'+one_match['Weather']+'"></i>';
			}
		}else{
			table_str += '<em style="color:#666"  id="'+match_id+'_half_home_goals" >'+one_match['HalfHomeGoals']+'-</em><em style="color:#666"  id="'+match_id+'_half_away_goals" >'+one_match['HalfAwayGoals']+'</em>'; 
		}
		table_str +='</td>';
		
		//--彩果
		if (one_match['LotteryType']!="jingcaizuqiu"&&one_match['LotteryType']!='bjdanchang' ){
			table_str +='<td style="color:#f60" >';
			if (one_match.MatchState==-1){
				table_str += one_match['MatchRes'];
			}
			table_str +='</td>';
		}
		
		//--让球
		table_str +='<td><i ><strong>'+one_match['Rangqiu']+'</strong></i></td>';
		
		
		//--声音
		table_str +='<td><label><input checked  id="'+match_id+'_song_check" value="1"  type="checkbox"></label></td>';
		
		//--置顶
		table_str +='<td><a href="javascript:void(0);" title="点击置顶" onclick="zhiding('+match_id+','+list+')" class="zhiding"></a></td>';
		
		//--end
		table_str +='</tr>';
	}
	return table_str;
}




function fudong(){
	$('.showscore').mousemove(function(){
		$(this).parent().addClass("z_index100").find(".match_log").show();
	});
	$('.showscore').mouseout(function(){
		$(this).parent().removeClass("z_index100").find('.match_log').hide();
	});
}



function updateLeagueList(){
	var ss= new Array;
	var league_str = '';
	var tr_str = '<tr>';
	var i = 1;
	$( '#list_tbody>tr:gt(0)' ).each(function(){
		
		now_league = $(this).children('td:eq(1)').children('input[name="league_id_h"]').val();
		
		if( league_str.indexOf(now_league)==-1 )
		{        
			league_str +=now_league+',';		
			tr_str +='<td><label>';
			tr_str +='<input type="checkbox"  name="league_list" value="'+now_league+'" checked="checked" value="让球"> &nbsp;'+now_league+'</label></td>';
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


function addMatchIng( match_id ){
	if( match_id.length<=0 ){ return false; }
	
	var match_ing_str = match_ing.join(',');
	
	if( match_ing_str.indexOf( match_id )==-1 ){ 
		match_ing.push( match_id );
	}
	return true;
}


function unzhidingAll(){
	var match_id;
	$('#zhiding_tbody tr').each(function(){
		match_id = $(this).attr('match_id');
		if( match_id !=undefined ){
			unzhiding( match_id );
		}
	});
	$('#zhiding_tr_match').hide();
}


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
          

/******/

function startChangeTechState(){
	
	$.getScript('http://221.228.229.211/live/livestate.js', function() {
		eval(stateList);
		makeTeachState( stateList );
	});
}

function getMatchTeachState( MatchIDs ){
	if( MatchIDs.length<=0 ){ return false;}
	$.ajax({
		url: '/Match/AjaxMatchLiveTeachState.php',
		type: 'POST',
		dataType: 'json',
		async: false,
		data: 'MatchIDs='+MatchIDs,
		success: function (data) {
			if( data!=null ||data=='2'  ){
				makeTeachState( data );
			}
		}
	});
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
		    	
			state_str += '<tr>';
			state_str += '<td>'+state_arr[0]+'</td>';
			state_str += '<td>'+CnName+'</td>';
			state_str += '<td>'+state_arr[1]+'</td>';
			state_str += '</tr>';
		}
		$('#'+k+'_state_new').html( state_str );
	}
}


/*--add--*/




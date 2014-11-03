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


/*MakeHTML Title*/
function makeTitleUl(){
	
	var class_1 = class_2 = class_3 = '';	
	var lottery_type1 = ',bjdanchang,jingcaizuqiu,jingcailanqiu,';
	if( lottery_type1.indexOf( ','+LotteryType+',' )==-1){
	
		if( LotteryType=='zucai14' ){
			class_1 = 'on';
		}
		if(  LotteryType=='zucaijingqiu' ){
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
			
			if( LotteryType!='jingcailanqiu' )
			{
				title_str += '<tbody><tr><td colspan="2"><input id="show_over" type="checkbox" name="show_over" value="1" onclick="checkMatch();">&nbsp;隐藏完场比赛</td><td colspan="3" ><input id="show_five" type="checkbox" name="show_five" onclick="showFive();checkMatch();">&nbsp;五大联赛</td></tr></tbody>';
			}
			title_str +='<tfoot><tr><td ><input type="button" onclick="leagueChecked();checkMatch();"  value="全选" class="screen_btn"></td><td><input type="button" onclick="leagueFan();checkMatch();" value="反选" class="screen_btn"></td><td></td><td></td><td></td></tr></tfoot>';
			
			title_str +='</table> </div></li>';
			title_str +='<li><input type="button" onclick="allData();" value="恢复" class="recovery_btn"></li>';
			$('#di_pre').after(title_str);
		}
	}
	return;
}


function jumpPage(jump_url){
	window.location.href=jump_url; 
}


/*--弹框遮罩层--*/
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
/*--弹框遮罩层END--*/


function updateQiHao(){
	var date_str = date_class = '';
	
	for( var date_k in DateArr ){
		date_class = '';
		
		if( date_k 	== TodayDate ){ date_class = 'score_today'; }
		if( LotteryType!='jingcailanqiu' ){
			jump_url 	= '?type='+LotteryType+'&date='+date_k;
		}else{
			jump_url 	= 'baskball.html?type='+LotteryType+'&date='+date_k;
		}
		
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


function updateLeagueList(){
	var ss= new Array;
	var league_str = '';
	var tr_str = '<tr>';
	var i = 1;
	var match_id_num;
	$( '#list_tbody>tr' ).each(function(){
		match_id_num = parseInt($(this).attr('match_id'));
		if( isNaN( match_id_num ) ){ return true; }
		
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
		match_id 	= $(this).attr('match_id');
		
		if( match_id!=undefined && match_id.length>0 )
		{ 
			is_ding 	= $(this).attr('is_ding');
			date_tr 	= $(this).children('td:eq(0)').children('label').children('input[name="match_date_h"]').val();
			league_tr 	= $(this).children('td:eq(1)').text();
			over_tr 	= $(this).children('td:eq(4)').attr('is_over');
			
			if( (is_over=='1' && over_tr=='-1' ) || is_ding =='1' || league_str.indexOf(league_tr)==-1 ){
				hideMatchTr( match_id );
			}else{
				
				showMatchTr( match_id );
			}
		}
	});
	return true;
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


function getAccessNotice( match_id ){
	
	addNoticeMatch(match_id);
	//if( notify.permissionLevel()!='default' ){ return true; }
	//notify.requestPermission();
	return true;
}


function addNoticeMatch( match_id ){
	
	var match_notice_str = NoticeMatch.join(',');	
	if( match_notice_str.indexOf( match_id )==-1 ){ 
		NoticeMatch.push( match_id );
	}
	return ;
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


function songUnSong(){
	$('#song_a').toggle();
	$('#unsong_a').toggle();
}


/*初始化声音*/
function onSongA(){
	$('#song_a').show();
	$('#unsong_a').hide();
	return true;
}


/*打开声音*/
function showSong(){
	$("#jquery_jplayer_1").jPlayer('play');
	return true;
}

/*简繁体切换*/
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


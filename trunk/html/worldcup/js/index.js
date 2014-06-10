(function (){
    //转换为整数输入框
    Class.extend('createIntInput', function (input, fn, max){
        this.get(input).keyup(check).blur(check).focus(function (){
            setTimeout((function() {
                this.select()
            }).proxy(this),10);
        });
        function check(e, Y){
            var val = Math.max(1, Math.min(parseInt(this.value||0, 10)||0, max || Number.MAX_VALUE));
            if (this.value == ''){
                if(e.type != 'keyup') {
                    this.value = val
                }                
            }else if(val != this.value){
                this.value = val
            }
            if (this.value != this.preValue) {
                 fn.call(this, e, Y);
                 this.preValue = this.value
            }
        }
    });    
})();

Y.C('max-beishu', 100000);

/*
选中的列表
*/
Class('VSChoose', {

    index: function (){
        var that = this;
        this.tmpl = Y.one('#list_tmpl');
        this.box = Y.one('#choose_list');
        this.form = Y.one('#project_form');
        Y.addStyle('.filter-hit td{background-color:#FFEAD7;}');
        Y.addStyle('.bd_jcgyj .dc_table .team_outed .b{color:#B7B7B7;}');

        Y.get('#buydg').click(function (){
            that.readyBuy();
            return false;
        });
        this.bsInput = Y.get('#buybs');
        this.createIntInput(this.bsInput, function (){
            that.bsChange(this.value);
        }, Y.C('max-beishu'));
        Y.onMsg('msg-choose-change', function (isAdd, dataStr){
            if (isAdd) {
                that.addItem(dataStr);
            }else{
                that.removeItem(dataStr);
            }
        });
        //点击chk删除一个项目
        Y.get('#choose_list').live('input:checkbox', 'click', function (){
             this.checked = true;
             var data = this.value.split(',');
             Y.get(this).parent('tr').empty(true);            
             that.update();
             Y.postMsg('msg-choose-del', data[0]);
        });
    },
    //按消息添加一个项目
    addItem: function (dataStr){
        var data = dataStr.split(',');
        var id = 'item_' + data[0];
        if (Y.get('#' + id).size() == 0) {
            var item = this.tmpl.cloneNode(true);//tr
            item.style.display = '';
            item.id = id;
            item.setAttribute('sort-id', data[0]);
            Y.get(item).find('input').val(dataStr);
            var matchno=((data[0]*1<10)?("0"+data[0]):data[0]);
            Y.get(item).find('span').html(matchno);
            Y.get(item).find('td').eq(1).html(data[1]);
            Y.get(item).find('td').eq(2).html(data[2]);
            this.box.appendChild(item); 
            this.update();
            this.sort();
        }
    },
    //按消息删除一个项目
    removeItem: function (dataStr){
        var data = dataStr.split(',');
        var id = 'item_' + data[0];
        if (Y.get('#' + id).size() > 0) {
            Y.get('#' + id).empty(true);
            this.update();
        }
    },
    //排序表格
    sort: function (){
        var trs = Y.get('#choose_list tr').nodes;
        trs.sort(function (a, b){
            var c = a.getAttribute('sort-id')*1;
            var d = b.getAttribute('sort-id')*1;
            return c> d ? 1 : -1;
        });
        trs.each(function (tr){
            tr.parentNode.appendChild(tr);
        });
    },
    //倍数变化时
    bsChange: function (){
        this.update();
    },
    getData: function (){
        var chks = Y.get('input:checkbox', this.box);
        var zs = chks.size();
        var bs = this.bsInput.val();
        var prices = [];
        var codes = [];
        var ratelist = [];
        chks.each(function (chk){
            var data = chk.value.split(',');
            codes.push(data[0]);
            ratelist.push(data[0] + '#' + data[2]);
            prices.push(parseFloat(data[2]) * 2);//这个固赔是1元的
        });
        var minPrices = 0;
        var maxPrices = 0;
        if (prices.length) {
            minPrices = Math.min.apply(Math, prices) * bs;
            maxPrices = Math.max.apply(Math, prices) * bs;            
        }
        return {
        	tnum:zs ,
        	bnum: zs,
        	muli: bs,
            codes: codes.join(','),
            //ratelist: ratelist.join(','),
            money: zs * bs * 2,
            price: maxPrices
//            rangestr: minPrices + '~' + maxPrices
        };
    },
    update: function (){
        var data = this.getData();
        Y.get('#sel_num').html(data.tnum);
        Y.get('#sel_zs').html(data.bnum);
        Y.get('#sel_money').html(data.money.rmb());
        Y.get('#sel_yc').html(data.price.rmb());
    },
    //同步值到表单
    copyToForm: function (){
        var data = this.getData();
        var input;
        for(var k in data){
            input = Y.one('#'+k);
            if(k=="codes"){
            	input.value ="GJ|14001="+data[k].replaceAll(",","/");
            	continue;
            }
            if (input) {
                input.value = data[k];
            }
        }
        return data;
    },
    //检查是否允许购买
    checkBuyState: function (fn){
        fn.call(this);
    },
     showStopInfo: function (){
         this.popStopDlg();//提示层
         this.hideHmlTitle();             
     },
     //隐藏号码篮
     hideHmlTitle: function (){
        var isLogin = this.one('#top_user_info').style.display != 'none';
        if(!isLogin){
            //隐藏提示层上有关号码篮的内容
            this.get('#gotohmlurl').hide();
        }else{
            this.get('#gotohmlurl').show();
            //如果登陆则存到号码篮
            this.postMsg('msg_close_addmoneydlg', true);
        };
     },
     popStopDlg: function (){
         if (this.one('#stopsalediv')) {
             if (!this.stopDlg) {
                this.stopDlg = this.lib.MaskLay('#stopsalediv1');
                this.stopDlg.addClose('#stopsalediv_c1');
                //this.get('#info_dlg div.tips_title').drag('#info_dlg');
             }
             this.stopDlg.pop();                 
         }else{
             this.alert('该彩种已停售！');
         }
     },
    //跳到确认页
    readyBuy: function (){
        var data = this.copyToForm();
        var that = this;
        var msg = Y.lib.VSList.iszh ? '冠亚军组合' : '球队';
        if (data.muli > Y.C('max-beishu')) {
            return Y.alert('您好， 单个方案最多只能购买' + Y.C('max-beishu') + '倍！');
        }
        if (data.tnum == 0) {
            Y.alert('您好， 您最少必须选择一个'+msg+'才能投注!');
        }else{
        	Y.postMsg('msg_login', function() {	
        		Y.confirm('您好，预售期间的竞彩赔率仅供参考，实际奖金以最终出票时刻的奖金为准。', function (){
                    that.doBuy(); 
                });  
    		});         
        }
        //log(this.qForm('#project_form'));
    },
    isBuyDisabled: function (fn){
        Y.ajax({
            url:'getsysset.php',
            end:function (data, i){
                var open, d;
                if (d = Y.dejson(data.text)) {
                    open = d.issale == '1';
                    if (!open) {
                        Y.alert(d.msg);
                    }else{
                        fn();
                    }
                }else{
                    Y.alert('您好，冠军、冠亚军玩法暂停销售，重新开售时间敬请留意<br/>网站公告！');
                }
            }
        });
    },
    doBuy: function (){
     	var data = "fid=mcast&gid=" + $("#gid").val() + "&"+"pid=" + $("#pid").val(); 
     	data += "&play="+$("#play").val();
     	data += "&codes="+$("#codes").val();
     	data += "&muli="+$("#muli").val();
     	data += "&fflag="+$("#fflag").val();	
     	data += "&type="+$("#type").val();	
     	data += "&name="+$("#name").val();	
     	data += "&desc="+$("#desc").val();	
     	data += "&money="+$("#money").val();	
     	data += "&tnum="+$("#tnum").val();	
     	data += "&bnum="+$("#bnum").val();	
     	data += "&pnum="+$("#pnum").val();	
     	data += "&oflag="+$("#oflag").val();	
     	data += "&wrate="+$("#wrate").val();	
     	data += "&comeFrom="+$("#comeFrom").val();	
     	data += "&source="+$("#source").val();
     	//alert(data);
     	Y.ajax({
     		url : "/phpt/t.phpx",
     		type : "POST",
     		dataType : "json",
     		data : data,
     		end:function(d){
     			var obj= eval("(" + d.text + ")");
     			var code = obj.Resp.code;
     	   		var desc = obj.Resp.desc;
     	   		//code为0代表成功，为19999代表余额不足
     	   		if(code==0){
     	   		$("#yclass_confirm_ok").html("立即查看");
     	   		$("#yclass_confirm_no").html("继续投注");
     	   			Y.confirm("恭喜您，投注成功！",function(){window.location.href='../account/orderlist.html';},'','',function(){window.location.href='../worldcup/index.html';});
     	   		}if(code==19999){
     	   		$("#yclass_confirm_ok").html("立即充值");
     	   		 Y.confirm(desc,function(){window.location.href='../account/chongzhi.html';});
     	   		}   	   		
     		},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
     	});
    }
});

/*
对阵
*/
Class('VSList', {
    index: function (){
        var chks = $('a[mark=btn]');
        var hit = 'th_on';
        var stop = 'team_outed';
        var that = this;
        var group = Y.get('#vs_filter');
        
        if (group.size()) {
            Y.lib.VSList.iszh = true;
            this.setfilter(group.one(), group.find('input:checkbox'));
        }
        chks.click(function (){
            
            if($(this).hasClass("hui")){
            	return;
            }else{
            	 that.select(this);
            }
        });
//        Y.get('#vs_box tr').each(function (tr){
//            if (/checkbox/i.test(tr.innerHTML)) {
//                Y.get(tr).hover(function (){
//                    if (this.className.indexOf(stop) == -1) {
//                        Y.get(this).addClass(hit);
//                    }                    
//                }, function (){
//                    Y.get(this).removeClass(hit);
//                });
//            }
//        });
        Y.onMsg('msg-choose-del', function (id){
            that.unselect(id);
        });
       
        setTimeout(function() {
           chks.each(function (chk){
               chk.checked = false;//复位
           });
           that.backModeify(chks);//返回修改
           that.fromZx(chks);//从其它数据源来的数据
        }, 100);
        this.chks = chks;
    },
    select: function (chk){
        this.updateItemView(chk);
        
        Y.postMsg('msg-choose-change', $(chk).hasClass("cur"), $(chk).attr("val"));
    },
    updateItemView: function (chk){
        var td_hit = 'cur';
       
        if (!$(chk).attr("id")) {
        	$(chk).attr("id", 'vschk_' +$(chk).attr("val").split(',')[0])
        }        
        $(chk).toggleClass("cur");
    },
    unselect: function (id){
        var chk = Y.one('#vschk_' + id);
        if (chk) {
            chk.checked = false;
            this.updateItemView(chk);
        }        
    },
    //设置过滤事件
    setfilter: function (box, chks){
        var hide = Y.get('#hideMore_btn');
        var show = Y.get('#showMore_btn');
        var more = Y.get('#more_group');
        hide.click(function (){
            show.show();
            Y.get(this).hide();
            more.hide();
            box.style.height = '50px';
        });
        show.click(function (){
            hide.show();
            Y.get(this).hide();
            more.show();
            box.style.height = '80px';
        });
        var css = "selected";
        var that = this;
        chks.click(function (){
            var lab = Y.get(this.parentNode);
            if (this.checked) {
                lab.addClass(css);
            }else{
                lab.removeClass(css);
            }
            that.filter(getGroups());
        });
        function getGroups(){
            var g = [];
            chks.each(function (chk){
                if (chk.checked) {
                    g.push(chk.value);
                }
            });
            return g;
        }
    },
    //禁止非组合选择
    filter: function (names){
        var that = this;
        var css = 'team_outed';
        var hasFilter = names.length > 0;
        var len = 0;
        this.chks.each(function (chk){
            var tr = Y.get(chk).parent('tr');
            tr.removeClass('filter-hit');
            if (that.inGroups(names, chk.value)) {
                tr.removeClass(css);
                tr.setStyle('opacity', 1);
                if (hasFilter) {
                    tr.addClass('filter-hit');
                }
                chk.disabled = false;
                len++;
            }else{
                tr.addClass(css);
                tr.setStyle('opacity', 0.7);
                if (chk.checked) {
                    chk.checked = false;
                    that.select(chk);           
                }
                chk.disabled = true;
            }
        });
        var fc = Y.get('#find_count');
        if (names.length) {
           if (len) {
               fc.setStyle('color', '#008000').html('找到个<b>'+len+'</b>符合条件的组合');
           }else{
               fc.setStyle('color', 'red').html('<b>没有符合条件的组合！</b>');
           }
        }else{
            fc.html('');
        }
       
    },
    //值必须包含所有names元素
    inGroups: function (names, val){
        if (names.length == 0) {
            return true;
        }
        var a, b;
        var gy = val.split(',');
        if (gy.length > 1) {
            gy = gy[1].match(/(\S+)\s*\-+\s*(\S+)/);
            if (gy) {
                a = gy[1];
                b = gy[2];
                if (names.length == 1) {//只有一场时，只要符合一场就可以了
                    return names[0] == a || names[0] == b;
                }else{
                    return names.indexOf(a) > -1 && names.indexOf(b) > -1;
                }                
            }
        }
        return false;
    },
    //返回修改
    backModeify: function (chks){
        var data = Y.dejson(Y.cookie('gyj_back_edit'));
        var that = this;
        if (data) {
            var codes = data.codes.split(',');
            var bs = data.muli;
            var that = this;
            Y.get('#buybs').val(Y.getInt(bs, 1));
            chks.each(function (chk){
                var id = chk.value.split(',');
                if (codes.indexOf(id[0]) > -1) {
                    chk.checked = true;
                    that.select(chk);
                }
            });
            Y.cookie('gyj_back_edit', '{}', {timeout:-1})
        }
    },
    fromZx: function(chks){
    	var data = Y.dejson(Y.get('#codes').val());
	    if(!data)
	    	return false;
        var that = this;
        if (data) {
            var codes = data.codes.split(',');
            var bs = data.muli;
            var that = this;
            Y.get('#buybs').val(Y.getInt(bs, 1));
            chks.each(function (chk){
                var id = chk.value.split(',');
                if (codes.indexOf(id[0]) > -1) {
                    chk.checked = true;
                    that.select(chk);
                }
            });
        }
    }
});

/*
倒计时
*/
/*Class('CountDownM', {
    ready: true,
    index: function (){
        var serverTime = this.getServerTime();
        if (serverTime) {
            this.addClock(serverTime);
        }
    },
    getServerTime: function (){
        var text = Y.get('#responseJson');
        var config = Y.dejson(text.val() || text.html());
        if (config) {
            return config.serverTime;
        }
        return false;
    },
    addClock: function (serverTime){//添加时钟
        var prevSet = this.get('#prevbuytime').val();
        //prevSet = '2012-06-05 02:30,2012-06-06 09:00';
        Y.C('isPrevBuyTimeDiff', false);
        if (serverTime) {
            prevSet = prevSet.replace(/-/g, '/').split(',');
            var elTime = this.get('#sysTimeDisplay'),//系统时钟
                prevBox = this.get('#prev_buy_info'),//预售面板
                prevCD = this.get('#prevbuy_countdown'),//预售倒计时
                prevStart1 = new Date(prevSet[0]),
                prevEnd1 = new Date(prevSet[1]); //预售
            if (elTime.size() && prevStart1 && prevEnd1) {
                var date = this.getDate(serverTime);//当前时间
                setInterval(function() {
                    date.setSeconds(date.getSeconds() + 1);
                    if (date > prevStart1 && date < prevEnd1) {
                        //预售
                        elTime.hide();
                        prevBox.show();
                        var end = prevEnd1;
                        var diff = date.diff(end).slice(1), tmp = '{1}小时{2}分{3}秒', time;
                        if (diff[0] == 0 && diff[1] == 0) {
                            tmp = '{3}秒'
                        }else if(diff[0] == 0){
                            tmp = '{2}分{3}秒'
                        }
                        time = tmp.format.apply(tmp, diff);
                        prevCD.html(time);
                        time = time.replace(/\d+秒/,'');
                        if (time == '') {
                            time = '1分';
                        }
                        Y.C('isPrevBuyTimeDiff', time+'钟');
                    }else{                        
                        prevBox.hide();
                        elTime.show().html(date.format('YY年MM月DD日 hh:mm:ss'));
                        Y.C('isPrevBuyTimeDiff', false);
                    }                        
                },1000);
            }
        } 
    }
});*/

function map(key,value){
	this.key = key,
	this.value = value;
};
/*
main
*/
Class({
   ready: true,
   index: function (config){ 
	  var that = this;
	  that.bindEvent(config);
	  that.loadView();
	
   },
   bindEvent: function (config){
	   var that = this;
//	   $("[mark=chkno]").click(function(){
//    		that.sortTable("mid",this,"[mark=chkno]");
//     });
//	   $("[mark=chksp]").click(function(){
//		    that.sortTable("sp",this,"[mark=chkno]");
//	   });
	   Y.get("#groupTab").click(function(g){
		  $("#groupbet,#vs_box").toggle();
		  $("input.chbox").click();
	   })
   },
   sortTable : function(column,obj,str){
	    var that = this;
		var text = $(obj).text();
		var flag = text.substring(text.length-1);
		var srt = "";
		if(flag=='↑'){
			srt = "desc";
			flag = "↓";
		}else if(flag=='↓') {
			srt = "asc";
			flag = "↑";
		}
		$(str).each(function(){
			$(this).text($(obj).text().substring(0,$(obj).text().length-1)+flag);
		});
		var result = [];
		var data = [];
		$("#matchdata_left tr").each(function(i,n){
			data.push(n);
		});
		$("#matchdata_right tr").each(function(i,n){
			data.push(n);
		});
		for(var i = 0;i<data.length;i++){
			var key=$(data[i]).find("[mark="+column+"]").text()*1;
			result[i] = new map(key,data[i]);
		}
		result = that.mapSort(result,srt);
		$("#matchdata_left,#matchdata_right").empty();
		for(var i = 0;i< parseInt(data.length/2);i++){
			$("#matchdata_right").append($(result[i].value));
		}
		for(var i = parseInt(data.length/2);i< data.length;i++){
			
			$("#matchdata_left").append($(result[i].value));
		}
	},
   mapSort : function(list, type) {
		for ( var i = 0; i < list.length; i++) {
			for ( var j = i + 1; j < list.length; j++) {
				if (type == 'desc') {
					if (list[i].key < list[j].key) {
						var temp = list[i].key;
						var data = list[i].value;
						list[i].key = list[j].key;
						list[i].value = list[j].value;
						list[j].key = temp;
						list[j].value = data;
					}
				} else {
					if (list[i].key > list[j].key) {
						var temp = list[i].key;
						var data = list[i].value;
						list[i].key = list[j].key;
						list[i].value = list[j].value;
						list[j].key = temp;
						list[j].value = data; 
					}
				}
			}
		}
		return list;
	},
	loadView:function(){
		var that = this;
		 $.ajax({
				url:"/cpdata/match/jcmc/gj.xml",
				type:"GET",
				dataType:"xml",
				data : {},
				success:function(xmlDoc){
				 	var n=$_base_s.getXMLNodes(xmlDoc,["match"]);
					var code=n[0].getAttribute("code");
					var desc=n[0].getAttribute("desc");
					if(code==0){
						var html_left = '';
						var html_right = '';
						var trA,trB,trC,trD,trE,trF,trG,trH="";
						
						var items = $_base_s.getXMLNodes(xmlDoc,["row"]);
						var temp = [];
						for(var i = 0;i<items.length;i++){
							temp.push(new map(parseInt(items[i].getAttribute('mid')),items[i]));
						}
						temp = that.mapSort(temp);
						
						for(var i = 0;i<items.length;i++){
							var mid=temp[i].value.getAttribute('mid');
							mid=((mid*1<10)?("0"+mid):mid);
							if(mid=="01"||mid=="05"||mid=="09"||mid=="13"){
									 if(temp[i].value.getAttribute('sale')==0){
							            	trA +=	 '<td><div class="cupteamdiv "><a  mark="btn" val="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a><td>'
							            }else{
							            	trA +=	 '<td><div class="cupteamdiv "><a class="hui" title="停售中"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a><td>'
							            }
//									 <td><a href="#"><img src="/images/team/20140228112909.jpg"><span>巴西</span><em>2.65</em></a></td>
							
							}else if(mid=="02"||mid=="06"||mid=="10"||mid=="14"){
								 if(temp[i].value.getAttribute('sale')==0){
						            	trB +=	 '<td><div class="cupteamdiv "><a  mark="btn" val="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a><td>'
						            }else{
						            	trB +=	 '<td><div class="cupteamdiv "><a class="hui" title="停售中"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }
							}else if(mid=="03"||mid=="07"||mid=="11"||mid=="15"){
								 if(temp[i].value.getAttribute('sale')==0){
						            	trC +=	 '<td><div class="cupteamdiv "><a  mark="btn" val="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }else{
						            	trC +=	 '<td><div class="cupteamdiv "><a class="hui" title="停售中"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }
							}else if(mid=="04"||mid=="08"||mid=="12"||mid=="16"){
								 if(temp[i].value.getAttribute('sale')==0){
						            	trD +=	 '<td><div class="cupteamdiv "><a  mark="btn" val="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }else{
						            	trD +=	 '<td><div class="cupteamdiv "><a class="hui" title="停售中"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }
							}else if(mid=="17"||mid=="21"||mid=="25"||mid=="29"){
								 if(temp[i].value.getAttribute('sale')==0){
						            	trE +=	 '<td><div class="cupteamdiv "><a  mark="btn" val="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }else{
						            	trE +=	 '<td><div class="cupteamdiv "><a class="hui" title="停售中"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }
							}else if(mid=="18"||mid=="22"||mid=="26"||mid=="30"){
								 if(temp[i].value.getAttribute('sale')==0){
						            	trF +=	 '<td><div class="cupteamdiv "><a  mark="btn" val="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }else{
						            	trF +=	 '<td><div class="cupteamdiv "><a class="hui" title="停售中"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }
							}else if(mid=="19"||mid=="23"||mid=="27"||mid=="31"){
								 if(temp[i].value.getAttribute('sale')==0){
						            	trG +=	 '<td><div class="cupteamdiv "><a  mark="btn" val="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }else{
						            	trG +=	 '<td><div class="cupteamdiv "><a class="hui" title="停售中"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }
							}else if(mid=="20"||mid=="24"||mid=="28"||mid=="32"){
								 if(temp[i].value.getAttribute('sale')==0){
						            	trH +=	 '<td><div class="cupteamdiv "><a  mark="btn" val="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }else{
						            	trH +=	 '<td><div class="cupteamdiv "><a class="hui" title="停售中"><img src="/images/team/'+mid+'.jpg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div><td>'
						            }
							}
							
							
							
							if(i<parseInt(items.length)/2){
								html_left += '<tr class='+(temp[i].value.getAttribute('mid')%2==0?"odds":"")+'>'
					            +'<th mark="mid">'+mid+'</th>'
					            
					            +'<td colspan="2">';
					            if(temp[i].value.getAttribute('sale')==0){
					            	html_left +='<div class="cupteamdiv "><a  mark="btn" val="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'">'
					            }else{
					            	html_left +='<div class="cupteamdiv "><a class="hui" title="停售中">'
					            }
					            html_left +='<img src="/images/team/'+mid+'.jpg" class="nameimg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em mark="sp">'+temp[i].value.getAttribute('sp')+'</em></a></div></td>'
					            +'</tr>';
							}else{
								html_right += '<tr class='+(temp[i].value.getAttribute('mid')%2==0?"odds":"")+'>'
								   +'<th>'+mid+'</th>'
						            +' <td colspan="2">';
						            if(temp[i].value.getAttribute('sale')==0){
						            	html_right +='<div class="cupteamdiv "><a  mark="btn" val="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'">'
						            }else{
						            	html_right +='<div class="cupteamdiv "><a class="hui" title="停售中">'
						            }
						            html_right +='<img src="/images/team/'+mid+'.jpg" class="nameimg" alt='+mid+'><span>'+temp[i].value.getAttribute('teamname')+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div></td>'
						            +'</tr>';
							}
							
						}
						
						$("#matchdata_left").html(html_left);
						$("#matchdata_right").html(html_right);
						$("#trA").html(trA);
						$("#trB").html(trB);
						$("#trC").html(trC);
						$("#trD").html(trD);
						$("#trE").html(trE);
						$("#trF").html(trF);
						$("#trG").html(trG);
						$("#trH").html(trH);
						
						new Y.lib.VSChoose();
					    new Y.lib.VSList();
			    	}else{
			    		alert('数据获取失败！');
			    	}
		 		}
		 });
	}
})
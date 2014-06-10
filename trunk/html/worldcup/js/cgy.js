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

Y.C('max-beishu', 50000);

/*
选中的列表
*/
Class('VSChoose', {

    index: function (){
        var that = this;
        this.tmpl = Y.one('#list_tmpl');
        this.box = Y.one('#choose_list');
        Y.addStyle('.filter-hit td{background-color:#FFEAD7;}');
        Y.get('#buydg').click(function (){
            that.readyBuy();
            return false;
        });
        this.bsInput = Y.get('#buybs');
        //验证倍数
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
            if(data[0]<10){
            	item.setAttribute('sort-id', "0"+data[0]);
            }else{
            	item.setAttribute('sort-id', data[0]);
            }
            if(data[0]<10){
            	 Y.get(item).find('td').eq(0).html('<input type="checkbox" checked="checked" class="chbox" value='+dataStr+' /><span>0'+data[0]+'</span>');
            }else{
            	Y.get(item).find('td').eq(0).html('<input type="checkbox" checked="checked" class="chbox" value='+dataStr+' /><span>'+data[0]+'</span>');
            }           
            Y.get(item).find('td').eq(1).find('i').addClass("icon_s"+data[0]);
            Y.get(item).find('td').eq(1).find('span').html(data[1]);
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
            var c = a.getAttribute('sort-id');
            var d = b.getAttribute('sort-id');
            return c > d ? 1 : -1;
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
        	tnum: zs,
        	bnum: zs,
        	muli: bs,
            codes: codes.join(','),
            money: zs * bs * 2,
            price: maxPrices
        };
    },
    update: function (){
        var data = this.getData();
        Y.get('#sel_num').html(data.tnum);
        Y.get('#sel_zs').html(data.tnum);
        Y.get('#sel_money').html(data.money.rmb());
        Y.get('#sel_yc').html(data.price.rmb());
        if(data.tnum>0){
        	$(".w_checknone").hide();
        }else{
        	$(".w_checknone").show();
        }
    },
    
    //同步值到表单
    copyToForm: function (){
        var data = this.getData();
        var input;
        for(var k in data){
            input = Y.one('#'+k);
            if(k=="codes"){
            	input.value ="GYJ|14001="+data[k].replaceAll(",","/");
            	continue;
            }
            if (input) {
                input.value = data[k];
            }
        }
        return data;
    },
    //跳到确认页
    readyBuy: function (){
        var data = this.copyToForm();
        var that = this;
        var msg =  '球队';
        if (data.muli > Y.C('max-beishu')) {
            return Y.alert('您好， 单个方案最多只能购买' + Y.C('max-beishu') + '倍！');
        }
        if (data.tnum == 0) {
            Y.alert('您好， 您最少必须选择一个'+msg+'才能投注!');
        }else{
        	Y.postMsg('msg_login', function() {	
        		$("#yclass_confirm_ok").html("确认投注");
        		$("#yclass_confirm_content").css("line-height","26px")
        		Y.confirm('请确认您的方案信息！<br><strong class="pmarb f_nor f12" >投注信息：共<strong class="red_thick padd4">'+$("#tnum").val()+'</strong>注<strong class="red_thick padd4">'+$("#muli").val()+'</strong>倍<strong class="red_thick padd4">'+$("#money").val()+'</strong>元（世界杯冠军第<strong class=red_thick>14001</strong>期）</strong></strong>', function (){
        			that.doBuy();
                }); 
    		});
                   
        }
        //log(this.qForm('#project_form'));
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
     	   			Y.confirm("恭喜您，投注成功！",function(){window.location.href='../account/orderlist.html';},'','',function(){window.location.href='../worldcup/cgy.html';});
     	   		}if(code==19999){
     	   		$("#yclass_confirm_ok").html("立即充值");
     	   		 Y.confirm(desc,function(){window.location.href='../user/chzh.html';});
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
        var chks = Y.get('#vs_box input[mark=chkbet]');
        var chktr = Y.get('.cuptab1 tbody tr');
        $(".un_sel").attr("isChecked","false");      
        var hit = 'th_on';
        var stop = 'team_outed';
        var that = this;
        var group = Y.get('#vs_filter');
        if (group.size()) {
            Y.lib.VSList.iszh = true;
            this.setfilter(group.one(), group.find('input:checkbox'));
        }
        Y.onMsg('msg-choose-del', function (id){
            that.unselect(id);
        });
        chktr.click(function (){
        	  if($(this).attr("isChecked")){
              	return;
              }else{
            	  $(this).find('input:checkbox').click();
              }
        	
        });
        chks.click(function (){
        	that.select(this);
        	 if(this.checked){
                 var element = $(this);
               //default
     			var defaultOffset=$("#choose_list").offset();
     			//curent
     			var curentOffset=element.parents("td").offset();
     			//clone
     			var cloneElement=element.parents("tr").find("div.cupteamdiv").clone();
     			var id = 'item_' + element.val().split(",")[0];
     			cloneElement.css({
     				"position":"absolute",
     				"left":curentOffset.left-450,
     				"top":curentOffset.top-166
     			})
     			$(cloneElement).find("a.cur").css({"background":"none","border":"none"})
     			$("#container").append(cloneElement);
//     			element.parents("tr").find("td").append(cloneElement);
     			cloneElement.animate({
     				"left":defaultOffset.left-490,
     				"top":parseInt($("#"+id).offset().top)-170,
     				"opacity":0.3
     			},500,function(){
 					$(this).remove();
 				});
             }
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
        Y.postMsg('msg-choose-change', chk.checked, chk.value);
    },
    updateItemView: function (chk){
        var tr_hit = 'cur';
        var tr = Y.get(chk).parent('td').find("a");
        if (!chk.id) {
            chk.id = 'vschk_' + chk.value.split(',')[0];
        }        
        if (chk.checked) {
            tr.addClass(tr_hit);
        }else{
            tr.removeClass(tr_hit);
        }        
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
					if(chk.value=="比利时" || chk.value=="俄罗斯" || chk.value=="瑞士" || chk.value=="科特迪瓦"){
						g.push("--其它--");
					}
					else{
						g.push(chk.value);
					}
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
			if(gy[1]=="其它—其它"){
				return names.indexOf(gy[1]) > -1;
			}
			gy = gy[1].match(/(\S+)\s*\—+\s*(\S+)/);
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
	   this.get(".bianhao").click(function(){
       		that.sortTable(0,this,".bianhao");
       });
	   this.get(".jiangjin").click(function(){
		    that.sortTable(3,this,".jiangjin");
	   });
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
			result[i] = new map(parseInt($(data[i]).find("td:eq("+column+")").text()),data[i]);
		}
		result = that.mapSort(result,srt);
		$("#matchdata_left").empty();
		for(var i = 0;i< parseInt(data.length/2);i++){
			$("#matchdata_left").append($(result[i].value));
		}
		for(var i = parseInt(data.length/2);i< data.length;i++){
			$("#matchdata_right").append($(result[i].value));
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
				url:"/cpdata/match/jcmc/gyj.xml",
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
						var items = $_base_s.getXMLNodes(xmlDoc,["row"]);
						var temp = [];
						for(var i = 0;i<items.length;i++){
							temp.push(new map(parseInt(items[i].getAttribute('mid')),items[i]));
						}
						temp = that.mapSort(temp);
						for(var i = 0;i<items.length;i++){
							var teams = temp[i].value.getAttribute('teamname').split("—");
							var mid=temp[i].value.getAttribute('mid');
							mid=((mid*1<10)?("0"+mid):mid);
							var img=$_sys.getteamnum(teams[0]);
							img=((img*1<10)?("0"+img):img);
							var img2=$_sys.getteamnum(teams[1]);
							img2=((img2*1<10)?("0"+img2):img2);
							if(i<parseInt(items.length)/2){
								
								
								
								
								html_left += '<tr class='+(temp[i].value.getAttribute('mid')%2==0?"odds":"")+'>'
								html_left +='<th>'+mid+'</th>';
							
							  if(temp[i].value.getAttribute('sale')==0){
									html_left +=' <td><input type="checkbox" mark="chkbet" style="display:none;" value="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'" />';
									html_left +=' <div class="cupteamdiv "><a ><span class="spandm">'+teams[0]+'</span><img src="/images/team/'+img+'.jpg" class="nameimg"><s>-</s><img src="/images/team/'+img2+'.jpg" class="nameimg"><span>'+teams[1]+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div></td>';
							  }else{
								  html_left +=' <td>';
									html_left +=' <div class="cupteamdiv "><a  class="hui" title="停售中"><span class="spandm">'+teams[0]+'</span><img src="/images/team/'+img+'.jpg" class="nameimg"><s>-</s><img src="/images/team/'+mid+'.jpg" class="nameimg"><span>'+teams[1]+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></td>';
								  
							  }
					
								html_left +='</tr>';
							}else{
								html_right += '<tr class='+(temp[i].value.getAttribute('mid')%2==0?"odds":"")+'>'
								html_right +='<th>'+mid+'</th>';
							
							  if(temp[i].value.getAttribute('sale')==0){
								  html_right +=' <td><input type="checkbox" mark="chkbet" style="display:none;" value="'+temp[i].value.getAttribute('mid')+','+temp[i].value.getAttribute('teamname')+','+temp[i].value.getAttribute('sp')+','+temp[i].value.getAttribute('sale')+'" />';
								  if($_sys.getteamnum(teams[0])!=undefined){
									  html_right +=' <div class="cupteamdiv "><a ><span class="spandm">'+teams[0]+'</span><img src="/images/team/'+img+'.jpg" class="nameimg"><s>-</s><img src="/images/team/'+img2+'.jpg" class="nameimg"><span>'+teams[1]+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div></td>';
								  }else{
									  html_right +=' <div class="cupteamdiv "><a ><span class="spandm">'+teams[0]+'</span><s>-</s><span>'+teams[1]+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div></td>';
								  }
								
							  }else{
								  html_right +=' <td>';
								  if($_sys.getteamnum(teams[0])!=undefined){
									  html_right +=' <div class="cupteamdiv "><a  class="hui" title="停售中"><span class="spandm">'+teams[0]+'</span><img src="/images/team/'+img+'.jpg" class="nameimg"><s>-</s><img src="/images/team/'+img2+'.jpg" class="nameimg"><span>'+teams[1]+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></td>';
									  }else{
										  html_right +=' <div class="cupteamdiv "><a  class="hui" title="停售中"><span class="spandm">'+teams[0]+'</span><s>-</s><span>'+teams[1]+'</span><em>'+temp[i].value.getAttribute('sp')+'</em></a></div></td>';
									  } 
								
								  
							  }		
								html_right += '</tr>';
							}
							
						}
						$("#matchdata_left").html(html_left);
						$("#matchdata_right").html(html_right);
						/*表格*/
						$(".w_tab tbody tr:odd").addClass("odd");
						$(".w_tab tbody tr:even").addClass("even");
						new Y.lib.VSChoose();
					    new Y.lib.VSList();
			    	}else{
			    		Y.alert('数据获取失败！');
			    	}
		 		}
		 });
	}
})
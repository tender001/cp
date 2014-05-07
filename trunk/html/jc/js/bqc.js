(function (){
//用户工具
    Class('ToolSet', {
        use: 'mask',
        index:function (){
            this.addMenu();
            this.displaySet();
            Y.get("#show_team").prop("checked",false);
        },
        displaySet: function (){//显隐设置
            var Y = this;
            this.get('#ck1,#ck2,#ck3,#showAll_btn').prop('checked', true);
            this.get('#ck1').click(function (){
                Y.postMsg('msg_set_rq', this.checked)//让球
            }).get('#ck2').click(function (){
                Y.postMsg('msg_set_nrq', this.checked)//非让球     
            }).get('#showAll_btn').click(function (){
                Y.get(this).parent('.mie7').find(':checkbox').filter(function (c){
                    return c.id != 'ck3'
                }).prop('checked', true);
                Y.postMsg('msg_set_all')//显示所有
            }).get('#ck3').click(function (){
                Y.postMsg('msg_set_stop', this.checked)//所有截止
            }).prop('checked', false).get('#select_pv').change(function (){
                Y.postMsg('msg_change_val', this.value)
            }).get('#select_time').change(function (){
                Y.postMsg('msg_change_time', this.value)
            });
            Y.use('mask', function (){
    			Y.get('#dshelp').setStyle('zIndex', 1).tip('data-help', 1, false, 360);// 帮助说明
    		});
        },
        addMenu: function (){//联赛菜单
        	var Y = this,
            lg  = Y.get('#lglist :checkbox'),
            rq = Y.get('#rqlist :checkbox'), //让球
            rqc = Y.get('#datachoose :checkbox');//日期
//         this.get('#listDisplay').drop( this.get('#listMenu'),{focusCss: 'ls_h_btn', fixed: true, y: -1});
         lg.click(function (){//单个
             Y.postMsg('msg_select_list', this.getAttribute('value'), 0, this.checked);
         }).get('#selectAllBtn').click(function (){
             lg.prop('checked', true);//所有
             Y.postMsg('msg_select_list', true, 2, lg.attr('checked'));
         }).get('#unAllBtn').click(function (){
             lg.prop('checked', false);//全清
             Y.postMsg('msg_select_list', true, 5, lg.attr('checked'));
         }).get('#selectOppBtn').click(function (){
             var data = {};//反选
             lg.prop('checked', function (old){
                 var ed = !old;
                 data[this.getAttribute('value')] = ed;
                 return ed;
             });
             Y.postMsg('msg_select_list', data, 1);
         });
         
        Y.get("#show_team").click(function(){

     	   if($(this).attr("checked")){
     		   lg.prop('checked', false);
     		   $("input[value='西班牙甲']").attr("checked",true);
	            	$("input[value='德国甲级']").attr("checked",true);
	            	$("input[value='法国甲级']").attr("checked",true);
	            	$("input[value='意大利甲']").attr("checked",true);
	            	$("input[value='英格兰超']").attr("checked",true);
     	   }else if(!$(this).attr("checked")){
     		   lg.prop('checked', true);
     	   }

     	   Y.postMsg('msg_select_list', "五大联赛", 7,this.checked);
        })
         rqc.click(function(){
         	 Y.postMsg('msg_select_list', this.getAttribute('value'), 4, this.checked);
         });
         this.onMsg('msg_reset_display', function (){
             lg.prop('checked', true);
         });
         var only_lg = this.cookie('jczq_league');//来源于资讯跳转
         if (only_lg) {
             var lg = decodeURIComponent(only_lg), has;
             all.prop('checked', function (){
                 var zd = this.getAttribute('m') == lg;
                 if (zd) {
                     has = true;
                 }
                 return zd;
                });
                if (has) {//如果含有才隐藏
                    Y.postMsg('msg_select_list', this.getObj(lg, true), 1);
                    this.cookie('jczq_league', '', {timeout:-1, path: '/'})                    
                }
            }
        }
    });
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
//对阵
    Class('Vs', {
        index:function (){
            this.maxVs = this.C('maxSelectVs') || 6; // 最多场可选场数
            this.toolSet();
            this.isbf = this.get('#playtype').val() == 'bf';// 比分
            this._init();
            this.bindMsg()
        },
        _init: function (){
            var isChkClick, i = 1,
                hotCss = this.isbf ? 'xz' : 'label_cd';//比分的选中样式名不同
            this.hotCss = hotCss;
            this.get('#vsTable').find(':checkbox').each(function (a){
                if (!a.id) {//清除后退的缓存
                    a.checked = false
                }
            });
            //显隐单队
            this.get('#vsTable').live(':checkbox', 'click', function (e, Y){
                if (this.id) {
                    this.checked = true;
                    var tr = Y.get(this).parent('tr');
                    tr.hide();
                    Y.getHideCount();
                    if (Y.isbf) {//比分玩法隐藏下一个明细行
                        tr.get('a.bf_btn').swapClass('public_Dora', 'public_Lblue').html('<b>展开选项<s class="c_down"></s></b>');
                        tr.next('tr').hide()
                    }
                }
            }).live('td', 'click', function (e, Y){//选号
                var chk, isChkClick = e.target.nodeName.like('input');
                if (this.cellIndex || Y.isbf){
                    if (chk = Y.one('input', this, true)) {//hide error
                        if (chk.disabled || chk.id) {
                            return
                        }
                        if (Y.C('choose_data').length > Y.maxVs - 1
                            && !Y._isChoose(Y.isbf ? Y.get(this).parent('tr.hide_b').prev().one() : Y.get(this).parent('tr').one())) {
                            Y.get('input', this).prop('checked', false);
                            return Y.alert('您好，单个方案最多只能选择' + Y.maxVs + '场比赛进行投注！');
                        }
                        if (!isChkClick) {
                            chk.checked = !chk.checked;
                        }
                        var me = Y.get(this), isAll = chk.value == 'all',
                            tr = Y.isbf ? me.parent('tr.hide_b').prev().one() : this.parentNode, 
                            box = Y.isbf ? me.parent('table') : this.parentNode;
                        var chks = me.parent('tr').find(':checkbox').slice(1);
                        if (!Y.get(tr).data('scm')) {
                            Y.get(tr).data('scm', []);
                        }
                        var scm = Y.get(tr).data('scm');
                        if (isAll) {//如果是全选
                            scm.length = 0;
                            chks.slice(0,-1).each(function (el){
                                el.checked = chk.checked;
                                var td =  Y.get(el).parent('td');
                                if (el.checked) {
                                    scm.push(el.value);
                                    td.addClass(hotCss);
                                }else{
                                    td.removeClass(hotCss);
                                }
                            });
                         }else{
                            scm.remove(chk.value);
                            var allSelchk = chks.slice(-1);
                            if (allSelchk.val() != 'all') {
                                allSelchk = false;
                            }
                            if (chk.checked) {
                            	Y.removeClass(this, 'h_brx');
                            	Y.addClass(this, hotCss);
                                scm.push(chk.value);
                                if (allSelchk) {
                                    var opts = chks.slice(0, -1).filter(function (el){
                                        return el.checked;
                                    });
                                    if (opts.size()==chks.size()-1) {
                                        allSelchk.prop('checked', true);
                                    }
                                }
                            }else{
                                Y.removeClass(this, hotCss);
                                if (allSelchk) {
                                    allSelchk.prop('checked', false);
                                }
                            }                            
                        }
                        //通知右侧表同步 tr, offset
                       // if (!e.formCookie) {
                            Y.postMsg('msg_vs_change', tr, box, Y.isbf ? 0 : 1)//比分的SP不在同一个tr中, 而且是多个tr的
                      //  }
                    }
                }
            });
            Y.get('#vsTable tr[mid]').hover(function (e, Y){//鼠标滑入滑出效果
            	this.children[0].style.backgroundColor = '#FEFECB';
    			this.children[2].style.backgroundColor = '#FEFECB';
    			this.children[3].style.backgroundColor = '#FEFECB';
    			this.children[4].style.backgroundColor = '#FEFECB';
    			this.children[5].style.backgroundColor = '#FEFECB';
    			this.children[15].style.backgroundColor = '#FEFECB';
            	Y.get(this).find(".h_br").addClass("h_brx");
   	             Y.get(this).find("td").addClass("h_bry");
   	           	 Y.get(this).find(".label_cd").removeClass("h_brx");
              }, function (e, Y){
            	  this.children[0].style.backgroundColor = '';
      			this.children[2].style.backgroundColor = '';
      			this.children[3].style.backgroundColor = '';
      			this.children[4].style.backgroundColor = '';
      			this.children[5].style.backgroundColor = '';
      			this.children[15].style.backgroundColor = '';
            	  Y.get(this).find(".h_br").removeClass("h_brx");
                   Y.get(this).find("td").removeClass("h_bry");
              });
            $('#vsTable  tr[mid] .h_br').mouseout(function (e, Y){//鼠标滑入滑出效果
                var tdCSS=$(this).find('.chbox').attr("checked")==true?"h_br label_cd":"h_br h_brx";
                $(this).attr("class",tdCSS);
            });
            if (this.isbf) {//显隐明细行按钮
                this.get('#vsTable').live('a.bf_btn', 'click', function (e, Y){
                    var tr = Y.get(this).parent('tr').next('tr');
                    if (this.className.indexOf('public_Lblue') > -1) {// now is off
                       Y.get(this).swapClass('public_Lblue', 'public_Dora').find('span').html('隐藏选项').end().find('s').prop('className', 'c_up')
                       tr.show()
                    }else{
                        Y.get(this).swapClass('public_Dora', 'public_Lblue').find('span').html('展开选项').end().find('s').prop('className', 'c_down')
                        tr.hide()                        
                    }
                })
            }
        },
        _isChoose: function (tr){//是否在选中列表中, 用来确定选取上限
            var mid = tr.getAttribute('mid'),
                   d = Y.C('choose_data');
            for (var i =  d.length; i--;) {
                if (d[i].mid == mid) {
                    return true
                }
            }
        },
        bindMsg: function (){
             var Y = this;
             this._getList();
             this.onMsg('msg_select_list', function (data, mode, sel){
                 switch(mode){
                 case 0://显示单个
                     var target= Y.allList.filter(function(tr){
                         return tr.getAttribute('lg') == data
                     });
                     if (!sel && Y.isbf){
                         Y._hideBF(target)
                     }else{
                         target.show(sel);
//                         target.find(".dz_dv").show(sel);
                     }
                      break;
                  case 1://反选
                     Y.allList.each(function (tr){
                         var show = data[tr.getAttribute('lg')];
                         this.get(tr).show(show);
                         if (Y.isbf && !show){
                             var next=document.getElementById('pltr_'+tr.getAttribute('mid'));
                             if (next && next.style.display != 'none') {
                                 Y.get('a.bf_btn', tr).swapClass('public_Dora', 'public_Lblue').html('<b>展开选项<s class="c_down"></s></b>');
//                                 next.style.display='none';
                             }
                         }
                     }, this);
                     break;
                  case 2://全选
                     Y.allList.show(sel);
                     break;
                  case 3:
                 	 var target= Y.allList.filter(function(tr){
                          return tr.getAttribute('rq') == data
                      });
                 	 target.show(sel);
                 	 break;
                  case 4:
                 	 var target= Y.allList.filter(function(tr){
                          return tr.getAttribute('pendtime') == data
                      });
                 	 target.show(sel);
                 	 break;
                  case 5://全选
                      Y.allList.hide(sel);
                      break;
                  case 6://反选
                      Y.allList.each(function (tr){
                          var show = data[tr.getAttribute('rq')];
                          this.get(tr).show(show);
                          if (Y.isbf && !show){
                              var next=document.getElementById('pltr_'+tr.getAttribute('mid'));
                              if (next && next.style.display != 'none') {
                                  Y.get('a.bf_btn', tr).swapClass('public_Dora', 'public_Lblue').html('<b>展开选项<s class="c_down"></s></b>');
//                                  next.style.display='none';
                              }
                          }
                      }, this);
                      break;
                  case 7:
                 	   var target= Y.allList.filter(function(tr){
                            return tr.getAttribute('lg') != "西班牙甲"&&tr.getAttribute('lg') != "德国甲级"&&tr.getAttribute('lg') != "法国甲级"&&tr.getAttribute('lg') != "意大利甲"&&tr.getAttribute('lg') != "英格兰超"
                        });
                        if (!sel && Y.isbf){
                            Y._hideBF(target)
                        }else{
                            target.show(!sel);

                        }
                     
                         break;
                 }
                 this.getHideCount()
             });
             this.onMsg('msg_set_all', function (){
                 this.allList.show();
                 this.postMsg('msg_reset_display');
                 this.getHideCount(0)
             });
             //显隐让球
             this.onMsg('msg_set_rq', function (ok){
                this._getRqList();
                this.get(this.rqList).show(ok);
                this.getHideCount()
             });
             //显隐非让球
             this.onMsg('msg_set_nrq', function (ok){
                this._getRqList();
                this.get(this.nrqList).show(ok);
                this.getHideCount()
             });
             //显隐已截止
             this.onMsg('msg_set_stop', function (ok){
                 this.get(this.endList).show(ok);
                 this.getHideCount()
             });
             //切换赔率
             this.onMsg('msg_change_val', function (index){
                 this._getPvs();
                 this.pvList.show(index == '0');
                 this.scaleList.show(index == '1');
             });
             //切换时间
             this.onMsg('msg_change_time', function (index){
                 this._getPvs();
                 this.endTimeList.show(index == '0');
                 this.matchTimeList.show(index == '1');
             });
             //接收右侧选择表消息，同步选项
             this.onMsg('msg_choose_change', function (select_items, tr){
                 var chkbox, vsTr = this.vObj[tr.getAttribute('mid')];
                 if (vsTr) {
                     chkbox = this.get(vsTr);
                     if (this.isbf) {
                         chkbox = chkbox.next('tr')
                     }
                     chkbox.find(':checkbox').slice(this.isbf ? 0 : 1).each(function (chk){
                         chk.checked = select_items.indexOf(chk.value) > -1;
                         var td = this.ns.get(chk).parent('td');
                         if (chk.checked) {
                             td.addClass(this.ns.hotCss)
                         }else{
                             td.removeClass(this.ns.hotCss)
                         }
                     });
                     this.get(vsTr).show();
                     if (this.isbf) {//比分显示出SP区
                         Y.get('a.bf_btn', vsTr).swapClass('public_Lblue', 'public_Dora').find('span').html('隐藏选项').end().find('s').prop('className', 'c_up')
                         chkbox.show()
                     }
                 }
             });
             //更新SP
             this.onMsg('msg_update_sp', function (arrSp){
                 this._upSp(arrSp)
             })
        },
        _hideBF: function (target){
            target.each(function (t){
                var tr=this.get(t);
                tr.hide();
                tr.get('a.bf_btn').swapClass('public_Dora', 'public_Lblue').html('<b>展开选项<s class="c_down"></s></b>');
                tr.next('tr').hide()                            
            }, this)
        },
        _getList: function (){
             if (!this.list) {//缓存
                 this.vObj = {};// 提供一个快速查询的表
                 this.zObj = {};
                 this.endList = [];
                 this.pname2mid = {};
                 this.allList = Y.get('#vsTable tr[mid]');
                 this.list = this.allList.filter(function (tr){
                    if (tr.getAttribute('isend') == '1') {
                        this.endList[this.endList.length] = tr     
                    }else{
                        this.vObj[tr.getAttribute('mid')] = tr;
                        this.zObj[tr.getAttribute('zid')] = tr;
                        this.pname2mid[tr.getAttribute('pname')] = tr.getAttribute('mid');
                        return true
                    }                     
                 }, this);
             }
             return this.list
        },
        _getRqList: function (){
             if (!this.rqList) {//读取让球与否列表
                 this.rqList = [];
                 this.nrqList = [];
                 this.list.each(function (tr){
                     if(Y.getInt(tr.getAttribute('rq')) != 0){
                        this.rqList[this.rqList.length] = tr
                     }else{
                        this.nrqList[this.nrqList.length] = tr                     
                     }
                 }, this)
             }        
        },
          getHideCount: function (sum){//显示隐藏场次
              var s = 0;
              if (arguments.length) {
                  s = sum
              }else{
                  this.list.each(function (tr){
                      s += tr.style.display == 'none' ? 1 : 0
                  })
              }
              this.get('#hide_count').html(s)
        },
        _getPvs: function (){//准备比例列表
             if (!this.pvList) {
                 this.pvList = this.get('#vsTable div.pjpl');
                 this.scaleList = this.get('#vsTable div.tzbl');
                 this.endTimeList = this.get('#vsTable span.end_time');
                 this.matchTimeList = this.get('#vsTable span.match_time');
             }        
        },
        _upSp: function (arrSp){
            var tr, ptype = this.get('#playtype').val(), isbf,
                map = ['win', 'draw', 'lost'];
            switch(ptype){
            case 'jqs':val2xml = ['s0', 's1', 's2','s3','s4','s5','s6','s7'];break;
            case 'bf':val2xml = {'3A':'aother','10':'a10','20':'a20','21':'a21','30':'a30','31':'a31','32':'a32','40':'a40','41':'a41','42':'a42','50':'a50','51':'a51','52':'a52',
                '1A':'cother','00':'c00','11':'c11','22':'c22','33':'c33',
                '0A':'bother','01':'b10','02':'b20','12':'b21','03':'b30','13':'b31','23':'b32','04':'b40','14':'b41','24':'b42','05':'b50','15':'b51','25':'b52'};
                isbf = true;
                break;
            case 'bqc': val2xml = {'33':'aa','31':'ab','30':'ac','13':'ba','11':'bb','10':'bc','03':'ca','01':'cb','00':'cc'};break;
            default:val2xml = {'3':'win','1':'draw','0':'lost'};//'spf'
            }
            for (var i =  arrSp.length; i--;) {
                var o = arrSp[i];
                if (tr = this.zObj[o.id]) {
                    upLine.call(this, isbf ? this.get(tr).next('tr') : tr, o, map)
                }//end if
            }
            function upLine(tr, xml_m, map){
                var spInputs = this.get('input.chbox', tr),
                    spSpans = spInputs.next('span');
                spInputs.each(function (input, j){// 遍历check查找对应的xml value
                    var xml_attr = val2xml[input.value];
                    var New = parseFloat(xml_m[xml_attr]);
                    if (isNaN(New)) {
                        return
                    }
                    var span = this.get(input).next('span');
                    if (isbf) {
                        span = span.next('span');//比分SP在第二个span中
                    }
                    var old = parseFloat(span.html())
                    if (old != New) {
                        span.addClass(old < New ? 'red' : 'green').html(New.rmb(false))
                    }else{
                        span.removeClass('red').removeClass('green')
                    }
                }, this);
                if (val2xml['3'] == 'win') {//更新TR的SP属性值
                    this.get(tr).attr('win', spSpans.nodes[0].innerHTML).attr('draw', spSpans.nodes[1].innerHTML).attr('lost', spSpans.nodes[2].innerHTML)
                }else{
                    if (isbf) {
                        tr = this.get(tr).prev('tr').one();//比分的odds在前一个tr中
                        spSpans = spSpans.next('span')//比分SP在第二个span中
                    }
                    tr.setAttribute('odds',  spSpans.nodes.map(function (a){
                        return a.innerHTML.trim()||0
                    }).join(','))
                }
            }//upLine end
        },
        toolSet: function (){ //分区显隐
            this.get('#vsTable>div.dc_hs').find('a').click(function (e, Y){
                var s = Y.one('s', this);
                Y.get(this).parent('div').next('table').show(Y.hasClass(s, 'c_down'));
                s.parentNode.innerHTML = s.className == 'c_down' ? '隐藏<s class="c_up"></s>' : '显示<s class="c_down"></s>';
            })
        }
    });

//选中对阵表
    Class('Choose', {
        twoLine: false,//行模式
        index:function (opts){
            opts = Object(opts);
            this.tbody = this.get('#choose_list');
            this.trTpl = this.one('#choose_tpl');
            if (!this.C('single_line')) { //双行
                this.trTpl2 = this.one('#choose_tpl2');
                this.twoLine = true
            }
            this.keys = this.C('optKeys');
            this.focusCss = opts.focusCss || 'x_s'
            this.addLive();
            this.addMsg()
        },
        addLive: function (){
        	 var Y=this;
           	this.tbody.live('span.'+this.focusCss, 'mousedown', function (e, Y){//点击选中项
                   var me = Y.get(this),
                       tr = me.parent('tr'), mTr = Y.twoLine ? tr.data('linkTR') : tr;
                   me.hide();//隐藏点击过的span
                var span = me.parent('td').find('span:visited.'+Y.focusCss).nodes.map(function (s){
                    return s.getAttribute('data-sg')
                });// 值表
                //通知左侧对阵同步
                Y.postMsg( 'msg_choose_change', span, mTr.one());
                mTr.data('choose_data', span);// 保存到主tr
                if (span.length == 0) {
                    Y._hide(tr)
                }
                Y._update()
            }).live(':checkbox', 'click', function (e, Y){//点击头复选框
                if (this.getAttribute('view') == '1') {//如果是头
                    this.checked = true;
                    Y.postMsg('msg_choose_change', [], Y._hide(Y.get(this).parent('tr')).one());                       
                }else if(Y.C('_isgg')){//如果是胆且不是单关
                    var tr = Y.get(this).parent('tr');
                    tr.attr('dan', this.checked ? 1 : 0);
                }
                Y._update();
            }).live('span.'+this.focusCss, 'mouseover', function (e, Y){
                Y.get(this).addClass('nx_s')
            }).live('span.'+this.focusCss, 'mouseout', function (e, Y){
                Y.get(this).removeClass('nx_s')
            });
         	 Y.get("#checkbox_clear").click(function(){
              	Y.get("#choose_list").find("tr").each(function(e){
              		Y.postMsg('msg_choose_change', [], Y._hide(e).one());
              	});
              	Y._update();
          	}); 
        },
        _hide: function (tr){
            var _tr = this.get(tr);
            _tr.hide();
            _tr.find(':checkbox[dan]').prop('checked', false);//胆清空
            _tr.attr('dan', 0);
            if (this.twoLine) {
                this.get(_tr.data('linkTR')).hide();
            }
            return _tr
        },
        addMsg: function (){
            this.onMsg('msg_vs_change', function (tr, chkBox, clip){// tr: 数据源, chkBox: 复选框所在位置, bf可能有多行tr, clip: 是否去掉那个显隐的复选框
                var chk = this.$(':checked', chkBox).slice(clip).filter(function (chk){
                    return chk.value != 'all';//过滤掉全选按钮
                }).map(function (chk){
                    return chk.value//搜集所有选中的项
                });
                this.addChoose(chk, tr.getAttribute('mid'), tr);//添加行
            });
            this.onMsg('msg_getSPString', function (chk, vsTr){//返回选项名和SP值字符串
                var o = this._getOSP(vsTr), str = [], map = this.C('sgMap');
                for (var i = 0, j = chk.length; i < j; i++) {
                    var sp = parseFloat(o[chk[i]]);
                    str.push(map[chk[i]] + '(' + (sp?sp.rmb(false):'-') + ')')
                };
                return str.join(' ')
            });
             var type = this.get('#playtype').val();
            var maxGgCount = type == 'spf' ? 8 : (type == 'jqs' ? 6 : 4);//最大过关玩法
            //由过关方式变动消息驱动
            this.onMsg('msg_ggtype_change', function (type, isduochuan){
                var tr, all, dan=[], nDan=[];
                var isBforBqc = this.get('#playtype').val() == 'bf' || this.get('#playtype').val() == 'bqc' ;//过关方式限制
                tr = this.tbody.find('tr:visited');
                all = tr.find(':checkbox[dan]');//所有胆的复选框
                all.each(function (el){
                    if (el.checked) {dan.push(el)}else{nDan.push(el)}//取得胆与非胆
                });
               if (type.zy.length>0 && parseInt(type.zy[0] == '单关' ? 1 : type.zy[0], 10) == all.size()) {//自由中有固赔单关
                    all.each(function (el){//全体禁用
                        el.parentNode.parentNode.parentNode.setAttribute('dan',0);
                        el.disabled = true;
                        el.checked = false;                       
                    }, this);
                    this._update(true);//强制更新
                    this.postMsg('msg-ggtype-open');
                }else{//如果过关方式已选定,而且胆数等于最小选定方式 , 或者过关方式没有选, 胆的数量比所有胆小一
                    if ((type.zy.length>0 && (parseInt(type.zy[0]) -1 == dan.length)) || (isBforBqc && dan.length>2) || dan.length == Math.min(maxGgCount-1, all.size()-1)) {
                        nDan.each(function (el){
                            el.disabled = true;
                        })
                    }else{//去掉所有的禁用
                        nDan.each(function (el){
                            el.disabled = false;
                        });                        
                    }
                }
            })
        },
        addChoose: function (chk, mid, vstr){
            var id = 'choose_'+ mid, tr2,
                tr = this.get('#'+id),
                isSpf = this.get('#playtype').val() == 'spf',
                offset = isSpf ? 1 : 0;
            if (tr.size() == 0) {
                if (!this.C('sgMap')) {//赛果到字符串的映射
                    var sgBox = this.twoLine ? this.trTpl2 : this.trTpl, sg = {};
                    this.get('span.'+this.focusCss, sgBox).each(function (s){
                        sg[s.getAttribute('data-sg')] = s.innerHTML
                    }, this) ;
                    this.C('sgMap', sg)
                }
                tr = this.get(this.trTpl.cloneNode(true)).insert(this.tbody);
                tr.prop('id', id).attr('mid', mid).prop('zid', this.getInt(vstr.getAttribute('zid'))).prop('pdate', this.getInt(vstr.getAttribute('pdate'))).prop('pendtime', this.getDate(vstr.getAttribute('pendtime')));
                tr.attr('mid', vstr.getAttribute('mid')).attr('pname', vstr.getAttribute('pname')).attr('lasttime', vstr.getAttribute('gdate'));
                var A = vstr.cells[3].getElementsByTagName('A')[0].innerHTML,
                    B = vstr.cells[5+offset].getElementsByTagName('A')[0].innerHTML,
                    date = vstr.cells[0].getElementsByTagName('label')[0].title;
                tr.data('vsInfo', {
                    vs: [A, B],
                    vss: A + 'VS' + B,
                    date: date,
                    choose: this.postMsg('msg_getSPString', chk, vstr).data
                });
                tr.one().cells[1].innerHTML = A;
                tr.one().cells[0].getElementsByTagName('span')[0].innerHTML = date;
                if (!this.C('_isgg')) {
                    tr.find('input[dan]').prop('disabled', true)
                }                
                if (this.twoLine) {//第二行
                    tr2 = this.get(this.trTpl2.cloneNode(true)).insert(tr, 'next');
                    tr.data('linkTR', tr2);
                    tr2.data('linkTR', tr);
                    tr2.show().prop('id', '');
                    //tr.one().cells[1].innerHTML += 'VS' + B;
                }else{//单行
                    tr.data('linkTR', tr);//关联自身
                }
                this._sort();//仅在添加新的时候排序
            }else{
                tr.data('vsInfo').choose = this.postMsg('msg_getSPString', chk, vstr).data;
            }
            this._showChoose(tr, chk, vstr);
            this._update()
        },
        _getOSP: function (vstr){//转换为SP对象
            var sp, oSP = {};
            if (this.get('#playtype').val() == 'spf') {
                sp = [vstr.getAttribute('win'), vstr.getAttribute('draw'), vstr.getAttribute('lost')]
            }else{
                sp = (vstr.getAttribute('odds')||'').split(',')
            }
            for (var i = 0, j = sp.length; i < j; i++) {
                oSP[this.keys[i]] = sp[i]
            }
            return oSP
        },
        _showChoose: function (tr, chk, vstr){
            var tr2 = tr.data('linkTR');
            tr2.find('span.'+this.focusCss).each(function (span, i){
                span.style.display = chk.indexOf(span.getAttribute('data-sg')) == -1 ?  'none' : '';
            }, this);
            tr2.show(chk.length > 0);
            tr.data('choose_data', chk)
                .data('choose_data2', Y.get(vstr).data('scm'))
                .data('choose_sp', this._getOSP(vstr)).show(chk.length > 0);
            if (chk.length == 0) {
                this._hide(tr);
            }            
        },
        _update: function (noPostMessage){
            var data = [], def = this.C('_isgg') ? 1 : 2, danCount=0, visiTr, count=0,
                isDg = !this.C('_isgg');
            data.pioneer = Number.MAX_VALUE;
            //收集选中数据
            visiTr = this.tbody.find('tr:visited');
            visiTr.each(function (tr){
                var yTr = this.get(tr), arrKeys = yTr.data('choose_data'),
                    oSP = yTr.data('choose_sp');
                if (!tr.id) {
                    return
                }
                var trData = yTr.data('vsInfo'),
                    tmpData = {
                        mid: tr.getAttribute('mid'),
                        time: tr.getAttribute('lasttime'),
                        pname: tr.getAttribute('pname'),
                        data: arrKeys,
                        data2: yTr.data('choose_data2'),
                        selectedSP: arrKeys.map(function (a){
                            return Math.max(def, parseFloat(oSP[a])||0)//SP值默认为 def = 1 
                        }),
                        dan:tr.getAttribute('dan') == '1' ? 1 : 0,
                        date: trData.date,
                        vs: trData.vss,
                        choose: trData.choose
                    };
                        //    log(tmpData.selectedSP)
                tmpData.minSP = Math.min.apply(Math, tmpData.selectedSP).rmb(false);//最小赔率
                tmpData.maxSP = Math.max.apply(Math, tmpData.selectedSP).rmb(false);//最大赔率
                data[data.length] = tmpData;
                data.pioneer = Math.min(tr.pendtime, data.pioneer);
            }, this);         
            //场次中最先截止时间
            this.get('#end_time').html(data.pioneer == Number.MAX_VALUE ? '' : this.getDate(data.pioneer).format('MM-DD hh:mm'));
            this.C('choose_data', data); // 全局共享
            if (!noPostMessage) {
                this.postMsg('msg_choose_update', data);//发给过关类和buy类同步
            }            
          //  log(data)
        },
        _sort: function (){
            var trs = this.tbody.find('tr[id]');
            trs.nodes.sort(function (tr1, tr2){
                return tr1.zid > tr2.zid ? 1 : -1
            }).each(function (tr){
                this.appendChild(tr)
            }, this.tbody.one());
            if (this.twoLine) {//第二行排序
                trs.nodes.each(function (tr){
                    this.get(tr).data('linkTR').insert(tr, 'next')
                }, this)
            }
        }
    });

/*当前时间*/
    Class( 'Clock', {
    	index : function(clock_id) {
    		this.clockTag = this.get(clock_id);
    		Class.config('servertimediff', 0); 
    		this.runClock();
    		
    	},
    	runClock : function() {
    		var Y = this;		
    		Y.ajax({
    			url : "/cpdata/time.json",
    			end : function(data) {
    				var servernow = Y.getDate(data.date);			
    				var diff=Date.parse(servernow) - Date.parse(new Date()) ;	
    				Class.config('servertimediff',(diff));
    				
    				setInterval( function() {
    					var now = new Date();
    					var d = new Date(Date.parse(now) + Class.config('servertimediff'));
    					var h_time='<span>当前时间</span><span class="jc_tms">'+Y.addZero(d.getFullYear())+'-'+Y.addZero((d.getMonth() + 1))+'-'+Y.addZero(d.getDate())+'</span><span class="jc_tmv jc_tms">' + Y.addZero(d.getHours()) + ':' + Y.addZero(d.getMinutes()) + ':' + Y.addZero(d.getSeconds())+'</span>';
    					Y.clockTag.html(h_time);
    				}, 1000 );
    				
    				var _runtime=setInterval( function() {
    					Y.ajax({
    						url : "/phpu/cl.phpx",
    						end : function(data) {
    							var servernow = Y.getDate(data.date);			
    							var diff=Date.parse(servernow) - Date.parse(new Date()) ;	
    							Class.config('servertimediff',(diff));						
    						}
    					});	
    				}, 10*60*1000);
    				setTimeout(function(){clearInterval(_runtime);}, 6*10*60*1000);
    			}
    		});	
    	},
    	addZero : function(n) {
    		return parseInt(n) < 10 ? '0' + n : n;
    	}
    } );
    
    
//加载 期次-对阵
    Class('LoadExpect',{
    	index:function(){
    		this.TbindMsg();		
    	},
    	TbindMsg: function(){
    		return this.LoadDuiZhen();	
    	},	
        
    	LoadDuiZhen : function(expect) {	
    		Class.config('playId', parseInt(this.need('#playid').val()) );  //玩法id	
    		var uri="jczq_bqc";
    		if(this.need('#isgg').val()=="1"){
    			uri="jczq_fbqc";
    		}
    		this.ajax({
    			        url: "/cpdata/match/jczq/"+uri+".json?rnd=" + Math.random(),
    			        cache:false,
    					end : function(data) {
    						var obj = eval("(" + data.text + ")");
    						var code = obj.match.code;
    						var desc = obj.match.desc;
    						if (code == "0") {
    							this.bqc(data);										
    						} else {
    							this.alert(desc);
    						}
    					},
    					error : function() {
    						this.alert("网络故障!");
    						return false;
    					}
    				});
    	},
    	bqc:function(data){
   		 var html = [];
   		 var tableTpl=['',//0对阵头
              '<DIV class=dc_hs style="text-align: left; padding-left:5px;"><STRONG>{$enddate} {$weekday} </strong>[12:00 -- 次日 12:00] <strong><span id=num{$num} class=red>num{$num}</span>场比赛可投注</STRONG> <A href="javascript:void 0">隐藏<S class=c_up></S></A> </DIV>',//1按天分类
              '<TABLE id=d_{$enddate} class=dc_table border=0 cellSpacing=0 cellPadding=0 width="100%" onselectstart="return false">'+
              '<COLGROUP><COL width=45><COL width=64><COL width=64><COL width=86><COL width=4><COL width=><COL width=38>'+
              '<COL width=38><COL width=38><COL width=38><COL width=38><COL width=38><COL width=38><COL width=38><COL width=38><COL width=38></COLGROUP>',//2对阵table控制
              '<TBODY>'+
              '<TR class="{$classname}" style="DISPLAY: none" lg="{$mname}" isend="1" odds="{$bqc}" pdate="{$itemid}" pendtime="{$enddate}" pname="{$itemid}" mid="{$mid}" zid="{$itemid}">'+
              '<TD style="CURSOR: pointer"><LABEL for=m{$itemid} title="{$name}"><INPUT id=m{$itemid} class=chbox value={$itemid} CHECKED type=checkbox name=m{$itemid}>{$newname}</LABEL></TD>'+
              '<TD style="BACKGROUND:{$cl}; COLOR: #fff" class=league><A title={$lmname} href="" target="_blank" id="mn{$itemid}" style="color: #fff">{$mname}</A></TD>'+
              '<TD><SPAN class="eng end_time" title="开赛时间：{$mt}">{$short_et}</SPAN><SPAN style="DISPLAY: none" class="eng match_time" title="截止时间：{$et}">{$short_mt}</SPAN> </TD>'+
              '<TD style="text-align: right; padding-right:2px;"><A title={$lhn} href="" target="_blank" id="hn{$itemid}">{$hn}</A></TD>'+
              '<TD style="text-align: center;">VS</TD>'+
              '<TD style="text-align: left; padding-left:2px;"><A title={$lgn} href="" target="_blank" id="gn{$itemid}">{$gn}</A></TD>'+
              '<TD class=h_br style="border-left:1px solid #62A3D0">{$sp0}</TD>'+
              '<TD class=h_br >{$sp1}</TD>'+
              '<TD class=h_br>{$sp2}</TD>'+
              '<TD class=h_br >{$sp3}</TD>'+
              '<TD class=h_br>{$sp4}</TD>'+
              '<TD class=h_br >{$sp5}</TD>'+
              '<TD class=h_br >{$sp6}</TD>'+
              '<TD class=h_br >{$sp7}</TD>'+
              '<TD class=h_br>{$sp8}</TD>'+
              '<TD><a href="" target="_blank" id="ox{$itemid}">析</a> <a href="" target="_blank" id="oz{$itemid}">欧</a></TD></TR>'+
              '</TBODY>',//3隐藏对阵
              '<TBODY>'+
              '<TR lg="{$mname}" class="{$classname}" isend="0" odds="{$bqc}" pdate="{$itemid}" pendtime="{$enddate}" pname="{$itemid}" mid="{$mid}" zid="{$itemid}">'+
              '<TD style="CURSOR: pointer"><LABEL for=m{$itemid} title="{$name}"><INPUT id=m{$itemid} class=chbox value={$itemid} CHECKED type=checkbox name=m{$itemid}>{$newname}</LABEL></TD>'+
              '<TD style="BACKGROUND:{$cl}; COLOR: #fff" class=league><A title={$lmname} href="" target="_blank" id="mn{$itemid}" style="color: #fff">{$mname}</A></TD>'+
              '<TD><SPAN class="eng end_time" title="开赛时间：{$mt}">{$short_et}</SPAN><SPAN style="DISPLAY: none" class="eng match_time" title="截止时间：{$et}">{$short_mt}</SPAN> </TD>'+
              '<TD style="text-align: right; padding-right:2px;"><A title={$lhn} href="" target="_blank" id="hn{$itemid}"><em id="htid{$itemid}" class="ew_e ew_eright">{$hn}</em></A></TD>'+
              '<TD style="text-align: center;">VS</TD>'+
              '<TD style="text-align: left; padding-left:2px;"><A title={$lgn} href="" target="_blank" id="gn{$itemid}"><em id="gtid{$itemid}" class="ew_e">{$gn}</em></A></TD>'+
              '<TD style="CURSOR: pointer;border-left:1px solid #ddd" class=h_br  ><DIV class=label_br><INPUT class=chbox value=33 type=checkbox style="display: none"><SPAN class=eng>{$sp0}</SPAN></DIV></TD>'+
              '<TD style="CURSOR: pointer" class=h_br ><DIV class=label_br><INPUT class=chbox value=31 type=checkbox style="display: none"><SPAN class=eng>{$sp1}</SPAN></DIV></TD>'+
              '<TD style="CURSOR: pointer" class=h_br ><DIV class=label_br><INPUT class=chbox value=30 type=checkbox style="display: none"><SPAN class=eng>{$sp2}</SPAN></DIV></TD>'+
              '<TD style="CURSOR: pointer" class=h_br ><DIV class=label_br><INPUT class=chbox value=13 type=checkbox style="display: none"><SPAN class=eng>{$sp3}</SPAN></DIV></TD>'+
              '<TD style="CURSOR: pointer" class=h_br ><DIV class=label_br><INPUT class=chbox value=11 type=checkbox style="display: none"><SPAN class=eng>{$sp4}</SPAN></DIV></TD>'+
              '<TD style="CURSOR: pointer" class=h_br ><DIV class=label_br><INPUT class=chbox value=10 type=checkbox style="display: none"><SPAN class=eng>{$sp5}</SPAN></DIV></TD>'+
              '<TD style="CURSOR: pointer" class=h_br ><DIV class=label_br><INPUT class=chbox value=03 type=checkbox style="display: none"><SPAN class=eng>{$sp6}</SPAN></DIV></TD>'+
              '<TD style="CURSOR: pointer" class=h_br ><DIV class=label_br><INPUT class=chbox value=01 type=checkbox style="display: none"><SPAN class=eng>{$sp7}</SPAN></DIV></TD>'+
              '<TD style="CURSOR: pointer" class=h_br ><DIV class=label_br><INPUT class=chbox value=00 type=checkbox style="display: none"><SPAN class=eng>{$sp8}</SPAN></DIV></TD>'+
              '<TD><a href="" target="_blank" id="ox{$itemid}">析</a> <a href="" target="_blank" id="oz{$itemid}">欧</a></TD></TR>'+
              '</TBODY>',//4显示对阵
              '</TABLE>'//5
   		];
   	
   		var mathdate=[];
   		var wk=["日","一","二","三","四","五","六"];
   	
   		var stop_sale="no";
		var all_matches=0;
		var dateweek =[];
		var out_of_date_matches=0;
		var rangqiu_matches=[];
		var no_rangqiu_matches=0;
		var odds_issuc=false;
		var numstr=[];
		var lgname=[];
		var num=0;
		var lgstr="";

   		var obj = eval("(" + data.text + ")");
			var code = obj.match.code;
			var desc = obj.match.desc;
			var r = obj.match.row;
			if(!this.isArray(r)){r=new Array(r);}
			r.each(function(row,i){
				row.classname=i%2==0?"even odd":"even";
				row.enddate=((Y.getDate(row.mt).getHours()<11 || (Y.getDate(row.mt).getHours()==11 && Y.getDate(row.mt).getMinutes()<30))?(Y.getDate(Date.parse(Y.getDate(row.mt))-1000*60*60*24).format('YY-MM-DD')):Y.getDate(row.mt).format('YY-MM-DD'));
	   			if (mathdate.indexOf(row.enddate)<0){
   				if(mathdate.length>0){numstr[numstr.length]=num;}
   				num=0;
   				row.num=numstr.length;
   				mathdate[mathdate.length]=row.enddate;
   				row.weekday='周'+wk[Y.getDate(row.enddate).getDay()];
   				html[html.length] = mathdate.length>1?(tableTpl[5]+tableTpl[1].tpl(row)+tableTpl[2]):tableTpl[1].tpl(row)+tableTpl[2];   
   			};
   			row.index=row.mid;

   			row.short_et=Y.getDate(row.et).format('hh:mm');
   			row.short_mt=Y.getDate(row.mt).format('hh:mm');
   			var spstr=row.bqc.split(",");
   			row.sp0=(spstr[0]!=''?(parseFloat(spstr[0]).rmb(false,2)):'--');
   			row.sp1=(spstr[1]!=''?(parseFloat(spstr[1]).rmb(false,2)):'--');
   			row.sp2=(spstr[2]!=''?(parseFloat(spstr[2]).rmb(false,2)):'--');
   			row.sp3=(spstr[3]!=''?(parseFloat(spstr[3]).rmb(false,2)):'--');
   			row.sp4=(spstr[4]!=''?(parseFloat(spstr[4]).rmb(false,2)):'--');
   			row.sp5=(spstr[5]!=''?(parseFloat(spstr[5]).rmb(false,2)):'--');
   			row.sp6=(spstr[6]!=''?(parseFloat(spstr[6]).rmb(false,2)):'--');
   			row.sp7=(spstr[7]!=''?(parseFloat(spstr[7]).rmb(false,2)):'--');
   			row.sp8=(spstr[8]!=''?(parseFloat(spstr[8]).rmb(false,2)):'--');		
   			all_matches++;
   			row.lmname=row.mname;
   			row.lhn=row.hn;
   			row.lgn=row.gn;
   			row.mname=row.mname.substr(0,4);
   			row.name=row.name;
			row.newname=row.name.substr(2.5).trim();
   			
   			if (Y.getDate(data.date)>Y.getDate(row.et)){//已经过期的场次
   				out_of_date_matches++;
   				row.shuju='<a href="http://odds.159cai.com/fenxi/shuju.php?id=318510&show=2" target="_blank">析</a> <a href="http://odds.159cai.com/fenxi/yazhi.php?id=318510&show=2" target="_blank">亚</a> <a href="http://odds.159cai.com/fenxi/ouzhi.php?id=318510&show=2" target="_blank">欧</a>';
   				row.sp0='<span class="sp_value eng ">'+row.sp0+'</span>';
   				row.sp1='<span class="sp_value eng ">'+row.sp1+'</span>';
   				row.sp2='<span class="sp_value eng ">'+row.sp2+'</span>';
   				
   				row.sp3='<span class="sp_value eng ">'+row.sp3+'</span>';
   				row.sp4='<span class="sp_value eng ">'+row.sp4+'</span>';
   				row.sp5='<span class="sp_value eng ">'+row.sp5+'</span>';
   				
   				row.sp6='<span class="sp_value eng ">'+row.sp6+'</span>';
   				row.sp7='<span class="sp_value eng ">'+row.sp7+'</span>';
   				row.sp8='<span class="sp_value eng ">'+row.sp8+'</span>';
   				html[html.length] = tableTpl[3].tpl(row);
   			}else{//未过期的场次
   				num++;    				
   				html[html.length] = tableTpl[4].tpl(row);
   				rangqiu_matches.push(row.close);
				lgname.push(row.mname);
				dateweek.push('星期'+wk[Y.getDate(row.enddate).getDay()]+"_"+row.enddate);
   				if (lgstr.indexOf(row.mname)<0){	
   		            lgstr+='<LI><INPUT id="lg'+row.mname+'" CHECKED type="checkbox" m="'+row.mname+'"><LABEL for="lg'+row.mname+'">'+row.mname.substr(0,4)+'</LABEL></LI>';
   		    		}
   			};

   		}); 

   		this.get("#lgList").html(lgstr);
   		numstr[numstr.length]=num;
   		this.get("#isend").html(out_of_date_matches);
   		this.get("#vsTable").html(tableTpl[0]+html.join('')+ tableTpl[5]);
   		for(ii=0;ii<numstr.length;ii++){
   			this.get("#num"+ii).html(numstr[ii]);
   		}
   		this.get("#vsTable").show();	
   	//生成联赛列表
   		var arr_league = [];
   		var league_list_html = '';
   		var match_num_of_league = {};
   		lgname.each( function(item) {
   			var league_name = item;
   				if ($_sys.getSub(arr_league,league_name) == -1 ) {
   					arr_league.push(league_name);
   					league_list_html += '<li><label for="' + league_name + '"><input name="lg" type="checkbox" value="' + league_name + '" checked="checked"/><span>' + league_name + '</span>[<i>'+league_name +'_num</i>]</label></li>';
  				}
   				if (typeof match_num_of_league[league_name] == 'undefined') {
   					match_num_of_league[league_name] = 1;
   				} else {
   					match_num_of_league[league_name]++;
   				}
   				
   		} );
   		for (var league_name in match_num_of_league) {
   			league_list_html = league_list_html.replace(league_name + '_num', match_num_of_league[league_name]);
   		}
   		$("#lglist").html(league_list_html);
   		
   		//生成星期列表
   		var newday=Y.getDate(data.date).format('YY-MM-DD');
   		var arr_week = [];
   		var week_list_html = '';
   		var match_num_of_week = {};
   		dateweek.each( function(item) {
   			var week_name = item.split("_")[0];
   				if (arr_week.join('|').indexOf(week_name) == -1 ) {
   					arr_week.push(week_name);
   					var wd='';
   					if((Y.getDate(newday)-Y.getDate(item.split("_")[1]))==0){
   						wd='(今天)';
   					}
   					week_list_html+='<li style="width:145px"><label for=' + week_name + wd+'><input class="radio" type="checkbox" value="'+item.split("_")[1]+'" checked="checked"/><span>' + week_name + wd+'赛程</span>[<i>'+week_name + '_num</i>]</label></li>';
  				}
  				if (typeof match_num_of_week[week_name] == 'undefined') {
  					match_num_of_week[week_name] = 1;
  				} else {
  					match_num_of_week[week_name]++;
  				}
  				
  		} );
  		for (var week_name in match_num_of_week) {
  			week_list_html = week_list_html.replace(week_name + '_num', match_num_of_week[week_name]);
  		}
  		$("#datachoose").html(week_list_html);
   		this.postMsg('load_duizhen_succ');
      }	
    });
  //发起购买
    Class('Buy', {
        index:function (){
            var limit = this.get('#money_limit').val().split(',');
            this.C('MAX_ALL_MONEY', this.getInt(limit[1], 20*10000));
            this._upView = this._upView.slow(10);
            this.createIntInput('#bs', function (e, Y){//修改倍数
            	 
            	Y._upView(Y.C('choose_data'));
            }, 100000);
            this.onMsg('msg_choose_update', function (data){//选择场次或者子项变化, 可能化引起过关方式自动切换
                this._upView(data)
            });
            this.onMsg('msg_ggtype_change', function (type, isduochuan){//改变过关方式
                this._upView(Y.C('choose_data'))
            });
            this.onMsg('msg_show_prix_hand', function (){//手动显示理论奖金
                this._upView(Y.C('choose_data'), true)
            });
            this.sgMap = this.dejson(this.get('#jsonggtype').val());     
            this.get('#gobuy,#gohm').click(function (e, Y){//提交
                var data = Y.C('choose_data'), minNum = Y.C('_isgg') ? 2 : 1, ishm = this.id == 'gohm' ? 1 : 0,
                    ggData =  Y.C('-all-gg-type'),
                    duoc = ggData.dc, isDg = duoc ? duoc.indexOf('单') > -1 : false;
                if (data.length < minNum) {
                    return Y.alert('您好，请至少选择' + minNum + '场比赛!')
                }else if(!duoc && ggData.zy.length === 0){
                    return Y.alert('您好，请选择过关方式！')
                }
                if (isDg && Y.get('#bs').val() > 100000) {
                    return Y.alert('您好，代购倍数不能超过100000倍！')
                }
                if (ishm && Y.get('#bs').val() > 100000) {
                    return Y.alert('您好，合买倍数不能超过100000倍！')
                }
                if (!isDg && Y.checkMaxMoney(data, ggData)) {
                    return Y.alert('您好，单倍认购金额不能超过20,000元！')
                }
                if (Y.get('#playtype').val() == 'bf' && !isDg) {
                    var ggTypes = duoc ? [duoc] : ggData.zy;
                    ggTypes.sort(function (a, b){
                        return parseInt(a) > parseInt(b) ? -1 : 1
                    });
                    var m = parseInt(ggTypes[0]);
                    var s=data.map(function (d){
                        return d.data.length
                    }).sort(Array.up);
                    if (s.slice(-m).reduce(function(s, i){return s+i}, 0) > 80) {
                        return Y.alert('您好，您的投注选项个数已超过官方最大限制80个，请修改投注内容后重新发起!');
                    }
                }
				//if (!Y.checkMaxTickets(data.length, ggData)) {
				//	return Y.alert('您好，您的方案已超过单倍最高票数限制，请修改投注内容后重新发起！');
				//}
                var chkgroup = isDg ? 1 : (duoc ? false : ggData.zy.map(function (e){
                    return parseInt(e)
                }).join(','));
                Y.checkLimitCode(data, chkgroup, function (){
                    if (duoc && !isDg) {//多串
                        Y.get('#ggtypename').val(duoc)
                        Y.get('#ggtypeid').val(Y.sgMap[duoc]);   
                        Y.get('#gggroup').val(2);
                    }else if(isDg){
                        Y.get('#ggtypename').val('单关')
                        Y.get('#ggtypeid').val(Y.sgMap['单关']);    
                        Y.get('#gggroup').val(1);
                    }else{//自由
                        var ziy = ggData.zy, 
                            isPt = ziy.length == 1 && data.length == parseInt(ziy[0]);
                        Y.get('#gggroup').val(isPt ? 1 : 3);
                        Y.get('#ggtypename').val(ziy.join(','));
                        Y.get('#ggtypeid').val(ziy.map(function (w){
                            return Y.sgMap[w]
                        }).join(','))
                     }
                    var danma = [];
                    Y.get('#codes').val(data.map(function (a){
                        var c = a.mid+'|'+a.pname+'['+Y._id2Name(a.data).join(',')+']';//原来格式
                        //var c = a.pname+':['+Y._id2Name(a.data).join(',')+']';//改后
                        if (a.dan) {
                            danma.push(c)
                        }
                        return c
                    }).join('/'));
                    Y.get('#danma').val(danma.join('/'));//胆码
                    Y.get('#zhushu').val(Y.get('#zs').html());
                    Y.get('#beishu').val(Y.get('#bs').val());
                    Y.get('#ishm').val(ishm);//合买与代购
                    var totalmoney = Y.get('#bs').val()*2*Y.get('#zhushu').val();
                    Y.get('#totalmoney').val(totalmoney);
                    var MAX_ALL_MONEY = this.C('MAX_ALL_MONEY');
                    if (totalmoney > MAX_ALL_MONEY) {
                        return this.alert('您好, 发起方案金额最多不能超过￥'+MAX_ALL_MONEY+'元!')
                    }
                    if (ishm){
                    	Y.get("#project_form").attr("action", "/phpt/jc/step_1.phpx");
                    }else{
                    	Y.get("#project_form").attr("action", "/phpt/jc/step_2.phpx");
                    }
                    Y.get('#project_form').doProp('submit')
                })                    
           });
            
            this.get('#jjyh').click(function (e, Y){
            	var data = Y.C('choose_data'), minNum = Y.C('_isgg') ? 2 : 1,
                        ggData =  Y.C('-all-gg-type'),
                        duoc = ggData.dc;
                    if (data.length < minNum) {
                        return Y.alert('您好，请至少选择' + minNum + '场比赛!')
                    }else if(!duoc && ggData.zy.length === 0){
                        return Y.alert('您好，请选择过关方式！')
                    }else if(ggData.zy.length>1){
                    	return Y.alert('奖金优化暂不支持同时选择多个过关方式！')
                    }
                    if (Y.get('#bs').val() > 100000) {
                        return Y.alert('您好，奖金优化倍数不能超过100000倍！')
                    }
                    
                    
                    var chkgroup =ggData.zy.map(function (e){
                        return parseInt(e)
                    }).join(',');
                    Y.checkLimitCode(data, chkgroup, function (){
                        if (duoc) {//多串
                            Y.get('#ggtypename').val(duoc)
                            Y.get('#ggtypeid').val(Y.sgMap[duoc]);   
                            Y.get('#gggroup').val(2);
                        }else{//自由
                            var ziy = ggData.zy, 
                                isPt = ziy.length == 1 && data.length == parseInt(ziy[0]);
                            Y.get('#gggroup').val(isPt ? 1 : 3);
                            Y.get('#ggtypename').val(ziy.join(','));
                            Y.get('#ggtypeid').val(ziy.map(function (w){
                                return Y.sgMap[w]
                            }).join(','))
                         }
                        var danma = [];
                        Y.get('#code').val(data.map(function (a){
                            var c = a.pname+'='+Y._id2Name(a.data).join('/');//改后
                            if (a.dan) {
                                danma.push(c)
                            }
                            return c
                        }).join(','));
                        if(danma.length>0){
                        	return this.alert('奖金优化不支持定胆！');
                        }
                        
                        var ty=Y.get('#ggtypename').val().split('\串');
                        if(ty[1]>1){
                        	return this.alert('奖金优化仅支持N串1！');
                        }
                        Y.get('#pnum').val(ty[0]);
                        Y.get('#danma').val(danma.join('/'));//胆码
                        Y.get('#zhushu').val(Y.get('#zs').html());
                        Y.get('#muli').val(Y.get('#bs').val());
                        var totalmoney = Y.get('#bs').val()*2*Y.get('#zhushu').val();
                        Y.get('#tmoney').val(totalmoney);
                        var MAX_ALL_MONEY = this.C('MAX_ALL_MONEY');
                        if (totalmoney > MAX_ALL_MONEY) {
                            return this.alert('您好, 发起方案金额最多不能超过￥'+MAX_ALL_MONEY+'元!')
                        }
                        Y.get("#jjyh_form").attr("action", 'jjyh_bqc.html');
                        Y.get('#jjyh_form').doProp('submit')
                    })
           });

        },
        maxMoney: 10000,//最多一万注,  20000元
        checkMaxMoney: function (data, type){//检查单票金额
              var sel = data.map(function (d){
                  return d.data.length
              }).sort(Array.up), types;
              if (type.dc) {//多串直接求值
                 return this.getDCZs(sel.slice(-this.getInt(type.dc)), type.dc) > this.maxMoney
              }else{//自由遍历求值
                  types =  type.zy;
                  for (var i =  types.length; i--;) {
                      var t = this.getInt(types[i]);
                      if (getMutil(sel.slice(-t))>this.maxMoney) {
                          return true
                      }
                  }                  
              }
              function getMutil(arr){//连乘
                  var  i =  arr.length, c = i ? 1 : 0;
                  for (; i--;) {
                      c*=arr[i]
                  }
                  return c
              }
        },
        checkLimitCode: function (data, chkgroup,fn){
            if (!chkgroup) {//多串不检测
                return fn.call(this)           
            }
            fn.call(this)
        },
		checkMaxTickets : function(match_num, gg_data) {  //拆分后票数的限制检查
			var n, sum = 0;
			if (gg_data.dc) {  //多串
				n = parseInt(gg_data.dc);
				sum = Math.c(match_num, n);
			} else {  //自由
				gg_data.zy.each(function(v) {
					n = parseInt(v);
					sum += Math.c(match_num, n);
				});
			}
			return sum <= 100000;
		},
        _upView: function (data, hand){//更新视图
            var bs = this.getInt(this.get('#bs').val());
            this.get('#cs').html(data.length);
            if(data.length>0){
            	this.get("#checkbox_clear").addClass("jcq_kcur");
            }else{
            	this.get("#checkbox_clear").removeClass("jcq_kcur");
            }
            clearTimeout(this.delayGetPrixTimer);
            if (hand) {
                this.get('#maxmoney').html('计算中...')
            }
            this.delayGetPrixTimer = setTimeout((function() {
                var zs = this._getZs(data),
                    prix = this._getPrix(data, hand);
                this.get('#zs').html(zs);
                this.get('#buy_money').html(this.getInt(zs*2*bs).rmb());
                this.get('#maxmoney').html(prix === undefined ? '<span onclick="Yobj.postMsg(\'msg_show_prix_hand\', true)" style="cursor:pointer;">点击查看</span>' : (prix=="NaN"?"点击查看明细":parseFloat(prix*bs).rmb()));                
            }).proxy(this),100)
        },
        _getZs: function (data){//计算注数
            if (this.C('_isgg')) {//过关
                var type = this.C('-all-gg-type'),
                    isDX = this.C('-isdcgg');
                if (isDX && type.dc || !isDX && type.zy.length) {//有效选择
                    return this.postMsg('msg_get_zhushu', data, isDX ? 2 : 3 , isDX ? [type.dc]: type.zy).data
                }else{
                    return 0
                }
            }else{//单关
                return data.reduce(function (s, item){
                    return s + item.data.length
                }, 0)
            }
            function $Tran(a){//连乘
                var t=1,n=10000,l = a.length;
                if(l==0)return 0;
                while(--l)t*=(a[l]*n)/n;
                return t
            }
        },
        _getPrix: function (data, hand){
            return this.C('_isgg') ? this._getGgPrix(data, hand) : this._getSinglePrix(data)
        },
        _getSinglePrix: function (data){//单关最高奖金
            return data.reduce(function (a, b){
                return a + parseFloat(b.maxSP)
            }, 0);
        },
        _getGgPrix: function (data, hand){//过关最高奖金
            return this.postMsg('msg_get_top_prix', data, hand).data
        },
        _id2Name: function (attr){
            var map, ptype = this.get('#playtype').val();
            switch(ptype){
            case 'bf':map = {'3A':'胜其它','10':'1:0','20':'2:0','21':'2:1','30':'3:0','31':'3:1','32':'3:2','40':'4:0','41':'4:1','42':'4:2','50':'5:0','51':'5:1','52':'5:2',
                '1A':'平其它','00':'0:0','11':'1:1','22':'2:2','33':'3:3',
                '0A':'负其它','01':'0:1','02':'0:2','12':'1:2','03':'0:3','13':'1:3','23':'2:3','04':'0:4','14':'1:4','24':'2:4','05':'0:5','15':'1:5','25':'2:5'};
                break;
            case 'bqc': map = {'33':'3-3','31':'3-1','30':'3-0','13':'1-3','11':'1-1','10':'1-0','03':'0-3','01':'0-1','00':'0-0'};break;
            default: return attr
            }
            return attr.map(function (a){
                return map[a]
            })
        }
    });

//过关方式
    Class('GgType', {
        //场数与对应显示的过关方式
        type: ['r1c1', 'r2c1','r3c1,r3c3,r3c4','r4c1,r4c4,r4c5,r4c6,r4c11','r5c1,r5c5,r5c6,r5c10,r5c16,r5c20,r5c26','r6c1,r6c6,r6c7,r6c15,r6c20,r6c22,r6c35,r6c42,r6c50,r6c57','r7c1,r7c7,r7c8,r7c21,r7c35,r7c120','r8c1,r8c8,r8c9,r8c28,r8c56,r8c70,r8c247' ],
        chooseCount: 0, //场数
        index:function (){
            this.C('-isdcgg', false);//是否是多串过关
			var isbf = this.get('#playtype').val() == 'bf';// 比分
            this.ggMap = this.dejson(this.get('#jsonggtype').val());
            this.allType = this.get('#ggList label').concat(this.$('#ggListFree label'));
            var Y = this, allInputs = this.get('input', '#ggListFree,#ggList');
            allInputs.click(function (e, Y){//点击事件
                Y.setCurrentType();
            });
            this.onMsg('msg-cmd-chType', function (){//手动改变类型
                Y.setCurrentType();
            });
            this.allInputs = allInputs;
            var type = this.get('#playtype').val();
            var maxGgCount = type == 'spf' ? 8 : (type == 'jqs' ? 6 : 4);//最大过关玩法
            this.onMsg('msg-ggtype-open', function (){
                allInputs.prop('disabled', false)
            });
			var curVsLen = 0;
            this.onMsg('msg_choose_update', function (data){
                var len =Math.min(data.length, maxGgCount), //场数
                    Y = this ;
				curVsLen = len;
                var dan = data.reduce(function (p,c){
                	return p+(c.dan==0?0:1)
                },0);
                var minVs = this.C('dggp') ? 0 : 1;
				if (!isbf) {
					this.lt2_info.show(len < (Y.C('-isdcgg') ? 3 : 2));
				}				
                if (len > minVs) {
                    var type  = this.type.slice(minVs, len).join(',').split(','), first;//取出前面的n个方式
                    this.allType.each(function (lab, i){
                        var isMatch = type.indexOf(lab.htmlFor) > -1,
                            tag = this.one('#'+lab.htmlFor);
                        lab.style.display = isMatch ? '' : 'none';//匹配则显示
                        if (!isMatch) {
                            tag.checked = false;
                        }
                        if (dan >= parseInt(lab.htmlFor.slice(1))) {//胆数大于
                            tag.disabled = true;
                            tag.checked = false;
                        }else{
                            tag.disabled = false;
                        }
                     }, this)
                    this.setCurrentType();
                    this.chooseCount = len
                }else{//清除
                    this.allType.hide().each(function (lab){
                        this.one('#'+lab.htmlFor).checked = false;
                    });
                    this.setCurrentType({dc:false, zy: []})//类型置假
                    this.chooseCount = 0;
                }
            });
            var ggTabs = this.lib.Tabs({
                items: '#ggTabsNav li',
                focusCss: 'an_cur',
                contents: '#ggListFree,#ggList'
            });
            ggTabs.onchange = function (a, b){
                this.C('-isdcgg', b === 1);
				if (!isbf) {
					Y.lt2_info.html('请至少选择'+(b===1?3:2)+'场比赛进行投注。');
					Y.lt2_info.show(curVsLen < (Y.C('-isdcgg') ? 3 : 2));
				}
                allInputs.prop('checked', false);//清空过关方式
                Y.setCurrentType(false);// 没有过关方式
            };
            this.onMsg('msg_ggTabs_focus', function (i){
                ggTabs.focus(i)
            });
			//少于两场的提示
			if (!isbf) {//比分不加提示
				this.lt2_info = this.get('<div style="text-align: center;padding-top: 10px;color: red;" id="vslt2">请至少选择2场比赛进行投注。</div>').insert('#ggListFree', 'prev');
			}
        },
        getCurrentType: function (){//取得过关方式
            var type = {dc:false, zy: []};
            this.allInputs.each(function (el){
                if (el.checked) {
                    if ((el.type+'').like('radio')) {
                        type.dc = el.value
                    }else{
                        type.zy[type.zy.length] = el.value
                    }
                }
            });
            return type
        },
        setCurrentType: function (oType){//改变过关方式
            var type = oType || this.getCurrentType();
            this.C('_current_gg_type', type.dc ? type.dc : type.zy ? type.zy : []);
            this.C('-all-gg-type', type);
            this.postMsg('msg_ggtype_change', type, this.C('-isdcgg'));
        }
    });
})();

//SP值自动更新
Class('SPUpdate', {
    interval: 1000*60*5,//5分种读取一次
    index:function (isgg){
        var Y = this;
        this.xml = '/xml/live/'+this.C('spXml')+'_'+(isgg ? 2 : 1)+'.xml';
        setInterval(function() {
            Y.querySP()
        },this.interval);
    },
    querySP: function (){
        this.ajax({url: this.xml, cache: true, end: function (data){
            if (!data.error) {
                var d = [];
                this.qXml('//m', data.xml, function (o){
                    d.push(o.items)
                });
                this.postMsg('msg_update_sp', d)
            }
        }})
    }
});

//回到顶部链接
Class('ScrollStill', {
	index : function() {
		var Y = this;
		this.goTop = this.one('a.back_top');
		this.rightArea = this.get('div.dc_r');
		this.mainArea = this.get('#main');
		if (this.ie && this.ie == 6) {
			this.goTop.style.position = 'absolute';
			this.goTop.style.left = '750px';
		} else {
			setTimeout( function() {
				Y.goTop.style.left = Y.rightArea.getXY().x-10 + 'px';
			}, 500 );
		}
		this.get(window).scroll( function () {
			clearTimeout(Class.C('scrollTimer'));
			if (Y.ie && Y.ie == 6) {
				Class.C('scrollTimer', setTimeout(Y.scrollStillIE6.proxy(Y), 100));
			} else {
				Class.C('scrollTimer', setTimeout(Y.scrollStillOthers.proxy(Y), 100));
			}
		});
	},
	scrollStillOthers : function() {
		var window_size = Y.getSize();
		Y.goTop = Y.get('a.back_top');
		Y.mainArea = Y.get('#main');
		Y.leftArea = Y.get('#main div.dc_l');
		Y.rightArea = Y.get('#main div.dc_r');
		var right_xy = Y.rightArea.getXY();
		var right_size = Y.rightArea.getSize();
		if (window_size.scrollTop + window_size.offsetHeight > Y.mainArea.getXY().y + Y.mainArea.getSize().offsetHeight + 10) {
			Y.goTop.setStyle('position', 'absolute').setStyle('bottom', 0).setStyle('left', '750px');
		} else {
			Y.goTop.setStyle('position', 'fixed').setStyle('bottom', '10px').setStyle('left', right_xy.x-10 + 'px');
		}
		if (window_size.scrollTop <= right_xy.y || 
				right_xy.y + right_size.offsetHeight + 90 > window_size.scrollTop + window_size.offsetHeight ||
				Y.leftArea.getSize().offsetHeight - 90 < right_size.offsetHeight) {
			Y.goTop.hide();
		} else {
			Y.goTop.show();
		}
	},
	scrollStillIE6 : function() {
		var window_size = Y.getSize();
		Y.goTop = Y.get('a.back_top');
		Y.mainArea = Y.get('#main');
		Y.leftArea = Y.get('#main div.dc_l');
		Y.rightArea = Y.get('#main div.dc_r');
		var right_xy = Y.rightArea.getXY();
		var right_size = Y.rightArea.getSize();
		if (window_size.scrollTop + window_size.offsetHeight > Y.mainArea.getXY().y + Y.mainArea.getSize().offsetHeight + 10) {
			Y.goTop.setStyle('top', '').setStyle('bottom', 0);
		} else {
			Y.goTop.setStyle('top', window_size.scrollTop + window_size.offsetHeight - 310 + 'px');
		}
		if (window_size.scrollTop <= right_xy.y || 
				right_xy.y + right_size.offsetHeight + 90 > window_size.scrollTop + window_size.offsetHeight || 
				Y.leftArea.getSize().offsetHeight - 90 < right_size.offsetHeight) {
			Y.goTop.hide();
		} else {
			Y.goTop.show();
		}
	}
});

//引导启动类
    Class({
        ready: true,
		index:function (){
        	this.lib.LoadExpect();
        	 this.goTotop();//返回顶部
        	Class.C('odds_t','jczq/odds'); 
        	this.oneodds=true;
    		this.onMsg('load_duizhen_succ', function () {
    			this._index();
    			this.sethref();
    		});            
        },
        
        sethref:function() {
        	var lottype=parseInt(this.need('#playid').val());
    		this.ajax({
    				url:"/cpdata/omi/jczq/odds/odds.xml",
    				end:function(data,i){
           			 var htid =1;
                        this.qXml('//row', data.xml, function (u, i){
                       	 $("#mn"+u.items.xid).attr("href","http://info.159cai.com/league/index/"+u.items.lid);
                    	 Y.get("#hn"+u.items.xid).attr("href","http://info.159cai.com/team/index/"+u.items.htid);
                    	 	Y.get("#gn"+u.items.xid).attr("href","http://info.159cai.com/team/index/"+u.items.gtid);
                 	 	$("#ox"+u.items.xid).attr("href","http://odds.159cai.com/match/analysis/"+u.items.oddsmid+"?lotyid=6");
          				$("#oz"+u.items.xid).attr("href","http://odds.159cai.com/match/odds/"+u.items.oddsmid+"?lotyid=6");
          				$("#oy"+u.items.xid).attr("href","http://odds.159cai.com/match/asia/"+u.items.oddsmid+"?lotyid=6");
                       	 $("#htid"+u.items.xid+" ").attr("data",u.items.htid);
        				 $("#gtid"+u.items.xid+" ").attr("data",u.items.gtid);
               				if(lottype==34 || lottype==42){//添加赔率信息
               					Y.get("#oh"+u.items.xid).html(parseFloat(u.items.oh).rmb(false,2));
            					Y.get("#od"+u.items.xid).html(parseFloat(u.items.od).rmb(false,2));
            					Y.get("#oa"+u.items.xid).html(parseFloat(u.items.oa).rmb(false,2));
               				}
                        }); 
                        if(this.oneodds){
                            var xhhistory = "";
                    		 if(Class.config('playId')=="51"){
                    			 xhhistory="tr td a em";
                       	     historyMatchOdds({
          	                         items: xhhistory,
          	                         tipid: 'odds_tip',
          	                         tip: '#odds_tip',
          	                         fleft: 260
          	                     }); 
                       	  $("#sssx").sssx_select_name();
                 	     $("#jztime").jztime_select_name();
 	                     $("#oddstype").odds_select_name();
       	                     // load_odds_sp();
       	                     ozOdds({
          	                         items: '.pjpl',
          	                         tipid: 'odds_tip',
          	                         tip: '#odds_tip',
          	                         path: '/data/static/odds/jczq/oz'
          	                     });    			 
                    			 
                    		 }

   	                     this.oneodds = false;
                        }
           		}
    				});
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
    	        			H = $("#main").eq(0),
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
    	        					V.css({left: "auto",top: Z+$(window).scrollTop(), width: F,position: "absolute"});
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
			this.lib.ScrollStill();
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

/* ZhushuCalculator 过关注数计算
------------------------------------------------------------------------------*/
Class( 'ZhushuCalculator', {
    ready: true,
	ggm2num : {
		'单关':[1], '2串1':[2], '2串3':[2, 1], '3串1':[3], '3串3':[2], '3串4':[3, 2], '3串7':[3, 2, 1], '4串1':[4], '4串4':[3], '4串5':[4, 3], '4串6':[2],'4串11':[4, 3, 2], '4串15':[4, 3, 2, 1], '5串1':[5], '5串5':[4], '5串6':[5, 4], '5串10':[2], '5串16':[5, 4, 3], '5串20':[3, 2], '5串26':[5, 4, 3, 2], '5串31':[5, 4, 3, 2, 1], '6串1':[6],  '6串6':[5],'6串7':[6, 5],'6串15':[2], '6串20':[3], '6串22':[6, 5, 4], '6串35':[3,2],'6串42':[6, 5, 4, 3], '6串50':[4, 3, 2],'6串57':[6, 5, 4, 3, 2], '6串63':[6, 5, 4, 3, 2, 1], '7串1':[7], '8串1':[8], '9串1':[9], '10串1':[10], '11串1':[11], '12串1':[12], '13串1':[13], '14串1':[14], '15串1':[15],
        '7串7':[6],'7串8':[7,6],'7串21':[5],'7串35':[4],'7串120':[7,6,5,4,3,2],'8串8':[7],'8串9':[8,7],'8串28':[6],'8串56':[5],'8串70':[4],'8串247':[8,7,6,5,4,3,2]
	},
	type2nm : {
		'单关':{'n':1, 'm':1}, '2串1':{'n':2, 'm':1}, '2串3':{'n':2, 'm':3}, '3串1':{'n':3, 'm':1}, '3串4':{'n':3, 'm':4}, '3串7':{'n':3, 'm':7}, '4串1':{'n':4, 'm':1}, '4串5':{'n':4, 'm':5}, '4串11':{'n':4, 'm':11}, '4串15':{'n':4, 'm':15}, '5串1':{'n':5, 'm':1}, '5串6':{'n':5, 'm':6}, '5串16':{'n':5, 'm':16}, '5串26':{'n':5, 'm':26}, '5串31':{'n':5, 'm':31}, '6串1':{'n':6, 'm':1}, '6串7':{'n':6, 'm':7}, '6串22':{'n':6, 'm':22}, '6串42':{'n':6, 'm':42}, '6串57':{'n':6, 'm':57}, '6串63':{'n':6, 'm':63}, '7串1':{'n':7, 'm':1}, '8串1':{'n':8, 'm':1}, '9串1':{'n':9, 'm':1}, '10串1':{'n':10, 'm':1}, '11串1':{'n':11, 'm':1}, '12串1':{'n':12, 'm':1}, '13串1':{'n':13, 'm':1}, '14串1':{'n':14, 'm':1}, '15串1':{'n':15, 'm':1},
        '7串7':{'n':7, 'm':7},'7串8':{'n':7, 'm':8},'7串21':{'n':7, 'm':21},'7串35':{'n':7, 'm':35},'7串120':{'n':7, 'm':120},'8串8':{'n':8, 'm':8},'8串9':{'n':8, 'm':9},'8串28':{'n':8, 'm':28},'8串56':{'n':8, 'm':56},'8串70':{'n':8, 'm':70},'8串247':{'n':8, 'm':247}
	},

	index : function() {
		this.onMsg('msg_get_zhushu', function(codes, ggtype, arrayGgType) {
			return this.countZhushu(codes, ggtype, arrayGgType);
		} );
        this.onMsg('msg_get_duoc2zy', function (name){
            return this.ggm2num[name]||[]
        })
	},
	
	countZhushu : function(codes, ggtype, ggmlist, isSplit){
		var Y = this;
		var base_count = 0;
		if (ggmlist) {
            if (ggtype != 3 && !isSplit) {//如果不是自由，而且非拆分后，先去拆分
                return this._getDCZS(codes, ggtype, ggmlist)
            }
			var t, d, t2=[], d2=[];
			codes.each(function(o){
				(o.dan?d2:t2).push(o.data.length);
			});
			t = this.arrayGetNum(t2);
			d = this.arrayGetNum(d2);
			var ar = ggtype==3 ? this.arrayEach(ggmlist,function(s){return Y.type2nm[s].n},[]).reverse() : this.ggm2num[ggmlist.toString()];
            base_count = d.length==0?this.esunjsC(t,ar):this.calCount(t,d,ar);			
		}
		return base_count;
	},

    _getDCZS: function (codes, ggtype, ggmlist){
        var Y = this, group, sum = 0, d=[], t=[];//不去重的多串过关,先拆分成低串组
        codes = codes.map(function (item){
            var v=item.data.length;
            if (item.dan) {
                d.push(v)
            }else{
                t.push(v)
            }
           return v
        });
        if (d.length) {//胆
            group = Math.dtl(d, t, this.getInt(ggmlist));//拆成x个n串m
        }else{
            group = Math.cl(codes, this.getInt(ggmlist));//拆成x个n串m
        }        
        for (var i =  group.length; i--;) {
            //sum += Y.countZhushu(group[i], ggtype, ggmlist, true)
            sum += this.getDCZs(group[i], ggmlist+'')
        }
        return sum
    },

	//计算注数(去重复有胆)
	calCount : function (t, d, ar) {
		var dn = 0, mp = 1, Y = this;
		for (var i=0,l=d.length; i<l; i++) {
			dn += d[i][1];
			mp *= Math.pow(d[i][0], d[i][1]);
		}
		var n = 0;
		this.arrayCallEach(ar, function(m){
			n += m>dn ? Y.esunjsC(t,m-dn)*mp : Y.esunjsC(d,m);
		});
		return n;
	},

	esunjsC : function (a, num) {
		var Y = this;
		if (typeof(a[0])=="number") a=this.arrayGetNum(a);
		if (typeof(num)=="number") num=[num];
		var r = 0;
		var n = a.length;
		var ff = function (n,i){ return Math.pow(a[i][0],n) * Math.c(a[i][1],n) };
		(function f(t,i){
			if(i==n){//如果
				if (Y.arrayGetIdx(num, Y.arrayAdd(t))>-1) r += Y.arrayMultiple(Y.arrayEach(t,ff,[]));
				return;
			}
			for(var j=0; j<=a[i][1]; j++) f(t.concat(j), i+1);
		})([], 0);
		return r;
	},

	arrayGetIdx : function(a, v){// 数组元素位置
		for (var i=0,l=a.length;i<l&&a[i]!=v;i++);
		return i<l ? i : -1;
	},

	arrayAdd : function(a){//求和
		var n = 0;
		for (var i=0,l=a.length;i<l;i++) n+=a[i];
		return n;
	},

	arrayMultiple : function(a){//求积
		var n = 1;
		for (var i=0,l=a.length;i<l;i++) n*=a[i];
		return n;
	},

	arrayEach : function(a, cb, r){//map
		if(r) for(var i=0,t,l=a.length;i<l;i++)(t=cb(a[i],i))!=undefined&&r.push(t);// 复制到
		else for(var i=a.length-1;i>=0;i--)(a[i]=cb(a[i],i))==undefined&&a.splice(i,1);//剪切出来
		return r||a;
	},

	arrayGetNum : function (a){
		var r = [], o = {};
		for (var i=0,l=a.length; i<l; i++){
			o[a[i]] ? o[a[i]]++ : o[a[i]]=1;
		}
		for (var j in o) r.push([j,o[j]]);
		return r;
	},

	arrayCallEach : function(a, cb){//遍历
		for (var i=0,l=a.length;i<l;i++) cb(a[i], i);
	}
});
//多串过关计算注数
(function (){
    Number.prototype.toFixedFix= function(s){
        return parseInt(this * Math.pow( 10, s ) + 0.5)/ Math.pow( 10, s );
    };
    function $Tran(){//连乘
        var a=Array.prototype.slice.call(arguments),t=1,n=10000;
        if(!a.length)return 0;
        while(a.length)t*=(a.pop()*n)/n;
        return t
    };
    function $CL(arr,n,noLC) {//从arr中取n个组合，然后
        var r = [],sum=0;
        (function f(t, a, n) {
            if (n == 0) return r.push(t);
            for (var i = 0,
            l = a.length - n; i <= l; i++) {
                f(t.concat(a[i]), a.slice(i + 1), n - 1);
            }
        })([], arr, n);
        if(noLC)return r;//返回一个组合数组[[],[],[]]
        for(var i=r.length;i--;)sum+=get1(r[i]);//计算每个组合的连乘的和
        return sum;
    };
    function get1(arr){return $Tran.apply(null,arr)||0};//对数组进行连乘
    function get2(arr){return get1(arr)+$CL(arr,arr.length-1)};//一个基本串+(n-1)个串一[跳到CL进行拆分然后求单组的和]
    function get3(arr){return get2(arr)+$CL(arr,arr.length-2)};
    function get4(arr){return get3(arr)+$CL(arr,arr.length-3)};
    function get5(arr){return get4(arr)+$CL(arr,arr.length-4)};//n-4 -> n
    function get7_2(arr){return get5(arr)+$CL(arr,arr.length-5)};
    function get8_2(arr){return get7_2(arr)+$CL(arr,arr.length-6)};
    function get6(arr){return $CL(arr,arr.length-1)};
    function get7(arr){return $CL(arr,arr.length-2)};
    function get8(arr){return $CL(arr,arr.length-3)};
    function get9(arr){return $CL(arr,arr.length-4)};
    Class.extend('getDCZs', function(arr/*intArray*/,ggType) {//[3,2,2,1]选赛果个数, 'n串m'
        switch (ggType){
            case '2串1':case '3串1':case '4串1':case '5串1':case '6串1':case '7串1':case '8串1':case '9串1':case '10串1':
            case '11串1':case '12串1':case '13串1':case '14串1':case '15串1':return get1(arr);//n, 串1直接连乘
            case '3串4':case '4串5':case '5串6':case '6串7':case '7串8':case '8串9':return get2(arr);// n, n-1
            case '4串11':case '5串16':case '6串22':return get3(arr);//n, n-1, n-2
            case '5串26':case '6串42':return get4(arr);//n, n-1, n-2, n-3
            case '6串57':return get5(arr);//n, n-1, n-2, n-3, n-4
            case '7串120':return get7_2(arr);//n, n-1, n-2, n-3, n-4, n-5
            case '8串247':return get8_2(arr);//n, n-1, n-2, n-3, n-4, n-5, n-6
            case '3串3':case '4串4':case '5串5':case '6串6':case '7串7':case '8串8':return get6(arr);// n-1
            case '4串6':case '7串21':case '8串28':return get7(arr);//n-2
            case '5串10':case '6串20':case '7串35':case '8串56':return get8(arr);//n-3
            case '5串20':return get8(arr)+get7(arr);//n-2, n-3
            case '6串15':case '8串70':return get9(arr);//n-4
            case '6串35':return get8(arr)+get9(arr);//n-3, n-4
            case '6串50':return get8(arr)+get7(arr)+get9(arr);//n-2, n-3, n-4
            default: return 0;
        }
    })
})();
//设置某个标签在某个区域内是静止的
Class.fn.setFixed = function (opt){
    var Y = this.ns, Yn = this, ini = this.ns.mix({
        onin: Y.getNoop(),//移入
        onout: Y.getNoop(),//移出区域
        area: document.body,//默认区域为body
        offset: 0//偏移
    }, opt), areaTop, clearCache, isout = true;
    this.area = this.get(ini.area);
    if (Y.ie == 6 && !Y.C('-html-bg-fixed')) {//修正ie6闪烁
        Y.C('-html-bg-fixed', true);
        var ds = document.documentElement.style;
        ds.backgroundImage = 'url(about:blank)';
        ds.backgroundAttachment = 'fixed';   
    }
    if(window.Node){//添加IE独有方法 replaceNode, swapNode
        Node.prototype.replaceNode=function($target){
            return this.parentNode.replaceChild($target,this);
        }
        Node.prototype.swapNode=function($target){
            var $targetParent=$target.parentNode;
            var $targetNextSibling=$target.nextSibling;
            var $thisNode=this.parentNode.replaceChild($target,this);
            $targetNextSibling?$targetParent.insertBefore($thisNode,$targetNextSibling):$targetParent.appendChild($thisNode);
            return this;
        }
    }
    if(opt.init){
    	opt.init.call(this)
    }
    this.get(window).scroll(handle);
    function handle(){
        clearTimeout(clearCache);
        if (!areaTop) {//优化滚动时每次计算区域位置
            clearCache = setTimeout(function() {
                areaTop = false
            },50);
            areaTop = Y.get(ini.area).getXY().y;
        }
        var sTop = Math.max(document.body.scrollTop || document.documentElement.scrollTop);
        if (sTop > areaTop) {//跟踪对齐
            if (isout) {
                isout = false;
                ini.onin.call(Yn, ini.area);
                Yn.each(function (el){//存储top值
                    Y.get(el).data('-fixed-before-top', el.style.top);
                })
            }
            if (Y.ie == 6) {
                Yn.each(function (el){
                    el.style.position = 'absolute';
                    el.style.setExpression('top', 'eval((document.documentElement||document.body).scrollTop+' + ini.offset + ') + "px"')
                })                 
            }else{
                Yn.setStyle('position:fixed;top:'+ini.offset+'px');
            }
        }else{//停止浮动对齐
            if (!isout) {
                isout = true;
                ini.onout.call(Yn, ini.area);                
            }
            if (Y.ie == 6) {
                Yn.each(function (el){
                    el.style.removeExpression('top');
                    el.style.top = Y.get(el).data('-fixed-before-top') || '';
                })
            }else{
                Yn.each(function (el){
                    el.style.position = '';
                    el.style.top = Y.get(el).data('-fixed-before-top') || '';
                })
            }            
        } 
   } 
   return this
};
$.fn.jztime_select_name=function(){
	$self=$(this);
	$self.each(function(){
		var $div1=$self.find("div.matchxz");
		var $div2=$self.find("div.jcslt");
		$div1.mouseover(function(){
			$div2.show();
			$div1.addClass("matchxzc");
			return false;	
		});
		$div1.mouseout(function(){
			$div2.hide();
			$div1.removeClass("matchxzc");
		});
		$div2.mouseover(function(){
			$div2.show();
			$div1.addClass("matchxzc");
			return false;	
		});
		$div2.mouseout(function(){
			$div2.hide();
			$div1.removeClass("matchxzc");
		});
		$div2.find("a").click(function(){
			$(this).blur();  
			var txt=$(this).text();
			var ctxt=$(this).attr("value");
			 Y.postMsg('msg_change_time', ctxt);
			$div1.find("em").attr("value", ctxt);
			$div1.find("em").text(txt);
			$div2.hide();
			$div1.removeClass("matchxzc");
			return false;	
		});
	});
}
$.fn.sssx_select_name=function(){
	$self=$(this);
	$self.each(function(){
		var $div1=$self.find("div.matchxz");
		var $div2=$self.find("div.jcslt");
		$div1.mouseover(function(){
			$div2.show();
			$div1.addClass("matchxzc");
			return false;	
		});
		$div1.mouseout(function(){
			$div2.hide();
			$div1.removeClass("matchxzc");
		});
		$div2.mouseover(function(){
			$div2.show();
			$div1.addClass("matchxzc");
			return false;	
		});
		$div2.mouseout(function(){
			$div2.hide();
			$div1.removeClass("matchxzc");
		});
	
	});
}
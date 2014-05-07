Class.C('lege_sele_data',{
	teamFive: ["德甲","西甲","法甲","意甲","英超"],
	teamHot: ["世界杯","联合会杯","女世界杯","世预赛","亚洲杯","亚预赛","亚冠","澳超","日职","欧洲杯","欧冠","欧罗巴",
	          "英冠","德乙","法乙","荷甲","葡超","苏超","瑞超","挪超","解放者杯","巴甲","阿甲","美职联"] //热门赛事 除五大联赛之外还有【】
});

Class.extend('getTeamisExist', function (mode, data){//数组是否包含
	var s = Class.C('lege_sele_data')[mode];
	for(var i=0;i<s.length;i++){
		if(s[i] == data)
			return true;  
	}
	return false;  
});
Class.C('chuan',0);
Class.C('chuanlength',0);
/*w
*  竞彩足球混串玩法
*  2012-12-15
*/
//选择器虚拟管理器
Yobj.optsAdm = {
	data: {},
	add: function (bid, tr123){
		var _self = this,
			spf = Yobj.get(tr123).find('td>a[data-type=spf]').nodes,
			rqspf = Yobj.get(tr123).find('td>a[data-type=rqspf]').nodes;
			jqs = Yobj.get(tr123).next('tr').find('td>a[data-type=jqs]').nodes;
			bqc = Yobj.get(tr123).next('tr').find('td>a[data-type=bqc]').nodes;
			bf = Yobj.get(tr123).next('tr').find('td>a[data-type=bf]').nodes;
			
		if(spf.length==3){
			_self.set(bid, spf[0].getAttribute('data-type') + spf[0].getAttribute('value'), false, spf[0].getAttribute('data-sp'));
			_self.set(bid, spf[1].getAttribute('data-type') + spf[1].getAttribute('value'), false, spf[1].getAttribute('data-sp'));
			_self.set(bid, spf[2].getAttribute('data-type') + spf[2].getAttribute('value'), false, spf[2].getAttribute('data-sp'));
		}
		
		if(rqspf.length==3){
			_self.set(bid, rqspf[0].getAttribute('data-type') + rqspf[0].getAttribute('value'), false, rqspf[0].getAttribute('data-sp'));
			_self.set(bid, rqspf[1].getAttribute('data-type') + rqspf[1].getAttribute('value'), false, rqspf[1].getAttribute('data-sp'));
			_self.set(bid, rqspf[2].getAttribute('data-type') + rqspf[2].getAttribute('value'), false, rqspf[2].getAttribute('data-sp'));
		}
		if(jqs.length==8){
			_self.set(bid, jqs[0].getAttribute('data-type') + jqs[0].getAttribute('value'), false, jqs[0].getAttribute('data-sp'));
			_self.set(bid, jqs[1].getAttribute('data-type') + jqs[1].getAttribute('value'), false, jqs[1].getAttribute('data-sp'));
			_self.set(bid, jqs[2].getAttribute('data-type') + jqs[2].getAttribute('value'), false, jqs[2].getAttribute('data-sp'));
			_self.set(bid, jqs[3].getAttribute('data-type') + jqs[3].getAttribute('value'), false, jqs[3].getAttribute('data-sp'));
			_self.set(bid, jqs[4].getAttribute('data-type') + jqs[4].getAttribute('value'), false, jqs[4].getAttribute('data-sp'));
			_self.set(bid, jqs[5].getAttribute('data-type') + jqs[5].getAttribute('value'), false, jqs[5].getAttribute('data-sp'));
			_self.set(bid, jqs[6].getAttribute('data-type') + jqs[6].getAttribute('value'), false, jqs[6].getAttribute('data-sp'));
			_self.set(bid, jqs[7].getAttribute('data-type') + jqs[7].getAttribute('value'), false, jqs[7].getAttribute('data-sp'));
		}
		if(bqc.length==9){
			_self.set(bid, bqc[0].getAttribute('data-type') + bqc[0].getAttribute('value'), false, bqc[0].getAttribute('data-sp'));
			_self.set(bid, bqc[1].getAttribute('data-type') + bqc[1].getAttribute('value'), false, bqc[1].getAttribute('data-sp'));
			_self.set(bid, bqc[2].getAttribute('data-type') + bqc[2].getAttribute('value'), false, bqc[2].getAttribute('data-sp'));
			_self.set(bid, bqc[3].getAttribute('data-type') + bqc[3].getAttribute('value'), false, bqc[3].getAttribute('data-sp'));
			_self.set(bid, bqc[4].getAttribute('data-type') + bqc[4].getAttribute('value'), false, bqc[4].getAttribute('data-sp'));
			_self.set(bid, bqc[5].getAttribute('data-type') + bqc[5].getAttribute('value'), false, bqc[5].getAttribute('data-sp'));
			_self.set(bid, bqc[6].getAttribute('data-type') + bqc[6].getAttribute('value'), false, bqc[6].getAttribute('data-sp'));
			_self.set(bid, bqc[7].getAttribute('data-type') + bqc[7].getAttribute('value'), false, bqc[7].getAttribute('data-sp'));
			_self.set(bid, bqc[8].getAttribute('data-type') + bqc[8].getAttribute('value'), false, bqc[8].getAttribute('data-sp'));
		}
		if(bf.length==31){
			_self.set(bid, bf[0].getAttribute('data-type') + bf[0].getAttribute('value'), false, bf[0].getAttribute('data-sp'));
			_self.set(bid, bf[1].getAttribute('data-type') + bf[1].getAttribute('value'), false, bf[1].getAttribute('data-sp'));
			_self.set(bid, bf[2].getAttribute('data-type') + bf[2].getAttribute('value'), false, bf[2].getAttribute('data-sp'));
			_self.set(bid, bf[3].getAttribute('data-type') + bf[3].getAttribute('value'), false, bf[3].getAttribute('data-sp'));
			_self.set(bid, bf[4].getAttribute('data-type') + bf[4].getAttribute('value'), false, bf[4].getAttribute('data-sp'));
			_self.set(bid, bf[5].getAttribute('data-type') + bf[5].getAttribute('value'), false, bf[5].getAttribute('data-sp'));
			_self.set(bid, bf[6].getAttribute('data-type') + bf[6].getAttribute('value'), false, bf[6].getAttribute('data-sp'));
			_self.set(bid, bf[7].getAttribute('data-type') + bf[7].getAttribute('value'), false, bf[7].getAttribute('data-sp'));
			_self.set(bid, bf[8].getAttribute('data-type') + bf[8].getAttribute('value'), false, bf[8].getAttribute('data-sp'));
			_self.set(bid, bf[9].getAttribute('data-type') + bf[9].getAttribute('value'), false, bf[9].getAttribute('data-sp'));
			_self.set(bid, bf[10].getAttribute('data-type') + bf[10].getAttribute('value'), false, bf[10].getAttribute('data-sp'));
			_self.set(bid, bf[11].getAttribute('data-type') + bf[11].getAttribute('value'), false, bf[11].getAttribute('data-sp'));
			_self.set(bid, bf[12].getAttribute('data-type') + bf[12].getAttribute('value'), false, bf[12].getAttribute('data-sp'));
			
			
			_self.set(bid, bf[13].getAttribute('data-type') + bf[13].getAttribute('value'), false, bf[13].getAttribute('data-sp'));
			_self.set(bid, bf[14].getAttribute('data-type') + bf[14].getAttribute('value'), false, bf[14].getAttribute('data-sp'));
			_self.set(bid, bf[15].getAttribute('data-type') + bf[15].getAttribute('value'), false, bf[15].getAttribute('data-sp'));
			_self.set(bid, bf[16].getAttribute('data-type') + bf[16].getAttribute('value'), false, bf[16].getAttribute('data-sp'));
			_self.set(bid, bf[17].getAttribute('data-type') + bf[17].getAttribute('value'), false, bf[17].getAttribute('data-sp'));
			
			_self.set(bid, bf[18].getAttribute('data-type') + bf[18].getAttribute('value'), false, bf[18].getAttribute('data-sp'));
			_self.set(bid, bf[19].getAttribute('data-type') + bf[19].getAttribute('value'), false, bf[19].getAttribute('data-sp'));
			_self.set(bid, bf[20].getAttribute('data-type') + bf[20].getAttribute('value'), false, bf[20].getAttribute('data-sp'));
			_self.set(bid, bf[21].getAttribute('data-type') + bf[21].getAttribute('value'), false, bf[21].getAttribute('data-sp'));
			_self.set(bid, bf[22].getAttribute('data-type') + bf[22].getAttribute('value'), false, bf[22].getAttribute('data-sp'));
			_self.set(bid, bf[23].getAttribute('data-type') + bf[23].getAttribute('value'), false, bf[23].getAttribute('data-sp'));
			_self.set(bid, bf[24].getAttribute('data-type') + bf[24].getAttribute('value'), false, bf[24].getAttribute('data-sp'));
			_self.set(bid, bf[25].getAttribute('data-type') + bf[25].getAttribute('value'), false, bf[25].getAttribute('data-sp'));
			_self.set(bid, bf[26].getAttribute('data-type') + bf[26].getAttribute('value'), false, bf[26].getAttribute('data-sp'));
			_self.set(bid, bf[27].getAttribute('data-type') + bf[27].getAttribute('value'), false, bf[27].getAttribute('data-sp'));
			_self.set(bid, bf[28].getAttribute('data-type') + bf[28].getAttribute('value'), false, bf[28].getAttribute('data-sp'));
			_self.set(bid, bf[29].getAttribute('data-type') + bf[29].getAttribute('value'), false, bf[29].getAttribute('data-sp'));
			_self.set(bid, bf[30].getAttribute('data-type') + bf[30].getAttribute('value'), false, bf[30].getAttribute('data-sp'));
		}
	},
	get: function (bid, type){// get('8569', 'fs1')
		var vs = this.__getBid(bid);
		return vs[type] || [false , 1];
	},
	getSp: function (bid, type){
		return this.get(bid, type)[1];
	},
	set: function (bid, type, checked, sp){//type = fs1;
		var vs = this.__getBid(bid),// {'sf1': [false, 1.2]}
			data = vs[type];//[]
		if (arguments.length === 3) {
			sp = data ? data[1] : 1;
		}
		vs[type] = [checked, sp];
	},
	allSet: function (bid, selected){
		var vs = this.__getBid(bid);
		for(var k in vs){
			vs[k][0] = selected;
		}
	},
	__getBid: function (bid){
		if (bid in this.data) {
			return this.data[bid];
		}
		this.data[bid] = {};
		return this.data[bid];
	}
};

/*竞彩选号器
*************************************************************************/
Class('Selector', {
	oninit: Yobj.getNoop(),// 初始化完成
	init: function (box){
		var box = Yobj.get(box), _self = this;
		Yobj.get('#main').setStyle('overflow', 'visible');//修正层级问题
//		setTimeout(function(){
//			_self.findVsTags(box);
//		},500);
		this.setClickFx(box);
		this.otherSet(box);
		this.oninit();
		this.hotCss="a2";
		this.hotCss2 = "a2";
//		this._getList();
		if(this.allTr) this.allTr = undefined;
	},
	
	_getList: function (){
        if (!this.allTr) {//缓存
            this.allList = Y.get('#vsTable tr[fid]');
            this.allTr = this.allList.filter(function (tr){
               if (tr.getAttribute('isend') == '1') {
                   this.endList[this.endList.length] = tr;
               }else{
                   return true;
               }                     
            }, this);
        }
        return this.allTr;
   },
	
	filterTye: function(tye, checked){
		this._getList();
		var sel = 0, a;
		if(tye.indexOf('spf')>-1){
			this.allTr.each(function (tr){
				if(checked){
				
					Yobj.get(tr).find('td[dat_tye='+tye+']>a').removeClass('tdhui');
				}else{
				
					Yobj.get(tr).find('td[dat_tye='+tye+']>a').addClass('tdhui');
				}
			});
		}else{
			this.allTr.each(function (tr){
				Yobj.get(tr).next('tr').find('tr[dat_tye='+tye+']').show(checked);
				sel = Yobj.get(tr).next('tr').find('tr[dat_tye]:visited');
				a = Yobj.get(tr).find('td[mark=unselect]>a');
				if(sel.size() == 0){
					if (a.one().className.indexOf('unselecttdcur') > -1) {
		            	a.removeClass('unselecttdcur').html('未选');
		            	Yobj.get(tr).next('tr').hide(); 
		            }
				}else{
					a.addClass('unselecttdcur').html('收起');
	            	Yobj.get(tr).next('tr').show();
				}
			});
		}
	},
	filterLg: function (lgs_str){
		this._getList();
		var _self = this;
		this.allTr.each(function (tr){
			var mt = lgs_str.indexOf(tr.getAttribute('lg')) > -1;
			if (mt) {
				Yobj.get(tr).show();
			}else{
				_self._hideHH(tr);
//				Yobj.get(tr).hide();
			}
		});
		this.updateHideCount();
	},
	filterOneLg: function (lg, checked){
		this._getList();
		var _self = this;
		if(lg==""){
			this.allTr.each(function (tr){
				Yobj.get(tr).show();
			});
		}else{
			this.allTr.each(function (tr){
				if (lg.indexOf(tr.getAttribute('lg'))>-1) {
					if (checked) {
						Yobj.get(tr).show();
					}else{
						_self._hideHH(tr);
					}
				}else{
					Yobj.get(tr).show(!checked);
				}
			});
		}

		this.updateHideCount();
	},
	fileterDayLg: function(day, checked){
		this._getList();
		var _self = this;
		this.allTr.each(function (tr){
			if (day.indexOf(tr.parentNode.parentNode.getAttribute('id'))>-1) {
				if(checked) Yobj.get(tr).show(checked);
				else _self._hideHH(tr);
			}
		});
		
  	   this.updateHideCount();
	},
	filterAll: function(sel){
		this._getList()
		var _self = this;
		this.allTr.each(function (tr){
			if(sel){
				Yobj.get(tr).show(sel);
			}else{
				_self._hideHH(tr);
			}
		});
		this.updateHideCount();
	},
	_hideHH: function (target){
		Yobj.get(target).each(function (t){
            var tr=this.get(t);
            tr.hide();
            tr.get('a.cm_w103').removeClass('cm_hhgg_bg_hover').html('<i class="cm_left">展开</i><em class="cm_jsbf_down"></em>');
            tr.next('tr').hide();
        }, this);
    },
	updateHideCount: function (){
//		this.hideNum = this.allTr.filter(function (sum, tr){
//			return sum += (tr.style.display == 'none' ? 1 : 0);
//		}, 0);
		 var s = 0;
         this.allTr.each(function (tr){
             s += tr.style.display == 'none' ? 1 : 0;
         });
         this.hideNum = s;
		this.setHideNum();
	},
	tagChange: function(tag, vals){
		if(tag){
            if(vals.length>0){
           	 tag.addClass('a2');
           	 if(vals.length==1){
           		 tag.html(vals[0]);
           	 }else{
           		 tag.html('已选<font>'+vals.length+'</font>项');
           	 }
            }else{
           	 tag.removeClass('a2');
           	 Y.get("td[mark=unselect]").html("<a>未选</a>").removeClass("unselecttdcur"); 
            }
        }
	},
	hideNum: 0,
	//显示隐藏场数
	setHideNum: function (){
		Yobj.get('#hide_count').html(this.hideNum);
	},
	counthidenmu:function(itemid){
  		var Y=this;
  		var num =0;//统计隐藏场数
  		Y.need('tr[pname^='+itemid+']').each(function(o,n){
  				if(o.style.display=="none"){
  					num++;
  				}
  		});
  		$("#yccs_"+itemid).html(num);
  		Y.isshowall(itemid);
  	},
  	isshowall:function(itemid){
  		var Y=this;
  		$("a[id^=showall_"+itemid+"]").click(function(){//显示所有已隐藏的赛事
  			Y.need('tr[pname^='+itemid+']').show();
  			$("#yccs_"+itemid).html(0);
  		});	
  		
  	},
	onshowAll: function(){},
	//显隐一些对阵
	otherSet: function (box){
		var _self = this;
		//显隐周赛
		box.find('a[mark=hidetable]').click(function(e,Y){
			var s = Y.get(this).one();
//            Y.get(this).parent('div').next('div.cm_border').show(!Y.hasClass(s.lastChild ,'cm_jsbf_up'));
            if(Y.get(s).html()=="隐藏"){
            	Y.get(s).html('显示').parent('div').next('table').hide();
            }else{
	          	 
	          	 Y.get(s).html('隐藏').parent('div').next('table').show();
	          	 
            }
		});
	},
	//弹出更多层
	popMoreLayer: function (lay, p, allLayer){
		var bid = p.getAttribute('data-id');
		var tr = this.getTr1(bid);
		var posTd = tr.find('input[data-type='+p.getAttribute('data-type')+']').parent('td');
		this.currentExlay = lay;
		lay.update(bid, p);
		lay.show(posTd);
	},
	//选项点击时回调处理
	clickCallBack: function (chk){
		if (chk.getAttribute('data-type')|| chk.className.indexOf('sh_quanxuan')>-1) {
			this.optionChange(chk);
		}		
	},
	//点击对阵选项, 用户选择回调
	setClickFx: function (box){
		var _self = this;
		box.live('td>a[data-id]', 'click', function (e){
			_self.allTr = undefined;
			_self.clickCallBack(this);
		}).live('td.sh_quanxuan','click', function(e){//全选
			_self.allTr = undefined;
			_self.clickCallBack(this);
		}).live('tr[fid]', 'mouseover', function(e){
			_self.allTr = undefined;
			_self.get(this).addClass('cm_hhgg_hover');
//			_self.get(this).find('div.cm_jc_sc').show();
			$(this).find('div.cm_jc_sc').css('display','block');
		}).live('tr[fid]', 'mouseout', function(e){
			_self.allTr = undefined;
			_self.get(this).removeClass('cm_hhgg_hover');
			$(this).find('div.cm_jc_sc').css('display','none');
		}).live('label[mark=name]', 'click', function(e){
			_self.allTr = undefined;
			var tr = Yobj.get(this).parent('tr').eq(0);
			tr.hide();
			tr.next('tr').hide();
			_self.hideNum++;
			_self.setHideNum();
			 var itemid;
             itemid = _self.get(this).parent('tr').attr("pname").substring(0, 6);//130607
             _self.counthidenmu(itemid);
             
		}).live('td[mark=unselect]', 'click', function (e){
			_self.allTr = undefined;
			var tr = _self.get(this).parent('tr').next('tr');
			var a = _self.get(this);
            if ($(this).hasClass("unselecttdcur")) {
            	a.removeClass('unselecttdcur').find("a").html('未选');
//            	a.removeClass('cm_hhgg_bg_hover').find('em').prop('className', 'cm_jsbf_down');
                tr.hide(); 
            }else{
            	a.addClass('unselecttdcur').find("a").html('收起');
//            	a.addClass('cm_hhgg_bg_hover').find('em').prop('className', 'cm_jsbf_up');
                tr.show();
                tr.find('tr[dat_tye]').show();
            }
		});
	},
	//是否超出最大场次
	isOverMaxVs: function (bid){
		return Yobj.postMsg('get-selector-selected', bid).data > 14;
	},
	onchange: Yobj.getNoop(),
	//重新统计选项
	optionChange: function (chk){
		var s = this;
		var bid  = chk.className.indexOf("sh_quanxuan")>-1? s.get(chk).prev('td').child('a').attr('data-id'):chk.getAttribute('data-id');
		var tr = Y.get('#vs'+bid);
		
	    var trpanel = tr.find('td.unselect ');
		if (!tr.data('xhtag')) {
            tr.data('xhtag', []);
        }
		if (!tr.data('scm')) {
            tr.data('scm', []);
        }
		var xtag = tr.data('xhtag'), scm = tr.data('scm');
		var isspf = chk.className.indexOf("sh_quanxuan")==-1? chk.getAttribute('data-type').indexOf('spf')>-1? true:false:false;
		var chks = chk.className.indexOf("sh_quanxuan")>-1? s.get(chk).prev('td').find('a'):s.get(chk).parent('td').find('a'),
				allchk = chk.className.indexOf("sh_quanxuan")>-1? s.get(chk):s.get(chk).parent('td').next('td');

		var isq = chk.className.indexOf("sh_quanxuan")>-1? chk.firstChild.innerHTML=='全'? true:false:false;
		if(chk.className.indexOf("sh_quanxuan")>-1){
			s.get(chk).prev('td').find('a').each(function(e,Y){
				xtag.remove(e.firstChild.innerHTML);
				if(isq){
					s.get(e).addClass(s.hotCss);
					xtag.push(e.firstChild.innerHTML);
					scm[scm.length]=e.getAttribute('data-type')+e.getAttribute('value');
				}else{
					s.get(e).removeClass(s.hotCss);
					xtag.remove(e.firstChild.innerHTML);
					scm.remove(e.getAttribute('data-type')+e.getAttribute('value'));
				}
				
				if (isq) {
					s.lastChk = e;// 记录最后点击的复选框， 以恢复溢出;
				}
			});
//			if(isq) chk.firstChild.innerHTML='清'; else chk.firstChild.innerHTML='全';
		}else{
			Y.get(chk).toggleClass(isspf? s.hotCss2:s.hotCss);
			var checked = chk.className.indexOf(isspf? s.hotCss2:s.hotCss)>-1? true: false;
			if(!isspf){
				if(checked){
					xtag.push(chk.firstChild.innerHTML);
					scm[scm.length]=chk.getAttribute('data-type')+chk.getAttribute('value');
				}else{
					xtag.remove(chk.firstChild.innerHTML);
					scm.remove(chk.getAttribute('data-type')+chk.getAttribute('value'));
				}
			}else{
				if(checked)
				scm[scm.length]=chk.getAttribute('data-type')+chk.getAttribute('value');
				else scm.remove(chk.getAttribute('data-type')+chk.getAttribute('value'));
			}
			
			if (checked) {
				this.lastChk = chk;// 记录最后点击的复选框， 以恢复溢出;
			}
		}
		
        if(!isspf){
        	var opts = chks.filter(function (el){
                return el.className.indexOf(isspf? s.hotCss2:s.hotCss)>0;
            });
            if (opts.size()==chks.size()) {
            	allchk.find('span').html('清');
            }else{
            	allchk.find('span').html('全');
            }
            
        	s.tagChange(trpanel, xtag);
        }
        
		if (this.isOverMaxVs(bid)) {
			this.resetLast();
			Yobj.alert('您好， 最多只能选择15场比赛!');
		}else{
			this.onchange(bid);//事件由号码框响应
//			this.updateMoreBtn(bid, Yobj.optsAdm.__getBid(bid), type == 'spf' || type == 'rqspf' ? false : type);//同步更多按钮			
		}
		if(scm.length>0)
		{
			$('#vs'+bid).removeAttr("baoliu");
			if($("#lotid") && "70" == $("#lotid").val())
			{
				$(chk).parent().parent().removeAttr("baoliu");
			}
		}
		else
		{
			tr.attr("baoliu","1");
			if($("#lotid") && "70" == $("#lotid").val())
			{
				$(chk).parent().parent().attr("baoliu","1");
			}
		}
	},
	//注数超出时回复
	resetLast: function (){
		var chk = this.lastChk;
		if (chk) {
			chk.checked = false;
			this.lastChk = null;
			if (chk.isinlay) {
				var lay = this.getLayByType(chk.getAttribute('data-type'));
				if (lay) {
					lay.optionClick(chk);//模拟层点击
				}
			}else{
				this.clickCallBack(chk);//手动取消这个选项
			}			
		}
	},
	//统计隐藏项选中数
	updateSelectNum: function (bid){
		var table = this.getTr1(bid).find('table.tb_sfc_s'),
			tag = table.prev('span').nodes[0];
		if (tag) {
			tag.selectedNum = table.find('input:checked').size();
		}
	},
	getTrs: function (bid){
		return Yobj.get('#vs' + bid);
	},
	getTr1: function (bid){
		return Yobj.get('#vs'+bid);
	},
	setTdBg: function (chk){
		var td = Yobj.get(chk).parent('li');
		if (chk.checked) {
			td.addClass('label_cd');
		}else{
			td.removeClass('label_cd');
		}
	},
	synState: function (opts, data, vals, tr){
		var _self = this,
		    scm = _self.get(tr).data('scm');
		opts.each(function (chk){//一个一个的同步
			var set = chk.getAttribute('data-type')+chk.getAttribute('value');
			if($_sys.getSub(data, set)>-1){
				_self.get(chk).addClass(chk.getAttribute('data-type').indexOf('spf')>-1? _self.hotCss2:_self.hotCss);
			}else{
				_self.get(chk).removeClass(chk.getAttribute('data-type').indexOf('spf')>-1? _self.hotCss2:_self.hotCss);
				vals.remove(chk.getAttribute('data-type').indexOf('spf')>-1? chk.getAttribute('data_val'):chk.firstChild.innerHTML);
				scm.remove(set);
			}
		});	
	},
	//用号码来选择一个对阵
	setCode: function (bid, sel){//
		var arr = new Array();
        arr[0] = this.one('#vs'+bid);
        arr[1] = this.get('#vs'+bid).next().one();
        var trs = arr, trpanel = this.getTrs(bid).find('td[mark=unselect]'),xtag = this.getTrs(bid).data('xhtag'),
			opts = this.get(trs).find('a[data-type]');//找到对应的inputs组
        
		this.synState(opts, sel, xtag, arr[0]);//同步简单显示的checkbox
		this.tagChange(trpanel, xtag);
		
		var f = false,y = this;
		this.get(arr[1]).find('tr').each(function(el){
			f = false;
			Y.get(el).find('a').each(function(e){
				if(e.className.indexOf(y.hotCss)==-1){
					f=true;
				}
			});
			if(f) Y.get(el).find('td.sh_quanxuan>span').html('全');
		});
	},
	codeId2text: function (type, val){
		if (type == 'bqc') {
			return val.replace(/3/g, '胜').replace(/1/g, '平').replace(/0/g, '负');
		}else if(type == 'bf'){
			return val.replace('3A', '胜其它').replace('1A', '平其它').replace('0A', '负其它').replace(/^(\d)/, '$1-');
		}else{
			return val;
		}
	}
});


/*竞彩号码框
*************************************************************************/
Class('CodeList', {
	index: function (){
		this.tmpl_1 = Yobj.get('#choose_tpl').nodes[0];
		this.tmpl_2 = Yobj.get('#choose_tpl2').nodes[0];
		this.box = Yobj.get('#choose_list');
	},
	codes: [],
	onchange: Yobj.getNoop(),//选择的时候, 用于绑定 选择器方法
	ondatachange: Yobj.getNoop(), //用于输出号码， 绑定过关方式方法
	playids: {
		spf: "SPF>",
		rqspf: "RSPF>",
		jqs: "JQS>", 
		bf: "CBF>",
		bqc: "BQC>" 
	},
	__getGroup: function (type, bid, mp){
		return {
			id: bid,
			mps: mp + '|' + this.playids[type],
			type: type,
			code: [],
			prize: []//奖金列表
		};
	},
	bfSort: {
		"胜其它": 0,
		"1:0": 1,
		"2:0": 2,
		"2:1": 3,
		"3:0": 4,
		"3:1": 5,
		"3:2": 6,
		"4:0": 7,
		"4:1": 8,
		"4:2": 9,
		"5:0": 10,
		"5:1": 11,
		"5:2": 12,
		"平其它": 13,
		"0:0": 14,
		"1:1": 15,
		"2:2": 16,
		"3:3": 17,
		"负其它": 18,
		"0:1": 19,
		"0:2": 20,
		"1:2": 21,
		"0:3": 22,
		"1:3": 23,
		"2:3": 24,
		"0:4": 25,
		"1:4": 26,
		"2:4": 27,
		"0:5": 28,
		"1:5": 29,
		"2:5": 30
	},
	formatCode: function (type, codesArr){
		function down(a, b){
			return a > b ? -1 : 1;
		}
		function up(a, b){
			return a > b ? 1 : -1;
		}
		switch(type){
			case 'spf'://降序
			case 'rqspf'://降序
				return codesArr.sort(down);
			case 'bf'://转换后升序
				var bsSort = this.bfSort;
				return codesArr.map(function (str){
					if (str == '0') {
						return '负其它';
					}else if(str == '1'){
						return '平其它';
					}else if(str == '3'){
						return '胜其它';
					}else{
						return (str+'').split('').join(':');
					}
				}).sort(function (a, b){
					return bsSort[a] > bsSort[b] ? 1 : -1;
				});
			break;
			case 'bqc'://降序
				return codesArr.sort(down).map(function (str){
						return (str+'').split('').join('-');
				});
			break;
		}
		return codesArr.sort(up);//升序jqs
	},
	updateData: function (){//重新生成号码数据
		var data = [],
			info = [],
			optsArr2 = [], 
			danoptArr2 = [],
			playNum = {
				spf: 0,
				rqspf: 0,
				jqs: 0,  
				bf: 0,
				bqc: 0
			};
			 endtime= 0,
			_self = this;
		//查找号码列表中所有可见号码区的号码;
		var visiTr=this.box.find('tr.code_area:visited');
		$("#xznum").html("("+visiTr.nodes.length+")");
		this.box.find('tr.code_area:visited').each(function (tr){
			var bid = tr.getAttribute('data-id');
			var mp = tr.getAttribute('data-mp');
			var m_endtime = tr.getAttribute('data-endtime');
			var span = Yobj.get(tr).find('span.x_s:visited');
			var codes = [];
			var dan = tr.getAttribute('dan') == '1' ? 1 : 0;
			var rq = tr.getAttribute('data-rq');
			var spf = _self.__getGroup('spf', bid, mp);
			var rqspf = _self.__getGroup('rqspf', bid, mp);
			var jqs = _self.__getGroup('jqs', bid, mp);
			var bf = _self.__getGroup('bf', bid, mp);
			var bqc = _self.__getGroup('bqc', bid, mp);
			var hasSfc, hasNsfc, hasSf, hasRfsf, hasDxf;
			var prizeArr = [];
			var codeArr = [];
			if (endtime) {
				endtime = Math.min(endtime, m_endtime);
			}else{
				endtime = m_endtime;
			}
			span.nodes.each(function (span){
				var type = span.getAttribute('data-sg');
				var g;
				if (type.indexOf('rqspf') === 0) {
					g = rqspf;
					if (!hasNsfc) {
						hasNsfc = true;
						playNum.rqspf++;
					}		
				}else if (type.indexOf('spf') === 0) {
					g = spf;
					if (!hasSfc) {
						hasSfc = true;
						playNum.spf++;
					}
				}else if(type.indexOf('bf') === 0){
					g = bf;
					if (!hasSf) {
						hasSf = true;
						playNum.bf++;
					}					
				}else if(type.indexOf('jqs') === 0){
					g = jqs;
					if (!hasRfsf) {
						hasRfsf = true;
						playNum.jqs++;
					}
				}else{
					g = bqc;
					if (!hasDxf) {
						hasDxf = true;
						playNum.bqc++;
					}
				}
				g.code.push(type.replace(/\D/g, ''));//去掉号码的玩法识别(-sfc)部分, data-sg="sf2"
				var sp = /*Yobj.optsAdm.getSp(bid, type)*/ _self.getSp(bid, type);
				g.prize.push(sp);//查询sp值
				codeArr.push(span.innerHTML+'('+sp+')');
			});
			var opt = [];
			var danopt = [];
			if(dan == 0){
				data.push([rqspf,spf, jqs,bf, bqc].filter(function (obj){
					var len = obj.code.length;
					if (len) {
						if(obj.type == 'rqspf'){
							obj.rq = rq;
						}
						opt.push(len + '-' + obj.type);//[2-sfc];
						obj.mps += '['+_self.formatCode(obj.type, obj.code).join(',')+']';//排序后拼接

						prizeArr = prizeArr.concat(obj.prize);
						return true;
					}
				}));
			}else if(dan == 1){
				data.push([rqspf,spf, jqs,bf, bqc].filter(function (obj){
					var len = obj.code.length;
					if (len) {
						if(obj.type == 'rqspf'){
							obj.rq = rq;
						}
						danopt.push(len + '-' + obj.type);//[2-sfc];
						obj.dan = obj.mps+'['+_self.formatCode(obj.type, obj.code).join(',')+']';//排序后拼接
						obj.mps += '['+_self.formatCode(obj.type, obj.code).join(',')+']';//排序后拼接
						prizeArr = prizeArr.concat(obj.prize);
						return true;
					}
				}));
			}
			if(opt.length != 0){
				optsArr2.push(opt);
			}
			if(danopt.length != 0){
				danoptArr2.push(danopt);
			}
			info.push({
				index: tr.getAttribute('data-index'),//赛程名
				vs: tr.getAttribute('data-vs'),//对阵名
				codes: codeArr.join(','),
				dan: tr.getAttribute('dan') == '1' ? '√' : '×',//胆
				min: Math.min.apply(Math, prizeArr), 
				max: Math.max.apply(Math, prizeArr)//最大和最小奖金
			});//做为查看明细的基本数据
		});
		this.codeInfo = info;//全盘号码视图
		this.codes = data;//全选择数据
		this.danselOpts = danoptArr2;//用于快速计算注数
		this.selOpts = optsArr2;//用于快速计算注数
		this.playNum = playNum;//用于判断可用的过关方式
		this.endtime = endtime;
		this.ondatachange();//传递给过关方式处理
	},
	
	getSp: function(bid,type){
		var _self = this,len,arrs = [],
		spf = _self.get('#vs'+bid).find('td>a[data-type=spf]').nodes,
		rqspf = _self.get('#vs'+bid).find('td>a[data-type=rqspf]').nodes;
		jqs = _self.get('#vs'+bid).next('tr').find('td>a[data-type=jqs]').nodes;
		bqc = _self.get('#vs'+bid).next('tr').find('td>a[data-type=bqc]').nodes;
		bf = _self.get('#vs'+bid).next('tr').find('td>a[data-type=bf]').nodes;
		
		if(type.indexOf('rqspf')>-1){
			len = rqspf.length;
			arrs = rqspf;
		}else if(type.indexOf('spf')>-1){
			len = spf.length;
			arrs = spf;
		}else if(type.indexOf('jqs')>-1){
			len = jqs.length;
			arrs = jqs;
		}else if(type.indexOf('bqc')>-1){
			len = bqc.length;
			arrs = bqc;
		}else if(type.indexOf('bf')>-1){
			len = bf.length;
			arrs = bf;
		}
		
		var _l = len, _i = _l%8, f = false,xb;
		if(_i){
		    do{
		    	xb = _l-_i;
		    	f = returnSp(arrs[xb]);
		    	if(f) break;
		    }while(--_i);
		}

		_i = Math.floor(_l/8);
		if(_i){
		  do{
			  if(f) break;
			  xb = (_i-1)*8+0;
			  f = returnSp(arrs[xb]); 
			  if(f) break;
			  xb = (_i-1)*8+1;
			  f = returnSp(arrs[xb]);
			  if(f) break;
			  xb = (_i-1)*8+2;
			  f = returnSp(arrs[xb]);
			  if(f) break;
			  xb = (_i-1)*8+3;
			  f = returnSp(arrs[xb]);
			  if(f) break;
			  xb = (_i-1)*8+4;
			  f = returnSp(arrs[xb]);
			  if(f) break;
			  xb = (_i-1)*8+5;
			  f = returnSp(arrs[xb]);
			  if(f) break;
			  xb = (_i-1)*8+6;
			  f = returnSp(arrs[xb]);
			  if(f) break;
			  xb = (_i-1)*8+7;
			  f = returnSp(arrs[xb]);
			  if(f) break;
		  } while(--_i);
		}
		
		  return arrs[xb].getAttribute('data-sp')||1;
		
		function returnSp(array){
			if(array){
				if((array.getAttribute('data-type') + array.getAttribute('value')) == type){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}
	},
	getCodeString: function (){
		var c = [];
		this.codes.each(function (m){
			c.push(m.map(function (obj){
				return obj.mps;
			}).join('/'));
		});
		return c.join('/');
	},
//	55077|140430001|SPF>[3,1]/55077|140430001|RSPF>[3]/55077|140430001|JQS>[0]/55078|140430002|RSPF>[3,1]
	

	getdanCodeString: function (){
		var c = [];
		this.codes.each(function (m){
			c.push(m.map(function (obj){
				return obj.dan;
			}).join('/'));
		});
		return c.join('/');
	},
	getTr1: function (bid){
		return Yobj.get('#code'+bid+ '_a');
	},
	getTr2: function (bid){
		return Yobj.get('#code'+bid+'_b');
	},
	//添加事件
	addEvents: function (){
		var _self = this;
		this.box.live('tr.cm_hhgg_xztt', 'mouseover', function(e,Y){
			Y.get(this).addClass("cm_jchover");
		}).live('tr.cm_hhgg_xztt', 'mouseout', function(e,Y){
			Y.get(this).removeClass("cm_jchover");
	    }).live('input[view=hh]', 'click', function(e){
	    	var tr = Yobj.get(this).parent('tr').hide(),
			bid = tr.attr('data-id');
			tr.next().hide();
			_self.onchange(bid,[]);// 本对阵选项全部清空
			_self.updateData();
	    }).live(':checkbox', 'click', function (e, Y){//点击头复选框
             var tr = Y.get(this).parent('tr');
             tr.attr('dan', this.checked ? 1 : 0);
	         _self.updateData();
	     });
		
		_self.get("#delMatch").click(function(){
			_self.box.find("tr:visited").each(function(e){
				if(e.getAttribute('id').indexOf('_a')>-1){
					var tr = Yobj.get(e).hide(), bid = tr.attr('data-id');
					tr.next().hide();
					_self.onchange(bid,[]);// 本对阵选项全部清空
					_self.updateData();
	    		 }
	    	 });
	     });
		
		//点击选项
		this.box.live(' span.x_s', 'mousedown', function (e, Y){
			Yobj.get(this).hide();
			var bid = Yobj.get(this).parent('tr').attr('data-id'),
				tr = _self.getTr2(bid),
				sel = tr.find('span.x_s:visited').nodes.filter(function(c){
					return $(c).is(":visible");
				}).map(function(c){
					return Y.get(c).attr('data-sg');
				});
			
			if (sel.length === 0) {//全部隐藏了
				tr.hide();
				tr.prev().hide();
			}
			_self.onchange(bid,sel);
			_self.updateData();
		});
	},
	//添加基本对阵表格
	addBaseTr: function (vsList){
		this.addEvents();
	},
	//添加了一行, addBaseTr的辅助方法
	__addTr: function (vsInfo, doc){
		var tr = this.tmpl_1.cloneNode(true);
		var tr2 = this.tmpl_2.cloneNode(true);
		var tds = Yobj.get('td', tr);
//		tds.nodes[0].innerHTML = vsInfo.game_time;
		tds.nodes[0].getElementsByTagName('span')[0].innerHTML= vsInfo.game_time;
		tds.nodes[1].innerHTML = vsInfo.title.replace('vs', '<span class="sp_vs">VS</span>');
		doc.appendChild(tr);
		doc.appendChild(tr2);
		tr.id = 'code' + vsInfo.id + '_a';
		tr2.id = 'code' + vsInfo.id + '_b';	
		tr2.className = ' code_area';
		Yobj.get([tr, tr2]).attr('data-id', vsInfo.id)
			.attr('data-mp', vsInfo.mid_pname)
			.attr('data-index', vsInfo.game_time)
			.attr('data-vs', vsInfo.title)
			.attr('data- endtime', vsInfo.end_time)
			.find('p>a').attr('data-id', vsInfo.id).hide();
	},
	//同步选择器, 选择器触发
	syncSelector: function (bid){
		var tr1 = this.get("#vs"+bid),vstr = this.one("#vs"+bid), id="code"+bid+"_a", 
		sum = 0,tr2 = tr1.next(), tr = this.get('#'+id),trn,
		rq,A,B,date,chk;
		rq = vstr.cells[0].getElementsByTagName('em')[0].title;
		rq2 = this.get("#vs"+bid).find('td strong[mark=close]').html();
		A = vstr.getAttribute('hometeam');
		B = vstr.getAttribute('guestteam');
		date = vstr.getAttribute('pendtime');
		chk = tr1.data('scm');
		if (tr.size() == 0) {
			tr = this.get(this.tmpl_1.cloneNode(true)).insert(this.box);
			tr.prop('id', id).attr('data-id', vstr.getAttribute('fid')).attr('data-mp', vstr.getAttribute('fid')+"|"+vstr.getAttribute('pname'))
			  .attr('data-index',rq)
			  .attr('data-vs', A+"vs"+B)
			  .attr('data-endtime', this.getDate(date));
			tr.one().cells[1].innerHTML = A+"<span class=\"sp_vs\">VS</span>"+B;
	        tr.one().cells[0].innerHTML ='<input type="checkbox" view="hh" checked="" class="chbox">'+ rq;

	        trn = this.get(this.tmpl_2.cloneNode(true)).insert(tr, 'next');
	        trn.addClass('code_area');
	        trn.attr('id', "code"+bid+"_b").attr('data-id', vstr.getAttribute('fid'))
	           .attr('data-mp', vstr.getAttribute('fid')+"|"+vstr.getAttribute('pname'))
	           .attr('data-index',rq)
	           .attr('data-rq',rq2)
			   .attr('data-vs', A+"vs"+B)
			   .attr('data-endtime', this.getDate(date));
	        tr.data('linkTR', trn);
	        trn.data('linkTR', tr);
//	        this._sort();//仅在添加新的时候排序
		}
        
        this._showChoose(tr, chk, vstr);
		this.updateData();
	},
	
	_showChoose: function (tr, chk, vstr){
        var tr2 = tr.data('linkTR');
        tr2.find(' span.x_s').each(function (span, i){
            span.style.display = chk.indexOf(span.getAttribute('data-sg')) == -1 ?  'none' : '';
        }, this);
        tr2.show(chk.length > 0);
        tr.show(chk.length > 0);
    }
});


/*过关方式选择器
*************************************************************************/
Class('GgType', {
	index: function (){
		this.setTabs();
		this.setEvents();
		this.addMsg();
		this.tbody = this.get('#choose_list');
		this.idmap = Yobj.dejson(Yobj.get('#jsonggtype').val());
		this.only_mix = Yobj.get('#qcdy').prop('checked');
		var thiss = this;
		Yobj.onMsg('get-selector-selected', function (bid){
			var has;
			thiss.codes.each(function (item){
				var first = item[0];
				if (first && first.id == bid) {
					has = true;
					return false;
				}
			});
			return !has ? thiss.codes.length : 0;
		});
	},
	setEvents: function (){
		var _self = this;
		Yobj.get('#qcdy').click(function (){
			_self.only_mix = this.checked;
			_self.updateTypeView(true);
		});
		Yobj.get('#ggListFree input,#ggList input').click(function (){
			if(_self.typeChange(true)){//计算溢出了
				this.checked = false; //恢复
			};
		});
		Yobj.get('#qcdy').prop('disabled', true).prop('checked', false);
		this.lt2_info = this.get('<div style="text-align: center;position:relative;top:8px;color: red;" id="vslt2">请至少选择2场比赛进行投注。</div>').insert('#ggListFree', 'prev');
	},
	max: 0, //当前最多能玩的串数
	maxNum: {//混串最多可玩数
		'rqspf': 8,
		'spf': 8,
		'jqs': 6,
		'bf': 4,
		'bqc': 4
	},	
	only_mix: true,
	codes: [],
	selOpts: [],
	ggTypes: [],
	ggTypeIds: [],
	playNum: {},
	mode: 'free', // 'multi', 多串和自由
	onchange: Yobj.getNoop(),// 点击选择和切换的时候
	setTabs: function (){
		var tabs = Yobj.get('#ggTabsNav li'),
			_self = this,
			typeBox = Yobj.get('#ggListFree,#ggList'),
			css = 'an_cur';
		tabs.each(function (li, i){
			li.tab_index = i;
		}).click(function (){
			focusTab( this.tab_index);
		});
		function focusTab(idx){
			if(idx==0){
				_self.get('#ch_desc').hide();
			}else{
				_self.get('#ch_desc').show();
			}
			tabs.removeClass(css).eq(idx).addClass(css);
			change(idx);			
		};
		function change(idx){
			typeBox.hide().eq(idx).show();
			_self.mode = idx == 0 ? 'free' : 'multi';
			_self.lt2_info.html('请至少选择'+(idx===1?3:2)+'场比赛进行投注。');
			_self.lt2_info.show(_self.max < (_self.mode == 'free' ? 2 : 3));
			_self.updateTypeView();
		}
		this.focusTab = focusTab;
	},
	//手动选上过关方式
	setGgType: function (int_gggroup, str_type){
		var box = int_gggroup == '3' ? '#ggListFree' : '#ggList';
		Yobj.get(box).find('input').each(function (chk){
			if (str_type.indexOf(chk.value) > -1) {
				chk.checked = true;
			}
		});
		this.typeChange(true);
	},
	//计算可玩的最大过关方式
	getMaxGgType: function (isFromQcdy){
		var ptn = 0,//有玩法项数
			sum = 0,
			len = this.codes.length,
			playNum = this.playNum,
			max = (playNum.bqc || playNum.bf) ? 4 : (  playNum.jqs ? 6 : 8);//最多选到
		for(var k in playNum){
			if (playNum[k]) {
				ptn++;
			}
			sum += playNum[k];
		}
		if (!isFromQcdy) {//如果用户选择的是单一玩法， 自动去掉混投限制
			var can_hc = ptn > 1 && len > (this.mode == 'free' ? 1 : 2);
			Yobj.get('#qcdy').prop('disabled', !can_hc).prop('checked', false);
			this.only_mix = false;
		}
		if (this.only_mix) {//只允许混投 && this.mode != 'multi'
			if (ptn < 2) {//玩法太少
				return 0;
			}
			return Math.min(Math.min(len, max), sum);
		}else{//允许单一玩法
			return Math.min(max, len);
		}
	},
	//设置可用的过关方式显示
	updateTypeView: function (isFromQcdy){
		var max = this.max = this.getMaxGgType(isFromQcdy);
		var isFree = this.mode == 'free';
		var id = isFree ? '#ggListFree' : '#ggList';
		var min = isFree ? 2 : 3;
		var labs = Yobj.get(id + ' label').hide();
		this.lt2_info.show(max < min);
		if(max < min){
			this.get('#x_guoguan_sty').removeClass('cm_jclq_red');
		}else{
			this.get('#x_guoguan_sty').addClass('cm_jclq_red');
		}
		
		labs.each(function (lab){
			 var labelFor = (lab.getAttribute('for') || lab.getAttribute('HTMLfor'))+'',
				 num = parseInt(labelFor.slice(1));
			if (num > 1 && num <= max ) {
				Yobj.get(lab).show();
			}else{
				lab.getElementsByTagName('input')[0].checked = false;
			}
		});	
		this.typeChange(false);//这个不是选择过关方式触发的
	},
	//过关方式变化时
	typeChange: function (is_gg_fire){//是否手动点的
		var box = this.mode == 'free' ? '#ggListFree' : '#ggList',
			ids = [],
			ggtype = [],
			_self = this;
		this.ggTypes = Yobj.get(box + ' input:checked').nodes.map(function (input){
			ids.push(_self.idmap[input.value]);
			ggtype.push(input.value);
			return input.value;
		});
		Class.C('chuan',parseInt(this.ggTypes[0]));
		Class.C('chuanlength',this.ggTypes.length);
		if(ggtype.length>0){
			this.get('#x_buy_sty').addClass('cm_jclq_red');
			this.get('#x_buy_sty').next('div').addClass('cm_jclq_red');
		}else{
			this.get('#x_buy_sty').removeClass('cm_jclq_red');
			this.get('#x_buy_sty').next('div').removeClass('cm_jclq_red');
		}
		this.ggTypeIds = ids;
		if(ggtype.length>0){
			this.get('#x_buy_sty').addClass('cm_jclq_red');
			this.get('#x_buy_sty').next('div').addClass('cm_jclq_red');
		}else{
			this.get('#x_buy_sty').removeClass('cm_jclq_red');
			this.get('#x_buy_sty').next('div').removeClass('cm_jclq_red');
		}
		this.ggtype = ggtype;//过关方式字符型
		if (is_gg_fire) {
			Yobj.get('#qcdy').prop('checked', false);
			this.only_mix = false;			
		}
		
		if(this.ggTypes.length>0 && box == '#ggList'){
			Y.postMsg('msg_dc_split', this.ggTypes[0]);
		}
		this.postMsg('msg_choose_update');
		return this.onchange(is_gg_fire);//计算溢出时会返回true;
	},
	addMsg:function(){
		this.onMsg('msg_choose_update', function (){
			var tr, all, dan=[], nDan=[];
			var isFree = this.mode;
			tr = this.tbody.find('tr:visited');
			all = tr.find(':checkbox[dan]');//所有胆的复选框
			all.each(function (el){
			if (el.checked) {dan.push(el)}else{nDan.push(el)}//取得胆与非胆
			}); 
			if(isFree == 'free'){
				var id = isFree ? '#ggListFree' : '#ggList';
				var labs = Yobj.get(id + ' label');
				var yRn = true;
				if((dan.length + nDan.length) <= 2){
					all.each(function (el){
						 el.disabled = true;
						 el.checked = false;
						 el.parentNode.parentNode.setAttribute('dan','0');
					});
				}else{
					if(dan.length < 1){
						all.each(function (el){
							 el.disabled = false;
							 el.checked = false;
							 el.parentNode.parentNode.setAttribute('dan','0');
						}); 
					}
					if(Class.C('chuanlength') == 1 && Class.C('chuan') == (dan.length+nDan.length)){
						all.each(function (el){
							 el.disabled = true;
							 el.checked = false;
							 el.parentNode.parentNode.setAttribute('dan','0');
						}); 
						labs.each(function (lab){
							lab.getElementsByTagName('input')[0].disabled = false;
						});	
						yRn = false;
					}
					if(Class.C('chuan') -1 == dan.length){
						 nDan.each(function (el){
							 el.disabled = true;
						 });
					}else{
						if(nDan.length > 0 && Class.C('chuanlength') != 1){
							nDan.each(function (el){
								 el.disabled = false;
							});
						}
					}
					if(dan.length>0){
						$("#ddjjyh").hide();
					}else{
						$("#ddjjyh").show();
					}
					labs.each(function (lab){
						if(parseInt(lab.htmlFor.slice(1))<=dan.length){
							if(yRn){
								lab.getElementsByTagName('input')[0].disabled = true;
								lab.getElementsByTagName('input')[0].checked = false;
							}
						}else{
							lab.getElementsByTagName('input')[0].disabled = false;
						}
					});	
				}
			}else{
				if(dan.length>0){
					$("#ggList").hide();
					$("#vslt2").html("胆拖不支持多串");
					$("#vslt2").show();
					$("#ddjjyh").hide();
					$("#ch_desc").hide();
				}else{
					$("#ggList").show();
					$("#vslt2").hide();
					$("#ddjjyh").show();
				}
			}
        });
	},
	//同步号码框
	syncCodeList: function (codeList){//[{id:'4578', codes:[{type:'sf', code: ['1']}]}]
		this.codes = codeList.codes;
		this.playNum = codeList.playNum;
		this.selOpts = codeList.selOpts;
		this.danselOpts = codeList.danselOpts;
		this.updateTypeView();
		Yobj.get('#cs').html(this.codes.length);
		
		if(this.codes.length>0){
       	 	this.get('#delMatch').addClass('jcq_kcur');
        }else{
       	 	this.get('#delMatch').removeClass('jcq_kcur');
        }
	}
});
Class.C('Max-BeiShu', 5*10000);



/*发起购买类 
*************************************************************************/
Class.C('add-money-url', "/account/chongzhi.html");

Class('Buy', {
 	single: true,
 	bs: 1,
 	index: function (target){
 		var _self = this;	
 		this.form = Yobj.get(target);
 		
 	

 		Yobj.get('#gobuy,#gohm').click(function (){
 			_self.ishm = this.id == 'gohm' ? 1 : 0;
 			 Y.get('#ishm').val(_self.ishm);//合买与代购
 			Y.get('#beishu').val(Y.get('#bsInput').val());
 			if (_self.ishm){
             	Y.get("#project_form").attr("action", "/phpt/jc/step_11.phpx");
             }else{
             	Y.get("#project_form").attr("action", "/phpt/jc/step_12.phpx");
             }
 			if (true === _self.check()) {
// 				_self.send();
 				Y.get('#project_form').doProp('submit');
 			}
 		});
 		
 		this.get('#jjyh').click(function (){
 			_self.ishm = this.id == 'jjyh' ? 1 : 0;
 			if (_self.ishm){
             	//Y.get("#jjyh_form").attr("action", "jjyh_hh.html");
             }
 			Y.get('#beishu').val(Y.get('#bsInput').val());
 			if (true === _self.check()) {
 				var ty=Y.get('#ggtypename').val().split('\串');
 				if(Y.get('#ggtypename').val().split(',').length>1){
                 	return Y.alert('奖金优化暂不支持同时选择多个过关方式！');
                 }
 	            if(ty[1]>1){
 	            	return Y.alert('奖金优化仅支持N串1！');
 	            }
 	            Y.get('#pnum').val(ty[0]);
 				Y.get('#code').val(Y.get('#codes').val());
 				Y.get('#tmoney').val(Y.get('#totalmoney').val());
 				Y.get('#muli').val(Y.get('#beishu').val());
 				var MAX_ALL_MONEY = 100000;
 	            if (Y.get('#tmoney').val() > MAX_ALL_MONEY) {
 	                return Y.alert('您好, 发起方案金额最多不能超过￥'+MAX_ALL_MONEY+'元!');
 	            }
 	            Y.get('#jjyh_form').doProp('submit')
 				//_self.send();
 			}
 		});
 	},
 	bschange: function (){},//倍数变化时
 	setVals: function (obj){//批量设置表单
 		for(var k in obj){
 			Yobj.get(k).val(obj[k]);
 		}
 	},
	check : function() {
 		var maxMoney =$("#money_limit").val().split(',')[1];
 		var codes =$("#codes").val();
 		var totalmoney =$("#totalmoney").val();
 		var beishu =$("#beishu").val();
 		var ggtypename =$("#ggtypename").val();
 		
 		//出票有压力，方案注数大于等于50注且倍数小于10倍的方案不让投注
 		/*if(codes.indexOf('让负')>0||codes.indexOf('让平')>0||codes.indexOf('让胜')>0){
			var zhushu = parseInt(parseInt(totalmoney)/parseInt(beishu)/2);
			if(zhushu>=50 && parseInt(beishu)<10){
				this.alert('尊敬的用户，因中心限制，近期注数>=50、且倍数<10倍的，含让球胜平负玩法的混合过关方案暂时无法投注，请减少注数或增加倍数，敬请谅解。');
				return false;
			}
 		}*/
 		
 		if (codes == '') {
 			this.alert('请选择好您要投注的比赛。');
 		} else if (ggtypename == '') {
 			this.alert('请选择好您要投注的过关方式。');
 		} else if (totalmoney == 0) {
 			this.alert('您好，投注的总金额不能为￥0.00元。');
 		} else if (totalmoney / beishu > 20000) {
 			this.alert('您好，单倍认购金额不能超过20,000元。');
 		} else if (totalmoney*1 > maxMoney) {
 			this.alert('对不起，您的方案发起金额不能大于' + maxMoney + '元。');
 		} else {
 			return true;
 		}
 		return false;
 	},
 	send: function (){//表单提交
 		this.form.doProp('submit');
 		
 	}
 });

//联赛过滤器
Class('LgFilter', {
	index: function (){
		var $this = this,
			btn = Yobj.get('#listDisplay'),
			menu = Yobj.get('div.listMenu'),
			all = Yobj.get('div.listMenu,#listDisplay'),
			tid;
		this.setOptionsEvent(menu);
		btn.click(function (e){
			if($this.hasClass(btn.one(), 'cm_jc_first_hover')){
				$this.close();
				btn.removeClass('cm_jc_first_hover');
			}else{
				$this.open();
				btn.addClass('cm_jc_first_hover');	
			}
			
			e.stopPropagation();
		});
		
		this.get("div.listMenu").click(function(e) { 
       	 e.stopPropagation(); 
        }); 
        
        document.onclick = function(){
   		 if(Yobj.one('#listDisplay').className.indexOf('cm_jc_first_hover')>0){
	    		 Yobj.get('div.listMenu').hide();
	    		 Yobj.get('#listDisplay').removeClass('cm_jc_first_hover');
   		 }
   	 	}
		this.menu = menu;
	},
	reset: function (){
		this.menu.find('input:checkbox').prop('checked', true);
	},
	onchange: function(){},
	setOptionsEvent: function (menu){
		var Y = this, all = Y.get('div.listMenu div.cm_jc_lxtk');
   	    var ss_size = this.get('#lgList>a'),$this = this,sel_lg = [],unsel_lg = [];
   	    
   	   Y.get('#wanfa_chk').find(':checkbox').each(function(e){
   		    if(e.getAttribute('value').indexOf('spf')>-1){
   		    	Y.get(e).prop('checked', true);
   		    }else{
   		    	Y.get(e).prop('checked', false);
   		    }
   	   });
   	   
   	   Y.get('#wanfa_chk').live(':checkbox','click', function(e,Y){
   		   $this.onchange(this.value, this.checked, 3);
   	   });
   	    
   		Yobj.get('#lglist input').click(function(e){
   		 clearcur(1);
   		var lgarr=[];
   		 if(!$(this).attr("checked")){
   			 $this.onchange(Y.get(this).attr('m'), false, 0);
   			var lgarr=[];
  			 Yobj.get('#lglist input').each(function(a){
  	   			if(($(a).attr("checked"))){
  	   				lgarr.push(a.getAttribute('m'))
  	   			}
  	   	
  	   		})
  	   	$this.onchange(lgarr, true, 0);
   		 }else if($(this).attr("checked")){
   			
   			 Yobj.get('#lglist input').each(function(a){
   	   			if(($(a).attr("checked"))){
   	   				lgarr.push(a.getAttribute('m'))
   	   			}
   	   	
   	   		})
   	 	$this.onchange(lgarr, true, 0);
   		 }
   
   		

   	 })
   	Yobj.get('#wdls').click(function(){
   		var lg=Y.get('#lglist input');
	   	if($(this).attr("checked")){
			lg.prop("checked",false);
			$("input[m='西班牙甲']").attr("checked",true);
			$("input[m='德国甲级']").attr("checked",true);
			$("input[m='法国甲级']").attr("checked",true);
			$("input[m='意大利甲']").attr("checked",true);
			$("input[m='英格兰超']").attr("checked",true);
			  $this.onchange( ["西班牙甲","德国甲级","法国甲级","意大利甲","英格兰超"], true, 0);  //存在五大联赛或热门赛事
		}
	  
		else if(!$(this).attr("checked")){
			lg.prop("checked",true);
			  $this.onchange("", true, 0);  //存在五大联赛或热门赛事
		}
    
	 

	
		

   	});
   	Yobj.get('#showAll_btn,#selectAllBtn').click(function(){
   		$this.onchange(false, true, 2);//全选
   		Y.get("#lglist input").prop("checked",true);
   		Y.get("label[mark=name] input").prop("checked",true);
   		
	 });
	Yobj.get('#unAllBtn').click(function(){
   		$this.onchange(false, false, 2);//全清
   		Y.get("#lglist input").prop("checked",false);
	 });
	Yobj.get('#selectOppBtn').click(function(){
   		var lg=Y.get("#lglist input:checkbox");
   		var lgarr=[]
   		lg.each(function(a){
   			if(!($(a).attr("checked"))){
   				lgarr.push(a.getAttribute('m'))
   			}
   			Y.get(a).prop("checked",!($(a).attr("checked")));
   		 
   		})
   		$this.onchange(lgarr, true, 0);
	 });
   	 
   	function clearcur(val,isp){
  		 switch(val){
           	case 0://点击 快捷筛选
           		Y.get('#list_rq>span>a,#list_riqi>span>a').each(function(e){
       				if(e.getAttribute('value')=='all'){
       					e.className = 'cm_cur';
       				}else{
       					e.className = '';
       				}
           		});
           		if(isp){
           			Y.get('#list_ss>span>a').each(function(e){
           				if(e.getAttribute('value')=='all'){
           					e.className = 'cm_cur';
           				}else{
           					e.className = '';
           				}
               		});
           		}
           		break;
           	case 1://点击赛事
           		Y.get('#list_kjsx>span>a,#list_rq>span>a,#list_riqi>span>a').each(function(e){
           			if(e.getAttribute('value')=='all'){
       					e.className = 'cm_cur';
       				}else{
       					e.className = '';
       				}
           		});
           		break;
           	case 2://点击让球
           		Y.get('#list_kjsx>span>a,#list_ss>span>a,#list_riqi>span>a').each(function(e){
           			if(e.getAttribute('value')=='all'){
       					e.className = 'cm_cur';
       				}else{
       					e.className = '';
       				}
           		});
           		break;
           	case 3://点击日期
           		Y.get('#list_kjsx>span>a,#list_ss>span>a,#list_rq>span>a').each(function(e){
           			if(e.getAttribute('value')=='all'){
       					e.className = 'cm_cur';
       				}else{
       					e.className = '';
       				}
           		});
           		break;
  		 }
  	 }
		
	},
	open: function (){
		Yobj.get('div.listMenu').show();
	},
	close: function (){
		Yobj.get('div.listMenu').hide();
	}
});

/*启动入口
*************************************************************************/
Class('Main', {
	ready: true,
	use: 'mask',
	index: function (){
		this.createClass();
		this.sethref();
		
//		 http://local.159cai.com/cpdata/omi/odds/jczq/oz/1.xml?rnd=0.8910419419263784
		this.otherEvents();
		this.lib.Clock('#sysTimeDisplay');
		this.setTableHeadFixed();
	},
	otherEvents: function (){
		//切换平均欧赔
		this.get('#sssx div.matchxz').drop( this.get('#sssx div.jcslt'),{focusCss: 'matchxzc', fixed: true, y: -1});
        this.get('#jztime div.matchxz').drop( this.get('#jztime div.jcslt'),{focusCss: 'matchxzc', fixed: true, y: -1});
        this.get('#oddstype div.matchxz').drop( this.get('#oddstype div.jcslt'),{focusCss: 'matchxzc', fixed: true, y: -1});
		var pjpl = Yobj.get('#vsTable ul.pjpl'),
			tzbl = Yobj.get('#vsTable ul.tzbl');
		Yobj.get('#select_pv').change(function (){
			if (this.value == 0) {
				pjpl.show();
				tzbl.hide();
			}else{
				tzbl.show();
				pjpl.hide();
			}
		});
		//显示截止时间或者开赛时间
		var endTime = Yobj.get('#vsTable span.end_time'),
			matchTime = Yobj.get('#vsTable span.match_time');
		
		Yobj.get('#tzts span').click(function(){
        	if($(this).hasClass("cm_jc_tztsdown")){
            	$(this).removeClass("cm_jc_tztsdown");
            	$("#tztsnr").hide();
        	}else{
            	$(this).addClass("cm_jc_tztsdown");
            	$("#tztsnr").show();
        	}
        }); 
		
		this.get('#jztime div.plv_set').live('a','click', function(){
	       	
	       	 Y.get("#select_time").html(Y.get(this).html());
//	       	 Y.get("#jztime div.jcslt").hide();
	       	  Yobj.get('#vsTable span.end_time').show(this.getAttribute('value') == '0');
	          Yobj.get('#vsTable span.match_time').show(this.getAttribute('value') == '1');
        });
		//察看往期

        

        

        
        this.goTotop();//返回顶部
	},
    sethref:function() {
    	var Y = this;
    	var lottype=parseInt(Y.get('#playid').val());
		this.ajax({
			    url:"/cpdata/omi/jczq/odds/odds.xml",
        		end:function(data,i){
        			 var htid =1;
                     this.qXml('//row', data.xml, function (u, i){
                    	    $("#mn"+u.items.xid).attr("href","http://info.159cai.com/league/index/"+u.items.lid);
                    	    $("#hn"+u.items.xid+" em").attr("data",u.items.htid);
            				$("#gn"+u.items.xid+" em").attr("data",u.items.gtid);		
//            				http://info.159cai.com/league/index/34/4647
            				Y.get("#hn"+u.items.xid).attr("href","http://info.159cai.com/team/index/"+u.items.htid);
                        	 Y.get("#gn"+u.items.xid).attr("href","http://info.159cai.com/team/index/"+u.items.gtid);
                        		$("#ox"+u.items.xid).attr("href","http://odds.159cai.com/match/analysis/"+u.items.oddsmid+"?lotyid=6");
                 				$("#oz"+u.items.xid).attr("href","http://odds.159cai.com/match/odds/"+u.items.oddsmid+"?lotyid=6");
                 				$("#oy"+u.items.xid).attr("href","http://odds.159cai.com/match/asia/"+u.items.oddsmid+"?lotyid=6");
            				var hm=isNaN(u.items.hm)||u.items.hm==""?"":u.items.hm<10?'0'+u.items.hm:u.items.hm;
	            				var am=isNaN(u.items.am)||u.items.hm==""?"":u.items.am<10?'0'+u.items.am:u.items.am;
	            				$("#hn"+u.items.xid).parent().find("i").html(hm==""|| typeof hm == undefined?"&nbsp;":'['+hm+']');
	            				$("#gn"+u.items.xid).parent().find("i").html(am=="" || typeof am == undefined?"&nbsp;":'['+am+']');	
	            				   Y.get("#oh"+u.items.xid).html(u.items.oh);
	           					Y.get("#od"+u.items.xid).html(u.items.od);
	           					Y.get("#oa"+u.items.xid).html(u.items.oa);
                     });                     
                     var xhhistory = "";
             			 xhhistory=".btnoption span";
             			 Class.C('exy',"yes")	;
             			 Class.config('odds_t',0);
                	     historyMatchOdds({
   	                         items: xhhistory,
   	                         tipid: 'odds_tip',
   	                         tip: '#odds_tip',
   	                         fleft: 260
   	                     }); 
	                     $("#oddstype").odds_select_name();
	                     load_odds_sp();
	                     ozOdds({
	                    	 items: 'div.pjpl',
   	                         tipid: 'odds_tip',
   	                         tip: '#datachange',
   	                         path: '/cpdata/omi/odds/jczq/oz'
   	                     });    			 
             			 
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
	createClass: function (){
		var selector = new Yobj.lib.Selector(),
			codeList = new Yobj.lib.CodeList(),
			ggTypeBox = new Yobj.lib.GgType(),
			buy = new Yobj.lib.Buy('#project_form'),
			algo = new Yobj.lib.Algo(),
			splitView = new Yobj.lib.SplitView(),
			lgFilter = new Yobj.lib.LgFilter();

		selector.onchange = function (bid){
			codeList.syncSelector(bid);//选择器变化时， 同步到号码框
		};

		selector.oninit = function (){
			codeList.addBaseTr(this.vsList);//创建对应的选项到号码框
		};

		codeList.onchange = function (bid,sel){
			selector.setCode(bid,sel);//号码列表变动时， 选择器同步
		};

		codeList.ondatachange = function (){// 号码列表数据变化时
			splitView.codeInfo = this.codeInfo;
			splitView.codes = this.codes;
			splitView.selOpts = this.selOpts;
			splitView.danselOpts = this.danselOpts;
			ggTypeBox.syncCodeList(this);//同步可用的过关方式
			buy.bschange();
			//方案截止时间显示
			var showtime = '';
			if (this.endtime) {//没有选择时为0
					showtime = new Date(this.endtime).format('MM-DD hh:mm');
			}
			Yobj.get('#end_time').html(showtime);			
		};

		ggTypeBox.onchange = function (is_gg_fire){//过关方式变化时
			algo.update(ggTypeBox);//计算注数
			if (algo.overflowErr) {
				if (!is_gg_fire) {//如果不是选过关方式触发的, 选
					selector.resetLast();//
				}
				return true; //是否计算溢出
			}
			buy.bschange();			
		};

		algo.onoverflow = function (zs){
			Yobj.alert('您的投注超过了最大注数限制!');
		};
		buy.bschange = function (){//倍数变化时
			var zs = algo.zs,
				money = parseInt(zs * this.bs *2).rmb(),
				minMoney = (algo.minPrize*this.bs).rmb(),
				maxMoney = (algo.maxPrize*this.bs).rmb();//(algo.minPrize*this.bs).rmb() + ' ~ ' +
			splitView.mode = ggTypeBox.mode;
			splitView.only_mix = ggTypeBox.only_mix;
			splitView.ggtype = ggTypeBox.ggtype;
			splitView.maxggtype = ggTypeBox.max;
			splitView.bs = this.bs;
			splitView.zs = zs;
			splitView.money = money
			splitView.maxMoney = maxMoney;
			Yobj.get('#zs').html(zs);
			Yobj.get('#buy_money').html(money);
			Yobj.get('#maxmoney').html(maxMoney);
			Yobj.get('#minmoney').html(minMoney);
			Yobj.get('#prix_range').html('奖金范围：'+minMoney+'-'+maxMoney+'元');
		};

		selector.init('#vsTable');
		selector.onshowAll = function (){
			lgFilter.reset();
		};
		
		lgFilter.onchange = function (lgs_str, checked, mode){
			 switch(mode){
             	case 0://赛事
             		selector.filterOneLg(lgs_str, checked);
             		break;
             	case 1: //日期
             		selector.fileterDayLg(lgs_str, checked);
             		break;
             	case 2://全部
             		selector.filterAll(checked);
             		break;
             	case 3:
             		selector.filterTye(lgs_str, checked);
             		break;
			 } 
		};

		//世界杯切换
		if (location.href.indexOf('sjb') > -1) {
           Yobj.postMsg('lg-filter-by-array');
        }

		buy.check = function (){
			var ggType = ggTypeBox.ggTypes,
				codes = codeList.data;
			if (ggTypeBox.max) {
				if (ggType.length === 0) {
					return Yobj.alert('请选择过关方式');
				}				
			}else{
				return Yobj.alert('请至少选择两场不是同一玩法的比赛');
			}
			var MAX_ALL_MONEY = this.C('MAX_ALL_MONEY'),
				totalmoney = algo.zs*this.bs*2;
			if (totalmoney > MAX_ALL_MONEY) {
				return this.alert('您好, 方案金额不能超过'+MAX_ALL_MONEY.rmb(true, 0)+'元!');
			}
			
			this.setVals({
				'#codes': codeList.getCodeString(),
//				'#danma': codeList.getdanCodeString(),
				'#danma': "",
				'#ggtypeid': ggTypeBox.ggTypeIds.join(','),
				'#ggtypename': ggTypeBox.ggtype.join(','),
				'#zhushu': algo.zs,
				'#gggroup': ggTypeBox.mode === 'multi' ? 2 : 3,
				'#beishu': this.bs,
				'#totalmoney': algo.zs*this.bs*2,
				'#ishm': this.ishm,
				'#ismix': ggTypeBox.only_mix ? 1 : 0 
			});
			return true;
		};
	}
	,
	setTableHeadFixed: function (){
		//设置表头浮动
		Yobj.get('<div id="title_folat"></div>').insert().setFixed({
			area: '#vsTable',
			offset:0,
			init: function(){
				var This = this,
					title = this.area.prev('div').one(0),
					floatTitle = title.cloneNode(true);
				this.get(floatTitle).insert(this);
				this.floatTitle = floatTitle;
				this.title = title;
				this.hide();
				Y.get(window).resize(function(){
					This.setStyle('left:'+(This.area.getXY().x)+'px;width:'+(This.area.prop('offsetWidth'))+'px')
				});
			},
			onin: function (){
				this.show();
				this.setStyle('zIndex', 999);
				this.title.swapNode(this.floatTitle);
				var offset = this.ns.ie == 6 ? 2 : 0;
				this.setStyle('left:'+(this.area.getXY().x+offset)+'px;width:'+this.area.prop('offsetWidth')+'px')
			},
			onout: function (){
				this.hide();
				this.title.swapNode(this.floatTitle);
			}
		});		
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
			end : function(data, i) {
				var servernow = Y.getDate(data.date);			
				var diff=Date.parse(servernow) - Date.parse(new Date()) ;	
				Class.config('servertimediff',(diff));
				Y.C('sdate',data.date);//判断隐藏场次用
				setInterval( function() {
					var now = new Date();
					var d = new Date(Date.parse(now) + Class.config('servertimediff'));
					var d_str = d.getFullYear()+'年'+Y.addZero((d.getMonth() + 1)) + '月' + Y.addZero(d.getDate()) + '日 ';
					var ctpl2 = '<em style="width:49px;"><b class="cm_red arial">'+Y.addZero(d.getHours())+'</b>时</em><em><b class="cm_red arial">' + Y.addZero(d.getMinutes()) + '</b>分</em><em><b class="cm_red arial">' + Y.addZero(d.getSeconds())+ '</b>秒</em>';
					Y.clockTag.html(ctpl2);
					Y.get("#sysDayDisplay").html(d_str);
				}, 1000 );
				
				setInterval( function() {
					Y.ajax({
						url : "/cpdata/time.json",
						end : function(data, i) {
							var servernow = Y.getDate(data.date);			
							var diff=Date.parse(servernow) - Date.parse(new Date()) ;	
							Class.config('servertimediff',(diff));						
						}
					});	
				}, 30000);
//				this.lib.reLoadDuizheng();//隐藏截止对阵 
			}
		});	
	},
	addZero : function(n) {
		return parseInt(n) < 10 ? '0' + n : n;
	}
} );

Class.extend('getPlayText', function (play_name){
    var map;
    map = {
        '90': '竞彩足球-让球胜平负',
        '72': '竞彩足球-胜平负',
        '91': '竞彩足球-猜比分',
        '92': '竞彩足球-半全场',
        '93': '竞彩足球-进球数',
        '70': '竞彩足球-混合投注'
    };
    return map[play_name];
});

Array.prototype.in_array = function(e)
{
for(i=0;i<this.length && this[i]!=e;i++);
return !(i==this.length);
}

Class.C('min-rengou', .05);//最低认购

Class.C('paytype', 0);
Class( 'shezhi', {
	use   : 'mask',
	ready : true,
	_param : {},
	index : function() {		
		var Y = this;

		
		Class.config('zc', 10);  
		Class.config('jc', 10);  
		Class.config('dc', 7);  
		Class.config('szc', 9); 
		
		Class.config('fandian', false); 
		
		Class.config('uId', location.search.getParam('uid'));  //userid
		Class.config('submitting', false);  //是否正在提交中
		
		this.get("#userid").html("用户["+Class.config('uId')+"]");
		this.tjBtn = this.get('#tj_btn');
		
		this.showinfo();
		
		this.getHmHtmlElement();
		
		this.doHmThings();
		
		this.tjBtn.click( function() {
				if (!Class.config('submitting')) {
					Class.config('submitting', true);
					Y.dotj();
				}
		});
		
	},

	showinfo:function(){
		Y.ajax({
			url : "/phpu/agent_1.phpx",
			type : "POST",
			dataType : "json",
			data : "user_id="+encodeURIComponent(Class.config('uId')),
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				if (code == "0") {	
					var r = obj.Resp.rows.row;			
					var isdaili = obj.Resp.rows.isdl;			
					var gstr=['80','81','83','82',
					          '90','93','91','92','70','72','98','99',
					          '94','95','97','96','71',
					          '85','89','86','87','88',
					          '50','51','53','52',
					          '01','03','07',
					          '54','56','04','20'];
					var fdstr = ['zc_sfc','zc_rj','zc_bq','zc_jq',
					               'jc_spf','jc_jqs','jc_cbf','jc_bqc','jc_hh','jc_rspf','jc_gj','jc_gyj',
					               'lc_sf','lc_rfsf','lc_dxf','lc_sfc','lc_hh',
					               'dc_spf','dc_jqs','dc_cbf','dc_bqc','dc_sx',
					               'tc_dlt','tc_qxc','tc_ps','tc_pw',
					               'fc_ssq','fc_sd','fc_qlc',
					               'kp_xw','kp_ydj','kp_ssc','kp_nssc'];
					
					if(!this.isArray(r)){r=new Array(r);}
					if(isdaili){
						this.need('#isdaili').prop("checked","checked");
						this.need('#isdaili').prop("disabled","disabled");
					}
					r.each(function(rt,o){
//						var cagentid = rt.cagentid;
						var cgameid = rt.cgameid;
						var irate = rt.irate;
						var len = gstr.length;
						for ( var i = 0; i < len; i++) {
							if(gstr[i]==cgameid){
								$("#"+fdstr[i]).val(irate);
								break;
							}
						}
					});
				}
			},
			error : function() {
				Y.alert("您所请求的页面有异常！");
			}
		});
	},
	// 发起合买
	dotj : function() {
		this.getParam();
		if(!Class.config('fandian')&&this.need('#isdaili').prop("checked")){
			this.alert("未设置返点不能开通推广！");
			Class.config('submitting', false);
			return;
		}
		if (this.Check() == true) {
			this.submit();
		} else {
			Class.config('submitting', false);
		}
		
	},

	// 获取发起时必须的参数
	getParam : function() {
		this._param.isdaili = this.need('#isdaili').prop('checked') ? "1" : "0";
//		this._param.isdaili = "1";
		//this._param.ty = this.need('#ty1').prop('checked') ? 1 : (this.need('#ty2').prop('checked') ? 0 : 1);
		this._param.fid="80,81,83,82,90,93,91,92,70,72,98,99,94,95,97,96,71,85,89,86,87,88,50,51,53,52,01,03,07,54,56,04,20";
		this._param.num="";
		var inputs = ['zc_sfc','zc_rj','zc_bq','zc_jq',
		               'jc_spf','jc_jqs','jc_cbf','jc_bqc','jc_hh','jc_rspf','jc_gj','jc_gyj',
		               'lc_sf','lc_rfsf','lc_dxf','lc_sfc','lc_hh',
		               'dc_spf','dc_jqs','dc_cbf','dc_bqc','dc_sx',
		               'tc_dlt','tc_qxc','tc_ps','tc_pw',
		               'fc_ssq','fc_sd','fc_qlc',
		               'kp_xw','kp_ydj','kp_ssc','kp_nssc'];

		var len = inputs.length;
		for ( var i = 0; i < len; i++) {
			if(this.need("#"+inputs[i]).val()!=0){
				Class.config('fandian',true);
			}
			this._param.num+=this.need("#"+inputs[i]).val()+",";
		}
		this._param.num=this._param.num.substring(0, this._param.num.length-1);
	},

	//检测
	Check : function() {
		return true;
	},

	submit : function() {	
		
		this.ajax( {
			url: "/phpu/agent_2.phpx",
	        type:'POST',
	        dataType : "json",
	        data:{
	        	user_id:encodeURIComponent(Class.config('uId')),
	        	qtype:this._param.isdaili,//是否代理
	        	//gender:this._param.ty,//类型
	        	fid:this._param.fid,
	        	tid:this._param.num
	        },
	        end:function(data) {      	
	        	var obj = eval("(" + data.text + ")");
	        	var code = obj.Resp.code;	
				var desc = obj.Resp.desc; 
				if (code == "0") {
					//重新初始化刷新UI
					top.Y.alert(desc);			
					//setTimeout( function(){top.location.reload();}, 2000);
				} else {
					top.Y.alert(desc);
					Class.config('submitting', false);
				}
				top.Y.closeUrl();
			}
		});
	},

	// 获取合买页面中必需的一些元素
	getHmHtmlElement : function() {
//		this.allcheck = this.need('#allcheck');
		this.zctype = this.need('#zctype');
		this.jctype = this.need('#jctype');
		this.lctype = this.need('#lctype');
		this.dctype = this.need('#dctype');
		this.tctype = this.need('#tctype');
		this.fctype = this.need('#fctype');
		this.kptype = this.need('#kptype');
//		this.all = this.need('#all');
		this.zcall = this.need('#zcall');
		this.jcall = this.need('#jcall');
		this.lcall = this.need('#lcall');
		this.dcall = this.need('#dcall');
		this.tcall = this.need('#tcall');
		this.fcall = this.need('#fcall');
		this.kpall = this.need('#kpall');
	},

	// 合买页面的一些处理
	doHmThings : function() {
		var Y = this;
//		this.allcheck.click( function() {  //
//			if (Y.allcheck.prop('checked')) {
//				var all_num = Y.all.val();
//				Y.all.prop('disabled', false);
//				Y.setNum(all_num,"8");
//			}
//		});

		 //足彩的点击事件
		this.zctype.click( function() { 
			if (Y.zctype.prop('checked')) {
				var all_num =Y.zcall.val();
				Y.zcall.prop('disabled', false);
				//Y.setNum(all_num,"1");
			}
		});
		
		this.jctype.click( function() {  //
			if (Y.jctype.prop('checked')) {
				var all_num =Y.jcall.val();
				Y.jcall.prop('disabled', false);
				//Y.setNum(all_num,"2");
			}
		});
		
		this.lctype.click( function() {  //
			if (Y.lctype.prop('checked')) {
				var all_num =Y.lcall.val();
				Y.lcall.prop('disabled', false);
				//Y.setNum(all_num,"3");
			}
		});
		
		this.dctype.click( function() {  //
			if (Y.dctype.prop('checked')) {
				var all_num =Y.dcall.val();
				Y.dcall.prop('disabled', false);
				//Y.setNum(all_num,"4");
			}
		});
		
		this.tctype.click( function() {  //
			if (Y.tctype.prop('checked')) {
				var all_num =Y.tcall.val();
				Y.tcall.prop('disabled', false);
				//Y.setNum(all_num,"6");
			}
		});
		
		this.fctype.click( function() {  //
			if (Y.fctype.prop('checked')) {
				var all_num =Y.fcall.val();
				Y.fcall.prop('disabled', false);
				//Y.setNum(all_num,"5");
			}
		});
		
		this.kptype.click( function() {  //
			if (Y.kptype.prop('checked')) {
				var all_num =Y.kpall.val();
				Y.kpall.prop('disabled', false);
				//Y.setNum(all_num,"7");
			}
		});

//		this.all.keyup( function() {  //
//			var all_num = Y.get("#all").val();
//			Y.setNum(all_num,"8");
//		}).blur( function() {
//			var all_num = Y.get("#all").val();
//			Y.setNum(all_num,"8");
//		});
		//比较对单个输入值的大小
		$("input[type='text']").each(function(){
			var id=$(this).attr("id");
			var num1="";
			//alert(id);		
			$("#"+id).focus(function(){		
		     num1=$("#"+id).val();	
		      //alert("num1="+num1);
				}).blur(function(){		
				     var num2=$("#"+id).val();
				     var maxValue = 100;
				     var type = id.split("_")[0];
				     if(type=="zc"||type=="jc"||type=="lc"){
				    	 maxValue = Class.config('zc');
				     }else if(type=="dc"){
				    	 maxValue = Class.config('dc');
				     }else if(type=="fc"||type=="tc"||type=="kp"){
				    	 maxValue = Class.config('szc');
				     }
				     //alert("num2="+num2+"num1="+num1);
					if( eval(num2) < eval(num1) ){						
						Y.alert("修改后的数据不能小于原数据");
						$("#"+id).val("");//先清空文本框
						$("#"+id).val(num1);//再重新赋值					
						return false;
					}else if(eval(num2)>eval(maxValue)){
						Y.alert("修改后的数据不能大于"+maxValue);
						$("#"+id).val("");//先清空文本框
						$("#"+id).val(num1);//再重新赋值					
						return false;
					}});			
		});			
		this.zcall.keyup( function() {  //
			var all_num = Y.get("#zcall").val();
			//Y.setNum(all_num,"1");
		}).blur( function() {
			var all_num = Y.get("#zcall").val();
			Y.setNum(all_num,"1");
		});
		
		this.jcall.keyup( function() {  //
			var all_num = Y.get("#jcall").val();
			//Y.setNum(all_num,"2");
		}).blur( function() {
			var all_num = Y.get("#jcall").val();
			Y.setNum(all_num,"2");
		});
		
		this.lcall.keyup( function() {  //
			var all_num = Y.get("#lcall").val();
			//Y.setNum(all_num,"3");
		}).blur( function() {
			var all_num = Y.get("#lcall").val();
			Y.setNum(all_num,"3");
		});
		
		this.dcall.keyup( function() {  //
			var all_num = Y.get("#dcall").val();
	        //Y.setNum(all_num,"4");
		}).blur( function() {
			var all_num = Y.get("#dcall").val();
			Y.setNum(all_num,"4");
		});
		
		
		
		this.fcall.keyup( function() {  //
			var all_num = Y.get("#fcall").val();
			//Y.setNum(all_num,"6");
		}).blur( function() {
			var all_num = Y.get("#fcall").val();
			Y.setNum(all_num,"5");
		});
		
		this.tcall.keyup( function() {  //
			var all_num = Y.get("#tcall").val();
			//Y.setNum(all_num,"5");
		}).blur( function() {
			var all_num = Y.get("#tcall").val();
			Y.setNum(all_num,"6");
		});
		
		this.kpall.keyup( function() {  //
			var all_num = Y.get("#kpall").val();
			//Y.setNum(all_num,"7");
		}).blur( function() {
			var all_num = Y.get("#kpall").val();
			Y.setNum(all_num,"7");
		});
	},
	setNum : function(num,type) {
		var inputs1 = ['zc_sfc','zc_rj','zc_bq','zc_jq'];
		var inputs2 = ['jc_spf','jc_jqs','jc_cbf','jc_bqc','jc_hh','jc_rspf','jc_gj','jc_gyj'];
		var inputs3 = ['lc_sf','lc_rfsf','lc_dxf','lc_sfc','lc_hh'];
		var inputs4 = ['dc_spf','dc_jqs','dc_cbf','dc_bqc','dc_sx'];
		var inputs5 = ['fc_ssq','fc_sd','fc_qlc'];
		var inputs6 = ['tc_dlt','tc_qxc','tc_ps','tc_pw'];	
		var inputs7 = ['kp_xw','kp_ssc','kp_nssc','kp_ydj','kp_gdxw','kp_ks'];
		
		if(type=="1" || type=="8"){
			var len1 = inputs1.length;
			for ( var i = 0; i < len1; i++) {
				
				if(Y.get("#" + inputs1[i]).val() > eval(num)){
					Y.alert("修改后的数据不能小于原数据的最大数");
					Class.config('submitting', true);
					return false;
				}else if(eval(num)>Class.config('zc')){
					Y.alert("修改后的数据不能大于"+Class.config('zc'));
					Class.config('submitting', true);
					return false;
				}else{
					Y.get("#" + inputs1[i]).val(num);
				}
			}
		
		}
		
		if(type=="2" || type=="8"){
			var len2 = inputs2.length;
			for ( var i = 0; i < len2; i++) {
				
				if(Y.get("#" + inputs2[i]).val() > eval(num)){
					Y.alert("修改后的数据不能小于原数据的最大数");
					Class.config('submitting', true);
					return false;
				}else if(eval(num)>Class.config('jc')){
					Y.alert("修改后的数据不能大于"+Class.config('jc'));
					Class.config('submitting', true);
					return false;
				}else{
					Y.get("#" + inputs2[i]).val(num);
				}
			}
		
		}
		
		if(type=="3" || type=="8"){
			var len3 = inputs3.length;
			for ( var i = 0; i < len3; i++) {
				
				if(Y.get("#" + inputs3[i]).val() > eval(num)){
					Y.alert("修改后的数据不能小于原数据的最大数");
					Class.config('submitting', true);
					return false;
				
				}else if(eval(num)>Class.config('jc')){
					Y.alert("修改后的数据不能大于"+Class.config('jc'));
					Class.config('submitting', true);
					return false;
				}else{
					Y.get("#" + inputs3[i]).val(num);
				}
			}
		}
		
		if(type=="4" || type=="8"){
			var len4 = inputs4.length;
			for ( var i = 0; i < len4; i++) {
				
				if(Y.get("#" + inputs4[i]).val() > eval(num)){
					Y.alert("修改后的数据不能小于原数据的最大数");
					Class.config('submitting', true);
					return false;
				}else if(eval(num)>Class.config('dc')){					
					Y.alert("修改后的数据不能大于"+Class.config('dc'));
					Class.config('submitting', true);
					return false;
				}else{
					Y.get("#" + inputs4[i]).val(num);
				}
			}
		}
		
		if(type=="5" || type=="8"){
			var len5 = inputs5.length;
			for ( var i = 0; i < len5; i++) {
				//alert(Y.get("#" + inputs5[i]).val()+"num"+num);
				if(Y.get("#" + inputs5[i]).val() > eval(num)){
					Y.alert("修改后的数据不能小于原数据的最大数");
					Class.config('submitting', true);
					return false;
				}else if(eval(num)>Class.config('szc')){
					Y.alert("修改后的数据不能大于"+Class.config('szc'));
					Class.config('submitting', true);
					return false;
				}else{
					Y.get("#" + inputs5[i]).val(num);
				}
			}
		}
			
		if(type=="6" || type=="8"){
			var len6 = inputs6.length;
			for ( var i = 0; i < len6; i++) {
				//alert(Y.get("#" + inputs6[i]).val()+"num"+num);
				if(Y.get("#" + inputs6[i]).val() > eval(num)){
					Y.alert("修改后的数据不能小于原数据的最大数");
					Class.config('submitting', true);
					return false;
				}else if(eval(num)>Class.config('szc')){
					Y.alert("修改后的数据不能大于"+Class.config('szc'));
					Class.config('submitting', true);
					return false;
				}else{
					Y.get("#" + inputs6[i]).val(num);
				}
			}
		
		}
		
		
		
		
		if(type=="7" || type=="8"){
			var len7 = inputs7.length;
			for ( var i = 0; i < len7; i++) {
				
				if(Y.get("#" + inputs7[i]).val() > eval(num)){
					Y.alert("修改后的数据不能小于原数据的最大数");
					Class.config('submitting', true);
					return false;
				}else if(eval(num)>Class.config('szc')){
					Y.alert("修改后的数据不能大于"+Class.config('szc'));
					Class.config('submitting', true);
					return false;
				}else{
					Y.get("#" + inputs7[i]).val(num);
				}
			}
		}
	}
});
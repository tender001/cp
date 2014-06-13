Class( 'myrate', {
	use   : 'mask',
	ready : true,
	index : function() {
		$("#tj_btn").click(function(){		
			top.Y.closeUrl();
		});
		$("input").each(function(i){
			$(this).attr("disabled","disabled");
		});
		this.showinfo();
	},

	showinfo:function(){
		 Y.ajax({
			 url : $_user.url.agentrt,
			 type : "POST",
			 dataType : "json",
			 end : function(d) {
			 var obj = eval("(" + d.text + ")");
			 var code = obj.Resp.code;
			 if (code == "0") {
			 var r = obj.Resp.row;
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
			 r.each(function(rt,o){
			 // var cagentid = rt.cagentid;
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
			 }else{
			 if (code=="1"){
			 parent.window.Y.postMsg('msg_login', function() {
			 window.location.reload();
			 });
			 }
			 }
			 }, 
			error : function() {
				Y.alert("您所请求的页面有异常！");
			}
		});
	}
});
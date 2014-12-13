$(document).ready(function(){
	var ddata = new Object();
	ddata.fid = "query_zh_detail";
	ddata.zid = location.search.getParam('zid');
	ddata.gid = location.search.getParam('gid');
	Tool.ajax('../qpage.aspx',
		ddata,
		function(sxml) {
			var code = $(sxml).find("Resp").attr("code");
			var desc = $(sxml).find("Resp").attr("desc");
			if(code == 0){
				Tool.table({
					xml:sxml,
					listNode:'row',
					tableWidth:'100%',
					dest:$("#table_zh_detail"),
					titles:['明细编号','期次编号','投注号码','投注倍数','投注金额','追号日期','投注日期','追号状态','中奖金额','税后奖金'],
					fields:['idetailid','cperiodid','ccodes','imulity','icmoney','cadddate','ccastdate','sname','iamoney','itax']
				});
			}else{
				Tool.warn(desc);
			}
		}
	);
});
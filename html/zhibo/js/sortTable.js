jQuery.extend({
	sortTable:
	function(args){
		var $ =jQuery,	
	//	table = $("#"+args.tableId),
	//	allTr = $("#"+args.tableId+'>tbody:eq(1)>tr'),	
		tHead = $("#"+args.tableId+" thead>tr:eq(0)>th").not($(".noSort"));
		//add

		var index_td = 0;
		tHead.each(function(){
			
			$(this).data("dir",1)   //排序的方向
			.data("index",$(this).prevAll().length)//计算每一列的绝对列
			.css("cursor","pointer")
			.attr("title","单击排序")
			.click(function(){
				_$this=$(this);
				table = $("#"+args.tableId);
				allTr = $("#"+args.tableId+'>tbody:eq(1)>tr');
					
				index_td = _$this.data("index");
				
				if( index_td==1 && _$this.children('a:eq(0)').hasClass('ordered') )
				{
					index_td = 0;
					
					$("#"+args.tableId+" thead>tr:eq(0)>th:eq(0)").data('dir',1);
					var dir = $("#"+args.tableId+" thead>tr:eq(0)>th:eq(0)").data('dir');
					
				}else{
					$("#"+args.tableId+" thead>tr:eq(0)>th:eq(1)").data('dir',-1);	
					var dir=_$this.data("dir");
				}
				
				allTr.sort(function(a,b){
				   
					var td1=$(a).children("td").eq(index_td).children('input[name="sort_input"]').val();
					
					td1=isNaN(Number(td1))?td1:Number(td1);   
					
					var td2=$(b).children("td").eq(index_td).children('input[name="sort_input"]').val();
					
					td2=isNaN(Number(td2))?td2:Number(td2);   
					
					if(td1>td2){
						return dir;
					}else if(td1<td2){
						return -dir;
					}else{
						return 0;
					}	
				});
				
				$(this).data("dir",-$(this).data("dir"));
				
				$(allTr).each(function(){		
					table.children("tbody:eq(1)").append($(this));
				});
				
				if($(this).data("dir")==1){
					
					$(this).children('a:eq(0)').addClass('ordered')  ;
				}else{
					
					$(this).children('a:eq(0)').removeClass('ordered');
				}  
				
				tableTrColor();
			});
		});
	}
});








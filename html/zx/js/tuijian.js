$(function(){
    	var expect=[];
        $(".jctj-t tbody tr:even").hover(function(){$(this).addClass("hover").next().addClass("hover")},
                function(){$(this).removeClass("hover").next().removeClass("hover")});
        $(".jctj-t tbody tr:odd").hover(function(){$(this).addClass("hover").prev().addClass("hover")},
                function(){$(this).removeClass("hover").prev().removeClass("hover")});
    
                 var ss;
        $(".jctj-t tbody").find("tr").each(function(o){
			
			expect.push($(this).attr("mark"));
			
        }) 
        expect=$_base_s.uniq(expect);
        var html='';
		var expectday=new Date().format("YY-MM-DD");
	
		
        if (expect.length>0){
			for ( var i = 0; i < expect.length; i++) {
				if(expectday==expect[i][0]){
//					html+='<option value="'+expectlist[i][0]+'" selected="selected">'+expectlist[i][0].substr(0,4)+'-'+expectlist[i][0].substr(4,2)+'-'+expectlist[i][0].substr(6,2)+'</option>';
					html+='<option value="'+expect[i]+'">'+expect[i]+'</option>';
				}else{
					html+='<option value="'+expect[i]+'">'+expect[i]+'</option>';
				}
				
			}		
		}
        $("#expect").html(html);
        $("#expect").bind({
    		change : function() {
    			var ex=$("#expect").val();
    			$("tr[mark]").hide();
    			$("tr[mark="+ex+"]").show();
    		}
    	});
    })
 var currentDate = new Date();
 var EndTimeMsg = 0;
 var timer;
 var startTime = "";
 var endTime = "";
 var type = "begin";
 var code = -1;
 var haveInit = 0;
Class({
	ready: true,

    index:function (config){
    	this.initSsq();
    	$("#cm_ssq_jx_btn").click();
		this.bindClickEvent();
    	
    	
    
   
    },
    getCodes:function(){
    	var ary = new Array($("#codes b input")[0].value,$("#codes b input")[1].value,$("#codes b input")[2].value,$("#codes b input")[3].value,$("#codes b input")[4].value,$("#codes b input")[5].value);
    	var nary = ary.sort();
    	for(var i = 0; i < nary.length - 1; i++)
    	{
    	if (nary[i] == nary[i+1])
    	{
    	Y.alert("出现重复号码：" + nary[i]);
    	return false;
    	}else if(nary[i]>33||nary[i]<1){
    	Y.alert('投注号码有误');
    	return false;
    	}
    	}
    	if($("#codes b input")[6].value>16||$("#codes b input")[6].value<1){
    	Y.alert('投注号码有误');
    	return false;
    	}
    	nary=nary+"|"+$("#codes b input")[6].value;
    	return nary;
    },
   
    bindClickEvent:function(){
    	$("div.tcxz div.tclist").hover(function(){
    		$(this).addClass("tclistover").siblings().removeClass("tclistover");
    	}).click(function(){
    		$(this).addClass("tclistcur").siblings().removeClass("tclistcur");
    		var type=($(this).index()*1)+2;
    		
    		$("#type").val(type);
    	}).mouseleave(function(){
    		$(this).removeClass("tclistover");
    	});
    	$("tbody input[mark=box]").click(function(){
    		if($(this).is(':checked')){
    			if($(this).val()=="0"){
    				$("input[value=1]").removeAttr("checked");
    			}else{
    				$("input[value=0]").removeAttr("checked");
    			}
    			$("#israndom").val($(this).val());
    		}
    	})
	   $("#input[mark=red]").keyup(function() {
	
		if(isNaN($(this).val())){
		$(this).val("");
		}
		else if($(this).val()>33||$(this).val()<1){
			$(this).val("");
		}
	}) 
	$("#red_code").keyup(function() {
		if($(this).val()>16||$(this).val()<1){
			$(this).val("");
		}
	});
    		    	
    	this.get('#qianggou').click(function(){
    		
    		var domain = document.domain;
    		var type = $("#type").val();
    		var type = $("#type").val();
    		
    		if(type<2||type>4){
    			Y.alert("请选择一种套餐!");
    			return false;
    		}else if(israndom>1 || israndom<0){
    			Y.alert("请选择机选或自选!");
    			return false;
    		}
//	    		 Y.postMsg('msg_login', function(){	 				 
//	 				 alert(0);	
	    			 Y._comboBuy();
//	 		 	 });
	    	
 		});
    } ,
    _comboBuy:function(){

    	_self = this;
    	var data="";
    	if($("#israndom").val()==1){
    		var codes=_self.getCodes();
    		data = "fid=taocan&gid=01&type="+$('#type').val()+"&israndom=0&codes="+codes+"&source=0";
    	}else if($("#israndom").val()==0){
    		data = "fid=taocan&gid=01&type="+$('#type').val()+"&israndom=1&source=0";
    	}
    	

    		$.ajax({
    			url:"/phpt/t.phpx",
    			type: "POST",
          		dataType : "json",
                data: data,
                success: function(json) {
    	            
    				var R = json.Resp;
    				var code = R.code;
    				var desc = R.desc;
    			
    				if(code==0){//成功

    					window.location.href = "/account/chase.html";
    				}else{	
    					Y.alert(desc);	
    				}
    			}
    		}
    		);
    		
    },
    initSsq: function(){
		Y = this;
		var inputs = $("#codes b" + " input");
		var r1 = $('#codes b input').slice(0,6);
		var b1 = $('#codes b input').slice(6,7);
		
		for(var i = 0; i < 6; i ++ ){
			inputs[i].index = i;
			inputs[i].onkeyup = function(){
				var obj = this;
				this.value = this.value.replace(/\D/,"");
				if(this.value > 33){this.value = '';};
			};
			
			inputs[i].onblur = function(){
				for(var j=0; j<this.index; j++){
					if(this.value == inputs[j].value){this.value = '';};
				}
				for(var j=(this.index+1); j<6; j++){
					if(this.value == inputs[j].value){this.value = '';};
				}
				if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
				if(this.value == 0){this.value = "";}
			};
		};
		
		//蓝球
		inputs[6].onkeyup = function(){
			var obj = this;
			this.value = this.value.replace(/\D/,"");
			if(this.value > 16){this.value = '';};
		};
		inputs[6].onblur = function(){
			if(this.value.length == 1 && this.value != 0){this.value = "0" + this.value;}
			if(this.value == 0){this.value = "";}
		};
		
		//机选
		$("#cm_ssq_jx_btn").click(function(){
			haveInit++;
			new ScorllNum(33,r1,ranDom);
			new ScorllNum(16,b1,ranDom);
			if(haveInit>1){
				$("#zx_type,#jx_type").removeClass("emtwo");
	    		$("#zx_type").addClass("emtwo");
			}
			
		});
		
		function ranDom(){
			var num = [32,1,8,5,7,33,10,4,9,6,11,12,2,3,15,13,14,16,17,18,20,19,21,23,22,26,24,30,31,27,25,29,28];
			var num1 = [2,1,16,3,6,7,5,4,14,9,15,10,11,12,8,13];
			num.aSort(2);
			num.aSort(2);
			num1.aSort(2);
			num1.aSort(2);
			var v = num.splice(0,6);
			v.aSort(0);
			for(var i = 0; i < 6; i ++ ){
				v[i] < 10 ? v[i] = "0" + v[i] : v[i] = v[i];
				inputs[i].value = v[i];
			};
			var v1 = num1[0] < 10 ? "0" + num1[0] : num1[0];
			inputs[6].value = v1;
		};
	}
    	
    	
});
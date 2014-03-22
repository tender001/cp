window.onload = function() {
var xmlHttp;
var JsonHttp;

        function createxmlHttpRequest()
        {
            if(window.ActiveXObject)
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            else if(window.XMLHttpRequest)
                xmlHttp = new XMLHttpRequest();
        }
		 function createjsonHttpRequest()
        {
            if(window.ActiveXObject)
                JsonHttp = new ActiveXObject("Microsoft.XMLHTTP");
            else if(window.XMLHttpRequest)
                JsonHttp = new XMLHttpRequest();
        }
        function createQueryString()
        {
          //   var endtime = document.getElementById("endtime").value;
            var gpool = document.getElementById("gpool").value;
			var expect = document.getElementById("expect").value;
            var queryString = "expect="+expect+"&gpool="+gpool;
            return encodeURI(encodeURI(queryString));//防止乱码
        }
        function doRequestUsingGet()
        {
            createxmlHttpRequest();
            var queryString = "AjaxHandler.ashx?";
            queryString+=createQueryString()+"&timestamp="+new Date().getTime();
            xmlHttp.open("GET",queryString);
            xmlHttp.onreadystatechange = handleStateChange;
            xmlHttp.send(null);
        }
        function doRequestUsingPost()
        {
            createxmlHttpRequest();
            var url ="/cpdata/game/01/s.json?timestamp="+new Date().getTime();
            var queryString = createQueryString();
            xmlHttp.open("GET",url);
            xmlHttp.onreadystatechange = handleStateChange;
            xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            xmlHttp.send();
        }
		 function doRequestUsingPost2()
        {
            createjsonHttpRequest();
            var url ="/tdata/01/last_10.xml?timestamp="+new Date().getTime();
            var queryString = createQueryString();
            JsonHttp.open("GET",url);
            JsonHttp.onreadystatechange = handleStateChange2;
            JsonHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            JsonHttp.send();
        }
		
        function handleStateChange()
        {
            if(xmlHttp.readyState==4 && xmlHttp.status == 200)
            {
                var  responseEndtime= document.getElementById("endtime");
				var responseExpect = document.getElementById("expect");
				var obj=eval('(' + xmlHttp.responseText+ ')')
				responseExpect.innerHTML=decodeURI(obj.period.row[0].pid);
				
				var   date   =   new   Date(Date.parse((obj.period.row[0].et).replace(/-/g,   "/")));   
				responseEndtime.innerHTML=decodeURI((date.getMonth()+1)+'月'+date.getDate()+'日&nbsp;'+date.getHours()+':'+date.getMinutes());
            }
        }
		 function handleStateChange2()
        {
            if(JsonHttp.readyState==4 && JsonHttp.status == 200)
            {
                var responseDiv = document.getElementById("gpool");
            var gpool=0;
			if (window.ActiveXObject){ //判断是否ie
				gpool=JsonHttp.responseXML.documentElement.childNodes[0].attributes[4].nodeValue;
			}else {
				gpool=JsonHttp.responseXML.documentElement.childNodes[1].attributes[4].nodeValue;
			}

				
				responseDiv.innerHTML=decodeURI(gpool);
            }
        }
		doRequestUsingPost2();
		doRequestUsingPost();
		 
		var div = document.getElementById("div1");
		var a = document.getElementById("a1");
		div.onmouseover=function(){
				div.style.display = "none";
				a.style.display = "block";
		}
		a.onmouseover=function(){
				div.style.display = "none";
				a.style.display = "block";
		}
		a.onmouseout=function(){
				a.style.display = "none";
				div.style.display = "block";
		}
		 div.onmouseout=function(){
				a.style.display = "none";
				div.style.display = "block";
		}
		
		var div2 = document.getElementById("div2");
		var a2 = document.getElementById("a2");
		div2.onmouseover=function(){
				div2.style.display = "none";
				a2.style.display = "block";
		}
		a2.onmouseover=function(){
				div2.style.display = "none";
				a2.style.display = "block";
		}
		a2.onmouseout=function(){
				a2.style.display = "none";
				div2.style.display = "block";
		}
		 div2.onmouseout=function(){
				a2.style.display = "none";
				div2.style.display = "block";
		}
		var div3 = document.getElementById("div3");
		var a3 = document.getElementById("a3");
		div3.onmouseover=function(){
				div3.style.display = "none";
				a3.style.display = "block";
		}
		a3.onmouseover=function(){
				div3.style.display = "none";
				a3.style.display = "block";
		}
		a3.onmouseout=function(){
				a3.style.display = "none";
				div3.style.display = "block";
		}
		 div3.onmouseout=function(){
				a3.style.display = "none";
				div3.style.display = "block";
		}
		var div4 = document.getElementById("div4");
		var a4 = document.getElementById("a4");
		div4.onmouseover=function(){
				div4.style.display = "none";
				a4.style.display = "block";
		}
		a4.onmouseover=function(){
				div4.style.display = "none";
				a4.style.display = "block";
		}
		a4.onmouseout=function(){
				a4.style.display = "none";
				div4.style.display = "block";
		}
		 div4.onmouseout=function(){
				a4.style.display = "none";
				div4.style.display = "block";
		}
		var div5 = document.getElementById("div5");
		var a5 = document.getElementById("a5");
		div5.onmouseover=function(){
				div5.style.display = "none";
				a5.style.display = "block";
		}
		a5.onmouseover=function(){
				div5.style.display = "none";
				a5.style.display = "block";
		}
		a5.onmouseout=function(){
				a5.style.display = "none";
				div5.style.display = "block";
		}
		 div5.onmouseout=function(){
				a5.style.display = "none";
				div5.style.display = "block";
		}
		var div6 = document.getElementById("div6");
		var a6 = document.getElementById("a6");
		div6.onmouseover=function(){
				div6.style.display = "none";
				a6.style.display = "block";
		}
		a6.onmouseover=function(){
				div6.style.display = "none";
				a6.style.display = "block";
		}
		a6.onmouseout=function(){
				a6.style.display = "none";
				div6.style.display = "block";
		}
		 div6.onmouseout=function(){
				a6.style.display = "none";
				div6.style.display = "block";
		}
		var div7 = document.getElementById("div7");
		var a7 = document.getElementById("a7");
		div7.onmouseover=function(){
				div7.style.display = "none";
				a7.style.display = "block";
		}
		a7.onmouseover=function(){
				div7.style.display = "none";
				a7.style.display = "block";
		}
		a7.onmouseout=function(){
				a7.style.display = "none";
				div7.style.display = "block";
		}
		 div7.onmouseout=function(){
				a7.style.display = "none";
				div7.style.display = "block";
		}
		var div8 = document.getElementById("div8");
		var a8 = document.getElementById("a8");
		div8.onmouseover=function(){
				div8.style.display = "none";
				a8.style.display = "block";
		}
		a8.onmouseover=function(){
				div8.style.display = "none";
				a8.style.display = "block";
		}
		a8.onmouseout=function(){
				a8.style.display = "none";
				div8.style.display = "block";
		}
		 div8.onmouseout=function(){
				a8.style.display = "none";
				div8.style.display = "block";
		}
		var div9 = document.getElementById("div9");
		var a9 = document.getElementById("a9");
		div9.onmouseover=function(){
				div9.style.display = "none";
				a9.style.display = "block";
		}
		a9.onmouseover=function(){
				div9.style.display = "none";
				a9.style.display = "block";
		}
		a9.onmouseout=function(){
				a9.style.display = "none";
				div9.style.display = "block";
		}
		 div9.onmouseout=function(){
				a9.style.display = "none";
				div9.style.display = "block";
		}
	
		
		
}
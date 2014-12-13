$(function(){
	$('#logoutbtn').click(function(){
		window.location.href = 'login.html';
	});
});

function setZebraTable($table) {
	$('tbody > tr:odd',$table).addClass('odd');
	$('tbody > tr:even',$table).addClass('even');
}

function fmoney(s, n) //s:传入的float数字 ，n:希望返回小数点几位
{
	n = n >= 0 && n <= 20 ? n : 2;
	s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
	r = s.split(".")[1];
	t = "";
	for(i = 0; i < l.length; i ++ )
	{
	t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	if (n == 0) return t.split("").reverse().join("");
	return t.split("").reverse().join("") + "." + r;
} 
function rmoney(s)
{
	return parseFloat(s.replace(/[^\d\.-]/g, ""));
} 
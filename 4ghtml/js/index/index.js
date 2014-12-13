
$(document).ready(function() {
	init();
});
var init=function() {
	TouchSlide({ 
		slideCell:"#focus",
		titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
		mainCell:".bd ul", 
		effect:"leftLoop", 
		autoPlay:true,//自动播放
		autoPage:true //自动分页
	});
	setInterval(function() {
        autoScroll()
    },4e3);
	
};
var  autoScroll=function() {
    this.$(".zj_tipBox").animate({
        marginTop: "-28px"
    },
    500,
    function() {
        var i = $(this);
        i.css("margin-top", 0),
        i.find("tr").eq(0).appendTo(i.find("div"))
    })
}
//var TouchSlide = function(a) {
//    a = a || {};
//    var b = {
//        slideCell: a.slideCell || "#touchSlide",
//        titCell: a.titCell || ".hd li",
//        mainCell: a.mainCell || ".bd",
//        effect: a.effect || "left",
//        autoPlay: a.autoPlay || !1,
//        delayTime: a.delayTime || 200,
//        interTime: a.interTime || 2500,
//        defaultIndex: a.defaultIndex || 0,
//        titOnClassName: a.titOnClassName || "on",
//        autoPage: a.autoPage || !1,
//        prevCell: a.prevCell || ".prev",
//        nextCell: a.nextCell || ".next",
//        pageStateCell: a.pageStateCell || ".pageState",
//        pnLoop: "undefined " == a.pnLoop ? !0 : a.pnLoop,
//        startFun: a.startFun || null,
//        endFun: a.endFun || null,
//        switchLoad: a.switchLoad || null
//    },
//    c = document.getElementById(b.slideCell.replace("#", ""));
//    if (!c) return ! 1;
//    var d = function(a, b) {
//        a = a.split(" ");
//        var c = [];
//        b = b || document;
//        var d = [b];
//        for (var e in a) 0 != a[e].length && c.push(a[e]);
//        for (var e in c) {
//            if (0 == d.length) return ! 1;
//            var f = [];
//            for (var g in d) if ("#" == c[e][0]) f.push(document.getElementById(c[e].replace("#", "")));
//            else if ("." == c[e][0]) for (var h = b.getElementsByTagName("*"), i = 0; i < h.length; i++) {
//                var j = h[i].className;
//                j && -1 != j.search(new RegExp("\\b" + c[e].replace(".", "") + "\\b")) && f.push(h[i])
//            } else for (var h = b.getElementsByTagName(c[e]), i = 0; i < h.length; i++) f.push(h[i]);
//            d = f
//        }
//        return 0 == d.length || d[0] == b ? !1 : d
//    },
//    e = function(a, b) {
//        var c = document.createElement("div");
//        c.innerHTML = b,
//        c = c.children[0];
//        var d = a.cloneNode(!0);
//        return c.appendChild(d),
//        a.parentNode.replaceChild(c, a),
//        m = d,
//        c
//    },
//    g = function(a, b) { ! a || !b || a.className && -1 != a.className.search(new RegExp("\\b" + b + "\\b")) || (a.className += (a.className ? " ": "") + b)
//    },
//    h = function(a, b) { ! a || !b || a.className && -1 == a.className.search(new RegExp("\\b" + b + "\\b")) || (a.className = a.className.replace(new RegExp("\\s*\\b" + b + "\\b", "g"), ""))
//    },
//    i = b.effect,
//    j = d(b.prevCell, c)[0],
//    k = d(b.nextCell, c)[0],
//    l = d(b.pageStateCell)[0],
//    m = d(b.mainCell, c)[0];
//    if (!m) return ! 1;
//    var N, O, n = m.children.length,
//    o = d(b.titCell, c),
//    p = o ? o.length: n,
//    q = b.switchLoad,
//    r = parseInt(b.defaultIndex),
//    s = parseInt(b.delayTime),
//    t = parseInt(b.interTime),
//    u = "false" == b.autoPlay || 0 == b.autoPlay ? !1 : !0,
//    v = "false" == b.autoPage || 0 == b.autoPage ? !1 : !0,
//    w = "false" == b.pnLoop || 0 == b.pnLoop ? !1 : !0,
//    x = r,
//    y = null,
//    z = null,
//    A = null,
//    B = 0,
//    C = 0,
//    D = 0,
//    E = 0,
//    G = /hp-tablet/gi.test(navigator.appVersion),
//    H = "ontouchstart" in window && !G,
//    I = H ? "touchstart": "mousedown",
//    J = H ? "touchmove": "",
//    K = H ? "touchend": "mouseup",
//    M = m.parentNode.clientWidth,
//    P = n;
//    if (0 == p && (p = n), v) {
//        p = n,
//        o = o[0],
//        o.innerHTML = "";
//        var Q = "";
//        if (1 == b.autoPage || "true" == b.autoPage) for (var R = 0; p > R; R++) Q += "<li>" + (R + 1) + "</li>";
//        else for (var R = 0; p > R; R++) Q += b.autoPage.replace("$", R + 1);
//        o.innerHTML = Q,
//        o = o.children
//    }
//    "leftLoop" == i && (P += 2, m.appendChild(m.children[0].cloneNode(!0)), m.insertBefore(m.children[n - 1].cloneNode(!0), m.children[0])),
//    N = e(m, '<div class="tempWrap" style="overflow:hidden; position:relative;"></div>'),
//    m.style.cssText = "width:" + P * M + "px;" + "position:relative;overflow:hidden;padding:0;margin:0;";
//    for (var R = 0; P > R; R++) m.children[R].style.cssText = "display:table-cell;vertical-align:top;width:" + M + "px";
//    var S = function() {
//        "function" == typeof b.startFun && b.startFun(r, p)
//    },
//    T = function() {
//        "function" == typeof b.endFun && b.endFun(r, p)
//    },
//    U = function(a) {
//        var b = ("leftLoop" == i ? r + 1 : r) + a,
//        c = function(a) {
//            for (var b = m.children[a].getElementsByTagName("img"), c = 0; c < b.length; c++) b[c].getAttribute(q) && (b[c].setAttribute("src", b[c].getAttribute(q)), b[c].removeAttribute(q))
//        };
//        if (c(b), "leftLoop" == i) switch (b) {
//        case 0:
//            c(n);
//            break;
//        case 1:
//            c(n + 1);
//            break;
//        case n:
//            c(0);
//            break;
//        case n + 1 : c(1)
//        }
//    },
//    V = function() {
//        M = N.clientWidth,
//        m.style.width = P * M + "px";
//        for (var a = 0; P > a; a++) m.children[a].style.width = M + "px";
//        var b = "leftLoop" == i ? r + 1 : r;
//        W( - b * M, 0)
//    };
//    window.addEventListener("resize", V, !1);
//    var W = function(a, b, c) {
//        c = c ? c.style: m.style,
//        c.webkitTransitionDuration = c.MozTransitionDuration = c.msTransitionDuration = c.OTransitionDuration = c.transitionDuration = b + "ms",
//        c.webkitTransform = "translate(" + a + "px,0)" + "translateZ(0)",
//        c.msTransform = c.MozTransform = c.OTransform = "translateX(" + a + "px)"
//    },
//    X = function(a) {
//        switch (i) {
//        case "left":
//            r >= p ? r = a ? r - 1 : 0 : 0 > r && (r = a ? 0 : p - 1),
//            null != q && U(0),
//            W( - r * M, s),
//            x = r;
//            break;
//        case "leftLoop":
//            null != q && U(0),
//            W( - (r + 1) * M, s),
//            -1 == r ? (z = setTimeout(function() {
//                W( - p * M, 0)
//            },
//            s), r = p - 1) : r == p && (z = setTimeout(function() {
//                W( - M, 0)
//            },
//            s), r = 0),
//            x = r
//        }
//        S(),
//        A = setTimeout(function() {
//            T()
//        },
//        s);
//        for (var c = 0; p > c; c++) h(o[c], b.titOnClassName),
//        c == r && g(o[c], b.titOnClassName);
//        0 == w && (h(k, "nextStop"), h(j, "prevStop"), 0 == r ? g(j, "prevStop") : r == p - 1 && g(k, "nextStop")),
//        l && (l.innerHTML = "<span>" + (r + 1) + "</span>/" + p)
//    };
//    if (X(), u && (y = setInterval(function() {
//        r++,
//        X()
//    },
//    t)), o) for (var R = 0; p > R; R++) !
//    function() {
//        var a = R;
//        o[a].addEventListener("click",
//        function() {
//            clearTimeout(z),
//            clearTimeout(A),
//            r = a,
//            X()
//        })
//    } ();
//    k && k.addEventListener("click",
//    function() { (1 == w || r != p - 1) && (clearTimeout(z), clearTimeout(A), r++, X())
//    }),
//    j && j.addEventListener("click",
//    function() { (1 == w || 0 != r) && (clearTimeout(z), clearTimeout(A), r--, X())
//    });
//    var Y = function(a) {
//        clearTimeout(z),
//        clearTimeout(A),
//        O = void 0,
//        D = 0;
//        var b = H ? a.touches[0] : a;
//        B = b.pageX,
//        C = b.pageY,
//        m.addEventListener(J, Z, !1),
//        m.addEventListener(K, $, !1)
//    },
//    Z = function(a) {
//        if (!H || !(a.touches.length > 1 || a.scale && 1 !== a.scale)) {
//            var b = H ? a.touches[0] : a;
//            if (D = b.pageX - B, E = b.pageY - C, "undefined" == typeof O && (O = !!(O || Math.abs(D) < Math.abs(E))), !O) {
//                switch (a.preventDefault(), u && clearInterval(y), i) {
//                case "left":
//                    (0 == r && D > 0 || r >= p - 1 && 0 > D) && (D = .4 * D),
//                    W( - r * M + D, 0);
//                    break;
//                case "leftLoop":
//                    W( - (r + 1) * M + D, 0)
//                }
//                null != q && Math.abs(D) > M / 3 && U(D > -0 ? -1 : 1)
//            }
//        }
//    },
//    $ = function(a) {
//        0 != D && (a.preventDefault(), O || (Math.abs(D) > M / 10 && (D > 0 ? r--:r++), X(!0), u && (y = setInterval(function() {
//            r++,
//            X()
//        },
//        t))), m.removeEventListener(J, Z, !1), m.removeEventListener(K, $, !1))
//    };
//    m.addEventListener(I, Y, !1)
//};
///*
//TouchSlider 0.95
//Licensed under the MIT license.
//http://touchslider.com
//*/
//(function(a,b){window.touchSlider=function(c){function s(a){n.removeClass(c.currentClass).eq(a).addClass(c.currentClass)}function t(a,c){var d=f.current;d!==a&&(a=a!==b?a:d+1,q.to(a,{complete:c}))}function u(a){q.to(f.current+1,{dirX:1,complete:a})}function v(a){q.to(f.current-1,{dirX:-1,complete:a})}function z(){x&&A()}function A(){return x=!0,w||(clearTimeout(y),y=setTimeout(function(){!q.moving&&!w&&u()},c.delay)),c.container}function B(){return clearTimeout(y),x=!1,c.container}function C(){var b=a(document),c,e,f=!1,m,n,o,p,s,t,u,v,w,x,y,z=function(a){if(a.which>1)return;f&&b.triggerHandler(j+"."+d),f=!0,e=!1,c=a.timeStamp,s=x=0,m=[0,0,0,c];if(a.originalEvent.touches){b.one(h,A);return}a.preventDefault(),o=p=a.pageX,v=w=a.pageY,u=l[0].offsetLeft,n=[0,0,0,o],b.bind(i,B),b.one(j+"."+d,C),q.moveStart(a)},A=function(a){if(a.originalEvent.touches.length!==1)return;o=p=a.pageX=a.originalEvent.touches[0].pageX,v=w=a.pageY=a.originalEvent.touches[0].pageY,t=y=0,u=(new WebKitCSSMatrix(window.getComputedStyle(l[0]).webkitTransform)).e,n=[0,0,0,o],b.bind(i,B),b.one(j,C),q.moveStart(a)},B=function(b){var c,d;if(b.originalEvent.touches&&g){if(b.originalEvent.touches.length!==1)return;c=b.pageX=b.originalEvent.touches[0].pageX,d=b.pageY=b.originalEvent.touches[0].pageY,t+=Math.abs(c-p),y+=Math.abs(d-w);if(Math.abs(t-y)>50){var f=t;t=Math.min(100,Math.max(0,t-y)),y=Math.min(100,Math.max(0,y-f))}if(c===p)return;e||(t>y?(b.preventDefault(),e=!0):C(b))}else{c=b.pageX,d=b.pageY;if(c===p)return;a.browser.msie&&b.preventDefault()}s+=Math.abs(c-p),x+=Math.abs(d-w),m.shift(),m.push(b.timeStamp),n.shift(),n.push(c),q.move(b,p),p=c,w=d},C=function(a){f=!1;if(!a.originalEvent||a.originalEvent.touches)a.pageX=p,a.pageY=w;b.unbind(i,B);var d=m.length,e=0,g=0;while(--d>0)if(m[d-1]){var h=n[d]-n[d-1];e+=Math.abs(h)/(m[d]-m[d-1]),h!==0&&(g=h>0?-1:1)}e/=m.length,q.moveEnd(a,e,g,c,s,x),r=!1,s+x>4&&k.one("click",function(a){a.preventDefault()})};k.bind(h,z)}c=c||{};var d=c.namespace||"touchslider",e=a(c.container);if(e.length!==1){e.each(function(){touchSlider({container:this})});return}c=a.extend({autoplay:!1,delay:3e3,margin:5,viewport:"."+d+"-viewport",prev:"."+d+"-prev",next:"."+d+"-next",pagination:"."+d+"-nav-item",currentClass:d+"-nav-item-current",duration:350,mouseTouch:!0},c);var f={current:0,step:t,next:u,prev:v,start:A,stop:B},g="ontouchstart"in window&&"WebKitCSSMatrix"in window,h="touchstart",i="touchmove",j="touchend",k=a(c.viewport,e),l=c.scroller?a(c.scroller,e):k.children(),m=l.children(),n=a(c.pagination,e);if(l.css("position")!=="absolute"){var o=k.height();k.css({height:o,position:"relative"}),l.css({position:"absolute",left:0,height:o,width:1e5})}g||(h="mousedown",i="mousemove",j="mouseup"),m.css("position","absolute");var p=g?function(a,c,d){if(c===b)return(new WebKitCSSMatrix(getComputedStyle(a.jquery?a[0]:a).webkitTransform)).e;a.css({webkitTransitionDuration:d?d+"ms":"0",webkitTransform:function(a){return"translate3d("+(typeof c=="number"?c:c.call(this,a))+"px,0,0)"}})}:function(a,c){if(c===b)return parseInt((a.jquery?a[0]:a).style.left,10);a.css("left",c)};g&&m.css({webkitTransitionProperty:"-webkit-transform",webkitTransitionTimingFunction:"cubic-bezier(0,0,0.25,1)"}),p(m.not(m[0]),1e4),p(m.eq(0),0);var q=function(){var d=[0],e=[0],h=a.noop;return{moving:!1,init:function(){l.bind("webkitTransitionEnd",function(){h()})},to:function(i,j){j=j||{},i>=m.length?i=0:i<0&&(i=m.length-1);var k=c.duration,n=m.eq(i),o=a.inArray(i,d),r=0;l.stop(),q.moving=!0,clearTimeout(y);if(o!==-1)r=e[o];else{var t,u=m.index(n);o=b;if(j.dirX===-1)e.unshift(0),d.unshift(u);else if(j.dirX===1)e.push(0),d.push(u);else{for(t=d.length-1;t>=0;t--)if(d[t]<u){e.splice(t+1,0,0),d.splice(t+1,0,u),o=0;break}o===b&&(e.unshift(e),d.unshift(u))}o=a.inArray(u,d);if(o===0)r=e[1]-(n.outerWidth()+c.margin),p(n,r),e[o]=r;else if(o===d.length-1)r=e[o-1]+m.eq(d[o-1]).outerWidth()+c.margin,p(n,r),e[o]=r;else{var v=n.outerWidth();n.css("opacity",0),r=e[o+1]-Math.round((v+c.margin)/2),e[o]=r,p(n,r);var w=r,x=d.length;for(t=o-1;t>=0;t--)w-=m.eq(d[t]).outerWidth()+c.margin,e[t]=w;var A=r;for(t=o+1;t<x;t++)A+=m.eq(d[t]).outerWidth()+c.margin,e[t]=A;for(t=0;t<x;t++)m.eq(d[t]).animate({left:e[t]},{duration:k,queue:!1,complete:function(){n.is(this)&&n.animate({opacity:1},k)}})}}j.pxInMs&&(k=Math.min(Math.max(Math.round(Math.abs(p(l))/j.pxInMs),100),k)),h=function(){p(m.not(n),-1e4),d=[m.index(n)],e=[r],j.complete&&j.complete(),q.moving=!1,z()},g?p(l,-r,k):l.animate({left:-r},{duration:k,queue:!1,complete:h}),f.current=i,s(i)},stop:function(){g?p(l,p(l)):l.stop()},moveStart:function(a){q.moving=!0,clearTimeout(y),l.stop(),q.startPageX=a.pageX;var b=p(l),c;q.leftCount=b,d[0]===0?e[0]+b>0&&(q.leftCount=b+(e[0]+b)*3):d[d.length-1]===m.length-1&&(c=e[d.length-1]+b,c<0&&(q.leftCount=b+c*3))},move:function(a,b){var f=a.pageX-b,g=p(l),h=m.eq(d[0]),i=d.length-1,j=m.eq(d[i]),n,o,r;q.leftCount+=f;if(f>0)while(d[0]!==0&&g+e[0]+f>c.margin)n=m.eq(d[0]-1),o=e[0]-n.outerWidth()-c.margin,p(n,o),e.unshift(o),d.unshift(d[0]-1),i++,h=n;(f>0&&g+e[0]+f>0||f<0&&g+e[0]>0)&&d[0]===0&&(r=Math.min(Math.round((q.leftCount+e[0])/4),k.innerWidth()/2),f=r-(g+e[0]));if(f<0)while(!j.is(m.last())&&g+e[i]+f+j.outerWidth()+c.margin<k.innerWidth())n=m.eq(d[i]+1),o=e[i]+j.outerWidth()+c.margin,p(n,o),e.push(o),d.push(d[i++]+1),j=n;(f>0&&g+e[i]<0||f<0&&g+e[i]+f<0)&&j.is(m.last())&&(r=Math.max(Math.round((q.leftCount+e[i])/4),-k.innerWidth()/2),f=r-(g+e[i])),p(l,g+f)},moveEnd:function(a,b,c,f,g,h){var i=d.length,j=p(l),n=i-1,o;if(e[0]+j>0)n=0;else if(!(e[d.length-1]+j<0)){o={pxInMs:b};var s,t,u=i-1,v=k.innerWidth();for(s=0;s<i-1;s++){t=e[s]+m.eq(d[s]).outerWidth()+j;if(t>0&&t>v-(e[s+1]+j)){u=s;break}}if(r)n=u;else{var w=i-1,x=Math.round(l.offset().left);for(s=0;s<i;s++)if(e[s]+x>a.pageX){w=s-1;break}n=u,u===w&&a.timeStamp-f<1e3&&g+h>Math.sqrt(Math.pow(k.height(),2)+Math.pow(v,2))*.05&&(n=Math.max(0,Math.min(i-1,n+c)))}}n=d[n],q.to(n,o)}}}();q.init();if(g){var r=!1;l.bind("webkitTransitionStart",function(){r=!0}),l.bind("webkitTransitionEnd",function(){r=!1})}var w=!1,x=!1,y;k.hover(function(){clearTimeout(y),w=!0},function(){w=!1,z()}),n.click(function(){t(n.index(this))}),a(c.prev,e).click(function(){v()}),a(c.next,e).click(function(){u()}),c.mouseTouch&&C(),c.autoplay&&A(),e.data(d,f)},a.fn.touchSlider=function(a){return a=a||{},a.container=this,touchSlider(a),this}})(jQuery);
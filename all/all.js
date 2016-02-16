function getByClass(sClass, oParent) {
    if (!oParent) {
        oParent = document;
    }

    if(oParent.getElementsByClassName) {
        return oParent.getElementsByClassName(sClass);
    } else {
        var result = [];
        var aEle = oParent.getElementsByTagName('*');
        var re = new RegExp('\\b'+sClass+'\\b');

        for(var i = 0; i < aEle.length; i++) {
            if(aEle[i].className.search(re) != -1) {
                result.push(aEle[i]);
            }
        }

        return result;
    }
}

function getPos(obj){
    var l = 0;
    var t = 0;
    while(obj){
        l += obj.offsetLeft;
        t += obj.offsetTop;

        obj = obj.offsetParent;
    }
    return {left:l,top:t};
}

function addEvent(obj,type,fn){
    if (obj.addEventListener) {
        obj.addEventListener(type, fn, false);
    } else {
        obj.attachEvent('on' + type, function() {
            fn.call(obj);
        })
    }
}

// 滚动
(function() {
    var oNav = document.getElementById('nav1');
    var aA = oNav.children;
    for (var i = 0; i < aA.length; i++) {
        (function(index) {
            aA[i].onclick = function() {
                var sHref = this.href;
                sHref = sHref.substring(sHref.lastIndexOf('/') + 1);
                var oSub = document.getElementById(sHref);
                var iScrollTop = getPos(oSub).top;

                if (aA.length != index + 1) {
                    moveScroll(iScrollTop, 1000);
                    return false;
                }

            };
        })(i)

    }

    var isUser = false;
    addEvent(window,'scroll',function(){
        if(isUser){
            clearInterval(timer);
        }
        isUser = true;
    });

    var timer = null;
    function moveScroll(iTarget,time){
        var start = document.documentElement.scrollTop || document.body.scrollTop;
        var dis = iTarget - start;

        var count = Math.round(time/30);
        var n = 0;
        clearInterval(timer);
        timer = setInterval(function(){
            n++;

            isUser = false;
            var a = 1 - n/count;
            var cur = start + dis*(1-a*a*a);
            document.documentElement.scrollTop = cur;
            document.body.scrollTop = cur;

            if(n == count){
                clearInterval(timer);
            }
        },30);
    }

})();


// 第一屏拖拽-速度
(function() {

    var aGeek = getByClass('geek', document.body);
    for (var i = 0; i < aGeek.length; i++) {
        dragSpeed(aGeek[i]);
    }

    function dragSpeed(oDiv) {
    var timer=null;

    var speedX=0;
    var speedY=0;

    var lastX=0;
    var lastY=0;

    var i=0;

    oDiv.onmousedown=function (ev) {
        var oEvent=ev||event;

        var disX=oEvent.clientX-oDiv.offsetLeft;
        var disY=oEvent.clientY-oDiv.offsetTop;

        clearInterval(timer);

        document.onmousemove=function (ev) {
            var oEvent=ev||event;

            oDiv.style.left=oEvent.clientX-disX+'px';
            oDiv.style.top=oEvent.clientY-disY+'px';

            speedX=oDiv.offsetLeft-lastX;
            speedY=oDiv.offsetTop-lastY;

            lastX=oDiv.offsetLeft;
            lastY=oDiv.offsetTop;
        };
        document.onmouseup=function () {
            document.onmousemove=null;
            document.onmouseup=null;

            clearInterval(timer);
            timer=setInterval(function (){
                speedY+=3;

                var l=oDiv.offsetLeft+speedX;
                var t=oDiv.offsetTop+speedY;

                if(t>=document.documentElement.clientHeight-oDiv.offsetHeight) {
                    speedY*=-0.8;
                    speedX*=0.8;
                    t=document.documentElement.clientHeight-oDiv.offsetHeight;
                }
                else if(t<=0) {
                    speedY*=-0.8;
                    speedX*=0.8;
                    t=0;
                }

                if(l>=document.documentElement.clientWidth-oDiv.offsetWidth) {
                    speedX*=-0.8;
                    speedY*=0.8;
                    l=document.documentElement.clientWidth-oDiv.offsetWidth;
                }
                else if(l<=0) {
                    speedX*=-0.8;
                    speedY*=0.8;
                    l=0;
                }

                if(Math.abs(speedX)<1) {
                    speedX=0;
                }
                if(Math.abs(speedY)<1) {
                    speedY=0;
                }

                oDiv.style.left=l+'px';
                oDiv.style.top=t+'px';

                if(speedX==0 && speedY==0 && oDiv.offsetTop==document.documentElement.clientHeight-oDiv.offsetHeight) {
                    clearInterval(timer);
                    for (var i = 0; i < aGeek.length; i++) {
                        aGeek[i].style.left = 0;
                        aGeek[i].style.top = 0;
                    }
                }
            }, 30);
        };
    };
    }

})();


// 第二屏 文字创建
(function() {
    var arr = [
        ['定时器应用秒表', '下拉改变样式', '99乘法表', '简易计算器', '模拟留言板', '简易吸顶条', '简易瀑布流', '简易固定广告条', '自定义排序', '自定义去重', '中心放大'],
        ['碰撞检测', '拖拽虚线框', '四角拖拽', '放大镜', '球无限运动', '网易焦点图', '手风琴', '分步运动', '苹果菜单'],
        ['双击事件', '事件绑定', '接触绑定', '统计文字', '阻止冒泡', '阻止默认事件', '事件委托',  '鼠标滚轮', '拖拽回放', '禁止复制', '文字统计'],
        ['canvas', '盒子/文字阴影', '盒子渐变', 'audio/video', 'HTML5表单', '立方体', 'transition' , 'transform']
    ];
    var oWitCon = document.getElementById('wit-w');
    var oWitChild = oWitCon.children;
    for (var i = 0; i < oWitChild.length; i++) {

        for (var j = 0; j < arr[i].length; j++) {
            var oLi = document.createElement('li');
            oLi.className = 'wit-li';
            oLi.innerHTML = '\
                <a class="tip-point">\
                    <span class="pulse-inner1"></span>\
                    <span class="pulse-inner2"></span>\
                </a>\
                <p class="wit-text">' + arr[i][j] + '</p>';

            oWitChild[i].appendChild(oLi);
        }
    }

    // 判断是否显示在屏幕内
    addEvent(window,'scroll',function(){
        var iScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var iClientHeight = document.documentElement.clientHeight;

        for (var i = 0; i < oWitChild.length; i++) {
            if (getPos(oWitChild[i]).top < iScrollTop + iClientHeight) {
                oWitChild[i].style.WebkitTransform = 'rotateX(0)';
                oWitChild[i].style.MoZTransform = 'rotateX(0)';
                oWitChild[i].style.Transform = 'rotateX(0)';
            } else {
                oWitChild[i].style.WebkitTransform = 'rotateX(60deg)';
                oWitChild[i].style.MoZTransform = 'rotateX(60deg)';
                oWitChild[i].style.Transform = 'rotateX(60deg)';
            }
        }
    });
})();


// 全屏
fullPage();
window.onresize = fullPage;
function fullPage() {
    var aBlock = getByClass('sub', document.body);
    for (var i = 0; i < aBlock.length; i++) {
        aBlock[i].style.height = document.documentElement.clientHeight + 'px';
    }
}

// 文字效果
(function() {
    toTextEffect('text-list');
    function toTextEffect(sClass) {
        var aText =  getByClass(sClass, document.body);

        for (var i = 0; i < aText.length; i++) {
            var str = aText[i].dataset  ? aText[i].dataset.str : aText[i].getAttribute('data-str');
            var arr = str.split('');
            toFadeIn(arr, i);
        }

        function toFadeIn(arr, index) {
            var n = 0;
            var len = arr.length;
            var timer = setInterval(function() {
                var oSpan = document.createElement('span');
                oSpan.innerHTML = arr[n];
                oSpan.className = 'fadeInLeftBig';
                aText[index].appendChild(oSpan);
                oSpan.style.display = 'inline';

                n++;
                if (n == len) {
                    clearInterval(timer);
                }
            },60);
        }
    }
})();

// 拉钩层移效果
var flag = {
    lago: ''
};
function toLoadEffect() {
    if (flag.lago) return;
    var textArr = [
        [
            {title: '拖动实现图片缩放效果', href: 'http://www.zhinengshe.com/stu_work/zouxinping/js/case/tpsf.html'},
            {title: '无缝滚动', href: 'http://www.zhinengshe.com/stu_work/zouxinping/js/case/wfgd.html'},
            {title: '苹果应用效果', href: 'http://www.zhinengshe.com/stu_work/zouxinping/js/case/pgcd.html'},
            {title: '手风琴效果', href: 'http://www.zhinengshe.com/stu_work/zouxinping/js/case/sfq.html'},
            {title: '分块运动', href: 'http://www.zhinengshe.com/stu_work/zouxinping/js/case/fkyd.html'},
            {title: '照片墙', href: 'http://www.zhinengshe.com/stu_work/zouxinping/js/case/zpq.html'},
            {title: 'CSS3时钟', href: 'http://www.zhinengshe.com/stu_work/zouxinping/js/case/css3sz.html'},
            {title: '放大镜', href: 'http://www.zhinengshe.com/stu_work/zouxinping/js/case/fdj.html'}
        ],
        [
            {title: '七星彩/双色球', href: 'http://www.zhinengshe.com/stu_work/zouxinping/js/case/qxcssq.html'},
            {title: 'jsonp实现百度搜索', href: 'http://www.zhinengshe.com/stu_work/zouxinping/js/case/jsonp.html'}
        ]
    ];

    var oPro = document.getElementById('pro');

    // 分页
    var pagination = document.getElementById('pagination');
    var aA = pagination.getElementsByTagName('a');
    for (var i = 0; i < aA.length; i++) {
        aA[i].onclick = function() {
            toFade(this.innerHTML - 1);
        };
    }

    // 分页函数
    toFade(0);
    function toFade(page) {
        oPro.innerHTML = '';
        var aText = textArr[page];
        for (var i = 0; i < aText.length; i++) {
            var oDiv = document.createElement('div');
            oDiv.className = 'project';
            oDiv.style.opacity = 0;
            oDiv.innerHTML =  '<span>'+ aText[i].title +'</span>\
        <a href="'+ aText[i].href +'" target="_blank">' + aText[i].title + '</a>';
            oPro.appendChild(oDiv);
        }
        oPro.style.height = oPro.offsetHeight + 'px';

        toPos();
        function toPos() {
            //布局转换
            var aPos = [];
            var aDiv = oPro.children;
            for(var i = 0; i < aDiv.length; i++){
                aPos[i] = {
                    left: aDiv[i].offsetLeft,top:aDiv[i].offsetTop,
                    width: aDiv[i].offsetWidth, height:aDiv[i].offsetHeight,
                    opacity: 1
                };
            }
            for(var i = 0; i < aDiv.length; i++){
                aDiv[i].style.position = 'absolute';
                aDiv[i].style.margin  = '0';

                aDiv[i].style.opacity  = 0;
                aDiv[i].style.left = '50%';
                aDiv[i].style.top  = pagination.offsetTop + 50 + 'px';
                aDiv[i].style.width = '0';
                aDiv[i].style.height = '0';
            }


            //收起来
            var n = 0;
            var timer = null;
            clearInterval(timer);

            timer = setInterval(function(){
                (function(index){
                    move(aDiv[n], aPos[n], {duration: 1000});
                })(n);

                n++;
                if(n == aDiv.length){
                    clearInterval(timer);
                }
            },100);
        }
        toFadeIn(page);
    }

    function toFadeIn(page) {
        var aDiv = oPro.children;
        for (var i = 0; i < aDiv.length; i++) {
            aDiv[i].style.background = 'url(images/case' + (page * 8 + i) + '.png)';
            moveLa(aDiv[i]);
        }

        function direction(obj, oEvent) {
            var iScrollT = document.body.scrollTop || document.documentElement.scrollTop;
            var x = oEvent.clientX - getPos(obj).left - obj.offsetWidth/2;
            var y = obj.offsetHeight/2 + getPos(obj).top - oEvent.clientY - iScrollT;
            var a = Math.atan2(y, x);
            return Math.round((a*180/Math.PI + 180)/90) % 4;
        }

        function moveLa(oDiv) {
            oDiv.onmouseenter = function(ev){
                var oEvent = ev || event;
                var oSpan = this.children[0];
                var n = direction(oDiv,oEvent);

                switch(n){
                    case 0:// 0 左
                        oSpan.style.left = "-300px";
                        oSpan.style.top = "0";
                        break;
                    case 1://  1下
                        oSpan.style.left = "0";
                        oSpan.style.top = "150px";
                        break;
                    case 2://  2 右
                        oSpan.style.left = "300px";
                        oSpan.style.top = "0";
                        break;
                    case 3:// 3 上
                        oSpan.style.left = "0";
                        oSpan.style.top = "-150px";
                        break;
                }

                move(oSpan,{left:0,top:0});
            };

            oDiv.onmouseleave = function(ev){
                var oEvent = ev || event;
                var oSpan = this.children[0];
                var n = direction(oDiv,oEvent);

                switch(n){
                    case 0:
                        move(oSpan,{left:-300,top:0});
                        break;
                    case 1:
                        move(oSpan,{left:0,top:300});
                        break;
                    case 2:
                        move(oSpan,{left:300,top:0});
                        break;
                    case 3:
                        move(oSpan,{left:0,top:-300});
                        break;
                }
            };
        }
    }
    flag.lago = true;
}

// 拖拽
(function() {
    var oSlider = document.getElementById('slider');
    var oMockup = oSlider.children[0];
    var oproject = oSlider.children[1];
    var oDrag = oSlider.children[2];
    drag(oDrag);
    function drag(obj) {
        obj.onmousedown = function(ev) {
            var oEvent = ev || event;

            var disX = oEvent.clientX - obj.offsetLeft;
            document.onmousemove = function(ev) {
                var oEvent = ev || event;
                var l = oEvent.clientX - disX;

                // 判断 是否在范围内拖动
                if (l < 0) {
                    l = 0;
                } else if (l > obj.parentNode.offsetWidth - obj.offsetWidth) {
                    l = obj.parentNode.offsetWidth - obj.offsetWidth;
                }

                obj.style.left = l + 'px';

                oMockup.style.width = obj.offsetLeft + obj.offsetWidth/2 + 'px';
                oproject.style.width = oSlider.offsetWidth - obj.offsetLeft - obj.offsetWidth/2 + 'px';

            };
            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
                obj.releaseCapture && obj.releaseCapture();
            };
            obj.setCapture && obj.setCapture();
            return false;
        }
    }
})();


// 拖拽
(function() {
    var oSlider = document.getElementById('slider');
    var oMockup = oSlider.children[0];
    var oproject = oSlider.children[1];
    var oDrag = oSlider.children[2];
    drag(oDrag);
    function drag(obj) {
        obj.onmousedown = function(ev) {
            var oEvent = ev || event;

            var disX = oEvent.clientX - obj.offsetLeft;
            document.onmousemove = function(ev) {
                var oEvent = ev || event;
                var l = oEvent.clientX - disX;

                // 判断 是否在范围内拖动
                if (l < 0) {
                    l = 0;
                } else if (l > obj.parentNode.offsetWidth - obj.offsetWidth) {
                    l = obj.parentNode.offsetWidth - obj.offsetWidth;
                }

                obj.style.left = l + 'px';

                oMockup.style.width = obj.offsetLeft + obj.offsetWidth/2 + 'px';
                oproject.style.width = oSlider.offsetWidth - obj.offsetLeft - obj.offsetWidth/2 + 'px';

            };
            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
                obj.releaseCapture && obj.releaseCapture();
            };
            obj.setCapture && obj.setCapture();
            return false;
        }
    }
})();


// 拖拽
(function() {
    var oWitCon = document.getElementById('wit_con');
    var oWitChild = oWitCon.children[0];
    var oDragCon = document.getElementById('draggerCon');
    var oDrag = oDragCon.children[0];
    drag(oDrag);

    function drag(obj) {
        obj.onmousedown = function(ev) {
            var oEvent = ev || event;

            var disX = oEvent.clientX - obj.offsetLeft;
            document.onmousemove = function(ev) {
                var objParent = obj.parentNode;
                var oEvent = ev || event;
                var l = oEvent.clientX - disX;

                // 判断 是否在范围内拖动
                if (l < 0) {
                    l = 0;
                } else if (l > objParent.offsetWidth - obj.offsetWidth) {
                    l = objParent.offsetWidth - obj.offsetWidth;
                }

                obj.style.left = l + 'px';

                oWitChild.style.left = - obj.offsetLeft / (objParent.offsetWidth - obj.offsetWidth) * (oWitChild.offsetWidth - oWitCon.offsetWidth) + 'px';
            };
            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
                obj.releaseCapture && obj.releaseCapture();
            };
            obj.setCapture && obj.setCapture();
            return false;
        }
    }
})();


// 正方体旋转
(function() {
    var oContact = document.getElementById('contact-by');
    var aWay = oContact.children;
    var oFt = document.getElementById('ft');
    for (var i = 0; i < aWay.length; i++) {
        (function(index) {
            aWay[i].onmouseenter = function() {
                oFt.style.WebkitTransform = 'rotateY('+ (index+1)*90 +'deg)';
                oFt.style.MozTransform = 'rotateY('+ (index+1)*90 +'deg)';
                oFt.style.transform = 'rotateY('+ (index+1)*90 +'deg)';
            };
            aWay[i].onmouseleave = function() {
                oFt.style.WebkitTransform = 'rotateY(0deg)';
                oFt.style.MozTransform = 'rotateY(0deg)';
                oFt.style.transform = 'rotateY(0deg)';
            };
        })(i);

    }
})();


(function() {
    window.loadcartoon = function(name, fn) {
        var aELe = getByClass(name, document.body);

        for (var i = 0; i < aELe.length; i++) {
            toCartoon(aELe[i]);
        }
        function toCartoon(obj) {
            addEvent(window,'scroll',function(){
                var iScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                var iClientH = document.documentElement.clientHeight;

                var rel = obj.getAttribute('rel');
                if (rel) {
                    var arr = rel.split(',');
                }
                if (getPos(obj).top + 200 < iScrollTop + iClientH) {
                    fn && fn();
                    if (rel) {
                        move(obj, {opacity: 1, left: arr[0], top: arr[1]}, {duration: 1500});
                    } else {
                        move(obj, {opacity: 1}, {easing: 'linear', duration: 1200});
                    }
                }
            });
        }
    };
})();

function getStyle(obj,name){
	return (obj.currentStyle || getComputedStyle(obj,false))[name];
}

//options  duration complete  easing  linear  ease-in ease-out
function move(obj,json,options){
	options = options || {};
	options.duration = options.duration || 700;
	options.easing = options.easing || "ease-out";

	var start = {};
	var dis = {};

	for(var name in json){
		start[name] = parseFloat(getStyle(obj,name));
		dis[name] = json[name] - start[name];
	}

	var count = Math.round(options.duration/30);
	var n = 0;

	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		n++;
		for(var name in json){
			switch(options.easing){
				case "linear":
					var a = n/count;
					var cur = start[name] + dis[name]*a;
					break;
				case "ease-in":
					var a = n/count;
					var cur = start[name] + dis[name]*Math.pow(a,3);
					break;
				case "ease-out":
					var a = 1 - n/count;
					var cur = start[name]+ dis[name]*(1-Math.pow(a,3));
					break;
			}

			if(name == "opacity"){
				obj.style.opacity = cur;
				obj.style.filter = "alpha(opacity:"+cur*100+")";
			} else {
				obj.style[name] = cur + "px";
			}
		}
		if(n == count){
			clearInterval(obj.timer);
			options.complete && options.complete.call(obj);
		}
	},30);
}







/**
 * StyleFix 1.0.3 & PrefixFree 1.0.7
 * @author Lea Verou
 * MIT license
 */(function(){function t(e,t){return[].slice.call((t||document).querySelectorAll(e))}if(!window.addEventListener)return;var e=window.StyleFix={link:function(t){try{if(t.rel!=="stylesheet"||t.hasAttribute("data-noprefix"))return}catch(n){return}var r=t.href||t.getAttribute("data-href"),i=r.replace(/[^\/]+$/,""),s=t.parentNode,o=new XMLHttpRequest,u;o.onreadystatechange=function(){o.readyState===4&&u()};u=function(){var n=o.responseText;if(n&&t.parentNode&&(!o.status||o.status<400||o.status>600)){n=e.fix(n,!0,t);if(i){n=n.replace(/url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi,function(e,t,n){return/^([a-z]{3,10}:|\/|#)/i.test(n)?e:'url("'+i+n+'")'});var r=i.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,"\\$1");n=n.replace(RegExp("\\b(behavior:\\s*?url\\('?\"?)"+r,"gi"),"$1")}var u=document.createElement("style");u.textContent=n;u.media=t.media;u.disabled=t.disabled;u.setAttribute("data-href",t.getAttribute("href"));s.insertBefore(u,t);s.removeChild(t);u.media=t.media}};try{o.open("GET",r);o.send(null)}catch(n){if(typeof XDomainRequest!="undefined"){o=new XDomainRequest;o.onerror=o.onprogress=function(){};o.onload=u;o.open("GET",r);o.send(null)}}t.setAttribute("data-inprogress","")},styleElement:function(t){if(t.hasAttribute("data-noprefix"))return;var n=t.disabled;t.textContent=e.fix(t.textContent,!0,t);t.disabled=n},styleAttribute:function(t){var n=t.getAttribute("style");n=e.fix(n,!1,t);t.setAttribute("style",n)},process:function(){t('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link);t("style").forEach(StyleFix.styleElement);t("[style]").forEach(StyleFix.styleAttribute)},register:function(t,n){(e.fixers=e.fixers||[]).splice(n===undefined?e.fixers.length:n,0,t)},fix:function(t,n,r){for(var i=0;i<e.fixers.length;i++)t=e.fixers[i](t,n,r)||t;return t},camelCase:function(e){return e.replace(/-([a-z])/g,function(e,t){return t.toUpperCase()}).replace("-","")},deCamelCase:function(e){return e.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()})}};(function(){setTimeout(function(){t('link[rel="stylesheet"]').forEach(StyleFix.link)},10);document.addEventListener("DOMContentLoaded",StyleFix.process,!1)})()})();(function(e){function t(e,t,r,i,s){e=n[e];if(e.length){var o=RegExp(t+"("+e.join("|")+")"+r,"gi");s=s.replace(o,i)}return s}if(!window.StyleFix||!window.getComputedStyle)return;var n=window.PrefixFree={prefixCSS:function(e,r,i){var s=n.prefix;n.functions.indexOf("linear-gradient")>-1&&(e=e.replace(/(\s|:|,)(repeating-)?linear-gradient\(\s*(-?\d*\.?\d*)deg/ig,function(e,t,n,r){return t+(n||"")+"linear-gradient("+(90-r)+"deg"}));e=t("functions","(\\s|:|,)","\\s*\\(","$1"+s+"$2(",e);e=t("keywords","(\\s|:)","(\\s|;|\\}|$)","$1"+s+"$2$3",e);e=t("properties","(^|\\{|\\s|;)","\\s*:","$1"+s+"$2:",e);if(n.properties.length){var o=RegExp("\\b("+n.properties.join("|")+")(?!:)","gi");e=t("valueProperties","\\b",":(.+?);",function(e){return e.replace(o,s+"$1")},e)}if(r){e=t("selectors","","\\b",n.prefixSelector,e);e=t("atrules","@","\\b","@"+s+"$1",e)}e=e.replace(RegExp("-"+s,"g"),"-");e=e.replace(/-\*-(?=[a-z]+)/gi,n.prefix);return e},property:function(e){return(n.properties.indexOf(e)?n.prefix:"")+e},value:function(e,r){e=t("functions","(^|\\s|,)","\\s*\\(","$1"+n.prefix+"$2(",e);e=t("keywords","(^|\\s)","(\\s|$)","$1"+n.prefix+"$2$3",e);return e},prefixSelector:function(e){return e.replace(/^:{1,2}/,function(e){return e+n.prefix})},prefixProperty:function(e,t){var r=n.prefix+e;return t?StyleFix.camelCase(r):r}};(function(){var e={},t=[],r={},i=getComputedStyle(document.documentElement,null),s=document.createElement("div").style,o=function(n){if(n.charAt(0)==="-"){t.push(n);var r=n.split("-"),i=r[1];e[i]=++e[i]||1;while(r.length>3){r.pop();var s=r.join("-");u(s)&&t.indexOf(s)===-1&&t.push(s)}}},u=function(e){return StyleFix.camelCase(e)in s};if(i.length>0)for(var a=0;a<i.length;a++)o(i[a]);else for(var f in i)o(StyleFix.deCamelCase(f));var l={uses:0};for(var c in e){var h=e[c];l.uses<h&&(l={prefix:c,uses:h})}n.prefix="-"+l.prefix+"-";n.Prefix=StyleFix.camelCase(n.prefix);n.properties=[];for(var a=0;a<t.length;a++){var f=t[a];if(f.indexOf(n.prefix)===0){var p=f.slice(n.prefix.length);u(p)||n.properties.push(p)}}n.Prefix=="Ms"&&!("transform"in s)&&!("MsTransform"in s)&&"msTransform"in s&&n.properties.push("transform","transform-origin");n.properties.sort()})();(function(){function i(e,t){r[t]="";r[t]=e;return!!r[t]}var e={"linear-gradient":{property:"backgroundImage",params:"red, teal"},calc:{property:"width",params:"1px + 5%"},element:{property:"backgroundImage",params:"#foo"},"cross-fade":{property:"backgroundImage",params:"url(a.png), url(b.png), 50%"}};e["repeating-linear-gradient"]=e["repeating-radial-gradient"]=e["radial-gradient"]=e["linear-gradient"];var t={initial:"color","zoom-in":"cursor","zoom-out":"cursor",box:"display",flexbox:"display","inline-flexbox":"display",flex:"display","inline-flex":"display"};n.functions=[];n.keywords=[];var r=document.createElement("div").style;for(var s in e){var o=e[s],u=o.property,a=s+"("+o.params+")";!i(a,u)&&i(n.prefix+a,u)&&n.functions.push(s)}for(var f in t){var u=t[f];!i(f,u)&&i(n.prefix+f,u)&&n.keywords.push(f)}})();(function(){function s(e){i.textContent=e+"{}";return!!i.sheet.cssRules.length}var t={":read-only":null,":read-write":null,":any-link":null,"::selection":null},r={keyframes:"name",viewport:null,document:'regexp(".")'};n.selectors=[];n.atrules=[];var i=e.appendChild(document.createElement("style"));for(var o in t){var u=o+(t[o]?"("+t[o]+")":"");!s(u)&&s(n.prefixSelector(u))&&n.selectors.push(o)}for(var a in r){var u=a+" "+(r[a]||"");!s("@"+u)&&s("@"+n.prefix+u)&&n.atrules.push(a)}e.removeChild(i)})();n.valueProperties=["transition","transition-property"];e.className+=" "+n.prefix;StyleFix.register(n.prefixCSS)})(document.documentElement);
/**
 * YAX.JS 0.19-dev, Yet another extensible Javascript Library.
 * (C) 2013-2014 Xeriab Nabil
 */!function(){"use strict";Y.Store.MergeObject("Drivers",{LocalStorage:{ID:"Y.Store.Drivers.LocalStorage",Scope:"All",Available:function(){try{return Y.UserAgent.Features.LocalStorage?(Y.Window.localStorage.setItem("Y.Store.LocalStorage Availability test",!0),Y.Window.localStorage.removeItem("Y.Store.LocalStorage Availability test"),!0):!1}catch(t){return Y.ERROR(t),!1}},Initialise:Y.Lang.Noop,Set:function(t,i){if(!this.Available()){var e;if(Y.Window.LocalStorage={},Y.Lang.isString(t)&&Y.Lang.isString(i))return Y.Window.LocalStorage[t]=i,!0;if(Y.Lang.isObject(t)&&Y.Lang.isUndefined(i)){for(e in t)t.hasOwnProperty(e)&&(Y.Window.LocalStorage[e]=t[e]);return!0}return!1}Y.Window.localStorage.setItem(t,i)},Get:function(t){return this.Available()?Y.Window.localStorage.getItem(t):Y.Window.LocalStorage[t]},Delete:function(t){this.Available()?Y.Window.localStorage.removeItem(t):delete Y.Window.LocalStorage[t]},Flush:function(){this.Available()?Y.Window.localStorage.clear():Y.Window.LocalStorage={}}}})}(),function(){"use strict";Y.Store.MergeObject("Drivers",{Cookies:{ID:"Y.Store.Drivers.Cookies",Scope:"Browser",Available:function(){try{return!!Y.UserAgent.Features.Cookies}catch(t){return Y.ERROR(t),!1}},Initialise:Y.Lang.noop,Set:function(t,i){var e,n,s;if(e=new Date,e.setTime(e.getTime()+31536e6),n="; expires="+e.toUTCString(),Y.Lang.isString(t)&&Y.Lang.isString(i))return Y.Document.cookie=t+"="+i+n+"; path=/",!0;if(Y.Lang.isObject(t)&&Y.Lang.isUndefined(i)){for(s in t)t.hasOwnProperty(s)&&(Y.Document.cookie=s+"="+t[s]+n+"; path=/");return!0}return!1},Get:function(t){var i,e,n,s;for(i=t+"=",e=Y.Document.cookie.split(";"),n=0;n<e.length;n++){for(s=e[n];" "===s.charAt(0);)s=s.substring(1,s.length);if(0===s.indexOf(i))return s.substring(i.length,s.length)}return null},Delete:function(t){this.Set(t,"",-1)}}})}(),function(){"use strict";var t=function(t){return!Y.Lang.isUndefined(t)},i=/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/,e=function(t){return t=t.toLowerCase(),"true"===t||"false"===t},n=function(t,n,s,o){var h,r="return ",a=o?function(t,n){return i.test(t)?"Number(values["+n+"]),":e(t)?"Boolean(values["+n+"].toLowerCase() === 'true'),":"String(values["+n+"]),"}:function(t,i){return"values["+i+"],"};if("object"===t){for(r+="{",h=0;h<n.length;++h)r+='"'+n[h]+'": '+a(s[h],h);r=r.slice(0,-1)+"}"}else{for(r+="[",h=0;h<n.length;++h)r+=a(s[h],h);r=r.slice(0,-1)+"]"}return new Function("values",r)};Y.Parser.MergeObject("Drivers",{CSV:{ID:"Y.Parser.Drivers.CSV",Options:null,Data:null,dataSource:function(i,e){var n,s,o;if(e=t(e)?e:{},this.Options={async:t(e.async)?e.async:!1,cast:t(e.cast)?e.cast:!0,line:t(e.line)?e.line:"\r\n",delimiter:t(e.delimiter)?e.delimiter:",",header:t(e.header)?e.header:!1,done:t(e.done)?e.done:void 0},this.Data=i,this.Data instanceof Array)return this;for(n=0;n<this.Options.line.length;n++)s=i.charCodeAt(i.length-this.Options.line.length+n),o=this.Options.line.charCodeAt(n),s!==o&&(this.Data+=this.Options.line.charAt(n));return this},set:function(t,i){return this.Options[t]=i,this},encode:function(t){if(0===this.Data.length)return Y.Lang.empty();var i,e,n,s,o,h,r=this.Data,a=[],l=this.Options.delimiter,c=r[0]instanceof Array?"array":"object",u=this.Options.header,p=this.Options.done,f=function(t){return t?"string"!=typeof t?t:'"'+t.replace(/\"/g,'""')+'"':null},g=t?function(i){t(i.join(l))}:function(t){a.push(t.join(l))},d=r.length;if("object"===c?(n=Object.keys(r[0]),s=n.length):s=r[0].length,h=new Array(s),u){var m=u instanceof Array?u:n;for(e=0;s>e;++e)h[e]=f(m[e]);g(h)}if("object"===c)for(i=0;d>i;++i){for(o=r[i],e=0;s>e;++e)h[e]=f(o[n[e]]);g(h)}else for(i=0;d>i;++i){for(o=r[i],e=0;s>e;++e)h[e]=f(o[e]);g(h)}return a=a.join(this.Options.line),p&&p(a),a},forEach:function(t){return this.Data instanceof Array?this.encode(t):this.parse(t)},parse:function(t){if(0===this.Data.trim().length)return[];var i,e,s,o,h=this.Data,r=[],a=this.Options.done,l=this.Options.cast,c=this.Options.header,u=c instanceof Array?c:[],p=this.Options.line,f=u.length,g={row:[],cell:""},d={escaped:!1,quote:!1,cell:!0},m=function(t){g.row.push((d.escaped?t.slice(1,-1).replace(/""/g,'"'):t).trim()),g.cell="",d={escaped:!1,quote:!1,cell:!0}},C=1===p.length?m:function(t){m(t.slice(0,1-p.length))},S=t?function(){t(new i(g.row))}:function(){r.push(new i(g.row))},O=function(){c?f?(i=new n("object",u,g.row,l),S(),O=S):(u=g.row,f=u.length):(i||(i=new n("array",g.row,g.row,l)),S(),O=S)},E=h.length,Y=p.charCodeAt(p.length-1),y=this.Options.delimiter.charCodeAt(0);for(e=0,s=0;E>=s;++s)o=h.charCodeAt(s),d.cell&&(d.cell=!1,34===o)?d.escaped=!0:d.escaped&&34===o?d.quote=!d.quote:(d.escaped&&d.quote||!d.escaped)&&(o===y?(m(g.cell+h.slice(e,s)),e=s+1):o===Y&&(C(g.cell+h.slice(e,s)),e=s+1,O(),g.row=[]));return a&&a(r),r}}})}(),function(){"use strict";function t(t,i){this.Element=t,this.Options=i,this.Delay=null,this.init()}Y.Extend(Y.Settings.DOM,{Tooltip:{Opacity:1,Content:"",Size:"small",Gravity:"north",Theme:"dark",Trigger:"hover",Animation:"flipIn",Confirm:!1,Yes:"Yes",No:"No",FinalMessage:"",FinalMessageDuration:500,OnYes:Y.Lang.noop,OnNo:Y.Lang.noop,Container:"body"}});var i=Y.Settings.DOM.Tooltip;t.prototype={init:function(){this.setContent(),this.Content&&this.setEvents()},Show:function(){Y.DOM(this.Element).css("cursor","pointer"),Y.DOM("yaxtooltip.yax-tooltip").remove(),Y.Window.clearTimeout(this.Delay),this.setContent(),this.setPositions(),this.Tooltip.css("display","block")},Hide:function(){this.Tooltip.remove(),window.clearTimeout(this.Delay),this.Tooltip.css("display","none")},Toggle:function(){this.Tooltip.is(":visible")?this.Hide():this.Show()},addAnimation:function(){switch(this.Options.Animation){case"none":break;case"fadeIn":this.Tooltip.addClass("animated"),this.Tooltip.addClass("fadeIn");break;case"flipIn":this.Tooltip.addClass("animated"),this.Tooltip.addClass("flipIn")}},setContent:function(){if(this.Options.Content)this.Content=this.Options.Content;else if(this.Element.data("tooltip"))this.Content=this.Element.data("tooltip");else{if(!this.Element.title())return void Y.ERROR("No content for Tooltip: "+this.Element.selector);this.Content=this.Element.title(),this.Element.title("")}"#"===this.Content.charAt(0)?(Y.DOM(this.Content).hide(),this.Content=Y.DOM(this.Content).html(),this.contentType="html"):this.contentType="text",this.Tooltip=Y.DOM('<yaxtooltip class="yax-tooltip '+this.Options.Theme+" "+this.Options.Size+" "+this.Options.Gravity+'"><yaxtooltip class="tooltiptext">'+this.Content+'</yaxtooltip><yaxtooltip class="tip"></yaxtooltip></yaxtooltip>'),this.Tip=this.Tooltip.find(".tip"),""!==this.Options.Container||this.Options.Container?this.Tooltip.prependTo(this.Options.Container):this.Tooltip.insertBefore(this.Element.parent()),"html"===this.contentType&&this.Tooltip.css("max-width","none"),this.Tooltip.css("opacity",this.Options.Opacity),this.addAnimation(),this.Options.Confirm&&this.addConfirm()},getPosition:function(){var t=this.Element[0];return Y.Extend({},Y.Lang.isFunction(t.getBoundingClientRect)?t.getBoundingClientRect():{width:t.offsetWidth,height:t.offsetHeight},this.Element.offset())},setPositions:function(){var t=0,i=0,e=this.Element.offset().top,n=this.Element.offset().left;switch(("fixed"===this.Element.css("position")||"absolute"===this.Element.css("position"))&&(e=0,n=0),this.Options.Gravity){case"south":t=n+this.Element.outerWidth()/2-this.Tooltip.outerWidth()/2,i=e-this.Tooltip.outerHeight()-this.Tip.outerHeight()/2;break;case"west":t=n+this.Element.outerWidth()+this.Tip.outerWidth()/2,i=e+this.Element.outerHeight()/2-this.Tooltip.outerHeight()/2;break;case"north":t=n+this.Element.outerWidth()/2-this.Tooltip.outerWidth()/2,i=e+this.Element.outerHeight()+this.Tip.outerHeight()/2;break;case"east":t=n-this.Tooltip.outerWidth()-this.Tip.outerWidth()/2,i=e+this.Element.outerHeight()/2-this.Tooltip.outerHeight()/2;break;case"center":t=n+this.Element.outerWidth()/2-this.Tooltip.outerWidth()/2,i=e+this.Element.outerHeight()/2-this.Tip.outerHeight()/2}this.Tooltip.css("left",t),this.Tooltip.css("top",i)},setEvents:function(){var t=this;"hover"===this.Options.Trigger||"mouseover"===this.Options.Trigger||"onmouseover"===this.Options.Trigger?this.Element.mouseover(function(){t.setPositions(),t.Show()}).mouseout(function(){t.Hide()}):("click"===this.Options.Trigger||"onclick"===this.Options.Trigger)&&(this.Tooltip.click(function(t){t.stopPropagation()}),this.Element.click(function(i){i.preventDefault(),t.setPositions(),t.Toggle(),i.stopPropagation()}),Y.DOM("html").click(function(){t.Hide()}))},activate:function(){this.setContent(),this.Content&&this.setEvents()},addConfirm:function(){this.Tooltip.append('<ul class="confirm"><li class="yax-tooltip-yes">'+this.Options.Yes+'</li><li class="yax-tooltip-no">'+this.Options.No+"</li></ul>"),this.setConfirmEvents()},setConfirmEvents:function(){var t=this;this.Tooltip.find("li.yax-tooltip-yes").click(function(i){t.onYes(),i.stopPropagation()}),this.Tooltip.find("li.yax-tooltip-no").click(function(i){t.onNo(),i.stopPropagation()})},finalMessage:function(){if(this.Options.FinalMessage){var t=this;t.Tooltip.find("yaxtooltip:first").html(this.Options.FinalMessage),t.Tooltip.find("ul").remove(),t.setPositions(),setTimeout(function(){t.Hide(),t.setContent()},t.Options.FinalMessageDuration)}else this.Hide()},onYes:function(){this.Options.OnYes(this.Element),this.finalMessage()},onNo:function(){this.Options.OnNo(this.Element),this.Hide()}},Y.DOM.Function.Tooltip=function(e){return e=Y.Extend({},i,e),this.each(function(){return new t(Y.DOM(this),e)})}}(),function(){"use strict";function t(t,i){this.Element=t,this.Options=i,this.CSS_Class="yax-waitforme",this.Effects=null,this.EffectElementCount=null,this.CreateSubElement=!1,this.SpecificAttr="background-color",this.EffectElementHTML="",this.ContainerSize=null,this.ElementSize=null,this.Div=null,this.Content=null,this.init()}Y.Extend(Y.Settings.DOM,{WaitForMe:{Opacity:1,Effect:"bounce",Content:"",Background:"rgba(245, 245, 245, .75)",Color:"rgba(10, 20, 30, .9)",Width:0,Height:0,Container:"body",Trigger:"yax.waitformeclose"}});var i=Y.Settings.DOM.WaitForMe;t.prototype={init:function(){this.setContent(),this._init_(),this.setEvents()},Show:function(){Y.DOM("div.yax-waitforme").hide(),this.WaitForMe.css("display","block")},Hide:function(){this.WaitForMe.hide(),this.WaitForMe.css("display","none")},Toggle:function(){this.WaitForMe.is(":visible")?this.Hide():this.Show()},_init_:function(){var t;switch(this.Options.Effect){case"none":this.EffectElementCount=0;break;case"bounce":this.EffectElementCount=3,this.ContainerSize="",this.ElementSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"};break;case"rotateplane":this.EffectElementCount=1,this.ContainerSize="",this.ElementSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"};break;case"stretch":this.EffectElementCount=5,this.ContainerSize="",this.ElementSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"};break;case"orbit":this.EffectElementCount=2,this.ContainerSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"},this.ElementSize="";break;case"roundBounce":this.EffectElementCount=12,this.ContainerSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"},this.ElementSize="";break;case"win8":this.EffectElementCount=5,this.CreateSubElement=!0,this.ContainerSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"},this.ElementSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"};break;case"win8_linear":this.EffectElementCount=5,this.CreateSubElement=!0,this.ContainerSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"},this.ElementSize="";break;case"ios":this.EffectElementCount=12,this.ContainerSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"},this.ElementSize="";break;case"facebook":this.EffectElementCount=3,this.ContainerSize="",this.ElementSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"};break;case"rotation":this.EffectElementCount=1,this.SpecificAttr="border-color",this.ContainerSize="",this.ElementSize={width:this.Options.Width.toString()+"px",height:this.Options.Height.toString()+"px"}}if(this.ElementSize="width: "+this.ElementSize.width+"; height: "+this.ElementSize.height,this.ContainerSize="width: "+this.ContainerSize.width+"; height: "+this.ContainerSize.height,Y.Lang.isEmpty(this.Options.Width)&&Y.Lang.isEmpty(this.Options.Height)&&(this.ElementSize=Y.Lang.empty(),this.ContainerSize=Y.Lang.empty()),this.Effects=Y.DOM('<div class="'+this.CSS_Class+"-progress "+this.Options.Effect+'"></div>'),this.EffectElementCount>0){for(t=1;t<=this.EffectElementCount;++t)this.EffectElementHTML+=this.CreateSubElement?'<div class="'+this.CSS_Class+"-progress-element"+t+'" style="'+this.ElementSize+'"><div style="'+this.SpecificAttr+": "+this.Options.Color+'"></div></div>':'<div class="'+this.CSS_Class+"-progress-element"+t+'" style="'+this.SpecificAttr+": "+this.Options.Color+"; "+this.ElementSize+'"></div>';this.Effects=Y.DOM('<div class="'+this.CSS_Class+"-progress "+this.Options.Effect+'" style="'+this.ContainerSize+'">'+this.EffectElementHTML+"</div>")}this.Options.Content&&(this.Content=Y.DOM('<div class="'+this.CSS_Class+'-text" style="color: '+this.Options.Color+';">'+this.Options.Content+"</div>")),this.Element.find("> ."+this.CSS_Class)&&this.Element.find("> ."+this.CSS_Class).remove(),this.Div=Y.DOM('<div class="'+this.CSS_Class+'-content"></div>'),this.Div.append(this.Effects,this.Content),this.Div.appendTo(this.WaitForMe),"HTML"===this.Element[0].tagName&&(this.Element=Y.DOM("body")),this.Element.addClass(this.CSS_Class+"-container").append(this.WaitForMe),this.Element.find("> ."+this.CSS_Class).css({background:this.Options.Background}),this.Element.find("."+this.CSS_Class+"-content").css({marginTop:-this.Element.find("."+this.CSS_Class+"-content").outerHeight()/2+"px"})},Close:function(){this.Element.removeClass(this.CSS_Class+"-container"),this.Element.find("."+this.CSS_Class).remove()},setContent:function(){if(this.Options.Content)this.Content=this.Options.Content;else if(this.Element.data("YAX-WaitForMe"))this.Content=this.Element.data("YAX-WaitForMe");else if(Y.Lang.isEmpty(this.Options.Content))this.Content=Y.Lang.empty();else{if(!Y.Lang.isNull(this.Options.Content))return void Y.ERROR("No content for WaitForMe: "+this.Element.selector);this.Content=Y.Lang.empty()}"#"===this.Content.charAt(0)?(Y.DOM(this.Content).hide(),this.Content=Y.DOM(this.Content).html(),this.contentType="html"):this.contentType="text",this.WaitForMe=Y.DOM("<div></div>").addClass(this.CSS_Class),this.Options.Container?this.WaitForMe.prependTo(this.Options.Container):this.WaitForMe.insertAfter(this.Element.parent()),"html"===this.contentType&&this.WaitForMe.css("max-width","none"),this.WaitForMe.css("opacity",this.Options.Opacity)},setEvents:function(){var t=this;"yax.waitformeclose"===this.Options.Trigger&&(this.WaitForMe.on("yax.waitformeclose",function(){t.Close()}),this.Element.on("yax.waitformeclose",function(){t.Close()}))}},Y.DOM.Function.WaitForMe=function(e){var n=Y.Extend({},i,e);return"close"===e?new t(Y.DOM(this),n).Close():this.each(function(){return new t(Y.DOM(this),n)})}}(),function(){"use strict";Y.Extend(Y.Settings.DOM,{AutoFix:{CustomOffset:!0,Manual:!0,OnlyInContainer:!0}});var t=Y.Settings.DOM.AutoFix;Y.DOM.Function.AutoFix=function(i){var e,n=Y.Extend(t,i,{}),s=Y.DOM(this),o=s.position(),h=n.CustomOffset,r=s.offset();s.addClass("yax-autofix"),Y.DOM.Function.ManualFix=function(){s=Y.DOM(this),r=s.offset(),s.hasClass("_fixed")?s.removeClass("_fixed"):s.addClass("_fixed").css({top:0,left:r.left,right:"auto",bottom:"auto"})},e=function(t,i,e,n){i.customOffset===!1&&(h=t.parent().offset().top),Y.DOM(Y.Document).scrollTop()>h&&Y.DOM(Y.Document).scrollTop()<=t.parent().height()+(h-Y.DOM(Y.Window).height())?t.removeClass("_bottom").addClass("_fixed").css({top:0,left:n.left,right:"auto",bottom:"auto"}):Y.DOM(Y.Document).scrollTop()>h?i.OnlyInContainer===!0&&(Y.DOM(Y.Document).scrollTop()>t.parent().height()-Y.DOM(Y.Window).height()?t.addClass("_bottom _fixed").removeAttr("style").css({left:e.left}):t.removeClass("_bottom _fixed").removeAttr("style")):t.removeClass("_bottom _fixed").removeAttr("style")},n.Manual===!1&&Y.DOM(Y.Window).scroll(function(){e(s,n,o,r)})}}(),function(t){"use strict";Y.Extend(Y.Settings.DOM,{Router:{DefaultPath:"/",Before:Y.Lang.Noop,On:Y.Lang.noop,NotFound:Y.Lang.Noop}});var i,e=Y.Settings.DOM.Router,n=Y.Location;i={Routes:[],Current:null,Previous:null,HashRegex:{HashStrip:/^#!*/,NamedArgument:/:([\w\d]+)/g,ArgumentSplat:/\*([\w\d]+)/g,Escape:/[\-\[\]{}()+?.,\\\^$|#\s]/g},Config:function(t){var n;for(n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return i},History:{Cache:!1,Support:Y.HasOwnProperty.call(t,"history")},Array:function(t){return Array.prototype.slice.call(t,0)},Go:function(t){return n.hash=t,i},Back:function(t){return i.Previous?(history.back(),i.Previous=null):t&&(n.hash=t),i},Proxy:function(t){var i,e=this;return i=function(){return t.apply(e,arguments)}},proxyAll:function(){var t,i=this.Array(arguments);for(t=0;t<i.length;t++)this[i[t]]=this.Proxy(this[i[t]])},Add:function(t,i){var e,n;if(Y.Lang.isObject(t))for(e in t)t.hasOwnProperty(e)&&this.Add(e,t[e]);else Y.Lang.isString(t)&&(t=t.replace(this.HashRegex.Escape,"\\$&").replace(this.HashRegex.NamedArgument,"([^/]*)").replace(this.HashRegex.ArgumentSplat,"(.*?)"),n=new RegExp("^"+t+"$")),this.Routes.push({Route:n,Function:i||function(){return!1}})},Setup:function(i){return i&&i.History&&(this.History.Cache=this.History.Support&&i.History),this.History.Cache?Y.Node(t).bind("popstate",this.Change):Y.Node(t).bind("hashchange",this.Change),this.proxyAll("Change"),this.Change()},Unbind:function(){this.History?Y.Node(t).unbind("popstate",this.Change):Y.Node(t).unbind("hashchange",this.Change)},Navigate:function(){var t,i=this.Array(arguments),e=!1;Y.Lang.isBool(i[i.length-1])&&(e=i.pop()),t=i.join("/"),this.Path!==t&&(e||(this.Path=t),this.History.Cache?history.cache.pushState({},document.title,this.getHost()+t):n.hash=t)},Match:function(t,i,e){var n,s=i.exec(t);return s?(n=s.slice(1),e.apply(e,n),!0):!1},getPath:function(){return n.pathname},getHash:function(){return n.hash},getHost:function(){return(document.location+Y.Lang.empty()).replace(this.getPath()+this.getHash(),"")},getFragment:function(){return this.getHash().replace(this.HashRegex.HashStrip,"")},Change:function(){var t,n,s,o,h=i.History.Cache?i.getPath():i.getFragment(),r=i.getHash(),a=!1,l=i.Current;if(h!==i.Path){for(i.Path=h,r||(r=e.DefaultPath),l&&l!==i.Previous&&(i.Previous=l),i.Current=r,t=0,n=i.Routes.length;n>t&&!a;t++)if(s=i.Routes[t],i.Match(h,s.Route,s.Function))return;for(t=0,n=i.Routes.length;n>t&&!a;t++)s=i.Routes[t],Y.Lang.isString(h)?h.toLowerCase()===r.toLowerCase().slice(1)&&(e.Before.call(i,h),s.Function.call(i),e.On.call(i,h),a=!0):(o=r.match(h),o&&(e.Before.call(i,h,o),s.Function.apply(i,o),e.On.call(i,h,o),a=!0));return a||e.NotFound.call(i),i}}},Y.DOM.Router=i}(this);
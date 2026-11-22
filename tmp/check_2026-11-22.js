/* Rybalka.ua: проверка текстов карточек на витрине по отпечаткам (22.11.2026). rbCheck(url, 'old'|'new') -> window.__chk */
window.rbFp=function(s){s=(s||'').replace(/\s+/g,'');var x=7;for(var i=0;i<s.length;i++)x=(x*31+s.charCodeAt(i))%1000000007;return [s.length,x];};
window.rbCheck=async function(url,mode,only){
  var J=await (await fetch(url,{cache:'no-store'})).json();
  var L={UA:'/',RU:'/ru/',EN:'/en/',PL:'/pl/',FR:'/fr/',ES:'/es/',DE:'/de/',IT:'/it/'};
  var bad=[];window.__chk={done:0,bad:bad,n:0,err:[]};
  for(var a in J){ if(only&&only.indexOf(a)<0) continue; var it=J[a], langs=mode==='old'?['UA']:Object.keys(L);
    for(var q=0;q<langs.length;q++){ var lg=langs[q];
      try{
        var r=await fetch(L[lg]+it.alias+'/',{cache:'no-store'}); var d=new DOMParser().parseFromString(await r.text(),'text/html');
        var g=function(sel){var e=d.querySelector(sel);return e?e.textContent:'';};
        var m=d.querySelector('meta[name=description]');
        var got={name:g('h1'),title:d.title,meta:m?m.getAttribute('content'):'',short:g('.product-short-description'),desc:g('.product-description .text')};
        var exp=mode==='old'?it.old:it.exp[lg];
        for(var k in exp){ var f=window.rbFp(got[k]); if(f[0]!==exp[k][0]||f[1]!==exp[k][1]) bad.push(a+':'+lg+':'+k+':'+f[0]+'/'+exp[k][0]); }
      }catch(e){ window.__chk.err.push(a+':'+lg+':'+e.message); }
      window.__chk.n++;
    } }
  window.__chk.done=1;
};

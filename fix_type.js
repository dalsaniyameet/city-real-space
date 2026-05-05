const fs = require('fs');
let h = fs.readFileSync('c:/Users/meetd/Downloads/City Real Space/index.html', 'utf8');

const marker = "document.getElementById('heroTitle').classList.add('hero-h1-visible');";
const idx = h.indexOf(marker);
fs.writeFileSync('debug.txt', 'idx='+idx+'\n'+h.substring(idx-100, idx+300));

if (idx === -1) { fs.writeFileSync('debug.txt', 'NOT FOUND'); process.exit(1); }

const si = h.lastIndexOf('setTimeout', idx);
const ei = h.indexOf('}, 1950);', idx) + 9;

fs.appendFileSync('debug.txt', '\nsi='+si+' ei='+ei);

const newCode = `setTimeout(function(){
    var t=document.getElementById('heroTitle');
    var s=document.getElementById('heroSub');
    var s2=document.getElementById('heroSub2');
    t.innerHTML=''; t.style.opacity='1'; t.style.transform='translateY(0)';
    s.innerHTML=''; s.style.opacity='0';
    s2.innerHTML=''; s2.style.opacity='0';
    var tt='Find Your Dream Property in the Heart of the City';
    var i=0;
    function tT(){if(i<tt.length){t.innerHTML+=tt[i];i++;setTimeout(tT,40);}else{setTimeout(tSub,250);}}
    var st='Explore thousands of verified listings \u2014 residential, commercial & new launches.';
    var j=0;
    function tSub(){s.style.opacity='1';s.style.transform='translateY(0)';if(j<st.length){s.innerHTML+=st[j];j++;setTimeout(tSub,22);}else{setTimeout(tSub2,250);}}
    var pts=[{t:'The ',c:'#34d399'},{t:'Unit ',c:'#ff6b6b'},{t:'Of ',c:'rgba(255,255,255,0.9)'},{t:'Property ',c:'#34d399'},{t:'Platform',c:'#FFC107'}];
    var pi=0,ci=0;
    function tSub2(){s2.style.opacity='1';s2.style.transform='translateY(0)';if(pi<pts.length){if(!s2.children[pi]){var sp=document.createElement('span');sp.style.color=pts[pi].c;s2.appendChild(sp);}if(ci<pts[pi].t.length){s2.children[pi].innerHTML+=pts[pi].t[ci];ci++;setTimeout(tSub2,55);}else{pi++;ci=0;setTimeout(tSub2,55);}}}
    tT();
  }, 1950);`;

h = h.substring(0, si) + newCode + h.substring(ei);
fs.writeFileSync('c:/Users/meetd/Downloads/City Real Space/index.html', h, 'utf8');
fs.appendFileSync('debug.txt', '\nDONE size='+h.length);

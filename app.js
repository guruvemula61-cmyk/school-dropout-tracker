const KEY='sdt_v1',COL={critical:'#ef4444',high:'#f59e0b',medium:'#3b82f6',low:'#10b981'};
const seed=()=>({students:[
['ST001','Rajesh Kumar',9,'Male','Shamshabad','9876500001',45.2,38],
['ST002','Priya Singh',8,'Female','Chevella','9876500002',62.1,42],
['ST003','Amit Patel',10,'Male','Vikarabad','9876500003',68.5,55],
['ST004','Sunita Devi',7,'Female','Shamshabad','9876500004',85.3,48],
['ST005','Ravi Sharma',6,'Male','Chevella','9876500005',92.1,76],
['ST006','Meera Gupta',11,'Female','Moinabad','9876500006',78.9,64],
['ST007','Vikash Singh',12,'Male','Vikarabad','9876500007',54.7,41],
['ST008','Kavita Yadav',9,'Female','Moinabad','9876500008',56.7,44]
].map(([id,name,grade,gender,village,phone,att,acad])=>({id,name,grade,gender,village,phone,att,acad,status:'Active'})),
interventions:[
{id:1,sid:'ST001',type:'Intensive Support',notes:'Tutoring, family counselling and transport help',progress:60,status:'Active',date:'2026-10-15'},
{id:2,sid:'ST002',type:'Academic Support',notes:'After-school tutoring and peer mentoring',progress:75,status:'Active',date:'2026-10-20'},
{id:3,sid:'ST003',type:'Behavioral Support',notes:'Counselling sessions completed',progress:100,status:'Completed',date:'2026-09-25'}]});
const DB={get(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.students)return d}catch(e){}return DB.reset()},
save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}},
reset(){const d=seed();DB.save(d);return d}};
const risk=s=>Math.round((100-s.att)*.6+(100-s.acad)*.4);
const lvl=s=>{const r=risk(s);return r>=55?'critical':r>=40?'high':r>=25?'medium':'low'};
const esc=t=>String(t).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const $=id=>document.getElementById(id);
const user=()=>{try{return JSON.parse(sessionStorage.getItem('u'))}catch(e){return null}};
function logout(){sessionStorage.clear();location.href='index.html'}
function init(page,role){
 const u=user();if(!u||u.role!==role){location.href='index.html';return null}
 const L=role=='parent'?[['parent.html','My Child']]:[['dashboard.html','Dashboard'],['attendance.html','Attendance'],['risk.html','Dropout Risk'],['interventions.html','Interventions'],['monthly.html','Reports']];
 $('nav').innerHTML='<b>🎓 School Dropout Tracker</b>'+L.map(l=>`<a href="${l[0]}"${l[0]==page?' class="on"':''}>${l[1]}</a>`).join('')+'<a href="#" onclick="logout()">Logout</a>';
 return u}
function csv(name,rows){const t=rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download=name;a.click()}
const sms=s=>'sms:'+s.phone+'?body='+encodeURIComponent('Dear Parent, '+s.name+"'s attendance is "+s.att+'%. Please contact the school. - School Dropout Tracker');
let _c={};
function chart(id,type,labels,data,colors,label){if(_c[id])_c[id].destroy();
 _c[id]=new Chart($(id),{type,data:{labels,datasets:[{label,data,backgroundColor:colors,borderColor:colors,borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false}})}

const KEY='sdt_v1',COL={critical:'#ef4444',high:'#f59e0b',medium:'#3b82f6',low:'#10b981'};
const PAL=['#ef4444','#f59e0b','#3b82f6','#10b981','#8b5cf6','#ec4899','#14b8a6','#6b7280'];
const REASONS=['Poverty / money problem','School too far','Health problem','Early marriage','Child labour / work','No interest in studies','Family migration','Other'];
const dt=i=>{const x=new Date();x.setDate(x.getDate()-i);return x.toISOString().slice(0,10)};
const lg=(...a)=>Object.fromEntries(a.map((v,i)=>[dt(i),v]));
const calc=s=>{const v=Object.values(s.log);s.att=+((s.b[0]+v.filter(x=>x=='P').length)/(s.b[1]+v.length)*100).toFixed(1)};
const norm=d=>{d.interventions=d.interventions||[];d.students.forEach(s=>{const D={income:15000,sibs:1,dist:2,mig:0,reason:'',re:null};for(const k in D)if(s[k]===undefined)s[k]=D[k];s.log=s.log||{};s.b=s.b||[s.att,100];calc(s)});return d};
const seed=()=>norm({students:[
['ST001','Rajesh Kumar',9,'Male','Shamshabad','9876500001',45.2,38,4000,4,6,1,lg('A','A','A','A','A')],
['ST002','Priya Singh',8,'Female','Chevella','9876500002',62.1,42,6000,3,4,0,lg('A','P')],
['ST003','Amit Patel',10,'Male','Vikarabad','9876500003',68.5,55,8000,2,3,0,{}],
['ST004','Sunita Devi',7,'Female','Shamshabad','9876500004',85.3,48,3500,2,8,0,{}],
['ST005','Ravi Sharma',6,'Male','Chevella','9876500005',92.1,76,20000,1,1,0,{}],
['ST006','Meera Gupta',11,'Female','Moinabad','9876500006',78.9,64,18000,1,2,0,{}],
['ST007','Vikash Singh',12,'Male','Vikarabad','9876500007',54.7,41,5000,3,7,1,lg('A','A','A')],
['ST008','Kavita Yadav',9,'Female','Moinabad','9876500008',56.7,44,7000,4,5,0,{}]
].map(([id,name,grade,gender,village,phone,att,acad,income,sibs,dist,mig,log])=>({id,name,grade,gender,village,phone,att,acad,income,sibs,dist,mig,log,b:[att,100],status:'Active',reason:'',re:null})),
interventions:[
{id:1,sid:'ST001',type:'Intensive Support',notes:'Tutoring, family counselling and transport help',progress:60,status:'Active',date:'2026-10-15'},
{id:2,sid:'ST002',type:'Academic Support',notes:'After-school tutoring and peer mentoring',progress:75,status:'Active',date:'2026-10-20'},
{id:3,sid:'ST003',type:'Behavioral Support',notes:'Counselling sessions completed',progress:100,status:'Completed',date:'2026-09-25'}]});
const DB={get(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.students)return norm(d)}catch(e){}return DB.reset()},
save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}},
reset(){const d=seed();DB.save(d);return d}};
// Risk = attendance gap 40% + marks gap 25% + family factors (income, distance, migration, siblings)
const risk=s=>Math.round((100-s.att)*.4+(100-s.acad)*.25+(s.income<5000?10:s.income<10000?5:0)+Math.min(s.dist/10,1)*10+(s.mig?5:0)+(s.sibs>=4?5:0));
const lvl=s=>{const r=risk(s);return r>=50?'critical':r>=35?'high':r>=22?'medium':'low'};
const streak=s=>{let n=0;for(const k of Object.keys(s.log).sort().reverse()){if(s.log[k]=='A')n++;else break}return n};
function schemes(s){const r=[];
 if(s.income<10000)r.push(['Amma Vodi (support to mothers)',s.att<75?'Needs 75% attendance':'']);
 if(s.grade<=8)r.push(['Mid-day meal (PM POSHAN)','']);
 if(s.income<15000)r.push(['Free textbooks and uniform','']);
 if(s.dist>=3)r.push(['Transport / bicycle support','School is '+s.dist+' km away']);
 if(s.gender=='Female'&&s.grade<=8&&(s.dist>=3||s.mig||s.income<5000))r.push(['KGBV residential school (girls)','']);
 if(s.grade==8&&s.acad>=55&&s.income<29000)r.push(['NMMS scholarship','']);
 if(s.mig)r.push(['Seasonal hostel for migrant children','']);
 return r}
function askReason(){const v=prompt('Why did the child drop out? Type a number:\n'+REASONS.map((r,i)=>(i+1)+'. '+r).join('\n'));return v===null?null:(REASONS[+v-1]||'Other')}
const esc=t=>String(t).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const $=id=>document.getElementById(id);
const user=()=>{try{return JSON.parse(sessionStorage.getItem('u'))}catch(e){return null}};
function logout(){sessionStorage.clear();location.href='index.html'}
function init(page,role){
 const u=user();if(!u||u.role!==role){location.href='index.html';return null}
 const L=role=='parent'?[['parent.html','My Child']]:[['dashboard.html','Dashboard'],['students.html','Students'],['attendance.html','Attendance'],['risk.html','Dropout Risk'],['reenrol.html','Re-enrol'],['interventions.html','Interventions'],['monthly.html','Reports']];
 $('nav').innerHTML='<b>🎓 School Dropout Tracker</b>'+L.map(l=>`<a href="${l[0]}"${l[0]==page?' class="on"':''}>${l[1]}</a>`).join('')+'<a href="#" onclick="logout()">Logout</a>';
 return u}
function csv(name,rows){const t=rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv'}));a.download=name;a.click()}
const sms=s=>'sms:'+s.phone+'?body='+encodeURIComponent('Dear Parent, '+s.name+' has been absent recently. Attendance is '+s.att+'%. Please contact the school. - School Dropout Tracker');
let _c={};
function chart(id,type,labels,data,colors,label){if(_c[id])_c[id].destroy();
 _c[id]=new Chart($(id),{type,data:{labels,datasets:[{label,data,backgroundColor:colors,borderColor:colors,borderRadius:5}]},options:{responsive:true,maintainAspectRatio:false}})}

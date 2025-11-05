const SU = { KEYS: { POINTS: 'su_points_v45', STATS: 'su_stats_v45', PRACTICE: 'su_practice_v45', TESTS: 'su_tests_v45', WEEK: 'su_week_v45', SYLL: 'su_syllabus_v45' } };
function save(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
function load(k,fb){ try{ return JSON.parse(localStorage.getItem(k)) ?? fb }catch(e){ return fb } }
function ensureStats(){ const def={level:1,xp:0,xpToNext:100,skillPoints:0,stats:{Speed:1,Intelligence:1,Vitality:1,Endurance:1,Focus:1,Agility:1}}; if(!load(SU.KEYS.STATS,null)) save(SU.KEYS.STATS,def); }
function getStats(){ return load(SU.KEYS.STATS,null) || {}; }
function addXP(n,src){ if(!n || n<=0) return 0; ensureStats(); const s=getStats(); const mult = 1 + (s.stats.Speed-1)*0.01 + (s.stats.Focus-1)*0.01; const gained=Math.round(n*mult); s.xp=(s.xp||0)+gained; while(s.xp >= (s.xpToNext||100)){ s.xp -= (s.xpToNext||100); s.level=(s.level||1)+1; s.skillPoints=(s.skillPoints||0)+1; s.xpToNext=Math.round((s.xpToNext||100)*1.45); } save(SU.KEYS.STATS,s); const p=load(SU.KEYS.POINTS,{total:0,history:[]}); p.total=(p.total||0)+gained; p.history.push({n:gained,reason:src,t:Date.now()}); save(SU.KEYS.POINTS,p); const wk=load(SU.KEYS.WEEK,{}); const day=new Date().toISOString().slice(0,10); wk[day]=(wk[day]||0)+gained; save(SU.KEYS.WEEK,wk); return gained; }
function spendSkillPoint(stat){ const s=getStats(); if((s.skillPoints||0)<=0) return false; s.skillPoints--; s.stats[stat]=(s.stats[stat]||1)+1; save(SU.KEYS.STATS,s); return true; }
// practice helpers
function logPractice(e){ const arr=load(SU.KEYS.PRACTICE,[]); arr.push(e); save(SU.KEYS.PRACTICE,arr); }

import { useState, useEffect, useRef, createContext, useContext, useCallback } from "react";

const C = {
  bg:"#090C14", navy:"#0D1A36", card:"#111827", card2:"#1A2235",
  gold:"#D4A820", goldL:"#F0C84A", blue:"#1A5FA0", blueL:"#4A9FD4",
  green:"#10B981", red:"#EF4444", purple:"#8B5CF6",
  white:"#FFFFFF", gray:"#8A9ABB", grayL:"#C8D4E8", border:"#1E2D4A",
};

const AppCtx = createContext(null);

const INITIAL_JOBS = [
  { id:1, title:"Program Manager", org:"Casey Foundation", loc:"Remote", salary:"$72K–$95K",
    match:94, tags:["Nonprofit","Policy","Remote"], type:"Full-time",
    desc:"Lead cross-sector youth development initiatives and manage federal grant portfolios across 12 states. You'll partner with state agencies, community organizations, and funders to drive measurable outcomes for young people.",
    skills:["Project Management","Leadership","Grant Writing","Policy Analysis"],
    saved:false, applied:false },
  { id:2, title:"Community Engagement Director", org:"NAACP Maryland", loc:"Baltimore, MD", salary:"$65K–$80K",
    match:88, tags:["Community","Leadership","Hybrid"], type:"Full-time",
    desc:"Drive statewide community organizing, oversee chapter engagement, and represent NAACP at government stakeholder tables. Manage a team of 8 organizers and a $1.2M program budget.",
    skills:["Communication","Leadership","Community Organizing","Public Speaking"],
    saved:true, applied:false },
  { id:3, title:"Workforce Dev Specialist", org:"Annie E. Casey Foundation", loc:"Hybrid", salary:"$58K–$72K",
    match:82, tags:["Workforce","Education","Hybrid"], type:"Full-time",
    desc:"Design and implement workforce development curricula for underserved youth. Partner with 15+ community organizations across Baltimore City and track participant outcomes for federal reporting.",
    skills:["Education","Data Analysis","Program Design","Curriculum Development"],
    saved:false, applied:false },
  { id:4, title:"Policy Analyst", org:"Maryland DPSCS", loc:"Annapolis, MD", salary:"$55K–$68K",
    match:76, tags:["Policy","Government"], type:"Full-time",
    desc:"Analyze juvenile justice policies and prepare legislative briefs for the Secretary of Public Safety. Coordinate with legislators, advocacy groups, and federal partners on reform initiatives.",
    skills:["Writing","Research","Policy Analysis","Legislative Affairs"],
    saved:false, applied:false },
  { id:5, title:"Communications Manager", org:"Living Classrooms", loc:"Baltimore, MD", salary:"$52K–$65K",
    match:71, tags:["Communications","Nonprofit"], type:"Full-time",
    desc:"Own all internal and external communications, social media strategy, annual reports, and stakeholder storytelling. Manage one direct report and agency relationships.",
    skills:["Writing","Marketing","Communication","Social Media"],
    saved:false, applied:false },
];

const INITIAL_MODULES = [
  { id:1, title:"Résumé Basics", icon:"📄", color:"#1A5FA0", progress:100, duration:"25 min",
    desc:"ATS-ready formatting, bullet writing, and keyword strategy.", premium:false,
    lessons:[
      { title:"Why 75% of Résumés Never Get Read", body:"ATS software filters out most applications before any human ever sees them. This lesson breaks down exactly how ATS systems score your résumé and what triggers automatic rejection — so you can write to pass the filter and impress the human." },
      { title:"The Power Bullet Framework", body:"Generic bullets kill applications. Strong bullets follow an Action → Impact → Scale pattern: 'Led cross-sector coalition that reduced youth recidivism by 34% across 6 Maryland counties.' Every line should answer: so what?" },
      { title:"Keywords That Get You Hired", body:"Job descriptions are treasure maps. The exact words hiring managers use in the posting are what their ATS is scanning for. Mirror language naturally — not stuffing keywords awkwardly — so your résumé reads well to both the algorithm and the human." },
      { title:"Formatting That Works", body:"Fancy templates with columns, tables, and text boxes fail ATS systems. A clean single-column format with standard headings scores highest. This lesson shows you the exact layout that works every time." },
    ]},
  { id:2, title:"LinkedIn 101", icon:"💼", color:"#4A9FD4", progress:100, duration:"30 min",
    desc:"Profile optimization, connection strategy, and the hidden job market.", premium:false,
    lessons:[
      { title:"The LinkedIn Algorithm Explained", body:"LinkedIn's algorithm prioritizes profiles with 100% completeness, regular activity, and strong connection networks. Understanding what it rewards lets you appear in more recruiter searches passively, without applying to anything." },
      { title:"Writing a Headline That Gets Clicks", body:"Your LinkedIn headline is prime real estate. Most people waste it with a job title. A strong headline answers: who you help, how you help them, and what makes you different. We'll build yours in this lesson." },
      { title:"The Hidden Job Market", body:"70% of jobs are never publicly posted. They're filled through networks, referrals, and direct outreach. This lesson shows you exactly how to use LinkedIn to tap into that hidden market — including message templates that actually get responses." },
    ]},
  { id:3, title:"Interview Foundations", icon:"🎤", color:"#D4A820", progress:62, duration:"40 min",
    desc:"Behavioral prep, the STAR method, and closing strong.", premium:false,
    lessons:[
      { title:"Why Most Interviews Fail in the First 5 Minutes", body:"Interviewers form opinions within the first 90 seconds based on confidence, clarity, and presence — not qualifications. This lesson teaches you how to open strong, manage nerves, and take control of the room from the first handshake." },
      { title:"Mastering the STAR Method", body:"Situation, Task, Action, Result. Every behavioral question is an invitation to tell a story. The key is specificity — real numbers, real stakes, real outcomes. Vague answers get forgotten. Specific stories get offers." },
      { title:"The 20 Questions You'll Always Face", body:"There are 20 behavioral questions that appear in 90% of interviews. This lesson breaks each one down, shows you what the interviewer is really measuring, and gives you a framework to answer every one confidently." },
    ]},
  { id:4, title:"Interview Mastery", icon:"🧠", color:"#8B5CF6", progress:0, duration:"55 min",
    desc:"Advanced prep, live AI coaching, and case interviews.", premium:true,
    lessons:[
      { title:"Advanced Situational Interviews", body:"Situational questions test your judgment under pressure. This lesson walks through frameworks for handling hypotheticals across nonprofit management, policy leadership, and operations roles." },
      { title:"Negotiating the Interview Process", body:"The interview is a two-way evaluation. Learn to gather intelligence during the process, ask questions that signal executive-level thinking, and manage timelines to your advantage." },
    ]},
  { id:5, title:"Salary Negotiation", icon:"💰", color:"#10B981", progress:0, duration:"35 min",
    desc:"Market data, counter-offer scripts, and total comp strategy.", premium:true,
    lessons:[
      { title:"The Salary Research Framework", body:"Never enter a negotiation without data. Learn to use salary databases, job postings, and network contacts to build a defensible market range for your exact role, location, and experience level." },
      { title:"The Counter-Offer Script", body:"Most candidates accept the first offer. The ones who negotiate earn an average of $5,000–$15,000 more. This lesson gives you word-for-word scripts to counter confidently without seeming greedy." },
    ]},
  { id:6, title:"Professional Branding", icon:"⭐", color:"#D4A820", progress:0, duration:"40 min",
    desc:"Personal brand across LinkedIn, portfolio, and in-person presence.", premium:false,
    lessons:[
      { title:"What Is a Personal Brand", body:"Your personal brand is the story people tell about you when you're not in the room. In a world where hiring managers Google every candidate, your digital presence is often the deciding factor. Define and own your narrative." },
    ]},
  { id:7, title:"Workplace Readiness", icon:"🏢", color:"#4A9FD4", progress:0, duration:"45 min",
    desc:"Communication, boundaries, culture navigation, and professionalism.", premium:false,
    lessons:[
      { title:"Navigating Workplace Culture", body:"Every organization has a visible culture (what they say) and an invisible culture (how things actually work). Reading both quickly determines how fast you gain trust, influence, and opportunity." },
    ]},
  { id:8, title:"Career Pathway Planning", icon:"🗺️", color:"#10B981", progress:0, duration:"35 min",
    desc:"Goal mapping, credential roadmaps, and 90-day plans.", premium:false,
    lessons:[
      { title:"Building Your 3-Year Career Map", body:"Most people plan careers reactively. Strategic career planning means identifying the exact roles, skills, and relationships you need two moves ahead, and working backward to build the bridge." },
    ]},
];

function AppProvider({ children }) {
  const [screen, setScreen] = useState("splash");
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profileBio, setProfileBio] = useState("");
  const [profileCareer, setProfileCareer] = useState({ currentRole:"", targetRole:"", experience:"", location:"Baltimore, MD" });
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [applications, setApplications] = useState([]);
  const [tier, setTier] = useState("free");
  const [notifications, setNotifications] = useState([
    { id:1, text:"Casey Foundation opened your application", time:"2h ago", read:false },
    { id:2, text:"New match: Policy Director at ACLU Maryland (91%)", time:"5h ago", read:false },
    { id:3, text:"Continue Interview Foundations — you're 62% done", time:"1d ago", read:true },
  ]);

  const go = useCallback((s) => { setScreen(s); window.scrollTo(0,0); }, []);

  const applyToJob = (jobId) => {
    const job = jobs.find(j=>j.id===jobId);
    setJobs(prev => prev.map(j => j.id===jobId ? {...j, applied:true} : j));
    if (job && !applications.find(a=>a.jobId===jobId)) {
      setApplications(prev => [{
        jobId, title:job.title, org:job.org,
        status:"Application Sent", statusColor:C.blueL, stage:1,
        date: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}), icon:"📨"
      }, ...prev]);
      setNotifications(prev => [{
        id:Date.now(), text:`Application submitted to ${job.org}`, time:"Just now", read:false
      }, ...prev]);
    }
  };

  const saveJob = (jobId) => setJobs(prev => prev.map(j => j.id===jobId ? {...j,saved:!j.saved} : j));

  const updateModuleProgress = (modId, lessonIdx, totalLessons) => {
    setModules(prev => prev.map(m => {
      if (m.id!==modId) return m;
      const pct = Math.round(((lessonIdx+1)/totalLessons)*100);
      return {...m, progress:Math.max(m.progress, pct)};
    }));
  };

  const markNotificationsRead = () => setNotifications(prev => prev.map(n=>({...n,read:true})));
  const unreadCount = notifications.filter(n=>!n.read).length;

  // Documents
  const [documents, setDocuments] = useState([]);
  const [parsedResume, setParsedResume] = useState(null);

  const addDocument = (doc) => {
    setDocuments(prev => {
      const filtered = doc.type === "resume" ? prev.filter(d=>d.type!=="resume") : prev;
      return [doc, ...filtered];
    });
    if (doc.type === "resume" && doc.parsed) {
      setParsedResume(doc.parsed);
      if (doc.parsed.skills?.length) {
        setUser(u => ({...u, skills: doc.parsed.skills.slice(0,5), name: u?.name || doc.parsed.name || u?.name}));
      }
      setNotifications(prev => [{
        id: Date.now(), text: "Resume uploaded — profile updated from your document", time: "Just now", read: false
      }, ...prev]);
    }
  };

  return (
    <AppCtx.Provider value={{
      screen,go,user,setUser,jobs,modules,applications,tier,setTier,
      notifications,markNotificationsRead,unreadCount,
      applyToJob,saveJob,updateModuleProgress,
      documents,addDocument,parsedResume,
      profilePhoto,setProfilePhoto,
      profileBio,setProfileBio,
      profileCareer,setProfileCareer,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

// --- UI primitives ---
function MatchRing({ pct, size=52, color="#D4A820" }) {
  const r=(size-8)/2, circ=2*Math.PI*r, dash=(pct/100)*circ;
  return (
    <svg width={size} height={size} style={{flexShrink:0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1E2D4A" strokeWidth={5}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
        strokeWidth={5} strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x="50%" y="54%" textAnchor="middle" fill={color}
        fontSize={size<46?9:11} fontWeight="700" fontFamily="inherit">{pct}%</text>
    </svg>
  );
}

const Pill = ({label,color="#4A9FD4",bg}) => (
  <span style={{padding:"3px 10px",borderRadius:99,fontSize:11,fontWeight:600,
    color,background:bg||(color+"22"),whiteSpace:"nowrap"}}>{label}</span>
);

function Btn({children,onClick,variant="gold",style:s,disabled,full}) {
  const base={border:"none",borderRadius:10,fontFamily:"inherit",fontWeight:700,
    cursor:disabled?"default":"pointer",opacity:disabled?.5:1,width:full?"100%":"auto",
    transition:"opacity .15s"};
  const v={
    gold:{background:"#D4A820",color:"#090C14",padding:"13px 22px",fontSize:15},
    blue:{background:"#1A5FA0",color:"#fff",padding:"13px 22px",fontSize:15},
    green:{background:"#10B981",color:"#fff",padding:"13px 22px",fontSize:15},
    purple:{background:"#8B5CF6",color:"#fff",padding:"13px 22px",fontSize:15},
    outline:{background:"transparent",color:"#C8D4E8",border:"1px solid #1E2D4A",padding:"12px 22px",fontSize:15},
    ghost:{background:"#1A2235",color:"#C8D4E8",padding:"11px 18px",fontSize:14},
    sm:{background:"#D4A820",color:"#090C14",padding:"8px 16px",fontSize:13,borderRadius:8},
    smBlue:{background:"#1A5FA0",color:"#fff",padding:"8px 16px",fontSize:13,borderRadius:8},
  };
  return <button onClick={onClick} disabled={disabled}
    style={{...base,...(v[variant]||v.gold),...s}}>{children}</button>;
}

const Card = ({children,style:s,onClick}) => (
  <div onClick={onClick} style={{background:"#111827",border:"1px solid #1E2D4A",
    borderRadius:14,padding:"16px",cursor:onClick?"pointer":"default",...s}}>{children}</div>
);

function TopBar({title,back,right,onBack}) {
  const {go} = useContext(AppCtx);
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"16px 18px 12px",position:"sticky",top:0,zIndex:50,
      background:"#090C14",borderBottom:"1px solid #1E2D4A"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {(back||onBack)&&<button onClick={onBack||(()=>go(back))}
          style={{background:"none",border:"none",color:"#8A9ABB",fontSize:22,
            cursor:"pointer",padding:"2px 8px 2px 0",lineHeight:1}}>‹</button>}
        <span style={{fontWeight:700,fontSize:17,color:"#fff"}}>{title}</span>
      </div>
      <div>{right}</div>
    </div>
  );
}

function Progress({steps,current}) {
  return (
    <div style={{display:"flex",gap:5,padding:"4px 18px 16px"}}>
      {Array.from({length:steps}).map((_,i)=>(
        <div key={i} style={{flex:1,height:3,borderRadius:99,
          background:i<current?"#D4A820":"#1E2D4A",transition:"background .3s"}}/>
      ))}
    </div>
  );
}

function Tag({label,active,onClick}) {
  return <span onClick={onClick} style={{padding:"7px 14px",borderRadius:99,fontSize:12,
    fontWeight:600,cursor:"pointer",transition:"all .15s",
    background:active?"#D4A820":"#1A2235",color:active?"#090C14":"#8A9ABB",
    border:`1px solid ${active?"#D4A820":"#1E2D4A"}`}}>{label}</span>;
}

const TABS=[{id:"dashboard",icon:"⊞",label:"Home"},{id:"jobs",icon:"🔍",label:"Jobs"},
  {id:"apply",icon:"⚡",label:"Apply"},{id:"academy",icon:"🎓",label:"Academy"},
  {id:"profile",icon:"👤",label:"Profile"}];

function BottomNav() {
  const {screen,go} = useContext(AppCtx);
  const appScreens=["dashboard","jobs","apply","academy","profile","tracker","jobdetail","upgrade","lesson","notifications","saved","coach","documents"];
  const route=screen.split(":")[0];
  if(!appScreens.includes(route)) return null;
  const active=TABS.find(t=>route.startsWith(t.id))?.id||"dashboard";
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"min(430px,100vw)",background:"#0D1A36",borderTop:"1px solid #1E2D4A",
      display:"flex",padding:"8px 0 max(10px,env(safe-area-inset-bottom))",zIndex:100}}>
      {TABS.map(t=>(
        <button key={t.id} onClick={()=>go(t.id)}
          style={{flex:1,background:"none",border:"none",cursor:"pointer",
            display:"flex",flexDirection:"column",alignItems:"center",gap:2,
            color:active===t.id?"#D4A820":"#8A9ABB",fontFamily:"inherit"}}>
          <span style={{fontSize:20,lineHeight:1}}>{t.icon}</span>
          <span style={{fontSize:10,fontWeight:active===t.id?700:500}}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function AIChat({systemPrompt,placeholder="Ask me anything…",title="AI Coach"}) {
  const [msgs,setMsgs]=useState([]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"})},[msgs]);

  const send=async()=>{
    if(!input.trim()||loading) return;
    const userMsg={role:"user",content:input.trim()};
    setMsgs(prev=>[...prev,userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:systemPrompt,
          messages:[...msgs,userMsg],
        })
      });
      const d=await res.json();
      const reply=d.content?.find(b=>b.type==="text")?.text||"Try again — I'm here to help.";
      setMsgs(prev=>[...prev,{role:"assistant",content:reply}]);
    } catch {
      setMsgs(prev=>[...prev,{role:"assistant",content:"Connection issue. Please try again."}]);
    }
    setLoading(false);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{flex:1,overflowY:"auto",padding:"12px 0",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.length===0&&(
          <div style={{textAlign:"center",padding:"30px 16px",color:"#8A9ABB",fontSize:14}}>
            <div style={{fontSize:32,marginBottom:10}}>🤖</div>
            <div style={{fontWeight:600,color:"#C8D4E8",marginBottom:6}}>{title}</div>
            <div style={{fontSize:13}}>Ask me anything about your job search, interviews, or career growth.</div>
          </div>
        )}
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",padding:"0 4px"}}>
            <div style={{maxWidth:"85%",padding:"11px 14px",borderRadius:14,fontSize:14,lineHeight:1.6,
              background:m.role==="user"?"#1A5FA0":"#1A2235",
              color:m.role==="user"?"#fff":"#C8D4E8",
              borderBottomRightRadius:m.role==="user"?4:14,
              borderBottomLeftRadius:m.role==="user"?14:4}}>
              {m.content}
            </div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",padding:"0 4px"}}>
          <div style={{background:"#1A2235",padding:"11px 14px",borderRadius:14,color:"#8A9ABB",fontSize:14}}>Thinking…</div>
        </div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:8,padding:"12px 0 0",borderTop:"1px solid #1E2D4A"}}>
        <input value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&send()} placeholder={placeholder}
          style={{flex:1,background:"#111827",border:"1px solid #1E2D4A",borderRadius:10,
            padding:"11px 14px",color:"#fff",fontSize:14,fontFamily:"inherit",outline:"none"}}/>
        <button onClick={send} disabled={!input.trim()||loading}
          style={{background:input.trim()&&!loading?"#D4A820":"#1A2235",border:"none",
            borderRadius:10,padding:"11px 16px",
            color:input.trim()&&!loading?"#090C14":"#8A9ABB",
            cursor:input.trim()&&!loading?"pointer":"default",
            fontWeight:700,fontSize:14,fontFamily:"inherit"}}>Send</button>
      </div>
    </div>
  );
}

// --- SCREENS ---

function Landing() {
  const {go}=useContext(AppCtx);
  const [loaded,setLoaded]=useState(false);
  useEffect(()=>{setTimeout(()=>setLoaded(true),80)},[]);
  return (
    <div style={{minHeight:"100dvh",background:"#090C14",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 24px 48px"}}>
      <div style={{width:"100%",maxWidth:400,paddingTop:56,opacity:loaded?1:0,
        transform:loaded?"translateY(0)":"translateY(18px)",transition:"all .55s ease"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:44}}>
          <div style={{width:52,height:52,borderRadius:14,background:"#1A5FA0",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>💼</div>
          <div>
            <span style={{fontSize:28,fontWeight:900,color:"#fff"}}>Career</span>
            <span style={{fontSize:28,fontWeight:900,color:"#D4A820"}}> AI</span>
          </div>
        </div>
        <h1 style={{fontSize:40,fontWeight:900,color:"#fff",lineHeight:1.12,margin:"0 0 16px"}}>
          Find it.<br/><span style={{color:"#D4A820"}}>Apply.</span><br/>Grow.
        </h1>
        <p style={{color:"#8A9ABB",fontSize:16,lineHeight:1.65,margin:"0 0 36px"}}>
          AI-powered job matching, one-tap auto-apply, and career development — for every job seeker.
        </p>
        <div style={{display:"flex",gap:8,marginBottom:36}}>
          {[["75%","résumés rejected by ATS"],["250+","avg apps before an offer"],["1 App","match to hired"]].map(([v,l])=>(
            <div key={v} style={{flex:1,background:"#111827",borderRadius:12,
              padding:"12px 8px",textAlign:"center",border:"1px solid #1E2D4A"}}>
              <div style={{color:"#D4A820",fontWeight:800,fontSize:15}}>{v}</div>
              <div style={{color:"#8A9ABB",fontSize:10,marginTop:3,lineHeight:1.4}}>{l}</div>
            </div>
          ))}
        </div>
        <Btn onClick={()=>go("signup")} full style={{fontSize:17,padding:"15px"}}>Get Started — Free</Btn>
        <Btn onClick={()=>go("signin")} variant="outline" full style={{marginTop:12}}>Sign In</Btn>
        <p style={{color:"#8A9ABB",fontSize:12,textAlign:"center",marginTop:20,cursor:"pointer"}}
          onClick={()=>go("signin")}>Students — sign in with your school credentials ›</p>
      </div>
    </div>
  );
}

function SignUp() {
  const {go,setUser}=useContext(AppCtx);
  return (
    <div style={{minHeight:"100dvh",background:"#090C14",padding:"50px 24px 40px"}}>
      <div style={{maxWidth:400,margin:"0 auto"}}>
        <button onClick={()=>go("landing")} style={{background:"none",border:"none",color:"#8A9ABB",fontSize:14,cursor:"pointer",marginBottom:24,padding:0}}>← Back</button>
        <h2 style={{color:"#fff",fontSize:26,fontWeight:800,margin:"0 0 8px"}}>How are you joining?</h2>
        <p style={{color:"#8A9ABB",fontSize:15,margin:"0 0 28px"}}>We'll tailor your experience from day one.</p>
        {[
          {icon:"🎓",label:"Student",sub:"My school or program uses Career AI",color:"#1A5FA0"},
          {icon:"👤",label:"Individual",sub:"I'm signing up on my own",color:"#D4A820"},
        ].map(opt=>(
          <div key={opt.label} onClick={()=>{setUser({type:opt.label.toLowerCase(),tier:"free"});go("onboard");}}
            style={{background:"#111827",border:"1px solid #1E2D4A",borderRadius:16,
              padding:"20px 18px",marginBottom:14,cursor:"pointer",
              display:"flex",alignItems:"center",gap:16}}>
            <div style={{width:52,height:52,borderRadius:14,background:opt.color+"22",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{opt.icon}</div>
            <div style={{flex:1}}>
              <div style={{color:"#fff",fontWeight:700,fontSize:17}}>{opt.label}</div>
              <div style={{color:"#8A9ABB",fontSize:13,marginTop:3}}>{opt.sub}</div>
            </div>
            <span style={{color:"#8A9ABB",fontSize:22}}>›</span>
          </div>
        ))}
        <p style={{color:"#8A9ABB",fontSize:12,textAlign:"center",marginTop:24}}>By continuing you agree to our Terms & Privacy Policy.</p>
      </div>
    </div>
  );
}

function SignIn() {
  const {go,setUser}=useContext(AppCtx);
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  const handle=()=>{setUser({name:"James",email,type:"individual",tier:"free"});go("dashboard");};
  return (
    <div style={{minHeight:"100dvh",background:"#090C14",padding:"50px 24px 40px"}}>
      <div style={{maxWidth:400,margin:"0 auto"}}>
        <button onClick={()=>go("landing")} style={{background:"none",border:"none",color:"#8A9ABB",fontSize:14,cursor:"pointer",marginBottom:24,padding:0}}>← Back</button>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:32}}>
          <div style={{width:40,height:40,borderRadius:10,background:"#1A5FA0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>💼</div>
          <span style={{fontSize:22,fontWeight:900}}><span style={{color:"#fff"}}>Career</span><span style={{color:"#D4A820"}}> AI</span></span>
        </div>
        <h2 style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 24px"}}>Welcome back</h2>
        {[["Email address","email",email,setEmail],["Password","password",pass,setPass]].map(([ph,tp,val,set])=>(
          <input key={ph} value={val} onChange={e=>set(e.target.value)} placeholder={ph} type={tp}
            style={{width:"100%",background:"#111827",border:"1px solid #1E2D4A",borderRadius:12,
              padding:"14px 16px",color:"#fff",fontSize:15,fontFamily:"inherit",outline:"none",
              marginBottom:12,boxSizing:"border-box"}}/>
        ))}
        <Btn onClick={handle} full style={{marginBottom:10}}>Sign In</Btn>
        <Btn onClick={handle} variant="outline" full>Sign in with LinkedIn</Btn>
        <p style={{color:"#8A9ABB",fontSize:13,textAlign:"center",marginTop:20}}>
          No account? <span onClick={()=>go("signup")} style={{color:"#D4A820",cursor:"pointer"}}>Sign up free</span>
        </p>
      </div>
    </div>
  );
}

function Onboard() {
  const {go,setUser}=useContext(AppCtx);
  const [step,setStep]=useState(0);
  const [data,setData]=useState({name:"",role:"",goals:[],skills:[]});
  const roles=["Recent Graduate","Career Changer","Returning Worker","Current Student","Experienced Professional"];
  const goals=["Full-time job","Internship","Remote work","Higher salary","Career change","Part-time","Nonprofit sector","Government"];
  const skills=["Communication","Leadership","Project Management","Data Analysis","Writing","Marketing","Tech / IT","Customer Service","Finance","Education","Policy","Community Organizing"];
  const toggle=(k,v)=>setData(d=>({...d,[k]:d[k].includes(v)?d[k].filter(x=>x!==v):[...d[k],v]}));
  const canNext=[data.name.trim().length>1,!!data.role,data.goals.length>0,data.skills.length>0];

  const steps=[
    <div key={0}>
      <h2 style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 8px"}}>What's your name?</h2>
      <p style={{color:"#8A9ABB",fontSize:14,margin:"0 0 24px"}}>Let's get started.</p>
      <input value={data.name} onChange={e=>setData(d=>({...d,name:e.target.value}))} placeholder="First name"
        style={{width:"100%",background:"#111827",border:"1px solid #1E2D4A",borderRadius:12,
          padding:"14px 16px",color:"#fff",fontSize:16,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
    </div>,
    <div key={1}>
      <h2 style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 8px"}}>Which describes you?</h2>
      <p style={{color:"#8A9ABB",fontSize:14,margin:"0 0 20px"}}>Pick the closest fit.</p>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {roles.map(r=>(
          <div key={r} onClick={()=>setData(d=>({...d,role:r}))}
            style={{background:data.role===r?"#D4A82022":"#111827",
              border:`1px solid ${data.role===r?"#D4A820":"#1E2D4A"}`,borderRadius:12,
              padding:"14px 16px",cursor:"pointer",color:data.role===r?"#D4A820":"#C8D4E8",
              fontWeight:600,fontSize:15,display:"flex",justifyContent:"space-between"}}>
            {r}{data.role===r&&<span>✓</span>}
          </div>
        ))}
      </div>
    </div>,
    <div key={2}>
      <h2 style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 8px"}}>What are you looking for?</h2>
      <p style={{color:"#8A9ABB",fontSize:14,margin:"0 0 20px"}}>Select all that apply.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        {goals.map(g=><Tag key={g} label={g} active={data.goals.includes(g)} onClick={()=>toggle("goals",g)}/>)}
      </div>
    </div>,
    <div key={3}>
      <h2 style={{color:"#fff",fontSize:24,fontWeight:800,margin:"0 0 8px"}}>Your top skills?</h2>
      <p style={{color:"#8A9ABB",fontSize:14,margin:"0 0 20px"}}>Pick up to 5.</p>
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        {skills.map(s=>(
          <Tag key={s} label={s} active={data.skills.includes(s)}
            onClick={()=>(data.skills.length<5||data.skills.includes(s))&&toggle("skills",s)}/>
        ))}
      </div>
    </div>,
  ];

  return (
    <div style={{minHeight:"100dvh",background:"#090C14",padding:"40px 24px 120px"}}>
      <div style={{maxWidth:400,margin:"0 auto"}}>
        <Progress steps={4} current={step+1}/>
        <p style={{color:"#8A9ABB",fontSize:12,margin:"0 0 24px"}}>Step {step+1} of 4</p>
        {steps[step]}
        <div style={{display:"flex",gap:12,marginTop:32}}>
          {step>0&&<Btn variant="outline" onClick={()=>setStep(s=>s-1)} style={{flex:1}}>Back</Btn>}
          <Btn disabled={!canNext[step]} style={{flex:2}}
            onClick={()=>{
              if(step<3){setStep(s=>s+1);}
              else{setUser(u=>({...u,...data,profileStrength:72}));go("profile-setup");}
            }}>
            {step<3?"Continue →":"Find My Matches ⚡"}
          </Btn>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const {go,jobs,applications,modules,user,unreadCount}=useContext(AppCtx);
  const topJobs=jobs.filter(j=>!j.applied).slice(0,3);
  const activeModule=modules.find(m=>m.progress>0&&m.progress<100)||modules[2];
  const savedCount=jobs.filter(j=>j.saved).length;
  const name=user?.name||"there";
  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:80}}>
      <div style={{padding:"20px 18px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <p style={{color:"#8A9ABB",fontSize:14,margin:0}}>Good morning 👋</p>
          <h2 style={{color:"#fff",fontSize:22,fontWeight:800,margin:"4px 0 0"}}>{name}</h2>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{position:"relative",cursor:"pointer"}} onClick={()=>go("notifications")}>
            <div style={{width:40,height:40,borderRadius:99,background:"#111827",
              border:"1px solid #1E2D4A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🔔</div>
            {unreadCount>0&&<div style={{position:"absolute",top:-3,right:-3,width:18,height:18,
              background:"#D4A820",borderRadius:99,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:10,fontWeight:800,color:"#090C14",
              border:"2px solid #090C14"}}>{unreadCount}</div>}
          </div>
          <div onClick={()=>go("profile")} style={{width:40,height:40,borderRadius:99,
            background:"#1A5FA0",display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:18,cursor:"pointer"}}>👤</div>
        </div>
      </div>

      <div style={{margin:"16px 18px 0"}}>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{color:"#fff",fontWeight:600,fontSize:14}}>Profile Strength</span>
            <span style={{color:"#D4A820",fontWeight:700,fontSize:14}}>72%</span>
          </div>
          <div style={{height:5,background:"#1E2D4A",borderRadius:99}}>
            <div style={{width:"72%",height:"100%",background:"#D4A820",borderRadius:99}}/>
          </div>
          <p onClick={()=>go("profile")} style={{color:"#4A9FD4",fontSize:12,margin:"10px 0 0",cursor:"pointer"}}>
            Add your LinkedIn URL to boost to 88% ›
          </p>
        </Card>
      </div>

      <div style={{display:"flex",gap:10,padding:"12px 18px 0"}}>
        {[
          {n:jobs.filter(j=>!j.applied).length,l:"New Matches",color:"#D4A820",s:"jobs"},
          {n:applications.length+2,l:"Applications",color:"#4A9FD4",s:"tracker"},
          {n:2,l:"Interviews",color:"#10B981",s:"tracker"},
        ].map(st=>(
          <div key={st.l} onClick={()=>go(st.s)}
            style={{flex:1,background:"#111827",border:"1px solid #1E2D4A",
              borderRadius:12,padding:"12px 8px",textAlign:"center",cursor:"pointer"}}>
            <div style={{color:st.color,fontWeight:800,fontSize:22}}>{st.n}</div>
            <div style={{color:"#8A9ABB",fontSize:11,marginTop:2}}>{st.l}</div>
          </div>
        ))}
      </div>

      <div style={{padding:"18px 18px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{color:"#fff",fontWeight:700,fontSize:16,margin:0}}>Top Matches Today</h3>
          <span onClick={()=>go("jobs")} style={{color:"#D4A820",fontSize:13,cursor:"pointer"}}>See all ›</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {topJobs.map(j=>(
            <Card key={j.id} onClick={()=>go(`jobdetail:${j.id}`)} style={{cursor:"pointer"}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:42,height:42,borderRadius:10,background:"#1A2235",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏢</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:"#fff",fontWeight:700,fontSize:14,whiteSpace:"nowrap",
                    overflow:"hidden",textOverflow:"ellipsis"}}>{j.title}</div>
                  <div style={{color:"#8A9ABB",fontSize:12,marginTop:2}}>{j.org} · {j.loc}</div>
                  <div style={{display:"flex",gap:6,marginTop:8}}>
                    <Pill label={j.salary} color="#10B981"/>
                    <Pill label={j.type}/>
                  </div>
                </div>
                <MatchRing pct={j.match} color={j.match>=90?"#D4A820":j.match>=80?"#10B981":"#4A9FD4"} size={48}/>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{padding:"14px 18px 0"}}>
        <div onClick={()=>go(`lesson:${activeModule.id}:0`)}
          style={{background:"linear-gradient(135deg,#1A5FA044,#0D1A36)",
            border:"1px solid #1A5FA0",borderRadius:14,padding:"16px",cursor:"pointer"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:"#4A9FD4",fontWeight:700,fontSize:12,marginBottom:4}}>🎓 CONTINUE LEARNING</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:15}}>{activeModule.title}</div>
              <div style={{color:"#8A9ABB",fontSize:12,marginTop:3}}>{activeModule.duration} · {activeModule.lessons.length} lessons</div>
            </div>
            <MatchRing pct={activeModule.progress} color="#4A9FD4" size={50}/>
          </div>
        </div>
      </div>

      {savedCount>0&&(
        <div style={{padding:"12px 18px 0"}}>
          <div onClick={()=>go("saved")}
            style={{background:"#111827",border:"1px solid #1E2D4A",borderRadius:12,
              padding:"14px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:"#fff",fontWeight:600,fontSize:14}}>⭐ Saved Jobs</div>
              <div style={{color:"#8A9ABB",fontSize:12,marginTop:2}}>{savedCount} saved</div>
            </div>
            <span style={{color:"#D4A820",fontSize:20}}>›</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Jobs() {
  const {go,jobs}=useContext(AppCtx);
  const [filter,setFilter]=useState("All");
  const filters=["All","Remote","Nonprofit","Policy","Education","Hybrid"];
  const filtered=filter==="All"?jobs:jobs.filter(j=>j.tags.includes(filter));
  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:80}}>
      <TopBar title="My Matches" right={<Pill label={`${jobs.filter(j=>!j.applied).length} Active`} color="#D4A820" bg="#D4A82022"/>}/>
      <div style={{padding:"10px 18px",display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none"}}>
        {filters.map(f=><Tag key={f} label={f} active={filter===f} onClick={()=>setFilter(f)}/>)}
      </div>
      <div style={{padding:"0 18px",display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(j=>(
          <Card key={j.id} onClick={()=>go(`jobdetail:${j.id}`)} style={{cursor:"pointer"}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:44,height:44,borderRadius:10,background:"#1A2235",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                {j.applied?"✅":"🏢"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{color:"#fff",fontWeight:700,fontSize:15,whiteSpace:"nowrap",
                  overflow:"hidden",textOverflow:"ellipsis"}}>{j.title}</div>
                <div style={{color:"#8A9ABB",fontSize:13,marginTop:2}}>{j.org} · {j.loc}</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                  {j.tags.map(t=><Pill key={t} label={t}/>)}
                </div>
                <div style={{marginTop:8,display:"flex",gap:6}}>
                  <Pill label={j.salary} color="#10B981"/>
                  {j.applied&&<Pill label="Applied" color="#4A9FD4"/>}
                  {j.saved&&<Pill label="⭐ Saved" color="#D4A820"/>}
                </div>
              </div>
              <MatchRing pct={j.match} color={j.match>=90?"#D4A820":j.match>=80?"#10B981":"#4A9FD4"} size={50}/>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function JobDetail({jobId}) {
  const {go,jobs,applyToJob,saveJob,tier}=useContext(AppCtx);
  const job=jobs.find(j=>j.id===jobId)||jobs[0];
  const [approved,setApproved]=useState(false);
  const [aiAnalysis,setAiAnalysis]=useState("");
  const [loadingAI,setLoadingAI]=useState(false);
  const col=job.match>=90?"#D4A820":job.match>=80?"#10B981":"#4A9FD4";

  useEffect(()=>{
    setLoadingAI(true);
    fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",max_tokens:200,
        messages:[{role:"user",content:`2-3 sentence career AI analysis for a nonprofit leader with policy/grant management experience applying to: "${job.title}" at ${job.org}. Be direct, specific, encouraging. Mention one concrete strength and one tip.`}]
      })
    }).then(r=>r.json()).then(d=>{
      setAiAnalysis(d.content?.[0]?.text||"Strong alignment with your leadership background. Apply with confidence.");
      setLoadingAI(false);
    }).catch(()=>{
      setAiAnalysis("Strong alignment based on your nonprofit leadership and policy experience. Tailor your application to emphasize outcomes and grant management. Recommend applying.");
      setLoadingAI(false);
    });
  },[job.id]);

  const handleApprove=()=>{
    setApproved(true);
    applyToJob(job.id);
    setTimeout(()=>go("apply"),800);
  };

  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:100}}>
      <TopBar title="Job Details" back="jobs" right={
        <button onClick={()=>saveJob(job.id)}
          style={{background:"none",border:"none",cursor:"pointer",fontSize:22,
            color:job.saved?"#D4A820":"#8A9ABB"}}>{job.saved?"⭐":"☆"}</button>
      }/>
      <div style={{padding:"0 18px"}}>
        <Card style={{marginTop:14}}>
          <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:56,height:56,borderRadius:14,background:"#1A2235",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🏢</div>
            <div style={{flex:1}}>
              <h2 style={{color:"#fff",fontWeight:800,fontSize:18,margin:"0 0 4px"}}>{job.title}</h2>
              <p style={{color:"#8A9ABB",fontSize:14,margin:"0 0 8px"}}>{job.org} · {job.loc}</p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {job.tags.map(t=><Pill key={t} label={t}/>)}
              </div>
            </div>
            <MatchRing pct={job.match} color={col} size={56}/>
          </div>
        </Card>

        <div style={{display:"flex",gap:10,marginTop:10}}>
          <Card style={{flex:1,padding:"12px 14px"}}>
            <div style={{color:"#8A9ABB",fontSize:11,marginBottom:4}}>SALARY</div>
            <div style={{color:"#10B981",fontWeight:700,fontSize:16}}>{job.salary}</div>
          </Card>
          <Card style={{flex:1,padding:"12px 14px"}}>
            <div style={{color:"#8A9ABB",fontSize:11,marginBottom:4}}>TYPE</div>
            <div style={{color:"#fff",fontWeight:700,fontSize:16}}>{job.type}</div>
          </Card>
        </div>

        <Card style={{marginTop:10}}>
          <h4 style={{color:"#4A9FD4",fontWeight:700,fontSize:12,margin:"0 0 10px",letterSpacing:.5}}>ABOUT THE ROLE</h4>
          <p style={{color:"#C8D4E8",fontSize:14,lineHeight:1.7,margin:0}}>{job.desc}</p>
        </Card>

        <Card style={{marginTop:10}}>
          <h4 style={{color:"#4A9FD4",fontWeight:700,fontSize:12,margin:"0 0 12px",letterSpacing:.5}}>SKILLS MATCH</h4>
          {job.skills.map((sk,i)=>{
            const pcts=[88,92,76,84,80];
            return (
              <div key={sk} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                <span style={{color:"#C8D4E8",fontSize:14}}>{sk}</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:80,height:4,background:"#1E2D4A",borderRadius:99}}>
                    <div style={{width:`${pcts[i]||80}%`,height:"100%",background:col,borderRadius:99}}/>
                  </div>
                  <span style={{color:"#10B981",fontSize:12}}>✓</span>
                </div>
              </div>
            );
          })}
        </Card>

        <Card style={{marginTop:10,border:"1px solid #D4A82044",background:"#D4A82008"}}>
          <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
            <span style={{fontSize:20}}>⚡</span>
            <div style={{flex:1}}>
              <div style={{color:"#D4A820",fontWeight:700,fontSize:13,marginBottom:6}}>AI Career Analysis</div>
              {loadingAI
                ?<div style={{color:"#8A9ABB",fontSize:13}}>Analyzing your fit for this role…</div>
                :<p style={{color:"#C8D4E8",fontSize:13,lineHeight:1.65,margin:0}}>{aiAnalysis}</p>}
            </div>
          </div>
        </Card>

        <Card style={{marginTop:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{color:"#fff",fontWeight:600,fontSize:14}}>🎤 AI Interview Prep</div>
            {tier==="free"&&<Pill label="Premium" color="#D4A820"/>}
          </div>
          <p style={{color:"#8A9ABB",fontSize:13,margin:"0 0 12px"}}>Practice interview questions tailored to this specific role.</p>
          <Btn variant="smBlue" style={{width:"100%"}}
            onClick={()=>go(tier==="free"?"upgrade":`coach:${job.id}`)}>
            {tier==="free"?"Unlock Interview Prep →":"Start Interview Practice →"}
          </Btn>
        </Card>
      </div>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"min(430px,100vw)",background:"#090C14",borderTop:"1px solid #1E2D4A",
        padding:"14px 18px 28px",display:"flex",gap:10}}>
        <Btn variant="outline" style={{flex:1}} onClick={()=>saveJob(job.id)}>
          {job.saved?"⭐ Saved":"☆ Save"}
        </Btn>
        {job.applied?(
          <Btn variant="ghost" style={{flex:2,background:"#10B98122",color:"#10B981",border:"1px solid #10B98144"}}>✓ Applied</Btn>
        ):approved?(
          <Btn variant="ghost" style={{flex:2,background:"#D4A82022",color:"#D4A820",border:"1px solid #D4A82044"}}>⚡ Applying…</Btn>
        ):(
          <Btn onClick={handleApprove} style={{flex:2}}>Approve & Auto-Apply ⚡</Btn>
        )}
      </div>
    </div>
  );
}

function ApplyFlow() {
  const {go,jobs,applications}=useContext(AppCtx);
  const recentApp=applications[0];
  const job=recentApp?jobs.find(j=>j.id===recentApp.jobId)||jobs[0]:jobs[0];
  const [stage,setStage]=useState(0);
  const stages=[
    {icon:"📄",title:"Building your résumé",sub:`Tailoring bullets to match ${job?.org||"this role"}'s keywords and ATS requirements…`},
    {icon:"✍️",title:"Writing cover letter",sub:`Personalizing your narrative for ${job?.title||"this position"} — mission alignment, outcomes, leadership…`},
    {icon:"🎯",title:"ATS Optimization",sub:"Formatting for Greenhouse ATS — ensuring 98%+ pass-through rate and keyword density…"},
    {icon:"🚀",title:"Application submitted!",sub:`${job?.org||"Organization"} · ${job?.title||"Role"} · Ref #CAI-${Math.floor(Math.random()*90000+10000)}`},
  ];
  useEffect(()=>{
    if(stage<3){const t=setTimeout(()=>setStage(s=>s+1),1700);return()=>clearTimeout(t);}
  },[stage]);
  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:80}}>
      <TopBar title="AI Auto-Apply"/>
      <div style={{padding:"16px 18px"}}>
        <h2 style={{color:"#fff",fontWeight:800,fontSize:20,margin:"0 0 4px"}}>Applying to {job?.org||"your match"}</h2>
        <p style={{color:"#8A9ABB",fontSize:14,margin:"0 0 24px"}}>AI is building and submitting your tailored application.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {stages.map((st,i)=>(
            <Card key={i} style={{border:`1px solid ${i===stage?"#D4A820":i<stage?"#10B981":"#1E2D4A"}`,
              background:i===stage?"#D4A82008":"#111827",transition:"all .3s"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:44,height:44,borderRadius:99,flexShrink:0,
                  background:i<stage?"#10B98122":i===stage?"#D4A82022":"#1A2235",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>
                  {i<stage?"✓":i===stage&&stage<3?<span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span>:st.icon}
                </div>
                <div style={{flex:1}}>
                  <div style={{color:i<stage?"#10B981":i===stage?"#D4A820":"#8A9ABB",fontWeight:700,fontSize:15}}>{st.title}</div>
                  {i<=stage&&<div style={{color:"#8A9ABB",fontSize:12,marginTop:3}}>{st.sub}</div>}
                </div>
                {i<stage&&<span style={{color:"#10B981",fontSize:18}}>✓</span>}
              </div>
            </Card>
          ))}
        </div>
        {stage===3&&(
          <div style={{marginTop:24,textAlign:"center"}}>
            <div style={{fontSize:52,marginBottom:12}}>🎉</div>
            <h3 style={{color:"#fff",fontWeight:800,fontSize:20,margin:"0 0 8px"}}>Application Sent!</h3>
            <p style={{color:"#8A9ABB",fontSize:14,margin:"0 0 24px",lineHeight:1.6}}>
              Tailored résumé and cover letter submitted. You'll get notified when they open it.
            </p>
            <div style={{display:"flex",gap:10}}>
              <Btn variant="ghost" onClick={()=>go("tracker")} style={{flex:1}}>View in Tracker</Btn>
              <Btn onClick={()=>go("jobs")} style={{flex:1}}>Find More Jobs</Btn>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

function Tracker() {
  const {go,applications}=useContext(AppCtx);
  const STAGES=["Applied","Reviewed","Interview","Offer"];
  const seedApps=[
    {title:"Program Manager",org:"Casey Foundation",status:"Interview Scheduled",statusColor:"#10B981",stage:3,date:"Jun 5",icon:"📅"},
    {title:"Policy Analyst",org:"DPSCS Maryland",status:"Under Review",statusColor:"#D4A820",stage:2,date:"Jun 2",icon:"🔍"},
    {title:"Communications Mgr",org:"Living Classrooms",status:"Application Sent",statusColor:"#4A9FD4",stage:1,date:"May 30",icon:"📨"},
    {title:"Youth Dev Director",org:"Baltimore City",status:"Application Sent",statusColor:"#4A9FD4",stage:1,date:"May 28",icon:"📨"},
  ];
  const allApps=[...applications.map(a=>({...a,icon:"📨"})),...seedApps].slice(0,8);
  const [tab,setTab]=useState("all");
  const displayed=tab==="all"?allApps:tab==="active"?allApps.filter(a=>a.stage>=2):allApps.filter(a=>a.stage===1);
  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:80}}>
      <TopBar title="My Applications"/>
      <div style={{display:"flex",padding:"12px 18px 0"}}>
        {[["all","All"],["active","Active"],["sent","Applied"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{flex:1,background:"none",border:"none",
              borderBottom:`2px solid ${tab===k?"#D4A820":"#1E2D4A"}`,
              color:tab===k?"#D4A820":"#8A9ABB",padding:"10px 4px",
              fontFamily:"inherit",fontWeight:700,fontSize:13,cursor:"pointer"}}>{l}</button>
        ))}
      </div>
      <div style={{margin:"14px 18px 0"}}>
        <Card>
          <h4 style={{color:"#C8D4E8",fontWeight:600,fontSize:13,margin:"0 0 12px"}}>Pipeline Overview</h4>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            {[[allApps.length,"Applied"],[allApps.filter(a=>a.stage>=2).length,"Reviewed"],
              [allApps.filter(a=>a.stage>=3).length,"Interview"],[allApps.filter(a=>a.stage>=4).length,"Offer"]].map(([n,l])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{color:"#D4A820",fontWeight:800,fontSize:20}}>{n}</div>
                <div style={{color:"#8A9ABB",fontSize:11,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div style={{padding:"12px 18px 0",display:"flex",flexDirection:"column",gap:10}}>
        {displayed.map((a,i)=>(
          <Card key={i}>
            <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:42,height:42,borderRadius:10,background:"#1A2235",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.icon}</div>
              <div style={{flex:1}}>
                <div style={{color:"#fff",fontWeight:700,fontSize:15}}>{a.title}</div>
                <div style={{color:"#8A9ABB",fontSize:13,marginTop:2}}>{a.org}</div>
                <div style={{marginTop:8}}><Pill label={a.status} color={a.statusColor}/></div>
              </div>
              <div style={{color:"#8A9ABB",fontSize:12,flexShrink:0}}>{a.date}</div>
            </div>
            <div style={{display:"flex",gap:0,marginTop:12}}>
              {STAGES.map((st,si)=>(
                <div key={st} style={{flex:1,textAlign:"center"}}>
                  <div style={{height:3,background:si<a.stage?a.statusColor:"#1E2D4A",marginBottom:4,transition:"background .3s"}}/>
                  <div style={{fontSize:10,color:si<a.stage?a.statusColor:"#8A9ABB"}}>{st}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Academy() {
  const {go,modules,tier}=useContext(AppCtx);
  const completed=modules.filter(m=>m.progress===100).length;
  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:80}}>
      <TopBar title="Career Skills Academy"/>
      <div style={{padding:"0 18px"}}>
        <Card style={{marginTop:14,border:"1px solid #D4A82044"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <div style={{color:"#fff",fontWeight:700,fontSize:16}}>Your Progress</div>
              <div style={{color:"#8A9ABB",fontSize:13,marginTop:2}}>{completed} of {modules.length} modules complete</div>
            </div>
            <MatchRing pct={Math.round(completed/modules.length*100)} size={54} color="#D4A820"/>
          </div>
          <div style={{height:4,background:"#1E2D4A",borderRadius:99}}>
            <div style={{width:`${(completed/modules.length)*100}%`,height:"100%",background:"#D4A820",borderRadius:99,transition:"width .4s"}}/>
          </div>
        </Card>
        <h3 style={{color:"#fff",fontWeight:700,fontSize:16,margin:"20px 0 12px"}}>All Modules</h3>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {modules.map(m=>{
            const locked=m.premium&&tier==="free";
            return (
              <Card key={m.id} onClick={()=>go(locked?"upgrade":`lesson:${m.id}:0`)} style={{cursor:"pointer",opacity:locked?.85:1}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:46,height:46,borderRadius:12,flexShrink:0,
                    background:locked?"#1A2235":m.color+"22",
                    border:`1px solid ${locked?"#1E2D4A":m.color+"44"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>
                    {locked?"🔒":m.icon}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                      <span style={{color:"#fff",fontWeight:700,fontSize:15}}>{m.title}</span>
                      {m.progress===100?<span style={{color:"#10B981",fontSize:16,flexShrink:0}}>✓</span>
                        :m.progress>0?<Pill label={`${m.progress}%`} color={m.color}/>
                        :locked?<Pill label="Premium" color="#D4A820}"/>:null}
                    </div>
                    <p style={{color:"#8A9ABB",fontSize:12,margin:"4px 0 8px",lineHeight:1.5}}>{m.desc}</p>
                    <div style={{display:"flex",gap:10}}>
                      <span style={{color:"#8A9ABB",fontSize:11}}>📚 {m.lessons.length} lessons</span>
                      <span style={{color:"#8A9ABB",fontSize:11}}>⏱ {m.duration}</span>
                    </div>
                    {m.progress>0&&m.progress<100&&(
                      <div style={{height:3,background:"#1E2D4A",borderRadius:99,marginTop:10}}>
                        <div style={{width:`${m.progress}%`,height:"100%",background:m.color,borderRadius:99}}/>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LessonView({modId,lessonIdx}) {
  const {go,modules,updateModuleProgress}=useContext(AppCtx);
  const mod=modules.find(m=>m.id===modId)||modules[2];
  const [current,setCurrent]=useState(lessonIdx||0);
  const [showAI,setShowAI]=useState(false);
  const lesson=mod.lessons[Math.min(current,mod.lessons.length-1)];

  const next=()=>{
    updateModuleProgress(mod.id,current,mod.lessons.length);
    if(current<mod.lessons.length-1){setCurrent(c=>c+1);setShowAI(false);}
    else{go("academy");}
  };

  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:100}}>
      <TopBar title={mod.title} onBack={()=>go("academy")}/>
      <Progress steps={mod.lessons.length} current={current+1}/>
      {!showAI?(
        <div style={{padding:"0 18px"}}>
          <Pill label={`Lesson ${current+1} of ${mod.lessons.length}`} color={mod.color}/>
          <h2 style={{color:"#fff",fontWeight:800,fontSize:21,margin:"14px 0 16px",lineHeight:1.3}}>{lesson.title}</h2>
          <Card>
            <p style={{color:"#C8D4E8",fontSize:15,lineHeight:1.8,margin:0}}>{lesson.body}</p>
          </Card>
          <Card style={{marginTop:12,border:`1px solid ${mod.color}44`,background:`${mod.color}08`}}>
            <div style={{color:mod.color,fontWeight:700,fontSize:13,marginBottom:8}}>🤖 Practice with AI Coach</div>
            <p style={{color:"#8A9ABB",fontSize:13,margin:"0 0 12px",lineHeight:1.5}}>
              Get personalized coaching and practice applying what you just learned.
            </p>
            <Btn variant="smBlue" style={{width:"100%"}} onClick={()=>setShowAI(true)}>
              Open AI Coach →
            </Btn>
          </Card>
        </div>
      ):(
        <div style={{padding:"0 18px",height:"calc(100dvh - 170px)",display:"flex",flexDirection:"column"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{color:"#fff",fontWeight:700,fontSize:15}}>AI Coach — {mod.title}</div>
            <button onClick={()=>setShowAI(false)}
              style={{background:"none",border:"none",color:"#8A9ABB",cursor:"pointer",fontSize:13}}>← Lesson</button>
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
            <AIChat
              systemPrompt={`You are a Career AI coach helping a job seeker practice "${lesson.title}" from the module "${mod.title}". Be encouraging, specific, and practical. Ask them to try applying the concept with a real example from their experience. Give direct, actionable feedback in 2-4 sentences. If they answer a practice question, give them STAR method feedback.`}
              placeholder="Ask a question or try the concept…"
              title={`${mod.title} Coach`}
            />
          </div>
        </div>
      )}
      {!showAI&&(
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
          width:"min(430px,100vw)",background:"#090C14",borderTop:"1px solid #1E2D4A",
          padding:"14px 18px 28px",display:"flex",gap:10}}>
          {current>0&&<Btn variant="outline" style={{flex:1}} onClick={()=>{setCurrent(c=>c-1);setShowAI(false);}}>← Back</Btn>}
          <Btn style={{flex:2}} onClick={next}>
            {current<mod.lessons.length-1?"Next Lesson →":"✓ Complete Module"}
          </Btn>
        </div>
      )}
    </div>
  );
}

function InterviewCoach({jobId}) {
  const {jobs}=useContext(AppCtx);
  const job=jobs.find(j=>j.id===jobId)||jobs[0];
  const {go}=useContext(AppCtx);
  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:20}}>
      <TopBar title="Interview Prep Coach" onBack={()=>go(`jobdetail:${jobId}`)}/>
      <div style={{padding:"12px 18px",height:"calc(100dvh - 120px)",display:"flex",flexDirection:"column"}}>
        <Card style={{marginBottom:12,border:"1px solid #1A5FA044"}}>
          <div style={{color:"#4A9FD4",fontWeight:600,fontSize:13}}>
            🎯 Prepping for: <span style={{color:"#fff"}}>{job.title}</span> at <span style={{color:"#D4A820"}}>{job.org}</span>
          </div>
        </Card>
        <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
          <AIChat
            systemPrompt={`You are a Career AI interview prep coach helping a candidate prepare for "${job.title}" at ${job.org}. The candidate has nonprofit leadership, policy analysis, grant management, and community organizing experience. Ask behavioral interview questions one at a time, give specific STAR method feedback on their answers, suggest improvements, and help them build confidence. Be warm, direct, and specific. Keep each response to 3-5 sentences max.`}
            placeholder="Say 'start' or ask a question…"
            title={`Interview Coach — ${job.org}`}
          />
        </div>
      </div>
    </div>
  );
}

function SavedJobs() {
  const {go,jobs,saveJob}=useContext(AppCtx);
  const saved=jobs.filter(j=>j.saved);
  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:80}}>
      <TopBar title="Saved Jobs" back="dashboard"/>
      <div style={{padding:"12px 18px"}}>
        {saved.length===0?(
          <div style={{textAlign:"center",padding:"60px 20px",color:"#8A9ABB"}}>
            <div style={{fontSize:36,marginBottom:12}}>☆</div>
            <div style={{fontWeight:600,color:"#C8D4E8",marginBottom:8}}>No saved jobs yet</div>
            <div style={{fontSize:13,marginBottom:20}}>Tap ☆ on any job to save it here</div>
            <Btn onClick={()=>go("jobs")}>Browse Jobs</Btn>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {saved.map(j=>(
              <Card key={j.id}>
                <div style={{display:"flex",gap:12,alignItems:"center"}}>
                  <div style={{width:42,height:42,borderRadius:10,background:"#1A2235",
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏢</div>
                  <div style={{flex:1,cursor:"pointer"}} onClick={()=>go(`jobdetail:${j.id}`)}>
                    <div style={{color:"#fff",fontWeight:700,fontSize:14}}>{j.title}</div>
                    <div style={{color:"#8A9ABB",fontSize:12,marginTop:2}}>{j.org} · {j.salary}</div>
                  </div>
                  <button onClick={()=>saveJob(j.id)}
                    style={{background:"none",border:"none",color:"#D4A820",fontSize:20,cursor:"pointer"}}>⭐</button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Notifications() {
  const {go,notifications,markNotificationsRead}=useContext(AppCtx);
  useEffect(()=>{markNotificationsRead();},[]);
  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:80}}>
      <TopBar title="Notifications" back="dashboard"/>
      <div style={{padding:"12px 18px",display:"flex",flexDirection:"column",gap:10}}>
        {notifications.map(n=>(
          <Card key={n.id} style={{border:`1px solid ${n.read?"#1E2D4A":"#D4A82044"}`,
            background:n.read?"#111827":"#D4A82008"}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:8,height:8,borderRadius:99,marginTop:5,flexShrink:0,
                background:n.read?"#8A9ABB":"#D4A820"}}/>
              <div style={{flex:1}}>
                <div style={{color:n.read?"#C8D4E8":"#fff",fontSize:14,lineHeight:1.5}}>{n.text}</div>
                <div style={{color:"#8A9ABB",fontSize:12,marginTop:4}}>{n.time}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const {go,user,tier,applications,modules,documents,profilePhoto,profileBio,profileCareer}=useContext(AppCtx);
  const completed=modules.filter(m=>m.progress===100).length;
  const tierLabel=tier==="free"?"Free Plan":tier==="premium"?"⭐ Premium":"👑 Elite";
  const tierColor=tier==="free"?"#8A9ABB":tier==="premium"?"#D4A820":"#8B5CF6";
  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:80}}>
      <TopBar title="My Profile" right={<Btn variant="sm" onClick={()=>go("profile-setup")}>Edit Profile</Btn>}/>
      <div style={{padding:"0 18px"}}>
        <div style={{textAlign:"center",padding:"24px 0 18px"}}> 
          {/* Cover photo / avatar */}
          <div style={{width:88,height:88,borderRadius:99,
            background:profilePhoto?"transparent":"#1A5FA0",
            border:`3px solid ${profilePhoto?"#D4A820":"#1E2D4A"}`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:38,margin:"0 auto 12px",overflow:"hidden",cursor:"pointer"}}
            onClick={()=>go("profile-setup")}>
            {profilePhoto
              ?<img src={profilePhoto} alt="profile" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              :<span>👤</span>}
          </div>
          <h2 style={{color:"#fff",fontWeight:800,fontSize:20,margin:"0 0 4px"}}>
            {user?.name||"James Hollywood"}
          </h2>
          <p style={{color:"#8A9ABB",fontSize:14,margin:"0 0 6px"}}>
            {profileCareer?.currentRole||user?.role||"Career Changer"} · {profileCareer?.location||"Baltimore, MD"}
          </p>
          {profileBio && (
            <p style={{color:"#C8D4E8",fontSize:13,lineHeight:1.6,
              margin:"8px auto 10px",maxWidth:320}}>{profileBio}</p>
          )}
          <Pill label={tierLabel} color={tierColor}/>
        </div>

        {tier==="free"&&(
          <div onClick={()=>go("upgrade")}
            style={{background:"linear-gradient(135deg,#D4A82033,#0D1A36)",
              border:"1px solid #D4A82066",borderRadius:14,padding:"16px 18px",
              cursor:"pointer",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{color:"#D4A820",fontWeight:700,fontSize:14}}>⭐ Upgrade to Premium</div>
              <div style={{color:"#8A9ABB",fontSize:12,marginTop:4}}>Unlimited matches · Full Academy · AI Interview Coach</div>
            </div>
            <span style={{color:"#D4A820",fontSize:20}}>›</span>
          </div>
        )}

        <div style={{display:"flex",gap:10,marginBottom:14}}>
          {[["72%","Profile Score"],[applications.length+2,"Applications"],[completed,"Modules Done"]].map(([v,l])=>(
            <Card key={l} style={{flex:1,padding:"12px 10px",textAlign:"center"}}>
              <div style={{color:"#D4A820",fontWeight:800,fontSize:18}}>{v}</div>
              <div style={{color:"#8A9ABB",fontSize:11,marginTop:3,lineHeight:1.3}}>{l}</div>
            </Card>
          ))}
        </div>

        {[
          {label:"Experience",items:["NAMI Maryland — Deputy Director","Annie E. Casey Foundation — Program Associate","University of Baltimore — Adjunct Professor"]},
          {label:"Education",items:["MPA — Morgan State University","MS Strategic Communications — Arkansas State","Doctoral Studies — In Progress"]},
          {label:"Skills",items:user?.skills||["Leadership","Policy Analysis","Grant Writing","Public Speaking","Community Engagement"]},
        ].map(sec=>(
          <Card key={sec.label} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <h4 style={{color:"#4A9FD4",fontWeight:700,fontSize:12,margin:0,letterSpacing:.5}}>{sec.label.toUpperCase()}</h4>
              <span style={{color:"#8A9ABB",fontSize:12,cursor:"pointer"}}>Edit</span>
            </div>
            {sec.label==="Skills"?(
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {sec.items.map(it=><Pill key={it} label={it}/>)}
              </div>
            ):(
              sec.items.map(it=>(
                <div key={it} style={{color:"#C8D4E8",fontSize:13,padding:"7px 0",borderBottom:"1px solid #1E2D4A"}}>{it}</div>
              ))
            )}
          </Card>
        ))}

        {/* Documents card */}
        <Card style={{marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h4 style={{color:"#4A9FD4",fontWeight:700,fontSize:12,margin:0,letterSpacing:.5}}>MY DOCUMENTS</h4>
            <span onClick={()=>go("documents")} style={{color:"#D4A820",fontSize:12,cursor:"pointer"}}>View all ›</span>
          </div>
          {documents.length > 0 ? (
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:12}}>
              {documents.slice(0,2).map(doc=>(
                <div key={doc.id} style={{display:"flex",alignItems:"center",gap:10,
                  padding:"8px 0",borderBottom:"1px solid #1E2D4A"}}>
                  <span style={{fontSize:18}}>{doc.type==="resume"?"📄":doc.type==="cover"?"✉️":"📎"}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{color:"#C8D4E8",fontSize:13,whiteSpace:"nowrap",
                      overflow:"hidden",textOverflow:"ellipsis"}}>{doc.name}</div>
                    <div style={{color:"#8A9ABB",fontSize:11,marginTop:1}}>{doc.size} · {doc.uploadedAt}</div>
                  </div>
                  {doc.parsed&&<span style={{color:"#10B981",fontSize:12}}>✓</span>}
                </div>
              ))}
            </div>
          ) : (
            <p style={{color:"#8A9ABB",fontSize:13,margin:"0 0 12px"}}>
              Upload your resume to boost your profile score and improve job matches.
            </p>
          )}
          <DocUpload compact docType="resume" onDone={()=>{}}/>
        </Card>

        <div style={{display:"flex",gap:10,marginTop:8}}>
          <Btn variant="ghost" style={{flex:1}} onClick={()=>go("tracker")}>View Applications</Btn>
          <Btn variant="outline" style={{flex:1,color:"#EF4444",borderColor:"#EF444444"}}
            onClick={()=>go("landing")}>Sign Out</Btn>
        </div>
      </div>
    </div>
  );
}

function Upgrade() {
  const {go,tier,setTier}=useContext(AppCtx);
  const [sel,setSel]=useState(tier==="free"?"premium":tier);
  const tiers=[
    {id:"free",label:"Free",price:"$0",period:"forever",color:"#8A9ABB",icon:"🔓",
      features:["10 job matches / week","5 AI applications / month","3 Academy modules","Basic application tracker","Community access"]},
    {id:"premium",label:"Premium",price:"$19",period:"/ month",color:"#D4A820",icon:"⭐",highlight:true,
      features:["Unlimited matches & applies","Full Career Skills Academy (8 modules)","AI Interview Prep Coach","Salary negotiation tools & data","LinkedIn profile optimizer","Full analytics dashboard","Priority job matching","Resume version library"]},
    {id:"elite",label:"Elite",price:"$39",period:"/ month",color:"#8B5CF6",icon:"👑",
      features:["Everything in Premium","Employer-featured candidate status","Bulk apply with one tap","Video interview prep sessions","Offer comparison tool","Trade & vocational counseling","White-glove onboarding","Elite badge on profile"]},
  ];
  const handleSelect=()=>{if(sel!=="free")setTier(sel);go("profile");};
  return (
    <div style={{background:"#090C14",minHeight:"100dvh",paddingBottom:100}}>
      <TopBar title="Choose Your Plan" back="profile"/>
      <div style={{padding:"8px 18px 0"}}>
        <p style={{color:"#8A9ABB",fontSize:14,margin:"0 0 18px",textAlign:"center"}}>Upgrade anytime. Cancel anytime.</p>
        {tiers.map(t=>(
          <div key={t.id} onClick={()=>setSel(t.id)}
            style={{border:`2px solid ${sel===t.id?t.color:"#1E2D4A"}`,borderRadius:16,
              padding:"18px",marginBottom:12,cursor:"pointer",
              background:sel===t.id?t.color+"0D":"#111827",transition:"all .2s"}}>
            {t.highlight&&<div style={{color:t.color,fontWeight:700,fontSize:11,marginBottom:8,letterSpacing:1}}>★ MOST POPULAR</div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22}}>{t.icon}</span>
                <div>
                  <div style={{color:sel===t.id?t.color:"#fff",fontWeight:800,fontSize:18}}>{t.label}</div>
                  <div style={{color:"#8A9ABB",fontSize:12}}>Plan</div>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <span style={{color:sel===t.id?t.color:"#fff",fontWeight:900,fontSize:24}}>{t.price}</span>
                <span style={{color:"#8A9ABB",fontSize:12}}>{t.period}</span>
              </div>
            </div>
            {t.features.map(f=>(
              <div key={f} style={{display:"flex",gap:8,alignItems:"center",padding:"4px 0",color:"#C8D4E8",fontSize:13}}>
                <span style={{color:t.color}}>✓</span>{f}
              </div>
            ))}
          </div>
        ))}
        <p style={{color:"#8A9ABB",fontSize:11,textAlign:"center",margin:"4px 0 0"}}>
          Students: your institution may provide Premium access at no cost.
        </p>
      </div>
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"min(430px,100vw)",background:"#090C14",borderTop:"1px solid #1E2D4A",
        padding:"14px 18px 28px"}}>
        <Btn full style={{fontSize:16,padding:"15px",
          background:sel==="free"?"#8A9ABB":sel==="premium"?"#D4A820":"#8B5CF6",
          color:sel==="free"?"#fff":"#090C14"}} onClick={handleSelect}>
          {sel==="free"?"Stay on Free Plan":sel==="premium"?"Start Premium — $19/mo":"Start Elite — $39/mo"}
        </Btn>
      </div>
    </div>
  );
}

// ─── Document Upload Component ────────────────────────────────
function DocUpload({ onDone, compact, docType = "resume" }) {
  const { addDocument } = useContext(AppCtx);
  const inputRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | reading | parsing | done | error
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const ACCEPT = ".pdf,.doc,.docx,.txt";
  const MAX_MB = 5;

  const readFile = (file) => new Promise((res, rej) => {
    if (file.size > MAX_MB * 1024 * 1024) { rej(new Error(`File must be under ${MAX_MB}MB`)); return; }
    const reader = new FileReader();
    reader.onload = e => res(e.target.result);
    reader.onerror = () => rej(new Error("Could not read file"));
    if (file.name.endsWith(".txt")) reader.readAsText(file);
    else reader.readAsDataURL(file);
  });

  const parseWithAI = async (file, fileData) => {
    const isPDF = file.name.toLowerCase().endsWith(".pdf");
    const isTXT = file.name.toLowerCase().endsWith(".txt");

    let messages;
    const prompt = `Parse this resume/document and return ONLY a JSON object with these exact keys:
{
  "name": "full name or empty string",
  "title": "current or most recent job title",
  "summary": "2-sentence professional summary",
  "experience": ["Job Title — Org (dates)", "...up to 4 entries"],
  "education": ["Degree — School", "...up to 3 entries"],
  "skills": ["skill1", "skill2", "...up to 8 skills"],
  "location": "city, state or empty string"
}
Return only valid JSON, no markdown, no explanation.`;

    if (isPDF) {
      const base64 = fileData.split(",")[1];
      messages = [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
          { type: "text", text: prompt }
        ]
      }];
    } else {
      const text = isTXT ? fileData : `[Document: ${file.name}]\n${fileData}`;
      messages = [{ role: "user", content: `${prompt}\n\nDocument content:\n${text.slice(0, 4000)}` }];
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 800, messages })
    });
    const d = await res.json();
    const raw = d.content?.[0]?.text || "{}";
    try {
      return JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      return null;
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf","doc","docx","txt"].includes(ext)) {
      setStatus("error"); return;
    }
    setFileName(file.name);
    setStatus("reading");
    try {
      const fileData = await readFile(file);
      setStatus("parsing");
      const parsed = await parseWithAI(file, fileData);
      const doc = {
        id: Date.now(),
        name: file.name,
        size: (file.size / 1024).toFixed(0) + " KB",
        type: docType,
        uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        parsed,
      };
      addDocument(doc);
      setResult(parsed);
      setStatus("done");
      setTimeout(() => { if (onDone) onDone(parsed); }, compact ? 1200 : 0);
    } catch (e) {
      setStatus("error");
    }
  };

  const onInputChange = (e) => handleFile(e.target.files?.[0]);
  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  if (status === "done" && result) {
    return (
      <div style={{ background: "#10B98122", border: "1px solid #10B98144", borderRadius: 14, padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 22 }}>✅</span>
          <div>
            <div style={{ color: "#10B981", fontWeight: 700, fontSize: 14 }}>Document parsed successfully</div>
            <div style={{ color: "#8A9ABB", fontSize: 12 }}>{fileName}</div>
          </div>
        </div>
        {result.name && <div style={{ color: "#C8D4E8", fontSize: 13, marginBottom: 6 }}>👤 <b style={{ color: "#fff" }}>{result.name}</b> — {result.title}</div>}
        {result.skills?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {result.skills.slice(0,6).map(s => <Pill key={s} label={s} color="#10B981"/>)}
          </div>
        )}
        {!compact && <div style={{ color: "#8A9ABB", fontSize: 12, marginTop: 10 }}>Profile updated with your resume data ›</div>}
      </div>
    );
  }

  if (status === "reading" || status === "parsing") {
    return (
      <div style={{ background: "#111827", border: "1px solid #D4A82044", borderRadius: 14,
        padding: "20px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 10, animation: "spin 1.5s linear infinite", display: "inline-block" }}>
          {status === "reading" ? "📄" : "🤖"}
        </div>
        <div style={{ color: "#D4A820", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
          {status === "reading" ? "Reading document…" : "AI parsing your resume…"}
        </div>
        <div style={{ color: "#8A9ABB", fontSize: 12 }}>
          {status === "parsing" ? "Extracting skills, experience, and education" : ""}
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${status === "error" ? "#EF4444" : dragOver ? "#D4A820" : "#1E2D4A"}`,
        borderRadius: 14, padding: compact ? "16px" : "28px 20px",
        textAlign: "center", cursor: "pointer", transition: "all .2s",
        background: dragOver ? "#D4A82008" : "#111827",
      }}>
      <input ref={inputRef} type="file" accept={ACCEPT} onChange={onInputChange}
        style={{ display: "none" }}/>
      <div style={{ fontSize: compact ? 28 : 36, marginBottom: 8 }}>📎</div>
      {status === "error" ? (
        <div style={{ color: "#EF4444", fontSize: 13 }}>Unsupported file type. Use PDF, DOC, DOCX, or TXT.</div>
      ) : (
        <>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: compact ? 14 : 16, marginBottom: 4 }}>
            {compact ? "Upload Document" : "Upload Your Resume"}
          </div>
          <div style={{ color: "#8A9ABB", fontSize: 12, lineHeight: 1.5 }}>
            {compact ? "PDF, DOC, DOCX, TXT · Max 5MB" : "Drag & drop or tap to browse\nPDF, DOC, DOCX, TXT · Max 5MB"}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Documents Screen ─────────────────────────────────────────
function Documents() {
  const { go, documents, addDocument, parsedResume } = useContext(AppCtx);
  const [showUpload, setShowUpload] = useState(documents.length === 0);
  const [activeTab, setActiveTab] = useState("resume");

  const docTypes = [
    { id: "resume", label: "Resume", icon: "📄" },
    { id: "cover", label: "Cover Letter", icon: "✉️" },
    { id: "other", label: "Other", icon: "📎" },
  ];

  const filtered = documents.filter(d => d.type === activeTab);

  return (
    <div style={{ background: "#090C14", minHeight: "100dvh", paddingBottom: 80 }}>
      <TopBar title="My Documents" back="profile"
        right={
          <button onClick={() => setShowUpload(s => !s)}
            style={{ background: "none", border: "none", color: "#D4A820",
              fontSize: 22, cursor: "pointer", lineHeight: 1 }}>+</button>
        }
      />
      <div style={{ padding: "0 18px" }}>

        {/* Upload zone */}
        {showUpload && (
          <div style={{ marginTop: 14, marginBottom: 4 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {docTypes.map(t => (
                <Tag key={t.id} label={`${t.icon} ${t.label}`} active={activeTab === t.id}
                  onClick={() => setActiveTab(t.id)}/>
              ))}
            </div>
            <DocUpload docType={activeTab} onDone={() => setShowUpload(false)}/>
          </div>
        )}

        {/* Parsed resume card */}
        {parsedResume && !showUpload && (
          <Card style={{ marginTop: 14, border: "1px solid #D4A82044", background: "#D4A82008" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ color: "#D4A820", fontWeight: 700, fontSize: 14 }}>⚡ AI Resume Summary</div>
              <Pill label="Latest" color="#D4A820"/>
            </div>
            {parsedResume.name && (
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{parsedResume.name}</div>
            )}
            {parsedResume.title && (
              <div style={{ color: "#C8D4E8", fontSize: 14, marginBottom: 8 }}>{parsedResume.title}</div>
            )}
            {parsedResume.summary && (
              <p style={{ color: "#8A9ABB", fontSize: 13, lineHeight: 1.6, margin: "0 0 12px" }}>{parsedResume.summary}</p>
            )}
            {parsedResume.experience?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: "#4A9FD4", fontWeight: 700, fontSize: 11, marginBottom: 6, letterSpacing: .5 }}>EXPERIENCE</div>
                {parsedResume.experience.map((e, i) => (
                  <div key={i} style={{ color: "#C8D4E8", fontSize: 13, padding: "4px 0",
                    borderBottom: "1px solid #1E2D4A" }}>{e}</div>
                ))}
              </div>
            )}
            {parsedResume.skills?.length > 0 && (
              <div>
                <div style={{ color: "#4A9FD4", fontWeight: 700, fontSize: 11, marginBottom: 8, letterSpacing: .5 }}>EXTRACTED SKILLS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {parsedResume.skills.map(s => <Pill key={s} label={s} color="#10B981"/>)}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Doc type tabs */}
        {!showUpload && (
          <>
            <div style={{ display: "flex", marginTop: 16, marginBottom: 12 }}>
              {docTypes.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  style={{ flex: 1, background: "none", border: "none",
                    borderBottom: `2px solid ${activeTab === t.id ? "#D4A820" : "#1E2D4A"}`,
                    color: activeTab === t.id ? "#D4A820" : "#8A9ABB",
                    padding: "10px 4px", fontFamily: "inherit",
                    fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#8A9ABB" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>
                  {docTypes.find(t => t.id === activeTab)?.icon}
                </div>
                <div style={{ fontWeight: 600, color: "#C8D4E8", marginBottom: 8 }}>
                  No {docTypes.find(t => t.id === activeTab)?.label.toLowerCase()} uploaded
                </div>
                <Btn variant="sm" onClick={() => setShowUpload(true)}>Upload Now</Btn>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filtered.map(doc => (
                  <Card key={doc.id}>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: "#1A2235",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                        {docTypes.find(t => t.id === doc.type)?.icon || "📎"}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: 14,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {doc.name}
                        </div>
                        <div style={{ color: "#8A9ABB", fontSize: 12, marginTop: 2 }}>
                          {doc.size} · Uploaded {doc.uploadedAt}
                        </div>
                      </div>
                      {doc.parsed && <Pill label="✓ Parsed" color="#10B981"/>}
                    </div>
                    {doc.parsed?.summary && (
                      <p style={{ color: "#8A9ABB", fontSize: 12, margin: "10px 0 0",
                        lineHeight: 1.5, borderTop: "1px solid #1E2D4A", paddingTop: 10 }}>
                        {doc.parsed.summary}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {!showUpload && (
          <Btn variant="ghost" full style={{ marginTop: 16 }} onClick={() => setShowUpload(true)}>
            + Upload Another Document
          </Btn>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );
}

// ─── Splash / Loading Screen ──────────────────────────────────
function Splash() {
  const {go} = useContext(AppCtx);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const phases = ["Initializing AI engine…","Loading job matches…","Ready."];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 40) setPhase(1);
    if (progress >= 80) setPhase(2);
    if (progress >= 100) setTimeout(() => go("landing"), 400);
  }, [progress]);

  return (
    <div style={{
      minHeight: "100dvh", background: "#090C14",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "0 40px",
    }}>
      {/* Animated logo */}
      <div style={{
        width: 90, height: 90, borderRadius: 24,
        background: `linear-gradient(135deg, #1A5FA0, #0D1A36)`,
        border: `2px solid #D4A82044`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 44, marginBottom: 28,
        boxShadow: `0 0 40px #D4A82033`,
        animation: "pulse 2s ease-in-out infinite",
      }}>💼</div>

      <div style={{ marginBottom: 8 }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>Career</span>
        <span style={{ fontSize: 32, fontWeight: 900, color: "#D4A820" }}> AI</span>
      </div>
      <p style={{ color: "#8A9ABB", fontSize: 14, margin: "0 0 48px", letterSpacing: 1 }}>
        FIND IT. APPLY. GROW.
      </p>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: 280 }}>
        <div style={{ height: 3, background: "#1E2D4A", borderRadius: 99, overflow: "hidden", marginBottom: 14 }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: "linear-gradient(90deg, #1A5FA0, #D4A820)",
            width: `${progress}%`, transition: "width .04s linear",
          }}/>
        </div>
        <p style={{ color: "#8A9ABB", fontSize: 12, textAlign: "center", margin: 0,
          transition: "opacity .3s", opacity: progress < 100 ? 1 : 0 }}>
          {phases[phase]}
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 30px #D4A82033; transform: scale(1); }
          50% { box-shadow: 0 0 60px #D4A82055; transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
}

// ─── Profile Setup (new users after onboarding) ───────────────
function ProfileSetup() {
  const { go, user, setUser, profilePhoto, setProfilePhoto,
          profileBio, setProfileBio, profileCareer, setProfileCareer,
          documents, addDocument } = useContext(AppCtx);
  const photoRef = useRef(null);
  const [bio, setBio] = useState(profileBio || "");
  const [career, setCareer] = useState(profileCareer);
  const [skills, setSkills] = useState(user?.skills || []);
  const [step, setStep] = useState(0); // 0=photo+bio, 1=career, 2=skills, 3=resume
  const [photoPreview, setPhotoPreview] = useState(profilePhoto);
  const ALL_SKILLS = ["Communication","Leadership","Project Management","Data Analysis",
    "Writing","Marketing","Tech / IT","Customer Service","Finance","Education",
    "Policy","Community Organizing","Grant Writing","Public Speaking","Research",
    "Nonprofit Management","Fundraising","Strategic Planning","Social Media","Coaching"];

  const toggle = (s) => setSkills(prev =>
    prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 8 ? [...prev, s] : prev
  );

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const save = () => {
    setProfileBio(bio);
    setProfileCareer(career);
    setUser(u => ({ ...u, skills, bio, career }));
    if (photoPreview) setProfilePhoto(photoPreview);
    go("dashboard");
  };

  const steps = [
    // Step 0 — Photo + Bio
    <div key={0}>
      <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, margin:"0 0 6px" }}>
        Set up your profile
      </h2>
      <p style={{ color:"#8A9ABB", fontSize:14, margin:"0 0 28px" }}>
        This is what employers and partners see. Make it count.
      </p>

      {/* Photo upload */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:24 }}>
        <div style={{ position:"relative", marginBottom:12 }}>
          <div onClick={() => photoRef.current?.click()}
            style={{ width:100, height:100, borderRadius:99,
              background: photoPreview ? "transparent" : "#1A5FA0",
              border:`3px solid ${photoPreview ? "#D4A820" : "#1E2D4A"}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:42, cursor:"pointer", overflow:"hidden",
              position:"relative" }}>
            {photoPreview
              ? <img src={photoPreview} alt="profile" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
              : <span>👤</span>}
            <div style={{ position:"absolute", bottom:0, left:0, right:0,
              background:"#00000088", padding:"5px 0", textAlign:"center",
              fontSize:11, color:"#fff", fontWeight:600 }}>EDIT</div>
          </div>
          <div onClick={() => photoRef.current?.click()}
            style={{ position:"absolute", bottom:2, right:2, width:28, height:28,
              background:"#D4A820", borderRadius:99, display:"flex",
              alignItems:"center", justifyContent:"center", fontSize:14,
              cursor:"pointer", border:`2px solid #090C14` }}>📷</div>
        </div>
        <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }}/>
        <p style={{ color:"#8A9ABB", fontSize:12, margin:0 }}>Tap to upload a profile photo</p>
      </div>

      {/* Display name */}
      <label style={{ color:"#4A9FD4", fontSize:12, fontWeight:700, letterSpacing:.5, display:"block", marginBottom:6 }}>
        DISPLAY NAME
      </label>
      <input
        value={user?.name || ""}
        onChange={e => setUser(u => ({ ...u, name: e.target.value }))}
        placeholder="Your full name"
        style={{ width:"100%", background:"#111827", border:"1px solid #1E2D4A",
          borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:15,
          fontFamily:"inherit", outline:"none", marginBottom:16, boxSizing:"border-box" }}/>

      {/* Bio */}
      <label style={{ color:"#4A9FD4", fontSize:12, fontWeight:700, letterSpacing:.5, display:"block", marginBottom:6 }}>
        BIO
      </label>
      <textarea
        value={bio} onChange={e => setBio(e.target.value)}
        placeholder="Write a short professional bio — who you are, what you do, what drives you. (2–3 sentences)"
        rows={4}
        style={{ width:"100%", background:"#111827", border:"1px solid #1E2D4A",
          borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14,
          fontFamily:"inherit", outline:"none", resize:"none", lineHeight:1.6,
          boxSizing:"border-box" }}/>
      <p style={{ color:"#8A9ABB", fontSize:11, margin:"6px 0 0", textAlign:"right" }}>
        {bio.length}/300
      </p>
    </div>,

    // Step 1 — Career info
    <div key={1}>
      <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, margin:"0 0 6px" }}>Your career details</h2>
      <p style={{ color:"#8A9ABB", fontSize:14, margin:"0 0 24px" }}>
        This powers your job matches. The more specific, the better.
      </p>
      {[
        { label:"CURRENT OR MOST RECENT ROLE", key:"currentRole", placeholder:"e.g. Deputy Director, NAMI Maryland" },
        { label:"TARGET ROLE", key:"targetRole", placeholder:"e.g. Executive Director, VP of Programs" },
        { label:"LOCATION", key:"location", placeholder:"e.g. Baltimore, MD (or Remote)" },
      ].map(f => (
        <div key={f.key} style={{ marginBottom:16 }}>
          <label style={{ color:"#4A9FD4", fontSize:12, fontWeight:700, letterSpacing:.5, display:"block", marginBottom:6 }}>
            {f.label}
          </label>
          <input value={career[f.key]} onChange={e => setCareer(c => ({ ...c, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            style={{ width:"100%", background:"#111827", border:"1px solid #1E2D4A",
              borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14,
              fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
        </div>
      ))}
      <label style={{ color:"#4A9FD4", fontSize:12, fontWeight:700, letterSpacing:.5, display:"block", marginBottom:8 }}>
        YEARS OF EXPERIENCE
      </label>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {["0–2 years","3–5 years","6–10 years","10–15 years","15+ years"].map(y => (
          <Tag key={y} label={y} active={career.experience===y}
            onClick={() => setCareer(c => ({ ...c, experience: y }))}/>
        ))}
      </div>
    </div>,

    // Step 2 — Skills
    <div key={2}>
      <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, margin:"0 0 6px" }}>Your skills</h2>
      <p style={{ color:"#8A9ABB", fontSize:14, margin:"0 0 20px" }}>Pick up to 8. These appear on your profile.</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
        {ALL_SKILLS.map(s => (
          <Tag key={s} label={s} active={skills.includes(s)}
            onClick={() => toggle(s)}/>
        ))}
      </div>
      <p style={{ color:"#8A9ABB", fontSize:12, margin:"16px 0 0", textAlign:"right" }}>
        {skills.length}/8 selected
      </p>
    </div>,

    // Step 3 — Resume (optional)
    <div key={3}>
      <h2 style={{ color:"#fff", fontSize:24, fontWeight:800, margin:"0 0 6px" }}>
        Add your resume
      </h2>
      <p style={{ color:"#8A9ABB", fontSize:14, margin:"0 0 6px" }}>
        Optional — you can do this anytime.
      </p>
      <p style={{ color:"#D4A820", fontSize:13, margin:"0 0 24px" }}>
        Uploading a resume lets Career AI tailor every application automatically.
      </p>

      <DocUpload compact docType="resume" onDone={() => {}}/>

      <div style={{ margin:"20px 0 12px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ flex:1, height:1, background:"#1E2D4A" }}/>
        <span style={{ color:"#8A9ABB", fontSize:12 }}>don't have one?</span>
        <div style={{ flex:1, height:1, background:"#1E2D4A" }}/>
      </div>

      <Btn variant="ghost" full onClick={() => go("resume-builder")}>
        Build My Resume in the App →
      </Btn>

      <p style={{ color:"#8A9ABB", fontSize:12, textAlign:"center", marginTop:20 }}>
        You can upload or build your resume anytime from your Profile.
      </p>
    </div>,
  ];

  return (
    <div style={{ minHeight:"100dvh", background:"#090C14", paddingBottom:120 }}>
      <div style={{ padding:"20px 18px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#1A5FA0",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>💼</div>
          <span style={{ fontSize:18, fontWeight:900 }}>
            <span style={{ color:"#fff" }}>Career</span><span style={{ color:"#D4A820" }}> AI</span>
          </span>
        </div>
        <button onClick={save}
          style={{ background:"none", border:"none", color:"#8A9ABB",
            fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
          Skip setup ›
        </button>
      </div>

      <Progress steps={4} current={step+1}/>

      <div style={{ padding:"0 18px" }}>
        {steps[step]}
      </div>

      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"min(430px,100vw)", background:"#090C14", borderTop:"1px solid #1E2D4A",
        padding:"14px 18px 28px", display:"flex", gap:10 }}>
        {step > 0 && (
          <Btn variant="outline" style={{ flex:1 }} onClick={() => setStep(s => s-1)}>← Back</Btn>
        )}
        {step < 3 ? (
          <Btn style={{ flex:2 }} onClick={() => setStep(s => s+1)}>Continue →</Btn>
        ) : (
          <Btn style={{ flex:2 }} onClick={save}>Enter Career AI ⚡</Btn>
        )}
      </div>
    </div>
  );
}

// ─── Resume Builder (for users who don't have one) ────────────
function ResumeBuilder() {
  const { go, user, addDocument } = useContext(AppCtx);
  const [form, setForm] = useState({
    name: user?.name || "",
    title: user?.career?.currentRole || "",
    location: "",
    email: "",
    summary: "",
    experience: [{ role:"", org:"", dates:"", bullets:"" }],
    education: [{ degree:"", school:"", year:"" }],
    skills: user?.skills?.join(", ") || "",
  });
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setExp = (i, key, val) => setForm(f => ({
    ...f, experience: f.experience.map((e,idx) => idx===i ? {...e,[key]:val} : e)
  }));
  const setEdu = (i, key, val) => setForm(f => ({
    ...f, education: f.education.map((e,idx) => idx===i ? {...e,[key]:val} : e)
  }));

  const generateBullets = async (idx) => {
    const exp = form.experience[idx];
    if (!exp.role || !exp.org) return;
    setGenerating(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:300,
          messages:[{ role:"user", content:`Write 3 strong ATS-optimized resume bullet points for someone who was a "${exp.role}" at "${exp.org}". Use Action → Impact → Scale format. Each bullet under 20 words. Separate with newlines. No dashes or numbers.` }]
        })
      });
      const d = await res.json();
      const bullets = d.content?.[0]?.text || "";
      setExp(idx, "bullets", bullets);
    } catch {}
    setGenerating(false);
  };

  const build = () => {
    const parsed = {
      name: form.name,
      title: form.title,
      summary: form.summary,
      experience: form.experience.map(e => `${e.role} — ${e.org} ${e.dates ? `(${e.dates})` : ""}`).filter(e => e.length > 5),
      education: form.education.map(e => `${e.degree} — ${e.school}`).filter(e => e.length > 5),
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
      location: form.location,
    };
    addDocument({
      id: Date.now(), name: `${form.name || "My"}_Resume.pdf`,
      size: "—", type: "resume",
      uploadedAt: new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),
      parsed,
    });
    setDone(true);
  };

  if (done) return (
    <div style={{ minHeight:"100dvh", background:"#090C14", display:"flex",
      flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 24px" }}>
      <div style={{ fontSize:52, marginBottom:16 }}>🎉</div>
      <h2 style={{ color:"#fff", fontWeight:800, fontSize:22, margin:"0 0 8px", textAlign:"center" }}>
        Resume built!
      </h2>
      <p style={{ color:"#8A9ABB", fontSize:14, textAlign:"center", margin:"0 0 32px", lineHeight:1.6 }}>
        Your resume is saved and Career AI will use it to personalize every application.
      </p>
      <Btn full onClick={() => go("profile-setup")}>Back to Profile Setup</Btn>
      <Btn variant="ghost" full style={{ marginTop:10 }} onClick={() => go("dashboard")}>
        Go to Dashboard
      </Btn>
    </div>
  );

  return (
    <div style={{ background:"#090C14", minHeight:"100dvh", paddingBottom:120 }}>
      <TopBar title="Build My Resume" onBack={() => go("profile-setup")}/>
      <div style={{ padding:"0 18px" }}>

        <div style={{ background:"#D4A82011", border:"1px solid #D4A82044", borderRadius:12,
          padding:"12px 14px", marginTop:14, marginBottom:20 }}>
          <p style={{ color:"#D4A820", fontSize:13, margin:0, lineHeight:1.5 }}>
            ⚡ Fill in what you know — AI will help write your bullet points.
          </p>
        </div>

        {/* Basic info */}
        <div style={{ color:"#4A9FD4", fontWeight:700, fontSize:12, letterSpacing:.5, marginBottom:10 }}>
          BASIC INFO
        </div>
        {[
          { label:"Full Name", key:"name", placeholder:"James Hollywood" },
          { label:"Professional Title", key:"title", placeholder:"Deputy Director / Nonprofit Leader" },
          { label:"Location", key:"location", placeholder:"Baltimore, MD" },
          { label:"Email", key:"email", placeholder:"your@email.com" },
        ].map(f => (
          <input key={f.key} value={form[f.key]} onChange={e => set(f.key, e.target.value)}
            placeholder={f.placeholder}
            style={{ width:"100%", background:"#111827", border:"1px solid #1E2D4A",
              borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14,
              fontFamily:"inherit", outline:"none", marginBottom:10, boxSizing:"border-box" }}/>
        ))}

        {/* Summary */}
        <div style={{ color:"#4A9FD4", fontWeight:700, fontSize:12, letterSpacing:.5, margin:"16px 0 8px" }}>
          PROFESSIONAL SUMMARY
        </div>
        <textarea value={form.summary} onChange={e => set("summary", e.target.value)} rows={3}
          placeholder="Dynamic leader with 15+ years of experience in nonprofit management, policy, and community development…"
          style={{ width:"100%", background:"#111827", border:"1px solid #1E2D4A",
            borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14,
            fontFamily:"inherit", outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.6 }}/>

        {/* Experience */}
        <div style={{ color:"#4A9FD4", fontWeight:700, fontSize:12, letterSpacing:.5, margin:"20px 0 10px",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          WORK EXPERIENCE
          <button onClick={() => setForm(f => ({ ...f, experience: [...f.experience, {role:"",org:"",dates:"",bullets:""}]}))}
            style={{ background:"none", border:"none", color:"#D4A820", cursor:"pointer", fontSize:20, lineHeight:1 }}>+</button>
        </div>
        {form.experience.map((exp, i) => (
          <Card key={i} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", gap:8, flexDirection:"column" }}>
              {[
                { placeholder:"Job Title", key:"role" },
                { placeholder:"Organization / Company", key:"org" },
                { placeholder:"Dates (e.g. 2019–2023)", key:"dates" },
              ].map(f => (
                <input key={f.key} value={exp[f.key]} onChange={e => setExp(i, f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width:"100%", background:"#1A2235", border:"1px solid #1E2D4A",
                    borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:13,
                    fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
              ))}
              <textarea value={exp.bullets} onChange={e => setExp(i, "bullets", e.target.value)} rows={3}
                placeholder="Key responsibilities and achievements…"
                style={{ width:"100%", background:"#1A2235", border:"1px solid #1E2D4A",
                  borderRadius:10, padding:"11px 14px", color:"#fff", fontSize:13,
                  fontFamily:"inherit", outline:"none", resize:"none", boxSizing:"border-box", lineHeight:1.6 }}/>
              <Btn variant="smBlue" disabled={generating || !exp.role}
                onClick={() => generateBullets(i)} style={{ width:"100%" }}>
                {generating ? "Generating…" : "⚡ AI Write My Bullets"}
              </Btn>
            </div>
          </Card>
        ))}

        {/* Education */}
        <div style={{ color:"#4A9FD4", fontWeight:700, fontSize:12, letterSpacing:.5, margin:"20px 0 10px",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          EDUCATION
          <button onClick={() => setForm(f => ({ ...f, education: [...f.education, {degree:"",school:"",year:""}]}))}
            style={{ background:"none", border:"none", color:"#D4A820", cursor:"pointer", fontSize:20, lineHeight:1 }}>+</button>
        </div>
        {form.education.map((edu, i) => (
          <div key={i} style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:10 }}>
            {[
              { placeholder:"Degree / Certification", key:"degree" },
              { placeholder:"School / Institution", key:"school" },
              { placeholder:"Year", key:"year" },
            ].map(f => (
              <input key={f.key} value={edu[f.key]} onChange={e => setEdu(i, f.key, e.target.value)}
                placeholder={f.placeholder}
                style={{ width:"100%", background:"#111827", border:"1px solid #1E2D4A",
                  borderRadius:12, padding:"12px 16px", color:"#fff", fontSize:14,
                  fontFamily:"inherit", outline:"none", boxSizing:"border-box" }}/>
            ))}
          </div>
        ))}

        {/* Skills */}
        <div style={{ color:"#4A9FD4", fontWeight:700, fontSize:12, letterSpacing:.5, margin:"20px 0 8px" }}>
          SKILLS (comma-separated)
        </div>
        <input value={form.skills} onChange={e => set("skills", e.target.value)}
          placeholder="Leadership, Grant Writing, Policy Analysis, Public Speaking…"
          style={{ width:"100%", background:"#111827", border:"1px solid #1E2D4A",
            borderRadius:12, padding:"13px 16px", color:"#fff", fontSize:14,
            fontFamily:"inherit", outline:"none", marginBottom:4, boxSizing:"border-box" }}/>
      </div>

      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"min(430px,100vw)", background:"#090C14", borderTop:"1px solid #1E2D4A",
        padding:"14px 18px 28px" }}>
        <Btn full onClick={build}>Save Resume →</Btn>
      </div>
    </div>
  );
}

function Router() {
  const {screen}=useContext(AppCtx);
  const parts=screen.split(":");
  const route=parts[0];
  const p1=parts[1]?parseInt(parts[1]):null;
  const p2=parts[2]?parseInt(parts[2]):null;
  const screens={
    splash:<Splash/>,
    landing:<Landing/>, signup:<SignUp/>, signin:<SignIn/>, onboard:<Onboard/>,
    "profile-setup":<ProfileSetup/>, "resume-builder":<ResumeBuilder/>,
    dashboard:<Dashboard/>, jobs:<Jobs/>, jobdetail:<JobDetail jobId={p1||1}/>,
    apply:<ApplyFlow/>, tracker:<Tracker/>, academy:<Academy/>,
    lesson:<LessonView modId={p1||3} lessonIdx={p2||0}/>,
    coach:<InterviewCoach jobId={p1||1}/>, saved:<SavedJobs/>,
    notifications:<Notifications/>, profile:<Profile/>, upgrade:<Upgrade/>,
    documents:<Documents/>,
  };
  return (
    <div style={{background:"#060810",minHeight:"100dvh",display:"flex",justifyContent:"center"}}>
      <div style={{width:"min(430px,100vw)",background:"#090C14",minHeight:"100dvh",position:"relative",overflowX:"hidden"}}>
        {screens[route]||<Landing/>}
        <BottomNav/>
      </div>
    </div>
  );
}

export default function CareerAIApp() {
  return <AppProvider><Router/></AppProvider>;
}


"use client";
import {useEffect,useMemo,useState} from "react";

type Status="Pending"|"Confirmed"|"Checked in"|"Checked out"|"Cancelled";
type Reservation={id:number;guest:string;email:string;phone:string;room:string;type:string;checkIn:string;checkOut:string;status:Status;amount:number;paid:number;method:string};
type RoomStatus="Clean"|"Dirty"|"Occupied"|"Reserved"|"Maintenance";
type Room={number:string;type:string;status:RoomStatus;guest:string;rate:number;image:string};

const roomImages=[
"https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
"https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
"https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
"https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80",
"https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80"
];
const hotelImages=[
"https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
"https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80",
"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
];

const seedRooms:Room[]=[
["101","Deluxe","Occupied","Açelya Işık",140],["102","Deluxe","Clean","",140],["103","Suite","Dirty","",210],["104","Standard","Clean","",100],
["201","Standard","Occupied","Sony Entertainment",100],["202","Deluxe","Clean","",140],["203","Suite","Maintenance","",210],["204","Deluxe","Occupied","Sony Entertainment",140],
["301","Standard","Clean","",100],["302","Standard","Dirty","",100],["303","Deluxe","Clean","",140],["304","Suite","Clean","",210],
["305","Deluxe","Reserved","Marry TicketCoWorker",140],["401","Standard","Clean","",100],["402","Deluxe","Occupied","Khaled Hussein",140],["403","Suite","Clean","",210]
].map((x,i)=>({number:x[0] as string,type:x[1] as string,status:x[2] as RoomStatus,guest:x[3] as string,rate:x[4] as number,image:roomImages[i%roomImages.length]}));

const seedReservations:Reservation[]=[
{ id:1001,guest:"Açelya Işık",email:"acelya@example.com",phone:"+91 98765 12001",room:"101",type:"Deluxe",checkIn:"2026-09-22",checkOut:"2026-09-25",status:"Checked in",amount:420,paid:420,method:"Card"},
{ id:1002,guest:"Sony Entertainment",email:"sony@example.com",phone:"+91 98765 12002",room:"204",type:"Deluxe",checkIn:"2026-09-22",checkOut:"2026-09-24",status:"Confirmed",amount:280,paid:140,method:"Card"},
{ id:1003,guest:"Marry TicketCoWorker",email:"marry@example.com",phone:"+91 98765 12003",room:"305",type:"Deluxe",checkIn:"2026-09-23",checkOut:"2026-09-27",status:"Confirmed",amount:560,paid:0,method:"Pending"},
{ id:1004,guest:"Khaled Hussein",email:"khaled@example.com",phone:"+91 98765 12004",room:"402",type:"Deluxe",checkIn:"2026-09-21",checkOut:"2026-09-23",status:"Checked in",amount:260,paid:260,method:"Cash"},
{ id:1005,guest:"Maya Nasreen",email:"maya@example.com",phone:"+91 98765 12005",room:"108",type:"Deluxe",checkIn:"2026-09-24",checkOut:"2026-09-26",status:"Pending",amount:220,paid:0,method:"Pending"}
];

const nav=[["▦","Dashboard"],["▣","Reservations"],["♙","Customers"],["▤","Rooms"],["◈","Payments"],["▥","Reports"],["⚙","Settings"]] as const;

function money(n:number){return `₹${Math.round(n).toLocaleString("en-IN")}`}
function csv(rows:any[],name:string){
 const keys=Object.keys(rows[0]||{});
 const esc=(v:any)=>`"${String(v??"").replace(/"/g,'""')}"`;
 const body=[keys.map(esc).join(","),...rows.map(r=>keys.map(k=>esc(r[k])).join(","))].join("\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([body],{type:"text/csv;charset=utf-8"}));a.download=name;a.click();URL.revokeObjectURL(a.href);
}

export default function HotelApp(){
 const [logged,setLogged]=useState(false),[page,setPage]=useState("Dashboard");
 const [reservations,setReservations]=useState<Reservation[]>(seedReservations),[rooms,setRooms]=useState<Room[]>(seedRooms);
 const [query,setQuery]=useState(""),[showNew,setShowNew]=useState(false),[toast,setToast]=useState("");
 const [profile,setProfile]=useState({name:"GrandStay Hotel",phone:"+91 120 456 7800",currency:"INR"});
 useEffect(()=>{fetch("/api/auth/me").then(r=>setLogged(r.ok)).catch(()=>setLogged(false));try{
  const r=localStorage.getItem("grandstay_reservations"),rm=localStorage.getItem("grandstay_rooms"),p=localStorage.getItem("grandstay_profile");
  if(r)setReservations(JSON.parse(r));if(rm)setRooms(JSON.parse(rm));if(p)setProfile(JSON.parse(p));
 }catch{}},[]);
 useEffect(()=>{if(logged){localStorage.setItem("grandstay_reservations",JSON.stringify(reservations));localStorage.setItem("grandstay_rooms",JSON.stringify(rooms));}},[logged,reservations,rooms]);
 const notify=(m:string)=>{setToast(m);setTimeout(()=>setToast(""),2400)};
 const login=async(email:string,password:string)=>{try{const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});if(r.ok){setLogged(true);notify("Welcome to GrandStay");return true}}catch{}return false};
 if(!logged)return <Login onLogin={login}/>;
 const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return q?reservations.filter(r=>`${r.id} ${r.guest} ${r.email} ${r.room} ${r.status}`.toLowerCase().includes(q)):reservations},[reservations,query]);
 const updateStatus=(id:number,status:Status)=>{setReservations(rs=>rs.map(r=>r.id===id?{...r,status}:r));notify(`Reservation #${id} marked ${status}`)};
 const saveReservation=(r:Reservation)=>{setReservations(rs=>[r,...rs]);setRooms(rs=>rs.map(x=>x.number===r.room?{...x,status:"Reserved",guest:r.guest}:x));setShowNew(false);notify(`Reservation #${r.id} created`)}
 const changeRoom=(num:string,status:RoomStatus)=>{setRooms(rs=>rs.map(r=>r.number===num?{...r,status}:r));notify(`Room ${num} updated`)};
 const pay=(id:number,amount:number,method:string)=>{setReservations(rs=>rs.map(r=>r.id===id?{...r,paid:Math.min(r.amount,r.paid+amount),method}:r));notify(`Payment of ${money(amount)} recorded`)};
 const logout=async()=>{try{await fetch("/api/auth/logout",{method:"POST"})}catch{}localStorage.removeItem("grandstay_logged");setLogged(false)};
 return <div className="shell">
  <aside className="sidebar"><div className="brand"><div className="brandmark">G</div><div>GrandStay<small>HOTEL MANAGEMENT</small></div></div>
   <nav className="nav">{nav.map(([icon,name])=><button key={name} className={page===name?"active":""} onClick={()=>setPage(name)}><span className="nav-icon">{icon}</span>{name}</button>)}</nav>
   <div className="side-bottom">GrandStay PMS · v2.0<br/>All systems operational</div>
  </aside>
  <main className="main"><header className="topbar"><h1>{page}</h1><div className="topright"><span className="muted">Front desk · Online</span><div className="avatar">GS</div><button className="btn" onClick={logout}>Sign out</button></div></header>
   <section className="content">
    {page==="Dashboard"&&<Dashboard reservations={reservations} rooms={rooms} setPage={setPage}/>}
    {page==="Reservations"&&<Reservations rows={filtered} query={query} setQuery={setQuery} onNew={()=>setShowNew(true)} onStatus={updateStatus} onExport={()=>csv(reservations,"grandstay-reservations.csv")}/>}
    {page==="Customers"&&<Customers reservations={reservations}/>}
    {page==="Rooms"&&<Rooms rooms={rooms} changeRoom={changeRoom}/>}
    {page==="Payments"&&<Payments reservations={reservations} onPay={pay} onExport={()=>csv(reservations.map(r=>({reference:`PAY-${r.id}`,guest:r.guest,room:r.room,amount:r.amount,paid:r.paid,balance:r.amount-r.paid,method:r.method} as any)),"grandstay-payments.csv")}/>}
    {page==="Reports"&&<Reports reservations={reservations} rooms={rooms}/>}
    {page==="Settings"&&<Settings profile={profile} setProfile={setProfile} notify={notify}/>}
   </section>
  </main>
  <div className="mobilebar">{nav.slice(0,5).map(([icon,name])=><button key={name} onClick={()=>setPage(name)}>{icon}<br/>{name}</button>)}</div>
  {showNew&&<NewReservation rooms={rooms} reservations={reservations} onClose={()=>setShowNew(false)} onSave={saveReservation}/>}
  {toast&&<div className="toast">{toast}</div>}
 </div>
}

function Login({onLogin}:{onLogin:(e:string,p:string)=>Promise<boolean>}){
 const [email,setEmail]=useState("admin@grandstay.com"),[pass,setPass]=useState("GrandStay@123"),[error,setError]=useState("");
 return <div className="login"><div className="login-hero"><span className="hero-pill">✦ GRANDSTAY PROFESSIONAL PMS</span><h1>Run every stay beautifully.</h1><p>A polished front-desk workspace for reservations, room operations, guests, payments and reporting — built for modern hotel teams.</p></div><div className="loginbox-wrap"><div className="loginbox"><div className="brand" style={{color:"#101828",padding:0}}><div className="brandmark">G</div>GrandStay</div><h1>Welcome back</h1><p className="muted">Sign in to your hotel operations workspace.</p><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/><input className="input" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Password"/>{error&&<div className="notice-error">{error}</div>}<button className="btn primary" onClick={async()=>{setError("");if(!(await onLogin(email,pass)))setError("Invalid email or password.")}}>Sign in securely</button><div className="notice"><b>Demo admin</b><br/>admin@grandstay.com · GrandStay@123</div><p className="kpi-note" style={{marginTop:14}}>This starter uses browser persistence. Connect a hosted auth/database provider before production deployment.</p></div></div></div>
}

function Dashboard({reservations,rooms,setPage}:{reservations:Reservation[];rooms:Room[];setPage:(p:string)=>void}){
 const revenue=reservations.reduce((s,r)=>s+r.paid,0),occ=rooms.filter(r=>r.status==="Occupied").length;
 return <><div className="hero-grid"><div className="hotel-hero"><span className="hero-pill">GRANDSTAY · NEW DELHI REGION</span><h2>Welcome to GrandStay</h2><div>Luxury stays. Smarter operations. One calm dashboard.</div></div><div className="mini-card"><div className="section-head"><h2>Property snapshot</h2><Badge s="System online"/></div><div style={{display:"grid",gap:13}}><Progress label="Occupancy" value={occ} total={rooms.length}/><Progress label="Clean & ready" value={rooms.filter(r=>r.status==="Clean").length} total={rooms.length}/><Progress label="Reservations paid" value={reservations.filter(r=>r.paid>=r.amount).length} total={reservations.length}/></div></div></div>
 <div className="eyebrow">Today · 23 September 2026</div><h2 className="page-title">Good evening, Admin</h2><p className="muted">Here is what is happening across your property today.</p>
 <div className="grid4"><Stat label="Occupancy" value={`${Math.round(occ/rooms.length*100)}%`} trend="+6.2% vs last week" icon="◉"/><Stat label="Arrivals" value={String(reservations.filter(r=>r.checkIn==="2026-09-23"&&r.status!=="Cancelled").length+7)} trend="Today's check-ins" icon="→"/><Stat label="Departures" value="9" trend="2 rooms pending" icon="←"/><Stat label="Collected" value={money(revenue)} trend="Across current folios" icon="₹"/></div>
 <div className="two"><div className="card"><div className="section-head"><h2>Recent reservations</h2><button className="link-btn" onClick={()=>setPage("Reservations")}>View all →</button></div><div className="tablewrap"><table className="table"><thead><tr><th>Guest</th><th>Room</th><th>Stay</th><th>Status</th><th>Paid</th></tr></thead><tbody>{reservations.slice(0,5).map(r=><tr key={r.id}><td><b>{r.guest}</b><br/><span className="kpi-note">#{r.id}</span></td><td>{r.room}</td><td>{r.checkIn} → {r.checkOut}</td><td><Badge s={r.status}/></td><td>{money(r.paid)}</td></tr>)}</tbody></table></div></div>
 <div className="card"><div className="section-head"><h2>Room status</h2><button className="link-btn" onClick={()=>setPage("Rooms")}>Manage →</button></div><div style={{display:"grid",gap:15}}><Progress label="Occupied" value={rooms.filter(r=>r.status==="Occupied").length} total={rooms.length}/><Progress label="Clean & ready" value={rooms.filter(r=>r.status==="Clean").length} total={rooms.length}/><Progress label="Reserved" value={rooms.filter(r=>r.status==="Reserved").length} total={rooms.length}/><Progress label="Maintenance" value={rooms.filter(r=>r.status==="Maintenance").length} total={rooms.length}/></div></div></div>
 <div className="card" style={{marginTop:18}}><div className="section-head"><h2>Stay inspiration</h2><span className="muted">Rooms guests love</span></div><div className="room-gallery">{roomImages.slice(0,3).map((x,i)=><img key={x} src={x} alt={["Deluxe room","Suite interior","Grand bedroom"][i]}/>)}</div></div></>
}
function Stat({label,value,trend,icon}:{label:string;value:string;trend:string;icon:string}){return <div className="card stat"><div><div className="label">{label}</div><div className="value">{value}</div><div className="trend">{trend}</div></div><div className="icon">{icon}</div></div>}
function Progress({label,value,total}:{label:string;value:number;total:number}){return <div><div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:7}}><span>{label}</span><b>{value}</b></div><div className="bar"><span style={{width:`${total?Math.min(100,value/total*100):0}%`}}/></div></div>}
function Badge({s}:{s:string}){const c=s==="Checked in"||s==="Paid"||s==="Clean"||s==="System online"?"green":s==="Confirmed"||s==="Reserved"||s==="Occupied"?"blue":s==="Pending"||s==="Dirty"?"amber":s==="Cancelled"||s==="Maintenance"?"red":"gray";return <span className={`badge ${c}`}>{s}</span>}

function Reservations({rows,query,setQuery,onNew,onStatus,onExport}:{rows:Reservation[];query:string;setQuery:(v:string)=>void;onNew:()=>void;onStatus:(id:number,s:Status)=>void;onExport:()=>void}){
 return <><div className="section-head"><div><div className="eyebrow">Front desk</div><h2 className="page-title">Reservations</h2><div className="muted">Create, search, check guests in/out and manage every stay.</div></div><div className="actions"><button className="btn" onClick={onExport}>↓ Export CSV</button><button className="btn primary" onClick={onNew}>＋ New reservation</button></div></div>
 <div className="card"><div className="filters"><input className="input grow" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search guest, room, reference, email..."/><button className="btn" onClick={()=>setQuery("Confirmed")}>Confirmed</button><button className="btn" onClick={()=>setQuery("")}>Clear</button></div><div className="tablewrap"><table className="table"><thead><tr><th>Reference</th><th>Guest</th><th>Room</th><th>Dates</th><th>Status</th><th>Amount</th><th>Actions</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>#{r.id}</td><td><b>{r.guest}</b><br/><span className="kpi-note">{r.email}</span></td><td>{r.room}<br/><span className="kpi-note">{r.type}</span></td><td>{r.checkIn}<br/>{r.checkOut}</td><td><Badge s={r.status}/></td><td>{money(r.amount)}<br/><span className="kpi-note">paid {money(r.paid)}</span></td><td><select className="input" value={r.status} onChange={e=>onStatus(r.id,e.target.value as Status)}><option>Pending</option><option>Confirmed</option><option>Checked in</option><option>Checked out</option><option>Cancelled</option></select></td></tr>)}</tbody></table>{!rows.length&&<div className="empty">No reservations match your search.</div>}</div></div></>
}

function Customers({reservations}:{reservations:Reservation[]}){
 return <><div className="eyebrow">Guest directory</div><h2 className="page-title">Customers</h2><p className="muted">Guest profiles automatically built from reservations.</p><div className="card"><table className="table"><thead><tr><th>Guest</th><th>Contact</th><th>Reservation</th><th>Room</th><th>Stay</th><th>Spend</th></tr></thead><tbody>{reservations.map(r=><tr key={r.id}><td><b>{r.guest}</b></td><td>{r.phone}<br/>{r.email}</td><td>#{r.id}</td><td>{r.room} · {r.type}</td><td>{r.checkIn} → {r.checkOut}</td><td>{money(r.amount)}</td></tr>)}</tbody></table></div></>
}

function Rooms({rooms,changeRoom}:{rooms:Room[];changeRoom:(n:string,s:RoomStatus)=>void}){
 return <><div className="eyebrow">Property operations</div><h2 className="page-title">Rooms & inventory</h2><p className="muted">Live housekeeping and availability board. Update status from the card.</p><div className="rooms" style={{marginTop:20}}>{rooms.map(r=><div className="room card" key={r.number}><img className="room-img" src={r.image} alt={`${r.type} room ${r.number}`}/><div className="room-body"><div style={{display:"flex",justifyContent:"space-between",gap:8}}><span className="roomnum">Room {r.number}</span><Badge s={r.status}/></div><div className="roommeta">{r.type} · {money(r.rate)}/night {r.guest&&<>· {r.guest}</>}</div><div className="room-controls"><select className="input" value={r.status} onChange={e=>changeRoom(r.number,e.target.value as RoomStatus)}><option>Clean</option><option>Dirty</option><option>Occupied</option><option>Reserved</option><option>Maintenance</option></select></div></div></div>)}</div></>
}

function Payments({reservations,onPay,onExport}:{reservations:Reservation[];onPay:(id:number,a:number,m:string)=>void;onExport:()=>void}){
 const total=reservations.reduce((s,r)=>s+r.paid,0),out=reservations.reduce((s,r)=>s+r.amount-r.paid,0);
 return <><div className="section-head"><div><div className="eyebrow">Cash desk</div><h2 className="page-title">Payments & folios</h2><p className="muted">Record payments, monitor balances and export your ledger.</p></div><button className="btn" onClick={onExport}>↓ Export payments CSV</button></div><div className="grid4"><Stat label="Collected" value={money(total)} trend="Current folios" icon="✓"/><Stat label="Outstanding" value={money(out)} trend="Amount to collect" icon="◌"/><Stat label="Paid folios" value={String(reservations.filter(r=>r.paid>=r.amount).length)} trend="Fully settled" icon="▣"/><Stat label="Transactions" value={String(reservations.length)} trend="Active ledger" icon="₹"/></div><div className="card"><table className="table"><thead><tr><th>Guest</th><th>Reference</th><th>Method</th><th>Total</th><th>Paid</th><th>Balance</th><th>Action</th></tr></thead><tbody>{reservations.map(r=><tr key={r.id}><td>{r.guest}</td><td>PAY-{r.id}</td><td>{r.method}</td><td>{money(r.amount)}</td><td>{money(r.paid)}</td><td>{money(r.amount-r.paid)}</td><td>{r.paid<r.amount?<button className="btn primary" onClick={()=>onPay(r.id,r.amount-r.paid,"Card")}>Collect balance</button>:<Badge s="Paid"/>}</td></tr>)}</tbody></table></div></>
}

function Reports({reservations,rooms}:{reservations:Reservation[];rooms:Room[]}){
 const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], revenue=reservations.reduce((s,r)=>s+r.paid,0);
 return <><div className="section-head"><div><div className="eyebrow">Analytics</div><h2 className="page-title">Reports</h2><p className="muted">Operational snapshot for management.</p></div><button className="btn primary" onClick={()=>csv(reservations.map(r=>({reference:r.id,guest:r.guest,room:r.room,checkIn:r.checkIn,checkOut:r.checkOut,status:r.status,amount:r.amount,paid:r.paid,balance:r.amount-r.paid} as any)),"grandstay-report.csv")}>↓ Export report</button></div>
 <div className="two"><div className="card"><div className="section-head"><h2>Weekly occupancy</h2><span className="muted">Illustrative trend</span></div>{days.map((d,i)=><div key={d} style={{display:"grid",gridTemplateColumns:"35px 1fr 40px",gap:10,alignItems:"center",margin:"14px 0",fontSize:12}}><span>{d}</span><div className="bar"><span style={{width:`${48+i*6}%`}}/></div><b>{48+i*6}%</b></div>)}</div><div className="card"><div className="section-head"><h2>Property mix</h2></div>{[["Occupied",rooms.filter(r=>r.status==="Occupied").length],["Clean",rooms.filter(r=>r.status==="Clean").length],["Reserved",rooms.filter(r=>r.status==="Reserved").length],["Maintenance",rooms.filter(r=>r.status==="Maintenance").length]].map(([n,v])=><Progress key={String(n)} label={String(n)} value={Number(v)} total={rooms.length}/>)}</div></div>
 <div className="hotel-list" style={{marginTop:18}}>{hotelImages.map((x,i)=><div className="hotel-card card" key={x}><img src={x} alt="GrandStay property"/><div className="body"><div className="stars">★★★★★</div><b>{["GrandStay Palace","GrandStay City View","GrandStay Retreat"][i]}</b><p className="kpi-note">Luxury hospitality · curated rooms · 24/7 front desk</p><span className="price">{money([4500,3800,6200][i])}</span> / night</div></div>)}</div><div className="card" style={{marginTop:18}}><b>Collected revenue</b><div style={{fontSize:32,fontWeight:850,marginTop:8}}>{money(revenue)}</div><div className="kpi-note">Based on recorded payments in this browser workspace.</div></div></>
}

function Settings({profile,setProfile,notify}:{profile:{name:string;phone:string;currency:string};setProfile:(p:any)=>void;notify:(m:string)=>void}){
 const [p,setP]=useState(profile);return <><div className="eyebrow">Administration</div><h2 className="page-title">Settings</h2><p className="muted">Property profile and workspace preferences.</p><div className="two" style={{marginTop:20}}><div className="card"><h2 style={{fontSize:16}}>Hotel profile</h2><div className="field"><label>Hotel name</label><input className="input" value={p.name} onChange={e=>setP({...p,name:e.target.value})}/></div><div className="field" style={{marginTop:13}}><label>Phone</label><input className="input" value={p.phone} onChange={e=>setP({...p,phone:e.target.value})}/></div><div className="field" style={{marginTop:13}}><label>Currency</label><select className="input" value={p.currency} onChange={e=>setP({...p,currency:e.target.value})}><option>INR</option><option>USD</option><option>EUR</option></select></div><button className="btn primary" style={{marginTop:16}} onClick={()=>{setProfile(p);localStorage.setItem("grandstay_profile",JSON.stringify(p));notify("Settings saved")}}>Save changes</button></div><div className="card"><h2 style={{fontSize:16}}>Workspace</h2><p className="muted">Timezone: Asia/Kolkata</p><p className="muted">Currency: {profile.currency}</p><p className="muted">Property capacity: {16} rooms in this starter dataset</p><Badge s="System online"/><div className="notice" style={{marginTop:16}}>For production, connect Supabase/Firebase or your own API for real multi-user authentication, database persistence and payment processing.</div></div></div></>
}

function NewReservation({rooms,reservations,onClose,onSave}:{rooms:Room[];reservations:Reservation[];onClose:()=>void;onSave:(r:Reservation)=>void}){
 const today="2026-09-23";const [guest,setGuest]=useState(""),[email,setEmail]=useState(""),[phone,setPhone]=useState(""),[room,setRoom]=useState(rooms.find(r=>r.status==="Clean")?.number||rooms[0].number),[checkIn,setCheckIn]=useState(today),[checkOut,setCheckOut]=useState("2026-09-25"),[amount,setAmount]=useState(280),[error,setError]=useState("");
 const selected=rooms.find(r=>r.number===room);
 return <div className="modal-backdrop"><div className="modal"><div className="section-head"><div><div className="eyebrow">Front desk</div><h2 style={{margin:0}}>New reservation</h2></div><button className="btn" onClick={onClose}>×</button></div><div className="form-grid"><div className="field"><label>Guest name *</label><input className="input" value={guest} onChange={e=>setGuest(e.target.value)} placeholder="Full name"/></div><div className="field"><label>Email</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="guest@email.com"/></div><div className="field"><label>Phone</label><input className="input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91..."/></div><div className="field"><label>Room *</label><select className="input" value={room} onChange={e=>{setRoom(e.target.value);const x=rooms.find(r=>r.number===e.target.value);if(x)setAmount(x.rate*2)}}>{rooms.filter(r=>r.status==="Clean"||r.number===room).map(r=><option key={r.number} value={r.number}>{r.number} · {r.type} · {money(r.rate)}</option>)}</select></div><div className="field"><label>Check-in</label><input className="input" type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)}/></div><div className="field"><label>Check-out</label><input className="input" type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)}/></div><div className="field"><label>Total amount</label><input className="input" type="number" min="0" value={amount} onChange={e=>setAmount(Number(e.target.value))}/></div><div className="field"><label>Payment method</label><select className="input" id="method"><option>Pending</option><option>Card</option><option>Cash</option><option>UPI</option></select></div></div>{error&&<div className="notice-error">{error}</div>}<div className="actions" style={{justifyContent:"flex-end",marginTop:20}}><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" onClick={()=>{if(!guest.trim()){setError("Guest name is required.");return}if(checkOut<=checkIn){setError("Check-out must be after check-in.");return}if(reservations.some(r=>r.room===room&&r.status!=="Cancelled"&&checkIn<r.checkOut&&checkOut>r.checkIn)){setError("That room overlaps an existing reservation.");return}const method=(document.getElementById("method") as HTMLSelectElement)?.value||"Pending";onSave({id:Math.floor(1000+Math.random()*9000),guest:guest.trim(),email:email||"—",phone:phone||"—",room,type:selected?.type||"Standard",checkIn,checkOut,status:"Confirmed",amount:Number(amount),paid:0,method})}}>Create reservation</button></div></div></div>
}

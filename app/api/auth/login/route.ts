import {NextResponse} from "next/server";
import {createHmac} from "crypto";
const secret=process.env.AUTH_SECRET||"grandstay-development-secret-change-me";
export async function POST(req:Request){
 try{
  const {email,password}=await req.json();
  const adminEmail=process.env.ADMIN_EMAIL||"admin@grandstay.com";
  const adminPassword=process.env.ADMIN_PASSWORD||"GrandStay@123";
  if(email?.toLowerCase()!==adminEmail.toLowerCase()||password!==adminPassword)return NextResponse.json({ok:false},{status:401});
  const payload=`${adminEmail}:${Date.now()}`;
  const token=Buffer.from(`${payload}.${createHmac("sha256",secret).update(payload).digest("hex")}`).toString("base64url");
  const res=NextResponse.json({ok:true,user:{email:adminEmail,name:"GrandStay Admin"}});
  res.cookies.set("grandstay_session",token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:60*60*8});
  return res;
 }catch{return NextResponse.json({ok:false},{status:400})}
}
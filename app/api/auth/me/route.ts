import {NextResponse} from "next/server";
import {createHmac} from "crypto";
const secret=process.env.AUTH_SECRET||"grandstay-development-secret-change-me";
export async function GET(req:Request){
 const token=req.headers.get("cookie")?.split(";").map(x=>x.trim()).find(x=>x.startsWith("grandstay_session="))?.split("=")[1];
 if(!token)return NextResponse.json({authenticated:false},{status:401});
 try{
  const raw=Buffer.from(token,"base64url").toString();
  const i=raw.lastIndexOf(".");
  const payload=raw.slice(0,i),sig=raw.slice(i+1);
  const expected=createHmac("sha256",secret).update(payload).digest("hex");
  if(sig!==expected)return NextResponse.json({authenticated:false},{status:401});
  const timestamp=Number(payload.split(":").pop());
  if(!timestamp||Date.now()-timestamp>60*60*8*1000)return NextResponse.json({authenticated:false},{status:401});
  return NextResponse.json({authenticated:true});
 }catch{return NextResponse.json({authenticated:false},{status:401})}
}
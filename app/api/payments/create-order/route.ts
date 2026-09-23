import { NextResponse } from "next/server";
import { Buffer } from "buffer";
export async function POST(req: Request) {
 const key=process.env.RAZORPAY_KEY_ID, secret=process.env.RAZORPAY_KEY_SECRET;
 if(!key||!secret)return NextResponse.json({error:"Razorpay is not configured. Add payment keys in Vercel."},{status:503});
 try{const {amount,receipt}=await req.json();if(!amount||amount<1)return NextResponse.json({error:"Invalid amount"},{status:400});const auth=Buffer.from(`${key}:${secret}`).toString("base64");const r=await fetch("https://api.razorpay.com/v1/orders",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Basic ${auth}`},body:JSON.stringify({amount:Math.round(Number(amount)*100),currency:"INR",receipt:String(receipt||`GS-${Date.now()}`)})});const data=await r.json();if(!r.ok)return NextResponse.json({error:data?.error?.description||"Unable to create payment order"},{status:400});return NextResponse.json({id:data.id,amount:data.amount,currency:data.currency,key});}catch{return NextResponse.json({error:"Payment service unavailable"},{status:500});}}

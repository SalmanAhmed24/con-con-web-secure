const { Resend } = require("resend");
import moment from "moment";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/serverAuth";
const resend = new Resend(process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY);
export async function POST(request) {
  const unauthorized = requireAuth(request);
  if (unauthorized) return unauthorized;
  try {
    let dataObj = await request.json();
    const { data, error } = await resend.emails.send({
      from: "JsElectric <jselectric@contractorcontroller.com>",
      to: [
        "jwences@jselectric.com",
        "rmacias@jselectric.com",
        "lgonzales@jselectric.com",
        "kbaumhover@jselectric.com",
      ],
      subject: "New Write Up Notification From App",
      html: `<div>
      <p><strong>${dataObj.dataWriteUp.createdBy}</strong> has created a write up for <strong>${dataObj.dataWriteUp.employeeName}</strong></p>
      </div>`,
    });
    if (error) {
      return NextResponse.json({ error });
    }
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
//["jwences@jselectric.com","rmacias@jselectric.com","lgonzales@jselectric.com","kbaumhover@jselectric.com",]

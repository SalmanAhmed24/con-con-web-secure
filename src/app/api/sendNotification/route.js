const { Resend } = require("resend");
import moment from "moment";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/serverAuth";
const resend = new Resend(process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY);
export async function POST(request) {
  const unauthorized = requireAuth(request);
  if (unauthorized) return unauthorized;
  try {
    const result = await request.json();
    const { data, error } = await resend.emails.send({
      from: "JsElectric <jselectric@contractorcontroller.com>",
      to: result.email,
      subject: "Time Off Request",
      html: `<div>
        <p>New Time Off request has been added by ${result.addedBy} and is entered by ${result.enteredBy}</p>
        <div>
        <h4>Start Date</h4>
        <p>${result.startDate}</p>
        </div>
        <div>
        <h4>End Date</h4>
        <p>${result.endDate}</p>
        </div>
        <div>
        <h4>Reason</h4>
        <p>${result.reason}</p>
        </div>
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

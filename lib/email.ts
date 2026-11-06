import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface BookingEmailPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceName: string;
  barberName: string;
  date: string;
  time: string;
  price: number;
}

export async function sendBookingConfirmationEmail(payload: BookingEmailPayload) {
  if (!resend) {
    console.log("[Dev Mode] Resend API key not set. Booking email simulated for:", payload.customerEmail);
    return { success: true, simulated: true };
  }

  try {
    // 1. Send confirmation email to Customer
    const customerEmailPromise = resend.emails.send({
      from: "Charlie Hair Studio <appointments@resend.dev>",
      to: [payload.customerEmail],
      subject: `Booking Confirmed: ${payload.serviceName} at Charlie Hair Studio`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #111111; color: #F5F1E8; padding: 40px; border-radius: 8px;">
          <h1 style="color: #C9A227; margin-bottom: 8px; font-size: 28px;">Charlie Hair Studio</h1>
          <p style="color: #9A9A9A; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Look Good • Feel Good</p>
          
          <hr style="border: 0; border-top: 1px solid #2B2B2B; margin: 24px 0;" />
          
          <h2 style="color: #F5F1E8; font-size: 20px;">Your Appointment is Confirmed!</h2>
          <p style="color: #CCCCCC; font-size: 15px;">Hello <strong>${payload.customerName}</strong>, we look forward to welcoming you.</p>
          
          <div style="background-color: #1B1B1B; border: 1px solid #2E2E2E; border-left: 4px solid #C9A227; padding: 20px; border-radius: 6px; margin: 24px 0;">
            <p style="margin: 6px 0;"><strong>Service:</strong> ${payload.serviceName}</p>
            <p style="margin: 6px 0;"><strong>Stylist / Barber:</strong> ${payload.barberName}</p>
            <p style="margin: 6px 0;"><strong>Date:</strong> ${payload.date}</p>
            <p style="margin: 6px 0;"><strong>Time:</strong> ${payload.time}</p>
            <p style="margin: 6px 0;"><strong>Total:</strong> ₹${payload.price}</p>
          </div>
          
          <h3 style="color: #C9A227; font-size: 16px; margin-top: 30px;">Studio Location & Contact</h3>
          <p style="color: #9A9A9A; line-height: 1.6; font-size: 14px;">
            15, Ratnanjali Solitaire, Nr. Axis Bank, Prernatirth Derasar Rd, Jodhpur Village, Ahmedabad 380015<br />
            Phone: <a href="tel:9624969690" style="color: #C9A227;">+91 9624969690</a> | Email: charliehairstudio26@gmail.com
          </p>
        </div>
      `,
    });

    // 2. Also send an instant new appointment alert to the Studio Owner
    const studioNotificationPromise = resend.emails.send({
      from: "Charlie Booking System <appointments@resend.dev>",
      to: ["charliehairstudio26@gmail.com"],
      subject: `New Appointment: ${payload.customerName} (${payload.serviceName})`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #1B1B1B; color: #FFFFFF; padding: 25px; border-radius: 6px; border-left: 4px solid #C9A227;">
          <h2 style="color: #C9A227; margin-top: 0;">New Appointment Booked Online!</h2>
          <p><strong>Customer:</strong> ${payload.customerName}</p>
          <p><strong>Phone:</strong> <a href="tel:${payload.customerPhone}" style="color: #C9A227;">${payload.customerPhone}</a></p>
          <p><strong>Email:</strong> ${payload.customerEmail}</p>
          <p><strong>Service:</strong> ${payload.serviceName} (₹${payload.price})</p>
          <p><strong>Stylist:</strong> ${payload.barberName}</p>
          <p><strong>Appointment Time:</strong> ${payload.date} at ${payload.time}</p>
        </div>
      `,
    }).catch((err) => console.log("Owner alert email notice:", err));

    const [data] = await Promise.all([customerEmailPromise, studioNotificationPromise]);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending booking email via Resend:", error);
    return { success: false, error };
  }
}

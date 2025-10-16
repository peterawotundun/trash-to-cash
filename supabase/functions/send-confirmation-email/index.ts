import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'https://esm.sh/resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_CONFIRMATION_EMAIL_HOOK_SECRET') as string

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 400 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  const wh = new Webhook(hookSecret)
  
  try {
    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
      }
      email_data: {
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    console.log('Sending confirmation email to:', user.email)

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; margin-bottom: 64px;">
            <div style="padding: 40px;">
              <h1 style="color: #16a34a; font-size: 32px; font-weight: bold; text-align: center; margin: 40px 0;">
                Welcome to Trash to Cash! 🌱
              </h1>
              <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
                Hi there! Thanks for signing up with <strong>${user.email}</strong>.
              </p>
              <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
                Click the button below to confirm your email address and start earning rewards by recycling:
              </p>
              <div style="padding: 27px 0; text-align: center;">
                <a href="${confirmationUrl}" 
                   style="background-color: #16a34a; border-radius: 8px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; padding: 12px 32px;">
                  Confirm Email Address
                </a>
              </div>
              <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
                Or copy and paste this URL into your browser:
              </p>
              <p style="color: #16a34a; font-size: 14px; text-decoration: underline; word-break: break-all;">
                ${confirmationUrl}
              </p>
              <p style="color: #8898aa; font-size: 14px; line-height: 24px; margin: 16px 0;">
                If you didn't create an account with Trash to Cash, you can safely ignore this email.
              </p>
              <p style="color: #8898aa; font-size: 14px; line-height: 24px; margin: 16px 0;">
                <strong>Trash to Cash</strong> - Turn your recyclables into rewards
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: 'Trash to Cash <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Confirm your Trash to Cash account',
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully:', data)

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error: any) {
    console.error('Error in send-confirmation-email:', error)
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})

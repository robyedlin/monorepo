import client from '@sendgrid/client'
import sgMail from '@sendgrid/mail'

import { SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } from '../env'

sgMail.setApiKey(SENDGRID_API_KEY)
client.setApiKey(SENDGRID_API_KEY)

export const sendTransactionalEmail = async ({
  to,
  from = SENDGRID_SENDER_EMAIL,
  subject,
  text,
  html = undefined
}: {
  to: string[]
  subject: string
  text: string
  from?: string
  html?: string
}): Promise<{
  status: 'SUCCESS' | 'FAILURE'
  externalId?: string
  errors: { message: string; field: string; help: string }[] | []
}> => {
  const msg = {
    to,
    from,
    subject,
    text,
    html: html || text
  }
  try {
    let externalId = ''
    const response = await sgMail.send(msg)
    if (response && Array.isArray(response) && response.length > 0) {
      externalId = response[0].headers['x-message-id']
    }
    return { status: 'SUCCESS', externalId, errors: [] }
  } catch (error) {
    const e = error as {
      response: {
        body: {
          errors: { message: string; field: string; help: string }[]
        }
      }
    }
    if (e.response) {
      return { status: 'FAILURE', errors: e.response.body.errors }
    }
    return {
      status: 'FAILURE',
      errors: []
    }
  }
}

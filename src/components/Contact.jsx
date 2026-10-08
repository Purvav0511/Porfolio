import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { profile } from '../data/content'
import { Icon, LinkedInIcon, GitHubIcon } from './Icons'

// EmailJS IDs are public client-side identifiers.
const EMAILJS = { service: 'service_re5r8bn', template: 'template_nl6vaz6', publicKey: 'wxDMI28llm-wPZRnn' }
const ROLES = ['Software Engineer', 'Data Engineer', 'ML Engineer', 'Something else']
const empty = { name: '', email: '', company: '', role: ROLES[0], message: '' }

export default function Contact() {
  const [form, setForm] = useState(empty)
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState(null)

  const update = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const notify = (text, err = false) => {
    setToast({ text, err })
    setTimeout(() => setToast(null), 4000)
  }

  const submit = async e => {
    e.preventDefault()
    setSending(true)
    try {
      await emailjs.send(EMAILJS.service, EMAILJS.template, {
        from_name: form.name,
        from_email: form.email,
        to_name: profile.first,
        message: `Company: ${form.company || '—'}\nRole: ${form.role}\n\n${form.message}`,
      }, { publicKey: EMAILJS.publicKey })
      setForm(empty)
      notify('Thanks, your message is on its way. I’ll reply soon.')
    } catch (err) {
      console.error('EmailJS send failed', err?.status, err?.text ?? err)
      notify(`Couldn’t send right now. Email me at ${profile.email}.`, true)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact">
      <div className="wrap">
        <div className="eyebrow rv">Transfer window: open</div>
        <h2 className="title rv">Let&apos;s talk</h2>
        <p className="sub rv">Hiring for a Software, Data, or ML Engineering role? Send a note and I&apos;ll get back to you.</p>
        <div className="contact">
          <div className="panel direct rv">
            <a href={`mailto:${profile.email}`}>
              <span className="ic"><Icon name="mail" /></span>
              <span><small>Email</small><strong>{profile.email}</strong></span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <span className="ic"><LinkedInIcon /></span>
              <span><small>LinkedIn</small><strong>{profile.linkedin.replace('https://', '')}</strong></span>
            </a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              <span className="ic"><GitHubIcon /></span>
              <span><small>GitHub</small><strong>{profile.github.replace('https://', '')}</strong></span>
            </a>
            <div className="resp"><span className="dot" />Usually replies within 24 hours</div>
          </div>
          <form className="panel msg rv" onSubmit={submit}>
            <div><label htmlFor="f-name">Name</label><input id="f-name" name="name" value={form.name} onChange={update} required autoComplete="name" /></div>
            <div><label htmlFor="f-email">Work email</label><input id="f-email" name="email" type="email" value={form.email} onChange={update} required autoComplete="email" /></div>
            <div><label htmlFor="f-co">Company</label><input id="f-co" name="company" value={form.company} onChange={update} autoComplete="organization" /></div>
            <div>
              <label htmlFor="f-role">Role</label>
              <select id="f-role" name="role" value={form.role} onChange={update}>{ROLES.map(r => <option key={r}>{r}</option>)}</select>
            </div>
            <div className="full"><label htmlFor="f-msg">Message</label><textarea id="f-msg" name="message" value={form.message} onChange={update} required /></div>
            <div className="full row-end">
              <span className="note">Goes straight to my inbox.</span>
              <button className="btn gold" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
            </div>
          </form>
        </div>
      </div>
      <div className={`toast${toast ? ' show' : ''}${toast?.err ? ' err' : ''}`} role="status" aria-live="polite">{toast?.text}</div>
    </section>
  )
}

// Recibe el formulario de contacto y lo envía por correo con Resend.
// Variables de entorno (en Vercel → Settings → Environment Variables):
//   RESEND_API_KEY      clave de Resend (obligatoria)
//   CONTACT_TO_EMAIL    a quién llegan los mensajes (varios separados por comas)
//   CONTACT_FROM_EMAIL  remitente; sin dominio verificado usa onboarding@resend.dev

const escapeHtml = (str = '') =>
    String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'Método no permitido' });
    }

    const { fullname = '', email = '', phone = '', message = '', website = '' } = req.body || {};

    // Campo trampa anti-spam: los humanos no lo ven ni lo rellenan.
    if (website) return res.status(200).json({ ok: true });

    if (!fullname.trim() || !isEmail(email) || !phone.trim() || !message.trim()) {
        return res.status(400).json({ ok: false, error: 'Faltan datos o el correo no es válido' });
    }
    if (fullname.length > 200 || email.length > 200 || phone.length > 50 || message.length > 5000) {
        return res.status(400).json({ ok: false, error: 'Algún campo es demasiado largo' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = (process.env.CONTACT_TO_EMAIL || '').split(',').map((s) => s.trim()).filter(Boolean);
    const from = process.env.CONTACT_FROM_EMAIL || 'Web Wintek <onboarding@resend.dev>';

    if (!apiKey || to.length === 0) {
        console.error('Formulario de contacto: falta RESEND_API_KEY o CONTACT_TO_EMAIL');
        return res.status(500).json({ ok: false, error: 'El formulario no está configurado' });
    }

    const html = `
        <h2>Nuevo mensaje desde la web</h2>
        <p><strong>Nombre:</strong> ${escapeHtml(fullname)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
        <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`;

    const text = `Nuevo mensaje desde la web\n\nNombre: ${fullname}\nCorreo: ${email}\nTeléfono: ${phone}\n\nMensaje:\n${message}`;

    try {
        const r = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to,
                reply_to: email,
                subject: `Nuevo contacto web: ${fullname}`.slice(0, 150),
                html,
                text,
            }),
        });

        if (!r.ok) {
            console.error('Resend error', r.status, await r.text());
            return res.status(502).json({ ok: false, error: 'No se pudo enviar el mensaje' });
        }
        return res.status(200).json({ ok: true });
    } catch (e) {
        console.error('Resend exception', e);
        return res.status(502).json({ ok: false, error: 'No se pudo enviar el mensaje' });
    }
}

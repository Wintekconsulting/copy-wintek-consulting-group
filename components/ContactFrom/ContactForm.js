import React, { useState } from 'react'
import SimpleReactValidator from 'simple-react-validator'

const ContactForm = () => {

    const [forms, setForms] = useState({
        fullname: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle | sending | ok | error
    const [, forceUpdate] = useState(0);
    const [validator] = useState(new SimpleReactValidator({
        className: 'errorMessage'
    }));
    const changeHandler = e => {
        setForms({ ...forms, [e.target.name]: e.target.value })
        if (validator.allValid()) {
            validator.hideMessages();
        } else {
            validator.showMessages();
        }
    };

    const submitHandler = async e => {
        e.preventDefault();

        if (!validator.allValid()) {
            validator.showMessages();
            forceUpdate((n) => n + 1);
            return;
        }

        const formDataObj = Object.fromEntries(new FormData(e.target));
        setStatus('sending');
        try {
            const r = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDataObj),
            });
            if (!r.ok) throw new Error('send failed');
            setStatus('ok');
            validator.hideMessages();
            setForms({ fullname: '', email: '', phone: '', message: '' });
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <form onSubmit={(e) => submitHandler(e)} className="contact-validation-active" >
            <div className="row">
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.fullname}
                            type="text"
                            name="fullname"
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            placeholder="Nombre completo" />
                        {validator.message('fullname', forms.fullname, 'required|alpha_space')}
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.email}
                            type="email"
                            name="email"
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            placeholder="correo electrónico" />
                        {validator.message('email', forms.email, 'required|email')}
                    </div>
                </div>
                <div className="col col-lg-6 col-12">
                    <div className="form-field">
                        <input
                            value={forms.phone}
                            type="phone"
                            name="phone"
                            onBlur={(e) => changeHandler(e)}
                            onChange={(e) => changeHandler(e)}
                            placeholder="Teléfono de contacto" />
                        {validator.message('phone', forms.phone, 'required|phone')}
                    </div>
                </div>
                <div className="col col-lg-12 col-12">
                    <textarea
                        onBlur={(e) => changeHandler(e)}
                        onChange={(e) => changeHandler(e)}
                        value={forms.message}
                        type="text"
                        name="message"
                        placeholder="Mensaje sobre el servicio de interés">
                    </textarea>
                    {validator.message('message', forms.message, 'required')}
                </div>
            </div>
            {/* Campo trampa anti-spam, invisible para las personas */}
            <input type="text" name="website" tabIndex="-1" autoComplete="off"
                style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
            <div className="submit-area">
                <button type="submit" className="theme-btn" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Enviando…' : 'Enviar'}
                </button>
            </div>
            {status === 'ok' && (
                <p role="status" style={{ marginTop: '16px', color: '#1a7f37', fontWeight: 600 }}>
                    ¡Gracias! Hemos recibido tu mensaje y te contactaremos pronto.
                </p>
            )}
            {status === 'error' && (
                <p role="alert" style={{ marginTop: '16px', color: '#c0392b', fontWeight: 600 }}>
                    No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos.
                </p>
            )}
        </form >
    )
}

export default ContactForm;
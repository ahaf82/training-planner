import React, { useState, useContext, useEffect } from 'react';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const Register = (props) => {
    const alertContext = useContext(AlertContext);
    const authContext = useContext(AuthContext);

    const { setAlert } = alertContext;
    const { register, error, clearErrors, isAuthenticated } = authContext;

    useEffect(() => {
        if(isAuthenticated) {
            props.history.push('/');
        }

        if(error) {
            setAlert(error, 'danger');
            clearErrors();
        }

        //eslint-disable-next-line
    }, [error, isAuthenticated, props.history])

    const [ members, setMember ] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = members;

    const onChange = e => setMember({ ...members, [e.target.name]: e.target.value }); 

    const onSubmit = e => {
        e.preventDefault();
        if (name === '' || email === '' || password === '') {
            setAlert('Bitte alle Felder ausfüllen', 'danger');
        } else if (password !== password2) {
            setAlert('Die Passworteingaben stimmen nicht übereinander', 'danger');
        } else {
            register({
                name,
                email,
                password
            });
        }
    }

    return (
        <div className='form-container'>
            <h1 className='text-primary x-large'>
                Konto registrieren
            </h1>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input type='text' name='name' value={name} onChange={onChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='email'>E-Mail Adresse</label>
                    <input type='email' name='email' value={email} onChange={onChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Passwort (Mindestens 8 Zeichen inklusive Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen)</label>
                    <input type='password' name='password' value={password} onChange={onChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='password2'>Passwort bestätigen</label>
                    <input type='password' name='password2' value={password2} onChange={onChange} />
                </div>
                <input type="submit" value="Registrieren" className="btn btn-primary btn-block"/>
            </form>
        </div>
    )
}

export default Register;
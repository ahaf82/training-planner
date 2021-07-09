import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const ResetPassword = (props) => {
    const alertContext = useContext(AlertContext);
    const authContext = useContext(AuthContext);

    const { setAlert } = alertContext;
    const { resetPassword, error, clearErrors } = authContext;

    const history = useHistory();

    // useEffect(() => {
    //     if(isAuthenticated) {
    //         props.history.push('/');
    //     }

    //     if(error) {
    //         setAlert(error, 'danger');
    //         clearErrors();
    //     }

    //     //eslint-disable-next-line
    // }, [error, isAuthenticated, props.history])

    const [ members, setMember ] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { email } = members;

    const onChange = e => setMember({ ...members, [e.target.name]: e.target.value }); 

    const onSubmit = e => {
        e.preventDefault();
        if (email === '') {
            setAlert('Bitte gib deine E-Mail Adresse ein', 'dark');
        } else {
            resetPassword({
                email
            });
            setAlert('Wir haben dir eine Mail zum Zurücksetzen des Passworts zugesendet', 'dark');
            history.push("/login");
        }
    }

    return (
        <div className='form-container'>
            <p className='text-dark large'>
                Gib deine E-Mail Adresse zum Zurücksetzen des Passworts ein:
            </p>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='email'>E-Mail Adresse</label>
                    <input type='email' name='email' value={email} onChange={onChange} />
                </div>
                <input type="submit" value="Abschicken" className="btn btn-dark btn-block"/>
            </form>
        </div>
    )
}

export default ResetPassword;
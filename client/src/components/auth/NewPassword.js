import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AlertContext from '../../context/alert/alertContext';
import AuthContext from '../../context/auth/authContext';

const NewPassword = (props) => {
    const alertContext = useContext(AlertContext);
    const authContext = useContext(AuthContext);

    const { setAlert } = alertContext;
    const { resetPassword, newPassword, error, clearErrors } = authContext;

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

    // const id = this.props.match.params.id;
    // const token = this.props.match.params.token;
    // console.log("this id", id)
    let token = props.location.search.split('&')[0].split("=")[1];
    let id = props.location.search.split('&')[1].split("=")[1];
    console.log("this id", id)
    console.log("this token", token)

    const { password, password2 } = members;

    const onChange = e => setMember({ ...members, [e.target.name]: e.target.value }); 

    const onSubmit = e => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Die Passworteingaben stimmen nicht übereinander', 'dark');
        } else {
            const data = { id, token, password }
            newPassword({
                data
            });
            setAlert('Du hast dein Passwort erfolgreich zurückgesetzt', 'dark');
            history.push("/login");
        }
    }

    return (
        <div className='form-container'>
            <h1 className='text-dark x-large'>
                Neues Passwort eingeben:
            </h1>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label htmlFor='password'>Passwort (Mindestens 8 Zeichen inklusive Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen)</label>
                    <input type='password' name='password' value={password} onChange={onChange} />
                </div>
                <div className='form-group'>
                    <label htmlFor='password2'>Passwort bestätigen</label>
                    <input type='password' name='password2' value={password2} onChange={onChange} />
                </div>
                <input type="submit" value="Passwort speichern" className="btn btn-dark btn-block"/>
            </form>
        </div>
    )
}

export default NewPassword;
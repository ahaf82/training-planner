import React, { Fragment, useContext }  from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext'
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext'
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext'

const Navbar = ({ title, icon }) => {
    const authContext = useContext(AuthContext);
    const trainingGroupContext = useContext(TrainingGroupContext);
    const trainingSessionContext = useContext(TrainingSessionContext);
    
    const { isAuthenticated, logout, member } = authContext;
    const { clearTrainingGroups } = trainingGroupContext;
    const { clearTrainingSessions } = trainingSessionContext;

    const onLogout = () => {
        logout();
        clearTrainingGroups();
        clearTrainingSessions();
    };

    const authLinks = (
        <Fragment>
            <li>Hallo { member && member.name }</li>
            <li>
                <a onClick={onLogout} href="#!">
                    <i className="fas fa-sign-out-alt"></i> <span className="hide-sm">Logout</span>
                </a>
            </li>
        </Fragment>
    )

    const guestLinks = (
        <Fragment>
            <li>
                <Link to='/register'>Registrierung</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
        </Fragment>
    )

    return (
        <div className="navbar bg-primary">
            <h1>
                <i className={icon} /> {title}
            </h1>
            <ul>        
                {isAuthenticated ? authLinks : guestLinks }
            </ul>
        </div>
    )
}

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string
}

Navbar.defaultProps = {
    title: 'Training Planner',
    icon: 'fas fa-id-card-alt'
}

export default Navbar;
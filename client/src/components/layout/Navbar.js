import React, { Fragment, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';

const Navbar = ({ title, icon }) => {
    const authContext = useContext(AuthContext);
    const trainingGroupContext = useContext(TrainingGroupContext);
    const trainingSessionContext = useContext(TrainingSessionContext);

    const { isAuthenticated, logout, member, role } = authContext;
    const { clearTrainingGroups } = trainingGroupContext;
    const { clearTrainingSessions } = trainingSessionContext;

    const onLogout = () => {
        logout();
        clearTrainingGroups();
        clearTrainingSessions();
    };

    const authLinks = (
        <Fragment>
            {(role === 'admin' || role === 'superUser') &&
                <li>
                    <Link to='/'><i className="fa fa-list-alt" aria-hidden="true"></i><span className="hide-sm"> Übersicht</span></Link>
                </li>}
            {(role === 'admin' || role === 'superUser') &&
                <li>
                    <Link to='/sessions'><i className="fa fa-calendar" aria-hidden="true"></i><span className="hide-sm"> Trainingseinheiten</span></Link>
                </li>}
            {(role === 'admin' || role === 'superUser') &&
                <li>
                    <Link to='/groups'><i className="fa fa-users" aria-hidden="true"></i><span className="hide-sm"> Trainingsgruppen</span></Link>
                </li>}
            {(role === 'admin' || role === 'superUser') &&
                <li>
                    <Link to='/memberPage'><i className="fa fa-user-circle" aria-hidden="true"></i><span className="hide-sm"> Mitglieder</span></Link>
                </li>}
            {(role === 'admin' || role === 'superUser') &&
                <li>
                    <Link to='/oldSess'><i className="fa fa-reply-all" aria-hidden="true"></i><span className="hide-sm"> Alte Einträge</span></Link>
                </li>}
            {role === 'member' &&
                <li>
                    Hallo {member && member.name}
                </li>}
            <li>
                <a onClick={onLogout} href="#!">
                    <i className="fas fa-sign-out-alt"></i><span className="hide-sm"> Logout</span>
                </a>
            </li>
        </Fragment>
    )

    const guestLinks = (
        <Fragment>
            {/* {<li>
                <Link to='/policy'>DSGVO</Link>
            </li> */}
            <li>
                <Link to='/register'>Registrierung</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
        </Fragment>
    )

    return (
        <div className="navbar bg-primary middle">
            <h1 className="x-large">
                <i className={icon} /> {title}
            </h1>
            <ul>
                {isAuthenticated ? authLinks : guestLinks}
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
    icon: 'fa fa-calendar'
}

export default Navbar;
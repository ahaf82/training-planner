import React, { Component, useContext, useEffect } from 'react';
import SimpleReactCalendar from 'simple-react-calendar';
import TrainingSession from '../trainingSessions/TrainingSessions';
import HomeSessions from '../trainingSessions/HomeSessions';
import TrainingSessionFilter from '../trainingSessions/TrainingSessionFilter';
import AuthContext from '../../context/auth/authContext';
import MemberContext from '../../context/member/memberContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';
import TrainingGroupContext from '../../context/trainingGroup/trainingGroupContext';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/locale/de';

Moment.globalLocale = 'de';

const Home = props => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const memberContext = useContext(MemberContext);
    const { getMembers } = memberContext;

    const trainingGroupContext = useContext(TrainingGroupContext);
    const { getTrainingGroups } = trainingGroupContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { filterTrainingSessions, getTrainingSessions, clearFilter, filtered } = trainingSessionContext;

    useEffect(() => {
        authContext.loadMember();
        getTrainingGroups();
        getTrainingSessions();
        getMembers();
        // eslint-disable-next-line
    }, []);

    let columns = 0;

    if (role === 'admin' || role === 'superUser') {
        columns = 3;
    }
    if (role === 'member' || role === 'none') {
        columns = 1;
    }

    return (
        <div className={`grid-${columns}`}>
            <div>
                <div className='center-cal fixed'>
                    {(role === 'admin' || role === 'superUser') &&
                        <h4 className="text-primary large center">Trainingseinheiten am:</h4>}
                    {(role === 'admin' || role === 'superUser') &&
                        <SimpleReactCalendar activeMonth={new Date()} daysOfWeek={['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']} onSelect={(e) => {
                            const actualDate = moment(e).format('YYYY-MM-DD');
                            console.log(actualDate);
                            filterTrainingSessions(actualDate);
                        }} /> }
                    <br/>
                    {(role === 'admin' || role === 'superUser') &&
                        <TrainingSessionFilter /> }
                    {(role === 'member' || role === 'trainer') &&
                        <TrainingSession /> }
                    {role === 'none' &&
                        <h2 className="text-primary large">Melde dich bei deinem Trainer, damit er dich eincheckt</h2>}
                </div>
            </div>
            <div className='card-grid-3'>
                {(role === 'admin' || role === 'superUser') &&
                    <h4 className="text-primary large center">Kommende Trainingseinheiten:</h4>}
                {(role === 'admin' || role === 'superUser') &&
                    <HomeSessions /> }
            </div>
        </div>
    )
}

Home.propTypes = {

}

export default Home;

import React, { Component, useContext, useEffect } from 'react';
import TrainingGroups from '../trainingGroups/TrainingGroups';
import SimpleReactCalendar from 'simple-react-calendar';
import TrainingSession from '../trainingSessions/TrainingSessions';
import HomeSessions from '../trainingSessions/HomeSessions';
import TrainingGroupFilter from '../trainingGroups/TrainingGroupFilter';
import TrainingSessionFilter from '../trainingSessions/TrainingSessionFilter';
import AuthContext from '../../context/auth/authContext';
import TrainingSessionContext from '../../context/trainingSession/trainingSessionContext';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/locale/de';
import { Datepicker } from 'materialize-css';

Moment.globalLocale = 'de';

const Home = props => {
    const authContext = useContext(AuthContext);
    const { role } = authContext;

    const trainingSessionContext = useContext(TrainingSessionContext);
    const { filterTrainingSessions, clearFilter, filtered } = trainingSessionContext;

    useEffect(() => {
        authContext.loadMember();
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
                        <h4 className="text-dark large center">Trainingseinheiten am:</h4>}
                    {(role === 'admin' || role === 'superUser') &&
                        <SimpleReactCalendar activeMonth={new Date()} daysOfWeek={['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']} onSelect={(e) => {
                            const actualDate = moment(e).format('YYYY-MM-DD');
                            console.log(actualDate);
                            filterTrainingSessions(actualDate);
                        }} /> }
                    <br/>
                    {(role === 'admin' || role === 'superUser') &&
                        <TrainingSessionFilter /> }
                    {role === 'member' &&
                        <TrainingSession /> }
                    {role === 'none' &&
                        <h2 className="text-primary large">Melde dich bei deinem Trainer, damit er dich eincheckt</h2>}
                </div>
            </div>
            <div className='card-grid-3'>
                {(role === 'admin' || role === 'superUser') &&
                    <h4 className="text-dark large center">Kommende Trainingseinheiten:</h4>}
                {(role === 'admin' || role === 'superUser') &&
                    <HomeSessions /> }
            </div>
        </div>
    )
}

Home.propTypes = {

}

export default Home;

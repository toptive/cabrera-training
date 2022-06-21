import React, { useEffect } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import FormEditJob from '../components/form/FormEditJob';
import moment from 'moment';


/* utils */
import { absoluteUrl, getAppCookies } from '../middleware/utils';

/* components */
import Layout from '../components/layout/Layout';
import UserNav from '../components/navigation/User';

const localizer = momentLocalizer(moment);

function Event(props) {
    return (
        <Layout>
            <div className='container'>
                <Calendar
                    className='calendar'
                    localizer={localizer}
                    events={[{
                        'title': 'My event',
                        'allDay': false,
                        'start': new Date(2022, 5, 2, 10, 0), // 10.00 AM Y-M-D-IH-FH
                        'end': new Date(2022, 5, 2, 10, 0), // 2.00 PM 
                    }]}
                    view='month'
                    views={['month']}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 400 }}
                />
            </div>
        </Layout>
    )
}
/* getServerSideProps */
export async function getServerSideProps(context) {
    const { query, req } = context;
    const { nextPage } = query;
    const { origin } = absoluteUrl(req);

    const token = getAppCookies(req).token || '';
    const referer = req.headers.referer || '';

    const nextPageUrl = !isNaN(nextPage) ? `?nextPage=${nextPage}` : '';
    const baseApiUrl = `${origin}/api`;

    const eventApi = await fetch(`${baseApiUrl}/event${nextPageUrl}`, {
        headers: {
            authorization: token || '',
        },
    });

    const events = await eventApi.json();

    return {
        props: {
            origin,
            referer,
            token,
            events,
        },
    };
}


export default Event;
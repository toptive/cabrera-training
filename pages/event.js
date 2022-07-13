import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';


/* utils */
import { absoluteUrl, getAppCookies } from '../middleware/utils';

/* components */
import Layout from '../components/layout/Layout';
import UserNav from '../components/navigation/User';

const localizer = momentLocalizer(moment);


function Event(props) {
    const router = useRouter();

    const { origin, events, user } = props;
    const { baseApiUrl } = props;
    return (
        <Layout
            title="Next.js with Sequelize | Events Page"
            url={`${origin}${router.asPath}`}
            origin={origin}
        >
            <UserNav props={{ user: user }} />
            <small>
                <Link href="/event/add">
                    <a>+ Add event</a>
                </Link>   <label>     </label>

                <select name="events" id="events" onChange={(e) => onChangeHandler(e)}>
                    <option value="allEvents">All events</option>
                    <option value="myEvents">My events</option>
                </select>
            </small>
            <br></br>
            <Calendar
                className='calendar'
                localizer={localizer}
                events={[{
                    'title': 'My event',
                    'allDay': false,
                    'start': new Date(2022, 5, 21, 10, 0), // 10.00 AM Y-M-D-IH-FH
                    'end': new Date(2022, 5, 21, 16, 0), // 2.00 PM 
                }]}
                view='week'
                views={['week']}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 440, width: 1200 }}
            />
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
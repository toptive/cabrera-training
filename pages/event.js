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
import { clearConfigCache } from 'prettier';

const localizer = momentLocalizer(moment);


function Event(props) {
    const router = useRouter();
    const { origin, events, user } = props;
    const { baseApiUrl } = props;

    //Define all events
    let allEvents = events.data;
    
    
    //Define my events
    let myEvents = [];
    if (user === undefined) {
        Router.push({
            pathname: '/user/login'
        });
    } else {
        myEvents = events.data.map((event) => {
            if (user.id === event.user.id && event.title) {
                return {
                    title: event.title,
                    dateInit: new Date(Date.parse(event.dateInit)),
                    dateEnd: new Date(Date.parse(event.dateEnd))
                }
            }
        })
    }
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
                defaultView='month'
                events={myEvents}
                startAccessor={"dateInit"}
                endAccessor={"dateEnd"}
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
import React, { useState, useEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import FormEditJob from '../components/form/FormEditJob';
import moment from 'moment';


/* utils */
import { absoluteUrl, getAppCookies } from '../middleware/utils';

/* components */
import Layout from '../components/layout/Layout';
import FormEvent from '../components/form/FormEvent';

const localizer = momentLocalizer(moment);

/* event schemas */
const FORM_DATA_EVENT = {
    title: {
        value: '',
        label: 'Title',
        min: 10,
        max: 36,
        required: true,
        validator: {
            regEx: /^[a-z\sA-Z0-9\W\w]+$/,
            error: 'Please insert valid Title',
        },
    },
    description: {
        value: '',
        label: 'Description',
        min: 6,
        max: 1500,
        required: true,
        validator: {
            regEx: /^[a-z\sA-Z0-9\W\w]+$/,
            error: 'Please insert valid Description',
        },
    },
    day: {
        value: '',
        label: 'Day',
        min: Date.now(),
        required: true,
    },
};

function Event(props) {
    const router = useRouter();

    const { origin, post, token } = props;
    const { baseApiUrl } = props;

    const [loading, setLoading] = useState(false);
    const [stateFormData, setStateFormData] = useState(FORM_DATA_EVENT);
    const [stateFormError, setStateFormError] = useState([]);
    const [stateFormMessage, setStateFormMessage] = useState({});
    const [stateFormValid, setStateFormValid] = useState(false);

    async function onSubmitHandler(e) {
        e.preventDefault();

        let data = { ...stateFormData };

        /* title */
        data = { ...data, title: data.title.value || '' };
        /* description */
        data = { ...data, content: data.description.value || '' };
        /* day */
        data = { ...data, content: data.day.value || '' };

        /* validation handler */
        const isValid = validationHandler(stateFormData);

        if (isValid) {
            // Call an external API endpoint to get posts.
            // You can use any data fetching library
            setLoading(!loading);
            const eventApi = await fetch(`${baseApiUrl}/event/[slug]`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: token || '',
                },
                body: JSON.stringify(data),
            });

            let result = await eventApi.json();
            if (result.message && result.data && result.message === 'done') {
                router.push({
                    pathname: result.data.slug ? `/event/${result.data.slug}` : '/event',
                });
            } else {
                setStateFormMessage(result);
            }
            setLoading(false);
        }
    }

    function onChangeHandler(e) {
        const { name, value } = e.currentTarget;

        setStateFormData({
            ...stateFormData,
            [name]: {
                ...stateFormData[name],
                value,
            },
        });

        /* validation handler */
        validationHandler(stateFormData, e);
    }

    function validationHandler(states, e) {
        const input = (e && e.target.name) || '';
        const errors = [];
        let isValid = true;

        if (input) {
            if (states[input].required) {
                if (!states[input].value) {
                    errors[input] = {
                        hint: `${states[e.target.name].label} required`,
                        isInvalid: true,
                    };
                    isValid = false;
                }
            }
            if (
                states[input].value &&
                states[input].min > states[input].value.length
            ) {
                errors[input] = {
                    hint: `Field ${states[input].label} min ${states[input].min}`,
                    isInvalid: true,
                };
                isValid = false;
            }
            if (
                states[input].value &&
                states[input].max < states[input].value.length
            ) {
                errors[input] = {
                    hint: `Field ${states[input].label} max ${states[input].max}`,
                    isInvalid: true,
                };
                isValid = false;
            }
            if (
                states[input].validator !== null &&
                typeof states[input].validator === 'object'
            ) {
                if (
                    states[input].value &&
                    !states[input].validator.regEx.test(states[input].value)
                ) {
                    errors[input] = {
                        hint: states[input].validator.error,
                        isInvalid: true,
                    };
                    isValid = false;
                }
            }
        } else {
            Object.entries(states).forEach(item => {
                item.forEach(field => {
                    errors[item[0]] = '';
                    if (field.required) {
                        if (!field.value) {
                            errors[item[0]] = {
                                hint: `${field.label} required`,
                                isInvalid: true,
                            };
                            isValid = false;
                        }
                    }
                    if (field.value && field.min >= field.value.length) {
                        errors[item[0]] = {
                            hint: `Field ${field.label} min ${field.min}`,
                            isInvalid: true,
                        };
                        isValid = false;
                    }
                    if (field.value && field.max <= field.value.length) {
                        errors[item[0]] = {
                            hint: `Field ${field.label} max ${field.max}`,
                            isInvalid: true,
                        };
                        isValid = false;
                    }
                    if (field.validator !== null && typeof field.validator === 'object') {
                        if (field.value && !field.validator.regEx.test(field.value)) {
                            errors[item[0]] = {
                                hint: field.validator.error,
                                isInvalid: true,
                            };
                            isValid = false;
                        }
                    }
                });
            });
        }
        if (isValid) {
            setStateFormValid(isValid);
        }
        setStateFormError({
            ...errors,
        });
        return isValid;
    }

    function renderEventForm() {
        return (
            <>
                <FormEvent
                    onSubmit={onSubmitHandler}
                    onChange={onChangeHandler}
                    loading={loading}
                    stateFormData={stateFormData}
                    stateFormError={stateFormError}
                    stateFormValid={stateFormValid}
                    stateFormMessage={stateFormMessage}
                />
            </>
        );
    }
    return (
        <Layout>
            <div className='container'>
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
                    style={{ height: 500 }}
                />
                <div>
                    <button
                        type="submit"
                        className="btn btn-block btn-warning"
                    >
                    </button>
                </div>
            </div>
            <div className="container">
                <main className="content-detail">
                    {renderEventForm()}
                </main>
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
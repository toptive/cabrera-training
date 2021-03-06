import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';


/* utils */
import { absoluteUrl, getAppCookies } from "../../../middleware/utils";

/* components */
import Layout from "../../../components/layout/Layout";
import FormEditEvent from '../../../components/form/FormEditEvent';



function EditEvent(props) {
    const router = useRouter();

    const { origin, event, token } = props;
    const { baseApiUrl } = props;

    /* event schemas */
    const FORM_DATA_EVENT = {
        title: {
            value: event.data.title,
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
            value: event.data.description,
            label: 'Description',
            min: 6,
            max: 1500,
            required: true,
            validator: {
                regEx: /^[a-z\sA-Z0-9\W\w]+$/,
                error: 'Please insert valid Content',
            },
        },
        dateInit: {
            value: event.data.dateInit,
            label: 'Date Init',
            min: 6,
            max: 24,
            required: true,
            validator: {
                regEx: /^[a-z\sA-Z0-9\W\w]+$/,
                error: 'Please select a valid Date init',
            },
        },
        dateEnd: {
            value: event.data.dateEnd,
            label: 'Date End',
            min: 6,
            max: 24,
            required: true,
            validator: {
                regEx: /^[a-z\sA-Z0-9\W\w]+$/,
                error: 'Please insert valid Date end',
            },
        },
    };

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
        data = { ...data, description: data.description.value || '' };
        /* dateInit */
        data = { ...data, dateInit: data.dateInit.value || '' };
        /* dateEnd */
        data = { ...data, dateEnd: data.dateEnd.value || '' };

        /* validation handler */
        const isValid = validationHandler(stateFormData);

        if (data.dateEnd < data.dateInit) {
            Swal.fire({
                title: 'Date init must be less tha Date End',
                confirmButtonColor: '#CACBCB',
                confirmButtonText: 'Accept',
            });
            return;
        }

        if (isValid) {
            // Call an external API endpoint to get posts.
            // You can use any data fetching library
            setLoading(!loading);
            const eventApi = await fetch(`${baseApiUrl}/event/${event.data.id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: token || '',
                },
                body: JSON.stringify(data)
            });
            const result = await eventApi.json();

            if (result.message == 'success') {
                Swal.fire('Event Edited!', '', 'success');
                router.push({
                    pathname: '/event',
                });
            } else {
                Swal.fire({
                    title: 'Only the user can edit the event',
                    icon: 'info',
                    confirmButtonColor: '#CACBCB',
                    confirmButtonText: 'OK',
                })
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
                <Link
                    href={{
                        pathname: `/event/${event.data.slug}`,
                    }}
                >
                    <a>&larr; Back</a>
                </Link>
                <FormEditEvent
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
        <Layout
            title={`Next.js with Sequelize | Job Page - ${event.data &&
                event.data.title}`}
            url={`${origin}${router.asPath}`}
            origin={origin}
        >
            <div className="container">
                <main className="content-detail">
                    {router.asPath === `/event/edit/${event.data.slug}` ? renderEventForm() : '/event'},
                </main>
            </div>
        </Layout>
    );
}

/* getServerSideProps */
export async function getServerSideProps(context) {
    const { query, req } = context;
    const { origin } = absoluteUrl(req);

    const token = getAppCookies(req).token || '';
    const baseApiUrl = `${origin}/api`;

    let event = {};

    if (query.slug !== 'add') {
        const eventApi = await fetch(`${baseApiUrl}/event/${query.slug}`);
        event = await eventApi.json();
    }

    return {
        props: {
            origin,
            baseApiUrl,
            event,
            token,
        },
    };
}

export default EditEvent;
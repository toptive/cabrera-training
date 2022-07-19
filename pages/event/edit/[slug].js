import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';


/* utils */
import { absoluteUrl, getAppCookies } from "../../../middleware/utils";

/* components */
import Layout from "../../../components/layout/Layout";
import FormEditJob from '../../../components/form/FormEditJob';



function EditJob(props) {
    const router = useRouter();

    const { origin, job, token } = props;
    const { baseApiUrl } = props;

    /* post schemas */
    const FORM_DATA_JOB = {
        title: {
            value: job.data.title,
            label: 'Title',
            min: 10,
            max: 36,
            required: true,
            validator: {
                regEx: /^[a-z\sA-Z0-9\W\w]+$/,
                error: 'Please insert valid Title',
            },
        },
        content: {
            value: job.data.content,
            label: 'Content',
            min: 6,
            max: 1500,
            required: true,
            validator: {
                regEx: /^[a-z\sA-Z0-9\W\w]+$/,
                error: 'Please insert valid Content',
            },
        },
        reportManager: {
            value: job.data.reportManager,
            label: 'Content',
            min: 6,
            max: 1500,
            required: true,
            validator: {
                regEx: /^[a-z\sA-Z0-9\W\w]+$/,
                error: 'Please insert valid Report Manager',
            },
        },
        dateLimit: {
            value: job.data.dateLimit,
            label: 'Date',
            min: 6,
            max: 24,
            required: true,
            validator: {
                regEx: /^[a-z\sA-Z0-9\W\w]+$/,
                error: 'Please insert valid Date limit',
            },
        },
    };


    const [loading, setLoading] = useState(false);
    const [stateFormData, setStateFormData] = useState(FORM_DATA_JOB);
    const [stateFormError, setStateFormError] = useState([]);
    const [stateFormMessage, setStateFormMessage] = useState({});
    const [stateFormValid, setStateFormValid] = useState(false);

    async function onSubmitHandler(e) {
        e.preventDefault();

        let data = { ...stateFormData };

        /* title */
        data = { ...data, title: data.title.value || '' };
        /* content */
        data = { ...data, content: data.content.value || '' };
        /* reportManager */
        data = { ...data, reportManager: data.reportManager.value || '' };
        /* dateLimit */
        data = { ...data, dateLimit: data.dateLimit.value || '' };

        /* validation handler */
        const isValid = validationHandler(stateFormData);

        if (isValid) {
            // Call an external API endpoint to get posts.
            // You can use any data fetching library
            setLoading(!loading);
            const jobApi = await fetch(`${baseApiUrl}/job/${job.data.id}`, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: token || '',
                },
                body: JSON.stringify(data)
            });
            const result = await jobApi.json();

            if (result.message == 'success') {
                Swal.fire('Job Edited!', '', 'success');
                router.push({
                    pathname: '/job',
                });
            } else {
                Swal.fire({
                    title: 'Only the user can edit the job',
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

    function renderJobForm() {
        return (
            <>
                <Link
                    href={{
                        pathname: `/job/${job.data.slug}`,
                    }}
                >
                    <a>&larr; Back</a>
                </Link>
                <FormEditJob
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
            title={`Next.js with Sequelize | Job Page - ${job.data &&
                job.data.title}`}
            url={`${origin}${router.asPath}`}
            origin={origin}
        >
            <div className="container">
                <main className="content-detail">
                    {router.asPath === `/job/edit/${job.data.slug}` ? renderJobForm() : '/job'},
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

    let job = {};

    if (query.slug !== 'add') {
        const jobApi = await fetch(`${baseApiUrl}/job/${query.slug}`);
        job = await jobApi.json();
    }

    return {
        props: {
            origin,
            baseApiUrl,
            job,
            token,
        },
    };
}

export default EditJob;
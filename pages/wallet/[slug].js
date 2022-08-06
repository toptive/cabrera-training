import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


/* utils */
import { absoluteUrl, getAppCookies } from '../../middleware/utils';

/* components */
import Layout from '../../components/layout/Layout';
import AddBalance from '../../components/form/FormAddBalance';


/* wallet schemas */
const FORM_DATA_WALLET = {
    balance: {
        value: '',
        label: 'Balance',
        min: 10,
        max: 36,
        required: true,
        validator: {
            regEx: /^[a-z\sA-Z0-9\W\w]+$/,
            error: 'Please insert valid Balance',
        },
    },
};

function Wallet(props) {
    const router = useRouter();

    const { origin, wallet, user, token } = props;
    const { baseApiUrl } = props;

    const [loading, setLoading] = useState(false);
    const [stateFormData, setStateFormData] = useState(FORM_DATA_WALLET);
    const [stateFormError, setStateFormError] = useState([]);
    const [stateFormMessage, setStateFormMessage] = useState({});
    const [stateFormValid, setStateFormValid] = useState(false);

    async function onSubmitHandler(e) {
        e.preventDefault();

        let data = { ...stateFormData };

        /* balance */
        data = { ...data, balance: data.balance.value || '' };

        /* validation handler */
        const isValid = validationHandler(stateFormData);

        if (isValid) {
            // Call an external API endpoint to get wallet.
            // You can use any data fetching library
            setLoading(!loading);
            const walletApi = await fetch(`${baseApiUrl}/wallet/[slug]`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    authorization: token || '',
                },
                body: JSON.stringify(data),
            });

            let result = await walletApi.json();
            if (result.message && result.data && result.message === 'done') {
                router.push({
                    pathname: result.data.slug ? `/wallet/${result.data.slug}` : '/wallet',
                });
            } else {
                setStateFormMessage(result);
            }
            setLoading(false);
        }
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

    function renderWalletList() {
        return wallet.data ? (
            <div className="card">
                <Link
                    href={{
                        pathname: '/wallet',
                    }}
                >
                    <a>&larr; Back</a>
                </Link>
            </div>
        ) : (
            <div className="container">
                <div class="card">Data Not Found</div>
            </div>
        );
    }

    const [selectBalance, setSelectBalance] = useState(0);

    function onChangeHandler(e) {
        let select = e.target.value;
        if (select == '0') { setSelectBalance(0); }
        if (select == '50') { setSelectBalance(50); }
        if (select == '100') { setSelectBalance(100); }
        if (select == '500') { setSelectBalance(500); }
    }

    function renderWalletForm() {
        return (
            <>
                <Link
                    href={{
                        pathname: '/wallet',
                    }}
                >
                    <a>&larr; Back</a>
                </Link>
                <form className="form-post card">
                    <div className="form-group">
                        <h2>Form Add Balance</h2>
                        <hr />
                        <label htmlFor="balance">Balance</label>
                        <select name="balance" className="form-control" id="balance" onChange={(e) => onChangeHandler(e)}>
                            <option value="0">Select a mount.....</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                        </select>
                    </div>
                    <AddBalance
                        amount={selectBalance}
                        user={user}
                    />
                </form>
            </>
        );
    }


    return (
        <Layout
            title={`Next.js with Sequelize | Wallet Page - ${wallet.data &&
                wallet.data.title}`}
            url={`${origin}${router.asPath}`}
            origin={origin}
        >
            <div className="container">
                <main className="content-detail">
                    {router.asPath === '/wallet/add' ? renderWalletForm() : renderWalletList()}
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

    let wallet = {};

    if (query.slug !== 'add') {
        const walletApi = await fetch(`${baseApiUrl}/wallet/${query.slug}`);
        wallet = await walletApi.json();
    }

    return {
        props: {
            origin,
            baseApiUrl,
            wallet,
            token,
        },
    };
}

export default Wallet;

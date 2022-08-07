import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';


/* utils */
import { absoluteUrl, getAppCookies } from '../../middleware/utils';

/* components */
import Layout from '../../components/layout/Layout';
import AddBalance from '../../components/form/FormAddBalance';

function Wallet(props) {
    const router = useRouter();

    const { origin, wallet, user, token } = props;
    const { baseApiUrl } = props;

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

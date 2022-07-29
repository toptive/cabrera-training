import React, { useEffect } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

/* utils */
import { absoluteUrl, getAppCookies } from '../middleware/utils';

/* components */
import Layout from '../components/layout/Layout';
import UserNav from '../components/navigation/User';

function Wallet(props) {
  const router = useRouter();
  const { origin, user, wallets } = props;

  return (
    <Layout
      title="Next.js with Sequelize | Wallet Page"
      url={`${origin}${router.asPath}`}
      origin={origin}
    >
      <div className="container">
        <main>
          <h1 className="title">
            Sequelize &amp; <a href="https://nextjs.org">Next.js!</a>
          </h1>
          <p className="description">
            <img
              src="/sequelize.svg"
              alt="Sequelize"
              height="120"
              style={{ marginRight: '1rem' }}
            />
            <img src="/nextjs.svg" alt="Next.js" width="160" />
          </p>
          <UserNav props={{ user: user }} />

          <div className="grid">
            <small
              style={{
                textAlign: 'center',
                marginTop: '0rem',
                marginBottom: '1rem',
              }}
            >
              <Link href="/wallet/add">
                <a>+ Add balance</a>
              </Link>
            </small>
          </div>
        </main>
      </div>
    </Layout>
  );
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

  const walletsApi = await fetch(`${baseApiUrl}/wallet${nextPageUrl}`, {
    headers: {
      authorization: token || '',
    },
  });

  const wallets = await walletsApi.json();

  return {
    props: {
      origin,
      referer,
      token,
      wallets,
    },
  };
}

export default Wallet;

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { absoluteUrl, getAppCookies } from "../../../middleware/utils";
import Layout from "../../../components/layout/Layout";
import FormEdit from '../../../components/form/FormEdit';

/* post schemas */
const FORM_DATA_PUT = {
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
    content: {
        value: '',
        label: 'Content',
        min: 6,
        max: 1500,
        required: true,
        validator: {
            regEx: /^[a-z\sA-Z0-9\W\w]+$/,
            error: 'Please insert valid Content',
        },
    },
};

function EditPost(props) {

    const router = useRouter();
    const { origin, post, token } = props;
    const { baseApiUrl } = props;

    const [loading, setLoading] = useState(false);
    const [stateFormData, setStateFormData] = useState(FORM_DATA_PUT);
    const [stateFormError, setStateFormError] = useState([]);
    const [stateFormMessage, setStateFormMessage] = useState({});
    const [stateFormValid, setStateFormValid] = useState(false);

    function renderPostFormEdit() {
        return (
            <>
                <div className="card">
                    <Link
                        href={{
                            pathname: '/post',
                        }}
                    >
                        <a>&larr; Back</a>
                    </Link>

                    <FormEdit
                        //onSubmit={onSubmitHandler}
                        //onChange={onChangeHandler}
                        loading={loading}
                        stateFormData={stateFormData}
                        stateFormError={stateFormError}
                        stateFormValid={stateFormValid}
                        stateFormMessage={stateFormMessage}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <Layout>
                <div className="container">
                    {renderPostFormEdit()}
                </div>
            </Layout>
        </>
    );
}

export default EditPost;

// function EditPost(props) {
//     const router = useRouter();

//     const { origin, post, token } = props;
//     const { baseApiUrl } = props;

//     const [loading, setLoading] = useState(false);
//     const [stateFormData, setStateFormData] = useState(FORM_DATA_POST);
//     const [stateFormError, setStateFormError] = useState([]);
//     const [stateFormMessage, setStateFormMessage] = useState({});
//     const [stateFormValid, setStateFormValid] = useState(false);

//     function renderPostList() {
//         return post.data ? (
//           <div className="card">
//             <Link
//               href={{
//                 pathname: '/post',
//               }}
//             >
//               <a>&larr; Back</a>
//             </Link>
//             <h2
//               className="sub-title"
//               style={{
//                 display: 'block',
//                 marginTop: '.75rem',
//               }}
//             >
//               {post.data.title}
//               <small
//                 style={{
//                   display: 'block',
//                   fontWeight: 'normal',
//                   marginTop: '.75rem',
//                 }}
//               >
//                 Posted: {post.data.createdAt}
//               </small>
//             </h2>
//             <p>{post.data.content}</p>
//             <hr />
//             By: {post.data.user.firstName || ''} {post.data.user.lastName || ''}
//             <br />
//             <button className='btn btn-block' onClick={deletePost}>Delete</button>
//             <button className='btn btn-block' onClick={editPost}>Edit</button>
//           </div>
//         ) : (
//           <div className="container">
//             <div class="card">Data Not Found</div>
//           </div>
//         );
//       }

//     return (
//         <Layout
//           title={`Next.js with Sequelize | Post Page - ${post.data &&
//             post.data.title}`}
//           url={`${origin}${router.asPath}`}
//           origin={origin}
//         >
//           <div className="container">
//             <main className="content-detail">
//               {router.asPath === '/post/add' ? renderPostForm() : renderPostList()}
//             </main>
//           </div>
//         </Layout>
//       );
// }


// /* getServerSideProps */
// export async function getServerSideProps(context) {
//     const { query, req } = context;
//     const { origin } = absoluteUrl(req);

//     const token = getAppCookies(req).token || '';
//     const baseApiUrl = `${origin}/api`;

//     let post = {};

//     if (query.slug !== 'add') {
//         const postApi = await fetch(`${baseApiUrl}/post/edit/${query.slug}`);
//         post = await postApi.json();
//     }

//     return {
//         props: {
//             origin,
//             baseApiUrl,
//             post,
//             token,
//         },
//     };
// }
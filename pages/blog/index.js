import React, { Fragment } from 'react';
import Head from 'next/head';
import BlogSection from '../../components/BlogSection';
import { getArticles } from '../../utils/services';
import { SHOW_BLOG } from '../../utils/siteConfig';

const BlogPage = ({ articles }) => {
    const hasArticles = articles && articles.length > 0;

    return (
        <Fragment>
            <Head>
                <title>Blog | Wintek Consulting Group</title>
                {!SHOW_BLOG && <meta name="robots" content="noindex, nofollow" />}
            </Head>
            <div style={{ paddingTop: '120px' }}>
                {hasArticles ? (
                    <BlogSection articles={articles} />
                ) : (
                    <section className="wpo-blog-section">
                        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
                            <h2>Blog</h2>
                            <p>Muy pronto compartiremos aquí nuestros artículos.</p>
                        </div>
                    </section>
                )}
            </div>
        </Fragment>
    );
};

export default BlogPage;

export async function getStaticProps() {
    let articles = [];
    try {
        articles = await getArticles();
    } catch (e) {
        articles = [];
    }
    return {
        props: { articles },
        revalidate: 10,
    };
}

import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Container from "../../components/container";
import PostBody from "../../components/post-body";
import Header from "../../components/header";
import PostHeader from "../../components/post-header";
import Layout from "../../components/layout";
import PostTitle from "../../components/post-title";
import Head from "next/head";
import { CMS_NAME } from "../../lib/constants";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import { withBlur } from "../../lib/withBlur";
import { allPosts } from "../../fetched-data/allPosts";

export default function Post({ post, morePosts, preview }) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.ogImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
              />
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const post = allPosts.filter((post) => post.slug === params.slug)[0];

  const postsWithBlur = await withBlur(post, {
    condition: (key) => key === "url",
    urlPath: ["url"],
    propertiesPath: [],
  });

  const html = post.content;

  const htmlSourceTree = unified()
    .use(rehypeParse, { fragment: true })
    .parse(html);

  const content = await withBlur(htmlSourceTree, {
    condition: (key, value) => key === "tagName" && value === "img",
    urlPath: ["properties", "src"],
    propertiesPath: ["properties"],
  });

  return {
    props: {
      post: { ...postsWithBlur, content },
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: allPosts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}

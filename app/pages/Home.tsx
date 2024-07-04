import React, { useEffect } from 'react';
// @ts-expect-error TS(2307) FIXME: Cannot find module './Page' or its corresponding t... Remove this comment to see the full error message
import Page from './Page';
import { useImmer } from 'use-immer';
import axios from 'axios';
import LoadingDotsIcon from '@/components/common/LoadingDotsIcon';
// @ts-expect-error TS(2307) FIXME: Cannot find module '@/components/Post' or its corr... Remove this comment to see the full error message
import Post from '@/components/Post';
import { useUserInfo } from '@/store/store';

function Home() {
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await axios.post('/getHomeFeed', {
          token: useUserInfo().token,
        });
        setState((draft: $TSFixMe) => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (e) {
        console.log('There was a problem.');
      }
    }

    fetchData();

    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title="Your Feed">
      {state.feed.length > 0 && (
        <>
          <h2 className="text-center mb-4">
            The Latest From Those You Follow
          </h2>
          <div className="list-group">
            // @ts-expect-error TS(2304): Cannot find name '$TSFixMe'.
            {state.feed.map((post: $TSFixMe) => {
              return <Post post={post} key={post._id} />;
            })}
          </div>
        </>
      )}
      {state.feed.length == 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{useUserInfo().username}</strong>, your feed
            is empty.
          </h2>
          <p className="lead text-muted text-center">
            Your feed displays the latest posts from the people you
            follow. If you don&rsquo;t have any friends to follow
            that&rsquo;s okay; you can use the &ldquo;Search&rdquo;
            feature in the top menu bar to find content written by
            people with similar interests and then follow them.
          </p>
        </>
      )}
    </Page>
  );
}

export default Home;

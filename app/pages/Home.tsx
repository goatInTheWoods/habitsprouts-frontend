import React, { useEffect } from 'react';
import Page from './Page';
import { useImmer } from 'use-immer';
import axios from 'axios';
import LoadingDotsIcon from '@/components/common/LoadingDotsIcon';
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
        setState(draft => {
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
            {state.feed.map(post => {
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

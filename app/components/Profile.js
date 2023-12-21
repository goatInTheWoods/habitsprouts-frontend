import React, { useEffect } from 'react';
import Page from './common/Page';
import { useParams, NavLink, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ProfilePosts from './ProfilePosts';
import ProfileFollowers from './ProfileFollowers';
import ProfileFollowing from './ProfileFollowing';
import { useImmer } from 'use-immer';
import { useLoggedIn, useUserInfo } from '../store/store';

function Profile() {
  const loggedIn = useLoggedIn();
  const userInfo = useUserInfo();
  const { username } = useParams();
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: '...',
      profileAvatar: 'http://gravatar.com/avatar/placeholder?s=128',
      isFollowing: false,
      counts: {
        postCount: '',
        followerCount: '',
        followingCount: '',
      },
    },
  });

  useEffect(() => {
    const ourRequest = axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await axios.post(`/profile/${username}`, {
          token: userInfo.token,
        });
        setState(draft => {
          draft.profileData = response.data;
        });
      } catch (e) {
        console.log('There was a problem.');
      }
    }

    fetchData();

    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followingActionLoading = true;
      });

      const ourRequest = axios.CancelToken.source();

      async function fetchData() {
        try {
          const response = await axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: userInfo.token,
            }
          );
          setState(draft => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followingActionLoading = false;
          });
        } catch (e) {
          console.log('There was a problem.');
        }
      }

      fetchData();

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followingActionLoading = true;
      });

      const ourRequest = axios.CancelToken.source();

      async function fetchData() {
        try {
          const response = await axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: userInfo.token,
            }
          );
          setState(draft => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followingActionLoading = false;
          });
        } catch (e) {
          console.log('There was a problem.');
        }
      }

      fetchData();

      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  function startFollowing() {
    setState(draft => {
      draft.startFollowingRequestCount++;
    });
  }

  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingRequestCount++;
    });
  }

  return (
    <Page title="Profile Screen">
      <h2>
        <img
          className="avatar-small"
          src={state.profileData.profileAvatar}
        />{' '}
        {state.profileData.profileUsername}
        {loggedIn &&
          !state.profileData.isFollowing &&
          userInfo.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != '...' && (
            <button
              onClick={startFollowing}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}
        {loggedIn &&
          state.profileData.isFollowing &&
          userInfo.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != '...' && (
            <button
              onClick={stopFollowing}
              disabled={state.followActionLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              Stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to="" end className="nav-item nav-link">
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to="followers" className="nav-item nav-link">
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to="following" className="nav-item nav-link">
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Routes>
        <Route path="" element={<ProfilePosts />} />
        <Route path="followers" element={<ProfileFollowers />} />
        <Route path="following" element={<ProfileFollowing />} />
      </Routes>
    </Page>
  );
}

export default Profile;

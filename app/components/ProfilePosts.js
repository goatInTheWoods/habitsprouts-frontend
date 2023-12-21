import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingDotsIcon from './common/LoadingDotsIcon';
import Post from './Post';

function ProfilePosts() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get(
          `/profile/${username}/posts`
        );
        setPosts(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log('There was a problem.');
      }
    }

    fetchPosts();
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.length > 0 &&
        posts.map(post => {
          return <Post noAuthor={true} post={post} key={post._id} />;
        })}
    </div>
  );
}

export default ProfilePosts;

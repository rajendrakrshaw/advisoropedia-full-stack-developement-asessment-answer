// PostsList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button } from 'react-bootstrap';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/posts?page=${page}`);
        setPosts((prevPosts) => [...prevPosts, ...response.data]);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, [page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="bg-primary text-white min-vh-100 p-4">
      <div className="container">
        <h2 className="text-4xl font-bold mb-4">Posts List</h2>
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {posts.map((post, index) => (
            <div key={post._id} className="col">
              <Card className="bg-transparent border-0 rounded p-4 h-100">
                <Card.Body>
                  <Card.Title className="h2 mb-3">{post.title}</Card.Title>
                  <Card.Text>{post.body}</Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white text-dark text-center">
                  Post #{index + 1}
                </Card.Footer>
              </Card>
            </div>
          ))}
        </div>
        <Button onClick={handleLoadMore} variant="light" className="mt-4">
          Load More
        </Button>
      </div>
    </div>
  );
};

export default PostsList;

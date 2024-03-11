// LoginSignupForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './LoginSignupForm.css'; // Import your custom CSS file

const LoginSignupForm = ({ onLogin }) => {
  const [isLogin, setLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
         
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          console.log(data.token);
          onLogin(data.token);
          
          // setToken(data.token); // Store the token
        } else {
          setLogin(true);
        }

        history('/posts');
      } else {
        console.error(data.error);
        window.alert(data.error);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const toggleForm = () => {
    setLogin((prevLogin) => !prevLogin);
  };

  return (
    <Container className="modern-form-container">
      <Form onSubmit={handleSubmit} className="modern-form p-6 rounded-lg shadow-md bg-gray-100">
        <h2 className="modern-heading text-2xl mb-4">{isLogin ? 'Login' : 'Signup'}</h2>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            Email
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            Password
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Your Password"
              required
            />
          </Col>
        </Form.Group>

        {!isLogin && (
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Confirm Password
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </Col>
          </Form.Group>
        )}

        <Button type="submit" variant="primary" className="modern-button">
          {isLogin ? 'Login' : 'Signup'}
        </Button>
      </Form>

      <p className="modern-message mt-4">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <span onClick={toggleForm} className="modern-link cursor-pointer">
          {isLogin ? 'Signup here' : 'Login here'}
        </span>
      </p>
    </Container>
  );
};

export default LoginSignupForm;

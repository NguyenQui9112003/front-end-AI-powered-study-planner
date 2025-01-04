import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRefreshToken } from '../helpers/utility/refreshToken';
import '../css/profile.css'; // Custom CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Container, Row, Col, Card, Button, ListGroup, Form, ProgressBar } from 'react-bootstrap';

export const ProfilePage = () => {
    const navigate = useNavigate();
    const getRefreshToken = useRefreshToken();
    const [profile, setProfile] = useState({ username: '', email: '', isActive: false });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            const token = window.localStorage.getItem('token');
            if (!token) {
                navigate('/signIn');
                return;
            }
            const parsedToken = JSON.parse(token);
            let accessToken = parsedToken.access_token;
            const refreshToken = parsedToken.refresh_token;

            try {
                let response = await fetch('http://localhost:3000/auth/profile', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProfile({ username: data.username, email: data.email, isActive: data.isActive });
                } else if (response.status === 419) {
                    accessToken = await getRefreshToken(refreshToken);
                    if (accessToken) {
                        response = await fetch('http://localhost:3000/auth/profile', {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        });

                        if (response.ok) {
                            const data = await response.json();
                            setProfile({ username: data.username, email: data.email, isActive: data.isActive });
                        } else {
                            navigate('/signIn');
                        }
                    }
                } else {
                    navigate('/signIn');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                navigate('/signIn');
            }
        };

        fetchProfile();
    }, [getRefreshToken, navigate]);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            alert('New password and confirmation do not match.');
            return;
        }
        // Handle password change API call
        console.log('Password changed:', passwords);
    };

    return (
<>
<Container>
      <Row>
        <Col lg={4}>
          <Card>
            <Card.Body>
              <div className="d-flex flex-column align-items-center text-center">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar6.png"
                  alt="Admin"
                  className="rounded-circle p-1 bg-primary"
                  width="110"
                />
                <div className="mt-3">
                  <h4>John Doe</h4>
                  <p className="text-secondary mb-1">Full Stack Developer</p>
                  <p className="text-muted font-size-sm">Bay Area, San Francisco, CA</p>
                  <Button variant="primary">Follow</Button>
                  <Button variant="outline-primary" className="ms-2">Message</Button>
                </div>
              </div>
              <hr className="my-4" />
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h6 className="mb-0">Website</h6>
                  <span className="text-secondary">https://bootdey.com</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6 className="mb-0">Github</h6>
                  <span className="text-secondary">bootdey</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6 className="mb-0">Twitter</h6>
                  <span className="text-secondary">@bootdey</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6 className="mb-0">Instagram</h6>
                  <span className="text-secondary">bootdey</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <h6 className="mb-0">Facebook</h6>
                  <span className="text-secondary">bootdey</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8}>
          <Card>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={3}><h6 className="mb-0">Full Name</h6></Col>
                <Col sm={9}><Form.Control type="text" value="John Doe" /></Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3}><h6 className="mb-0">Email</h6></Col>
                <Col sm={9}><Form.Control type="text" value="john@example.com" /></Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3}><h6 className="mb-0">Phone</h6></Col>
                <Col sm={9}><Form.Control type="text" value="(239) 816-9029" /></Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3}><h6 className="mb-0">Mobile</h6></Col>
                <Col sm={9}><Form.Control type="text" value="(320) 380-4539" /></Col>
              </Row>
              <Row className="mb-3">
                <Col sm={3}><h6 className="mb-0">Address</h6></Col>
                <Col sm={9}><Form.Control type="text" value="Bay Area, San Francisco, CA" /></Col>
              </Row>
              <Row>
                <Col sm={3}></Col>
                <Col sm={9}>
                  <Button variant="primary" className="px-4">Save Changes</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="mt-4">
            <Card.Body>
              <h5 className="d-flex align-items-center mb-3">Project Status</h5>
              <p>Web Design</p>
              <ProgressBar now={80} variant="primary" className="mb-3" />
              <p>Website Markup</p>
              <ProgressBar now={72} variant="danger" className="mb-3" />
              <p>One Page</p>
              <ProgressBar now={89} variant="success" className="mb-3" />
              <p>Mobile Template</p>
              <ProgressBar now={55} variant="warning" className="mb-3" />
              <p>Backend API</p>
              <ProgressBar now={66} variant="info" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
</>
    );
};

export default ProfilePage;

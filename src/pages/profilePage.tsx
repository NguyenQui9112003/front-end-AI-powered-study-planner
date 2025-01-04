import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRefreshToken } from "../helpers/utility/refreshToken";
import "../css/profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import EmailVerificationModal from "@/components/features/profile/EmailVerificationModal";
import Header from "@/layouts/header";

export const ProfilePage = () => {
  const navigate = useNavigate();
  const getRefreshToken = useRefreshToken();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    isActive: false,
    hasPassword: true,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = window.localStorage.getItem("token");
      if (!token) {
        navigate("/signIn");
        return;
      }
      const parsedToken = JSON.parse(token);
      let accessToken = parsedToken.access_token;
      const refreshToken = parsedToken.refresh_token;

      try {
        let response = await fetch("http://localhost:3000/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfile({
            username: data.username,
            email: data.email,
            isActive: data.is_activated,
            hasPassword: data.hasPassword,
          });
        } else if (response.status === 419) {
          accessToken = await getRefreshToken(refreshToken);
          if (accessToken) {
            response = await fetch("http://localhost:3000/auth/profile", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setProfile({
                username: data.username,
                email: data.email,
                isActive: data.is_activated,
                hasPassword: data.hasPassword,
              });
            } else {
              navigate("/signIn");
            }
          }
        } else {
          navigate("/signIn");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/signIn");
      }
    };

    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const currentPassword =
      (form.elements.namedItem("current") as HTMLInputElement)?.value || "";
    const newPassword =
      (form.elements.namedItem("new") as HTMLInputElement)?.value || "";
    const confirmPassword =
      (form.elements.namedItem("confirm") as HTMLInputElement)?.value || "";

    console.log(form);

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    try {
      const token = JSON.parse(window.localStorage.getItem("token") || "{}");
      const response = await fetch(
        "http://localhost:3000/auth/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
          body: JSON.stringify({
            email: profile.email,
            currentPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password changed successfully!");
        profile.hasPassword = true;
        form.reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to change password."}`);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col lg={4}>
            <Card className="m-3 p-1">
              <Card.Body>
                <div className="d-flex flex-column align-items-center">
                  <img
                    src="/assets/user.png"
                    alt="Avatar"
                    className="rounded-circle p-1 bg-primary"
                    width="110"
                  />
                  <div className="mt-3">
                    <h4>{profile.username}</h4>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={8}>
            <Card className="m-3 p-1">
              <Card.Body>
                <Row className="text-start align-items-center">
                  <Col sm={3} className="fw-bold px-4">
                    Username
                  </Col>
                  <Col sm={9}>{profile.username || "None"}</Col>
                </Row>
                <hr className="my-3" />
                <Row className="text-start align-items-center">
                  <Col sm={3} className="fw-bold px-4">
                    Email
                  </Col>
                  <Col sm={9}>{profile.email || "None"}</Col>
                </Row>
                <hr className="my-3" />
                <Row className="text-start align-items-center">
                  <Col sm={3} className="fw-bold px-4">
                    Active
                  </Col>
                  <Col sm={6}>
                    {profile.isActive ? "Activated" : "Inactivated"}
                  </Col>
                  <Col sm={3} className="d-flex justify-content-end">
                    {!profile.isActive && (
                      <Button
                        variant="primary"
                        className="px-4"
                        onClick={handleShowModal}
                      >
                        Activate Account
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <EmailVerificationModal
              show={showModal}
              onHide={handleCloseModal}
            />
            <Card className="m-3 mt-4 p-1 text-start">
              <Card.Body>
                <Row className="text-center">
                  <h4>
                    {profile.isActive && !profile.hasPassword
                      ? "Create new password"
                      : "Change password"}
                  </h4>
                </Row>
                <Form onSubmit={handlePasswordChange}>
                  {!profile.hasPassword ? (
                    ""
                  ) : (
                    <Form.Group className="mb-3">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="current"
                        placeholder="Enter your current password"
                        required={true}
                      />
                    </Form.Group>
                  )}
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="new"
                      placeholder="Enter your new password"
                      required={true}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirm"
                      placeholder="Confirm your new password"
                      required={true}
                    />
                  </Form.Group>
                  <Row>
                    <Col className="d-flex justify-content-end">
                      <Button type="submit" variant="primary">
                        &nbsp; Submit &nbsp;
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfilePage;

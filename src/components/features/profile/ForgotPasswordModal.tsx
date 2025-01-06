import React, { useState } from 'react';
import {Row, Col, Modal, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/profile.css";
import bcrypt from 'bcryptjs';

const ForgotPasswordModal = ({ show, onHide }: any) => {
    const [step, setStep] = useState(1); // Step 1: Email input, Step 2: OTP input
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState({from_mail: "", entered: ""});
    const [error, setError] = useState("");

    const handleEmailSubmit = async () => {
        if (!email) {
            setError("Email is required!");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/auth/sendOTP", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('OTP received:', data.otp);
                setOtp((prevState) => ({
                    ...prevState,
                    from_mail: data.otp,
                }));
                setStep(2);
                setError("");
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || "Can't send OTP"}`);
            }
        } catch (error) {
            console.error("Error: ", error);
            alert("An unexpected error occurred.");
        }
        console.log('Sending OTP to email:', email);
    };

    const handleOtpSubmit = async () => {
        if (!otp.entered) {
            setError("OTP is required!");
            return;
        }
        console.log('Verifying OTP:', otp);
        try {
            const rightOTP = await bcrypt.compare(otp.entered, otp.from_mail);
            if (rightOTP) {
                console.log("OTP is correct", email);
                setStep(3);
            } else {
                console.log("OTP is incorrect");
                setError("The OTP you entered is incorrect.");
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
        }
    };

  const handlePasswordCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

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
        "http://localhost:3000/auth/createPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access_token}`,
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        alert("Password create successfully!");
        form.reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to create password."}`);
      }
    } catch (error) {
      console.error("Error creating password:", error);
      alert("An unexpected error occurred.");
    }
  }; 
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton={true}> 
                <Modal.Title>
                {step === 1
                    ? 'Enter Your Email'
                    : step === 2
                    ? 'Enter OTP'
                    : 'Create a New Password'
                }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {step === 1 && (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Enter your email, we will send an OTP</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    {error && <div className="text-danger">{error}</div>}
                    <Col className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleEmailSubmit}>
                            Submit
                        </Button>
                    </Col>
                </Form>
            )}

            {step === 2 && (
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Enter the OTP sent to {email}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="OTP"
                            value={otp.entered}
                            onChange={(e) =>
                                setOtp((prevState) => ({
                                    ...prevState,
                                    entered: e.target.value,
                                }))
                            }
                        />
                    </Form.Group>
                    {error && <div className="text-danger">{error}</div>}
                    <Col className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleOtpSubmit}>
                            Submit OTP
                        </Button>
                    </Col>
                </Form>
            )}

            {step === 3 && (
                <Form onSubmit={handlePasswordCreate}>
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
                    {error && <div className="text-danger">{error}</div>}
                    <Row>
                        <Col className="d-flex justify-content-end">
                            <Button type="submit" variant="primary">
                                Submit
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )}
            </Modal.Body>
        </Modal>
    );
};

export default ForgotPasswordModal;

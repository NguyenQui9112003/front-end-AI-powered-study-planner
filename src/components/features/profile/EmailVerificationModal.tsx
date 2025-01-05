import React, { useState } from 'react';
import { Col, Modal, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/profile.css";
import bcrypt from 'bcryptjs';

const EmailVerificationModal = ({ show, onHide }) => {
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

                const response = await fetch("http://localhost:3000/auth/verifyAccount", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });
                if (response.ok) {
                    alert("Account verified");
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message || "Can't send OTP"}`);
                }

                onHide(); 
            } else {
                console.log("OTP is incorrect");
                setError("The OTP you entered is incorrect.");
            }
        } catch (error) {
            console.error("Error during OTP verification:", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton={true}> 
                <Modal.Title>{step === 1 ? 'Enter Your Email' : 'Enter OTP'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {step === 1 ? (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter your email address</Form.Label>
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
                ) : (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Enter the OTP sent to your email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="OTP"
                                value={otp.entered}
                                onChange={(e) => setOtp((prevState) => ({
                                    ...prevState, 
                                    entered: e.target.value,
                                }))}
                            />
                        </Form.Group>
                        {error && <div className="text-danger">{error}</div>}
                        <Button variant="primary" onClick={handleOtpSubmit}>
                            Submit OTP
                        </Button>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default EmailVerificationModal;

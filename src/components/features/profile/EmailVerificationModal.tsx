import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Modal, Button, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/profile.css";
import bcrypt from 'bcryptjs';
import { useAuth } from '../../../helpers/context/authProvider';

const EmailVerificationModal = ({ show, onHide, email }: any) => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState({from_mail: "", entered: ""});
    const [error, setError] = useState("");
    const { logout } = useAuth();

    const sendOTPWithMail = async () => {
        console.log("send otppppppppp");
        try {
            const response = await fetch("https://be-ai-study-planner.onrender.com/auth/sendOTP", {
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

                const response = await fetch("https://be-ai-study-planner.onrender.com/auth/verifyAccount", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });
                if (response.ok) {
                    alert("Account verified");
                    // onAccountVerified();
                    onHide();
                    logout();
                    navigate(`/signIn`);
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
        <Modal show={show} onHide={onHide} onShow={sendOTPWithMail}>
            <Modal.Header closeButton={true}> 
                <Modal.Title>Account verification</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>OTP sent to {email}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter your OTP"
                            value={otp.entered}
                            onChange={(e) => setOtp((prevState) => ({
                                ...prevState, 
                                entered: e.target.value,
                            }))}
                        />
                    </Form.Group>
                    {error && <div className="text-danger">{error}</div>}
                    <Col className="d-flex justify-content-end">
                        <Button variant="primary" onClick={handleOtpSubmit}>
                            Submit OTP
                        </Button>
                    </Col>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EmailVerificationModal;

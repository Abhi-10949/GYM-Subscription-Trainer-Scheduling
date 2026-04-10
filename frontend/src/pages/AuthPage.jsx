import { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loginAdmin, loginMember, registerAdmin, registerMember } from "../services/authService";
import { readFileAsDataUrl } from "../utils/file";
import { saveAuth } from "../utils/storage";

const authConfig = {
  adminRegister: { title: "Admin Registration", action: registerAdmin, successPath: "/admin/dashboard" },
  adminLogin: { title: "Admin Login", action: loginAdmin, successPath: "/admin/dashboard" },
  memberRegister: { title: "Member Registration", action: registerMember, successPath: "/member/dashboard" },
  memberLogin: { title: "Member Login", action: loginMember, successPath: "/member/dashboard" }
};

function AuthPage({ mode }) {
  const { title, action, successPath } = authConfig[mode];
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    age: "",
    heightCm: "",
    weightKg: "",
    photoUrl: "",
    address: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isRegister = mode.includes("Register") || mode.includes("register");
  const isMember = mode.includes("member");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const photoUrl = await readFileAsDataUrl(file);
    setForm((current) => ({ ...current, photoUrl }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = isRegister
          ? isMember
          ? {
              ...form,
              age: form.age ? Number(form.age) : null,
              heightCm: form.heightCm ? Number(form.heightCm) : null,
              weightKg: form.weightKg ? Number(form.weightKg) : null
            }
          : { fullName: form.fullName, email: form.email, password: form.password, photoUrl: form.photoUrl }
        : { email: form.email, password: form.password };

      const response = await action(payload);
      saveAuth(response);
      navigate(successPath);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <Container className="py-5">
      <Card className="glass-card auth-shell border-0 p-4 mx-auto" style={{ maxWidth: "760px" }}>
        <div className="d-flex flex-column flex-lg-row gap-4 align-items-lg-start">
          <div className="auth-intro">
            <span className="soft-pill mb-3">{isMember ? "Customer Access" : "Administrator Access"}</span>
            <h2 className="section-title mb-3">{title}</h2>
            <p className="text-muted mb-4">
              {isRegister
                ? "Create your account, upload your photo, and unlock your personalized gym dashboard."
                : "Enter your credentials to continue into your dashboard and manage your gym journey."}
            </p>
            <div className="auth-side-panel">
              <h6 className="fw-bold mb-3">What you get inside</h6>
              <p className="mb-2 text-muted">Role-based dashboard</p>
              <p className="mb-2 text-muted">Profile photo support</p>
              <p className="mb-0 text-muted">Membership and trainer access</p>
            </div>
          </div>

          <div className="auth-form-panel">
            <h3 className="auth-card-title mb-4">{title}</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {isRegister && (
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control name="fullName" value={form.fullName} onChange={handleChange} required />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
          </Form.Group>

          {isRegister && !isMember && (
            <Form.Group className="mb-3">
              <Form.Label>Admin Photo</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
              {form.photoUrl && <img src={form.photoUrl} alt="Admin preview" className="upload-preview mt-3" />}
            </Form.Group>
          )}

          {isRegister && isMember && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" value={form.phone} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Control name="gender" value={form.gender} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control type="number" name="age" value={form.age} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Height (cm)</Form.Label>
                <Form.Control type="number" name="heightCm" value={form.heightCm} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Weight (kg)</Form.Label>
                <Form.Control type="number" name="weightKg" value={form.weightKg} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Photo</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handlePhotoChange} />
                {form.photoUrl && <img src={form.photoUrl} alt="Member preview" className="upload-preview mt-3" />}
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control as="textarea" rows={3} name="address" value={form.address} onChange={handleChange} />
              </Form.Group>
            </>
          )}

          <Button type="submit" className="btn btn-success rounded-pill px-4">
            Submit
          </Button>
        </Form>
          </div>
        </div>
      </Card>
    </Container>
  );
}

export default AuthPage;

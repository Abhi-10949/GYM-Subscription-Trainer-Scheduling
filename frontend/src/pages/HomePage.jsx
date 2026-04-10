import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function HomePage() {
  const heroShots = [
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
  ];
  const quotes = [
    "Your body can stand almost anything. It is your mind that you have to convince.",
    "Success starts with self-discipline and grows with consistency.",
    "A strong gym is built one focused member at a time."
  ];

  return (
    <Container className="py-5">
      <div className="hero-banner p-4 p-lg-5 mb-5">
        <Row className="align-items-center g-4">
          <Col lg={7}>
            <span className="soft-pill mb-3">Admin and Member Portal</span>
            <h1 className="display-5 fw-bold mt-3">Build your fitness community with a bold black-theme gym dashboard.</h1>
            <p className="lead mt-3 mb-4">
              Guests can explore packages and trainers, members can request memberships, and admins can manage the entire gym from one premium-looking workspace.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/member/register" className="btn btn-warning btn-lg rounded-pill px-4">
                Register Customer
              </Link>
              <Link to="/admin/register" className="btn btn-outline-light btn-lg rounded-pill px-4">
                Register Admin
              </Link>
            </div>
          </Col>
          <Col lg={5}>
            <div className="glass-card p-4">
              <h4 className="fw-bold">Guest Dashboard</h4>
              <ul className="mb-0 ps-3">
                <li>Explore premium membership packages</li>
                <li>View trainers with photo and experience</li>
                <li>Use BMI calculator before joining</li>
                <li>Login unlocks role-based dashboards</li>
                <li>Admin and member areas have different experiences</li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <div className="stat-card">
            <h6>Guest Zone</h6>
            <h3>Public Access</h3>
            <p className="mb-0 text-muted">Guests see packages, trainers, and motivation content until they log in.</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stat-card">
            <h6>Member Zone</h6>
            <h3>Smart Requests</h3>
            <p className="mb-0 text-muted">Members can update their profile, upload a photo, and send join requests to admin.</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stat-card">
            <h6>Admin Zone</h6>
            <h3>Full Control</h3>
            <p className="mb-0 text-muted">Admins can manage members, trainers, packages, requests, payments, and profile settings.</p>
          </div>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        {heroShots.map((image, index) => (
          <Col lg={6} key={image}>
            <div className="dashboard-photo-card home-photo-card" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.76)), url(${image})` }}>
              <h3 className="fw-bold mb-2">{index === 0 ? "Train Hard. Stay Focused." : "Shape Results With Purpose."}</h3>
              <p className="mb-0">{quotes[index]}</p>
            </div>
          </Col>
        ))}
      </Row>

      <div className="glass-card p-4 p-lg-5 mb-4">
        <Row className="g-4 align-items-center">
          <Col lg={7}>
            <h3 className="section-title mb-3">When no one is logged in</h3>
            <p className="text-muted mb-3">
              The landing page now acts like a public dashboard with premium package highlights, trainer discovery, and a simple join path for first-time visitors.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <span className="soft-pill">Premium Plans</span>
              <span className="soft-pill">Trainer Showcase</span>
              <span className="soft-pill">BMI Check</span>
            </div>
          </Col>
          <Col lg={5}>
            <div className="promo-panel">
              <h5 className="fw-bold mb-3">Why this dashboard feels stronger</h5>
              <p className="mb-2 text-muted">Black luxury visual style</p>
              <p className="mb-2 text-muted">More focused admin and member journeys</p>
              <p className="mb-0 text-muted">Cleaner onboarding for first-time users</p>
            </div>
          </Col>
        </Row>
      </div>

      <div className="glass-card p-4 p-lg-5 mb-4">
        <h3 className="section-title mb-4">Motivation Corner</h3>
        <Row className="g-4">
          {quotes.map((quote) => (
            <Col md={4} key={quote}>
              <div className="soft-check-card h-100">
                <h6 className="text-gold fw-bold mb-3">Daily Thought</h6>
                <p className="mb-0 text-muted">{quote}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <Row className="g-4">
        {[
          ["BMI Calculator", "Let visitors calculate body mass index before registering."],
          ["Membership Tracking", "Members can view request, payment, start date, and expiry details."],
          ["Premium Dashboard", "Logged-in admins and members see stronger black-theme workspaces tailored to their role."]
        ].map(([title, text]) => (
          <Col md={4} key={title}>
            <div className="feature-card p-4">
              <h5 className="fw-bold">{title}</h5>
              <p className="text-muted mb-0">{text}</p>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default HomePage;

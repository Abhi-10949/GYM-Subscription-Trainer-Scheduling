import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getPackages } from "../services/gymService";

function PackagesPage() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    getPackages().then(setPackages).catch(() => setPackages([]));
  }, []);

  return (
    <Container className="py-5">
      <div className="glass-card p-4 p-lg-5 mb-4">
        <span className="soft-pill mb-3">All Packages</span>
        <h2 className="section-title mb-2">Choose the plan that matches your training journey</h2>
        <p className="text-muted mb-0">
          Flexible pricing, stronger commitment, and premium support through expert trainers and admin-managed memberships.
        </p>
      </div>
      <Row className="g-4">
        {packages.map((item, index) => (
          <Col md={4} key={item.id}>
            <div className={`feature-card package-card p-4 package-tier-${(index % 3) + 1}`}>
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <span className="package-kicker">Fitness Plan</span>
                  <h4 className="fw-bold mt-2">{item.name}</h4>
                </div>
                <span className="soft-pill">{item.durationInMonths} months</span>
              </div>
              <h3 className="package-price mb-3">Rs. {item.price}</h3>
              <p className="text-muted">{item.description}</p>
              <ul className="package-points">
                <li>Access to gym floor and training guidance</li>
                <li>Admin-approved membership tracking</li>
                <li>Works with trainer preference selection</li>
              </ul>
              <div className="package-footer">
                <span>Best for disciplined members</span>
              </div>
            </div>
          </Col>
        ))}
        {!packages.length && <p className="text-muted">No packages added yet.</p>}
      </Row>
    </Container>
  );
}

export default PackagesPage;

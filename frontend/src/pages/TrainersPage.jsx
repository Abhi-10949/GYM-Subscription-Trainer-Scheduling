import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getTrainers } from "../services/gymService";

function TrainersPage() {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    getTrainers().then(setTrainers).catch(() => setTrainers([]));
  }, []);

  return (
    <Container className="py-5">
      <h2 className="section-title mb-4">Gym Trainers</h2>
      <Row className="g-4">
        {trainers.map((trainer) => (
          <Col md={4} key={trainer.id}>
            <div className="feature-card p-4">
              {trainer.photoUrl && <img src={trainer.photoUrl} alt={trainer.name} className="trainer-photo mb-3" />}
              <h4 className="fw-bold">{trainer.name}</h4>
              <p className="mb-1"><strong>Email:</strong> {trainer.email || "N/A"}</p>
              <p className="mb-1 text-muted">{trainer.specialization}</p>
              <p className="mb-1"><strong>Age:</strong> {trainer.age || "N/A"}</p>
              <p className="mb-1"><strong>Experience:</strong> {trainer.experienceYears} years</p>
              <p className="mb-1"><strong>Phone:</strong> {trainer.phone}</p>
              <p className="mb-0"><strong>Address:</strong> {trainer.address || "N/A"}</p>
            </div>
          </Col>
        ))}
        {!trainers.length && <p className="text-muted">No trainers added yet.</p>}
      </Row>
    </Container>
  );
}

export default TrainersPage;

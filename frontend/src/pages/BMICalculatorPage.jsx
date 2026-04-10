import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

function BMICalculatorPage() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const calculateBMI = (event) => {
    event.preventDefault();
    const heightMeters = Number(height) / 100;
    const bmi = Number(weight) / (heightMeters * heightMeters);

    let category = "Underweight";
    if (bmi >= 25) category = "Overweight";
    else if (bmi >= 18.5) category = "Normal";

    setResult({ bmi: bmi.toFixed(2), category });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card className="glass-card border-0 p-4">
            <h2 className="section-title mb-3">BMI Calculator</h2>
            <Form onSubmit={calculateBMI}>
              <Form.Group className="mb-3">
                <Form.Label>Height (cm)</Form.Label>
                <Form.Control type="number" value={height} onChange={(e) => setHeight(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Weight (kg)</Form.Label>
                <Form.Control type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required />
              </Form.Group>
              <Button type="submit" className="btn btn-success rounded-pill px-4">Calculate BMI</Button>
            </Form>
            {result && (
              <div className="mt-4 p-3 rounded-4 bg-light">
                <h5 className="mb-1">Your BMI: {result.bmi}</h5>
                <p className="mb-0 text-muted">Category: {result.category}</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default BMICalculatorPage;

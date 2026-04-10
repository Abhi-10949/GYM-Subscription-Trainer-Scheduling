import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { changePassword, createMembershipRequest, getMemberByClientId, getMembershipsByClientId, getPackages, getTrainers, updateMember } from "../services/gymService";
import { readFileAsDataUrl } from "../utils/file";
import { getAuth, saveAuth } from "../utils/storage";

function MemberDashboard() {
  const auth = getAuth();
  const [profile, setProfile] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [packages, setPackages] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [profileForm, setProfileForm] = useState({});
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [requestForm, setRequestForm] = useState({ packageId: "", trainerId: "" });
  const memberShots = [
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1200&q=80"
  ];

  useEffect(() => {
    if (!auth?.clientId) return;
    Promise.all([getMemberByClientId(auth.clientId), getMembershipsByClientId(auth.clientId), getPackages(), getTrainers()])
      .then(([profileData, membershipData, packagesData, trainersData]) => {
        setProfile(profileData);
        setProfileForm(profileData);
        setMemberships(membershipData);
        setPackages(packagesData);
        setTrainers(trainersData);
        setRequestForm({
          packageId: profileData.preferredPackageId || "",
          trainerId: profileData.preferredTrainerId || ""
        });
      })
      .catch(() => setMessage("Could not load member data."));
  }, [auth?.clientId]);

  const handleProfileUpdate = async (event) => {
    event?.preventDefault();
    const updated = await updateMember(auth.clientId, profileForm);
    setProfile(updated);
    saveAuth({ ...getAuth(), name: updated.fullName, photoUrl: updated.photoUrl });
    setMessage("Profile updated successfully.");
  };

  const handleMemberPhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const photoUrl = await readFileAsDataUrl(file);
    setProfileForm((current) => ({ ...current, photoUrl }));
  };

  const handlePreferenceSave = async () => {
    const updated = await updateMember(auth.clientId, {
      preferredPackageId: requestForm.packageId ? Number(requestForm.packageId) : null,
      preferredTrainerId: requestForm.trainerId ? Number(requestForm.trainerId) : null
    });
    setProfile(updated);
    setProfileForm(updated);
    setMessage("Package and trainer preferences saved.");
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    await changePassword(auth.clientId, passwordForm);
    setPasswordForm({ currentPassword: "", newPassword: "" });
    setMessage("Password changed successfully.");
  };

  const refreshMemberData = async () => {
    const [profileData, membershipData, packagesData, trainersData] = await Promise.all([
      getMemberByClientId(auth.clientId),
      getMembershipsByClientId(auth.clientId),
      getPackages(),
      getTrainers()
    ]);
    setProfile(profileData);
    setProfileForm(profileData);
    setMemberships(membershipData);
    setPackages(packagesData);
    setTrainers(trainersData);
  };

  const handleJoinRequest = async (event) => {
    event.preventDefault();
    if (!requestForm.packageId) {
      setMessage("Please choose a package before sending the request.");
      return;
    }

    await updateMember(auth.clientId, {
      preferredPackageId: Number(requestForm.packageId),
      preferredTrainerId: requestForm.trainerId ? Number(requestForm.trainerId) : null
    });

    await createMembershipRequest({
      clientId: auth.clientId,
      packageId: Number(requestForm.packageId),
      trainerId: requestForm.trainerId ? Number(requestForm.trainerId) : null
    });

    await refreshMemberData();
    setMessage("Membership join request sent to admin successfully.");
  };

  if (!profile) {
    return <Container className="py-5"><p>Loading member dashboard...</p></Container>;
  }

  const preferredPackage = packages.find((item) => item.id === profile.preferredPackageId);
  const preferredTrainer = trainers.find((item) => item.id === profile.preferredTrainerId);
  const hasMembership = memberships.length > 0;
  const latestRequest = memberships[0];
  const hasPendingRequest = memberships.some((item) => item.requestStatus === "PENDING");
  const statusBadgeClass = (value) => {
    if (value === "APPROVED" || value === "ACTIVE" || value === "PAID") return "badge-soft badge-soft-success";
    if (value === "PENDING" || value === "REQUESTED") return "badge-soft badge-soft-warning";
    if (value === "REJECTED" || value === "EXPIRED") return "badge-soft badge-soft-danger";
    return "badge-soft";
  };

  const paymentLabel = (value) => {
    if (value === "PAID") return "Paid";
    if (value === "PENDING") return "Payment Due";
    if (value === "REJECTED") return "Not Applicable";
    return value || "-";
  };

  return (
    <Container className="py-5">
      <div className="glass-card p-4 p-lg-5 mb-4 member-hero">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-4 align-items-lg-center">
          <div>
            <span className="soft-pill mb-3">Member Space</span>
            <h2 className="section-title mb-2">Welcome, {profile.fullName}</h2>
            <p className="mb-0 text-muted">
              Keep your profile updated, choose your preferred package and trainer, and track your membership journey from one place.
            </p>
          </div>
          <div className="dashboard-grid dashboard-mini-grid">
            <div className="stat-card"><h6>Memberships</h6><h3>{memberships.length}</h3></div>
            <div className="stat-card"><h6>Packages to Explore</h6><h3>{packages.length}</h3></div>
          </div>
        </div>
      </div>
      {message && <Alert variant="success">{message}</Alert>}

      <Row className="g-4 mb-4">
        {memberShots.map((image, index) => (
          <Col lg={6} key={image}>
            <div className="dashboard-photo-card" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.72)), url(${image})` }}>
              <h4 className="fw-bold mb-2">{index === 0 ? "Train With Intention" : "Progress With Confidence"}</h4>
              <p className="mb-0">{index === 0 ? "Your next step gets easier when your plan is clear." : "Stay consistent, request your membership, and let the system guide your journey."}</p>
            </div>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={5}>
          <Card className="glass-card border-0 p-4 h-100">
            <h5 className="fw-bold mb-3">My Profile</h5>
            {profile.photoUrl && <img src={profile.photoUrl} alt={profile.fullName} className="member-profile-photo mb-3" />}
            <p className="mb-1"><strong>Client ID:</strong> {profile.clientId}</p>
            <p className="mb-1"><strong>Name:</strong> {profile.fullName}</p>
            <p className="mb-1"><strong>Email:</strong> {profile.email}</p>
            <p className="mb-1"><strong>Phone:</strong> {profile.phone || "N/A"}</p>
            <p className="mb-0"><strong>Joined:</strong> {profile.joinedAt}</p>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="glass-card border-0 p-4">
            <h5 className="fw-bold mb-3">Update Profile</h5>
            <Form onSubmit={handleProfileUpdate}>
              <Row className="g-3">
                <Col md={6}><Form.Control placeholder="Full name" value={profileForm.fullName || ""} onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })} /></Col>
                <Col md={6}><Form.Control placeholder="Phone" value={profileForm.phone || ""} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} /></Col>
                <Col md={6}><Form.Control placeholder="Gender" value={profileForm.gender || ""} onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })} /></Col>
                <Col md={6}><Form.Control type="number" placeholder="Age" value={profileForm.age || ""} onChange={(e) => setProfileForm({ ...profileForm, age: Number(e.target.value) })} /></Col>
                <Col md={6}><Form.Control type="number" placeholder="Height in cm" value={profileForm.heightCm || ""} onChange={(e) => setProfileForm({ ...profileForm, heightCm: Number(e.target.value) })} /></Col>
                <Col md={6}><Form.Control type="number" placeholder="Weight in kg" value={profileForm.weightKg || ""} onChange={(e) => setProfileForm({ ...profileForm, weightKg: Number(e.target.value) })} /></Col>
                <Col md={12}><Form.Control type="file" accept="image/*" onChange={handleMemberPhotoChange} /></Col>
                <Col md={12}><Form.Control as="textarea" rows={3} placeholder="Address" value={profileForm.address || ""} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} /></Col>
              </Row>
              <Button type="submit" className="btn btn-success rounded-pill px-4 mt-3">Save Changes</Button>
            </Form>
          </Card>
        </Col>
      </Row>

      {!hasMembership && (
        <Card className="glass-card border-0 p-4 mt-4 empty-state-card">
          <h4 className="fw-bold mb-3">You have not joined a membership yet</h4>
          <p className="text-muted mb-4">
            Choose the package and trainer you prefer below, then send a join request to the admin for approval.
          </p>
          <Row className="g-4 align-items-stretch">
            <Col md={6}>
              <div className="soft-check-card h-100">
                <h6 className="fw-bold">Selected Package</h6>
                <p className="mb-0 text-muted">{preferredPackage ? `${preferredPackage.name} for Rs. ${preferredPackage.price}` : "No package selected yet."}</p>
              </div>
            </Col>
            <Col md={6}>
              <div className="soft-check-card h-100">
                <h6 className="fw-bold">Selected Trainer</h6>
                <p className="mb-0 text-muted">{preferredTrainer ? `${preferredTrainer.name} - ${preferredTrainer.specialization}` : "No trainer selected yet."}</p>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      <Card className="glass-card border-0 p-4 mt-4">
        <h5 className="fw-bold mb-3">Choose Package and Trainer</h5>
        <Form onSubmit={handleJoinRequest}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label>Preferred Package</Form.Label>
              <Form.Select
                value={requestForm.packageId}
                onChange={(e) => setRequestForm({ ...requestForm, packageId: e.target.value })}
              >
                <option value="">Select package</option>
                {packages.map((item) => <option key={item.id} value={item.id}>{item.name} - Rs. {item.price}</option>)}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Preferred Trainer</Form.Label>
              <Form.Select
                value={requestForm.trainerId}
                onChange={(e) => setRequestForm({ ...requestForm, trainerId: e.target.value })}
              >
                <option value="">Select trainer</option>
                {trainers.map((item) => <option key={item.id} value={item.id}>{item.name} - {item.specialization}</option>)}
              </Form.Select>
            </Col>
          </Row>
          <div className="d-flex flex-wrap gap-3 mt-3">
            <Button type="submit" className="btn btn-outline-success rounded-pill px-4" disabled={hasPendingRequest}>Send Join Request</Button>
            <Button type="button" variant="outline-secondary" className="rounded-pill px-4" onClick={handlePreferenceSave}>
              Save Preferences Only
            </Button>
          </div>
          {hasPendingRequest && <p className="text-muted mt-3 mb-0">You already have a pending request. Wait for admin approval before sending a new one.</p>}
        </Form>
      </Card>

      <Card className="glass-card border-0 p-4 mt-4">
        <h5 className="fw-bold mb-3">Request Status</h5>
        {latestRequest ? (
          <div className="dashboard-grid">
            <div className="soft-check-card">
              <strong>Approval Status</strong>
              <p className="mb-0 mt-2"><span className={statusBadgeClass(latestRequest.requestStatus)}>{latestRequest.requestStatus || "Not Available"}</span></p>
            </div>
            <div className="soft-check-card">
              <strong>Membership Status</strong>
              <p className="mb-0 mt-2"><span className={statusBadgeClass(latestRequest.status)}>{latestRequest.status || "Not Available"}</span></p>
            </div>
            <div className="soft-check-card">
              <strong>Admin Remarks</strong>
              <p className="mb-0 mt-2 text-muted">{latestRequest.adminRemarks || "No remarks yet."}</p>
            </div>
            <div className="soft-check-card">
              <strong>Payment Status</strong>
              <p className="mb-0 mt-2"><span className={statusBadgeClass(latestRequest.paymentStatus)}>{paymentLabel(latestRequest.paymentStatus) || "Not Available"}</span></p>
            </div>
          </div>
        ) : (
          <p className="text-muted mb-0">You have not sent any join request yet.</p>
        )}
      </Card>

      <Card className="glass-card border-0 p-4 mt-4">
        <h5 className="fw-bold mb-3">My Membership Details</h5>
        <div className="table-responsive table-shell">
          <Table hover>
            <thead>
              <tr>
                <th>Package</th>
                <th>Trainer</th>
                <th>Request</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((item) => (
                <tr key={item.id}>
                  <td>{item.gymPackage?.name}</td>
                  <td>{item.trainer?.name || "Not Assigned"}</td>
                  <td><span className={statusBadgeClass(item.requestStatus)}>{item.requestStatus || "-"}</span></td>
                  <td>{item.startDate}</td>
                  <td>{item.endDate}</td>
                  <td><span className={statusBadgeClass(item.status)}>{item.status}</span></td>
                  <td><span className={statusBadgeClass(item.paymentStatus)}>{paymentLabel(item.paymentStatus)}</span></td>
                </tr>
              ))}
              {!memberships.length && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No membership assigned yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <Card className="glass-card border-0 p-4 mt-4">
        <h5 className="fw-bold mb-3">Change Password</h5>
        <Form onSubmit={handlePasswordChange}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Control type="password" placeholder="Current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
            </Col>
            <Col md={6}>
              <Form.Control type="password" placeholder="New password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
            </Col>
          </Row>
          <Button type="submit" className="btn btn-warning rounded-pill px-4 mt-3">Update Password</Button>
        </Form>
      </Card>
    </Container>
  );
}

export default MemberDashboard;

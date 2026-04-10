import { useEffect, useRef, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Table } from "react-bootstrap";
import { addMembership, addPackage, addTrainer, decideMembershipRequest, deleteTrainer, getAdminById, getMembers, getMemberships, getPackages, getPendingMembershipRequests, getTrainers, searchMembers, updateAdmin, updateMembership, updatePackage, updateTrainer } from "../services/gymService";
import { readFileAsDataUrl } from "../utils/file";
import { getAuth, saveAuth } from "../utils/storage";

function AdminDashboard() {
  const auth = getAuth();
  const [adminProfile, setAdminProfile] = useState(null);
  const [packages, setPackages] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [decisionNotes, setDecisionNotes] = useState({});
  const [editingTrainerId, setEditingTrainerId] = useState(null);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [editingMembershipId, setEditingMembershipId] = useState(null);
  const trainerFormRef = useRef(null);
  const packageFormRef = useRef(null);
  const membershipFormRef = useRef(null);
  const dashboardShots = [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80"
  ];
  const thoughts = [
    "Discipline is choosing what you want most over what you want now.",
    "Strong systems create strong members.",
    "Every registration is the start of a transformation."
  ];

  const [packageForm, setPackageForm] = useState({ name: "", durationInMonths: "", price: "", description: "" });
  const [trainerForm, setTrainerForm] = useState({ name: "", email: "", specialization: "", phone: "", age: "", experienceYears: "", address: "", photoUrl: "" });
  const [membershipForm, setMembershipForm] = useState({ clientId: "", packageId: "", trainerId: "", startDate: "", endDate: "", status: "ACTIVE", paymentStatus: "PENDING" });
  const [adminForm, setAdminForm] = useState({ fullName: auth?.name || "", photoUrl: auth?.photoUrl || "" });
  const hasAnyData = packages.length || trainers.length || members.length || memberships.length;
  const getPackageName = (packageId) => packages.find((item) => item.id === packageId)?.name || "Not Chosen";
  const getTrainerName = (trainerId) => trainers.find((item) => item.id === trainerId)?.name || "Not Chosen";

  const loadData = async () => {
    const [packagesData, trainersData, membersData, membershipsData, pendingRequestsData, adminData] = await Promise.all([
      getPackages(),
      getTrainers(),
      getMembers(),
      getMemberships(),
      getPendingMembershipRequests(),
      getAdminById(auth.id)
    ]);
    setPackages(packagesData);
    setTrainers(trainersData);
    setMembers(membersData);
    setMemberships(membershipsData);
    setPendingRequests(pendingRequestsData);
    setAdminProfile(adminData);
    setAdminForm({ fullName: adminData.fullName, photoUrl: adminData.photoUrl || "" });
  };

  useEffect(() => {
    loadData().catch(() => setMessage("Could not load dashboard data. Start backend and MySQL first."));
  }, []);

  const submitPackage = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...packageForm,
        durationInMonths: Number(packageForm.durationInMonths),
        price: Number(packageForm.price)
      };

      if (editingPackageId) {
        await updatePackage(editingPackageId, payload);
        setMessage("Package updated successfully.");
      } else {
        await addPackage(payload);
        setMessage("Package added successfully.");
      }

      setPackageForm({ name: "", durationInMonths: "", price: "", description: "" });
      setEditingPackageId(null);
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Package action failed. Please try again.");
    }
  };

  const submitTrainer = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...trainerForm,
        age: trainerForm.age ? Number(trainerForm.age) : null,
        experienceYears: trainerForm.experienceYears ? Number(trainerForm.experienceYears) : null
      };

      if (editingTrainerId) {
        await updateTrainer(editingTrainerId, payload);
        setMessage("Trainer updated successfully.");
      } else {
        await addTrainer(payload);
        setMessage("Trainer added successfully.");
      }

      setTrainerForm({ name: "", email: "", specialization: "", phone: "", age: "", experienceYears: "", address: "", photoUrl: "" });
      setEditingTrainerId(null);
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Trainer action failed. Please try again.");
    }
  };

  const submitMembership = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...membershipForm,
        packageId: Number(membershipForm.packageId),
        trainerId: membershipForm.trainerId ? Number(membershipForm.trainerId) : null
      };

      if (editingMembershipId) {
        await updateMembership(editingMembershipId, payload);
        setMessage("Membership updated successfully.");
      } else {
        await addMembership(payload);
        setMessage("Membership added successfully.");
      }

      setMembershipForm({ clientId: "", packageId: "", trainerId: "", startDate: "", endDate: "", status: "ACTIVE", paymentStatus: "PENDING" });
      setEditingMembershipId(null);
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Membership action failed. Please try again.");
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchKeyword.trim()) {
      loadData();
      return;
    }
    const data = await searchMembers(searchKeyword);
    setMembers(data);
  };

  const handleDecision = async (membershipId, decision) => {
    await decideMembershipRequest(membershipId, {
      decision,
      adminRemarks: decisionNotes[membershipId] || ""
    });
    setMessage(`Request ${decision.toLowerCase()} successfully.`);
    loadData();
  };

  const handleImageChange = (setter, field) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const photoUrl = await readFileAsDataUrl(file);
    setter((current) => ({ ...current, [field]: photoUrl }));
  };

  const handleAdminProfileUpdate = async (event) => {
    event.preventDefault();
    const updated = await updateAdmin(auth.id, adminForm);
    setAdminProfile(updated);
    saveAuth({ ...getAuth(), name: updated.fullName, photoUrl: updated.photoUrl });
    setMessage("Admin profile updated successfully.");
  };

  const handleTrainerEdit = (trainer) => {
    setEditingTrainerId(trainer.id);
    setTrainerForm({
      name: trainer.name || "",
      email: trainer.email || "",
      specialization: trainer.specialization || "",
      phone: trainer.phone || "",
      age: trainer.age || "",
      experienceYears: trainer.experienceYears || "",
      address: trainer.address || "",
      photoUrl: trainer.photoUrl || ""
    });
    trainerFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setMessage(`Editing trainer: ${trainer.name}`);
  };

  const handleTrainerDelete = async (trainerId) => {
    try {
      await deleteTrainer(trainerId);
      if (editingTrainerId === trainerId) {
        setEditingTrainerId(null);
        setTrainerForm({ name: "", email: "", specialization: "", phone: "", age: "", experienceYears: "", address: "", photoUrl: "" });
      }
      setMessage("Trainer removed successfully.");
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Trainer could not be removed.");
    }
  };

  const handlePackageEdit = (pkg) => {
    setEditingPackageId(pkg.id);
    setPackageForm({
      name: pkg.name || "",
      durationInMonths: pkg.durationInMonths || "",
      price: pkg.price || "",
      description: pkg.description || ""
    });
    packageFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setMessage(`Editing package: ${pkg.name}`);
  };

  const handleMembershipEdit = (membership) => {
    setEditingMembershipId(membership.id);
    setMembershipForm({
      clientId: membership.member?.clientId || "",
      packageId: membership.gymPackage?.id || "",
      trainerId: membership.trainer?.id || "",
      startDate: membership.startDate || "",
      endDate: membership.endDate || "",
      status: membership.status || "ACTIVE",
      paymentStatus: membership.paymentStatus || "PENDING"
    });
    membershipFormRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setMessage(`Editing membership for: ${membership.member?.fullName || membership.member?.clientId}`);
  };

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
      <div className="glass-card p-4 p-lg-5 mb-4 admin-hero">
        <div className="d-flex flex-column flex-lg-row justify-content-between gap-4 align-items-lg-center">
          <div>
            <span className="soft-pill mb-3">Administrator Workspace</span>
            <h2 className="section-title mb-2">Welcome back, {adminProfile?.fullName || auth?.name || "Admin"}</h2>
            <p className="mb-0 text-muted">
              Manage gym operations, create packages, assign trainers, and monitor how members are engaging with the platform.
            </p>
          </div>
          <div className="dashboard-grid dashboard-mini-grid">
            <div className="stat-card"><h6>Packages</h6><h3>{packages.length}</h3></div>
            <div className="stat-card"><h6>Trainers</h6><h3>{trainers.length}</h3></div>
          </div>
        </div>
      </div>
      {message && <Alert variant="info">{message}</Alert>}

      <div className="dashboard-grid mb-5">
        <div className="stat-card"><h6>Total Packages</h6><h3>{packages.length}</h3></div>
        <div className="stat-card"><h6>Total Trainers</h6><h3>{trainers.length}</h3></div>
        <div className="stat-card"><h6>Total Members</h6><h3>{members.length}</h3></div>
        <div className="stat-card"><h6>Total Memberships</h6><h3>{memberships.length}</h3></div>
      </div>

      <Row className="g-4 mb-4">
        {dashboardShots.map((image, index) => (
          <Col lg={6} key={image}>
            <div className="dashboard-photo-card" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.72)), url(${image})` }}>
              <h4 className="fw-bold mb-2">{index === 0 ? "Lead Your Gym Better" : "Build Member Trust"}</h4>
              <p className="mb-0">{thoughts[index]}</p>
            </div>
          </Col>
        ))}
      </Row>

      {!hasAnyData && (
        <Card className="glass-card border-0 p-4 mb-5 empty-state-card">
          <h4 className="fw-bold mb-3">Your gym dashboard is ready for first-time setup</h4>
          <p className="text-muted mb-3">
            No one has registered yet. Start by adding a few packages and trainers, then members will be able to sign up and choose what suits them.
          </p>
          <div className="dashboard-grid">
            <div className="soft-check-card">
              <strong>Step 1</strong>
              <p className="mb-0 mt-2 text-muted">Create monthly, quarterly, and annual packages.</p>
            </div>
            <div className="soft-check-card">
              <strong>Step 2</strong>
              <p className="mb-0 mt-2 text-muted">Add trainers with specialization and experience.</p>
            </div>
            <div className="soft-check-card">
              <strong>Step 3</strong>
              <p className="mb-0 mt-2 text-muted">Wait for members to register, then assign memberships.</p>
            </div>
          </div>
        </Card>
      )}

      <Row className="g-4">
        <Col lg={4} ref={trainerFormRef}>
          <Card className="glass-card border-0 p-4 h-100">
            <h5 className="fw-bold mb-3">Admin Profile</h5>
            <div className="d-flex align-items-center gap-3 mb-3">
              {(adminForm.photoUrl || adminProfile?.photoUrl) ? (
                <img src={adminForm.photoUrl || adminProfile?.photoUrl} alt={adminProfile?.fullName} className="profile-avatar profile-avatar-lg" />
              ) : (
                <div className="profile-avatar profile-avatar-lg avatar-fallback">{(adminProfile?.fullName || "A").slice(0, 1).toUpperCase()}</div>
              )}
              <div>
                <h6 className="mb-1">{adminProfile?.fullName || auth?.name}</h6>
                <p className="mb-0 text-muted">{adminProfile?.email || auth?.email}</p>
              </div>
            </div>
            <Form onSubmit={handleAdminProfileUpdate}>
              <Form.Control className="mb-3" placeholder="Admin name" value={adminForm.fullName} onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })} />
              <Form.Control className="mb-3" type="file" accept="image/*" onChange={handleImageChange(setAdminForm, "photoUrl")} />
              <Button type="submit" className="btn btn-outline-success rounded-pill px-4">Update Profile</Button>
            </Form>
          </Card>
        </Col>

        <Col lg={4} ref={packageFormRef}>
          <Card className="glass-card border-0 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">{editingPackageId ? "Edit Package" : "Add Package"}</h5>
              {editingPackageId && (
                <Button size="sm" variant="outline-light" onClick={() => {
                  setEditingPackageId(null);
                  setPackageForm({ name: "", durationInMonths: "", price: "", description: "" });
                }}>
                  Cancel
                </Button>
              )}
            </div>
            <Form onSubmit={submitPackage}>
              <Form.Control className="mb-3" placeholder="Package name" value={packageForm.name} onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })} required />
              <Form.Control className="mb-3" type="number" placeholder="Duration in months" value={packageForm.durationInMonths} onChange={(e) => setPackageForm({ ...packageForm, durationInMonths: e.target.value })} required />
              <Form.Control className="mb-3" type="number" placeholder="Price" value={packageForm.price} onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })} required />
              <Form.Control className="mb-3" as="textarea" rows={3} placeholder="Description" value={packageForm.description} onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })} />
              <Button type="submit" className="btn btn-success rounded-pill px-4">{editingPackageId ? "Update Package" : "Save Package"}</Button>
            </Form>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="glass-card border-0 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">{editingTrainerId ? "Edit Trainer" : "Add Trainer"}</h5>
              {editingTrainerId && (
                <Button size="sm" variant="outline-light" onClick={() => {
                  setEditingTrainerId(null);
                  setTrainerForm({ name: "", email: "", specialization: "", phone: "", age: "", experienceYears: "", address: "", photoUrl: "" });
                }}>
                  Cancel
                </Button>
              )}
            </div>
            <Form onSubmit={submitTrainer}>
              {trainerForm.photoUrl && <img src={trainerForm.photoUrl} alt="Trainer preview" className="upload-preview upload-preview-wide mb-3" />}
              <Form.Control className="mb-3" placeholder="Trainer name" value={trainerForm.name} onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })} required />
              <Form.Control className="mb-3" type="email" placeholder="Email" value={trainerForm.email} onChange={(e) => setTrainerForm({ ...trainerForm, email: e.target.value })} />
              <Form.Control className="mb-3" placeholder="Specialization" value={trainerForm.specialization} onChange={(e) => setTrainerForm({ ...trainerForm, specialization: e.target.value })} required />
              <Form.Control className="mb-3" placeholder="Phone" value={trainerForm.phone} onChange={(e) => setTrainerForm({ ...trainerForm, phone: e.target.value })} required />
              <Form.Control className="mb-3" type="number" placeholder="Age" value={trainerForm.age} onChange={(e) => setTrainerForm({ ...trainerForm, age: e.target.value })} />
              <Form.Control className="mb-3" type="number" placeholder="Experience in years" value={trainerForm.experienceYears} onChange={(e) => setTrainerForm({ ...trainerForm, experienceYears: e.target.value })} required />
              <Form.Control className="mb-3" as="textarea" rows={2} placeholder="Address" value={trainerForm.address} onChange={(e) => setTrainerForm({ ...trainerForm, address: e.target.value })} />
              <Form.Control className="mb-3" type="file" accept="image/*" onChange={handleImageChange(setTrainerForm, "photoUrl")} />
              <Button type="submit" className="btn btn-success rounded-pill px-4">{editingTrainerId ? "Update Trainer" : "Save Trainer"}</Button>
            </Form>
          </Card>
        </Col>

        <Col lg={4} ref={membershipFormRef}>
          <Card className="glass-card border-0 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">{editingMembershipId ? "Edit Membership" : "Add Membership"}</h5>
              {editingMembershipId && (
                <Button size="sm" variant="outline-light" onClick={() => {
                  setEditingMembershipId(null);
                  setMembershipForm({ clientId: "", packageId: "", trainerId: "", startDate: "", endDate: "", status: "ACTIVE", paymentStatus: "PENDING" });
                }}>
                  Cancel
                </Button>
              )}
            </div>
            <Form onSubmit={submitMembership}>
              <Form.Control className="mb-3" placeholder="Member client ID" value={membershipForm.clientId} onChange={(e) => setMembershipForm({ ...membershipForm, clientId: e.target.value })} required />
              <Form.Select className="mb-3" value={membershipForm.packageId} onChange={(e) => setMembershipForm({ ...membershipForm, packageId: e.target.value })} required>
                <option value="">Select package</option>
                {packages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </Form.Select>
              <Form.Select className="mb-3" value={membershipForm.trainerId} onChange={(e) => setMembershipForm({ ...membershipForm, trainerId: e.target.value })}>
                <option value="">Select trainer</option>
                {trainers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </Form.Select>
              <Form.Control className="mb-3" type="date" value={membershipForm.startDate} onChange={(e) => setMembershipForm({ ...membershipForm, startDate: e.target.value })} required />
              <Form.Control className="mb-3" type="date" value={membershipForm.endDate} onChange={(e) => setMembershipForm({ ...membershipForm, endDate: e.target.value })} required />
              <Form.Select className="mb-3" value={membershipForm.status} onChange={(e) => setMembershipForm({ ...membershipForm, status: e.target.value })}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="EXPIRED">EXPIRED</option>
              </Form.Select>
              <Form.Select className="mb-3" value={membershipForm.paymentStatus} onChange={(e) => setMembershipForm({ ...membershipForm, paymentStatus: e.target.value })}>
                <option value="PENDING">Payment Due</option>
                <option value="PAID">Paid</option>
              </Form.Select>
              <Button type="submit" className="btn btn-success rounded-pill px-4">{editingMembershipId ? "Update Membership" : "Assign Membership"}</Button>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card className="glass-card border-0 p-4 mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Manage Packages</h5>
          <span className="soft-pill">{packages.length} Packages</span>
        </div>
        <Row className="g-4">
          {packages.map((pkg) => (
            <Col lg={4} md={6} key={pkg.id}>
              <div className="trainer-manage-card">
                <span className="soft-pill mb-3">{pkg.durationInMonths} months</span>
                <h5 className="fw-bold mb-2">{pkg.name}</h5>
                <p className="text-gold small mb-2">Fee: Rs. {pkg.price}</p>
                <p className="small text-secondary mb-3">{pkg.description || "No description added."}</p>
                <div className="d-flex gap-2">
                  <Button type="button" size="sm" className="btn btn-outline-warning flex-fill" onClick={() => handlePackageEdit(pkg)}>
                    Edit
                  </Button>
                </div>
              </div>
            </Col>
          ))}
          {!packages.length && <p className="text-muted mb-0">No packages available to manage yet.</p>}
        </Row>
      </Card>

      <Card className="glass-card border-0 p-4 mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Manage Trainers</h5>
          <span className="soft-pill">{trainers.length} Trainers</span>
        </div>
        <Row className="g-4">
          {trainers.map((trainer) => (
            <Col lg={4} md={6} key={trainer.id}>
              <div className="trainer-manage-card">
                {trainer.photoUrl ? (
                  <img src={trainer.photoUrl} alt={trainer.name} className="trainer-photo mb-3" />
                ) : (
                  <div className="trainer-photo trainer-photo-fallback mb-3">{trainer.name?.slice(0, 1)}</div>
                )}
                <h5 className="fw-bold mb-2">{trainer.name}</h5>
                <p className="text-gold small mb-2">{trainer.specialization}</p>
                <p className="small mb-1">Email: {trainer.email || "N/A"}</p>
                <p className="small mb-1">Contact: {trainer.phone || "N/A"}</p>
                <p className="small mb-1">Age: {trainer.age || "N/A"}</p>
                <p className="small mb-1">Experience: {trainer.experienceYears || 0} years</p>
                <p className="small text-secondary mb-3">{trainer.address || "No address added."}</p>
                <div className="d-flex gap-2">
                  <Button size="sm" className="btn btn-outline-warning flex-fill" onClick={() => handleTrainerEdit(trainer)}>
                    Edit
                  </Button>
                  <Button type="button" size="sm" variant="outline-danger" className="flex-fill" onClick={() => handleTrainerDelete(trainer.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </Col>
          ))}
          {!trainers.length && <p className="text-muted mb-0">No trainers available to manage yet.</p>}
        </Row>
      </Card>

      <Card className="glass-card border-0 p-4 mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Pending Join Requests</h5>
          <span className="soft-pill">{pendingRequests.length} Pending</span>
        </div>
        <div className="table-responsive table-shell">
          <Table hover>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Member</th>
                <th>Package</th>
                <th>Trainer</th>
                <th>Requested At</th>
                <th>Admin Notes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((item) => (
                <tr key={item.id}>
                  <td>{item.member?.clientId}</td>
                  <td>{item.member?.fullName}</td>
                  <td>{item.gymPackage?.name}</td>
                  <td>{item.trainer?.name || "Not Chosen"}</td>
                  <td>{item.requestedAt ? new Date(item.requestedAt).toLocaleString() : "-"}</td>
                  <td style={{ minWidth: "220px" }}>
                    <Form.Control
                      placeholder="Add note for member"
                      value={decisionNotes[item.id] || ""}
                      onChange={(e) => setDecisionNotes({ ...decisionNotes, [item.id]: e.target.value })}
                    />
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button size="sm" className="btn btn-success" onClick={() => handleDecision(item.id, "APPROVED")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDecision(item.id, "REJECTED")}>
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!pendingRequests.length && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No pending membership requests right now.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <Card className="glass-card border-0 p-4 mt-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
          <h5 className="fw-bold mb-0">Members</h5>
          <Form onSubmit={handleSearch} className="d-flex gap-2">
            <Form.Control placeholder="Search by name" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
            <Button type="submit" className="btn btn-outline-success">Search</Button>
          </Form>
        </div>
        <div className="table-responsive table-shell">
          <Table hover>
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Photo</th>
                <th>Preferred Package</th>
                <th>Preferred Trainer</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.clientId}</td>
                  <td>{member.fullName}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>{member.photoUrl ? <img src={member.photoUrl} alt={member.fullName} className="table-avatar" /> : "N/A"}</td>
                  <td>{getPackageName(member.preferredPackageId)}</td>
                  <td>{getTrainerName(member.preferredTrainerId)}</td>
                </tr>
              ))}
              {!members.length && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No members registered yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <Card className="glass-card border-0 p-4 mt-4">
        <h5 className="fw-bold mb-3">All Memberships</h5>
        <div className="table-shell table-scroll-shell">
          <Table hover className="wide-membership-table">
            <thead>
              <tr>
                <th>Client ID</th>
                <th>Photo</th>
                <th>Member</th>
                <th>Package</th>
                <th>Fee</th>
                <th>Trainer</th>
                <th>Request</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {memberships.map((item) => (
                <tr key={item.id}>
                  <td>{item.member?.clientId}</td>
                  <td>{item.member?.photoUrl ? <img src={item.member.photoUrl} alt={item.member.fullName} className="table-avatar" /> : "N/A"}</td>
                  <td>{item.member?.fullName}</td>
                  <td>{item.gymPackage?.name}</td>
                  <td>Rs. {item.gymPackage?.price}</td>
                  <td>{item.trainer?.name || "Not Assigned"}</td>
                  <td><span className={statusBadgeClass(item.requestStatus)}>{item.requestStatus || "-"}</span></td>
                  <td>{item.startDate}</td>
                  <td>{item.endDate}</td>
                  <td><span className={statusBadgeClass(item.status)}>{item.status}</span></td>
                  <td><span className={statusBadgeClass(item.paymentStatus)}>{paymentLabel(item.paymentStatus)}</span></td>
                  <td>
                    <Button type="button" size="sm" className="btn btn-outline-warning" onClick={() => handleMembershipEdit(item)}>
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
              {!memberships.length && (
                <tr>
                  <td colSpan="12" className="text-center text-muted">No memberships created yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </Container>
  );
}

export default AdminDashboard;

import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { School, MapPin, UsersRound, UserCog, ShieldCheck, Plus, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AppContext } from "@/context/AppContext";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

type TabKey = "faculties" | "deans" | "venues" | "advisors" | "organizations" | "roles" | "registerPresident" | "createProject";

type CatalogData = {
  faculties: any[];
  venues: any[];
  organizations: any[];
  advisors: any[];
  deans: any[];
  adminRoles: any[];
};

const initialCatalog: CatalogData = {
  faculties: [],
  venues: [],
  organizations: [],
  advisors: [],
  deans: [],
  adminRoles: [],
};

const AdminDashboard = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  const { backendUrl, userData } = context;

  const role = userData?.role || "";
  const isWelfareOfficer = role === "welfareOfficer";
  const isDean = role === "dean";
  const isPresident = role === "president";

  if (!isWelfareOfficer && !isDean && !isPresident) {
    return <Navigate to="/" replace />;
  }

  const [activeTab, setActiveTab] = useState<TabKey>(isWelfareOfficer ? "faculties" : isDean ? "registerPresident" : "createProject");
  const [catalog, setCatalog] = useState<CatalogData>(initialCatalog);
  const [availableOrganizations, setAvailableOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [facultyForm, setFacultyForm] = useState({ facultyName: "", departments: "", deanId: "" });
  const [deanForm, setDeanForm] = useState({ fullName: "", facultyId: "", email: "", password: "" });
  const [venueForm, setVenueForm] = useState({
    venueName: "",
    capacity: "",
    type: "",
    ownerType: "Welfare",
    ownerRef: "",
    facultyId: "",
  });
  const [advisorForm, setAdvisorForm] = useState({ fullName: "", email: "", password: "", organizationId: "" });
  const [organizationType, setOrganizationType] = useState<"noFaculty" | "withFaculty">("noFaculty");
  const [organizationForm, setOrganizationForm] = useState({
    organizationName: "",
    advisorId: "",
    facultyId: "",
    presidentName: "",
    email: "",
    projectCount: "",
  });
  const [roleForm, setRoleForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "sportsDirector",
  });
  const [presidentForm, setPresidentForm] = useState({
    organizationId: "",
    presidentName: "",
    presidentEmail: "",
    presidentPassword: "",
  });
  const [projectForm, setProjectForm] = useState({
    organizationId: "",
    projectName: "",
    description: "",
  });

  const tabs = isWelfareOfficer
    ? [
        { key: "faculties" as const, label: "Faculties", icon: School },
        { key: "deans" as const, label: "Deans", icon: UserCog },
        { key: "venues" as const, label: "Venues", icon: MapPin },
        { key: "advisors" as const, label: "Advisors", icon: UsersRound },
        { key: "organizations" as const, label: "Organizations", icon: UsersRound },
        { key: "roles" as const, label: "Other Roles", icon: ShieldCheck },
      ]
    : isDean
      ? [{ key: "registerPresident" as const, label: "Register President", icon: UserCog }]
      : [{ key: "createProject" as const, label: "Create Project", icon: UsersRound }];

  const ownerCandidates = useMemo(() => {
    if (venueForm.ownerType === "Dean") return catalog.deans;
    if (venueForm.ownerType === "Sports Director") {
      return catalog.adminRoles.filter((item) => item.adminProfile?.role === "sportsDirector");
    }
    return [];
  }, [catalog.adminRoles, catalog.deans, venueForm.ownerType]);

  const fetchCatalog = async () => {
    if (!isWelfareOfficer) {
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/admin/catalog`);
      if (!data.success) {
        toast.error(data.message || "Failed to load admin catalog");
        return;
      }
      setCatalog(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load catalog");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableOrganizations = async () => {
    if (!isDean && !isPresident) {
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(`${backendUrl}/api/project/organizations`);

      if (!data.success) {
        toast.error(data.message || "Failed to load organizations");
        return;
      }

      setAvailableOrganizations(data.message || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isWelfareOfficer) {
      setActiveTab("faculties");
      fetchCatalog();
      return;
    }

    if (isDean) {
      setActiveTab("registerPresident");
      fetchAvailableOrganizations();
      return;
    }

    if (isPresident) {
      setActiveTab("createProject");
      fetchAvailableOrganizations();
    }
  }, [isWelfareOfficer, isDean, isPresident]);

  const refreshCurrentView = async () => {
    if (isWelfareOfficer) {
      await fetchCatalog();
      return;
    }

    await fetchAvailableOrganizations();
  };

  const submitAndRefresh = async (endpoint: string, body: Record<string, any>, onDone: () => void) => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}${endpoint}`, body);
      if (!data.success) {
        toast.error(data.message || "Request failed");
        return;
      }
      toast.success("Saved successfully");
      onDone();
      await fetchCatalog();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Request failed");
    }
  };

  const submitPresidentRegistration = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/admin/register-president`, presidentForm);

      if (!data.success) {
        toast.error(data.message || "Failed to register president");
        return;
      }

      toast.success("President registered successfully");
      setPresidentForm({
        organizationId: "",
        presidentName: "",
        presidentEmail: "",
        presidentPassword: "",
      });
      await fetchAvailableOrganizations();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to register president");
    }
  };

  const submitPresidentProject = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/project/create`, projectForm);

      if (!data.success) {
        toast.error(data.message || "Failed to create project");
        return;
      }

      toast.success("Project created successfully");
      setProjectForm({
        organizationId: "",
        projectName: "",
        description: "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create project");
    }
  };

  const occupiedRoles = new Set(catalog.adminRoles.map((item) => item.adminProfile?.role));

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(99,102,241,0.14),_transparent_26%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_100%)]" />
      <div className="absolute inset-0 opacity-[0.03] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative z-10">
        <Header />

        <main className="mx-auto max-w-[1300px] px-4 py-6 sm:px-6">
          <div className="mb-6 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_16px_60px_rgba(37,99,235,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
                  {isWelfareOfficer ? "Welfare Officer Panel" : isDean ? "Dean Panel" : "President Panel"}
                </p>
                <h1 className="mt-2 text-2xl font-semibold">University Administration Dashboard</h1>
              </div>
              <button
                onClick={refreshCurrentView}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  activeTab === tab.key
                    ? "border-blue-300 bg-blue-50 shadow-[0_8px_24px_rgba(59,130,246,0.18)]"
                    : "border-white/70 bg-white/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold">{tab.label}</span>
                </div>
              </button>
            ))}
          </div>

          <section className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_16px_60px_rgba(37,99,235,0.08)] backdrop-blur">
            {activeTab === "faculties" && isWelfareOfficer && (
              <>
                <h2 className="text-xl font-semibold">Faculty Management</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <input className="rounded-xl border p-2.5" placeholder="Faculty Name" value={facultyForm.facultyName} onChange={(e) => setFacultyForm((v) => ({ ...v, facultyName: e.target.value }))} />
                  <input className="rounded-xl border p-2.5" placeholder="Departments (comma separated)" value={facultyForm.departments} onChange={(e) => setFacultyForm((v) => ({ ...v, departments: e.target.value }))} />
                  <select className="rounded-xl border p-2.5" value={facultyForm.deanId} onChange={(e) => setFacultyForm((v) => ({ ...v, deanId: e.target.value }))}>
                    <option value="">No Dean Assigned</option>
                    {catalog.deans.filter((d) => !d.adminProfile?.faculty).map((dean) => (
                      <option key={dean._id} value={dean._id}>{dean.fullName}</option>
                    ))}
                  </select>
                </div>
                <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => submitAndRefresh("/api/admin/faculty", facultyForm, () => setFacultyForm({ facultyName: "", departments: "", deanId: "" }))}>
                  <Plus className="h-4 w-4" /> Add Faculty
                </button>
                <SimpleTable headers={["Name", "Departments", "Dean"]} rows={catalog.faculties.map((f) => [f.facultyName, (f.departments || []).join(", "), f.dean?.fullName || "-"])} />
              </>
            )}

            {activeTab === "deans" && isWelfareOfficer && (
              <>
                <h2 className="text-xl font-semibold">Dean Management</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <input className="rounded-xl border p-2.5" placeholder="Dean Name" value={deanForm.fullName} onChange={(e) => setDeanForm((v) => ({ ...v, fullName: e.target.value }))} />
                  <select className="rounded-xl border p-2.5" value={deanForm.facultyId} onChange={(e) => setDeanForm((v) => ({ ...v, facultyId: e.target.value }))}>
                    <option value="">Select Faculty</option>
                    {catalog.faculties.filter((f) => !f.dean).map((faculty) => (
                      <option key={faculty._id} value={faculty._id}>{faculty.facultyName}</option>
                    ))}
                  </select>
                  <input className="rounded-xl border p-2.5" placeholder="Email" value={deanForm.email} onChange={(e) => setDeanForm((v) => ({ ...v, email: e.target.value }))} />
                  <input className="rounded-xl border p-2.5" placeholder="Password" type="password" value={deanForm.password} onChange={(e) => setDeanForm((v) => ({ ...v, password: e.target.value }))} />
                </div>
                <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => submitAndRefresh("/api/admin/dean", deanForm, () => setDeanForm({ fullName: "", facultyId: "", email: "", password: "" }))}>
                  <Plus className="h-4 w-4" /> Add Dean
                </button>
                <SimpleTable headers={["Name", "Faculty", "Email"]} rows={catalog.deans.map((d) => [d.fullName, d.adminProfile?.faculty ? (catalog.faculties.find((f) => f._id === d.adminProfile.faculty)?.facultyName || "-") : "-", d.email])} />
              </>
            )}

            {activeTab === "venues" && isWelfareOfficer && (
              <>
                <h2 className="text-xl font-semibold">Venue Management</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <input className="rounded-xl border p-2.5" placeholder="Venue Name" value={venueForm.venueName} onChange={(e) => setVenueForm((v) => ({ ...v, venueName: e.target.value }))} />
                  <input className="rounded-xl border p-2.5" placeholder="Capacity" type="number" value={venueForm.capacity} onChange={(e) => setVenueForm((v) => ({ ...v, capacity: e.target.value }))} />
                  <input className="rounded-xl border p-2.5" placeholder="Type" value={venueForm.type} onChange={(e) => setVenueForm((v) => ({ ...v, type: e.target.value }))} />
                  <select className="rounded-xl border p-2.5" value={venueForm.ownerType} onChange={(e) => setVenueForm((v) => ({ ...v, ownerType: e.target.value, ownerRef: "", facultyId: "" }))}>
                    <option value="Welfare">Owned by Welfare</option>
                    <option value="Dean">Owned by Dean</option>
                    <option value="Sports Director">Owned by Sports Director</option>
                  </select>
                  {
                    venueForm.ownerType === "Dean" && (
                      <select className="rounded-xl border p-2.5" value={venueForm.ownerRef} onChange={(e) => setVenueForm((v) => ({ ...v, ownerRef: e.target.value }))}>
                        <option value="">Select Owner (Optional)</option>
                        {ownerCandidates.map((owner) => <option key={owner._id} value={owner._id}>{owner.fullName}</option>)}
                      </select>
                     )
                  }
                  {
                    venueForm.ownerType === "Dean" && (
                      <select className="rounded-xl border p-2.5" value={venueForm.facultyId} onChange={(e) => setVenueForm((v) => ({ ...v, facultyId: e.target.value }))}>
                        <option value="">Faculty (Optional)</option>
                        {catalog.faculties.map((faculty) => <option key={faculty._id} value={faculty._id}>{faculty.facultyName}</option>)}
                      </select>
                    )
                  }
                  
                </div>
                <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => submitAndRefresh("/api/admin/venue", venueForm, () => setVenueForm({ venueName: "", capacity: "", type: "", ownerType: "Welfare", ownerRef: "", facultyId: "" }))}>
                  <Plus className="h-4 w-4" /> Add Venue
                </button>
                <SimpleTable
                  headers={["Name", "Ownership/Authority", "Capacity", "Type", "Actions"]}
                  rows={catalog.venues.map((v) => [v.venueName, v.ownerType, String(v.capacity), v.type, "View"])}
                />
              </>
            )}

            {activeTab === "advisors" && isWelfareOfficer && (
              <>
                <h2 className="text-xl font-semibold">Advisor Management</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <input className="rounded-xl border p-2.5" placeholder="Advisor Name" value={advisorForm.fullName} onChange={(e) => setAdvisorForm((v) => ({ ...v, fullName: e.target.value }))} />
                  <input className="rounded-xl border p-2.5" placeholder="Email" value={advisorForm.email} onChange={(e) => setAdvisorForm((v) => ({ ...v, email: e.target.value }))} />
                  <input className="rounded-xl border p-2.5" placeholder="Password" type="password" value={advisorForm.password} onChange={(e) => setAdvisorForm((v) => ({ ...v, password: e.target.value }))} />
                  <select className="rounded-xl border p-2.5" value={advisorForm.organizationId} onChange={(e) => setAdvisorForm((v) => ({ ...v, organizationId: e.target.value }))}>
                    <option value="">Organization (Optional)</option>
                    {catalog.organizations.map((org) => <option key={org._id} value={org._id}>{org.organizationName}</option>)}
                  </select>
                </div>
                <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => submitAndRefresh("/api/admin/advisor", advisorForm, () => setAdvisorForm({ fullName: "", email: "", password: "", organizationId: "" }))}>
                  <Plus className="h-4 w-4" /> Add Advisor
                </button>
                <SimpleTable headers={["Name", "Email", "Organization"]} rows={catalog.advisors.map((a) => [a.fullName, a.email, a.adminProfile?.organization ? (catalog.organizations.find((org) => org._id === a.adminProfile.organization)?.organizationName || "-") : "-"])} />
              </>
            )}

            {activeTab === "organizations" && isWelfareOfficer && (
              <>
                <h2 className="text-xl font-semibold">Organization Management</h2>
                <div className="mt-4 flex gap-2">
                  <button className={`rounded-xl border px-3 py-2 text-sm ${organizationType === "noFaculty" ? "bg-blue-50 border-blue-300" : "bg-white"}`} onClick={() => setOrganizationType("noFaculty")}>Organization - No Faculty</button>
                  <button className={`rounded-xl border px-3 py-2 text-sm ${organizationType === "withFaculty" ? "bg-blue-50 border-blue-300" : "bg-white"}`} onClick={() => setOrganizationType("withFaculty")}>Organization - With Faculty</button>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <input className="rounded-xl border p-2.5" placeholder="Organization Name" value={organizationForm.organizationName} onChange={(e) => setOrganizationForm((v) => ({ ...v, organizationName: e.target.value }))} />
                  <input className="rounded-xl border p-2.5" placeholder="Email" value={organizationForm.email} onChange={(e) => setOrganizationForm((v) => ({ ...v, email: e.target.value }))} />
                  <input className="rounded-xl border p-2.5" placeholder="Project Count" type="number" value={organizationForm.projectCount} onChange={(e) => setOrganizationForm((v) => ({ ...v, projectCount: e.target.value }))} />

                  {organizationType === "noFaculty" ? (
                    <select className="rounded-xl border p-2.5" value={organizationForm.advisorId} onChange={(e) => setOrganizationForm((v) => ({ ...v, advisorId: e.target.value }))}>
                      <option value="">Advisor</option>
                      {catalog.advisors.map((a) => <option key={a._id} value={a._id}>{a.fullName}</option>)}
                    </select>
                  ) : (
                    <>
                      <select className="rounded-xl border p-2.5" value={organizationForm.facultyId} onChange={(e) => setOrganizationForm((v) => ({ ...v, facultyId: e.target.value }))}>
                        <option value="">Faculty Name</option>
                        {catalog.faculties.map((f) => <option key={f._id} value={f._id}>{f.facultyName}</option>)}
                      </select>
                      
                    </>
                  )}
                </div>
                <button
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() =>
                    submitAndRefresh(
                      "/api/admin/organization",
                      {
                        ...organizationForm,
                        organizationType,
                      },
                      () =>
                        setOrganizationForm({
                          organizationName: "",
                          advisorId: "",
                          facultyId: "",
                          presidentName: "",
                          email: "",
                          projectCount: "",
                        }),
                    )
                  }
                >
                  <Plus className="h-4 w-4" /> Add Organization
                </button>
                <SimpleTable
                  headers={["Name", "Type", "Authority", "Email", "Project Count"]}
                  rows={catalog.organizations.map((o) => [o.organizationName, o.organizationType, o.authorityType, o.email, String(o.projectCount || 0)])}
                />
              </>
            )}

            {activeTab === "roles" && isWelfareOfficer && (
              <>
                <h2 className="text-xl font-semibold">Other Roles Management</h2>
                <p className="mt-1 text-sm text-slate-500">Only one user can exist per role: Sports Director, Chairman of Art, Proctor, Vice Chancellor.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <input className="rounded-xl border p-2.5" placeholder="Name" value={roleForm.fullName} onChange={(e) => setRoleForm((v) => ({ ...v, fullName: e.target.value }))} />
                  <input className="rounded-xl border p-2.5" placeholder="Email" value={roleForm.email} onChange={(e) => setRoleForm((v) => ({ ...v, email: e.target.value }))} />
                  <input className="rounded-xl border p-2.5" placeholder="Password" type="password" value={roleForm.password} onChange={(e) => setRoleForm((v) => ({ ...v, password: e.target.value }))} />
                  <select className="rounded-xl border p-2.5" value={roleForm.role} onChange={(e) => setRoleForm((v) => ({ ...v, role: e.target.value }))}>
                    <option value="sportsDirector">Sports Director</option>
                    <option value="chairmanOfArt">Chairman of Art</option>
                    <option value="proctor">Proctor</option>
                    <option value="viceChancellor">Vice Chancellor</option>
                  </select>
                </div>
                <button className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white" onClick={() => submitAndRefresh("/api/admin/university-role", roleForm, () => setRoleForm({ fullName: "", email: "", password: "", role: "sportsDirector" }))}>
                  <Plus className="h-4 w-4" /> Add Role User
                </button>
                <SimpleTable
                  headers={["Role", "Name", "Email", "Status"]}
                  rows={[
                    ["Sports Director", getRoleUser(catalog.adminRoles, "sportsDirector")?.fullName || "-", getRoleUser(catalog.adminRoles, "sportsDirector")?.email || "-", occupiedRoles.has("sportsDirector") ? "Assigned" : "Missing"],
                    ["Chairman of Art", getRoleUser(catalog.adminRoles, "chairmanOfArt")?.fullName || "-", getRoleUser(catalog.adminRoles, "chairmanOfArt")?.email || "-", occupiedRoles.has("chairmanOfArt") ? "Assigned" : "Missing"],
                    ["Proctor", getRoleUser(catalog.adminRoles, "proctor")?.fullName || "-", getRoleUser(catalog.adminRoles, "proctor")?.email || "-", occupiedRoles.has("proctor") ? "Assigned" : "Missing"],
                    ["Vice Chancellor", getRoleUser(catalog.adminRoles, "viceChancellor")?.fullName || "-", getRoleUser(catalog.adminRoles, "viceChancellor")?.email || "-", occupiedRoles.has("viceChancellor") ? "Assigned" : "Missing"],
                  ]}
                />
              </>
            )}

            {activeTab === "registerPresident" && isDean && (
              <>
                <h2 className="text-xl font-semibold">Register President</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Dean access is limited to president registration only.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <select
                    className="rounded-xl border p-2.5"
                    value={presidentForm.organizationId}
                    onChange={(e) => setPresidentForm((v) => ({ ...v, organizationId: e.target.value }))}
                  >
                    <option value="">Select Organization</option>
                    {availableOrganizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.organizationName}
                      </option>
                    ))}
                  </select>
                  <input
                    className="rounded-xl border p-2.5"
                    placeholder="President Name"
                    value={presidentForm.presidentName}
                    onChange={(e) => setPresidentForm((v) => ({ ...v, presidentName: e.target.value }))}
                  />
                  <input
                    className="rounded-xl border p-2.5"
                    placeholder="President Email"
                    value={presidentForm.presidentEmail}
                    onChange={(e) => setPresidentForm((v) => ({ ...v, presidentEmail: e.target.value }))}
                  />
                  <input
                    className="md:col-span-2 rounded-xl border p-2.5"
                    placeholder="Temporary President Password"
                    type="password"
                    value={presidentForm.presidentPassword}
                    onChange={(e) => setPresidentForm((v) => ({ ...v, presidentPassword: e.target.value }))}
                  />
                </div>
                <button
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={submitPresidentRegistration}
                >
                  <Plus className="h-4 w-4" /> Register President
                </button>
              </>
            )}

            {activeTab === "createProject" && isPresident && (
              <>
                <h2 className="text-xl font-semibold">Create Project</h2>
                <p className="mt-1 text-sm text-slate-500">
                  President access is limited to project creation only.
                </p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <select
                    className="rounded-xl border p-2.5"
                    value={projectForm.organizationId}
                    onChange={(e) => setProjectForm((v) => ({ ...v, organizationId: e.target.value }))}
                  >
                    <option value="">Select Organization</option>
                    {availableOrganizations.map((org) => (
                      <option key={org._id} value={org._id}>
                        {org.organizationName}
                      </option>
                    ))}
                  </select>
                  <input
                    className="rounded-xl border p-2.5"
                    placeholder="Project Name"
                    value={projectForm.projectName}
                    onChange={(e) => setProjectForm((v) => ({ ...v, projectName: e.target.value }))}
                  />
                  <textarea
                    className="md:col-span-2 min-h-[110px] rounded-xl border p-2.5"
                    placeholder="Project Description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm((v) => ({ ...v, description: e.target.value }))}
                  />
                </div>
                <button
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  onClick={submitPresidentProject}
                >
                  <Plus className="h-4 w-4" /> Create Project
                </button>
              </>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

const getRoleUser = (roles: any[], roleName: string) => roles.find((item) => item.adminProfile?.role === roleName);

const SimpleTable = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold text-slate-700">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-8 text-center text-slate-500">No records yet.</td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={`${idx}-${row[0]}`} className="border-t">
                {row.map((cell, cIdx) => (
                  <td key={`${idx}-${cIdx}`} className="px-4 py-3 text-slate-600">{cell || "-"}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminDashboard;

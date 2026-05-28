import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppContextProvider } from "@/context/AppContext";
import ProtectedRoute from "@/pages/protectedRoute";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import Events from "@/pages/Events";
import AdminDashboard from "@/pages/AdminDashboard";
import Workspace from "@/pages/Workspace";
import ApprovalEventDetail from "./pages/ApprovalEventDetail";
import NotFound from "@/pages/NotFound";
import MyEvents from "./pages/MyEvents";
import EventRegistration from "@/pages/EventRegistration";
import EventDetail from "./pages/EventDetail";
import EventProfile from "./pages/EventProfile";
import EventEditMode from "./pages/EventEditMode";
import Profile from "./pages/Profile";
import ApprovalDashboard from "./pages/ApprovalDashboard";

const queryClient = new QueryClient();

const App = () => (
  <AppContextProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workspace"
              element={
                <ProtectedRoute>
                  <Workspace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute>
                  <MyEvents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-registration"
              element={
                <ProtectedRoute>
                  <EventRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approval-dashboard"
              element={
                <ProtectedRoute>
                  <ApprovalDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/:id"
              element={
                  <EventProfile />
              }
            />
            <Route
              path="/event-detail/:id"
              element={
                <ProtectedRoute>
                  <EventDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approval-dashboard/event/:eventId"
              element={
                <ProtectedRoute>
                  <ApprovalEventDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event-edit/:id"
              element={
                <ProtectedRoute>
                  <EventEditMode />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AppContextProvider>
);

export default App;

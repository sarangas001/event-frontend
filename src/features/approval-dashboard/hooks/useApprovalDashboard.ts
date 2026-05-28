import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { formatDateTime, formatRole } from "@/lib/formatters";

import { approvalDashboardApi } from "../api/approvalDashboardApi";
import type { DashboardEvent, WorkflowApiItem } from "../types";

type UseApprovalDashboardArgs = {
  backendUrl: string;
  isStudent: boolean;
  onLoggedOut: () => void;
};

export const useApprovalDashboard = ({ backendUrl, isStudent, onLoggedOut }: UseApprovalDashboardArgs) => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<DashboardEvent | null>(null);
  const [comment, setComment] = useState("");
  const [activeNav, setActiveNav] = useState("pending");
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const statusCounts = useMemo(
    () => ({
      pending: events.filter((event) => event.status === "Pending").length,
      inReview: events.filter((event) => event.status === "In Review").length,
      completed: events.filter((event) => event.status === "Approved").length,
      overdue: events.filter((event) => event.status === "Overdue").length,
    }),
    [events],
  );

  const fetchWorkflowQueue = useCallback(async () => {
    try {
      setIsLoadingData(true);

      const data = await approvalDashboardApi.fetchQueue(backendUrl);
      if (!data?.success) {
        toast.error("Failed to fetch approval queue.");
        setEvents([]);
        setSelectedEvent(null);
        return;
      }

      const workflows = Array.isArray(data.message) ? data.message : [];
      const mappedEvents: DashboardEvent[] = workflows.map((workflow: any) => {
        const eventPayload = workflow.event || {};
        const workflowContent: WorkflowApiItem[] = Array.isArray(workflow.history)
          ? workflow.history.map((item: any) => ({
              _id: item.at || Math.random().toString(),
              role: item.role || "",
              status: item.decision || "",
              updatedAt: item.at,
              message: item.comment || "",
            }))
          : [];

        const latestItem = workflowContent.length > 0 ? workflowContent[workflowContent.length - 1] : null;

        // Determine display status: Approved, In Review, Pending, Overdue
        let eventStatus = "Pending";
        if (workflow.status === "approved") {
          eventStatus = "Approved";
        } else if (latestItem) {
          const latestDecision = String(latestItem.status || "").toLowerCase();
          if (latestDecision === "pending" || latestDecision === "submitted") {
            // actively in review
            eventStatus = "In Review";
          } else if (latestDecision === "rejected") {
            // returned to organizer for changes — treat as Pending for queue
            eventStatus = "Pending";
          } else {
            eventStatus = "Pending";
          }

          // Overdue check: if not approved and last update older than 7 days
          if (latestItem.updatedAt) {
            const last = new Date(latestItem.updatedAt).getTime();
            const ageDays = (Date.now() - last) / (1000 * 60 * 60 * 24);
            if (ageDays > 7 && eventStatus !== "Approved") {
              eventStatus = "Overdue";
            }
          }
        }

        const mappedComments = workflowContent.map((item) => ({
          author: formatRole(item.role),
          role: "Workflow Step",
          time: formatDateTime(item.updatedAt),
          text: item.message?.trim() ? item.message : `Status changed to ${item.status}.`,
        }));

        return {
          id: String(eventPayload._id),
          workflowId: String(workflow._id || ""),
          title: eventPayload.title || eventPayload.eventTitle || "Untitled Event",
          organizer: eventPayload?.organization?.organizationName || eventPayload?.president?.fullName || "Organizer",
          submissionDate: latestItem?.updatedAt ? formatDateTime(latestItem.updatedAt) : "-",
          status: eventStatus,
          eventDate: eventPayload.eventDate || "-",
          location: eventPayload.venueName || eventPayload.venue?.venueName || "-",
          expectedAttendees: eventPayload.expectedAttendees || 0,
          description: eventPayload.description || "",
          documents: [],
          comments: mappedComments,
          workflowContent,
        };
      });

      setEvents(mappedEvents);
      setSelectedEvent(mappedEvents[0] || null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch approval queue.");
      setEvents([]);
      setSelectedEvent(null);
    } finally {
      setIsLoadingData(false);
    }
  }, [backendUrl]);

  const getUserProfile = useCallback(async () => {
    try {
      const data = await approvalDashboardApi.fetchProfile(backendUrl);
      if (!data?.success) {
        toast.error(data?.message || "Failed to fetch user profile.");
        return;
      }

      setName(data.user?.fullName || "");
      setRole(data.user?.role ? formatRole(data.user.role) : "User");
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch user profile.");
    }
  }, [backendUrl]);

  useEffect(() => {
    if (isStudent) {
      navigate("/");
      return;
    }

    fetchWorkflowQueue();
    getUserProfile();
  }, [fetchWorkflowQueue, getUserProfile, isStudent, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      const data = await approvalDashboardApi.logout(backendUrl);
      if (data.success) {
        toast.success("Logout successful!");
        onLoggedOut();
        navigate("/sign-in");
        return;
      }

      toast.error(data.message || "Logout failed.");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  }, [backendUrl, navigate, onLoggedOut]);

  const handleWorkflowAction = useCallback(
    async (status: "approved" | "rejected") => {
      if (!selectedEvent) return;

      if (status === "rejected" && !comment.trim()) {
        toast.error("Please add a rejection comment.");
        return;
      }

      try {
        const data = await approvalDashboardApi.updateWorkflowDecision(backendUrl, {
          eventId: selectedEvent.id,
          status,
          comment: comment.trim(),
        });

        if (!data?.success) {
          toast.error(data?.message || "Failed to update workflow.");
          return;
        }

        toast.success(status === "approved" ? "Workflow approved." : "Workflow rejected.");
        setComment("");
        await fetchWorkflowQueue();
      } catch (error: any) {
        toast.error(error?.message || "Failed to update workflow.");
      }
    },
    [backendUrl, comment, fetchWorkflowQueue, selectedEvent],
  );

  const openEventDetailPage = useCallback((eventId: string) => navigate(`/approval-dashboard/event/${eventId}`), [navigate]);

  const filteredEvents = useMemo(
    () => {
      // If viewing history, show events where current user's role appears in workflowContent
      if (activeNav === "history") {
        return events.filter((event) => {
          const hasRole = Array.isArray(event.workflowContent) && event.workflowContent.some((item) => formatRole(item.role) === role);
          const matchSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
          return hasRole && matchSearch;
        });
      }

      return events.filter((event) => {
        const matchSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
        const normalized = event.status.toLowerCase().replace(/\s+/g, "-");
        const matchStatus = statusFilter === "all" || normalized === statusFilter;
        return matchSearch && matchStatus;
      });
    },
    [events, searchQuery, statusFilter, activeNav, role],
  );

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedEvent,
    setSelectedEvent,
    comment,
    setComment,
    activeNav,
    setActiveNav,
    events,
    isLoadingData,
    name,
    role,
    statusCounts,
    handleLogout,
    handleWorkflowAction,
    openEventDetailPage,
    filteredEvents,
  };
};

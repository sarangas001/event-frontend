import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { toast } from "sonner";
import axios from "axios";
import { AppContext } from "@/context/AppContext";

const StudentProfile = () => {
  const navigate = useNavigate();

  const {backendUrl, setIsLoggedIn} = useContext(AppContext);

  const [formData, setFormData] = useState({
    fullName: "john",
    universityEmail: "uni@example.com",
    phoneNumber: "0712311561",
    notificationTypes: {
      eventStatus: false,
      approvalRequests: false,
      commentsFeedback: false,
    },
    deliveryChannels: {
      sms: false,
      email: false,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      

      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + '/api/student/profile', formData);

      if (data.success) {
        toast.success("Profile updated successfully!");
        navigate("/");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error("An unexpected error occurred. Please try again." + error);
    }
  };

  return (
    <MainLayout title="My Profile" subtitle="Manage your account information and preferences">
      <div className="container mx-auto px-6 pb-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information & Notification Preferences */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white/90 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="form-label text-xs">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">University Email</label>
                    <input
                      type="email"
                      value={formData.universityEmail}
                      onChange={(e) => setFormData({ ...formData, universityEmail: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs">Phone number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-muted/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Notification Types</p>
                    <div className="space-y-2">
                      {[
                        { key: 'eventStatus', label: 'Event status updates' },
                        { key: 'approvalRequests', label: 'Approval requests' },
                        { key: 'commentsFeedback', label: 'Comments & feedback' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={formData.notificationTypes[item.key as keyof typeof formData.notificationTypes]}
                            onChange={(e) => setFormData({
                              ...formData,
                              notificationTypes: {
                                ...formData.notificationTypes,
                                [item.key]: e.target.checked
                              }
                            })}
                            className="rounded border-border"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Security</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Password Management</p>
                    <p className="text-sm text-muted-foreground mb-2">Manage security settings</p>
                    <p className="text-sm text-muted-foreground">Last password change: January 15, 2025</p>
                  </div>
                  
                  <div className="border-t border-border pt-4">
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Add an extra layer of security to your account
                    </p>
                    <button type="button" className="text-sm text-primary underline">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                >
                  cancle
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors"
                >
                  Update profile
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default StudentProfile;

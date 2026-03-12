import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";

const sectionTitleSx = {
  fontSize: 22,
  fontWeight: 600,
  color: "#111827",
};

const sectionSubtitleSx = {
  mt: 0.5,
  fontSize: 12.5,
  color: "#94A3B8",
};

const rowSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "260px 1fr" },
  gap: { xs: 0.5, sm: 4 },
  alignItems: "center",
  py: 1.6,
  borderBottom: "1px solid #E5E7EB",
};

const rowSxEdit = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "260px 1fr" },
  gap: { xs: 0.5, sm: 4 },
  alignItems: "flex-start",
  py: 1.6,
  borderBottom: "1px solid #E5E7EB",
};

const labelSx = {
  fontSize: 13.5,
  color: "#9CA3AF",
};

const valueSx = {
  fontSize: 13.5,
  color: "#111827",
};

const sectionCardSx = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E5E7EB",
  borderRadius: 1.5,
  px: { xs: 2, md: 2 },
  py: { xs: 2, md: 2.5 },
};

const Section = ({
  title,
  subtitle,
  fields,
  editMode,
  onEdit,
  onCancel,
  onSave,
  formData,
  onFormChange,
  updating,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Box sx={sectionCardSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={sectionTitleSx}>{title}</Typography>
          <Typography sx={sectionSubtitleSx}>{subtitle}</Typography>
        </Box>
        {!editMode && (
          <Box
            onClick={onEdit}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "14px",
              color: "var(--primary-color, #123D6E)",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 16, color: "var(--primary-color, #123D6E)" }} />
            <Typography
          sx={{
                fontSize: "14px",
                color: "var(--primary-color, #123D6E)",
                textDecoration: "underline",
                fontWeight: 500,
          }}
        >
          Edit
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 2.5 }}>
        {editMode ? (
          <>
            {fields.map((field) => {
              if (field.label === "Password") {
                return (
                  <Box key={field.label} sx={rowSxEdit}>
                    <Typography sx={labelSx}>{field.label}</Typography>
                    <TextField
                      type={showPassword ? "text" : "password"}
                      value={formData.password || ""}
                      onChange={(e) => onFormChange("password", e.target.value)}
                      placeholder="Leave empty to keep current password"
                      fullWidth
                      variant="standard"
                      disableUnderline
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleTogglePassword}
                              edge="end"
                              sx={{
                                color: "#9CA3AF",
                                "&:hover": {
                                  color: "var(--primary-color, #123D6E)",
                                },
                              }}
                            >
                              {showPassword ? (
                                <VisibilityOffIcon sx={{ fontSize: 20 }} />
                              ) : (
                                <VisibilityIcon sx={{ fontSize: 20 }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        fontSize: "13.5px",
                        "& .MuiInputBase-input": {
                          fontSize: "13.5px",
                          color: "#111827",
                          py: 0,
                        },
                        "& .MuiInput-underline:before": {
                          borderBottom: "none !important",
                        },
                        "& .MuiInput-underline:hover:before": {
                          borderBottom: "none !important",
                        },
                        "& .MuiInput-underline:after": {
                          borderBottom: "none !important",
                        },
                        "& .MuiInput-underline.Mui-focused:after": {
                          borderBottom: "none !important",
                        },
                      }}
                    />
                  </Box>
                );
              }

              if (field.label === "Business Type") {
                return (
                  <Box key={field.label} sx={rowSxEdit}>
                    <Typography sx={labelSx}>{field.label}</Typography>
                    <FormControl fullWidth>
                      <Select
                        value={formData.businessType || ""}
                        onChange={(e) => onFormChange("businessType", e.target.value)}
                        variant="standard"
                        disableUnderline
                        sx={{
                          fontSize: "13.5px",
                          "& .MuiSelect-select": {
                            fontSize: "13.5px",
                            color: "#111827",
                            py: 0,
                          },
                          "& .MuiInput-underline:before": {
                            borderBottom: "none !important",
                          },
                          "& .MuiInput-underline:hover:before": {
                            borderBottom: "none !important",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none !important",
                          },
                          "& .MuiInput-underline.Mui-focused:after": {
                            borderBottom: "none !important",
                          },
                          "&:before": {
                            borderBottom: "none !important",
                          },
                          "&:after": {
                            borderBottom: "none !important",
                          },
                          "&:hover:not(.Mui-disabled):before": {
                            borderBottom: "none !important",
                          },
                        }}
                      >
                        <MenuItem value="Sole Proprietorship">Sole Proprietorship</MenuItem>
                        <MenuItem value="Partnership">Partnership</MenuItem>
                        <MenuItem value="Travelcompany">Travel Company</MenuItem>
                        <MenuItem value="Corporation">Corporation</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                );
              }

              if (field.label === "Status") {
                return (
                  <Box key={field.label} sx={rowSxEdit}>
                    <Typography sx={labelSx}>{field.label}</Typography>
                    <FormControl fullWidth>
                      <Select
                        value={formData.isActive ? "true" : "false"}
                        onChange={(e) => onFormChange("isActive", e.target.value === "true")}
                        variant="standard"
                        disableUnderline
                        sx={{
                          fontSize: "13.5px",
                          "& .MuiSelect-select": {
                            fontSize: "13.5px",
                            color: "#111827",
                            py: 0,
                          },
                          "& .MuiInput-underline:before": {
                            borderBottom: "none !important",
                          },
                          "& .MuiInput-underline:hover:before": {
                            borderBottom: "none !important",
                          },
                          "& .MuiInput-underline:after": {
                            borderBottom: "none !important",
                          },
                          "& .MuiInput-underline.Mui-focused:after": {
                            borderBottom: "none !important",
                          },
                          "&:before": {
                            borderBottom: "none !important",
                          },
                          "&:after": {
                            borderBottom: "none !important",
                          },
                          "&:hover:not(.Mui-disabled):before": {
                            borderBottom: "none !important",
                          },
                        }}
                      >
                        <MenuItem value="true">Active</MenuItem>
                        <MenuItem value="false">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                );
              }

              if (field.label === "Created At") {
                return (
                  <Box key={field.label} sx={rowSx}>
                    <Typography sx={labelSx}>{field.label}</Typography>
                    <Typography sx={valueSx}>{field.value}</Typography>
                  </Box>
                );
              }

              const fieldKey = field.fieldKey || field.label.toLowerCase().replace(/\s+/g, "");
              return (
                <Box key={field.label} sx={rowSxEdit}>
                  <Typography sx={labelSx}>{field.label}</Typography>
                  <TextField
                    value={formData[fieldKey] || ""}
                    onChange={(e) => onFormChange(fieldKey, e.target.value)}
                    fullWidth
                    variant="standard"
                    disableUnderline
                    sx={{
                      fontSize: "13.5px",
                      "& .MuiInputBase-input": {
                        fontSize: "13.5px",
                        color: "#111827",
                        py: 0,
                      },
                      "& .MuiInput-underline:before": {
                        borderBottom: "none !important",
                      },
                      "& .MuiInput-underline:hover:before": {
                        borderBottom: "none !important",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "none !important",
                      },
                      "& .MuiInput-underline.Mui-focused:after": {
                        borderBottom: "none !important",
                      },
                    }}
                  />
                </Box>
              );
            })}
            <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
              <Button
                onClick={onCancel}
                disabled={updating}
                sx={{
                  textTransform: "none",
                  color: "#6B7280",
                  fontSize: 14,
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={onSave}
                disabled={updating}
                variant="contained"
                startIcon={updating ? <CircularProgress size={16} sx={{ color: "#FFFFFF" }} /> : null}
                sx={{
                  textTransform: "none",
                  backgroundColor: "var(--primary-color, #123D6E)",
                  fontSize: 14,
                  fontWeight: 600,
                  px: 3,
                  "&:hover": {
                    backgroundColor: "var(--primary-color, #123D6E)",
                    opacity: 0.9,
                  },
                  "&:disabled": {
                    backgroundColor: "#9CA3AF",
                  },
                }}
              >
                {updating ? "Updating..." : "Save"}
              </Button>
            </Box>
          </>
        ) : (
          fields.map((field) => (
          <Box key={field.label} sx={rowSx}>
            <Typography sx={labelSx}>{field.label}</Typography>
            <Typography sx={valueSx}>{field.value}</Typography>
          </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

const AgentProfile = () => {
  const { agentToken, agentData } = useAuth();
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
  const agentEmail = agentData?.email || "";

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editAgentInfo, setEditAgentInfo] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    businessType: "",
    companyName: "",
    mobile: "",
    companyAddress: "",
    email: "",
    password: "",
    isActive: true,
  });
  const [fileData, setFileData] = useState({
    tinCopy: null,
    nidCopy: null,
    civilAviationCopy: null,
    logo: null,
  });
  const [updating, setUpdating] = useState(false);
  const [editDocuments, setEditDocuments] = useState(false);
  const [viewDocumentOpen, setViewDocumentOpen] = useState(false);
  const [viewingDocument, setViewingDocument] = useState({
    field: null,
    url: null,
    name: null,
  });

  useEffect(() => {
    const fetchAgentProfile = async () => {
      const token = agentToken || localStorage.getItem("agentToken") || "";

      if (!token || !agentEmail) {
        setError("Agent token or email missing. Please login again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          email: agentEmail,
        });

        const response = await axios.get(
          `${baseUrl}/agent/list?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Handle response structure: array with agentInfo and activityLog
        const responseData = response?.data?.data || response?.data || [];
        const firstItem = Array.isArray(responseData) ? responseData[0] : responseData;
        const agentInfo = firstItem?.agentInfo || firstItem || {};
        setProfileData(agentInfo);
      } catch (err) {
        const apiMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load agent profile.";
        setError(apiMessage);
        console.error("Fetch agent profile failed:", err?.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    if (agentEmail) {
      fetchAgentProfile();
    }
  }, [agentToken, agentEmail, baseUrl]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to get field value or show N/A
  const getFieldValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }
    return value;
  };

  // Map API response to company information fields
  const companyInformation = profileData
    ? [
        { label: "Company Name", value: getFieldValue(profileData.companyName), fieldKey: "companyName" },
        { label: "Agent Name", value: getFieldValue(profileData.name), fieldKey: "name" },
        { label: "Business Type", value: getFieldValue(profileData.businessType), fieldKey: "businessType" },
        { label: "Company Address", value: getFieldValue(profileData.companyAddress), fieldKey: "companyAddress" },
        { label: "Mobile", value: getFieldValue(profileData.mobile), fieldKey: "mobile" },
        { label: "Status", value: profileData.isActive ? "Active" : "Inactive", fieldKey: "isActive" },
        { label: "Created At", value: formatDate(profileData.createdAt) },
      ]
    : [];

  // Map API response to login credentials fields
  const loginCredentials = profileData
    ? [
        { label: "Email", value: getFieldValue(profileData.email), fieldKey: "email" },
        { label: "Password", value: "••••••••", fieldKey: "password" },
      ]
    : [];

  const handleEditAgentInfo = () => {
    if (profileData) {
      setEditFormData({
        name: profileData.name || "",
        businessType: profileData.businessType || "",
        companyName: profileData.companyName || "",
        mobile: profileData.mobile || "",
        companyAddress: profileData.companyAddress || "",
        email: profileData.email || "",
        password: "",
        isActive: profileData.isActive !== undefined ? profileData.isActive : true,
      });
      setEditAgentInfo(true);
    }
  };

  const handleCancelEdit = () => {
    setEditAgentInfo(false);
    setEditFormData({
      name: "",
      businessType: "",
      companyName: "",
      mobile: "",
      companyAddress: "",
      email: "",
      password: "",
      isActive: true,
    });
    setFileData({
      tinCopy: null,
      nidCopy: null,
      civilAviationCopy: null,
      logo: null,
    });
  };

  const handleFileChange = (field, file) => {
    setFileData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const getDocumentUrl = (field) => {
    if (field === "logo") return profileData?.logoUrl || profileData?.logo;
    return profileData?.[field];
  };

  const getDocumentDisplayUrl = (field) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
    const docUrl = getDocumentUrl(field);
    if (!docUrl) return null;
    return docUrl.startsWith("http") ? docUrl : `${baseUrl}/${docUrl}`;
  };

  const handleViewDocument = (field) => {
    const token = agentToken || localStorage.getItem("agentToken") || "";
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";
    
    // Check if there's a newly selected file
    if (fileData[field]) {
      const fileUrl = URL.createObjectURL(fileData[field]);
      setViewingDocument({
        field: field,
        url: fileUrl,
        name: fileData[field].name,
      });
      setViewDocumentOpen(true);
      return;
    }
    
    // Check if there's an existing document URL in profileData
    const documentUrl = getDocumentUrl(field);
    if (documentUrl) {
      // If it's a full URL, use it directly, otherwise construct it
      const fullUrl = documentUrl.startsWith("http") 
        ? documentUrl 
        : `${baseUrl}/${documentUrl}`;
      
      setViewingDocument({
        field: field,
        url: fullUrl,
        name: field === "logo" ? "Company Logo" : `${field} Document`,
      });
      setViewDocumentOpen(true);
    }
  };

  const handleCloseDocumentView = () => {
    setViewDocumentOpen(false);
    // Revoke object URL if it was created from a file
    if (viewingDocument.url && viewingDocument.url.startsWith("blob:")) {
      URL.revokeObjectURL(viewingDocument.url);
    }
    setViewingDocument({
      field: null,
      url: null,
      name: null,
    });
  };

  const handleFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditDocuments = () => setEditDocuments(true);

  const handleCancelDocuments = () => {
    setEditDocuments(false);
    setFileData({ tinCopy: null, nidCopy: null, civilAviationCopy: null, logo: null });
  };

  const handleSaveDocuments = async () => {
    const token = agentToken || localStorage.getItem("agentToken") || "";
    if (!token || !agentEmail || !profileData?.id) {
      toast.error("Agent token, email, or ID missing. Please login again.");
      return;
    }
    const hasFiles = Object.values(fileData).some((f) => f !== null);
    if (!hasFiles) {
      toast.error("Select at least one document to update.");
      return;
    }
    setUpdating(true);
    try {
      const formData = new FormData();
      if (fileData.tinCopy) formData.append("tinCopy", fileData.tinCopy);
      if (fileData.nidCopy) formData.append("nidCopy", fileData.nidCopy);
      if (fileData.civilAviationCopy) formData.append("civilAviationCopy", fileData.civilAviationCopy);
      if (fileData.logo) formData.append("logo", fileData.logo);
      await axios.patch(
        `${baseUrl}/agent/${profileData.id}?email=${encodeURIComponent(agentEmail)}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Documents updated successfully!");
      setEditDocuments(false);
      setFileData({ tinCopy: null, nidCopy: null, civilAviationCopy: null, logo: null });
      const params = new URLSearchParams({ email: agentEmail });
      const res = await axios.get(`${baseUrl}/agent/list?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = res?.data?.data || res?.data || [];
      const first = Array.isArray(data) ? data[0] : data;
      setProfileData(first?.agentInfo || first || {});
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to update documents.";
      toast.error(msg);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveAgentInfo = async () => {
    const token = agentToken || localStorage.getItem("agentToken") || "";

    if (!token || !agentEmail || !profileData?.id) {
      toast.error("Agent token, email, or ID missing. Please login again.");
      return;
    }

    setUpdating(true);

    try {
      // Check if we have files to upload
      const hasFiles = Object.values(fileData).some((file) => file !== null);

      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();

        // Add text fields
        if (editFormData.name) formData.append("name", editFormData.name);
        if (editFormData.businessType) formData.append("businessType", editFormData.businessType);
        if (editFormData.companyName) formData.append("companyName", editFormData.companyName);
        if (editFormData.mobile) formData.append("mobile", editFormData.mobile);
        if (editFormData.companyAddress) formData.append("companyAddress", editFormData.companyAddress);
        if (editFormData.email) formData.append("email", editFormData.email);
        if (editFormData.password) formData.append("password", editFormData.password);
        if (editFormData.isActive !== undefined) formData.append("isActive", editFormData.isActive);

        // Add files
        if (fileData.tinCopy) {
          formData.append("tinCopy", fileData.tinCopy);
        }
        if (fileData.nidCopy) {
          formData.append("nidCopy", fileData.nidCopy);
        }
        if (fileData.civilAviationCopy) {
          formData.append("civilAviationCopy", fileData.civilAviationCopy);
        }
        if (fileData.logo) {
          formData.append("logo", fileData.logo);
        }

        const response = await axios.patch(
          `${baseUrl}/agent/${profileData.id}?email=${encodeURIComponent(agentEmail)}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data) {
          toast.success("Agent profile updated successfully!");
          setEditAgentInfo(false);
          setFileData({
            tinCopy: null,
            nidCopy: null,
            civilAviationCopy: null,
            logo: null,
          });
          // Refresh profile data
          const fetchAgentProfile = async () => {
            const params = new URLSearchParams({
              email: agentEmail,
            });

            const refreshResponse = await axios.get(
              `${baseUrl}/agent/list?${params.toString()}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const responseData = refreshResponse?.data?.data || refreshResponse?.data || [];
            const firstItem = Array.isArray(responseData) ? responseData[0] : responseData;
            const agentInfo = firstItem?.agentInfo || firstItem || {};
            setProfileData(agentInfo);
          };

          await fetchAgentProfile();
          return;
        }
      } else {
        // Use JSON for text-only updates
        const payload = {};

        // Map form fields to API fields
        if (editFormData.name) payload.name = editFormData.name;
        if (editFormData.businessType) payload.businessType = editFormData.businessType;
        if (editFormData.companyName) payload.companyName = editFormData.companyName;
        if (editFormData.mobile) payload.mobile = editFormData.mobile;
        if (editFormData.companyAddress) payload.companyAddress = editFormData.companyAddress;
        if (editFormData.email) payload.email = editFormData.email;
        if (editFormData.password) payload.password = editFormData.password;
        if (editFormData.isActive !== undefined) payload.isActive = editFormData.isActive;

        const response = await axios.patch(
          `${baseUrl}/agent/${profileData.id}?email=${encodeURIComponent(agentEmail)}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          toast.success("Agent profile updated successfully!");
          setEditAgentInfo(false);
          // Refresh profile data
          const fetchAgentProfile = async () => {
            const params = new URLSearchParams({
              email: agentEmail,
            });

            const refreshResponse = await axios.get(
              `${baseUrl}/agent/list?${params.toString()}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            const responseData = refreshResponse?.data?.data || refreshResponse?.data || [];
            const firstItem = Array.isArray(responseData) ? responseData[0] : responseData;
            const agentInfo = firstItem?.agentInfo || firstItem || {};
            setProfileData(agentInfo);
          };

          await fetchAgentProfile();
        }
      }
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update agent profile.";
      toast.error(apiMessage);
      console.error("Update agent profile failed:", err?.response?.data || err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          px: { xs: 2, md: 4 },
          py: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "var(--primary-color, #123D6E)" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          px: { xs: 2, md: 9.5 },
          py: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: 14, color: "#d32f2f" }}>{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, md: 4},
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Section
        title="Company Information"
        subtitle="Basic info, for a faster booking experience"
        fields={companyInformation}
        editMode={editAgentInfo}
        onEdit={handleEditAgentInfo}
        onCancel={handleCancelEdit}
        onSave={handleSaveAgentInfo}
        formData={editFormData}
        onFormChange={handleFormChange}
        updating={updating}
      />

      {/* Documents Section - always visible; Edit opens only document update */}
      <Box sx={sectionCardSx}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography sx={sectionTitleSx}>Documents</Typography>
            <Typography sx={sectionSubtitleSx}>Your uploaded documents</Typography>
          </Box>
          {!editDocuments ? (
            <Box
              onClick={handleEditDocuments}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                color: "var(--primary-color, #123D6E)",
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 16, color: "var(--primary-color, #123D6E)" }} />
              <Typography sx={{ fontSize: "14px", color: "var(--primary-color, #123D6E)", textDecoration: "underline", fontWeight: 500 }}>
                Edit
              </Typography>
            </Box>
          ) : null}
        </Box>
        <Box sx={{ mt: 2.5 }}>
          {[
            { key: "tinCopy", label: "TIN Copy", accept: ".pdf,.jpg,.jpeg,.png" },
            { key: "nidCopy", label: "NID Copy", accept: ".pdf,.jpg,.jpeg,.png" },
            { key: "civilAviationCopy", label: "Civil Aviation Copy", accept: ".pdf,.jpg,.jpeg,.png" },
            { key: "logo", label: "Company Logo", accept: ".jpg,.jpeg,.png,.gif,.svg" },
          ].map(({ key, label, accept }) => {
            const displayUrl = getDocumentDisplayUrl(key);
            const imgSrc = fileData[key] ? undefined : displayUrl;
            return (
              <Box key={key} sx={rowSx}>
                <Typography sx={labelSx}>{label}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  {imgSrc ? (
                    <Box
                      component="img"
                      src={imgSrc}
                      alt={label}
                      onClick={() => handleViewDocument(key)}
                      role="button"
                      sx={{
                        maxWidth: 120,
                        maxHeight: 80,
                        objectFit: "contain",
                        border: "1px solid #E5E7EB",
                        borderRadius: 1,
                        cursor: "pointer",
                        "&:hover": { opacity: 0.9 },
                      }}
                    />
                  ) : fileData[key] ? (
                    <Typography sx={{ ...valueSx, color: "var(--primary-color, #123D6E)" }}>{fileData[key].name}</Typography>
                  ) : (
                    <Typography sx={valueSx}>Not uploaded</Typography>
                  )}
                  {editDocuments && (
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        textTransform: "none",
                        fontSize: "13.5px",
                        borderColor: "#E5E7EB",
                        color: "#111827",
                        "&:hover": {
                          borderColor: "var(--primary-color, #123D6E)",
                          backgroundColor: "rgba(18, 61, 110, 0.04)",
                        },
                      }}
                    >
                      Choose File
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleFileChange(key, e.target.files[0])}
                        accept={accept}
                      />
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>

        {editDocuments && (
          <Box sx={{ display: "flex", gap: 2, mt: 2.5 }}>
            <Button
              variant="outlined"
              onClick={handleCancelDocuments}
              disabled={updating}
              sx={{
                textTransform: "none",
                borderColor: "#E5E7EB",
                color: "#111827",
                "&:hover": { borderColor: "var(--primary-color, #123D6E)", bgcolor: "rgba(18, 61, 110, 0.04)" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveDocuments}
              disabled={updating}
              sx={{
                textTransform: "none",
                bgcolor: "var(--primary-color, #123D6E)",
                "&:hover": { bgcolor: "var(--primary-color, #123D6E)", opacity: 0.9 },
              }}
            >
              {updating ? "Updating…" : "Documents updated"}
            </Button>
          </Box>
        )}

      </Box>

      <Section
        title="Login Credentials"
        subtitle="Manage your email address, mobile number and password"
        fields={loginCredentials}
        editMode={editAgentInfo}
        onEdit={handleEditAgentInfo}
        onCancel={handleCancelEdit}
        onSave={handleSaveAgentInfo}
        formData={editFormData}
        onFormChange={handleFormChange}
        updating={updating}
      />

      {/* Document View Modal */}
      <Dialog
        open={viewDocumentOpen}
        onClose={handleCloseDocumentView}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "80vh",
            width: "90%",
            maxWidth: "600px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#111827" }}>
            {viewingDocument.name || "View Document"}
          </Typography>
          <IconButton
            onClick={handleCloseDocumentView}
            sx={{
              color: "#6B7280",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent 
          sx={{ 
            p: 0, 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "300px",
            maxHeight: "60vh",
            overflow: "auto",
            backgroundColor: "#f5f5f5",
          }}
        >
          {viewingDocument.url && (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {viewingDocument.field === "logo" || 
               (viewingDocument.url && /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(viewingDocument.url)) ? (
                <img
                  src={viewingDocument.url}
                  alt={viewingDocument.name || "Document"}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                <iframe
                  src={viewingDocument.url}
                  title={viewingDocument.name || "Document"}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "300px",
                    border: "none",
                  }}
                />
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDocumentView}
            sx={{
              textTransform: "none",
              color: "#6B7280",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentProfile;

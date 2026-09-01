export const superAdminRouteMeta = {
  "/super-admin/overview": {
    section: null,
    label: "Overview"
  },
  "/super-admin/candidates": {
    section: "Management",
    label: "Candidates"
  },
  "/super-admin/candidates/create": {
    items: [
      { label: "Management" },
      { label: "Candidates", path: "/super-admin/candidates" },
      { label: "Add candidate" }
    ]
  },
  "/super-admin/employers": {
    section: "Management",
    label: "Employers"
  },
  "/super-admin/employers/create": {
    items: [
      { label: "Management" },
      { label: "Employers", path: "/super-admin/employers" },
      { label: "Add employer" }
    ]
  },
  "/super-admin/employer-verification": {
    section: "Moderation",
    label: "Employer verification"
  },
  "/super-admin/job-review": {
    section: "Moderation",
    label: "Job review"
  },
  "/super-admin/categories": {
    section: "Catalog",
    label: "Categories"
  },
  "/super-admin/categories/create": {
    items: [
      { label: "Catalog" },
      { label: "Categories", path: "/super-admin/categories" },
      { label: "Add category" }
    ]
  },
  "/super-admin/locations": {
    section: "Catalog",
    label: "Locations"
  },
  "/super-admin/locations/create": {
    items: [
      { label: "Catalog" },
      { label: "Locations", path: "/super-admin/locations" },
      { label: "Add location" }
    ]
  },
  "/super-admin/skills": {
    section: "Catalog",
    label: "Skills"
  },
  "/super-admin/skills/create": {
    items: [
      { label: "Catalog" },
      { label: "Skills", path: "/super-admin/skills" },
      { label: "Add skill" }
    ]
  },
  "/super-admin/notifications": {
    section: "Communication",
    label: "Notifications"
  },
  "/super-admin/reports": {
    section: "Insights",
    label: "Reports"
  },
  "/super-admin/analytics": {
    section: "Insights",
    label: "Analytics"
  },
  "/super-admin/audit-security": {
    section: "System",
    label: "Audit & Security"
  },
  "/super-admin/admins": {
    section: "Admins",
    label: "Admin"
  },
  "/super-admin/admins/create": {
    items: [
      { label: "Admins", path: "/super-admin/admins" },
      { label: "Admin", path: "/super-admin/admins" },
      { label: "Create Admin" }
    ]
  }
};

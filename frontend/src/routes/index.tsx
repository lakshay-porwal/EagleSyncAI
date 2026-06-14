import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";

// Public Pages
import { Landing } from "../pages/Landing";
import { About } from "../pages/About";
import { Features } from "../pages/Features";
import { Contact } from "../pages/Contact";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";

// Dashboard Pages
import { DashboardHome } from "../pages/DashboardHome";
import { CapabilityAnalysis } from "../pages/CapabilityAnalysis";
import { Careers } from "../pages/Careers";
import { Roadmap } from "../pages/Roadmap";
import { InterviewHub } from "../pages/InterviewHub";
import { Opportunities } from "../pages/Opportunities";
import { ProgressTracker } from "../pages/ProgressTracker";
import { AIChatMentor } from "../pages/AIChatMentor";
import { EaglePassModule } from "../pages/EaglePassModule";
import { Profile } from "../pages/Profile";
import { Settings } from "../pages/Settings";
import { Onboarding } from "../pages/Onboarding";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <Landing />
          </PublicLayout>
        }
      />
      <Route
        path="/about"
        element={
          <PublicLayout>
            <About />
          </PublicLayout>
        }
      />
      <Route
        path="/features"
        element={
          <PublicLayout>
            <Features />
          </PublicLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <PublicLayout>
            <Contact />
          </PublicLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicLayout>
            <Signup />
          </PublicLayout>
        }
      />

      {/* Authenticated Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <DashboardHome />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/capability"
        element={
          <DashboardLayout>
            <CapabilityAnalysis />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/careers"
        element={
          <DashboardLayout>
            <Careers />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/roadmap"
        element={
          <DashboardLayout>
            <Roadmap />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/interview"
        element={
          <DashboardLayout>
            <InterviewHub />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/opportunities"
        element={
          <DashboardLayout>
            <Opportunities />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/progress"
        element={
          <DashboardLayout>
            <ProgressTracker />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/chat"
        element={
          <DashboardLayout>
            <AIChatMentor />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/eaglepass"
        element={
          <DashboardLayout>
            <EaglePassModule />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import ScrollToTop from '@/components/ScrollToTop';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

// Layouts
import ClientDashboardLayout from '@/layouts/ClientDashboardLayout';
import AdminDashboardLayout from '@/layouts/AdminDashboardLayout';

// Public Pages
const Home = lazy(() => import('@/pages/Home'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const OurStory = lazy(() => import('@/pages/OurStory'));
const Products = lazy(() => import('@/pages/Products'));
const VpsCloud = lazy(() => import('@/pages/VpsCloud'));
const VpsEconomy = lazy(() => import('@/pages/VpsEconomy'));
const VpsGames = lazy(() => import('@/pages/VpsGames'));
const DedicatedServer = lazy(() => import('@/pages/DedicatedServer'));
const Colocation = lazy(() => import('@/pages/Colocation'));
const Register = lazy(() => import('@/pages/Register'));
const Login = lazy(() => import('@/pages/Login'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Status = lazy(() => import('@/pages/Status'));
const BlogHome = lazy(() => import('@/pages/blog/BlogHome'));
const BlogPost = lazy(() => import('@/pages/blog/BlogPost'));
const TermosDeUso = lazy(() => import('@/pages/TermosDeUso'));
const PoliticaDePrivacidade = lazy(() => import('@/pages/PoliticaDePrivacidade'));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail'));
const FirstAdminSetup = lazy(() => import('@/pages/FirstAdminSetup'));

// Client Dashboard Pages
const ClientDashboardHome = lazy(() => import('@/pages/client-dashboard/ClientDashboardHome'));
const ClientServices = lazy(() => import('@/pages/client-dashboard/Services'));
const ClientInvoices = lazy(() => import('@/pages/client-dashboard/Invoices'));
const ClientSupport = lazy(() => import('@/pages/client-dashboard/Support'));
const ClientProfile = lazy(() => import('@/pages/client-dashboard/Profile'));
const ClientSandbox = lazy(() => import('@/pages/client-dashboard/ClientSandbox'));

// Admin Dashboard Pages
const AdminDashboardHome = lazy(() => import('@/pages/admin-dashboard/AdminDashboardHome'));
const AdminClients = lazy(() => import('@/pages/admin-dashboard/Clients'));
const AdminAllServices = lazy(() => import('@/pages/admin-dashboard/AllServices'));
const AdminAllInvoices = lazy(() => import('@/pages/admin-dashboard/AllInvoices'));
const AdminTickets = lazy(() => import('@/pages/admin-dashboard/Tickets'));
const StatusManagement = lazy(() => import('@/pages/admin-dashboard/StatusManagement'));
const StatusServicesManagement = lazy(() => import('@/pages/admin-dashboard/StatusServicesManagement'));
const SandboxDashboard = lazy(() => import('@/pages/admin-dashboard/SandboxDashboard'));
const SystemSettings = lazy(() => import('@/pages/admin-dashboard/SystemSettings'));
const AdminManagement = lazy(() => import('@/pages/admin-dashboard/AdminManagement'));
const AccountSettings = lazy(() => import('@/pages/admin-dashboard/AccountSettings'));

const PageLoader = () => (
  <div className="flex h-[calc(100vh-80px)] items-center justify-center">
    <LoadingSpinner />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <PageLoader />;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
        if (user.role === 'client') return <Navigate to="/client-dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      <Helmet>
        <title>HostEver - Soluções de Hospedagem Premium</title>
      </Helmet>
      
      <Toaster />
      <ScrollToTop />
      
      <div className="w-full bg-background min-h-screen relative flex flex-col overflow-x-hidden">
        <Routes>
           <Route path="/admin-dashboard/*" element={null} />
           <Route path="/client-dashboard/*" element={null} />
           <Route path="/executive-dashboard/*" element={null} />
           <Route path="*" element={<Header />} />
        </Routes>
        
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/nossa-historia" element={<OurStory />} />
              <Route path="/sobre-nos" element={<OurStory />} />
              <Route path="/products" element={<Products />} />
              
              {/* Páginas de Produtos */}
              <Route path="/vps-cloud" element={<VpsCloud />} />
              <Route path="/vps-economy" element={<VpsEconomy />} />
              <Route path="/vps-games" element={<VpsGames />} />
              <Route path="/dedicated-server" element={<DedicatedServer />} />
              <Route path="/colocation" element={<Colocation />} />
              
              {/* Auth */}
              <Route path="/register" element={<Register />} />
              <Route path="/area-do-cliente" element={<Navigate to="/client-dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/setup" element={<FirstAdminSetup />} />
              
              {/* Other */}
              <Route path="/status" element={<Status />} />
              <Route path="/blog" element={<BlogHome />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/termos-de-uso" element={<TermosDeUso />} />
              <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
              
              {/* Redirect legacy routes */}
              <Route path="/client-login" element={<Navigate to="/login" replace />} />
              <Route path="/admin-login" element={<Navigate to="/login" replace />} />

              {/* Client Dashboard Routes */}
              <Route path="/client-dashboard" element={
                  <ProtectedRoute allowedRoles={['client', 'executive']}>
                      <ClientDashboardLayout />
                  </ProtectedRoute>
              }>
                <Route index element={<ClientDashboardHome />} />
                <Route path="services" element={<ClientServices />} />
                <Route path="invoices" element={<ClientInvoices />} />
                <Route path="support" element={<ClientSupport />} />
                <Route path="profile" element={<ClientProfile />} />
                <Route path="sandbox" element={<ClientSandbox />} />
              </Route>

              {/* Executive Dashboard */}
              <Route path="/executive-dashboard" element={
                  <ProtectedRoute allowedRoles={['executive']}>
                      <ClientDashboardLayout /> 
                  </ProtectedRoute>
              }>
                 <Route index element={<ClientDashboardHome />} />
              </Route>

              {/* Admin Dashboard Routes */}
              <Route path="/admin-dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboardLayout />
                  </ProtectedRoute>
              }>
                <Route index element={<AdminDashboardHome />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="services" element={<AdminAllServices />} />
                <Route path="invoices" element={<AdminAllInvoices />} />
                <Route path="tickets" element={<AdminTickets />} />
                <Route path="status" element={<StatusServicesManagement />} />
                <Route path="sandbox" element={<SandboxDashboard />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="admins" element={<AdminManagement />} />
                <Route path="account" element={<AccountSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        
        <Routes>
           <Route path="/admin-dashboard/*" element={null} />
           <Route path="/client-dashboard/*" element={null} />
           <Route path="/executive-dashboard/*" element={null} />
           <Route path="*" element={<Footer />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

/* eslint-disable react-refresh/only-export-components */
import React, { lazy, Suspense } from "react"
import { Navigate, createBrowserRouter } from "react-router-dom"
import Loading from "./components/Loading"
import ErrorPage from "./pages/404"

const InputDetails = lazy(
  () => import("./pages/dashboard/input/warehouse/details")
)
const AdminInputDetails = lazy(
  () => import("./pages/dashboard/input/admin/details")
)
const VerifyNIN = lazy(() => import("./pages/test"))
const PrivateRoute = lazy(() => import("./pages"))
const Layout = lazy(() => import("./pages/dashboard/layout"))
const AuthLayout = lazy(() => import("./pages/auth"))
const TransactionList = lazy(
  () => import("./pages/account/screens/TransactionList")
)
const WarehouseInputTable = lazy(
  () => import("./pages/dashboard/input/warehouse/table")
)
const WarehouseInputForm = lazy(
  () => import("./pages/dashboard/input/warehouse/form")
)
const PrivateLayout = lazy(() => import("./pages/account/private"))
const AccountLayout = lazy(() => import("./pages/account"))
const AccountAuthLayout = lazy(() => import("./pages/account/authLayout"))
const AdminInputTable = lazy(
  () => import("./pages/dashboard/input/admin/table")
)
const AdminInputForm = lazy(() => import("./pages/dashboard/input/admin/form"))
const CertificatePage = lazy(
  () => import("./pages/dashboard/cooperative/certificatePage")
)
const AffidavitPage = lazy(
  () => import("./pages/dashboard/cooperative/affidavitPage")
)
const WarehouseDetails = lazy(
  () => import("./pages/dashboard/warehouse/details")
)
const UserDetails = lazy(() => import("./pages/dashboard/user/details"))
const CooperativeDetails = lazy(
  () => import("./pages/dashboard/cooperative/details")
)
const FarmerLoginPage = lazy(() => import("./pages/account/screens/login"))
const FarmerVerifyOtpPage = lazy(() => import("./pages/account/screens/Otp"))
const FarmerDashboard = lazy(() => import("./pages/account/screens/dashboard"))
const WCommodityManagement = lazy(
  () => import("./pages/dashboard/w_commodities")
)
const WCommodityTable = lazy(
  () => import("./pages/dashboard/w_commodities/table")
)
const Login = lazy(() => import("./pages/auth/Login"))
const SignUp = lazy(() => import("./pages/auth/Signup"))
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"))
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"))
const Otp = lazy(() => import("./pages/auth/Otp"))
const UserManagement = lazy(() => import("./pages/dashboard/user/index"))
const UsersForm = lazy(() => import("./pages/dashboard/user/form"))
const UserTable = lazy(() => import("./pages/dashboard/user/table"))
const WarehouseForm = lazy(() => import("./pages/dashboard/warehouse/form"))
const WarehouseManagement = lazy(() => import("./pages/dashboard/warehouse"))
const WarehouseTable = lazy(() => import("./pages/dashboard/warehouse/table"))
const Dashboard = lazy(() => import("./pages/dashboard"))
const CommodityTable = lazy(() => import("./pages/dashboard/commodity/table"))
const CommodityManagement = lazy(() => import("./pages/dashboard/commodity"))
const CommodityForm = lazy(() => import("./pages/dashboard/commodity/form"))
const CooperativeManagement = lazy(
  () => import("./pages/dashboard/cooperative")
)
const CooperativeForm = lazy(() => import("./pages/dashboard/cooperative/form"))
const CooperativeTable = lazy(
  () => import("./pages/dashboard/cooperative/table")
)
const BundleManagement = lazy(() => import("./pages/dashboard/bundle"))
const BundleTable = lazy(() => import("./pages/dashboard/bundle/table"))
const BundleForm = lazy(() => import("./pages/dashboard/bundle/form"))
const InputManagement = lazy(() => import("./pages/dashboard/input"))
const GradeManagement = lazy(() => import("./pages/dashboard/grade"))
const GradeTable = lazy(() => import("./pages/dashboard/grade/table"))
const GradeForm = lazy(() => import("./pages/dashboard/grade/form"))
const ClientManagement = lazy(() => import("./pages/dashboard/client"))
const ClientTable = lazy(() => import("./pages/dashboard/client/table"))
const ClientForm = lazy(() => import("./pages/dashboard/client/form"))
const DispatchManagement = lazy(() => import("./pages/dashboard/dispatch"))
const DispatchTable = lazy(() => import("./pages/dashboard/dispatch/table"))
const DispatchForm = lazy(() => import("./pages/dashboard/dispatch/form"))
const TransactionManagement = lazy(
  () => import("./pages/dashboard/transaction")
)
const TransactionTrading = lazy(
  () => import("./pages/dashboard/transaction/trading")
)
const TransactionTradingForm = lazy(
  () => import("./pages/dashboard/transaction/trading/form")
)
const TransactionStorageTable = lazy(
  () => import("./pages/dashboard/transaction/storage/table")
)
const TransactionStorageForm = lazy(
  () => import("./pages/dashboard/transaction/storage/form")
)
const TransactionStorage = lazy(
  () => import("./pages/dashboard/transaction/storage")
)
const TransactionTradingTable = lazy(
  () => import("./pages/dashboard/transaction/trading/table")
)
const FarmerManagement = lazy(() => import("./pages/dashboard/farmer/index"))
const FarmerTable = lazy(() => import("./pages/dashboard/farmer/table"))
const FarmerForm = lazy(() => import("./pages/dashboard/farmer/form"))
const FarmerDetails = lazy(() => import("./pages/dashboard/farmer/details"))
const DisbursementManagement = lazy(
  () => import("./pages/dashboard/disbursement")
)
const DisbursementLoanForm = lazy(
  () => import("./pages/dashboard/disbursement/loan")
)
const DisbursementRepaymentForm = lazy(
  () => import("./pages/dashboard/disbursement/repayment")
)
const ProjectManagement = lazy(() => import("./pages/dashboard/project"))
const ProjectTable = lazy(() => import("./pages/dashboard/project/table"))
const ProjectForm = lazy(() => import("./pages/dashboard/project/form"))
const TeamTable = lazy(() => import("./pages/dashboard/team/table"))
const TeamManagement = lazy(() => import("./pages/dashboard/team"))
const TeamForm = lazy(() => import("./pages/dashboard/team/form"))
const VisitationManagement = lazy(() => import("./pages/dashboard/visitation"))
const VisitationTable = lazy(() => import("./pages/dashboard/visitation/table"))
const VisitationForm = lazy(() => import("./pages/dashboard/visitation/form"))
const FinanceManagement = lazy(() => import("./pages/dashboard/finance/index"))
const Settings = lazy(() => import("./pages/dashboard/settings"))
const Security = lazy(() => import("./pages/dashboard/settings/security"))
const ProfileManagement = lazy(
  () => import("./pages/dashboard/settings/profile")
)
const UserProfile = lazy(
  () => import("./pages/dashboard/settings/profile/profile")
)
const ProfileForm = lazy(
  () => import("./pages/dashboard/settings/profile/form")
)
const DisbursementTable = lazy(
  () => import("./pages/dashboard/disbursement/table")
)
const RegisterPaymentForm = lazy(
  () => import("./pages/dashboard/finance/registration")
)
const EquityPaymentForm = lazy(
  () => import("./pages/dashboard/payments/equity/equity")
)
const PaymentRegTable = lazy(
  () => import("./pages/dashboard/payments/registration/table")
)
const PaymentEquityTable = lazy(
  () => import("./pages/dashboard/payments/equity/table")
)
const CashDisbursement = lazy(
  () => import("./pages/dashboard/payments/disbursement")
)
const CashDisbursementTable = lazy(
  () => import("./pages/dashboard/payments/disbursement/table")
)
const CashRepaymentForm = lazy(
  () => import("./pages/dashboard/payments/disbursement/repayment")
)
const EquityPayment = lazy(() => import("./pages/dashboard/payments/equity"))
const RegistrationPayment = lazy(
  () => import("./pages/dashboard/payments/registration")
)
const RepaymentTable = lazy(
  () => import("./pages/dashboard/disbursement/repaymentTable ")
)

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"dashboard"} replace />,
    errorElement: <ErrorPage />,
  },
  // Auth routes
  {
    path: "auth",
    element: (
      <Suspense fallback={<Loading />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "sign-up",
        element: (
          <Suspense fallback={<Loading />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<Loading />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "reset-password",
        element: (
          <Suspense fallback={<Loading />}>
            <ResetPassword />
          </Suspense>
        ),
      },
      {
        path: "verify-otp",
        element: (
          <Suspense fallback={<Loading />}>
            <Otp />
          </Suspense>
        ),
      },
      {
        path: "test",
        element: (
          <Suspense fallback={<Loading />}>
            <VerifyNIN />
          </Suspense>
        ),
      },
    ],
  },
  // Dashboard routes
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Suspense fallback={<Loading />}>
          <Layout />
        </Suspense>
      </PrivateRoute>
    ),
    children: [
      // dashboard
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      // user management
      {
        path: "user-management",
        element: (
          <Suspense fallback={<Loading />}>
            <UserManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <UserTable />
              </Suspense>
            ),
          },
          {
            path: "feos",
            element: (
              <Suspense fallback={<Loading />}>
                <UserTable />
              </Suspense>
            ),
          },
          {
            path: "warehouse admins",
            element: (
              <Suspense fallback={<Loading />}>
                <UserTable />
              </Suspense>
            ),
          },
          {
            path: "warehouse",
            element: (
              <Suspense fallback={<Loading />}>
                <UserTable />
              </Suspense>
            ),
          },
          {
            path: "finance",
            element: (
              <Suspense fallback={<Loading />}>
                <UserTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <UsersForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <UsersForm />
              </Suspense>
            ),
          },
          {
            path: "details",
            element: <UserDetails />,
          },
        ],
      },
      // warehouse management
      {
        path: "warehouse-management",
        element: (
          <Suspense fallback={<Loading />}>
            <WarehouseManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <WarehouseTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <WarehouseForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <WarehouseForm />
              </Suspense>
            ),
          },
          {
            path: "details",
            element: (
              <Suspense fallback={<Loading />}>
                <WarehouseDetails />,
              </Suspense>
            ),
          },
        ],
      },
      // warehouse commodity management
      {
        path: "warehouse-commodity-management",
        element: (
          <Suspense fallback={<Loading />}>
            <WCommodityManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <WCommodityTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <CommodityForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <CommodityForm />
              </Suspense>
            ),
          },
          {
            path: "detail",
            element: <React.Fragment></React.Fragment>,
          },
        ],
      },
      // commodity management
      {
        path: "commodity-management",
        element: (
          <Suspense fallback={<Loading />}>
            <CommodityManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <CommodityTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <CommodityForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <CommodityForm />
              </Suspense>
            ),
          },
          {
            path: "detail",
            element: <React.Fragment></React.Fragment>,
          },
        ],
      },
      // cooperative management
      {
        path: "cooperative-management",
        element: (
          <Suspense fallback={<Loading />}>
            <CooperativeManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <CooperativeTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <CooperativeForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <CooperativeForm />
              </Suspense>
            ),
          },
          {
            path: "details",
            element: (
              <Suspense fallback={<Loading />}>
                <CooperativeDetails />
              </Suspense>
            ),
          },
          {
            path: "certificate",
            element: (
              <Suspense fallback={<Loading />}>
                <CertificatePage />
              </Suspense>
            ),
          },
          {
            path: "affidavit",
            element: (
              <Suspense fallback={<Loading />}>
                <AffidavitPage />
              </Suspense>
            ),
          },
        ],
      },
      // Team management
      {
        path: "team-management",
        element: (
          <Suspense fallback={<Loading />}>
            <TeamManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <TeamTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <TeamForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <TeamForm />
              </Suspense>
            ),
          },
          {
            path: "detail",
            element: <React.Fragment></React.Fragment>,
          },
        ],
      },
      // bundle management
      {
        path: "bundle-management",
        element: (
          <Suspense fallback={<Loading />}>
            <BundleManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <BundleTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <BundleForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <BundleForm />
              </Suspense>
            ),
          },
          {
            path: "detail",
            element: <React.Fragment></React.Fragment>,
          },
        ],
      },
      // input management
      {
        path: "input-management",
        element: (
          <Suspense fallback={<Loading />}>
            <InputManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <AdminInputTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <AdminInputForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <AdminInputForm />
              </Suspense>
            ),
          },
          {
            path: "details",
            element: (
              <Suspense fallback={<Loading />}>
                <AdminInputDetails />
              </Suspense>
            ),
          },
        ],
      },
      // warehouse input management
      {
        path: "warehouse-input-management",
        element: (
          <Suspense fallback={<Loading />}>
            <InputManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <WarehouseInputTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <WarehouseInputForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <WarehouseInputForm />
              </Suspense>
            ),
          },
          {
            path: "details",
            element: (
              <Suspense fallback={<Loading />}>
                <InputDetails />
              </Suspense>
            ),
          },
        ],
      },
      // grade managemenet
      {
        path: "grade-management",
        element: (
          <Suspense fallback={<Loading />}>
            <GradeManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <GradeTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <GradeForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <GradeForm />
              </Suspense>
            ),
          },
          {
            path: "detail",
            element: <React.Fragment></React.Fragment>,
          },
        ],
      },
      // client management
      {
        path: "client-management",
        element: (
          <Suspense fallback={<Loading />}>
            <ClientManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <ClientTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <ClientForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <ClientForm />
              </Suspense>
            ),
          },
          {
            path: "detail",
            element: <React.Fragment></React.Fragment>,
          },
        ],
      },
      // dispatch management
      {
        path: "dispatch-management",
        element: (
          <Suspense fallback={<Loading />}>
            <DispatchManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <DispatchTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <DispatchForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <DispatchForm />
              </Suspense>
            ),
          },
          {
            path: "detail",
            element: <React.Fragment></React.Fragment>,
          },
        ],
      },
      // transaction manangement
      {
        path: "transaction-management",
        element: (
          <Suspense fallback={<Loading />}>
            <TransactionManagement />
          </Suspense>
        ),
        children: [
          {
            path: "trade",
            element: (
              <Suspense fallback={<Loading />}>
                <TransactionTrading />
              </Suspense>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<Loading />}>
                    <TransactionTradingTable />
                  </Suspense>
                ),
              },
              {
                path: "add",
                element: (
                  <Suspense fallback={<Loading />}>
                    <TransactionTradingForm />
                  </Suspense>
                ),
              },
              {
                path: "edit",
                element: (
                  <Suspense fallback={<Loading />}>
                    <TransactionTradingForm />
                  </Suspense>
                ),
              },
              {
                path: "detail",
                element: <React.Fragment></React.Fragment>,
              },
            ],
          },
          {
            path: "storage",
            element: (
              <Suspense fallback={<Loading />}>
                <TransactionStorage />
              </Suspense>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<Loading />}>
                    <TransactionStorageTable />
                  </Suspense>
                ),
              },
              {
                path: "add",
                element: (
                  <Suspense fallback={<Loading />}>
                    <TransactionStorageForm />
                  </Suspense>
                ),
              },
              {
                path: "edit",
                element: (
                  <Suspense fallback={<Loading />}>
                    <TransactionStorageForm />
                  </Suspense>
                ),
              },
              {
                path: "detail",
                element: <React.Fragment></React.Fragment>,
              },
            ],
          },
        ],
      },
      // disbursement management
      {
        path: "disbursement",
        element: (
          <Suspense fallback={<Loading />}>
            <DisbursementManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <DisbursementTable />
              </Suspense>
            ),
          },
          {
            path: "loan",
            element: (
              <Suspense fallback={<Loading />}>
                <DisbursementLoanForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <DisbursementLoanForm />
              </Suspense>
            ),
          },
          {
            path: "repayment",
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<Loading />}>
                    <RepaymentTable />
                  </Suspense>
                ),
              },
              {
                path: "add",
                element: (
                  <Suspense fallback={<Loading />}>
                    <DisbursementRepaymentForm />
                  </Suspense>
                ),
              },
              {
                path: "edit",
                element: (
                  <Suspense fallback={<Loading />}>
                    <DisbursementRepaymentForm />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      // farmer management
      {
        path: "farmer-management",
        element: (
          <Suspense fallback={<Loading />}>
            <FarmerManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <FarmerTable />
              </Suspense>
            ),
          },
          {
            path: "unverified",
            element: (
              <Suspense fallback={<Loading />}>
                <FarmerTable />
              </Suspense>
            ),
          },
          {
            path: "verified",
            element: (
              <Suspense fallback={<Loading />}>
                <FarmerTable />
              </Suspense>
            ),
          },
          {
            path: "unsync",
            element: (
              <Suspense fallback={<Loading />}>
                <FarmerTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <FarmerForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <FarmerForm />
              </Suspense>
            ),
          },
          {
            path: "details",
            element: <FarmerDetails />,
          },
        ],
      },
      // project management
      {
        path: "project-management",
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <ProjectTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <ProjectForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <ProjectForm />
              </Suspense>
            ),
          },
          {
            path: "detail",
            element: <React.Fragment></React.Fragment>,
          },
        ],
      },
      // visitation management
      {
        path: "visitation-management",
        element: (
          <Suspense fallback={<Loading />}>
            <VisitationManagement />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <VisitationTable />
              </Suspense>
            ),
          },
          {
            path: "add",
            element: (
              <Suspense fallback={<Loading />}>
                <VisitationForm />
              </Suspense>
            ),
          },
          {
            path: "edit",
            element: (
              <Suspense fallback={<Loading />}>
                <VisitationForm />
              </Suspense>
            ),
          },
          {
            path: "detail",
            element: <React.Fragment></React.Fragment>,
          },
        ],
      },
      // payment management
      {
        path: "payment",
        element: (
          <Suspense fallback={<Loading />}>
            <FinanceManagement />
          </Suspense>
        ),
        children: [
          {
            path: "registration",
            element: (
              <Suspense fallback={<Loading />}>
                <RegistrationPayment />
              </Suspense>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<Loading />}>
                    <PaymentRegTable />
                  </Suspense>
                ),
              },

              {
                path: "add",
                element: (
                  <Suspense fallback={<Loading />}>
                    <RegisterPaymentForm />
                  </Suspense>
                ),
              },
              {
                path: "edit",
                element: (
                  <Suspense fallback={<Loading />}>
                    <RegisterPaymentForm />
                  </Suspense>
                ),
              },
              {
                path: "detail",
                element: <React.Fragment></React.Fragment>,
              },
            ],
          },
          {
            path: "equity",
            element: (
              <Suspense fallback={<Loading />}>
                <EquityPayment />
              </Suspense>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<Loading />}>
                    <PaymentEquityTable />
                  </Suspense>
                ),
              },
              {
                path: "add",
                element: (
                  <Suspense fallback={<Loading />}>
                    <EquityPaymentForm />
                  </Suspense>
                ),
              },
              {
                path: "edit",
                element: (
                  <Suspense fallback={<Loading />}>
                    <EquityPaymentForm />
                  </Suspense>
                ),
              },
              {
                path: "detail",
                element: <React.Fragment></React.Fragment>,
              },
            ],
          },
          {
            path: "loan",
            element: (
              <Suspense fallback={<Loading />}>
                <CashDisbursement />
              </Suspense>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<Loading />}>
                    <CashDisbursementTable />
                  </Suspense>
                ),
              },
              {
                path: "edit",
                element: (
                  <Suspense fallback={<Loading />}>
                    <CashRepaymentForm />
                  </Suspense>
                ),
              },
              {
                path: "repayment",
                element: (
                  <Suspense fallback={<Loading />}>
                    <CashRepaymentForm />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      // settings
      {
        path: "settings",
        element: (
          <Suspense fallback={<Loading />}>
            <Settings />
          </Suspense>
        ),
        children: [
          {
            path: "profile",
            element: (
              <Suspense fallback={<Loading />}>
                <ProfileManagement />
              </Suspense>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<Loading />}>
                    <UserProfile />
                  </Suspense>
                ),
              },
              {
                path: "edit",
                element: (
                  <Suspense fallback={<Loading />}>
                    <ProfileForm />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "change-password",
            element: (
              <Suspense fallback={<Loading />}>
                <Security />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  // ACCOUNT
  {
    path: "account",
    element: (
      <PrivateLayout>
        <AccountLayout />
      </PrivateLayout>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <FarmerDashboard />
          </Suspense>
        ),
      },
      {
        path: "transaction-history",
        element: (
          <Suspense fallback={<Loading />}>
            <TransactionList />
          </Suspense>
        ),
      },
    ],
  },
  // ACCOUNT AUTH
  {
    path: "account/auth",
    element: <AccountAuthLayout />,
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<Loading />}>
            <FarmerLoginPage />
          </Suspense>
        ),
      },
      {
        path: "verify-otp",
        element: (
          <Suspense fallback={<Loading />}>
            <FarmerVerifyOtpPage />
          </Suspense>
        ),
      },
    ],
  },
])

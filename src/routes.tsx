import React from "react"
import { MdDashboard } from "react-icons/md"
import {
  TbBuildingWarehouse,
  TbPackageImport,
  TbPackageExport,
  TbPackages,
  TbPackage,
  TbTransform,
} from "react-icons/tb"
import { GiFarmer, GiOrganigram } from "react-icons/gi"
import { TiChartBarOutline } from "react-icons/ti"
import {
  FaCalendarCheck,
  FaLayerGroup,
  FaMoneyBill,
  FaMoneyBillWave,
  FaPiggyBank,
  FaShieldAlt,
  FaUserAlt,
  FaUsers,
} from "react-icons/fa"
import { FiUsers } from "react-icons/fi"
import { HiOutlineUserGroup } from "react-icons/hi"
import { AiOutlineSchedule } from "react-icons/ai"
import { IoIosCash } from "react-icons/io"

export interface IRoute {
  name: string
  path: string
  layout: string
  icon?: React.ReactNode
  children?: IRoute[]
}

export const routes: IRoute[] = [
  // Super Admin
  {
    name: "super-admin dashboard",
    path: "/dashboard",
    layout: "super admin",
    icon: <MdDashboard className="text-2xl md:text3xl" />,
    children: [
      // users
      {
        name: "users",
        path: "/dashboard/user-management",
        layout: "super admin",
        icon: <FiUsers className="text-2xl md:text3xl" />,
      },
      // clients
      {
        name: "clients",
        path: "/dashboard/client-management",
        layout: "data analyst",
        icon: <FaUsers className="text-2xl md:text3xl" />,
      },
      // farmers
      {
        name: "farmers",
        path: "/dashboard/farmer-management",
        layout: "warehouse admin",
        icon: <GiFarmer className="text-2xl md:text3xl" />,
      },
      // coopertivies
      {
        name: "cooperativies",
        path: "/dashboard/cooperative-management",
        layout: "super admin",
        icon: <GiOrganigram className="text-2xl md:text3xl" />,
      },
      // team
      {
        name: "team",
        path: "/dashboard/team-management",
        layout: "data analyst",
        icon: <HiOutlineUserGroup className="text-2xl md:text3xl" />,
      },
      // warehouse
      {
        name: "warehouses",
        path: "/dashboard/warehouse-management",
        layout: "super admin",
        icon: <TbBuildingWarehouse className="text-2xl md:text3xl" />,
      },
      // commodities
      {
        name: "commodities",
        path: "/dashboard/commodity-management",
        layout: "super admin",
        icon: <TbPackages className="text-2xl md:text3xl" />,
      },
      // inputs
      {
        name: "inputs",
        path: "/dashboard/input-management",
        layout: "data analyst",
        icon: <TbPackage className="text-2xl md:text3xl" />,
      },
      // bundles
      {
        name: "bundles",
        path: "/dashboard/bundle-management",
        layout: "data analyst",
        icon: <FaLayerGroup className="text-2xl md:text3xl" />,
      },
      // grade
      {
        name: "grades",
        path: "/dashboard/grade-management",
        layout: "data analyst",
        icon: <TiChartBarOutline className="text-2xl md:text3xl" />,
      },
      // disbursement
      {
        name: "disbursed loans",
        path: "/dashboard/disbursement",
        layout: "data analyst",
        icon: <TbPackageExport className="text-2xl md:text3xl" />,
      },
      // dispatch
      {
        name: "dispatch",
        path: "/dashboard/dispatch-management",
        layout: "super admin",
        icon: <TbPackageExport className="text-2xl md:text3xl" />,
      },
      // transaction
      {
        name: "transaction",
        path: "/dashboard/transaction-management",
        layout: "data analyst",
        icon: <TbTransform className="text-2xl md:text3xl" />,
        children: [
          {
            name: "trade",
            path: "/dashboard/transaction-management/trade",
            layout: "data analyst",
          },
          {
            name: "storage",
            path: "/dashboard/transaction-management/storage",
            layout: "data analyst",
          },
        ],
      },

      // project
      {
        name: "project",
        path: "/dashboard/project-management",
        layout: "data analyst",
        icon: <AiOutlineSchedule className="text-2xl md:text3xl" />,
      },
    ],
  },

  // Admin
  {
    name: "admin dashboard",
    path: "/dashboard",
    layout: "data analyst",
    icon: <MdDashboard className="text-2xl md:text3xl" />,
    children: [
      {
        name: "clients",
        path: "/dashboard/client-management",
        layout: "data analyst",
        icon: <FiUsers className="text-2xl md:text3xl" />,
      },
      {
        name: "farmers",
        path: "/dashboard/farmer-management",
        layout: "warehouse admin",
        icon: <GiFarmer className="text-2xl md:text3xl" />,
      },
      {
        name: "cooperativies",
        path: "/dashboard/cooperative-management",
        layout: "data analyst",
        icon: <GiOrganigram className="text-2xl md:text3xl" />,
      },
      {
        name: "team",
        path: "/dashboard/team-management",
        layout: "data analyst",
        icon: <HiOutlineUserGroup className="text-2xl md:text3xl" />,
      },
      {
        name: "disbursed loans",
        path: "/dashboard/disbursement",
        layout: "data analyst",
        icon: <TbPackageExport className="text-2xl md:text3xl" />,
      },
      {
        name: "transaction",
        path: "/dashboard/transaction-management",
        layout: "data analyst",
        icon: <TbTransform className="text-2xl md:text3xl" />,
        children: [
          {
            name: "trade",
            path: "/dashboard/transaction-management/trade",
            layout: "data analyst",
          },
          {
            name: "storage",
            path: "/dashboard/transaction-management/storage",
            layout: "data analyst",
          },
        ],
      },
      {
        name: "inputs",
        path: "/dashboard/input-management",
        layout: "data analyst",
        icon: <TbPackage className="text-2xl md:text3xl" />,
      },
      {
        name: "bundles",
        path: "/dashboard/bundle-management",
        layout: "data analyst",
        icon: <FaLayerGroup className="text-2xl md:text3xl" />,
      },
      {
        name: "commodities",
        path: "/dashboard/commodity-management",
        layout: "data analyst",
        icon: <TbPackages className="text-2xl md:text3xl" />,
      },
      {
        name: "grades",
        path: "/dashboard/grade-management",
        layout: "data analyst",
        icon: <TiChartBarOutline className="text-2xl md:text3xl" />,
      },
      {
        name: "project",
        path: "/dashboard/project-management",
        layout: "data analyst",
        icon: <AiOutlineSchedule className="text-2xl md:text3xl" />,
      },
    ],
  },

  // Area Sales Manager
  {
    name: "warehouse manager dashboard",
    path: "/dashboard",
    layout: "area sales manager",
    icon: <MdDashboard className="text-2xl md:text3xl" />,
    children: [
      // farmers
      {
        name: "farmers",
        path: "/dashboard/farmer-management",
        layout: "warehouse admin",
        icon: <GiFarmer className="text-2xl md:text3xl" />,
      },
      // coopertivies
      {
        name: "cooperativies",
        path: "/dashboard/cooperative-management",
        layout: "super admin",
        icon: <GiOrganigram className="text-2xl md:text3xl" />,
      },
      // clients
      {
        name: "clients",
        path: "/dashboard/client-management",
        layout: "area sales manager",
        icon: <FiUsers className="text-2xl md:text3xl" />,
      },
      // warehouse
      {
        name: "warehouses",
        path: "/dashboard/warehouse-management",
        layout: "super admin",
        icon: <TbBuildingWarehouse className="text-2xl md:text3xl" />,
      },

      // commodities
      {
        name: "commodities",
        path: "/dashboard/warehouse-commodity-management",
        layout: "area sales manager",
        icon: <TbPackages className="text-2xl md:text3xl" />,
      },
      // inputs
      {
        name: "inputs",
        path: "/dashboard/input-management",
        layout: "area sales manager",
        icon: <TbPackage className="text-2xl md:text3xl" />,
      },
      // disburse
      {
        name: "disbursed farmers",
        path: "/dashboard/disbursement",
        layout: "area sales manager",
        icon: <TbPackageExport className="text-2xl md:text3xl" />,
      },
      // repayment
      {
        name: "loan repayment",
        path: "/dashboard/disbursement/repayment",
        layout: "area sales manager",
        icon: <TbPackageImport className="text-2xl md:text3xl" />,
      },
      // transactions
      {
        name: "transaction",
        path: "/dashboard/transaction-management",
        layout: "area sales manager",
        icon: <TbTransform className="text-2xl md:text3xl" />,
        children: [
          {
            name: "trade",
            path: "/dashboard/transaction-management/trade",
            layout: "area sales manager",
          },
          {
            name: "storage",
            path: "/dashboard/transaction-management/storage",
            layout: "area sales manager",
          },
        ],
      },
      // dispatch
      {
        name: "dispatch",
        path: "/dashboard/dispatch-management",
        layout: "area sales manager",
        icon: <TbPackageExport className="text-2xl md:text3xl" />,
      },
    ],
  },

  // Warehouse Manager
  {
    name: "warehouse manager dashboard",
    path: "/dashboard",
    layout: "warehouse manager",
    icon: <MdDashboard className="text-2xl md:text3xl" />,
    children: [
      // farmers
      {
        name: "farmers",
        path: "/dashboard/farmer-management",
        layout: "warehouse manager",
        icon: <GiFarmer className="text-2xl md:text3xl" />,
      },
      // coopertivies
      {
        name: "cooperativies",
        path: "/dashboard/cooperative-management",
        layout: "warehouse manager",
        icon: <GiOrganigram className="text-2xl md:text3xl" />,
      },
      // clients
      {
        name: "clients",
        path: "/dashboard/client-management",
        layout: "warehouse manager",
        icon: <FiUsers className="text-2xl md:text3xl" />,
      },
      // commodities
      {
        name: "commodities",
        path: "/dashboard/warehouse-commodity-management",
        layout: "super admin",
        icon: <TbPackages className="text-2xl md:text3xl" />,
      },
      // inputs
      {
        name: "inputs",
        path: "/dashboard/warehouse-input-management",
        layout: "warehouse manager",
        icon: <TbPackage className="text-2xl md:text3xl" />,
      },
      // disburse
      {
        name: "disbursed farmers",
        path: "/dashboard/disbursement",
        layout: "warehouse admin",
        icon: <TbPackageExport className="text-2xl md:text3xl" />,
      },
      // repayment
      {
        name: "loan repayment",
        path: "/dashboard/disbursement/repayment",
        layout: "warehouse manager",
        icon: <TbPackageImport className="text-2xl md:text3xl" />,
      },
      // transactions
      {
        name: "transaction",
        path: "/dashboard/transaction-management",
        layout: "warehouse manager",
        icon: <TbTransform className="text-2xl md:text3xl" />,
        children: [
          {
            name: "trade",
            path: "/dashboard/transaction-management/trade",
            layout: "warehouse manager",
          },
          {
            name: "storage",
            path: "/dashboard/transaction-management/storage",
            layout: "warehouse manager",
          },
        ],
      },
      // dispatch
      {
        name: "dispatch",
        path: "/dashboard/dispatch-management",
        layout: "warehouse manager",
        icon: <TbPackageExport className="text-2xl md:text3xl" />,
      },
    ],
  },

  // Supervisor
  {
    name: "warehouse admin dashboard",
    path: "/dashboard",
    layout: "warehouse admin",
    icon: <MdDashboard className="text-2xl md:text3xl" />,
    children: [
      {
        name: "cooperativies",
        path: "/dashboard/cooperative-management",
        layout: "warehouse admin",
        icon: <GiOrganigram className="text-2xl md:text3xl" />,
      },
      {
        name: "farmers",
        path: "/dashboard/farmer-management",
        layout: "warehouse admin",
        icon: <GiFarmer className="text-2xl md:text3xl" />,
      },
      {
        name: "disburse loan",
        path: "/dashboard/disbursement",
        layout: "warehouse admin",
        icon: <TbPackageExport className="text-2xl md:text3xl" />,
      },
      {
        name: "visitations",
        path: "/dashboard/visitation-management",
        layout: "warehouse admin",
        icon: <FaCalendarCheck className="text-2xl md:text3xl" />,
      },
    ],
  },

  // Field Officer
  {
    name: "field officer dashboard",
    path: "/dashboard",
    layout: "field officer",
    icon: <MdDashboard className="text-2xl md:text3xl" />,
    children: [
      {
        name: "cooperativies",
        path: "/dashboard/cooperative-management",
        layout: "field officer",
        icon: <GiOrganigram className="text-2xl md:text3xl" />,
      },
      {
        name: "farmers",
        path: "/dashboard/farmer-management",
        layout: "field officer",
        icon: <FiUsers className="text-2xl md:text3xl" />,
      },
    ],
  },

  // Financial Officer
  {
    name: "financial officer dashboard",
    path: "/dashboard",
    layout: "financial officer",
    icon: <MdDashboard className="text-2xl md:text3xl" />,
    children: [
      {
        name: "reg payment",
        path: "/dashboard/payment/registration",
        layout: "financial officer",
        icon: <FaMoneyBill className="text-2xl md:text3xl" />,
      },
      {
        name: "equity payment",
        path: "/dashboard/payment/equity",
        layout: "financial officer",
        icon: <FaMoneyBillWave className="text-2xl md:text3xl" />,
      },
      {
        name: "account",
        path: "/account/account-management",
        layout: "financial officer",
        icon: <FaPiggyBank className="text-2xl md:text3xl" />,
      },
      {
        name: "Cash LRP",
        path: "/dashboard/payment/loan",
        layout: "financial officer",
        icon: <IoIosCash className="text-2xl md:text3xl" />,
      },
    ],
  },

  // settings
  {
    name: "settings",
    path: "/dashboard",
    layout: "settings",
    icon: <MdDashboard className="text-2xl md:text3xl" />,
    children: [
      {
        name: "profile",
        path: "/dashboard/settings/profile",
        layout: "settings",
        icon: <FaUserAlt className="text-2xl md:text3xl" />,
      },
      {
        name: "change password",
        path: "/dashboard/settings/change-password",
        layout: "settings",
        icon: <FaShieldAlt className="text-2xl md:text3xl" />,
      },
    ],
  },
]

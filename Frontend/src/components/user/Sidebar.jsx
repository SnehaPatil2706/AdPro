import React from 'react';
import { Link, useNavigate } from 'react-router';


function Sidebar() {

  let navigate = useNavigate();

  function logout(e) {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  }

  return (
    <aside id="sidebar" class="sidebar">
      <ul class="sidebar-nav" id="sidebar-nav">
        <li class="nav-item">
          <Link class="nav-link " to={"/dashboard"}>
            <i class="bi bi-grid"></i>
            <span>Dashboard</span>
          </Link>
        </li>


        <li class="nav-item" style={{backgroundColor:"#f9e0f8"}}>
          <a
            class="nav-link collapsed"
            data-bs-target="#mastres-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i class="bi bi-menu-button-wide" ></i>
            <span>Masters</span>
            <i class="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="mastres-nav"
            class="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >

            <li>
              <Link to={"/master/employees"}>
                <i class="bi bi-circle"></i>
                <span>Employees</span>
              </Link>
            </li>
            <li>
              <Link to={"/master/clients"}>
                <i class="bi bi-circle"></i>
                <span>Clients</span>
              </Link>
            </li>
            <li>
              <Link to={"/master/pmedias"}>
                <i class="bi bi-circle"></i>
                <span>P-Media</span>
              </Link>
            </li>
            <li>
              <Link to={"/master/emedias"}>
                <i class="bi bi-circle"></i>
                <span>E-Media</span>
              </Link>
            </li>
            <li>
              <Link to={"/master/holidays"}>
                <i class="bi bi-circle"></i>
                <span>Holidays Planner</span>
              </Link>
            </li>
            <li>
              <Link to={"/master/taxes"}>
                <i class="bi bi-circle"></i>
                <span>Tax Planner</span>
              </Link>
            </li>
          </ul>
        </li>

        <li class="nav-item">
          <Link class="nav-link " to={"/emedia/emediaROList"}>
            <i class="bi bi-grid"></i>
            <span>E-Media RO</span>
          </Link>
        </li>

        <li class="nav-item">
          <Link class="nav-link " to={"/p-media/pMediaROList"}>
            <i class="bi bi-grid"></i>
            <span>P-Media RO</span>
          </Link>
        </li>

        <li class="nav-item">
          <Link class="nav-link " to={"/invoice/invoiceList"}>
            <i class="bi bi-grid"></i>
            <span>Design & Printing Invoice</span>
          </Link>
        </li>

        <li class="nav-item">
          <Link class="nav-link " to={"/adschedules"}>
            <i class="bi bi-grid"></i>
            <span>Ad Scheduler</span>
          </Link>
        </li>

        <li class="nav-item">
          <Link class="nav-link " to={"/workschedules"}>
            <i class="bi bi-grid"></i>
            <span>Work Scheduler</span>
          </Link>
        </li>

        <li class="nav-item" style={{backgroundColor:"#f9e0f8"}}>
          <a
            class="nav-link collapsed"
            data-bs-target="#financial-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i class="bi bi-menu-button-wide"></i>
            <span>Financial Reports</span>
            <i class="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="financial-nav"
            class="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to={"/reports/rptEMediaROList"}>
                <i class="bi bi-circle"></i>
                <span>E-Media RO List</span>
              </Link>
            </li>

            <li>
              <Link to={"/reports/rptPMediaROList"}>
                <i class="bi bi-circle"></i>
                <span>P-Media RO List</span>
              </Link>
            </li>

            <li>
              <Link to={"/reports/rptInvoiceList"}>
                <i class="bi bi-circle"></i>
                <span>Design & Printing Invoice</span>
              </Link>
            </li>
          </ul>
        </li>

        <li class="nav-item" style={{backgroundColor:"#f9e0f8"}}>
          <a
            class="nav-link collapsed"
            data-bs-target="#general-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i class="bi bi-menu-button-wide"></i>
            <span>General Reports</span>
            <i class="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="general-nav"
            class="nav-content collapse "
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link to={"/reports/rptEmployeeWork"}>
                <i class="bi bi-circle"></i>
                <span>Employee Work</span>
              </Link>
            </li>
            <li>
              <Link to={"/reports/rptClientList"}>
                <i class="bi bi-circle"></i>
                <span>Client List</span>
              </Link>
            </li>
            <li>
              <Link to={"/reports/rptClientAdsList"}>
                <i class="bi bi-circle"></i>
                <span>Client Ads</span>
              </Link>
            </li>
            <li>
              <Link to={"/reports/rptHolidayList"}>
                <i class="bi bi-circle"></i>
                <span>Holidays List</span>
              </Link>
            </li>
          </ul>
        </li>

        <li class="nav-item">
          <Link class="nav-link " to={"/aboutIGap"}>
            <i class="bi bi-grid"></i>
            <span>About iGap Technologies</span>
          </Link>
        </li>

        <li class="nav-item">
          <Link class="nav-link" onClick={(e) => { logout(e); }}>
            <i class="bi bi-grid"></i>
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </aside>
  )
}

export default Sidebar
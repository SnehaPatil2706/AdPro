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


        <li class="nav-item">
          <a
            class="nav-link collapsed"
            data-bs-target="#components-nav"
            data-bs-toggle="collapse"
            href="#"
          >
            <i class="bi bi-menu-button-wide"></i>
            <span>Masters</span>
            <i class="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="components-nav"
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
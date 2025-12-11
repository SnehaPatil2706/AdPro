import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function Header() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  let user = JSON.parse(localStorage.getItem('user')) || null;
  let agency = JSON.parse(localStorage.getItem('agency')) || null;
  let navigate = useNavigate();

  useEffect(() => {
    if (user == null) {
      navigate('/');
    }
    // Add event listener to handle sidebar toggle
    const toggleBtn = document.querySelector('.toggle-sidebar-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', handleToggleSidebar);
    }

    return () => {
      if (toggleBtn) {
        toggleBtn.removeEventListener('click', handleToggleSidebar);
      }
    };
  }, []);

  function handleToggleSidebar() {
    setSidebarMinimized(!sidebarMinimized);
    // Toggle class on body
    document.body.classList.toggle('toggle-sidebar');
  }

  function logout(e) {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  }

  return (
    <>
      <header id="header" className="header fixed-top d-flex align-items-center" style={{ backgroundColor: "#E0E7FF " }}>
        <div className="d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center">
            <img src="assets/img/logo.png" alt="" />
            <span className="d-none d-lg-block">ADPRO</span>
          </a>
          <i
            className="bi bi-list toggle-sidebar-btn"
            onClick={handleToggleSidebar}
            style={{ cursor: 'pointer' }}
          ></i>
        </div>

        <div className="search-bar">
          {user && agency ? <h6>Welcome {user.name + "(" + agency.name + ")"}</h6> : null}
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">


            <li className="nav-item dropdown pe-3">
              <a
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href="#"
                data-bs-toggle="dropdown"
              >
                {/* Profile Avatar */}
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  style={{ marginRight: '8px' , color :"blue" }}
                />

                {/* User Name */}
                <span className="d-none d-md-block dropdown-toggle ps-2">
                  Sneha Patil
                </span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6> Sneha Patil</h6>
                  <span>Web Designer</span>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <Link
                  className="dropdown-item d-flex align-items-center"
                  to="/dashboard/adminprofile"
                >
                  <i className="bi bi-person"></i>
                  <span>My Profile</span>
                </Link>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <Link
                  className="dropdown-item d-flex align-items-center"
                  to="/dashboard/settings"
                >
                  <i className="bi bi-gear"></i>
                  <span>Account Settings</span>
                </Link>

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <Link
                  className="dropdown-item d-flex align-items-center"
                  to="/dashboard/help"
                >
                  <i className="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </Link>
                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <a className="dropdown-item d-flex align-items-center" href="#">
                    <i className="bi bi-box-arrow-right"></i>
                    <span onClick={(e) => { logout(e); }}>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}

export default Header
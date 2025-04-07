import React from 'react';
import { Link, useNavigate } from 'react-router';

function Login() {

  let navigate = useNavigate();

  function login(e) {
    e.preventDefault();
    navigate('/dashboard');
  }

  return (
    <>
      <main>
        <div className="container">

          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                  <div className="d-flex justify-content-center py-4">
                    <a href="index.html" className="logo d-flex align-items-center w-auto">
                      <img src="assets/img/logo.png" alt="" />
                      <span className="d-none d-lg-block">ADPRO</span>
                    </a>
                  </div>
                  <div className="card mb-3">

                    <div className="card-body">

                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                        <p className="text-center small">Enter your username & password to login</p>
                      </div>

                      <div className="row g-3 needs-validation">

                        <div className="col-12">
                          <label for="yourUsername" className="form-label">Username</label>
                          <div className="input-group has-validation">
                            <span className="input-group-text" id="inputGroupPrepend">@</span>
                            <input type="text" name="username" className="form-control" id="yourUsername" required="" />
                            <div className="invalid-feedback">Please enter your username.</div>
                          </div>
                        </div>

                        <div className="col-12">
                          <label for="yourPassword" className="form-label">Password</label>
                          <input type="password" name="password" className="form-control" id="yourPassword" required="" />
                          <div className="invalid-feedback">Please enter your password!</div>
                        </div>
                        
                        <div className="col-12">
                          <button className="btn btn-primary w-100" onClick={(e) => { login(e); }} type="submit">Login</button>
                        </div>
                        <div className="col-12">
                          <p className="small mb-0">Don't have account? <Link to={"/signup"}>Create an account</Link></p>
                        </div>
                        <div className="col-12">
                          <p className="small mb-0">Forgot password? <Link to={"/forgot-password"}>Recover password</Link></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="credits">
                    Designed by <a href="https://igaptechnologies.com/">iGAP Technologies</a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <a href="#" className="back-to-top d-flex align-items-center justify-content-center"><i className="bi bi-arrow-up-short"></i></a>
    </>
  )
}

export default Login;
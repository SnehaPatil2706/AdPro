import React, { useState, useEffect } from 'react';
import { data, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  let navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    gstno: '',
    ownername: '',
    contact: '',
    email: ''
  });

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get("http://localhost:8081/states");
      setStates(response.data.status === "success" ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  };

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  }

  function handleCreate(e) {
    e.preventDefault();
    const url ="http://localhost:8081/authentication/register";
    axios.post(url, formData)
      .then((res) => {
        if(res.data.status == "success"){
          alert("Data Submitted Successfully !!!");
          navigate('/');
        }else{
          alert(res.data.data);
        }
      });
  }

  return (
    <>
      <main >
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8 col-12 d-flex flex-column align-items-center justify-content-center">
                  <div className="d-flex justify-content-center py-4">
                    <a href="index.html" className="logo d-flex align-items-center w-auto">
                      <img src="assets/img/logo.png" alt="" />
                      <span className="d-none d-lg-block">ADPRO</span>
                    </a>
                  </div>

                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="pt-4 pb-2">
                        <h5 className="card-title text-center pb-0 fs-4">Create an Account</h5>
                        <p className="text-center small">Enter your personal details to create account</p>
                      </div>

                      <form className="row g-3 needs-validation">
                        {/* Left Column */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <input
                              type="text"
                              name="name"
                              placeholder="Agency Name"
                              className="form-control"
                              id="name"
                              value={formData.name}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="city"
                              placeholder=" City"
                              className="form-control"
                              id="city"
                              value={formData.city}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="gstno"
                              placeholder="GST Number"
                              className="form-control"
                              id="gstno"
                              value={formData.gstno}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="contact"
                              placeholder="Contact Number"
                              className="form-control"
                              id="contact"
                              value={formData.contact}
                              onChange={handleChange}
                            />
                          </div>
                        </div>


                        {/* Right Column */}
                        <div className="col-md-6">
                          <div className="mb-3">
                            <input
                              type="text"
                              name="address"
                              placeholder="Agency Address"
                              className="form-control"
                              id="address"
                              value={formData.address}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <select
                              name="state"
                              className="form-control"
                              value={formData.state}
                              onChange={handleChange}
                              required
                            >
                              <option value="">Select State</option>
                              {states.map((s) => (
                                <option key={s.id} value={s.name}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-3">
                            <input
                              type="text"
                              name="ownername"
                              placeholder="Owner Name"
                              className="form-control"
                              id="ownername"
                              value={formData.ownername}
                              onChange={handleChange}
                            />
                          </div>
                          <div className="mb-3">
                            <input
                              type="email"
                              name="email"
                              placeholder="Email Address"
                              className="form-control"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        {/* Terms and Submit Button */}
                        <div className="col-12">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              name="terms"
                              type="checkbox"
                              id="acceptTerms"
                              checked={formData.terms}
                              onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="acceptTerms">
                              I agree and accept the <a href="#">terms and conditions</a>
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <button onClick={handleCreate} className="btn btn-primary w-100" type="submit">
                            Create Account
                          </button>
                        </div>
                        <div className="col-12">
                          <p className="small mb-0">
                            Already have an account? <Link to="/">Login</Link>
                          </p>
                        </div>
                      </form>
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

      <a href="#" className="back-to-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}


export default Register;
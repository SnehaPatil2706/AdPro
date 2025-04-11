import './App.css';
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router';
import Landing from './components/user/Landing';
import Dashboard from './components/user/dashboard/Dashboard';
import Clients from './components/user/master/Clients';
import Employees from './components/user/master/Employees';
import Register from './components/Register';
import Forgotpassword from './components/Forgotpassword';
import PMedias from './components/user/master/PMedia';
import EMedias from './components/user/master/EMedia';
import Holidays from './components/user/master/Holiday';
import Taxes from './components/user/master/Tax';
import AdScheduler from './components/user/scheduler/AdScheduler';
import WorkScheduler from './components/user/scheduler/WorkScheduler';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/forgot-password" element={<Forgotpassword />} />
          <Route path="dashboard" element={<Landing />}>
            <Route path="" element={<Dashboard />} />
          </Route>
          <Route path="master" element={<Landing />}>
            <Route path="clients" element={<Clients />} />
            <Route path="employees" element={<Employees />} />
            <Route path="pmedias" element={<PMedias />} />
            <Route path="emedias" element={<EMedias />} />
            <Route path="holidays" element={<Holidays />} />
            <Route path="taxes" element={<Taxes />} />
          </Route>
          <Route path="adschedules" element={<Landing />}>
            <Route path="" element={<AdScheduler />} />
          </Route>
          <Route path="workschedules" element={<Landing />}>
            <Route path="" element={<WorkScheduler />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

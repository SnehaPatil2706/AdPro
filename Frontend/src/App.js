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
import InvoiceList from './components/user/invoice/InvoiceList';
import InvoiceMaster from './components/user/invoice/InvoiceMaster';
import EMediaROList from './components/user/e-media/EMediaROList';
import EMediaROMaster from './components/user/e-media/EMediaROMaster';
import InvoicePrint from './components/user/invoice/InvoicePrint';
import InvoiceReport from './components/user/reports/InvoiceReport';
import ClientListReport from './components/user/reports/ClientListReport';
import HolidayListReport from './components/user/reports/HolidayListReport';
import ClientAdsReport from './components/user/reports/ClientAdsReport';
import EmployeeWorkReport from './components/user/reports/EmployeeWorkReport';

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
          <Route path="/invoice" element={<Landing />}>
            <Route path="invoiceList" element={<InvoiceList />} />
            <Route path="invoiceMaster" element={<InvoiceMaster />} />
            <Route path="invoiceMaster/:id" element={<InvoiceMaster />} />
            <Route path="invoicePrint/:agencyid/:invoiceid" element={<InvoicePrint />} />
          </Route>
          <Route path="emedia" element={<Landing />}>
            <Route path="emediaROList" element={<EMediaROList />} />
            <Route path="emediaROMaster" element={<EMediaROMaster />} />
          </Route>
          <Route path="reports" element={<Landing />} >
            <Route path="rptInvoiceList" element={<InvoiceReport />} />
            <Route path="rptClientList" element={<ClientListReport />} />
            <Route path="rptClientAdsList" element={<ClientAdsReport />} />
            <Route path="rptHolidayList" element={<HolidayListReport />} />
            <Route path="rptEmployeeWork" element={<EmployeeWorkReport />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

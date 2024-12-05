import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import CreateGroup from "./components/CreateGroup";
import AddMember from "./components/AddMembers";
import LoginComponent from "./components/LoginComponents";
import CreateIndividualMessage from "./components/CreateIndividualMessage";
import Groups from "./components/Groups";
import Inbox from "./components/Inbox";
import GroupMessageForm from "./components/GroupMessageForm";
import AddMembers from "./components/AddMembers";
import GroupInbox from "./components/GroupInbox";
import PrivateRoute from "./components/PrivateRoute";
import SentMessages from "./components/Outbox";
import PhoneBook from "./components/Phonebook";
import RegionPage from "./components/RegionPage"; // Import RegionPage
import DistrictDetailsPage from "./components/DistrictDetailsPage"; // Import DistrictDetailsPage
import RegionDistrictBranchSelector from "./components/RegionDistrictBranchSelector";
import HQOrganDetails from "./components/HQOrganDetails";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<LoginComponent />} />

        {/* Private Routes */}
        <Route
          path="/welcome-page"
          element={
            <PrivateRoute>
              <WelcomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <PrivateRoute>
              <Groups />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-group"
          element={
            <PrivateRoute>
              <CreateGroup />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-member"
          element={
            <PrivateRoute>
              <AddMember />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-members"
          element={
            <PrivateRoute>
              <AddMembers />
            </PrivateRoute>
          }
        />
        <Route
          path="/message"
          element={
            <PrivateRoute>
              <CreateIndividualMessage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <PrivateRoute>
              <Inbox />
            </PrivateRoute>
          }
        />
        <Route
          path="/sent"
          element={
            <PrivateRoute>
              <SentMessages />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups/:groupId"
          element={
            <PrivateRoute>
              <GroupMessageForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups/:groupId/messages"
          element={
            <PrivateRoute>
              <GroupInbox />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-members/:groupId"
          element={
            <PrivateRoute>
              <AddMembers />
            </PrivateRoute>
          }
        />

        {/* PhoneBook Page */}
        <Route path="/phone-book" element={<PhoneBook />} />
        <Route path="/region-district-branch/:regionId" element={<RegionDistrictBranchSelector />} /> {/* Update this route */}
        <Route path="/hq-organs" element={<HQOrganDetails />} />
        </Routes>
    </Router>
  );
}

export default App;



       {/* Region and District Routes
        <Route path="/districts/:regionId" element={<RegionPage />} />
        <Route path="/district/:regionId/:districtName" element={<DistrictDetailsPage />} /> */}
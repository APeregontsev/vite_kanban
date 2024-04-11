import Dashboard from "src/pages/Dashboard/Dashboard";
import { Route, Routes } from "react-router-dom";

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default AppRouter;

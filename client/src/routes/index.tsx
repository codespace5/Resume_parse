import Resume from "@/pages/App/Resume";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

// Pages


const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Resume />
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;

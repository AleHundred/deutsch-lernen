import { Routes, Route } from "react-router-dom";
import { Home } from "./ui/Home";
import { DrillSession } from "./ui/DrillSession";
import { SessionSummary } from "./ui/SessionSummary";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/drill" element={<DrillSession />} />
      <Route path="/summary" element={<SessionSummary />} />
    </Routes>
  );
}

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Landing from "./pages/landing/Landing";

import getCurrentUser from "./features/getCurrentUser";

import {
  setUserData,
  setLoading,
} from "./redux/userSlice";

function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await getCurrentUser();
        dispatch(setUserData(data?.user ?? null));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCurrentUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-white/20 border-t-white animate-spin"></div>
      </div>
    );
  }

  return (
    
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Home />} />
      </Routes>
   
  );
}

export default App;
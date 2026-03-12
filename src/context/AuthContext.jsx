import { createContext, useEffect, useMemo, useRef, useState } from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://iontrip-backend-production.up.railway.app";

export const AuthContext = createContext({
  currency: "MYR",
  setCurrency: () => {},
  agentToken: "",
  agentData: null,
  activityLog: [],
  tokenExpireIn: "",
  setAuthSession: () => {},
  clearAuthSession: () => {},
});

export function AuthProvider({ children }) {
  const [currency, setCurrencyState] = useState("MYR");
  const [agentToken, setAgentToken] = useState("");
  const [agentData, setAgentData] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [tokenExpireIn, setTokenExpireIn] = useState("");
  const lastFetchedEmailRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCurrency = window.localStorage.getItem("currency") || "MYR";
      const storedToken = window.localStorage.getItem("agentToken") || "";
      const storedExpire = window.localStorage.getItem("agentTokenExpireIn") || "";
      const storedAgent = window.localStorage.getItem("agentData");
      const storedActivityLog = window.localStorage.getItem("activityLog");

      setCurrencyState(storedCurrency);
      setAgentToken(storedToken);
      setTokenExpireIn(storedExpire);
      setAgentData(storedAgent ? JSON.parse(storedAgent) : null);
      setActivityLog(storedActivityLog ? JSON.parse(storedActivityLog) : []);
    }
  }, []);

  // Fetch full agent profile from agent/list (includes logoUrl, documents, etc.) and set in context
  useEffect(() => {
    const email = agentData?.email;
    if (!agentToken || !email || lastFetchedEmailRef.current === email) return;

    const controller = new AbortController();
    lastFetchedEmailRef.current = email;

    fetch(
      `${baseUrl}/agent/list?email=${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${agentToken}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      }
    )
      .then((res) => res.json())
      .then((response) => {
        const list = response?.data ?? response;
        const first = Array.isArray(list) ? list[0] : list;
        const agentInfo = first?.agentInfo ?? first;
        const logs = first?.activityLog ?? [];
        if (agentInfo && typeof agentInfo === "object") {
          setAgentData(agentInfo);
          if (typeof window !== "undefined") {
            window.localStorage.setItem("agentData", JSON.stringify(agentInfo));
          }
        }
        setActivityLog(Array.isArray(logs) ? logs : []);
        if (typeof window !== "undefined" && Array.isArray(logs)) {
          window.localStorage.setItem("activityLog", JSON.stringify(logs));
        }
      })
      .catch(() => {
        lastFetchedEmailRef.current = null;
      });

    return () => controller.abort();
  }, [agentToken, agentData?.email]);

  const setCurrency = (nextCurrency) => {
    setCurrencyState(nextCurrency);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currency", nextCurrency);
    }
  };

  const setAuthSession = (token, agent, expireIn = "") => {
    const nextToken = token || "";
    const nextAgent = agent || null;
    const nextExpireIn = expireIn || "";

    setAgentToken(nextToken);
    setAgentData(nextAgent);
    setTokenExpireIn(nextExpireIn);

    if (typeof window !== "undefined") {
      if (nextToken) {
        window.localStorage.setItem("agentToken", nextToken);
      } else {
        window.localStorage.removeItem("agentToken");
      }
      if (nextExpireIn) {
        window.localStorage.setItem("agentTokenExpireIn", nextExpireIn);
      } else {
        window.localStorage.removeItem("agentTokenExpireIn");
      }
      if (nextAgent) {
        window.localStorage.setItem("agentData", JSON.stringify(nextAgent));
      } else {
        window.localStorage.removeItem("agentData");
      }
    }
  };

  const clearAuthSession = () => {
    lastFetchedEmailRef.current = null;
    setAgentToken("");
    setAgentData(null);
    setActivityLog([]);
    setTokenExpireIn("");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("agentToken");
      window.localStorage.removeItem("agentData");
      window.localStorage.removeItem("activityLog");
      window.localStorage.removeItem("agentTokenExpireIn");
    }
  };

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      agentToken,
      agentData,
      activityLog,
      tokenExpireIn,
      setAuthSession,
      clearAuthSession,
    }),
    [currency, agentToken, agentData, activityLog, tokenExpireIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

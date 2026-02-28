import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext({
  currency: "MYR",
  setCurrency: () => {},
  agentToken: "",
  agentData: null,
  tokenExpireIn: "",
  setAuthSession: () => {},
  clearAuthSession: () => {},
});

export function AuthProvider({ children }) {
  const [currency, setCurrencyState] = useState("MYR");
  const [agentToken, setAgentToken] = useState("");
  const [agentData, setAgentData] = useState(null);
  const [tokenExpireIn, setTokenExpireIn] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCurrency = window.localStorage.getItem("currency") || "MYR";
      const storedToken = window.localStorage.getItem("agentToken") || "";
      const storedExpire = window.localStorage.getItem("agentTokenExpireIn") || "";
      const storedAgent = window.localStorage.getItem("agentData");

      setCurrencyState(storedCurrency);
      setAgentToken(storedToken);
      setTokenExpireIn(storedExpire);
      setAgentData(storedAgent ? JSON.parse(storedAgent) : null);
    }
  }, []);

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
    setAgentToken("");
    setAgentData(null);
    setTokenExpireIn("");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("agentToken");
      window.localStorage.removeItem("agentData");
      window.localStorage.removeItem("agentTokenExpireIn");
    }
  };

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      agentToken,
      agentData,
      tokenExpireIn,
      setAuthSession,
      clearAuthSession,
    }),
    [currency, agentToken, agentData, tokenExpireIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

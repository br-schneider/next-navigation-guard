"use client";

import { createContext, type MutableRefObject } from "react";
import { GuardDef } from "../types";

export const NavigationGuardProviderContext = createContext<
  MutableRefObject<Map<string, GuardDef>> | undefined
>(undefined);
NavigationGuardProviderContext.displayName = "NavigationGuardProviderContext";

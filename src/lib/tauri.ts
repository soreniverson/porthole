import { invoke } from "@tauri-apps/api/core";

export type StackType =
  | "node"
  | "nextjs"
  | "vite"
  | "python"
  | "rails"
  | "postgres"
  | "redis"
  | "mongo"
  | "java"
  | "php"
  | "bun"
  | "deno"
  | "unknown";

export interface PortEntry {
  port: number;
  pid: number;
  processName: string;
  cmd: string;
  stack: StackType;
  label: string | null;
}

export interface AppSettings {
  pollIntervalMs: number;
  launchAtLogin: boolean;
  showUnknownPorts: boolean;
  confirmBeforeKill: boolean;
  theme: "system" | "light" | "dark";
}

export async function getActivePorts(): Promise<PortEntry[]> {
  return invoke<PortEntry[]>("get_active_ports");
}

export async function killPort(port: number): Promise<void> {
  return invoke("kill_port", { port });
}

export async function setPortLabel(port: number, label: string): Promise<void> {
  return invoke("set_port_label", { port, label });
}

export async function removePortLabel(port: number): Promise<void> {
  return invoke("remove_port_label", { port });
}

export async function getLabels(): Promise<Record<number, string>> {
  return invoke("get_labels");
}

export async function getSettings(): Promise<AppSettings> {
  return invoke("get_settings");
}

export async function saveSettings(settingsVal: AppSettings): Promise<void> {
  return invoke("save_settings", { settingsVal });
}

export async function setLaunchAtLogin(enabled: boolean): Promise<void> {
  return invoke("set_launch_at_login", { enabled });
}

export async function openInBrowser(port: number): Promise<void> {
  return invoke("open_in_browser", { port });
}

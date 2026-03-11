use crate::stack::{detect_stack, StackType};
use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PortEntry {
    pub port: u16,
    pub pid: u32,
    pub process_name: String,
    pub cmd: String,
    pub stack: StackType,
    pub label: Option<String>,
}

pub fn get_listening_ports() -> Vec<PortEntry> {
    let output = match Command::new("lsof")
        .args(["-i", "-P", "-n", "-sTCP:LISTEN"])
        .output()
    {
        Ok(o) => o,
        Err(e) => {
            log::warn!("Failed to run lsof: {}", e);
            return Vec::new();
        }
    };

    if !output.status.success() {
        log::warn!("lsof returned non-zero exit code");
        return Vec::new();
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let mut entries = Vec::new();
    let mut seen_ports = std::collections::HashSet::new();

    for line in stdout.lines().skip(1) {
        // Only process TCP LISTEN lines (skip UDP and other entries)
        if !line.contains("(LISTEN)") {
            continue;
        }

        let parts: Vec<&str> = line.split_whitespace().collect();
        if parts.len() < 9 {
            continue;
        }

        let process_name = parts[0].to_string();
        let pid: u32 = match parts[1].parse() {
            Ok(p) => p,
            Err(_) => continue,
        };

        // NAME field is second-to-last when "(LISTEN)" is last token
        let name_field = parts.iter().rev().find(|p| p.contains(':')).copied().unwrap_or("");
        let port = extract_port(name_field);
        let port = match port {
            Some(p) => p,
            None => continue,
        };

        if !seen_ports.insert(port) {
            continue;
        }

        let cmd = get_process_cmd(pid).unwrap_or_else(|| process_name.clone());
        let stack = detect_stack(&process_name, &cmd);

        entries.push(PortEntry {
            port,
            pid,
            process_name,
            cmd,
            stack,
            label: None,
        });
    }

    entries.sort_by_key(|e| e.port);
    entries
}

fn extract_port(name_field: &str) -> Option<u16> {
    // Format: *:3000 or 127.0.0.1:3000 or [::1]:3000
    let port_str = name_field.rsplit(':').next()?;
    port_str.parse().ok()
}

fn get_process_cmd(pid: u32) -> Option<String> {
    let output = Command::new("ps")
        .args(["-p", &pid.to_string(), "-o", "command="])
        .output()
        .ok()?;
    let cmd = String::from_utf8_lossy(&output.stdout).trim().to_string();
    if cmd.is_empty() {
        None
    } else {
        Some(cmd)
    }
}

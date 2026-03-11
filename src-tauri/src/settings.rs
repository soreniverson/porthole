use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings {
    pub poll_interval_ms: u64,
    pub launch_at_login: bool,
    pub show_unknown_ports: bool,
    pub confirm_before_kill: bool,
    pub theme: String,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            poll_interval_ms: 5000,
            launch_at_login: false,
            show_unknown_ports: true,
            confirm_before_kill: true,
            theme: "system".to_string(),
        }
    }
}

fn settings_path() -> PathBuf {
    let config_dir = dirs::home_dir()
        .unwrap_or_default()
        .join(".config")
        .join("porthole");
    fs::create_dir_all(&config_dir).ok();
    config_dir.join("settings.json")
}

pub fn read_settings() -> AppSettings {
    let path = settings_path();
    match fs::read_to_string(&path) {
        Ok(content) => serde_json::from_str(&content).unwrap_or_else(|e| {
            log::warn!("Failed to parse settings.json: {}, resetting", e);
            AppSettings::default()
        }),
        Err(_) => AppSettings::default(),
    }
}

pub fn write_settings(settings: &AppSettings) -> Result<(), String> {
    let path = settings_path();
    let json = serde_json::to_string_pretty(settings).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())
}

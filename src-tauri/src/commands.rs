use crate::killer;
use crate::labels;
use crate::lsof::{self, PortEntry};
use crate::settings::{self, AppSettings};
use std::collections::HashMap;

#[tauri::command]
pub fn get_active_ports() -> Vec<PortEntry> {
    let mut entries = lsof::get_listening_ports();
    let label_map = labels::get_all_labels();
    for entry in &mut entries {
        if let Some(label) = label_map.get(&entry.port) {
            entry.label = Some(label.clone());
        }
    }
    entries
}

#[tauri::command]
pub fn kill_port(port: u16) -> Result<(), String> {
    let entries = lsof::get_listening_ports();
    let entry = entries
        .iter()
        .find(|e| e.port == port)
        .ok_or_else(|| format!("No process found on port {}", port))?;
    killer::kill_process(entry.pid)
}

#[tauri::command]
pub fn set_port_label(port: u16, label: String) -> Result<(), String> {
    labels::set_label(port, label)
}

#[tauri::command]
pub fn remove_port_label(port: u16) -> Result<(), String> {
    labels::remove_label(port)
}

#[tauri::command]
pub fn get_labels() -> Result<HashMap<u16, String>, String> {
    Ok(labels::get_all_labels())
}

#[tauri::command]
pub fn get_settings() -> Result<AppSettings, String> {
    Ok(settings::read_settings())
}

#[tauri::command]
pub fn save_settings(settings_val: AppSettings) -> Result<(), String> {
    settings::write_settings(&settings_val)
}

#[tauri::command]
pub fn set_launch_at_login(
    app: tauri::AppHandle,
    enabled: bool,
) -> Result<(), String> {
    let _ = app; // autostart plugin handles it via enable/disable
    // The autostart plugin is registered globally; toggling is done via the plugin API
    // For now, save the preference in settings
    let mut s = settings::read_settings();
    s.launch_at_login = enabled;
    settings::write_settings(&s)
}

#[tauri::command]
pub fn open_in_browser(port: u16) -> Result<(), String> {
    let url = format!("http://localhost:{}", port);
    open::that(&url).map_err(|e| e.to_string())
}

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct LabelStore {
    pub version: u32,
    pub labels: HashMap<u16, String>,
}

impl Default for LabelStore {
    fn default() -> Self {
        Self {
            version: 1,
            labels: HashMap::new(),
        }
    }
}

fn labels_path() -> PathBuf {
    let config_dir = dirs::home_dir()
        .unwrap_or_default()
        .join(".config")
        .join("porthole");
    fs::create_dir_all(&config_dir).ok();
    config_dir.join("labels.json")
}

pub fn read_labels() -> LabelStore {
    let path = labels_path();
    match fs::read_to_string(&path) {
        Ok(content) => serde_json::from_str(&content).unwrap_or_else(|e| {
            log::warn!("Failed to parse labels.json: {}, resetting", e);
            LabelStore::default()
        }),
        Err(_) => LabelStore::default(),
    }
}

pub fn write_labels(store: &LabelStore) -> Result<(), String> {
    let path = labels_path();
    let json = serde_json::to_string_pretty(store).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())
}

pub fn set_label(port: u16, label: String) -> Result<(), String> {
    let mut store = read_labels();
    store.labels.insert(port, label);
    write_labels(&store)
}

pub fn remove_label(port: u16) -> Result<(), String> {
    let mut store = read_labels();
    store.labels.remove(&port);
    write_labels(&store)
}

pub fn get_all_labels() -> HashMap<u16, String> {
    read_labels().labels
}

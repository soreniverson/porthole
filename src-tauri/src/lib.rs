mod commands;
mod killer;
mod labels;
mod lsof;
mod settings;
mod stack;

use commands::*;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use tauri::{
    tray::{MouseButtonState, TrayIconEvent},
    Emitter, Manager, WindowEvent,
};
use tauri_plugin_positioner::{Position, WindowExt};

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    env_logger::init();

    let last_shown = Arc::new(AtomicU64::new(0));
    let last_shown_tray = last_shown.clone();
    let last_shown_blur = last_shown.clone();

    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            Some(vec![]),
        ))
        .plugin(tauri_plugin_fs::init())
        .on_tray_icon_event(move |tray, event| {
            tauri_plugin_positioner::on_tray_event(tray.app_handle(), &event);
            if let TrayIconEvent::Click { button_state: MouseButtonState::Down, .. } = event {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.move_window(Position::TrayCenter);
                    if window.is_visible().unwrap_or(false) {
                        let _ = window.hide();
                    } else {
                        last_shown_tray.store(now_ms(), Ordering::Relaxed);
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            }
        })
        .setup(move |app| {
            // Hide from dock
            #[cfg(target_os = "macos")]
            {
                app.set_activation_policy(tauri::ActivationPolicy::Accessory);
            }

            // Hide window on blur, but ignore blur events within 500ms of showing
            if let Some(window) = app.get_webview_window("main") {
                let win = window.clone();
                let last_shown = last_shown_blur.clone();
                window.on_window_event(move |event| {
                    if let WindowEvent::Focused(false) = event {
                        let elapsed = now_ms() - last_shown.load(Ordering::Relaxed);
                        if elapsed > 500 {
                            let _ = win.hide();
                        }
                    }
                });
            }

            // Start background port polling
            let app_handle = app.handle().clone();
            thread::spawn(move || {
                loop {
                    let settings = settings::read_settings();
                    let ports = get_active_ports();
                    let _ = app_handle.emit("ports-updated", &ports);
                    thread::sleep(Duration::from_millis(settings.poll_interval_ms));
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_active_ports,
            kill_port,
            set_port_label,
            remove_port_label,
            get_labels,
            get_settings,
            save_settings,
            set_launch_at_login,
            open_in_browser,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

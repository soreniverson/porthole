use std::thread;
use std::time::Duration;

pub fn kill_process(pid: u32) -> Result<(), String> {
    let pid = pid as i32;

    // Send SIGTERM first
    let result = unsafe { libc::kill(pid, libc::SIGTERM) };
    if result != 0 {
        let errno = std::io::Error::last_os_error();
        return match errno.raw_os_error() {
            Some(libc::EPERM) => Err("Permission denied".to_string()),
            Some(libc::ESRCH) => Err("Process already exited".to_string()),
            _ => Err(format!("Failed to kill process: {}", errno)),
        };
    }

    // Wait 500ms then check if still alive
    thread::sleep(Duration::from_millis(500));

    let still_alive = unsafe { libc::kill(pid, 0) } == 0;
    if still_alive {
        unsafe { libc::kill(pid, libc::SIGKILL) };
    }

    Ok(())
}

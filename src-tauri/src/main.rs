// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use playerctl::{PlayerCtl, TrackMetadata};
use serde::{Deserialize, Serialize};
use tauri::{command, AppHandle, Manager};
use std::{process::Command, str::FromStr};

fn command(command: &str) -> String {
    let mut parts = command.split_whitespace().collect::<Vec<&str>>();

    let stdout = Command::new(parts.remove(0))
        .args(parts)
        .output()
        .unwrap_or_else(|_| panic!("Failed to execute command '{}'", command))
        .stdout;

    String::from_utf8(stdout).expect("Stdout was not valid UTF-8")
}

#[derive(Serialize)]
struct Metadata {
    artist: String,
    title: String,
    album: String,
    // Add other fields as needed
}


#[tauri::command]
 fn get_current_media_metadata(app_handle: AppHandle) -> Result<Metadata, String> {
    let track_metadata = PlayerCtl::metadata();

    let metadata = Metadata {
        artist: track_metadata.artist,
        title: track_metadata.title,
        album: track_metadata.album,
        // Add other fields as needed
    };

    return Ok(metadata);


}

#[tauri::command]
fn get_current_audio_time() -> f64 {
    let time = command(&format!("playerctl --player=smplayer,rhythmbox position"));
    let trimmed_time = time.trim();

    if trimmed_time.is_empty() {
        return 0.00;
    }

    match trimmed_time.parse::<f64>() {
        Ok(value) => value,
        Err(_) => 0.00,
    }
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_current_media_metadata, get_current_audio_time])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}

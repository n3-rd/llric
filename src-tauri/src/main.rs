// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use playerctl::{PlayerCtl, TrackMetadata};
use std::str::from_utf8;
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

// use std::process::Command;
// use std::str::from_utf8;
// use serde::{Deserialize, Serialize};
// use tauri::{command, AppHandle, Manager};

#[derive(Serialize, Default)]
struct Metadata {
    artist: String,
    title: String,
    album: String,
    // Add other fields as needed
}

#[tauri::command]
fn get_current_media_metadata(app_handle: AppHandle, player: String) -> Result<Metadata, String> {
    let artist = command(&format!("playerctl --player={} metadata artist", player));
    let title = command(&format!("playerctl --player={} metadata title", player));
    let album = command(&format!("playerctl --player={} metadata album", player));

    Ok(Metadata {
        artist: artist.trim().to_string(),
        title: title.trim().to_string(),
        album: album.trim().to_string(),
    })


}

#[tauri::command]
fn get_current_audio_time(player: String) -> f64 {
    let time = command(&format!("playerctl --player={} position", player));

    let trimmed_time = time.trim();

    if trimmed_time.is_empty() {
        return 0.00;
    }

    match trimmed_time.parse::<f64>() {
        Ok(value) => value,
        Err(_) => 0.00,
    }
}

#[tauri::command]
fn get_all_players() -> Vec<String> {
    let output = command("playerctl -l");
    let players: Vec<String> = output.lines().map(|s| s.to_string()).collect();
    return players;
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_current_media_metadata, get_current_audio_time, get_all_players])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}

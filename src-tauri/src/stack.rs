use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum StackType {
    Node,
    Nextjs,
    Vite,
    Python,
    Rails,
    Postgres,
    Redis,
    Mongo,
    Java,
    Php,
    Bun,
    Deno,
    Unknown,
}

pub fn detect_stack(process_name: &str, cmd: &str) -> StackType {
    let name = process_name.to_lowercase();
    let cmd_lower = cmd.to_lowercase();

    if name == "next-server" || (name == "node" && cmd_lower.contains("next")) {
        return StackType::Nextjs;
    }
    if name == "vite" || (name == "node" && cmd_lower.contains("vite")) {
        return StackType::Vite;
    }
    if matches!(
        name.as_str(),
        "node" | "npm" | "yarn" | "pnpm" | "npx"
    ) {
        return StackType::Node;
    }
    if matches!(
        name.as_str(),
        "python" | "python3" | "uvicorn" | "gunicorn" | "flask" | "django"
    ) {
        return StackType::Python;
    }
    if matches!(name.as_str(), "ruby" | "rails" | "puma" | "thin") {
        return StackType::Rails;
    }
    if matches!(name.as_str(), "postgres" | "pg_ctl" | "postmaster") {
        return StackType::Postgres;
    }
    if name == "redis-server" {
        return StackType::Redis;
    }
    if name == "mongod" {
        return StackType::Mongo;
    }
    if matches!(name.as_str(), "java" | "gradle" | "mvn" | "kotlin") {
        return StackType::Java;
    }
    if matches!(name.as_str(), "php" | "artisan") {
        return StackType::Php;
    }
    if name == "bun" {
        return StackType::Bun;
    }
    if name == "deno" {
        return StackType::Deno;
    }

    StackType::Unknown
}

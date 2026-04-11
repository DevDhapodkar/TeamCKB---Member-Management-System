<?php
$allowed_origins = [
    "https://teamckb.in", 
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://teamchalokhushiyanbatein.web.app",
    "https://teamchalokhushiyanbatein.firebaseapp.com"
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_FILES["file"])) {
        $file = $_FILES["file"];
        $max_size = 15 * 1024 * 1024; // Increased to 15MB for site bundles
        $allowed_exts = ["jpg", "jpeg", "png", "gif", "pdf", "docx", "doc", "zip"];
        
        $ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
        
        if ($file["size"] > $max_size) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "File too large (Max 5MB)"]);
            exit;
        }
        
        if (!in_array($ext, $allowed_exts)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid file type"]);
            exit;
        }

        $target_dir = "uploads/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        
        $file_name = time() . "_" . preg_replace("/[^A-Za-z0-9\.]/", "_", $file["name"]);
        $target_file = $target_dir . $file_name;
        
        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            $protocol = isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] === "on" ? "https" : "http";
            $host = $_SERVER["HTTP_HOST"];
            $dir = dirname($_SERVER["PHP_SELF"]);
            $file_url = "$protocol://$host$dir/$target_file";
            
            echo json_encode(["status" => "success", "url" => $file_url]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Upload failed"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "No file provided"]);
    }
}
?>

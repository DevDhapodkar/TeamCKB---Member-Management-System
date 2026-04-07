<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_FILES["file"])) {
        $target_dir = "uploads/";
        if (!file_exists($target_dir)) {
            mkdir($target_dir, 0777, true);
        }
        
        $file_name = time() . "_" . basename($_FILES["file"]["name"]);
        $target_file = $target_dir . $file_name;
        
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            // Adjust this URL to your actual host
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

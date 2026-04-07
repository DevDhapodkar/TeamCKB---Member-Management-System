// For Firebase Hosting, we must point to the absolute URL of the PHP/CWP server
const UPLOAD_SERVER = import.meta.env.VITE_UPLOAD_SERVER_URL || window.location.origin;
const UPLOAD_URL = UPLOAD_SERVER.replace(/\/$/, "") + "/upload.php";

export const uploadFile = async (file) => {
  if (!file) throw new Error("No file provided for upload.");

  const formData = new FormData();
  formData.append("file", file);

  try {
    console.log(`Attempting upload to: ${UPLOAD_URL}`);
    
    // Check if we are on Firebase Hosting trying to reach a local PHP file
    if (window.location.hostname.includes("web.app") && !import.meta.env.VITE_UPLOAD_SERVER_URL) {
      throw new Error("PHP uploads are not supported on Firebase Hosting. Please configure VITE_UPLOAD_SERVER_URL in your .env file with your CWP server address.");
    }

    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      // If we get a 404 on Firebase for upload.php, it's likely being rewritten to index.html
      if (response.status === 404 || (response.headers.get("content-type")?.includes("text/html"))) {
        throw new Error("Upload server not found or misconfigured. Ensure upload.php is hosted on a PHP-enabled server and VITE_UPLOAD_SERVER_URL is set correctly.");
      }
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Server response was not JSON:", text);
      throw new Error("The upload server returned an invalid response. Please check your PHP server logs.");
    }

    if (data.status === "success") {
      return data.url;
    } else {
      throw new Error(data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Storage Error:", error);
    // Standardize the "pattern" error message into something more helpful
    if (error.message.includes("string did not match the expected pattern")) {
      throw new Error("Invalid Upload URL configuration. Please ensure VITE_UPLOAD_SERVER_URL is a valid absolute URL (e.g., https://your-server.com).");
    }
    throw error;
  }
};

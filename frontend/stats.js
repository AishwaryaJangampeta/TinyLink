const API_BASE_URL = "";

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if(!code) {
    alert("No code provided");
    window.location.href = "index.html";
}

document.getElementById("code").textContent = code;

async function loadStats() {
    try {
        const res = await fetch(`/api/links/${code}`);

        if( res.status === 404) {
            alert("Code not found");
            window.location.href = "index.html";
            return;
        }

        const data = await res.json();

        const shortUrl = `${window.location.origin}/${data.code}`;

        document.getElementById("short-url").textContent = shortUrl;
        document.getElementById("short-url").href = shortUrl;

        document.getElementById("target-url").textContent = data.target_url;
        document.getElementById("target-url").href = data.target_url;

        document.getElementById("clicks").textContent = data.click_count;
        document.getElementById("last-clicked").textContent = data.last_clicked ? new Date(data.last_clicked).toLocaleString() : "-";
        document.getElementById("created-at").textContent = new Date(data.created_at).toLocaleString();
    } catch (err) {
        console.err("Stats error:", err);
        alert("Network error");
    }
}

function goBack(){
    window.location.href = "index.html";
}

loadStats();
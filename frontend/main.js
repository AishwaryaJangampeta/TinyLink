const API_BASE_URL = "";

const tbody = document.getElementById("links-tbody");
const emptyState = document.getElementById("empty-state");
const refreshBtn = document.getElementById("refresh-btn");


async function loadLinks() {
  try {
    const res = await fetch("/api/links");
    const links = await res.json();

    tbody.innerHTML = "";

    if (links.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    emptyState.style.display = "none";

    links.forEach(link => {
      const tr = document.createElement("tr");

      const shortUrl = `${window.location.origin}/${link.code}`;

      tr.innerHTML = `
        <td>${link.code}</td>
        <td><a href="${link.target_url}" target="_blank">${link.target_url}</a></td>
        <td>${link.click_count}</td>
        <td>${link.last_clicked ? new Date(link.last_clicked).toLocaleString() : "-"}</td>
        <td>${new Date(link.created_at).toLocaleString()}</td>
        <td>
          <button class="btn small" onclick="copyToClipboard('${shortUrl}')">Copy</button>
          <button class="btn small" onclick="viewStats('${link.code}')">Stats</button>
          <button class="btn small danger" onclick="deleteLink('${link.code}')">Delete</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

  } catch (err) {
    console.error("Error loading links:", err);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert("Copied: " + text);
}

function viewStats(code) {
  window.location.href = `./stats.html?code=${code}`;
}

async function deleteLink(code) {
  if (!confirm(`Delete link "${code}"?`)) return;

  try {
    const res = await fetch(`/api/links/${code}`, {
      method: "DELETE"
    });

    if (res.status === 204) {
      loadLinks();
    } else {
      alert("Error deleting link");
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
}

refreshBtn.addEventListener("click", loadLinks);

const form = document.getElementById("create-form");
const urlInput = document.getElementById("url");
const codeInput = document.getElementById("code");
const formMessage = document.getElementById("form-message");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 

  const url = urlInput.value.trim();
  const code = codeInput.value.trim();

  formMessage.textContent = "";
  formMessage.className = "message";

  try {
    const res = await fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url, code })
    });

    if (res.status === 400 || res.status === 409) {
      const data = await res.json();
      formMessage.textContent = data.error;
      formMessage.classList.add("error");
      return;
    }

    if (res.status === 201) {
      formMessage.textContent = "Link created successfully!";
      formMessage.classList.add("success");

      urlInput.value = "";
      codeInput.value = "";

      loadLinks(); 
    } else {
      formMessage.textContent = "Unexpected error";
      formMessage.classList.add("error");
    }
  } catch (err) {
    console.error("Create error:", err);
    formMessage.textContent = "Network error";
    formMessage.classList.add("error");
  }
});


loadLinks();



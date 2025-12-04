let selectedFile = null;

const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileElem");
const uploadBtn = document.getElementById("uploadBtn");
const preview = document.getElementById("preview");
const previewContainer = document.getElementById("preview-container");
const predictBtn = document.getElementById("predictBtn");
const result = document.getElementById("result");

// Click button → open file dialog
uploadBtn.addEventListener("click", () => fileInput.click());

// When file selected normally
fileInput.addEventListener("change", () => {
    selectedFile = fileInput.files[0];
    showPreview();
});

// Drag events
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.background = "#eef0ff";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.style.background = "#fafaff";
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.background = "#fafaff";
    selectedFile = e.dataTransfer.files[0];
    showPreview();
});

// Show image preview
function showPreview() {
    const reader = new FileReader();
    reader.onload = () => {
        preview.src = reader.result;
    };
    reader.readAsDataURL(selectedFile);

    previewContainer.classList.remove("hidden");
    predictBtn.classList.remove("hidden");
}

// Predict button
predictBtn.addEventListener("click", async () => {
    if (!selectedFile) {
        alert("Please upload an image first.");
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    result.innerHTML = "Checking... ⏳";

    try {
        const res = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        const label = data.label === 1 ? "REAL" : "FAKE";

        result.innerHTML = `
            ${label === "REAL" ? "🟢 REAL" : "🔴 FAKE"}
            <br><br>
            <span style="color:#555">Confidence: ${(data.confidence * 100).toFixed(2)}%</span>
        `;

    } catch (err) {
        result.innerHTML = "⚠️ Error connecting to backend.";
    }
});

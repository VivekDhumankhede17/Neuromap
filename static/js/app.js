// document.addEventListener("DOMContentLoaded", () => {

//     const dropzone   = document.getElementById('dropzone');
//     const imageInput = document.getElementById('imageInput');
//     const filenameEl = document.getElementById('filename');
//     const predictBtn = document.getElementById('predictBtn');
//     const scanBody   = document.getElementById('scanBody');
//     const resultBody = document.getElementById('resultBody');

//     if (!dropzone || !imageInput) {
//         console.error("Missing required DOM elements. Check your HTML IDs.");
//         return;
//     }

//     const GAUGE_CIRCUMFERENCE = 408;

//     let selectedFile = null;
//     let previewURL = null;

//     console.log("app.js loaded successfully");

//     /* ---------------- DROPZONE CLICK ---------------- */

//     dropzone.addEventListener('click', () => {
//         imageInput.click();
//     });

//     dropzone.addEventListener('keydown', (e) => {
//         if (e.key === 'Enter' || e.key === ' ') {
//             e.preventDefault();
//             imageInput.click();
//         }
//     });

//     /* ---------------- DRAG & DROP ---------------- */

//     ['dragenter', 'dragover'].forEach(evt => {
//         dropzone.addEventListener(evt, (e) => {
//             e.preventDefault();
//             dropzone.classList.add('is-dragover');
//         });
//     });

//     ['dragleave', 'dragend'].forEach(evt => {
//         dropzone.addEventListener(evt, (e) => {
//             e.preventDefault();
//             dropzone.classList.remove('is-dragover');
//         });
//     });

//     dropzone.addEventListener('drop', (e) => {
//         e.preventDefault();
//         dropzone.classList.remove('is-dragover');

//         const file = e.dataTransfer.files?.[0];
//         if (file) handleFile(file);
//     });

//     /* ---------------- FILE INPUT ---------------- */

//     imageInput.addEventListener('change', () => {
//         const file = imageInput.files?.[0];
//         if (file) handleFile(file);
//     });

//     function handleFile(file) {

//         if (!file.type.startsWith('image/')) {
//             filenameEl.textContent = "Unsupported file type";
//             return;
//         }

//         selectedFile = file;

//         if (previewURL) URL.revokeObjectURL(previewURL);
//         previewURL = URL.createObjectURL(file);

//         filenameEl.textContent = file.name;
//         dropzone.classList.add('has-file');
//         predictBtn.disabled = false;

//         renderScanPreview(previewURL, file.name);
//         resetResultPanel();
//     }

//     /* ---------------- PREDICT ---------------- */

//     predictBtn.addEventListener('click', async () => {

//         if (!selectedFile) return;

//         setLoading(true);

//         const formData = new FormData();
//         formData.append('image', selectedFile);

//         try {
//             const response = await fetch('/predict', {
//                 method: 'POST',
//                 body: formData
//             });

//             if (!response.ok) {
//                 throw new Error(`Server error: ${response.status}`);
//             }

//             const data = await response.json();
//             renderResult(data);

//         } catch (err) {
//             renderError(err);
//         } finally {
//             setLoading(false);
//         }
//     });

//     function setLoading(state) {
//         predictBtn.disabled = state;
//         predictBtn.classList.toggle('is-loading', state);
//     }

//     /* ---------------- UI RENDER ---------------- */

//     function renderScanPreview(url, name) {
//         scanBody.innerHTML = `
//             <div class="result-readout">
//                 <div class="scan-frame">
//                     <img src="${url}" alt="scan preview">
//                 </div>
//                 <p class="scan-meta">${escapeHTML(name)}</p>
//             </div>
//         `;
//     }

//     function resetResultPanel() {
//         resultBody.innerHTML = `
//             <div class="placeholder">
//                 <p>Ready — run prediction</p>
//             </div>
//         `;
//     }

//     function renderResult(data) {

//         const confidence = clamp(Number(data.confidence) || 0, 0, 1);
//         const prediction = data.prediction || "Unknown";
//         const offset = GAUGE_CIRCUMFERENCE * (1 - confidence);

//         resultBody.innerHTML = `
//             <div class="result-readout">
//                 <div class="gauge">
//                     <svg viewBox="0 0 150 150">
//                         <circle class="gauge-track" cx="75" cy="75" r="65"/>
//                         <circle class="gauge-value" id="gaugeValue"
//                                 cx="75" cy="75" r="65"
//                                 stroke-dasharray="${GAUGE_CIRCUMFERENCE}"
//                                 stroke-dashoffset="${GAUGE_CIRCUMFERENCE}"/>
//                     </svg>

//                     <div class="gauge-label">
//                         <span class="gauge-label__value" id="gaugeNumber">0%</span>
//                         <span class="gauge-label__sub">confidence</span>
//                     </div>
//                 </div>

//                 <p class="result-class">${escapeHTML(prediction)}</p>
//             </div>
//         `;

//         requestAnimationFrame(() => {
//             const ring = document.getElementById('gaugeValue');
//             const number = document.getElementById('gaugeNumber');

//             if (!ring || !number) return;

//             ring.style.strokeDashoffset = offset;
//             animateNumber(number, confidence);
//         });
//     }

//     function renderError(err) {
//         resultBody.innerHTML = `
//             <div class="error-state">
//                 Prediction failed: ${escapeHTML(err.message)}
//             </div>
//         `;
//     }

//     /* ---------------- HELPERS ---------------- */

//     function animateNumber(el, target) {
//         const duration = 900;
//         const start = performance.now();

//         function tick(now) {
//             const progress = Math.min((now - start) / duration, 1);
//             const eased = 1 - Math.pow(1 - progress, 3);

//             el.textContent = `${Math.floor(target * eased * 100)}%`;

//             if (progress < 1) requestAnimationFrame(tick);
//         }

//         requestAnimationFrame(tick);
//     }

//     function clamp(v, min, max) {
//         return Math.min(Math.max(v, min), max);
//     }

//     function escapeHTML(str) {
//         const div = document.createElement("div");
//         div.textContent = str;
//         return div.innerHTML;
//     }

// });

document.addEventListener("DOMContentLoaded", () => {

    const dropzone   = document.getElementById('dropzone');
    const imageInput = document.getElementById('imageInput');
    const filenameEl = document.getElementById('filename');
    const predictBtn = document.getElementById('predictBtn');
    const scanBody   = document.getElementById('scanBody');
    const resultBody = document.getElementById('resultBody');

    if (!dropzone || !imageInput) {
        console.error("Missing required DOM elements. Check your HTML IDs.");
        return;
    }

    const GAUGE_CIRCUMFERENCE = 408;

    let selectedFile = null;
    let previewURL = null;

    console.log("app.js loaded successfully");

    /* ---------------- DROPZONE CLICK ---------------- */

    dropzone.addEventListener('click', () => {
        imageInput.click();
    });

    dropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            imageInput.click();
        }
    });

    /* ---------------- DRAG & DROP ---------------- */

    ['dragenter', 'dragover'].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropzone.classList.add('is-dragover');
        });
    });

    ['dragleave', 'dragend'].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropzone.classList.remove('is-dragover');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('is-dragover');

        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    });

    /* ---------------- FILE INPUT ---------------- */

    imageInput.addEventListener('change', () => {
        const file = imageInput.files?.[0];
        if (file) handleFile(file);
    });

    function handleFile(file) {

        if (!file.type.startsWith('image/')) {
            filenameEl.textContent = "Unsupported file type";
            return;
        }

        selectedFile = file;

        if (previewURL) URL.revokeObjectURL(previewURL);
        previewURL = URL.createObjectURL(file);

        filenameEl.textContent = file.name;
        dropzone.classList.add('has-file');
        predictBtn.disabled = false;

        renderScanPreview(previewURL, file.name);
        resetResultPanel();
    }

    /* ---------------- PREDICT ---------------- */

    predictBtn.addEventListener('click', async () => {

        if (!selectedFile) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            renderResult(data);

        } catch (err) {
            renderError(err);
        } finally {
            setLoading(false);
        }
    });

    function setLoading(state) {
        predictBtn.disabled = state;
        predictBtn.classList.toggle('is-loading', state);
    }

    /* ---------------- UI RENDER ---------------- */

    function renderScanPreview(url, name) {
        scanBody.innerHTML = `
            <div class="result-readout">
                <div class="scan-frame">
                    <img src="${url}" alt="scan preview">
                </div>
                <p class="scan-meta">${escapeHTML(name)}</p>
            </div>
        `;
    }

    function resetResultPanel() {
        resultBody.innerHTML = `
            <div class="placeholder">
                <p>Ready — run prediction</p>
            </div>
        `;
    }

    function renderResult(data) {

        const confidence = clamp(Number(data.confidence) || 0, 0, 1);
        const prediction = data.prediction || "Unknown";
        const offset = GAUGE_CIRCUMFERENCE * (1 - confidence);

        // cache-bust so the browser always shows the latest gradcam.jpg
        const gradcamUrl = data.gradcam ? `${data.gradcam}?t=${Date.now()}` : null;

        resultBody.innerHTML = `
            <div class="result-readout">
                <div class="gauge">
                    <svg viewBox="0 0 150 150">
                        <circle class="gauge-track" cx="75" cy="75" r="65"/>
                        <circle class="gauge-value" id="gaugeValue"
                                cx="75" cy="75" r="65"
                                stroke-dasharray="${GAUGE_CIRCUMFERENCE}"
                                stroke-dashoffset="${GAUGE_CIRCUMFERENCE}"/>
                    </svg>

                    <div class="gauge-label">
                        <span class="gauge-label__value" id="gaugeNumber">0%</span>
                        <span class="gauge-label__sub">confidence</span>
                    </div>
                </div>

                <p class="result-class">${escapeHTML(prediction)}</p>

                ${gradcamUrl ? `
                <div class="scan-frame scan-frame--gradcam">
                    <img src="${gradcamUrl}" alt="Grad-CAM heatmap">
                </div>
                <p class="scan-meta">Grad-CAM activation map</p>
                ` : ''}
            </div>
        `;

        requestAnimationFrame(() => {
            const ring = document.getElementById('gaugeValue');
            const number = document.getElementById('gaugeNumber');

            if (!ring || !number) return;

            ring.style.strokeDashoffset = offset;
            animateNumber(number, confidence);
        });
    }

    function renderError(err) {
        resultBody.innerHTML = `
            <div class="error-state">
                Prediction failed: ${escapeHTML(err.message)}
            </div>
        `;
    }

    /* ---------------- HELPERS ---------------- */

    function animateNumber(el, target) {
        const duration = 900;
        const start = performance.now();

        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            el.textContent = `${Math.floor(target * eased * 100)}%`;

            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    function clamp(v, min, max) {
        return Math.min(Math.max(v, min), max);
    }

    function escapeHTML(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

});
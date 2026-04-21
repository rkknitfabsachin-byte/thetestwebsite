let fabricsData = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchFabrics();

    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('cancel-btn').addEventListener('click', closeModal);
    document.getElementById('save-btn').addEventListener('click', saveFabric);

    // Close modal on outside click
    document.getElementById('edit-modal').addEventListener('click', (e) => {
        if (e.target.id === 'edit-modal') closeModal();
    });
});

async function fetchFabrics() {
    const grid = document.getElementById('fabric-grid');
    grid.innerHTML = '<div class="loader-container"><div class="loader"></div></div>';

    try {
        const response = await fetch('/api/admin/fabrics');
        if (!response.ok) throw new Error('Failed to fetch data');

        fabricsData = await response.json();
        renderFabrics();
    } catch (error) {
        showToast('Error loading fabrics: ' + error.message, 'error');
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#ef4444;">Failed to load data. Ensure the server is running.</div>';
    }
}

function renderFabrics() {
    const grid = document.getElementById('fabric-grid');
    grid.innerHTML = '';

    fabricsData.forEach(fabric => {
        const specs = fabric.specs || {};
        const card = document.createElement('div');
        card.className = 'fabric-card';
        card.onclick = () => openEditModal(fabric.id);

        card.innerHTML = `
            <div class="card-header">
                <img src="${fabric.image || 'https://placehold.co/100x100?text=' + encodeURIComponent(fabric.name)}" alt="${fabric.name}" class="fabric-img" onerror="this.src='https://placehold.co/100?text=IMG'">
                <div class="card-info">
                    <h3>${fabric.name}</h3>
                    <span class="tag">${fabric.categoryName || 'Uncategorized'}</span>
                </div>
            </div>
            <div class="card-specs">
                <div class="spec-item">
                    <span class="spec-label">GSM</span>
                    <span class="spec-val" title="${specs.gsm || 'N/A'}">${specs.gsm || 'N/A'}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Width</span>
                    <span class="spec-val" title="${specs.width || 'N/A'}">${specs.width || 'N/A'}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">MOQ</span>
                    <span class="spec-val" title="${specs.moq || 'N/A'}">${specs.moq || 'N/A'}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">Finish</span>
                    <span class="spec-val" title="${specs.finish || 'N/A'}">${specs.finish || 'N/A'}</span>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function openEditModal(id) {
    const fabric = fabricsData.find(f => f.id === id);
    if (!fabric) return;

    document.getElementById('edit-id').value = fabric.id;
    document.getElementById('edit-name').value = fabric.name || '';
    document.getElementById('edit-description').value = fabric.description || '';

    const specs = fabric.specs || {};
    document.getElementById('spec-gsm').value = specs.gsm || '';
    document.getElementById('spec-width').value = specs.width || '';
    document.getElementById('spec-composition').value = specs.composition || '';
    document.getElementById('spec-finish').value = specs.finish || '';
    document.getElementById('spec-moq').value = specs.moq || '';

    document.getElementById('edit-modal').classList.add('show');
}

function closeModal() {
    document.getElementById('edit-modal').classList.remove('show');
}

async function saveFabric() {
    const id = document.getElementById('edit-id').value;
    const saveBtn = document.getElementById('save-btn');

    const payload = {
        description: document.getElementById('edit-description').value,
        specs: {
            gsm: document.getElementById('spec-gsm').value,
            width: document.getElementById('spec-width').value,
            composition: document.getElementById('spec-composition').value,
            finish: document.getElementById('spec-finish').value,
            moq: document.getElementById('spec-moq').value
        }
    };

    saveBtn.disabled = true;
    saveBtn.innerHTML = 'Saving...';

    try {
        const response = await fetch(`/api/admin/fabric/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            showToast('Fabric updated and site rebuilt successfully!', 'success');
            // Update local data
            const index = fabricsData.findIndex(f => f.id === id);
            if (index !== -1) {
                fabricsData[index] = data.fabric;
                renderFabrics();
            }
            closeModal();
        } else {
            throw new Error(data.error || 'Failed to update');
        }
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Save Changes';
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;

    setTimeout(() => {
        toast.className = 'toast';
    }, 4000);
}

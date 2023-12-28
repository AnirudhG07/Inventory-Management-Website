// Retrieve SKU data from local storage or initialize an empty array
let skuData = JSON.parse(localStorage.getItem('skuData')) || [];

function showAddSKUForm() {
    hideForms();
    document.getElementById('addSKUForm').style.display = 'block';
}

function showUpdateSKUForm() {
    hideForms();
    document.getElementById('updateSKUForm').style.display = 'block';
}

function showDeleteSKUForm() {
    hideForms();
    document.getElementById('deleteSKUForm').style.display = 'block';
}

function hideForms() {
    document.getElementById('addSKUForm').style.display = 'none';
    document.getElementById('updateSKUForm').style.display = 'none';
    document.getElementById('deleteSKUForm').style.display = 'none';
    document.getElementById('warningMessage').style.display = 'none';
}
// Add these functions to your script.js file

function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.style.display = 'block'; // Or any other way to make it visible

  // Optionally, clear the message after a few seconds:
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000); // Delay in milliseconds
}


function showWarningMessage(message) {
    const warningMessage = document.getElementById('warningMessage');
    warningMessage.textContent = message;
    warningMessage.style.display = 'block';
  // ... (similarly clear the message after a delay if needed)
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000); // Delay in milliseconds
}

function addSKU() {
    const skuCode = document.getElementById('skuCode').value; // Get the SKU code in the form of a string
    const quantity = document.getElementById('quantity').value;
    const binNumber = document.getElementById('binNumber').value;
    if (skuCode && quantity && binNumber) { // Check if all fields are filled
        if (skuData.find(sku => sku.skuCode === skuCode)) { // Check if SKU already exists
            showWarningMessage('SKU already exists');
            return;
        }
        
        const newSKU = { skuCode, quantity, binNumber };
        const timestamp = new Date().toLocaleString();

        alert('SKU added successfully')

        skuData.push(newSKU);
        updateLocalStorage();
        displaySKUs();
        hideForms();

    }
    else {
        showWarningMessage('Please fill all fields');
        setTimeout(() => {
        showWarningMessage('');
        }, 5000);
    }
}

function hideWarningMessage() {
    document.getElementById('warningMessage').style.display = 'none';
    document.getElementById('warningMessage').textContent = 'warningMessage';
}

function updateLocalStorage() {
    localStorage.setItem('skuData', JSON.stringify(skuData));
}

function fetchAndUpdateSKU() {
    const updateSkuCode = document.getElementById('updateSkuCode').value;
    const updateQuantityInput = document.getElementById('updateQuantity');
    const updateBinNumberInput = document.getElementById('updateBinNumber');
    const updateSKUInfo = document.getElementById('updateSKUInfo');

    const skuToUpdate = skuData.find(sku => sku.skuCode === updateSkuCode);

    if (skuToUpdate) {
        // SKU found, display the information and show the update controls
        updateSKUInfo.style.display = 'block';
        updateQuantityInput.value = skuToUpdate.quantity;
        updateBinNumberInput.value = skuToUpdate.binNumber;

        // Hide the warning message if it was shown previously
        hideWarningMessage();
    } else {
        // SKU not found, display a message and hide the update controls
        alert('SKU does not exist, pls Add SKU.');
    }
}

function changeQuantity(amount) {
    const updateQuantityInput = document.getElementById('updateQuantity');
    const currentQuantity = parseInt(updateQuantityInput.value) || 0;

    updateQuantityInput.value = currentQuantity + amount;
    if (currentQuantity + amount < 0) {
        updateQuantityInput.value = 0;
    }
}
function showUpdateSKUForm() {
    hideForms();
    const updateSKUForm = document.getElementById('updateSKUForm');
    updateSKUForm.style.display = 'block';

    const updateSkuCodeInput = document.getElementById('updateSkuCode');
    updateSkuCodeInput.value = ''; // Clear the input field when showing the form
}

function updateSKU() {
    const updateSkuCode = document.getElementById('updateSkuCode').value;
    const updateQuantityInput = document.getElementById('updateQuantity');
    const stockInInput = document.getElementById('stockIn');
    const stockOutInput = document.getElementById('stockOut');
    const updateBinNumberInput = document.getElementById('updateBinNumber');

    const skuToUpdate = skuData.find(sku => sku.skuCode === updateSkuCode);

    if (skuToUpdate) {
        // SKU found, update the quantity, stock in, stock out, and bin number
        const initialQuantity = parseInt(skuToUpdate.quantity);
        const stockIn = parseInt(stockInInput.value) || 0;
        const stockOut = parseInt(stockOutInput.value) || 0;

        skuToUpdate.quantity = initialQuantity + stockIn - stockOut;
        if (skuToUpdate.quantity < 0) {
            alert('Stock cannot be less than 0. Please check the stock in and stock out values. STOCK SET TO 0.')
            skuToUpdate.quantity = 0;
        }
        alert('SKU updated successfully')
        skuToUpdate.binNumber = updateBinNumberInput.value;

        updateLocalStorage();
        displaySKUs();
        hideForms();

        const timestamp = new Date().toLocaleString();

        // Show success alert
    } else {
        // SKU not found, display a message
        showWarningMessage(`SKU ${updateSkuCode} not found. Please add it.`);
    }
}

function showWarningMessage(message) {
    // Display a warning message
    document.getElementById('warningMessage').innerHTML = message;
}

// You may need to modify the displaySKUs and hideForms functions accordingly.



function confirmDeleteSKU() {
    const deleteSkuCode = document.getElementById('deleteSkuCode').value;
    const confirmationMessage = document.getElementById('confirmationMessage');
    const confirmationText = document.getElementById('confirmationText');

    const skuToDelete = skuData.find(sku => sku.skuCode === deleteSkuCode);

    if (skuToDelete) {
        // SKU found, display the confirmation message
        confirmationText.textContent = `Are you sure you want to delete SKU: ${deleteSkuCode}?`;
        confirmationMessage.style.display = 'block';
        hideWarningMessage();
    } else {
        // SKU not found, display a message
        alert('SKU does not exist')
    }
}

function confirmDelete() {
    const deleteSkuCode = document.getElementById('deleteSkuCode').value; // Get the SKU code to delete
    const skuIndexToDelete = skuData.findIndex(sku => sku.skuCode === deleteSkuCode);

    if (skuIndexToDelete !== -1) { 
        // SKU found, delete it
        document.getElementById('confirmationMessage').style.display = 'none';

        alert('SKU deleted successfully');
        skuData.splice(skuIndexToDelete, 1); 
        updateLocalStorage(); 
        displaySKUs(); 
        hideForms(); // 

        document.getElementById('confirmationMessage').style.display = 'none';

    } else {
        // SKU not found, display a message
        alert('SKU does nor exist');

    }
}

function cancelDelete() {
    // Hide the confirmation message
    document.getElementById('confirmationMessage').style.display = 'none';
}

let isInventoryVisible = false;

function showInventory() {
    const lowerHalf = document.getElementById('lowerHalf');

    // Check if the inventory content already exists
    const existingInventoryContent = document.getElementById('inventoryContent');

    if (existingInventoryContent) {
        // If the inventory content exists, remove it
        lowerHalf.removeChild(existingInventoryContent);
        isInventoryVisible = false; // Set visibility state to false
        return;
    }

    // Create the inventory content
    const inventoryContent = document.createElement('div');
    inventoryContent.id = 'inventoryContent';
    inventoryContent.innerHTML = '<h2>Inventory</h2>';

    // Create a div for the scrollable table
    const tableContainer = document.createElement('div');
    tableContainer.style.maxHeight = '300px'; // Set a fixed height for the table container
    tableContainer.style.overflowY = 'auto'; // Enable vertical scroll

    // Create a table to display SKU data
    const inventoryTable = document.createElement('table');
    inventoryTable.innerHTML = `
        <tr>
            <th>SKU Code</th>
            <th>Quantity</th>
            <th>Bin Number</th>
        </tr>
    `;

    // Populate the table with SKU data
    for (const sku of skuData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sku.skuCode}</td>
            <td>${sku.quantity}</td>
            <td>${sku.binNumber}</td>
        `;
        inventoryTable.appendChild(row);
    }

    tableContainer.appendChild(inventoryTable);
    inventoryContent.appendChild(tableContainer);
    lowerHalf.appendChild(inventoryContent);
    isInventoryVisible = true; // Set visibility state to true
}

// Add this function to your script.js file
function searchInventory() {
    const searchSkuCode = document.getElementById('searchSkuCode').value;
    const searchResultDiv = document.getElementById('searchResult');

    // Find the SKU in the inventory
    const foundSku = skuData.find(sku => sku.skuCode === searchSkuCode);

    if (foundSku) {
        // SKU found, display details
        searchResultDiv.innerHTML = `
            <p>SKU Code: ${foundSku.skuCode}</p>
            <p>Quantity: ${foundSku.quantity}</p>
            <p>Bin Number: ${foundSku.binNumber}</p>
        `;
    } else {
        // SKU not found, display a message
        searchResultDiv.innerHTML = '<p>SKU NOT FOUND</p>';
    }
}

displaySKUs();

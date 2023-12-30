// Retrieve SKU data from local storage or initialize an empty array
let skuData = JSON.parse(localStorage.getItem('skuData')) || [];

// Call the function to load orders from local storage when the page loads
function updateLocalStorage() {
    localStorage.setItem('skuData', JSON.stringify(skuData));
}
if (performance.navigation.type === 1) {
  //Redirect to the security page
    window.location.href = "security_web.html"; // Replace with the actual path
}
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('active');
}

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

        alert('SKU added successfully');
        skuData.push(newSKU);
        //updateLocalStorage();
        sendDataToServer(skuCode, quantity, binNumber, false);
        displaySKUs();
        hideForms();

    }
    else {
        alert('Please fill all fields');
    }
}

function hideWarningMessage() {
    document.getElementById('warningMessage').style.display = 'none';
    document.getElementById('warningMessage').textContent = 'warningMessage';
}

function sendDataToServer(sku, quantity, binNumber, dlete) {
    var data = {
        sku: sku,
        quantity: quantity,
        binNumber: binNumber,
        delete: dlete
    };

    fetch('default.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
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
            alert('Stock cannot be less than 0. Please check the stock in and stock out values. STOCK SET TO 0.');
            skuToUpdate.quantity = 0;
        }
        alert('SKU updated successfully');
        skuToUpdate.binNumber = updateBinNumberInput.value;
        //updateLocalStorage();
        sendDataToServer(updateSkuCode, skuToUpdate.quantity, skuToUpdate.binNumber, false);
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

function confirmDelete() {
    const deleteSkuCode = document.getElementById('deleteSkuCode').value; // Get the SKU code to delete
    const skuIndexToDelete = skuData.findIndex(sku => sku.skuCode === deleteSkuCode);

    if (skuIndexToDelete !== -1) { 
        // SKU found, delete it
        const isConfirmed = confirm(`Are you sure you want to delete SKU: ${deleteSkuCode}?`);
        
        if (isConfirmed) {
            document.getElementById('confirmationMessage').style.display = 'none';

            alert('SKU deleted successfully');
            skuData.splice(skuIndexToDelete, 1); 
            //updateLocalStorage();
            sendDataToServer(deleteSkuCode, 0, 0, true); 
            displaySKUs(); 
            hideForms(); // 
        }
    } else {
        // SKU not found, display a message
        alert('SKU does not exist');
    }
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

function searchInventory() {
    const inventorySkuCode = document.getElementById('inventorySkuCode').value;
    const searchResultDiv = document.getElementById('searchResult');
    const addToOrderListBtn = document.getElementById('addToOrderListBtn');

    // Find the SKU in the inventory
    const foundSku = skuData.find(sku => sku.skuCode === inventorySkuCode);

    if (foundSku) {
        // SKU found, display details and show the "Add to Order List" button
        searchResultDiv.innerHTML = `
            <div class="search-result">
                <p>SKU Code: ${foundSku.skuCode}</p>
                <p>Quantity: ${foundSku.quantity}</p>
                <p>Bin Number: ${foundSku.binNumber}</p>
            </div>
        `;
        addToOrderListBtn.style.display = 'inline';
    } else {
        // SKU not found, display a message and hide the "Add to Order List" button
        searchResultDiv.innerHTML = '<div class="search-result"><p>SKU NOT FOUND</p></div>';
        addToOrderListBtn.style.display = 'none';
    }
}

function openPopup() {
    // Create the popup element (can be a div)
    const popup = document.createElement('div');
    popup.id = 'passwordPopup';
    popup.innerHTML = `
      <h2>Enter Password</h2>
      <input type="password" id="password">
      <button onclick="checkPassword()">Submit</button>
    `;
    document.body.appendChild(popup);
  
    // Style the popup (position, size, visibility)
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.background = '#fff';
    popup.style.padding = '40px';
    popup.style.border = '3px solid #ddd';
    popup.style.borderRadius = '5px';
    popup.style.display = 'block';
  
    document.getElementById('password').addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        checkPassword();
      }
    });
  }
  
  function checkPassword() {
    const password = document.getElementById('password').value;
    const correctPassword = 'Your_Password'; // Replace with your actual password
  
    if (password === correctPassword) {
      // Remove the popup from the document
      alert('Correct password. Redirecting to main page')
      window.location.href = "website.html";
      // Perform your desired action (open website, reveal content, etc.)
    } else {
      alert('Incorrect password!');
    }
  }
  
  // Trigger the popup when clicking the button or link
  document.getElementById('yourButtonId').addEventListener('click', openPopup);

// ORDER PORTAL *******************************************************
// Function to open the Order Portal
function openOrderPortal() {
    document.getElementById('orderPortal').style.display = 'block';
}

let orderData = JSON.parse(localStorage.getItem('orderData')) || [];

// Function to update local storage for Order List
function updateOrderLocalStorage(orderList) {
    localStorage.setItem('orderData', JSON.stringify(orderList));
}

window.addEventListener('load', function() {
    const existingOrderList = JSON.parse(localStorage.getItem('orderData')) || [];
    displayOrderList(existingOrderList);
});

// Function to display the Order List
function displayOrderList(orderList) {
    const orderTableContainer = document.getElementById('orderTableContainer');
    const orderTable = document.getElementById('orderTable');

    // Clear the existing rows in the table
    orderTable.innerHTML = `
        <tr>
            <th>SKU Code</th>
            <th>Quantity</th>
            <th>Bin Number</th>
        </tr>
    `;

    // Populate the table with Order List data
    for (const order of orderList) {
        const row = orderTable.insertRow(-1);
        row.innerHTML = `
            <td>${order.skuCode}</td>
            <td>${order.quantity}</td>
            <td>${order.binNumber}</td>
        `;
    }

    // Show the Order List container
    orderTableContainer.style.display = 'block';
}

// Function to search and update in the Order List
function searchAndUpdateOrder() {
    const orderSearchInput = document.getElementById('orderSearch').value;
    const orderTableContainer = document.getElementById('orderTableContainer');
    const orderTable = document.getElementById('orderTable');

    // Find the SKU in your data
    const foundSKU = skuData.find(sku => sku.skuCode === orderSearchInput);

    if (foundSKU) {
        // If SKU found, prompt for quantity
        const quantityToAdd = prompt('Enter the quantity to be added to the order list:', '');

        // Check if the user entered a valid quantity
        if (quantityToAdd !== null && !isNaN(quantityToAdd) && quantityToAdd !== '') {
            // Check if there is enough stock in the Inventory
            const existingQuantity = parseInt(foundSKU.quantity);
            const remainingQuantity = existingQuantity - parseInt(quantityToAdd);

            if (remainingQuantity >= 0) {
                // Update the Order List
                const row = orderTable.insertRow(-1);
                row.innerHTML = `
                    <td>${foundSKU.skuCode}</td>
                    <td>${quantityToAdd}</td>
                    <td>${foundSKU.binNumber}</td>
                `;

                // Get existing order list from local storage
                const existingOrderList = JSON.parse(localStorage.getItem('orderData')) || [];

                // Add the new order to the order list
                const newOrder = {
                    skuCode: foundSKU.skuCode,
                    quantity: parseInt(quantityToAdd),
                    binNumber: foundSKU.binNumber
                };
                existingOrderList.push(newOrder);

                // Update local storage for the Order List
                localStorage.setItem('orderData', JSON.stringify(existingOrderList));

                // Update quantity in the Inventory
                foundSKU.quantity = remainingQuantity.toString();

                // Update local storage for the Inventory
                localStorage.setItem('skuData', JSON.stringify(skuData));

                // Show the Order List container
                displayOrderList(existingOrderList);
            } else {
                // Display error message if there is not enough stock
                alert('Error: Insufficient stock. Quantity cannot be negative.');
            }
        } else {
            // Handle invalid quantity input or cancellation
            alert('Invalid quantity or action cancelled.');
        }
    } else {
        // If SKU not found, display a message or take appropriate action
        alert('SKU not found. Please check the SKU code and try again.');
    }
}
function clearOrderList() {
    // Ask for confirmation
    const isConfirmed = confirm("Are you sure you want to clear the order list?");
    
    if (isConfirmed) {
        const orderTable = document.getElementById('orderTable');
        orderTable.innerHTML = '<tr><th>SKU Code</th><th>Quantity</th><th>Bin Number</th><td><input type="checkbox" class="orderCheckbox"></td></tr>';

        // Clear the corresponding data from local storage
        localStorage.removeItem('orderData');
    }
}

function printOrderList() {
    const orderTable = document.getElementById('orderTable');
    
    // Create a copy of the ORDER LIST table
    const clonedTable = orderTable.cloneNode(true);

    const currentDate = new Date();
    const printDateRow = clonedTable.insertRow(0);
    const printDateCell = printDateRow.insertCell(0);
    printDateCell.colSpan = clonedTable.rows[1].cells.length; // Span across all columns
    printDateCell.innerHTML = `ORDER DATE: ${currentDate.toLocaleDateString()}`;

    const companyNameRow = clonedTable.insertRow(0);
    const companyNameCell = companyNameRow.insertCell(0);
    companyNameCell.colSpan = clonedTable.rows[1].cells.length; // Span across all columns
    companyNameCell.innerHTML = 'SHEMEKA INDUSTRIES PRIVATE LIMITED';
    companyNameCell.style.textAlign = 'center'; // Center-align the company name
    companyNameCell.style.size = '20px'; // Adjust as needed

    // Apply additional styling to the cloned table for printing
    clonedTable.style.borderCollapse = 'collapse';
    clonedTable.style.width = '100%';
    clonedTable.style.marginTop = '20px'; // Adjust as needed

    for (let i = 0; i < clonedTable.rows.length; i++) {
        const row = clonedTable.rows[i];
        row.style.border = '1px solid #ddd';
    }

    for (let i = 0; i < clonedTable.rows[0].cells.length; i++) {
        const headerCell = clonedTable.rows[0].cells[i];
        headerCell.style.backgroundColor = '#f2f2f2';
        headerCell.style.border = '1px solid #ddd';
    }

    for (let i = 1; i < clonedTable.rows.length; i++) {
        const cells = clonedTable.rows[i].cells;
        for (let j = 0; j < cells.length; j++) {
            cells[j].style.border = '1px solid #ddd';
        }
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Append the cloned table to the new window
    printWindow.document.body.appendChild(clonedTable);

    // Print the window
    printWindow.print();
}

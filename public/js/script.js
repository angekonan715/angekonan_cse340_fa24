document.addEventListener("DOMContentLoaded", () => {
    const classificationSelect = document.getElementById("classificationList"); // Assuming the ID is classificationSelect
    const inventoryDisplay = document.getElementById("inventoryDisplay");
  
    // Listen for changes in the classification select list
    classificationSelect.addEventListener("change", async () => {
      const classificationId = classificationSelect.value;
  
      // Only proceed if a classification is selected
      if (classificationId) {
        try {
          // Fetch inventory data for the selected classification
          const response = await fetch(`/inv/getInventory/${classificationId}`);
          const data = await response.json();
  
          // Inject the data into the inventory table
          updateInventoryTable(data);
        } catch (error) {
          console.error("Error fetching inventory data:", error);
        }
      } else {
        // Clear the table if no classification is selected
        inventoryDisplay.innerHTML = `<tr><td colspan="5">Please select a classification to view inventory items.</td></tr>`;
      }
    });
  });
  
  // Function to update the table with inventory data
  function updateInventoryTable(inventoryItems) {
    const inventoryDisplayBody = document.querySelector(
      "#inventoryDisplay tbody"
    );
  
    // Clear the table before updating
    inventoryDisplayBody.innerHTML = "";
  
    if (inventoryItems.length > 0) {
      // Add rows for each inventory item
      inventoryItems.forEach((item) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
            <td>${item.inv_make} ${item.inv_model} ${item.inv_year}</td>
            <td><a href='/inv/editInventory/${item.inv_id}' title='Click to update'>Modify</a></td>
            <td><a href='/inv/delete/${item.inv_id}' title='Click to delete'>Delete</a></td>
          `;
        inventoryDisplayBody.appendChild(row);
      });
    } else {
      // If no items, display a message
      inventoryDisplayBody.innerHTML = `<tr><td colspan="5">No inventory items available for the selected classification.</td></tr>`;
    }
  }

  const form = document.querySelector("form");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("[input][type='submit']");
  updateBtn.removeAttribute("disabled");
});
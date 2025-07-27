const toggleBtn = document.getElementById("toggleInventoryBtn");
const inventorySection = document.getElementById("inventorySection");

toggleBtn.addEventListener("click", () => {
  inventorySection.classList.toggle("hidden");
});

// Handle Edit and Delete Buttons
document.getElementById("inventory-body").addEventListener("click", function (e) {
  if (e.target.classList.contains("edit-btn")) {
    const row = e.target.closest("tr");
    const [item, qty, unit, price] = row.children;
    document.getElementById("itemName").value = item.textContent;
    document.getElementById("itemQty").value = qty.textContent;
    document.getElementById("itemUnit").value = unit.textContent;
    document.getElementById("itemPrice").value = price.textContent;
    row.remove();
  } else if (e.target.classList.contains("delete-btn")) {
    e.target.closest("tr").remove();
  }
});

// Handle Form Submission
document.getElementById("inventoryForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const item = document.getElementById("itemName").value;
  const qty = document.getElementById("itemQty").value;
  const unit = document.getElementById("itemUnit").value;
  const price = document.getElementById("itemPrice").value;

  const row = `
    <tr>
      <td>${item}</td>
      <td>${qty}</td>
      <td>${unit}</td>
      <td>${price}</td>
      <td>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </td>
    </tr>
  `;
  document.getElementById("inventory-body").insertAdjacentHTML("beforeend", row);
  this.reset();
});

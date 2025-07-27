 document.getElementById("searchForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const locationValue = document.getElementById("locationInput").value.toLowerCase();

    // Fetch inventory with supplier details
    const { data: inventory, error } = await supabase
      .from("inventory")
      .select("item_name, price, stock, delivery_time, supplier_id, suppliers(name, location)")
      .ilike("item_name", `%${searchValue}%`);

    if (error) {
      console.error("Error fetching inventory:", error.message);
      return;
    }

    // Filter based on location
    const filtered = inventory.filter(item =>
      item.suppliers?.location?.toLowerCase().includes(locationValue)
    );

    displayResults(filtered);
  });

  function displayResults(data) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "<p>No suppliers found for the given item/location.</p>";
      return;
    }

    data.forEach(entry => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="https://source.unsplash.com/featured/?${entry.item_name}" alt="${entry.item_name}">
        <div class="card-body">
          <h3>${entry.suppliers.name}</h3>
          <p><strong>Location:</strong> ${entry.suppliers.location}</p>
          <p><strong>Item:</strong> ${entry.item_name}</p>
          <p><strong>Price:</strong> ₹${entry.price}/unit</p>
          <p><strong>Stock:</strong> ${entry.stock} units</p>
          <p><strong>Delivery:</strong> ${entry.delivery_time} days</p>
        </div>
      `;
      container.appendChild(card);
    });
  }
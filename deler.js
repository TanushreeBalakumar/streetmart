// Toggle between Login and Register forms
document.addEventListener("DOMContentLoaded", function () {
  const loginToggle = document.getElementById("login-toggle");
  const registerToggle = document.getElementById("register-toggle");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  loginToggle.addEventListener("click", function () {
    loginToggle.classList.add("active");
    registerToggle.classList.remove("active");
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
  });

  registerToggle.addEventListener("click", function () {
    registerToggle.classList.add("active");
    loginToggle.classList.remove("active");
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });
});

// Login Logic
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("Login failed: " + error.message);
    return;
  }

  // Fetch user role from profiles table
  const { data: profileData, error: profileError } = await supabaseClient
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profileData) {
    alert("Error fetching user role: " + (profileError?.message || "No role found"));
    return;
  }

  const role = profileData.role;

  if (role === 'vendor') {
    window.location.href = 'vendor-dashboard.html';
  } else if (role === 'supplier') {
    window.location.href = 'supplier-dashboard.html';
  } else {
    alert("Unknown role. Cannot redirect.");
  }
});

// Register Logic
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  const shopName = document.getElementById('register-shop-name').value;
  const shopType = document.getElementById('register-shop-type').value;
  const location = document.getElementById('register-location').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  console.log("Registering user...");

  const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    alert("Error signing up: " + signUpError.message);
    return;
  }

  const userId = signUpData?.user?.id;

  if (!userId) {
    alert("Signup succeeded, but user ID not found.");
    return;
  }

  // Insert into 'profiles' table
  const { error: insertError } = await supabaseClient
    .from('profiles')
    .insert([
      {
        id: userId,
        full_name: name,
        email: email,
        shop_name: shopName,
        shop_type: shopType,
        location: location,
        role: 'supplier', // or use dynamic selection
      }
    ]);

  if (insertError) {
    alert("Error saving profile info: " + insertError.message);
    return;
  }

  alert("Registration successful! Please verify your email before logging in.");
  // Optional: Automatically redirect after delay
  window.location.href = "vendor-dashboard.html";
});

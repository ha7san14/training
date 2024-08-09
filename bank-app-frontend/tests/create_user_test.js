// Feature('CreateUserPage');

// Scenario('should create a new user successfully', async ({ I }) => {
//   // Mock the login response
//   I.mockLoginResponse({ token: "fake-token", user: { roles: "ADMIN" } });

//   // Navigate to the login page
//   I.amOnPage("/");

//   // Fill in login details and submit
//   I.fillField("#username", "adminuser");
//   I.fillField("#password", "adminpassword");
//   I.click("Login");

//   // Wait for navigation to admin dashboard
//   I.waitForURL("http://localhost:3000/admin-dashboard", 10000);

//   // Mock the response for creating a new user
//   I.mockCreateUserResponse({ success: true, message: 'User created successfully' });

//   // Wait for the "Create New User" button to be visible
//   I.waitForVisible("Create New User", 10000);

//   // Click "Create New User"
//   I.click("Create New User");

//   // Fill in user creation details
//   I.fillField("#new-username", "newuser");
//   I.fillField("#new-password", "newpassword");
//   I.fillField("#new-email", "newuser@example.com");
//   I.fillField("#new-address", "123 New Street");
//   I.fillField("#new-accountNumber", "123456789");

//   // Submit the form
//   I.click("Create User");

//   // Validate the success message or response
//   I.see("User created successfully");
// });



// Scenario('should show error message on failed user creation', async ({ I }) => {
//   // Step 1: Log in as admin
//   I.amOnPage('/');
//   await I.mockLoginResponse({
//     token: 'fake-admin-token',
//     user: { roles: 'ADMIN' },
//   });
//   I.fillField('#username', 'adminuser');
//   I.fillField('#password', 'adminpassword');
//   I.click('Login');
//   I.seeInCurrentUrl('/admin-dashboard');

//   // Step 2: Navigate to the create user page
//   I.click('Create New User'); // Adjust based on your actual UI
//   I.fillField('#username', ''); // Leave username empty to trigger validation error
//   I.fillField('#password', ''); // Leave password empty to trigger validation error
//   I.fillField('#email', ''); // Leave email empty to trigger validation error
//   I.fillField('#address', '');
//   I.fillField('#accountNumber', '');
//   I.click('Create User');
//   I.waitForText('Failed to create user'); // Adjust based on your actual error message
// });

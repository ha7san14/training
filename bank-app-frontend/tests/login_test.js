Feature('LoginPage');

Scenario('should render login form', ({ I }) => {
  I.amOnPage('/');
  I.see('Login');
  I.seeElement('#username');
  I.seeElement('#password');
  I.see('Login');
});

Scenario('should show error message on failed login', async ({ I }) => {
  I.amOnPage('/');
  I.fillField('#username', 'wronguser');
  I.fillField('#password', 'wrongpassword');
  I.click('Login');
  I.waitForText('Incorrect username or password!', 5);
});


Scenario('should navigate to admin dashboard on successful admin login', async ({ I }) => {
    I.amOnPage('/');
    await I.mockLoginResponse({
      token: 'fake-token',
      user: { roles: 'ADMIN' },
    });
    I.fillField('#username', 'adminuser');
    I.fillField('#password', 'adminpassword');
    I.click('Login');
    I.amOnPage('http://localhost:3000/admin-dashboard');
  });
  
  Scenario('should navigate to user dashboard on successful user login', async ({ I }) => {
    I.amOnPage('/');
    await I.mockLoginResponse({
      token: 'fake-token',
      user: { roles: 'ACCOUNTHOLDER' },
    });
    I.fillField('#username', 'user');
    I.fillField('#password', 'userpassword');
    I.click('Login');
    I.amOnPage('http://localhost:3000/user-dashboard');
  });
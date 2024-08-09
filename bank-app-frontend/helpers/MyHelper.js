const { Helper } = require('codeceptjs');

class MyHelper extends Helper {
  async mockLoginResponse(response) {
    const page = this.helpers.Playwright.page; 
    await page.route('http://localhost:8080/api/v1/auth/login', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response),
      })
    );
  }
  // async mockCreateUserResponse(response, success = true) {
  //   const page = this.helpers.Playwright.page;
  //   await page.route('http://localhost:8080/api/users/create-user', (route) =>
  //     route.fulfill({
  //       status: success ? 200 : 400,
  //       contentType: 'application/json',
  //       body: JSON.stringify(response),
  //     })
  //   );
  // }
}

module.exports = MyHelper;

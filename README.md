# Introduction
SauceDemo Test Project is a test project with UI tests for the [saucedemo.com](https://www.saucedemo.com/) website using Playwright and TypeScript.

The focus of this project is to present a demo test automation framework for testing main functionalities of the mentioned website:
- Authentication
- Products page
- Add to cart
- Checkout 
- Burger Menu

---

## Structure of the project

### Root Files
| File / Folder          | Description                                                                                       |
|------------------------|---------------------------------------------------------------------------------------------------|
| `tsconfig.json`        | TypeScript compiler configuration. Includes aliases, strict rules, and base paths.                |
| `playwright.config.ts` | Central Playwright configuration: test settings, reporters, retries, etc.               |
| `package.json`         | NPM project file: lists dependencies, scripts, and metadata.                                      |
| `.env`                 | Actual environment variables used during test runs.                                               |
| `.env.example`         | Template file to document required env variables (shared across teams/CI).                        |
| `.gitignore`           | Prevents sensitive or unnecessary files (e.g. `node_modules`, test reports) from being committed. |
| `playwright-report/`   | Auto-generated HTML test report folder.                                                           |
| `test-results/`        | Output logs, traces, and videos from test runs.                                                   |

---

### `tests/` 

- `global.setup.ts` - a file with validation check for env variables, setup as a project dependency to the E2E tests project and ment to execute once before all other tests, to make sure all needed env variables are set and available for test execution 
- actual tests for the project

---

### `pages/`

Implements the Page Object Model (POM) for better test abstraction and reusability. Locators are separated from the Page Objects in a separate folder `locators/`.

---

### `utils/`

Contains common utility code to keep tests clean and DRY.

- `constants/testData.ts` - static test data used in the tests
- `helpers/helperFunctions.ts` - helper functions containing login, logout functionality as well as other helper functions used in tests

---

### `src/`

This folder contains core runtime logic related to configuration and typing.

- `config/validateEnv.ts` — Validates presence of required environment variables before tests run.
- `types/global.d.ts` — Declares global TypeScript types, including `process.env` typing for strict safety. Also improves intelliSense in editors like VSCode (autocomplete suggestions).

---

### `.github/workflows`

Here is stored the Github Actions CI/CD Workflow file - `playwright.yaml`. 

Pipeline execution is triggered every time new code is pushed directly to `main` branch or on a pull request to `main`.

Workflow overview:
- **Trigger Events** - Executes on **push** to `main` or on **pull request**
- **Setup env variables** - Setup env variables from the secrets. All needed variables for the project are added as secrets to the repo.
- **Test Matrix** - Runs across multiple browsers using Playwright's project matrix. In the current project is used only 1 browser - chromium, but more can be added very easily through editing that step in the yaml file.
- **Dependency Setup** - install all required dependencie - Node.js, project dependencies, Playwright browsers, etc.
- **Test Execution** - Runs independently tests for each browser specified in the test matrix
- **Reporting**
    - Generates **HTML report** and **JSON report**
    - Automatically uploads reports as **artifacts** that can be downloaded from the Github Actions UI.

---    

# Getting Started
## 1. Prerequisities
1. Install node and npm.
2. Install Visual Studio Code
3. Install playwright official extention for VSCode - Playwright Test for VSCode

---

## 2. Installation process
1. Clone the repo using the commands below:
- ssh:
```
 git clone git@github.com:apiaria/saucedemo-test-project.git
```

- https:

```
git clone https://github.com/apiaria/saucedemo-test-project.git
```    
2. Navigate to folder in git bash or cmd and install npm packages using:
```
npm install
```
3. For first time installation run below command to download required browsers
```
npx playwright install
```
---

# Test Execution

## 1. Setup .env file

Before proceeding to any test execution, make sure to copy `.env.example` file and store it as `.env` in the root folder of the project. After that replace the example values for each variable with the actual ones and then proceed to test execution.

## 2. Run tests in the terminal
 - Run all tests headless on the configed browsers (in the playwright.config.ts)
```
npx playwright test
```
 - Run tests only on Desktop Chrome
 ```
 npx playwright test --project=chromium
```
- Run specific test
```
npx playwright test cart
```
---

## 3. Run tests in VSCode
If the Playwright extension for VsCode is installed tests can be run from the IDE:
- In the test script there is green triangle - when pressed the test will be executed. Right click on it for more options.
- From Test Explorer section: tests should be visible in the Test Explorer session of the IDE. Tests can be run from there using the Run Test option.

---

## 4. Debug tests
- In the terminal tests can be executed in debug mode with the following command:
```
npx playwright test --debug
```
- In the IDE: using the official Playwright extension run test in Debug Mode via Debug Test Option that can be found either on right click on green triangle in the test scripts or from Test Explorer.

---

## 5. Reports
There are built-in reporters in Playwright used in the project:
1. List Reporter: 
 - List reporter is default, it is basically a **console reporter**. It prints test progress live as it runs. It is used to get nice terminal output.
 - The `{printSteps: true}` options added in config file shows **step-by-step** logs for each test, which is very handy and helpful for debugging 

 ```
 npx playwright test --reporter=list
 ```
---

2. Dot reporter:

Used instead of list reporter on CI.

---

3. HTML Reporter:
- HTML reporter produces a self-contained folder that contains report for the test run that can be served as a web page. By default the html report can be found in playwright-report folder, but the location can be overriden.

```
npx playwright test --reporter=html
```
- To open html report of the executed tests:

```
npx playwright show-report
```
---

4. JSON Reporter:
- JSON reporter produces an object with all information about the test run.
- JSON report is generated into file that is saved in test-results folder of the project

---

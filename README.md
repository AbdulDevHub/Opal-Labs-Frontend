# frontend

> Opalescence Dashboard

[//]: <> 'TODO: Add CI/CD Badges'

## Setup

1. Run `yarn install` to install dependencies
2. Install all the required workspace `@recommended` extensions
3. Add the required `.env` configs from the team drive

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Google OAuth 2.0

Follow the instructions outlined in [Google OAuth 2.0 Setup](https://drive.google.com/drive/folders/1PWzpsJGXIDA_RnRRoEcJe_U5yvGC6s_U?usp=sharing)

## Storybook

Run the command to run the storybook components at port 6000:

```bash
yarn storybook
```

## Testing

Run the commands to catch any linting / type errors:

```bash
yarn lint
yarn check-types
```

These commands are run before pushing with `husky` and in our CI/CD pipeline with `GitHub Actions`.

## Playwright Testing

Playwright is a framework for writing tests for web applications. We use it to write tests for common user interactions and to test our endpoints. Here's how you can set it up and use it:

1. Make sure to install all the necessary packages by running `yarn`.

2. Start the frontend by running `yarn dev`.

3. Generate test code by running `npx playwright codegen`. This will open a browser where you can interact with your application at `localhost:3000`. Playwright will record your interactions and generate test code.

4. Once you're done interacting with your site, copy the generated test code and paste it into `tests\TestWithoutBackend.spec.ts`.

5. You can then run your tests using `npx playwright test`. This will run the tests in the command line. You might encounter timeout errors because your code took too long to compile the page, so just run the command again.

6. After the tests are done, you can see the results by running `npx playwright show-report`. This will generate a report of your tests.

7. For a more visual display of the tests in real-time, you can also run `npx playwright test --ui` instead of `npx playwright test`.

Please refer to the [Playwright documentation](https://playwright.dev/docs/intro) for more detailed information.

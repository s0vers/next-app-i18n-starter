# Next.js Boilerplate with i18n and Shadcn UI

This is a boilerplate project for Next.js applications that includes basic internationalization (i18n) support, shadcn UI components, and functionality to toggle between light and dark themes and different languages. It also includes an `OmitRTL` utility function to help control elements that should be omitted from RTL (right-to-left) rendering.

## Features

- **Next.js**: The boilerplate is built on the [Next.js](https://nextjs.org/) React framework.
- **i18n**: Basic internationalization support using the [next-intl](https://github.com/vinissimus/next-intl) library.
- **Shadcn UI**: Includes the [shadcn UI](https://shadcn.com/) component library for a modern and accessible UI.
- **Theme Toggling**: Ability to toggle between light and dark themes.
- **Language Switching**: Allows users to switch between different languages (e.g., English and Arabic).
- **OmitRTL Function**: A utility function to omit specific elements from RTL rendering, ensuring they always display in LTR (left-to-right) mode.

## Getting Started

Clone the repository:

```bash
https://github.com/S0vers/i18n-Nextjs-BoilerPlate.git
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

<!-- How to use the OmitRtl function tutorial -->

# How to use the function:

```
import OmitRTL from './OmitRTL';

function MyComponent() {
  return (
    <div>
      <p>This text will follow the website's direction.</p>
      <OmitRTL omitRTL={true}>
        <img src="/logo.png" alt="Logo" />
        <div>
          <h2>This heading and content will always be LTR</h2>
          <p>Regardless of the website's direction.</p>
        </div>
      </OmitRTL>
    </div>
  );
}
```

If you just need the OmitRTL function it is also available as a npm package

# Installation

```bash
npm i react-omit-rtl
```

## Usage

```
import React from "react";
import OmitRTL from "react-omit-rtl";

function App() {
  return (
    <OmitRTL omitRTL={true}>
      <p>This text will not have RTL direction.</p>
    </OmitRTL>
  );
}
export default App;
```

# Contributing

If you'd like to contribute to this boilerplate, please follow these steps:

- Fork the repository
- Create a new branch (git checkout -b feature/your-feature)
- Commit your changes (git commit -am 'Add some feature')
- Push to the branch (git push origin feature/your-feature)
- Create a new Pull Request

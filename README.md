# We have terminated the backend for this project.  Old Reshuffle projects can no longer be deployed.

<p align="center">
  <img src="./magic-api.png">
</p>
<h3 align="center">From zero to API in 60 seconds</h2>
<p align="center">Build APIs directly in your browser. Deploy to production with a single command.</b>
<p align="center">
  <a href="https://reshuffle.com/template/magic-api">Run me on Reshuffle</a>
</p>
<p  align="center">
  <img src="./app-screen.png">
</p>

Magic API lets you create and serve HTTP APIs in an instant. You can
define API endpoints directly in your browser and edit the code to serve them.
You get a built in database so you can store user data and easily build
stateful APIs.

Magic API is a [Reshuffle](https://reshuffle.com) app, so you can deploy it to
production in seconds. It is distributed under the MIT open source license, so
you can easily download it code, modify it to your need and deploy back to the
cloud.

## Getting Started

1. [Run Magic API](https://reshuffle.com/template/magic-api) on Reshuffle.
2. Create your API endpoints inside the browser.
3. Click **REMIX** on Reshuffle to save the app to your account.
4. Read the [Reshuffle dev docs](https://dev.reshuffle.app) to use Reshuffle's
database, identity and other features.

## Building API Endpoint

Use the **Add Endpoint** button to create an API endpoint. Each endpoint
requires three inputs:

1. The HTTP method to access the API endpoint. Choose this from the dropdown
on the top left.
2. The HTTP path. All APIs are created under `https://your.domain/api/`.
3. The code.

Your API endpoint code is simply [Express](https://expressjs.com) request
handler. This is JavaScript code running in a standard Node.js environment.

Application code can use
[Reshuffle DB](https://dev.reshuffle.app/using-reshuffledb) to store user
data. You can also access any other database or HTTP service directly from
your code.

If your API code relies on npm packages, you may add the to your app,
as described below.

## Customizing Magic API

Magic API is built with a [React](https://reactjs.org) frontend and a
[Node.js](https://nodejs.org) backend, and uses
[Reshuffle DB](https://dev.reshuffle.app/using-reshuffledb) to store the API
endpoints meta data.

To modify and customize the app:

1. Download the code from your app page on Reshuffle.
2. Run `npm start` to develop locally.
3. Make changes and test locally. Your frontend code resides in `/src`. Your
backend in `/backend`. _Note that APIs endpoints created in the cloud are not
copied to the local dev environment and vice versa._
4. Run `npx reshuffle deploy` to deploy your changes to the cloud.

## Roadmap

* Integrate [Reshuffle Identity](https://dev.reshuffle.app/identity) so that
only the you can edit your endpoints.
* Add new and interesting triggers.

## Learn More

You can learn more about Reshuffle by reading the
[dev docs](https://dev.reshuffle.app).

- [API Reference](https://dev-docs.reshuffle.com)
- [Main Concepts](https://dev.reshuffle.app/hello-reshuffle)
- [Getting Started](https://dev.reshuffle.app/getting-started)
- [Running Locally](https://dev.reshuffle.app/running-locally)

Magic API uses [ACE](https://ace.c9.io), the AWS Cloud9 browser based code
editor.

- Visit [ACE homepage](https://ace.c9.io) for usage instructions
- [ACE on GitHub](https://github.com/ajaxorg/ace) for in-depth docs
- [AWS Cloud9](https://aws.amazon.com/cloud9)

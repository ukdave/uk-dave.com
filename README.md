[![Netlify Status](https://api.netlify.com/api/v1/badges/dd3b24fa-dab3-4900-98e6-5cbd7b0a1185/deploy-status)](https://app.netlify.com/sites/uk-dave-com/deploys)

# My Personal Website

Built with [Hugo](https://gohugo.io/) and hosted on [Netlify](https://www.netlify.com).

Check it out at [uk-dave.com](https://www.uk-dave.com).

```bash
# Install hugo and node
brew install hugo nodejs

# Install dependencies (bootstrap, postcss, etc)
hugo mod npm pack
npm install

# Run local server
hugo server --buildDrafts

# Build
hugo --gc --minify
```

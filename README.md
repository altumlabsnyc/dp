# Internal Molecule Database Website

This repository contains the internal website intended for the Mass Spec team of Altum Laboratories, Inc. to modify the molecule database through a more straight forward UI. Apart from editing, it also provides filtering functionalities for convenient row search.

## Deploy your own

**Note: This website has not been deployed yet**

The Vercel deployment will guide you through creating a Supabase account and project. After installation of the Supabase integration, all relevant environment variables will be set up so that the project is usable immediately after deployment 🚀

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&integration-ids=oac_jUduyjQgOyzev1fjrW83NYOv)

## How to use

1. Use `cd` to change into the app's directory
1. Run `npm install` to install dependencies
1. Get content of `.env.local` from Alex or Will. Alternatively, get `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api) and assign these two variable names with corresponding values.
1. Run `npm run dev` to start the local development server
1. Go to [the local host page](http://localhost:3000) to use the web app. Check your terminal message for which specific port to go to. If the above link doesn't work, go to `http://localhost:PORT_NUM` with `PORT_NUM` being the port number specified in the terminal.

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

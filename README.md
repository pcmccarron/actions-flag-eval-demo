# Using Flag Evaluations with GitHub Actions

This is a demo repository for testing LaunchDarkly's flag evaluations with GitHub Actions. The repository contains a PERN to-do application (Postgres, Express, React, Node) that can be deployed into a Kubernetes cluster.

## Secrets

For this demo to work you will need to set up the following GitHub Secrets

- **GH_TOKEN** - GitHub token for authenticating to GHCR.
- **LD_SDK_KEY** - SDK key for the LaunchDarkly project that you are using (server-side key).
- **VITE_LD_CLIENT_KEY** - Client side key from LaunchDarkly project, needed for in-app changes
- **KUBE_CONFIG** - We're using the Kubeconfig method for deployment, need this file saved in a secret (see The [Deploy Action](https://github.com/Azure/k8s-deploy) for more details)
- **AWS_ACCESS_KEY_ID** - Access token if you are using EKS and not using [IAM role](https://github.com/aws-actions/configure-aws-credentials#assumerole-with-static-iam-credentials-in-repository-secrets), otherwise use instructions for authentication with different hosted Kubernetes cluster (must be an accessible cluster)
- **AWS_SECRET_ACCESS_KEY** - Secret key if you are using EKS, update accordingly for the cluster you are using
- **LD_ACCESS_TOKEN** (optional) - Create an access token if you would like to use Code References (otherwise that action step will fail)

## How to set up

For this demo you will need the following environment:

1. A Kubernetes cluster (I used EKS, but any hosted will work)
2. A LaunchDarkly project
3. A GitHub Container image (the default is named `demo-app-dev-build` in the actions file, **must be created first**, I recommend using the Dockerfile in `./frontend` to create this first)
4. Update YAML files in `./application` with your images for API and Database (I included docker scripts to build them)
5. API, Database, and Nginx deployments in Kubernetes cluster (located in `./application`)

### Feature flags in code base

Code base has the following flags in it, if these don't existing in your LaunchDarkly project, you will likely get an error.

#### Flag evaluation flag

- Enable Builds
  flag-key: _gha-flag_
  type: string
  variations: dev-build, prod-build

#### Application flags

- Image Flag
  flag-key: _image_
  type: boolean
  variations: true, false

- Background
  flag-key: _background_
  type: string
  variations: ./ld-bg-purple.png, ./ld-bg-blue.png, ./ld-bg-red.png, ./ld-bg-gray.png

- Dark Mode
  flag-key: _darkMode_
  type: boolean
  variations: true, false

### How to run the demo

The way this is set up, when you push a change to the `main` branch an Action workflow will trigger that does three things: evaluates a LaunchDarkly flag, build a new Docker image for the frontend and push to GHRC.io repo, and deploy that image to your connected Kubernetes cluster. The other components should already be deployed if you want to see the app work, but the flags are all frontend changes.

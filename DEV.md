# Developer Guide

## Prerequisites
- Node.js 18.x (use `nvm install 18 && nvm use 18` if you use `nvm`)
- npm 8+ (ships with Node 18)
- AWS CLI v2 with access to account `300420735591`
- Amplify CLI (`npm install -g @aws-amplify/cli`)

## First-Time Setup
1. Install dependencies: `npm install`
2. Configure AWS credentials for the Amplify environments:
   - `aws configure` to create a profile with CloudFormation + Amplify permissions
   - Update `~/.aws/config` so you have profiles named `wilmington-dev` and `wilmington-prod` (or reuse existing names and adjust commands below)

## Sync Amplify Backend
- Dev: `amplify pull --appId ditvk4w1wchkx --envName dev --profile wilmington-dev`
- Prod: `amplify pull --appId ditvk4w1wchkx --envName prod --profile wilmington-prod`

The pull step generates `src/aws-exports.js` (git-ignored) and refreshes backend definitions under `amplify/backend`. Always commit any intentional changes inside `amplify/backend`.

## Local Development
- Start the app: `npm start` then open `http://localhost:3000`
- Run tests: `npm test`
- Lint (CRA default): `npm run lint` *(add if tooling is introduced)*
- When backend categories change (API, auth, storage), run `amplify status` to review updates before `amplify push`

## Deploy
1. Ensure backend changes are pushed:
   - Dev: `amplify push --envName dev --profile wilmington-dev`
   - Prod: `amplify push --envName prod --profile wilmington-prod`
2. Publish the frontend bundle:
   - Dev: `amplify publish --env dev --invalidate-cloudfront --profile wilmington-dev`
   - Prod: `amplify publish --env prod --invalidate-cloudfront --profile wilmington-prod`

`amplify publish` runs the `npm run build` step defined in `amplify/.config/project-config.json` and uploads the static assets to the Amplify hosting bucket + CloudFront distribution.

## Useful Checks
- `amplify status` – show pending backend operations
- `amplify console --env <env>` – open the Amplify Console for monitoring
- `npm run build` – generate a local production build

## Troubleshooting
- Missing `src/aws-exports.js` during local runs → rerun the appropriate `amplify pull`
- Permission errors with Amplify CLI → confirm the AWS profile you passed has CloudFormation + Amplify access and the environment ARN matches `team-provider-info.json`
- CloudFront cache issues after deploy → rerun `amplify publish` with `--invalidate-cloudfront`


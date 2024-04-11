#!/usr/bin/env node
import { getStage } from "@last-week/helpers/cdk";
import { App } from "aws-cdk-lib";
import "dotenv/config";
import { ArticleStack } from "../lib/stack";

const app = new App();

const stage = getStage();

new ArticleStack(app, `${stage}-last-week`);

#!/usr/bin/env node
import { getStage } from "@last-week/helpers/cdk";
import { App } from "aws-cdk-lib";
import "dotenv/config";
import { LastWeekStack } from "../lib/stack";

const app = new App();

const stage = getStage();

new LastWeekStack(app, `${stage}-last-week`);

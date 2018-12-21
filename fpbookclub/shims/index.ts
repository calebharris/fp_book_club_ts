/**
 * shims.ts - small utilities, type aliases, etc. to "fill in the gaps"
 */

import * as util from "util";

/**
 * The `InspectOptions` interface in the Node typings is missing the `stylize`
 * function.
 */
export interface Stylizer {
  stylize(s: string, style: string): string;
}

export type InspectOptions = util.InspectOptions & Stylizer;

// Temporary workaround for Next.js type generation that references
// `ResolvingMetadata` from "next/types.js" even though it isn't exported.
// This file augments the module to provide the missing type so that
// TypeScript can compile the generated `.next/dev/types` files.

export {};

declare module "next/types.js" {
  // You can refine this type later if you need strict typing.
  export type ResolvingMetadata = unknown;
}



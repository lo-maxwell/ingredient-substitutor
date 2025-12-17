# roadmap.md

# Ingredient Substitution Engine — MVP Roadmap

## Overview

A Next.js web app allowing users to find ingredient substitutions for baking recipes with LLM-generated explanations, while minimizing API usage through caching.

**Stack:**

* Next.js App Router + TypeScript
* TailwindCSS + Material UI
* Next.js API routes
* Static JSON for substitution list
* Redis for caching
* GPT for LLM explanations
* Deployed on Vercel

## MVP Scope

* User selects recipe type: `cake`, `cookie`, `bread`, `other`
* User selects ingredient to substitute
* User enters amount
* Optional dietary constraints
* Returns top substitution(s) with converted amounts
* Returns directional effects (e.g., less rise, spreads more)
* LLM-generated explanation (cached)
* No user accounts, images, or free-form recipe input

## Day-by-Day Roadmap

### Day 0: Architecture Planning

* Define folder structure, API route plan
* Design substitution JSON schema
* Plan caching with Redis and TTL (7 days)
* Draft LLM integration flow

### Day 1: Substitution Engine

* Create static JSON file with ~8–10 core ingredients and substitutes
* Implement deterministic rules-based lookup logic
* Filter by recipe type and dietary constraints
* Sort by confidence and return top substitutions

### Day 2: Web UI

* Create Next.js pages/components using Material UI + Tailwind
* Inputs: recipe type dropdown, ingredient dropdown, amount, dietary checkboxes
* Output section: substitution, converted amount, directional effects
* Loading and error states

### Day 3: LLM Integration

* Implement server-side call to GPT API for explanations
* Construct short, cost-efficient prompt
* Integrate response into output section
* Implement error handling and rate limits

### Day 4: Redis Caching

* Integrate Redis client (managed or local)
* Build deterministic cache key: `ingredient + substitute + recipeType + effects`
* Check Redis before LLM call
* Store explanation in Redis with TTL

### Day 5: Guardrails & Polish

* Validate input, reject unsupported combinations
* Ensure max 1 LLM call per request
* Add UX polish (loading indicators, directional arrows, clear warnings)

### Day 6 (Optional): Precompute Popular Explanations

* Generate LLM explanations offline for common substitutions
* Store in JSON or Redis to minimize runtime LLM usage

### Day 7: Deployment & Documentation

* Deploy on Vercel
* Test API routes and Redis cache
* Final README, architecture diagram, usage instructions

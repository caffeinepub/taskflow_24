# GlowTrack - Face Care App

## Current State
The project is a to-do list app (TaskFlow) with task management backend and frontend.

## Requested Changes (Diff)

### Add
- Skincare product manager (name, brand, category: cleanser/toner/serum/moisturizer/SPF/other, notes)
- Morning and evening routine builder (ordered steps referencing products)
- Daily skin journal (date, skin condition rating 1-5, notes, concerns)
- Tips section with curated skincare advice by skin type
- Dashboard showing today's routines and recent journal entries

### Modify
- Replace entire backend with face care data models
- Replace entire frontend with face care UI

### Remove
- All to-do/task related backend and frontend code

## Implementation Plan
1. Generate Motoko backend with Products, Routines, JournalEntries types and CRUD
2. Build React frontend with Dashboard, Products, Routines, SkinJournal, Tips pages
3. Mobile-friendly bottom navigation

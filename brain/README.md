# The VelNit Brain

This folder is the versioned source of truth for VelNit Life's Content
Operating System (Phase B) - the four foundational documents every piece of
AI-generated content is grounded in, plus the version-control files the
Knowledge Graph document (`05_Knowledge_Graph.md`, Section "Version Control
for Knowledge") calls for.

```
brain/
├── 02_VRIF.md              Relationship Intelligence Framework (theory)
├── 03_TALK_Model.md        The TALK Model (practice)
├── 04_Writing_DNA.md       Voice, principles, editorial charter
├── 05_Knowledge_Graph.md   Concepts, relationships, ontology (memory)
├── CHANGELOG.md
└── DECISIONS.md
```

**These files are the single source of truth.** `lib/ai/brain-content.generated.ts`
is compiled from them by `npm run generate:brain` (also run automatically
before `npm run build` via the `prebuild` script) and is what the AI provider
actually sends as system context when generating a draft. If you edit
anything in this folder, run `npm run generate:brain` and commit the
regenerated file alongside your change.

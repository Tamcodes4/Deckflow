# Ideas — saved for later

A scratch list of features we've talked through but parked. Add to this freely; promote out into a real spec or PR when one is being built.

## Template fill: user uploads their own PPTX/PDF

**Problem.** Colleges, agencies, and internal teams hand out a fixed template (with their logo, colors, page format) and expect you to drop your content into it without disturbing the design. Generic AI deck builders make a deck from scratch but can't honor an existing template.

**Plan, in phases.**

### Phase 1 — PPTX fill (planned, not started)
- Upload `.pptx`. The file is a zip of XML, so no OCR needed.
- Parse with `pizzip` + a small XML walker, list every text frame on every slide as `{ slideIdx, frameId, currentText, role }`.
- Show the user a brief input: "what is this deck about, what should each section say."
- AI returns a per-frame replacement plan. We re-emit the PPTX by editing only the text nodes in the original zip — logo, master slides, fonts, positions, animations, charts, all untouched.
- Output is a downloadable `.pptx` that looks 100% like the original template, but with the user's content.
- No canvas editor in this phase. Upload → brief → download.

### Phase 2 — Open the filled PPTX in our editor
- Render each slide using its existing layout (locked positions from the source XML).
- Let users fine-tune wording inline using the same `EditableText` we already have.
- "Reset to original template wording" button per slide.

### Phase 3 — PDF templates
- Editable PDFs: `pdfjs` to extract text + positions. AI swaps content; re-emit text layer.
- Scanned/image PDFs: render each page as a slide background image, OCR for context, treat AI text as overlay. User can drag/edit, export as PDF or PPTX.

**Open questions / watch-outs.**
- PPTX with master-slide inheritance: replacing text on a slide vs the master matters for layout reuse.
- Big files (embedded video, charts): only ship the text JSON to the model, never the binary.
- Charts and tables built from `<a:tbl>` need a separate handler — they're not just text frames.
- Privacy: people upload internal/confidential templates. Make it explicit that the file isn't stored unless they ask.
- Pricing: this is the kind of feature that justifies a paid tier on its own.

**Why it matters.**
- Solves a real, frequent pain (every student/intern in India has had this exact assignment).
- Differentiates from Canva and PowerPoint Copilot, neither of which fills user-supplied templates well.
- The PPTX path is buildable in a few days because `.pptx` is just zipped XML.

---

(Add new ideas below as they come up.)

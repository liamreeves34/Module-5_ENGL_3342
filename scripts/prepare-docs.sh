#!/usr/bin/env bash
# Copies the module PDFs into public/docs under stable names, publishes the resume with the
# phone number removed, and renders a first-page preview image for each into public/previews.
# Needs pdftoppm (poppler) and python3 with pypdf. Run from the repo root.
set -euo pipefail
S=Tech-com-site
mkdir -p public/docs public/previews
cp "$S/Module1/Email Conventions in Computer Science.pdf"                          public/docs/m1-email-conventions.pdf
cp "$S/Module2/Module-2_Project_Proposal.pdf"                                      public/docs/m2-proposal.pdf
cp "$S/Module2/Module-2_Containerizing_a_PyTorch_Digit_Classifier_in_Docker.pdf"   public/docs/m2-manual.pdf
cp "$S/Module3/Module-3_Problem_Proposal.pdf"                                      public/docs/m3-problem-proposal.pdf
cp "$S/Module3/Module-3_research_Liam_and_Gaby_ENGL_3342.pdf"                      public/docs/m3-report-draft.pdf
cp "$S/Module3/Module-3_Final_Report_Reeves_Saboia.pdf"                            public/docs/m3-final-report.pdf
cp "$S/Module3/Peer_Review_Feedback_Protocol_-_UTRGV_Parking.pdf"                  public/docs/m3-peer-review.pdf
cp "$S/Module4/AI_Workshop/Module-4_AI-Flyer.pdf"                                  public/docs/m4-ai-flyer.pdf
cp "$S/Module4/AI_Workshop/Module-4_Critical-AI-Literacy_Workshop.pdf"             public/docs/m4-ai-workshop.pdf
python3 scripts/redact-resume.py "$S/Module4/Resume_and_Cover_Letter/Module-4_Resume_and_Cover_Letter_Liam_Reeves.pdf" public/docs/m4-resume-cover-letter.pdf
for f in public/docs/*.pdf; do
  n=$(basename "$f" .pdf)
  pdftoppm -png -singlefile -f 1 -l 1 -scale-to-x 1100 -scale-to-y -1 "$f" "public/previews/$n"
done
ls -la public/docs public/previews

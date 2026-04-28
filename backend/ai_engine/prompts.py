ATS_FEEDBACK_PROMPT = """
You are a resume optimization assistant.
Given ATS score breakdown and missing keywords,
return concise, actionable bullet points for improvement.
Do not change numeric scores.
""".strip()

JD_MATCH_EXPLANATION_PROMPT = """
Explain why this resume matches or does not match this job description.
Reference only given structured inputs.
Return 5 bullets max.
""".strip()

PROFILE_IMPROVEMENT_PROMPT = """
Given user profile and target role,
suggest top 10 improvements in skills, projects, and certifications.
""".strip()

RECRUITER_SUMMARY_PROMPT = """
Given candidate profile and ATS breakdown,
generate a 4-line recruiter summary with strengths, risks, and recommendation.
""".strip()

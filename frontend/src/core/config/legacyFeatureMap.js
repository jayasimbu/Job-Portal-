export const legacyFeatureMap = {
  jobseeker: {
    insights: [
      'ai_job_recommendations_&_match_insights',
      'ai_match_reasoning_&_insights',
      'ai_recommendation_history_log',
      'job_details_&_match_breakdown',
    ],
    learning: ['ai-driven_course_recommendations', 'candidate_growth_&_learning_insights', 'external_course_&_learning_hub'],
    notifications: ['job_seeker_notification_center'],
  },
  employer: {
    analytics: ['hiring_analytics_&_reports_dashboard'],
    hiringPolicy: ['bias-free_hiring_policy_configuration'],
    interviews: ['interview_scheduling_calendar'],
    candidates: ['ai-powered_candidate_ranking', 'applicant_status_control_page', 'skill-only_evaluation_logic'],
  },
  admin: {
    analytics: ['user_skill_profiles', 'web_crawling', 'platform_system_status'],
  },
};

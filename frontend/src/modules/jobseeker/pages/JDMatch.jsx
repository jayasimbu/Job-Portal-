import React, { useState } from 'react';
import { useResume } from '../context/ResumeContext';
import { matchJd } from '../services/jobseekerService';
import { useToast } from '../../../core/context/ToastContext';

// Import Global UI Components
import Button from '../../../components/ui/Button';
import Card, { CardBody, CardHeader, CardFooter } from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { Heading, Text } from '../../../components/ui/Typography';

// Import Jobseeker Specific Components
import { 
  StatCard, 
  SkillChip, 
  ATSCircle, 
  SectionHeader, 
  ProgressBar 
} from '../components/DesignSystem';

const JDMatch = () => {
  const { resumeData } = useResume();
  const { showToast } = useToast();
  const [jdText, setJdText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const handleAnalyze = async () => {
    if (!jdText) {
      showToast("Please paste a Job Description first 📝");
      return;
    }
    if (!resumeData?.rawText) {
      showToast("Please upload your resume in the Dashboard first 📄");
      return;
    }

    setAnalyzing(true);
    try {
      const result = await matchJd({
        resume_text: resumeData.rawText,
        job_description: jdText
      });
      
      setMatchResult({
        matchPercentage: Math.round(result.ats_score || result.final_score || 0),
        matchedSkills: result.matched_keywords || [],
        missingSkills: result.missing_keywords || [],
        feedback: result.llm_enhanced_feedback
      });
      showToast("Intelligence analysis complete! 🎯");
    } catch (err) {
      console.error("Match analysis failed", err);
      showToast("Analysis failed ❌");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 sm:px-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Heading level={1}>Targeted JD Match</Heading>
          <Text variant="lead">Precision AI analysis against specific job requirements.</Text>
        </div>
        <Badge variant={resumeData?.rawText ? 'success' : 'danger'} className="h-fit">
          {resumeData?.rawText ? 'Resume Loaded' : 'Resume Missing'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[600px]">
        {/* LEFT: JOB DESCRIPTION */}
        <Card className="flex flex-col">
          <CardHeader>
            <SectionHeader title="Job Description" icon="description" />
          </CardHeader>
          <CardBody className="flex-1 flex flex-col space-y-6">
            <textarea 
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here (Responsibilities, Requirements, Skills)..."
              className="flex-1 w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-sm font-medium leading-relaxed"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={analyzing || !jdText}
              size="lg"
              className="w-full"
            >
              {analyzing ? (
                 <>
                    <div className="size-5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-3"></div>
                    Running AI Match Engine...
                 </>
              ) : (
                 <>
                    <span className="material-symbols-outlined mr-2">auto_awesome</span>
                    Start Intelligence Match
                 </>
              )}
            </Button>
          </CardBody>
        </Card>

        {/* RIGHT: RESUME ANALYSIS / QUEUE */}
        <Card className="flex flex-col">
          <CardHeader>
            <SectionHeader title="Intelligence Output" icon="psychology" />
          </CardHeader>
          <CardBody className="flex-1 overflow-y-auto custom-scrollbar">
            {matchResult ? (
              <div className="space-y-8">
                {/* Score Summary */}
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <Text variant="small" className="font-bold uppercase tracking-wider text-slate-500">Match Percentage</Text>
                    <Heading level={2} className="text-blue-600">{matchResult.matchPercentage}%</Heading>
                  </div>
                  <ATSCircle value={matchResult.matchPercentage} size={100} />
                </div>

                {/* AI Feedback */}
                <div className="space-y-3">
                   <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400">AI Strategic Feedback</Text>
                   <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                      <Text className="text-slate-700 italic font-medium leading-relaxed">
                        "{matchResult.feedback || "Your profile shows strong alignment with the core requirements. Focus on highlighting your technical leadership to stand out."}"
                      </Text>
                   </div>
                </div>

                {/* Skills Analysis */}
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400">Matched Skills</Text>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.matchedSkills.map((s, i) => <SkillChip key={i} label={s} variant="success" />)}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Text variant="small" className="font-bold uppercase tracking-widest text-slate-400">Missing Skills</Text>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.missingSkills.map((s, i) => <SkillChip key={i} label={s} variant="danger" />)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="size-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 border border-dashed border-slate-200">
                  <span className="material-symbols-outlined text-4xl">analytics</span>
                </div>
                <div className="space-y-2">
                  <Heading level={4}>Awaiting Input</Heading>
                  <Text variant="small" className="max-w-[240px]">Paste a job description on the left to begin the semantic analysis engine.</Text>
                </div>
              </div>
            )}
          </CardBody>
          {matchResult && (
            <CardFooter>
              <Button variant="secondary" className="w-full" onClick={() => window.print()}>
                <span className="material-symbols-outlined mr-2 text-sm">download</span>
                Export Report
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* BOTTOM: ANALYTICS GRID */}
      {matchResult && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card>
            <CardBody className="space-y-6">
              <StatCard label="Technical Fit" value={matchResult.matchPercentage} suffix="%" />
              <ProgressBar value={matchResult.matchPercentage} />
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-6">
              <StatCard label="Market Relevance" value={85} suffix="%" color="text-emerald-600" />
              <ProgressBar value={85} />
            </CardBody>
          </Card>
          <Card>
            <CardBody className="space-y-6">
              <StatCard label="Skill Density" value={Math.min(matchResult.matchedSkills.length * 12, 100)} suffix="%" color="text-blue-600" />
              <ProgressBar value={Math.min(matchResult.matchedSkills.length * 12, 100)} />
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default JDMatch;

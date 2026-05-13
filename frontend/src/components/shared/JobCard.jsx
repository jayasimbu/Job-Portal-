import React from 'react';
import { MapPin, Briefcase, DollarSign, Star, Bookmark, ExternalLink } from 'lucide-react';
import SkillBadge from './SkillBadge';

const JobCard = ({ 
  job = {}, 
  isRecommended = false, 
  matchScore = 0,
  onApply = () => {},
  onSave = () => {}
}) => {
  const {
    title = "Software Engineer",
    company = "TechCorp Solutions",
    location = "Remote",
    salary = "$80k - $120k",
    type = "Full-time",
    logo = null,
    matchedSkills = [],
    missingSkills = []
  } = job;

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-success bg-success/10 border-success/20';
    if (score >= 60) return 'text-warning bg-warning/10 border-warning/20';
    return 'text-danger bg-danger/10 border-danger/20';
  };

  return (
    <div className="card-hover p-5 flex flex-col md:flex-row gap-5 items-start md:items-center group">
      {/* Company Logo Section */}
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:border-primary/20 transition-colors shrink-0">
        {logo ? (
          <img src={logo} alt={company} className="w-10 h-10 object-contain" />
        ) : (
          <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
        )}
      </div>

      {/* Main Info Section */}
      <div className="flex-grow space-y-2 w-full">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="heading-md group-hover:text-primary transition-colors">{title}</h3>
            <p className="body-sm font-semibold text-gray-500">{company}</p>
          </div>
          
          {matchScore > 0 && (
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${getMatchColor(matchScore)}`}>
              <Star className="w-3.5 h-3.5 fill-current" />
              {matchScore}% Match
            </div>
          )}
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap gap-4 text-gray-400 body-sm font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            {type}
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            {salary}
          </div>
        </div>

        {/* Skills Logic */}
        {(matchedSkills.length > 0 || missingSkills.length > 0) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {matchedSkills.slice(0, 3).map(skill => (
              <SkillBadge key={skill} name={skill} type="success" />
            ))}
            {missingSkills.slice(0, 2).map(skill => (
              <SkillBadge key={skill} name={skill} type="default" />
            ))}
            {(matchedSkills.length + missingSkills.length) > 5 && (
              <span className="text-[10px] font-bold text-gray-400 self-center">
                +{(matchedSkills.length + missingSkills.length) - 5} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Section */}
      <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0">
        <button 
          onClick={onApply}
          className="btn-primary w-full md:w-32 py-2 text-sm"
        >
          Apply Now
        </button>
        <button 
          onClick={onSave}
          className="btn-secondary w-full md:w-32 py-2 text-sm group/save"
        >
          <Bookmark className="w-4 h-4 group-hover/save:fill-gray-400" />
          Save
        </button>
      </div>
    </div>
  );
};

export default JobCard;

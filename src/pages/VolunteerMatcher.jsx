import React, { useState } from 'react';
import NeedCard from '../components/NeedCard';
import VolunteerCard from '../components/VolunteerCard';
import { matchVolunteers } from '../lib/matchVolunteers';
import surveysData from '../data/surveys.json';
import volunteersData from '../data/volunteers.json';

const sortedNeeds = [...surveysData].sort((a, b) => b.urgency - a.urgency);

export default function VolunteerMatcher() {
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [matches, setMatches] = useState([]);
  const [assigned, setAssigned] = useState({});

  function handleSelect(survey) {
    setSelectedNeed(survey);
    setMatches(matchVolunteers(survey, volunteersData));
  }

  function handleAssign(volunteerId) {
    setAssigned((prev) => ({ ...prev, [volunteerId]: true }));
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 page-enter">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Volunteer Matcher</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Select a community need to find the best-matched volunteers.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left — Needs List */}
          <div className="lg:w-[42%] space-y-3">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Community Needs ({sortedNeeds.length})
            </h2>
            {sortedNeeds.map((survey) => (
              <NeedCard
                key={survey.id}
                survey={survey}
                isSelected={selectedNeed?.id === survey.id}
                onSelect={() => handleSelect(survey)}
              />
            ))}
          </div>

          {/* Right — Matched Volunteers */}
          <div className="lg:w-[58%]">
            {!selectedNeed ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-5xl mb-4">👈</span>
                <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg">Select a need</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                  Click any need on the left to find matching volunteers.
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                  <p className="font-bold text-slate-900 dark:text-white">
                    🤝 Matches for <span className="text-blue-600 dark:text-blue-400">{selectedNeed.village}</span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedNeed.need_type} · Urgency {selectedNeed.urgency}/10 · {selectedNeed.families} families
                  </p>
                </div>

                <div className="p-5 space-y-4">
                  {matches.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="text-4xl">😔</span>
                      <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium">
                        No matching volunteers found for this need.
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                        Try adding volunteers with relevant skills.
                      </p>
                    </div>
                  ) : (
                    matches.map((vol, i) => (
                      <div key={vol.id} style={{ animationDelay: `${i * 80}ms` }} className="animate-fade-in">
                        <VolunteerCard
                          volunteer={vol}
                          assigned={!!assigned[vol.id]}
                          onAssign={() => handleAssign(vol.id)}
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

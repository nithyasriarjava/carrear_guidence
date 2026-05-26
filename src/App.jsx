import { useState, useEffect } from 'react';
import { DEPARTMENT_OPTIONS, POPULAR_SKILLS, POPULAR_INTERESTS } from './data.js';

const SearchIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const HomeIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
const ArrowLeftIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>);
const CheckIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>);
const BookIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const VideoIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const CodeIcon = ({ className = "h-5 w-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>);



const App = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Student');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [knowSkills, setKnowSkills] = useState(true);

  const [aiMatches, setAiMatches] = useState([]);
  const [viewingCareerId, setViewingCareerId] = useState(null);
  const [currentView, setCurrentView] = useState('department');

  const saveCurrentProfile = (data) => {
    // Placeholder for profile saving logic from original app
    console.log('Profile saved:', data);
  };

  const generateDynamicMatches = async () => {
    setIsGenerating(true);
    setAiError('');

    try {

      const dept =
        selectedDepartment === 'Other'
          ? customDepartment
          : selectedDepartment;

      const status = selectedStatus || "Student";

      await new Promise(resolve => setTimeout(resolve, 1500));

      const roleDatabase = [

        {
          name: "Frontend Developer",
          description: "Build websites and user interfaces.",
          skills: ["HTML", "CSS", "JavaScript", "React"],
          interests: ["Web Development", "UI/UX"],
          department: ["BCA", "Computer Science", "B.E CSE"],

          roadmap: [
            "Learn HTML/CSS",
            "Learn JavaScript",
            "Learn React",
            "Build Portfolio"
          ]
        },

        {
          name: "Backend Developer",
          description: "Build APIs and server systems.",
          skills: ["Python", "Java", "NodeJS", "SQL", "FastAPI"],
          interests: ["Web Development"],
          department: ["BCA", "Computer Science", "B.E CSE"],

          roadmap: [
            "Learn backend language",
            "Database basics",
            "API development",
            "Deploy projects"
          ]
        },

        {
          name: "Full Stack Developer",
          description: "Work on frontend and backend systems.",
          skills: ["HTML", "CSS", "JavaScript", "React", "NodeJS"],
          interests: ["Web Development"],
          department: ["BCA", "Computer Science"],

          roadmap: [
            "Frontend",
            "Backend",
            "Databases",
            "Deployment"
          ]
        },

        {
          name: "AI Engineer",
          description: "Develop AI and ML systems.",
          skills: ["Python", "Machine Learning", "AI"],
          interests: ["Artificial Intelligence", "Data Science"],
          department: ["BCA", "Computer Science"],

          roadmap: [
            "Python",
            "Math basics",
            "Machine Learning",
            "Deep Learning"
          ]
        },

        {
          name: "Data Scientist",
          description: "Analyze and process large data.",
          skills: ["Python", "SQL", "Pandas"],
          interests: ["Data Science"],
          department: ["BCA", "Computer Science"],

          roadmap: [
            "Python",
            "Statistics",
            "Pandas",
            "Projects"
          ]
        },

        {
          name: "Cyber Security Analyst",
          description: "Protect systems from attacks.",
          skills: ["Networking", "Linux", "Python"],
          interests: ["Cyber Security"],
          department: ["BCA", "Computer Science"],

          roadmap: [
            "Networking",
            "Linux",
            "Ethical Hacking",
            "Security Tools"
          ]
        },

        {
          name: "Business Analyst",
          description: "Analyze business data.",
          skills: ["Excel", "SQL"],
          interests: ["Business", "Data"],
          department: ["Commerce", "BBA", "BCA"],

          roadmap: [
            "Excel",
            "SQL",
            "Power BI",
            "Case Studies"
          ]
        }

      ];



      let parsed = [];

      roleDatabase.forEach((role, index) => {

        let score = 0;

        selectedSkills.forEach(skill => {

          if (
            role.skills.some(
              s => s.toLowerCase() === skill.toLowerCase()
            )
          ) {
            score += 25;
          }

        });


        selectedInterests.forEach(interest => {

          if (
            role.interests.some(
              i => i.toLowerCase() === interest.toLowerCase()
            )
          ) {
            score += 20;
          }

        });


        if (
          role.department.some(
            d => d.toLowerCase() === dept.toLowerCase()
          )
        ) {
          score += 20;
        }


        if (knowSkills === false) {
          score += 15;
        }


        if (score >= 40) {

          parsed.push({

            id: `role-${index}-${Date.now()}`,

            name: role.name,

            description: role.description,

            salary: "₹4,00,000 - ₹18,00,000 /yr",

            jobDemand: "High",

            difficulty:
              score > 80
                ? "Advanced"
                : score > 60
                  ? "Intermediate"
                  : "Beginner",

            growth: "25% YoY",

            matchScore: score,

            whyItMatches:
              `Recommended because of your skills (${selectedSkills.join(", ") || "None"}) and interests (${selectedInterests.join(", ") || "None"}).`,

            detailedRole:
              `As a ${role.name}, you will work on industry projects and develop strong practical experience.`,

            careerGrowthPath:
              "Junior → Mid-Level → Senior → Tech Lead",

            requiredSkills: role.skills,

            roadmap: {
              skills: role.roadmap.map((step, i) => ({

                id: `skill-${i}`,

                title: step,

                description: `Learn ${step}`,

                importance: "Required",

                resources: {
                  beginnerVideo: "https://youtube.com",
                  fullCourse: "https://youtube.com",
                  w3schools: "https://w3schools.com",
                  officialDocs: "https://developer.mozilla.org",
                  practiceSite: "https://hackerrank.com"
                }

              })),

              projects: [

                {

                  title: `${role.name} Project`,

                  description:
                    `Build a practical project for ${role.name}`,

                  milestones: [

                    "Plan",
                    "Develop",
                    "Deploy"

                  ]

                }

              ]

            }

          });

        }

      });



      parsed.sort(
        (a, b) => b.matchScore - a.matchScore
      );



      if (parsed.length === 0) {

        parsed = [{

          id: "default1",

          name: "General Technology Associate",

          description:
            "Recommended based on department",

          salary: "₹3,00,000 - ₹8,00,000 /yr",

          jobDemand: "Medium",

          difficulty: "Beginner",

          growth: "15% YoY",

          matchScore: 50,

          whyItMatches:
            `Recommended because you belong to ${dept}`,

          detailedRole:
            `Good starting role.`,

          careerGrowthPath:
            "Junior → Mid-Level → Senior",

          requiredSkills: [
            "Communication",
            "Problem Solving"
          ],

          roadmap: {
            skills: [],
            projects: []
          }

        }];

      }



      setAiMatches(parsed);
      setCurrentView('results');

      saveCurrentProfile({
        aiMatches: parsed
      });

      if (parsed.length > 0) {

        setViewingCareerId(parsed[0].id);

        saveCurrentProfile({
          viewingCareerId: parsed[0].id
        });

      }

    }

    catch (error) {

      console.log(error);

      setAiError(
        "Dynamic recommendation generation failed"
      );

    }

    finally {

      setIsGenerating(false);

    }

  };

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1
          className="text-3xl font-bold text-[#00D2C4] cursor-pointer inline-block"
          onClick={() => setCurrentView('department')}
        >
          Career Discovery
        </h1>

        {currentView === 'department' && (
          <div className="bg-[#0B192C] p-6 rounded-xl space-y-6 shadow-lg animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white mb-4">Step 1: Choose Your Department</h2>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#17B890]">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full bg-[#1E3E62] p-3 rounded-lg text-white border-none outline-none focus:ring-2 focus:ring-[#00D2C4]"
              >
                {DEPARTMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            {selectedDepartment === 'Other' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-[#17B890]">Custom Department</label>
                <input
                  type="text"
                  value={customDepartment}
                  onChange={(e) => setCustomDepartment(e.target.value)}
                  className="w-full bg-[#1E3E62] p-3 rounded-lg text-white border-none outline-none focus:ring-2 focus:ring-[#00D2C4]"
                  placeholder="e.g. Graphic Design"
                />
              </div>
            )}
            <div className="flex justify-end pt-4">
              <button onClick={() => setCurrentView('skills')} className="px-6 py-2 bg-[#00D2C4] text-[#0B192C] font-bold rounded-lg hover:opacity-90 transition-opacity">
                Next Step →
              </button>
            </div>
          </div>
        )}

        {currentView === 'skills' && (
          <div className="bg-[#0B192C] p-6 rounded-xl space-y-6 shadow-lg animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white mb-4">Step 2: Select Your Skills</h2>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#17B890]">Skills</label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      if (selectedSkills.includes(skill)) {
                        setSelectedSkills(selectedSkills.filter(s => s !== skill));
                      } else {
                        setSelectedSkills([...selectedSkills, skill]);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${selectedSkills.includes(skill) ? 'bg-[#00D2C4] text-[#0B192C] font-bold' : 'bg-[#1E3E62] text-white hover:bg-[#00D2C4]/20'}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setCurrentView('department')} className="px-6 py-2 bg-[#1E3E62] text-white font-bold rounded-lg hover:bg-opacity-80 transition-opacity cursor-pointer">
                ← Back
              </button>
              <button onClick={() => setCurrentView('interests')} className="px-6 py-2 bg-[#00D2C4] text-[#0B192C] font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
                Next Step →
              </button>
            </div>
          </div>
        )}

        {currentView === 'interests' && (
          <div className="bg-[#0B192C] p-6 rounded-xl space-y-6 shadow-lg animate-in fade-in duration-300">
            <h2 className="text-xl font-bold text-white mb-4">Step 3: Choose Your Interests</h2>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#17B890]">Interests</label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => {
                      if (selectedInterests.includes(interest)) {
                        setSelectedInterests(selectedInterests.filter(i => i !== interest));
                      } else {
                        setSelectedInterests([...selectedInterests, interest]);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${selectedInterests.includes(interest) ? 'bg-[#17B890] text-[#0B192C] font-bold' : 'bg-[#1E3E62] text-white hover:bg-[#17B890]/20'}`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <button onClick={() => setCurrentView('skills')} className="px-6 py-2 bg-[#1E3E62] text-white font-bold rounded-lg hover:bg-opacity-80 transition-opacity cursor-pointer">
                ← Back
              </button>
              <button
                onClick={generateDynamicMatches}
                disabled={isGenerating}
                className="px-6 py-2 bg-gradient-to-r from-[#00D2C4] to-[#17B890] text-[#0B192C] font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              >
                {isGenerating ? 'Analyzing...' : 'Discover Careers'}
              </button>
            </div>
            {aiError && <p className="text-red-400 mt-2 text-sm text-center">{aiError}</p>}
          </div>
        )}

        {currentView === 'results' && aiMatches.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-[#00D2C4]">Your AI Career Matches</h2>
              <button
                onClick={() => setCurrentView('department')}
                className="px-4 py-2 bg-[#1E3E62] text-white text-sm font-medium rounded-lg hover:bg-[#00D2C4]/20 transition-colors cursor-pointer"
              >
                ← Start Over
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {aiMatches.map(match => (
                <div
                  key={match.id}
                  className={`p-6 rounded-xl cursor-pointer transition-all shadow-lg ${viewingCareerId === match.id ? 'bg-[#1E3E62] ring-2 ring-[#00D2C4] md:col-span-2' : 'bg-[#0B192C] hover:bg-[#1E3E62]/70'}`}
                  onClick={() => setViewingCareerId(viewingCareerId === match.id ? null : match.id)}
                >
                  <h3 className="text-xl font-bold text-white">{match.name}</h3>
                  <p className="text-[#00D2C4] font-medium mt-1">{match.matchScore}% Match Rate</p>
                  <p className={`text-gray-400 text-sm mt-3 ${viewingCareerId === match.id ? '' : 'line-clamp-2'}`}>{match.description}</p>

                  {viewingCareerId === match.id && (
                    <div className="mt-6 pt-6 border-t border-[#1E3E62] space-y-6 text-sm text-gray-300">

                      {/* Fast Facts Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="bg-[#0B192C] p-4 rounded-lg border border-[#1E3E62]">
                          <span className="text-gray-400 block mb-1 uppercase tracking-wider">Salary</span>
                          <span className="text-white font-medium text-sm">{match.salary}</span>
                        </div>
                        <div className="bg-[#0B192C] p-4 rounded-lg border border-[#1E3E62]">
                          <span className="text-gray-400 block mb-1 uppercase tracking-wider">Job Demand</span>
                          <span className="text-white font-medium text-sm">{match.jobDemand}</span>
                        </div>
                        <div className="bg-[#0B192C] p-4 rounded-lg border border-[#1E3E62]">
                          <span className="text-gray-400 block mb-1 uppercase tracking-wider">Growth</span>
                          <span className="text-white font-medium text-sm">{match.growth}</span>
                        </div>
                        <div className="bg-[#0B192C] p-4 rounded-lg border border-[#1E3E62]">
                          <span className="text-gray-400 block mb-1 uppercase tracking-wider">Difficulty</span>
                          <span className="text-white font-medium text-sm">{match.difficulty}</span>
                        </div>
                      </div>

                      {/* Descriptions */}
                      <div className="space-y-4">
                        <div>
                          <strong className="text-white text-base">Why it matches:</strong>
                          <p className="mt-1 leading-relaxed">{match.whyItMatches}</p>
                        </div>
                        <div>
                          <strong className="text-white text-base">Detailed Role:</strong>
                          <p className="mt-1 leading-relaxed">{match.detailedRole}</p>
                        </div>
                        <div>
                          <strong className="text-white text-base">Career Path:</strong>
                          <p className="mt-1 text-[#00D2C4] font-medium">{match.careerGrowthPath}</p>
                        </div>
                        <div>
                          <strong className="text-white text-base">Required Skills:</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {match.requiredSkills.map(s => (
                              <span key={s} className="bg-[#0B192C] px-3 py-1.5 rounded-md text-xs font-medium border border-[#1E3E62] text-[#17B890]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Learning Roadmap */}
                      {match.roadmap && (
                        <div className="mt-8 space-y-6">
                          <h4 className="text-xl font-bold text-white border-b border-[#1E3E62] pb-2">Learning Roadmap</h4>

                          {match.roadmap.skills && match.roadmap.skills.length > 0 && (
                            <div>
                              <strong className="text-[#00D2C4] block mb-3 text-base">Key Topics to Learn</strong>
                              <div className="grid gap-3 md:grid-cols-2">
                                {match.roadmap.skills.map((skill, idx) => (
                                  <div key={idx} className="bg-[#0B192C] p-4 rounded-lg border border-[#1E3E62]">
                                    <span className="font-bold text-white text-base block">{skill.title}</span>
                                    <span className="text-gray-400 mt-1 block">{skill.description}</span>
                                    {skill.resources && (
                                      <div className="mt-3 pt-3 border-t border-[#1E3E62] flex gap-3 flex-wrap">
                                        {Object.entries(skill.resources).map(([k, v]) => (
                                          <a key={k} href={v} target="_blank" rel="noreferrer" className="text-xs text-[#17B890] hover:text-[#00D2C4] transition-colors flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                            {k}
                                          </a>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {match.roadmap.projects && match.roadmap.projects.length > 0 && (
                            <div>
                              <strong className="text-[#00D2C4] block mb-3 text-base">Practice Projects</strong>
                              <div className="grid gap-3 md:grid-cols-2">
                                {match.roadmap.projects.map((proj, idx) => (
                                  <div key={idx} className="bg-[#0B192C] p-4 rounded-lg border border-[#1E3E62]">
                                    <span className="font-bold text-white text-base block">{proj.title}</span>
                                    <span className="text-gray-400 mt-1 block">{proj.description}</span>
                                    {proj.milestones && (
                                      <div className="mt-3 text-xs text-gray-500 font-mono bg-black/20 p-2 rounded">
                                        Milestones: {proj.milestones.join(' → ')}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
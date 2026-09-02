import { FileText, PieChart, FileType } from 'lucide-react';

// ==========================================
// 🧑‍🤝‍🧑 TEAM MEMBERS DATA
// Edit this list to update the people on the Team page
// ==========================================
export const teamMembers = [
  { 
    name: 'Sarah Jenkins', 
    role: 'Captain & Mechanical Lead', 
    desc: 'Handles overall CAD design and CNC toolpaths.', 
    initials: 'SJ', 
    color: 'bg-blue-100 text-blue-700' 
  },
  { 
    name: 'David Lin', 
    role: 'Electronics & Safety', 
    desc: 'Designs power delivery systems and fail-safes.', 
    initials: 'DL', 
    color: 'bg-amber-100 text-amber-700' 
  },
  { 
    name: 'Mia Washington', 
    role: 'Programming Lead', 
    desc: 'Writes the control logic and autonomous routines.', 
    initials: 'MW', 
    color: 'bg-emerald-100 text-emerald-700' 
  },
  { 
    name: 'James Carter', 
    role: 'Media & Webmaster', 
    desc: 'Manages the website, social media, and challenge documentation.', 
    initials: 'JC', 
    color: 'bg-purple-100 text-purple-700' 
  },
];

// ==========================================
// 📝 BLOG POSTS DATA
// Edit this list to update the Season Journey blog
// ==========================================
export const blogPosts = [
  {
    id: 1,
    title: 'Machining the Flex-Core',
    date: 'February 28, 2026',
    author: 'Sarah J. - Mechanical',
    excerpt: 'This week we finally got time on the HAAS CNC to mill our bottom plate. Learning G-Code on the fly was stressful, but seeing the part come out perfect made it worth it.',
    tags: ['Manufacturing', 'CNC']
  },
  {
    id: 2,
    title: 'The Great Magic Smoke Incident',
    date: 'February 14, 2026',
    author: 'David L. - Electronics',
    excerpt: 'A harsh lesson in reverse polarity. We plugged the 6S battery into the weapon ESC backward. Fortunately, we had spares, but we have now standardized XT90 connectors everywhere to prevent this.',
    tags: ['Failure Analysis', 'Wiring']
  },
  {
    id: 3,
    title: 'First Autonomous Drive',
    date: 'January 30, 2026',
    author: 'Mia W. - Programming',
    excerpt: 'The PID loop finally works! Watching the bot drive a perfect 2-meter square without human input was incredible. Next step: integrating the IR sensors.',
    tags: ['Software', 'Testing']
  }
];

// ==========================================
// 🎯 CHALLENGES TIMELINE
// Edit this list to update your checkpoints and statuses
// ==========================================
export const challengesTimeline = [
  { 
    id: 1, 
    date: 'Oct 15, 2025', 
    title: 'Challenge 1: Design Proposal', 
    status: 'completed',
    desc: 'Submit initial CAD designs and engineering strategy.',
    file: 'Team_Apex_Design_Proposal.pdf'
  },
  { 
    id: 2, 
    date: 'Dec 10, 2025', 
    title: 'Challenge 2: Subsystem Testing', 
    status: 'completed',
    desc: 'Video proof of weapon spin-up and drive base mobility.',
    file: 'Subsystem_Report.pdf'
  },
  { 
    id: 3, 
    date: 'Feb 20, 2026', 
    title: 'Challenge 3: Safety Inspection', 
    status: 'current',
    desc: 'Complete electrical safety checklist and fail-safe demonstrations.',
    file: null
  },
  { 
    id: 4, 
    date: 'April 5, 2026', 
    title: 'Final Submission: Engineering Binder', 
    status: 'upcoming',
    desc: 'Comprehensive documentation of the entire build process.',
    file: null
  },
];

// ==========================================
// 📁 RESOURCES
// Edit this list to change the available downloads
// ==========================================
export const resourcesList = [
  { name: 'Final Engineering Binder (PDF)', size: '14.2 MB', type: 'document', icon: FileText },
  { name: 'NRL Match Rules & Regulations', size: '2.1 MB', type: 'document', icon: FileText },
  { name: 'Battery Safety Revision Sheet', size: '1.4 MB', type: 'chart', icon: PieChart },
  { name: 'Wiring & Port Assignment Chart', size: '3.5 MB', type: 'chart', icon: FileType },
  { name: 'Pre-Match Checklist', size: '0.8 MB', type: 'document', icon: FileText },
];

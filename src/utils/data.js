import {
  FiTrash2, FiAward, FiMap, FiBell, FiActivity, FiCpu,
  FiUsers, FiTarget, FiNavigation, FiHeart,
} from 'react-icons/fi';



export const heroImages = [
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1600&q=60',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=60',
  'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1600&q=60',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=60',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=60',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=60',
];

export const heroCards = [
  { icon: '🏆', label: 'Rewards Earned', value: '124K' },
  { icon: '🌱', label: 'Trees Planted', value: '5,240' },
  { icon: '🗑️', label: 'Waste Reported', value: '18,900' },
  { icon: '👥', label: 'Community', value: '98K+' },
];

export const features = [
  { icon: FiTrash2, title: 'Garbage Reporting', desc: 'Snap, tag, and report waste hotspots in seconds with geo-location.' },
  { icon: FiTarget, title: 'Community Challenges', desc: 'Team up on weekly missions that transform neighbourhoods.' },
  { icon: FiAward, title: 'Rewards System', desc: 'Convert civic points into real gift cards, coupons & badges.' },
  { icon: FiActivity, title: 'Live Leaderboard', desc: 'Climb the ranks and see your city-wide impact in real time.' },
  { icon: FiNavigation, title: 'Real-Time Tracking', desc: 'Follow every report from submission to resolution.' },
  { icon: FiCpu, title: 'AI Verification', desc: 'Smart image recognition validates reports instantly.' },
  { icon: FiBell, title: 'Smart Notifications', desc: 'Get nudged about nearby missions & reward drops.' },
  { icon: FiMap, title: 'Nearby Reports', desc: 'Discover what needs fixing around you on a live map.' },
  { icon: FiUsers, title: 'Volunteer Teams', desc: 'Create squads, invite friends, and win together.' },
  { icon: FiHeart, title: 'Impact Dashboard', desc: 'Visualise the change you personally created.' },
];

export const steps = [
  { n: '01', title: 'Spot & Report', desc: 'See an issue? Capture it in the app with one tap.', image: "/images/report.png" },
  { n: '02', title: 'Take Action', desc: 'Join challenges and complete civic missions.', image: "/images/challenge.png" },
  { n: '03', title: 'Get Verified', desc: 'AI + community confirm your contribution.', image: "/images/verify.png" },
  { n: '04', title: 'Earn Rewards', desc: 'Collect points, badges and real-world perks.', image: "/images/reward.png" },
];

export const stats = [
  { value: 10000, suffix: '+', label: 'Reports Submitted' },
  { value: 5000, suffix: '+', label: 'Trees Planted' },
  { value: 2500, suffix: '+', label: 'Challenges Completed' },
  { value: 100000, suffix: '+', label: 'Reward Points Earned' },
];

export const CHALLENGE_CATEGORIES = ['Cleanup', 'Tree Planting', 'Recycling', 'Restoration', 'Community', 'App Engagement'];
export const CHALLENGE_MODES = ['Solo', 'Group'];

export const challenges = [
  {
    id: 'clean-surroundings',
    title: 'Clean your own surroundings',
    points: 20,
    difficulty: 'Easy',
    image: '/images/challenges/clean-surroundings.jpg',
    progress: 0,
    category: 'Cleanup',
    mode: 'Solo',
  },
  {
    id: 'litter-10',
    title: 'Pick up 10 pieces of litter',
    points: 25,
    difficulty: 'Easy',
    image: '/images/challenges/litter-10.jpg',
    progress: 0,
    category: 'Cleanup',
    mode: 'Solo',
  },
  {
    id: 'dispose-correct-bins',
    title: 'Dispose waste in correct bins',
    points: 15,
    difficulty: 'Easy',
    image: '/images/challenges/dispose-correct-bins.jpg',
    progress: 0,
    category: 'Cleanup',
    mode: 'Solo',
  },
  {
    id: 'plant-1-tree',
    title: 'Plant 1 tree',
    points: 30,
    difficulty: 'Easy',
    image: '/images/challenges/plant-1-tree.jpg',
    progress: 0,
    category: 'Tree Planting',
    mode: 'Solo',
  },
  {
    id: 'care-tree-1-month',
    title: 'Take care of a planted tree for 1 month',
    points: 50,
    difficulty: 'Easy',
    image: '/images/challenges/care-tree-1-month.jpg',
    progress: 0,
    category: 'Tree Planting',
    mode: 'Solo',
  },
  {
    id: 'plant-10-trees',
    title: 'Plant 10 trees',
    points: 350,
    difficulty: 'Medium',
    image: '/images/challenges/plant-10-trees.jpg',
    progress: 0,
    category: 'Tree Planting',
    mode: 'Group',
  },
  {
    id: 'plant-50-trees',
    title: 'Plant 50 trees',
    points: 2000,
    difficulty: 'Hard',
    image: '/images/challenges/plant-50-trees.jpg',
    progress: 0,
    category: 'Tree Planting',
    mode: 'Group',
  },
  {
    id: 'plant-100-trees',
    title: 'Plant 100 trees',
    points: 5000,
    difficulty: 'Hard',
    image: '/images/challenges/plant-100-trees.jpg',
    progress: 0,
    category: 'Tree Planting',
    mode: 'Group',
  },
  {
    id: 'small-cleanup-drive',
    title: 'Small garbage collection drive',
    points: 200,
    difficulty: 'Medium',
    image: '/images/challenges/small-cleanup-drive.jpg',
    progress: 0,
    category: 'Cleanup',
    mode: 'Group',
  },
  {
    id: 'medium-cleanup-drive',
    title: 'Medium garbage collection drive',
    points: 600,
    difficulty: 'Medium',
    image: '/images/challenges/medium-cleanup-drive.jpg',
    progress: 0,
    category: 'Cleanup',
    mode: 'Group',
  },
  {
    id: 'large-community-cleanup',
    title: 'Large community cleanup',
    points: 1500,
    difficulty: 'Hard',
    image: '/images/challenges/large-community-cleanup.jpg',
    progress: 0,
    category: 'Cleanup',
    mode: 'Group',
  },
  {
    id: 'join-recycling-marathon',
    title: 'Join Recycling Marathon',
    points: 150,
    difficulty: 'Easy',
    image: '/images/challenges/join-recycling-marathon.jpg',
    progress: 0,
    category: 'Recycling',
    mode: 'Group',
  },
  {
    id: 'complete-recycling-marathon',
    title: 'Complete Recycling Marathon',
    points: 350,
    difficulty: 'Medium',
    image: '/images/challenges/complete-recycling-marathon.jpg',
    progress: 0,
    category: 'Recycling',
    mode: 'Group',
  },
  {
    id: 'recycle-5kg',
    title: 'Recycle 5 kg Waste',
    points: 120,
    difficulty: 'Easy',
    image: '/images/challenges/recycle-5kg.jpg',
    progress: 0,
    category: 'Recycling',
    mode: 'Solo',
  },
  {
    id: 'recycle-20kg',
    title: 'Recycle 20 kg Waste',
    points: 500,
    difficulty: 'Medium',
    image: '/images/challenges/recycle-20kg.jpg',
    progress: 0,
    category: 'Recycling',
    mode: 'Solo',
  },
  {
    id: 'river-restoration-participate',
    title: 'Participate in River Restoration',
    points: 500,
    difficulty: 'Medium',
    image: '/images/challenges/river-restoration-participate.jpg',
    progress: 0,
    category: 'Restoration',
    mode: 'Group',
  },
  {
    id: 'river-restoration-organize',
    title: 'Organize River Restoration',
    points: 1200,
    difficulty: 'Hard',
    image: '/images/challenges/river-restoration-organize.jpg',
    progress: 0,
    category: 'Restoration',
    mode: 'Group',
  },
  {
    id: 'street-art-participate',
    title: 'Street Art Revival',
    points: 250,
    difficulty: 'Easy',
    image: '/images/challenges/street-art-participate.jpg',
    progress: 0,
    category: 'Community',
    mode: 'Group',
  },
  {
    id: 'street-art-lead',
    title: 'Lead Street Art Project',
    points: 700,
    difficulty: 'Hard',
    image: '/images/challenges/street-art-lead.jpg',
    progress: 0,
    category: 'Community',
    mode: 'Group',
  },
  {
    id: 'solar-awareness-volunteer',
    title: 'Solar Awareness Volunteer',
    points: 250,
    difficulty: 'Easy',
    image: '/images/challenges/solar-awareness-volunteer.jpg',
    progress: 0,
    category: 'Community',
    mode: 'Group',
  },
  {
    id: 'solar-awareness-organize',
    title: 'Organize Solar Awareness',
    points: 600,
    difficulty: 'Medium',
    image: '/images/challenges/solar-awareness-organize.jpg',
    progress: 0,
    category: 'Community',
    mode: 'Group',
  },
  {
    id: 'environmental-workshop',
    title: 'Environmental Workshop',
    points: 700,
    difficulty: 'Hard',
    image: '/images/challenges/environmental-workshop.jpg',
    progress: 0,
    category: 'Community',
    mode: 'Group',
  },
  {
    id: 'invite-friend-task',
    title: 'Invite a Friend',
    points: 75,
    difficulty: 'Easy',
    image: '/images/challenges/invite-friend-task.jpg',
    progress: 0,
    category: 'App Engagement',
    mode: 'Solo',
  },
  {
    id: 'eco-streak-7day',
    title: '7 Day Eco Streak',
    points: 150,
    difficulty: 'Easy',
    image: '/images/challenges/eco-streak-7day.jpg',
    progress: 0,
    category: 'App Engagement',
    mode: 'Solo',
  },
  {
    id: 'eco-streak-30day',
    title: '30 Day Eco Streak',
    points: 700,
    difficulty: 'Hard',
    image: '/images/challenges/eco-streak-30day.jpg',
    progress: 0,
    category: 'App Engagement',
    mode: 'Solo',
  },
];
export const leaders = [
  { name: 'Aarav Mehta', points: 9840, avatar: 'https://i.pravatar.cc/150?img=12', rank: 2 },
  { name: 'Sofia Reyes', points: 12500, avatar: 'https://i.pravatar.cc/150?img=45', rank: 1 },
  { name: 'Liam Chen', points: 8620, avatar: 'https://i.pravatar.cc/150?img=33', rank: 3 },
];

export const leaderList = [
  { name: 'Noah Patel', points: 7890, avatar: 'https://i.pravatar.cc/150?img=15' },
  { name: 'Emma Silva', points: 7210, avatar: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Kai Nakamura', points: 6980, avatar: 'https://i.pravatar.cc/150?img=8' },
  { name: 'Zara Khan', points: 6540, avatar: 'https://i.pravatar.cc/150?img=32' },
  { name: 'Diego Torres', points: 6120, avatar: 'https://i.pravatar.cc/150?img=51' },
];

export const rewards = [
  // Tier 1
  {
    id: 1,
    tier: "Tier 1",
    title: "30-Minute Yulu / Smart City e-Bike Unlock",
    desc: "Free 30-minute unlock for Smart City / Yulu e-Bikes.",
    points: 150,
    cost: "150 CP",
    image: "/images/reward/yulu-bike.jpg"
  },
  {
    id: 2,
    tier: "Tier 1",
    title: "1-Hour Smart Parking",
    desc: "Free parking at a municipal smart parking zone.",
    points: 250,
    cost: "250 CP",
    image: "/images/reward/smart-parking.jpg"
  },
  {
    id: 3,
    tier: "Tier 1",
    title: "20% Cafe discount",
    desc: "20% discount at Starbucks.",
    points: 300,
    cost: "300 CP",
    image: "/images/reward/cafe-discount.jpg"
  },
  {
    id: 4,
    tier: "Tier 1",
    title: "Bus / Metro Ticket",
    desc: "Single journey local bus or metro token.",
    points: 400,
    cost: "400 CP",
    image: "/images/reward/bus-metro-ticket.jpg"
  },

  // Tier 2
  {
    id: 5,
    tier: "Tier 2",
    title: "10% Dining Coupon",
    desc: "10% discount at a partner restaurant.",
    points: 500,
    cost: "500 CP",
    image: "/images/reward/dining-coupon.jpg"
  },
  {
    id: 6,
    tier: "Tier 2",
    title: "Water Bill Discount",
    desc: "₹75 discount on water / waste collection bill.",
    points: 750,
    cost: "750 CP",
    image: "/images/reward/water-bill.jpg"
  },
  {
    id: 7,
    tier: "Tier 2",
    title: "Urban Gardening Kit",
    desc: "Free home seed / gardening starter kit.",
    points: 1000,
    cost: "1000 CP",
    image: "/images/reward/gardening-kit.jpg"
  },
  {
    id: 8,
    tier: "Tier 2",
    title: "Grocery Voucher",
    desc: "₹120 grocery market voucher.",
    points: 1200,
    cost: "1200 CP",
    image: "/images/reward/grocery-voucher.jpg"
  },

  // Tier 3
  {
    id: 9,
    tier: "Tier 3",
    title: "1-Week Transit Pass",
    desc: "Unlimited local bus or metro pass.",
    points: 1500,
    cost: "1500 CP",
    image: "/images/reward/transit-pass.jpg"
  },
  {
    id: 10,
    tier: "Tier 3",
    title: "EV Charging Credit",
    desc: "₹200 EV charging credit.",
    points: 2000,
    cost: "2000 CP",
    image: "/images/reward/ev-charging.jpg"
  },
  {
    id: 11,
    tier: "Tier 3",
    title: "Electricity Bill Discount",
    desc: "₹300 electricity bill discount.",
    points: 3000,
    cost: "3000 CP",
    image: "/images/reward/electricity-bill.jpg"
  },
  {
    id: 12,
    tier: "Tier 3",
    title: "VIP Municipal Fast Track",
    desc: "Priority municipal service requests.",
    points: 4000,
    value: "VIP",
    cost: "4000 CP",
    image: "/images/reward/vip-fast-track.jpg"
  },

  // Tier 4
  {
    id: 13,
    tier: "Tier 4",
    title: "5% Property Tax Rebate",
    desc: "5% rebate on annual property tax.",
    points: 5000,
    cost: "5000 CP",
    image: "/images/reward/property-tax-5.jpg"
  },
  {
    id: 14,
    tier: "Tier 4",
    title: "Public Tree Recognition",
    desc: "Your name engraved on a public park tree.",
    points: 7500,
    cost: "7500 CP",
    image: "/images/reward/tree-recognition.jpg"
  },
  {
    id: 15,
    tier: "Tier 4",
    title: "10% Property Tax Rebate",
    desc: "10% property tax rebate.",
    points: 10000,
    cost: "10000 CP",
    image: "/images/reward/property-tax-10.jpg"
  },
  {
    id: 16,
    tier: "Tier 4",
    title: "Mayor's Civic Award",
    desc: "Annual civic recognition with community grant.",
    points: 50000,
    cost: "50000 CP",
    image: "/images/reward/mayors-award.jpg"
  }
];

export const gallery = [
  { img: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=600&q=80', title: 'Beach Clean-Up', h: 'tall' },
  { img: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=600&q=80', title: 'Tree Plantation', h: 'short' },
  { img: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=600&q=80', title: 'Green City', h: 'short' },
  { img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=600&q=80', title: 'Volunteers Unite', h: 'tall' },
  { img: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=600&q=80', title: 'Recycling Drive', h: 'tall' },
  { img: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=600&q=80', title: 'Community Care', h: 'short' },
  { img: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80', title: 'Urban Gardens', h: 'short' },
  { img: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80', title: 'Happy Citizens', h: 'tall' },
];

export const testimonials = [
  { name: 'Aryan Trivedi', role: 'Volunteer', avatar: 'https://i.pravatar.cc/150?img=25', text: 'CivicPlay turned my weekends into meaningful missions. I earned rewards while cleaning my own neighbourhood!' },
  { name: 'Vidhi Patel', role: 'Student', avatar: 'https://i.pravatar.cc/150?img=44', text: 'I never thought reporting garbage could be this satisfying. The AI verification is lightning fast.' },
  { name: 'Aryan Prajapati', role: 'Team Lead', avatar: 'https://i.pravatar.cc/150?img=13', text: 'The gamification is genius. My whole office now competes on the leaderboard for a greener city.' },
  { name: 'Daksh Gauswami', role: 'City Official', avatar: 'https://i.pravatar.cc/150?img=52', text: 'Since adopting CivicPlay, citizen reports increased 4x. It is transforming how our city responds.' },
];

export const faqs = [
  { q: 'How do I earn reward points?', a: 'You earn points by reporting civic issues, completing challenges, and getting your contributions verified by our AI and community.' },
  { q: 'Is CivicPlay free to use?', a: 'Yes! CivicPlay is completely free for citizens. Cities and organisations partner with us to fund the rewards.' },
  { q: 'How does AI verification work?', a: 'Our computer-vision model analyses your submitted photos to confirm the reported issue, then routes it to the right authority.' },
  { q: 'Can I create a volunteer team?', a: 'Absolutely. Invite friends, form squads, and climb the team leaderboard together for bigger rewards.' },
  { q: 'Which cities are supported?', a: 'We are live in 40+ cities and expanding fast. Join the waitlist to bring CivicPlay to your city.' },
];

export const trustedLogos = ['GreenGov', 'EcoCity', 'UrbanNet', 'CleanFuture', 'MetroLink', 'BioSphere'];

export const timeline = [
  { title: 'The Idea', desc: 'Born from a hackathon to make civic action addictive.' },
  { title: 'First City', desc: 'Launched pilot with 5,000 active citizens.' },
  { title: 'AI Verification', desc: 'Introduced smart image recognition at scale.' },
  { title: '40+ Cities', desc: 'Expanded across the country with 98K+ users.' },
  { title: 'Global Vision', desc: 'Building the world’s largest civic engagement network.' },
];
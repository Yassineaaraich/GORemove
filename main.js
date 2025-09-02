// script-index.js
// List of posts: filename and title
const posts = [
  {file: "budget_travel_hacks.md", title:"Budget Travel Hacks"},
  {file: "building_your_online_presence.md", title:"Building Your Online Presence"},
  {file: "creating_your_oasis.md", title:"Creating Your Oasis"},
  {file: "culinary_journeys.md", title:"Culinary Journeys"},
  {file: "declutter_your_life.md", title:"Declutter Your Life"},
  {file: "digital_detox.md", title:"Digital Detox"},
  {file: "diy_home_improvement_projects.md", title:"DIY Home Improvement Projects"},
  {file: "exploring_national_parks.md", title:"Exploring National Parks"},
  {file: "first_time_homebuyers_handbook.md", title:"First-time Homebuyer's Handbook"},
  {file: "healthy_habits_that_stick.md", title:"Healthy Habits That Stick"},
  {file: "mastering_productivity_tools.md", title:"Mastering Productivity Tools"},
  {file: "maximizing_small_spaces.md", title:"Maximizing Small Spaces"},
  {file: "navigating_your_career_path.md", title:"Navigating Your Career Path"},
  {file: "online_security_essentials.md", title:"Online Security Essentials"},
  {file: "personal_finance_101.md", title:"Personal Finance 101"},
  {file: "retirement_planning_made_simple.md", title:"Retirement Planning Made Simple"},
  {file: "road_trip_adventures.md", title:"Road Trip Adventures"},
  {file: "smart_spending_habits.md", title:"Smart Spending Habits"},
  {file: "sustainable_living_at_home.md", title:"Sustainable Living at Home"},
  {file: "the_art_of_mindful_living.md", title:"The Art of Mindful Living"},
  {file: "the_gig_economy_explained.md", title:"The Gig Economy Explained"},
  {file: "the_joys_of_staycations.md", title:"The Joys of Staycations"},
  {file: "the_power_of_hobbies.md", title:"The Power of Hobbies"},
  {file: "understanding_ai.md", title:"Understanding AI"},
  {file: "unlocking_your_potential.md", title:"Unlocking Your Potential"}
];

const listEl = document.getElementById('list');

posts.forEach(p => {
  const card = document.createElement('a');
  card.className = 'card';
  card.href = `post.html?post=${encodeURIComponent(p.file)}`;
  card.innerHTML = `
    <h3>${p.title}</h3>
    <p>Open full article — click to read in a clean reading view.</p>
    <div class="meta"><span>${p.file}</span><span>Read →</span></div>
  `;
  listEl.appendChild(card);
});

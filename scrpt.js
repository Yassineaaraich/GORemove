// script-post.js

// allowed list - same as index
const allowed = [
  "budget_travel_hacks.md",
  "building_your_online_presence.md",
  "creating_your_oasis.md",
  "culinary_journeys.md",
  "declutter_your_life.md",
  "digital_detox.md",
  "diy_home_improvement_projects.md",
  "exploring_national_parks.md",
  "first_time_homebuyers_handbook.md",
  "healthy_habits_that_stick.md",
  "mastering_productivity_tools.md",
  "maximizing_small_spaces.md",
  "navigating_your_career_path.md",
  "online_security_essentials.md",
  "personal_finance_101.md",
  "retirement_planning_made_simple.md",
  "road_trip_adventures.md",
  "smart_spending_habits.md",
  "sustainable_living_at_home.md",
  "the_art_of_mindful_living.md",
  "the_gig_economy_explained.md",
  "the_joys_of_staycations.md",
  "the_power_of_hobbies.md",
  "understanding_ai.md",
  "unlocking_your_potential.md"
];

function qs(name){
  return new URLSearchParams(location.search).get(name);
}

const file = qs('post');
const titleEl = document.getElementById('post-title');
const subEl = document.getElementById('post-sub');
const contentEl = document.getElementById('content');
const metaEl = document.getElementById('post-meta');

if(!file || !allowed.includes(file)){
  titleEl.textContent = "Post not found";
  contentEl.innerHTML = `<p style="color:var(--muted)">The requested file is missing or not allowed.</p>`;
} else {
  metaEl.textContent = file;
  fetch('posts/' + file)
    .then(r=>{
      if(!r.ok) throw new Error('Network error');
      return r.text();
    })
    .then(md=>{
      // set title from first heading if available
      const firstLine = md.split(/\r?\n/).find(l=>l.trim().length>0);
      let candidateTitle = null;
      if(firstLine && firstLine.startsWith('#')){
        candidateTitle = firstLine.replace(/^#+\s*/,'').trim();
      }
      titleEl.textContent = candidateTitle || file.replace(/_/g,' ').replace('.md','');
      subEl.textContent = `Rendered from ${file} • ${estimateReadingTime(md)} min read`;
      contentEl.innerHTML = markdownToHtml(md);
      // optional: scroll to top
      window.scrollTo(0,0);
    })
    .catch(err=>{
      titleEl.textContent = "Error loading post";
      contentEl.innerHTML = `<p style="color:var(--muted)">${err.message}</p>`;
    });
}

// simple reading time estimate
function estimateReadingTime(text){
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/* ===== very small Markdown -> HTML renderer (basic) =====
 Supports:
  - headings (# ... ####)
  - code blocks fenced with ``` (language ignored)
  - inline code `code`
  - bold **text** and italic *text*
  - links [text](url)
  - images ![alt](url)
  - unordered lists starting with - or * 
  - ordered lists starting with 1. 2. ...
  - paragraphs
 This is intentionally small and works for typical blog MD.
 For full CommonMark support, swap in a library like "marked" on server/build.
*/
function markdownToHtml(md){
  // Normalize CRLF
  md = md.replace(/\r\n/g, '\n');

  // Escape HTML first (so user HTML in MD is not executed)
  function escapeHtml(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // extract code blocks
  const codeBlocks = [];
  md = md.replace(/```([\s\S]*?)```/g, function(_, code){
    codeBlocks.push(code);
    return `\n\n<pre>@@CODE${codeBlocks.length-1}@@</pre>\n\n`;
  });

  // block processing by lines
  const lines = md.split('\n');
  let out = [];
  let inList = false;
  let listType = null; // 'ul' or 'ol'

  function closeList(){
    if(inList){
      out.push(`</${listType}>`);
      inList = false;
      listType = null;
    }
  }

  for(let i=0;i<lines.length;i++){
    let line = lines[i];

    // heading
    if(/^#{1,6}\s/.test(line)){
      closeList();
      const m = line.match(/^(#{1,6})\s+(.*)/);
      const level = m[1].length;
      out.push(`<h${level}>${inlineFormatting(m[2])}</h${level}>`);
      continue;
    }

    // image
    if(/!\[.*\]\(.*\)/.test(line)){
      closeList();
      out.push(`<p>${inlineFormatting(line)}</p>`);
      continue;
    }

    // unordered list
    if(/^\s*[-*]\s+/.test(line)){
      const item = line.replace(/^\s*[-*]\s+/, '');
      if(!inList){
        inList = true; listType = 'ul';
        out.push(`<ul>`);
      } else if(listType !== 'ul'){
        closeList();
        inList = true; listType = 'ul';
        out.push(`<ul>`);
      }
      out.push(`<li>${inlineFormatting(item)}</li>`);
      continue;
    }

    // ordered list
    if(/^\s*\d+\.\s+/.test(line)){
      const item = line.replace(/^\s*\d+\.\s+/, '');
      if(!inList){
        inList = true; listType = 'ol';
        out.push(`<ol>`);
      } else if(listType !== 'ol'){
        closeList();
        inList = true; listType = 'ol';
        out.push(`<ol>`);
      }
      out.push(`<li>${inlineFormatting(item)}</li>`);
      continue;
    }

    // blank
    if(/^\s*$/.test(line)){
      closeList();
      continue;
    }

    // normal paragraph
    closeList();
    out.push(`<p>${inlineFormatting(line)}</p>`);
  }

  closeList();

  // restore code blocks
  let html = out.join('\n');
  html = html.replace(/<pre>@@CODE(\d+)@@<\/pre>/g, function(_, idx){
    const raw = escapeHtml(codeBlocks[Number(idx)]);
    return `<pre><code>${raw}</code></pre>`;
  });

  return html;
}

// inline formatting: bold, italic, links, inline code, images
function inlineFormatting(text){
  // escape HTML special chars then apply inline transforms
  text = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // images ![alt](url)
  text = text.replace(/!\[([^\]]*?)\]\(([^)]+)\)/g, `<img src="$2" alt="$1">`);

  // links [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>`);

  // inline code `code`
  text = text.replace(/`([^`]+)`/g, `<code>$1</code>`);

  // bold **text** or __text__
  text = text.replace(/\*\*([^*]+)\*\*/g, `<strong>$1</strong>`);
  text = text.replace(/__([^_]+)__/g, `<strong>$1</strong>`);

  // italic *text* or _text_
  text = text.replace(/(^|[^*])\*([^*]+)\*([^*]|$)/g, function(m,p1,p2,p3){ return p1 + `<em>${p2}</em>` + p3;});
  text = text.replace(/(^|[^_])_([^_]+)_([^_]|$)/g, function(m,p1,p2,p3){ return p1 + `<em>${p2}</em>` + p3;});

  return text;
}

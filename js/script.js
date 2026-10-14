"use strict";
document.addEventListener("DOMContentLoaded", function () {
 setupThemeToggle();
 loadPortfolio();
 setupContactForm();
 setupBackToTop();
});

// Built-in fallback data to guarantee projects & skills load offline or locally without CORS issues
const fallbackPortfolioData = {
 "name": "Allan Dingcog",
 "tagline": "Aspiring Web Developer",
 "introduction": "I am an IT student interested in web development and useful digital solutions.",
 "profileImage": "images/profile.jpg",
 "about": {
  "biography": "I enjoy learning programming, exploring technology, and developing practical applications.",
  "school": "Nueva Vizcaya State University",
  "program": "Bachelor of Science in Information Technology",
  "graduation": "Expected graduation: 2027",
  "careerGoal": "To become a professional software developer and network specialist.",
  "interests": "Web development, databases, UI design, and problem solving."
 },
 "skills": ["HTML", "CSS", "JavaScript", "Java", "MySQL", "Problem Solving", "Networking", "Troubleshooting"],
 "projects": [
  {
   "title": "Personal Portfolio",
   "description": "A responsive website presenting my profile, skills, and academic work.",
   "technologies": "HTML, CSS, JavaScript",
   "role": "Designed and developed the website.",
   "image": "images/portfolio.png",
   "link": "https://github.com/allsdingcog/personalportfolio.git"
  }
 
 "githubUsername": "allsdingcog",
 "contact": {
  "email": "alls.dingcog@gmail.com",
  "location": "Nueva Vizcaya, Philippines",
  "linkedin": "https://www.linkedin.com/"
 }
};

function setupThemeToggle() {
 const toggleBtn = document.getElementById("themeToggle");
 const htmlElement = document.documentElement;
 
 const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
 htmlElement.setAttribute("data-theme", savedTheme);
 toggleBtn.textContent = savedTheme === "dark" ? "☀️" : "🌙";

 toggleBtn.addEventListener("click", function () {
  const currentTheme = htmlElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("portfolio_theme", newTheme);
  toggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
 });
}

async function loadPortfolio() {
 const projectsMessage = document.getElementById("projectsMessage");
 let data = fallbackPortfolioData;

 try {
  const response = await fetch("data/projects.json");
  if (response.ok) {
   data = await response.json();
  }
 } catch (error) {
  console.warn("Using fallback portfolio data due to fetch error/CORS restriction:", error);
 }

 // Render data
 try {
  document.getElementById("studentName").textContent = data.name;
  document.getElementById("tagline").textContent = data.tagline;
  document.getElementById("introduction").textContent = data.introduction;
  
  const profileImg = document.getElementById("profileImage");
  if (profileImg && data.profileImage) {
   profileImg.src = data.profileImage;
  }

  document.getElementById("biography").textContent = data.about.biography;
  document.getElementById("education").textContent =
   data.about.program + " - " + data.about.school;
  document.getElementById("graduation").textContent = data.about.graduation;
  document.getElementById("careerGoal").textContent = data.about.careerGoal;
  document.getElementById("interests").textContent = data.about.interests;
  document.getElementById("contactEmail").textContent = data.contact.email;
  document.getElementById("contactEmail").href = "mailto:" + data.contact.email;
  document.getElementById("contactLocation").textContent =
   "Location: " + data.contact.location;
  document.getElementById("linkedinLink").href = data.contact.linkedin;
  document.getElementById("footerText").textContent =
   "\u00A9 " + new Date().getFullYear() + " " + data.name + " | Student Portfolio";
   
  displaySkills(data.skills);
  displayProjects(data.projects);
  loadGitHubRepositories(data.githubUsername);
 } catch (renderError) {
  console.error("Rendering error:", renderError);
  projectsMessage.textContent = "Error rendering portfolio components.";
 }
}

function displaySkills(skills) {
 const container = document.getElementById("skillsContainer");
 if (!container) return;
 container.replaceChildren();
 skills.forEach(function (skill) {
  const card = document.createElement("div");
  card.className = "skill-card";
  card.textContent = skill;
  container.appendChild(card);
 });
}

function displayProjects(projects) {
 const container = document.getElementById("projectsContainer");
 const message = document.getElementById("projectsMessage");
 if (!container) return;
 container.replaceChildren();
 if (!Array.isArray(projects) || projects.length === 0) {
  message.textContent = "No projects are available at the moment.";
  return;
 }
 message.textContent = "";
 projects.forEach(function (project) {
  const card = document.createElement("article");
  card.className = "project-card";
  
  const image = document.createElement("img");
  image.src = project.image || "images/portfolio.png";
  image.alt = "Screenshot of " + project.title;
  image.loading = "lazy";
  
  const content = document.createElement("div");
  content.className = "project-content";
  
  const title = document.createElement("h3");
  title.textContent = project.title;
  
  const description = document.createElement("p");
  description.textContent = project.description;
  
  const technologies = document.createElement("p");
  technologies.className = "project-tech";
  technologies.textContent = "Technologies: " + project.technologies;
  
  const role = document.createElement("p");
  role.textContent = "My Role: " + project.role;

  content.append(title, description, technologies, role);
  if (project.link) {
   const link = document.createElement("a");
   link.href = project.link;
   link.textContent = "View Project";
   link.className = "project-link";
   link.target = "_blank";
   link.rel = "noopener noreferrer";
   content.appendChild(link);
  }
  card.append(image, content);
  container.appendChild(card);
 });
}

async function loadGitHubRepositories(username) {
 const container = document.getElementById("githubRepos");
 const message = document.getElementById("githubMessage");
 const profileLink = document.getElementById("githubProfile");
 if (!container) return;
 container.replaceChildren();
 
 if (!username || username === "yourusername") {
  message.textContent = "Update githubUsername in projects.json to your actual username.";
  return;
 }
 profileLink.href = "https://github.com/" + encodeURIComponent(username);
 try {
  const apiURL = "https://api.github.com/users/" +
   encodeURIComponent(username) +
   "/repos?sort=updated&per_page=5&type=public";
  const response = await fetch(apiURL);
  if (!response.ok) throw new Error("GitHub API request failed");
  const repositories = await response.json();
  if (repositories.length === 0) {
   message.textContent = "No public repositories were found.";
   return;
  }
  message.textContent = "";
  repositories.forEach(function (repo) {
   const item = document.createElement("li");
   const link = document.createElement("a");
   link.href = repo.html_url;
   link.textContent = repo.name;
   link.target = "_blank";
   link.rel = "noopener noreferrer";
   
   const language = document.createElement("p");
   language.className = "repository-language";
   language.textContent = "Main language: " + (repo.language || "Not specified");
   
   item.append(link, language);
   container.appendChild(item);
  });
 } catch (error) {
  console.error("GitHub API error:", error);
  message.textContent = "GitHub repositories are unavailable or rate-limited.";
 }
}

function setupContactForm() {
 const form = document.getElementById("contactForm");
 const feedback = document.getElementById("formFeedback");
 if (!form) return;
 form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!form.checkValidity()) {
   form.reportValidity();
   feedback.textContent = "Please complete all fields correctly.";
   return;
  }
  const visitorName = document.getElementById("visitorName").value.trim();
  const visitorMessage = document.getElementById("visitorMessage").value.trim();
  if (visitorName.length < 2 || visitorMessage.length < 10) {
   feedback.textContent = "Enter a valid name and a message of at least 10 characters.";
   return;
  }
  feedback.textContent = "Thank you, " + visitorName +
   "! Your form passed validation. No message was sent because this is a static website.";
  form.reset();
 });
}

function setupBackToTop() {
 const button = document.getElementById("backToTop");
 if (!button) return;
 window.addEventListener("scroll", function () {
  button.classList.toggle("visible", window.scrollY > 300);
 });
 button.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
 });
}

const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  origin: "bottom",
  distance: "50px",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content h2", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 1500,
});
ScrollReveal().reveal(".header__btn", {
  ...scrollRevealOption,
  delay: 2000,
});

ScrollReveal().reveal(".about__image img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".about__content .section__header", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".about__content p", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".about__btn", {
  ...scrollRevealOption,
  delay: 1500,
});

ScrollReveal().reveal(".service__card", {
  duration: 1000,
  interval: 500,
});

ScrollReveal().reveal(".facility__content .section__header", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".facility__content p", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".mentor__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".banner__content h2", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".banner__content p", {
  ...scrollRevealOption,
  delay: 500,
});
// Mobile menu
menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("nav__links--open");
});

// -------------------------------
// DASHBOARD FEATURE FUNCTIONALITY
// -------------------------------

// Dashboard container creation
const dashboardPage = document.createElement("div");
dashboardPage.id = "dashboardPage";
dashboardPage.style.display = "none";
dashboardPage.style.padding = "40px";
dashboardPage.innerHTML = `
    <button id="backBtn" style="
      padding:10px 20px; 
      background:#111; 
      color:#fff; 
      border:none; 
      border-radius:5px; 
      margin-bottom:20px;
      cursor:pointer;
      ">⬅ Back</button>

    <h2 id="dashboardTitle" style="font-size:32px; margin-bottom:20px;"></h2>
    <p id="dashboardContent" style="font-size:18px; line-height:1.6;"></p>
`;
document.body.appendChild(dashboardPage);

// Dashboard data for each card
const topics = [
  { title: "Workout Categories", desc: "Strength, cardio, yoga, HIIT, flexibility" },
  { title: "Exercise Library", desc: "With images/videos and instructions" },
  { title: "Schedule Builder", desc: "Weekly planner with rest days" },
  { title: "Track daily activity", desc: "Workout completion logs" },
  { title: "Mood", desc: "Mood and energy levels" },
  { title: "Fitness Inputs", desc: "Sleep duration and water intake" },
  { title: "Meal Plans", desc: "Based on calorie goals, dietary preferences" },
  { title: "Recipe Suggestions", desc: "Based on ingredients & dietary needs" },
  { title: "Macronutrient Breakdown", desc: "Proteins, carbs, fats" },
  { title: "Custom Habits", desc: "Build consistency in wellness routines" },
  { title: "Progress Visuals", desc: "Track improvement and growth" }
];

// Attach click events to all popular cards
const cards = document.querySelectorAll(".popular__card");

cards.forEach((card, index) => {
  card.style.cursor = "pointer";
  
  card.addEventListener("click", () => {
    openDashboard(index);
  });
});

// Open dashboard
function openDashboard(index) {
  document.querySelector("header").style.display = "none";
  document.querySelector(".about").style.display = "none";
  document.querySelector(".service").style.display = "none";
  document.querySelector(".popular").style.display = "none";
  document.querySelector(".facility__container").style.display = "none";
  document.querySelector(".mentor__container").style.display = "none";
  document.querySelector(".banner").style.display = "none";
  document.querySelector(".footer").style.display = "none";

  dashboardPage.style.display = "block";

  document.getElementById("dashboardTitle").innerText = topics[index].title;
  document.getElementById("dashboardContent").innerText =
    "This is the dashboard for " + topics[index].title + 
    ". Add charts, stats, or tools here as needed.";
}

// Back button
document.getElementById("backBtn").addEventListener("click", () => {
  document.querySelector("header").style.display = "block";
  document.querySelector(".about").style.display = "block";
  document.querySelector(".service").style.display = "block";
  document.querySelector(".popular").style.display = "block";
  document.querySelector(".facility__container").style.display = "flex";
  document.querySelector(".mentor__container").style.display = "block";
  document.querySelector(".banner").style.display = "flex";
  document.querySelector(".footer").style.display = "block";

  dashboardPage.style.display = "none";
});

import { HomePage } from './pages/HomePage.js';
import { AboutPage } from './pages/AboutPage.js';
import { SkillsPage } from './pages/SkillsPage.js';
import { InteractivePage } from './pages/InteractivePage.js';
import { ContactsPage } from './pages/ContactsPage.js';

const pageMap = {
    'index.html': HomePage,
    '': HomePage,
    'about.html': AboutPage,
    'skills.html': SkillsPage,
    'interactive.html': InteractivePage,
    'contacts.html': ContactsPage
};

const currentPage = window.location.pathname.split('/').pop();
const PageClass = pageMap[currentPage] || HomePage;
const page = new PageClass();

page.init();
window.__pomStarted = true;

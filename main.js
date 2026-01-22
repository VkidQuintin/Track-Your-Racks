// Hamburger Menu Toggle
const hamburgerBtn = document.getElementById('hamburger-btn');
const menuPane = document.getElementById('menu-pane');
const menuOverlay = document.getElementById('menu-overlay');
const closeMenuBtn = document.getElementById('close-menu');
const sidebar = document.querySelector('.sidebar');

hamburgerBtn.addEventListener('click', () => {
    menuPane.classList.add('open');
    menuOverlay.classList.add('active');
});

closeMenuBtn.addEventListener('click', () => {
    menuPane.classList.remove('open');
    menuOverlay.classList.remove('active');
});

menuOverlay.addEventListener('click', () => {
    menuPane.classList.remove('open');
    menuOverlay.classList.remove('active');
});

// Mobile Responsive Sidebar Toggle
function toggleSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        if (!hamburgerBtn.dataset.sidebarMode) {
            hamburgerBtn.dataset.sidebarMode = 'true';
            hamburgerBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
            
            menuOverlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        }
    }
}

window.addEventListener('resize', toggleSidebarOnMobile);
toggleSidebarOnMobile();

// Generate Matrix
document.getElementById('generate-btn').addEventListener('click', () => {
    const income = document.getElementById('monthly-income').value;
    const matrixSection = document.getElementById('matrix-section');
    const gridContainer = document.getElementById('grid-container');
    const recText = document.getElementById('recommendation-text');
    const tipsSection = document.getElementById('tips-section');
    const suggestionSection = document.getElementById('suggestion-section');
    const tipsText = document.getElementById('tips-text');
    const suggestionText = document.getElementById('suggestion-text');

    if (!income || income <= 0) {
        alert("Please enter your earnings to start!");
        return;
    }

    // Logic: Suggest saving 10% of income spread over 20 boxes
    const targetSavings = income * 0.10;
    recText.innerText = `Goal: Save R${targetSavings.toFixed(2)} this month (10% of earnings)`;

    // Generate tips
    const tips = [
        "Start with small amounts. Every R50 counts!",
        "Track your progress daily for motivation.",
        "Set a weekly savings goal to stay on track.",
        "Celebrate small wins along the way!"
    ];
    tipsText.innerText = tips[Math.floor(Math.random() * tips.length)];
    tipsSection.classList.remove('hidden');

    // Generate suggestions
    const suggestions = [
        "Cut one unnecessary expense this month.",
        "Use your savings for an emergency fund.",
        "Challenge friends to a savings competition!",
        "Automate your savings for consistency."
    ];
    suggestionText.innerText = suggestions[Math.floor(Math.random() * suggestions.length)];
    suggestionSection.classList.remove('hidden');

    // Clear previous grid
    gridContainer.innerHTML = '';
    matrixSection.classList.remove('hidden');

    // Generate 20 incremental boxes
    for (let i = 1; i <= 20; i++) {
        const amount = (targetSavings / 20) + (i - 10);
        const box = document.createElement('div');
        box.className = 'box';
        box.innerText = `R${Math.max(1, Math.round(amount))}`;
        
        box.addEventListener('click', () => {
            box.classList.toggle('checked');
        });

        gridContainer.appendChild(box);
    }
});
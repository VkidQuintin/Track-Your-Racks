// Hamburger Menu Toggle
const hamburgerBtn = document.getElementById('hamburger-btn');
const menuPane = document.getElementById('menu-pane');
const menuOverlay = document.getElementById('menu-overlay');
const closeMenuBtn = document.getElementById('close-menu');
const sidebar = document.querySelector('.sidebar');
const collapseBtn = document.getElementById('collapse-btn');

// Collapse/Expand Sidebar
collapseBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    // Update collapse button icon
    collapseBtn.innerText = sidebar.classList.contains('collapsed') ? '›' : '‹';
});

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

// Update earnings note and suggested goal when frequency or earnings change
function updateEarningsInfo() {
    const frequency = document.querySelector('input[name="payment-frequency"]:checked').value;
    const earnings = parseFloat(document.getElementById('earnings-amount').value);
    const earningsNote = document.getElementById('earnings-note');
    
    if (earnings > 0) {
        const frequencyText = frequency === 'weekly' ? 'weekly' : 'monthly';
        earningsNote.innerText = `You earn R${earnings.toFixed(2)} ${frequencyText}`;
        
        const suggestedGoal = (earnings * 0.10).toFixed(2);
        document.getElementById('suggested-goal').innerText = `Suggested: R${suggestedGoal} (10% of earnings)`;
        document.getElementById('savings-goal').placeholder = `e.g. ${Math.round(suggestedGoal)}`;
    }
}

// Payment frequency change
document.querySelectorAll('input[name="payment-frequency"]').forEach(radio => {
    radio.addEventListener('change', updateEarningsInfo);
});

// Earnings amount change
document.getElementById('earnings-amount').addEventListener('change', updateEarningsInfo);

// Savings goal change - suggest period
document.getElementById('savings-goal').addEventListener('change', (e) => {
    const goal = parseFloat(e.target.value);
    if (goal > 0) {
        const suggestedPeriod = 30;
        document.getElementById('suggested-period').innerText = `Suggested: ${suggestedPeriod} days (or leave blank)`;
        document.getElementById('goal-period').placeholder = `e.g. ${suggestedPeriod}`;
    }
});

// Confetti animation function
function triggerConfetti() {
    const confettiCount = 100;
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = ['#00ff88', '#ff006e', '#ffbe0b', '#8338ec', '#3a86ff'][Math.floor(Math.random() * 5)];
        confetti.style.animation = `fall ${2.5 + Math.random() * 1.5}s linear forwards`;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4500);
    }
}

// Global variable to track total savings and goal
let totalSavings = 0;
let totalBoxes = 0;
let goalAmount = 0;

// Update progress display
function updateProgressDisplay() {
    const savedAmountEl = document.getElementById('saved-amount');
    const progressBar = document.getElementById('progress-bar');
    const progressPercent = document.getElementById('progress-percent');
    
    if (savedAmountEl && goalAmount > 0) {
        savedAmountEl.innerText = `R${totalSavings.toFixed(2)}`;
        const percentage = Math.min(100, (totalSavings / goalAmount) * 100);
        progressBar.style.width = percentage + '%';
        progressPercent.innerText = Math.round(percentage) + '%';
    }
}

// Show congratulations modal
function showCongratsModal(savings) {
    const modal = document.getElementById('congrats-modal');
    const goalText = modal.querySelector('.modal-goal-text');
    goalText.innerText = `You saved R${savings.toFixed(2)}!`;
    modal.classList.remove('hidden');
    triggerConfetti();
}

// Close modal
document.getElementById('modal-close-btn').addEventListener('click', () => {
    document.getElementById('congrats-modal').classList.add('hidden');
});

// Generate Matrix
document.getElementById('generate-btn').addEventListener('click', () => {
    const frequency = document.querySelector('input[name="payment-frequency"]:checked').value;
    const earnings = parseFloat(document.getElementById('earnings-amount').value);
    const savingsGoal = parseFloat(document.getElementById('savings-goal').value);
    const goalPeriodInput = document.getElementById('goal-period').value;
    const goalPeriod = goalPeriodInput ? parseInt(goalPeriodInput) : null;
    
    // Validation
    if (!earnings || earnings <= 0 || earnings < 100) {
        alert("Earnings must be at least R100!");
        return;
    }

    if (savingsGoal && savingsGoal > 0 && savingsGoal < 100) {
        alert("Savings goal must be at least R100!");
        return;
    }
    
    const matrixSection = document.getElementById('matrix-section');
    const gridContainer = document.getElementById('grid-container');
    const recText = document.getElementById('recommendation-text');
    const tipsSection = document.getElementById('tips-section');
    const suggestionSection = document.getElementById('suggestion-section');
    const tipsText = document.getElementById('tips-text');
    const suggestionText = document.getElementById('suggestion-text');
    const goalAmountEl = document.getElementById('goal-amount');

    let finalGoal = savingsGoal;
    let finalPeriod = goalPeriod;

    // Auto-suggest if not provided
    if (!finalGoal || finalGoal <= 0) {
        finalGoal = earnings * 0.10;
    }
    
    // Calculate recommended period if not provided
    // One pay cycle for each percentage of earnings to save
    if (!finalPeriod || finalPeriod <= 0) {
        if (frequency === 'weekly') {
            // For weekly: If saving 10%, take 2-3 weeks
            const percentageOfEarnings = (finalGoal / earnings);
            finalPeriod = Math.ceil(7 * (percentageOfEarnings > 0.15 ? 4 : percentageOfEarnings > 0.10 ? 3 : 2));
        } else {
            // For monthly: Standard 30 days
            finalPeriod = 30;
        }
    }

    // Store goal amount for progress tracking
    goalAmount = finalGoal;
    
    // Calculate per-period savings (weekly or monthly)
    let amountPerBox;
    let numBoxes;
    let periodLabel;
    
    if (frequency === 'weekly') {
        // For weekly earners: Calculate weekly savings
        const numWeeks = Math.ceil(finalPeriod / 7);
        amountPerBox = Math.round((finalGoal / numWeeks) * 100) / 100;
        numBoxes = numWeeks;
        periodLabel = 'week';
    } else {
        // For monthly earners: Calculate monthly savings
        const numMonths = Math.ceil(finalPeriod / 30);
        amountPerBox = Math.round((finalGoal / numMonths) * 100) / 100;
        numBoxes = numMonths;
        periodLabel = 'month';
    }
    
    totalBoxes = numBoxes;
    totalSavings = 0;

    // Update goal display
    goalAmountEl.innerText = `R${finalGoal.toFixed(2)}`;

    // Update recommendation text with frequency and period
    const frequencyText = frequency === 'weekly' ? 'weekly' : 'monthly';
    recText.innerText = `${frequency.charAt(0).toUpperCase() + frequency.slice(1)} earner • Goal: R${finalGoal.toFixed(2)} in ${finalPeriod} days • Save R${amountPerBox.toFixed(2)}/${periodLabel} • ${numBoxes} boxes`;

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

    // Generate boxes based on calculated number
    let cumulativeSavings = 0;
    for (let i = 1; i <= numBoxes; i++) {
        let boxAmount;
        if (i === numBoxes) {
            // Last box: ensure it adds up exactly to the goal
            boxAmount = finalGoal - cumulativeSavings;
        } else {
            // Other boxes: round up to ensure we don't undershoot
            boxAmount = Math.ceil(amountPerBox * 100) / 100; // Round up to 2 decimals
        }
        cumulativeSavings += boxAmount;
        
        const box = document.createElement('div');
        box.className = 'box';
        box.innerHTML = `<span class="box-amount">R${boxAmount.toFixed(2)}</span><span class="box-number">${i}/${numBoxes}</span>`;
        box.dataset.amount = boxAmount;
        box.dataset.boxNumber = i;
        
        box.addEventListener('click', () => {
            const wasChecked = box.classList.contains('checked');
            box.classList.toggle('checked');
            
            if (!wasChecked) {
                // Box was just checked
                totalSavings += boxAmount;
            } else {
                // Box was unchecked
                totalSavings -= boxAmount;
            }

            // Update progress display
            updateProgressDisplay();

            // Check if goal is reached (when total savings >= goal)
            if (!wasChecked && totalSavings >= finalGoal) {
                setTimeout(() => {
                    showCongratsModal(totalSavings);
                }, 300);
            }
        });

        gridContainer.appendChild(box);
    }
});

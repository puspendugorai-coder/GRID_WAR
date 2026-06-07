/* setup.js */
const SYMBOLS = ['X', 'O', '△', '□', '★', '◆'];
const COLORS = ['#00f5ff', '#ff2d78', '#39ff14', '#ffd700', '#bf00ff', '#ff6600'];

let selectedCount = 2;
let onStep = 1; // 1=count, 2=names

const stepCount = document.getElementById('stepCount');
const setupForm = document.getElementById('setupForm');
const nameFields = document.getElementById('nameFields');
const numInput = document.getElementById('numPlayersInput');
const btnNext = document.getElementById('btnNext');
const btnBack = document.getElementById('btnBack');

// Count buttons
document.querySelectorAll('.count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedCount = parseInt(btn.dataset.count);
    });
});

btnNext.addEventListener('click', () => {
    goToNames();
});

btnBack.addEventListener('click', () => {
    setupForm.classList.add('hidden');
    stepCount.classList.remove('hidden');
    stepCount.style.animation = 'none';
    requestAnimationFrame(() => { stepCount.style.animation = ''; });
    onStep = 1;
});

function goToNames() {
    numInput.value = selectedCount;
    nameFields.innerHTML = '';

    for (let i = 0; i < selectedCount; i++) {
        const div = document.createElement('div');
        div.className = 'name-field';
        div.innerHTML = `
      <div class="name-symbol" style="color:${COLORS[i]};border-color:${COLORS[i]};text-shadow:0 0 8px ${COLORS[i]}">
        ${SYMBOLS[i]}
      </div>
      <input class="name-input" type="text" name="name_${i}"
             placeholder="Player ${i+1}" maxlength="20"
             style="transition-delay:${i*0.05}s"/>
    `;
        nameFields.appendChild(div);

        // animate in
        const inp = div.querySelector('input');
        inp.style.opacity = 0;
        inp.style.transform = 'translateX(-20px)';
        requestAnimationFrame(() => {
            setTimeout(() => {
                inp.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                inp.style.opacity = 1;
                inp.style.transform = 'translateX(0)';
            }, i * 60);
        });
    }

    stepCount.classList.add('hidden');
    setupForm.classList.remove('hidden');
    setupForm.style.animation = 'none';
    requestAnimationFrame(() => { setupForm.style.animation = ''; });
    onStep = 2;

    // focus first
    setTimeout(() => {
        const first = nameFields.querySelector('input');
        if (first) first.focus();
    }, 200);
}

// Enter key nav
document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && onStep === 1) goToNames();
});
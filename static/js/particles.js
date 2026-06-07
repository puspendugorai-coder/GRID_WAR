/* particles.js – floating neon dots */
(function() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    const container = document.getElementById('particles');
    if (!container) return;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const COLORS = ['#00f5ff', '#ff2d78', '#39ff14', '#ffd700', '#bf00ff'];
    let W, H, dots = [];

    function resize() {
        W = canvas.width = container.offsetWidth || window.innerWidth;
        H = canvas.height = container.offsetHeight || window.innerHeight;
    }

    function mkDot() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: Math.random() * 0.5 + 0.1
        };
    }

    function init() {
        resize();
        dots = Array.from({ length: 80 }, mkDot);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        dots.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < 0) d.x = W;
            if (d.x > W) d.x = 0;
            if (d.y < 0) d.y = H;
            if (d.y > H) d.y = 0;
            ctx.save();
            ctx.globalAlpha = d.alpha;
            ctx.fillStyle = d.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = d.color;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init();
    draw();
})();
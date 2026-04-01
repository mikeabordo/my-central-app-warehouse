<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Mini Pill Toggle</title>
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

:root {
--bg: #f5f2ec;
--ink: #1a1814;
--ink2: #6b6760;
--ink3: #b0ada8;
--surface: #eceae4;
--border2: rgba(26,24,20,0.18);
--on-bg: #1a1814;
--on-fg: #f5f2ec;
--mono: 'Geist Mono', monospace;
--green: #7fffb0;
}

body {
background: var(--bg);
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
gap: 20px;
font-family: var(--mono);
}

.tgl-mini {
position: relative;
display: inline-flex;
align-items: center;
justify-content: center;
width: 100px;
height: 36px;
border-radius: 18px;
background: var(--surface);
border: 1px solid var(--border2);
cursor: pointer;
overflow: hidden;
user-select: none;
}
.tgl-mini input { display: none; }

.tgl-mini .fill {
position: absolute;
inset: 0;
background: var(--on-bg);
transform: translateX(-100%);
transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
}
.tgl-mini input:checked ~ .fill { transform: translateX(0); }

.tgl-mini .lbl {
position: absolute;
font-size: 10px;
letter-spacing: 0.1em;
text-transform: uppercase;
font-weight: 500;
transition: opacity 0.2s, transform 0.25s;
pointer-events: none;
display: flex;
align-items: center;
gap: 5px;
}
.tgl-mini .dot {
width: 5px;
height: 5px;
border-radius: 50%;
flex-shrink: 0;
}

/_ Inactive label — visible by default _/
.tgl-mini .lbl-inactive { color: var(--ink2); opacity: 1; transform: scale(1); }
.tgl-mini .dot-inactive { background: var(--ink3); }
.tgl-mini input:checked ~ .lbl-inactive { opacity: 0; transform: scale(0.85); }

/_ Active label — hidden by default _/
.tgl-mini .lbl-active { color: var(--on-fg); opacity: 0; transform: scale(0.85); }
.tgl-mini .dot-active { background: var(--green); box-shadow: 0 0 6px var(--green); }
.tgl-mini input:checked ~ .lbl-inactive ~ .lbl-active { opacity: 1; transform: scale(1); }
</style>

</head>
<body>

<!-- OFF state -->
<label class="tgl-mini">
  <input type="checkbox">
  <span class="fill"></span>
  <span class="lbl lbl-inactive">
    <span class="dot dot-inactive"></span>Inactive
  </span>
  <span class="lbl lbl-active">
    <span class="dot dot-active"></span>Active
  </span>
</label>

<!-- ON state -->
<label class="tgl-mini">
  <input type="checkbox" checked>
  <span class="fill"></span>
  <span class="lbl lbl-inactive">
    <span class="dot dot-inactive"></span>Inactive
  </span>
  <span class="lbl lbl-active">
    <span class="dot dot-active"></span>Active
  </span>
</label>

</body>
</html>

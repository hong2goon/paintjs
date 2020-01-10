const canvas = document.querySelector("#jsCanvas"),
 ctx = canvas.getContext("2d"),
 range = document.querySelector("#jsRange"),
 mode = document.querySelector("#jsMode"),
 saveBtn = document.querySelector("#jsSave"),
 colors = document.querySelectorAll(".jsColor"),
 toggleBtn = document.querySelector(".controlsToggle");

const INITIAL_COLOR = "#2c2c2c",
    CANVAS_WIDTH = canvas.offsetWidth,
    CANVAS_HEIGHT = canvas.offsetHeight;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

toggleBtn.classList.remove("active");

colors[0].classList.add("active");
ctx.fillStyle = "#ffffff"
ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = "2.5";

let filling = false,
    painting = false;

function startPainting() {
    painting = true;
}

function stopPainting() {
    painting = false;
}

function onMouseMove(event) {
    const x = event.offsetX,
        y = event.offsetY;
    
    if(!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function handleCanvasClick() {
    if (filling) {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

function getTouchPos(canvasDom, touchEvent) {
    const rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
}

function handleCM(event) {
    event.preventDefault();
}

function handleRangeChange(event) {
    const strokeSize = event.target.value;
    ctx.lineWidth = strokeSize;
}

function handleModeClick() {
    console.log(filling);
    if (filling === true) {
        filling = false;
        mode.className = "paint";
        mode.innerHTML = "<i class='icon'></i>paint";
    } else {
        filling = true;
        mode.className = "fill";
        mode.innerHTML = "<i class='icon'></i>fill";
    }
}

function handleSaveClick() {
    const image = canvas.toDataURL("image/png"),
        link = document.createElement("a");
    link.href = image;
    link.download = "exportImage";
    link.click();

}

function handleColorClick(e) {
    const color = e.target.style.backgroundColor;

    colors.forEach((e) => e.classList.remove("active"));
    e.target.classList.add("active"); 
    ctx.strokeStyle = color;
    ctx.fillStyle = ctx.strokeStyle;
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM);
    // mobile
    canvas.addEventListener("touchstart", function(e) {
        mousePos = getTouchPos(canvas, e);
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        }, startPainting);
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
        const mouseEvent = new MouseEvent("mouseup", stopPainting);
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        let mouseEvent; 
        if(!painting) {
            ctx.beginPath();
        }
        mouseEvent  = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
}

function handleToggleClick(e) {
    const controls = e.target.parentElement,
        hasAct = e.target.classList.contains("active");
    if(hasAct) {
        controls.classList.remove("show-fade");
        controls.style.top = "100%";
        e.target.classList.remove("active");
    } else {
        const top = document.body.offsetHeight - controls.offsetHeight;
        controls.classList.remove("show-fade");
        controls.style.top = `${top}px`;
        e.target.classList.add("active");
    }
}

if (range) {
    range.addEventListener("input", handleRangeChange);
}

if (mode) {
    mode.addEventListener("click", handleModeClick);
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
}

if (colors) {
    colors.forEach(color => color.addEventListener("click", handleColorClick));
}

if (toggleBtn) {
    toggleBtn.addEventListener("click", handleToggleClick);
}
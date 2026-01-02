function jsonToConf() {
  let data;
  try {
    data = JSON.parse(document.getElementById("input").value);
  } catch {
    alert("Invalid JSON");
    return;
  }
  if (!data || typeof data.env !== "string") {
    alert('JSON must be: { "env": "<nginx conf>" }');
    return;
  }
  document.getElementById("output").value = formatNginx(data.env);
}

function confToJson() {
  const conf = document.getElementById("input").value;
  if (!conf.trim()) {
    alert("Empty input");
    return;
  }
  const escaped = conf.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  document.getElementById("output").value = JSON.stringify(
    { env: escaped },
    null,
    2
  );
}

function formatNginx(conf) {
  const lines = tokenize(conf);
  let indent = 0;
  const INDENT = "  ";
  const out = [];
  for (let line of lines) {
    const isLocation = line.startsWith("location ");
    if (isLocation && out.length && out[out.length - 1] !== "") {
      out.push("");
    }
    if (line === "}") {
      indent--;
    }
    out.push(INDENT.repeat(indent) + line);
    if (line.endsWith("{")) {
      indent++;
    }
  }
  return out.join("\n") + "\n";
}

function tokenize(conf) {
  return conf
    .replace(/\r\n/g, "\n")
    .replace(/;\s*/g, ";\n")
    .replace(/{\s*/g, "{\n")
    .replace(/}\s*/g, "}\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function copyText(id, btn) {
  const text = document.getElementById(id).value;
  if (!text) {
    return;
  }
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const original = btn.textContent;
      btn.textContent = "Copied successfully";
      setTimeout(() => {
        btn.textContent = original;
      }, 1000);
    })
    .catch(() => {
      alert("Copy failed");
    });
}

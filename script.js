
"use strict";

// CyberLab educational demonstrations.
// These browser simulations are not production security controls.

function getElement(id) {
  return document.getElementById(id);
}

function showResult(id, message) {
  const element = getElement(id);
  if (element) {
    // Use textContent to display text safely.
    element.textContent = message;
  }
}

// LAB 01: Basic password characteristics.
// This is not a reliable password-strength meter.

function checkPassword() {
  const input = getElement("passwordInput");
  const value = input.value;

  const summary = getElement("passwordSummary");
  const meter = getElement("passwordMeter");
  const meterFill = getElement("passwordMeterFill");
  const meterLabel = getElement("passwordMeterLabel");
  const checks = getElement("passwordChecks");

  if (!value) {
    summary.textContent = "Enter a sample to begin.";
    meterFill.style.width = "0%";
    meter.setAttribute("aria-valuenow", "0");
    meterLabel.textContent = "Characteristics: not assessed";
    checks.replaceChildren();
    return;
  }

  const tests = [
    {
      label: "At least 12 characters",
      passed: value.length >= 12
    },
    {
      label: "At least 16 characters",
      passed: value.length >= 16
    },
    {
      label: "Contains lowercase letters",
      passed: /[a-z]/.test(value)
    },
    {
      label: "Contains uppercase letters",
      passed: /[A-Z]/.test(value)
    },
    {
      label: "Contains numbers or symbols",
      passed: /[0-9]|[^A-Za-z]/.test(value)
    }
  ];

  const score = tests.filter(test => test.passed).length;

  summary.textContent =
    score >= 4
      ? "Several useful characteristics are present."
      : score >= 2
        ? "Some useful characteristics are present."
        : "Consider using a longer, less predictable passphrase.";

  meterFill.style.width = (score / tests.length * 100) + "%";
  meter.setAttribute("aria-valuenow", String(score));

  meterLabel.textContent =
    score + " of " + tests.length +
    " basic checks passed — not a security score.";

  checks.replaceChildren();

  tests.forEach(test => {
    const row = document.createElement("div");
    row.className = "test-row";

    const label = document.createElement("span");
    label.textContent = test.label;

    const status = document.createElement("span");
    status.className = test.passed ? "check-pass" : "check-info";
    status.textContent = test.passed ? "PASS" : "TIP";

    row.append(label, status);
    checks.appendChild(row);
  });
}

// Toggle visibility of the sample text.
const showPasswordToggle = getElement("showPasswordToggle");

if (showPasswordToggle) {
  showPasswordToggle.addEventListener("change", function () {
    const input = getElement("passwordInput");
    input.type = this.checked ? "text" : "password";
  });
}



/* LAB 02: Local authentication security simulation */

let failedLoginAttempts = 0;
let loginLocked = false;
let loginEventCount = 0;

function logLoginEvent(message) {
  const log = getElement("loginEventLog");
  if (!log) return;

  if (loginEventCount === 0) {
    log.replaceChildren();
  }

  loginEventCount += 1;

  const entry = document.createElement("p");
  entry.textContent =
    "Event " + loginEventCount + ": " + message;

  log.prepend(entry);

  // Keep the display compact.
  while (log.children.length > 8) {
    log.lastElementChild.remove();
  }
}

function updateLoginStatus() {
  const attempts = getElement("loginAttempts");
  const state = getElement("loginState");

  if (attempts) {
    attempts.textContent = failedLoginAttempts + " / 3";
  }

  if (state) {
    state.textContent = loginLocked
      ? "Locked"
      : "Ready";
    state.className = loginLocked ? "status-bad" : "status-good";
  }
}

function simulateLogin() {
  if (loginLocked) {
    showResult(
      "loginResult",
      "Access blocked: the demo is locked. Reset the simulation to restart."
    );
    logLoginEvent("Login blocked while the demo was locked.");
    return;
  }

  const username = getElement("loginUsername").value.trim();
  const password = getElement("loginPassword").value;

  if (!username || !password) {
    showResult("loginResult", "Enter both demo fields first.");
    logLoginEvent("Attempt stopped because a field was empty.");
    return;
  }

  // Public demo values only. Never use real credentials here.
  const validUsername = "student";
  const validPassword = "CyberLab123!";

  if (username === validUsername && password === validPassword) {
    failedLoginAttempts = 0;

    showResult(
      "loginResult",
      "Demo login successful. This result is simulated in your browser."
    );

    logLoginEvent("Demo authentication succeeded.");
    updateLoginStatus();
    return;
  }

  failedLoginAttempts += 1;

  if (failedLoginAttempts >= 3) {
    loginLocked = true;

    showResult(
      "loginResult",
      "Demo locked after three failed attempts. Reset to try again."
    );

    logLoginEvent("Demo entered the locked state.");
  } else {
    const remaining = 3 - failedLoginAttempts;

    showResult(
      "loginResult",
      "Demo login failed. Attempts remaining: " + remaining + "."
    );

    logLoginEvent("Demo authentication failed.");
  }

  updateLoginStatus();
}

function resetLogin() {
  failedLoginAttempts = 0;
  loginLocked = false;
  loginEventCount = 0;

  getElement("loginUsername").value = "";
  getElement("loginPassword").value = "";

  showResult("loginResult", "Simulation reset. Ready for another test.");

  const log = getElement("loginEventLog");
  if (log) {
    log.replaceChildren();

    const empty = document.createElement("p");
    empty.textContent = "No events yet.";
    log.appendChild(empty);
  }

  updateLoginStatus();
}



/* LAB 03: URL structure and warning-indicator analysis */

function analyzeURL() {
  const input = getElement("urlInput").value.trim();

  const detailsBox = getElement("urlDetails");
  const findingsBox = getElement("urlFindings");
  const riskLevel = getElement("urlRiskLevel");
  const riskSummary = getElement("urlRiskSummary");
  const riskMeter = getElement("urlRiskMeter");
  const riskFill = getElement("urlRiskFill");

  function clearBox(element) {
    element.replaceChildren();
  }

  function addDetail(label, value) {
    const row = document.createElement("div");
    row.className = "test-row";

    const name = document.createElement("span");
    name.textContent = label;

    const result = document.createElement("span");
    result.textContent = value || "(empty)";

    row.append(name, result);
    detailsBox.appendChild(row);
  }

  function addFinding(title, explanation, severity) {
    const item = document.createElement("div");
    item.className = "finding";

    const heading = document.createElement("strong");
    heading.textContent = severity + ": " + title;

    const text = document.createElement("p");
    text.textContent = explanation;

    item.append(heading, text);
    findingsBox.appendChild(item);
  }

  clearBox(detailsBox);
  clearBox(findingsBox);

  if (!input) {
    riskLevel.textContent = "No URL provided";
    riskSummary.textContent = "Enter a URL to begin.";
    riskFill.style.width = "0%";
    riskMeter.setAttribute("aria-valuenow", "0");
    return;
  }

  if (input.length > 2048) {
    riskLevel.textContent = "Input too long";
    riskSummary.textContent = "Please enter a URL shorter than 2048 characters.";
    riskFill.style.width = "0%";
    riskMeter.setAttribute("aria-valuenow", "0");
    return;
  }

  let url;

  try {
    url = new URL(input);
  } catch {
    riskLevel.textContent = "Invalid URL";
    riskSummary.textContent =
      "Could not parse this input as an absolute URL. Include a protocol such as https://.";
    riskFill.style.width = "0%";
    riskMeter.setAttribute("aria-valuenow", "0");
    addFinding(
      "Parsing failed",
      "The input could be incomplete, malformed, or missing its protocol.",
      "INFO"
    );
    return;
  }

  addDetail("Protocol", url.protocol);
  addDetail("Hostname", url.hostname);
  addDetail("Port", url.port || "Default");
  addDetail("Path", url.pathname);
  addDetail("Query string", url.search || "None");
  addDetail("Fragment", url.hash || "None");
  addDetail("Username field", url.username ? "Present" : "None");
  addDetail("Password field", url.password ? "Present" : "None");

  const flags = [];
  let points = 0;

  function flag(title, explanation, severity, weight) {
    flags.push({ title, explanation, severity });
    points += weight;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    flag(
      "Unexpected protocol",
      "This is not an HTTP or HTTPS URL. Do not open unfamiliar schemes without understanding what they do.",
      "CAUTION",
      2
    );
  }

  if (url.protocol === "http:") {
    flag(
      "Unencrypted HTTP",
      "HTTP does not provide TLS encryption for the connection. Prefer HTTPS for websites.",
      "CAUTION",
      2
    );
  }

  if (url.username || url.password) {
    flag(
      "Credentials embedded in URL",
      "The URL contains a username or password field before the hostname. This can be misleading and may expose sensitive information.",
      "WARNING",
      2
    );
  }

  if (url.hostname.startsWith("xn--") ||
      url.hostname.split(".").some(part => part.startsWith("xn--"))) {
    flag(
      "Internationalized hostname",
      "The hostname contains punycode. This can be legitimate, but unfamiliar internationalized domains deserve careful inspection.",
      "CAUTION",
      1
    );
  }

  const ipv4Pattern =
    /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;

  const isIPv6 = url.hostname.startsWith("[") &&
    url.hostname.endsWith("]");

  if (ipv4Pattern.test(url.hostname) || isIPv6) {
    flag(
      "IP address used as host",
      "The URL uses an IP address instead of a conventional domain name. This is not automatically malicious, but verify the destination carefully.",
      "CAUTION",
      1
    );
  }

  if (url.port && !["80", "443"].includes(url.port)) {
    flag(
      "Non-default port",
      "This URL specifies a port other than 80 or 443. Some legitimate services use custom ports, so context matters.",
      "INFO",
      1
    );
  }

  if (url.hostname.split(".").length >= 5) {
    flag(
      "Many hostname labels",
      "The hostname has several dot-separated labels. Long hostnames can be legitimate; inspect which domain is actually registered.",
      "INFO",
      1
    );
  }

  if (url.href.includes("%")) {
    flag(
      "Encoded characters",
      "The URL contains percent-encoded characters. Encoding is normal in URLs, but unfamiliar encoded text can make inspection harder.",
      "INFO",
      1
    );
  }

  if (flags.length === 0) {
    addFinding(
      "No configured warning indicators found",
      "This does not mean the URL is safe. The analyzer checks only a limited set of structural indicators.",
      "INFO"
    );
  } else {
    flags.forEach(item => {
      addFinding(item.title, item.explanation, item.severity);
    });
  }

  const cappedPoints = Math.min(points, 5);
  const labels = [
    "No configured indicators",
    "A few indicators",
    "Some caution advised",
    "Several indicators",
    "Multiple warning indicators",
    "Many warning indicators"
  ];

  riskLevel.textContent = labels[cappedPoints];
  riskSummary.textContent =
    flags.length + " finding(s). This is an indicator count, not a malware verdict.";

  riskFill.style.width = (cappedPoints / 5 * 100) + "%";
  riskMeter.setAttribute("aria-valuenow", String(cappedPoints));
}


// LAB 04: Simple allow-list input validation.
function validateInput() {
  const input = getElement("userInput");
  const result = getElement("inputResult");
  const value = input.value;

  if (value.length === 0) {
    result.textContent = "Please enter a sample to test.";
    result.className = "status-warn";
    return;
  }

  if (value.length > 100) {
    result.textContent =
      "REJECTED: Input exceeds the 100-character limit.";
    result.className = "status-bad";
    return;
  }

  const allowedPattern = /^[A-Za-z0-9 _-]+$/;

  if (allowedPattern.test(value)) {
    result.textContent =
      "ACCEPTED: The input matches this demo's allowlist rule.";
    result.className = "status-good";
  } else {
    result.textContent =
      "REJECTED: Use only letters, numbers, spaces, underscores, and hyphens.";
    result.className = "status-bad";
  }
}

// LAB 05: SHA-256 using the browser Web Crypto API.
// SHA-256 alone is not suitable for password storage.
async function simulateHash() {
  const input = getElement("hashInput");
  const result = getElement("hashResult");
  const value = input.value;

  if (!value) {
    result.textContent = "Enter sample text before generating a hash.";
    result.className = "status-warn";
    return;
  }

  if (!window.crypto || !window.crypto.subtle) {
    result.textContent =
      "Hashing is unavailable in this browser context. Try a secure context such as HTTPS or localhost.";
    result.className = "status-bad";
    return;
  }

  try {
    result.textContent = "Generating digest...";
    result.className = "";

    const data = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", data);

    const hash = Array.from(new Uint8Array(digest))
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");

    result.textContent = hash;
    result.className = "status-good";
  } catch (error) {
    result.textContent =
      "Could not generate the digest in this browser context.";
    result.className = "status-bad";
  }
}

// LAB 06: Client-side role simulation.
function tryAdminAction() {
  const role = getElement("accessRole").value;
  const result = getElement("accessResult");

  const permissions = {
    guest: false,
    user: false,
    analyst: false,
    admin: true
  };

  if (!Object.prototype.hasOwnProperty.call(permissions, role)) {
    result.textContent = "DENIED: Unrecognized role.";
    result.className = "status-bad";
    return;
  }

  if (permissions[role]) {
    result.textContent =
      "ALLOWED: The simulated Administrator role has permission for this action.";
    result.className = "status-good";
  } else {
    result.textContent =
      "DENIED: The selected role does not have permission for this action.";
    result.className = "status-bad";
  }


  // A real application must enforce authorization on the server.
}

// Connect buttons after the HTML has loaded.
function initializeCyberLab() {
  const actions = [
    ["checkPasswordBtn", checkPassword],
    ["simulateLoginBtn", simulateLogin],
    ["resetLoginBtn", resetLogin],
    ["analyzeUrlBtn", analyzeURL],
    ["validateInputBtn", validateInput],
    ["hashBtn", simulateHash],
    ["tryAdminBtn", tryAdminAction]
  ];

  for (const [id, handler] of actions) {
    const button = getElement(id);
    if (button) button.addEventListener("click", handler);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCyberLab);
} else {
  initializeCyberLab();
}

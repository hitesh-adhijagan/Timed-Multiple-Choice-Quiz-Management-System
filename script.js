const QUESTION_BANK = {
  "General Aptitude": [
    {
      id: 1,
      q: "If a train travels 120 km in 2 hours, what is its average speed?",
      options: ["40 km/h", "60 km/h", "80 km/h", "100 km/h"],
      answer: 1
    },
    {
      id: 2,
      q: "What is 25% of 240?",
      options: ["48", "54", "60", "75"],
      answer: 2
    },
    {
      id: 3,
      q: "Complete the series: 2, 6, 12, 20, 30, __",
      options: ["36", "40", "42", "48"],
      answer: 2
    },
    {
      id: 4,
      q: "A shopkeeper buys an item for 400 and sells it for 460. What is the profit percentage?",
      options: ["12%", "15%", "18%", "20%"],
      answer: 1
    },
    {
      id: 5,
      q: "If 6 workers complete a task in 10 days, how many days will 12 workers take at the same rate?",
      options: ["4 days", "5 days", "6 days", "20 days"],
      answer: 1
    }
  ],
  "Basic C Programming": [
    {
      id: 1,
      q: "Which header file is required for standard input/output functions like printf() and scanf()?",
      options: ["<stdlib.h>", "<stdio.h>", "<string.h>", "<math.h>"],
      answer: 1
    },
    {
      id: 2,
      q: "What is the index of the first element in a C array?",
      options: ["-1", "0", "1", "Depends on compiler"],
      answer: 1
    },
    {
      id: 3,
      q: "Which operator returns the memory address of a variable in C?",
      options: ["*", "&", "%", "#"],
      answer: 1
    },
    {
      id: 4,
      q: "Which loop is guaranteed to execute its body at least once?",
      options: ["for", "while", "do-while", "switch"],
      answer: 2
    },
    {
      id: 5,
      q: "Which format specifier is used to print an integer in C?",
      options: ["%f", "%c", "%d", "%s"],
      answer: 2
    }
  ],
  "Computer Fundamentals": [
    {
      id: 1,
      q: "Which type of memory is volatile and loses data when power is turned off?",
      options: ["ROM", "SSD", "RAM", "Flash Drive"],
      answer: 2
    },
    {
      id: 2,
      q: "What does CPU stand for?",
      options: ["Central Process Unit", "Central Processing Unit", "Computer Program Utility", "Core Processing Unit"],
      answer: 1
    },
    {
      id: 3,
      q: "Which layer of the OSI model handles routing of packets across networks?",
      options: ["Data Link Layer", "Network Layer", "Transport Layer", "Session Layer"],
      answer: 1
    },
    {
      id: 4,
      q: "What is the binary equivalent of decimal number 10?",
      options: ["1000", "1010", "1100", "1110"],
      answer: 1
    },
    {
      id: 5,
      q: "Which device translates domain names into IP addresses?",
      options: ["DHCP Server", "DNS Server", "Firewall", "Switch"],
      answer: 1
    }
  ],
  "Web Basics": [
    {
      id: 1,
      q: "Which HTML element represents the main unique content of a document?",
      options: ["<section>", "<article>", "<main>", "<aside>"],
      answer: 2
    },
    {
      id: 2,
      q: "Which CSS layout model is one-dimensional (row or column)?",
      options: ["Grid", "Flexbox", "Table", "Float"],
      answer: 1
    },
    {
      id: 3,
      q: "Which keyword declares a block-scoped variable that can be reassigned in JavaScript?",
      options: ["var", "let", "const", "static"],
      answer: 1
    },
    {
      id: 4,
      q: "Which Web Storage object persists data even after the browser is closed?",
      options: ["sessionStorage", "localStorage", "window.name", "cookies only"],
      answer: 1
    },
    {
      id: 5,
      q: "Which attribute connects a <label> element to a specific form <input>?",
      options: ["name", "for", "type", "rel"],
      answer: 1
    }
  ]
};

const HISTORY_STORAGE_KEY = "mcq_quiz_history";
const SESSION_STORAGE_KEY = "mcq_active_session";

// DOM References
const setupSection = document.getElementById("setup-section");
const quizSection = document.getElementById("quiz-section");
const resultsSection = document.getElementById("results-section");
const setupForm = document.getElementById("setup-form");
const candidateInput = document.getElementById("candidate-name");
const topicSelect = document.getElementById("topic-select");
const durationSelect = document.getElementById("duration-select");
const feedbackMsg = document.getElementById("form-feedback");
const resetSetupBtn = document.getElementById("reset-setup-btn");

const navLinks = document.querySelectorAll(".nav-link");
const navSetup = document.getElementById("nav-setup");
const navQuiz = document.getElementById("nav-quiz");
const navResults = document.getElementById("nav-results");

const activeTopicBadge = document.getElementById("active-topic-badge");
const progressText = document.getElementById("progress-text");
const questionProgress = document.getElementById("question-progress");
const timerBox = document.getElementById("timer-box");
const timerDisplay = document.getElementById("timer-display");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const markReviewCheckbox = document.getElementById("mark-review-checkbox");
const paletteGrid = document.getElementById("palette-grid");

const submitConfirmBox = document.getElementById("submit-confirm-box");
const submitConfirmText = document.getElementById("submit-confirm-text");
const confirmSubmitBtn = document.getElementById("confirm-submit-btn");
const cancelSubmitBtn = document.getElementById("cancel-submit-btn");

const prevBtn = document.getElementById("prev-btn");
const clearBtn = document.getElementById("clear-btn");
const nextBtn = document.getElementById("next-btn");
const submitQuizBtn = document.getElementById("submit-quiz-btn");
const retakeBtn = document.getElementById("retake-btn");

const resultCandidate = document.getElementById("result-candidate");
const statScore = document.getElementById("stat-score");
const statAccuracy = document.getElementById("stat-accuracy");
const statTime = document.getElementById("stat-time");
const breakdownBody = document.getElementById("breakdown-body");
const tableFooterSummary = document.getElementById("table-footer-summary");
const filterButtons = document.querySelectorAll(".filter-btn");

// Quiz State
let state = {
  candidate: "",
  topic: "",
  questions: [],
  currentIndex: 0,
  answers: [],
  skippedFlags: [],
  markedForReview: [],
  totalDuration: 120,
  remainingTime: 120,
  timerId: null,
  submitPromptMode: "",
  lastEvaluationRows: [],
  quizActive: false,
  hasResult: false
};

const padTwoDigits = (num) => {
  const value = Number(num) || 0;
  return value < 10 ? "0" + value : String(value);
};

const formatTime = (seconds) => {
  const safeSec = seconds > 0 ? Number(seconds) : 0;
  const mins = Math.floor(safeSec / 60);
  const secs = safeSec % 60;
  return padTwoDigits(mins) + ":" + padTwoDigits(secs);
};

const getCurrentVisibleSection = () => {
  if (!quizSection.classList.contains("hidden")) {
    return quizSection;
  }
  if (!resultsSection.classList.contains("hidden")) {
    return resultsSection;
  }
  return setupSection;
};

const updateActiveNav = (activeEl) => {
  let targetHash = "#setup-section";
  if (activeEl === quizSection) {
    targetHash = "#quiz-section";
  } else if (activeEl === resultsSection) {
    targetHash = "#results-section";
  }

  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === targetHash;
    link.classList.toggle("active-nav", isMatch);
  });
};

const showSection = (activeEl) => {
  setupSection.classList.add("hidden");
  quizSection.classList.add("hidden");
  resultsSection.classList.add("hidden");

  if (activeEl) {
    activeEl.classList.remove("hidden");
  }

  updateActiveNav(activeEl);
  window.scrollTo(0, 0);
};

const hideSubmitPrompt = () => {
  state.submitPromptMode = "";
  submitConfirmBox.classList.add("hidden");
  submitConfirmText.textContent = "";
};

const refreshSubmitPromptText = () => {
  if (submitConfirmBox.classList.contains("hidden") || !state.submitPromptMode) {
    return;
  }

  const timeLeftText = formatTime(state.remainingTime);
  if (state.submitPromptMode === "middle") {
    submitConfirmText.textContent = "Time left: " + timeLeftText + ". Submit quiz now?";
  } else {
    const answeredCount = state.answers.filter((ans) => ans !== null).length;
    const totalCount = state.questions.length;
    submitConfirmText.textContent =
      "Summary: Answered " +
      answeredCount +
      " of " +
      totalCount +
      " questions | Time left: " +
      timeLeftText +
      ". Submit quiz now?";
  }
};

const validateSetupForm = (nameRaw, topic) => {
  const trimmedName = nameRaw.trim();
  const nameRegex = /^[A-Za-z0-9\s.'-]{1,40}$/;
  if (!trimmedName) {
    return "Please enter your name.";
  }
  if (!nameRegex.test(trimmedName)) {
    return "Please enter a valid name (up to 40 characters).";
  }
  if (!topic || !QUESTION_BANK[topic]) {
    return "Please select a quiz topic.";
  }
  return "";
};

const syncSessionSnapshot = () => {
  try {
    const snapshot = {
      candidate: state.candidate,
      topic: state.topic,
      currentIndex: state.currentIndex,
      remainingTime: state.remainingTime,
      quizActive: state.quizActive
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot));
  } catch (err) {
    console.error("Session storage error:", err.message);
  }
};

const saveAttemptToHistory = (record) => {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : [];
    existing.unshift(record);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(existing.slice(0, 10)));
  } catch (err) {
    console.error("Local storage error:", err.message);
  }
};

const markSkippedIfUnanswered = (index) => {
  if (state.answers[index] === null) {
    state.skippedFlags[index] = true;
  }
};

const navigateToQuestion = (targetIndex) => {
  if (targetIndex < 0 || targetIndex >= state.questions.length) {
    return;
  }
  hideSubmitPrompt();
  markSkippedIfUnanswered(state.currentIndex);
  state.currentIndex = targetIndex;
  renderQuestion();
  syncSessionSnapshot();
};

const startTimer = () => {
  clearInterval(state.timerId);
  timerDisplay.textContent = formatTime(state.remainingTime);
  timerBox.classList.toggle("warning", state.remainingTime <= 20);
  refreshSubmitPromptText();

  state.timerId = setInterval(() => {
    state.remainingTime -= 1;
    timerDisplay.textContent = formatTime(state.remainingTime);
    timerBox.classList.toggle("warning", state.remainingTime <= 20);
    refreshSubmitPromptText();
    syncSessionSnapshot();

    if (state.remainingTime <= 0) {
      clearInterval(state.timerId);
      evaluateAndShowResults(true);
    }
  }, 1000);
};

const renderQuestion = () => {
  const qItem = state.questions[state.currentIndex];
  const total = state.questions.length;

  activeTopicBadge.textContent = state.topic;
  progressText.textContent = "Question " + (state.currentIndex + 1) + " of " + total;
  questionProgress.max = total;
  questionProgress.value = state.currentIndex + 1;
  questionText.textContent = (state.currentIndex + 1) + ". " + qItem.q;

  optionsContainer.innerHTML = "";
  qItem.options.forEach((optText, idx) => {
    const optionId = "opt-" + state.currentIndex + "-" + idx;
    const wrapper = document.createElement("label");
    wrapper.className = "option-item";
    wrapper.setAttribute("for", optionId);

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "mcqOption";
    radio.id = optionId;
    radio.value = String(idx);
    radio.checked = state.answers[state.currentIndex] === idx;

    radio.addEventListener("change", () => {
      state.answers[state.currentIndex] = idx;
      state.skippedFlags[state.currentIndex] = false;
      renderPalette();
      refreshSubmitPromptText();
    });

    const span = document.createElement("span");
    span.textContent = optText;

    wrapper.appendChild(radio);
    wrapper.appendChild(span);
    optionsContainer.appendChild(wrapper);
  });

  markReviewCheckbox.checked = Boolean(state.markedForReview[state.currentIndex]);
  prevBtn.disabled = state.currentIndex === 0;
  nextBtn.disabled = state.currentIndex === total - 1;

  renderPalette();
};

const renderPalette = () => {
  paletteGrid.innerHTML = "";

  state.questions.forEach((_, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "palette-btn";
    btn.textContent = String(idx + 1);

    if (idx === state.currentIndex) {
      btn.classList.add("current");
    }

    const isAnswered = state.answers[idx] !== null;
    const isReviewed = Boolean(state.markedForReview[idx]);

    if (isAnswered && isReviewed) {
      btn.classList.add("answered-review");
    } else if (isReviewed) {
      btn.classList.add("review");
    } else if (isAnswered) {
      btn.classList.add("answered");
    } else if (state.skippedFlags[idx]) {
      btn.classList.add("skipped");
    }

    btn.addEventListener("click", () => {
      navigateToQuestion(idx);
    });

    paletteGrid.appendChild(btn);
  });
};

const renderBreakdownTable = (filterType) => {
  const activeFilter = filterType || "all";
  breakdownBody.innerHTML = "";

  const filteredRows = state.lastEvaluationRows.filter((row) => {
    if (activeFilter === "correct") {
      return row.isCorrect;
    }
    if (activeFilter === "incorrect") {
      return !row.isCorrect;
    }
    if (activeFilter === "review") {
      return row.markedReview;
    }
    return true;
  });

  filteredRows.forEach((row) => {
    const tr = document.createElement("tr");

    const tdNum = document.createElement("td");
    tdNum.textContent = String(row.num);

    const tdQ = document.createElement("td");
    tdQ.textContent = row.question;

    const tdUser = document.createElement("td");
    tdUser.textContent = row.userAnswer;

    const tdCorrect = document.createElement("td");
    tdCorrect.textContent = row.correctAnswer;

    const tdStatus = document.createElement("td");
    const reviewTag = row.markedReview ? " [Review]" : "";
    const statusLabel = row.isCorrect ? "Correct" : "Incorrect";
    tdStatus.textContent = statusLabel + reviewTag;

    tr.appendChild(tdNum);
    tr.appendChild(tdQ);
    tr.appendChild(tdUser);
    tr.appendChild(tdCorrect);
    tr.appendChild(tdStatus);
    breakdownBody.appendChild(tr);
  });

  const correctRows = state.lastEvaluationRows.filter((r) => r.isCorrect);
  tableFooterSummary.textContent = correctRows.length + " of " + state.lastEvaluationRows.length + " Correct";
};

const evaluateAndShowResults = (autoSubmitted) => {
  clearInterval(state.timerId);
  state.quizActive = false;
  hideSubmitPrompt();

  const elapsed = state.totalDuration - state.remainingTime;
  const timeTaken = elapsed < state.totalDuration ? elapsed : state.totalDuration;
  const totalQ = state.questions.length;

  const rows = state.questions.map((item, idx) => {
    const chosenIdx = state.answers[idx];
    const isCorrect = chosenIdx === item.answer;
    return {
      num: idx + 1,
      question: item.q,
      userAnswer: chosenIdx !== null ? item.options[chosenIdx] : "Not Answered",
      correctAnswer: item.options[item.answer],
      isCorrect: isCorrect,
      markedReview: Boolean(state.markedForReview[idx])
    };
  });

  const correctList = rows.filter((r) => r.isCorrect);
  const score = correctList.length;
  const accuracy = totalQ > 0 ? ((score / totalQ) * 100).toFixed(1) : "0.0";

  state.lastEvaluationRows = rows;
  state.hasResult = true;

  const autoNote = autoSubmitted ? " (Time Expired - Auto Evaluated)" : "";
  resultCandidate.textContent = "Student: " + state.candidate + " | Topic: " + state.topic + autoNote;

  statScore.textContent = score + " / " + totalQ;
  statAccuracy.textContent = accuracy + "%";
  statTime.textContent = formatTime(timeTaken);

  filterButtons.forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === "all");
  });
  renderBreakdownTable("all");

  try {
    const now = new Date();
    saveAttemptToHistory({
      timestamp: now.toLocaleString(),
      candidate: state.candidate,
      topic: state.topic,
      score: score,
      totalQ: totalQ,
      accuracy: accuracy,
      timeTaken: timeTaken
    });
    syncSessionSnapshot();
  } catch (err) {
    console.error("Storage sync failed:", err.message);
  }

  showSection(resultsSection);
};

// Top Navigation Listeners
navSetup.addEventListener("click", (event) => {
  event.preventDefault();
  feedbackMsg.textContent = "";
  showSection(setupSection);
});

navQuiz.addEventListener("click", (event) => {
  event.preventDefault();
  if (state.quizActive) {
    showSection(quizSection);
  } else {
    const currentSec = getCurrentVisibleSection();
    updateActiveNav(currentSec);
    if (currentSec === setupSection) {
      feedbackMsg.textContent = "Enter your name and select a topic before starting the quiz.";
    }
  }
});

navResults.addEventListener("click", (event) => {
  event.preventDefault();
  if (state.hasResult) {
    showSection(resultsSection);
  } else {
    const currentSec = getCurrentVisibleSection();
    updateActiveNav(currentSec);
    if (currentSec === setupSection) {
      feedbackMsg.textContent = "Complete and submit a quiz to view the evaluation.";
    }
  }
});

// Quiz Form & Controls
const handleQuizStart = () => {
  const errorMsg = validateSetupForm(candidateInput.value, topicSelect.value);
  if (errorMsg) {
    feedbackMsg.textContent = errorMsg;
    return;
  }

  feedbackMsg.textContent = "";
  hideSubmitPrompt();
  const selectedTopic = topicSelect.value;
  const durationSec = Number(durationSelect.value) || 120;
  const bank = QUESTION_BANK[selectedTopic];

  state = {
    candidate: candidateInput.value.trim(),
    topic: selectedTopic,
    questions: bank,
    currentIndex: 0,
    answers: Array(bank.length).fill(null),
    skippedFlags: Array(bank.length).fill(false),
    markedForReview: Array(bank.length).fill(false),
    totalDuration: durationSec,
    remainingTime: durationSec,
    timerId: null,
    submitPromptMode: "",
    lastEvaluationRows: [],
    quizActive: true,
    hasResult: false
  };

  showSection(quizSection);
  renderQuestion();
  startTimer();
  syncSessionSnapshot();
};

setupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleQuizStart();
});

resetSetupBtn.addEventListener("click", () => {
  feedbackMsg.textContent = "";
});

markReviewCheckbox.addEventListener("change", () => {
  state.markedForReview[state.currentIndex] = markReviewCheckbox.checked;
  renderPalette();
});

prevBtn.addEventListener("click", () => {
  navigateToQuestion(state.currentIndex - 1);
});

nextBtn.addEventListener("click", () => {
  navigateToQuestion(state.currentIndex + 1);
});

clearBtn.addEventListener("click", () => {
  state.answers[state.currentIndex] = null;
  state.skippedFlags[state.currentIndex] = true;
  renderQuestion();
  refreshSubmitPromptText();
});

submitQuizBtn.addEventListener("click", () => {
  const isLastQuestion = state.currentIndex === state.questions.length - 1;
  state.submitPromptMode = isLastQuestion ? "last" : "middle";
  refreshSubmitPromptText();
  submitConfirmBox.classList.remove("hidden");
});

confirmSubmitBtn.addEventListener("click", () => {
  evaluateAndShowResults(false);
});

cancelSubmitBtn.addEventListener("click", () => {
  hideSubmitPrompt();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => {
      b.classList.remove("active");
    });
    btn.classList.add("active");
    renderBreakdownTable(btn.dataset.filter);
  });
});

retakeBtn.addEventListener("click", () => {
  clearInterval(state.timerId);
  state.quizActive = false;
  hideSubmitPrompt();
  syncSessionSnapshot();
  showSection(setupSection);
});
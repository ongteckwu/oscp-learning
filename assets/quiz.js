/* ============================================================================
   Reusable quiz widget for OSCP lessons.
   Immediate, automatic feedback — built for retrieval practice.

   Usage in a lesson:
     <div class="quiz" id="myquiz"></div>
     <script src="../assets/quiz.js"></script>
     <script>
       renderQuiz('myquiz', [
         {
           prompt: 'Question text?',
           options: ['Answer one here', 'Answer two here'],  // keep equal length
           answer: 0,                                         // index of correct
           explain: 'Why the correct answer is correct.'
         },
         ...
       ]);
     </script>

   Design notes:
   - Options are SHUFFLED at render time (and re-shuffled on every page load), so
     the correct answer's slot varies — authoring every answer at index 0 is fine.
     `answer` is the index into the original `options` array as authored.
     Still keep option lengths similar, since length itself can leak the answer.
   - On click: locks the question, marks correct/incorrect, reveals explanation.
   - Tracks a running score and shows it once every question is answered.
   ========================================================================== */
function renderQuiz(containerId, questions) {
  const root = document.getElementById(containerId);
  if (!root) return;
  let answered = 0;
  let correctCount = 0;

  const scoreEl = document.createElement('div');
  scoreEl.className = 'score';

  questions.forEach((q, qi) => {
    const card = document.createElement('div');
    card.className = 'q';

    const prompt = document.createElement('div');
    prompt.className = 'q-prompt';
    prompt.innerHTML = '<span class="num">Q' + (qi + 1) + '.</span>' + escapeHtml(q.prompt);
    card.appendChild(prompt);

    const opts = document.createElement('div');
    opts.className = 'options';

    const feedback = document.createElement('div');
    feedback.className = 'feedback';

    // shuffle the slot order so the correct answer isn't always in the same place
    const order = shuffle(q.options.map((_, i) => i));
    let correctBtn = null;

    order.forEach((oi) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = q.options[oi];
      const right = oi === q.answer;
      if (right) correctBtn = btn;
      btn.addEventListener('click', () => {
        // lock all options for this question
        Array.from(opts.children).forEach((b) => (b.disabled = true));
        btn.classList.add(right ? 'correct' : 'wrong');
        if (!right && correctBtn) {
          correctBtn.classList.add('correct');
        }
        feedback.textContent = (right ? '✓ Correct. ' : '✗ Not quite. ') + (q.explain || '');
        feedback.classList.add('show', right ? 'ok' : 'no');

        answered += 1;
        if (right) correctCount += 1;
        if (answered === questions.length) {
          scoreEl.textContent = 'Score: ' + correctCount + ' / ' + questions.length +
            (correctCount === questions.length ? '  — clean sweep.' : '  — review the misses, then move on.');
          scoreEl.classList.add('show');
        }
      });
      opts.appendChild(btn);
    });

    card.appendChild(opts);
    card.appendChild(feedback);
    root.appendChild(card);
  });

  root.appendChild(scoreEl);
}

// Fisher-Yates, in place; the caller passes a fresh array so author data is untouched.
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

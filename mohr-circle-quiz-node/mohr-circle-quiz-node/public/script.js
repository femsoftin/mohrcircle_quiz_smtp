function submitQuiz() {
  const emailInput = document.getElementById('userEmail');
  const email = (emailInput.value || '').trim();
  if (!email) {
    alert('Please enter your email before submitting.');
    emailInput.focus();
    return;
  }

  const questions = document.querySelectorAll('.question');
  let score = 0;
  const answers = [];

  questions.forEach((q, i) => {
    const correct = q.dataset.answer;
    const selectedInput = q.querySelector('input[type="radio"]:checked');
    const selected = selectedInput ? selectedInput.value : null;

    // Clear previous highlights
    q.querySelectorAll('label').forEach(l => l.classList.remove('correct', 'incorrect'));

    if (selected) {
      if (selected === correct) {
        score++;
        selectedInput.parentElement.classList.add('correct');
      } else {
        selectedInput.parentElement.classList.add('incorrect');
        // also show the correct one
        const labels = Array.from(q.querySelectorAll('label'));
        const correctLabel = labels.find(l => l.querySelector('input').value === correct);
        if (correctLabel) correctLabel.classList.add('correct');
      }
    } else {
      // highlight correct even if unanswered
      const labels = Array.from(q.querySelectorAll('label'));
      const correctLabel = labels.find(l => l.querySelector('input').value === correct);
      if (correctLabel) correctLabel.classList.add('correct');
    }

    answers.push({ q: i + 1, selected, correct });
  });

  const resultDiv = document.getElementById('result');
  resultDiv.style.display = 'block';
  resultDiv.textContent = `Your Score: ${score} / ${questions.length}`;

  // Send to backend
  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, score, total: questions.length, answers })
  })
  .then(r => r.json())
  .then(data => {
    if (data.success) {
      alert('Results emailed to the instructor.');
    } else {
      alert('Email failed: ' + (data.message || 'unknown error'));
    }
  })
  .catch(err => alert('Network error while sending email.'));
}
